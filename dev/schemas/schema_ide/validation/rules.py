from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, Iterable, List

ALLOWED_TYPES = {"string", "number", "boolean", "object", "array"}


@dataclass
class ValidationIssue:
    level: str  # "error" or "warning"
    path: str
    message: str


def validate_schema(schema: Dict[str, Any]) -> List[ValidationIssue]:
    issues: List[ValidationIssue] = []

    # Build groups dict - handle both top-level groups and tabs format
    groups = _extract_groups(schema)
    attributes = schema.get("attributes")

    _require_keys(schema, issues)
    if not isinstance(attributes, dict):
        issues.append(
            ValidationIssue("error", "attributes", "`attributes` must be an object (dict)")
        )
        return issues

    _validate_groups(groups, issues)
    _validate_attributes(attributes, groups, issues)
    _validate_orders(attributes, issues)
    return issues


def _extract_groups(schema: Dict[str, Any]) -> Dict[str, Any]:
    """Extract groups from schema, handling both top-level groups and tabs format."""
    # First try top-level groups dict
    if "groups" in schema and isinstance(schema["groups"], dict):
        return schema["groups"]

    # Otherwise build from tabs format
    tabs = schema.get("tabs", [])
    if not isinstance(tabs, list):
        return {}

    groups: Dict[str, Any] = {}
    for tab in tabs:
        if not isinstance(tab, dict):
            continue
        for g in tab.get("groups", []):
            if not isinstance(g, dict):
                continue
            gid = g.get("id") or g.get("name")
            if not gid:
                continue
            # Create a copy with tab info
            gcopy = {k: v for k, v in g.items() if k != "id"}
            gcopy["tab"] = tab.get("name", "settings")
            groups[gid] = gcopy
    return groups


def _require_keys(schema: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    required = [
        "$schema",
        "title",
        "version",
        "description",
        "blockType",
        "blockName",
        "manualSyncRequired",
        "attributes",
    ]
    for key in required:
        if key not in schema:
            issues.append(ValidationIssue("error", key, f"Missing top-level key `{key}`"))

    # Require either "groups" or "tabs"
    if "groups" not in schema and "tabs" not in schema:
        issues.append(
            ValidationIssue("error", "groups/tabs", "Missing either `groups` or `tabs` top-level key")
        )


def _validate_groups(groups: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    for gid, group in groups.items():
        if not isinstance(group, dict):
            issues.append(
                ValidationIssue("error", f"groups.{gid}", "Group definition must be an object")
            )
            continue
        if "title" not in group:
            issues.append(
                ValidationIssue("warning", f"groups.{gid}.title", "Group missing `title`")
            )
        if "order" not in group:
            issues.append(
                ValidationIssue("warning", f"groups.{gid}.order", "Group missing `order`")
            )
        if "tab" not in group:
            issues.append(
                ValidationIssue(
                    "warning",
                    f"groups.{gid}.tab",
                    "Group missing `tab` (will default to settings; set explicitly to organize tabs)",
                )
            )
        subgroups = group.get("subgroups")
        if subgroups is not None and not isinstance(subgroups, list):
            issues.append(
                ValidationIssue(
                    "warning",
                    f"groups.{gid}.subgroups",
                    "`subgroups` should be a list of subgroup names",
                )
            )


def _validate_attributes(
    attributes: Dict[str, Any], groups: Dict[str, Any], issues: List[ValidationIssue]
) -> None:
    for key, attr in attributes.items():
        if not isinstance(attr, dict):
            issues.append(
                ValidationIssue("error", f"attributes.{key}", "Attribute definition must be an object")
            )
            continue
        group = attr.get("group")
        if not group or group not in groups:
            issues.append(
                ValidationIssue(
                    "error",
                    f"attributes.{key}.group",
                    f"`group` is missing or unknown ({group})",
                )
            )
        subgroup = attr.get("subgroup")
        if subgroup is not None and group in groups:
            group_subs = groups.get(group, {}).get("subgroups")
            if isinstance(group_subs, list):
                # Extract subgroup names (handle both string and dict formats)
                subgroup_names = []
                for sg in group_subs:
                    if isinstance(sg, dict):
                        subgroup_names.append(sg.get("name", ""))
                    else:
                        subgroup_names.append(str(sg))

                if subgroup not in subgroup_names:
                    issues.append(
                        ValidationIssue(
                            "warning",
                            f"attributes.{key}.subgroup",
                            f"Subgroup '{subgroup}' not declared in groups.{group}.subgroups",
                        )
                    )
        attr_type = attr.get("type")
        if attr_type and attr_type not in ALLOWED_TYPES:
            issues.append(
                ValidationIssue(
                    "warning",
                    f"attributes.{key}.type",
                    f"Unexpected type `{attr_type}` (expected one of {sorted(ALLOWED_TYPES)})",
                )
            )
        _validate_orders_for_attr(key, attr, issues)
        _validate_options(key, attr, issues)
        _validate_number_bounds(key, attr, issues)
        _validate_units(key, attr, issues)
        _validate_outputs_css(key, attr, issues)
        _validate_show_when(key, attr, attributes, issues)


def _validate_orders(attributes: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    seen = {}
    for key, attr in attributes.items():
        group = attr.get("group", "")
        subgroup = attr.get("subgroup", "")
        try:
            order_val = attr.get("order")
        except Exception:
            order_val = None
        bucket = seen.setdefault((group, subgroup), {})
        bucket.setdefault(order_val, []).append(key)
    for (group, subgroup), orders in seen.items():
        for order_val, keys in orders.items():
            if order_val is None:
                continue
            if len(keys) > 1:
                issues.append(
                    ValidationIssue(
                        "warning",
                        f"group={group}/subgroup={subgroup}",
                        f"Duplicate order `{order_val}` for attributes: {', '.join(keys)}",
                    )
                )


def _validate_orders_for_attr(key: str, attr: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    if "order" not in attr:
        return
    order_val = attr.get("order")
    if not isinstance(order_val, int):
        try:
            int(order_val)
        except Exception:
            issues.append(
                ValidationIssue(
                    "error", f"attributes.{key}.order", "`order` must be an integer"
                )
            )


def _validate_options(key: str, attr: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    control = attr.get("control")
    if control == "SelectControl":
        options = attr.get("options")
        if not options or not isinstance(options, list):
            issues.append(
                ValidationIssue(
                    "error",
                    f"attributes.{key}.options",
                    "`SelectControl` requires non-empty `options` list",
                )
            )


def _validate_number_bounds(key: str, attr: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    if attr.get("type") != "number":
        return
    min_val = attr.get("min")
    max_val = attr.get("max")
    if min_val is not None and max_val is not None:
        try:
            if float(min_val) > float(max_val):
                issues.append(
                    ValidationIssue(
                        "error",
                        f"attributes.{key}.minmax",
                        "`min` cannot be greater than `max`",
                    )
                )
        except Exception:
            issues.append(
                ValidationIssue(
                    "warning",
                    f"attributes.{key}.minmax",
                    "Unable to compare `min` and `max` (non-numeric values)",
                )
            )


def _validate_units(key: str, attr: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    units = attr.get("units")
    if units is not None:
        if not isinstance(units, list) or not all(isinstance(u, str) for u in units):
            issues.append(
                ValidationIssue(
                    "warning",
                    f"attributes.{key}.units",
                    "`units` should be a non-empty list of strings",
                )
            )
        elif len(units) == 0:
            issues.append(
                ValidationIssue(
                    "warning",
                    f"attributes.{key}.units",
                    "`units` list is empty",
                )
            )


def _validate_outputs_css(key: str, attr: Dict[str, Any], issues: List[ValidationIssue]) -> None:
    if attr.get("outputsCSS") is True:
        if not attr.get("cssVar") and not attr.get("cssProperty"):
            issues.append(
                ValidationIssue(
                    "warning",
                    f"attributes.{key}.outputsCSS",
                    "`outputsCSS` is true but cssVar/cssProperty are missing",
                )
            )


def _validate_show_when(
    key: str, attr: Dict[str, Any], attributes: Dict[str, Any], issues: List[ValidationIssue]
) -> None:
    show_when = attr.get("showWhen")
    if not isinstance(show_when, dict):
        return
    for dep in show_when.keys():
        if dep not in attributes:
            issues.append(
                ValidationIssue(
                    "warning",
                    f"attributes.{key}.showWhen",
                    f"Condition references missing attribute `{dep}`",
                )
            )

