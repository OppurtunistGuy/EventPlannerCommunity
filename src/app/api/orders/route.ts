import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const status = searchParams.get('status');

    const where: Record<string, unknown> = {};
    if (tableId) where.tableId = tableId;
    if (status) where.status = status;

    const orders = await db.order.findMany({
      where,
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
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

    // Calculate total
    const menuItemIds = items.map((item: { menuItemId: string }) => item.menuItemId);
    const menuItems = await db.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });

    const menuMap = new Map(menuItems.map((mi) => [mi.id, mi]));
    let total = 0;
    const orderItems = items.map((item: { menuItemId: string; quantity: number; notes?: string }) => {
      const mi = menuMap.get(item.menuItemId);
      if (!mi) throw new Error(`Menu item ${item.menuItemId} not found`);
      total += mi.price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price: mi.price,
        notes: item.notes || null,
      };
    });

    // Create order
    const order = await db.order.create({
      data: {
        tableId,
        type: type || 'dine-in',
        notes: notes || null,
        total,
        items: {
          create: orderItems,
        },
      },
      include: {
        table: true,
        items: { include: { menuItem: true } },
      },
    });

    // Update table status to occupied
    await db.table.update({
      where: { id: tableId },
      data: { status: 'occupied' },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status, itemId, itemStatus } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Update individual item status
    if (itemId && itemStatus) {
      await db.orderItem.update({
        where: { id: itemId },
        data: { status: itemStatus },
      });
    }

    // Update order status
    if (status) {
      const updated = await db.order.update({
        where: { id: orderId },
        data: { status },
        include: { table: true, items: { include: { menuItem: true } } },
      });

      // If billed, set table back to available
      if (status === 'billed') {
        await db.table.update({
          where: { id: updated.tableId },
          data: { status: 'available' },
        });
      }

      return NextResponse.json(updated);
    }

    return NextResponse.json({ error: 'No update provided' }, { status: 400 });
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
