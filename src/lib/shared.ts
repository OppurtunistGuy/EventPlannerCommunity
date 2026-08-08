// ==========================================
// SHARED TYPES
// ==========================================

export interface MenuItem {
  id: string; name: string; description?: string; price: number;
  isVeg: boolean; isBestseller: boolean; isNew: boolean; order: number;
}

export interface MenuCategory {
  id: string; name: string; slug: string; icon: string;
  description?: string; tab: string; order: number; items: MenuItem[];
}

export interface EventData {
  id: string; title: string; description: string; date: string;
  time: string; type: string; image: string | null; isFeatured: boolean;
}

export interface TableInfo {
  id: string; number: number; capacity: number; area: string; status: string;
  orders: OrderInfo[];
}

export interface OrderInfo {
  id: string; status: string; total: number; createdAt: string;
  items: OrderItemInfo[];
}

export interface OrderItemInfo {
  id: string; menuItemId: string; quantity: number; price: number;
  notes?: string; status: string; menuItem: MenuItem;
}

export interface CartItem {
  menuItem: MenuItem; quantity: number;
}

export interface ReservationForm {
  name: string; phone: string; email: string; date: string;
  time: string; guests: string; occasion: string; message: string;
}

export interface ActiveReservation {
  id: string; code: string; name: string; phone: string; date: string; time: string;
  guests: number; status: string; tableId: string; table: TableInfo;
}

// ==========================================
// CONSTANTS
// ==========================================

export const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg';
export const COCKTAIL_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg';
export const FOOD_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg';
export const INTERIOR_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg';

export const AREA_LABELS: Record<string, string> = {
  indoor: 'Indoor', outdoor: 'Outdoor', bar: 'Bar Counter', vip: 'VIP Lounge',
};

// ==========================================
// HELPERS
// ==========================================

export const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export function safeISTDate(): Date {
  try {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  } catch {
    const now = new Date();
    return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  }
}

export function isRestaurantOpen(): { open: boolean; closesAt: string } {
  try {
    const now = safeISTDate();
    const hour = now.getHours();
    if (hour >= 12 || hour < 1) return { open: true, closesAt: '1:00 AM' };
    return { open: false, closesAt: '12:00 PM' };
  } catch {
    return { open: false, closesAt: '' };
  }
}

export function getHappyHourEnd(): Date {
  const ist = safeISTDate();
  const end = new Date(ist);
  end.setHours(18, 0, 0, 0);
  if (ist >= end) { end.setDate(end.getDate() + 1); }
  return end;
}

export function getTimeLeft(): string {
  try {
    const now = safeISTDate();
    const end = getHappyHourEnd();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Happy Hour starts tomorrow!';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  } catch {
    return '';
  }
}

// Animation variants
export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export const slideInRight = {
  hidden: { x: 360, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } },
  exit: { x: 360, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};

export const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
};
