#!/bin/bash
cd /home/z/my-project
pkill -f "next-server" 2>/dev/null
pkill -f "next start" 2>/dev/null
sleep 2
exec node node_modules/.bin/next start -p 3000
