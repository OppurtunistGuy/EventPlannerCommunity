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

    return NextResponse.json({ success: true, data: orders, message: 'Orders fetched' });
  } catch (error) {
    console.error('[ORDERS] Fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch orders', message: 'Unable to fetch orders' }, { status: 500 });
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, items, type, notes } = body;

    if (!tableId || !items || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Table ID and items are required', message: 'Please select a table and add items to your order' }, { status: 400 });
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

    console.log(`[ORDERS] Creating order for table ${tableId}: ${items.length} items, total ₹${total}`);

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

    console.log(`[ORDERS] Order ${order.id} created successfully`);

    return NextResponse.json({ success: true, data: order, message: 'Order placed successfully' }, { status: 201 });
  } catch (error) {
    console.error('[ORDERS] Creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create order', message: 'Unable to place your order. Please try again.' }, { status: 500 });
  }
}

// PATCH /api/orders - Update order status
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, status } = body;

    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required', message: 'Order ID is required' }, { status: 400 });
    }

    const order = await db.order.update({
      where: { id: orderId },
      data: { status: status || 'pending' },
    });

    console.log(`[ORDERS] Updated order ${orderId} status to ${status}`);

    return NextResponse.json({ success: true, data: order, message: 'Order updated' });
  } catch (error) {
    console.error('[ORDERS] Update error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update order', message: 'Unable to update order status' }, { status: 500 });
  }
}
