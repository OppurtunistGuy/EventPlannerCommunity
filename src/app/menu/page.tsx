'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Leaf, ChevronDown, ChevronUp, RefreshCw,
  Plus, Minus, Tag, Coffee, Utensils, Wine, Sparkles, ArrowUp,
  CalendarDays, Key,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { MenuCategory, MenuItem, CartItem, fadeUp, fmt } from '@/lib/shared';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import HappyHoursAnnouncement from '@/components/HappyHoursAnnouncement';
import { ReservationModal, LookupModal, CartSidebar, BillModal, TableBar, FloatingCartButton, OrderSuccessToast } from '@/components/Modals';

const TABS = [
  { key: 'offers', label: 'Happy Hour', icon: Tag },
  { key: 'coffee', label: 'Coffee', icon: Coffee },
  { key: 'food', label: 'Food', icon: Utensils },
  { key: 'bar', label: 'Bar', icon: Wine },
  { key: 'vintage', label: 'Vintage', icon: Sparkles },
] as const;

export default function MenuPage() {
  const {
    selectedTable, activeReservation,
    cart, setCart,
    showReservation, setShowReservation,
    showLookupModal, setShowLookupModal,
    requestBill, fetchBill,
  } = useApp();

  const [menuData, setMenuData] = useState<Record<string, MenuCategory[]>>({});
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState('');
  const [activeTab, setActiveTab] = useState<string>('food');
  const [searchQuery, setSearchQuery] = useState('');
  const [vegOnly, setVegOnly] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [scrolled, setScrolled] = useState(false);

  // Fetch menu data
  useEffect(() => {
    fetch('/api/menu')
      .then(r => {
        if (!r.ok) throw new Error(`Menu fetch failed: ${r.status}`);
        return r.json();
      })
      .then(data => {
        // Handle both old and new API response formats
        const menuResponse = data.data || data;
        if (menuResponse && typeof menuResponse === 'object' && !Array.isArray(menuResponse) && !data.error) {
          setMenuData(menuResponse);
          // Auto-expand first category on each tab
          const firstCat = Object.values(menuResponse).flat().find((c: MenuCategory) => c.items?.length > 0);
          if (firstCat) setExpandedCategories(new Set([firstCat.slug]));
        } else {
          setDataError(data?.error || data?.message || 'Failed to load menu data');
        }
        setDataLoading(false);
      })
      .catch(err => {
        console.error('Menu fetch error:', err);
        setDataError('Unable to load menu. Please try again.');
        setDataLoading(false);
      });
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const categories = menuData[activeTab] || [];

  const filteredCategories = categories.map(cat => {
    const items = (cat.items || []).filter(item => {
      const matchSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchVeg = !vegOnly || item.isVeg;
      return matchSearch && matchVeg;
    });
    return { ...cat, items };
  }).filter(cat => cat.items.length > 0);

  const toggleCategory = (slug: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug); else next.add(slug);
      return next;
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery('');
    setExpandedCategories(new Set());
  };

  const addToCart = (item: MenuItem) => {
    if (!selectedTable) {
      setShowReservation(true);
      return;
    }
    setCart(prev => {
      const existing = prev.find(c => c.menuItem.id === item.id);
      if (existing) return prev.map(c => c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(prev => prev.map(c => {
      if (c.menuItem.id !== itemId) return c;
      const newQty = c.quantity + delta;
      if (newQty <= 0) return c;
      return { ...c, quantity: newQty };
    }).filter(c => c.quantity > 0));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <HappyHoursAnnouncement />
      <TableBar />

      {/* ===== MENU SECTION ===== */}
      <section className="py-12 sm:py-16 mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Section header */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} className="text-center mb-10">
            <p className="section-label">What We Serve</p>
            <h2 className="section-heading text-3xl sm:text-4xl mt-2">Our Menu</h2>
            <div className="divider mx-auto mt-4" />
          </motion.div>

          {/* Table assignment prompt (if no table selected) */}
          {!selectedTable && (
            <motion.div initial="hidden" animate="visible" variants={fadeUp}
              className="mb-8 bg-gradient-to-r from-[var(--color-primary)]/5 to-[var(--color-accent)]/5 border-2 border-[var(--color-primary)]/20 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Utensils className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-[var(--color-foreground)]">Browse our menu below — reserve a table to start ordering!</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1">You can browse the full menu and see prices. To place an order, you need a reservation. Your table will be auto-assigned when you reserve.</p>
                  <div className="flex items-center gap-3 mt-4 flex-wrap">
                    <button onClick={() => setShowReservation(true)} className="px-5 py-2.5 bg-[var(--color-primary)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                      <CalendarDays className="w-4 h-4" /> Reserve a Table
                    </button>
                    <button onClick={() => setShowLookupModal(true)} className="px-5 py-2.5 bg-[var(--color-accent)] text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm">
                      <Key className="w-4 h-4" /> Enter Reservation Code
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2.5 py-1 rounded-full">Test code: 777777 (Table 7)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 -mx-1 px-1">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => handleTabChange(tab.key)}
                  className={`tab-pill flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap border ${activeTab === tab.key ? 'active border-[var(--color-primary)]' : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'}`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-muted-foreground)]" />
              <input type="text" placeholder="Search menu..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all" />
            </div>
            <button onClick={() => setVegOnly(!vegOnly)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all ${vegOnly ? 'bg-[#27AE60]/10 border-[#27AE60] text-[#27AE60]' : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-[var(--color-primary)]'}`}>
              <Leaf className="w-4 h-4" /> Veg
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            {dataLoading && (
              <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                <RefreshCw className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" />
                <p className="text-sm">Loading menu...</p>
              </div>
            )}
            {dataError && (
              <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">{dataError}</p>
                <button onClick={() => { setDataLoading(true); setDataError(''); window.location.reload(); }}
                  className="mt-3 px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                  Retry
                </button>
              </div>
            )}
            {!dataLoading && !dataError && filteredCategories.length === 0 && (
              <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                <Search className="w-8 h-8 mx-auto mb-3 opacity-40" />
                <p className="text-sm">
                  {searchQuery ? 'No items match your search. Try a different term.' : 'No items available in this category.'}
                </p>
              </div>
            )}
            {!dataLoading && !dataError && filteredCategories.length > 0 && filteredCategories.map((cat, idx) => {
              const isOpen = expandedCategories.has(cat.slug) || searchQuery.length > 0;
              return (
                <motion.div key={cat.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} transition={{ delay: idx * 0.05 }}
                  className="bg-white rounded-xl border border-[var(--color-border)] overflow-hidden">
                  <button onClick={() => toggleCategory(cat.slug)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--color-secondary)]/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <div className="text-left">
                        <span className="font-semibold text-[var(--color-foreground)]">{cat.name}</span>
                        {cat.description && <span className="text-xs text-[var(--color-muted-foreground)] ml-2 hidden sm:inline">— {cat.description}</span>}
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2 py-0.5 rounded-full">{cat.items.length}</span>
                    </div>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[var(--color-muted-foreground)]" /> : <ChevronDown className="w-4 h-4 text-[var(--color-muted-foreground)]" />}
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                        <div className="border-t border-[var(--color-border)]">
                          {cat.items.map((item) => {
                            const inCart = cart.find(c => c.menuItem.id === item.id);
                            return (
                              <div key={item.id} className={`menu-row px-5 py-3 flex items-start gap-3 border-b border-[var(--color-border)] last:border-b-0 ${!selectedTable ? 'opacity-80' : ''}`}>
                                <div className={`mt-1.5 ${item.isVeg ? 'veg-indicator' : 'nonveg-indicator'}`} style={{ flexShrink: 0 }} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start gap-2">
                                    <span className="text-sm font-medium leading-snug">{item.name}</span>
                                    {item.isBestseller && <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[var(--color-accent)] bg-[var(--color-accent)]/10 px-1.5 py-0.5 rounded">Bestseller</span>}
                                    {item.isNew && <span className="flex-shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#27AE60] bg-[#27AE60]/10 px-1.5 py-0.5 rounded">New</span>}
                                  </div>
                                  {item.description && <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5 leading-relaxed">{item.description}</p>}
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                  <span className="text-sm font-semibold text-[var(--color-foreground)]">{fmt(item.price)}</span>
                                  {selectedTable && inCart && (
                                    <div className="flex items-center gap-1">
                                      <button onClick={() => updateCartQty(item.id, -1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
                                        <Minus className="w-3 h-3" />
                                      </button>
                                      <span className="qty-badge bg-[var(--color-primary)] text-white">{inCart.quantity}</span>
                                      <button onClick={() => updateCartQty(item.id, 1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
                                        <Plus className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                  {selectedTable && !inCart && (
                                    <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity">
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                  {!selectedTable && (
                                    <button onClick={() => addToCart(item)} className="w-7 h-7 rounded-lg bg-[var(--color-secondary)] text-[var(--color-muted-foreground)] flex items-center justify-center hover:bg-[var(--color-primary)] hover:text-white transition-all" title="Reserve a table to start ordering">
                                      <Plus className="w-3.5 h-3.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
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
