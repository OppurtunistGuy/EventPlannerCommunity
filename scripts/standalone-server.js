const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Load static data
const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, 'menu-data.json'), 'utf8'));
const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'events-data.json'), 'utf8'));
const tablesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'tables-data.json'), 'utf8'));

// Load the Next.js built page
const nextServer = require('../.next/standalone/server.js');

// Actually, let's just serve the Next.js app properly
// Instead, let's use a different approach - proxy to Next.js

console.log('Starting standalone server on port', PORT);
