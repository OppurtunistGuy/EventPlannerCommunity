'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, CalendarDays, Music, Mic, PartyPopper, Sun, Clock,
  ArrowUp,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { EventData, fadeUp } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const INTERIOR_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg';
const COCKTAIL_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg';
const FOOD_IMG = 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg';

export default function AboutPage() {
  const {
    selectedTable, activeReservation,
    showReservation, setShowReservation,
    showLookupModal, setShowLookupModal,
    billRequested, billRequesting,
    setBillData, setShowBill,
    setBillRequested, setBillRequesting,
  } = useApp();

  const [events, setEvents] = useState<EventData[]>([]);
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

      <TableBar />

      <section className="py-12 sm:py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">Since 2005</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Our Story</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
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
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="grid grid-cols-2 gap-3">
              <img src={INTERIOR_IMG} alt="Interior" className="rounded-xl object-cover w-full h-48 sm:h-64" />
              <img src={COCKTAIL_IMG} alt="Cocktails" className="rounded-xl object-cover w-full h-48 sm:h-64 mt-6" />
              <img src={FOOD_IMG} alt="Food" className="rounded-xl object-cover w-full h-48 sm:h-64 -mt-6" />
              <div className="rounded-xl bg-[var(--color-primary)] text-white flex flex-col items-center justify-center p-5 h-48 sm:h-64">
                <div className="flex items-center gap-1 mb-2">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className={`w-5 h-5 ${i <= 4 ? 'fill-[var(--color-accent)] text-[var(--color-accent)]' : 'fill-white/30 text-white/30'}`} />
                  ))}
                </div>
                <p className="font-[var(--font-display)] text-lg font-bold">4.6 on Google</p>
                <p className="text-xs text-white/60 mt-1">Based on 2,800+ reviews</p>
              </div>
            </motion.div>
          </div>

          {/* Events section */}
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

      <Footer />

      <ReservationModal />
      <LookupModal />
      <CartSidebar />
      <BillModal />
      <FloatingCartButton />
      <OrderSuccessToast />

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
