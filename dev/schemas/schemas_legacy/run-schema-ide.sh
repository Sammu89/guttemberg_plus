#!/usr/bin/env bash
set -euo pipefail

# Move to the directory containing this script (schemas/)
BASEDIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$BASEDIR"

APT_DEPS=(
  libxcb-cursor0
  libxcb-xinerama0
  libxkbcommon-x11-0
  libxcb-render0
  libxcb-shape0
  libxcb-randr0
  libxcb-shm0
  libxcb-xfixes0
  libxrender1
  libxi6
  libsm6
)

pause_prompt() {
  read -rp "Press Enter to return to menu..." </dev/tty 2>/dev/null || sleep 5
}

install_system_deps() {
  if command -v apt-get >/dev/null 2>&1; then
    echo "Installing Qt runtime dependencies..."
    sudo apt-get update
    sudo apt-get install -y "${APT_DEPS[@]}"
  else
    echo "apt-get not found. Install these packages manually:"
    printf '  %s\n' "${APT_DEPS[@]}"
  fi
}

setup_venv() {
  if [ ! -x ".venv/bin/python" ]; then
    echo "Creating virtual environment in .venv..."
    python3 -m venv .venv
  fi

  if [ ! -x ".venv/bin/python" ]; then
    echo "Python not found or virtual environment creation failed."
    pause_prompt
    return 1
  fi

  PYTHON="$BASEDIR/.venv/bin/python"

  # Ensure pip in venv
  if ! "$PYTHON" -m pip --version >/dev/null 2>&1; then
    echo "pip not found in venv; bootstrapping with ensurepip..."
    "$PYTHON" -m ensurepip --upgrade || true
  fi
  if ! "$PYTHON" -m pip --version >/dev/null 2>&1; then
    echo "ensurepip not available; downloading get-pip.py..."
    TMP_PIP="$(mktemp)"
    if command -v curl >/dev/null 2>&1; then
      curl -sS https://bootstrap.pypa.io/get-pip.py -o "$TMP_PIP"
    elif command -v wget >/dev/null 2>&1; then
      wget -q https://bootstrap.pypa.io/get-pip.py -O "$TMP_PIP"
    else
      echo "Neither curl nor wget available to fetch get-pip.py."
      pause_prompt
      return 1
    fi
    "$PYTHON" "$TMP_PIP" || true
    rm -f "$TMP_PIP"
  fi

  echo "Installing/updating Python dependencies..."
  "$PYTHON" -m pip install --upgrade pip
  "$PYTHON" -m pip install -r "$BASEDIR/schema_ide/requirements.txt"
}

run_app() {
  PYTHON="$BASEDIR/.venv/bin/python"
  if [ ! -x "$PYTHON" ]; then
    echo "Virtual env not ready. Run Install Dependencies (option 2) first."
    pause_prompt
    return
  fi
  echo "Launching Schema IDE (choose a schema JSON when prompted)..."
  QT_DEBUG_PLUGINS=0 "$PYTHON" -m schema_ide.app "$@" || true
  pause_prompt
}

while true; do
  clear
  echo "=== Schema IDE Launcher ==="
  echo "1) Run Schema IDE (default)"
  echo "2) Install dependencies (system + Python)"
  echo "q) Quit"
  echo
  read -rp "Choose an option [1]: " choice
  choice="${choice:-1}"
  case "$choice" in
    1)
      run_app "$@"
      ;;
    2)
      install_system_deps
      setup_venv
      pause_prompt
      ;;
    q|Q)
      exit 0
      ;;
    *)
      echo "Invalid option."
      pause_prompt
      ;;
  esac
done
