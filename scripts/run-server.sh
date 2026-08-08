#!/bin/bash
cd /home/z/my-project

# Set up signal handlers to log before exit
trap 'echo "[$(date)] Received SIGTERM, exiting..." >> /home/z/my-project/server-crash.log; exit 143' SIGTERM
trap 'echo "[$(date)] Received SIGHUP, exiting..." >> /home/z/my-project/server-crash.log; exit 129' SIGHUP
trap 'echo "[$(date)] Received SIGINT, exiting..." >> /home/z/my-project/server-crash.log; exit 130' SIGINT

export NODE_ENV=production
export PORT=3000
export HOSTNAME=0.0.0.0
export DATABASE_URL=file:/home/z/my-project/db/custom.db

echo "[$(date)] Starting standalone server..." >> /home/z/my-project/server-crash.log

node .next/standalone/server.js 2>&1 | tee -a /home/z/my-project/server-crash.log

EXIT_CODE=${PIPESTATUS[0]}
echo "[$(date)] Server exited with code: $EXIT_CODE" >> /home/z/my-project/server-crash.log
