#!/bin/bash
cd /home/z/my-project
while true; do
  npx next start -p 3000 &
  SERVER_PID=$!
  echo "Started server with PID $SERVER_PID at $(date)" >> /home/z/my-project/server-restart.log
  
  # Wait for the server to die
  while kill -0 $SERVER_PID 2>/dev/null; do
    sleep 5
  done
  
  echo "Server died at $(date), restarting..." >> /home/z/my-project/server-restart.log
  sleep 2
done
