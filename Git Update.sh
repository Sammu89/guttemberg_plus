#!/bin/bash
# ========================================
# Git Sync Utility – Linux version (final)
# - Force sync + optional npm run build ONLY if node_modules exists
# ========================================

pause() {
  echo
  read -rp "Press Enter to continue..."
}

cd "$(dirname "$0")" || exit 1

# Load nvm if present (so npm works when we need it)
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" >/dev/null 2>&1
nvm use default >/dev/null 2>&1 || true

BRANCH=${1:-main}
REMOTE=${2:-origin}

echo "========================================"
echo " Git Sync Utility"
echo " Repository: $(pwd)"
echo " Branch: $BRANCH"
echo " Remote: $REMOTE"
echo "========================================"
echo
echo "What do you want to do?"
echo "[1] Update LOCAL from SERVER (forces discard of all local changes)"
echo "[2] Update SERVER from LOCAL (git push)"
echo
read -rp "Select 1 or 2: " CHOICE

case "$CHOICE" in
  1)
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

    # ←←← YOUR REQUESTED LOGIC ←←←
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

  2)
    echo
    echo "========================================"
    echo " PUSH: Updating remote with local changes"
    echo "========================================"
    git status -s
    echo
    read -rp "Stage and push ALL local changes? (Y/N): " CONFIRM
    [[ ! "$CONFIRM" =~ ^[Yy]$ ]] && echo "Cancelled." && pause && exit 0

    git add .
    read -rp "Commit message (or Enter for auto): " MSG
    [ -z "$MSG" ] && MSG="Auto commit $(date +'%Y-%m-%d %H:%M')"

    git commit -m "$MSG" || echo "Nothing to commit"
    git push "$REMOTE" "$BRANCH" || { echo "Push failed!"; pause; exit 1; }

    echo "Remote updated successfully."
    pause
    ;;

  *)
    echo "Invalid choice."
    pause
    exit 1
    ;;
esac
