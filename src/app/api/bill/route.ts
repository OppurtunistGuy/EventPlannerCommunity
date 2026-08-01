import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/bill?tableId=xxx - Generate bill for a table
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');

    if (!tableId) {
      return NextResponse.json({ success: false, error: 'Table ID is required', message: 'Table ID is required' }, { status: 400 });
    }

    console.log('[BILL] Fetching bill for table:', tableId);

    const table = await db.table.findUnique({
      where: { id: tableId },
      include: {
        orders: {
          where: { status: { in: ['pending', 'preparing', 'ready', 'served'] } },
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    if (!table || table.orders.length === 0) {
      console.log('[BILL] No active orders for table:', tableId);
      return NextResponse.json({
        success: true,
        tableId,
        orders: [],
        items: [],
        subtotal: 0,
        gst: 0,
        total: 0,
        message: 'No active orders',
      });
    }

    const allItems = table.orders.flatMap((o: any) =>
      (o.items || []).map((i: any) => ({
        id: i.id,
        name: i.menuItem?.name || 'Item',
        isVeg: i.menuItem?.isVeg ?? true,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
        status: i.status,
      }))
    );

    const subtotal = allItems.reduce((s: number, i: any) => s + i.total, 0);
    const gst = Math.round(subtotal * 0.05);

    console.log(`[BILL] Generated bill for table ${table.number}: ${allItems.length} items, total ₹${subtotal + gst}`);

    return NextResponse.json({
      success: true,
      tableId,
      tableNumber: table.number,
      tableArea: table.area,
      orders: table.orders.map((o: any) => ({
        id: o.id,
        status: o.status,
        createdAt: o.createdAt,
        total: o.total,
        itemCount: o.items?.length || 0,
      })),
      items: allItems,
      subtotal,
      gst,
      gstRate: '5%',
      total: subtotal + gst,
    });
  } catch (error) {
    console.error('[BILL] Generation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate bill', message: 'Unable to generate bill. Please try again.' }, { status: 500 });
  }
}

// POST /api/bill - Create a bill request (customer clicks "Bill Request")
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, reservationId } = body;

    if (!tableId) {
      return NextResponse.json({ success: false, error: 'Table ID is required', message: 'Table ID is required' }, { status: 400 });
    }

    console.log('[BILL] Creating bill request for table:', tableId);

    // Get all active orders for this table
    const table = await db.table.findUnique({
      where: { id: tableId },
      include: {
        orders: {
          where: { status: { in: ['pending', 'preparing', 'ready', 'served'] } },
          include: {
            items: {
              include: {
                menuItem: true,
              },
            },
          },
        },
      },
    });

    if (!table || table.orders.length === 0) {
      return NextResponse.json({ success: false, error: 'No active orders to bill', message: 'No active orders found. Place an order first.' }, { status: 400 });
    }

    const allItems = table.orders.flatMap((o: any) =>
      (o.items || []).map((i: any) => ({
        id: i.id,
        name: i.menuItem?.name || 'Item',
        isVeg: i.menuItem?.isVeg ?? true,
        quantity: i.quantity,
        price: i.price,
        total: i.price * i.quantity,
        status: i.status,
      }))
    );

    const subtotal = allItems.reduce((s: number, i: any) => s + i.total, 0);
    const gst = Math.round(subtotal * 0.05);
    const total = subtotal + gst;

    // Create bill and mark orders as billed in transaction
    const bill = await db.$transaction(async (tx) => {
      const newBill = await tx.bill.create({
        data: {
          tableId,
          reservationId: reservationId || null,
          subtotal,
          gst,
          total,
          status: 'generated',
        },
      });

      // Mark all orders as billed
      for (const order of table.orders) {
        await tx.order.update({
          where: { id: order.id },
          data: { status: 'billed' },
        });
      }

      return newBill;
    });

    console.log(`[BILL] Created bill ${bill.id} for table ${table.number}: ₹${total}`);

    return NextResponse.json({
      success: true,
      billId: bill.id,
      tableId,
      tableNumber: table.number,
      tableArea: table.area,
      orders: table.orders.map((o: any) => ({
        id: o.id,
        status: 'billed',
        createdAt: o.createdAt,
        total: o.total,
        itemCount: o.items?.length || 0,
      })),
      items: allItems,
      subtotal,
      gst,
      gstRate: '5%',
      total,
    }, { status: 201 });
  } catch (error) {
    console.error('[BILL] Request error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create bill request', message: 'Unable to create bill. Please try again.' }, { status: 500 });
  }
}

// PATCH /api/bill - Settle a bill
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { billId } = body;

    if (!billId) {
      return NextResponse.json({ success: false, error: 'Bill ID is required', message: 'Bill ID is required' }, { status: 400 });
    }

    const bill = await db.bill.update({
      where: { id: billId },
      data: {
        status: 'settled',
        settledAt: new Date(),
      },
    });

    // Mark the table as available again
    await db.table.update({
      where: { id: bill.tableId },
      data: { status: 'available' },
    });

    // Mark reservation as completed if linked
    if (bill.reservationId) {
      await db.reservation.update({
        where: { id: bill.reservationId },
        data: { status: 'completed' },
      });
    }

    console.log(`[BILL] Settled bill ${bill.id}, table freed`);

    return NextResponse.json({ success: true, data: bill, message: 'Bill settled successfully' });
  } catch (error) {
    console.error('[BILL] Settle error:', error);
    return NextResponse.json({ success: false, error: 'Failed to settle bill', message: 'Unable to settle bill. Please try again.' }, { status: 500 });
  }
}
