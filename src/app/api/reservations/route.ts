import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, date, time, guests, occasion, message } = body;

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const reservation = await db.reservation.create({
      data: {
        name,
        phone,
        email: email || null,
        date,
        time,
        guests: parseInt(guests),
        occasion: occasion || null,
        message: message || null,
      },
    });

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create reservation' }, { status: 500 });
  }
}
