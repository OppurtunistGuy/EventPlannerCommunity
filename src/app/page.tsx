'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Phone, MapPin, Clock, ChevronDown, ChevronUp,
  Star, Flame, Leaf, Drumstick, X, Menu as MenuIcon,
  CalendarDays, Music, Mic, PartyPopper, Sun, Send,
  Instagram, Mail, ChevronRight, ArrowUp, Check
} from 'lucide-react';

// ==========================================
// TYPES
// ==========================================
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  isVeg: boolean;
  isBestseller: boolean;
  isNew: boolean;
  order: number;
}

interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description?: string;
  tab: string;
  order: number;
  items: MenuItem[];
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  isFeatured: boolean;
}

interface ReservationForm {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: string;
  occasion: string;
  message: string;
}

// ==========================================
// CONSTANTS
// ==========================================
const PHONE = '+91 97654 00484';
const PHONE_TEL = 'tel:+919765400484';
const WHATSAPP = 'https://wa.me/919765400484?text=Hi!%20I%20would%20like%20to%20place%20an%20order%20from%20High%20Spirits%20Cafe';
const ADDRESS = '35A/1, Near ABC Farm, Behind Burger King, Koregaon Park, Pune - 411001';
const EMAIL = 'highspiritscafe@gmail.com';
const INSTAGRAM = 'https://instagram.com/highspiritscafe/';
const GOOGLE_MAPS = 'https://maps.google.com/?q=High+Spirits+Cafe+Koregaon+Park+Pune';

const TABS = [
  { key: 'offers', label: 'Offers', icon: '🎉', sublabel: '12–6 PM' },
  { key: 'food', label: 'Food', icon: '🍽️' },
  { key: 'bar', label: 'Bar', icon: '🍸' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
  { key: 'vintage', label: 'Vintage', icon: '🏷️', sublabel: 'Tue & Thu' },
];

const EVENT_ICONS: Record<string, React.ReactNode> = {
  'live': <Music className="w-5 h-5" />,
  'open-mic': <Mic className="w-5 h-5" />,
  'themed': <PartyPopper className="w-5 h-5" />,
  'dj': <Sun className="w-5 h-5" />,
};

const EVENT_COLORS: Record<string, string> = {
  'live': 'from-red-50 to-orange-50 border-red-200',
  'open-mic': 'from-purple-50 to-pink-50 border-purple-200',
  'themed': 'from-amber-50 to-yellow-50 border-amber-200',
  'dj': 'from-cyan-50 to-sky-50 border-cyan-200',
};

// ==========================================
// HELPER: Happy Hour Timer
// ==========================================
function getHappyHourStatus() {
  const now = new Date();
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const hour = ist.getHours();
  const minute = ist.getMinutes();
  const currentMinutes = hour * 60 + minute;
  const startMinutes = 12 * 60; // 12 PM
  const endMinutes = 18 * 60; // 6 PM

  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    const remaining = endMinutes - currentMinutes;
    const hoursLeft = Math.floor(remaining / 60);
    const minsLeft = remaining % 60;
    return {
      isActive: true,
      message: `Happy Hour LIVE! Ends in ${hoursLeft}h ${minsLeft}m`,
      timeLeft: remaining,
    };
  }

  if (currentMinutes < startMinutes) {
    const until = startMinutes - currentMinutes;
    const hoursUntil = Math.floor(until / 60);
    const minsUntil = until % 60;
    return {
      isActive: false,
      message: `Happy Hour starts in ${hoursUntil}h ${minsUntil}m`,
      timeLeft: 0,
    };
  }

  return {
    isActive: false,
    message: 'Happy Hour starts tomorrow at 12 PM',
    timeLeft: 0,
  };
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function Home() {
  const [menuData, setMenuData] = useState<Record<string, MenuCategory[]>>({});
  const [events, setEvents] = useState<Event[]>([]);
  const [activeTab, setActiveTab] = useState('offers');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [vegFilter, setVegFilter] = useState<'all' | 'veg' | 'nonveg'>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showReservation, setShowReservation] = useState(false);
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    name: '', phone: '', email: '', date: '', time: '', guests: '2', occasion: '', message: '',
  });
  const [reservationSubmitted, setReservationSubmitted] = useState(false);
  const [happyHour, setHappyHour] = useState(getHappyHourStatus());
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [orderItems, setOrderItems] = useState<{ name: string; price: number }[]>([]);

  // Fetch data
  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setMenuData).catch(console.error);
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(console.error);
  }, []);

  // Happy hour timer
  useEffect(() => {
    const interval = setInterval(() => {
      setHappyHour(getHappyHourStatus());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Scroll listener
  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Handle tab change - expand first category
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (menuData[tab]?.length) {
      setExpandedCategories(new Set([menuData[tab][0].id]));
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Filter menu items
  const getFilteredItems = useCallback((items: MenuItem[]) => {
    let filtered = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    if (vegFilter === 'veg') filtered = filtered.filter(i => i.isVeg);
    if (vegFilter === 'nonveg') filtered = filtered.filter(i => !i.isVeg);
    return filtered;
  }, [searchQuery, vegFilter]);

  // Add to order
  const addToOrder = (name: string, price: number) => {
    setOrderItems(prev => [...prev, { name, price }]);
  };

  const removeFromOrder = (index: number) => {
    setOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  const orderTotal = orderItems.reduce((sum, item) => sum + item.price, 0);

  // WhatsApp order
  const sendWhatsAppOrder = () => {
    if (orderItems.length === 0) {
      window.open(WHATSAPP, '_blank');
      return;
    }
    const itemsList = orderItems.map(i => `${i.name} — ₹${i.price}`).join('\n');
    const total = `Total: ₹${orderTotal}`;
    const message = encodeURIComponent(`Hi! I'd like to order from High Spirits Cafe:\n\n${itemsList}\n\n${total}`);
    window.open(`https://wa.me/919765400484?text=${message}`, '_blank');
  };

  // Reservation submit
  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationForm),
      });
      setReservationSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  };

  // Scroll to section
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button onClick={() => scrollTo('hero')} className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 group-hover:bg-primary/30 transition">
                <span className="text-primary font-bold text-lg">H</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-primary font-bold text-lg tracking-wide">HIGH SPIRITS</span>
                <span className="text-muted-foreground text-xs block -mt-1 tracking-widest">CAFE</span>
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { id: 'menu', label: 'Menu' },
                { id: 'events', label: 'Events' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-primary transition rounded-lg hover:bg-primary/10"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setShowReservation(true)}
                className="ml-2 px-5 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-lg hover:bg-primary/90 transition"
              >
                Reserve a Table
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 text-muted-foreground hover:text-primary"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-border shadow-lg">
            <div className="px-4 py-3 space-y-1">
              {[
                { id: 'menu', label: 'Menu' },
                { id: 'events', label: 'Events' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left px-4 py-3 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setShowReservation(true); setMobileMenuOpen(false); }}
                className="w-full mt-2 px-5 py-3 bg-primary text-primary-foreground font-semibold rounded-lg text-center"
              >
                Reserve a Table
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#faf7f2] via-[#fef3c7] to-[#faf7f2]" />
        <div className="absolute inset-0 opacity-30" style={{
          backgroundImage: 'radial-gradient(circle at 20% 80%, #b45309 0%, transparent 40%), radial-gradient(circle at 80% 20%, #92400e 0%, transparent 40%), radial-gradient(circle at 50% 50%, #fef3c7 0%, transparent 60%)',
        }} />

        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-primary/40 rounded-full animate-pulse" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-accent/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-1.5 h-1.5 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Neon sign effect */}
          <div className="mb-6">
            <span className="text-primary/80 text-sm tracking-[0.3em] uppercase font-medium">Welcome to</span>
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight mb-4">
            <span className="text-primary">HIGH</span>
            <br />
            <span className="text-foreground">SPIRITS</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary mb-2 tracking-widest uppercase font-semibold">
            Cafe &amp; Bar
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto mb-8">
            Pune&apos;s favourite nightlife destination. Live music, signature cocktails, great food, and unforgettable vibes since over a decade.
          </p>

          {/* Happy Hour Status */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border mb-8 ${
            happyHour.isActive
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}>
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">{happyHour.message}</span>
            {happyHour.isActive && (
              <span className="w-2 h-2 bg-green-400 rounded-full countdown-pulse" />
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('menu')}
              className="px-8 py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition text-lg shadow-lg shadow-primary/20"
            >
              See Menu &amp; Order
            </button>
            <a
              href={PHONE_TEL}
              className="px-8 py-3.5 border-2 border-primary/40 text-primary font-bold rounded-xl hover:bg-primary/10 transition text-lg"
            >
              <Phone className="w-5 h-5 inline mr-2" />
              Call Us
            </a>
          </div>

          {/* Scroll indicator */}
          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-6 h-6 mx-auto text-primary/60" />
          </div>
        </div>
      </section>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">Our Menu</span>
          <h2 className="text-4xl sm:text-5xl font-black mt-2 mb-4">What We Serve</h2>
          <div className="section-divider max-w-xs mx-auto mb-6" />
          <p className="text-muted-foreground max-w-lg mx-auto">
            From craft cocktails to hearty meals — explore our menu, find your favourites, and order directly on WhatsApp.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6 sticky top-16 z-30 bg-white/95 backdrop-blur-md py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search menu — try 'paneer', 'cocktail', 'pizza'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All', icon: null },
              { key: 'veg', label: 'Veg', icon: <Leaf className="w-3.5 h-3.5" /> },
              { key: 'nonveg', label: 'Non-Veg', icon: <Drumstick className="w-3.5 h-3.5" /> },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setVegFilter(f.key as 'all' | 'veg' | 'nonveg')}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition border ${
                  vegFilter === f.key
                    ? 'bg-primary/20 border-primary/40 text-primary'
                    : 'bg-card border-border text-muted-foreground hover:border-primary/20'
                }`}
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold whitespace-nowrap transition border ${
                activeTab === tab.key
                  ? 'bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20'
                  : 'bg-card border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.sublabel && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  activeTab === tab.key ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-primary/10 text-primary'
                }`}>
                  {tab.sublabel}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Menu Categories */}
        <div className="space-y-3">
          {menuData[activeTab]?.map(category => {
            const isExpanded = expandedCategories.has(category.id);
            const filteredItems = getFilteredItems(category.items);
            if (searchQuery && filteredItems.length === 0) return null;

            return (
              <div key={category.id} className="border border-border rounded-xl overflow-hidden bg-card">
                {/* Category Header */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-secondary/50 transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className="font-bold text-foreground">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground">{category.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                      {filteredItems.length} items
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Category Items */}
                {isExpanded && (
                  <div className="border-t border-border">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-5 py-3.5 border-b border-border/50 last:border-0 hover:bg-secondary/30 transition menu-item-hover"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Veg/Non-veg indicator */}
                            <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
                              item.isVeg ? 'border-green-500' : 'border-red-500'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${
                                item.isVeg ? 'bg-green-500' : 'bg-red-500'
                              }`} />
                            </span>
                            <span className="font-semibold text-foreground text-sm">{item.name}</span>
                            {item.isBestseller && (
                              <span className="flex items-center gap-0.5 text-xs bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/20">
                                <Flame className="w-3 h-3" /> Bestseller
                              </span>
                            )}
                            {item.isNew && (
                              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20">
                                New
                              </span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-1 ml-6">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className="font-bold text-primary">₹{item.price}</span>
                          <button
                            onClick={() => addToOrder(item.name, item.price)}
                            className="w-8 h-8 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 flex items-center justify-center text-primary transition"
                            title="Add to order"
                          >
                            <span className="text-lg leading-none">+</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* No results */}
        {searchQuery && !Object.values(menuData).flat().some(cat => getFilteredItems(cat.items).length > 0) && (
          <div className="text-center py-12 text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No items found for &quot;{searchQuery}&quot;</p>
            <p className="text-sm mt-1">Try a different search term or clear the filter</p>
          </div>
        )}
      </section>

      {/* ===== EVENTS SECTION ===== */}
      <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">What&apos;s On</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-2 mb-4">Events &amp; Nights</h2>
            <div className="section-divider max-w-xs mx-auto mb-6" />
            <p className="text-muted-foreground max-w-lg mx-auto">
              From live gigs to open mic nights — there&apos;s always something happening at High Spirits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <div
                key={event.id}
                className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${EVENT_COLORS[event.type] || 'from-primary/10 to-accent/10 border-border'} p-6 card-hover`}
              >
                {event.isFeatured && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 text-xs bg-primary/20 text-primary px-2 py-1 rounded-full border border-primary/30">
                      <Star className="w-3 h-3" /> Featured
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {EVENT_ICONS[event.type] || <Music className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider">{event.type.replace('-', ' ')}</span>
                  </div>
                </div>
                <h3 className="font-bold text-lg mb-2 text-foreground">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{event.description}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1.5 text-primary">
                    <CalendarDays className="w-4 h-4" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" /> {event.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY SECTION ===== */}
      <section id="gallery" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">The Vibe</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-2 mb-4">Gallery</h2>
            <div className="section-divider max-w-xs mx-auto mb-6" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Live Gigs', color: 'from-red-50 to-orange-50' },
              { label: 'The Stage', color: 'from-purple-50 to-pink-50' },
              { label: 'Inside Vibe', color: 'from-amber-50 to-yellow-50' },
              { label: 'Cocktails', color: 'from-cyan-50 to-teal-50' },
              { label: 'DA HIGH Neon', color: 'from-amber-50 to-orange-50' },
              { label: 'Fairy Lights', color: 'from-green-50 to-emerald-50' },
            ].map((item, i) => (
              <div
                key={i}
                className={`relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br ${item.color} border border-border card-hover group cursor-pointer`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-background/20 backdrop-blur-sm flex items-center justify-center border border-border/50 group-hover:scale-110 transition">
                      <Camera className="w-8 h-8 text-primary/60" />
                    </div>
                    <span className="text-sm font-medium text-foreground/80">{item.label}</span>
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition" />
              </div>
            ))}
          </div>

          <div className="text-center mt-8">
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-card border border-border rounded-xl text-muted-foreground hover:text-primary hover:border-primary/30 transition"
            >
              <Instagram className="w-5 h-5" />
              See more on Instagram
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">Our Story</span>
              <h2 className="text-4xl sm:text-5xl font-black mt-2 mb-6">More Than a Bar</h2>
              <div className="section-divider max-w-xs mb-6" />
              <p className="text-muted-foreground mb-4 leading-relaxed">
                High Spirits Cafe in Pune, India, is a beloved nightlife hotspot that has been a fixture in Koregaon Park for over a decade. With its inviting open-air setting, adorned with fairy lights, it&apos;s a gathering place for both locals and visitors.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                The venue&apos;s eclectic music scene, ranging from live bands to DJ sets, ensures there&apos;s always something for every music lover. Coupled with a delectable menu of bar snacks and heartier fare, along with an impressive drinks selection, High Spirits offers a complete experience for a memorable night out.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                What truly sets High Spirits apart is its dedication to building a sense of community. Through events like themed parties, live gigs, and open mic nights, it creates a space where creativity and camaraderie flourish. This spirit of inclusivity has made High Spirits Cafe a cherished institution in Pune&apos;s cultural landscape.
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="text-center">
                  <span className="text-3xl font-black text-primary">10+</span>
                  <p className="text-xs text-muted-foreground mt-1">Years in Pune</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-black text-primary">100+</span>
                  <p className="text-xs text-muted-foreground mt-1">Drinks &amp; Cocktails</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-black text-primary">Live</span>
                  <p className="text-xs text-muted-foreground mt-1">Music Every Week</p>
                </div>
                <div className="w-px h-12 bg-border" />
                <div className="text-center">
                  <span className="text-3xl font-black text-primary">₹100</span>
                  <p className="text-xs text-muted-foreground mt-1">Happy Hour Beer</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Open-Air Seating', desc: 'Fairy lights under the stars', color: 'from-amber-50 to-orange-50' },
                { label: 'Live Music Stage', desc: 'Bands, DJs, and open mic', color: 'from-red-50 to-purple-50' },
                { label: 'Signature Cocktails', desc: 'Crafted by our expert bar team', color: 'from-cyan-50 to-teal-50' },
                { label: 'Community Vibes', desc: 'Where everyone belongs', color: 'from-green-50 to-emerald-50' },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${item.color} border border-border card-hover`}
                >
                  <h4 className="font-bold text-foreground mb-1">{item.label}</h4>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT SECTION ===== */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-sm tracking-[0.2em] uppercase font-medium">Find Us</span>
            <h2 className="text-4xl sm:text-5xl font-black mt-2 mb-4">Contact Us</h2>
            <div className="section-divider max-w-xs mx-auto mb-6" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Phone */}
            <a
              href={PHONE_TEL}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Call Us</h3>
                <p className="text-primary font-medium">{PHONE}</p>
                <p className="text-xs text-muted-foreground mt-1">Tap to call directly</p>
              </div>
            </a>

            {/* WhatsApp */}
            <button
              onClick={sendWhatsAppOrder}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border card-hover group text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 flex-shrink-0 group-hover:bg-green-500/20 transition">
                <Send className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">WhatsApp Order</h3>
                <p className="text-green-400 font-medium">Chat &amp; Order</p>
                <p className="text-xs text-muted-foreground mt-1">Quick, easy, no app needed</p>
              </div>
            </button>

            {/* Location */}
            <a
              href={GOOGLE_MAPS}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Visit Us</h3>
                <p className="text-sm text-muted-foreground">{ADDRESS}</p>
                <p className="text-xs text-primary mt-1">Get Directions →</p>
              </div>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL}`}
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary/20 transition">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Email Us</h3>
                <p className="text-primary font-medium">{EMAIL}</p>
                <p className="text-xs text-muted-foreground mt-1">For inquiries &amp; events</p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border card-hover group"
            >
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 flex-shrink-0 group-hover:bg-pink-500/20 transition">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Instagram</h3>
                <p className="text-pink-400 font-medium">@highspiritscafe</p>
                <p className="text-xs text-muted-foreground mt-1">Live updates &amp; photos</p>
              </div>
            </a>

            {/* Hours */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">Hours</h3>
                <p className="text-sm text-muted-foreground">Open Daily: 12 PM – 12:30 AM</p>
                <p className="text-xs text-amber-400 mt-1">Happy Hour: 12 PM – 6 PM</p>
              </div>
            </div>
          </div>

          {/* Map Embed */}
          <div className="mt-8 rounded-2xl overflow-hidden border border-border h-64 sm:h-80">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.9!2d73.89!3d18.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHigh+Spirits+Cafe+Koregaon+Park+Pune!5e0!3m2!1sen!2sin!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="High Spirits Cafe Location"
            />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-muted border-t border-border py-8 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-primary font-bold">H</span>
              </div>
              <div>
                <span className="text-primary font-bold tracking-wide">HIGH SPIRITS CAFE</span>
              </div>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              <p>{ADDRESS}</p>
              <p className="mt-1">GST No: 27AAIPI0115J1Z0</p>
            </div>
            <div className="flex items-center gap-3">
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-pink-400 hover:border-pink-400/30 transition">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={PHONE_TEL} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition">
                <Phone className="w-4 h-4" />
              </a>
              <a href={`mailto:${EMAIL}`} className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">
            © 2026 High Spirits Cafe, Pune. All rights reserved.
          </div>
        </div>
      </footer>

      {/* ===== FLOATING WHATSAPP BUTTON ===== */}
      <button
        onClick={sendWhatsAppOrder}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/30 transition whatsapp-pulse"
        title="Order on WhatsApp"
      >
        <Send className="w-6 h-6" />
      </button>

      {/* ===== ORDER FLOATING BAR ===== */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-6 left-6 right-24 z-40 sm:left-auto sm:right-24 sm:w-80">
          <div className="bg-card border border-primary/30 rounded-2xl p-4 shadow-xl shadow-primary/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-primary">Your Order</span>
              <button
                onClick={() => setOrderItems([])}
                className="text-xs text-muted-foreground hover:text-destructive"
              >
                Clear all
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto space-y-1 mb-2">
              {orderItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground truncate flex-1">{item.name}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-primary">₹{item.price}</span>
                    <button
                      onClick={() => removeFromOrder(i)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="font-bold text-foreground">Total: ₹{orderTotal}</span>
              <button
                onClick={sendWhatsAppOrder}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                WhatsApp Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESERVATION MODAL ===== */}
      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/5 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-foreground">Reserve a Table</h2>
              <button
                onClick={() => { setShowReservation(false); setReservationSubmitted(false); }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {reservationSubmitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Reservation Requested!</h3>
                <p className="text-muted-foreground text-sm">
                  We&apos;ll confirm your booking via WhatsApp or phone call shortly.
                </p>
                <button
                  onClick={() => { setShowReservation(false); setReservationSubmitted(false); }}
                  className="mt-6 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleReservation} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={reservationForm.name}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone *</label>
                  <input
                    type="tel"
                    required
                    value={reservationForm.phone}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Date *</label>
                    <input
                      type="date"
                      required
                      value={reservationForm.date}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Time *</label>
                    <input
                      type="time"
                      required
                      value={reservationForm.time}
                      onChange={(e) => setReservationForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Guests *</label>
                  <select
                    value={reservationForm.guests}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, guests: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => (
                      <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Occasion (Optional)</label>
                  <select
                    value={reservationForm.occasion}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, occasion: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="">Select occasion</option>
                    <option value="casual">Casual Hangout</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="date">Date Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Special Requests (Optional)</label>
                  <textarea
                    value={reservationForm.message}
                    onChange={(e) => setReservationForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows={2}
                    placeholder="Any special requests..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition text-lg"
                >
                  Reserve Now
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ===== SCROLL TO TOP ===== */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 left-6 z-40 w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Simple camera icon component since we don't have one from lucide
function Camera({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
      <circle cx="12" cy="13" r="3" />
    </svg>
  );
}
