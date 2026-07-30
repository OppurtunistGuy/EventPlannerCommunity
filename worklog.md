---
Task ID: 1
Agent: Main Agent
Task: Update restaurant reservation system with auto-assign tables, reservation code lookup, self-ordering, and bill request

Work Log:
- Updated Prisma schema: Added `code` (unique 6-digit) and `tableId` fields to Reservation model, added Bill model
- Pushed schema to database with force-reset and seeded with 20 tables, 110 menu items, 5 events
- Rewrote all API routes to use Prisma instead of static JSON files
- Created `/api/reservations` POST - auto-assigns available table, generates unique 6-digit code
- Created `/api/reservations/lookup` GET - looks up reservation by code, returns table + orders
- Created `/api/bill` POST - creates bill request (marks orders as billed)
- Created `/api/bill` PATCH - settles bill (marks table as available, reservation as completed)
- Updated page.tsx with new flows:
  - Reservation modal now shows code + assigned table on success
  - Added "My Reservation" modal (enter code to see table + order)
  - Added "Bill Request" button (replaces auto "My Bill")
  - Updated nav, hero, mobile nav, footer with new buttons
  - Updated cart sidebar to use "Enter Reservation Code" instead of "Select Table"
  - Updated table bar to show reservation code + Bill Request button
- Build successful, all APIs tested and working

Stage Summary:
- Database schema updated with Reservation.code, Reservation.tableId, Bill model
- All API routes migrated from static JSON to Prisma
- Full customer flow: Reserve → Get Code → Look Up → Order → Bill Request
- Build verified, API endpoints tested successfully
