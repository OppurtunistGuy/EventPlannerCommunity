'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Phone, MapPin, Clock, Mail, Navigation as NavIcon, ExternalLink, Send,
  Instagram, Star, ArrowUp, CalendarDays,
} from 'lucide-react';
import { useBusiness } from '@/lib/business-config';
import { useApp } from '@/lib/app-context';
import { fadeUp, isRestaurantOpen } from '@/lib/shared';
import NavigationBar from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

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

export default function ContactPage() {
  const { info, isDemo } = useBusiness();
  const {
    showReservation, setShowReservation,
    showLookupModal, setShowLookupModal,
  } = useApp();

  const [restaurantStatus] = useState(isRestaurantOpen());
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <NavigationBar />

      <TableBar />

      <section className="py-12 sm:py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">Get In Touch</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Find Us</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          {/* Demo mode indicator */}
          {isDemo && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                <span className="text-amber-600 text-sm font-bold">!</span>
              </div>
              <div>
                <p className="text-sm font-medium text-amber-800">Demo Mode Active</p>
                <p className="text-xs text-amber-600">The contact details shown below are placeholder data. Switch to Live mode to see real business information.</p>
              </div>
            </motion.div>
          )}

          {/* Contact cards */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <a href={info.googleMaps} target="_blank" rel="noopener noreferrer"
              className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Address</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed mb-2">{info.address}</p>
              <span className="text-xs text-[var(--color-primary)] font-medium flex items-center gap-1 group-hover:underline">
                <NavIcon className="w-3 h-3" /> Get Directions
              </span>
            </a>

            <a href={info.phoneTel}
              className="bg-[var(--color-primary)] text-white rounded-xl p-5 hover:opacity-90 transition-opacity group cursor-pointer shadow-md">
              <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center mb-3">
                <Phone className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Call Us</h3>
              <p className="text-xs text-white/80 mb-2">{info.phone}</p>
              <span className="text-xs text-white font-medium flex items-center gap-1 group-hover:underline">
                <Phone className="w-3 h-3" /> Call Now
              </span>
            </a>

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

            <a href={`mailto:${info.email}`}
              className="bg-white rounded-xl border border-[var(--color-border)] p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-3">
                <Mail className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <h3 className="font-semibold text-sm mb-1">Email</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] mb-2">{info.email}</p>
              <span className="text-xs text-[var(--color-primary)] font-medium flex items-center gap-1 group-hover:underline">
                <ExternalLink className="w-3 h-3" /> Send Email
              </span>
            </a>
          </div>

          {/* Reservation CTA */}
          <div className="bg-white rounded-xl border border-[var(--color-border)] p-6 mb-8 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-semibold text-[var(--color-foreground)]">Ready to visit?</h3>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Reserve your table or just walk in — we&apos;d love to host you.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowReservation(true)} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
                <CalendarDays className="w-4 h-4" /> Reserve a Table
              </button>
              <a href={info.whatsapp} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-primary)] hover:text-white transition-all flex items-center gap-2">
                <Send className="w-4 h-4" /> WhatsApp
              </a>
            </div>
          </div>

          {/* Google Maps */}
          <div className="rounded-xl overflow-hidden border border-[var(--color-border)] shadow-sm">
            <iframe
              src={info.mapsEmbed}
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
                <span className="flex items-center gap-1"><NavIcon className="w-3.5 h-3.5" /> Near ABC Farm</span>
                <span className="flex items-center gap-1"><Car className="w-3.5 h-3.5" /> Street parking available</span>
              </div>
              <a href={info.googleMaps} target="_blank" rel="noopener noreferrer"
                className="text-xs font-medium text-[var(--color-primary)] hover:underline flex items-center gap-1">
                <NavIcon className="w-3.5 h-3.5" /> Get Directions
              </a>
            </div>
          </div>

          {/* Social proof */}
          <div className="mt-8 flex items-center justify-center gap-6">
            <a href={info.instagram} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
              <Instagram className="w-4 h-4" /> @highspiritscafe
            </a>
            <a href={info.googleMaps} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors">
              <Star className="w-4 h-4 fill-[var(--color-accent)] text-[var(--color-accent)]" /> 4.6 on Google
            </a>
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
