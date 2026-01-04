from __future__ import annotations

import json
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

from PySide6.QtCore import QItemSelection, QModelIndex, Qt, QSortFilterProxyModel
from PySide6.QtGui import QAction, QKeySequence
from PySide6.QtWidgets import (
    QApplication,
    QHBoxLayout,
    QHeaderView,
    QInputDialog,
    QPushButton,
    QLineEdit,
    QMainWindow,
    QMessageBox,
    QSplitter,
    QStatusBar,
    QToolBar,
    QToolButton,
    QMenu,
    QTreeWidget,
    QTreeWidgetItem,
    QVBoxLayout,
    QWidget,
)
from PySide6.QtGui import QUndoStack
from PySide6.QtWidgets import QTableView as QtTableView  # alias for custom subclass

from ..models.attribute_model import AttributeTableModel
from ..models.schema_store import DEFAULT_SUBGROUP, DEFAULT_TAB, SchemaStore
from ..ops import bulk_ops
from ..ui.dialogs import show_validation_report
from ..ui.inspector import Inspector
from ..validation.rules import validate_schema


ROLE_KIND = Qt.UserRole + 1
ROLE_VALUE = Qt.UserRole + 2
ROLE_GROUP = Qt.UserRole + 3
ROLE_SUBGROUP = Qt.UserRole + 4
ROLE_ATTR = Qt.UserRole + 5


class NavigationTree(QTreeWidget):
    """Navigation tree with drag-and-drop support to move attributes."""

    def __init__(self, move_callback, parent=None) -> None:
        super().__init__(parent)
        self.move_callback = move_callback
        self.setHeaderHidden(True)
        self.setSelectionMode(QTreeWidget.ExtendedSelection)
        self.setDragEnabled(True)
        self.setAcceptDrops(True)
        self.setDropIndicatorShown(True)
        self.setDragDropMode(QTreeWidget.InternalMove)

    def mimeData(self, items):
        from PySide6.QtCore import QMimeData

        md = QMimeData()
        parts: List[str] = []
        for item in items:
            kind = item.data(0, ROLE_KIND)
            if kind == "attribute":
                attr_key = item.data(0, ROLE_ATTR)
                if attr_key:
                    parts.append(f"attr:{attr_key}")
            elif kind == "group":
                gid = item.data(0, ROLE_GROUP)
                if gid:
                    parts.append(f"group:{gid}")
            elif kind == "subgroup":
                gid = item.data(0, ROLE_GROUP)
                sg = item.data(0, ROLE_SUBGROUP)
                if gid and sg:
                    parts.append(f"subgroup:{gid}|{sg}")
        md.setText("|".join(parts))
        return md

    def dragEnterEvent(self, event):
        event.acceptProposedAction()

    def dragMoveEvent(self, event):
        event.acceptProposedAction()

    def dropEvent(self, event):
        pos = event.pos()
        target_item = self.itemAt(pos)
        if not target_item:
            return
        target_kind = target_item.data(0, ROLE_KIND)
        text = event.mimeData().text()
        if not text:
            return
        parts = [p for p in text.split("|") if p]
        payloads = []
        for p in parts:
            if p.startswith("attr:"):
                payloads.append(("attr", p.split(":", 1)[1]))
            elif p.startswith("group:"):
                payloads.append(("group", p.split(":", 1)[1]))
            elif p.startswith("subgroup:"):
                rest = p.split(":", 1)[1]
                if "|" in rest:
                    gid, sg = rest.split("|", 1)
                    payloads.append(("subgroup", (gid, sg)))
        if not payloads:
            return

        # Only accept homogeneous drags
        kinds = {k for k, _ in payloads}
        if len(kinds) > 1:
            return
        kind = payloads[0][0]

        if kind == "attr":
            attr_keys = [v for _, v in payloads]
            # Reorder inside same group/subgroup if dropping on attribute.
            if target_kind == "attribute":
                group = target_item.data(0, ROLE_GROUP)
                subgroup = target_item.data(0, ROLE_SUBGROUP) or ""
                target_key = target_item.data(0, ROLE_ATTR)
                if not target_key:
                    return
                drop_pos = self.dropIndicatorPosition()
                self.move_callback(
                    attr_keys,
                    group=group,
                    subgroup=subgroup,
                    tab=None,
                    mode="reorder",
                    target_key=target_key,
                    drop_pos=drop_pos,
                )
                event.acceptProposedAction()
                return

            if target_kind not in {"tab", "group", "subgroup"}:
                return
            group = target_item.data(0, ROLE_GROUP)
            subgroup = target_item.data(0, ROLE_SUBGROUP)
            tab = target_item.data(0, ROLE_VALUE) if target_kind == "tab" else None
            self.move_callback(attr_keys, group=group, subgroup=subgroup, tab=tab, mode="move")
            event.acceptProposedAction()
            return

        if kind == "group":
            gid = payloads[0][1]
            if target_kind == "tab":
                tab = target_item.data(0, ROLE_VALUE)
                self.move_callback([gid], group=None, subgroup=None, tab=tab, mode="move_group")
                event.acceptProposedAction()
                return
            if target_kind == "group":
                target_gid = target_item.data(0, ROLE_GROUP)
                self.move_callback([gid], group=target_gid, subgroup=None, tab=None, mode="reorder_group", drop_pos=self.dropIndicatorPosition())
                event.acceptProposedAction()
                return

        if kind == "subgroup":
            from_gid, sg = payloads[0][1]
            if target_kind == "group":
                to_gid = target_item.data(0, ROLE_GROUP)
                self.move_callback([sg], group=to_gid, subgroup=None, tab=None, mode="move_subgroup", source_group=from_gid)
                event.acceptProposedAction()
                return
            if target_kind == "subgroup":
                to_gid = target_item.data(0, ROLE_GROUP)
                target_sg = target_item.data(0, ROLE_SUBGROUP)
                self.move_callback(
                    [sg],
                    group=to_gid,
                    subgroup=target_sg,
                    tab=None,
                    mode="reorder_subgroup",
                    source_group=from_gid,
                    drop_pos=self.dropIndicatorPosition(),
                )
                event.acceptProposedAction()
                return


class AttributeFilterProxyModel(QSortFilterProxyModel):
    def __init__(self, store: SchemaStore) -> None:
        super().__init__()
        self.store = store
        self.tab_filter: Optional[str] = None
        self.group_filter: Optional[str] = None
        self.subgroup_filter: Optional[str] = None
        self.text_filter: str = ""

    def set_filters(self, tab: Optional[str], group: Optional[str], subgroup: Optional[str]) -> None:
        self.tab_filter = tab
        self.group_filter = group
        self.subgroup_filter = subgroup
        self.invalidateFilter()

    def set_text_filter(self, text: str) -> None:
        self.text_filter = text.lower().strip()
        self.invalidateFilter()

    def filterAcceptsRow(self, source_row: int, source_parent: QModelIndex) -> bool:
        model: AttributeTableModel = self.sourceModel()  # type: ignore
        attr_key = model.attribute_key_at(source_row)
        if not attr_key:
            return False
        attr = self.store.attributes().get(attr_key, {})
        group_id = attr.get("group", "")
        subgroup = attr.get("subgroup") or ""
        tab = self.store.groups().get(group_id, {}).get("tab") or DEFAULT_TAB

        if self.tab_filter and tab != self.tab_filter:
            return False
        if self.group_filter and group_id != self.group_filter:
            return False
        if self.subgroup_filter is not None:
            desired = self.subgroup_filter or ""
            if subgroup != desired:
                return False
        if self.text_filter:
            haystack = " ".join(
                str(attr.get(field, "")) for field in ["label", "control", "cssVar", "cssProperty"]
            )
            haystack = f"{attr_key} {haystack}".lower()
            if self.text_filter not in haystack:
                return False
        return True

class ReorderableTableView(QtTableView):
    """Table view that supports drag-to-reorder rows within the same group/subgroup."""

    def __init__(self, parent, reorder_callback=None):
        super().__init__(parent)
        self.reorder_callback = reorder_callback
        self.setDragEnabled(True)
        self.setAcceptDrops(True)
        self.setDropIndicatorShown(True)
        self.setDragDropMode(QtTableView.InternalMove)
        self.setDefaultDropAction(Qt.MoveAction)
        self.setDragDropOverwriteMode(False)

    def dropEvent(self, event):
        if self.reorder_callback is None:
            return super().dropEvent(event)
        target_index = self.indexAt(event.position().toPoint())
        if not target_index.isValid():
            return super().dropEvent(event)
        drop_pos = self.dropIndicatorPosition()
        self.reorder_callback(target_index, drop_pos)
        event.acceptProposedAction()


class MainWindow(QMainWindow):
    def __init__(self, store: SchemaStore) -> None:
        super().__init__()
        self.store = store
        self.undo_stack = QUndoStack(self)
        self.setWindowTitle("Schema IDE")
        self.resize(1400, 900)

        # Models
        self.attr_model = AttributeTableModel(store, undo_stack=self.undo_stack)
        self.proxy_model = AttributeFilterProxyModel(store)
        self.proxy_model.setSourceModel(self.attr_model)

        # Widgets
        self.tree_filter = QLineEdit()
        self.tree_filter.setPlaceholderText("Filter tabs/groups/attributes...")
        self.tree = NavigationTree(move_callback=self._handle_tree_drop)
        self.tree.itemSelectionChanged.connect(self._on_tree_selection)

        tree_layout = QVBoxLayout()
        tree_layout.addWidget(self.tree_filter)
        tree_layout.addWidget(self.tree)
        self.tree_filter.textChanged.connect(self._filter_tree)

        tree_container = QWidget()
        tree_container.setLayout(tree_layout)

        self.inspector = Inspector(store, self.undo_stack)

        splitter = QSplitter()
        splitter.addWidget(tree_container)
        splitter.addWidget(self.inspector)
        splitter.setSizes([350, 1050])

        central = QWidget()
        central_layout = QVBoxLayout()
        central_layout.setContentsMargins(0, 0, 0, 0)
        central_layout.addWidget(splitter)

        # Bottom action bar
        bottom_layout = QHBoxLayout()
        self.btn_move_up = QPushButton("Move Up")
        self.btn_move_down = QPushButton("Move Down")
        self.btn_move_to = QPushButton("Move to...")
        self.btn_delete = QPushButton("Delete")
        bottom_layout.addWidget(self.btn_move_up)
        bottom_layout.addWidget(self.btn_move_down)
        bottom_layout.addWidget(self.btn_move_to)
        bottom_layout.addWidget(self.btn_delete)
        bottom_layout.addStretch(1)
        central_layout.addLayout(bottom_layout)
        central.setLayout(central_layout)
        self.setCentralWidget(central)

        self.btn_move_up.clicked.connect(lambda: self._bottom_move("up"))
        self.btn_move_down.clicked.connect(lambda: self._bottom_move("down"))
        self.btn_move_to.clicked.connect(self._bottom_move_to)
        self.btn_delete.clicked.connect(self._bottom_delete)

        self.status_label = QStatusBar()
        self.setStatusBar(self.status_label)
        self._update_status("Ready")

        self._build_toolbar()
        self._refresh_tree()
        self._resort_table_to_order()
        self.store.changed.connect(self._on_store_changed)

    # --- UI builders ------------------------------------------------------
    def _build_toolbar(self) -> None:
        toolbar = QToolBar("Main")
        toolbar.setMovable(False)
        self.addToolBar(toolbar)

        open_action = QAction("Open...", self)
        open_action.setShortcut(QKeySequence.Open)
        open_action.triggered.connect(self.on_open)
        toolbar.addAction(open_action)

        save_action = QAction("Save", self)
        save_action.setShortcut(QKeySequence.Save)
        save_action.triggered.connect(self.on_save)
        toolbar.addAction(save_action)

        validate_action = QAction("Validate", self)
        validate_action.triggered.connect(self.on_validate)
        toolbar.addAction(validate_action)

        toolbar.addSeparator()
        undo_action = self.undo_stack.createUndoAction(self, "Undo")
        undo_action.setShortcut(QKeySequence.Undo)
        redo_action = self.undo_stack.createRedoAction(self, "Redo")
        redo_action.setShortcut(QKeySequence.Redo)
        toolbar.addAction(undo_action)
        toolbar.addAction(redo_action)

        toolbar.addSeparator()
        add_menu = QMenu(self)
        add_tab_action = add_menu.addAction("Add tab...")
        add_tab_action.triggered.connect(self._add_tab)
        add_group_action = add_menu.addAction("Add group...")
        add_group_action.triggered.connect(self._add_group)
        add_subgroup_action = add_menu.addAction("Add subgroup...")
        add_subgroup_action.triggered.connect(self._add_subgroup)
        add_attr_action = add_menu.addAction("Add attribute...")
        add_attr_action.triggered.connect(self._add_attribute)
        add_key_action = add_menu.addAction("Add key (attributes only)")
        add_key_action.triggered.connect(self._add_key_globally)
        add_button = QToolButton()
        add_button.setText("Add")
        add_button.setPopupMode(QToolButton.InstantPopup)
        add_button.setMenu(add_menu)
        toolbar.addWidget(add_button)

        set_menu = QMenu(self)
        for flag in ["responsive", "themeable", "outputsCSS", "visibleOnSidebar"]:
            on_action = set_menu.addAction(f"Set {flag} = true")
            on_action.triggered.connect(lambda checked=False, f=flag: self._bulk_flag(f, True))
            off_action = set_menu.addAction(f"Set {flag} = false")
            off_action.triggered.connect(lambda checked=False, f=flag: self._bulk_flag(f, False))
        set_button = QToolButton()
        set_button.setText("Set")
        set_button.setPopupMode(QToolButton.InstantPopup)
        set_button.setMenu(set_menu)
        toolbar.addWidget(set_button)

        toolbar.addSeparator()
        reorder_keys_action = QAction("Reorder Keys", self)
        reorder_keys_action.triggered.connect(self._reorder_keys)
        toolbar.addAction(reorder_keys_action)

        delete_menu = QMenu(self)
        del_group_action = delete_menu.addAction("Delete group...")
        del_group_action.triggered.connect(self._delete_group)
        del_subgroup_action = delete_menu.addAction("Delete subgroup...")
        del_subgroup_action.triggered.connect(self._delete_subgroup)
        del_keys_action = delete_menu.addAction("Delete keys globally...")
        del_keys_action.triggered.connect(self._delete_keys_globally)
        delete_button = QToolButton()
        delete_button.setText("Delete")
        delete_button.setPopupMode(QToolButton.InstantPopup)
        delete_button.setMenu(delete_menu)
        toolbar.addWidget(delete_button)

        toolbar.addSeparator()
        help_action = QAction("Help", self)
        help_action.triggered.connect(self._show_help)
        toolbar.addAction(help_action)

    # --- Tree handling ----------------------------------------------------
    def _refresh_tree(self) -> None:
        self.tree.clear()
        groups = self.store.groups()
        attrs = self.store.attributes()

        # Build tab_map from groups
        tab_map: Dict[str, Dict[str, List[str]]] = {}
        for gid, gdef in groups.items():
            tab = gdef.get("tab") or DEFAULT_TAB
            subgroups = {sg["name"] for sg in self.store.subgroup_entries(gid)}
            for ak, av in attrs.items():
                if av.get("group") == gid and av.get("subgroup"):
                    subgroups.add(av["subgroup"])
            # Preserve subgroup order using subgroup_entries
            ordered_subs = [sg["name"] for sg in self.store.subgroup_entries(gid) if sg["name"] in subgroups]
            tab_map.setdefault(tab, {})[gid] = ordered_subs

        # Ensure all tabs from schema.tabs are included, even if empty
        tabs_list = self.store.schema.get("tabs", []) or []
        for tab_obj in tabs_list:
            tab_name = tab_obj.get("name")
            if tab_name and tab_name not in tab_map:
                tab_map[tab_name] = {}

        # Preserve tab ordering using tabs list if present
        tab_order = {t.get("name"): t.get("order", idx+1) for idx, t in enumerate(tabs_list)}
        def tab_sort_key(item):
            name, _ = item
            return (tab_order.get(name, 10_000), name)

        for tab, groups_map in sorted(tab_map.items(), key=tab_sort_key):
            tab_item = QTreeWidgetItem([tab])
            tab_item.setData(0, ROLE_KIND, "tab")
            tab_item.setData(0, ROLE_VALUE, tab)
            tab_item.setData(0, ROLE_GROUP, None)
            tab_item.setData(0, ROLE_SUBGROUP, None)
            tab_item.setFlags(tab_item.flags() | Qt.ItemIsDragEnabled | Qt.ItemIsDropEnabled)
            self.tree.addTopLevelItem(tab_item)
            for gid, subgroups in sorted(
                groups_map.items(),
                key=lambda item: self.store.groups().get(item[0], {}).get("order", 10_000),
            ):
                gdef = groups.get(gid, {})
                group_item = QTreeWidgetItem([gdef.get("title", gid)])
                group_item.setData(0, ROLE_KIND, "group")
                group_item.setData(0, ROLE_VALUE, gid)
                group_item.setData(0, ROLE_GROUP, gid)
                group_item.setData(0, ROLE_SUBGROUP, None)
                group_item.setFlags(group_item.flags() | Qt.ItemIsDragEnabled | Qt.ItemIsDropEnabled)
                tab_item.addChild(group_item)

                if subgroups:
                    for sub in subgroups:
                        sub_item = QTreeWidgetItem([sub])
                        sub_item.setData(0, ROLE_KIND, "subgroup")
                        sub_item.setData(0, ROLE_VALUE, sub)
                        sub_item.setData(0, ROLE_GROUP, gid)
                        sub_item.setData(0, ROLE_SUBGROUP, sub)
                        sub_item.setFlags(sub_item.flags() | Qt.ItemIsDragEnabled | Qt.ItemIsDropEnabled)
                        group_item.addChild(sub_item)
                        self._add_attributes(sub_item, gid, sub)
                self._add_attributes(group_item, gid, None)
        self.tree.expandToDepth(1)
        self._filter_tree(self.tree_filter.text())

    def _add_attributes(self, parent: QTreeWidgetItem, group: str, subgroup: Optional[str]) -> None:
        attrs = []
        for key, attr in self.store.attributes().items():
            if attr.get("group") != group:
                continue
            sg = attr.get("subgroup") or ""
            target = subgroup or ""
            if sg != target:
                continue
            attrs.append((key, attr))
        # Sort by order field, then by key as tiebreaker
        for key, attr in sorted(attrs, key=lambda item: (item[1].get("order", 10_000), item[0])):
            label = attr.get("label", key)
            item = QTreeWidgetItem([f"{label} ({key})"])
            item.setData(0, ROLE_KIND, "attribute")
            item.setData(0, ROLE_ATTR, key)
            item.setData(0, ROLE_GROUP, group)
            item.setData(0, ROLE_SUBGROUP, subgroup or "")
            item.setFlags(item.flags() | Qt.ItemIsDragEnabled | Qt.ItemIsDropEnabled)
            parent.addChild(item)

    def _filter_tree(self, text: str) -> None:
        text = text.lower().strip()

        def visit(item: QTreeWidgetItem) -> bool:
            match = text in item.text(0).lower()
            for i in range(item.childCount()):
                child = item.child(i)
                if visit(child):
                    match = True
            item.setHidden(not match)
            return match

        for i in range(self.tree.topLevelItemCount()):
            visit(self.tree.topLevelItem(i))

    def _restore_tree_selection(self, kind: str, group: Optional[str] = None, subgroup: Optional[str] = None, attr: Optional[str] = None) -> None:
        """Find and select an item in the tree after refresh."""
        def find_item(parent: QTreeWidgetItem | None = None) -> QTreeWidgetItem | None:
            if parent is None:
                # Search top-level items
                for i in range(self.tree.topLevelItemCount()):
                    item = self.tree.topLevelItem(i)
                    result = find_item(item)
                    if result:
                        return result
                return None

            # Check if this item matches
            item_kind = parent.data(0, ROLE_KIND)
            if item_kind == kind:
                if kind == "tab":
                    if parent.data(0, ROLE_VALUE) == group:
                        return parent
                elif kind == "group":
                    if parent.data(0, ROLE_GROUP) == group:
                        return parent
                elif kind == "subgroup":
                    if parent.data(0, ROLE_GROUP) == group and parent.data(0, ROLE_SUBGROUP) == subgroup:
                        return parent
                elif kind == "attribute":
                    if parent.data(0, ROLE_ATTR) == attr:
                        return parent

            # Search children
            for i in range(parent.childCount()):
                result = find_item(parent.child(i))
                if result:
                    return result
            return None

        item = find_item()
        if item:
            self.tree.setCurrentItem(item)
            # Expand parents to make sure it's visible
            parent = item.parent()
            while parent:
                parent.setExpanded(True)
                parent = parent.parent()

    def _on_tree_selection(self) -> None:
        selected = self.tree.selectedItems()
        if not selected:
            self.proxy_model.set_filters(None, None, None)
            self.inspector.set_context("attr")
            return
        item = selected[0]
        kind = item.data(0, ROLE_KIND)
        if kind == "tab":
            tab = item.data(0, ROLE_VALUE)
            self.inspector.set_context("tab", tab=tab)
        elif kind == "group":
            group = item.data(0, ROLE_GROUP)
            self.inspector.set_context("group", group_id=group)
        elif kind == "subgroup":
            group = item.data(0, ROLE_GROUP)
            subgroup = item.data(0, ROLE_SUBGROUP) or ""
            self.inspector.set_context("subgroup", group_id=group, subgroup=subgroup)
        elif kind == "attribute":
            self._select_attribute_in_table(item.data(0, ROLE_ATTR))

    def _handle_tree_drop(
        self,
        attr_keys: List[str],
        group: str | None,
        subgroup: str | None,
        tab: str | None,
        mode: str = "move",
        target_key: str | None = None,
        drop_pos=None,
        source_group: str | None = None,
    ):
        # Reorder within same group/subgroup when dropping onto an attribute
        if mode == "reorder" and target_key:
            attrs = self.store.attributes()
            if not attr_keys:
                return
            base_group = attrs.get(attr_keys[0], {}).get("group")
            base_sub = attrs.get(attr_keys[0], {}).get("subgroup") or ""
            if any(
                attrs.get(k, {}).get("group") != base_group
                or (attrs.get(k, {}).get("subgroup") or "") != base_sub
                for k in attr_keys
            ):
                return
            current_keys = [
                k
                for k, v in attrs.items()
                if v.get("group") == base_group and (v.get("subgroup") or "") == base_sub
            ]
            current_keys.sort(key=lambda k: attrs[k].get("order", 10_000))
            if target_key not in current_keys:
                return
            for k in attr_keys:
                if k in current_keys:
                    current_keys.remove(k)
            from PySide6.QtWidgets import QAbstractItemView

            insert_at = current_keys.index(target_key)
            if drop_pos == QAbstractItemView.BelowItem:
                insert_at += 1
            for k in reversed(attr_keys):
                current_keys.insert(insert_at, k)
            bulk_ops.reorder_sequence(self.store, base_group, base_sub, current_keys, self.undo_stack)
            self.attr_model.refresh_all()
            self._refresh_tree()
            return

        # If drop on tab, choose first group under that tab if one exists, else create placeholder.
        if tab and not group and mode in {"move", "reorder"}:
            # Find a group in that tab; otherwise create placeholder group.
            for gid, gdef in self.store.groups().items():
                if (gdef.get("tab") or DEFAULT_TAB) == tab:
                    group = gid
                    break
            if not group:
                group = f"{tab}-group"
                self.store.ensure_group(group)
                self.store.groups()[group]["tab"] = tab
        if mode in {"move", "reorder"}:
            bulk_ops.bulk_move(self.store, attr_keys, group=group, subgroup=subgroup, stack=self.undo_stack)
            self._refresh_tree()
            self.attr_model.refresh_all()
            return
        if mode == "move_group":
            gid = attr_keys[0] if attr_keys else None
            if gid and tab:
                self.store.move_group_to_tab(gid, tab)
                # reorder groups in tab based on current tree order
                self._refresh_tree()
            return
        if mode == "reorder_group":
            gid = attr_keys[0] if attr_keys else None
            if not gid or not group:
                return
            target_gid = group
            # Build order of groups within target tab
            gtab = self.store.groups().get(gid, {}).get("tab") or DEFAULT_TAB
            groups = [
                g for g, gdef in self.store.groups().items() if (gdef.get("tab") or DEFAULT_TAB) == gtab
            ]
            groups.sort(key=lambda g: self.store.groups().get(g, {}).get("order", 10_000))
            from PySide6.QtWidgets import QAbstractItemView

            if gid in groups:
                groups.remove(gid)
            insert_at = groups.index(target_gid) if target_gid in groups else len(groups)
            if drop_pos == QAbstractItemView.BelowItem:
                insert_at += 1
            groups.insert(insert_at, gid)
            self.store.reorder_groups_in_tab(gtab, groups)
            self._refresh_tree()
            return
        if mode == "move_subgroup":
            sg = attr_keys[0] if attr_keys else None
            if sg and source_group and group:
                self.store.move_subgroup_to_group(sg, source_group, group)
                self._refresh_tree()
                self.attr_model.refresh_all()
            return
        if mode == "reorder_subgroup":
            sg = attr_keys[0] if attr_keys else None
            if not sg or not group or not source_group:
                return
            # must be same group to reorder; if different, treat as move+reorder
            if source_group != group:
                self.store.move_subgroup_to_group(sg, source_group, group)
            subs = list(self.store.groups().get(group, {}).get("subgroups", []) or [])
            from PySide6.QtWidgets import QAbstractItemView

            if sg in subs:
                subs.remove(sg)
            insert_at = subs.index(subgroup) if subgroup in subs else len(subs)
            if drop_pos == QAbstractItemView.BelowItem:
                insert_at += 1
            subs.insert(insert_at, sg)
            self.store.reorder_subgroups(group, subs)
            self._refresh_tree()
            self.attr_model.refresh_all()
            return

    # --- Table handling ---------------------------------------------------
    def _on_table_selection(self, selected: QItemSelection, _: QItemSelection) -> None:
        rows = {idx.row() for idx in self.table_view.selectionModel().selectedRows()}
        keys: List[str] = []
        for row in rows:
            src_index = self.proxy_model.mapToSource(self.proxy_model.index(row, 0))
            key = self.attr_model.attribute_key_at(src_index.row())
            if key:
                keys.append(key)
        if keys:
            self.inspector.set_selection(keys)
        else:
            self.inspector.set_context("attr")

    def _select_attribute_in_table(self, attr_key: str) -> None:
        # With no table, just set inspector selection
        self.inspector.set_selection([attr_key])

    # --- Bulk actions -----------------------------------------------------
    def _selected_attr_keys(self) -> List[str]:
        # Gather selected attribute keys from tree
        keys: List[str] = []
        for item in self.tree.selectedItems():
            if item.data(0, ROLE_KIND) == "attribute":
                k = item.data(0, ROLE_ATTR)
                if k:
                    keys.append(k)
        return keys

    def _handle_table_reorder(self, target_index: QModelIndex, drop_pos) -> None:
        # Ensure target index is mapped to source
        src_index = self.proxy_model.mapToSource(target_index)
        target_key = self.attr_model.attribute_key_at(src_index.row())
        if not target_key:
            return
        selected_keys = self._selected_attr_keys()
        if not selected_keys:
            return
        attrs = self.store.attributes()
        # Ensure all selected share group/subgroup with target
        tgt_attr = attrs.get(target_key, {})
        group = tgt_attr.get("group")
        subgroup = tgt_attr.get("subgroup") or ""
        for k in selected_keys:
            a = attrs.get(k, {})
            if a.get("group") != group or (a.get("subgroup") or "") != subgroup:
                return
        # Build current ordered list of keys in this group/subgroup based on current orders
        current_keys = [
            k
            for k, v in attrs.items()
            if v.get("group") == group and (v.get("subgroup") or "") == subgroup
        ]
        current_keys.sort(key=lambda k: attrs[k].get("order", 10_000))
        if target_key not in current_keys:
            return
        for k in selected_keys:
            if k in current_keys:
                current_keys.remove(k)
        insert_at = current_keys.index(target_key)
        from PySide6.QtWidgets import QAbstractItemView

        if drop_pos == QAbstractItemView.BelowItem:
            insert_at += 1
        for k in reversed(selected_keys):
            current_keys.insert(insert_at, k)
        bulk_ops.reorder_sequence(self.store, group, subgroup, current_keys, self.undo_stack)
        self.attr_model.refresh_all()
        self._refresh_tree()

    def _bulk_flag(self, field: str, value: bool) -> None:
        keys = self._selected_attr_keys()
        if not keys:
            QMessageBox.information(self, "No selection", "Select one or more attributes first.")
            return
        bulk_ops.bulk_set_field(self.store, keys, field, value, self.undo_stack, text=f"Set {field}")
        self.attr_model.dataChanged.emit(QModelIndex(), QModelIndex())
        self._refresh_tree()

    def _prompt_move_group(self) -> None:
        keys = self._selected_attr_keys()
        if not keys:
            QMessageBox.information(self, "No selection", "Select attributes to move.")
            return
        group, ok = QInputDialog.getText(self, "Move to group", "Group ID:")
        if not ok or not group:
            return
        subgroup, _ = QInputDialog.getText(self, "Move to subgroup (optional)", "Subgroup:")
        bulk_ops.bulk_move(self.store, keys, group=group, subgroup=subgroup or None, stack=self.undo_stack)
        self._refresh_tree()
        self.attr_model.refresh_all()

    def _normalize_current(self) -> None:
        group, subgroup = self._current_group_subgroup()
        if not group:
            QMessageBox.information(self, "No group", "Select a group or subgroup in the tree.")
            return
        bulk_ops.apply_command(self.undo_stack, bulk_ops.NormalizeOrderCommand(self.store, group, subgroup))
        self.attr_model.refresh_all()
        self._refresh_tree()

    def _sort_current(self, by: str) -> None:
        group, subgroup = self._current_group_subgroup()
        if not group:
            QMessageBox.information(self, "No group", "Select a group or subgroup in the tree.")
            return
        bulk_ops.sort_and_rewrite_orders(self.store, group, subgroup, by=by, stack=self.undo_stack)
        self.attr_model.refresh_all()
        self._refresh_tree()

    def _move_step(self, direction: int) -> None:
        keys = self._selected_attr_keys()
        if len(keys) != 1:
            QMessageBox.information(self, "Select one row", "Select a single attribute to move.")
            return
        key = keys[0]
        attr = self.store.attributes().get(key, {})
        group = attr.get("group")
        subgroup = attr.get("subgroup")
        if not group:
            QMessageBox.information(self, "Missing group", "Attribute has no group.")
            return
        bulk_ops.move_step(self.store, group, subgroup, key, direction, stack=self.undo_stack)
        self.attr_model.refresh_all()
        self._refresh_tree()

    def _add_tab(self) -> None:
        """Add a new tab to the schema."""
        from PySide6.QtWidgets import QInputDialog

        # Ask for tab name
        name, ok = QInputDialog.getText(self, "Add Tab", "Tab name (e.g., 'settings', 'appearance'):")
        if not ok or not name:
            return

        name = name.strip().lower()
        if not name:
            return

        # Check if tab already exists
        tabs = self.store.schema.get("tabs", [])
        for tab in tabs:
            if tab.get("name") == name:
                QMessageBox.warning(self, "Tab Exists", f"Tab '{name}' already exists.")
                return

        # Find max order
        max_order = 0
        for tab in tabs:
            order = tab.get("order", 0)
            if order > max_order:
                max_order = order

        # Create new tab
        new_tab = {
            "name": name,
            "order": max_order + 1,
            "groups": []
        }

        # Add to schema
        if "tabs" not in self.store.schema:
            self.store.schema["tabs"] = []
        self.store.schema["tabs"].append(new_tab)
        self.store.mark_dirty()
        self._refresh_tree()
        self._restore_tree_selection("tab", name)

    def _add_group(self) -> None:
        # Get available tabs from existing groups
        existing_tabs = set()
        for gdef in self.store.groups().values():
            existing_tabs.add(gdef.get("tab") or DEFAULT_TAB)
        existing_tabs.add("settings")
        existing_tabs.add("appearance")
        tab_list = sorted(existing_tabs)

        # Ask for tab first
        from PySide6.QtWidgets import QInputDialog
        tab, ok = QInputDialog.getItem(self, "Add Group - Select Tab", "Select tab for new group:", tab_list, 0, True)
        if not ok or not tab:
            return

        # Ask for group name (user-friendly title)
        name, ok = QInputDialog.getText(self, "Add Group - Group Name", "Group name (title):")
        if not ok or not name:
            return

        # Generate ID from name (lowercase, replace spaces with dashes)
        gid = name.lower().replace(" ", "-").replace("_", "-")

        # Create the group with auto-assigned order (last)
        self.store.create_group(gid, name, tab or DEFAULT_TAB)
        self.attr_model.refresh_all()
        self._refresh_tree()
        self._restore_tree_selection("group", gid)

    def _add_subgroup(self) -> None:
        group, _ = self._current_group_subgroup()

        # If no group selected, let user choose from available groups
        if not group:
            groups = list(self.store.groups().keys())
            if not groups:
                QMessageBox.information(self, "No Groups", "Create a group first before adding subgroups.")
                return
            group, ok = QInputDialog.getItem(self, "Add Subgroup - Select Group", "Select parent group:", groups, 0, False)
            if not ok or not group:
                return

        # Ask for subgroup name
        subgroup, ok = QInputDialog.getText(self, "Add Subgroup", f"Subgroup name for group '{group}':")
        if not ok or not subgroup:
            return

        # Add subgroup with auto-assigned order (last)
        self.store.ensure_subgroup(group, subgroup)
        self.attr_model.refresh_all()
        self._refresh_tree()
        self._restore_tree_selection("subgroup", group, subgroup)

    def _set_group_tab(self) -> None:
        group, _ = self._current_group_subgroup()
        if not group:
            QMessageBox.information(self, "Select group", "Select a group in the tree first.")
            return

        # Get available tabs
        tabs_list = self.store.schema.get("tabs", []) or []
        tab_names = [t.get("name") for t in tabs_list if t.get("name")]
        if not tab_names:
            tab_names = ["settings", "appearance"]

        # Get current tab
        current_tab = self.store.groups().get(group, {}).get("tab") or DEFAULT_TAB
        default_idx = tab_names.index(current_tab) if current_tab in tab_names else 0

        # Show dropdown
        tab, ok = QInputDialog.getItem(
            self, "Set Group Tab", f"Select tab for group '{group}':", tab_names, default_idx, False
        )
        if not ok or not tab:
            return

        self.store.set_group_tab(group, tab)
        self.attr_model.refresh_all()
        self._refresh_tree()
        self._restore_tree_selection("group", group)

    def _delete_group(self) -> None:
        group, _ = self._current_group_subgroup()
        if not group:
            QMessageBox.information(self, "Select group", "Select a group in the tree first.")
            return
        groups = [g for g in self.store.groups().keys() if g != group]
        dest_group = None
        if groups:
            dest_group, _ = QInputDialog.getItem(
                self, "Reassign attributes", "Move attributes to group (cancel to clear group field):", groups, 0, False
            )
        confirm = QMessageBox.question(
            self,
            "Delete group",
            f"Delete group '{group}'? Attributes will {'move to ' + dest_group if dest_group else 'retain group=\"\" and no subgroup'}.",
            QMessageBox.Yes | QMessageBox.No,
        )
        if confirm != QMessageBox.Yes:
            return
        self.store.remove_group(group, dest_group if dest_group else None)
        self.attr_model.refresh_all()
        self._refresh_tree()

    def _delete_subgroup(self) -> None:
        group, subgroup = self._current_group_subgroup()
        if not group or not subgroup:
            QMessageBox.information(self, "Select subgroup", "Select a subgroup in the tree first.")
            return
        dest_subgroup, _ = QInputDialog.getText(
            self,
            "Reassign subgroup",
            f"Move attributes in '{subgroup}' to another subgroup (leave blank to clear subgroup):",
            text="",
        )
        confirm = QMessageBox.question(
            self,
            "Delete subgroup",
            f"Delete subgroup '{subgroup}' from group '{group}'?",
            QMessageBox.Yes | QMessageBox.No,
        )
        if confirm != QMessageBox.Yes:
            return
        self.store.remove_subgroup(group, subgroup, dest_subgroup.strip() or None)
        self.attr_model.refresh_all()
        self._refresh_tree()
        self.inspector.set_context("subgroup", group_id=group, subgroup=None)

    def _move_subgroup_step(self, direction: int) -> None:
        group, subgroup = self._current_group_subgroup()
        if not group or not subgroup:
            QMessageBox.information(self, "Select subgroup", "Select a subgroup in the tree first.")
            return
        subs = self.store.subgroup_names(group)
        if subgroup not in subs:
            return
        idx = subs.index(subgroup)
        new_idx = max(0, min(len(subs) - 1, idx + direction))
        if new_idx == idx:
            return
        subs.pop(idx)
        subs.insert(new_idx, subgroup)
        self.store.reorder_subgroups(group, subs)
        self._refresh_tree()
        self._restore_tree_selection("subgroup", group, subgroup)
        self.inspector.set_context("subgroup", group_id=group, subgroup=subgroup)

    def _move_subgroup_to_group(self) -> None:
        group, subgroup = self._current_group_subgroup()
        if not group or not subgroup:
            QMessageBox.information(self, "Select subgroup", "Select a subgroup in the tree first.")
            return
        groups = [g for g in self.store.groups().keys() if g != group]
        if not groups:
            QMessageBox.information(self, "No destination", "No other groups available.")
            return
        to_group, ok = QInputDialog.getItem(self, "Move subgroup", "Destination group:", groups, 0, False)
        if not ok or not to_group:
            return
        self.store.move_subgroup_to_group(subgroup, group, to_group)
        # Optionally reorder to end
        subs = list(self.store.groups().get(to_group, {}).get("subgroups", []) or [])
        subs = [s for s in subs if s != subgroup] + [subgroup]
        self.store.reorder_subgroups(to_group, subs)
        self._refresh_tree()
        self.attr_model.refresh_all()

    def _current_selection(self):
        # Prefer table attribute selection, then tree
        keys = self._selected_attr_keys()
        if keys:
            attr = keys[0]
            a = self.store.attributes().get(attr, {})
            return ("attribute", a.get("group"), a.get("subgroup"), attr)
        selected = self.tree.selectedItems()
        if selected:
            item = selected[0]
            kind = item.data(0, ROLE_KIND)
            if kind == "tab":
                return ("tab", item.data(0, ROLE_VALUE), None, None)
            if kind == "group":
                return ("group", item.data(0, ROLE_GROUP), None, None)
            if kind == "subgroup":
                return ("subgroup", item.data(0, ROLE_GROUP), item.data(0, ROLE_SUBGROUP), None)
            if kind == "attribute":
                return ("attribute", item.data(0, ROLE_GROUP), item.data(0, ROLE_SUBGROUP), item.data(0, ROLE_ATTR))
        keys = self._selected_attr_keys()
        return (None, None, None, None)

    def _bottom_move(self, direction: str) -> None:
        kind, group, subgroup, attr = self._current_selection()
        if kind == "attribute" and attr:
            dir_int = -1 if direction == "up" else 1
            bulk_ops.move_step(self.store, group, subgroup, attr, dir_int, stack=self.undo_stack)
            self._refresh_tree()
            self._restore_tree_selection("attribute", group, subgroup, attr)
            return
        if kind == "group" and group:
            # reorder group within its tab
            gtab = self.store.groups().get(group, {}).get("tab") or DEFAULT_TAB
            groups = [
                g for g, gdef in self.store.groups().items() if (gdef.get("tab") or DEFAULT_TAB) == gtab
            ]
            groups.sort(key=lambda g: self.store.groups().get(g, {}).get("order", 10_000))
            if group not in groups:
                return
            idx = groups.index(group)
            new_idx = idx - 1 if direction == "up" else idx + 1
            new_idx = max(0, min(len(groups) - 1, new_idx))
            if new_idx == idx:
                return
            groups.pop(idx)
            groups.insert(new_idx, group)
            self.store.reorder_groups_in_tab(gtab, groups)
            self._refresh_tree()
            self._restore_tree_selection("group", group)
            return
        if kind == "subgroup" and group and subgroup:
            self._move_subgroup_step(-1 if direction == "up" else 1)
            return
        if kind == "tab":
            QMessageBox.information(self, "Move", "Tabs do not have an explicit order field in schema; reorder groups within tabs instead.")
            return
        QMessageBox.information(self, "Move", "Select an attribute, group, or subgroup to move.")

    def _bottom_delete(self) -> None:
        kind, group, subgroup, attr = self._current_selection()
        if kind == "attribute" and attr:
            confirm = QMessageBox.question(self, "Delete attribute", f"Delete attribute '{attr}'?", QMessageBox.Yes | QMessageBox.No)
            if confirm == QMessageBox.Yes:
                self.store.delete_attribute(attr)
                self.attr_model.refresh_all()
                self._refresh_tree()
            return
        if kind == "group" and group:
            self._delete_group()
            return
        if kind == "subgroup" and group and subgroup:
            self._delete_subgroup()
            return
        QMessageBox.information(self, "Delete", "Select an attribute, group, or subgroup to delete.")

    def _bottom_move_to(self) -> None:
        kind, group, subgroup, attr = self._current_selection()
        if kind == "attribute" and attr:
            # Choose destination group/subgroup
            groups = list(self.store.groups().keys())
            if not groups:
                return
            dest_group, ok = QInputDialog.getItem(self, "Move attribute", "Destination group:", groups, 0, False)
            if not ok or not dest_group:
                return
            dest_subgroup, _ = QInputDialog.getText(self, "Destination subgroup (optional)", "Subgroup:")
            bulk_ops.bulk_move(self.store, [attr], group=dest_group, subgroup=dest_subgroup or None, stack=self.undo_stack)
            self.attr_model.refresh_all()
            self._refresh_tree()
            self._resort_table_to_order()
            return
        if kind == "group" and group:
            tabs = {"settings", "appearance"}
            existing_tabs = set(g.get("tab") or DEFAULT_TAB for g in self.store.groups().values())
            tabs.update(existing_tabs)
            tab_list = sorted(tabs)
            dest_tab, ok = QInputDialog.getItem(self, "Move group", "Destination tab:", tab_list, 0, False)
            if not ok or not dest_tab:
                return
            self.store.move_group_to_tab(group, dest_tab)
            # reorder
            groups = [
                g for g, gdef in self.store.groups().items() if (gdef.get("tab") or DEFAULT_TAB) == dest_tab
            ]
            groups.sort(key=lambda g: self.store.groups().get(g, {}).get("order", 10_000))
            self.store.reorder_groups_in_tab(dest_tab, groups)
            self._refresh_tree()
            return
        if kind == "subgroup" and group and subgroup:
            groups = [g for g in self.store.groups().keys() if g != group]
            if not groups:
                return
            dest_group, ok = QInputDialog.getItem(self, "Move subgroup", "Destination group:", groups, 0, False)
            if not ok or not dest_group:
                return
            self.store.move_subgroup_to_group(subgroup, group, dest_group)
            subs = list(self.store.groups().get(dest_group, {}).get("subgroups", []) or [])
            subs = [s for s in subs if s != subgroup] + [subgroup]
            self.store.reorder_subgroups(dest_group, subs)
            self._refresh_tree()
            self.attr_model.refresh_all()
            return
        QMessageBox.information(self, "Move to", "Select an attribute, group, or subgroup to move.")

    def _resort_table_to_order(self) -> None:
        return

    def _delete_keys_globally(self) -> None:
        # Collect all keys across attributes
        all_keys = set()
        for attr in self.store.attributes().values():
            all_keys.update(attr.keys())
        all_keys = sorted(all_keys)
        if not all_keys:
            QMessageBox.information(self, "No keys", "No attribute keys found.")
            return
        # Multi-select dialog via QListWidget in a simple dialog
        from PySide6.QtWidgets import QDialog, QListWidget, QListWidgetItem, QPushButton, QDialogButtonBox, QVBoxLayout

        dlg = QDialog(self)
        dlg.setWindowTitle("Delete keys from all attributes")
        v = QVBoxLayout(dlg)
        lst = QListWidget()
        lst.setSelectionMode(QListWidget.MultiSelection)
        for k in all_keys:
            QListWidgetItem(k, lst)
        v.addWidget(lst)
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        v.addWidget(buttons)
        buttons.accepted.connect(dlg.accept)
        buttons.rejected.connect(dlg.reject)
        if dlg.exec() != QDialog.Accepted:
            return
        selected = [item.text() for item in lst.selectedItems()]
        if not selected:
            return
        confirm = QMessageBox.question(
            self,
            "Confirm delete",
            f"Delete keys {', '.join(selected)} from all attributes?",
            QMessageBox.Yes | QMessageBox.No,
        )
        if confirm != QMessageBox.Yes:
            return

        # Count how many attributes have these keys
        attrs = self.store.attributes()
        affected_count = 0
        for attr in attrs.values():
            for key in selected:
                if key in attr:
                    affected_count += 1
                    break

        self.store.delete_keys_from_attributes(selected)
        self.attr_model.refresh_all()
        self._refresh_tree()
        self.inspector.set_selection([])  # Refresh inspector

        QMessageBox.information(
            self,
            "Keys Deleted",
            f"Deleted {len(selected)} key(s) from {affected_count} attribute(s).",
        )

    def _add_key_globally(self) -> None:
        # Only for attribute selection
        keys = self._selected_attr_keys()
        if not keys:
            QMessageBox.information(self, "Add key", "Select at least one attribute first.")
            return
        key, ok = QInputDialog.getText(self, "Add key", "Key name:")
        if not ok or not key:
            return
        val_text, _ = QInputDialog.getText(self, "Value (JSON or plain)", "Value:")
        try:
            value = json.loads(val_text) if val_text else ""
        except Exception:
            value = val_text
        bulk_ops.bulk_set_field(self.store, keys, key, value, self.undo_stack, text=f"Add key {key}")
        self.attr_model.refresh_all()
        self._refresh_tree()

    def _show_help(self) -> None:
        from PySide6.QtWidgets import QDialog, QVBoxLayout, QComboBox, QTextEdit, QDialogButtonBox

        # Organize help content by category
        help_data = {
            "--- Schema Metadata ---": {
                "$schema": "JSON Schema metadata URL",
                "title": "Schema title/name",
                "version": "Schema version number",
                "description": "Schema description",
                "blockType": "Block type identifier",
                "blockName": "Block display name",
                "manualSyncRequired": "Documentation for manual CSS sync requirements (lists files/instructions)",
                "tabs": "Tab definitions organizing groups into tabs (settings, appearance, etc.)",
                "groups": "Panel definitions for sidebar UI (deprecated in favor of tabs format)",
                "attributes": "Attribute definitions (per-block controls)",
            },
            "--- Group Keys ---": {
                "title": "Panel heading/title shown in UI",
                "description": "Panel tooltip/description",
                "order": "Display ordering within tab (1, 2, 3...)",
                "initialOpen": "Default expand/collapse state (true/false)",
                "tab": "Tab placement (settings/appearance)",
                "subgroups": "Optional list of subgroup objects with 'name' and 'order' for nested sections",
            },
            "--- Attribute Keys (Basic) ---": {
                "type": "Data type: string, number, boolean, object, or array",
                "default": "Default value for the attribute",
                "label": "UI label shown to user",
                "description": "Help text/tooltip for the control",
                "group": "Which panel/group the control lives under",
                "subgroup": "Optional nested section inside the group",
                "order": "Position within the group/subgroup (1, 2, 3...)",
            },
            "--- Attribute Keys (UI Control) ---": {
                "control": "Which UI control to render (e.g., SliderWithInput, SelectControl, ColorControl)\nConsumed by: shared/src/components/ControlRenderer.js",
                "controlId": "Bundling key for multi-attribute controls (e.g., BorderPanel, PanelColorSettings)\nGroups related attributes together\nValidated in: build-tools/schema-compiler.js (~lines 1280, 1440)",
                "alignmentType": "Alignment mode: 'block' or 'text'\nPassed to: AlignmentControl in ControlRenderer.js",
                "renderControl": "Skip rendering because another grouped control covers it\nRespected in: GenericPanel.js (e.g., BorderPanel handles color/style sub-attrs)",
            },
            "--- Attribute Keys (Numeric/Options) ---": {
                "min": "Minimum value for numeric controls",
                "max": "Maximum value for numeric controls",
                "step": "Step increment for sliders",
                "units": "List of allowed units for UnitControl (e.g., ['px', 'em', '%'])\nUsed by: SliderWithInput, UnitControl",
                "unit": "Single fixed unit (alternative to 'units' list)",
                "options": "Select/dropdown choices (required for SelectControl)\nFormat: list of values or objects with value/label",
                "scaleType": "Slider scaling hint (e.g., 'linear', 'logarithmic')\nUsed in: SliderWithInput.js",
            },
            "--- Attribute Keys (Conditional Display) ---": {
                "showWhen": "Conditional visibility based on other attribute values\nFormat: {attributeKey: expectedValue}\nConsumed by: SchemaPanels.js, ToolsPanelWrapper.js",
                "disabledWhen": "Disables control when conditions match\nFormat: {attributeKey: expectedValue}\nConsumed by: SchemaPanels.js",
                "visibleOnSidebar": "Whether to show control in sidebar (true/false)\nFiltered in: SchemaPanels.js, GenericPanel.js",
            },
            "--- Attribute Keys (CSS Generation) ---": {
                "cssVar": "CSS variable name (without block prefix)\nUsed by: build-tools/css-generator.js to generate CSS variables",
                "cssProperty": "CSS property to emit when outputsCSS is true\nUsed by: build-tools/schema-compiler.js for CSS generation",
                "appliesTo": "Target element key(s) for CSS (e.g., 'header', 'panel')\nConsumed by: compiler and mapping logic",
                "outputsCSS": "Whether to auto-generate CSS for this attribute (true/false)\nDrives: schema-compiler.js CSS output",
                "state": "Pseudo-state bucket for generated CSS (hover, active, visited)\nAdds state-specific CSS variants",
                "transformValue": "Post-processing hint for compiler\nHandled in: compiler/CSS generator for special cases (e.g., paddingRectangle)",
            },
            "--- Attribute Keys (Advanced) ---": {
                "responsive": "Enables desktop/tablet/mobile device handling (true/false)\nDrives: device handling in controls (SpacingControl, SliderWithInput)\nAlso: inline-style generation in schema-compiler.js",
                "themeable": "Participates in theme/customization system (true/false)\nUsed in: control rendering and theme store code",
                "dependsOn": "Makes this attribute's cssProperty/cssVar depend on another attribute's value\nUsed by: compiler for conditional CSS property selection",
                "variants": "Switch cssProperty/var names based on another attribute's value\nUsed by: schema-compiler.js for variant handling",
                "needsMapping": "Marks element requiring manual rendering/validation\nUsed by: compiler to validate mappings\nValidated in: schema-compiler.js lines ~1288, 1580",
                "reason": "Free-form note for documentation purposes\nUsed by: schema tooling/inspector only\nNot referenced in runtime rendering",
            },
        }

        dialog = QDialog(self)
        dialog.setWindowTitle("Schema Key Reference")
        dialog.resize(700, 500)

        layout = QVBoxLayout(dialog)

        # Dropdown selector
        combo = QComboBox()
        combo.addItem("Select a key...")
        for category, keys in help_data.items():
            combo.addItem(category)
            for key in keys.keys():
                combo.addItem(f"  {key}")

        layout.addWidget(combo)

        # Description text area
        text_edit = QTextEdit()
        text_edit.setReadOnly(True)
        text_edit.setPlainText("Select a key from the dropdown above to see its description.")
        layout.addWidget(text_edit)

        # Close button
        buttons = QDialogButtonBox(QDialogButtonBox.Close)
        buttons.rejected.connect(dialog.reject)
        layout.addWidget(buttons)

        def on_selection_changed(index):
            selected = combo.currentText()
            if selected.startswith("---") or selected == "Select a key...":
                text_edit.setPlainText("")
                return

            # Remove leading spaces from key
            key = selected.strip()

            # Find the key in help_data
            for category, keys in help_data.items():
                if key in keys:
                    text_edit.setPlainText(f"Key: {key}\n\n{keys[key]}")
                    return

        combo.currentIndexChanged.connect(on_selection_changed)
        dialog.exec()

    def _reorder_keys(self) -> None:
        """Open dialog to reorder attribute keys globally."""
        from PySide6.QtWidgets import QDialog, QVBoxLayout, QHBoxLayout, QListWidget, QPushButton, QDialogButtonBox, QLabel

        # Collect all unique keys from attributes ONLY (not groups, tabs, etc.)
        all_keys = set()
        attrs = self.store.attributes()
        for attr in attrs.values():
            all_keys.update(attr.keys())

        # Start with current key order, then add any missing keys
        current_order = list(self.store.attribute_key_order or [])
        ordered_keys = [k for k in current_order if k in all_keys]
        # Add any new keys not in current order
        for key in sorted(all_keys):
            if key not in ordered_keys:
                ordered_keys.append(key)

        dialog = QDialog(self)
        dialog.setWindowTitle("Reorder Attribute Keys")
        dialog.resize(500, 600)

        layout = QVBoxLayout(dialog)
        layout.addWidget(QLabel("Reorder how keys appear in attributes when saved to JSON:"))

        # List widget
        list_widget = QListWidget()
        for key in ordered_keys:
            list_widget.addItem(key)
        layout.addWidget(list_widget)

        # Up/Down buttons
        btn_layout = QHBoxLayout()
        btn_up = QPushButton("▲ Move Up")
        btn_down = QPushButton("▼ Move Down")
        btn_auto = QPushButton("🔄 Auto Order")
        btn_layout.addWidget(btn_up)
        btn_layout.addWidget(btn_down)
        btn_layout.addWidget(btn_auto)
        layout.addLayout(btn_layout)

        def move_up():
            current_row = list_widget.currentRow()
            if current_row > 0:
                item = list_widget.takeItem(current_row)
                list_widget.insertItem(current_row - 1, item)
                list_widget.setCurrentRow(current_row - 1)

        def move_down():
            current_row = list_widget.currentRow()
            if current_row < list_widget.count() - 1:
                item = list_widget.takeItem(current_row)
                list_widget.insertItem(current_row + 1, item)
                list_widget.setCurrentRow(current_row + 1)

        def auto_order():
            # Preferred order for attribute keys
            preferred_order = [
                "order",
                "group",
                "subgroup",
                "label",
                "description",
                "themeable",
                "responsive",
                "showWhen",
                "control",
                "controlId",
                "type",
                "state",
                "outputsCSS",
                "cssVar",
                "cssProperty",
                "appliesTo",
                "options",
                "units",
                "scaleType",
                "default",
                "min",
                "max",
                "alignmentType",
                "visibleOnSidebar",
            ]

            # Get current keys from list
            current_keys = [list_widget.item(i).text() for i in range(list_widget.count())]

            # Sort: preferred order first, then remaining keys alphabetically
            ordered = []
            for key in preferred_order:
                if key in current_keys:
                    ordered.append(key)

            # Add remaining keys not in preferred order (alphabetically)
            remaining = sorted([k for k in current_keys if k not in preferred_order])
            ordered.extend(remaining)

            # Clear and repopulate list
            list_widget.clear()
            for key in ordered:
                list_widget.addItem(key)

        btn_up.clicked.connect(move_up)
        btn_down.clicked.connect(move_down)
        btn_auto.clicked.connect(auto_order)

        # Dialog buttons
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(dialog.accept)
        buttons.rejected.connect(dialog.reject)
        layout.addWidget(buttons)

        if dialog.exec() == QDialog.Accepted:
            # Get new order from list
            new_order = [list_widget.item(i).text() for i in range(list_widget.count())]
            self.store.set_attribute_key_order(new_order)
            QMessageBox.information(
                self,
                "Keys Reordered",
                f"Attribute key order updated. Save to apply changes to JSON file.",
            )

    def _dynamic_set(self) -> None:
        kind, group, subgroup, attr = self._current_selection()
        if kind == "group" and group:
            # Get available tabs
            tabs_list = self.store.schema.get("tabs", []) or []
            tab_names = [t.get("name") for t in tabs_list if t.get("name")]
            if not tab_names:
                tab_names = ["settings", "appearance"]

            # Get current tab
            current_tab = self.store.groups().get(group, {}).get("tab") or DEFAULT_TAB
            default_idx = tab_names.index(current_tab) if current_tab in tab_names else 0

            # Show dropdown
            tab, ok = QInputDialog.getItem(
                self, "Set Tab", f"Select tab for group '{group}':", tab_names, default_idx, False
            )
            if not ok or not tab:
                return

            self.store.move_group_to_tab(group, tab)
            groups = [
                g for g, gdef in self.store.groups().items() if (gdef.get("tab") or DEFAULT_TAB) == tab
            ]
            groups.sort(key=lambda g: self.store.groups().get(g, {}).get("order", 10_000))
            self.store.reorder_groups_in_tab(tab, groups)
            self._refresh_tree()
            self._restore_tree_selection("group", group)
            return
        if kind == "subgroup" and group and subgroup:
            to_group, ok = QInputDialog.getText(self, "Set group", f"Move subgroup '{subgroup}' to group:", text=group)
            if not ok or not to_group:
                return
            self.store.move_subgroup_to_group(subgroup, group, to_group)
            subs = list(self.store.groups().get(to_group, {}).get("subgroups", []) or [])
            subs = [s for s in subs if s != subgroup] + [subgroup]
            self.store.reorder_subgroups(to_group, subs)
            self._refresh_tree()
            self.attr_model.refresh_all()
            return
        if kind == "attribute" and attr:
            dest_group, ok = QInputDialog.getText(self, "Set group", "Group:")
            if not ok or not dest_group:
                return
            dest_subgroup, _ = QInputDialog.getText(self, "Set subgroup (optional)", "Subgroup:", text="")
            bulk_ops.bulk_move(self.store, [attr], group=dest_group, subgroup=dest_subgroup or None, stack=self.undo_stack)
            self._refresh_tree()
            return
        QMessageBox.information(self, "Set", "Select a group, subgroup, or attribute to set destination.")

    def _add_attribute(self) -> None:
        # Use current selection for defaults
        current_group, current_subgroup = self._current_group_subgroup()

        # Ask for attribute key
        key, ok = QInputDialog.getText(self, "Add Attribute - Key", "Attribute key (e.g., 'borderWidth'):")
        if not ok or not key:
            return

        # Ask for label
        label, _ = QInputDialog.getText(self, "Add Attribute - Label", "Label (user-facing name):", text=key)

        # Select group
        groups = list(self.store.groups().keys())
        if not groups:
            QMessageBox.information(self, "No Groups", "Create a group first before adding attributes.")
            return

        default_group_idx = groups.index(current_group) if current_group and current_group in groups else 0
        group_id, ok = QInputDialog.getItem(self, "Add Attribute - Select Group", "Select group:", groups, default_group_idx, False)
        if not ok or not group_id:
            return

        # Select subgroup (optional)
        subgroups = ["(none)"] + self.store.subgroup_names(group_id)
        default_sg_idx = 0
        if current_subgroup and current_subgroup in subgroups:
            default_sg_idx = subgroups.index(current_subgroup)
        subgroup_choice, _ = QInputDialog.getItem(self, "Add Attribute - Select Subgroup (Optional)", "Select subgroup:", subgroups, default_sg_idx, False)
        subgroup_id = None if subgroup_choice == "(none)" else subgroup_choice

        # Select type
        types = ["string", "number", "boolean", "object", "array"]
        attr_type, _ = QInputDialog.getItem(self, "Add Attribute - Type", "Select type:", types, 0, False)

        try:
            self.store.create_attribute(
                key=key.strip(),
                group=group_id,
                label=label or key,
                subgroup=subgroup_id,
                attr_type=attr_type or "string",
            )
            self.attr_model.refresh_all()
            self._refresh_tree()
            self._restore_tree_selection("attribute", group_id, subgroup_id or "", key)
        except Exception as exc:
            QMessageBox.warning(self, "Failed to add attribute", str(exc))

    def _current_group_subgroup(self) -> Tuple[Optional[str], Optional[str]]:
        selected = self.tree.selectedItems()
        if not selected:
            return None, None
        item = selected[0]
        kind = item.data(0, ROLE_KIND)
        if kind == "group":
            return item.data(0, ROLE_GROUP), None
        if kind == "subgroup":
            return item.data(0, ROLE_GROUP), item.data(0, ROLE_SUBGROUP)
        if kind == "attribute":
            return item.data(0, ROLE_GROUP), item.data(0, ROLE_SUBGROUP)
        return None, None

    # --- Validation / save ------------------------------------------------
    def on_open(self) -> None:
        """Open a new schema file."""
        # Check for unsaved changes
        if self.store.dirty:
            res = QMessageBox.question(
                self,
                "Unsaved Changes",
                "You have unsaved changes. Do you want to save before opening a new schema?",
                QMessageBox.Yes | QMessageBox.No | QMessageBox.Cancel,
            )
            if res == QMessageBox.Cancel:
                return
            if res == QMessageBox.Yes:
                self.on_save()
                # If save was blocked, don't continue
                if self.store.dirty:
                    return

        # Open file dialog
        from PySide6.QtWidgets import QFileDialog
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Open Schema File",
            str(self.store.path.parent),
            "JSON Files (*.json);;All Files (*)",
        )

        if not file_path:
            return

        try:
            # Load the new schema
            self.store.load(Path(file_path))
            # Clear undo stack
            self.undo_stack.clear()
            # Refresh all views
            self._refresh_tree()
            self.attr_model.refresh_all()
            self.inspector.set_context("attr")
            self._update_status(f"Opened {Path(file_path).name}")
        except Exception as exc:
            QMessageBox.critical(self, "Error Opening File", f"Failed to open schema:\n{exc}")

    def on_validate(self) -> None:
        self.store.normalize_orders_all()
        self.attr_model.refresh_all()
        issues = validate_schema(self.store.schema)
        show_validation_report(self, issues)
        self._update_status(f"{len(issues)} issue(s)")

    def on_save(self) -> None:
        self.store.normalize_orders_all()
        self.attr_model.refresh_all()
        issues = validate_schema(self.store.schema)
        errors = [i for i in issues if i.level == "error"]
        warnings = [i for i in issues if i.level == "warning"]
        if errors:
            show_validation_report(self, issues)
            self._update_status("Save blocked (errors)")
            return
        if warnings:
            joined = "\n".join(f"- {i.path}: {i.message}" for i in warnings)
            res = QMessageBox.question(
                self,
                "Warnings",
                f"Warnings found:\n{joined}\n\nSave anyway?",
                QMessageBox.Yes | QMessageBox.No,
            )
            if res != QMessageBox.Yes:
                return
        self.store.save()
        self._update_status("Saved")
        self._refresh_tree()
        self.attr_model.refresh_all()

    # --- Status updates ---------------------------------------------------
    def _update_status(self, text: str) -> None:
        dirty = "*" if self.store.dirty else ""
        self.status_label.showMessage(f"{text} - {self.store.path}{dirty}")
        filename = self.store.path.name if self.store.path else "Schema IDE"
        self.setWindowTitle(f"{filename}{dirty} - Schema IDE")

    def _on_store_changed(self) -> None:
        self._update_status("Changed")
        self.attr_model.refresh_all()
        self._refresh_tree()

    # --- Close handling ---------------------------------------------------
    def closeEvent(self, event) -> None:  # type: ignore
        if self.store.dirty:
            res = QMessageBox.question(
                self,
                "Unsaved changes",
                "You have unsaved changes. Save before closing?",
                QMessageBox.Yes | QMessageBox.No | QMessageBox.Cancel,
            )
            if res == QMessageBox.Cancel:
                event.ignore()
                return
            if res == QMessageBox.Yes:
                self.on_save()
        event.accept()


def run_app(path: Path, app: QApplication | None = None) -> None:
    owns_app = False
    if app is None:
        app = QApplication(sys.argv)
        owns_app = True
    store = SchemaStore(path)
    window = MainWindow(store)
    window.show()
    if owns_app:
        sys.exit(app.exec())
    else:
        app.exec()
