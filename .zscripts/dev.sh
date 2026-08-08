#!/bin/bash

set -euo pipefail

# 获取脚本所在目录（.zscripts）
# 使用 $0 获取脚本路径（与 build.sh 保持一致）
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

log_step_start() {
        local step_name="$1"
        echo "=========================================="
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Starting: $step_name"
        echo "=========================================="
        export STEP_START_TIME
        STEP_START_TIME=$(date +%s)
}

log_step_end() {
        local step_name="${1:-Unknown step}"
        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - STEP_START_TIME))
        echo "=========================================="
        echo "[$(date '+%Y-%m-%d %H:%M:%S')] Completed: $step_name"
        echo "[LOG] Step: $step_name | Duration: ${duration}s"
        echo "=========================================="
        echo ""
}

start_mini_services() {
        local mini_services_dir="$PROJECT_DIR/mini-services"
        local started_count=0

        log_step_start "Starting mini-services"
        if [ ! -d "$mini_services_dir" ]; then
                echo "Mini-services directory not found, skipping..."
                log_step_end "Starting mini-services"
                return 0
        fi

        echo "Found mini-services directory, scanning for sub-services..."

        for service_dir in "$mini_services_dir"/*; do
                if [ ! -d "$service_dir" ]; then
                        continue
                fi

                local service_name
                service_name=$(basename "$service_dir")
                echo "Checking service: $service_name"

                if [ ! -f "$service_dir/package.json" ]; then
                        echo "[$service_name] No package.json found, skipping..."
                        continue
                fi

                if ! grep -q '"dev"' "$service_dir/package.json"; then
                        echo "[$service_name] No dev script found, skipping..."
                        continue
                fi

                echo "Starting $service_name in background..."
                (
                        cd "$service_dir"
                        echo "[$service_name] Installing dependencies..."
                        bun install
                        echo "[$service_name] Running bun run dev..."
                        exec bun run dev
                ) >"$PROJECT_DIR/.zscripts/mini-service-${service_name}.log" 2>&1 &

                local service_pid=$!
                echo "[$service_name] Started in background (PID: $service_pid)"
                echo "[$service_name] Log: $PROJECT_DIR/.zscripts/mini-service-${service_name}.log"
                disown "$service_pid" 2>/dev/null || true
                started_count=$((started_count + 1))
        done

        echo "Mini-services startup completed. Started $started_count service(s)."
        log_step_end "Starting mini-services"
}

wait_for_service() {
        local host="$1"
        local port="$2"
        local service_name="$3"
        local max_attempts="${4:-60}"
        local attempt=1

        echo "Waiting for $service_name to be ready on $host:$port..."

        while [ "$attempt" -le "$max_attempts" ]; do
                if curl -s --connect-timeout 2 --max-time 5 "http://$host:$port" >/dev/null 2>&1; then
                        echo "$service_name is ready!"
                        return 0
                fi

                echo "Attempt $attempt/$max_attempts: $service_name not ready yet, waiting..."
                sleep 1
                attempt=$((attempt + 1))
        done

        echo "ERROR: $service_name failed to start within $max_attempts seconds"
        return 1
}

cd "$PROJECT_DIR"

if ! command -v bun >/dev/null 2>&1; then
        echo "ERROR: bun is not installed or not in PATH"
        exit 1
fi

log_step_start "bun install"
echo "[BUN] Installing dependencies..."
bun install
log_step_end "bun install"

log_step_start "bun run db:push"
echo "[BUN] Setting up database..."
bun run db:push
log_step_end "bun run db:push"

log_step_start "Building Next.js for production"
echo "[BUILD] Running next build..."
bun run build 2>&1 | tail -5
log_step_end "Building Next.js for production"

log_step_start "Starting Next.js production server"
echo "[PROD] Starting standalone production server with watchdog..."

# Production server with auto-restart watchdog using double-fork daemon pattern
# Uses the standalone build for maximum performance and stability
# Double-fork ensures the process is reparented to init (PID 1),
# so it survives when the parent shell exits.
(
        cd "$PROJECT_DIR"
        export DATABASE_URL=file:/home/z/my-project/db/custom.db
        export PORT=3000
        export HOSTNAME=0.0.0.0
        export NODE_ENV=production

        RESTART_COUNT=0
        while true; do
                echo "[$(date)] Starting production server (attempt $((RESTART_COUNT + 1)))..." >> "$PROJECT_DIR/.zscripts/server-watchdog.log"

                # Double-fork: inner subshell runs the server, outer exits
                # This reparents the server to PID 1 (tini)
                (
                        node "$PROJECT_DIR/.next/standalone/server.js" >> "$PROJECT_DIR/.zscripts/server-watchdog.log" 2>&1
                ) &

                SERVER_PID=$!
                echo $SERVER_PID > "$PROJECT_DIR/.zscripts/dev.pid"
                echo "[$(date)] Server PID: $SERVER_PID" >> "$PROJECT_DIR/.zscripts/server-watchdog.log"

                # Wait for the server to exit
                wait $SERVER_PID 2>/dev/null
                EXIT_CODE=$?
                RESTART_COUNT=$((RESTART_COUNT + 1))
                echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 3s... (count: $RESTART_COUNT)" >> "$PROJECT_DIR/.zscripts/server-watchdog.log"
                sleep 3
        done
) &
DEV_PID=$!

log_step_end "Starting Next.js production server"

log_step_start "Waiting for Next.js production server"
wait_for_service "localhost" "3000" "Next.js production server"
log_step_end "Waiting for Next.js production server"

log_step_start "Health check"
echo "[PROD] Performing health check..."
curl -fsS localhost:3000 >/dev/null
echo "[PROD] Health check passed"
log_step_end "Health check"

start_mini_services

echo "Next.js production server is running with watchdog (PID: $DEV_PID)."
disown "$DEV_PID" 2>/dev/null || true
unset DEV_PID
