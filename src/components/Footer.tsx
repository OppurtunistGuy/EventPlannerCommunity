'use client';

import Link from 'next/link';
import { Phone, Mail, Instagram, MapPin } from 'lucide-react';
import { useBusiness } from '@/lib/business-config';

export default function Footer() {
  const { info, isDemo } = useBusiness();

  return (
    <footer className="bg-[var(--color-primary)] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <span className="font-[var(--font-display)] text-xl font-bold">High Spirits Cafe</span>
            <p className="text-white/50 text-xs mt-2 leading-relaxed">{info.tagline}. Live music, craft cocktails, and unforgettable evenings in the heart of Koregaon Park.</p>
            {isDemo && (
              <span className="inline-block mt-2 text-[10px] font-semibold bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full">DEMO MODE</span>
            )}
          </div>
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/reservations', label: 'Reservations' },
                { href: '/about', label: 'About' },
                { href: '/gallery', label: 'Gallery' },
                { href: '/contact', label: 'Contact' },
              ].map(link => (
                <Link key={link.href} href={link.href} className="text-xs text-white/60 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          {/* Contact & Social */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <div className="flex flex-col gap-2">
              <a href={info.phoneTel} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> {info.phone}
              </a>
              <a href={`mailto:${info.email}`} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {info.email}
              </a>
              <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Instagram className="w-3.5 h-3.5" /> @highspiritscafe
              </a>
              <a href={info.googleMaps} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {info.address.split(',')[0]}
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} High Spirits Cafe. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs text-white/40">
            <span>Payment: Cash · UPI · Cards</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
