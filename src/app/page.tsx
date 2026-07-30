'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Phone, MapPin, Clock, ChevronDown, ChevronUp,
  Leaf, X, Menu as MenuIcon,
  CalendarDays, Music, Mic, PartyPopper, Sun, Send,
  Instagram, Mail, ArrowUp, Check, Plus, Minus, Trash2,
  Receipt, Users, UtensilsCrossed, ShoppingBag,
  Wine, Coffee, Utensils, Sparkles, Tag, Star, Navigation,
  ExternalLink, Heart, ChevronRight, RefreshCw, Key, Copy, Ticket, FileText
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================
interface MenuItem {
  id: string; name: string; description?: string; price: number;
  isVeg: boolean; isBestseller: boolean; isNew: boolean; order: number;
}
interface MenuCategory {
  id: string; name: string; slug: string; icon: string;
  description?: string; tab: string; order: number; items: MenuItem[];
}
interface Event {
  id: string; title: string; description: string; date: string;
  time: string; type: string; isFeatured: boolean;
}
interface TableInfo {
  id: string; number: number; capacity: number; area: string; status: string;
  orders: OrderInfo[];
}
interface OrderInfo {
  id: string; status: string; total: number; createdAt: string;
  items: OrderItemInfo[];
}
interface OrderItemInfo {
  id: string; menuItemId: string; quantity: number; price: number;
  notes?: string; status: string; menuItem: MenuItem;
}
interface CartItem {
  menuItem: MenuItem; quantity: number;
}
interface ReservationForm {
  name: string; phone: string; email: string; date: string;
  time: string; guests: string; occasion: string; message: string;
}
interface ActiveReservation {
  id: string; code: string; name: string; phone: string; date: string; time: string;
  guests: number; status: string; tableId: string; table: TableInfo;
}

// ==========================================
// CONSTANTS
// ==========================================
const PHONE = '+91 97654 00484';
const PHONE_TEL = 'tel:+919765400484';
const WHATSAPP = 'https://wa.me/919765400484';
const ADDRESS = '35A/1, Near ABC Farm, Behind Burger King, Koregaon Park, Pune 411001';
const EMAIL = 'highspiritscafe@gmail.com';
const INSTAGRAM = 'https://instagram.com/highspiritscafe/';
const GOOGLE_MAPS = 'https://maps.google.com/?q=High+Spirits+Cafe+Koregaon+Park+Pune';
const MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.5!2d73.89!3d18.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMzJzA2LjAiTiA3M8KwNTMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg';
const COCKTAIL_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg';
const FOOD_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg';
const INTERIOR_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg';

const TABS = [
  { key: 'offers', label: 'Happy Hour', icon: Tag },
  { key: 'coffee', label: 'Coffee', icon: Coffee },
  { key: 'food', label: 'Food', icon: Utensils },
  { key: 'bar', label: 'Bar', icon: Wine },
  { key: 'vintage', label: 'Vintage', icon: Sparkles },
] as const;

const AREA_LABELS: Record<string, string> = {
  indoor: 'Indoor', outdoor: 'Outdoor', bar: 'Bar Counter', vip: 'VIP Lounge',
};

// ==========================================
// HELPERS
// ==========================================
const fmt = (n: number) => `₹${n.toLocaleString('en-IN')}`;

function safeISTDate(): Date {
  try {
    return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  } catch {
    // Fallback: UTC+5:30 offset
    const now = new Date();
    return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
  }
}

function getHappyHourEnd(): Date {
  const ist = safeISTDate();
  const end = new Date(ist);
  end.setHours(18, 0, 0, 0);
  if (ist >= end) { end.setDate(end.getDate() + 1); }
  return end;
}

function getTimeLeft(): string {
  try {
    const now = safeISTDate();
    const end = getHappyHourEnd();
    const diff = end.getTime() - now.getTime();
    if (diff <= 0) return 'Happy Hour starts tomorrow!';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  } catch (err) {
    console.error('[DIAG] getTimeLeft crashed:', err);
    return '';
  }
}

function isRestaurantOpen(): { open: boolean; closesAt: string } {
  try {
    const now = safeISTDate();
    const hour = now.getHours();
    // Open 12 PM to 1 AM (next day)
    if (hour >= 12 || hour < 1) return { open: true, closesAt: '1:00 AM' };
    return { open: false, closesAt: '12:00 PM' };
  } catch (err) {
    console.error('[DIAG] isRestaurantOpen crashed:', err);
    return { open: false, closesAt: '' };
  }
}

// ==========================================
// ANIMATION VARIANTS
// ==========================================
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};
const slideInRight = {
  hidden: { x: 360, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { type: 'spring', damping: 28, stiffness: 300 } },
  exit: { x: 360, opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
};
const slideUp = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 30, stiffness: 300 } },
  exit: { y: '100%', opacity: 0, transition: { duration: 0.2 } },
};
const scaleIn = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } },
  exit: { scale: 0.9, opacity: 0, transition: { duration: 0.15 } },
};

// ==========================================
// MAIN PAGE
// ==========================================
export default function Home() {
  // Data
  const [menuData, setMenuData] = useState<Record<string, MenuCategory[]>>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Menu state
  const [activeTab, setActiveTab] = useState<string>('food');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Table & Order state — customer only sees their table number and order
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState<Record<string, unknown> | null>(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  // Reservation
  const [showReservation, setShowReservation] = useState(false);
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    name: '', phone: '', email: '', date: '', time: '', guests: '2', occasion: '', message: '',
  });
  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationResult, setReservationResult] = useState<{ code: string; tableNumber: number; tableArea: string } | null>(null);

  // Lookup Reservation (enter code to see table)
  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [activeReservation, setActiveReservation] = useState<ActiveReservation | null>(null);

  // Bill Request
  const [billRequested, setBillRequested] = useState(false);
  const [billRequesting, setBillRequesting] = useState(false);

  // Happy hour & status
  const [happyHourTime, setHappyHourTime] = useState('');
  const [restaurantStatus, setRestaurantStatus] = useState({ open: false, closesAt: '' });

  // Mobile nav
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Refs
  const menuRef = useRef<HTMLDivElement>(null);

  // ==========================================
  // GLOBAL ERROR INTERCEPTOR (diagnostic only - DO NOT preventDefault)
  // ==========================================
  useEffect(() => {
    const handler = (event: ErrorEvent) => {
      console.error('[DIAG] Uncaught runtime error:', event.error?.message, event.error?.stack);
      // Do NOT call event.preventDefault() — let React error boundary handle it
    };
    const rejectionHandler = (event: PromiseRejectionEvent) => {
      console.error('[DIAG] Unhandled promise rejection:', event.reason);
      // Do NOT call event.preventDefault() — let it propagate
    };
    window.addEventListener('error', handler);
    window.addEventListener('unhandledrejection', rejectionHandler);
    return () => {
      window.removeEventListener('error', handler);
      window.removeEventListener('unhandledrejection', rejectionHandler);
    };
  }, []);

  // ==========================================
  // FETCH DATA
  // ==========================================
  useEffect(() => {
    const tick = () => {
      try {
        setHappyHourTime(getTimeLeft());
        setRestaurantStatus(isRestaurantOpen());
      } catch (err) {
        console.error('[DIAG] setInterval tick crashed:', err);
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Prevent double-fetch in Strict Mode - only fetch once
    if (Object.keys(menuData).length > 0) return;
    
    let loadingCount = 3;
    const markLoaded = () => { loadingCount--; if (loadingCount <= 0) setDataLoading(false); };

    console.log('[DIAG-FETCH] Starting data fetch from API...');

    fetch('/api/menu')
      .then(r => {
        console.log('[DIAG-FETCH] /api/menu response status:', r.status, r.ok);
        if (!r.ok) throw new Error(`menu ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('[DIAG-FETCH] menuData loaded, keys:', Object.keys(data));
        if (data && typeof data === 'object' && !Array.isArray(data)) {
          setMenuData(data);
        }
        markLoaded();
      })
      .catch(err => { console.error('[DIAG-FETCH] /api/menu failed:', err); markLoaded(); });

    fetch('/data/events.json')
      .then(r => {
        if (!r.ok) throw new Error(`events ${r.status}`);
        return r.json();
      })
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        markLoaded();
      })
      .catch(err => { console.error('[DIAG-FETCH] /data/events.json failed:', err); markLoaded(); });

    fetch('/api/tables')
      .then(r => {
        console.log('[DIAG-FETCH] /api/tables response status:', r.status, r.ok);
        if (!r.ok) throw new Error(`tables ${r.status}`);
        return r.json();
      })
      .then(data => {
        console.log('[DIAG-FETCH] tables loaded, count:', Array.isArray(data) ? data.length : 'NOT_ARRAY');
        setTables(Array.isArray(data) ? data : []);
        markLoaded();
      })
      .catch(err => { console.error('[DIAG-FETCH] /api/tables failed:', err); markLoaded(); });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ==========================================
  // MENU HELPERS
  // ==========================================
  const categories = menuData[activeTab] || [];

  const filteredCategories = categories.map(cat => {
    const items = (cat.items || []).filter(item => {
      const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchVeg = !vegOnly || item.isVeg;
      return matchSearch && matchVeg;
    });
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  // Diagnostic logging for menu state — logs on every significant state change
  useEffect(() => {
    console.log('[DIAG-MENU] dataLoading:', dataLoading, 'menuData keys:', Object.keys(menuData), 'activeTab:', activeTab);
    console.log('[DIAG-MENU] categories:', categories.length, 'filteredCategories:', filteredCategories.length);
    console.log('[DIAG-MENU] searchQuery:', JSON.stringify(searchQuery), 'vegOnly:', vegOnly);
    if (categories.length > 0) {
      console.log('[DIAG-MENU] Sample category:', categories[0]?.name, 'items:', categories[0]?.items?.length);
    }
    if (filteredCategories.length > 0) {
      console.log('[DIAG-MENU] Sample filtered:', filteredCategories[0]?.name, 'items:', filteredCategories[0]?.items?.length);
    }
  }, [dataLoading, menuData, activeTab, categories.length, filteredCategories.length, searchQuery, vegOnly]);

  // Diagnostic logging for tables and reservation state
  useEffect(() => {
    console.log('[DIAG-TABLES] tables:', tables.length, 'selectedTable:', selectedTable?.number);
    console.log('[DIAG-RESERVE] showReservation:', showReservation, 'reservationSubmitting:', reservationSubmitting, 'reservationSuccess:', reservationSuccess);
  }, [tables.length, selectedTable, showReservation, reservationSubmitting, reservationSuccess]);

  // Diagnostic: print full state before render
  const fullStateLogged = useRef(false);
  useEffect(() => {
    if (!dataLoading && !fullStateLogged.current) {
      fullStateLogged.current = true;
      console.log('[DIAG-FULL-STATE] menuData:', JSON.stringify(Object.keys(menuData).map(k => k + ':' + (menuData[k]?.length || 0) + 'cats')));
      console.log('[DIAG-FULL-STATE] events:', events.length, 'tables:', tables.length);
      console.log('[DIAG-FULL-STATE] activeTab:', activeTab, 'searchQuery:', searchQuery, 'vegOnly:', vegOnly);
      console.log('[DIAG-FULL-STATE] selectedTable:', selectedTable?.number, 'showReservation:', showReservation);
      console.log('[DIAG-FULL-STATE] cart:', cart.length, 'cartTotal:', cartTotal);
      console.log('[DIAG-FULL-STATE] restaurantStatus:', restaurantStatus, 'happyHourTime:', happyHourTime);
    }
  }, [dataLoading]);

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setExpandedCategories(new Set());
  };

  // ==========================================
  // CART HELPERS
  // ==========================================
  const addToCart = (item: MenuItem) => {
    console.log('[DIAG] addToCart:', item.name, 'price:', item.price);
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id);
      if (existing) return prev.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(c => c.menuItem.id !== itemId));
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.menuItem.id !== itemId) return c;
      const newQty = c.quantity + delta;
      if (newQty <= 0) return c;
      return { ...c, quantity: newQty };
    }).filter(c => c.quantity > 0));
  };

  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  // ==========================================
  // ORDER SUBMISSION
  // ==========================================
  const submitOrder = async () => {
    if (!selectedTable || cart.length === 0) return;
    console.log('[DIAG] Submit order - table:', selectedTable.number, 'items:', cart.length);
    setOrderSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable.id,
          type: 'dine-in',
          items: cart.map(c => ({ menuItemId: c.menuItem.id, quantity: c.quantity })),
        }),
      });
      if (!res.ok) {
        const errData = await res.text();
        console.error('[DIAG] Order failed:', res.status, errData);
        throw new Error('Order failed');
      }
      console.log('[DIAG] Order placed successfully');
      setCart([]);
      setShowCart(false);
      setOrderSuccess(true);
      const tablesRes = await fetch('/api/tables');
      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(Array.isArray(tablesData) ? tablesData : []);
      }
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (err) {
      console.error('[DIAG] submitOrder error:', err);
    } finally {
      setOrderSubmitting(false);
    }
  };

  // ==========================================
  // BILL
  // ==========================================
  const fetchBill = async (tableId: string) => {
    console.log('[DIAG] fetchBill for tableId:', tableId);
    try {
      const res = await fetch(`/api/bill?tableId=${tableId}`);
      if (!res.ok) throw new Error(`bill ${res.status}`);
      const data = await res.json();
      console.log('[DIAG] Bill data:', JSON.stringify(data).substring(0, 200));
      setBillData(data);
      setShowBill(true);
    } catch (err) {
      console.error('[DIAG] fetchBill failed:', err);
    }
  };

  const closeBill = async () => {
    if (!billData || !selectedTable) return;
    try {
      // Settle the bill via API
      const billId = (billData as Record<string, unknown>).billId as string;
      if (billId) {
        await fetch('/api/bill', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billId }),
        });
      } else {
        // Legacy: mark orders as billed
        const orders = (billData as Record<string, unknown>).orders as { id: string }[];
        for (const order of orders) {
          await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id, status: 'billed' }),
          });
        }
      }
      setShowBill(false);
      setBillData(null);
      setSelectedTable(null);
      setActiveReservation(null);
      setBillRequested(false);
      setCart([]);
      const tablesRes = await fetch('/api/tables');
      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(Array.isArray(tablesData) ? tablesData : []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ==========================================
  // RESERVATION
  // ==========================================
  const submitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[DIAG] Submit reservation:', reservationForm);
    setReservationSubmitting(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationForm),
      });
      if (!res.ok) {
        const errData = await res.json();
        console.error('[DIAG] Reservation failed:', res.status, errData);
        throw new Error(errData.error || 'Reservation failed');
      }
      const data = await res.json();
      setReservationResult({
        code: data.code,
        tableNumber: data.table?.number || 0,
        tableArea: data.table?.area || '',
      });
      setReservationSuccess(true);
      // Set activeReservation so the code shows in the table bar
      setActiveReservation({
        id: data.id,
        code: data.code,
        name: data.name,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: data.guests,
        status: data.status,
        tableId: data.tableId,
        table: data.table,
      });
      // Refresh tables
      const tablesRes = await fetch('/api/tables');
      if (tablesRes.ok) {
        const tablesData = await tablesRes.json();
        setTables(Array.isArray(tablesData) ? tablesData : []);
      }
    } catch (err: any) {
      console.error('[DIAG] submitReservation error:', err);
      alert(err.message || 'Failed to create reservation');
    } finally {
      setReservationSubmitting(false);
    }
  };

  // ==========================================
  // SCROLL
  // ==========================================
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileNavOpen(false);
  };

  // Next upcoming event
  const nextEvent = events.find(e => e.isFeatured) || events[0];

  // ==========================================
  // LOOKUP RESERVATION
  // ==========================================
  const lookupReservation = async () => {
    if (!lookupCode.trim()) return;
    setLookupLoading(true);
    setLookupError('');
    try {
      const res = await fetch(`/api/reservations/lookup?code=${lookupCode.trim()}`);
      if (!res.ok) {
        const errData = await res.json();
        setLookupError(errData.error || 'Reservation not found');
        setActiveReservation(null);
        return;
      }
      const data = await res.json();
      setActiveReservation(data);
      // Set the selected table to the reservation's table
      setSelectedTable(data.table);
      setLookupCode('');
      setShowLookupModal(false);
    } catch (err) {
      setLookupError('Failed to look up reservation');
      setActiveReservation(null);
    } finally {
      setLookupLoading(false);
    }
  };

  // ==========================================
  // BILL REQUEST
  // ==========================================
  const requestBill = async () => {
    if (!selectedTable) return;
    setBillRequesting(true);
    try {
      const res = await fetch('/api/bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable.id,
          reservationId: activeReservation?.id || null,
        }),
      });
      if (!res.ok) throw new Error('Bill request failed');
      const data = await res.json();
      setBillData(data);
      setShowBill(true);
      setBillRequested(true);
    } catch (err) {
      console.error('[DIAG] requestBill error:', err);
    } finally {
      setBillRequesting(false);
    }
  };

  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="min-h-screen flex flex-col">
      {/* ===== NAV ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
            <span className={`font-[var(--font-display)] text-xl font-bold tracking-tight ${scrolled ? 'text-[var(--color-primary)]' : 'text-white'}`}>
              High Spirits
            </span>
          </button>
          <div className="hidden md:flex items-center gap-4">
            {['menu', 'events', 'about', 'contact'].map(id => (
              <button key={id} onClick={() => scrollTo(id)} className={`text-sm font-medium capitalize transition-colors ${scrolled ? 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]' : 'text-white/90 hover:text-white'}`}>
                {id}
              </button>
            ))}
            <button onClick={() => setShowLookupModal(true)} className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 ${scrolled ? 'border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white' : 'border-white/70 text-white/90 hover:bg-white/20'}`}>
              <Key className="w-3.5 h-3.5" /> My Reservation
            </button>
            <button onClick={() => setShowReservation(true)} className={`text-sm font-medium px-3 py-1.5 rounded-full border transition-all ${scrolled ? 'border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white' : 'border-white text-white hover:bg-white hover:text-[var(--color-primary)]'}`}>
              Reserve a Table
            </button>
          </div>
          <div className="flex items-center gap-3">
            {selectedTable && !billRequested && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={requestBill}
                disabled={billRequesting}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {billRequesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                {billRequesting ? 'Requesting...' : 'Bill Request'}
              </motion.button>
            )}
            {selectedTable && billRequested && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={() => fetchBill(selectedTable.id)}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
              >
                <Receipt className="w-3.5 h-3.5" /> View Bill
              </motion.button>
            )}
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className={`md:hidden p-1.5 ${scrolled ? 'text-[var(--color-foreground)]' : 'text-white'}`}>
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav overlay */}
      <AnimatePresence>
        {mobileNavOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={() => setMobileNavOpen(false)}>
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-6 flex flex-col gap-6"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <span className="font-[var(--font-display)] text-lg font-bold text-[var(--color-primary)]">High Spirits</span>
                <button onClick={() => setMobileNavOpen(false)}><X className="w-5 h-5" /></button>
              </div>
              {['menu', 'events', 'about', 'contact'].map(id => (
                <button key={id} onClick={() => scrollTo(id)} className="text-left text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] capitalize">{id}</button>
              ))}
              <button onClick={() => { setShowLookupModal(true); setMobileNavOpen(false); }} className="flex items-center gap-2 text-left text-base font-medium text-[var(--color-accent)]">
                <Key className="w-4 h-4" /> My Reservation
              </button>
              <button onClick={() => { setShowReservation(true); setMobileNavOpen(false); }} className="text-left text-base font-medium text-[var(--color-primary)]">
                Reserve a Table
              </button>
              {selectedTable && !billRequested && (
                <button onClick={() => { requestBill(); setMobileNavOpen(false); }} className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
                  <FileText className="w-4 h-4" /> Bill Request
                </button>
              )}
              {selectedTable && billRequested && (
                <button onClick={() => { fetchBill(selectedTable.id); setMobileNavOpen(false); }} className="flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]">
                  <Receipt className="w-4 h-4" /> View My Bill
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== HERO ===== */}
      <section id="hero" className="relative h-[85vh] min-h-[520px] flex items-end overflow-hidden">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="High Spirits Cafe" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 sm:pb-20">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="section-label mb-3 text-white/70">Koregaon Park, Pune</p>
            <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4">
              High Spirits<br />Cafe
            </h1>
            <p className="text-white/75 text-base sm:text-lg max-w-md mb-8 leading-relaxed">
              Pune&apos;s favourite nightlife destination. Live music, craft cocktails, and unforgettable evenings — since 2005.
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => scrollTo('menu')} className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> View Menu
              </button>
              <button onClick={() => setShowReservation(true)} className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-colors flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Reserve a Table
              </button>
              <button onClick={() => setShowLookupModal(true)} className="px-6 py-3 bg-white/15 text-white rounded-lg font-semibold text-sm backdrop-blur-sm hover:bg-white/25 transition-colors border border-white/20 flex items-center gap-2">
                <Key className="w-4 h-4" /> My Reservation
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== HAPPY HOUR BANNER + RESTAURANT STATUS ===== */}
      <div className="bg-[var(--color-primary)] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <span className="text-lg">🎉</span>
            <span className="text-sm font-medium">Happy Hour — 12 PM to 6 PM</span>
            <span className="text-xs text-white/60 hidden sm:inline">|</span>
            <span className="text-xs text-white/80 hidden sm:inline">Beer ₹100 · Cocktails ₹150 · Mimosa ₹130</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Live restaurant status */}
            <span className={`flex items-center gap-1.5 text-xs font-medium ${restaurantStatus.open ? 'text-green-300' : 'text-red-300'}`}>
              <span className={`w-2 h-2 rounded-full ${restaurantStatus.open ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {restaurantStatus.open ? `Open · Closes at ${restaurantStatus.closesAt}` : `Closed · Opens at ${restaurantStatus.closesAt}`}
            </span>
            <span className="text-xs font-mono text-white/70">{happyHourTime}</span>
          </div>
        </div>
      </div>

      {/* ===== SELECTED TABLE BAR (subtle, customer-friendly) ===== */}
      <AnimatePresence>
        {selectedTable && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/10 overflow-hidden"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-[var(--color-muted-foreground)]">Dining at</span>
                <span className="text-sm font-semibold text-[var(--color-primary)]">Table {selectedTable.number}</span>
                <span className="text-xs text-[var(--color-muted-foreground)]">· {AREA_LABELS[selectedTable.area]}</span>
                {activeReservation && (
                  <span className="text-xs text-[var(--color-accent)] font-medium ml-1">· Code: {activeReservation.code}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!billRequested ? (
                  <button onClick={requestBill} disabled={billRequesting} className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50">
                    {billRequesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                    {billRequesting ? 'Requesting...' : 'Bill Request'}
                  </button>
                ) : (
                  <button onClick={() => fetchBill(selectedTable.id)} className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" /> View Bill
                  </button>
                )}
                <button onClick={() => { setSelectedTable(null); setCart([]); setActiveReservation(null); setBillRequested(false); }} className="px-3 py-1 bg-[var(--color-secondary)] rounded-md text-xs font-medium hover:bg-[var(--color-border)] transition-colors">
                  End Session
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== MENU ===== */}
      <section id="menu" className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">What We Serve</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Our Menu</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          {/* Table assignment prompt (if no table selected) — prominent CTA */}
          {!selectedTable && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="mb-8 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border-2 border-[var(--color-primary)]/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <UtensilsCrossed className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-[var(--color-foreground)]">Browse our menu — reserve a table to start ordering!</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">You need a reservation to place orders. Your table will be auto-assigned when you reserve. Already have a code? Enter it below.</p>
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <button onClick={() => setShowReservation(true)} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                      <CalendarDays className="w-4 h-4" /> Reserve a Table
                    </button>
                    <button onClick={() => setShowLookupModal(true)} className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                      <Key className="w-4 h-4" /> Enter Reservation Code
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2.5 py-1 rounded-full">Test code: 777777 (Table 7)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                  className={`tab-pill flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border ${activeTab === tab.key ? 'active border-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
              <input type="text" placeholder="Search menu..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" />
            </div>
            <button onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${vegOnly ? 'bg-[#27AE60]/10 border-[#27AE60] text-[#27AE60]' : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]'}`}>
              <Leaf className="w-4 h-4" /> Veg
            </button>
          </div>

          {/* Categories */}
          <div ref={menuRef} className="space-y-3">
            {(() => { console.log('[DIAG-RENDER] Menu section rendering — dataLoading:', dataLoading, 'filteredCategories:', filteredCategories.length, 'categories:', categories.length, 'activeTab:', activeTab, 'menuData keys:', Object.keys(menuData)); return null; })()}
            {dataLoading && filteredCategories.length === 0 && (
              <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
                <p className="text-sm">Loading menu...</p>
              </div>
            )}
            {!dataLoading && filteredCategories.length === 0 && (
              <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">No items found. Try a different search.</p>
                {(() => { console.log('[DIAG-RENDER] Showing "No items found" — menuData:', JSON.stringify(Object.keys(menuData)), 'activeTab:', activeTab, 'categories:', categories.length, 'searchQuery:', searchQuery, 'vegOnly:', vegOnly); return null; })()}
              </div>
            )}
            {filteredCategories.map((cat, idx) => {
              const isOpen = expandedCategories.has(cat.slug) || searchQuery.length > 0;
              return (
                <motion.div key={cat.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <button onClick={() => toggleCategory(cat.slug)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-secondary)]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <div className="text-left">
                        <span className="font-semibold text-[var(--color-foreground)]">{cat.name}</span>
                        {cat.description && <span className="text-xs text-[var(--color-muted-foreground)] ml-2 hidden sm:inline">— {cat.description}</span>}
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2 py-0.5 rounded-full">{cat.items.length}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--color-muted-foreground)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)]" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="border-t border-[var(--color-border)]">
                          {cat.items.map((item) => (
                            <MenuItemRow key={item.id} item={item} inCart={cart.find(c => c.menuItem.id === item.id)}
                              onAdd={addToCart} onUpdateQty={updateCartQty} tableSelected={!!selectedTable} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== EVENTS ===== */}
      <section id="events" className="py-12 sm:py-16 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">What&apos;s On</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Events & Nights</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event, idx) => (
              <motion.div key={event.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0">
                    {event.type === 'live' && <Music className="w-5 h-5 text-[var(--color-primary)]" />}
                    {event.type === 'open-mic' && <Mic className="w-5 h-5 text-[var(--color-primary)]" />}
                    {event.type === 'themed' && <PartyPopper className="w-5 h-5 text-[var(--color-primary)]" />}
                    {event.type === 'dj' && <Sun className="w-5 h-5 text-[var(--color-primary)]" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-foreground)] text-sm leading-snug">{event.title}</h3>
                    {event.isFeatured && <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)]">Featured</span>}
                  </div>
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-3">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)]">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">Since 2005</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Our Story</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                In 2005, two friends had a simple idea: create a place where the music is always live, the drinks never stop flowing, and everyone feels like a regular. That place became High Spirits — a corner of Koregaon Park that turned into Pune&apos;s longest-running nightlife institution.
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                What makes us different? We don&apos;t do pretension. We do great cocktails at honest prices, live music that makes you stay past midnight, and food that surprises you — from Konkani Paneer Chilli to Neapolitan pizzas. Our Vintage Nights on Tuesdays and Thursdays have become legendary, and our Saturday gigs are the worst-kept secret in the city.
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                Walk in as a stranger, walk out as family. That&apos;s the High Spirits promise.
              </p>
              {/* Trust metrics */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary)]">19+</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">Years</div>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-2xl font-bold text-[var(--color-primary)]">4.6</span>
                    <Star className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" />
                  </div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary)]">50K+</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">Guests</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-primary)]">5</div>
                  <div className="text-xs text-[var(--color-muted-foreground)]">Live Events</div>
                </div>
              </div>
              {/* CTA after about */}
              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={() => setShowReservation(true)} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                  <CalendarDays className="w-4 h-4" /> Reserve a Table
                </button>
                <button onClick={() => scrollTo('menu')} className="px-5 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center gap-2">
                  View Menu <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 gap-3">
              <img src={INTERIOR_IMG} alt="Interior" className="rounded-xl object-cover w-full h-48 sm:h-64" />
              <img src={COCKTAIL_IMG} alt="Cocktails" className="rounded-xl object-cover w-full h-48 sm:h-64 mt-6" />
              <img src={FOOD_IMG} alt="Food" className="rounded-xl object-cover w-full h-48 sm:h-64 -mt-6" />
              {/* Replace green card with Google Rating card */}
              <div className="rounded-xl bg-[var(--color-primary)] text-white flex flex-col items-center justify-center p-5 h-48 sm:h-64">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : 'fill-white/30 text-white/30'}`} />
                  ))}
                </div>
                <p className="font-[var(--font-display)] text-lg font-bold">4.6 on Google</p>
                <p className="text-xs text-white/60 mt-1">Based on 2,800+ reviews</p>
                <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className="mt-3 text-xs text-white/80 underline hover:text-white transition-colors">
                  Read Reviews →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-12 sm:py-16 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">Get In Touch</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Find Us</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          {/* Contact cards with actionable links */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Address — opens Google Maps */}
            <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Address</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-2">{ADDRESS}</p>
              <span className="text-xs text-[var(--color-primary)] font-medium flex items-center gap-1 group-hover:underline">
                <Navigation className="w-3 h-3" /> Get Directions
              </span>
            </a>

            {/* Call — highlighted as primary action */}
            <a href={PHONE_TEL}
              className="bg-[var(--color-primary)] text-white rounded-xl p-5 hover:opacity-90 transition-opacity group cursor-pointer shadow-md">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Call Us</h3>
              <p className="text-xs text-white/80 mb-2">{PHONE}</p>
              <span className="text-xs text-white font-medium flex items-center gap-1 group-hover:underline">
                <Phone className="w-3 h-3" /> Call Now
              </span>
            </a>

            {/* Hours — with live status */}
            <div className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Hours</h3>
              <p className="text-xs text-[var(--color-muted-foreground)]">Mon–Sun: 12 PM – 1 AM</p>
              <span className={`inline-flex items-center gap-1.5 mt-2 text-xs font-medium ${restaurantStatus.open ? 'text-[#27AE60]' : 'text-[var(--color-destructive)]'}`}>
                <span className={`w-2 h-2 rounded-full ${restaurantStatus.open ? 'bg-[#27AE60] animate-pulse' : 'bg-[var(--color-destructive)]'}`} />
                {restaurantStatus.open ? `Open · Closes at ${restaurantStatus.closesAt}` : `Closed · Opens at ${restaurantStatus.closesAt}`}
              </span>
            </div>

            {/* Email */}
            <a href={`mailto:${EMAIL}`}
              className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Email</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] mb-2">{EMAIL}</p>
              <span className="text-xs text-[var(--color-primary)] font-medium flex items-center gap-1 group-hover:underline">
                <ExternalLink className="w-3 h-3" /> Send Email
              </span>
            </a>
          </div>

          {/* Reservation CTA in contact section */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-[var(--color-foreground)]">Ready to visit?</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Reserve your table or just walk in — we&apos;d love to host you.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { console.log('[DIAG] Reserve button clicked (contact)'); setShowReservation(true); }} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Reserve a Table
              </button>
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center gap-2">
                <Send className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm">
            <iframe
              src={MAPS_EMBED}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="High Spirits Cafe Location"
              className="w-full"
            />
            <div className="bg-white p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)]">
                <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Koregaon Park, Pune</span>
                <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5" /> Near ABC Farm</span>
                <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> Street parking available</span>
              </div>
              <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1">
                <Navigation className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
              <Instagram className="w-4 h-4" /> @highspiritscafe
            </a>
            <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
              <Star className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" /> 4.6 on Google
            </a>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[var(--color-primary)] text-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div>
              <span className="font-[var(--font-display)] text-xl font-bold">High Spirits Cafe</span>
              <p className="text-white/50 text-xs mt-2 leading-relaxed">Pune&apos;s favourite nightlife destination since 2005. Live music, craft cocktails, and unforgettable evenings in the heart of Koregaon Park.</p>
            </div>
            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Menu', action: () => scrollTo('menu') },
                  { label: 'Events', action: () => scrollTo('events') },
                  { label: 'About', action: () => scrollTo('about') },
                  { label: 'Reservations', action: () => setShowReservation(true) },
                  { label: 'My Reservation', action: () => setShowLookupModal(true) },
                ].map(link => (
                  <button key={link.label} onClick={link.action} className="text-xs text-white/60 hover:text-white transition-colors text-left">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>
            {/* Contact & Social */}
            <div>
              <h4 className="text-sm font-semibold mb-3">Contact</h4>
              <div className="flex flex-col gap-2">
                <a href={PHONE_TEL} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" /> {PHONE}
                </a>
                <a href={`mailto:${EMAIL}`} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> {EMAIL}
                </a>
                <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5" /> @highspiritscafe
                </a>
              </div>
              <button onClick={() => setShowReservation(true)} className="mt-4 px-4 py-2 bg-white/15 rounded-lg text-xs font-medium hover:bg-white/25 transition-colors flex items-center gap-2">
                <CalendarDays className="w-3.5 h-3.5" /> Reserve a Table
              </button>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} High Spirits Cafe. All rights reserved.</p>
            <div className="flex items-center gap-4 text-xs text-white/40">
              <span>Payment: Cash · UPI · Cards</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ===== FLOATING CART BUTTON ===== */}
      <AnimatePresence>
        {cartCount > 0 && selectedTable && (
          <motion.button
            initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            onClick={() => setShowCart(true)}
            className="fixed bottom-6 right-6 z-40 bg-[var(--color-primary)] text-white px-5 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-semibold text-sm">{cartCount} items</span>
            <span className="text-xs text-white/70">· {fmt(cartTotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ===== ORDER SUCCESS TOAST ===== */}
      <AnimatePresence>
        {orderSuccess && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#27AE60] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <Check className="w-5 h-5" />
            <span className="font-medium text-sm">Order placed! Your waiter will bring it shortly.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== TABLE SELECTOR MODAL (removed — tables are auto-assigned via reservation or code lookup) ===== */}

      {/* ===== CART SIDEBAR ===== */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
            <motion.div variants={slideInRight} initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col">
              <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-lg">Your Order</h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                    {selectedTable ? `Table ${selectedTable.number}` : 'No table selected'}
                  </p>
                </div>
                <button onClick={() => setShowCart(false)} className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-5">
                {cart.length === 0 ? (
                  <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                    <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Your cart is empty</p>
                    <p className="text-xs mt-1">Add items from the menu to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.map(item => (
                      <div key={item.menuItem.id} className="flex items-start gap-3 p-3 bg-[var(--color-secondary)]/50 rounded-xl">
                        <div className={`mt-1 ${item.menuItem.isVeg ? 'veg-indicator' : 'nonveg-indicator'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-snug">{item.menuItem.name}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{fmt(item.menuItem.price)}</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => updateCartQty(item.menuItem.id, -1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateCartQty(item.menuItem.id, 1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                          <button onClick={() => removeFromCart(item.menuItem.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-destructive)] hover:bg-red-50 transition-colors ml-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {cart.length > 0 && (
                <div className="border-t border-[var(--color-border)] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-[var(--color-muted-foreground)]">Subtotal</span>
                    <span className="text-lg font-bold">{fmt(cartTotal)}</span>
                  </div>
                  {!selectedTable ? (
                    <button onClick={() => { setShowCart(false); setShowLookupModal(true); }} className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                      <Key className="w-4 h-4" /> Enter Reservation Code
                    </button>
                  ) : (
                    <button onClick={submitOrder} disabled={orderSubmitting}
                      className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                      {orderSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {orderSubmitting ? 'Placing Order...' : 'Place Order'}
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== BILL MODAL ===== */}
      <AnimatePresence>
        {showBill && billData && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowBill(false)}>
            <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
              <div className="bg-[var(--color-primary)] text-white p-6 text-center">
                <p className="font-[var(--font-display)] text-xl font-bold">High Spirits Cafe</p>
                <p className="text-xs text-white/60 mt-1">Koregaon Park, Pune</p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  <span className="px-3 py-1 bg-white/15 rounded-full text-sm font-medium">Table {(billData as Record<string, unknown>).tableNumber}</span>
                  <span className="px-3 py-1 bg-white/15 rounded-full text-xs">{AREA_LABELS[(billData as Record<string, unknown>).tableArea as string] || ''}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="space-y-2 mb-4">
                  {((billData as Record<string, unknown>).items as { name: string; isVeg: boolean; quantity: number; price: number; total: number; status: string }[]).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <div className={`mt-1.5 ${item.isVeg ? 'veg-indicator' : 'nonveg-indicator'}`} style={{ flexShrink: 0 }} />
                      <div className="flex-1 min-w-0">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-[var(--color-muted-foreground)] ml-1">×{item.quantity}</span>
                      </div>
                      <span className="text-[var(--color-muted-foreground)] whitespace-nowrap">{fmt(item.total)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dashed border-[var(--color-border)] pt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">Subtotal</span>
                    <span>{fmt((billData as Record<string, unknown>).subtotal as number)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted-foreground)]">GST (5%)</span>
                    <span>{fmt((billData as Record<string, unknown>).gst as number)}</span>
                  </div>
                  <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-[var(--color-border)]">
                    <span>Total</span>
                    <span>{fmt((billData as Record<string, unknown>).total as number)}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 flex gap-2">
                <button onClick={() => setShowBill(false)} className="flex-1 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-secondary)] transition-colors">
                  Close
                </button>
                <button onClick={closeBill} className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  Settle Bill
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== LOOKUP RESERVATION MODAL ===== */}
      <AnimatePresence>
        {showLookupModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => { setShowLookupModal(false); setLookupError(''); }}>
            <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-lg">My Reservation</h2>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Enter your reservation code to view your table and order</p>
                  </div>
                  <button onClick={() => { setShowLookupModal(false); setLookupError(''); }} className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="bg-[var(--color-secondary)] rounded-xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                      <Ticket className="w-5 h-5 text-[var(--color-accent)]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Have a reservation code?</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">Enter the 6-digit code you received when you reserved</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Reservation Code</label>
                    <input
                      type="text"
                      value={lookupCode}
                      onChange={e => { setLookupCode(e.target.value); setLookupError(''); }}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-lg font-mono text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                      onKeyDown={e => { if (e.key === 'Enter') lookupReservation(); }}
                    />
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2.5 py-1 rounded-full">Test code: 777777</span>
                  </div>
                  {lookupError && (
                    <p className="text-sm text-[var(--color-destructive)] text-center">{lookupError}</p>
                  )}
                  <button
                    onClick={lookupReservation}
                    disabled={lookupLoading || !lookupCode.trim()}
                    className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {lookupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                    {lookupLoading ? 'Looking up...' : 'Find My Reservation'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== RESERVATION MODAL ===== */}
      <AnimatePresence>
        {showReservation && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => { setShowReservation(false); setReservationSuccess(false); setReservationResult(null); }}>
            {(() => { console.log('[DIAG-RESERVE] Reservation modal is rendering — showReservation:', showReservation); return null; })()}
            <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-lg">Reserve a Table</h2>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">A table will be auto-assigned to you</p>
                  </div>
                  <button onClick={() => { setShowReservation(false); setReservationSuccess(false); setReservationResult(null); }} className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                {reservationSuccess && reservationResult ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-[#27AE60]/10 flex items-center justify-center mx-auto mb-4">
                      <Check className="w-7 h-7 text-[#27AE60]" />
                    </div>
                    <p className="font-semibold text-lg">Reservation Confirmed!</p>
                    <p className="text-sm text-[var(--color-muted-foreground)] mt-1 mb-4">Your table has been assigned</p>
                    <div className="bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/20 rounded-xl p-5 mb-4">
                      <p className="text-xs text-[var(--color-muted-foreground)] mb-2">Your Reservation Code</p>
                      <div className="flex items-center justify-center gap-2">
                        <p className="text-4xl font-bold font-mono tracking-[0.3em] text-[var(--color-primary)]">{reservationResult.code}</p>
                        <button onClick={() => navigator.clipboard?.writeText(reservationResult.code)} className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors" title="Copy code">
                          <Copy className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                        </button>
                      </div>
                      <p className="text-xs text-[var(--color-muted-foreground)] mt-2">Save this code! Use it to view your reservation and order from your table anytime.</p>
                    </div>
                    <div className="bg-[var(--color-secondary)] rounded-xl p-4 mb-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-[var(--color-primary)]" />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">Table {reservationResult.tableNumber}</p>
                          <p className="text-xs text-[var(--color-muted-foreground)]">{AREA_LABELS[reservationResult.tableArea] || reservationResult.tableArea}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-xl p-3 mb-4 text-left">
                      <p className="text-xs font-medium text-[var(--color-foreground)]">How to use your code:</p>
                      <ol className="text-xs text-[var(--color-muted-foreground)] mt-1 space-y-1 list-decimal list-inside">
                        <li>Enter your 6-digit code on the landing page</li>
                        <li>Your table and current orders will appear</li>
                        <li>Add items from the menu to your order</li>
                        <li>Click &quot;Bill Request&quot; when you&apos;re done</li>
                      </ol>
                    </div>
                    <button onClick={() => {
                      setShowReservation(false);
                      setReservationSuccess(false);
                      setReservationResult(null);
                      setReservationForm({ name: '', phone: '', email: '', date: '', time: '', guests: '2', occasion: '', message: '' });
                      // Auto-set the table from the reservation
                      const table = tables.find(t => t.number === reservationResult.tableNumber);
                      if (table) setSelectedTable(table);
                    }} className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                      Start Ordering
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submitReservation} className="space-y-4">
                    <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-xl p-3">
                      <p className="text-xs text-[var(--color-foreground)]">After confirmation, you&apos;ll receive a <strong>6-digit code</strong> to access your table and order. Save this code — you&apos;ll need it each time you visit!</p>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Name *</label>
                      <input type="text" required value={reservationForm.name} onChange={e => setReservationForm(p => ({ ...p, name: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Phone *</label>
                      <input type="tel" required value={reservationForm.phone} onChange={e => setReservationForm(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Date *</label>
                        <input type="date" required value={reservationForm.date} onChange={e => setReservationForm(p => ({ ...p, date: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Time *</label>
                        <input type="time" required value={reservationForm.time} onChange={e => setReservationForm(p => ({ ...p, time: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Guests</label>
                      <select value={reservationForm.guests} onChange={e => setReservationForm(p => ({ ...p, guests: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white">
                        {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Occasion</label>
                      <select value={reservationForm.occasion} onChange={e => setReservationForm(p => ({ ...p, occasion: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white">
                        <option value="">Select (optional)</option>
                        <option value="birthday">Birthday</option>
                        <option value="anniversary">Anniversary</option>
                        <option value="corporate">Corporate</option>
                        <option value="casual">Casual</option>
                      </select>
                    </div>
                    <button type="submit" disabled={reservationSubmitting}
                      className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                      {reservationSubmitting ? 'Confirming...' : 'Confirm Reservation'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===== SCROLL TO TOP ===== */}
      <AnimatePresence>
        {scrolled && (
          <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 left-6 z-40 w-10 h-10 bg-white border border-[var(--color-border)] rounded-full shadow-md flex items-center justify-center hover:shadow-lg transition-shadow">
            <ArrowUp className="w-4 h-4 text-[var(--color-foreground)]" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

// ==========================================
// MENU ITEM ROW COMPONENT
// ==========================================
function MenuItemRow({ item, inCart, onAdd, onUpdateQty, tableSelected }: {
  item: MenuItem; inCart?: CartItem; onAdd: (item: MenuItem) => void;
  onUpdateQty: (id: string, delta: number) => void; tableSelected: boolean;
}) {
  return (
    <div className={`menu-row px-5 py-3 flex items-start gap-3 border-b border-[var(--color-border)] last:border-b-0 ${!tableSelected ? 'opacity-80' : ''}`}>
      <div className={`mt-1.5 ${item.isVeg ? 'veg-indicator' : 'nonveg-indicator'}`} style={{ flexShrink: 0 }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          <span className="text-sm font-medium leading-snug">{item.name}</span>
          {item.isBestseller && <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-1.5 py-0.5 rounded">Bestseller</span>}
          {item.isNew && <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#27AE60] bg-[#27AE60]/10 px-1.5 py-0.5 rounded">New</span>}
        </div>
        {item.description && <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5 leading-relaxed">{item.description}</p>}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <span className="text-sm font-semibold text-[var(--color-foreground)]">{fmt(item.price)}</span>
        {tableSelected && inCart && (
          <div className="flex items-center gap-1">
            <button onClick={() => onUpdateQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <span className="qty-badge bg-[var(--color-primary)] text-white">{inCart.quantity}</span>
            <button onClick={() => onUpdateQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}
        {tableSelected && !inCart && (
          <button onClick={() => onAdd(item)} className="w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
            <Plus className="w-3.5 h-3.5" />
          </button>
        )}
        {!tableSelected && (
          <span className="text-[10px] text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2 py-1 rounded-full whitespace-nowrap">Reserve to order</span>
        )}
      </div>
    </div>
  );
}

// Car icon for parking info
function Car({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2" />
      <circle cx="6.5" cy="16.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  );
}
