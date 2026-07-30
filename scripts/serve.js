const { spawn } = require('child_process');
const path = require('path');

const child = spawn('node', [
  path.join(__dirname, '..', 'node_modules', '.bin', 'next'),
  'start', '-p', '3000'
], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit'
});

child.on('exit', (code, signal) => {
  console.log('Server exited with code:', code, 'signal:', signal);
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1);
});

// Keep alive
process.on('SIGINT', () => { child.kill(); process.exit(0); });
process.on('SIGTERM', () => { child.kill(); process.exit(0); });
