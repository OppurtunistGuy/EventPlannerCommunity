'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ActiveReservation, CartItem, TableInfo, ReservationForm } from '@/lib/shared';

// ==========================================
// APP STATE CONTEXT
// ==========================================

interface AppState {
  // Table & Order
  selectedTable: TableInfo | null;
  setSelectedTable: (t: TableInfo | null) => void;
  cart: CartItem[];
  setCart: (c: CartItem[]) => void;
  showCart: boolean;
  setShowCart: (v: boolean) => void;
  showBill: boolean;
  setShowBill: (v: boolean) => void;
  billData: Record<string, unknown> | null;
  setBillData: (d: Record<string, unknown> | null) => void;
  orderSubmitting: boolean;
  setOrderSubmitting: (v: boolean) => void;
  orderSuccess: boolean;
  setOrderSuccess: (v: boolean) => void;

  // Reservation
  showReservation: boolean;
  setShowReservation: (v: boolean) => void;
  reservationForm: ReservationForm;
  setReservationForm: (f: ReservationForm | ((prev: ReservationForm) => ReservationForm)) => void;
  reservationSubmitting: boolean;
  setReservationSubmitting: (v: boolean) => void;
  reservationSuccess: boolean;
  setReservationSuccess: (v: boolean) => void;
  reservationResult: { code: string; tableNumber: number; tableArea: string } | null;
  setReservationResult: (r: { code: string; tableNumber: number; tableArea: string } | null) => void;

  // Lookup
  showLookupModal: boolean;
  setShowLookupModal: (v: boolean) => void;
  lookupCode: string;
  setLookupCode: (v: string) => void;
  lookupLoading: boolean;
  setLookupLoading: (v: boolean) => void;
  lookupError: string;
  setLookupError: (v: string) => void;
  activeReservation: ActiveReservation | null;
  setActiveReservation: (r: ActiveReservation | null) => void;

  // Bill
  billRequested: boolean;
  setBillRequested: (v: boolean) => void;
  billRequesting: boolean;
  setBillRequesting: (v: boolean) => void;

  // Centralized actions
  fetchBill: (tableId: string) => Promise<void>;
  requestBill: () => Promise<void>;
  submitOrder: () => Promise<void>;
  endSession: () => void;
  lookupReservationByCode: (code: string) => Promise<boolean>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedTable, setSelectedTable] = useState<TableInfo | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showBill, setShowBill] = useState(false);
  const [billData, setBillData] = useState<Record<string, unknown> | null>(null);
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [showReservation, setShowReservation] = useState(false);
  const [reservationForm, setReservationForm] = useState<ReservationForm>({
    name: '', phone: '', email: '', date: '', time: '', guests: '2', occasion: '', message: '',
  });
  const [reservationSubmitting, setReservationSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(false);
  const [reservationResult, setReservationResult] = useState<{ code: string; tableNumber: number; tableArea: string } | null>(null);

  const [showLookupModal, setShowLookupModal] = useState(false);
  const [lookupCode, setLookupCode] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');
  const [activeReservation, setActiveReservation] = useState<ActiveReservation | null>(null);

  const [billRequested, setBillRequested] = useState(false);
  const [billRequesting, setBillRequesting] = useState(false);

  // Centralized fetchBill
  const fetchBill = useCallback(async (tableId: string) => {
    try {
      const res = await fetch(`/api/bill?tableId=${tableId}`);
      if (!res.ok) throw new Error(`Bill fetch failed: ${res.status}`);
      const data = await res.json();
      setBillData(data);
      setShowBill(true);
    } catch (err) {
      console.error('fetchBill error:', err);
    }
  }, []);

  // Centralized requestBill
  const requestBill = useCallback(async () => {
    if (!selectedTable) return;
    setBillRequesting(true);
    try {
      const res = await fetch('/api/bill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable.id,
          reservationId: activeReservation?.id || null,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Bill request failed' }));
        throw new Error(errData.error || 'Bill request failed');
      }
      const data = await res.json();
      setBillData(data);
      setShowBill(true);
      setBillRequested(true);
    } catch (err) {
      console.error('requestBill error:', err);
      // If bill already exists, try fetching it instead
      try {
        await fetchBill(selectedTable.id);
        setBillRequested(true);
      } catch (fetchErr) {
        console.error('fetchBill fallback error:', fetchErr);
      }
    } finally {
      setBillRequesting(false);
    }
  }, [selectedTable, activeReservation, fetchBill]);

  // Centralized submitOrder
  const submitOrder = useCallback(async () => {
    if (!selectedTable || cart.length === 0) return;
    setOrderSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable.id,
          type: 'dine-in',
          items: cart.map(c => ({ menuItemId: c.menuItem.id, quantity: c.quantity })),
        }),
      });
      if (!res.ok) throw new Error('Order failed');
      setCart([]);
      setShowCart(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 4000);
    } catch (err) {
      console.error('submitOrder error:', err);
    } finally {
      setOrderSubmitting(false);
    }
  }, [selectedTable, cart]);

  // Centralized endSession
  const endSession = useCallback(() => {
    setSelectedTable(null);
    setCart([]);
    setActiveReservation(null);
    setBillRequested(false);
    setBillData(null);
    setShowBill(false);
  }, []);

  // Centralized lookupReservationByCode
  const lookupReservationByCode = useCallback(async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    setLookupLoading(true);
    setLookupError('');
    try {
      const res = await fetch(`/api/reservations/lookup?code=${code.trim()}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Reservation not found' }));
        setLookupError(errData.error || 'Reservation not found');
        setActiveReservation(null);
        return false;
      }
      const data = await res.json();
      setActiveReservation(data);
      setSelectedTable(data.table);
      setLookupCode('');
      return true;
    } catch (err) {
      setLookupError('Failed to look up reservation. Please try again.');
      setActiveReservation(null);
      return false;
    } finally {
      setLookupLoading(false);
    }
  }, []);

  return (
    <AppContext.Provider value={{
      selectedTable, setSelectedTable,
      cart, setCart,
      showCart, setShowCart,
      showBill, setShowBill,
      billData, setBillData,
      orderSubmitting, setOrderSubmitting,
      orderSuccess, setOrderSuccess,
      showReservation, setShowReservation,
      reservationForm, setReservationForm,
      reservationSubmitting, setReservationSubmitting,
      reservationSuccess, setReservationSuccess,
      reservationResult, setReservationResult,
      showLookupModal, setShowLookupModal,
      lookupCode, setLookupCode,
      lookupLoading, setLookupLoading,
      lookupError, setLookupError,
      activeReservation, setActiveReservation,
      billRequested, setBillRequested,
      billRequesting, setBillRequesting,
      fetchBill, requestBill, submitOrder, endSession, lookupReservationByCode,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
