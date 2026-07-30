import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/tables - Fetch all tables
export async function GET() {
  try {
    const tables = await db.table.findMany({
      orderBy: { number: 'asc' },
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
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Tables fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}
