#!/bin/bash
cd /home/z/my-project

# Kill any existing server
pkill -f "next" 2>/dev/null
sleep 2

# Copy the correct database to the standalone location
cp prisma/custom.db db/custom.db
cp prisma/custom.db .next/standalone/node_modules/.prisma/client/custom.db

# Start the standalone server
exec node .next/standalone/server.js
