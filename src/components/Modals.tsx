'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, CalendarDays, Key, Copy, Ticket, Users, RefreshCw, Send,
  Plus, Minus, Trash2, ShoppingBag, Receipt, FileText, UtensilsCrossed,
} from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { ActiveReservation, CartItem, fmt, AREA_LABELS, scaleIn, slideInRight } from '@/lib/shared';
import { useState, useEffect, useRef } from 'react';
import { TableInfo, MenuItem } from '@/lib/shared';

// ==========================================
// RESERVATION MODAL
// ==========================================
export function ReservationModal() {
  const {
    showReservation, setShowReservation,
    reservationForm, setReservationForm,
    reservationSubmitting, setReservationSubmitting,
    reservationSuccess, setReservationSuccess,
    reservationResult, setReservationResult,
    setActiveReservation, setSelectedTable,
  } = useApp();

  const [tables, setTables] = useState<TableInfo[]>([]);

  // Set default date/time on mount
  useEffect(() => {
    if (showReservation && !reservationForm.date) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      setReservationForm(p => ({ ...p, date: `${yyyy}-${mm}-${dd}`, time: '19:00' }));
    }
  }, [showReservation]);

  useEffect(() => {
    fetch('/api/tables')
      .then(r => r.ok ? r.json() : { data: [] })
      .then(data => {
        const tablesData = data.data || data;
        setTables(Array.isArray(tablesData) ? tablesData : []);
      })
      .catch(() => {});
  }, []);

  const [reservationError, setReservationError] = useState('');

  const submitReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    setReservationSubmitting(true);
    setReservationError('');
    try {
      // Validate form before submission
      if (!reservationForm.name?.trim() || !reservationForm.phone?.trim() || !reservationForm.date || !reservationForm.time) {
        throw new Error('Please fill in all required fields (Name, Phone, Date, Time)');
      }
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationForm),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Reservation failed');
      }
      // Handle both old and new API response formats
      const reservation = data.data || data;
      setReservationResult({
        code: reservation.code,
        tableNumber: reservation.table?.number || 0,
        tableArea: reservation.table?.area || '',
      });
      setReservationSuccess(true);
      setActiveReservation({
        id: reservation.id,
        code: reservation.code,
        name: reservation.name,
        phone: reservation.phone,
        date: reservation.date,
        time: reservation.time,
        guests: reservation.guests,
        status: reservation.status,
        tableId: reservation.tableId,
        table: reservation.table,
      });
      // Set the selected table from the reservation response
      if (reservation.table) {
        setSelectedTable(reservation.table);
      }
      // Refresh tables
      const tablesRes = await fetch('/api/tables');
      if (tablesRes.ok) {
        const tablesJson = await tablesRes.json();
        const tablesData = tablesJson.data || tablesJson;
        setTables(Array.isArray(tablesData) ? tablesData : []);
      }
    } catch (err: any) {
      setReservationError(err.message || 'Failed to create reservation');
    } finally {
      setReservationSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showReservation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => { setShowReservation(false); setReservationSuccess(false); setReservationResult(null); }}>
          <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-lg">Reserve a Table</h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">A table will be auto-assigned to you</p>
                </div>
                <button onClick={() => { setShowReservation(false); setReservationSuccess(false); setReservationResult(null); }} className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {reservationSuccess && reservationResult ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#27AE60]/10 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-7 h-7 text-[#27AE60]" />
                  </div>
                  <p className="font-semibold text-lg">Reservation Confirmed!</p>
                  <p className="text-sm text-[var(--color-muted-foreground)] mt-1 mb-4">Your table has been assigned</p>
                  <div className="bg-[var(--color-primary)]/5 border-2 border-[var(--color-primary)]/20 rounded-xl p-5 mb-4">
                    <p className="text-xs text-[var(--color-muted-foreground)] mb-2">Your Reservation Code</p>
                    <div className="flex items-center justify-center gap-2">
                      <p className="text-4xl font-bold font-mono tracking-[0.3em] text-[var(--color-primary)]">{reservationResult.code}</p>
                      <button onClick={() => navigator.clipboard?.writeText(reservationResult.code)} className="p-2 hover:bg-[var(--color-border)] rounded-lg transition-colors" title="Copy code">
                        <Copy className="w-5 h-5 text-[var(--color-muted-foreground)]" />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--color-muted-foreground)] mt-2">Save this code! Use it to view your reservation and order from your table anytime.</p>
                  </div>
                  <div className="bg-[var(--color-secondary)] rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[var(--color-primary)]" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">Table {reservationResult.tableNumber}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{AREA_LABELS[reservationResult.tableArea] || reservationResult.tableArea}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-xl p-3 mb-4 text-left">
                    <p className="text-xs font-medium text-[var(--color-foreground)]">How to use your code:</p>
                    <ol className="text-xs text-[var(--color-muted-foreground)] mt-1 space-y-1 list-decimal list-inside">
                      <li>Enter your 6-digit code on the reservations page</li>
                      <li>Your table and current orders will appear</li>
                      <li>Add items from the menu to your order</li>
                      <li>Click &quot;Bill Request&quot; when you&apos;re done</li>
                    </ol>
                  </div>
                  <button onClick={() => {
                    setShowReservation(false);
                    setReservationSuccess(false);
                    setReservationResult(null);
                    setReservationForm({ name: '', phone: '', email: '', date: '', time: '', guests: '2', occasion: '', message: '' });
                    // The selectedTable was already set when the reservation was created
                  }} className="w-full py-2.5 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                    Start Ordering
                  </button>
                </div>
              ) : (
                <form onSubmit={submitReservation} className="space-y-4">
                  <div className="bg-[var(--color-accent)]/5 border border-[var(--color-accent)]/20 rounded-xl p-3">
                    <p className="text-xs text-[var(--color-foreground)]">After confirmation, you&apos;ll receive a <strong>6-digit code</strong> to access your table and order. Save this code — you&apos;ll need it each time you visit!</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Name *</label>
                    <input type="text" required value={reservationForm.name} onChange={e => setReservationForm(p => ({ ...p, name: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Phone *</label>
                    <input type="tel" required value={reservationForm.phone} onChange={e => setReservationForm(p => ({ ...p, phone: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Date *</label>
                      <input type="date" required value={reservationForm.date} min={new Date().toISOString().split('T')[0]} onChange={e => setReservationForm(p => ({ ...p, date: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Time *</label>
                      <input type="time" required value={reservationForm.time} onChange={e => setReservationForm(p => ({ ...p, time: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Guests</label>
                    <select value={reservationForm.guests} onChange={e => setReservationForm(p => ({ ...p, guests: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white">
                      {[1,2,3,4,5,6,7,8,10,12,15,20].map(n => <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Occasion</label>
                    <select value={reservationForm.occasion} onChange={e => setReservationForm(p => ({ ...p, occasion: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-[var(--color-border)] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] bg-white">
                      <option value="">Select (optional)</option>
                      <option value="birthday">Birthday</option>
                      <option value="anniversary">Anniversary</option>
                      <option value="corporate">Corporate</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                  <button type="submit" disabled={reservationSubmitting}
                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                    {reservationSubmitting ? <><RefreshCw className="w-4 h-4 animate-spin" /> Confirming...</> : <><CalendarDays className="w-4 h-4" /> Confirm Reservation</>}
                  </button>
                  {reservationError && (
                    <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded-xl p-3 text-center">
                      <p className="text-sm text-[var(--color-destructive)]">{reservationError}</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// LOOKUP RESERVATION MODAL
// ==========================================
export function LookupModal() {
  const {
    showLookupModal, setShowLookupModal,
    lookupCode, setLookupCode,
    lookupLoading, lookupError, setLookupError,
    lookupReservationByCode,
  } = useApp();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleLookup = async (code?: string) => {
    const codeToUse = code || lookupCode;
    if (!codeToUse.trim() || codeToUse.trim().length !== 6) return;
    const success = await lookupReservationByCode(codeToUse);
    if (success) {
      setShowLookupModal(false);
    }
  };

  const handleCodeChange = (value: string) => {
    // Only allow digits
    const digits = value.replace(/\D/g, '').slice(0, 6);
    setLookupCode(digits);
    setLookupError('');
    // Auto-submit when 6 digits are entered
    if (digits.length === 6) {
      setTimeout(() => handleLookup(digits), 100);
    }
  };

  // Focus input when modal opens
  useEffect(() => {
    if (showLookupModal) {
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  }, [showLookupModal]);

  return (
    <AnimatePresence>
      {showLookupModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => { setShowLookupModal(false); setLookupError(''); }}>
          <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-lg">My Reservation</h2>
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">Enter your reservation code to view your table and order</p>
                </div>
                <button onClick={() => { setShowLookupModal(false); setLookupError(''); }} className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="bg-[var(--color-secondary)] rounded-xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 flex items-center justify-center flex-shrink-0">
                    <Ticket className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Have a reservation code?</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">Enter the 6-digit code you received when you reserved</p>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-muted-foreground)] mb-1.5">Reservation Code</label>
                  <input
                    ref={inputRef}
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    value={lookupCode}
                    onChange={e => handleCodeChange(e.target.value)}
                    onPaste={e => {
                      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      if (pasted.length === 6) {
                        setLookupCode(pasted);
                        setTimeout(() => handleLookup(pasted), 100);
                      } else {
                        setLookupCode(pasted);
                      }
                    }}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-[var(--color-border)] rounded-xl text-lg font-mono text-center tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
                    onKeyDown={e => { if (e.key === 'Enter') handleLookup(); }}
                  />
                  <div className="flex items-center justify-center gap-1 mt-2">
                    {[0,1,2,3,4,5].map(i => (
                      <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i < lookupCode.length ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-border)]'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <span className="text-xs text-[var(--color-muted-foreground)] bg-[var(--color-secondary)] px-2.5 py-1 rounded-full">Test code: 777777 (Table 7)</span>
                </div>
                {lookupError && (
                  <div className="bg-[var(--color-destructive)]/10 border border-[var(--color-destructive)]/20 rounded-xl p-3 text-center">
                    <p className="text-sm text-[var(--color-destructive)]">{lookupError}</p>
                  </div>
                )}
                <button
                  onClick={() => handleLookup()}
                  disabled={lookupLoading || lookupCode.length !== 6}
                  className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {lookupLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                  {lookupLoading ? 'Looking up...' : 'Find My Reservation'}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// CART SIDEBAR
// ==========================================
export function CartSidebar() {
  const {
    cart, setCart, showCart, setShowCart,
    selectedTable,
    orderSubmitting,
    orderSuccess,
    setShowLookupModal,
    submitOrder,
  } = useApp();

  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter(c => c.menuItem.id !== itemId));
  };

  const updateCartQty = (itemId: string, delta: number) => {
    setCart(cart.map(c => {
      if (c.menuItem.id !== itemId) return c;
      const newQty = c.quantity + delta;
      if (newQty <= 0) return c;
      return { ...c, quantity: newQty };
    }).filter(c => c.quantity > 0));
  };

  return (
    <AnimatePresence>
      {showCart && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50" onClick={() => setShowCart(false)}>
          <motion.div variants={slideInRight} initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
            className="absolute right-0 top-0 bottom-0 w-full sm:w-[420px] bg-white shadow-2xl flex flex-col">
            <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-lg">Your Order</h2>
                <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">
                  {selectedTable ? `Table ${selectedTable.number}` : 'No table selected'}
                </p>
              </div>
              <button onClick={() => setShowCart(false)} className="p-1.5 hover:bg-[var(--color-secondary)] rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-[var(--color-muted-foreground)]">
                  <ShoppingBag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm">Your cart is empty</p>
                  <p className="text-xs mt-1">Add items from the menu to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.menuItem.id} className="flex items-start gap-3 p-3 bg-[var(--color-secondary)]/50 rounded-xl">
                      <div className={`mt-1 ${item.menuItem.isVeg ? 'veg-indicator' : 'nonveg-indicator'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug">{item.menuItem.name}</p>
                        <p className="text-xs text-[var(--color-muted-foreground)] mt-0.5">{fmt(item.menuItem.price)}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => updateCartQty(item.menuItem.id, -1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.menuItem.id, 1)} className="w-7 h-7 rounded-lg border border-[var(--color-border)] flex items-center justify-center hover:bg-[var(--color-secondary)] transition-colors">
                          <Plus className="w-3 h-3" />
                        </button>
                        <button onClick={() => removeFromCart(item.menuItem.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--color-destructive)] hover:bg-red-50 transition-colors ml-1">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="border-t border-[var(--color-border)] p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-[var(--color-muted-foreground)]">Subtotal</span>
                  <span className="text-lg font-bold">{fmt(cartTotal)}</span>
                </div>
                {!selectedTable ? (
                  <button onClick={() => { setShowCart(false); setShowLookupModal(true); }} className="w-full py-3 bg-[var(--color-accent)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Key className="w-4 h-4" /> Enter Reservation Code
                  </button>
                ) : (
                  <button onClick={submitOrder} disabled={orderSubmitting}
                    className="w-full py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50">
                    {orderSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {orderSubmitting ? 'Placing Order...' : 'Place Order'}
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// BILL MODAL
// ==========================================
export function BillModal() {
  const {
    showBill, setShowBill, billData, setBillData,
    selectedTable, endSession,
  } = useApp();

  const settleBill = async () => {
    if (!billData || !selectedTable) return;
    try {
      const billId = (billData as Record<string, unknown>).billId as string;
      if (billId) {
        await fetch('/api/bill', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billId }),
        });
      } else {
        const orders = (billData as Record<string, unknown>).orders as { id: string }[];
        for (const order of orders) {
          await fetch('/api/orders', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: order.id, status: 'billed' }),
          });
        }
      }
      setShowBill(false);
      setBillData(null);
      endSession();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence>
      {showBill && billData && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={() => setShowBill(false)}>
          <motion.div variants={scaleIn} initial="hidden" animate="visible" exit="exit"
            onClick={e => e.stopPropagation()}
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="bg-[var(--color-primary)] text-white p-6 text-center">
              <p className="font-[var(--font-display)] text-xl font-bold">High Spirits Cafe</p>
              <p className="text-xs text-white/60 mt-1">Koregaon Park, Pune</p>
              <div className="mt-3 flex items-center justify-center gap-2">
                <span className="px-3 py-1 bg-white/15 rounded-full text-sm font-medium">Table {(billData as Record<string, unknown>).tableNumber}</span>
                <span className="px-3 py-1 bg-white/15 rounded-full text-xs">{AREA_LABELS[(billData as Record<string, unknown>).tableArea as string] || ''}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="space-y-2 mb-4">
                {((billData as Record<string, unknown>).items as { name: string; isVeg: boolean; quantity: number; price: number; total: number; status: string }[]).map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-sm">
                    <div className={`mt-1.5 ${item.isVeg ? 'veg-indicator' : 'nonveg-indicator'}`} style={{ flexShrink: 0 }} />
                    <div className="flex-1 min-w-0">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-[var(--color-muted-foreground)] ml-1">×{item.quantity}</span>
                    </div>
                    <span className="text-[var(--color-muted-foreground)] whitespace-nowrap">{fmt(item.total)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-[var(--color-border)] pt-3 space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted-foreground)]">Subtotal</span>
                  <span>{fmt((billData as Record<string, unknown>).subtotal as number)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[var(--color-muted-foreground)]">GST (5%)</span>
                  <span>{fmt((billData as Record<string, unknown>).gst as number)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-[var(--color-border)]">
                  <span>Total</span>
                  <span>{fmt((billData as Record<string, unknown>).total as number)}</span>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-2">
              <button onClick={() => setShowBill(false)} className="flex-1 py-2.5 border border-[var(--color-border)] rounded-xl text-sm font-medium hover:bg-[var(--color-secondary)] transition-colors">
                Close
              </button>
              <button onClick={settleBill} className="flex-1 py-2.5 bg-[var(--color-primary)] text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                Settle Bill
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ==========================================
// TABLE BAR (shows when a table is selected)
// ==========================================
export function TableBar() {
  const {
    selectedTable, activeReservation,
    billRequested, billRequesting,
    requestBill, fetchBill, endSession,
  } = useApp();

  if (!selectedTable) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="bg-[var(--color-primary)]/5 border-b border-[var(--color-primary)]/10 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-muted-foreground)]">Dining at</span>
            <span className="text-sm font-semibold text-[var(--color-primary)]">Table {selectedTable.number}</span>
            <span className="text-xs text-[var(--color-muted-foreground)]">· {AREA_LABELS[selectedTable.area]}</span>
            {activeReservation && (
              <span className="text-xs text-[var(--color-accent)] font-medium ml-1">· Code: {activeReservation.code}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!billRequested ? (
              <button onClick={requestBill} disabled={billRequesting} className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5 disabled:opacity-50">
                {billRequesting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FileText className="w-3.5 h-3.5" />}
                {billRequesting ? 'Requesting...' : 'Bill Request'}
              </button>
            ) : (
              <button onClick={() => fetchBill(selectedTable.id)} className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-md text-xs font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5" /> View bill
              </button>
            )}
            <button onClick={endSession} className="px-3 py-1 bg-[var(--color-secondary)] rounded-md text-xs font-medium hover:bg-[var(--color-border)] transition-colors">
              End Session
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ==========================================
// FLOATING CART BUTTON
// ==========================================
export function FloatingCartButton() {
  const { cart, selectedTable, setShowCart } = useApp();
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const cartTotal = cart.reduce((sum, c) => sum + c.menuItem.price * c.quantity, 0);

  if (cartCount === 0 || !selectedTable) return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ scale: 0, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, y: 20 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        onClick={() => setShowCart(true)}
        className="fixed bottom-6 right-6 z-40 bg-[var(--color-primary)] text-white px-5 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-shadow flex items-center gap-3">
        <ShoppingBag className="w-5 h-5" />
        <span className="font-semibold text-sm">{cartCount} items</span>
        <span className="text-xs text-white/70">· {fmt(cartTotal)}</span>
      </motion.button>
    </AnimatePresence>
  );
}

// ==========================================
// ORDER SUCCESS TOAST
// ==========================================
export function OrderSuccessToast() {
  const { orderSuccess } = useApp();
  return (
    <AnimatePresence>
      {orderSuccess && (
        <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#27AE60] text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3">
          <Check className="w-5 h-5" />
          <span className="font-medium text-sm">Order placed! Your waiter will bring it shortly.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
