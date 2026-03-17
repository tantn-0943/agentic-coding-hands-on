# Implementation Plan: Sun* Kudos - Live Board

**Frame**: `2940-13431-sun-kudos-live-board`
**Date**: 2026-03-16
**Spec**: `specs/2940-13431-sun-kudos-live-board/spec.md`

---

## Summary

Build the Sun* Kudos Live Board — a dark-themed, gold-accented page for browsing, sending, and engaging with kudos (appreciation messages) within the SAA 2025 platform. The page consists of 5 major sections: Hero Banner, Highlight Carousel, Spotlight Board, All Kudos Feed (infinite scroll + sidebar), and Footer. Backend uses Supabase with RLS-protected tables; frontend uses Next.js 15 App Router with Server Components for initial data fetch and Client Components for interactivity. Deployed on Cloudflare Workers via @opennextjs/cloudflare.

---

## Technical Context

**Language/Framework**: TypeScript 5.x / Next.js 15.x (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4.x, @supabase/ssr, @supabase/supabase-js, Zod
**Database**: PostgreSQL via Supabase (Auth + DB + Realtime + Storage)
**Testing**: Vitest (unit/integration), Playwright (E2E)
**State Management**: React Context (page-wide filters), URL search params (shareable filter state), local component state
**API Style**: Next.js Route Handlers (REST-like) + Supabase Server Actions for mutations
**Deployment**: Cloudflare Workers via @opennextjs/cloudflare

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] Follows project coding conventions (Principle I: Clean Code)
- [x] Uses approved libraries and patterns (Tech Stack section)
- [x] Adheres to folder structure guidelines (`src/components/kudos/`, `src/app/kudos/`)
- [x] Meets security requirements (Principle VI: OWASP — Zod validation, RLS, Supabase Auth)
- [x] Follows testing standards (Principle VII: TDD — Vitest + Playwright)

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| d3.js (new library for Spotlight Board) | Required for interactive word cloud / force-directed graph visualization — no approved library covers this | Canvas/SVG from scratch would be significantly more complex and error-prone |
| SVN-Gotham (custom local font) | Required by design — not on Google Fonts, must be self-hosted via `next/font/local` | Substituting with Montserrat would not match Figma design |

**Action Required**: Add `d3.js` (or `@visx/visx` as a lighter React-friendly alternative) to constitution's "Approved Additions" before implementation begins.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based under `src/components/kudos/` with shared primitives in `src/components/ui/`
- **Rendering Strategy**:
  - **Server Components** (default): Page layout, initial data fetch (kudos feed first page, highlights, stats, leaderboard)
  - **Client Components** (`"use client"`): Heart toggle, carousel interaction, infinite scroll, spotlight board, filters, profile search, toast
- **Styling Strategy**: TailwindCSS 4.x utility classes with CSS custom properties for design tokens (defined in `globals.css`)
- **Data Fetching**:
  - Initial load: Server Component with `createServerClient` → Supabase queries
  - Client mutations (heart, copy link): Server Actions via `"use server"` functions
  - Infinite scroll: Client-side fetch with cursor-based pagination
  - Profile search: Client-side debounced fetch (300ms)
- **Fonts**: `SVN-Gotham` via `next/font/local`; `Montserrat` + `Montserrat Alternates` via `next/font/google`

### Backend Approach

- **API Design**: Prefer Supabase SDK direct queries in Server Components and Server Actions over Route Handlers where possible. Use Route Handlers only for webhook endpoints or complex multi-step operations.
- **Data Access**: Supabase client SDK with typed queries (generated types from `supabase gen types`)
- **Validation**: Zod schemas for all user inputs (filter params, heart toggle, search query)
- **Auth**: Supabase Auth (already configured with Google OAuth); session verified via `createServerClient` in Server Components and middleware
- **RLS**: All tables protected with Row Level Security policies

### Database Schema

```sql
-- Core tables (new)
CREATE TABLE kudos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  category_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE kudos_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kudos_id UUID REFERENCES kudos(id) ON DELETE CASCADE NOT NULL,
  media_type TEXT CHECK (media_type IN ('image', 'video')) NOT NULL,
  url TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

CREATE TABLE kudos_hashtags (
  kudos_id UUID REFERENCES kudos(id) ON DELETE CASCADE,
  hashtag_id UUID REFERENCES hashtags(id),
  PRIMARY KEY (kudos_id, hashtag_id)
);

CREATE TABLE hashtags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL
);

CREATE TABLE hearts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kudos_id UUID REFERENCES kudos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  is_special_day BOOLEAN DEFAULT false,
  points INT DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(kudos_id, user_id)
);

CREATE TABLE secret_boxes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  is_opened BOOLEAN DEFAULT false,
  gift_description TEXT,
  opened_at TIMESTAMPTZ
);

CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  avatar_url TEXT,
  department_id UUID REFERENCES departments(id),
  title TEXT,
  star_count INT DEFAULT 0,
  kudos_received_count INT DEFAULT 0,
  kudos_sent_count INT DEFAULT 0,
  hearts_received_count INT DEFAULT 0
);

CREATE TABLE app_config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
  -- key='special_days' → value: ["2025-10-30", "2025-11-15"]
);

-- RLS Policies (Constitution Principle IV: RLS on every table)
ALTER TABLE kudos ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE kudos_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE hearts ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- kudos: anyone authenticated can read; only sender can insert
CREATE POLICY "kudos_select" ON kudos FOR SELECT TO authenticated USING (true);
CREATE POLICY "kudos_insert" ON kudos FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- hearts: anyone can read; authenticated can insert/delete own hearts; cannot heart own kudos
CREATE POLICY "hearts_select" ON hearts FOR SELECT TO authenticated USING (true);
CREATE POLICY "hearts_insert" ON hearts FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND auth.uid() != (SELECT sender_id FROM kudos WHERE id = kudos_id));
CREATE POLICY "hearts_delete" ON hearts FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- secret_boxes: users can only read/update their own
CREATE POLICY "secret_boxes_select" ON secret_boxes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "secret_boxes_update" ON secret_boxes FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- user_profiles: anyone authenticated can read; users can update own profile
CREATE POLICY "profiles_select" ON user_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_update" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Reference tables (hashtags, departments, app_config): read-only for authenticated users
CREATE POLICY "hashtags_select" ON hashtags FOR SELECT TO authenticated USING (true);
CREATE POLICY "departments_select" ON departments FOR SELECT TO authenticated USING (true);
CREATE POLICY "app_config_select" ON app_config FOR SELECT TO authenticated USING (true);

-- Media: anyone can read; only kudos sender can insert
CREATE POLICY "media_select" ON kudos_media FOR SELECT TO authenticated USING (true);
CREATE POLICY "media_insert" ON kudos_media FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = (SELECT sender_id FROM kudos WHERE id = kudos_id));

-- kudos_hashtags: anyone can read; only kudos sender can insert
CREATE POLICY "kudos_hashtags_select" ON kudos_hashtags FOR SELECT TO authenticated USING (true);
CREATE POLICY "kudos_hashtags_insert" ON kudos_hashtags FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = (SELECT sender_id FROM kudos WHERE id = kudos_id));

-- Views for common queries
CREATE VIEW kudos_with_hearts AS
  SELECT k.*, COUNT(h.id) AS heart_count
  FROM kudos k
  LEFT JOIN hearts h ON h.kudos_id = k.id
  GROUP BY k.id;
```

> **Mutation Strategy (Constitution Principle II)**: All mutations (heart toggle, create kudos, open secret box) use **Server Actions** in `src/lib/kudos/actions.ts` — NOT Route Handlers. Route Handlers are used ONLY for GET endpoints that the client fetches dynamically (feed pagination, spotlight, search, filters, leaderboard, user preview). This follows: "Prefer Server Actions for form mutations over client-side fetch calls."

### Integration Points

- **Existing Services**: Supabase Auth (Google OAuth, already working), Supabase Storage (for media uploads)
- **Shared Components**: `<Header />` (existing navbar — extend with active state for "Sun* Kudos"), `<Footer />` (existing), `<Logo />` (existing)
- **Existing Patterns**: Supabase client factories at `src/libs/supabase/` (client.ts, server.ts, middleware.ts)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2940-13431-sun-kudos-live-board/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/              # Reference screenshots
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── kudos/                        # Kudos Live Board route
│   │   ├── page.tsx                  # Server Component — initial data fetch
│   │   ├── loading.tsx               # Skeleton loading UI
│   │   └── error.tsx                 # Error boundary
│   ├── api/
│   │   ├── kudos/
│   │   │   └── route.ts             # GET paginated feed (cursor-based, for client infinite scroll)
│   │   ├── kudos/highlights/
│   │   │   └── route.ts             # GET top 5 highlights (filterable)
│   │   ├── spotlight/
│   │   │   └── route.ts             # GET spotlight aggregation data
│   │   ├── hashtags/
│   │   │   └── route.ts             # GET available hashtags for filter dropdown
│   │   ├── departments/
│   │   │   └── route.ts             # GET departments for filter dropdown
│   │   ├── leaderboard/gifts/
│   │   │   └── route.ts             # GET top 10 recent gift recipients
│   │   └── users/
│   │       ├── search/
│   │       │   └── route.ts         # GET search Sunner profiles
│   │       └── [id]/preview/
│   │           └── route.ts         # GET user preview data (hover popup)
│   └── globals.css                   # Extend with kudos design tokens
│
├── components/
│   ├── ui/                           # Shared atomic components (extend)
│   │   ├── Avatar.tsx                # Reusable avatar with border
│   │   ├── Icon.tsx                  # Icon component (requirement from design-style)
│   │   ├── Skeleton.tsx              # Shimmer skeleton loader
│   │   ├── Toast.tsx                 # Toast notification
│   │   ├── EmptyState.tsx            # Empty state message
│   │   ├── SectionHeader.tsx         # Section header (subtitle + title)
│   │   └── NotificationBadge.tsx     # Red dot badge (8px circle, for bell icon)
│   │
│   └── kudos/                        # Feature-specific components
│       ├── HeroBanner.tsx            # Hero banner with search inputs
│       ├── KudosSearchInput.tsx      # Send kudos pill input
│       ├── ProfileSearchBar.tsx      # Profile search with dropdown
│       ├── HighlightCarousel.tsx     # Carousel container + arrows + pagination
│       ├── HighlightKudoCard.tsx     # Highlight card (image area + content)
│       ├── KudoPostCard.tsx          # All Kudos feed card
│       ├── KudosFeed.tsx             # Infinite scroll feed wrapper
│       ├── UserRow.tsx               # Sender → Receiver display
│       ├── UserInfo.tsx              # Name + dept + stars
│       ├── HeartButton.tsx           # Heart toggle with optimistic UI
│       ├── CopyLinkButton.tsx        # Copy URL + toast trigger
│       ├── HashtagBadge.tsx          # Clickable hashtag filter
│       ├── CategoryTagBadge.tsx      # Gold-bordered category tag
│       ├── ImageGallery.tsx          # Thumbnail grid (max 5)
│       ├── VideoOverlay.tsx          # Play button overlay
│       ├── FilterButtons.tsx         # Hashtag + Department filter dropdowns
│       ├── SpotlightBoard.tsx        # Interactive word cloud (d3/canvas)
│       ├── StatsCard.tsx             # Personal stats sidebar
│       ├── SecretBoxButton.tsx       # Mo Secret Box button
│       ├── LeaderboardCard.tsx       # Top 10 gift recipients
│       ├── RankIndicator.tsx         # Colored rank circle
│       └── ViewDetailLink.tsx        # "Xem chi tiet ↗" link
│
├── hooks/
│   ├── useKudosFeed.ts              # Infinite scroll + pagination
│   ├── useHeartToggle.ts            # Optimistic heart toggle
│   ├── useCarousel.ts               # Carousel navigation state
│   ├── useKudosFilters.ts           # Global filter context
│   ├── useProfileSearch.ts          # Debounced profile search
│   ├── useCopyToClipboard.ts        # Clipboard API with fallback
│   └── useToast.ts                  # Toast state management
│
├── lib/
│   ├── kudos/
│   │   ├── queries.ts               # Supabase query functions (server-side, for Server Components)
│   │   ├── actions.ts               # "use server" Server Actions: toggleHeart(), createKudos(), openSecretBox()
│   │   └── validators.ts            # Zod schemas: heartToggleSchema, kudosCreateSchema, searchQuerySchema
│   └── utils/
│       ├── format-timestamp.ts      # "HH:mm - MM/DD/YYYY" formatter
│       ├── compute-stars.ts         # Star badge calculation
│       └── debounce.ts              # Debounce utility
│
├── types/
│   └── kudos.ts                     # Kudos, Heart, User, SecretBox, etc.
│
└── middleware.ts                     # Extend: add /kudos to protected routes

# Database
supabase/
├── migrations/
│   └── XXXXXXXX_create_kudos_tables.sql   # Schema migration
└── seed.sql                                # Dev seed data

# Tests
tests/
├── unit/
│   ├── compute-stars.test.ts         # Star badge logic (1★=10, 2★=20, 3★=50)
│   ├── format-timestamp.test.ts      # "HH:mm - MM/DD/YYYY" formatting
│   ├── validators.test.ts            # Zod schema validation for all inputs
│   ├── use-carousel.test.ts          # Carousel hook: page nav, boundary disable
│   ├── use-heart-toggle.test.ts      # Optimistic toggle, revert on error
│   └── use-copy-to-clipboard.test.ts # Clipboard API + fallback behavior
├── integration/
│   ├── kudos-feed.test.ts            # Paginated feed query, filter application
│   ├── heart-toggle.test.ts          # Toggle action + RLS (own kudos blocked)
│   ├── kudos-actions.test.ts         # Server Actions: create, toggle, open box
│   └── rls-policies.test.ts          # RLS policy verification per table
└── e2e/
    ├── kudos-browse.spec.ts          # US1: Browse feed, infinite scroll, empty state
    ├── kudos-interact.spec.ts        # US3: Heart + Copy Link + Toast
    ├── kudos-carousel.spec.ts        # US4: Highlight carousel nav
    └── kudos-filter.spec.ts          # US5: Hashtag + Department filter

# Assets
public/
├── fonts/
│   ├── SVN-Gotham-Regular.woff2
│   ├── SVN-Gotham-Medium.woff2
│   └── SVN-Gotham-Bold.woff2
└── images/
    └── kudos/
        └── hero-banner-bg.webp       # Hero decorative image
```

---

## Implementation Strategy

> **Cross-cutting concern — Mobile-first responsive (Constitution Principle V)**: Every component in every phase MUST be built mobile-first. Base styles target 320px+, then use `md:` (768px) and `lg:` (1024px) Tailwind prefixes to scale up. Do NOT wait until Phase 8 for responsive — it is baked into each phase. Phase 8 is for final audit and edge-case fixes only.

> **Cross-cutting concern — TDD (Constitution Principle VII)**: Every phase follows Red-Green-Refactor. Write failing tests BEFORE implementation. Unit tests for hooks/utils; integration tests for Server Actions + queries; E2E tests for completed user stories.

### Phase 0: Asset Preparation & Foundation Setup

1. Download hero banner background image and icon assets from Figma using `get_media_files` tool
2. Install SVN-Gotham font files into `public/fonts/` (if not available yet, use Montserrat as dev fallback — track in font config)
3. Extend `globals.css` with kudos design tokens (all colors, spacing, typography, borders from design-style.md)
4. Configure `next/font/local` for SVN-Gotham in root layout (with Montserrat fallback)
5. Create Supabase migration for all kudos-related tables + RLS policies
6. Run migration + seed with dev data (seed: 50 kudos, 10 users across 3 departments, 8 hashtags, 5 secret boxes, varied heart counts)
7. Generate Supabase TypeScript types (`supabase gen types typescript`)
8. Create TypeScript type definitions in `src/types/kudos.ts`
9. Write validator tests FIRST → Create Zod validation schemas in `src/lib/kudos/validators.ts`
10. Build shared UI atoms: `<Avatar />` (new), `<Icon />` (new), `<Skeleton />` (new), `<Toast />` (new), `<EmptyState />` (new), `<SectionHeader />` (new), `<NotificationBadge />` (new)

### Phase 1: Core Feed — US1 (P1) + US3 (P1)

**Goal**: Render the All Kudos feed with infinite scroll, heart toggle, and copy link.

1. Create route `src/app/kudos/page.tsx` (Server Component) — fetches first page of kudos
2. Create `src/lib/kudos/queries.ts` — `getKudosFeed()`, `getKudosHighlights()`, `getUserStats()`, `getLeaderboard()`
3. Build `<KudoPostCard />` with all sub-components: `<UserRow />`, `<UserInfo />`, `<CategoryTagBadge />`, `<ImageGallery />`, `<VideoOverlay />`, `<HashtagBadge />`, `<HeartButton />`, `<CopyLinkButton />`
4. Build `<KudosFeed />` (Client Component) with `useKudosFeed` hook for infinite scroll
5. Build `<HeartButton />` with `useHeartToggle` — optimistic UI + Server Action
6. Build `<CopyLinkButton />` with `useCopyToClipboard` + `<Toast />`
7. Create `loading.tsx` and `error.tsx` for the route

### Phase 2: Page Layout — Hero + Sidebar (UI with mock data)

**Goal**: Complete the page layout with hero banner, stats sidebar (static/mock values), and footer integration.

1. Build `<HeroBanner />` with background image, gradient overlay, title, KUDOS logo — mobile-first (stacked inputs on mobile, side-by-side on desktop)
2. Build `<KudosSearchInput />` — pill input that opens send-kudos dialog (dialog is out of scope; just trigger the open via callback prop)
3. Build `<ProfileSearchBar />` — pill search with magnifying glass icon (Phase 7 wires real search)
4. Build `<StatsCard />` with stat rows and divider (hardcoded mock values — Phase 5 wires real data)
5. Build `<SecretBoxButton />` — links to Secret Box dialog (dialog is out of scope; disabled state when `unopened === 0`)
6. Build `<LeaderboardCard />` with `<RankIndicator />` and avatar list (hardcoded mock data — Phase 7 wires real data)
7. Compose full page layout: Hero → Highlight (placeholder) → Spotlight (placeholder) → Feed + Sidebar → Footer
8. Extend existing `<Header />` at `src/components/layout/Header.tsx` with "Sun* Kudos" active state (gold color + bottom border when on `/kudos` route)

### Phase 3: Highlight Carousel — US4 (P2)

**Goal**: Build the top-5 kudos carousel with center highlighting.

1. Build `<HighlightCarousel />` (Client Component) with `useCarousel` hook
2. Build `<HighlightKudoCard />` — distinct from KudoPostCard (image area at top, 3-line truncation, "Xem chi tiet" link)
3. Implement carousel animations (300ms ease-out transition, opacity/scale states)
4. Build carousel fade gradients (left/right) for smooth edge blending
5. Build pagination indicator (← 2/5 →) with disabled states

### Phase 4: Filters — US5 (P2)

**Goal**: Hashtag and Department dropdown filters affecting both Highlight and Feed.

1. Create `useKudosFilters` context provider — manages `activeHashtagFilter` and `activeDepartmentFilter`
2. Build `<FilterButtons />` with dropdown trigger (pill buttons)
3. Wire filters to URL search params for shareable state (`?hashtag=Dedicated&department=Engineering`)
4. Refetch both Highlight and Feed when filters change
5. Implement hashtag badge click → sets filter (from any card)
6. Create `/api/hashtags` and `/api/departments` Route Handlers

### Phase 5: Stats & Secret Box — US6 (P2)

**Goal**: Personal stats display and Secret Box integration.

1. Create `getUserStats` server query (kudos received/sent, hearts, secret boxes)
2. Wire `<StatsCard />` to real data
3. Wire `<SecretBoxButton />` to Secret Box dialog trigger (disabled state when no boxes)

### Phase 6: Spotlight Board — US7 (P2)

**Goal**: Interactive word cloud visualization.

1. Install d3.js (or @visx/visx) — requires constitution amendment
2. Create `/api/spotlight` Route Handler — returns aggregated recipient data
3. Build `<SpotlightBoard />` (Client Component) with canvas/SVG rendering
4. Implement hover tooltips, click-to-detail, pan/zoom controls
5. Build search input for spotlight with name highlighting

### Phase 7: Profile Search & Preview — US8 (P3) + US9 (P3)

**Goal**: Wire profile search, avatar hover preview, leaderboard to real data.

1. Wire `<ProfileSearchBar />` (built in Phase 2) with `useProfileSearch` hook (debounced 300ms, dropdown results)
2. Create `/api/users/search` Route Handler — Zod-validated query param, Supabase `ilike` search on name
3. Implement avatar/name hover → profile preview popup trigger (popup itself is out of scope — just the hover detection + positioning anchor)
4. Wire `<LeaderboardCard />` (built in Phase 2) to real data from `getLeaderboard()` query
5. Create `/api/users/[id]/preview` Route Handler — returns name, avatar, department, star count

### Phase 8: Responsive Audit + Accessibility + Performance Polish

**Goal**: Final audit of mobile/tablet responsive (should already work from mobile-first approach), accessibility hardening, and performance optimization.

1. **Responsive audit** at 375px, 768px, 1440px per constitution — fix any breakpoint edge cases
2. Mobile edge cases: hamburger nav integration, single-card carousel with swipe gesture (touch events), sidebar below feed
3. Tablet edge cases: narrower sidebar (240px), 3-card carousel sizing
4. **Accessibility**: keyboard navigation for carousel (← → arrows), filter dropdowns (Escape to close), heart button (Enter/Space), focus ring on all interactive elements
5. **ARIA**: `role="feed"` on infinite scroll, `aria-live="polite"` on heart count, `aria-label` on icon-only buttons, `aria-current="page"` on active nav link
6. **Performance**: lazy load below-fold sections (dynamic import for SpotlightBoard), virtualize feed list if 50+ items rendered, audit bundle size (ensure d3.js tree-shaken)
7. **Final test pass**: run all E2E tests at 375px and 1440px viewports

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| SVN-Gotham font not available | Medium | High | Request from design team early; have Montserrat fallback ready |
| d3.js bundle size on edge runtime | Medium | Medium | Use tree-shaken imports; consider @visx/visx (React wrappers, smaller) |
| Spotlight Board performance with 500+ nodes | Medium | High | Implement level-of-detail: show top names, aggregate rest; canvas rendering |
| Infinite scroll memory leak | Low | Medium | Implement virtualization with intersection observer; limit DOM nodes |
| Supabase RLS policy complexity | Medium | Medium | Write thorough integration tests for each policy; test with multiple user roles |
| Heart toggle race conditions | Low | High | Unique constraint on (kudos_id, user_id); optimistic UI with server reconciliation |
| Cloudflare Workers edge runtime limitations | Low | Medium | Avoid Node.js-only APIs; test all server functions on edge early |

### Estimated Complexity

- **Frontend**: **High** — 25+ components, carousel, word cloud, infinite scroll, optimistic UI
- **Backend**: **Medium** — Standard CRUD with RLS, one complex aggregation (spotlight)
- **Testing**: **Medium** — 4 E2E flows, 6 unit tests for business logic/hooks, 4 integration tests for API/RLS

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Feed ↔ Filters, Heart toggle ↔ Stats update, Carousel ↔ Filter context
- [x] **External dependencies**: Supabase Auth + DB, Clipboard API
- [x] **Data layer**: Kudos CRUD, Heart toggle, RLS policies
- [x] **User workflows**: Browse → Heart → Copy Link, Filter → View highlights, Open Secret Box

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Heart toggle optimistic update, infinite scroll trigger, filter application |
| Service ↔ Service | Yes | Auth middleware → Supabase query → RLS check |
| App ↔ External API | No | No third-party APIs |
| App ↔ Data Layer | Yes | Kudos feed pagination, heart toggle unique constraint, stats calculation |
| Cross-platform | Yes | Mobile responsive layout, touch gestures on carousel |

### Test Environment

- **Environment type**: Local Supabase (docker) + Vitest for unit/integration; Playwright against dev server for E2E
- **Test data strategy**: Supabase seed.sql with 50 kudos, 10 users, varied hashtags/departments
- **Isolation approach**: Transaction rollback per test via Supabase test helpers

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase DB | Real (local) | Constitution requires real DB for integration tests |
| Supabase Auth | Mock (test user session) | Faster than real OAuth flow; test with pre-created users |
| Clipboard API | Mock (navigator.clipboard) | Browser API not available in test runner |
| d3.js / Canvas | Skip in unit tests | Visual output; cover with E2E screenshot comparison |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Load kudos feed with 10+ cards, verify sender/receiver/content render
   - [x] Scroll to bottom, verify next page loads
   - [x] Click heart, verify count increments and persists after reload
   - [x] Click Copy Link, verify clipboard content matches kudos URL
   - [x] Navigate carousel, verify pagination updates

2. **Error Handling**
   - [x] Heart toggle on network failure → revert optimistic update
   - [x] Feed load failure → show error boundary with retry
   - [x] Clipboard API unavailable → show fallback modal

3. **Edge Cases**
   - [x] Empty feed (no kudos) → show empty state
   - [x] Heart own kudos → button disabled
   - [x] Filter with no results → show empty state
   - [x] Carousel with < 5 kudos → arrows disabled appropriately

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core user flows (browse, heart, copy) | 90%+ | High |
| Business logic (stars, timestamps, points) | 95%+ | High |
| API integration (Supabase queries) | 85%+ | High |
| UI components (visual) | 70%+ | Medium |
| Spotlight Board | 60%+ | Low (visual-heavy) |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved
- [x] `design-style.md` complete with all tokens
- [ ] SVN-Gotham font files obtained from design team
- [ ] Hero banner background image exported from Figma
- [ ] Constitution amendment: add d3.js/@visx to Approved Additions
- [ ] Supabase migration reviewed and approved

### External Dependencies

- **Supabase**: Local dev instance (already configured in `supabase/config.toml`)
- **Google OAuth**: Already configured for auth
- **Cloudflare Workers**: Already configured in `wrangler.jsonc`
- **SVN-Gotham font**: Must be obtained from Sun* design team (proprietary)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown from this plan
2. **Review** tasks.md for parallelization opportunities
3. **Obtain** SVN-Gotham font files and hero banner image
4. **Amend** constitution to add d3.js/@visx
5. **Begin** Phase 0 implementation

---

## Notes

- The Supabase client factories already exist at `src/libs/supabase/` — reuse them, do not create duplicates. Note: the project uses `libs` (plural), not `lib` for the supabase folder.
- The existing `<Header />` component at `src/components/layout/Header.tsx` already has navigation links — extend it with an active state for "Sun* Kudos" rather than building a separate navbar.
- The existing `<Footer />` at `src/components/layout/Footer.tsx` can be reused as-is or extended.
- The page route should be `/kudos` (matching the navbar link "Sun* Kudos").
- Server Actions (`"use server"`) are preferred over Route Handlers for mutations per constitution (Principle II: "Prefer Server Actions for form mutations over client-side fetch calls").
- The `special_day` check should be a server-side concern — the API/Server Action returns the point value; the client just displays it.
- Design tokens from `design-style.md` should be added to `globals.css` as CSS custom properties, then referenced via Tailwind's `var()` support in v4.
