import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/reservations/lookup?code=XXXXXX - Look up a reservation by code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Reservation code is required' }, { status: 400 });
    }

    const reservation = await db.reservation.findUnique({
      where: { code },
      include: {
        table: {
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
        },
      },
    });

    if (!reservation) {
      return NextResponse.json({ error: 'No reservation found with this code' }, { status: 404 });
    }

    if (reservation.status === 'cancelled') {
      return NextResponse.json({ error: 'This reservation has been cancelled' }, { status: 410 });
    }

    return NextResponse.json(reservation);
  } catch (error) {
    console.error('Reservation lookup error:', error);
    return NextResponse.json({ error: 'Failed to look up reservation' }, { status: 500 });
  }
}
