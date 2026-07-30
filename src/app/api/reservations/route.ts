import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reservations - Create a reservation with auto-assigned table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, guests, occasion, message } = body;

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Missing required fields: name, phone, date, time, guests are required' }, { status: 400 });
    }

    const guestCount = parseInt(guests);
    if (isNaN(guestCount) || guestCount < 1) {
      return NextResponse.json({ error: 'Guest count must be a valid number (at least 1)' }, { status: 400 });
    }

    // Find an available table that can fit the guest count
    // Prefer the smallest table that fits
    const availableTable = await db.table.findFirst({
      where: {
        status: 'available',
        capacity: { gte: guestCount },
      },
      orderBy: { capacity: 'asc' },
    });

    if (!availableTable) {
      // Check if any tables exist at all with sufficient capacity
      const anyTableWithCapacity = await db.table.findFirst({
        where: {
          capacity: { gte: guestCount },
        },
      });

      if (!anyTableWithCapacity) {
        return NextResponse.json(
          { error: `No tables available for ${guestCount} guests. Our largest table seats ${guestCount > 10 ? '10' : '8'}. Please call us for large group arrangements.` },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { error: 'All suitable tables are currently reserved or occupied. Please try a different date or time, or call us for assistance.' },
        { status: 409 }
      );
    }

    // Generate a unique 6-digit reservation code
    let code = '';
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 100) {
      code = String(Math.floor(100000 + Math.random() * 900000));
      const existing = await db.reservation.findUnique({ where: { code } });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return NextResponse.json({ error: 'Failed to generate unique reservation code. Please try again.' }, { status: 500 });
    }

    // Create reservation and update table status in a transaction
    const reservation = await db.$transaction(async (tx) => {
      const res = await tx.reservation.create({
        data: {
          code,
          name,
          phone,
          email: email || null,
          date,
          time,
          guests: guestCount,
          occasion: occasion || null,
          message: message || null,
          status: 'confirmed',
          tableId: availableTable.id,
        },
        include: {
          table: true,
        },
      });

      // Mark table as reserved
      await tx.table.update({
        where: { id: availableTable.id },
        data: { status: 'reserved' },
      });

      return res;
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('Reservation creation error:', error);
    return NextResponse.json({ error: 'Failed to create reservation. Please try again.' }, { status: 500 });
  }
}
