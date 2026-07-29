const http = require('http');
const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = 3000;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

// Serve static files
function serveStatic(req, res) {
  let filePath = req.url.split('?')[0];
  
  // Handle Next.js static files
  if (filePath.startsWith('/_next/static/')) {
    filePath = path.join(__dirname, '..', '.next', filePath.replace('/_next/', ''));
  } else if (filePath === '/' || filePath === '') {
    // Serve the built HTML page
    filePath = path.join(__dirname, '..', '.next', 'server', 'app', 'index.html');
  } else {
    filePath = path.join(__dirname, '..', 'public', filePath);
  }
  
  const ext = path.extname(filePath);
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    }
  });
}

// API routes
async function handleAPI(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  
  try {
    if (pathname === '/api/menu') {
      const categories = await prisma.menuCategory.findMany({ orderBy: { order: 'asc' } });
      const items = await prisma.menuItem.findMany({ orderBy: { order: 'asc' } });
      const grouped = {};
      for (const cat of categories) {
        if (!grouped[cat.tab]) grouped[cat.tab] = [];
        grouped[cat.tab].push({
          ...cat,
          items: items.filter(i => i.categoryId === cat.id),
        });
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(grouped));
    } else if (pathname === '/api/events') {
      const events = await prisma.event.findMany({
        orderBy: { isFeatured: 'desc' },
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(events));
    } else if (pathname === '/api/tables') {
      const tables = await prisma.table.findMany({ orderBy: { number: 'asc' } });
      const orders = await prisma.order.findMany({
        where: { status: { in: ['pending', 'preparing', 'ready', 'served'] } },
        orderBy: { createdAt: 'desc' },
        include: { items: { include: { menuItem: true } } },
      });
      const result = tables.map(t => ({
        ...t,
        orders: orders.filter(o => o.tableId === t.id),
      }));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else if (pathname === '/api/bill') {
      const tableId = url.searchParams.get('tableId');
      const table = await prisma.table.findUnique({ where: { id: tableId } });
      const orders = await prisma.order.findMany({
        where: { tableId, status: { in: ['pending', 'preparing', 'ready', 'served'] } },
        orderBy: { createdAt: 'asc' },
        include: { items: { include: { menuItem: true } } },
      });
      const allItems = orders.flatMap(o => o.items.map(it => ({
        name: it.menuItem.name,
        isVeg: it.menuItem.isVeg,
        quantity: it.quantity,
        price: it.price,
        total: it.price * it.quantity,
        status: it.status,
      })));
      const subtotal = allItems.reduce((s, i) => s + i.total, 0);
      const gst = Math.round(subtotal * 0.05);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        tableNumber: table.number,
        tableArea: table.area,
        orders: orders.map(o => ({ id: o.id })),
        items: allItems,
        subtotal,
        gst,
        total: subtotal + gst,
      }));
    } else if (pathname === '/api/orders' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const data = JSON.parse(body);
        const order = await prisma.order.create({
          data: {
            tableId: data.tableId,
            type: data.type,
            status: 'pending',
            total: 0,
            items: { create: data.items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity, price: 0, status: 'pending' })) },
          },
          include: { items: true },
        });
        // Update table status
        await prisma.table.update({ where: { id: data.tableId }, data: { status: 'occupied' } });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(order));
      });
    } else if (pathname === '/api/reservations' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', async () => {
        const data = JSON.parse(body);
        const reservation = await prisma.reservation.create({ data });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(reservation));
      });
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  } catch (err) {
    console.error('API Error:', err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: err.message }));
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname.startsWith('/api/')) {
    await handleAPI(req, res);
  } else {
    serveStatic(req, res);
  }
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
