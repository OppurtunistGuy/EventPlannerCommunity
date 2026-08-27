'use client';

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { ActiveReservation, CartItem, TableInfo, ReservationForm } from '@/lib/shared';

// ==========================================
// APP STATE CONTEXT
// ==========================================

interface AppState {
  // Table & Order
  selectedTable: TableInfo | null;
  setSelectedTable: (t: TableInfo | null) => void;
  cart: CartItem[];
  setCart: (c: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
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

// Session persistence keys
const SESSION_KEY = 'hs-session';
const SESSION_EXPIRY_HOURS = 4;

interface SessionData {
  reservationId: string;
  reservationCode: string;
  tableId: string;
  tableName: string;
  tableNumber: number;
  tableArea: string;
  tableCapacity: number;
  tableStatus: string;
  customerName: string;
  savedAt: number;
}

function saveSession(reservation: ActiveReservation, table: TableInfo) {
  try {
    const session: SessionData = {
      reservationId: reservation.id,
      reservationCode: reservation.code,
      tableId: table.id,
      tableName: '',
      tableNumber: table.number,
      tableArea: table.area,
      tableCapacity: table.capacity,
      tableStatus: table.status,
      customerName: reservation.name,
      savedAt: Date.now(),
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    console.log('[SESSION] Saved session for code:', reservation.code);
  } catch (e) {
    console.error('[SESSION] Failed to save:', e);
  }
}

function loadSession(): SessionData | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: SessionData = JSON.parse(raw);
    // Check expiry
    const age = Date.now() - session.savedAt;
    if (age > SESSION_EXPIRY_HOURS * 60 * 60 * 1000) {
      localStorage.removeItem(SESSION_KEY);
      console.log('[SESSION] Session expired, cleared');
      return null;
    }
    console.log('[SESSION] Restored session for code:', session.reservationCode);
    return session;
  } catch (e) {
    console.error('[SESSION] Failed to load:', e);
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
    console.log('[SESSION] Session cleared');
  } catch {}
}

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

  // Restore session on mount
  useEffect(() => {
    const session = loadSession();
    if (session) {
      const table: TableInfo = {
        id: session.tableId,
        number: session.tableNumber,
        capacity: session.tableCapacity,
        area: session.tableArea,
        status: session.tableStatus,
        orders: [],
      };
      const reservation: ActiveReservation = {
        id: session.reservationId,
        code: session.reservationCode,
        name: session.customerName,
        phone: '',
        date: '',
        time: '',
        guests: 0,
        status: 'confirmed',
        tableId: session.tableId,
        table,
      };
      setSelectedTable(table);
      setActiveReservation(reservation);
    }
  }, []);

  // Centralized fetchBill
  const fetchBill = useCallback(async (tableId: string) => {
    try {
      console.log('[BILL] Fetching bill for table:', tableId);
      const res = await fetch(`/api/bill?tableId=${tableId}`);
      if (!res.ok) throw new Error(`Bill fetch failed: ${res.status}`);
      const data = await res.json();
      setBillData(data);
      setShowBill(true);
    } catch (err) {
      console.error('[BILL] Fetch error:', err);
    }
  }, []);

  // Centralized requestBill
  const requestBill = useCallback(async () => {
    if (!selectedTable) return;
    setBillRequesting(true);
    try {
      console.log('[BILL] Requesting bill for table:', selectedTable.number);
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
      console.error('[BILL] Request error:', err);
      // If bill already exists, try fetching it instead
      try {
        await fetchBill(selectedTable.id);
        setBillRequested(true);
      } catch (fetchErr) {
        console.error('[BILL] Fetch fallback error:', fetchErr);
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
      console.log('[ORDER] Submitting order:', cart.length, 'items for table', selectedTable.number);
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: selectedTable.id,
          type: 'dine-in',
          items: cart.map(c => ({ menuItemId: c.menuItem.id, quantity: c.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || data.error || 'Order failed');
      }
      setCart([]);
      setShowCart(false);
      setOrderSuccess(true);
      setTimeout(() => setOrderSuccess(false), 4000);
      console.log('[ORDER] Order placed successfully');
    } catch (err) {
      console.error('[ORDER] Submit error:', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setOrderSubmitting(false);
    }
  }, [selectedTable, cart]);

  // Centralized endSession
  const endSession = useCallback(() => {
    console.log('[SESSION] Ending session');
    setSelectedTable(null);
    setCart([]);
    setActiveReservation(null);
    setBillRequested(false);
    setBillData(null);
    setShowBill(false);
    clearSession();
  }, []);

  // Centralized lookupReservationByCode
  const lookupReservationByCode = useCallback(async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    setLookupLoading(true);
    setLookupError('');
    try {
      console.log('[RESERVATION] Looking up code:', code);
      const res = await fetch(`/api/reservations/lookup?code=${code.trim()}`);
      const data = await res.json();

      if (!res.ok) {
        const errorMsg = data.message || data.error || 'Reservation not found';
        setLookupError(errorMsg);
        setActiveReservation(null);
        return false;
      }

      // Handle both old and new API response formats
      const reservation = data.data || data;
      setActiveReservation(reservation);
      setSelectedTable(reservation.table);
      setLookupCode('');
      saveSession(reservation, reservation.table);
      console.log('[RESERVATION] Lookup successful:', reservation.name, 'Table', reservation.table?.number);
      return true;
    } catch (err) {
      console.error('[RESERVATION] Lookup error:', err);
      setLookupError('Network error. Please check your connection and try again.');
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
