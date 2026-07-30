---
Task ID: 1
Agent: Main
Task: Fix restaurant reservation system - reservations, code lookup, menu visibility

Work Log:
- Explored the full codebase structure (Next.js 16 + TypeScript + Prisma + SQLite)
- Tested all API endpoints directly: /api/menu, /api/reservations, /api/reservations/lookup, /api/bill, /api/orders
- All APIs work correctly - the issue was in the frontend state management
- Identified root cause: duplicate bill/order logic across every page component caused state desynchronization
- Refactored app-context.tsx to centralize bill/order/lookup actions (fetchBill, requestBill, submitOrder, endSession, lookupReservationByCode)
- Updated Navigation component to use app context directly instead of receiving props
- Updated TableBar, CartSidebar, BillModal, LookupModal to use centralized actions
- Updated all page components (home, menu, reservations, about, gallery, contact) to use simplified Navigation
- Added default date/time values to reservation form (auto-sets today's date and 7:00 PM)
- Added form validation before submission
- Added min date constraint to date picker
- Added error fallback in requestBill (if bill already exists, fetch it instead)
- Removed "Reservations" link from footer Quick Links
- Cleaned up database: removed test reservations, reset table statuses
- Verified test reservation code 777777 works correctly
- End-to-end tested all flows: reservation creation, code lookup, menu browsing, adding to cart, placing orders, bill request, bill display

Stage Summary:
- Reservation system: ✅ Working (create reservation, auto-assign table, get 6-digit code)
- Code lookup: ✅ Working (777777 for Table 7, any new code)
- Menu visibility: ✅ Working (all categories, items, search, filter)
- Order flow: ✅ Working (add to cart, place order, order success)
- Bill flow: ✅ Working (bill request, bill display, settle bill)
- Footer: ✅ Removed "Reservations" link from Quick Links
- Database: ✅ Clean (19 available tables, Table 7 reserved for test code 777777)
