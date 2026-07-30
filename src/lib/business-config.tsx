'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// ==========================================
// BUSINESS INFO CONFIGURATION
// ==========================================

interface BusinessInfo {
  phone: string;
  phoneTel: string;
  whatsapp: string;
  address: string;
  email: string;
  instagram: string;
  googleMaps: string;
  mapsEmbed: string;
  name: string;
  tagline: string;
}

const LIVE_INFO: BusinessInfo = {
  phone: '+91 97654 00484',
  phoneTel: 'tel:+919765400484',
  whatsapp: 'https://wa.me/919765400484',
  address: '35A/1, Near ABC Farm, Behind Burger King, Koregaon Park, Pune 411001',
  email: 'highspiritscafe@gmail.com',
  instagram: 'https://instagram.com/highspiritscafe/',
  googleMaps: 'https://maps.google.com/?q=High+Spirits+Cafe+Koregaon+Park+Pune',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.5!2d73.89!3d18.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMzJzA2LjAiTiA3M8KwNTMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  name: 'High Spirits Cafe',
  tagline: "Pune's favourite nightlife destination since 2005",
};

const DEMO_INFO: BusinessInfo = {
  phone: '+91 98765 43210',
  phoneTel: 'tel:+919876543210',
  whatsapp: 'https://wa.me/919876543210',
  address: '123 Demo Street, Near City Mall, Central Area, Demo City 110001',
  email: 'demo@highspirits.example.com',
  instagram: 'https://instagram.com/demo_account/',
  googleMaps: 'https://maps.google.com/?q=Demo+Location+Central+Area',
  mapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.5!2d73.89!3d18.54!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMzJzA2LjAiTiA3M8KwNTMnMjQuMCJF!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  name: 'High Spirits Cafe',
  tagline: "Pune's favourite nightlife destination since 2005",
};

// ==========================================
// CONTEXT
// ==========================================

interface BusinessContextType {
  isDemo: boolean;
  setIsDemo: (v: boolean) => void;
  info: BusinessInfo;
}

const BusinessContext = createContext<BusinessContextType>({
  isDemo: true,
  setIsDemo: () => {},
  info: DEMO_INFO,
});

export function BusinessProvider({ children }: { children: ReactNode }) {
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('hs-mode');
    if (saved === 'live') setIsDemo(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('hs-mode', isDemo ? 'demo' : 'live');
  }, [isDemo]);

  const info = isDemo ? DEMO_INFO : LIVE_INFO;

  return (
    <BusinessContext.Provider value={{ isDemo, setIsDemo, info }}>
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  return useContext(BusinessContext);
}
