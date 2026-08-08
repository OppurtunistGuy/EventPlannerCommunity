'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  UtensilsCrossed, CalendarDays, Music, Mic, PartyPopper, Sun,
  Clock, MapPin, ArrowUp, Phone, Navigation as NavIcon,
} from 'lucide-react';
import { useBusiness } from '@/lib/business-config';
import { useApp } from '@/lib/app-context';
import { EventData, fadeUp, isRestaurantOpen } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const HERO_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg';

function getEventIcon(type: string) {
  switch (type) {
    case 'live': return Music;
    case 'open-mic': return Mic;
    case 'themed': return PartyPopper;
    case 'dj': return Sun;
    default: return Music;
  }
}

export default function HomePage() {
  const { info } = useBusiness();
  const { showReservation, setShowReservation } = useApp();

  const [events, setEvents] = useState<EventData[]>([]);
  const [restaurantStatus, setRestaurantStatus] = useState({ open: false, closesAt: '' });
  const [scrolled, setScrolled] = useState(false);

  // Fetch events
  useEffect(() => {
    fetch('/data/events.json')
      .then(r => r.ok ? r.json() : [])
      .then(data => setEvents(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Timer
  useEffect(() => {
    const tick = () => {
      try { setRestaurantStatus(isRestaurantOpen()); } catch {}
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* ===== HERO ===== */}
      <section id="hero" className="relative h-[70vh] sm:h-[75vh] lg:h-[85vh] min-h-[420px] sm:min-h-[520px] flex items-end overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="High Spirits Cafe — tropical outdoor seating" className="w-full h-full object-cover" />
          <div className="hero-overlay absolute inset-0" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.18em] text-white/60 mb-3">Koregaon Park, Pune</p>
            <h1 className="font-[var(--font-display)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-4">
              High Spirits<br />Cafe
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Live music, craft cocktails & unforgettable nights.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/menu" className="px-5 sm:px-6 py-3 bg-black/50 backdrop-blur-sm text-white rounded-xl font-semibold text-sm hover:bg-black/70 transition-colors flex items-center gap-2 border border-white/10">
                <UtensilsCrossed className="w-4 h-4" /> View Menu
              </Link>
              <button onClick={() => setShowReservation(true)} className="px-5 sm:px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-colors flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Reserve a Table
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ===== ESSENTIAL INFO STRIP ===== */}
      <section className="bg-[var(--color-secondary)] py-8 sm:py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { icon: Clock, label: 'Open Today', value: '12 PM – 1 AM' },
              { icon: MapPin, label: 'Location', value: 'Koregaon Park, Pune' },
              { icon: Music, label: 'Live Music', value: 'Every Weekend' },
              { icon: CalendarDays, label: 'Reservations', value: 'Fast & Easy' },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--color-primary)]/8 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">{item.label}</p>
                    <p className="text-sm font-semibold text-[var(--color-foreground)]">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHAT'S ON ===== */}
      {events.length > 0 && (
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
              <p className="section-label">What&apos;s On</p>
              <h2 className="section-heading text-3xl sm:text-4xl mt-2">Tonight & This Week</h2>
              <div className="divider mx-auto mt-4" />
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {events.slice(0, 3).map((event, idx) => {
                const Icon = getEventIcon(event.type);
                const hasImage = event.image && event.image.length > 0;
                return (
                  <motion.div key={event.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} transition={{ delay: idx * 0.08 }}
                    className="!bg-white rounded-2xl border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow group">
                    {/* Image area */}
                    <div className="relative h-44 overflow-hidden bg-[var(--color-primary)]/5">
                      {hasImage ? (
                        <img src={event.image!} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Icon className="w-8 h-8 text-[var(--color-primary)]/30" />
                        </div>
                      )}
                      {event.isFeatured && (
                        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[var(--color-foreground)] px-2.5 py-1 rounded-full backdrop-blur-sm">
                          Featured
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-5">
                      <h3 className="font-[family-name:var(--font-display)] text-lg font-bold text-[var(--color-foreground)] mb-1.5">{event.title}</h3>
                      <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex items-center gap-4 text-xs text-[var(--color-muted-foreground)] pt-3 border-t border-[var(--color-border)]">
                        <span className="flex items-center gap-1"><CalendarDays className="w-3 h-3" /> {event.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {event.time}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <div className="text-center mt-8">
              <Link href="/whats-on" className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors group">
                View all events
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===== VISIT US SECTION ===== */}
      <section className="py-12 sm:py-16 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
            {/* Left: Text */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-5 space-y-6">
              <div>
                <p className="section-label mb-3">Visit Us</p>
                <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-foreground)] leading-[1.15]">
                  Come by tonight.
                </h2>
              </div>

              <div className="space-y-3">
                <p className="font-semibold text-[var(--color-foreground)] text-lg">{info.name}</p>
                <p className="text-sm text-[var(--color-muted-foreground)]">{info.address}</p>

                <a
                  href={info.googleMaps}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-primary)] transition-colors mt-2"
                >
                  <NavIcon className="w-4 h-4" /> Get Directions
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </a>
              </div>
            </motion.div>

            {/* Center: Image */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-4 rounded-2xl overflow-hidden shadow-lg h-56 sm:h-72 lg:h-80">
              <img
                src="/images/visit-gallery-1.png"
                alt="High Spirits Cafe exterior"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>

            {/* Right: Details */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-3 space-y-6 lg:pl-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-foreground)] mb-1">Open Today</p>
                <p className="text-lg font-semibold text-[var(--color-foreground)]">12 PM – 1 AM</p>
              </div>

              <div className="space-y-3">
                <a href={info.phoneTel} className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
                  <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm">{info.phone}</span>
                </a>
                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors">
                  <Music className="w-4 h-4 text-[var(--color-primary)]" />
                  <span className="text-sm">@highspiritscafe</span>
                </a>
              </div>
            </motion.div>
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
