import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const tables = await db.table.findMany({
      orderBy: { number: 'asc' },
      include: {
        orders: {
          where: { status: { in: ['pending', 'preparing', 'ready', 'served'] } },
          include: { items: { include: { menuItem: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    return NextResponse.json(tables);
  } catch (error) {
    console.error('Failed to fetch tables:', error);
    return NextResponse.json({ error: 'Failed to fetch tables' }, { status: 500 });
  }
}
