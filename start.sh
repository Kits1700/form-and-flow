#!/bin/bash
# Form & Flow — start server
DIR="$(cd "$(dirname "$0")" && pwd)"
KEY=$(grep 'ANTHROPIC_API_KEY' "$DIR/.config.env" 2>/dev/null | cut -d= -f2 | tr -d ' \r')
if [ -z "$KEY" ]; then
  KEY=$(grep 'ANTHROPIC_API_KEY' "$DIR/.env" 2>/dev/null | cut -d= -f2 | tr -d ' \r')
fi
if [ -z "$KEY" ]; then
  echo "Error: ANTHROPIC_API_KEY not found in .config.env or .env"
  exit 1
fi
lsof -ti:3000 | xargs kill -9 2>/dev/null
echo "Starting Form & Flow..."
ANTHROPIC_API_KEY="$KEY" /usr/local/bin/node "$DIR/server.js"
