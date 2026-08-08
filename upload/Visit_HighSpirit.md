# High Spirits Cafe — /visit Page Layout & Implementation

OBJECTIVE

Redesign the existing /visit page into a clean, premium, minimalistic "Visit High Spirits" destination page.

The page should answer four customer questions quickly:

1. Where are you?
2. When are you open?
3. How can I contact/reach you?
4. What should I know before visiting?

IMPORTANT:

This is a UI/UX and layout update only.

DO NOT change or break any existing working functionality.

Preserve all existing:
- Routes
- Reservation functionality
- Menu functionality
- Ordering
- Active dining session
- Bill
- Authentication/session
- Database
- APIs
- Navigation logic
- Contact links
- Map/directions functionality

Reuse existing components and data wherever possible.

==================================================
1. PAGE STRUCTURE
==================================================

The /visit page should follow this structure:

HEADER
↓
HERO
↓
FIND US
↓
OPENING HOURS + CONTACT
↓
GOOD TO KNOW
↓
A FEW LOOKS INSIDE
↓
RESERVATION CTA
↓
FOOTER

Do not add unnecessary sections.

The Visit page should feel practical and calm, not like another marketing-heavy homepage.

==================================================
2. HEADER
==================================================

Reuse the existing High Spirits header.

Desktop:

High Spirits Cafe logo

Home
Menu
What's On
Visit
About

My Reservation

Reserve a Table

Visit should be visually highlighted as the active route.

Do not create a separate header implementation if one already exists.

Do not break:
- My Reservation
- Reserve a Table
- Active dining session
- View Bill
- End Session

If an active dining session exists, preserve the current session behaviour.

==================================================
3. HERO
==================================================

Create a wide atmospheric hero using an existing High Spirits restaurant/interior/night image.

Hero content should be positioned on the left.

Eyebrow:

VISIT HIGH SPIRITS

Heading:

Come by tonight.

Supporting text:

Good music, great food
& even better company.

Primary CTA:

Reserve a Table

Do not add multiple CTAs.

Do not put address, phone number, opening hours or long information inside the hero.

The hero is only for atmosphere + one clear action.

Desktop:
- Large cinematic image
- Dark overlay
- White typography
- Warm copper/orange CTA

Mobile:
- Shorter hero
- Readable heading
- Full-width CTA
- No text clipping
- No excessive vertical height

==================================================
4. FIND US
==================================================

Create the main location section immediately after the hero.

Section layout:

LEFT:
Location information

RIGHT:
Map

Heading:

Find Us

Location:

High Spirits Cafe
Koregaon Park, Pune

Use the actual address already stored in the application.

Do NOT invent or replace the existing address.

Primary action:

Get Directions →

This should use the existing directions/map functionality if already implemented.

RIGHT SIDE:

Display the existing map/location component.

Do not hardcode a fake map if a working map already exists.

If the existing application uses Google Maps or another map integration, preserve it.

Desktop:
- Two-column layout
- Location details approximately 35–40%
- Map approximately 60–65%

Mobile:
- Location details first
- Get Directions button
- Map below
- Full-width map container

==================================================
5. MAP
==================================================

The map should:

- Have rounded corners
- Have a reasonable fixed height
- Clearly show High Spirits location
- Not dominate the page
- Remain responsive

Desktop:
Approximately 400–450px height.

Mobile:
Approximately 280–340px height.

Do not create excessive map height.

==================================================
6. OPENING HOURS + CONTACT
==================================================

Create a two-column section.

LEFT:

OPENING HOURS

Show actual existing business hours from the application.

Example structure:

Monday – Thursday     12 PM – 1 AM
Friday                12 PM – 2 AM
Saturday              12 PM – 2 AM
Sunday                12 PM – 1 AM

Below:

Kitchen closes 30 mins before closing time.

IMPORTANT:

Do not invent opening hours.

Use existing application data.

If opening hours are dynamic, use the existing data source.

RIGHT:

GET IN TOUCH

Phone
Existing phone number

Email
Existing email

Instagram
Existing social link

Each should be clickable where appropriate.

Phone:
tel:

Email:
mailto:

Instagram:
existing Instagram URL

Do not hardcode new contact information.

==================================================
7. CURRENT OPEN/CLOSED STATUS
==================================================

If the existing application already calculates open/closed status, reuse it.

Display a small status indicator such as:

OPEN TODAY
12 PM – 1 AM

or

CLOSED
Opens tomorrow at 12 PM

Do not create a second independent opening-hours calculation.

Use the application's existing source of truth.

==================================================
8. GOOD TO KNOW
==================================================

Add a compact informational section.

Heading:

Good to Know

Use 3–4 small informational cards only if the information actually exists.

Recommended:

Parking
Valet/parking information

Live Music
Regular live performances

Private Events
Venue/event booking information

Accessibility
Accessibility information

IMPORTANT:

Only show cards for information that is actually available and verified.

Do not invent claims.

Do not create large cards.

Each card should contain:

Minimal icon
Short heading
One or two lines of information

Example:

PARKING
Parking information available at the venue.

LIVE MUSIC
Live performances on selected nights.

PRIVATE EVENTS
Talk to us about hosting your event.

ACCESSIBILITY
Wheelchair accessible seating and entry.

If any of these details are not available, remove that card instead of using placeholder content.

==================================================
9. A FEW LOOKS INSIDE
==================================================

Optional image section.

Heading:

A Few Looks Inside

Use 3–4 high-quality existing High Spirits images.

Suggested imagery:

- Restaurant exterior
- Bar
- Terrace
- Dining area

Do not create a huge gallery.

This is a visual reassurance section, not a full Gallery page.

Each image:
- Same visual treatment
- Rounded corners
- Consistent aspect ratio
- No unnecessary captions unless useful

Desktop:
3–4 images in a clean grid.

Mobile:
Use a horizontal image carousel OR a clean 2-column grid.

Do not create a long vertical image list.

==================================================
10. RESERVATION CTA
==================================================

After the practical information, create one simple CTA.

Use a subtle cream/dark-green panel.

Heading:

Good nights start here.

Supporting text:

Book your table and be part of it.

Primary CTA:

Reserve a Table

Use the EXISTING reservation action.

Do not create new reservation logic.

Do not duplicate the entire reservation form here.

Clicking the CTA should use the existing reservation flow.

==================================================
11. FOOTER
==================================================

Reuse the existing High Spirits footer.

Keep it concise.

Column 1:

HIGH SPIRITS CAFE

Live music.
Good food.
Unforgettable nights.

Social icons.

Column 2:

QUICK LINKS

Home
Menu
What's On
Visit
About

Column 3:

CONTACT

Phone
Email
Koregaon Park, Pune

Column 4:

OPEN TODAY

12 PM – 1 AM

View all hours →

Bottom:

© High Spirits Cafe
Privacy Policy
Terms & Conditions

Do not duplicate large amounts of information from the page.

==================================================
12. DESKTOP PAGE FLOW
==================================================

The final desktop layout should be:

HEADER
────────────────────────────────────

HERO
Come by tonight.
Good music, great food
& even better company.

[Reserve a Table]

────────────────────────────────────

FIND US

High Spirits Cafe
Koregaon Park, Pune

[Get Directions]

                    MAP

────────────────────────────────────

OPENING HOURS          GET IN TOUCH

Mon–Thu               Phone
Friday                Email
Saturday              Instagram
Sunday

────────────────────────────────────

GOOD TO KNOW

[Parking]
[Live Music]
[Private Events]
[Accessibility]

────────────────────────────────────

A FEW LOOKS INSIDE

[Image] [Image] [Image] [Image]

────────────────────────────────────

GOOD NIGHTS START HERE.

Book your table and be part of it.

[Reserve a Table]

────────────────────────────────────

FOOTER

==================================================
13. MOBILE PAGE FLOW
==================================================

Mobile should be intentionally designed.

HEADER
High Spirits                         ☰

↓

HERO

Come by tonight.

Good music, great food
& even better company.

[Reserve a Table]

↓

FIND US

High Spirits Cafe
Koregaon Park, Pune

[Get Directions]

MAP

↓

OPEN TODAY

12 PM – 1 AM

View hours →

↓

GET IN TOUCH

Phone
Email
Instagram

↓

GOOD TO KNOW

[Parking]
[Live Music]
[Accessibility]

↓

A FEW LOOKS INSIDE

[Image]
[Image]
[Image]

↓

GOOD NIGHTS START HERE.

[Reserve a Table]

↓

FOOTER

The mobile page should be substantially shorter and easier to scan than the desktop page.

==================================================
14. RESPONSIVE REQUIREMENTS
==================================================

Test at:

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

Check for:

- Horizontal overflow
- Text clipping
- Broken map
- Oversized images
- Button wrapping
- Excessive whitespace
- Tiny text
- Broken navigation
- Modal overlap
- Footer overflow
- Incorrect image cropping

No horizontal scrolling should exist.

All buttons should have comfortable touch targets.

==================================================
15. TYPOGRAPHY
==================================================

Follow the existing High Spirits visual language.

Use elegant serif typography for:

- Hero heading
- Major section headings

Use clean sans-serif typography for:

- Navigation
- Body copy
- Contact information
- Buttons
- Metadata

Do not use oversized text throughout the page.

Only the hero and primary section headings should have strong visual hierarchy.

Keep body copy short.

==================================================
16. VISUAL STYLE
==================================================

Maintain the existing High Spirits design system.

Primary:
Deep green

Background:
Warm cream / off-white

Accent:
Muted copper / warm orange

Text:
Dark charcoal

Images:
Warm, atmospheric, premium nightlife photography

Use subtle borders and restrained shadows.

Avoid excessive cards.

Avoid excessive rounded containers.

Avoid excessive icons.

The page should feel like a premium hospitality website, not an admin dashboard.

==================================================
17. INFORMATION HIERARCHY
==================================================

Priority 1:

Location
Directions
Opening hours

Priority 2:

Contact

Priority 3:

What to know before visiting

Priority 4:

Atmosphere/gallery

Priority 5:

Reservation CTA

Do not give every section equal visual weight.

==================================================
18. DO NOT DUPLICATE CONTENT
==================================================

Do not repeat:

- Full restaurant story
- Full menu
- Full event list
- Full gallery
- Reservation form
- Large contact blocks

Those belong to their respective routes.

Visit should primarily answer:

WHERE?
WHEN?
HOW?
WHAT SHOULD I KNOW?

==================================================
19. FUNCTIONALITY PROTECTION
==================================================

Before modifying the page:

Audit the existing /visit implementation.

Identify:

- Existing route
- Existing map component
- Existing contact data
- Existing opening-hours data
- Existing reservation CTA
- Existing navigation
- Existing footer
- Existing image assets

Reuse existing components and data.

Do NOT:

- Change database schema
- Change APIs
- Change reservation logic
- Change menu logic
- Change ordering logic
- Change session logic
- Change billing
- Rewrite unrelated components
- Remove working functionality

This task is a presentation/layout redesign.

==================================================
20. FINAL QA
==================================================

After implementation verify:

- /visit loads correctly
- Navigation works
- Visit active state works
- Map works
- Get Directions works
- Phone link works
- Email link works
- Instagram link works
- Opening hours display correctly
- Reservation CTA opens existing reservation flow
- Footer links work
- Mobile menu works
- Desktop layout works
- Mobile layout works
- No horizontal overflow exists

Also verify that existing functionality outside /visit has not regressed.

==================================================
21. CHANGES.MD
==================================================

After implementation create/update:

changes.md

Document:

- /visit layout changes
- Sections added
- Sections removed
- Components reused
- Components modified
- Responsive changes
- Data sources reused
- Functional links tested
- Reservation CTA tested
- Map tested
- Bugs discovered
- Bugs fixed
- Remaining limitations

Only document changes that were actually implemented and tested.

FINAL REQUIREMENT:

The /visit page should feel like a practical, premium destination page.

It should help the customer answer:

"Where is High Spirits?"
"When can I go?"
"How do I get there?"
"How do I contact them?"
"What should I know before I visit?"

Keep it minimal.

Do not turn /visit into another long marketing page.