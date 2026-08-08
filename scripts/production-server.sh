#!/bin/bash
# Production server with auto-restart watchdog
# This script keeps the Next.js server alive indefinitely

cd /home/z/my-project
export DATABASE_URL=file:/home/z/my-project/db/custom.db
export PORT=3000
export HOSTNAME=0.0.0.0
export NODE_ENV=production

LOGFILE=/home/z/my-project/server-watchdog.log
PIDFILE=/home/z/my-project/.zscripts/dev.pid

echo "[$(date)] Production server watchdog starting..." >> $LOGFILE

# Clean up any existing server on port 3000
pkill -f "server.js" 2>/dev/null || true
sleep 2

RESTART_COUNT=0
MAX_RESTARTS=50

while [ $RESTART_COUNT -lt $MAX_RESTARTS ]; do
    echo "[$(date)] Starting server (attempt $((RESTART_COUNT + 1)))..." >> $LOGFILE
    
    # Start the server
    node .next/standalone/server.js >> $LOGFILE 2>&1 &
    SERVER_PID=$!
    echo $SERVER_PID > $PIDFILE
    echo "[$(date)] Server started with PID $SERVER_PID" >> $LOGFILE
    
    # Wait for the server to be ready
    READY=0
    for i in $(seq 1 10); do
        sleep 1
        if curl -s -o /dev/null -w '' --connect-timeout 1 --max-time 3 http://localhost:3000/ 2>/dev/null; then
            READY=1
            echo "[$(date)] Server ready after ${i}s" >> $LOGFILE
            break
        fi
    done
    
    if [ $READY -eq 0 ]; then
        echo "[$(date)] Server failed to become ready" >> $LOGFILE
    fi
    
    # Now wait for the server to die
    while kill -0 $SERVER_PID 2>/dev/null; do
        sleep 2
    done
    
    EXIT_CODE=$?
    RESTART_COUNT=$((RESTART_COUNT + 1))
    echo "[$(date)] Server died (restart count: $RESTART_COUNT)" >> $LOGFILE
    
    # Brief pause before restart
    sleep 2
done

echo "[$(date)] Max restarts reached, exiting" >> $LOGFILE
