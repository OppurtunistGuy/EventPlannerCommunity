'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu as MenuIcon, X, Key, CalendarDays, RefreshCw, FileText, Receipt,
  Home, UtensilsCrossed, BookOpen, Camera, MapPin, Info, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { useBusiness } from '@/lib/business-config';

interface NavProps {
  selectedTable?: { id: string; number: number; area: string } | null;
  activeReservation?: { code: string } | null;
  billRequested?: boolean;
  billRequesting?: boolean;
  onBillRequest?: () => void;
  onViewBill?: () => void;
  onShowLookup?: () => void;
  onShowReservation?: () => void;
}

export default function Navigation({
  selectedTable,
  activeReservation,
  billRequested,
  billRequesting,
  onBillRequest,
  onViewBill,
  onShowLookup,
  onShowReservation,
}: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();
  const { isDemo, setIsDemo } = useBusiness();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/reservations', label: 'Reservations', icon: BookOpen },
    { href: '/gallery', label: 'Gallery', icon: Camera },
    { href: '/about', label: 'About', icon: Info },
    { href: '/contact', label: 'Contact', icon: MapPin },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-white/95 backdrop-blur-md shadow-sm'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[var(--font-display)] text-xl font-bold tracking-tight text-[var(--color-primary)]">
              High Spirits
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
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
            {/* Demo/Live Toggle */}
            <button
              onClick={() => setIsDemo(!isDemo)}
              className={`hidden sm:flex items-center gap-1.5 text-[10px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                isDemo
                  ? 'border-amber-400/50 bg-amber-50 text-amber-700'
                  : 'border-green-500/50 bg-green-50 text-green-700'
              }`}
              title={isDemo ? 'Demo Mode — showing dummy info' : 'Live Mode — showing real info'}
            >
              {isDemo ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
              {isDemo ? 'DEMO' : 'LIVE'}
            </button>

            {selectedTable && !billRequested && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onBillRequest}
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
                onClick={onViewBill}
                className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-opacity"
              >
                <Receipt className="w-3.5 h-3.5" /> View bill
              </motion.button>
            )}

            <button onClick={onShowLookup} className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all">
              <Key className="w-3.5 h-3.5" /> My Reservation
            </button>
            <button onClick={onShowReservation} className="hidden sm:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 transition-all">
              <CalendarDays className="w-3.5 h-3.5" /> Reserve
            </button>

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

              {navLinks.map(link => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
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
                <button onClick={() => { onShowLookup?.(); setMobileNavOpen(false); }} className="flex items-center gap-3 text-left text-base font-medium text-[var(--color-accent)]">
                  <Key className="w-4 h-4" /> My Reservation
                </button>
                <button onClick={() => { onShowReservation?.(); setMobileNavOpen(false); }} className="flex items-center gap-3 text-left text-base font-medium text-[var(--color-primary)]">
                  <CalendarDays className="w-4 h-4" /> Reserve a Table
                </button>
                {selectedTable && !billRequested && (
                  <button onClick={() => { onBillRequest?.(); setMobileNavOpen(false); }} className="flex items-center gap-3 text-sm font-medium text-[var(--color-primary)]">
                    <FileText className="w-4 h-4" /> Bill Request
                  </button>
                )}
                {selectedTable && billRequested && (
                  <button onClick={() => { onViewBill?.(); setMobileNavOpen(false); }} className="flex items-center gap-3 text-sm font-medium text-[var(--color-primary)]">
                    <Receipt className="w-4 h-4" /> View My Bill
                  </button>
                )}
              </div>

              {/* Demo/Live Toggle in mobile */}
              <div className="border-t border-[var(--color-border)] pt-4">
                <button
                  onClick={() => setIsDemo(!isDemo)}
                  className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-all w-full justify-center ${
                    isDemo
                      ? 'border-amber-400/50 bg-amber-50 text-amber-700'
                      : 'border-green-500/50 bg-green-50 text-green-700'
                  }`}
                >
                  {isDemo ? <ToggleLeft className="w-3.5 h-3.5" /> : <ToggleRight className="w-3.5 h-3.5" />}
                  {isDemo ? 'DEMO MODE' : 'LIVE MODE'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
