import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/bill?tableId=xxx - Generate bill for a table
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tableId = searchParams.get('tableId');

    if (!tableId) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

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
      return NextResponse.json({
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

    return NextResponse.json({
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
    console.error('Bill generation error:', error);
    return NextResponse.json({ error: 'Failed to generate bill' }, { status: 500 });
  }
}

// POST /api/bill - Create a bill request (customer clicks "Bill Request")
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tableId, reservationId } = body;

    if (!tableId) {
      return NextResponse.json({ error: 'Table ID is required' }, { status: 400 });
    }

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
      return NextResponse.json({ error: 'No active orders to bill' }, { status: 400 });
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

    return NextResponse.json({
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
    console.error('Bill request error:', error);
    return NextResponse.json({ error: 'Failed to create bill request' }, { status: 500 });
  }
}

// PATCH /api/bill - Settle a bill
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { billId } = body;

    if (!billId) {
      return NextResponse.json({ error: 'Bill ID is required' }, { status: 400 });
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

    return NextResponse.json(bill);
  } catch (error) {
    console.error('Bill settle error:', error);
    return NextResponse.json({ error: 'Failed to settle bill' }, { status: 500 });
  }
}
