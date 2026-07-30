'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PartyPopper, Clock } from 'lucide-react';

export default function HappyHoursAnnouncement() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Only show on first visit in the session
    const hasSeen = sessionStorage.getItem('hs-happy-hours-seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setShow(true);
        sessionStorage.setItem('hs-happy-hours-seen', '1');
      }, 1500); // Show after 1.5s so the page loads first

      // Auto-dismiss after 5 seconds
      const dismissTimer = setTimeout(() => {
        setShow(false);
      }, 6500);

      return () => {
        clearTimeout(timer);
        clearTimeout(dismissTimer);
      };
    }
  }, []);

  const dismiss = () => setShow(false);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: -100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: -100, opacity: 0, scale: 0.9 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[90vw] max-w-md"
        >
          <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/90 text-white rounded-2xl shadow-2xl p-5 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <button
              onClick={dismiss}
              className="absolute top-3 right-3 p-1 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>

            <div className="relative z-10 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <PartyPopper className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-base">Happy Hours — 12 PM to 6 PM</h3>
                <p className="text-xs text-white/70 mt-1 leading-relaxed">
                  Beer at ₹100, Cocktails at ₹150, Mimosa at ₹130. The best deals in Pune, every afternoon!
                </p>
                <div className="flex items-center gap-1.5 mt-2 text-xs text-white/60">
                  <Clock className="w-3 h-3" />
                  <span>Available daily — no reservation needed for bar seating</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
