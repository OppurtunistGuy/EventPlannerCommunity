import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/reservations/lookup?code=XXXXXX - Look up a reservation by code
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json({ success: false, error: 'Reservation code is required', message: 'Please enter a reservation code' }, { status: 400 });
    }

    // Validate code format (6 digits)
    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json({ success: false, error: 'Invalid reservation code format', message: 'Reservation code must be exactly 6 digits' }, { status: 400 });
    }

    // DEMO MODE: Code 777777 always works regardless of database state
    if (code === '777777') {
      // Try to find the actual reservation first
      const existingReservation = await db.reservation.findUnique({
        where: { code: '777777' },
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

      if (existingReservation && existingReservation.status !== 'cancelled') {
        return NextResponse.json({ success: true, data: existingReservation, message: 'Reservation found' });
      }

      // Fallback: return synthetic demo reservation
      // Find table 7 or create a demo table reference
      const table7 = await db.table.findFirst({ where: { number: 7 } });

      const demoReservation = {
        id: 'demo-777777',
        code: '777777',
        name: 'Demo Customer',
        phone: '9999999999',
        email: 'demo@highspirits.com',
        date: new Date().toISOString().split('T')[0],
        time: '19:00',
        guests: 2,
        occasion: 'casual',
        message: 'Demo reservation',
        status: 'confirmed',
        tableId: table7?.id || 'demo-table-7',
        createdAt: new Date().toISOString(),
        table: table7 || {
          id: 'demo-table-7',
          number: 7,
          capacity: 6,
          area: 'indoor',
          status: 'reserved',
          orders: [],
        },
      };

      return NextResponse.json({ success: true, data: demoReservation, message: 'Demo reservation found' });
    }

    // Normal lookup
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
      return NextResponse.json({ success: false, error: 'No reservation found with this code', message: 'Reservation not found. Please check your 6-digit code and try again.' }, { status: 404 });
    }

    if (reservation.status === 'cancelled') {
      return NextResponse.json({ success: false, error: 'This reservation has been cancelled', message: 'This reservation was cancelled. Please make a new reservation.' }, { status: 410 });
    }

    if (reservation.status === 'completed') {
      return NextResponse.json({ success: false, error: 'This reservation has been completed', message: 'This reservation has already been completed. Please make a new reservation.' }, { status: 410 });
    }

    console.log(`[RESERVATION] Lookup successful: code=${code}, name=${reservation.name}, table=${reservation.table?.number}`);

    return NextResponse.json({ success: true, data: reservation, message: 'Reservation found' });
  } catch (error) {
    console.error('[RESERVATION] Lookup error:', error);
    return NextResponse.json({ success: false, error: 'Failed to look up reservation', message: 'Unable to look up reservation. Please try again.' }, { status: 500 });
  }
}
