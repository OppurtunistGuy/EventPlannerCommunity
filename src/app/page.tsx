'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Search, Phone, MapPin, Clock, ChevronDown, ChevronUp,
  Flame, Leaf, X, Menu as MenuIcon,
  CalendarDays, Music, Mic, PartyPopper, Sun, Send,
  Instagram, Mail, ArrowUp, Check
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
const ADDRESS = '35A/1, Near ABC Farm, Behind Burger King, Koregaon Park, Pune 411001';
const EMAIL = 'highspiritscafe@gmail.com';
const INSTAGRAM = 'https://instagram.com/highspiritscafe/';
const GOOGLE_MAPS = 'https://maps.google.com/?q=High+Spirits+Cafe+Koregaon+Park+Pune';

// Real images from search
const HERO_IMAGE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg';
const COCKTAIL_IMAGE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg';
const FOOD_IMAGE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg';
const INTERIOR_IMAGE = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg';

const TABS = [
  { key: 'offers', label: 'Happy Hour', icon: '🎉', sublabel: '12–6 PM' },
  { key: 'food', label: 'Food', icon: '🍽' },
  { key: 'bar', label: 'Bar', icon: '🍸' },
  { key: 'coffee', label: 'Coffee', icon: '☕' },
  { key: 'vintage', label: 'Vintage', icon: '🏷', sublabel: 'Tue & Thu' },
];

const EVENT_TYPE_LABEL: Record<string, string> = {
  'live': 'Live Music',
  'open-mic': 'Open Mic',
  'themed': 'Special',
  'dj': 'Sundowner',
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
  const startMinutes = 12 * 60;
  const endMinutes = 18 * 60;

  if (currentMinutes >= startMinutes && currentMinutes < endMinutes) {
    const remaining = endMinutes - currentMinutes;
    const hoursLeft = Math.floor(remaining / 60);
    const minsLeft = remaining % 60;
    return { isActive: true, message: `Happy Hour ON — ends in ${hoursLeft}h ${minsLeft}m` };
  }
  if (currentMinutes < startMinutes) {
    const until = startMinutes - currentMinutes;
    return { isActive: false, message: `Happy Hour starts at 12 PM today` };
  }
  return { isActive: false, message: 'Happy Hour starts tomorrow at 12 PM' };
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

  useEffect(() => {
    fetch('/api/menu').then(r => r.json()).then(setMenuData).catch(console.error);
    fetch('/api/events').then(r => r.json()).then(setEvents).catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setHappyHour(getHappyHourStatus()), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (menuData[tab]?.length) {
      setExpandedCategories(new Set([menuData[tab][0].id]));
    }
  };

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const getFilteredItems = useCallback((items: MenuItem[]) => {
    let filtered = items;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(q) || (item.description && item.description.toLowerCase().includes(q))
      );
    }
    if (vegFilter === 'veg') filtered = filtered.filter(i => i.isVeg);
    if (vegFilter === 'nonveg') filtered = filtered.filter(i => !i.isVeg);
    return filtered;
  }, [searchQuery, vegFilter]);

  const addToOrder = (name: string, price: number) => setOrderItems(prev => [...prev, { name, price }]);
  const removeFromOrder = (index: number) => setOrderItems(prev => prev.filter((_, i) => i !== index));
  const orderTotal = orderItems.reduce((sum, item) => sum + item.price, 0);

  const sendWhatsAppOrder = () => {
    if (orderItems.length === 0) { window.open(WHATSAPP, '_blank'); return; }
    const itemsList = orderItems.map(i => `${i.name} — ₹${i.price}`).join('\n');
    const total = `Total: ₹${orderTotal}`;
    const message = encodeURIComponent(`Hi! I'd like to order from High Spirits Cafe:\n\n${itemsList}\n\n${total}`);
    window.open(`https://wa.me/919765400484?text=${message}`, '_blank');
  };

  const handleReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationForm),
      });
      setReservationSubmitted(true);
    } catch (err) { console.error(err); }
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">

      {/* ===== NAVBAR ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <button onClick={() => scrollTo('hero')} className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>High Spirits</span>
              <span className="text-muted-foreground text-xs tracking-widest uppercase hidden sm:inline">Cafe</span>
            </button>

            <div className="hidden md:flex items-center gap-6">
              {[
                { id: 'menu', label: 'Menu' },
                { id: 'events', label: 'Events' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="text-sm text-muted-foreground hover:text-foreground transition"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => setShowReservation(true)}
                className="ml-2 px-4 py-1.5 bg-primary text-primary-foreground text-sm font-medium rounded hover:bg-primary/90 transition"
              >
                Book a Table
              </button>
            </div>

            <button className="md:hidden p-2 text-muted-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-border">
            <div className="px-4 py-2 space-y-0">
              {[
                { id: 'menu', label: 'Menu' },
                { id: 'events', label: 'Events' },
                { id: 'about', label: 'About' },
                { id: 'contact', label: 'Contact' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => scrollTo(item.id)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => { setShowReservation(true); setMobileMenuOpen(false); }}
                className="w-full my-2 px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded"
              >
                Book a Table
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO ===== */}
      <section id="hero" className="relative min-h-screen flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="High Spirits Cafe interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative z-10 text-center px-4 max-w-2xl mx-auto">
          <p className="text-white/70 text-sm tracking-[0.25em] uppercase mb-4">Est. 2010 · Koregaon Park, Pune</p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            High Spirits<br />Cafe
          </h1>
          <p className="text-white/80 text-base sm:text-lg max-w-md mx-auto mb-8 leading-relaxed">
            Live music, craft cocktails, and great food — Pune&apos;s favourite hangout for over a decade.
          </p>

          {happyHour.isActive && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white text-sm">{happyHour.message}</span>
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => scrollTo('menu')}
              className="px-7 py-3 bg-white text-foreground font-medium rounded hover:bg-white/90 transition"
            >
              View Menu
            </button>
            <a
              href={PHONE_TEL}
              className="px-7 py-3 border border-white/40 text-white font-medium rounded hover:bg-white/10 transition"
            >
              <Phone className="w-4 h-4 inline mr-2" />Call Us
            </a>
          </div>
        </div>
      </section>

      {/* ===== HAPPY HOUR BANNER ===== */}
      <div className="bg-primary text-primary-foreground py-3 px-4 text-center">
        <p className="text-sm font-medium">
          🎉 Happy Hour Daily 12–6 PM — Beer ₹100 · Cocktails ₹150 · Mimosa ₹130
          <button onClick={() => scrollTo('menu')} className="ml-2 underline underline-offset-2 hover:no-underline">View all deals →</button>
        </p>
      </div>

      {/* ===== MENU SECTION ===== */}
      <section id="menu" className="py-16 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Menu</h2>
          <div className="section-divider mb-4" />
          <p className="text-muted-foreground text-sm">Browse our menu, add items, and order on WhatsApp.</p>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search — try &quot;paneer&quot;, &quot;cocktail&quot;, &quot;pizza&quot;..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all' as const, label: 'All' },
              { key: 'veg' as const, label: '🟢 Veg' },
              { key: 'nonveg' as const, label: '🔴 Non-Veg' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setVegFilter(f.key)}
                className={`px-4 py-2.5 rounded text-sm font-medium border transition ${
                  vegFilter === f.key
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-white border-border text-muted-foreground hover:border-primary/30'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 overflow-x-auto border-b border-border">
          {TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.sublabel && <span className="text-xs text-muted-foreground">({tab.sublabel})</span>}
            </button>
          ))}
        </div>

        {/* Menu Categories */}
        <div className="space-y-2">
          {menuData[activeTab]?.map(category => {
            const isExpanded = expandedCategories.has(category.id);
            const filteredItems = getFilteredItems(category.items);
            if (searchQuery && filteredItems.length === 0) return null;

            return (
              <div key={category.id} className="border border-border rounded bg-white">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{category.icon}</span>
                    <span className="font-semibold text-sm">{category.name}</span>
                    <span className="text-xs text-muted-foreground">({filteredItems.length})</span>
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-border">
                    {filteredItems.map(item => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 last:border-0 hover:bg-muted/30 transition"
                      >
                        <div className="flex-1 min-w-0 pr-3">
                          <div className="flex items-center gap-1.5">
                            <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center flex-shrink-0 ${
                              item.isVeg ? 'border-green-600' : 'border-red-600'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                            </span>
                            <span className="text-sm font-medium">{item.name}</span>
                            {item.isBestseller && (
                              <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">Popular</span>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 ml-5">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span className="text-sm font-semibold text-foreground">₹{item.price}</span>
                          <button
                            onClick={() => addToOrder(item.name, item.price)}
                            className="w-7 h-7 rounded border border-border bg-white hover:bg-primary hover:text-primary-foreground hover:border-primary flex items-center justify-center text-sm transition"
                            title="Add to order"
                          >
                            +
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

        {searchQuery && !Object.values(menuData).flat().some(cat => getFilteredItems(cat.items).length > 0) && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No items found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </section>

      {/* ===== EVENTS ===== */}
      <section id="events" className="py-16 px-4 sm:px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>What&apos;s On</h2>
            <div className="section-divider mb-4" />
            <p className="text-muted-foreground text-sm">Live gigs, open mic, and themed nights — there&apos;s always something happening.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {events.map(event => (
              <div key={event.id} className="bg-white border border-border rounded p-5 card-hover">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/5 px-2 py-0.5 rounded uppercase tracking-wider">
                    {EVENT_TYPE_LABEL[event.type] || event.type}
                  </span>
                  {event.isFeatured && (
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">Featured</span>
                  )}
                </div>
                <h3 className="font-semibold text-base mb-1.5">{event.title}</h3>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {event.date}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      <section id="about" className="py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>About Us</h2>
              <div className="section-divider mb-6" />
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                High Spirits Cafe in Pune, India, is a beloved nightlife hotspot that has been a fixture in Koregaon Park for over a decade. With its inviting open-air setting, adorned with fairy lights, it&apos;s a gathering place for both locals and visitors.
              </p>
              <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
                The venue&apos;s eclectic music scene, ranging from live bands to DJ sets, ensures there&apos;s always something for every music lover. Coupled with a delectable menu of bar snacks and heartier fare, along with an impressive drinks selection, High Spirits offers a complete experience for a memorable night out.
              </p>
              <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                What truly sets High Spirits apart is its dedication to building a sense of community. Through events like themed parties, live gigs, and open mic nights, it creates a space where creativity and camaraderie flourish.
              </p>
              <div className="flex gap-8">
                <div>
                  <span className="text-2xl font-bold text-primary">10+</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Years in Pune</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">100+</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Drinks on Menu</p>
                </div>
                <div>
                  <span className="text-2xl font-bold text-primary">₹100</span>
                  <p className="text-xs text-muted-foreground mt-0.5">Happy Hour Beer</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-[3/4] rounded overflow-hidden">
                <img src={INTERIOR_IMAGE} alt="Cafe interior" className="w-full h-full object-cover" />
              </div>
              <div className="aspect-[3/4] rounded overflow-hidden mt-8">
                <img src={COCKTAIL_IMAGE} alt="Cocktails at the bar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-16 px-4 sm:px-6 bg-muted">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, serif' }}>Find Us</h2>
            <div className="section-divider mb-4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-border rounded p-5">
              <h3 className="font-semibold text-sm mb-3">Visit Us</h3>
              <p className="text-sm text-muted-foreground mb-3">{ADDRESS}</p>
              <a href={GOOGLE_MAPS} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                Get Directions →
              </a>
            </div>

            <div className="bg-white border border-border rounded p-5">
              <h3 className="font-semibold text-sm mb-3">Contact</h3>
              <a href={PHONE_TEL} className="block text-sm text-primary hover:underline mb-1.5">{PHONE}</a>
              <a href={`mailto:${EMAIL}`} className="block text-sm text-primary hover:underline mb-1.5">{EMAIL}</a>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                <Instagram className="w-4 h-4" /> @highspiritscafe
              </a>
            </div>

            <div className="bg-white border border-border rounded p-5">
              <h3 className="font-semibold text-sm mb-3">Hours</h3>
              <p className="text-sm text-muted-foreground">Open Daily: 12 PM – 12:30 AM</p>
              <p className="text-sm text-primary font-medium mt-1">Happy Hour: 12 PM – 6 PM</p>
              <p className="text-sm text-muted-foreground mt-1">Vintage Nights: Tue & Thu</p>
            </div>
          </div>

          {/* Map */}
          <div className="rounded overflow-hidden border border-border h-64">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.9!2d73.89!3d18.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sHigh+Spirits+Cafe+Koregaon+Park+Pune!5e0!3m2!1sen!2sin!4v1"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
              referrerPolicy="no-referrer-when-downgrade" title="High Spirits Cafe Location"
            />
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-foreground text-background py-8 px-4 sm:px-6 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>High Spirits Cafe</span>
              <p className="text-sm text-background/60 mt-1">{ADDRESS}</p>
            </div>
            <div className="flex items-center gap-4">
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="text-background/60 hover:text-background transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href={PHONE_TEL} className="text-background/60 hover:text-background transition">
                <Phone className="w-5 h-5" />
              </a>
              <a href={`mailto:${EMAIL}`} className="text-background/60 hover:text-background transition">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-background/10 text-center text-xs text-background/40">
            GST No: 27AAIPI0115J1Z0 · © 2026 High Spirits Cafe, Pune
          </div>
        </div>
      </footer>

      {/* ===== FLOATING WHATSAPP ===== */}
      <button
        onClick={sendWhatsAppOrder}
        className="fixed bottom-5 right-5 z-40 w-12 h-12 bg-green-500 hover:bg-green-600 text-white rounded-full flex items-center justify-center shadow-md transition whatsapp-pulse"
        title="Order on WhatsApp"
      >
        <Send className="w-5 h-5" />
      </button>

      {/* ===== ORDER FLOATING BAR ===== */}
      {orderItems.length > 0 && (
        <div className="fixed bottom-5 left-5 right-20 z-40 sm:left-auto sm:right-20 sm:w-72">
          <div className="bg-white border border-border rounded-lg p-3 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold">Your Order ({orderItems.length})</span>
              <button onClick={() => setOrderItems([])} className="text-xs text-muted-foreground hover:text-destructive">Clear</button>
            </div>
            <div className="max-h-28 overflow-y-auto space-y-1 mb-2">
              {orderItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate flex-1">{item.name}</span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="font-medium">₹{item.price}</span>
                    <button onClick={() => removeFromOrder(i)} className="text-muted-foreground hover:text-destructive"><X className="w-3 h-3" /></button>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-bold">₹{orderTotal}</span>
              <button
                onClick={sendWhatsAppOrder}
                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded transition flex items-center gap-1"
              >
                <Send className="w-3 h-3" /> Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== RESERVATION MODAL ===== */}
      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
          <div className="bg-white border border-border rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold" style={{ fontFamily: 'Georgia, serif' }}>Book a Table</h2>
              <button onClick={() => { setShowReservation(false); setReservationSubmitted(false); }} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            {reservationSubmitted ? (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-green-50 flex items-center justify-center">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-lg mb-1">Reservation Requested!</h3>
                <p className="text-sm text-muted-foreground">We&apos;ll confirm your booking via WhatsApp or phone shortly.</p>
                <button
                  onClick={() => { setShowReservation(false); setReservationSubmitted(false); }}
                  className="mt-5 px-5 py-2 bg-primary text-primary-foreground rounded text-sm font-medium"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleReservation} className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Name *</label>
                  <input type="text" required value={reservationForm.name} onChange={(e) => setReservationForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Phone *</label>
                  <input type="tel" required value={reservationForm.phone} onChange={(e) => setReservationForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="+91 98765 43210" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Date *</label>
                    <input type="date" required value={reservationForm.date} onChange={(e) => setReservationForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Time *</label>
                    <input type="time" required value={reservationForm.time} onChange={(e) => setReservationForm(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Guests *</label>
                  <select value={reservationForm.guests} onChange={(e) => setReservationForm(prev => ({ ...prev, guests: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    {[1, 2, 3, 4, 5, 6, 7, 8, '9+'].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Occasion</label>
                  <select value={reservationForm.occasion} onChange={(e) => setReservationForm(prev => ({ ...prev, occasion: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                    <option value="">Select (optional)</option>
                    <option value="casual">Casual Hangout</option>
                    <option value="birthday">Birthday</option>
                    <option value="anniversary">Anniversary</option>
                    <option value="corporate">Corporate</option>
                    <option value="date">Date Night</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Special Requests</label>
                  <textarea value={reservationForm.message} onChange={(e) => setReservationForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" rows={2} placeholder="Any special requests..." />
                </div>
                <button type="submit" className="w-full py-2.5 bg-primary text-primary-foreground font-medium rounded text-sm hover:bg-primary/90 transition">
                  Book Now
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
          className="fixed bottom-5 left-5 z-40 w-9 h-9 bg-white border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground shadow-sm transition"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
