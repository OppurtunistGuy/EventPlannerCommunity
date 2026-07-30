'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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
