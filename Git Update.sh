#!/bin/bash
# ========================================
# Git Sync Utility – NOW WITH REAL FORCE RESET BEFORE PULL
# ========================================

pause() {
  echo
  read -rp "Press Enter to continue..."
}

cd "$(dirname "$0")" || exit 1

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
echo "[1] Update LOCAL from SERVER  (forces discard of all local changes)"
echo "[2] Update SERVER from LOCAL  (git push)"
echo
read -rp "Select 1 or 2: " CHOICE

case "$CHOICE" in
  1)
    echo
    echo "========================================"
    echo " PULL: Forcing local repo to EXACTLY match $REMOTE/$BRANCH"
    echo " → Discarding ALL local changes automatically..."
    echo "========================================"

    # THIS IS THE FIX – discard changes BEFORE any merge can happen
    git fetch "$REMOTE" "$BRANCH" --quiet
    git reset --hard "$REMOTE/$BRANCH"
    git clean -fd   # also remove untracked files

    echo
    echo "Local repository successfully forced to latest remote version."
    echo "HEAD is now at $(git log --oneline -1 | cut -d' ' -f1)"
    
    pause
    ;;

  2)
    # Your push logic – unchanged and perfect
    echo
    echo "========================================"
    echo " PUSH: Updating remote server with local changes..."
    echo "========================================"
    git status -s
    echo
    read -rp "Stage and push ALL local changes? (Y/N): " CONFIRM
    if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
      echo "Operation cancelled."
      pause
      exit 0
    fi
    git add .
    echo
    read -rp "Enter commit message (or press Enter for auto): " MSG
    if [ -z "$MSG" ]; then
      DATESTR=$(date +"%Y-%m-%d_%H-%M")
      MSG="Auto commit $DATESTR"
    fi
    echo "Committing with message: \"$MSG\""
    git commit -m "$MSG" || echo "Nothing to commit."
    echo
    echo "Pushing changes to $REMOTE/$BRANCH ..."
    git push "$REMOTE" "$BRANCH"
    if [ $? -ne 0 ]; then
      echo "ERROR: Push failed!"
      pause
      exit 1
    fi
    echo "Remote updated successfully."
    pause
    ;;

  *)
    echo "Invalid choice."
    pause
    exit 1
    ;;
esac
