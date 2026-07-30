'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { fadeUp } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const GALLERY_IMAGES = [
  { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6916d4147cb7.jpg', alt: 'High Spirits Cafe Exterior', caption: 'Our iconic facade in Koregaon Park' },
  { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/927a9c3c15b8.jpg', alt: 'Interior', caption: 'The warm, inviting interior' },
  { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/262d581f9a38.jpg', alt: 'Cocktails', caption: 'Our signature craft cocktails' },
  { src: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d8c9d15e152f.jpeg', alt: 'Food', caption: 'Delicious food that surprises' },
];

export default function GalleryPage() {
  const {
    selectedTable, activeReservation,
    showReservation, setShowReservation,
    showLookupModal, setShowLookupModal,
    billRequested, billRequesting,
    setBillData, setShowBill,
    setBillRequested, setBillRequesting,
  } = useApp();

  const [scrolled, setScrolled] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

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
            <p className="section-label">Vibes</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Gallery</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY_IMAGES.map((img, idx) => (
              <motion.div
                key={idx}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-30px' }}
                variants={fadeUp}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer relative overflow-hidden rounded-xl"
                onClick={() => setLightboxIndex(idx)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-white text-sm font-medium">{img.caption}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxIndex(null)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex(null); }}
              className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length); }}
              className="absolute left-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-8 h-8" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % GALLERY_IMAGES.length); }}
              className="absolute right-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <ChevronRight className="w-8 h-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              src={GALLERY_IMAGES[lightboxIndex].src}
              alt={GALLERY_IMAGES[lightboxIndex].alt}
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

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
