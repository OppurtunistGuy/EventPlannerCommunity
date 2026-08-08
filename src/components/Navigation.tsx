'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon, X, Key, CalendarDays, RefreshCw, FileText, Receipt,
  UtensilsCrossed, MapPin, Music, Info, LogOut,
} from 'lucide-react';
import { useBusiness } from '@/lib/business-config';
import { useApp } from '@/lib/app-context';

export default function Navigation() {
  const {
    selectedTable, billRequested, billRequesting,
    requestBill, fetchBill, endSession,
    setShowLookupModal, setShowReservation,
    activeReservation,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { isDemo, setIsDemo } = useBusiness();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // State A: No active reservation — marketing mode
  const navLinksBrowsing = [
    { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/about', label: "What's On", icon: Music },
    { href: '/contact', label: 'Visit', icon: MapPin },
    { href: '/about', label: 'About', icon: Info },
  ];

  // State B: Active reservation — dining mode
  const navLinksDining = [
    { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/about', label: "What's On", icon: Music },
    { href: '/contact', label: 'Visit', icon: MapPin },
  ];

  const isDining = !!selectedTable;
  const navLinks = isDining ? navLinksDining : navLinksBrowsing;

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const handleBillRequest = () => {
    requestBill();
    setMobileNavOpen(false);
  };

  const handleViewBill = () => {
    if (selectedTable) fetchBill(selectedTable.id);
    setMobileNavOpen(false);
  };

  const handleEndSession = () => {
    endSession();
    setMobileNavOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/95 backdrop-blur-md ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <span className="font-[var(--font-display)] text-xl font-bold tracking-tight text-[var(--color-primary)]">
              High Spirits
            </span>
            <span className="hidden sm:inline text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)] mt-1">Cafe</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive(link.href)
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Dining session indicator */}
            {isDining && selectedTable && (
              <div className="hidden md:flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  Table {selectedTable.number}
                </span>
                {!billRequested && (
                  <button
                    onClick={handleBillRequest}
                    disabled={billRequesting}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {billRequesting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
                    Bill
                  </button>
                )}
                {billRequested && (
                  <button
                    onClick={handleViewBill}
                    className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
                  >
                    <Receipt className="w-3 h-3" /> Bill
                  </button>
                )}
              </div>
            )}

            {/* My Reservation — secondary action */}
            {!isDining && (
              <button onClick={() => setShowLookupModal(true)} className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all">
                <Key className="w-3.5 h-3.5" /> My Reservation
              </button>
            )}

            {/* Reserve a Table — primary CTA (only when not dining) */}
            {!isDining && (
              <button onClick={() => setShowReservation(true)} className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-all">
                <CalendarDays className="w-3.5 h-3.5" /> Reserve
              </button>
            )}

            {/* End Session (when dining) */}
            {isDining && (
              <button onClick={handleEndSession} className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border border-[var(--color-destructive)]/30 text-[var(--color-destructive)] hover:bg-[var(--color-destructive)] hover:text-white transition-all">
                <LogOut className="w-3 h-3" /> End
              </button>
            )}

            {/* Mobile hamburger */}
            <button onClick={() => setMobileNavOpen(!mobileNavOpen)} className="md:hidden p-1.5 text-[var(--color-foreground)]">
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
              className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-xl p-6 flex flex-col gap-4"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between">
                <span className="font-[var(--font-display)] text-lg font-bold text-[var(--color-primary)]">High Spirits</span>
                <button onClick={() => setMobileNavOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              {/* Mobile dining session info */}
              {isDining && selectedTable && (
                <div className="bg-[var(--color-primary)]/5 border border-[var(--color-primary)]/20 rounded-xl p-3">
                  <p className="text-sm font-semibold text-[var(--color-primary)]">Table {selectedTable.number} · {activeReservation?.code}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">Indoor · Dining</p>
                </div>
              )}

              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href + link.label}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={`flex items-center gap-3 text-left text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-foreground)] hover:text-[var(--color-primary)]'
                    }`}
                  >
                    <Icon className="w-4 h-4" /> {link.label}
                  </Link>
                );
              })}

              <div className="border-t border-[var(--color-border)] pt-4 flex flex-col gap-3">
                {!isDining && (
                  <>
                    <button onClick={() => { setShowLookupModal(true); setMobileNavOpen(false); }} className="flex items-center gap-3 text-left text-base font-medium text-[var(--color-accent)]">
                      <Key className="w-4 h-4" /> My Reservation
                    </button>
                    <button onClick={() => { setShowReservation(true); setMobileNavOpen(false); }} className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2">
                      <CalendarDays className="w-4 h-4" /> Reserve a Table
                    </button>
                  </>
                )}
                {isDining && (
                  <>
                    {!billRequested && (
                      <button onClick={handleBillRequest} className="flex items-center gap-3 text-sm font-medium text-[var(--color-primary)]">
                        <FileText className="w-4 h-4" /> Request Bill
                      </button>
                    )}
                    {billRequested && (
                      <button onClick={handleViewBill} className="flex items-center gap-3 text-sm font-medium text-[var(--color-primary)]">
                        <Receipt className="w-4 h-4" /> View Bill
                      </button>
                    )}
                    <button onClick={handleEndSession} className="flex items-center gap-3 text-sm font-medium text-[var(--color-destructive)]">
                      <LogOut className="w-4 h-4" /> End Session
                    </button>
                  </>
                )}
              </div>

              {/* Demo toggle — internal/development only */}
              <div className="mt-auto border-t border-[var(--color-border)] pt-4">
                <button
                  onClick={() => setIsDemo(!isDemo)}
                  className={`flex items-center gap-2 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    isDemo
                      ? 'border-amber-400/50 bg-amber-50 text-amber-700'
                      : 'border-green-500/50 bg-green-50 text-green-700'
                  }`}
                >
                  {isDemo ? 'DEV: DEMO' : 'DEV: LIVE'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
