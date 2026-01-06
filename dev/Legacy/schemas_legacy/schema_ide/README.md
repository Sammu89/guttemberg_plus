# Schema IDE

Desktop GUI (PySide6 + pyqtgraph) for editing Gutenberg block schema JSON files such as `accordion.json`, `tabs.json`, and `toc.json` inside the `schemas` directory. The app loads, validates, bulk-edits, and saves the schema file in-place with stable key ordering. A file picker appears if you don't pass a path.

## Install

```bash
# from repo root
cd schemas
python3 -m venv .venv
source .venv/bin/activate
pip install -r schema_ide/requirements.txt
```

## Run

```bash
# from repo root
cd schemas
python -m schema_ide.app
```

On Windows you can double-click `schemas/run-schema-ide.bat` to create the venv (if missing), install requirements, and launch the app. Pass a path to skip the picker:

```bash
python -m schema_ide.app accordion.json
```

On Linux/macOS you can run the helper script:

```bash
cd schemas
bash run-schema-ide.sh
```

## Features

- 3-pane layout: navigation tree (Tab -> Group -> Subgroup -> Attribute), sortable/filterable attribute table, and inspector with file-picker startup.
- Bulk flag toggles, group/subgroup moves (including drag-and-drop onto tree nodes), order normalization, sort by key/label, move up/down.
- Inspector (pyqtgraph ParameterTree) supports single and multi-edit of core fields and custom fields (JSON).
- Validation per schema-ide-agent-prompt: structural keys, referential integrity, field sanity, outputsCSS hints, showWhen references, duplicate/non-integer orders.
- Save-time validation with errors blocking save and warnings requiring confirmation.
- Undo/redo via Qt undo stack; dirty tracking and save prompt on exit.
