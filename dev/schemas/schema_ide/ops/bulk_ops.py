from __future__ import annotations

import copy
from typing import Any, Dict, Iterable, List, Tuple

from PySide6.QtGui import QUndoCommand, QUndoStack

from ..models.schema_store import SchemaStore, _safe_int


class AttributeEditCommand(QUndoCommand):
    """Undoable edit for one or more attributes."""

    def __init__(
        self,
        store: SchemaStore,
        attr_keys: Iterable[str],
        updates: Dict[str, Any] | None = None,
        remove_keys: Iterable[str] = (),
        text: str = "Edit attributes",
    ) -> None:
        super().__init__(text)
        self.store = store
        self.attr_keys = list(attr_keys)
        self.updates = updates or {}
        self.remove_keys = list(remove_keys)
        self.before = {k: copy.deepcopy(store.attributes().get(k, {})) for k in self.attr_keys}

    def redo(self) -> None:
        attrs = self.store.attributes()
        for key in self.attr_keys:
            if key not in attrs:
                continue
            attrs[key].update(self.updates)
            for r in self.remove_keys:
                attrs[key].pop(r, None)
        self.store.mark_dirty()

    def undo(self) -> None:
        attrs = self.store.attributes()
        for key, value in self.before.items():
            attrs[key] = copy.deepcopy(value)
        self.store.mark_dirty()


class NormalizeOrderCommand(QUndoCommand):
    """Normalize order fields within a group/subgroup."""

    def __init__(
        self,
        store: SchemaStore,
        group: str,
        subgroup: str | None = None,
        text: str = "Normalize order",
    ) -> None:
        super().__init__(text)
        self.store = store
        self.group = group
        self.subgroup = subgroup or ""
        self.before_orders: Dict[str, Any] = {}
        for key, attr in store.attributes().items():
            if attr.get("group") != group:
                continue
            sg = attr.get("subgroup") or ""
            if sg == self.subgroup:
                self.before_orders[key] = attr.get("order")

    def redo(self) -> None:
        self.store.normalize_orders(self.group, self.subgroup or None)

    def undo(self) -> None:
        attrs = self.store.attributes()
        for key, order_val in self.before_orders.items():
            if key in attrs:
                attrs[key]["order"] = order_val
        self.store.mark_dirty()


def apply_command(stack: QUndoStack, command: QUndoCommand) -> None:
    stack.push(command)


def bulk_set_field(
    store: SchemaStore,
    attr_keys: Iterable[str],
    field: str,
    value: Any,
    stack: QUndoStack,
    text: str | None = None,
) -> None:
    apply_command(
        stack,
        AttributeEditCommand(
            store,
            attr_keys,
            updates={field: value},
            text=text or f"Set {field}",
        ),
    )


def bulk_set_fields(
    store: SchemaStore,
    attr_keys: Iterable[str],
    updates: Dict[str, Any],
    remove_keys: Iterable[str],
    stack: QUndoStack,
    text: str,
) -> None:
    apply_command(stack, AttributeEditCommand(store, attr_keys, updates, remove_keys, text=text))


def bulk_move(
    store: SchemaStore,
    attr_keys: Iterable[str],
    group: str,
    subgroup: str | None,
    stack: QUndoStack,
) -> None:
    updates = {"group": group}
    remove_keys: List[str] = []
    if subgroup:
        updates["subgroup"] = subgroup
    else:
        remove_keys.append("subgroup")
    # Ensure destination exists before recording undo snapshot.
    store.ensure_group(group)
    if subgroup:
        store.ensure_subgroup(group, subgroup)
    apply_command(
        stack,
        AttributeEditCommand(
            store,
            attr_keys,
            updates=updates,
            remove_keys=remove_keys,
            text="Move to group/subgroup",
        ),
    )


def sort_and_rewrite_orders(
    store: SchemaStore,
    group: str,
    subgroup: str | None,
    by: str,
    stack: QUndoStack,
) -> None:
    subgroup_name = subgroup or ""
    attrs = store.attributes()
    candidates: List[Tuple[str, Dict[str, Any]]] = []
    for key, attr in attrs.items():
        if attr.get("group") != group:
            continue
        sg = attr.get("subgroup") or ""
        if sg == subgroup_name:
            candidates.append((key, attr))

    before = {k: attr.get("order") for k, attr in candidates}

    def sort_key(item: Tuple[str, Dict[str, Any]]):
        key, attr = item
        if by == "label":
            return (attr.get("label") or "", key)
        return key

    candidates.sort(key=sort_key)

    updates: Dict[str, Any] = {key: idx for idx, (key, _) in enumerate(candidates, start=1)}

    class RewriteOrderCommand(QUndoCommand):
        def __init__(self) -> None:
            super().__init__(f"Sort by {by} and rewrite order")

        def undo(self) -> None:
            for k, v in before.items():
                if k in attrs:
                    attrs[k]["order"] = v
            store.mark_dirty()

        def redo(self) -> None:
            for k, v in updates.items():
                if k in attrs:
                    attrs[k]["order"] = v
            store.mark_dirty()

    apply_command(stack, RewriteOrderCommand())


def move_step(
    store: SchemaStore,
    group: str,
    subgroup: str | None,
    attr_key: str,
    direction: int,
    stack: QUndoStack,
) -> None:
    subgroup_name = subgroup or ""
    attrs = store.attributes()
    peers = []
    for key, attr in attrs.items():
        if attr.get("group") != group:
            continue
        sg = attr.get("subgroup") or ""
        if sg == subgroup_name:
            peers.append((key, _safe_int(attr.get("order"))))
    peers.sort(key=lambda item: item[1])
    keys_only = [k for k, _ in peers]
    if attr_key not in keys_only:
        return
    idx = keys_only.index(attr_key)
    new_idx = max(0, min(len(keys_only) - 1, idx + direction))
    if new_idx == idx:
        return
    keys_only.pop(idx)
    keys_only.insert(new_idx, attr_key)
    before = {k: attrs[k].get("order") for k in keys_only}

    def assign_orders():
        for i, k in enumerate(keys_only, start=1):
            attrs[k]["order"] = i
        store.mark_dirty()

    class MoveStepCommand(QUndoCommand):
        def __init__(self) -> None:
            super().__init__("Move attribute")

        def redo(self) -> None:
            assign_orders()

        def undo(self) -> None:
            for k, v in before.items():
                attrs[k]["order"] = v
            store.mark_dirty()

    apply_command(stack, MoveStepCommand())


def reorder_sequence(
    store: SchemaStore,
    group: str,
    subgroup: str | None,
    ordered_keys: List[str],
    stack: QUndoStack,
) -> None:
    """Rewrite order for all attributes in the given ordered_keys sequence."""
    subgroup_name = subgroup or ""
    attrs = store.attributes()

    # Snapshot before
    before = {k: attrs.get(k, {}).get("order") for k in ordered_keys if k in attrs}

    # Apply new order
    def assign_orders():
        for idx, key in enumerate(ordered_keys, start=1):
            if key in attrs:
                attrs[key]["order"] = idx
        store.mark_dirty()

    class ReorderCommand(QUndoCommand):
        def __init__(self) -> None:
            super().__init__("Reorder attributes")

        def redo(self) -> None:
            assign_orders()

        def undo(self) -> None:
            for k, v in before.items():
                if k in attrs:
                    attrs[k]["order"] = v
            store.mark_dirty()

    apply_command(stack, ReorderCommand())
