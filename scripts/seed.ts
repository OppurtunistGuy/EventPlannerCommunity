import { db } from '../src/lib/db';

async function seed() {
  console.log('🌱 Seeding database...');

  // COFFEE MENU
  const coffeeCategory = await db.menuCategory.create({
    data: {
      name: 'Coffee Menu (Served All Day)',
      slug: 'coffee',
      icon: '☕',
      description: 'Premium coffee crafted with care',
      tab: 'coffee',
      order: 1,
    }
  });

  const coffeeItems = [
    { name: 'Café Latte / Iced Café Latte', price: 190, isVeg: true },
    { name: 'Cappuccino', price: 190, isVeg: true },
    { name: 'Americano / Iced Americano', price: 150, isVeg: true },
    { name: 'Macchiato', price: 150, isVeg: true },
    { name: 'Flat White', price: 190, isVeg: true },
    { name: 'Latte Macchiato', price: 150, isVeg: true },
  ];

  for (let i = 0; i < coffeeItems.length; i++) {
    await db.menuItem.create({
      data: { ...coffeeItems[i], categoryId: coffeeCategory.id, order: i + 1 }
    });
  }

  // OFFERS (12-6 PM)
  const offersCategory = await db.menuCategory.create({
    data: {
      name: 'Happy Hour (12pm – 6pm)',
      slug: 'offers',
      icon: '🎉',
      description: 'Best deals in Pune — every afternoon!',
      tab: 'offers',
      order: 1,
    }
  });

  const offerItems = [
    { name: 'Beer', description: 'Kingfisher Premium', price: 100, isVeg: true, isBestseller: true },
    { name: 'Gin & Tonic', description: 'Greater Than Gin + Tonic', price: 150, isVeg: true },
    { name: 'Cocktails', description: 'Select signature cocktails', price: 150, isVeg: true, isBestseller: true },
    { name: 'Mimosa', description: 'Sparkling wine + orange juice', price: 130, isVeg: true },
    { name: 'Draft Beer Pitcher (1L)', description: 'Kingfisher Draft', price: 500, isVeg: true },
    { name: 'Cocktail Pitchers', description: 'Select cocktail pitchers', price: 600, isVeg: true },
  ];

  for (let i = 0; i < offerItems.length; i++) {
    await db.menuItem.create({
      data: { ...offerItems[i], categoryId: offersCategory.id, order: i + 1 }
    });
  }

  // FOOD MENU
  const foodTabs = [
    {
      name: 'Eggs to Order', slug: 'eggs', icon: '🍳', tab: 'food', order: 1,
      items: [
        { name: 'Boiled Eggs (2)', price: 159, isVeg: true },
        { name: 'Poached Eggs (2)', price: 159, isVeg: true },
        { name: 'Sunny Side Up (2)', price: 179, isVeg: true },
        { name: 'Omelette — Cheese & Herb', price: 229, isVeg: true },
        { name: 'Frittata — Mushroom & Spinach', price: 249, isVeg: true },
        { name: 'Eggs Benedict', price: 279, isVeg: false, isBestseller: true },
        { name: 'Shakshouka', price: 289, isVeg: true, isBestseller: true },
      ]
    },
    {
      name: 'Sides', slug: 'sides', icon: '🥔', tab: 'food', order: 2,
      items: [
        { name: 'Potato Wedges', description: 'Crispy golden wedges with dip', price: 149, isVeg: true },
        { name: 'Chicken Sausages', price: 199, isVeg: false },
        { name: 'Ham', price: 199, isVeg: false },
        { name: 'Salami', price: 199, isVeg: false },
      ]
    },
    {
      name: 'Salads', slug: 'salads', icon: '🥗', tab: 'food', order: 3,
      items: [
        { name: 'Caesar Salad', description: 'Romaine, Croutons, Parmesan', price: 319, isVeg: true },
        { name: 'Waldorf Salad', description: 'Apple, Walnut, Celery, Mayo', price: 350, isVeg: true },
      ]
    },
    {
      name: 'Appetizers — Vegetarian', slug: 'appetizers-veg', icon: '🌱', tab: 'food', order: 4,
      items: [
        { name: 'Yuzu Chilli, Peanut, Rice Cracker', price: 259, isVeg: true },
        { name: 'Pea & Butter Garlic Edamame', price: 289, isVeg: true },
        { name: 'Smoked Tomatoes & Avo on Toast', price: 339, isVeg: true },
        { name: 'Nachos, Bean & Cheese', description: 'Loaded with beans and melted cheese', price: 329, isVeg: true, isBestseller: true },
        { name: 'Chilli & Cheese Toast', price: 339, isVeg: true },
        { name: 'Hummus & Beans', price: 329, isVeg: true },
        { name: 'Truffle Broccoli, Side Salad', price: 339, isVeg: true },
        { name: 'Konkani Paneer Chilli, Toddy Vinegar', price: 359, isVeg: true },
        { name: 'Cheese Chilli, French Fries', price: 409, isVeg: true },
        { name: 'Mushroom Malai, Burnt Garlic', price: 419, isVeg: true, isBestseller: true },
        { name: 'Yellow Chilli Paneer, Side Salad', price: 429, isVeg: true, isBestseller: true },
      ]
    },
    {
      name: 'Appetizers — Non-Veg', slug: 'appetizers-nonveg', icon: '🍗', tab: 'food', order: 5,
      items: [
        { name: 'Madras Chicken Taco', price: 369, isVeg: false },
        { name: 'Fried Chicken', description: 'Crispy golden fried chicken', price: 399, isVeg: false, isBestseller: true },
        { name: 'Jolokia Wings', description: 'Spicy ghost pepper chicken wings', price: 379, isVeg: false, isBestseller: true },
        { name: 'Mutton Taco', price: 489, isVeg: false },
        { name: 'Prawn in Parotha', price: 599, isVeg: false },
        { name: 'Piri Piri Calamari', price: 599, isVeg: false },
      ]
    },
    {
      name: 'Sushi (8 pcs)', slug: 'sushi', icon: '🍣', tab: 'food', order: 6,
      items: [
        { name: 'Asparagus Tempura Sushi', price: 799, isVeg: true },
        { name: 'Prawn Tempura Sushi', price: 849, isVeg: false },
        { name: 'Salmon Maki Sushi', price: 949, isVeg: false, isBestseller: true },
      ]
    },
    {
      name: 'Neapolitan Pizza', slug: 'pizza', icon: '🍕', tab: 'food', order: 7,
      items: [
        { name: 'Rosso — Tomato & Basil', price: 509, isVeg: true },
        { name: 'Butter Chicken Pizza', description: 'Our legendary butter chicken on pizza', price: 599, isVeg: false, isBestseller: true },
        { name: 'Chicken Pepperoni Pizza', price: 599, isVeg: false },
      ]
    },
    {
      name: 'Large Plates', slug: 'large-plates', icon: '🍽️', tab: 'food', order: 8,
      items: [
        { name: 'Egg Fried Rice', price: 309, isVeg: true },
        { name: 'Truffle Smoked Pasta', price: 369, isVeg: true, isBestseller: true },
        { name: 'Steak Mash & Hoisin', price: 469, isVeg: false },
        { name: 'Chicken Steak', description: 'Grilled chicken steak with sauce', price: 499, isVeg: false, isBestseller: true },
      ]
    },
    {
      name: 'Dessert', slug: 'dessert', icon: '🍰', tab: 'food', order: 9,
      items: [
        { name: 'Caramel Brownie, Ice Cream', description: 'Warm brownie with vanilla ice cream', price: 269, isVeg: true, isBestseller: true },
        { name: 'Cookie Dough', description: 'Warm cookie dough with chocolate chunks', price: 349, isVeg: true },
      ]
    },
  ];

  for (const tab of foodTabs) {
    const category = await db.menuCategory.create({
      data: { name: tab.name, slug: tab.slug, icon: tab.icon, tab: tab.tab, order: tab.order }
    });
    for (let i = 0; i < tab.items.length; i++) {
      await db.menuItem.create({ data: { ...tab.items[i], categoryId: category.id, order: i + 1 } });
    }
  }

  // BAR MENU
  const barTabs = [
    {
      name: 'Shots Fired', slug: 'shots-fired', icon: '🔫', tab: 'bar', order: 1,
      items: [
        { name: 'STELLAR NUTELLA', description: 'Smirnoff Vodka, Nutella, Whipped Cream', price: 345, isVeg: true },
        { name: 'AYE CARAMBA', description: 'Camino Tequila, Sambuca, Cranberry, Tabasco', price: 470, isVeg: true },
        { name: 'BRAIN DAMAGE', description: 'Sambuca, Baileys, Grenadine', price: 520, isVeg: true, isBestseller: true },
        { name: 'SPICY PICKLE BACK', description: 'Jameson & Brine', price: 300, isVeg: true },
        { name: 'EL NINO', description: 'Camino Tequila, Strawberry & Jalapeño', price: 350, isVeg: true },
        { name: 'JAGER HEAVEN', description: 'Spiced Rum, Jägermeister & Baileys', price: 550, isVeg: true },
        { name: 'INDIAN SUMMER', description: 'Vodka, Triple Sec, Mint & Cardamom', price: 210, isVeg: true },
        { name: 'BROWN MUNDE', description: 'Whisky, Coffee Liqueur, Cream', price: 210, isVeg: true },
      ]
    },
    {
      name: 'Mojitos & Caipiroskas', slug: 'mojitos', icon: '🍸', tab: 'bar', order: 2,
      items: [
        { name: 'Classic Mojito', description: 'White rum, mint, lime, soda', price: 450, isVeg: true, isBestseller: true },
        { name: 'Flavoured Mojito', description: 'Strawberry / Passion Fruit / Watermelon', price: 480, isVeg: true },
        { name: 'Classic Caipiroska', description: 'Vodka, lime, sugar', price: 450, isVeg: true },
        { name: 'Flavoured Caipiroska', description: 'Strawberry / Passion Fruit / Kiwi', price: 480, isVeg: true },
      ]
    },
    {
      name: 'Signature Cocktails', slug: 'signature-cocktails', icon: '✨', tab: 'bar', order: 3,
      items: [
        { name: 'Jungle Juice', description: 'A tropical explosion of fruits & vodka', price: 480, isVeg: true, isBestseller: true },
        { name: 'Kerala South Side', description: 'Gin, lime, coconut, curry leaf', price: 600, isVeg: true },
        { name: 'Ping Pong', description: 'Vodka, peach, elderflower, soda', price: 600, isVeg: true },
        { name: 'Blue Jizz', description: 'Blue Curacao, Vodka, Lemon', price: 600, isVeg: true },
        { name: 'Jack\'s Love', description: 'JD, peach schnapps, cranberry', price: 480, isVeg: true, isBestseller: true },
        { name: 'Mud Slide', description: 'Vodka, Kahlúa, Baileys, cream', price: 600, isVeg: true },
        { name: 'Clint Eastwood', description: 'JD, ginger beer, lime', price: 710, isVeg: true },
      ]
    },
    {
      name: 'The Classics', slug: 'the-classics', icon: '🥃', tab: 'bar', order: 4,
      items: [
        { name: 'Old Fashioned', description: 'Bourbon, bitters, sugar, orange', price: 500, isVeg: true },
        { name: 'Whiskey Sour', description: 'Whiskey, lemon, egg white', price: 500, isVeg: true },
        { name: 'Aperol Spritz', description: 'Aperol, prosecco, soda', price: 600, isVeg: true },
        { name: 'Negroni', description: 'Gin, Campari, vermouth', price: 650, isVeg: true },
        { name: 'Classic Margarita', description: 'Tequila, lime, triple sec', price: 500, isVeg: true },
        { name: 'Flavoured Margarita', description: 'Strawberry / Mango / Passion Fruit', price: 550, isVeg: true },
      ]
    },
    {
      name: 'Homies Pitchers', slug: 'homies-pitchers', icon: '🫗', tab: 'bar', order: 5,
      items: [
        { name: 'THE BARMAN\'S PITCHER', description: 'The bartender\'s secret mix', price: 2130, isVeg: true, isBestseller: true },
        { name: 'Mojito / Caipiroska Pitcher', price: 2000, isVeg: true },
        { name: 'Long Island Iced Tea Pitcher', description: '5 spirits, cola, lemon', price: 2650, isVeg: true, isBestseller: true },
        { name: 'HOMIE LIIT Pitcher', description: 'Our legendary extra-strength LIIT', price: 3100, isVeg: true },
      ]
    },
    {
      name: 'Beer', slug: 'beer', icon: '🍺', tab: 'bar', order: 6,
      items: [
        { name: 'Kingfisher Premium', price: 270, isVeg: true },
        { name: 'Kingfisher Draft (330ml)', price: 270, isVeg: true },
        { name: 'Budweiser', price: 350, isVeg: true },
        { name: 'Heineken', price: 400, isVeg: true },
        { name: 'Corona', price: 430, isVeg: true },
        { name: 'Hoegaarden Wheat', price: 450, isVeg: true },
        { name: 'Kingfisher Draft Pitcher (1L)', price: 500, isVeg: true, isBestseller: true },
      ]
    },
    {
      name: 'Mocktails & Soft Drinks', slug: 'mocktails', icon: '🧃', tab: 'bar', order: 7,
      items: [
        { name: 'Virgin Mojito', price: 230, isVeg: true },
        { name: 'Virgin Colada', price: 230, isVeg: true },
        { name: 'Virgin Mary', price: 230, isVeg: true },
        { name: 'Red Bull', price: 250, isVeg: true },
        { name: 'Fresh Lime Soda', price: 120, isVeg: true },
        { name: 'Coca-Cola / Pepsi', price: 100, isVeg: true },
      ]
    },
  ];

  for (const tab of barTabs) {
    const category = await db.menuCategory.create({
      data: { name: tab.name, slug: tab.slug, icon: tab.icon, tab: tab.tab, order: tab.order }
    });
    for (let i = 0; i < tab.items.length; i++) {
      await db.menuItem.create({ data: { ...tab.items[i], categoryId: category.id, order: i + 1 } });
    }
  }

  // VINTAGE (TUE & THU)
  const vintageTabs = [
    {
      name: 'Vintage Cocktails', slug: 'vintage-cocktails', icon: '🍸', tab: 'vintage', order: 1,
      items: [
        { name: 'Jungle Juice', price: 220, isVeg: true, isBestseller: true },
        { name: 'Life\'s a Peach', price: 220, isVeg: true },
        { name: 'Shake & Bake', price: 220, isVeg: true },
        { name: 'Dirty Pirate', price: 220, isVeg: true },
        { name: 'Mojito', price: 220, isVeg: true, isBestseller: true },
        { name: 'Flavoured Mojito', price: 220, isVeg: true },
        { name: 'Red / White Sangria', price: 120, isVeg: true, isBestseller: true },
        { name: 'Caipiroska', price: 220, isVeg: true },
        { name: 'Flavoured Caipiroska', price: 220, isVeg: true },
        { name: 'Mimosa', price: 220, isVeg: true },
      ]
    },
    {
      name: 'Vintage Spirits', slug: 'vintage-spirits', icon: '🥃', tab: 'vintage', order: 2,
      items: [
        { name: 'Old Monk', price: 120, isVeg: true, isBestseller: true },
        { name: 'Bacardi White Rum', price: 150, isVeg: true },
        { name: 'Smirnoff Vodka', price: 150, isVeg: true },
        { name: 'Greater Than Gin', price: 180, isVeg: true },
      ]
    },
  ];

  for (const tab of vintageTabs) {
    const category = await db.menuCategory.create({
      data: { name: tab.name, slug: tab.slug, icon: tab.icon, tab: tab.tab, order: tab.order }
    });
    for (let i = 0; i < tab.items.length; i++) {
      await db.menuItem.create({ data: { ...tab.items[i], categoryId: category.id, order: i + 1 } });
    }
  }

  // EVENTS
  const events = [
    {
      title: 'Saturday Night Live — The Local Train',
      description: 'India\'s favourite indie rock band live at High Spirits! Get ready for an unforgettable night of music, energy, and great vibes.',
      date: 'Every Saturday',
      time: '8:30 PM onwards',
      type: 'live',
      isFeatured: true,
    },
    {
      title: 'Wednesday Open Mic Night',
      description: 'Got talent? Show it off! Poetry, music, comedy — the stage is yours. Sign up at the bar.',
      date: 'Every Wednesday',
      time: '8:00 PM',
      type: 'open-mic',
      isFeatured: true,
    },
    {
      title: 'Vintage Tuesdays & Thursdays',
      description: 'Budget booze nights! Cocktails at ₹220, Sangria at ₹120, Old Monk at ₹120. The best deals in Pune.',
      date: 'Every Tue & Thu',
      time: 'All day',
      type: 'themed',
    },
    {
      title: 'Sunday Sundowner Session',
      description: 'Chill vibes, acoustic sets, and the perfect Sunday unwind. Cocktails, sunshine, and good company.',
      date: 'Every Sunday',
      time: '4:00 PM – 9:00 PM',
      type: 'dj',
    },
    {
      title: 'Happy Hour — 12 to 6 Daily',
      description: 'Beer ₹100, Cocktails ₹150, Mimosa ₹130. The cheapest happy hour in Koregaon Park!',
      date: 'Every Day',
      time: '12:00 PM – 6:00 PM',
      type: 'themed',
      isFeatured: true,
    },
  ];

  for (const event of events) {
    await db.event.create({ data: event });
  }

  console.log('✅ Seeding complete!');
  console.log(`  - Menu categories: ${await db.menuCategory.count()}`);
  console.log(`  - Menu items: ${await db.menuItem.count()}`);
  console.log(`  - Events: ${await db.event.count()}`);
}

seed().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
