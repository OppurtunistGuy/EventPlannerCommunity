import { NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    if (!tableId) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }
    const data = readFileSync(join(process.cwd(), 'public/data/tables.json'), 'utf8');
    const tables = JSON.parse(data);
    const table = tables.find((t: any) => t.id === tableId);
    if (!table || !table.orders || table.orders.length === 0) {
      return NextResponse.json({ tableId, orders: [], items: [], subtotal: 0, gst: 0, total: 0, message: 'No active orders' });
    }
    const allItems = table.orders.flatMap((o: any) => o.items || []);
    const subtotal = allItems.reduce((s: number, i: any) => s + i.price * i.quantity, 0);
    const gst = Math.round(subtotal * 0.05);
    return NextResponse.json({
      tableId,
      tableNumber: table.number,
      tableArea: table.area,
      orders: table.orders.map((o: any) => ({ id: o.id, status: o.status, createdAt: o.createdAt, total: o.total, itemCount: o.items?.length || 0 })),
      items: allItems.map((i: any) => ({ id: i.id, name: i.menuItem?.name || 'Item', isVeg: i.menuItem?.isVeg || true, quantity: i.quantity, price: i.price, total: i.price * i.quantity, status: i.status })),
      subtotal, gst, gstRate: '5%', total: subtotal + gst,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate bill' }, { status: 500 });
  }
}
