# High Spirits Cafe — About Page Exact Layout Implementation

## OBJECTIVE

Recreate the About page layout and visual structure shown in the provided reference design.

IMPORTANT:

This is a UI/UX implementation task only.

DO NOT change, rewrite, refactor, remove, or replace any existing working functionality.

The current application functionality is already working.

The following must remain untouched:

- Reservation creation
- Reservation lookup
- Reservation code generation
- Table assignment
- Menu loading
- Menu search
- Menu filtering
- Cart
- Ordering
- Bill
- Active dining session
- Session management
- Authentication/session logic
- Database
- APIs
- Existing routes unless required to expose the About page
- Existing backend logic
- Existing business logic

Only modify the About page presentation, layout, styling and navigation integration.

==================================================
1. REFERENCE DESIGN
==================================================

Use the provided About page reference image as the visual source of truth.

Reproduce the same:

- Overall page structure
- Section ordering
- Visual hierarchy
- Typography hierarchy
- Image placement
- Card proportions
- Spacing
- Background transitions
- Button placement
- Navigation structure
- Footer structure
- Responsive behaviour

Do not reinterpret the layout into a different design.

The goal is to reproduce the reference design as closely as possible while adapting the content to the existing High Spirits application.

==================================================
2. ABOUT PAGE ROUTE
==================================================

About navigation item should open:

/about

The About navigation item should appear active when the user is on this route.

Do not create a duplicate About page.

If an About page already exists, update its UI instead of creating another implementation.

==================================================
3. GLOBAL HEADER
==================================================

Use the existing High Spirits header/navigation system.

Do not create a separate unrelated header component.

Desktop navigation:

High Spirits Cafe logo

Home
Menu
What's On
Visit
About

Secondary:
My Reservation

Primary:
Reserve a Table

About should appear visually active.

IMPORTANT:

Do not break:

- My Reservation
- Reserve a Table
- Active dining session
- View Bill
- End Session

If the application has an active dining session, preserve the existing session behaviour.

Only adapt the visual layout where necessary.

==================================================
4. ABOUT HERO
==================================================

Create a large atmospheric hero section.

Use a high-quality High Spirits interior/restaurant image.

Hero content should be positioned on the left.

Small eyebrow:

ABOUT HIGH SPIRITS

Main heading:

More than
a night out.

Supporting text:

Good food, live music, craft cocktails
and unforgettable nights —
that's what we're all about.

Primary CTA:

Reserve a Table

The hero should have:

- Dark image overlay
- High contrast white typography
- Elegant serif heading
- Clean sans-serif supporting text
- Warm copper/orange CTA

Do not add additional CTAs.

Do not add excessive text.

Desktop hero should be visually cinematic.

Mobile hero should become shorter and vertically stacked.

==================================================
5. OUR STORY
==================================================

Immediately after the hero create a two-column section.

LEFT:

Eyebrow:

OUR STORY

Heading:

It started with music.

Short story copy.

Use concise paragraphs.

Example:

In 2005, High Spirits Cafe began as a dream to
create a space where people could come together
over good food, great drinks and the kind of music
that stays with you.

From a small corner in Koregaon Park to one of
Pune's nightlife destinations, the heart has remained
the same — make every night worth remembering.

Then:

Since 2005.

RIGHT:

Large High Spirits exterior/interior image.

Image should have:

- Rounded corners
- Large aspect ratio
- Premium photographic treatment

IMPORTANT:

Do not invent historical claims.

If verified historical information is not available, keep the story generic and accurate.

==================================================
6. WHAT MAKES US DIFFERENT
==================================================

Create a full-width dark section.

Eyebrow:

WHAT MAKES US DIFFERENT

Heading:

Four things we do best.

Display four equal columns.

1.

LIVE MUSIC

From indie bands to open mics,
the stage is where the night comes alive.

2.

GOOD FOOD

A menu crafted for every mood,
from sharing plates to late-night cravings.

3.

GREAT DRINKS

Signature cocktails, timeless classics
and a bar that never runs out of stories.

4.

GOOD COMPANY

Whether it's friends, family or new faces —
you'll always feel at home.

Each item should include:

- Minimal line icon
- Heading
- Short description

Do not create large cards.

Keep the section elegant and spacious.

==================================================
7. THE EXPERIENCE
==================================================

Create a light/cream section.

Eyebrow:

THE EXPERIENCE

Heading:

The vibe. The people. The place.

Below:

Four image cards.

Card 1:

THE STAGE

Where the music
brings us together.

Card 2:

THE BAR

Where conversations
begin.

Card 3:

THE TERRACE

Breezy evenings and
better conversations.

Card 4:

THE CROWD

You come for the music.
You stay for the people.

Each card:

- Large image
- Small title
- One short description

Images should be visually consistent.

Use rounded corners.

Do not create excessive text.

==================================================
8. OUR JOURNEY
==================================================

Create a subtle timeline section.

Eyebrow:

OUR JOURNEY

Heading:

Since 2005,
and counting.

Show a horizontal timeline on desktop.

Example:

2005
High Spirits begins

2010
The stage gets bigger

2015
New flavours, new memories

2020
Growing with Pune

TODAY
Still here for the music,
food and stories.

IMPORTANT:

Do not fabricate actual historical milestones.

If the application does not have verified milestone data, use only:

2005
Founded

TODAY
Still creating nights worth remembering.

Or remove the detailed milestones.

The visual timeline can remain.

Mobile:

Convert timeline into a vertical timeline.

==================================================
9. FINAL CTA
==================================================

Create a dark CTA strip before the footer.

Use a warm restaurant/cocktail image on the left.

Content:

COME BE A PART OF THE STORY

Good nights are waiting.

Buttons:

View Menu

Reserve a Table

Use the existing working routes/actions.

Do NOT implement new reservation logic.

Use the existing reservation action.

==================================================
10. FOOTER
==================================================

Keep the existing footer functionality.

Reorganize visually to match the reference.

Columns:

HIGH SPIRITS CAFE

Live music.
Good food.
Unforgettable nights.

Social icons.

QUICK LINKS

Home
Menu
What's On
Visit
About

MY ACCOUNT

My Reservation
Reserve a Table
View Bill

CONTACT

Phone
Email
Koregaon Park, Pune

OPEN TODAY

12 PM – 1 AM

View all hours →

Bottom:

© High Spirits Cafe
Privacy Policy
Terms & Conditions

Do not remove existing functional footer links.

==================================================
11. NAVIGATION RELATIONSHIPS
==================================================

The About page should integrate into the existing navigation system.

Navigation:

Home
→ /

Menu
→ /menu

What's On
→ /events

Visit
→ /visit

About
→ /about

My Reservation
→ existing reservation lookup flow

Reserve a Table
→ existing reservation creation flow

Do not change the underlying routes if different routes already exist.

Use the application's existing route definitions.

==================================================
12. CROSS-NAVIGATION FROM ABOUT
==================================================

About page should provide useful next steps.

From About:

Reserve a Table
→ existing reservation flow

View Menu
→ existing Menu route

What's On
→ existing Events route

Visit
→ existing Visit route

Do not create duplicate pages.

==================================================
13. RESPONSIVE DESIGN
==================================================

The desktop reference must NOT simply be scaled down.

Create an intentional responsive layout.

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

Mobile structure:

HEADER
↓
HERO
↓
OUR STORY
↓
WHAT MAKES US DIFFERENT
↓
THE EXPERIENCE
↓
OUR JOURNEY
↓
CTA
↓
FOOTER

Hero:

- Reduce height
- Reduce heading size
- Stack content
- Full-width CTA
- Maintain readable contrast

Our Story:

Desktop:
2 columns

Mobile:
Image
↓
Text

What Makes Us Different:

Desktop:
4 columns

Mobile:
2 × 2 grid OR vertical stack depending on viewport.

Experience:

Desktop:
4 image cards

Mobile:
Horizontal scroll/carousel OR 2-column grid.

Do NOT make four tiny cards.

Journey:

Desktop:
Horizontal timeline

Mobile:
Vertical timeline.

CTA:

Desktop:
Image + content + buttons

Mobile:
Stack vertically.

==================================================
14. TYPOGRAPHY
==================================================

Maintain the existing High Spirits visual identity.

Use:

Elegant serif typography for:

- Major page headings
- Section headings
- Story headings

Use clean sans-serif typography for:

- Navigation
- Body copy
- Buttons
- Metadata

Do not use oversized typography everywhere.

Only hero/page headings should be visually dominant.

Body text must remain concise.

==================================================
15. SPACING
==================================================

Use generous but controlled spacing.

Do not create excessive vertical gaps.

Desktop:

Section padding:
64–96px

Mobile:

Section padding:
40–56px

Keep content centered within a consistent max-width.

Recommended:

1200–1280px maximum content width.

==================================================
16. COLOUR SYSTEM
==================================================

Preserve High Spirits visual identity.

Primary:

Deep dark green

Secondary:

Warm cream

Accent:

Muted copper / warm orange

Text:

Dark charcoal

Hero:

Dark image overlay

Do not introduce unrelated bright colours.

==================================================
17. IMAGES
==================================================

Prioritize real High Spirits imagery if already available in the application.

Do not replace existing working image assets unnecessarily.

Use:

Hero:
Interior / bar / nightlife atmosphere

Story:
Exterior / restaurant

Experience:
Stage
Bar
Terrace
Crowd

CTA:
Cocktail / nightlife / restaurant atmosphere

If appropriate existing assets are already available, reuse them.

Do not break image paths.

Do not replace working assets unless necessary.

==================================================
18. FUNCTIONALITY PROTECTION
==================================================

Before changing code:

Inspect the existing implementation.

Identify:

- Existing components
- Existing routes
- Existing navigation
- Existing CTA handlers
- Existing reservation state
- Existing session state
- Existing APIs
- Existing database interactions

Only modify the visual layer.

Do not:

- Rewrite APIs
- Change database schemas
- Change reservation logic
- Change menu logic
- Change authentication
- Change session logic
- Change ordering
- Change billing
- Remove working functionality
- Replace working components unnecessarily

If an existing component already provides the required functionality, reuse it.

==================================================
19. REGRESSION TESTING
==================================================

After implementing About page, verify:

Home still works.

Menu still works.

Menu search still works.

Menu filters still work.

Reservation creation still works.

Reservation lookup still works.

Reservation code still works.

Table assignment still works.

Cart still works.

Ordering still works.

Bill still works.

Active dining session still works.

View Bill still works.

End Session still works.

What's On route still works.

Visit route still works.

Navigation still works.

Mobile navigation still works.

==================================================
20. DO NOT TOUCH WORKING FUNCTIONALITY
==================================================

This is critical.

If something is already functional, leave its logic untouched.

Do not "clean up" unrelated code.

Do not refactor backend code.

Do not migrate components unnecessarily.

Do not change database structure.

Do not change API contracts.

Do not change reservation behaviour.

Only implement the About page UI and required navigation connection.

==================================================
21. FINAL QUALITY CHECK
==================================================

Compare the implemented page against the supplied reference.

Check:

- Overall composition
- Hero height
- Typography
- Image proportions
- Section order
- Spacing
- Card proportions
- Button placement
- Background transitions
- Footer
- Responsive behaviour

The result should feel like the SAME DESIGN SYSTEM and SAME PAGE as the reference, not merely a page inspired by it.

==================================================
22. CHANGES.MD
==================================================

After implementation create/update:

changes.md

Document only actual changes.

Include:

1. About page layout implemented
2. Components created/modified
3. Navigation integration
4. Responsive changes
5. Image assets used
6. Existing functionality verified
7. Regression tests performed
8. Bugs discovered
9. Bugs fixed
10. Remaining limitations

IMPORTANT:

Do not claim functionality was tested unless it was actually tested.

Final requirement:

The About page should look and behave like the supplied reference while the existing High Spirits application's working functionality remains completely intact.