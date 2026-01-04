from __future__ import annotations

import argparse
import sys
from pathlib import Path

from PySide6.QtWidgets import QApplication, QFileDialog

from .ui.main_window import run_app


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Schema IDE - PySide6 app for editing Gutenberg block schema JSON."
    )
    parser.add_argument(
        "schema_path",
        type=Path,
        nargs="?",
        help="Path to schema JSON (optional, choose via file picker if omitted).",
    )
    args = parser.parse_args()

    app = QApplication(sys.argv)
    schema_path = args.schema_path

    if schema_path is None:
        start_dir = Path(__file__).resolve().parent.parent  # default to schemas directory
        fname, _ = QFileDialog.getOpenFileName(
            None,
            "Select schema JSON",
            str(start_dir),
            "JSON Files (*.json);;All Files (*)",
        )
        if not fname:
            return
        schema_path = Path(fname)

    run_app(schema_path, app=app)


if __name__ == "__main__":
    main()
