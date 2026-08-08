# High Spirits Cafe — /whats-on Page Layout & Implementation

OBJECTIVE

Redesign the existing What's On / Events route into a complete event-discovery page.

This is NOT the small What's On preview shown on the homepage.

The homepage should show only 2–3 highlights.

The /whats-on or existing events route should be the complete destination where customers can browse all upcoming events, live music, open mics, offers and specials.

IMPORTANT:

This is primarily a UI/UX and layout redesign.

DO NOT change or break any existing working functionality.

Preserve:
- Existing event data
- Existing event APIs
- Existing database
- Existing event routes
- Existing reservation functionality
- Existing menu functionality
- Existing ordering
- Existing active dining session
- Existing bill functionality
- Existing authentication/session
- Existing navigation logic

Reuse existing data and functionality wherever possible.

==================================================
1. PAGE STRUCTURE
==================================================

The full What's On page should follow this structure:

HEADER
↓
EVENT HERO
↓
CATEGORY FILTERS + TIME FILTER
↓
FEATURED THIS WEEK
↓
MORE UPCOMING
↓
RESERVATION CTA
↓
FOOTER

Do not add unnecessary sections.

The page should feel like an event discovery page, not another homepage.

==================================================
2. HEADER
==================================================

Reuse the existing High Spirits header.

Desktop:

High Spirits Cafe

Home
Menu
What's On
Visit
About

My Reservation

Reserve a Table

What's On should appear as the active navigation item.

Do not create a separate header if the existing global header already works.

Preserve active dining-session behaviour.

If the user is currently dining:

Keep the existing:
- Table information
- View Bill
- End Session
- Menu/order access

Do not break session functionality.

==================================================
3. EVENT HERO
==================================================

Create a cinematic but compact hero.

Use an existing High Spirits music/bar/stage image.

Hero content:

Eyebrow:

WHAT'S ON

Heading:

Live music.
Open mics.
Good vibes.

Supporting text:

There's always something happening at High Spirits.
Come for the music, stay for the nights you'll remember.

Do not use a long paragraph.

No more than one CTA is required here.

Optional:

[Reserve a Table]

The hero should communicate atmosphere, not display event details.

Desktop:
Wide image with dark overlay.

Mobile:
Shorter image hero with readable text.

==================================================
4. FILTER BAR
==================================================

Immediately below the hero create a clean filter/navigation bar.

Categories:

[All Events]
[Live Music]
[Open Mic]
[DJ Nights]
[Offers]
[Specials]

Use the existing event categories if they already exist.

Do not invent categories that are not supported by the current event data.

Add a lightweight time/date filter:

[This Week ▼]

Possible options:

This Week
Next Week
This Month
All Upcoming

If the application already has date filtering, reuse it.

Do not build a complicated calendar interface.

The goal is fast filtering, not event management.

==================================================
5. FILTER BEHAVIOUR
==================================================

Filters must actually work.

When selecting:

Live Music

show only live music events.

Open Mic

show only open mic events.

Offers

show offers such as Happy Hour.

All Events

show everything.

Time filter should update the displayed events based on the existing event dates.

Do not create fake filtering in the UI.

==================================================
6. FEATURED THIS WEEK
==================================================

Heading:

Featured This Week

Optional secondary action:

View Calendar

Only include this if a real calendar view exists.

Display the most important 2–3 upcoming items.

Use larger horizontal event cards.

Each card should contain:

- Event image
- Featured badge if applicable
- Event category
- Date
- Event name
- Short description
- Time
- Location
- Event Details action

Example:

FEATURED

SAT
07
JUN

LIVE MUSIC

Saturday Night Live

Indie & rock band

8:30 PM onwards
High Spirits Cafe

Event Details →

==================================================
7. EVENT CARD DESIGN
==================================================

Desktop:

Use a horizontal card layout.

Suggested structure:

IMAGE
↓
DATE
↓
EVENT INFORMATION
↓
TIME + LOCATION
↓
EVENT DETAILS

Avoid extremely tall cards.

Each card should be easy to scan.

Do not overload with:

- Long descriptions
- Multiple buttons
- Social sharing
- Reviews
- Unnecessary metadata

Primary action:

Event Details →

==================================================
8. EVENT DETAILS
==================================================

If an existing event-details route/modal exists, use it.

Do not create a new event-details system if one already exists.

Clicking:

Event Details →

should open the existing event detail functionality.

If no event detail page currently exists, create only the minimum UI required to display:

- Event name
- Date
- Time
- Category
- Description
- Venue
- Image
- Reservation CTA

Do not alter backend event functionality.

==================================================
9. MORE UPCOMING
==================================================

After Featured This Week:

Heading:

More Upcoming

Display remaining upcoming events in a compact list.

Do NOT create another giant grid.

Recommended structure:

IMAGE | DATE | CATEGORY | EVENT NAME | TIME | LOCATION | >

Example:

[img]  FRI 13 JUN
       DJ NIGHT
       Friday Night DJ Set
       House, techno & more
                         8:00 PM
                         High Spirits →

[img]  SUN 15 JUN
       LIVE MUSIC
       Sunday Acoustic Session
       Unplugged & mellow
                         7:30 PM
                         High Spirits →

[img]  TUE 17 JUN
       SPECIAL
       Trivia Tuesday
       Games, fun & prizes
                         8:00 PM
                         High Spirits →

This allows customers to scan many events without huge cards.

==================================================
10. EVENT LIST STATES
==================================================

Implement proper states.

Loading:

Loading events...

Empty:

No events found for this selection.

Error:

Unable to load events.

[Try Again]

Do not show:

"No items found"

That message is inappropriate for events.

==================================================
11. EVENT PRIORITY
==================================================

Do not make every event equally prominent.

Priority:

1. Featured events
2. Upcoming events
3. Recurring offers
4. Older/further events

Featured events should receive larger visual treatment.

Recurring events such as Happy Hour can appear in the list without dominating the page.

==================================================
12. HAPPY HOUR / OFFERS
==================================================

Happy Hour should be treated as an OFFER/SPECIAL rather than pretending it is a major live event.

Example:

OFFER

Happy Hour

12 PM – 6 PM Daily

Best food, cocktails & vibes.

This should be visually distinct but still part of the event discovery system.

Use the existing event/category data.

==================================================
13. RESERVATION CTA
==================================================

Near the bottom of the page:

GREAT NIGHTS START HERE.

Book your table and be part of it.

[Reserve a Table]

Use the existing reservation flow.

Do NOT create a new reservation implementation.

Keep this CTA simple.

==================================================
14. FOOTER
==================================================

Reuse the existing High Spirits footer.

Include:

HIGH SPIRITS CAFE

Live music.
Good food.
Unforgettable nights.

Quick Links:
Home
Menu
What's On
Visit
About

My Account:
My Reservation
Reserve a Table
View Bill

Contact:
Phone
Email
Location

Opening Hours

Privacy Policy
Terms & Conditions

Do not duplicate large sections from the page.

==================================================
15. DESKTOP PAGE FLOW
==================================================

HEADER
────────────────────────────────────

EVENT HERO

WHAT'S ON

Live music.
Open mics.
Good vibes.

There's always something happening
at High Spirits.

────────────────────────────────────

FILTERS

[All Events]
[Live Music]
[Open Mic]
[DJ Nights]
[Offers]
[Specials]

                         [This Week ▼]

────────────────────────────────────

FEATURED THIS WEEK

[Large Event Card]

[Large Event Card]

[Large Event Card]

────────────────────────────────────

MORE UPCOMING

[Event List]
[Event List]
[Event List]
[Event List]
[Event List]

────────────────────────────────────

GREAT NIGHTS START HERE.

[Reserve a Table]

────────────────────────────────────

FOOTER

==================================================
16. MOBILE PAGE FLOW
==================================================

HEADER

High Spirits
☰

↓

HERO

WHAT'S ON

Live music.
Open mics.
Good vibes.

[Reserve a Table]

↓

FILTERS

Horizontal scrolling filter chips:

[All]
[Live Music]
[Open Mic]
[DJ]
[Offers]

↓

TIME FILTER

[This Week ▼]

↓

FEATURED THIS WEEK

One large event card at a time.

Show a small portion of the next card to indicate horizontal scrolling.

↓

MORE UPCOMING

Compact vertical event list.

↓

GREAT NIGHTS START HERE.

[Reserve a Table]

↓

FOOTER

==================================================
17. MOBILE EVENT CARDS
==================================================

Do NOT force desktop horizontal cards into mobile.

Mobile featured event:

Large image

FEATURED
LIVE MUSIC

Saturday Night Live

Indie & rock band

Every Saturday
8:30 PM onwards

[Event Details]

More Upcoming:

Compact rows.

Each row:

Date
Event name
Category
Time
Arrow

Keep the information scannable.

==================================================
18. RESPONSIVE REQUIREMENTS
==================================================

Test:

320px
360px
375px
390px
412px
430px
768px
834px
1024px
1280px
1440px

Verify:

- No horizontal overflow
- No filter wrapping problems
- No clipped event cards
- No oversized hero
- No broken images
- No text overflow
- No button overflow
- No excessive whitespace
- Mobile carousel works
- Desktop event list works
- Header remains functional

==================================================
19. TYPOGRAPHY
==================================================

Maintain High Spirits visual identity.

Use serif typography for:

- Main hero heading
- Section headings
- Event titles

Use sans-serif typography for:

- Navigation
- Metadata
- Filters
- Time
- Location
- Buttons

Do not make every heading huge.

The event information should remain easy to scan.

==================================================
20. VISUAL STYLE
==================================================

Maintain:

Deep green
Warm cream
Muted copper/orange
Dark charcoal

Use atmospheric photography.

Avoid excessive cards.

Avoid excessive shadows.

Avoid excessive icons.

Avoid excessive borders.

The page should feel:

Editorial
Premium
Warm
Musical
Social
Easy to scan

Not:

Corporate
Dashboard-like
Overloaded
Calendar-like

==================================================
21. HOMEPAGE INTEGRATION
==================================================

IMPORTANT:

The homepage should NOT display the entire What's On page.

Homepage:

WHAT'S ON

Tonight & This Week

Show only 2–3 highlights.

Then:

View all events →

Clicking:

View all events →

must navigate to the full What's On route.

The full route contains:

- Hero
- Filters
- Featured events
- More upcoming
- Event details
- Reservation CTA

Do not duplicate the full page on Home.

==================================================
22. NAVIGATION
==================================================

Use the existing route if one already exists.

Recommended:

/events

or

/whats-on

Do NOT create duplicate routes.

If the existing application already uses a specific route, keep it.

Header:

What's On
↓
Existing Events route

Homepage:

View all events →
↓
Same Events route

Event card:

Event Details →
↓
Existing event detail functionality

==================================================
23. FUNCTIONALITY PROTECTION
==================================================

Before making changes:

Audit the current implementation.

Identify:

- Existing event route
- Event components
- Event API
- Event database
- Category data
- Date data
- Event detail functionality
- Existing filters
- Existing reservation CTA

Reuse existing functionality.

Do NOT:

- Change database schema
- Change API contracts
- Rewrite event logic
- Remove working events
- Replace existing reservation logic
- Change menu logic
- Change ordering logic
- Change billing
- Change active session logic

This task is primarily:

UI
UX
Layout
Responsive design
Information hierarchy

==================================================
24. DATA ACCURACY
==================================================

Do not create fake event data.

Use the existing event database/data source.

If only three events currently exist, display those three.

If more events exist, display them through More Upcoming.

Do not hardcode example events just to fill the layout.

==================================================
25. PERFORMANCE
==================================================

Do not load unnecessarily large images for every event immediately.

Use:

- Existing optimized assets
- Appropriate image dimensions
- Lazy loading for lower-page event images where appropriate

Do not change backend image infrastructure unnecessarily.

==================================================
26. FINAL QA
==================================================

Verify:

- What's On route loads
- Existing events appear
- Filters work
- Date/time filtering works
- Event details work
- Images load
- Homepage "View all events" works
- Reservation CTA works
- Navigation works
- Mobile navigation works
- Mobile carousel/list works
- Desktop layout works
- No horizontal overflow
- Existing functionality outside What's On has not regressed

==================================================
27. CHANGES.MD
==================================================

After implementation create/update:

changes.md

Document:

- What's On page redesign
- Layout changes
- Filter changes
- Featured event changes
- Upcoming event list changes
- Mobile responsive changes
- Components reused
- Components modified
- Routes used
- Existing functionality tested
- Bugs discovered
- Bugs fixed
- Remaining limitations

Only document changes that were actually implemented and tested.

FINAL REQUIREMENT:

The homepage What's On section is a PREVIEW.

The /events or /whats-on route is the FULL EXPERIENCE.

Do not confuse the two.

Homepage:
"Here's what's happening."

Full What's On page:
"Explore everything happening at High Spirits."