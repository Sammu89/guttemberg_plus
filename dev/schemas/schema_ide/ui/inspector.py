from __future__ import annotations

import json
from typing import Any, Dict, List

from PySide6.QtWidgets import (
    QMessageBox,
    QWidget,
    QVBoxLayout,
    QLabel,
    QGroupBox,
    QListWidget,
    QListWidgetItem,
    QPushButton,
    QHBoxLayout,
)

try:
    from pyqtgraph.parametertree import Parameter, ParameterTree
except Exception as exc:  # pragma: no cover - pyqtgraph is optional at runtime
    Parameter = None
    ParameterTree = None

from ..models.schema_store import SchemaStore, DEFAULT_SUBGROUP, DEFAULT_TAB
from ..ops import bulk_ops


# Fields that are optional and can be removed when set to empty/None.
REMOVABLE_FIELDS = {
    "subgroup",
    "control",
    "controlId",
    "cssVar",
    "cssProperty",
    "alignmentType",
    "state",
    "appliesTo",
    "scaleType",
    "options",
    "showWhen",
    "units",
    "unit",
    "min",
    "max",
    "default",
    "description",
}


KNOWN_FIELDS = {
    "type",
    "default",
    "label",
    "description",
    "group",
    "subgroup",
    "order",
    "control",
    "controlId",
    "min",
    "max",
    "units",
    "unit",
    "scaleType",
    "options",
    "showWhen",
    "alignmentType",
    "state",
    "appliesTo",
    "cssVar",
    "cssProperty",
    "responsive",
    "themeable",
    "outputsCSS",
    "visibleOnSidebar",
    # Generic/custom fields seen across schemas:
    "disabledWhen",
    "dependsOn",
    "needsMapping",
    "reason",
    "step",
    "transformValue",
    "variants",
    "unit",
}


class Inspector(QWidget):
    """Inspector panel built on pyqtgraph ParameterTree."""

    def __init__(self, store: SchemaStore, undo_stack, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.store = store
        self.undo_stack = undo_stack
        self.selected_keys: List[str] = []
        self.context = {"kind": "attr"}
        self._updating = False

        layout = QVBoxLayout(self)
        if ParameterTree is None:
            layout.addWidget(
                QLabel("pyqtgraph not available. Install pyqtgraph to enable inspector.")
            )
            self.tree = None
            self.root_param = None
            return

        self.tree = ParameterTree()
        self.tree.setHeaderLabels(["Field", "Value"])
        layout.addWidget(self.tree)
        self.root_param: Parameter | None = None

        # Add buttons layout
        btn_layout = QHBoxLayout()
        add_key_btn = QPushButton("➕ Add Key")
        add_key_btn.clicked.connect(self._add_key)
        delete_btn = QPushButton("🗑️ Delete Key")
        delete_btn.clicked.connect(self._delete_key)
        btn_layout.addWidget(add_key_btn)
        btn_layout.addWidget(delete_btn)
        layout.addLayout(btn_layout)

    # --- Selection handling ----------------------------------------------
    def set_selection(self, keys: List[str]) -> None:
        self.selected_keys = keys
        self.context = {"kind": "attr"}
        if self.tree is None:
            return
        self._build_form()

    def set_context(self, kind: str, group_id: str | None = None, subgroup: str | None = None, tab: str | None = None) -> None:
        """Set context for non-attribute selections (group, subgroup, tab)."""
        self.context = {"kind": kind, "group": group_id, "subgroup": subgroup, "tab": tab}
        self.selected_keys = []
        if self.tree is None:
            return
        self._build_form()

    # --- Form construction ------------------------------------------------
    def _build_form(self) -> None:
        if self.context.get("kind") != "attr":
            params = self._build_context_params()
        else:
            attrs = self.store.attributes()
            selected_attrs = [attrs[k] for k in self.selected_keys if k in attrs]
            if not selected_attrs:
                params = [dict(name="No selection", type="str", value="", readonly=True)]
            else:
                params = self._build_params_for_selection(selected_attrs)
        self.root_param = Parameter.create(name="Inspector", type="group", children=params)
        self.root_param.sigTreeStateChanged.connect(self._on_tree_changed)
        self.tree.setParameters(self.root_param, showTop=False)
        self._populate_field_order()

    def _build_context_params(self) -> List[Dict[str, Any]]:
        kind = self.context.get("kind")
        if kind == "group":
            gid = self.context.get("group") or ""
            gdef = self.store.groups().get(gid, {})
            return [
                dict(name="Group ID", type="str", value=gid, readonly=True),
                dict(name="Title", type="str", value=gdef.get("title", "")),
                dict(name="Description", type="str", value=gdef.get("description", "")),
                dict(name="Tab", type="str", value=gdef.get("tab", DEFAULT_TAB)),
                dict(name="Order", type="int", value=gdef.get("order", 0)),
                dict(name="Initial Open", type="bool", value=gdef.get("initialOpen", False)),
                dict(name="Subgroups (JSON list)", type="str", value=json.dumps(gdef.get("subgroups", []), indent=2)),
            ]
        if kind == "subgroup":
            gid = self.context.get("group") or ""
            sg = self.context.get("subgroup") or ""
            gdef = self.store.groups().get(gid, {})
            subs = self.store.subgroup_entries(gid)
            # Find the subgroup object
            sg_obj = None
            for s in subs:
                if s.get("name") == sg:
                    sg_obj = s
                    break
            order_val = sg_obj.get("order", 0) if sg_obj else 0
            return [
                dict(name="Parent Group", type="str", value=gid, readonly=True),
                dict(name="Subgroup Name", type="str", value=sg),
                dict(name="Order", type="int", value=order_val),
            ]
        if kind == "tab":
            tab = self.context.get("tab") or ""
            # Find tab object in schema
            tabs = self.store.schema.get("tabs", [])
            tab_obj = None
            for t in tabs:
                if t.get("name") == tab:
                    tab_obj = t
                    break
            if tab_obj:
                return [
                    dict(name="Tab Name", type="str", value=tab_obj.get("name", ""), readonly=True),
                    dict(name="Order", type="int", value=tab_obj.get("order", 0)),
                    dict(name="Description", type="str", value=tab_obj.get("description", "")),
                ]
            else:
                return [
                    dict(name="Tab Name", type="str", value=tab, readonly=True),
                ]
        return [dict(name="No selection", type="str", value="", readonly=True)]

    def _build_params_for_selection(self, selected_attrs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        single = len(selected_attrs) == 1
        merged = selected_attrs[0]

        def common_value(field: str, default: Any = "") -> Any:
            first = selected_attrs[0].get(field, default)
            for attr in selected_attrs[1:]:
                if attr.get(field, default) != first:
                    return "<mixed>"
            return first

        def json_value(field: str) -> str:
            val = common_value(field, None)
            if val == "<mixed>":
                return "<mixed>"
            if val is None:
                return ""
            try:
                return json.dumps(val, indent=2)
            except Exception:
                return str(val)

        def bool_value(field: str) -> bool:
            val = common_value(field, False)
            if val == "<mixed>":
                return False
            return bool(val)

        order_val = common_value("order", 0)
        if order_val == "<mixed>":
            order_val = 0

        params: List[Dict[str, Any]] = [
            dict(name="Key(s)", type="str", value=", ".join(self.selected_keys), readonly=True),
            dict(name="Label", type="str", value=common_value("label", "")),
            dict(name="Description", type="str", value=common_value("description", ""), siPrefix=True),
            dict(name="Type", type="str", value=common_value("type", "")),
            dict(name="Default (JSON)", type="str", value=json_value("default"), opts={"multiline": True}),
            dict(name="Group", type="str", value=common_value("group", "")),
            dict(name="Subgroup", type="str", value=common_value("subgroup", "")),
            dict(name="Order", type="int", value=order_val),
            dict(name="Control", type="str", value=common_value("control", "")),
            dict(name="Control ID", type="str", value=common_value("controlId", "")),
            dict(name="Min", type="str", value=str(common_value("min", ""))),
            dict(name="Max", type="str", value=str(common_value("max", ""))),
            dict(name="Units (list JSON)", type="str", value=json_value("units")),
            dict(name="Options (JSON)", type="str", value=json_value("options"), opts={"multiline": True}),
            dict(name="Show When (JSON)", type="str", value=json_value("showWhen"), opts={"multiline": True}),
            dict(name="CSS Var", type="str", value=common_value("cssVar", "")),
            dict(name="CSS Property", type="str", value=common_value("cssProperty", "")),
            dict(name="Applies To", type="str", value=common_value("appliesTo", "")),
            dict(name="State", type="str", value=common_value("state", "")),
            dict(name="Alignment Type", type="str", value=common_value("alignmentType", "")),
            dict(name="Scale Type", type="str", value=common_value("scaleType", "")),
            dict(name="Responsive", type="bool", value=bool_value("responsive")),
            dict(name="Themeable", type="bool", value=bool_value("themeable")),
            dict(name="Outputs CSS", type="bool", value=bool_value("outputsCSS")),
            dict(
                name="Visible on Sidebar",
                type="bool",
                value=bool_value("visibleOnSidebar"),
            ),
        ]

        if single:
            extras = {
                k: v for k, v in merged.items() if k not in KNOWN_FIELDS
            }
            params.append(
                dict(
                    name="Custom Fields (JSON)",
                    type="str",
                    value=json.dumps(extras, indent=2) if extras else "",
                    opts={"multiline": True},
                )
            )
        else:
            params.append(
                dict(
                    name="Custom Fields (multi-select)",
                    type="str",
                    value="Edit custom fields per-attribute (single select).",
                    readonly=True,
                )
            )

        return params

    # --- Change handling --------------------------------------------------
    def _on_tree_changed(self, param, changes):
        if self._updating:
            return
        for changed_param, change, data in changes:
            if change != "value":
                continue
            field_label = changed_param.name()
            field_id = self._label_to_field(field_label)
            if not field_id:
                continue
            self._apply_field_change(field_id, data)

    def _label_to_field(self, label: str) -> str | None:
        # Handle context-dependent fields
        if label == "Order":
            kind = self.context.get("kind")
            if kind == "group":
                return "group_order"
            elif kind == "subgroup":
                return "subgroup_order"
            elif kind == "tab":
                return "tab_order"
            else:
                return "order"  # attribute order

        mapping = {
            "Label": "label",
            "Description": "description",
            "Type": "type",
            "Default (JSON)": "default",
            "Group": "group",
            "Subgroup": "subgroup",
            "Control": "control",
            "Control ID": "controlId",
            "Min": "min",
            "Max": "max",
            "Units (list JSON)": "units",
            "Options (JSON)": "options",
            "Show When (JSON)": "showWhen",
            "CSS Var": "cssVar",
            "CSS Property": "cssProperty",
            "Applies To": "appliesTo",
            "State": "state",
            "Alignment Type": "alignmentType",
            "Scale Type": "scaleType",
            "Responsive": "responsive",
            "Themeable": "themeable",
            "Outputs CSS": "outputsCSS",
            "Visible on Sidebar": "visibleOnSidebar",
            "Custom Fields (JSON)": "custom",
            "Title": "group_title",
            "Tab": "group_tab",
            "Initial Open": "group_initialOpen",
            "Subgroups (JSON list)": "group_subgroups",
            "Subgroup Name": "subgroup_name",
        }
        return mapping.get(label)

    def _apply_field_change(self, field: str, value: Any) -> None:
        if not self.selected_keys:
            # Context mode (group/subgroup/tab)
            kind = self.context.get("kind")
            if kind == "group":
                gid = self.context.get("group")
                if not gid:
                    return
                gdef = self.store.groups().get(gid, {})
                if field == "group_title":
                    gdef["title"] = value
                elif field == "group_tab":
                    self.store.set_group_tab(gid, str(value))
                elif field == "group_order":
                    try:
                        gdef["order"] = int(value)
                    except Exception:
                        gdef["order"] = value
                elif field == "group_initialOpen":
                    gdef["initialOpen"] = bool(value)
                elif field == "group_subgroups":
                    try:
                        subs = json.loads(value) if value else []
                        if isinstance(subs, list):
                            gdef["subgroups"] = subs
                    except Exception as exc:
                        QMessageBox.warning(self, "Invalid subgroups", str(exc))
                        return
                self.store.mark_dirty()
                self._build_form()
                return
            if kind == "subgroup":
                gid = self.context.get("group")
                old_sg = self.context.get("subgroup")
                if not gid or not old_sg:
                    return
                if field == "subgroup_name":
                    new_name = str(value).strip()
                    if new_name and new_name != old_sg:
                        self.store.rename_subgroup(gid, old_sg, new_name)
                        self.context["subgroup"] = new_name
                        self.store.mark_dirty()
                        self._build_form()
                elif field == "subgroup_order":
                    # Update the order in the subgroup object
                    gdef = self.store.groups().get(gid, {})
                    subs = gdef.get("subgroups", [])
                    for sg_obj in subs:
                        if isinstance(sg_obj, dict) and sg_obj.get("name") == old_sg:
                            try:
                                sg_obj["order"] = int(value)
                            except Exception:
                                sg_obj["order"] = value
                            self.store.mark_dirty()
                            self._build_form()
                            break
                return
            if kind == "tab":
                tab_name = self.context.get("tab")
                if not tab_name:
                    return
                # Find and update tab object
                tabs = self.store.schema.get("tabs", [])
                for tab_obj in tabs:
                    if tab_obj.get("name") == tab_name:
                        if field == "tab_order":
                            try:
                                tab_obj["order"] = int(value)
                            except Exception:
                                tab_obj["order"] = value
                        elif field == "description":
                            tab_obj["description"] = str(value)
                        self.store.mark_dirty()
                        self._build_form()
                        break
                return
            return
        try:
            if field in {"default", "options", "showWhen", "units"}:
                parsed_value = self._parse_json_field(field, value)
                remove_keys = []
                if parsed_value is None and field in REMOVABLE_FIELDS:
                    remove_keys.append(field)
                    updates = {}
                else:
                    updates = {field: parsed_value}
                bulk_ops.bulk_set_fields(
                    self.store,
                    self.selected_keys,
                    updates=updates,
                    remove_keys=remove_keys,
                    stack=self.undo_stack,
                    text=f"Edit {field}",
                )
            elif field == "custom":
                self._apply_custom_fields(value)
            elif field in {"responsive", "themeable", "outputsCSS", "visibleOnSidebar"}:
                bulk_ops.bulk_set_field(
                    self.store,
                    self.selected_keys,
                    field,
                    bool(value),
                    stack=self.undo_stack,
                    text=f"Set {field}",
                )
            elif field == "order":
                try:
                    int_val = int(value)
                except Exception:
                    int_val = value
                bulk_ops.bulk_set_field(
                    self.store,
                    self.selected_keys,
                    "order",
                    int_val,
                    stack=self.undo_stack,
                    text="Set order",
                )
            elif field == "group":
                subgroup = None
                # Preserve subgroup if all selected share one
                current_subgroup = None
                attrs = self.store.attributes()
                if all(attrs[k].get("subgroup") == attrs[self.selected_keys[0]].get("subgroup") for k in self.selected_keys if k in attrs):
                    current_subgroup = attrs[self.selected_keys[0]].get("subgroup")
                group_value = str(value).strip()
                if not group_value:
                    QMessageBox.information(self, "Missing group", "Enter a group id.")
                    return
                bulk_ops.bulk_move(
                    self.store,
                    self.selected_keys,
                    group=group_value,
                    subgroup=current_subgroup,
                    stack=self.undo_stack,
                )
            elif field == "subgroup":
                group = None
                attrs = self.store.attributes()
                if self.selected_keys:
                    group = attrs[self.selected_keys[0]].get("group", "")
                subgroup_value = str(value).strip()
                bulk_ops.bulk_move(
                    self.store,
                    self.selected_keys,
                    group=group or DEFAULT_TAB,
                    subgroup=subgroup_value if subgroup_value else None,
                    stack=self.undo_stack,
                )
            else:
                updates = {field: value}
                remove_keys = []
                if (value == "" or value is None) and field in REMOVABLE_FIELDS:
                    updates = {}
                    remove_keys = [field]
                bulk_ops.bulk_set_fields(
                    self.store,
                    self.selected_keys,
                    updates=updates,
                    remove_keys=remove_keys,
                    stack=self.undo_stack,
                    text=f"Edit {field}",
                )
        except ValueError as exc:
            QMessageBox.warning(self, "Invalid value", str(exc))
            return
        self._build_form()

    def _parse_json_field(self, field: str, value: Any) -> Any:
        if isinstance(value, (dict, list)):
            return value
        if value in ("", None):
            return None
        if isinstance(value, str) and value.strip() == "<mixed>":
            raise ValueError("Cannot edit mixed values without choosing a concrete value.")
        try:
            return json.loads(value)
        except Exception as exc:
            raise ValueError(f"Invalid JSON for `{field}`: {exc}")

    def _apply_custom_fields(self, text_value: str) -> None:
        if len(self.selected_keys) != 1:
            return
        key = self.selected_keys[0]
        attrs = self.store.attributes()
        current = attrs.get(key, {})
        try:
            new_custom = json.loads(text_value) if text_value else {}
            if not isinstance(new_custom, dict):
                raise ValueError("Custom fields JSON must be an object")
        except Exception as exc:
            QMessageBox.warning(self, "Invalid custom fields", str(exc))
            return
        updates = {}
        remove_keys = []
        for k in list(current.keys()):
            if k not in KNOWN_FIELDS and k not in new_custom:
                remove_keys.append(k)
        for k, v in new_custom.items():
            updates[k] = v
        bulk_ops.bulk_set_fields(
            self.store,
            [key],
            updates=updates,
            remove_keys=remove_keys,
            stack=self.undo_stack,
            text="Edit custom fields",
        )

    # --- Field order editor ----------------------------------------------
    def _populate_field_order(self) -> None:
        return

    def _delete_key(self) -> None:
        """Delete a key from selected item (attribute, group, subgroup, or tab)."""
        kind = self.context.get("kind")

        # Handle attributes
        if kind == "attr" and self.selected_keys:
            attrs = self.store.attributes()
            all_keys = set()
            for attr_key in self.selected_keys:
                if attr_key in attrs:
                    all_keys.update(attrs[attr_key].keys())

            protected_keys = {"type", "group", "order"}
            deletable_keys = sorted(all_keys - protected_keys)

            if not deletable_keys:
                QMessageBox.information(self, "No Keys", "No deletable keys found.")
                return

            from PySide6.QtWidgets import QInputDialog
            key_to_delete, ok = QInputDialog.getItem(
                self, "Delete Key", "Select key to delete:", deletable_keys, 0, False
            )
            if not ok or not key_to_delete:
                return

            confirm = QMessageBox.question(
                self,
                "Confirm Delete",
                f"Delete key '{key_to_delete}' from {len(self.selected_keys)} attribute(s)?",
                QMessageBox.Yes | QMessageBox.No,
            )
            if confirm != QMessageBox.Yes:
                return

            bulk_ops.bulk_set_fields(
                self.store,
                self.selected_keys,
                updates={},
                remove_keys=[key_to_delete],
                stack=self.undo_stack,
                text=f"Delete key {key_to_delete}",
            )
            self._build_form()
            return

        # Handle group
        if kind == "group":
            gid = self.context.get("group")
            if not gid:
                return
            gdef = self.store.groups().get(gid, {})
            protected_keys = {"title", "order", "tab"}
            deletable_keys = sorted(set(gdef.keys()) - protected_keys)

            if not deletable_keys:
                QMessageBox.information(self, "No Keys", "No deletable keys found in this group.")
                return

            from PySide6.QtWidgets import QInputDialog
            key_to_delete, ok = QInputDialog.getItem(
                self, "Delete Key", "Select key to delete from group:", deletable_keys, 0, False
            )
            if not ok or not key_to_delete:
                return

            confirm = QMessageBox.question(
                self,
                "Confirm Delete",
                f"Delete key '{key_to_delete}' from group '{gid}'?",
                QMessageBox.Yes | QMessageBox.No,
            )
            if confirm != QMessageBox.Yes:
                return

            gdef.pop(key_to_delete, None)
            self.store.mark_dirty()
            self._build_form()
            return

        # Handle subgroup
        if kind == "subgroup":
            gid = self.context.get("group")
            sg = self.context.get("subgroup")
            if not gid or not sg:
                return

            gdef = self.store.groups().get(gid, {})
            subs = gdef.get("subgroups", [])
            sg_obj = None
            for s in subs:
                if isinstance(s, dict) and s.get("name") == sg:
                    sg_obj = s
                    break

            if not sg_obj:
                QMessageBox.information(self, "No Keys", "Subgroup object not found.")
                return

            protected_keys = {"name", "order"}
            deletable_keys = sorted(set(sg_obj.keys()) - protected_keys)

            if not deletable_keys:
                QMessageBox.information(self, "No Keys", "No deletable keys found in this subgroup.")
                return

            from PySide6.QtWidgets import QInputDialog
            key_to_delete, ok = QInputDialog.getItem(
                self, "Delete Key", "Select key to delete from subgroup:", deletable_keys, 0, False
            )
            if not ok or not key_to_delete:
                return

            confirm = QMessageBox.question(
                self,
                "Confirm Delete",
                f"Delete key '{key_to_delete}' from subgroup '{sg}'?",
                QMessageBox.Yes | QMessageBox.No,
            )
            if confirm != QMessageBox.Yes:
                return

            sg_obj.pop(key_to_delete, None)
            self.store.mark_dirty()
            self._build_form()
            return

        # Handle tab
        if kind == "tab":
            tab_name = self.context.get("tab")
            if not tab_name:
                return

            tabs = self.store.schema.get("tabs", [])
            tab_obj = None
            for t in tabs:
                if t.get("name") == tab_name:
                    tab_obj = t
                    break

            if not tab_obj:
                QMessageBox.information(self, "No Keys", "Tab object not found.")
                return

            protected_keys = {"name", "order", "groups"}
            deletable_keys = sorted(set(tab_obj.keys()) - protected_keys)

            if not deletable_keys:
                QMessageBox.information(self, "No Keys", "No deletable keys found in this tab.")
                return

            from PySide6.QtWidgets import QInputDialog
            key_to_delete, ok = QInputDialog.getItem(
                self, "Delete Key", "Select key to delete from tab:", deletable_keys, 0, False
            )
            if not ok or not key_to_delete:
                return

            confirm = QMessageBox.question(
                self,
                "Confirm Delete",
                f"Delete key '{key_to_delete}' from tab '{tab_name}'?",
                QMessageBox.Yes | QMessageBox.No,
            )
            if confirm != QMessageBox.Yes:
                return

            tab_obj.pop(key_to_delete, None)
            self.store.mark_dirty()
            self._build_form()
            return

        QMessageBox.information(self, "No Selection", "Select an attribute, group, subgroup, or tab first.")

    def _add_key(self) -> None:
        """Add a custom key to selected item (attribute, group, subgroup, or tab)."""
        from PySide6.QtWidgets import QDialog, QVBoxLayout, QCheckBox, QLineEdit, QDialogButtonBox, QScrollArea, QWidget
        from PySide6.QtCore import Qt

        kind = self.context.get("kind")

        # Define common keys based on context
        common_keys = {}
        if kind == "attr":
            common_keys = {
                "description": "",
                "default": "",
                "subgroup": "",
                "control": "",
                "controlId": "",
                "min": "",
                "max": "",
                "step": "",
                "units": "[]",
                "unit": "",
                "options": "[]",
                "scaleType": "",
                "cssVar": "",
                "cssProperty": "",
                "appliesTo": "",
                "state": "",
                "alignmentType": "",
                "showWhen": "{}",
                "disabledWhen": "{}",
                "responsive": False,
                "themeable": False,
                "outputsCSS": False,
                "visibleOnSidebar": True,
                "renderControl": False,
                "transformValue": "",
                "dependsOn": "",
                "variants": "{}",
                "needsMapping": False,
                "reason": "",
            }
        elif kind == "group":
            common_keys = {
                "description": "",
                "initialOpen": False,
                "icon": "",
            }
        elif kind == "subgroup":
            common_keys = {
                "description": "",
                "icon": "",
            }
        elif kind == "tab":
            common_keys = {
                "description": "",
                "icon": "",
            }

        # Create dialog
        dialog = QDialog(self)
        dialog.setWindowTitle("Add Key(s)")
        dialog.resize(450, 600)
        main_layout = QVBoxLayout(dialog)

        # Create scroll area for checkboxes
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        scroll_widget = QWidget()
        scroll_layout = QVBoxLayout(scroll_widget)

        scroll_layout.addWidget(QLabel("Select keys to add:"))

        # Create checkboxes for common keys
        checkboxes = {}
        for key, default_val in sorted(common_keys.items()):
            cb = QCheckBox(f"{key} (default: {json.dumps(default_val)})")
            checkboxes[key] = cb
            scroll_layout.addWidget(cb)

        scroll_layout.addStretch()
        scroll.setWidget(scroll_widget)
        main_layout.addWidget(scroll)

        # Custom key input (outside scroll area, always visible)
        main_layout.addWidget(QLabel("Or add custom key:"))
        custom_key_input = QLineEdit()
        custom_key_input.setPlaceholderText("Custom key name")
        main_layout.addWidget(custom_key_input)
        custom_value_input = QLineEdit()
        custom_value_input.setPlaceholderText("Custom value (JSON or plain text)")
        main_layout.addWidget(custom_value_input)

        # Buttons (outside scroll area, always visible)
        buttons = QDialogButtonBox(QDialogButtonBox.Ok | QDialogButtonBox.Cancel)
        buttons.accepted.connect(dialog.accept)
        buttons.rejected.connect(dialog.reject)
        main_layout.addWidget(buttons)

        if dialog.exec() != QDialog.Accepted:
            return

        # Collect selected keys and their values
        keys_to_add = {}

        # Add checked common keys
        for key, cb in checkboxes.items():
            if cb.isChecked():
                keys_to_add[key] = common_keys[key]

        # Add custom key if provided
        custom_key = custom_key_input.text().strip()
        if custom_key:
            custom_val_text = custom_value_input.text().strip()
            try:
                custom_val = json.loads(custom_val_text) if custom_val_text else ""
            except Exception:
                custom_val = custom_val_text
            keys_to_add[custom_key] = custom_val

        if not keys_to_add:
            QMessageBox.information(self, "No Keys", "No keys selected to add.")
            return

        # Apply keys based on context
        if kind == "attr" and self.selected_keys:
            for key_name, value in keys_to_add.items():
                bulk_ops.bulk_set_field(
                    self.store,
                    self.selected_keys,
                    key_name,
                    value,
                    stack=self.undo_stack,
                    text=f"Add key {key_name}",
                )
            self._build_form()
            return

        # Handle group
        if kind == "group":
            gid = self.context.get("group")
            if not gid:
                return
            gdef = self.store.groups().get(gid, {})
            for key_name, value in keys_to_add.items():
                gdef[key_name] = value
            self.store.mark_dirty()
            self._build_form()
            return

        # Handle subgroup
        if kind == "subgroup":
            gid = self.context.get("group")
            sg = self.context.get("subgroup")
            if not gid or not sg:
                return

            gdef = self.store.groups().get(gid, {})
            subs = gdef.get("subgroups", [])
            sg_obj = None
            for s in subs:
                if isinstance(s, dict) and s.get("name") == sg:
                    sg_obj = s
                    break

            if not sg_obj:
                QMessageBox.information(self, "Error", "Subgroup object not found.")
                return

            for key_name, value in keys_to_add.items():
                sg_obj[key_name] = value
            self.store.mark_dirty()
            self._build_form()
            return

        # Handle tab
        if kind == "tab":
            tab_name = self.context.get("tab")
            if not tab_name:
                return

            tabs = self.store.schema.get("tabs", [])
            tab_obj = None
            for t in tabs:
                if t.get("name") == tab_name:
                    tab_obj = t
                    break

            if not tab_obj:
                QMessageBox.information(self, "Error", "Tab object not found.")
                return

            for key_name, value in keys_to_add.items():
                tab_obj[key_name] = value
            self.store.mark_dirty()
            self._build_form()
            return

        QMessageBox.information(self, "No Selection", "Select an attribute, group, subgroup, or tab first.")
