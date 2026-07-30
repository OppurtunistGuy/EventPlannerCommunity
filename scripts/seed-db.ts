import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Read menu data from JSON
  const menuData = JSON.parse(readFileSync(join(process.cwd(), 'public/data/menu.json'), 'utf8'));

  // Create menu categories and items
  for (const [tab, categories] of Object.entries(menuData) as [string, any[]][]) {
    for (const cat of categories) {
      const category = await prisma.menuCategory.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, tab, order: cat.order || 0, icon: cat.icon || null, description: cat.description || null },
        create: { id: cat.id, slug: cat.slug, name: cat.name, tab, order: cat.order || 0, icon: cat.icon || null, description: cat.description || null },
      });

      for (const item of cat.items || []) {
        await prisma.menuItem.upsert({
          where: { id: item.id },
          update: {
            name: item.name, description: item.description || null, price: item.price,
            isVeg: item.isVeg, isBestseller: item.isBestseller || false, isNew: item.isNew || false,
            tags: item.tags || null, order: item.order || 0, categoryId: category.id,
          },
          create: {
            id: item.id, name: item.name, description: item.description || null, price: item.price,
            isVeg: item.isVeg, isBestseller: item.isBestseller || false, isNew: item.isNew || false,
            tags: item.tags || null, order: item.order || 0, categoryId: category.id,
          },
        });
      }
    }
  }

  // Create events
  const eventsData = JSON.parse(readFileSync(join(process.cwd(), 'public/data/events.json'), 'utf8'));
  for (const ev of eventsData) {
    await prisma.event.upsert({
      where: { id: ev.id },
      update: { title: ev.title, description: ev.description, date: ev.date, time: ev.time, type: ev.type, isFeatured: ev.isFeatured || false },
      create: { id: ev.id, title: ev.title, description: ev.description, date: ev.date, time: ev.time, type: ev.type, isFeatured: ev.isFeatured || false },
    });
  }

  // Create tables
  const tablesData = JSON.parse(readFileSync(join(process.cwd(), 'public/data/tables.json'), 'utf8'));
  for (const t of tablesData) {
    await prisma.table.upsert({
      where: { number: t.number },
      update: { capacity: t.capacity, area: t.area || null, status: 'available' },
      create: { id: t.id, number: t.number, capacity: t.capacity, area: t.area || null, status: 'available' },
    });
  }

  console.log('Database seeded successfully!');
  console.log('Menu categories:', await prisma.menuCategory.count());
  console.log('Menu items:', await prisma.menuItem.count());
  console.log('Events:', await prisma.event.count());
  console.log('Tables:', await prisma.table.count());
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
