import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// POST /api/reservations - Create a reservation with auto-assigned table
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, guests, occasion, message } = body;

    // Validate required fields
    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Name is required', message: 'Please enter your name' }, { status: 400 });
    }
    if (!phone || !phone.trim()) {
      return NextResponse.json({ success: false, error: 'Phone number is required', message: 'Please enter your phone number' }, { status: 400 });
    }
    if (!date) {
      return NextResponse.json({ success: false, error: 'Date is required', message: 'Please select a reservation date' }, { status: 400 });
    }
    if (!time) {
      return NextResponse.json({ success: false, error: 'Time is required', message: 'Please select a reservation time' }, { status: 400 });
    }

    const guestCount = parseInt(guests);
    if (isNaN(guestCount) || guestCount < 1) {
      return NextResponse.json({ success: false, error: 'Guest count must be at least 1', message: 'Please select the number of guests' }, { status: 400 });
    }
    if (guestCount > 20) {
      return NextResponse.json({ success: false, error: 'Large group booking required', message: 'For groups larger than 20, please call us directly for arrangements.' }, { status: 400 });
    }

    // Validate date is not in the past
    const reservationDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (reservationDate < today) {
      return NextResponse.json({ success: false, error: 'Date cannot be in the past', message: 'Please select a future date for your reservation' }, { status: 400 });
    }

    console.log(`[RESERVATION] Creating reservation: name=${name}, phone=${phone}, date=${date}, time=${time}, guests=${guestCount}`);

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
          { success: false, error: `No tables available for ${guestCount} guests`, message: `We don't have tables that can accommodate ${guestCount} guests. Our largest table seats 10. Please call us for large group arrangements.` },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'All suitable tables are currently reserved', message: 'All tables for your party size are currently reserved or occupied. Please try a different date or time, or call us for assistance.' },
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
      return NextResponse.json({ success: false, error: 'Failed to generate unique code', message: 'Something went wrong. Please try again.' }, { status: 500 });
    }

    // Create reservation and update table status in a transaction
    const reservation = await db.$transaction(async (tx) => {
      const res = await tx.reservation.create({
        data: {
          code,
          name: name.trim(),
          phone: phone.trim(),
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

    console.log(`[RESERVATION] Created successfully: code=${code}, table=${availableTable.number}, name=${name}`);

    return NextResponse.json({ success: true, data: reservation, message: 'Reservation confirmed! Your table has been assigned.' }, { status: 201 });
  } catch (error) {
    console.error('[RESERVATION] Creation error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create reservation', message: 'Unable to create your reservation right now. Please try again or call us.' }, { status: 500 });
  }
}
