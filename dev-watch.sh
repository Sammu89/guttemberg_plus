#!/bin/bash
# Development Watch Script
# This script monitors webpack builds and helps with debugging

echo "🚀 Starting Development Watch Mode"
echo "=================================="
echo ""
echo "📝 What this does:"
echo "   - Auto-rebuilds when you save files"
echo "   - Shows build errors immediately"
echo "   - Much faster than manual builds"
echo ""
echo "💡 Workflow:"
echo "   1. Keep this terminal open"
echo "   2. Open your browser to WordPress editor"
echo "   3. Open browser DevTools Console (F12)"
echo "   4. Edit code and save"
echo "   5. Refresh browser to see changes"
echo ""
echo "⚠️  To stop: Press Ctrl+C"
echo "=================================="
echo ""

# Start webpack in watch mode
npm run start
