# Tasks: Countdown - Prelaunch

**Frame**: `2268:35127-Countdown-Prelaunch`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅
**Created**: 2026-03-11

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no shared dependency)
- **[US#]**: User story this task belongs to (US1/US2/US3)
- **|**: File path affected

---

## Dependency Graph

```
Phase 1 (T001–T003)       ← no dependencies
    ↓
Phase 2 (T004–T007)       ← T004 requires T002 (font file must exist)
    ↓                        T006 requires T004 (font in place)
Phase 3 US1 (T008–T016)   ← T009 requires T008; T011 requires T010;
    ↓                         T013 requires T012; T015 requires T014
Phase 4 US2 (T017–T018)   ← T018 requires T017 (TDD)
    ↓
Phase 5 US3 (T019–T020)   ← T020 requires T019 (TDD)
    ↓
Phase 6 Polish (T021–T023) ← T022 requires Phase 3–5 complete
```

## Parallel Opportunities

Within Phase 1: T001 ∥ T002 ∥ T003
Within Phase 2: T005 ∥ T006 ∥ T007 (after T004)
Within Phase 3: T010 ∥ T012 (DigitCard + CountdownUnit tests can start after T009 ships)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Download assets, source font, configure env var. Blocking for everything.

**⚠️ Run FIRST — build fails without font file (T004 hard dependency on T002).**

- [ ] T001 [P] Download `login-bg.jpg` from Figma (node `662:14389`) using `mcp__momorph__get_media_file`; if node is vector/not exportable → apply CSS fallback already in globals.css (`--gradient-bg-fallback`) and note as known limitation | public/images/login-bg.jpg
- [ ] T002 [P] Source "Digital Numbers" 7-segment LED font TTF: (1) try `mcp__momorph__get_media_files` on frame `2268:35127`, (2) if unavailable use "Digital-7" from dafont.com, (3) if licensing blocked document `monospace` fallback as tech debt | src/app/fonts/digital-numbers.ttf *(pending sourcing)*
- [ ] T003 [P] Set env var for dev testing — add to `.env.local`: `NEXT_PUBLIC_EVENT_START_DATE=2025-12-31T18:00:00+07:00` (future date for active timer; change to past date to test redirect) | .env.local

**Checkpoint**: Background image available (or fallback documented), font TTF sourced, env var set → Phase 2 can begin

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Types, font registration, CSS design tokens. No business logic yet.

**⚠️ CRITICAL**: Phase 3 cannot start until T004–T007 are all done (T006 requires T004; hooks import from `@/types/countdown`).

- [ ] T004 Create `src/app/fonts/` directory and place `digital-numbers.ttf` (copied from T002 output). This step physically makes the font available for `next/font/local` at build time. | src/app/fonts/digital-numbers.ttf
- [ ] T005 [P] Create `src/types/countdown.ts` with named type exports: | src/types/countdown.ts
  ```typescript
  export type CountdownState = {
    days: number       // 0–99 (clamped)
    hours: number      // 0–23
    minutes: number    // 0–59
    isExpired: boolean
    isMounted: boolean
  }
  export type TimeUnit = 'DAYS' | 'HOURS' | 'MINUTES'
  ```
- [ ] T006 [P] Modify `src/app/layout.tsx`: add `import localFont from 'next/font/local'`, declare `digitalNumbers` with `src: './fonts/digital-numbers.ttf'`, `variable: '--font-digital'`, `display: 'swap'`, `fallback: ['monospace']`; add `digitalNumbers.variable` to `<body>` className alongside existing Montserrat variables | src/app/layout.tsx
- [ ] T007 [P] Modify `src/app/globals.css`: add countdown design tokens inside `:root` block — `--color-accent: #FFEA9E`, `--gradient-overlay-countdown: linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)`, `--gradient-digit-card: linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)` | src/app/globals.css

**Checkpoint**: `yarn build` succeeds with font loaded (or monospace fallback); types importable via `@/types/countdown`

---

## Phase 3: User Story 1 — View Countdown Timer (Priority: P1) 🎯 MVP

**Goal**: Display correct DAYS / HOURS / MINUTES values from `NEXT_PUBLIC_EVENT_START_DATE`. SSR-safe ("00" on server, real values after hydration). Pixel-perfect glassmorphism digit cards and units per design-style.md.

**Independent Test**: `yarn dev` → navigate to `/countdown` with a future event date → verify heading "Sự kiện sẽ bắt đầu sau" is visible; verify 3 units (DAYS / HOURS / MINUTES) show correct numeric values matching actual time-to-event; verify digit cards render with frosted-glass styling; verify no JS console errors.

### Hook — TDD (US1)

- [ ] T008 [US1] Write FAILING tests for `useCountdown` hook — 8 test cases: (1) `undefined` → `{ days:0, hours:0, minutes:0, isExpired:false, isMounted:false }` initial, `isMounted:true` after mount; (2) `"not-a-date"` → graceful no-throw, `isExpired:false`; (3) past date → `isExpired:true` after mount; (4) future +1 day → `days===1`; (5) 90 minutes remaining → `{ hours:1, minutes:30 }`; (6) diff===0ms boundary → `isExpired:true`; (7) 100 days → `days===99` (cap); (8) `vi.advanceTimersByTime(60_000)` → minutes decrements | src/hooks/useCountdown.test.ts
- [ ] T009 [US1] Implement `useCountdown.ts` to pass T008 tests: `calculateCountdown` pure function (parse date → isNaN check → diff check → extract days/hours/minutes); `useState` with SSR-safe initial state; `useEffect` calls `tick()` immediately on mount + `setInterval(tick, 1000)` + cleanup `clearInterval` | src/hooks/useCountdown.ts

### UI Components — TDD (US1)

- [ ] T010 [P] [US1] Write FAILING tests for `DigitCard` — 5 test cases: (1) renders digit character inside `<span>`; (2) inner bg `<div>` has `aria-hidden`; (3) digit `<span>` has `relative z-10` (renders above bg layer); (4) wrapper has `overflow-hidden` and `rounded-xl`; (5) snapshot for full DOM structure | src/components/countdown/DigitCard.test.tsx
- [ ] T011 [US1] Implement `DigitCard.tsx` to pass T010 tests: outer `<div>` `relative w-[48px] h-[76px] md:w-[62px] md:h-[100px] lg:w-[77px] lg:h-[123px] rounded-xl overflow-hidden`; inner bg `<div>` `absolute inset-0 rounded-xl opacity-50 backdrop-blur-[24.96px] aria-hidden` with `style={{ background: gradient, border: '0.75px solid #FFEA9E' }}`; digit `<span>` `relative z-10 flex items-center justify-center w-full h-full font-[family-name:var(--font-digital)] font-normal text-[46px] md:text-[60px] lg:text-[74px] text-white leading-none select-none` | src/components/countdown/DigitCard.tsx
- [ ] T012 [P] [US1] Write FAILING tests for `CountdownUnit` — 7 test cases: (1) `value=5` → digits "0","5"; (2) `value=15` → "1","5"; (3) `value=0` → "0","0"; (4) `value=99` → "9","9"; (5) `label="DAYS"` → text "DAYS" visible; (6) `label="MINUTES"` → text "MINUTES" visible; (7) outer div has `role="group"` and correct `aria-label` prop | src/components/countdown/CountdownUnit.test.tsx
- [ ] T013 [US1] Implement `CountdownUnit.tsx` to pass T012 tests: props `{ value: number; label: TimeUnit; 'aria-label': string }`; `tens = Math.floor(value/10)`, `units = value%10`; outer `<div>` `role="group" aria-label={ariaLabel} flex flex-col gap-[21px] items-start lg:w-[175px]`; digit pair `<div>` `flex flex-row gap-[21px] items-center`; label `<span>` Montserrat bold responsive sizes | src/components/countdown/CountdownUnit.tsx
- [ ] T014 [US1] Write FAILING tests for `CountdownTimer` — 5 test cases: (1) `isExpired=false` → `mockReplace` NOT called; (2) `isExpired=true` → `mockReplace` called with `'/'`; (3) `false→true` transition → called exactly once; (4) renders 3 `CountdownUnit` instances with correct `value`/`label` props from mocked hook; (5) wrapper div has `aria-live="polite"` and `aria-atomic="true"` | src/components/countdown/CountdownTimer.test.tsx
- [ ] T015 [US1] Implement `CountdownTimer.tsx` to pass T014 tests (`"use client"`): destructure `{ days, hours, minutes, isExpired }` from `useCountdown(eventDateStr)`; separate `useEffect(() => { if (isExpired) router.replace('/') }, [isExpired, router])`; render `<div aria-live="polite" aria-atomic="true" className="flex flex-row gap-6 md:gap-10 lg:gap-[60px] items-center justify-center">` with 3 `CountdownUnit` components | src/components/countdown/CountdownTimer.tsx
- [ ] T016 [US1] Implement `src/app/countdown/page.tsx` (Server Component, named `export const metadata` + `export default` page function): read `process.env.NEXT_PUBLIC_EVENT_START_DATE`; render `<main relative min-h-screen bg-[#00101A] overflow-hidden>`; `<Image src="/images/login-bg.jpg" alt="" aria-hidden fill sizes="100vw" className="object-cover z-0" priority />`; gradient overlay `<div aria-hidden style={{ background: linear-gradient(18deg…) }} className="absolute inset-0 z-[1] pointer-events-none">`; hero `<section relative z-[2] flex flex-col items-center justify-center min-h-screen py-12 px-4 md:px-12 lg:py-24 lg:px-36 gap-6>`; `<h1>` heading; `<CountdownTimer eventDateStr={eventDateStr} />` | src/app/countdown/page.tsx

**Checkpoint**: `yarn dev` → `/countdown` loads → heading visible → 3 units showing "00" on first SSR load → real values appear after hydration → digit cards have glassmorphism styling. FR-001, FR-005, FR-007, TR-001, TR-002, TR-006 satisfied. SC-001, SC-002, SC-006 met.

---

## Phase 4: User Story 2 — Real-Time Updates (Priority: P2)

**Goal**: Countdown updates every second; tab-switching does not cause stale values.

**Independent Test**: Open `/countdown` and wait 65 seconds → MINUTES decrements by 1 without page reload. Switch browser tab, wait 2 minutes, return → displayed value reflects current time (not a value from 2 minutes ago).

- [ ] T017 [US2] Extend `useCountdown.test.ts` with failing visibilitychange test: `Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })` → `vi.advanceTimersByTime(120_000)` → `Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })` → `act(() => document.dispatchEvent(new Event('visibilitychange')))` → assert displayed minutes match current time (not stale 2-min-ago value) | src/hooks/useCountdown.test.ts
- [ ] T018 [US2] Update `useCountdown.ts` to pass T017 test: add `const handleVisibility = () => { if (document.visibilityState === 'visible') tick() }` + `document.addEventListener('visibilitychange', handleVisibility)` inside `useEffect`; add `document.removeEventListener('visibilitychange', handleVisibility)` to cleanup function alongside `clearInterval` | src/hooks/useCountdown.ts

**Checkpoint**: `yarn test src/hooks/useCountdown.test.ts` → all 9 tests pass. US2 acceptance scenarios SC1, SC2, SC3 satisfied.

---

## Phase 5: User Story 3 — Auto-Redirect (Priority: P3)

**Goal**: Middleware redirects `/countdown` → `/` when event date is in the past. Client-side `CountdownTimer` redirects when timer reaches zero.

**Independent Test (middleware)**: Set `NEXT_PUBLIC_EVENT_START_DATE` to a past date → request `GET /countdown` → response is a 307/308 redirect to `/`. Set to a future date → response passes through (no redirect). Set to undefined → passes through gracefully.

**Independent Test (client)**: Set `NEXT_PUBLIC_EVENT_START_DATE` to 5 seconds in the future → load `/countdown` in browser → within ~6 seconds, page automatically navigates to `/`.

- [ ] T019 [US3] Write FAILING middleware tests for `/countdown` route — 6 test cases: (TC-C1) no env var → pass through; (TC-C2) future date → pass through; (TC-C3) past date → 307 redirect to `'/'`; (TC-C4) invalid date string → pass through; (TC-C5) unauthenticated + future date → NOT redirected to `/login` (public route); (TC-C6) authenticated + past date → redirect to `'/'` | src/middleware.test.ts
- [ ] T020 [US3] Modify `src/middleware.ts` to pass T019 tests: (1) add `'/countdown'` to `PUBLIC_ROUTES` array; (2) add block after `isStaticAsset` check — `if (pathname === '/countdown') { const eventDate = new Date(process.env.NEXT_PUBLIC_EVENT_START_DATE ?? ''); if (!isNaN(eventDate.getTime()) && eventDate <= new Date()) return addSecurityHeaders(NextResponse.redirect(new URL('/', request.url))) }` | src/middleware.ts

**Checkpoint**: `yarn test src/middleware.test.ts` → all existing + 6 new tests pass. FR-003, FR-004 satisfied. SC-003 met.

---

## Phase 6: Polish, Responsive & E2E

**Goal**: WCAG 2.1 AA verified, all breakpoints clean, E2E suite passing, quality gates green.

- [ ] T021 [P] Manual responsive verification: open browser devtools → test 375px (mobile), 768px (tablet), 1440px (desktop) — verify digit card sizes (48×76 / 62×100 / 77×123), heading font sizes (22/28/36px), unit label sizes (16/24/36px), no overflow at any breakpoint | src/components/countdown/DigitCard.tsx, CountdownUnit.tsx (adjust classes if needed)
- [ ] T022 Write E2E test file with 8 test cases: (P1-SC1) navigate `/countdown` → 3 unit labels visible (DAYS/HOURS/MINUTES); (P1-SC2) all digit characters are 0–9; (P1-SC5) missing env var → all "00" no crash; (P1-SC6) no JS console errors on load; (P2-SC1) wait 65s → MINUTES decrements; (P3-SC2) past date env → page redirects to `/`; (SC-002) digit cards have border and backdrop-blur styling (visual/screenshot); (SC-005) 375px viewport → no horizontal overflow | tests/e2e/countdown.spec.ts
- [ ] T023 [P] Run quality gates and fix any failures: `yarn lint` (no ESLint errors), `yarn build` (successful Next.js + Cloudflare build), `yarn test` (all unit + integration tests pass) | (all modified files)

**Checkpoint**: All 6 quality gates from constitution pass. SC-001 through SC-006 satisfied. Spec status → **Ready for Production**.

---

## Summary

| Phase | Tasks | User Story | Parallelizable |
|-------|-------|------------|----------------|
| Phase 1 Setup | T001–T003 | — | T001 ∥ T002 ∥ T003 |
| Phase 2 Foundation | T004–T007 | — | T005 ∥ T006 ∥ T007 (after T004) |
| Phase 3 US1 MVP | T008–T016 | US1 (P1) | T010 ∥ T012 (after T009) |
| Phase 4 US2 | T017–T018 | US2 (P2) | sequential |
| Phase 5 US3 | T019–T020 | US3 (P3) | sequential |
| Phase 6 Polish | T021–T023 | — | T021 ∥ T023 |
| **Total** | **23 tasks** | | |

## Implementation Strategy

**MVP Scope** (ship after Phase 3):
- Countdown displays correctly with real-time 1-second updates (setInterval in hook)
- Pixel-perfect glassmorphism digit cards
- SSR-safe hydration

**Incremental delivery**:
1. Phase 3 → functional countdown (US1 = P1 complete)
2. Phase 4 → tab-switching robustness (US2 = P2 complete)
3. Phase 5 → redirect behavior (US3 = P3 complete)
4. Phase 6 → production-ready (E2E + quality gates)
