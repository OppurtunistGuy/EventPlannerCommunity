'use client';

import Link from 'next/link';
import { Phone, Mail, Instagram, MapPin, UtensilsCrossed, Music, CalendarDays } from 'lucide-react';
import { useBusiness } from '@/lib/business-config';

export default function Footer() {
  const { info } = useBusiness();

  return (
    <footer className="bg-[var(--color-primary)] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Brand */}
        <div className="text-center sm:text-left mb-8">
          <span className="font-[var(--font-display)] text-xl font-bold">High Spirits Cafe</span>
          <p className="text-white/50 text-xs mt-1">Live music · Food · Cocktails</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { href: '/menu', label: 'Menu' },
                { href: '/about', label: "What's On" },
                { href: '/contact', label: 'Visit' },
                { href: '/about', label: 'About' },
              ].map(link => (
                <Link key={link.href + link.label} href={link.href} className="text-xs text-white/60 hover:text-white transition-colors">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Contact</h4>
            <div className="flex flex-col gap-2">
              <a href={info.phoneTel} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Phone className="w-3.5 h-3.5" /> {info.phone}
              </a>
              <a href={`mailto:${info.email}`} className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <Mail className="w-3.5 h-3.5" /> {info.email}
              </a>
              <a href={info.googleMaps} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Koregaon Park, Pune
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Follow Us</h4>
            <a href={info.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-2">
              <Instagram className="w-3.5 h-3.5" /> @highspiritscafe
            </a>
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
