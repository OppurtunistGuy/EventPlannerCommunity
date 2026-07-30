const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3001; // Run on a different port, use Caddy to proxy

// Load static data
const menuData = JSON.parse(fs.readFileSync(path.join(__dirname, 'menu-data.json'), 'utf8'));
const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'events-data.json'), 'utf8'));
const tablesData = JSON.parse(fs.readFileSync(path.join(__dirname, 'tables-data.json'), 'utf8'));

const server = http.createServer((req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);

  if (url.pathname === '/api/menu') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(menuData));
  } else if (url.pathname === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(eventsData));
  } else if (url.pathname === '/api/tables') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(tablesData));
  } else if (url.pathname === '/api/reservations' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('Reservation received:', body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: 'res-' + Date.now() }));
    });
  } else if (url.pathname === '/api/orders' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('Order received:', body);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, id: 'ord-' + Date.now() }));
    });
  } else if (url.pathname === '/api/bill') {
    const tableId = url.searchParams.get('tableId');
    const table = tablesData.find(t => t.id === tableId);
    if (table && table.orders && table.orders.length > 0) {
      const subtotal = table.orders.reduce((s, o) => s + (o.total || 0), 0);
      const gst = Math.round(subtotal * 0.05);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        tableNumber: table.number,
        tableArea: table.area,
        orders: table.orders,
        items: table.orders.flatMap(o => o.items || []),
        subtotal,
        gst,
        total: subtotal + gst,
      }));
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ tableNumber: table?.number, items: [], subtotal: 0, gst: 0, total: 0 }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
  console.log(`Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
});
