'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CalendarDays, Key, RefreshCw, ArrowUp, Check, Copy, Ticket, Users,
  Phone, Mail, Clock, MapPin, Send,
} from 'lucide-react';
import Link from 'next/link';
import { useBusiness } from '@/lib/business-config';
import { useApp } from '@/lib/app-context';
import { ActiveReservation, TableInfo, AREA_LABELS, fadeUp, fmt, isRestaurantOpen } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HappyHoursAnnouncement from '@/components/HappyHoursAnnouncement';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

export default function ReservationsPage() {
  const { info } = useBusiness();
  const {
    selectedTable, activeReservation,
    showReservation, setShowReservation,
    showLookupModal, setShowLookupModal,
    setActiveReservation, setSelectedTable,
    setCart,
    lookupReservationByCode,
  } = useApp();

  const [restaurantStatus] = useState(isRestaurantOpen());
  const [scrolled, setScrolled] = useState(false);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [lookupSuccess, setLookupSuccess] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLookup = async () => {
    if (!lookupCode.trim() || lookupCode.trim().length !== 6) return;
    setLookupLoading(true);
    setLookupError('');
    setLookupSuccess(false);
    const success = await lookupReservationByCode(lookupCode);
    setLookupLoading(false);
    if (success) {
      setLookupCode('');
      setLookupSuccess(true);
      setTimeout(() => setLookupSuccess(false), 3000);
    } else {
      setLookupError('Reservation not found. Please check your 6-digit code.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <HappyHoursAnnouncement />
      <TableBar />

      <section className="py-12 sm:py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">Book Your Table</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Reservations</h2>
            <div className="divider mx-auto mt-4" />
            <p className="text-sm text-[var(--color-muted-foreground)] mt-4 max-w-lg mx-auto">
              Reserve a table and receive an instant 6-digit code. Use it to access your table, order from the menu, and request your bill.
            </p>
          </motion.div>

          {/* Two-column layout */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Reserve a Table */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                  <CalendarDays className="w-5 h-5 text-[var(--color-primary)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-foreground)]">New Reservation</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">A table will be auto-assigned</p>
                </div>
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                Fill in your details and we&apos;ll automatically assign the best available table for your party size. You&apos;ll receive a 6-digit code to access your table and place orders.
              </p>
              <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-xl p-3 mb-4">
                <p className="text-xs text-[var(--color-foreground)]">After confirmation, you&apos;ll receive a <strong>6-digit code</strong> to access your table and order. Save this code!</p>
              </div>
              <button onClick={() => setShowReservation(true)} className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                <CalendarDays className="w-4 h-4" /> Reserve a Table
              </button>
            </motion.div>

            {/* Lookup Reservation */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
              className="bg-white rounded-xl border border-[var(--color-border)] p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center">
                  <Key className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--color-foreground)]">Have a Code?</h3>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Enter your 6-digit reservation code</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Reservation Code</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={lookupCode}
                    onChange={e => { setLookupCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setLookupError(''); }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-lg font-mono text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    onKeyDown={e => { if (e.key === 'Enter') handleLookup(); }}
                  />
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2.5 py-1 rounded-full">Test code: 777777 (Table 7)</span>
                </div>
                {lookupError && (
                  <p className="text-sm text-[var(--color-destructive)] text-center">{lookupError}</p>
                )}
                {lookupSuccess && (
                  <p className="text-sm text-[#27AE60] text-center">Reservation found! You can now order from the menu.</p>
                )}
                <button
                  onClick={handleLookup}
                  disabled={lookupLoading || !lookupCode.trim()}
                  className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {lookupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  {lookupLoading ? 'Looking up...' : 'Find My Reservation'}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Active Reservation Info */}
          {activeReservation && selectedTable && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="mt-6 bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/20 rounded-xl p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                    <Users className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--color-foreground)]">Table {selectedTable.number}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{AREA_LABELS[selectedTable.area]} · {activeReservation.guests} guests</p>
                    <p className="text-xs text-[var(--color-accent)] font-medium mt-0.5">Code: {activeReservation.code}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/menu" className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                    Start Ordering
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* How it works */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-10 bg-white rounded-xl border border-[var(--color-border)] p-6">
            <h3 className="font-semibold text-[var(--color-foreground)] mb-4">How It Works</h3>
            <div className="grid sm:grid-cols-4 gap-4">
              {[
                { step: '1', title: 'Reserve', desc: 'Fill in your details and get an auto-assigned table' },
                { step: '2', title: 'Get Code', desc: 'Receive a 6-digit code to access your reservation' },
                { step: '3', title: 'Order', desc: 'Browse the menu and add items from your table' },
                { step: '4', title: 'Bill', desc: 'Request your bill when you\'re done' },
              ].map(item => (
                <div key={item.step} className="text-center">
                  <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center mx-auto mb-2 text-sm font-bold">{item.step}</div>
                  <p className="text-sm font-medium text-[var(--color-foreground)]">{item.title}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
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
