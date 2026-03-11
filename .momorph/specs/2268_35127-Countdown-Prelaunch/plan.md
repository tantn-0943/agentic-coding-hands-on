# Implementation Plan: Countdown - Prelaunch

**Frame**: `2268:35127-Countdown-Prelaunch`
**Date**: 2026-03-11
**Spec**: `specs/2268_35127-Countdown-Prelaunch/spec.md`
**Review**: Reviewed 2026-03-11 (pass 1) → Re-reviewed 2026-03-11 (pass 2) — all checklist items pass

---

## Summary

Implement màn hình Countdown - Prelaunch cho SAA 2025: standalone full-screen page với background artwork + gradient overlay, heading "Sự kiện sẽ bắt đầu sau", và real-time countdown timer gồm DAYS / HOURS / MINUTES. Countdown dùng `useEffect` + `setInterval` (Client Component), SSR-safe với "00" placeholder trên server. Auto-redirect tới `/` khi timer về 0 (client-side) hoặc khi event date đã qua (middleware server-side guard). Không cần Supabase DB, không cần auth.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS 4, `next/font/local` (Digital Numbers custom font)
**Edge Runtime**: Cloudflare Workers via @opennextjs/cloudflare
**Testing**: Vitest (unit), Playwright (E2E) — đã cài sẵn
**State Management**: React `useState` local state trong `CountdownTimer` Client Component; no global state
**Auth**: N/A — public page, không cần authentication

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Principle | Rule | Status | Notes |
|-----------|------|--------|-------|
| I. Clean Code | TypeScript strict; named exports; functions ≤ 40 lines; no `any` | ✅ | `useCountdown` hook tách biệt logic khỏi UI; `calculateCountdown` là pure function ≤ 15 lines; `export function` cho tất cả components; import alias `@/*` dùng xuyên suốt |
| II. Next.js Best Practices | Server Component cho page.tsx; Client Component cho CountdownTimer (`"use client"`); `next/image` cho background; `next/font/local` cho Digital Numbers | ✅ | page.tsx là Server Component — không cần `"use client"`; CountdownUnit + DigitCard không cần `"use client"` (được import từ Client Component); `export default` được dùng cho page.tsx vì Next.js App Router yêu cầu — **đây là exception đã biết của constitution** ("named exports where possible"); `export const metadata` vẫn là named export |
| III. Cloudflare Edge Runtime | No Node.js built-ins; stateless; `@opennextjs/cloudflare` conventions | ✅ | Chỉ dùng `Date` Web API (available in edge); no `fs`, `path`, `crypto` from Node; middleware dùng `new Date()` (Web API) |
| IV. Supabase Integration | N/A — không có DB/auth | ✅ | Screen là public; không gọi Supabase API |
| V. Responsive Design | Mobile-first; test 375px / 768px / 1440px; touch targets ≥ 44×44px | ✅ | Responsive specs đầy đủ trong design-style.md; breakpoints: 375 / 768 / 1024; no interactive elements (no touch target concern) |
| VI. OWASP Security | N/A — không có user input; env var không expose secrets | ✅ | `NEXT_PUBLIC_EVENT_START_DATE` là public config, không sensitive; không có form input hay user-supplied data |
| VII. Test-First (TDD) | Red-Green-Refactor; unit tests trước implement; E2E cho P1 | ✅ | `useCountdown` hook, `CountdownUnit` (zero-padding), `DigitCard`, và middleware countdown tests đều được viết trước implement |

**Violations**: Không có vi phạm.

---

## Architecture Decisions

### Frontend Approach

- **Component Split**:
  - `src/app/countdown/page.tsx` → **Server Component** — metadata, SSR-safe shell với "00" placeholders; đọc `NEXT_PUBLIC_EVENT_START_DATE` từ `process.env`, truyền xuống `CountdownTimer` as prop
  - `src/components/countdown/CountdownTimer.tsx` → **Client Component** (`"use client"`) — dùng `useCountdown` hook, render TimeRow + 3 `CountdownUnit`, trigger redirect khi `isExpired`
  - `src/components/countdown/CountdownUnit.tsx` — presentational component, render digit pair + label; handles zero-padding; no `"use client"` needed (imported by Client Component)
  - `src/components/countdown/DigitCard.tsx` — presentational component, glassmorphism digit tile; no `"use client"` needed
- **Custom Hook**: `src/hooks/useCountdown.ts` — encapsulate `useState` + `useEffect` + `setInterval` + `visibilitychange`; trả về `{ days, hours, minutes, isExpired, isMounted }`
- **Redirect strategy**:
  - Client: `useRouter().replace('/')` trong separate `useEffect([isExpired, router])` khi `isExpired === true` (US3, FR-003)
  - Middleware: Nếu `NEXT_PUBLIC_EVENT_START_DATE` đã qua và request là `/countdown` → redirect `'/'` (FR-004, server-side guard)
- **Font loading**: `next/font/local` cho "Digital Numbers" TTF → CSS variable `--font-digital`; fallback `monospace`
- **Styling**: TailwindCSS 4 utility classes; custom values inline; không cần CSS Modules

### Countdown Logic (Hook Contract)

```typescript
// src/hooks/useCountdown.ts

// Defined in src/types/countdown.ts, imported here:
// type CountdownState = { days, hours, minutes, isExpired, isMounted }

export function useCountdown(eventDateStr: string | undefined): CountdownState
```

- **SSR-safe initial state**: `{ days: 0, hours: 0, minutes: 0, isExpired: false, isMounted: false }`
- **`calculateCountdown` pure function** (≤ 15 lines):
  1. If `!eventDateStr` → return `{ days: 0, hours: 0, minutes: 0, isExpired: false }`
  2. `const eventDate = new Date(eventDateStr)` — if `isNaN(eventDate.getTime())` → return same graceful fallback with `isExpired: false`
  3. `const diff = eventDate.getTime() - Date.now()` — if `diff <= 0` → return `{ ..., isExpired: true }` (past date)
  4. Calculate: `totalMinutes`, `minutes = totalMinutes % 60`, `totalHours`, `hours = totalHours % 24`, `days = Math.min(99, Math.floor(totalHours / 24))`
- **On mount**: `isMounted = true`, call `calculateCountdown`, start `setInterval(1000)`
- **Tab switching (US2 SC3)**: Each `setInterval` tick calls `calculateCountdown` which recalculates from `Date.now()` — NOT incrementing counters. Therefore, even if the browser throttles `setInterval` on inactive tabs, the value will be correct when the tab is refocused. Additionally, a `visibilitychange` listener fires `calculateCountdown` immediately on `document.visibilityState === 'visible'` to recover from throttled timers.
- **Clamp**: `days = Math.min(99, ...)`, all values `Math.max(0, value)` via the branch logic above (diff <= 0 returns 0s)
- **Cleanup**: `useEffect` returns cleanup that calls `clearInterval` + `removeEventListener`

### Middleware Update

Modify `src/middleware.ts` để:
1. Thêm `/countdown` vào `PUBLIC_ROUTES` (no auth redirect)
2. Thêm past-date redirect logic ngay sau static asset check (trước auth check):

```typescript
if (pathname === '/countdown') {
  const eventDateStr = process.env.NEXT_PUBLIC_EVENT_START_DATE
  if (eventDateStr) {
    const eventDate = new Date(eventDateStr)
    if (!isNaN(eventDate.getTime()) && eventDate <= new Date()) {
      return addSecurityHeaders(NextResponse.redirect(new URL('/', request.url)))
    }
  }
  // If date missing/invalid → allow through (graceful, FR-005)
}
```

> Note: `addSecurityHeaders` đã có sẵn trong middleware — reuse. Note: `/countdown` in `PUBLIC_ROUTES` ensures the subsequent auth check does NOT redirect to `/login` even when user is unauthenticated.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2268_35127-Countdown-Prelaunch/
├── spec.md           # Feature specification
├── design-style.md   # Visual specs pixel-accurate
└── plan.md           # This file (next: tasks.md)
```

### New Files

| File | Purpose |
|------|---------|
| `src/app/countdown/page.tsx` | Countdown page — Server Component, metadata, SSR shell |
| `src/components/countdown/CountdownTimer.tsx` | Client Component orchestrator (`"use client"`), useCountdown hook, redirect |
| `src/components/countdown/CountdownUnit.tsx` | DAYS/HOURS/MINUTES presentational unit, zero-padding logic |
| `src/components/countdown/DigitCard.tsx` | Single glassmorphism digit tile |
| `src/hooks/useCountdown.ts` | Countdown logic hook (setInterval, visibilitychange, state, clamping) |
| `src/types/countdown.ts` | `CountdownState`, `TimeUnit` types |
| `src/hooks/useCountdown.test.ts` | Unit tests for countdown hook (all edge cases) |
| `src/components/countdown/CountdownUnit.test.tsx` | Unit tests for CountdownUnit zero-padding |
| `src/components/countdown/DigitCard.test.tsx` | Unit tests for DigitCard rendering |
| `tests/e2e/countdown.spec.ts` | E2E tests for P1/P2/P3 acceptance scenarios |
| `src/app/fonts/digital-numbers.ttf` | Digital Numbers font file (canonical location for `next/font/local` — to be sourced, see Phase 0) |
| `src/components/countdown/CountdownTimer.test.tsx` | Unit tests for CountdownTimer redirect logic |

> **`src/app/fonts/` directory** does not yet exist — create it when placing the font file.

### Modified Files

| File | Changes |
|------|---------|
| `src/middleware.ts` | Add `/countdown` to `PUBLIC_ROUTES`; add past-date redirect block before auth check |
| `src/middleware.test.ts` | Add 4 countdown-specific middleware test cases |
| `src/app/layout.tsx` | Add `import localFont from 'next/font/local'`; add `digitalNumbers` config; add `digitalNumbers.variable` to `<body>` className |
| `src/app/globals.css` | Add countdown CSS design tokens under `:root` |

### Verify / Download

| Asset | Current Status | Action |
|-------|---------------|--------|
| `public/images/login-bg.jpg` | ❌ Not found in `public/images/` | Download from Figma (node `662:14389`) or use CSS gradient fallback `--gradient-bg-fallback` from globals.css |
| `src/app/fonts/digital-numbers.ttf` | ❌ Missing | Source "Digital Numbers" 7-segment TTF; see Phase 0 |

### Dependencies

**No new npm packages required.** All packages already installed:

| Package | Version | Usage |
|---------|---------|-------|
| `next` | 15.5.9 | App Router, next/image, next/font/local |
| `tailwindcss` | ^4 | Utility styling |
| `vitest` | ✅ | Unit test runner |
| `@playwright/test` | ✅ | E2E test runner |
| `@testing-library/react` | ✅ | Component testing |

---

## Implementation Approach

### Phase 0: Asset Preparation

Download và verify media assets trước khi implement UI. `next/font/local` **resolves font at build time** — `next build` fails if TTF is missing.

| Asset | Figma Node / Source | Target Path | Fallback |
|-------|---------------------|-------------|----------|
| Background KV | `662:14389` (shared với Login) | `public/images/login-bg.jpg` | `bg-[#00101A]` + `--gradient-bg-fallback` từ globals.css |
| Digital Numbers font | TTF file (7-segment LED style) | `src/app/fonts/digital-numbers.ttf` | `font-family: monospace` via `fallback: ['monospace']` in localFont |

**Font sourcing options** (in priority order):
1. Use `mcp__momorph__get_media_files` on frame `2268:35127` — check if font is an exportable asset
2. If unavailable, use free "Digital-7" font (dafont.com) — same 7-segment LED style, free for personal use
3. If blocked by licensing, use `monospace` fallback and note as tech debt

**Background image**:
- Try `mcp__momorph__get_media_files` on Login frame (node `662:14389`)
- If not downloadable (vector/gradient fill), use CSS fallback and add to risk log

**Env var setup** — add to `.env.local` before running dev server:
```
NEXT_PUBLIC_EVENT_START_DATE=2025-12-31T18:00:00+07:00
```
For testing the "timer active" state, set a future date. For testing redirect, set a past date.

### Phase 1: Foundation (Types + Font + Tokens)

**Goal**: Infrastructure layer — không có business logic.

1. Create `src/types/countdown.ts` (named exports):
   ```typescript
   export type CountdownState = {
     days: number      // 0–99 (clamped)
     hours: number     // 0–23
     minutes: number   // 0–59
     isExpired: boolean
     isMounted: boolean
   }

   export type TimeUnit = 'DAYS' | 'HOURS' | 'MINUTES'
   ```

2. **Place the font file** at `src/app/fonts/digital-numbers.ttf` (canonical Next.js location for `next/font/local` — avoids path resolution issues at build time).

   > **Why `src/app/fonts/` not `public/fonts/`**: `next/font/local` bundles the font at build time via relative file path. The canonical location is alongside `app/` files so the path is simple and not brittle. `public/fonts/` also works (path `'../../public/fonts/digital-numbers.ttf'` from layout.tsx) but is non-idiomatic and more prone to breaking on monorepo or build config changes.

3. Modify `src/app/layout.tsx` — add `next/font/local` for Digital Numbers:
   ```typescript
   import localFont from 'next/font/local'

   const digitalNumbers = localFont({
     // Relative to THIS file (src/app/layout.tsx) → src/app/fonts/digital-numbers.ttf
     src: './fonts/digital-numbers.ttf',
     variable: '--font-digital',
     display: 'swap',
     fallback: ['monospace'],
   })
   ```
   Add `digitalNumbers.variable` to `<body>` className alongside existing Montserrat variables:
   ```tsx
   <body className={`${montserrat.variable} ${montserratAlternates.variable} ${digitalNumbers.variable} antialiased`}>
   ```
   > **Note**: `next/font/local` auto-generates `@font-face` — do NOT add a manual `@font-face` in globals.css for this font.

4. Modify `src/app/globals.css` — add countdown tokens under existing `:root` block:
   ```css
   /* Countdown page design tokens */
   --color-accent: #FFEA9E;
   --gradient-overlay-countdown: linear-gradient(
     18deg,
     #00101A 15.48%,
     rgba(0, 18, 29, 0.46) 52.13%,
     rgba(0, 19, 32, 0.00) 63.41%
   );
   --gradient-digit-card: linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.10) 100%);
   ```

### Phase 2: Core Logic — TDD (US1 + US2 + US2-SC3)

**Goal**: `useCountdown` hook fully tested và working, including tab-switching behavior.

**Step 1 — Hook (test-first):**

1. **Write failing tests** `src/hooks/useCountdown.test.ts`:

   Setup:
   ```typescript
   import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
   import { renderHook, act } from '@testing-library/react'
   import { useCountdown } from '@/hooks/useCountdown'

   beforeEach(() => vi.useFakeTimers())
   afterEach(() => vi.useRealTimers())
   ```

   Test cases:
   - `undefined` date → `{ days: 0, hours: 0, minutes: 0, isExpired: false, isMounted: false }` on initial; after mount `isMounted: true`, `isExpired: false`
   - `"not-a-date"` (invalid string) → graceful, `isExpired: false`, no throw
   - Past date (e.g. `new Date(Date.now() - 1000).toISOString()`) → `isExpired: true` after mount
   - Future +1 day → `days === 1`, `isExpired: false` after mount
   - Remaining exactly 90 minutes → `{ days: 0, hours: 1, minutes: 30 }`
   - Remaining exactly 0ms (boundary) → `isExpired: true`
   - Days = 100 (> 99) → `days === 99` (capped)
   - After `act(() => vi.advanceTimersByTime(60_000))` → `minutes` decrements by 1
   - `visibilitychange` to `visible` → hook recalculates immediately. Test setup:
     ```typescript
     // jsdom defaults visibilityState to 'visible'; must mock it to 'hidden' first, advance
     // timers (simulating throttling), then restore to 'visible' and fire event:
     Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true })
     vi.advanceTimersByTime(120_000) // 2 minutes pass while tab is hidden
     Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true })
     act(() => document.dispatchEvent(new Event('visibilitychange')))
     // Assert: displayed minutes reflect current time (not stale value from 2 min ago)
     ```

2. **Implement** `src/hooks/useCountdown.ts`:
   ```typescript
   import { useState, useEffect } from 'react'
   import type { CountdownState } from '@/types/countdown'

   function calculateCountdown(eventDateStr: string | undefined): Omit<CountdownState, 'isMounted'> {
     if (!eventDateStr) return { days: 0, hours: 0, minutes: 0, isExpired: false }
     const eventDate = new Date(eventDateStr)
     if (isNaN(eventDate.getTime())) return { days: 0, hours: 0, minutes: 0, isExpired: false }
     const diff = eventDate.getTime() - Date.now()
     if (diff <= 0) return { days: 0, hours: 0, minutes: 0, isExpired: true }
     const totalMinutes = Math.floor(diff / 60_000)
     const minutes = totalMinutes % 60
     const totalHours = Math.floor(totalMinutes / 60)
     const hours = totalHours % 24
     const days = Math.min(99, Math.floor(totalHours / 24))
     return { days, hours, minutes, isExpired: false }
   }

   export function useCountdown(eventDateStr: string | undefined): CountdownState {
     const [state, setState] = useState<CountdownState>({
       days: 0, hours: 0, minutes: 0, isExpired: false, isMounted: false,
     })

     useEffect(() => {
       const tick = () => setState({ ...calculateCountdown(eventDateStr), isMounted: true })

       tick() // immediate calculation on mount
       const interval = setInterval(tick, 1_000)

       // US2-SC3: recover from browser-throttled setInterval when tab refocuses
       const handleVisibility = () => {
         if (document.visibilityState === 'visible') tick()
       }
       document.addEventListener('visibilitychange', handleVisibility)

       return () => {
         clearInterval(interval)
         document.removeEventListener('visibilitychange', handleVisibility)
       }
     }, [eventDateStr])

     return state
   }
   ```

### Phase 3: UI Components (P1 Visual)

**Goal**: Pixel-perfect UI per `design-style.md`.

**3.1 — DigitCard (test-first):**

1. **Write failing tests** `src/components/countdown/DigitCard.test.tsx`:
   - Renders the digit character passed as prop inside a `<span>`
   - Has inner bg `<div>` with `aria-hidden="true"` (glassmorphism layer)
   - Digit `<span>` contains `z-10` class (or equivalent relative positioning above bg)
   - Wrapper has `overflow-hidden` and `rounded-xl` classes
   - Snapshot test for full structure

2. **Implement** `src/components/countdown/DigitCard.tsx` (named export):
   ```tsx
   type Props = { digit: string }

   export function DigitCard({ digit }: Props) {
     return (
       // Outer wrapper — full opacity, clips children
       <div className="relative w-[48px] h-[76px] md:w-[62px] md:h-[100px] lg:w-[77px] lg:h-[123px] rounded-xl overflow-hidden">
         {/* Glassmorphism bg layer — opacity-50 applied HERE ONLY, not to wrapper */}
         <div
           aria-hidden
           className="absolute inset-0 rounded-xl opacity-50 backdrop-blur-[24.96px]"
           style={{
             background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)',
             border: '0.75px solid #FFEA9E',  // Tailwind min is 1px; use inline style for 0.75px
           }}
         />
         {/* Digit — relative z-10 ensures it renders above bg layer, full opacity */}
         <span className="relative z-10 flex items-center justify-center w-full h-full font-[family-name:var(--font-digital)] font-normal text-[46px] md:text-[60px] lg:text-[74px] text-white leading-none select-none">
           {digit}
         </span>
       </div>
     )
   }
   ```

**3.2 — CountdownUnit (test-first):**

1. **Write failing tests** `src/components/countdown/CountdownUnit.test.tsx`:
   - `value=5` → renders digits "0" and "5"
   - `value=15` → renders digits "1" and "5"
   - `value=0` → renders digits "0" and "0"
   - `value=99` → renders digits "9" and "9"
   - `label="DAYS"` → renders text "DAYS"
   - `label="MINUTES"` → renders text "MINUTES"
   - Outer div has `role="group"` and the `aria-label` passed via prop

2. **Implement** `src/components/countdown/CountdownUnit.tsx` (named export):
   ```tsx
   import { DigitCard } from '@/components/countdown/DigitCard'
   import type { TimeUnit } from '@/types/countdown'

   type Props = {
     value: number
     label: TimeUnit
     'aria-label': string
   }

   export function CountdownUnit({ value, label, 'aria-label': ariaLabel }: Props) {
     const tens = Math.floor(value / 10)
     const units = value % 10
     return (
       // role="group" + aria-label on OUTER div so screen readers announce the full unit
       // (e.g., "3 days remaining" as a named group). Inner digit cards are aria-hidden-by-parent.
       <div
         role="group"
         aria-label={ariaLabel}
         className="flex flex-col gap-[21px] items-start lg:w-[175px]"
       >
         <div className="flex flex-row gap-[21px] items-center">
           <DigitCard digit={String(tens)} />
           <DigitCard digit={String(units)} />
         </div>
         <span className="font-[family-name:var(--font-montserrat)] font-bold text-base md:text-[24px] lg:text-[36px] leading-[48px] text-white">
           {label}
         </span>
       </div>
     )
   }
   ```
   > **Width**: `lg:w-[175px]` only for desktop. Mobile/tablet: natural content width (no fixed width).
   > **Accessibility**: `role="group"` with `aria-label` on the outer div announces the full unit to screen readers (e.g., "3 days remaining"). The `aria-live="polite"` on the parent `CountdownTimer` div handles live update announcements.

**3.3 — CountdownTimer (test-first):**

3. **Write failing tests** `src/components/countdown/CountdownTimer.test.tsx` (TDD — test before implement):
   ```typescript
   // Mock dependencies
   const mockReplace = vi.fn()
   vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace }) }))
   vi.mock('@/hooks/useCountdown', () => ({ useCountdown: vi.fn() }))
   vi.mock('@/components/countdown/CountdownUnit', () => ({ CountdownUnit: () => <div /> }))

   // Test cases:
   // 1. isExpired=false → mockReplace NOT called
   // 2. isExpired=true  → mockReplace called with '/'
   // 3. isExpired transitions false→true (re-render) → mockReplace called exactly once
   // 4. Renders 3 CountdownUnit components with correct value/label props
   //    (days=3, hours=5, minutes=22 from mocked hook → 3 units with those values)
   // 5. Wrapper div has aria-live="polite" and aria-atomic="true"
   ```

4. **Implement** `src/components/countdown/CountdownTimer.tsx` (named export, `"use client"`):
   ```tsx
   'use client'
   import { useEffect } from 'react'
   import { useRouter } from 'next/navigation'
   import { useCountdown } from '@/hooks/useCountdown'
   import { CountdownUnit } from '@/components/countdown/CountdownUnit'

   type Props = { eventDateStr: string | undefined }

   export function CountdownTimer({ eventDateStr }: Props) {
     const { days, hours, minutes, isExpired } = useCountdown(eventDateStr)
     const router = useRouter()

     // Separate useEffect for redirect — dependency array [isExpired, router]
     useEffect(() => {
       if (isExpired) router.replace('/')
     }, [isExpired, router])

     // Note: before isMounted, values are all 0 (hook initial state) — SSR-safe, no hydration mismatch
     return (
       <div
         aria-live="polite"
         aria-atomic="true"
         className="flex flex-row gap-6 md:gap-10 lg:gap-[60px] items-center justify-center"
       >
         <CountdownUnit value={days} label="DAYS" aria-label={`${days} days remaining`} />
         <CountdownUnit value={hours} label="HOURS" aria-label={`${hours} hours remaining`} />
         <CountdownUnit value={minutes} label="MINUTES" aria-label={`${minutes} minutes remaining`} />
       </div>
     )
   }
   ```
   > **TimeRow `items-center`**: Design-style.md specifies `align-items: center` on the Time Row. Units are vertically centered relative to each other. Each unit's internal layout uses `items-start` independently.
   > **Redirect**: A separate `useEffect` with `[isExpired, router]` — fires once when `isExpired` transitions to `true`. Not merged with the countdown `useEffect` in the hook.

**3.5 — Page:**

5. **Implement** `src/app/countdown/page.tsx` (Server Component, `export default` required by Next.js — constitution exception for page files):
   ```tsx
   import type { Metadata } from 'next'
   import Image from 'next/image'
   import { CountdownTimer } from '@/components/countdown/CountdownTimer'

   export const metadata: Metadata = {
     title: 'SAA 2025 — Sắp ra mắt',
     description: 'Sun Annual Awards 2025 - Sự kiện sẽ bắt đầu sau',
   }

   export default function CountdownPage() {
     const eventDateStr = process.env.NEXT_PUBLIC_EVENT_START_DATE
     return (
       <main className="relative min-h-screen bg-[#00101A] overflow-hidden">
         {/* Background artwork — shared with Login screen */}
         <Image
           src="/images/login-bg.jpg"
           alt=""
           aria-hidden={true}
           fill
           sizes="100vw"
           className="object-cover z-0"
           priority
         />
         {/* Gradient overlay — 18deg diagonal, #00101A → transparent */}
         <div
           aria-hidden={true}
           className="absolute inset-0 z-[1] pointer-events-none"
           style={{
             background: 'linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)',
           }}
         />
         {/* Hero section — centered full-screen, py-12 mobile → py-24 desktop */}
         <section className="relative z-[2] flex flex-col items-center justify-center min-h-screen py-12 px-4 md:px-12 lg:py-24 lg:px-36 gap-6">
           <h1 className="font-[family-name:var(--font-montserrat)] font-bold text-[22px] md:text-[28px] lg:text-[36px] leading-[48px] text-white text-center">
             Sự kiện sẽ bắt đầu sau
           </h1>
           <CountdownTimer eventDateStr={eventDateStr} />
         </section>
       </main>
     )
   }
   ```
   > **CSS fallback**: If `login-bg.jpg` fails to load, `bg-[#00101A]` on `<main>` provides the dark background. For deeper fallback, the `--gradient-bg-fallback` CSS var already defined in globals.css can be applied.

### Phase 4: Middleware Integration (FR-004 + US3)

**Goal**: Server-side redirect when event đã bắt đầu.

1. **Write failing tests** — thêm vào `src/middleware.test.ts`:
   ```typescript
   // Countdown-specific test cases (add to existing describe block):
   // TC-C1: GET /countdown, no NEXT_PUBLIC_EVENT_START_DATE → 200 pass through (graceful)
   // TC-C2: GET /countdown, future event date → 200 pass through (allow viewing countdown)
   // TC-C3: GET /countdown, past event date → 307/308 redirect to '/'
   // TC-C4: GET /countdown, invalid date string → 200 pass through (graceful)
   // TC-C5: GET /countdown, unauthenticated, future date → NOT redirect to /login (public route)
   // TC-C6: GET /countdown, authenticated, past date → redirect to '/' (same as unauthenticated)
   ```

2. **Modify** `src/middleware.ts`:
   ```typescript
   // 1. Add '/countdown' to PUBLIC_ROUTES:
   const PUBLIC_ROUTES = ['/login', '/auth/callback', '/auth/error', '/countdown']

   // 2. Add countdown past-date redirect block immediately after isStaticAsset check,
   //    BEFORE the Supabase client + auth check (avoids unnecessary Supabase calls):
   export async function middleware(request: NextRequest) {
     const { pathname } = request.nextUrl

     if (isStaticAsset(pathname)) {
       return NextResponse.next()
     }

     // --- NEW BLOCK ---
     if (pathname === '/countdown') {
       const eventDateStr = process.env.NEXT_PUBLIC_EVENT_START_DATE
       if (eventDateStr) {
         const eventDate = new Date(eventDateStr)
         if (!isNaN(eventDate.getTime()) && eventDate <= new Date()) {
           return addSecurityHeaders(NextResponse.redirect(new URL('/', request.url)))
         }
       }
       // Date missing or invalid → fall through (graceful, FR-005)
     }
     // --- END NEW BLOCK ---

     // ... existing Supabase auth check follows unchanged ...
   }
   ```

### Phase 5: Responsive + Accessibility + E2E

**Goal**: WCAG 2.1 AA, all breakpoints verified, E2E coverage.

**5.1 — Verify responsive classes** (already applied inline in Phase 3):

| Component | Mobile (base) | Tablet (`md:`) | Desktop (`lg:`) |
|-----------|--------------|----------------|-----------------|
| Hero `px` | `px-4` | `md:px-12` | `lg:px-36` |
| Hero `py` | `py-12` | — | `lg:py-24` |
| `<h1>` font | `text-[22px]` | `md:text-[28px]` | `lg:text-[36px]` |
| TimeRow gap | `gap-6` | `md:gap-10` | `lg:gap-[60px]` |
| DigitCard w/h | `w-[48px] h-[76px]` | `md:w-[62px] md:h-[100px]` | `lg:w-[77px] lg:h-[123px]` |
| Digit font | `text-[46px]` | `md:text-[60px]` | `lg:text-[74px]` |
| Unit label | `text-base` (16px) | `md:text-[24px]` | `lg:text-[36px]` |
| Unit width | natural | natural | `lg:w-[175px]` |

**5.2 — Accessibility**:
- `aria-live="polite"` on TimeRow wrapper ✅ (applied in CountdownTimer)
- `aria-label` on each unit digit pair ✅ (applied in CountdownUnit)
- Background image: `aria-hidden={true}` ✅
- Gradient overlay: `aria-hidden={true}` ✅
- `<h1>` landmark present ✅
- No interactive elements (no focus management needed)

**5.3 — E2E** `tests/e2e/countdown.spec.ts`:
```typescript
// Test: P1-SC1 — all 3 units visible with labels
// Test: P1-SC2 — digits show numeric characters only
// Test: P1-SC5 — NEXT_PUBLIC_EVENT_START_DATE undefined → all "00", no error/crash
// Test: P1-SC6 — no JS console errors on page load
// Test: P2-SC1 — wait 65s → MINUTES decrements (or set short future date)
// Test: P3-SC2 — past event date → page redirects to '/' immediately
// Test: SC-002 — digit cards have visible glassmorphism styling (screenshot/visual)
// Test: SC-005 — no overflow at 375px viewport width
```

**5.4 — Manual checks**:
- 375px: countdown readable, no overflow, digits legible with monospace fallback
- 768px: tablet sizing applied (62×100px digit cards)
- 1440px: full desktop layout, 77×123px digit cards

---

## Testing Strategy

| Type | File | Focus | Coverage Goal |
|------|------|-------|---------------|
| Unit | `src/hooks/useCountdown.test.ts` | All calculation branches, clamping, tab-switching, cleanup | 90%+ |
| Unit | `src/components/countdown/CountdownTimer.test.tsx` | Redirect on isExpired, correct props to children, aria attrs | 80%+ |
| Unit | `src/components/countdown/CountdownUnit.test.tsx` | Zero-padding for values 0–99, role="group", aria-label | 80%+ |
| Unit | `src/components/countdown/DigitCard.test.tsx` | Rendering, opacity layer structure, z-index | 80%+ |
| Integration | `src/middleware.test.ts` (expanded) | `/countdown` public route, past/future/invalid date cases | 90%+ |
| E2E | `tests/e2e/countdown.spec.ts` | P1/P2/P3 acceptance scenarios per spec | Key flows |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|-----------|----------|-----------|
| `Date.now()` | `vi.setSystemTime(new Date(...))` | Control time in hook tests without spying |
| `setInterval` / `clearInterval` | `vi.useFakeTimers()` + `vi.advanceTimersByTime()` | Test timer ticks deterministically |
| `visibilitychange` | `document.dispatchEvent(new Event('visibilitychange'))` | Test tab-focus recovery behavior |
| `next/navigation` `useRouter` | `vi.mock('next/navigation', () => ({ useRouter: () => ({ replace: vi.fn() }) }))` | Assert redirect target without real navigation |
| `next/image` | Mock in vitest setup (already configured from Login implementation) | Avoid image loading errors in jsdom |
| `process.env.NEXT_PUBLIC_EVENT_START_DATE` | `vi.stubEnv('NEXT_PUBLIC_EVENT_START_DATE', '...')` | Test middleware and page with controlled date |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `login-bg.jpg` not exportable from Figma | Medium | Medium | CSS fallback: `bg-[#00101A]` on page wrapper; `--gradient-bg-fallback` already in globals.css |
| Digital Numbers font TTF unavailable | Medium | Medium | `fallback: ['monospace']` in `localFont` config — layout intact, visual degraded; document as known limitation |
| `next build` fails if font TTF missing | High if font not sourced | High | Must complete Phase 0 font sourcing BEFORE Phase 1 layout.tsx modification |
| SSR hydration mismatch | Low | Medium | `isMounted: false` initial state ensures server + first client render both show "00"; `useEffect` updates to real values after hydration |
| Browser `setInterval` throttled on inactive tab | Low | Low | `visibilitychange` listener in hook immediately recalculates on tab refocus |
| Middleware `new Date()` timezone | Low | Low | ISO 8601 with `+07:00` offset → `new Date('2025-12-31T18:00:00+07:00')` correctly parsed to UTC internally; comparison with `new Date()` (also UTC-based) is correct |
| Cloudflare edge `process.env` access | Low | Medium | `NEXT_PUBLIC_` vars are inlined at build time and available in edge runtime; test with `opennextjs-cloudflare preview` during Phase 4 |

---

## Open Questions

- [ ] **Digital Numbers font file**: Attempt Figma media export first. If unavailable, use "Digital-7" from dafont.com. Requires team decision on licensing if used commercially.
- [ ] **`NEXT_PUBLIC_EVENT_START_DATE` actual value**: What is the SAA 2025 event date/time with timezone? Required before setting up `.env.local` and production env.
- [ ] **`login-bg.jpg` status**: Not found in `public/images/`. Was it intentionally not downloaded during Login implementation, or was it lost? Confirm before Phase 0.
- [ ] **Authenticated user on `/countdown`**: When a logged-in user visits `/countdown` and event hasn't started, should they be allowed to view it (current plan: yes) or redirected to `/`? Spec says no auth required — current plan is correct but confirm with team.

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` complete (Status: Draft)
- [x] `design-style.md` self-contained với pixel-accurate values
- [x] `vitest.config.ts` + `playwright.config.ts` configured (from Login implementation)
- [x] Montserrat font loaded in `layout.tsx` (from Login implementation)
- [x] `src/libs/supabase/` clients exist — không cần cho screen này
- [ ] `NEXT_PUBLIC_EVENT_START_DATE` set in `.env.local` — needed for dev testing
- [ ] `public/images/login-bg.jpg` downloaded — needed for visual fidelity
- [ ] `src/app/fonts/digital-numbers.ttf` sourced — **required before `next build`**

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` để generate task breakdown chi tiết
2. **Resolve** before starting Phase 1:
   - Source `digital-numbers.ttf` (Phase 0 blocker for build)
   - Download or fallback `login-bg.jpg`
   - Confirm `NEXT_PUBLIC_EVENT_START_DATE` value and add to `.env.local`
3. **Begin** implementation: Phase 0 → Phase 1 → Phase 2 (TDD hook) → Phase 3 (UI) → Phase 4 (middleware) → Phase 5 (polish + E2E)
