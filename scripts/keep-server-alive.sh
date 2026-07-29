#!/bin/bash
while true; do
  if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null | grep -q "200"; then
    echo "[$(date)] Server not responding, restarting..."
    pkill -f "next" 2>/dev/null
    sleep 2
    cd /home/z/my-project && NODE_OPTIONS="--max-old-space-size=256" npx next start -p 3000 > /tmp/nextjs-prod.log 2>&1 &
    sleep 8
  else
    echo "[$(date)] Server is running"
  fi
  sleep 60
done
