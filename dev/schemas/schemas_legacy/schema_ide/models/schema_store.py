from __future__ import annotations

import copy
import json
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

from PySide6.QtCore import QObject, Signal


# Default tab/subgroup handling for schemas that do not define them explicitly.
DEFAULT_TAB = "settings"
DEFAULT_SUBGROUP = ""

# Fixed ordering rules for serializing attributes and groups.
DEFAULT_ATTRIBUTE_KEY_ORDER = [
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
]

GROUP_KEY_ORDER = ["title", "description", "order", "initialOpen", "tab", "subgroups"]

TOP_LEVEL_ORDER = [
    "$schema",
    "title",
    "version",
    "description",
    "blockType",
    "blockName",
    "manualSyncRequired",
    "tabs",
    "attributes",
]


def _safe_int(value: Any, default: int = 10_000) -> int:
    try:
        return int(value)
    except Exception:
        return default


class SchemaStore(QObject):
    """Load, track, validate, and save schema JSON with stable ordering."""

    changed = Signal()
    path_changed = Signal(Path)

    def __init__(self, path: Path) -> None:
        super().__init__()
        self.path = Path(path)
        self.schema: Dict[str, Any] = {}
        self.original_top_order: List[str] = []
        self.dirty: bool = False
        self.attribute_key_order: List[str] = list(DEFAULT_ATTRIBUTE_KEY_ORDER)
        self.load(self.path)

    # --- Loading / saving -------------------------------------------------
    def load(self, path: Path) -> None:
        self.path = Path(path)
        with self.path.open("r", encoding="utf-8") as f:
            self.schema = json.load(f)
        self.original_top_order = list(self.schema.keys())
        self._apply_tabs_to_groups()
        self._normalize_subgroup_objects()
        self._rebuild_attribute_key_order()
        self.dirty = False
        self.path_changed.emit(self.path)
        self.changed.emit()

    def save(self) -> None:
        self._sync_groups_to_tabs()
        ordered = self._ordered_schema(self.schema)
        with self.path.open("w", encoding="utf-8") as f:
            json.dump(ordered, f, indent=2, ensure_ascii=False)
        self.dirty = False
        self.changed.emit()

    # --- Dirty tracking ---------------------------------------------------
    def mark_dirty(self) -> None:
        if not self.dirty:
            self.dirty = True
            self.changed.emit()

    # --- Access helpers ---------------------------------------------------
    def clone_schema(self) -> Dict[str, Any]:
        return copy.deepcopy(self.schema)

    def groups(self) -> Dict[str, Any]:
        # Build groups from tabs if present
        tabs = self.schema.get("tabs", [])
        groups: Dict[str, Any] = {}
        for tab in tabs:
            tname = tab.get("name") or DEFAULT_TAB
            for g in tab.get("groups", []):
                gid = g.get("id") or g.get("name")
                if not gid:
                    continue
                gcopy = {k: v for k, v in g.items() if k not in {"id", "subgroups"}}
                gcopy["tab"] = tname
                gcopy["subgroups"] = g.get("subgroups", [])
                groups[gid] = gcopy
        return groups

    def attributes(self) -> Dict[str, Any]:
        return self.schema.get("attributes", {})

    def ensure_group(self, group_id: str) -> Dict[str, Any]:
        tabs = self.schema.setdefault("tabs", [])
        # Find existing
        for tab in tabs:
            for g in tab.get("groups", []):
                if g.get("id") == group_id or g.get("name") == group_id:
                    return g
        # Create in default tab
        default_tab = None
        for tab in tabs:
            if (tab.get("name") or DEFAULT_TAB) == DEFAULT_TAB:
                default_tab = tab
                break
        if default_tab is None:
            default_tab = {"name": DEFAULT_TAB, "order": len(tabs) + 1, "groups": []}
            tabs.append(default_tab)
        new_group = {
            "id": group_id,
            "title": group_id,
            "order": len(default_tab.get("groups", [])) + 1,
            "initialOpen": False,
            "subgroups": [],
        }
        default_tab.setdefault("groups", []).append(new_group)
        self.mark_dirty()
        return new_group

    def create_group(self, group_id: str, title: str, tab: str) -> Dict[str, Any]:
        groups = self.schema.setdefault("groups", {})
        if group_id in groups:
            return groups[group_id]
        groups[group_id] = {
            "title": title or group_id,
            "order": len(groups) + 1,
            "initialOpen": False,
            "tab": tab or DEFAULT_TAB,
            "subgroups": [],
        }
        self.mark_dirty()
        return groups[group_id]

    def ensure_tab(self, group_id: str) -> str:
        group = self.ensure_group(group_id)
        tab = group.get("tab") or DEFAULT_TAB
        group["tab"] = tab
        return tab

    def ensure_subgroup(self, group_id: str, subgroup: str) -> None:
        group = self.ensure_group(group_id)
        subs = group.setdefault("subgroups", [])
        names = [sg["name"] if isinstance(sg, dict) else sg for sg in subs]
        if subgroup and subgroup not in names:
            subs.append({"name": subgroup, "order": len(subs) + 1})
            self.mark_dirty()

    def set_group_tab(self, group_id: str, tab: str) -> None:
        group = self.ensure_group(group_id)
        group["tab"] = tab or DEFAULT_TAB
        self._sync_groups_to_tabs()
        self.mark_dirty()

    def reorder_groups_in_tab(self, tab: str, ordered_group_ids: List[str]) -> None:
        tabs = self.schema.get("tabs", [])
        for t in tabs:
            if (t.get("name") or DEFAULT_TAB) == tab:
                groups = t.get("groups", [])
                gid_to_group = {g.get("id") or g.get("name"): g for g in groups}
                new_groups = []
                for gid in ordered_group_ids:
                    if gid in gid_to_group:
                        new_groups.append(gid_to_group[gid])
                # append any missing
                for gid, g in gid_to_group.items():
                    if gid not in ordered_group_ids:
                        new_groups.append(g)
                for idx, g in enumerate(new_groups, start=1):
                    g["order"] = idx
                t["groups"] = new_groups
                self.mark_dirty()
                return

    def reorder_subgroups(self, group_id: str, ordered: List[str]) -> None:
        group = self.ensure_group(group_id)
        current = self.subgroup_entries(group_id)
        by_name = {sg["name"]: sg for sg in current}
        new_list = []
        for idx, name in enumerate(ordered, start=1):
            if name in by_name:
                sg = by_name[name]
                sg["order"] = idx
                new_list.append(sg)
        group["subgroups"] = new_list
        self.mark_dirty()

    def move_group_to_tab(self, group_id: str, tab: str) -> None:
        group = self.ensure_group(group_id)
        group["tab"] = tab or DEFAULT_TAB
        self._sync_groups_to_tabs()
        self.mark_dirty()

    def move_subgroup_to_group(self, subgroup: str, from_group: str, to_group: str) -> None:
        if from_group == to_group:
            return
        from_def = self.ensure_group(from_group)
        to_def = self.ensure_group(to_group)
        # Remove from old subgroups list
        subs = from_def.get("subgroups", [])
        if isinstance(subs, list):
            from_def["subgroups"] = [sg for sg in subs if (sg.get("name") if isinstance(sg, dict) else sg) != subgroup]
        # Add to new group
        to_def.setdefault("subgroups", [])
        names = [sg["name"] if isinstance(sg, dict) else sg for sg in to_def["subgroups"]]
        if subgroup not in names:
            to_def["subgroups"].append({"name": subgroup, "order": len(names) + 1})
        # Move attributes
        for attr in self.attributes().values():
            if attr.get("group") == from_group and attr.get("subgroup") == subgroup:
                attr["group"] = to_group
                attr["subgroup"] = subgroup
        self.mark_dirty()

    def rename_subgroup(self, group_id: str, old: str, new: str) -> None:
        if not new:
            return
        group = self.ensure_group(group_id)
        entries = self.subgroup_entries(group_id)
        for sg in entries:
            if sg["name"] == old:
                sg["name"] = new
        group["subgroups"] = entries
        for attr in self.attributes().values():
            if attr.get("group") == group_id and attr.get("subgroup") == old:
                attr["subgroup"] = new
        self.mark_dirty()

    def delete_keys_from_attributes(self, keys: List[str], attr_filter=None) -> None:
        """Delete specified keys from all attributes (optionally filtered)."""
        attrs = self.attributes()
        for key, attr in attrs.items():
            if attr_filter and not attr_filter(key, attr):
                continue
            for k in keys:
                if k in attr:
                    attr.pop(k, None)
        self.mark_dirty()

    def add_key_to_attributes(self, key: str, value: Any, attr_filter=None) -> None:
        attrs = self.attributes()
        for ak, attr in attrs.items():
            if attr_filter and not attr_filter(ak, attr):
                continue
            attr[key] = value
        self.mark_dirty()

    def delete_attribute(self, key: str) -> None:
        attrs = self.attributes()
        if key in attrs:
            attrs.pop(key, None)
            self.mark_dirty()

    def remove_subgroup(self, group_id: str, subgroup: str, dest_subgroup: str | None = None) -> None:
        group = self.ensure_group(group_id)
        subs = group.get("subgroups", [])
        if isinstance(subs, list):
            group["subgroups"] = [sg for sg in subs if (sg.get("name") if isinstance(sg, dict) else sg) != subgroup]
        for attr in self.attributes().values():
            if attr.get("group") == group_id and attr.get("subgroup") == subgroup:
                if dest_subgroup:
                    self.ensure_subgroup(group_id, dest_subgroup)
                    attr["subgroup"] = dest_subgroup
                else:
                    attr.pop("subgroup", None)
        self.mark_dirty()

    def remove_group(self, group_id: str, dest_group: str | None = None) -> None:
        groups = self.groups()
        if group_id not in groups:
            return
        attrs = self.attributes()
        # Reassign attributes if needed
        for key, attr in list(attrs.items()):
            if attr.get("group") == group_id:
                if dest_group:
                    self.ensure_group(dest_group)
                    attr["group"] = dest_group
                    # If subgroup not present in dest, drop it
                    sg = attr.get("subgroup")
                    dest_subs = self.groups().get(dest_group, {}).get("subgroups", [])
                    if sg and (not isinstance(dest_subs, list) or sg not in dest_subs):
                        attr.pop("subgroup", None)
                else:
                    # Leave attributes but drop group reference to avoid deletion
                    attr["group"] = ""
                    attr.pop("subgroup", None)
        groups.pop(group_id, None)
        self.mark_dirty()

    def normalize_orders_all(self) -> None:
        """Normalize orders for groups (per tab) and attributes (per group/subgroup)."""
        changed = False
        # Tabs order
        tabs_val = self.schema.get("tabs")
        if isinstance(tabs_val, list):
            tabs_sorted = sorted(tabs_val, key=lambda t: _safe_int(t.get("order", 10_000)))
            for idx, t in enumerate(tabs_sorted, start=1):
                if t.get("order") != idx:
                    t["order"] = idx
                    changed = True
        groups = self.groups()
        tabs: Dict[str, List[Tuple[str, Dict[str, Any]]]] = {}
        for gid, gdef in groups.items():
            tab = gdef.get("tab") or DEFAULT_TAB
            tabs.setdefault(tab, []).append((gid, gdef))
        for tab, items in tabs.items():
            items.sort(key=lambda item: _safe_int(item[1].get("order", 10_000)))
            for idx, (gid, gdef) in enumerate(items, start=1):
                if gdef.get("order") != idx:
                    gdef["order"] = idx
                    changed = True

        attrs = self.attributes()
        buckets: Dict[Tuple[str, str], List[Tuple[str, Dict[str, Any]]]] = {}
        for key, attr in attrs.items():
            g = attr.get("group", "")
            sg = attr.get("subgroup") or ""
            buckets.setdefault((g, sg), []).append((key, attr))

        for (_, _), items in buckets.items():
            items.sort(key=lambda item: (_safe_int(item[1].get("order", 10_000)), item[0]))
            for idx, (key, attr) in enumerate(items, start=1):
                if attr.get("order") != idx:
                    attr["order"] = idx
                    changed = True

        # Normalize subgroups order
        for gid in groups.keys():
            subs = self.subgroup_entries(gid)
            for idx, sg in enumerate(subs, start=1):
                if sg.get("order") != idx:
                    sg["order"] = idx
                    changed = True
            groups[gid]["subgroups"] = subs
        if changed:
            self.mark_dirty()

    def ensure_group_orders(self) -> None:
        """Ensure every group has an order and is sequential per tab."""
        tabs = self.schema.get("tabs", [])
        for tab in tabs:
            groups = tab.get("groups", [])
            groups.sort(key=lambda g: _safe_int(g.get("order", 10_000)))
            for idx, g in enumerate(groups, start=1):
                g["order"] = idx
        self.mark_dirty()

    def _rebuild_attribute_key_order(self) -> None:
        """Recompute attribute key order from defaults + any extras in schema."""
        keys = list(DEFAULT_ATTRIBUTE_KEY_ORDER)
        attrs = self.schema.get("attributes", {})
        for attr in attrs.values():
            for k in attr.keys():
                if k not in keys:
                    keys.append(k)
        self.attribute_key_order = keys

    def set_attribute_key_order(self, keys: List[str]) -> None:
        # Keep unique and preserve order; append any missing known keys
        seen = set()
        ordered: List[str] = []
        for k in keys:
            if k and k not in seen:
                ordered.append(k)
                seen.add(k)
        for k in DEFAULT_ATTRIBUTE_KEY_ORDER:
            if k not in seen:
                ordered.append(k)
                seen.add(k)
        # Add any extra keys still missing
        for attr in self.attributes().values():
            for k in attr.keys():
                if k not in seen:
                    ordered.append(k)
                    seen.add(k)
        self.attribute_key_order = ordered
        self.mark_dirty()

    # --- Tabs / subgroups helpers ---------------------------------------
    def subgroup_entries(self, group_id: str) -> List[Dict[str, Any]]:
        group = self.groups().get(group_id, {})
        subs = group.get("subgroups", []) or []
        entries: List[Dict[str, Any]] = []
        for sg in subs:
            if isinstance(sg, dict):
                entries.append({"name": sg.get("name", ""), "order": _safe_int(sg.get("order", 10_000))})
            else:
                entries.append({"name": str(sg), "order": 10_000})
        entries.sort(key=lambda sg: (sg["order"], sg["name"]))
        return entries

    def subgroup_names(self, group_id: str) -> List[str]:
        return [sg["name"] for sg in self.subgroup_entries(group_id)]

    def _apply_tabs_to_groups(self) -> None:
        tabs = self.schema.get("tabs")
        if not isinstance(tabs, list):
            return
        groups = self.schema.setdefault("groups", {})
        for tab in tabs:
            tname = tab.get("name") or DEFAULT_TAB
            for g in tab.get("groups", []):
                gid = g.get("id")
                if not gid:
                    continue
                gcopy = {k: v for k, v in g.items() if k not in {"id", "subgroups"}}
                gcopy["tab"] = tname
                gcopy["subgroups"] = g.get("subgroups", [])
                groups[gid] = gcopy

    def _sync_groups_to_tabs(self) -> None:
        """Rebuild tabs[].groups[] structure from top-level groups dict."""
        tabs = self.schema.get("tabs")
        if not isinstance(tabs, list):
            return

        groups = self.schema.get("groups", {})
        if not isinstance(groups, dict):
            return

        # Clear groups arrays in all tabs
        for tab in tabs:
            tab["groups"] = []

        # Distribute groups into their tabs
        for gid, gdef in groups.items():
            tab_name = gdef.get("tab") or DEFAULT_TAB

            # Find the tab
            target_tab = None
            for tab in tabs:
                if tab.get("name") == tab_name:
                    target_tab = tab
                    break

            # If tab doesn't exist, create it
            if not target_tab:
                target_tab = {
                    "name": tab_name,
                    "order": len(tabs) + 1,
                    "groups": []
                }
                tabs.append(target_tab)

            # Build group object for tab
            group_obj = {k: v for k, v in gdef.items() if k != "tab"}
            group_obj["id"] = gid
            target_tab["groups"].append(group_obj)

    def _normalize_subgroup_objects(self) -> None:
        groups = self.groups()
        for gid, gdef in groups.items():
            subs = gdef.get("subgroups", [])
            if subs and isinstance(subs, list) and isinstance(subs[0], dict):
                # ensure order values
                for idx, sg in enumerate(subs, start=1):
                    sg.setdefault("order", idx)
            elif isinstance(subs, list):
                gdef["subgroups"] = [{"name": name, "order": idx} for idx, name in enumerate(subs, start=1)]
            else:
                gdef["subgroups"] = []

    def create_attribute(
        self,
        key: str,
        group: str,
        label: str = "",
        subgroup: str | None = None,
        attr_type: str = "string",
        order: int | None = None,
    ) -> Dict[str, Any]:
        attrs = self.schema.setdefault("attributes", {})
        if key in attrs:
            return attrs[key]
        self.ensure_group(group)
        if subgroup:
            self.ensure_subgroup(group, subgroup)

        # Determine default order within group/subgroup
        if order is None:
            relevant = [
                v
                for v in attrs.values()
                if v.get("group") == group and (v.get("subgroup") or "") == (subgroup or "")
            ]
            max_order = max((v.get("order", 0) for v in relevant), default=0)
            order = int(max_order) + 1 if isinstance(max_order, int) else len(relevant) + 1

        attrs[key] = {
            "type": attr_type,
            "default": "",
            "label": label or key,
            "group": group,
            "order": order,
        }
        if subgroup:
            attrs[key]["subgroup"] = subgroup
        self.mark_dirty()
        return attrs[key]

    # --- Attribute mutations ----------------------------------------------
    def set_attribute_values(
        self, attr_keys: Iterable[str], updates: Dict[str, Any], remove_keys: Iterable[str] = ()
    ) -> None:
        attrs = self.attributes()
        for key in attr_keys:
            if key not in attrs:
                continue
            attrs[key].update(updates)
            for r in remove_keys:
                attrs[key].pop(r, None)
        self.mark_dirty()

    def move_attributes(
        self, attr_keys: Iterable[str], group: str, subgroup: str | None = None
    ) -> None:
        self.ensure_group(group)
        if subgroup:
            self.ensure_subgroup(group, subgroup)
        updates = {"group": group}
        if subgroup:
            updates["subgroup"] = subgroup
        else:
            updates.pop("subgroup", None)
        self.set_attribute_values(attr_keys, updates, remove_keys=[] if subgroup else ["subgroup"])

    def normalize_orders(self, group_id: str, subgroup: str | None = None) -> None:
        attrs = self.attributes()
        filtered = []
        for k, v in attrs.items():
            if v.get("group") != group_id:
                continue
            sg = v.get("subgroup")
            target = subgroup or DEFAULT_SUBGROUP
            normalized = sg or DEFAULT_SUBGROUP
            if normalized == target:
                filtered.append((k, v))
        filtered.sort(key=lambda item: _safe_int(item[1].get("order", 10_000)))
        for idx, (k, v) in enumerate(filtered, start=1):
            v["order"] = idx
        self.mark_dirty()

    # --- Ordering helpers -------------------------------------------------
    def _ordered_schema(self, schema: Dict[str, Any]) -> Dict[str, Any]:
        ordered: Dict[str, Any] = {}
        seen = set()
        for key in TOP_LEVEL_ORDER:
            if key in schema:
                ordered[key] = self._order_top_value(key, schema[key])
                seen.add(key)
        # Preserve original extra key ordering, then append any new ones.
        for key in self.original_top_order:
            if key not in seen and key in schema:
                ordered[key] = schema[key]
                seen.add(key)
        for key in schema.keys():
            if key not in seen:
                ordered[key] = schema[key]
        return ordered

    def _order_top_value(self, key: str, value: Any) -> Any:
        if key == "groups":
            return self._ordered_groups(value)
        if key == "tabs":
            return self._ordered_tabs(value)
        if key == "attributes":
            return self._ordered_attributes(value)
        return value

    def _ordered_tabs(self, tabs: Any) -> Any:
        if not isinstance(tabs, list):
            return tabs
        sorted_tabs = sorted(tabs, key=lambda t: _safe_int(t.get("order", 10_000)))
        out = []
        for t in sorted_tabs:
            tab_copy = dict(t)
            tab_copy["groups"] = []
            groups = t.get("groups", []) or []
            groups_sorted = sorted(groups, key=lambda g: _safe_int(g.get("order", 10_000)))
            for g in groups_sorted:
                gcopy = dict(g)
                subg = gcopy.get("subgroups", []) or []
                subg_sorted = sorted(subg, key=lambda sg: _safe_int(sg.get("order", 10_000)))
                gcopy["subgroups"] = subg_sorted
                tab_copy["groups"].append(gcopy)
            out.append(tab_copy)
        return out

    def _ordered_groups(self, groups: Dict[str, Any]) -> Dict[str, Any]:
        ordered: Dict[str, Any] = {}
        sorted_items = sorted(
            groups.items(), key=lambda item: (_safe_int(item[1].get("order", 10_000)), item[0])
        )
        for group_id, group_def in sorted_items:
            ordered[group_id] = self._order_group_def(group_def)
        return ordered

    def _order_group_def(self, group_def: Dict[str, Any]) -> Dict[str, Any]:
        ordered: Dict[str, Any] = {}
        seen = set()
        for key in GROUP_KEY_ORDER:
            if key in group_def:
                ordered[key] = group_def[key]
                seen.add(key)
        for key, value in group_def.items():
            if key not in seen:
                ordered[key] = value
        return ordered

    def _ordered_attributes(self, attrs: Dict[str, Any]) -> Dict[str, Any]:
        ordered: Dict[str, Any] = {}
        groups = self.groups()
        sortable: List[Tuple[str, Dict[str, Any]]] = list(attrs.items())

        def sort_key(item: Tuple[str, Dict[str, Any]]) -> Tuple[Any, ...]:
            key, attr = item
            group_id = attr.get("group", "")
            group_def = groups.get(group_id, {})
            tab = group_def.get("tab") or DEFAULT_TAB
            grp_order = _safe_int(group_def.get("order", 10_000))
            subgroup = attr.get("subgroup") or ""
            attr_order = _safe_int(attr.get("order", 10_000))
            return (tab, grp_order, group_id, subgroup, attr_order, key)

        for key, attr in sorted(sortable, key=sort_key):
            ordered[key] = self._order_attribute_def(attr)
        return ordered

    def _order_attribute_def(self, attr: Dict[str, Any]) -> Dict[str, Any]:
        ordered: Dict[str, Any] = {}
        seen = set()
        key_order = self.attribute_key_order or DEFAULT_ATTRIBUTE_KEY_ORDER
        for key in key_order:
            if key in attr:
                ordered[key] = attr[key]
                seen.add(key)
        for key, value in attr.items():
            if key not in seen:
                ordered[key] = value
        return ordered
