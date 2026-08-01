import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/tables - Fetch all tables
export async function GET() {
  try {
    console.log('[TABLES] Fetching all tables');
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
    console.log(`[TABLES] Loaded ${tables.length} tables`);
    return NextResponse.json({ success: true, data: tables, message: 'Tables loaded' });
  } catch (error) {
    console.error('[TABLES] Fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch tables', message: 'Unable to load tables' }, { status: 500 });
  }
}
