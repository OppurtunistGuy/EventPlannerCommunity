'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  UtensilsCrossed, CalendarDays, Key, Music, Mic, PartyPopper, Sun,
  Star, ArrowUp, Check, RefreshCw, Clock, Tag, Coffee, Utensils, Wine, Sparkles,
} from 'lucide-react';
import { useBusiness } from '@/lib/business-config';
import { useApp } from '@/lib/app-context';
import { EventData, fadeUp, fmt, safeISTDate, isRestaurantOpen, getTimeLeft } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HappyHoursAnnouncement from '@/components/HappyHoursAnnouncement';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg';
const COCKTAIL_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg';
const FOOD_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg';
const INTERIOR_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg';

export default function HomePage() {
  const { info } = useBusiness();
  const {
    showReservation, setShowReservation,
    showLookupModal, setShowLookupModal,
    selectedTable, activeReservation,
    billRequested, billRequesting,
    setBillData, setShowBill,
    setBillRequested, setBillRequesting,
    cart, setCart,
  } = useApp();

  // Data
  const [events, setEvents] = useState<EventData[]>([]);
  const [happyHourTime, setHappyHourTime] = useState('');
  const [restaurantStatus, setRestaurantStatus] = useState({ open: false, closesAt: '' });
  const [scrolled, setScrolled] = useState(false);

  // Fetch events
  useEffect(() => {
    fetch('/data/events.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Timers
  useEffect(() => {
    const tick = () => {
      try {
        setHappyHourTime(getTimeLeft());
        setRestaurantStatus(isRestaurantOpen());
      } catch {}
    };
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const nextEvent = events.find(e => e.isFeatured) || events[0];

  const fetchBill = async (tableId: string) => {
    try {
      const res = await fetch(`/api/bill?tableId=${tableId}`);
      if (!res.ok) throw new Error(`bill ${res.status}`);
      const data = await res.json();
      setBillData(data);
      setShowBill(true);
    } catch {}
  };

  const requestBill = async () => {
    if (!selectedTable) return;
    setBillRequesting(true);
    try {
      const res = await fetch('/api/bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: selectedTable.id, reservationId: activeReservation?.id || null }),
      });
      if (!res.ok) throw new Error('Bill request failed');
      const data = await res.json();
      setBillData(data);
      setShowBill(true);
      setBillRequested(true);
    } catch {} finally {
      setBillRequesting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation
        selectedTable={selectedTable}
        activeReservation={activeReservation}
        billRequested={billRequested}
        billRequesting={billRequesting}
        onBillRequest={requestBill}
        onViewBill={() => selectedTable && fetchBill(selectedTable.id)}
        onShowLookup={() => setShowLookupModal(true)}
        onShowReservation={() => setShowReservation(true)}
      />

      <HappyHoursAnnouncement />

      {/* ===== HERO ===== */}
      <section id="hero" className="relative h-[85vh] min-h-[520px] flex items-end overflow-hidden mt-16">
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
              <Link href="/menu" className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-lg font-semibold text-sm hover:bg-white/90 transition-colors flex items-center gap-2">
                <UtensilsCrossed className="w-4 h-4" /> View Menu
              </Link>
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
            <span className={`flex items-center gap-1.5 text-xs font-medium ${restaurantStatus.open ? 'text-green-300' : 'text-red-300'}`}>
              <span className={`w-2 h-2 rounded-full ${restaurantStatus.open ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {restaurantStatus.open ? `Open · Closes at ${restaurantStatus.closesAt}` : `Closed · Opens at ${restaurantStatus.closesAt}`}
            </span>
            <span className="text-xs font-mono text-white/70">{happyHourTime}</span>
          </div>
        </div>
      </div>

      {/* ===== TABLE BAR ===== */}
      <TableBar />

      {/* ===== FEATURED SECTIONS ===== */}
      <section className="py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Quick Links Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            <Link href="/menu" className="group bg-white rounded-xl border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <UtensilsCrossed className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)] mb-1">Our Menu</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">Coffee, food, bar, and vintage specials. Happy Hour deals from 12–6 PM daily.</p>
              <span className="text-xs text-[var(--color-primary)] font-medium mt-2 inline-block group-hover:underline">Browse Menu →</span>
            </Link>

            <Link href="/reservations" className="group bg-white rounded-xl border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center mb-3">
                <CalendarDays className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)] mb-1">Reserve a Table</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">Auto-assigned tables, instant confirmation code. Already have a code? Look it up.</p>
              <span className="text-xs text-[var(--color-accent)] font-medium mt-2 inline-block group-hover:underline">Reserve Now →</span>
            </Link>

            <Link href="/about" className="group bg-white rounded-xl border border-[var(--color-border)] p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <Star className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-[var(--color-foreground)] mb-1">Our Story</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed">19+ years of live music, craft cocktails, and unforgettable nights. Walk in as a stranger, walk out as family.</p>
              <span className="text-xs text-[var(--color-primary)] font-medium mt-2 inline-block group-hover:underline">Learn More →</span>
            </Link>
          </div>

          {/* Upcoming Events */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">What&apos;s On</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Upcoming Events</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 3).map((event, idx) => (
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

          <div className="text-center mt-6">
            <Link href="/about" className="text-sm font-medium text-[var(--color-primary)] hover:underline">View all events →</Link>
          </div>
        </div>
      </section>

      {/* ===== CTA SECTION ===== */}
      <section className="py-12 sm:py-16 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h2 className="font-[var(--font-display)] text-2xl font-bold text-[var(--color-foreground)]">Ready to visit?</h2>
              <p className="text-sm text-[var(--color-muted-foreground)] mt-1">Reserve your table or just walk in — we&apos;d love to host you.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReservation(true)} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Reserve a Table
              </button>
              <a href={info.whatsapp} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center gap-2">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Modals */}
      <ReservationModal />
      <LookupModal />
      <CartSidebar />
      <BillModal />
      <FloatingCartButton />
      <OrderSuccessToast />

      {/* Scroll to top */}
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
