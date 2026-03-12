# Tasks: Homepage SAA

**Frame**: `2167_9026-Homepage-SAA`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US5)
- **|**: File path affected by this task

---

## Phase 1: Setup (Assets & CSS Variables)

**Purpose**: Prepare static assets and global CSS tokens required by all sections

- [x] T001 Verify shared images exist: `public/images/login-bg.jpg` and `public/images/root-further-logo.png` are present | public/images/
- [x] T002 Download 6 award card images from Figma to `public/images/awards/`: `top-talent.jpg`, `top-project.jpg`, `top-project-leader.jpg`, `best-manager.jpg`, `signature-creator.jpg`, `mvp.jpg` | public/images/awards/
- [x] T003 [P] Add `--gradient-overlay-homepage` CSS variable to globals.css: `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` — distinct from existing `--gradient-overlay-countdown` (18deg) | src/app/globals.css
- [x] T004 [P] Create `src/lib/` directory (does not yet exist in project) | src/lib/

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Type definitions, static award data, and notifications API — required by ALL user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T005 [P] Create `Award` type definition: `{ id: string; slug: string; name: string; description: string; imageUrl: string; linkSlug: string }` | src/types/awards.ts
- [x] T006 [P] Create `NotificationsResponse` type: `{ unreadCount: number }` | src/types/notifications.ts
- [x] T007 Create `src/lib/awards.ts` with 6 static award entries (Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 Creator, MVP) — each with `id`, `slug`, `name`, `description`, `imageUrl` pointing to `public/images/awards/`, and `linkSlug` matching anchor IDs on `/award-information` | src/lib/awards.ts
- [x] T008 Create `GET /api/notifications` route handler: validate Supabase session via `@supabase/ssr`, query `notifications` table with RLS, return `{ unreadCount: number }`; return `{ unreadCount: 0 }` on any error (no error toast on homepage) | src/app/api/notifications/route.ts

**Checkpoint**: Foundation ready — all user story phases can now proceed

---

## Phase 3: User Story 1 — Homepage Visible (Priority: P1) 🎯 MVP

**Goal**: Trang chủ load được và hiển thị đầy đủ: header với logo + 3 nav links, hero section với ROOT FURTHER image, countdown 3 units, event info, 2 CTA buttons, 6 award cards, footer

**Independent Test**: `yarn dev` → navigate `/` → kiểm tra: logo hiển thị, ROOT FURTHER image (`/images/root-further-logo.png`) visible trong hero section, 3 units DAYS/HOURS/MINUTES của countdown hiển thị, ít nhất 1 award card hiển thị, nút "ABOUT AWARDS" visible và click được (`href="/award-information"`)

### Layout Components (US1)

- [x] T009 [P] [US1] Create `Header.tsx` Client Component (`'use client'`): sticky top-0 z-50, h-20 px-36 py-3, bg `--color-header-bg`; contains Logo (reuse `src/components/ui/Logo.tsx`), 3 nav links ("About SAA 2025" `/`, "Awards Information" `/award-information`, "Sun* Kudos" `/sun-kudos`), LanguageSelector (reuse `src/components/auth/LanguageSelector.tsx`), notification bell icon placeholder, avatar icon placeholder | src/components/layout/Header.tsx
- [x] T010 [P] [US1] Create `Footer.tsx` Server Component: flex row justify-between, py-10 px-[90px], bg #00101A; contains Logo, 3 nav links (16px Montserrat 700 white, hover bg #FFEA9E/10), copyright text (Montserrat Alternates 700) | src/components/layout/Footer.tsx

### Hero Section (US1)

- [x] T011 [P] [US1] Create `CountdownSection.tsx` Client Component (`'use client'`): import `useCountdown` from `src/hooks/useCountdown.ts` and `CountdownUnit` from `src/components/countdown/CountdownUnit.tsx` — **DO NOT reuse `CountdownTimer.tsx`** (it redirects to `/` on expire causing infinite loop on homepage); render ROOT FURTHER `<Image src="/images/root-further-logo.png" width={451} height={200}>`; render "Coming soon" label (24px Montserrat 700 white) hidden when `isExpired`; render 3 `<CountdownUnit>` in flex row gap-10 with `role="timer" aria-live="polite" aria-atomic="true"`; show `isMounted ? value : 0` for each digit (SSR hydration safety) | src/components/homepage/CountdownSection.tsx
- [x] T012 [P] [US1] Create `HeroSection.tsx` Server Component: relative min-h-screen overflow-hidden; `<Image src="/images/login-bg.jpg" fill object-cover z-0 aria-hidden>`; gradient overlay div `style={{ background: 'var(--gradient-overlay-homepage)' }}` absolute inset-0 z-[1]; content section relative z-[2] flex-col px-36 py-24 gap-[120px]; contains `<CountdownSection>`; inline EventInfoBlock (flex row gap-8: date item + venue item, value 24px #FFEA9E, label 16px white); CTA buttons row gap-4 (`<Link href="/award-information">` primary btn bg #FFEA9E text #00101A rounded-lg py-4 px-6 text-[22px] font-bold + `<Link href="/sun-kudos">` secondary btn bg #FFEA9E/10 border border-[#998C5F] text-white) | src/components/homepage/HeroSection.tsx

### Awards Section (US1)

- [x] T013 [P] [US1] Create `AwardCard.tsx` Server Component: accepts `Award` type prop; flex flex-col gap-6 w-full cursor-pointer group; `<Link href={\`/award-information#${award.linkSlug}\`}>` wraps entire card; `<Image>` 336×336 border border-[#FFEA9E] object-cover; title 24px Montserrat 400 #FFEA9E; description 16px Montserrat 400 white tracking-[0.5px] line-clamp-2; "Chi tiết" link text 16px Montserrat 500 white (hover underline + color #FFEA9E) | src/components/homepage/AwardCard.tsx
- [x] T014 [US1] Create `AwardsSection.tsx` Server Component: import awards from `src/lib/awards.ts`; section header (caption 24px white + heading "Hệ thống giải thưởng" 57px Montserrat 700 #FFEA9E leading-[64px] tracking-[-0.25px]); awards grid `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-36`; render `<AwardCard>` for each of 6 awards | src/components/homepage/AwardsSection.tsx

### Page Composition (US1)

- [x] T015 [US1] Rewrite `src/app/page.tsx` as Server Component: `export const metadata: Metadata = { title: 'Sun Annual Awards 2025', description: '...' }`; compose `<Header />`, `<HeroSection />`, `<AwardsSection />`, `<Footer />`; background `#00101A`; no `RootFurtherSection`/`KudosSection`/`WidgetButton` yet — added in later phases | src/app/page.tsx

**Checkpoint**: `yarn dev` → `/` passes independent test above — US1 complete 🎯

---

## Phase 4: User Story 4 — Header + Footer Navigation (Priority: P2)

**Goal**: Header hiển thị active state đúng trang, notification bell có badge đỏ khi có thông báo, avatar dropdown hoạt động. Footer links navigate đúng.

**Independent Test**: Kiểm tra header visible, "About SAA 2025" hiển thị màu vàng #FFEA9E trên trang `/`, click "Awards Information" navigate đến `/award-information`, click notification bell mở panel, click avatar mở dropdown

### Header Enhancements (US4)

- [x] T016 [P] [US4] Implement `usePathname()` active nav state in Header: import `usePathname` from `next/navigation`; active link = `text-[#FFEA9E] bg-[#FFEA9E]/10 rounded` (4px radius, 4px 8px padding); inactive = text-white; hover = bg #FFEA9E/10 transition 150ms | src/components/layout/Header.tsx
- [x] T017 [P] [US4] Implement notification bell with badge: `useEffect` on mount → `fetch('/api/notifications')` → set `unreadCount` state; show red circle badge `bg-[#EF4444]` when `unreadCount > 0`; hide badge (no error toast) on API failure; bell uses icon component | src/components/layout/Header.tsx
- [x] T018 [US4] Implement avatar dropdown: click avatar → toggle dropdown with "Profile" and "Sign out" options; admin users additionally see "Admin Dashboard"; use Supabase `signOut()` for Sign out action | src/components/layout/Header.tsx

### Footer Interactivity (US4)

- [x] T019 [US4] Verify Footer nav links navigate correctly: "About SAA 2025" → `/`, "Awards Information" → `/award-information`, "Sun* Kudos" → `/sun-kudos`; add active state styling (bg #FFEA9E/10 px-2 py-1 rounded) using `usePathname` if needed — promote Footer to Client Component only if pathname check is required | src/components/layout/Footer.tsx

**Checkpoint**: Header active state + notifications badge + avatar dropdown working

---

## Phase 5: User Story 2 — Countdown Real-time (Priority: P2)

**Goal**: Đồng hồ đếm ngược tick đúng thời gian thực, không redirect khi hết giờ, hiển thị đúng sau khi switch tab

**Independent Test**: Truy cập `/`, đợi 65 giây → số MINUTES giảm 1 mà không reload trang. Khi event date đã qua: "Coming soon" text ẩn, countdown hiển thị "00 00 00", trang **không redirect**

- [x] T020 [US2] Verify and finalize `CountdownSection.tsx` real-time behavior: (1) confirm `isMounted = false` before hydration shows digits as `0`; (2) confirm `isExpired = true` hides "Coming soon" label and shows `00 00 00` without calling `router.replace('/')` (no redirect); (3) confirm `visibilitychange` event in `useCountdown` corrects stale values after tab switch; fix any issues found | src/components/homepage/CountdownSection.tsx

**Checkpoint**: Countdown ticks correctly, expired state shows 00/00/00 without redirect

---

## Phase 6: User Story 3 — Sun* Kudos Section (Priority: P3)

**Goal**: Root Further description text visible, Sun* Kudos section hiển thị với "Chi tiết" navigate đến `/sun-kudos`

**Independent Test**: Scroll đến section Sun* Kudos → thấy label "Phong trào ghi nhận", title "Sun* Kudos" (57px #FFEA9E), nút "Chi tiết" → click navigate sang `/sun-kudos`

### Kudos Components (US3)

- [x] T021 [P] [US3] Create `RootFurtherSection.tsx` Server Component: px-36, 16px Montserrat 400 white tracking-[0.5px] leading-relaxed; render long-form event description text from static content (Node `5001:14827`) | src/components/homepage/RootFurtherSection.tsx
- [x] T022 [P] [US3] Create `KudosSection.tsx` Server Component: max-w-[1224px] mx-auto min-h-[500px] bg-[#0F0F0F]; flex row items-center justify-between py-10 px-[52px]; left content: label "Phong trào ghi nhận" (24px Montserrat 700 white) + title "Sun* Kudos" (57px Montserrat 700 #FFEA9E leading-[64px]) + desc (16px Montserrat 700 white tracking-[0.5px]) + `<Link href="/sun-kudos">` button (127×56 bg #FFEA9E rounded text-[#00101A] 16px bold, hover opacity-90 150ms); right side: Kudos image | src/components/homepage/KudosSection.tsx

### Page Composition Update (US3)

- [x] T023 [US3] Update `src/app/page.tsx`: add `<RootFurtherSection />` between `<HeroSection />` and `<AwardsSection />`; add `<KudosSection />` after `<AwardsSection />` and before `<Footer />` | src/app/page.tsx

**Checkpoint**: Scroll `/` → RootFurther text visible, Kudos section visible with working "Chi tiết" link

---

## Phase 7: User Story 5 — Widget Button (Priority: P3)

**Goal**: Nút pill vàng cố định góc dưới phải, luôn visible khi scroll, click mở/đóng menu

**Independent Test**: Scroll trang bất kỳ vị trí → widget button (106×64px, #FFEA9E pill) luôn visible ở góc dưới phải màn hình; click → toggle menu placeholder

- [x] T024 [US5] Create `WidgetButton.tsx` Client Component (`'use client'`): `fixed bottom-8 right-8 z-50`; `w-[106px] h-16 bg-[#FFEA9E] rounded-full cursor-pointer`; `useState<boolean>` for `isOpen` toggle; click → toggle `isOpen`; render placeholder `<ul>` menu when `isOpen` (content TBD — pending Q1 resolution); hover scale-105 transition-150ms; focus outline 2px solid #00101A | src/components/layout/WidgetButton.tsx
- [x] T025 [US5] Add `<WidgetButton />` to `src/app/page.tsx` composition (render as last child of page, outside of main flow) | src/app/page.tsx

**Checkpoint**: Widget button visible at all scroll positions, click toggles menu

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, hover states, responsive verification, build validation

- [x] T026 [P] Verify accessibility in `CountdownSection.tsx`: confirm `role="timer" aria-live="polite" aria-atomic="true"` on countdown container; confirm `alt="ROOT FURTHER – SAA 2025"` on ROOT FURTHER image; confirm `aria-hidden={true}` on hero background image | src/components/homepage/CountdownSection.tsx, src/components/homepage/HeroSection.tsx
- [x] T027 [P] Add hover transitions and focus-visible outlines to all interactive elements: CTA buttons (opacity 0.9 hover, 150ms ease), award card (group-hover:translateY(-4px) + box-shadow glow, 200ms ease-out), footer nav links (bg #FFEA9E/10, 150ms), widget button (scale-105, 150ms); focus-visible outline `2px solid #FFEA9E outline-offset-2` on all focusable elements | src/components/homepage/HeroSection.tsx, src/components/homepage/AwardCard.tsx, src/components/layout/Footer.tsx
- [x] T028 [P] Responsive check and fix: verify award card grid at 375px (grid-cols-1, flex-col CTAs), 768px (grid-cols-2), 1440px (grid-cols-3, 144px padding); verify no horizontal overflow; fix any issues | src/components/homepage/AwardsSection.tsx, src/components/homepage/HeroSection.tsx
- [x] T029 Verify `yarn build` passes: no TypeScript errors, no Cloudflare edge runtime violations (no Node.js built-ins), no ESLint errors (`yarn lint`) | — (all files)

---

## Phase 9: Bug Fix — Award Card Images

**Purpose**: Fix wrong images for all 6 award cards (were text-label PNGs ~222×36px instead of artwork)

- [x] T030 [P] Download shared award background from Figma (`I2167:907X;214:1019;81:2442`, 336×336 ring+podium+dark bg) to `public/images/awards/award-background.png` | public/images/awards/award-background.png
- [x] T031 [P] Download 6 artwork text-label PNGs from Figma to `public/images/awards/`: `top-talent-artwork.png` (222×36), `top-project-artwork.png` (232×35), `top-project-leader-artwork.png` (232×64), `best-manager-artwork.png` (232×30), `signature-creator-artwork.png` (232×54), `mvp-artwork.png` (116×52) | public/images/awards/
- [x] T032 Add `artworkUrl`, `artworkWidth`, `artworkHeight` fields to `Award` type | src/types/awards.ts
- [x] T033 Update `awards.ts`: set `imageUrl = AWARD_BG` (shared background) and add `artworkUrl`/`artworkWidth`/`artworkHeight` per card | src/lib/awards.ts
- [x] T034 Update `AwardCard.tsx`: add `<Image fill src={award.imageUrl}>` as background layer + `<div absolute inset-0 flex items-center justify-center paddingBottom=16%><Image src={award.artworkUrl} width height>` overlay centered in ring (ring center ~42% from top) | src/components/homepage/AwardCard.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundation) — BLOCKS all user story phases
    ↓
Phase 3 (US1 P1) — 🎯 MVP — STOP & VALIDATE here
    ↓
Phase 4 (US4 P2) ─┐
Phase 5 (US2 P2) ─┤ — Can proceed in parallel after Phase 3
Phase 6 (US3 P3) ─┘
    ↓
Phase 7 (US5 P3)
    ↓
Phase 8 (Polish)
```

### Within Each Phase

- Phase 3 US1: T009–T013 can run in parallel [P]; T014 depends on T013; T015 depends on T009–T014
- Phase 4 US4: T016 and T017 can run in parallel [P]; T018 after T016
- Phase 6 US3: T021 and T022 can run in parallel [P]; T023 depends on T021–T022
- Phase 7 US5: T024 before T025
- Phase 8: T026, T027, T028 can run in parallel [P]; T029 must run last

### Parallel Opportunities

| Phase | Parallel Group |
|-------|---------------|
| Phase 1 | T003 ‖ T004 |
| Phase 2 | T005 ‖ T006 |
| Phase 3 | T009 ‖ T010 ‖ T011 ‖ T012 ‖ T013 (all before T014) |
| Phase 4 | T016 ‖ T017 |
| Phase 6 | T021 ‖ T022 |
| Phase 8 | T026 ‖ T027 ‖ T028 |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + Phase 2
2. Complete Phase 3 (US1 — 7 tasks)
3. **STOP and VALIDATE**: `yarn dev` → `/` → independent test passes
4. If passing, continue to Phases 4–8

### Incremental Delivery

1. **Sprint 1**: Phase 1 + 2 + 3 (US1 P1) — deployable MVP
2. **Sprint 2**: Phase 4 (US4 P2) + Phase 5 (US2 P2) — header interactions + countdown edge cases
3. **Sprint 3**: Phase 6 (US3 P3) + Phase 7 (US5 P3) — kudos section + widget button
4. **Sprint 4**: Phase 8 — polish + build verification

---

## Open Questions (from plan.md — non-blocking)

| # | Question | Impact | Default |
|---|----------|--------|---------|
| Q1 | Widget Button menu items (what actions?) | T024 menu content | Render empty `<ul>` placeholder marked `{/* TODO: populate menu items */}` |
| Q2 | Award data source: static `awards.ts` final or API for v1? | T007 implementation | Use static config; service layer wrappable for API swap |
| Q3 | Sun* Kudos route: `/sun-kudos` or another slug? | T012 href, T022 href | Use `/sun-kudos` per SCREENFLOW.md |

---

## Notes

- Commit after each phase checkpoint (T015, T019, T020, T023, T025, T029)
- **⚠ CountdownSection**: MUST use `useCountdown` + `CountdownUnit` directly — NOT `CountdownTimer.tsx` (that component calls `router.replace('/')` on expire, causing infinite redirect loop on homepage)
- `src/lib/` directory must be created before T007 (currently does not exist)
- All images must use `next/image` per constitution (TR-003)
- Award card slugs in `awards.ts` must match anchor IDs planned for `/award-information` page
- Footer may need `'use client'` only if `usePathname()` is required for active state; evaluate in T019
