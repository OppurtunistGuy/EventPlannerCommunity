import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

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
    const grouped = categories.reduce((acc, cat) => {
      if (!acc[cat.tab]) acc[cat.tab] = [];
      acc[cat.tab].push(cat);
      return acc;
    }, {} as Record<string, typeof categories>);

    return NextResponse.json(grouped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch menu' }, { status: 500 });
  }
}
