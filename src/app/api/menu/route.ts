import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/menu - Fetch full menu organized by tab
export async function GET() {
  try {
    console.log('[MENU] Fetching menu data');
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

    const totalItems = categories.reduce((sum, cat) => sum + cat.items.length, 0);
    console.log(`[MENU] Loaded ${categories.length} categories, ${totalItems} items across ${Object.keys(menuByTab).length} tabs`);

    return NextResponse.json({ success: true, data: menuByTab, message: 'Menu loaded' });
  } catch (error) {
    console.error('[MENU] Fetch error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch menu', message: 'Unable to load menu. Please try again.' }, { status: 500 });
  }
}
