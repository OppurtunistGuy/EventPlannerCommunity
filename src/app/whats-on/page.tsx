'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, CalendarDays, Clock, MapPin, ArrowRight,
  Music, Mic, PartyPopper, Sun, ChevronDown,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { EventData, fadeUp } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const HERO_IMG = '/images/hero-whats-on.png';

const CATEGORIES = [
  { key: 'all', label: 'All Events' },
  { key: 'live', label: 'Live Music' },
  { key: 'open-mic', label: 'Open Mic' },
  { key: 'dj', label: 'DJ Nights' },
  { key: 'themed', label: 'Offers' },
  { key: 'special', label: 'Specials' },
];

const TIME_FILTERS = [
  { key: 'this-week', label: 'This Week' },
  { key: 'next-week', label: 'Next Week' },
  { key: 'this-month', label: 'This Month' },
  { key: 'all', label: 'All Upcoming' },
];

function getEventIcon(type: string) {
  switch (type) {
    case 'live': return Music;
    case 'open-mic': return Mic;
    case 'themed': return PartyPopper;
    case 'dj': return Sun;
    default: return Music;
  }
}

function getCategoryBadge(type: string) {
  switch (type) {
    case 'live': return 'Live Music';
    case 'open-mic': return 'Open Mic';
    case 'themed': return 'Offer';
    case 'dj': return 'DJ Night';
    default: return 'Event';
  }
}

export default function WhatsOnPage() {
  const { setShowReservation } = useApp();
  const [events, setEvents] = useState<EventData[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTime, setActiveTime] = useState('all');
  const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    fetch('/data/events.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Filter events
  const filteredEvents = events.filter((event) => {
    // Category filter
    if (activeCategory !== 'all') {
      if (activeCategory === 'special' && event.type !== 'special') return false;
      if (activeCategory !== 'special' && event.type !== activeCategory) return false;
    }
    // Time filter — since events are recurring ("Every Saturday", etc.), show all for "All Upcoming"
    // For other time filters, we still show recurring events as they happen every week
    return true;
  });

  const featuredEvents = filteredEvents.filter(e => e.isFeatured);
  const moreEvents = filteredEvents.filter(e => !e.isFeatured);

  // If no featured flag exists, treat first 2-3 as featured
  const displayFeatured = featuredEvents.length > 0 ? featuredEvents : filteredEvents.slice(0, 3);
  const displayMore = featuredEvents.length > 0 ? moreEvents : filteredEvents.slice(3);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <TableBar />

      {/* ===== HERO ===== */}
      <section className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] min-h-[380px] sm:min-h-[440px] flex items-end overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="What's On at High Spirits" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="section-label text-white/70 mb-3">WHAT&apos;S ON</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-4">
              Live music. Open mics. Good vibes.
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
              There&apos;s always something happening at High Spirits. Come for the music, stay for the nights you&apos;ll remember.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== FILTER BAR ===== */}
      <section className="bg-[var(--color-background)] border-b border-[var(--color-border)] sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeCategory === cat.key
                    ? 'bg-[var(--color-primary)] text-white'
                    : 'bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]'
                }`}
              >
                {cat.label}
              </button>
            ))}

            {/* Time filter dropdown */}
            <div className="relative ml-auto flex-shrink-0">
              <button
                onClick={() => setTimeDropdownOpen(!timeDropdownOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] transition-all"
              >
                {TIME_FILTERS.find(t => t.key === activeTime)?.label}
                <ChevronDown className={`w-4 h-4 transition-transform ${timeDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {timeDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 bg-white rounded-xl border border-[var(--color-border)] shadow-lg overflow-hidden z-10 min-w-[160px]"
                  >
                    {TIME_FILTERS.map((tf) => (
                      <button
                        key={tf.key}
                        onClick={() => { setActiveTime(tf.key); setTimeDropdownOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          activeTime === tf.key
                            ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium'
                            : 'text-[var(--color-foreground)] hover:bg-[var(--color-secondary)]'
                        }`}
                      >
                        {tf.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED THIS WEEK ===== */}
      {displayFeatured.length > 0 && (
        <section className="py-12 sm:py-16 bg-[var(--color-background)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="mb-8">
              <p className="section-label mb-2">THIS WEEK</p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] leading-[1.15]">
                Featured Events
              </h2>
            </motion.div>

            <div className="space-y-5">
              {displayFeatured.map((event, idx) => {
                const Icon = getEventIcon(event.type);
                return (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-30px' }}
                    variants={fadeUp}
                    transition={{ delay: idx * 0.08 }}
                    className="grid md:grid-cols-5 gap-5 bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Image placeholder / icon area */}
                    <div className="md:col-span-2 relative h-48 md:h-auto bg-[var(--color-primary)]/5 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Icon className="w-7 h-7 text-[var(--color-primary)]" />
                      </div>
                      {event.isFeatured && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-[var(--color-accent)] text-white px-2.5 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="md:col-span-3 p-5 sm:p-6 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-[var(--color-secondary)] text-[var(--color-primary)] px-2.5 py-1 rounded-full">
                          {getCategoryBadge(event.type)}
                        </span>
                      </div>
                      <h3 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold text-[var(--color-foreground)] mb-2">{event.title}</h3>
                      <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-4">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)] mb-4">
                        <span className="flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {event.time}</span>
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> High Spirits Cafe</span>
                      </div>
                      <button
                        onClick={() => setShowReservation(true)}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors"
                      >
                        Event Details <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===== MORE UPCOMING ===== */}
      {displayMore.length > 0 && (
        <section className="py-12 sm:py-16 bg-[var(--color-secondary)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="mb-8">
              <p className="section-label mb-2">MORE EVENTS</p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-[var(--color-foreground)] leading-[1.15]">
                More Upcoming
              </h2>
            </motion.div>

            <div className="space-y-3">
              {displayMore.map((event, idx) => {
                const Icon = getEventIcon(event.type);
                return (
                  <motion.div
                    key={event.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-20px' }}
                    variants={fadeUp}
                    transition={{ delay: idx * 0.06 }}
                    className="flex items-center gap-4 bg-white rounded-xl border border-[var(--color-border)] p-4 hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => setShowReservation(true)}
                  >
                    {/* Thumbnail */}
                    <div className="w-11 h-11 rounded-lg bg-[var(--color-primary)]/8 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                    </div>
                    {/* Date */}
                    <div className="flex-shrink-0 w-20 sm:w-24">
                      <p className="text-xs font-semibold text-[var(--color-foreground)]">{event.date}</p>
                    </div>
                    {/* Category badge */}
                    <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-wider bg-[var(--color-secondary)] text-[var(--color-primary)] px-2 py-0.5 rounded-full flex-shrink-0">
                      {getCategoryBadge(event.type)}
                    </span>
                    {/* Title */}
                    <h4 className="flex-1 min-w-0 text-sm font-semibold text-[var(--color-foreground)] truncate">{event.title}</h4>
                    {/* Time */}
                    <span className="hidden md:inline text-xs text-[var(--color-muted-foreground)] flex-shrink-0">{event.time}</span>
                    {/* Arrow */}
                    <ArrowRight className="w-4 h-4 text-[var(--color-muted-foreground)] flex-shrink-0" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <section className="py-20 bg-[var(--color-background)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-[var(--color-muted-foreground)]">No events found for this filter. Check back soon!</p>
          </div>
        </section>
      )}

      {/* ===== RESERVATION CTA ===== */}
      <section className="py-14 sm:py-16 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white leading-[1.15] mb-2">
              GREAT NIGHTS START HERE.
            </h2>
            <p className="text-white/60 text-sm mb-6">Book your table and be part of it.</p>
            <button
              onClick={() => setShowReservation(true)}
              className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4" /> Reserve a Table
            </button>
          </motion.div>
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
