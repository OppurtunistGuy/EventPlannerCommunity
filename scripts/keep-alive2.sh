#!/bin/bash
# Keep-alive script for the Next.js server
cd /home/z/my-project

# Ensure DB is correct
cp -f prisma/custom.db db/custom.db
cp -f prisma/custom.db .next/standalone/node_modules/.prisma/client/custom.db 2>/dev/null

while true; do
  if ! pgrep -f "standalone/server.js" > /dev/null; then
    echo "[$(date)] Starting server..."
    node .next/standalone/server.js &
    sleep 3
  fi
  sleep 5
done
