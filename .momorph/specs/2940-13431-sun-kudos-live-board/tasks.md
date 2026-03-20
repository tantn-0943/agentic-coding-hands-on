# Tasks: Sun* Kudos - Live Board

**Frame**: `2940-13431-sun-kudos-live-board`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3...)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Asset preparation, database schema, types, and project scaffolding

- [x] T001 Download hero banner background image and icons from Figma using `get_media_files` tool | public/images/kudos/
- [x] T002 [P] Install SVN-Gotham font files (Regular, Medium, Bold) into project; configure `next/font/local` with Montserrat fallback | public/fonts/, src/app/layout.tsx
- [x] T002-fix [P] Fix: Comment out SVN-Gotham localFont declaration (font files not yet available); use CSS fallback `var(--font-svn-gotham, var(--font-montserrat))` in globals.css | src/app/layout.tsx, src/app/globals.css
- [x] T003 [P] Extend globals.css with all kudos design tokens (18 color tokens, 14 typography tokens, 15 spacing tokens, 7 border/radius tokens, 5 gradients) from design-style.md | src/app/globals.css
- [x] T004 [P] Create Supabase migration with all 9 tables (kudos, kudos_media, kudos_hashtags, hashtags, departments, hearts, secret_boxes, user_profiles, app_config) + RLS policies + kudos_with_hearts view per plan.md schema | supabase/migrations/20260316000000_create_kudos_tables.sql
- [x] T005 [P] Create seed data: 50 kudos, 10 users across 3 departments, 8 hashtags, 5 secret boxes, varied heart counts | supabase/seed.sql
- [x] T006 Run Supabase migration + seed, generate TypeScript types with `supabase gen types typescript` — **BLOCKED**: requires running Supabase instance. Migration SQL + seed files exist. Manual types in `src/types/kudos.ts` are used instead. | src/types/database.ts
- [x] T007 [P] Create TypeScript type definitions for Kudos, KudoWithDetails, UserProfile, Heart, SecretBox, Hashtag, Department, CategoryTag, SpotlightNode, LeaderboardEntry | src/types/kudos.ts
- [x] T008 [P] Write unit tests for Zod validators FIRST (TDD) — heartToggleSchema, kudosCreateSchema, searchQuerySchema, filterParamsSchema | tests/unit/validators.test.ts
- [x] T009 Implement Zod validation schemas to pass validator tests | src/lib/kudos/validators.ts
- [x] T010 [P] Write unit tests for compute-stars utility FIRST (TDD) — 0→0★, 10→1★, 20→2★, 50→3★, edge cases | tests/unit/compute-stars.test.ts
- [x] T011 [P] Write unit tests for format-timestamp utility FIRST (TDD) — "HH:mm - MM/DD/YYYY" format, timezone handling | tests/unit/format-timestamp.test.ts
- [x] T012 Implement compute-stars utility to pass tests | src/lib/utils/compute-stars.ts
- [x] T013 Implement format-timestamp utility to pass tests | src/lib/utils/format-timestamp.ts
- [x] T014 [P] Create debounce utility (300ms for search) | src/lib/utils/debounce.ts
- [x] T015 Extend middleware.ts to add `/kudos` to protected routes (require auth) | src/middleware.ts

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Shared UI atoms and server-side query layer required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T016 [P] Create `<Avatar />` component — 40x40, circle, white border (1.869px), object-fit cover, cursor pointer | src/components/ui/Avatar.tsx
- [x] T017 [P] Create `<Icon />` component — SVG icon wrapper supporting all 15 icons from design-style.md (pen, search, bell, chevron-down, arrow-left, arrow-right, arrow-sent, heart-outline, heart-filled, copy, external, play, pan-zoom, gift, star) | src/components/ui/Icon.tsx
- [x] T018 [P] Create `<Skeleton />` component — shimmer animation with configurable radius (8px cards, 4px text, 9999px avatar), gradient: #2E3940→#3A4850→#2E3940 | src/components/ui/Skeleton.tsx
- [x] T019 [P] Create `<Toast />` component — fixed bottom-center, auto-dismiss 3s, enter/exit animation (300ms, opacity + translateY), card-bg + gold-muted border | src/components/ui/Toast.tsx
- [x] T020 [P] Create `<EmptyState />` component — centered text, 16px, #999 muted, configurable message | src/components/ui/EmptyState.tsx
- [x] T021 [P] Create `<SectionHeader />` component — subtitle (14px gold) + title (36px white with gold glow text-shadow) + border-top divider + 40px padding-top | src/components/ui/SectionHeader.tsx
- [x] T022 [P] Create `<NotificationBadge />` component — 8px red circle (#D4271D), absolute positioned top-right | src/components/ui/NotificationBadge.tsx
- [x] T023 Create `useToast` hook — show/hide state, auto-dismiss timer, message content | src/hooks/useToast.ts
- [x] T024 Create Supabase server-side query functions: `getKudosFeed(cursor, filters)`, `getKudosHighlights(filters)`, `getUserStats(userId)`, `getLeaderboard()` with proper joins (sender, receiver, media, hashtags, hearts) | src/lib/kudos/queries.ts
- [x] T025 Create Server Actions: `toggleHeart(kudosId)` with special_day check from app_config, `openSecretBox(boxId)` — both with Zod validation + auth check | src/lib/kudos/actions.ts
- [x] T026 Write integration tests for kudos feed query (pagination, filters) and heart toggle (RLS: can't heart own, unique constraint) — test stubs written, skip until Supabase running | tests/integration/kudos-feed.test.ts, tests/integration/heart-toggle.test.ts
- [x] T027 Write integration tests for Server Actions (toggleHeart, openSecretBox) and RLS policies per table — test stubs written, skip until Supabase running | tests/integration/kudos-actions.test.ts, tests/integration/rls-policies.test.ts

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 + 3 — Browse All Kudos + Heart/Copy Link (Priority: P1) MVP

**Goal**: Render the All Kudos feed with infinite scroll, heart toggle, and copy link functionality

**Independent Test**: Load `/kudos`, verify kudos cards render with sender/receiver info, scroll for more, click heart to toggle, click Copy Link for clipboard + toast

### Shared Sub-Components (US1+US3)

- [x] T028 [P] [US1] Create `<UserInfo />` — name (14px, 500, gold), department (14px, 400, muted), star icons (gold, computed from kudos_received_count) | src/components/kudos/UserInfo.tsx
- [x] T029 [P] [US1] Create `<UserRow />` — sender Avatar+UserInfo → arrow icon → receiver Avatar+UserInfo, flex row | src/components/kudos/UserRow.tsx
- [x] T030 [P] [US1] Create `<CategoryTagBadge />` — gold border (0.5px #FFEA9E), transparent bg, 14px bold uppercase, between timestamp and content | src/components/kudos/CategoryTagBadge.tsx
- [x] T031 [P] [US1] Create `<ImageGallery />` — flex row, gap 8px, max 5 thumbnails (80x80, radius 4px, object-fit cover), hover opacity 0.8 | src/components/kudos/ImageGallery.tsx
- [x] T032 [P] [US1] Create `<VideoOverlay />` — absolute positioned play icon (40px circle, white on black/50%), centered on thumbnail | src/components/kudos/VideoOverlay.tsx
- [x] T033 [P] [US1] Create `<HashtagBadge />` — gold/10 bg, 4px radius, 14px 500 gold text, hover: gold/40 bg, clickable (triggers filter) | src/components/kudos/HashtagBadge.tsx

### Heart + Copy Link (US3)

- [x] T034 [P] [US3] Write unit tests for useHeartToggle FIRST (TDD) — optimistic increment/decrement, revert on error, disabled for own kudos | tests/unit/use-heart-toggle.test.ts
- [x] T035 [US3] Create `useHeartToggle` hook — optimistic state toggle, calls toggleHeart Server Action, reverts on error | src/hooks/useHeartToggle.ts
- [x] T036 [P] [US3] Write unit tests for useCopyToClipboard FIRST (TDD) — clipboard success, fallback when API unavailable | tests/unit/use-copy-to-clipboard.test.ts
- [x] T037 [US3] Create `useCopyToClipboard` hook — navigator.clipboard.writeText with fallback, returns { copy, copied } | src/hooks/useCopyToClipboard.ts
- [x] T038 [P] [US3] Create `<HeartButton />` — heart icon (grey #999 / red #F17676), count text (16px 500), gap 6px, disabled state (opacity 0.5) for own kudos, click animation (200ms scale) | src/components/kudos/HeartButton.tsx
- [x] T039 [P] [US3] Create `<CopyLinkButton />` — "Copy Link" text (14px 500 #999), copy icon, hover: gold, triggers toast on click | src/components/kudos/CopyLinkButton.tsx

### Feed Card + Infinite Scroll (US1)

- [x] T040 [US1] Create `<KudoPostCard />` — assembles UserRow + Timestamp + CategoryTagBadge + Content (max 5 lines) + ImageGallery + VideoOverlay + Hashtags + ActionBar (HeartButton + CopyLinkButton), card-bg + gold-muted border + 8px radius + padding 24px 16px 24px 24px | src/components/kudos/KudoPostCard.tsx
- [x] T041 [US1] Create `useKudosFeed` hook — cursor-based pagination, fetches from /api/kudos Route Handler, IntersectionObserver for scroll trigger, loading/error states | src/hooks/useKudosFeed.ts
- [x] T042 [US1] Create `/api/kudos` GET Route Handler — cursor pagination, hashtag/department filter params, Zod validation, returns KudoWithDetails[] + nextCursor | src/app/api/kudos/route.ts
- [x] T043 [US1] Create `<KudosFeed />` Client Component — renders KudoPostCard list, infinite scroll via useKudosFeed, loading spinner at bottom, EmptyState when no results | src/components/kudos/KudosFeed.tsx
- [x] T044 [US1] Create `src/app/kudos/page.tsx` Server Component — fetches first page via getKudosFeed(), renders page layout with KudosFeed + placeholder sections | src/app/kudos/page.tsx
- [x] T045 [P] [US1] Create `src/app/kudos/loading.tsx` — skeleton placeholders for feed cards using Skeleton component | src/app/kudos/loading.tsx
- [x] T046 [P] [US1] Create `src/app/kudos/error.tsx` — error boundary with retry button, card-bg styling | src/app/kudos/error.tsx

### E2E Tests (US1+US3)

- [x] T047 [US1] Write E2E test: browse feed, verify card content, infinite scroll loads more | tests/e2e/kudos-browse.spec.ts
- [x] T048 [US3] Write E2E test: heart toggle (increment/decrement), copy link (clipboard + toast) | tests/e2e/kudos-interact.spec.ts

**Checkpoint**: User Story 1 + 3 complete — browse kudos feed with interactions works end-to-end

---

## Phase 4: User Story 2 — Send a Kudos + Page Layout (Priority: P1)

**Goal**: Complete page layout with hero banner, stats sidebar (mock data), and send-kudos trigger

**Independent Test**: Click pill input in hero → triggers send-kudos callback; full page layout renders with all sections

### Hero Banner (US2)

- [x] T049 [P] [US2] Create `<KudosSearchInput />` — pill shape (100px radius), gold/10 bg, gold border (0.5px), pen icon left, placeholder text (16px, #999), click triggers onOpenDialog callback, hover: gold/40 bg | src/components/kudos/KudosSearchInput.tsx
- [x] T050 [P] [US2] Create `<ProfileSearchBar />` — pill shape, magnifying glass icon, placeholder "Tim kiem profile Sunner" (14px, #999), width ~300px (Phase 7 wires real search) | src/components/kudos/ProfileSearchBar.tsx
- [x] T051 [US2] Create `<HeroBanner />` — full-width 512px height, gradient overlay + bg image, flex column gap 24px, title (20px gold "He thong ghi nhan va cam on"), KUDOS logo (57px display white with gold glow), KudosSearchInput + ProfileSearchBar row, mobile-first: stacked on mobile, side-by-side lg: | src/components/kudos/HeroBanner.tsx

### Sidebar (mock data, wired later in Phase 6+8)

- [x] T052 [P] [US2] Create `<RankIndicator />` — 8px circle, color per position (1st=#D4271D, 2nd=#F17676, 3rd-4th=#FFEA9E, 5th+=#998C5F) | src/components/kudos/RankIndicator.tsx
- [x] T053 [P] [US2] Create `<SecretBoxButton />` — full-width pill, gold bg (#FFEA9E), dark text (#00101A), 16px 700, hover: #FFF8E1, disabled: opacity 0.5, gift icon | src/components/kudos/SecretBoxButton.tsx
- [x] T054 [P] [US2] Create `<StatsCard />` — card-bg + gold-muted border + 8px radius, stat rows (label 16px white + value 22px 700 gold), divider line, SecretBoxButton at bottom; uses hardcoded mock values | src/components/kudos/StatsCard.tsx
- [x] T055 [P] [US2] Create `<ViewDetailLink />` — "Xem chi tiet" text (14px 500 #999) + external icon, hover: gold, flex row gap 4px | src/components/kudos/ViewDetailLink.tsx
- [x] T056 [P] [US2] Create `<LeaderboardCard />` — card-bg + gold-muted border, title "10 SUNNER NHAN QUA MOI NHAT" (gold, uppercase), list of RankIndicator + Avatar + name/description; hardcoded mock data | src/components/kudos/LeaderboardCard.tsx

### Page Composition (US2)

- [x] T057 [US2] Compose full page layout in page.tsx: Hero → Highlight (placeholder div) → Spotlight (placeholder div) → Feed + Sidebar (flex row, sidebar sticky w-320px) → Footer | src/app/kudos/page.tsx
- [x] T058 [US2] Extend `<Header />` with "Sun* Kudos" active state — fixed nav link href from `/sun-kudos` to `/kudos` | src/components/layout/Header.tsx

**Checkpoint**: Full page layout visible with hero, feed, sidebar (mock), footer

---

## Phase 5: User Story 4 — Highlight Kudos Carousel (Priority: P2)

**Goal**: Top-5 most-hearted kudos displayed in center-highlighted carousel

**Independent Test**: Carousel renders 5 cards, center card full opacity, side cards dimmed; arrow navigation works; pagination indicator updates

- [x] T059 [P] [US4] Write unit tests for useCarousel FIRST (TDD) — page navigation, boundary disable (page 1 = no left, page 5 = no right), < 5 cards handling | tests/unit/use-carousel.test.ts
- [x] T060 [US4] Create `useCarousel` hook — currentPage state, next/prev handlers, disabled states, total pages | src/hooks/useCarousel.ts
- [x] T061 [P] [US4] Create `<HighlightKudoCard />` — distinct from KudoPostCard: image area at top (aspect ~16/9, gradient overlay), then UserRow + Timestamp + CategoryTagBadge + Content (max 3 lines) + Hashtags + ActionBar (Heart + CopyLink + ViewDetailLink), active: opacity 1 scale 1, inactive: opacity 0.5 scale 0.9 | src/components/kudos/HighlightKudoCard.tsx
- [x] T062 [US4] Create `/api/kudos/highlights` GET Route Handler — returns top 5 by heart_count, filterable by hashtag/department | src/app/api/kudos/highlights/route.ts
- [x] T063 [US4] Create `<HighlightCarousel />` Client Component — carousel container with left/right arrow buttons (40px circle, gold/10 bg, disabled: opacity 0.3), center-highlighted layout (3 visible cards), fade gradients (left/right linear-gradient), pagination indicator ("2/5" format), 300ms ease-out slide animation | src/components/kudos/HighlightCarousel.tsx
- [x] T064 [US4] Wire HighlightCarousel into page.tsx replacing placeholder div, fetch highlights via getKudosHighlights() in Server Component | src/app/kudos/page.tsx
- [x] T065 [US4] Write E2E test: carousel navigation, pagination indicator, disabled arrows at boundaries | tests/e2e/kudos-carousel.spec.ts

**Checkpoint**: Highlight carousel works with top 5 kudos, navigation smooth

---

## Phase 6: User Story 5 — Filter by Hashtag/Department (Priority: P2)

**Goal**: Dropdown filters that affect both Highlight Carousel and All Kudos feed simultaneously

**Independent Test**: Select hashtag filter → both sections update; select department → both update; clear filter → all kudos shown; combined filters use AND logic

- [x] T066 [US5] Create `useKudosFilters` context provider — manages activeHashtagFilter + activeDepartmentFilter as URL search params (?hashtag=X&department=Y), provides filter state + setFilter + clearFilters | src/hooks/useKudosFilters.ts
- [x] T067 [P] [US5] Create `/api/hashtags` GET Route Handler — returns all hashtags ordered by name | src/app/api/hashtags/route.ts
- [x] T068 [P] [US5] Create `/api/departments` GET Route Handler — returns all departments ordered by name | src/app/api/departments/route.ts
- [x] T069 [US5] Create `<FilterButtons />` Client Component — two pill buttons ("Hashtag ▼", "Phong ban ▼"), dropdown with list of options, active state (gold/40 bg + gold border), positioned right-aligned in section header | src/components/kudos/FilterButtons.tsx
- [x] T070 [US5] Wire useKudosFilters context into page.tsx, wrap Highlight + Feed sections; refetch both when filters change | src/app/kudos/page.tsx
- [x] T071 [US5] Wire HashtagBadge click on any card to set hashtag filter via useKudosFilters | src/components/kudos/HashtagBadge.tsx
- [x] T072 [US5] Write E2E test: filter by hashtag, filter by department, combined filter, clear filter, hashtag badge click triggers filter | tests/e2e/kudos-filter.spec.ts

**Checkpoint**: Filters work across both Highlight and Feed sections

---

## Phase 7: User Story 6 — Personal Stats + Secret Box (Priority: P2)

**Goal**: Wire sidebar stats to real user data and Secret Box trigger

**Independent Test**: Sidebar shows correct stats for logged-in user; "Mo Secret Box" button opens dialog (or shows disabled if no boxes)

- [x] T073 [US6] Wire `<StatsCard />` to real data — replace mock values with getUserStats() server query (kudos received, sent, hearts received, secret boxes opened/unopened) | src/components/kudos/StatsCard.tsx, src/app/kudos/page.tsx
- [x] T074 [US6] Wire `<SecretBoxButton />` to openSecretBox Server Action — disabled when unopened count = 0, click triggers dialog open (dialog out of scope, just the trigger callback) | src/components/kudos/SecretBoxButton.tsx

**Checkpoint**: Sidebar shows live user stats, Secret Box button functional

---

## Phase 8: User Story 7 — Spotlight Board (Priority: P2)

**Goal**: Interactive word cloud visualization with pan/zoom and search

**Independent Test**: Spotlight renders scattered names, total kudos count shown, hover shows tooltip, click navigates to detail, search highlights matches

- [x] T075 [US7] Install d3.js or @visx/visx — **DEFERRED**: requires constitution amendment approval. CSS-only SpotlightBoard (T077) is the working fallback. d3.js upgrade is a future enhancement. | package.json
- [x] T076 [US7] Create `/api/spotlight` GET Route Handler — returns aggregated recipient names with kudos count and positions for visualization | src/app/api/spotlight/route.ts
- [x] T077 [US7] Create `<SpotlightBoard />` Client Component — CSS-only word cloud (upgradeable to d3.js): "N KUDOS" title (32px 700 gold), pan/zoom button, search input (pill, gold-muted border), hover highlight, name positioning | src/components/kudos/SpotlightBoard.tsx
- [x] T078 [US7] Wire SpotlightBoard into KudosPageContent replacing placeholder div | src/components/kudos/KudosPageContent.tsx

**Checkpoint**: Spotlight Board interactive with search, hover, click-to-detail

---

## Phase 9: User Story 8 + 9 — Profile Search + Leaderboard (Priority: P3)

**Goal**: Wire profile search with debounced dropdown, avatar hover preview trigger, leaderboard real data

**Independent Test**: Type in "Tim kiem profile Sunner" → dropdown with results; click avatar → navigate to profile; leaderboard shows real gift recipients

- [x] T079 [US8] Create `useProfileSearch` hook — debounced 300ms fetch from /api/users/search, manages query + results + loading state | src/hooks/useProfileSearch.ts
- [x] T080 [US8] Create `/api/users/search` GET Route Handler — Zod-validated `q` query param, Supabase `ilike` search on user_profiles.name, returns UserProfile[] | src/app/api/users/search/route.ts
- [x] T081 [US8] Wire `<ProfileSearchBar />` (built in Phase 4) with useProfileSearch — dropdown results list (avatar + name + dept), click navigates to profile, empty state "Khong tim thay Sunner" | src/components/kudos/ProfileSearchBar.tsx
- [x] T082 [P] [US8] Create `/api/users/[id]/preview` GET Route Handler — returns name, avatar, department, star count for hover popup | src/app/api/users/[id]/preview/route.ts
- [x] T083 [US8] Implement avatar/name hover detection + positioning anchor on all Avatar/UserInfo instances (popup rendering out of scope — just triggers onHover callback with userId + position) | src/components/kudos/UserRow.tsx
- [x] T084 [US9] Create `/api/leaderboard/gifts` GET Route Handler — returns top 10 recent gift recipients with avatar, name, gift description | src/app/api/leaderboard/gifts/route.ts
- [x] T085 [US9] Wire `<LeaderboardCard />` (built in Phase 4) to real data from /api/leaderboard/gifts — replace mock data, handle empty state "Chua co du lieu" | src/components/kudos/LeaderboardCard.tsx

**Checkpoint**: Profile search, hover anchoring, and leaderboard fully functional

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Responsive audit, accessibility hardening, performance optimization

- [x] T086 [P] Responsive audit at 375px — verify all components render correctly: stacked hero inputs, single-card carousel with swipe, sidebar below feed, 16px padding. E2E tests created in tests/e2e/kudos-responsive.spec.ts | all components
- [x] T087 [P] Responsive audit at 768px — verify tablet layout: 40px padding, narrower sidebar (240px), 3-card carousel. E2E tests created in tests/e2e/kudos-responsive.spec.ts | all components
- [x] T088 [P] Responsive audit at 1440px — verify full desktop layout matches design-style.md. E2E tests created in tests/e2e/kudos-responsive.spec.ts | all components
- [x] T089 [P] Accessibility: add keyboard navigation — carousel (← → arrows), filter dropdowns (Escape to close, Enter to select), heart button (Enter/Space), focus ring on all interactive elements | src/components/kudos/
- [x] T090 [P] Accessibility: add ARIA attributes — `role="feed"` on infinite scroll container, `aria-live="polite"` on heart count, `aria-label` on all icon-only buttons, `aria-current="page"` on active nav link | src/components/kudos/, src/components/layout/Header.tsx
- [x] T091 Performance: lazy load SpotlightBoard with React.lazy() + Suspense fallback in KudosPageContent | src/components/kudos/KudosPageContent.tsx
- [x] T092 Performance: implement feed virtualization if 50+ cards rendered — IntersectionObserver-based DOM recycling, OVERSCAN=5, ESTIMATED_CARD_HEIGHT=320px | src/components/kudos/KudosFeed.tsx
- [x] T093 Run all E2E tests at 375px and 1440px viewports — E2E responsive spec created in tests/e2e/kudos-responsive.spec.ts with 3 viewport breakpoints (375, 768, 1440). Run with `npx playwright test tests/e2e/kudos-responsive.spec.ts` | tests/e2e/
- [x] T094 Final code cleanup: remove mock data from StatsCard/LeaderboardCard, verify no console.log or TODO comments, TypeScript clean | all files

---

## Phase 11: Sample Data — Full flow seed

**Purpose**: Create comprehensive seed data covering all tables and flows for local development

- [x] T095 Create complete `supabase/seed.sql` with: 10 auth.users + auth.identities, 10 user_profiles, 3 departments, 8 hashtags, app_config, 20 kudos (including 2 anonymous), 29 kudos_hashtag links, 23 hearts, 9 secret boxes (5 opened, 4 unopened). Run via `supabase db reset` | supabase/seed.sql

**Checkpoint**: `supabase db reset` creates a fully populated database for testing all flows.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ──→ Phase 2 (Foundation) ──→ Phase 3 (US1+US3 MVP) ──→ Phase 4 (US2 Layout)
                                                      │
                                                      ├──→ Phase 5 (US4 Carousel)
                                                      ├──→ Phase 6 (US5 Filters) ──→ Phase 7 (US6 Stats)
                                                      ├──→ Phase 8 (US7 Spotlight)
                                                      └──→ Phase 9 (US8+US9 Search/Leaderboard)
                                                                    │
                                                                    └──→ Phase 10 (Polish)
```

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundation (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1+US3 (Phase 3)**: Depends on Foundation — **MVP target**
- **US2 Layout (Phase 4)**: Depends on Phase 3 (needs feed to compose layout)
- **US4-US9 (Phases 5-9)**: All depend on Phase 3+4 (need full layout); can proceed in parallel
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### Within Each User Story

1. Tests (TDD) MUST be written and FAIL before implementation
2. Sub-components before composite components
3. Hooks before components that use them
4. Route Handlers before client components that fetch from them
5. Server queries/actions before components that invoke them

### Parallel Opportunities

**Phase 1**: T001-T005 all [P] — run in parallel; T007-T008, T010-T011, T014 all [P]
**Phase 2**: T016-T022 all [P] — 7 UI atoms can be built simultaneously
**Phase 3**: T028-T033 (sub-components) all [P]; T034+T036 (test hooks) [P]; T038+T039 (action buttons) [P]; T045+T046 [P]
**Phase 4**: T049+T050 [P]; T052-T056 all [P]
**Phase 5**: T059+T061 [P]
**Phase 6**: T067+T068 [P]
**Phases 5-9**: Can run in parallel by different team members once Phase 4 complete

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2 (Setup + Foundation)
2. Complete Phase 3 (US1+US3: Browse + Heart + Copy Link)
3. **STOP and VALIDATE**: Test independently at `/kudos`
4. Complete Phase 4 (US2: Full page layout)
5. Deploy MVP

### Incremental Delivery

1. Setup + Foundation → Deploy skeleton
2. US1+US3 (Feed + Interactions) → Test → Deploy
3. US2 (Layout + Hero) → Test → Deploy
4. US4 (Carousel) → Test → Deploy
5. US5 (Filters) → US6 (Stats) → Test → Deploy
6. US7 (Spotlight) → Test → Deploy
7. US8+US9 (Search + Leaderboard) → Test → Deploy
8. Polish → Final deploy

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 94 |
| **Phase 1 (Setup)** | 15 tasks |
| **Phase 2 (Foundation)** | 12 tasks |
| **Phase 3 (US1+US3 MVP)** | 21 tasks |
| **Phase 4 (US2 Layout)** | 10 tasks |
| **Phase 5 (US4 Carousel)** | 7 tasks |
| **Phase 6 (US5 Filters)** | 7 tasks |
| **Phase 7 (US6 Stats)** | 2 tasks |
| **Phase 8 (US7 Spotlight)** | 4 tasks |
| **Phase 9 (US8+US9 Search)** | 7 tasks |
| **Phase 10 (Polish)** | 9 tasks |
| **Parallel tasks [P]** | 42 (45%) |
| **MVP scope** | Phase 1-4 (58 tasks) |

---

## Notes

- Commit after each task or logical group
- Run tests before moving to next phase
- All components built mobile-first (base styles 320px+, `md:` 768px, `lg:` 1024px)
- TDD: write failing tests → implement → refactor for every hook and utility
- Reuse existing: `src/libs/supabase/` (client/server), `<Header />`, `<Footer />`, `<Logo />`
- Server Actions for mutations (heart, create kudos, open box) — NOT Route Handlers
- Route Handlers for GET endpoints only (feed pagination, spotlight, search, filters)
- Mark tasks complete as you go: `[x]`
