import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');

    if (!tableId) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

    // Get all active (non-billed, non-cancelled) orders for the table
    const orders = await db.order.findMany({
      where: {
        tableId,
        status: { in: ['pending', 'preparing', 'ready', 'served'] },
      },
      include: {
        items: {
          include: { menuItem: true },
          orderBy: { menuItem: { name: 'asc' } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    if (orders.length === 0) {
      return NextResponse.json({
        tableId,
        orders: [],
        items: [],
        subtotal: 0,
        gst: 0,
        total: 0,
        message: 'No active orders for this table',
      });
    }

    // Aggregate all items across orders
    const allItems = orders.flatMap((order) =>
      order.items.map((item) => ({
        ...item,
        orderId: order.id,
        orderStatus: order.status,
        orderCreatedAt: order.createdAt,
      }))
    );

    const subtotal = allItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const gstRate = 0.05; // 5% GST for restaurants
    const gst = Math.round(subtotal * gstRate);
    const total = subtotal + gst;

    const table = await db.table.findUnique({
      where: { id: tableId },
    });

    return NextResponse.json({
      tableId,
      tableNumber: table?.number,
      tableArea: table?.area,
      orders: orders.map((o) => ({
        id: o.id,
        status: o.status,
        createdAt: o.createdAt,
        total: o.total,
        itemCount: o.items.length,
      })),
      items: allItems.map((item) => ({
        id: item.id,
        name: item.menuItem.name,
        isVeg: item.menuItem.isVeg,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity,
        status: item.status,
        notes: item.notes,
        orderStatus: item.orderStatus,
      })),
      subtotal,
      gst,
      gstRate: '5%',
      total,
    });
  } catch (error) {
    console.error('Failed to generate bill:', error);
    return NextResponse.json({ error: 'Failed to generate bill' }, { status: 500 });
  }
}
