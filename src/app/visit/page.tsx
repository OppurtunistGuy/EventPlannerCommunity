'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUp, CalendarDays, MapPin, Clock, Phone, Mail, Instagram,
  Car, Music, PartyPopper, Accessibility,
  Navigation as NavIcon,
} from 'lucide-react';
import { useBusiness } from '@/lib/business-config';
import { useApp } from '@/lib/app-context';
import { fadeUp } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const HERO_IMG = '/images/hero-visit.png';
const GALLERY_1 = '/images/visit-gallery-1.png';
const GALLERY_2 = '/images/visit-gallery-2.png';
const GALLERY_3 = '/images/visit-gallery-3.png';
const GALLERY_4 = '/images/visit-gallery-4.png';

const GOOD_TO_KNOW = [
  { icon: Car, title: 'PARKING', description: 'Valet parking available at the venue.' },
  { icon: Music, title: 'LIVE MUSIC', description: 'Live performances every weekend and special nights.' },
  { icon: PartyPopper, title: 'PRIVATE EVENTS', description: 'Host your celebrations with us. Get in touch for details.' },
  { icon: Accessibility, title: 'ACCESSIBILITY', description: 'Wheelchair accessible seating and entry.' },
];

const GALLERY_IMAGES = [GALLERY_1, GALLERY_2, GALLERY_3, GALLERY_4];

export default function VisitPage() {
  const { info } = useBusiness();
  const { setShowReservation } = useApp();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <TableBar />

      {/* ===== HERO ===== */}
      <section className="relative h-[55vh] sm:h-[65vh] lg:h-[75vh] min-h-[380px] sm:min-h-[440px] flex items-end overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="Visit High Spirits Cafe" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="section-label text-white/70 mb-3">VISIT HIGH SPIRITS</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-4">
              Come by tonight.
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-md mb-8 leading-relaxed">
              Good music, great food &amp; even better company.
            </p>
            <button
              onClick={() => setShowReservation(true)}
              className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <CalendarDays className="w-4 h-4" /> Reserve a Table
            </button>
          </motion.div>
        </div>
      </section>

      {/* ===== FIND US ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            {/* Left: Text ~40% */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-2">
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-[1.15] mb-2">
                Find Us
              </h2>
              <div className="w-12 h-1 bg-[var(--color-accent)] rounded-full mb-6" />

              <div className="flex items-start gap-3 mb-4">
                <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-[var(--color-foreground)]">{info.name}</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{info.address}</p>
                </div>
              </div>

              <a
                href={info.googleMaps}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                <NavIcon className="w-4 h-4" /> Get Directions
              </a>
            </motion.div>

            {/* Right: Map ~60% */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="lg:col-span-3">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-[var(--color-border)]">
                <iframe
                  src={info.mapsEmbed}
                  width="100%"
                  height="350"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="High Spirits Cafe location on Google Maps"
                  className="w-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== OPENING HOURS + CONTACT ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
            {/* Left: Opening Hours */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {[
                  { days: 'Monday – Thursday', hours: '12 PM – 1 AM' },
                  { days: 'Friday – Saturday', hours: '12 PM – 2 AM' },
                  { days: 'Sunday', hours: '12 PM – 1 AM' },
                ].map((row) => (
                  <div key={row.days} className="flex items-center justify-between py-2 border-b border-[var(--color-border)] last:border-0">
                    <span className="text-sm text-[var(--color-foreground)]">{row.days}</span>
                    <span className="text-sm font-semibold text-[var(--color-foreground)]">{row.hours}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[var(--color-muted-foreground)] mt-4 italic">
                Kitchen closes 30 mins before closing time.
              </p>
            </motion.div>

            {/* Right: Get In Touch */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-6">
                <Phone className="w-5 h-5 text-[var(--color-primary)]" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)]">Get In Touch</h3>
              </div>
              <div className="space-y-4">
                <a href={info.phoneTel} className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                    <Phone className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Phone</p>
                    <p className="text-sm font-medium">{info.phone}</p>
                  </div>
                </a>
                <a href={`mailto:${info.email}`} className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                    <Mail className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Email</p>
                    <p className="text-sm font-medium">{info.email}</p>
                  </div>
                </a>
                <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors group">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/8 flex items-center justify-center flex-shrink-0 group-hover:bg-[var(--color-primary)]/15 transition-colors">
                    <Instagram className="w-4 h-4 text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Instagram</p>
                    <p className="text-sm font-medium">@highspiritscafe</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== GOOD TO KNOW ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-12">
            <p className="section-label mb-3">GOOD TO KNOW</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-[1.15]">
              Before you arrive
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {GOOD_TO_KNOW.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  transition={{ delay: idx * 0.08 }}
                  className="bg-[var(--color-secondary)] rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-5 h-5 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--color-foreground)] mb-2">{item.title}</h3>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== A FEW LOOKS INSIDE ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-12">
            <p className="section-label mb-3">A FEW LOOKS INSIDE</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-[1.15]">
              The place you&apos;ll want to see
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                transition={{ delay: idx * 0.08 }}
                className="rounded-2xl overflow-hidden aspect-[3/4] sm:aspect-[4/5]"
              >
                <img src={img} alt={`High Spirits Cafe interior ${idx + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== RESERVATION CTA ===== */}
      <section className="py-14 sm:py-16 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
            <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold text-white leading-[1.15] mb-2">
              Good nights start here.
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
