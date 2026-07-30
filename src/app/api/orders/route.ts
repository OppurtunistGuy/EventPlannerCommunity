import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/orders - Fetch orders (filterable by tableId or status)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');
    const status = searchParams.get('status');

    const where: any = {};
    if (tableId) where.tableId = tableId;
    if (status) where.status = status;

    const orders = await db.order.findMany({
      where,
      include: {
        items: {
          include: {
            menuItem: true,
          },
        },
        table: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, items, type, notes } = body;

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ error: 'Table ID and items are required' }, { status: 400 });
    }

    // Look up menu item prices
    const menuItemIds = items.map((item: any) => item.menuItemId);
    const menuItems = await db.menuItem.findMany({
      where: { id: { in: menuItemIds } },
    });
    const menuItemMap = Object.fromEntries(menuItems.map((mi: any) => [mi.id, mi]));

    let total = 0;
    const orderItemsData = items.map((item: any) => {
      const mi = menuItemMap[item.menuItemId];
      const price = mi ? mi.price : 0;
      total += price * item.quantity;
      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        price,
        notes: item.notes || null,
        status: 'pending',
      };
    });

    // Create order and update table status in transaction
    const order = await db.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          tableId,
          type: type || 'dine-in',
          notes: notes || null,
          total,
          status: 'pending',
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: {
            include: {
              menuItem: true,
            },
          },
        },
      });

      // Mark table as occupied
      await tx.table.update({
        where: { id: tableId },
        data: { status: 'occupied' },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status: status || 'pending' },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Order update error:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
