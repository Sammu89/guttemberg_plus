#!/bin/bash
# ========================================
# Developer Tools Menu - Linux/Mac
# All-in-one utility script
# ========================================

pause() {
  echo
  read -rp "Press Enter to continue..."
}

cd "$(dirname "$0")" || exit 1

# Load nvm if present (so npm works when we need it)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" >/dev/null 2>&1
nvm use default >/dev/null 2>&1 || true

BRANCH=${BRANCH:-main}
REMOTE=${REMOTE:-origin}

# ========================================
# Main Menu Loop
# ========================================
while true; do
  clear
  echo "========================================"
  echo "     Developer Tools Menu"
  echo "     Repository: $(pwd)"
  echo "========================================"
  echo
  echo "[1] Claude Code (dangerously skip permissions)"
  echo "[2] Codex --yolo"
  echo "[3] Git: Update LOCAL from SERVER"
  echo "[4] Git: Update SERVER from LOCAL"
  echo "[5] Run npm run build"
  echo "[0] Exit"
  echo
  read -rp "Select an option (0-5): " CHOICE

  case "$CHOICE" in
    1)
      # ========================================
      # Option 1: Claude Code
      # ========================================
      echo
      echo "========================================"
      echo " Starting Claude Code..."
      echo " (dangerously skip permissions)"
      echo "========================================"
      echo
      claude --dangerously-skip-permissions
      pause
      ;;

    2)
      # ========================================
      # Option 2: Codex
      # ========================================
      echo
      echo "========================================"
      echo " Starting Codex --yolo..."
      echo "========================================"
      echo
      codex --yolo
      pause
      ;;

    3)
      # ========================================
      # Option 3: Git Pull (Force Local to Match Remote)
      # ========================================
      echo
      echo "========================================"
      echo " PULL: Forcing local repo to EXACTLY match $REMOTE/$BRANCH"
      echo " → Discarding ALL local changes automatically..."
      echo "========================================"

      git fetch "$REMOTE" "$BRANCH" --quiet
      git reset --hard "$REMOTE/$BRANCH"
      git clean -fd

      LATEST=$(git log --format="%h" -n 1)
      echo
      echo "Local repository successfully forced to latest remote version."
      echo "HEAD is now at $LATEST"

      if [ -d "node_modules" ]; then
        echo
        echo "**node_modules detected → running npm run build automatically...**"
        npm run build
        if [ $? -eq 0 ]; then
          echo "Build completed successfully ✔"
        else
          echo "ERROR: Build failed ✘"
        fi
      else
        echo
        echo "No node_modules folder found → skipping build (this is intentional)"
      fi

      pause
      ;;

    4)
      # ========================================
      # Option 4: Git Push (Update Remote from Local)
      # ========================================
      echo
      echo "========================================"
      echo " PUSH: Updating remote with local changes"
      echo "========================================"
      git status -s
      echo
      read -rp "Stage and push ALL local changes? (Y/N): " CONFIRM
      if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
        echo "Operation cancelled."
        pause
        continue
      fi

      git add .
      read -rp "Commit message (or Enter for auto): " MSG
      [ -z "$MSG" ] && MSG="Auto commit $(date +'%Y-%m-%d %H:%M')"

      git commit -m "$MSG" || echo "Nothing to commit"

      echo
      echo "Pushing to $REMOTE/$BRANCH ..."
      git push --force "$REMOTE" "$BRANCH"

      if [ $? -ne 0 ]; then
        echo
        echo "Push failed. Attempting automatic repair..."

        echo "Setting core.autocrlf to input"
        git config --global core.autocrlf input

        CUR_BRANCH=$(git branch --show-current)

        if [ "$CUR_BRANCH" != "$BRANCH" ]; then
          echo "Renaming local branch '$CUR_BRANCH' → '$BRANCH'"
          git branch -m "$CUR_BRANCH" "$BRANCH"
        fi

        echo "Retrying push..."
        git push --force -u "$REMOTE" "$BRANCH"

        if [ $? -ne 0 ]; then
          echo
          echo "ERROR: Push failed even after auto-fix."
          pause
          continue
        fi
      fi

      echo
      echo "Remote updated successfully."
      pause
      ;;

    5)
      # ========================================
      # Option 5: NPM Build
      # ========================================
      echo
      echo "========================================"
      echo " Running npm run build..."
      echo "========================================"
      echo
      npm run build
      if [ $? -eq 0 ]; then
        echo
        echo "Build completed successfully ✔"
      else
        echo
        echo "ERROR: Build failed ✘"
      fi
      pause
      ;;

    0)
      # ========================================
      # Exit
      # ========================================
      echo
      echo "Goodbye!"
      exit 0
      ;;

    *)
      echo "Invalid choice."
      pause
      ;;
  esac
done
