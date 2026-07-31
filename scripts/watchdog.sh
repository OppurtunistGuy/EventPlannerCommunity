#!/bin/bash
# Watchdog script to keep the Next.js server alive
cd /home/z/my-project

while true; do
  # Check if server is running
  if ! curl -s "http://localhost:3000/api" > /dev/null 2>&1; then
    echo "[$(date)] Server is down, restarting..."
    pkill -f "server.js" 2>/dev/null
    sleep 2
    
    # Copy the correct database
    cp prisma/custom.db db/custom.db
    cp prisma/custom.db .next/standalone/node_modules/.prisma/client/custom.db
    
    # Start the standalone server
    node .next/standalone/server.js &
    sleep 5
    
    if curl -s "http://localhost:3000/api" > /dev/null 2>&1; then
      echo "[$(date)] Server restarted successfully"
    else
      echo "[$(date)] Server failed to start"
    fi
  fi
  sleep 10
done
