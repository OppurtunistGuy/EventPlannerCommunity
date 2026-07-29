const { spawn } = require('child_process');
const path = require('path');

function startServer() {
  console.log(`[${new Date().toISOString()}] Starting server...`);
  const child = spawn('node', [path.join(__dirname, 'keep-alive.js')], {
    cwd: __dirname + '/..',
    stdio: 'inherit'
  });
  
  child.on('exit', (code, signal) => {
    console.log(`[${new Date().toISOString()}] Server exited with code ${code}, signal ${signal}. Restarting in 3s...`);
    setTimeout(startServer, 3000);
  });
  
  child.on('error', (err) => {
    console.error(`[${new Date().toISOString()}] Server error: ${err.message}. Restarting in 3s...`);
    setTimeout(startServer, 3000);
  });
}

startServer();
