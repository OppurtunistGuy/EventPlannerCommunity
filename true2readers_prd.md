# True2Readers — Product Requirements Document
**Status:** Phase 0 Implementation Approved, Pending Execution  
**Last Updated:** 2026-08-21  
**Owner:** Thinkable & Co | Contact: nik.patil4696@gmail.com

---

## 1. Product Vision

> **Know what a book feels like before you commit — and know whether that experience fits your taste.**

True2Readers is not a book-search app or a recommendation engine.  
It is a **Reader Taste + Reader Experience engine** — the intersection of what a book feels like to read and what a particular reader tends to enjoy.

---

## 2. Core Product Promise

| Layer | What it answers |
|---|---|
| **Book Facts** | What is this book? |
| **Reader Experience** | What does it feel like to read this book? |
| **Reader Taste** | What does *this reader* tend to enjoy? |
| **Personal Match** | Given both — is this book right for me? |

The differentiator is **"Potential Mismatch"** as a first-class concept.  
Most apps answer: *Why you'll like this.*  
True2Readers answers: *Why you'll like it — and why you might not.*

---

## 3. Product Loop

```
Search a book
      ↓
Understand it
      ↓
See what real readers experience
      ↓
Compare with YOUR taste
      ↓
Decide
      ↓
Give feedback / interact
      ↓
True2Readers learns
      ↓
Next book match gets better
      ↺
```

---

## 4. Current Implementation Status

### ✅ BUILT — Core Infrastructure

| Component | Status | Notes |
|---|---|---|
| Next.js 16 app (Turbopack) | ✅ Live | Deployed on Vercel |
| Book search UI | ✅ Live | Home view with search input |
| Search results grid | ✅ Live | `results-view.tsx` |
| Book Detail page (3-column) | ✅ Live | `detail-view.tsx` — 754 lines |
| Provider orchestration | ✅ Live | `src/lib/providers/index.ts` |

### ✅ BUILT — Data Sources

| Provider | Status | Purpose |
|---|---|---|
| Google Books API | ✅ Primary | Search, metadata, cover, ISBN, preview link |
| Apple Books / iTunes | ✅ Fallback | Cover, title, store link (on Google 429) |
| Open Library | ✅ Enrichment | On-demand ISBN enrichment via `/api/books/[id]/enrich` |

### ✅ BUILT — Book Detail Page Sections

| Section | Status | Data Source |
|---|---|---|
| Book cover + enlarge | ✅ Live | Google / Apple / Open Library |
| Book details card (ISBN, genre, pages, year) | ✅ Live | Google Books metadata |
| Quick Facts card | ✅ Live | **Hardcoded** (Atomic Habits) — not dynamic yet |
| Available at (Amazon / Apple / Google) | ✅ Live | Affiliate link generation |
| "What this book is about" | ✅ Live | `extractOverview()` from description |
| Book Preview box | ✅ Live | Google Books link + **hardcoded** excerpt |
| "Why it may interest you" (3 cards) | ✅ Live | `generateWhyInterest()` — metadata-derived |
| "Reading Feel" dot-meter grid | ✅ Live | **Hardcoded mock** — labeled as such |
| "How readers experience this book" | ✅ Live | Live user submissions via local DB |
| Reader Experience Framework (6 dims) | ✅ Live | `AiBreakdown` component — right column |
| About the Author | ✅ Live | **Hardcoded** (James Clear) |
| Our Commitment card | ✅ Live | Static trust signal |

### ✅ BUILT — Auth & Feedback

| Feature | Status |
|---|---|
| User signup / login | ✅ Live |
| Session management (httpOnly cookie) | ✅ Live |
| Book feedback submission (pacing, tone, dialogue) | ✅ Live |
| Reader submission form (6 dimensions) | ✅ Live |

### ✅ BUILT — Security & Deployment

| Item | Status |
|---|---|
| Security headers (CSP, X-Frame, XSS) | ✅ Configured in `next.config.ts` |
| Prisma schema (User, BookStyleFeedback) | ✅ Live |
| Vercel production deployment | ✅ Live |
| TypeScript strict mode passing | ✅ Verified |

---

## 5. Known Issues / Technical Debt

| Issue | Severity | Notes |
|---|---|---|
| Quick Facts card shows Atomic Habits data for all books | High | Hardcoded — needs dynamic data |
| About the Author shows James Clear for all books | High | Hardcoded — needs dynamic data |
| Book Preview excerpt is hardcoded Atomic Habits text | High | Should use `previewSnippet` or Google Books embed |
| "Reading Feel" dot-meter is hardcoded mock | Medium | Will be partially replaced by Reader Experience layer |
| No Reader Experience data exists yet | High | Phase 0 builds this |

---

## 6. Roadmap

### Phase 0 — Reader Experience Validation ← NEXT
**Status: Implementation approved, not yet executed**

**Goal:** Validate whether synthesized reader-experience insights are genuinely useful and book-specific before building any review aggregation, AI, or personalization.

**Deliverables:**
- `src/lib/reader-experiences.ts` — Static curated profiles for 15 books
- `src/components/trueread/reader-experience-section.tsx` — Presentational component
- Minimal update to `detail-view.tsx` — insert section between overview and preview

**15 curated books:**  
Atomic Habits · Dune · 1984 · The Alchemist · The Silent Patient · Harry Potter · Sapiens · The Psychology of Money · Think and Grow Rich · The Great Gatsby · Normal People · The Hitchhiker's Guide · Rich Dad Poor Dad · Gone Girl · The Midnight Library

**Matching priority:** ISBN-13 → Google volumeId → ISBN-10 → title‖author fallback

**Success criterion:**  
Show output to a reader who has read the book. They should say: *"Yes, that's what reading this book actually feels like."*

**Validation questions to ask testers:**
1. What part feels inaccurate or exaggerated?
2. What's missing that affected your reading experience?
3. Would knowing this before reading have changed your decision?

**NOT in Phase 0:** Reddit API, AI API, behavioral tracking, taste quiz, fit score, DB changes.

---

### Phase 1 — Dynamic Reader Experience (Post-Validation)

Replace static profiles with synthesized data from permitted sources.  
Use structured extraction, not raw review display.

**Output format per book:**
```
[Theme]     → label
[Sentiment] → positive / mixed / negative
[Frequency] → "Frequently mentioned" / "Some readers note"
[Signal]    → one representative paraphrase, no fabricated quotes
```

---

### Phase 2 — Reader Taste Profile

**Onboarding (post-search, not pre-search):**
> "Want us to make this more personal?" — triggered after first meaningful interaction

**3 questions (reading experience, not genre preference):**
1. What usually keeps you turning pages? → Fast plot / Characters / Ideas / Atmosphere
2. How much effort do you want? → Easy escape / Some focus / Deep dive
3. Which would bother you more? → Slow beginning / Dense writing / Too much dialogue / Predictable story

**Profile signals (weighted):**

| Signal | Weight |
|---|---|
| Explicit preference | +1.0 |
| User feedback submitted | +3.0 |
| Behavioral (opens, saves, previews) | +1.5 |

---

### Phase 3 — Personal Match

Combine Reader Experience + Reader Taste.  
**No numerical fit score in v1.** Use explainable rules.

```
YOUR FIT

Strong match
✓ Accessible writing
✓ Character-focused

Potential mismatch
! Slow opening — you tend to prefer books that get moving quickly.
```

---

### Phase 4 — Behavioral Learning

Only after real user volume.  
System discovers preferences the user never explicitly stated.

> "We've noticed: you consistently finish slower books when the writing is highly immersive."

---

## 7. Deliberately Out of Scope (All Phases)

- Reading tracker / social feed
- Generic "Discover books" recommendation grid  
- Star ratings displayed on the detail page
- Goodreads / Amazon review scraping
- "87% AI Match" numeric scores
- Storing entire external reviews
- Fake source counts or fabricated reader quotes

---

## 8. Page Hierarchy (Target State)

```
BOOK TITLE + SUBTITLE + AUTHOR

What this book is about          [description — existing]
        ↓
What readers experience          [Phase 0 — curated]
Potential mismatch               [Phase 0 — curated]
        ↓
Book Preview                     [existing]
        ↓
Reading Feel                     [existing]
        ↓
Where to get it                  [existing]
```

---

## 9. Branding & Identity

- **Product name:** True2Readers (not TrueRead, not True Read)  
- **Logo:** Blue open-book SVG (`/favicon.svg`)  
- **Contact:** nik.patil4696@gmail.com  
- **Team:** Thinkable & Co  
- **Live URL:** https://true2readers-thinkable-co.vercel.app

---

## 10. Moat

| Competitor | What they say |
|---|---|
| Google | Here's a list of fantasy books |
| ChatGPT | Here's what you might like |
| Amazon | People who bought X also bought Y |
| **True2Readers** | You tend to abandon slow openers. This book has one — but readers report a strong payoff. Here's how that compares with your history. |
