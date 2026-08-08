'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Music, UtensilsCrossed, Wine, Users, ArrowUp, CalendarDays,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { fadeUp } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const HERO_IMG = '/images/hero-about.png';
const STORY_IMG = '/images/story-exterior.png';
const EXPERIENCE_STAGE = '/images/experience-stage.png';
const EXPERIENCE_BAR = '/images/experience-bar.png';
const EXPERIENCE_TERRACE = '/images/experience-terrace.png';
const EXPERIENCE_CROWD = '/images/experience-crowd.png';
const CTA_IMG = '/images/cta-cocktail.png';

const DIFFERENT_ITEMS = [
  {
    icon: Music,
    title: 'LIVE MUSIC',
    description: 'From indie bands to open mics, the stage is where the night comes alive.',
  },
  {
    icon: UtensilsCrossed,
    title: 'GOOD FOOD',
    description: "A menu crafted for every mood, from sharing plates to late-night cravings.",
  },
  {
    icon: Wine,
    title: 'GREAT DRINKS',
    description: 'Signature cocktails, timeless classics and a bar that never runs out of stories.',
  },
  {
    icon: Users,
    title: 'GOOD COMPANY',
    description: "Whether it's friends, family or new faces — you'll always feel at home.",
  },
];

const EXPERIENCE_ITEMS = [
  { image: EXPERIENCE_STAGE, title: 'THE STAGE', description: 'Where the music brings us together.' },
  { image: EXPERIENCE_BAR, title: 'THE BAR', description: 'Where conversations begin.' },
  { image: EXPERIENCE_TERRACE, title: 'THE TERRACE', description: 'Breezy evenings and better conversations.' },
  { image: EXPERIENCE_CROWD, title: 'THE CROWD', description: 'You come for the music. You stay for the people.' },
];

const TIMELINE_ITEMS = [
  { year: '2005', title: 'Founded', description: 'Two friends, one dream — a place where music and community come together.' },
  { year: '2008', title: 'Live Music Begins', description: 'Saturday Night Live is born. The stage becomes the soul of High Spirits.' },
  { year: '2012', title: 'Vintage Nights', description: 'Tuesday & Thursday budget booze nights become a Koregaon Park institution.' },
  { year: '2018', title: 'Open Mic Launches', description: "Wednesday Open Mic gives Pune's talent a stage and a spotlight." },
  { year: 'TODAY', title: 'Still Creating', description: 'Still creating nights worth remembering. The story continues.' },
];

export default function AboutPage() {
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
      <section className="relative h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[400px] sm:min-h-[480px] flex items-end overflow-hidden mt-16">
        <div className="absolute inset-0">
          <img src={HERO_IMG} alt="High Spirits Cafe interior" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <p className="section-label text-white/70 mb-3">ABOUT HIGH SPIRITS</p>
            <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-[1.1] mb-4">
              More than a night out.
            </h1>
            <p className="text-white/75 text-sm sm:text-base max-w-lg mb-8 leading-relaxed">
              Good food, live music, craft cocktails and unforgettable nights — that&apos;s what we&apos;re all about.
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

      {/* ===== OUR STORY ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp}>
              <p className="section-label mb-3">OUR STORY</p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-[1.15] mb-6">
                It started with music.
              </h2>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-4">
                In 2005, High Spirits Cafe began as a dream to create a space where people could come together over good food, great drinks and the kind of music that stays with you.
              </p>
              <p className="text-[var(--color-muted-foreground)] leading-relaxed mb-6">
                From a small corner in Koregaon Park to one of Pune&apos;s most loved nightlife destinations, the heart has remained the same — make every night worth remembering.
              </p>
              <span className="inline-block font-[family-name:var(--font-display)] text-sm font-semibold text-[var(--color-accent)] uppercase tracking-wider">Since 2005.</span>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="relative">
              <img
                src={STORY_IMG}
                alt="High Spirits Cafe exterior"
                className="rounded-2xl object-cover w-full h-[350px] sm:h-[420px] lg:h-[480px] shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== WHAT MAKES US DIFFERENT ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-12">
            <p className="section-label text-[var(--color-accent)] mb-3">WHAT MAKES US DIFFERENT</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-[1.15]">
              Four things we do best.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {DIFFERENT_ITEMS.map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  transition={{ delay: idx * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-full border-2 border-white/20 flex items-center justify-center mx-auto mb-5">
                    <Icon className="w-6 h-6 text-[var(--color-accent)]" />
                  </div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed max-w-[220px] mx-auto">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== THE EXPERIENCE ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-secondary)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-12">
            <p className="section-label mb-3">THE EXPERIENCE</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-[1.15]">
              The vibe. The people. The place.
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {EXPERIENCE_ITEMS.map((item, idx) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                transition={{ delay: idx * 0.08 }}
                className="group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="relative h-48 sm:h-52 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <h3 className="absolute bottom-3 left-4 text-sm font-bold uppercase tracking-wider text-white">{item.title}</h3>
                </div>
                <div className="p-4 text-center">
                  <p className="text-[var(--color-muted-foreground)] text-sm leading-relaxed">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== OUR JOURNEY ===== */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[var(--color-background)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-12">
            <p className="section-label mb-3">OUR JOURNEY</p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] leading-[1.15]">
              Since 2005, and counting.
            </h2>
          </motion.div>

          {/* Desktop: horizontal timeline */}
          <div className="hidden lg:block">
            <div className="relative flex items-start justify-between">
              {/* Horizontal line */}
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-[var(--color-border)]" />
              {TIMELINE_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  transition={{ delay: idx * 0.1 }}
                  className="relative flex flex-col items-center text-center"
                  style={{ width: `${100 / TIMELINE_ITEMS.length}%` }}
                >
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center z-10 mb-4 ${
                    idx === TIMELINE_ITEMS.length - 1
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                      : 'border-[var(--color-primary)] bg-[var(--color-background)]'
                  }`}>
                    <span className={`text-[10px] font-bold ${
                      idx === TIMELINE_ITEMS.length - 1 ? 'text-white' : 'text-[var(--color-primary)]'
                    }`}>{item.year}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">{item.title}</h4>
                  <p className="text-xs text-[var(--color-muted-foreground)] leading-relaxed max-w-[140px]">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Mobile: vertical timeline */}
          <div className="lg:hidden">
            <div className="relative pl-8 border-l-2 border-[var(--color-border)] ml-3">
              {TIMELINE_ITEMS.map((item, idx) => (
                <motion.div
                  key={item.year}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-30px' }}
                  variants={fadeUp}
                  transition={{ delay: idx * 0.08 }}
                  className="relative mb-8 last:mb-0"
                >
                  <div className={`absolute -left-[calc(2rem+5px)] top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    idx === TIMELINE_ITEMS.length - 1
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]'
                      : 'border-[var(--color-primary)] bg-[var(--color-background)]'
                  }`}>
                    <span className="sr-only">{item.year}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">{item.year}</span>
                  <h4 className="text-base font-semibold text-[var(--color-foreground)] mt-1 mb-1">{item.title}</h4>
                  <p className="text-sm text-[var(--color-muted-foreground)] leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="bg-[var(--color-primary)]">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 min-h-[280px]">
            {/* Left: Image */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="relative h-56 lg:h-auto overflow-hidden"
            >
              <img
                src={CTA_IMG}
                alt="Cocktails at High Spirits"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </motion.div>
            {/* Right: Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              className="flex flex-col justify-center p-10 sm:p-14"
            >
              <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-white leading-[1.15] mb-3">
                Come be a part of the story.
              </h2>
              <p className="text-white/60 text-base mb-8">Good nights are waiting.</p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/menu"
                  className="px-6 py-3 border border-white/30 text-white rounded-xl font-semibold text-sm hover:bg-white/10 transition-all flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" /> View Menu
                </Link>
                <button
                  onClick={() => setShowReservation(true)}
                  className="px-6 py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <CalendarDays className="w-4 h-4" /> Reserve a Table
                </button>
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
