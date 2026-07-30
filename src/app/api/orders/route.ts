import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const status = searchParams.get('status');
    const data = readFileSync(join(process.cwd(), 'public/data/orders.json'), 'utf8');
    let orders = JSON.parse(data);
    if (tableId) orders = orders.filter((o: any) => o.tableId === tableId);
    if (status) orders = orders.filter((o: any) => o.status === status);
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, items, type, notes } = body;
    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Table ID and items are required' }, { status: 400 });
    }
    const menuData = JSON.parse(readFileSync(join(process.cwd(), 'public/data/menu.json'), 'utf8'));
    const allMenuItems = Object.values(menuData).flat().flatMap((c: any) => c.items || []);
    const menuItemMap = Object.fromEntries(allMenuItems.map((mi: any) => [mi.id, mi]));
    let total = 0;
    const orderItems = items.map((item: any) => {
      const mi = menuItemMap[item.menuItemId];
      const price = mi ? mi.price : 0;
      total += price * item.quantity;
      return { menuItemId: item.menuItemId, quantity: item.quantity, price, notes: item.notes || null, status: 'pending' };
    });
    const order = { id: 'ord-' + Date.now(), tableId, type: type || 'dine-in', notes: notes || null, total, status: 'pending', items: orderItems, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;
    if (!orderId) return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    return NextResponse.json({ id: orderId, status: status || 'pending', updated: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
