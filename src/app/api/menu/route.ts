import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/menu - Fetch full menu organized by tab
export async function GET() {
  try {
    const categories = await db.menuCategory.findMany({
      orderBy: { order: 'asc' },
      include: {
        items: {
          orderBy: { order: 'asc' },
        },
      },
    });

    // Group by tab
    const menuByTab: Record<string, any[]> = {};
    for (const cat of categories) {
      if (!menuByTab[cat.tab]) menuByTab[cat.tab] = [];
      menuByTab[cat.tab].push(cat);
    }

    return NextResponse.json(menuByTab);
  } catch (error) {
    console.error('Menu fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
