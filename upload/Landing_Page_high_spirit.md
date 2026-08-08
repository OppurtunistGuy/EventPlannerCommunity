# High Spirits Cafe — Landing Page & Navigation Restructure

## OBJECTIVE

The existing functionality is working and must be preserved.

The problem is primarily UX structure, content density, navigation and responsive behaviour.

Redesign the customer-facing landing page to be:

- Minimal
- Fast to understand
- Mobile-first
- Restaurant-focused
- Visually premium
- Easy to navigate
- Low cognitive load

Do NOT rebuild working backend functionality.

Do NOT remove existing pages or functionality unless explicitly stated below.

The main change is how the existing content is prioritized and navigated.

==================================================
1. NEW LANDING PAGE STRUCTURE
==================================================

Replace the current homepage structure with:

1. HEADER
2. HERO
3. ESSENTIAL INFO STRIP
4. WHAT'S ON / TONIGHT & THIS WEEK
5. VISIT / LOCATION
6. FOOTER

Do NOT show large standalone sections for:

- Our Menu
- Reserve a Table
- Our Story
- Gallery
- Contact

on the homepage.

Those functions/pages remain accessible through navigation.

--------------------------------------------------
2. HEADER
--------------------------------------------------

DESKTOP NAVIGATION

Logo

Menu
What's On
Visit
About

Secondary:
My Reservation

Primary:
Reserve a Table

Remove unnecessary navigation clutter.

Do NOT display "DEMO" in customer-facing production UI.

If Demo Mode is required internally, keep it as an internal/development indicator only.

--------------------------------------------------
3. HEADER — ACTIVE SESSION
--------------------------------------------------

There are two customer states.

STATE A — No active reservation

Header:

Logo
Menu
What's On
Visit
About

My Reservation
Reserve a Table

STATE B — Active reservation/session

Header should become:

Logo
Menu
What's On
Visit

Table 4
View Bill
My Reservation
End Session

Do NOT show unnecessary duplicate reservation actions when the customer is already dining.

The current dining-session bar:

"Dining at Table 4 · Indoor · Code: 425218"

should remain useful, but visually integrate it into the session header rather than competing with the website navigation.

--------------------------------------------------
4. MOBILE HEADER
--------------------------------------------------

Desktop navigation must disappear on mobile.

Mobile header:

[High Spirits Logo]                         [☰]

If active dining session:

[Table 4] [View Bill] [☰]

Open hamburger menu:

Menu
What's On
Visit
About
My Reservation

Primary CTA:

Reserve a Table

If an active dining session exists:

View Bill
End Session

Do not show 7–8 navigation links simultaneously on mobile.

--------------------------------------------------
5. HERO
--------------------------------------------------

Keep the existing hero photography.

Do NOT replace the image unless required for responsiveness/performance.

Simplify the hero content.

Use:

KOREGAON PARK, PUNE

High Spirits
Cafe

Live music, craft cocktails & unforgettable nights.

Buttons:

[View Menu] [Reserve a Table]

Remove "My Reservation" from the hero.

Reason:

"My Reservation" is a returning-customer action.

It does not need equal prominence with the two primary first-visit actions.

Hero should not contain:

- Long descriptions
- Opening hours
- Address
- Event details
- Multiple promotional messages

The image should communicate the atmosphere.

The text should communicate the identity.

The CTA should communicate the next action.

--------------------------------------------------
6. HERO RESPONSIVE BEHAVIOUR
--------------------------------------------------

Desktop:

Large cinematic hero.

Tablet:

Reduce hero height.

Mobile:

Use approximately 60–70vh maximum.

Hero content should remain readable without requiring excessive scrolling.

Mobile CTA:

[View Menu]
[Reserve a Table]

Buttons can stack if required.

No horizontal overflow.

No text clipping.

No oversized typography.

--------------------------------------------------
7. REMOVE CURRENT THREE-CARD SECTION
--------------------------------------------------

REMOVE THIS FROM HOMEPAGE:

Our Menu
Reserve a Table
Our Story

This section is redundant.

The user already has:

Menu in header
Reservation in header
Menu CTA in hero
Reservation CTA in hero

"Our Story" should NOT compete with these actions.

The About page remains available through navigation.

Do not delete the About page.

--------------------------------------------------
8. ESSENTIAL INFO STRIP
--------------------------------------------------

Add a compact information strip immediately below the hero.

Four items:

OPEN TODAY
12 PM – 1 AM

LOCATION
Koregaon Park, Pune

LIVE MUSIC
Every Weekend

RESERVATIONS
Fast & Easy

This should be compact.

It should NOT become another large content section.

Desktop:
4 columns in one horizontal strip.

Mobile:
2 × 2 grid OR horizontal scroll if necessary.

Do not create excessive card borders.

--------------------------------------------------
9. WHAT'S ON
--------------------------------------------------

Rename:

"Upcoming Events"

to:

"Tonight & This Week"

Section heading:

WHAT'S ON

Tonight & This Week

This better reflects customer intent.

The customer doesn't primarily care about an event database.

They want to know:

"What is happening when I visit?"

--------------------------------------------------
10. WHAT'S ON CONTENT
--------------------------------------------------

Display maximum 3 featured items on homepage.

Examples:

Saturday Night Live
Wednesday Open Mic
Happy Hour — 12 to 6 Daily

Each card should contain only:

Event name
Short one-line description
Date/frequency
Time

Do NOT use long descriptions.

Do NOT display 8–10 event cards on homepage.

CTA:

View all events →

This links to the dedicated What's On page.

--------------------------------------------------
11. WHAT'S ON NAVIGATION
--------------------------------------------------

Header:

What's On

↓

/events

The Events page can contain:

- Full event list
- Event details
- Dates
- Times
- Descriptions
- Featured events
- Happy Hour
- Live music schedule

Homepage only shows the most relevant 2–3 items.

--------------------------------------------------
12. VISIT SECTION
--------------------------------------------------

Add a compact "Visit" section below What's On.

Heading:

VISIT

Come by tonight.

Display:

High Spirits Cafe
Koregaon Park, Pune

Open Today
12 PM – 1 AM

[Get Directions]

[View Hours]

Keep this section compact.

Do not create a giant map-heavy section.

The full Visit page can contain:

- Map
- Address
- Opening hours
- Phone
- Directions
- Parking information
- Contact information

--------------------------------------------------
13. ABOUT
--------------------------------------------------

Do NOT show the full About/Our Story section on homepage.

Move the detailed story to:

/about

Navigation:

About

↓

About page

The About page can contain:

- Restaurant story
- History
- Brand story
- Experience
- Gallery highlights

If desired, homepage can have ONE small brand statement.

Example:

"Good food. Live music. Late nights."

But this is optional.

Do not create another large section.

--------------------------------------------------
14. GALLERY
--------------------------------------------------

Remove Gallery from homepage navigation if it is not an important primary customer task.

Do NOT delete the Gallery page.

If Gallery is retained in navigation, make it secondary.

Recommended:

Header:
Menu
What's On
Visit
About

Gallery can be accessed from About or footer.

Reason:

Gallery is useful for discovery, but it is not a primary conversion action.

--------------------------------------------------
15. CONTACT
--------------------------------------------------

Remove "Contact" from primary navigation.

Contact information should be accessible from:

Visit

and

Footer.

The customer should not need a dedicated primary navigation item for Contact.

--------------------------------------------------
16. MENU NAVIGATION
--------------------------------------------------

Menu remains a primary navigation item.

Header:

Menu

↓

/menu

Menu page should support:

- Categories
- Search
- Veg filter
- Menu items
- Prices
- Item details
- Add to cart when reservation/session is active

IMPORTANT:

Menu browsing must NOT require reservation.

Without reservation:

User can browse menu.

With reservation:

User can order.

--------------------------------------------------
17. RESERVATION NAVIGATION
--------------------------------------------------

Reserve a Table remains the primary CTA.

Header:

Reserve a Table

↓

Reservation flow

Reservation flow:

Select Date
↓
Select Time
↓
Guests
↓
Customer Details
↓
Confirm
↓
Reservation Code
↓
Table Assignment
↓
Reservation Confirmation

After successful reservation:

Show:

Reservation Code
Table
Date
Time
Guests

Provide:

View My Reservation

--------------------------------------------------
18. MY RESERVATION
--------------------------------------------------

"My Reservation" should remain available but should NOT dominate the homepage.

Use it primarily in:

Header
Reservation confirmation
Dining session

Flow:

My Reservation
↓
Enter 6-digit code
↓
Reservation Details
↓
Table
↓
Order / Menu

If the customer already has an active session:

Do not ask them to enter the reservation code again.

--------------------------------------------------
19. ACTIVE DINING SESSION
--------------------------------------------------

Once the customer is seated:

The website should switch from marketing mode to dining mode.

Marketing navigation becomes secondary.

Primary customer actions become:

Menu
Cart
View Bill
Table
End Session

Example:

Dining at Table 4
Indoor
Code: 425218

[View Bill]
[End Session]

This should feel like a restaurant ordering interface, not the marketing homepage.

--------------------------------------------------
20. FOOTER
--------------------------------------------------

Simplify footer.

Include:

High Spirits Cafe

Live music • Food • Cocktails

Menu
What's On
Visit
About
My Reservation

Phone
Address

Social links

Privacy
Terms

Do NOT repeat large descriptions.

Do NOT repeat every homepage section.

--------------------------------------------------
21. FINAL LANDING PAGE WIREFRAME
--------------------------------------------------

DESKTOP

HEADER
--------------------------------------------------
Logo       Menu  What's On  Visit  About
                              My Reservation
                              [Reserve a Table]
--------------------------------------------------

HERO
--------------------------------------------------
Koregaon Park, Pune

HIGH SPIRITS
CAFE

Live music, craft cocktails &
unforgettable nights.

[View Menu] [Reserve a Table]

              Large restaurant atmosphere image
--------------------------------------------------

ESSENTIAL INFO
--------------------------------------------------
Open Today | Location | Live Music | Reservations
--------------------------------------------------

WHAT'S ON

Tonight & This Week

[ Event 1 ] [ Event 2 ] [ Event 3 ]

             View all events →
--------------------------------------------------

VISIT

High Spirits Cafe
Koregaon Park, Pune

Open Today · 12 PM – 1 AM

[Get Directions]
--------------------------------------------------

FOOTER
--------------------------------------------------


--------------------------------------------------
22. MOBILE LANDING PAGE
--------------------------------------------------

HEADER
--------------------------------
High Spirits              ☰
--------------------------------

HERO

Koregaon Park, Pune

High Spirits
Cafe

Live music, craft cocktails &
unforgettable nights.

[View Menu]
[Reserve a Table]

--------------------------------

AT A GLANCE

Open Today
12 PM – 1 AM

Location
Koregaon Park

Live Music
Every Weekend

Reservations
Fast & Easy

--------------------------------

WHAT'S ON

Tonight & This Week

[Event]

[Event]

[Event]

View all events →
--------------------------------

VISIT

Koregaon Park, Pune

12 PM – 1 AM

[Get Directions]
--------------------------------

FOOTER
--------------------------------

This should be substantially shorter than the current mobile homepage.

--------------------------------------------------
23. NAVIGATION MAP
--------------------------------------------------

HOME
/
│
├── MENU
│   /menu
│
├── RESERVATIONS
│   /reservations
│
├── MY RESERVATION
│   /reservation
│
├── WHAT'S ON
│   /events
│
├── VISIT
│   /visit
│
└── ABOUT
    /about

Do not create unnecessary navigation destinations.

--------------------------------------------------
24. NAVIGATION RULES
--------------------------------------------------

Rule 1:

Primary navigation should represent customer tasks, not every page in the application.

Rule 2:

Do not expose every piece of content in the header.

Rule 3:

Menu and Reservation are primary.

What's On and Visit are secondary but useful.

About is tertiary.

Gallery and Contact should not compete with primary navigation.

Rule 4:

Homepage sections should NOT duplicate navigation.

Rule 5:

A section should exist on homepage only if it helps a customer make a decision.

--------------------------------------------------
25. RESPONSIVE REQUIREMENTS
--------------------------------------------------

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

Fix:

- Horizontal overflow
- Text clipping
- Button wrapping
- Navigation wrapping
- Excessive vertical spacing
- Modal overflow
- Image cropping
- Card width
- Typography scaling
- Touch target sizes
- Sticky headers
- Mobile menu
- Reservation modal
- Active dining header

Do not simply scale desktop down.

Create intentional mobile layouts.

--------------------------------------------------
26. DO NOT BREAK FUNCTIONALITY
--------------------------------------------------

Before modifying:

Audit current routes, components and APIs.

Preserve:

- Reservation creation
- Reservation lookup
- Reservation code
- Table assignment
- Menu loading
- Menu search
- Menu filters
- Cart
- Ordering
- Bill
- Active dining session
- End session

This task is primarily:

UX restructuring
Navigation restructuring
Responsive improvement
Content hierarchy

NOT a backend rewrite.

--------------------------------------------------
27. ACCEPTANCE CRITERIA
--------------------------------------------------

Homepage must allow a first-time customer to:

1. Understand what High Spirits is.
2. Find Menu immediately.
3. Reserve a table immediately.
4. See what's happening this week.
5. Find location and hours quickly.

Homepage should NOT require excessive scrolling.

The current three-card section must be removed.

The full About, Gallery, Events and Visit content must remain accessible through appropriate pages.

Navigation must change according to whether the customer is:

A. Browsing
B. Reserving
C. Dining at a table

The interface should become progressively more task-focused as the customer moves deeper into the experience.

--------------------------------------------------
28. IMPORTANT
--------------------------------------------------

Do not add more sections to compensate for removed sections.

Do not add decorative cards simply to fill space.

Do not add additional CTAs.

Do not make every section visually prominent.

The goal is:

LESS CONTENT
LESS NAVIGATION
LESS SCROLLING
LESS DECISION-MAKING

while preserving:

BRAND
ATMOSPHERE
MENU
RESERVATIONS
EVENTS
ORDERING
BILLING

--------------------------------------------------
29. CHANGES.MD
--------------------------------------------------

After implementation create/update:

changes.md

Include:

- Landing page changes
- Removed sections
- Consolidated sections
- Navigation changes
- Desktop responsive changes
- Mobile responsive changes
- Session-state navigation changes
- Components modified
- Routes modified
- Functionalities tested
- Bugs discovered
- Bugs fixed
- Remaining limitations

Only document changes that were actually implemented and tested.