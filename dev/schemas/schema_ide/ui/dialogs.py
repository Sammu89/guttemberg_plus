from __future__ import annotations

from typing import List

from PySide6.QtWidgets import QMessageBox

from ..validation.rules import ValidationIssue


def show_validation_report(parent, issues: List[ValidationIssue]) -> None:
    if not issues:
        QMessageBox.information(parent, "Validation", "No validation issues found.")
        return
    errors = [i for i in issues if i.level == "error"]
    warnings = [i for i in issues if i.level == "warning"]
    lines = []
    if errors:
        lines.append("Errors:")
        lines.extend([f"- {i.path}: {i.message}" for i in errors])
    if warnings:
        if lines:
            lines.append("")
        lines.append("Warnings:")
        lines.extend([f"- {i.path}: {i.message}" for i in warnings])
    QMessageBox.information(parent, "Validation report", "\n".join(lines))

