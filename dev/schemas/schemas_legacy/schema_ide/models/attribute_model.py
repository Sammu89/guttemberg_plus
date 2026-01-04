from __future__ import annotations

from typing import Any, Dict, List, Sequence

from PySide6.QtCore import QAbstractTableModel, QModelIndex, Qt

from ..ops import bulk_ops

from .schema_store import SchemaStore


COLUMNS: Sequence[Dict[str, Any]] = [
    {"id": "key", "label": "Key", "editable": False},
    {"id": "label", "label": "Label", "editable": True},
    {"id": "group", "label": "Group", "editable": True},
    {"id": "subgroup", "label": "Subgroup", "editable": True},
    {"id": "order", "label": "Order", "editable": True},
    {"id": "type", "label": "Type", "editable": True},
    {"id": "control", "label": "Control", "editable": True},
    {"id": "controlId", "label": "Control ID", "editable": True},
    {"id": "responsive", "label": "Responsive", "editable": True, "bool": True},
    {"id": "themeable", "label": "Themeable", "editable": True, "bool": True},
    {"id": "outputsCSS", "label": "Outputs CSS", "editable": True, "bool": True},
    {"id": "visibleOnSidebar", "label": "Sidebar", "editable": True, "bool": True},
    {"id": "cssVar", "label": "CSS Var", "editable": True},
    {"id": "cssProperty", "label": "CSS Property", "editable": True},
]


REMOVABLE_FIELDS = {"subgroup"}


class AttributeTableModel(QAbstractTableModel):
    """Table model for attribute definitions."""

    def __init__(self, store: SchemaStore, undo_stack=None) -> None:
        super().__init__()
        self.store = store
        self.undo_stack = undo_stack
        self.visible_keys: List[str] = list(self.store.attributes().keys())

    # --- Model boilerplate ------------------------------------------------
    def rowCount(self, parent: QModelIndex = QModelIndex()) -> int:
        if parent.isValid():
            return 0
        return len(self.visible_keys)

    def columnCount(self, parent: QModelIndex = QModelIndex()) -> int:
        return len(COLUMNS)

    def headerData(self, section: int, orientation: Qt.Orientation, role: int = Qt.DisplayRole):
        if orientation == Qt.Horizontal and role == Qt.DisplayRole:
            return COLUMNS[section]["label"]
        return super().headerData(section, orientation, role)

    # --- Data access ------------------------------------------------------
    def data(self, index: QModelIndex, role: int = Qt.DisplayRole):
        if not index.isValid():
            return None
        attr_key = self.visible_keys[index.row()]
        column = COLUMNS[index.column()]
        field = column["id"]
        attr = self.store.attributes().get(attr_key, {})

        if role == Qt.DisplayRole:
            if field == "key":
                return attr_key
            value = attr.get(field)
            if isinstance(value, bool):
                return "Y" if value else ""
            return value
        if role == Qt.EditRole:
            if field == "key":
                return attr_key
            return attr.get(field)
        if role == Qt.CheckStateRole and column.get("bool"):
            return Qt.Checked if attr.get(field) else Qt.Unchecked
        return None

    def flags(self, index: QModelIndex):
        if not index.isValid():
            return Qt.ItemIsEnabled
        column = COLUMNS[index.column()]
        flags = Qt.ItemIsSelectable | Qt.ItemIsEnabled
        if column.get("bool"):
            flags |= Qt.ItemIsUserCheckable | Qt.ItemIsEditable
        elif column["editable"]:
            flags |= Qt.ItemIsEditable
        return flags

    def setData(self, index: QModelIndex, value: Any, role: int = Qt.EditRole):
        if not index.isValid():
            return False
        column = COLUMNS[index.column()]
        if not column["editable"]:
            return False
        attr_key = self.visible_keys[index.row()]
        attr = self.store.attributes().get(attr_key)
        if attr is None:
            return False

        field = column["id"]
        updates = {}
        remove_keys: List[str] = []
        if column.get("bool"):
            updates[field] = role == Qt.CheckStateRole and value == Qt.Checked
        else:
            if field == "order":
                try:
                    updates[field] = int(value)
                except Exception:
                    updates[field] = value
            else:
                updates[field] = value
            if (value == "" or value is None) and field in REMOVABLE_FIELDS:
                updates = {}
                remove_keys.append(field)

        if self.undo_stack:
            bulk_ops.apply_command(
                self.undo_stack,
                bulk_ops.AttributeEditCommand(
                    self.store,
                    [attr_key],
                    updates=updates,
                    remove_keys=remove_keys,
                    text=f"Edit {field}",
                ),
            )
        else:
            if updates:
                attr.update(updates)
            for r in remove_keys:
                attr.pop(r, None)
            self.store.mark_dirty()
        self.dataChanged.emit(index, index, [Qt.DisplayRole, Qt.EditRole])
        return True

    # --- Updates ----------------------------------------------------------
    def set_visible_keys(self, keys: List[str]) -> None:
        self.beginResetModel()
        self.visible_keys = list(keys)
        self.endResetModel()

    def refresh_all(self) -> None:
        self.set_visible_keys(list(self.store.attributes().keys()))

    def attribute_key_at(self, row: int) -> str | None:
        if 0 <= row < len(self.visible_keys):
            return self.visible_keys[row]
        return None
