import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reservations - Create a reservation with auto-assigned table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, guests, occasion, message } = body;

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const guestCount = parseInt(guests);

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
      return NextResponse.json(
        { error: 'No available tables for the requested guest count. Please try a different date or time.' },
        { status: 409 }
      );
    }

    // Generate a unique 6-digit reservation code
    let code = '';
    let isUnique = false;
    while (!isUnique) {
      code = String(Math.floor(100000 + Math.random() * 900000));
      const existing = await db.reservation.findUnique({ where: { code } });
      if (!existing) isUnique = true;
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
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
