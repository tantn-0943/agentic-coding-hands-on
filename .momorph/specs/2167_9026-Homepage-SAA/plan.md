# Implementation Plan: Homepage SAA

**Frame**: `2167_9026-Homepage-SAA`
**Date**: 2026-03-12
**Spec**: `specs/2167_9026-Homepage-SAA/spec.md`

---

## Summary

Xây dựng trang chủ SAA 2025 (`src/app/page.tsx`) dưới dạng **Server Component** — hiển thị hero section, countdown real-time, event info, award cards (6 thẻ), Sun* Kudos promo, với Header/Footer/WidgetButton là layout chung. Countdown được tách thành Client Component (`CountdownSection`) tái dùng `useCountdown` hook. Award data được định nghĩa trong static config `src/lib/awards.ts`. Trang yêu cầu auth (middleware redirect về `/login` nếu chưa đăng nhập).

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js 15 App Router
**Primary Dependencies**: TailwindCSS 4, next/image, next/font (Montserrat)
**Database**: N/A (static data cho awards; notifications API predicted)
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: Local Client Component state (`useCountdown` hook)
**API Style**: REST (GET `/api/notifications` — predicted, read-only)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Rule | Principle | Plan Approach | Status |
|------|-----------|---------------|--------|
| TypeScript strict, no `any` | I. Clean Code | All new files TypeScript, types defined in `src/types/` | ✅ Compliant |
| Server Components by default | II. Next.js | `page.tsx` = Server Component; only `CountdownSection` is `'use client'` | ✅ Compliant |
| `next/image` for all images | II. Next.js | Background, ROOT FURTHER logo, award card images all via `next/image` | ✅ Compliant |
| `export metadata` from page | II. Next.js | `export const metadata: Metadata` in `page.tsx` | ✅ Compliant |
| `export default` for pages | II. Next.js | Next.js App Router **requires** `export default` for `page.tsx`; constitution's "named exports where possible" applies to non-page components only | ✅ Compliant (required by framework) |
| No Node.js built-ins (Cloudflare) | III. Cloudflare | `awards.ts` is plain JS object; API route uses Supabase SDK (edge-compatible); no `fs`/`path` used | ✅ Compliant |
| Supabase `@supabase/ssr` server-side | IV. Supabase | Notifications route handler uses `@supabase/ssr` createClient; RLS on `notifications` table | ✅ Compliant |
| Mobile-first responsive CSS | V. Responsive | Tailwind mobile-first: base → `md:` → `lg:`; award grid 1→2→3 cols; digit card responsive sizing | ✅ Compliant |
| OWASP: Auth on all routes | VI. Security | Middleware already protects `/`; notifications API validates Supabase session | ✅ Compliant |
| Security headers | VI. Security | Middleware already adds `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy` | ✅ Compliant |
| TDD: tests before/alongside code | VII. TDD | Unit tests for `CountdownSection`, `AwardCard`; E2E for P1 user flow | ✅ Compliant |
| Shared logic in `src/lib/` or `src/hooks/` | I. Clean Code | `src/lib/awards.ts` for static data; `useCountdown` hook already in `src/hooks/` | ✅ Compliant |

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| None | — | — |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `src/components/homepage/` cho các sections; `src/components/layout/` cho Header, Footer, WidgetButton (global shared)
- **Styling Strategy**: Tailwind utilities + CSS variables từ `globals.css` (token `--color-accent`, `--color-header-bg`, etc.) — không dùng CSS Modules
- **Data Fetching**:
  - Award data: static import từ `src/lib/awards.ts` — không cần fetch
  - Notification badge count: Client Component fetch `GET /api/notifications` khi mount
  - Countdown: Client Component, `useCountdown` hook với `process.env.NEXT_PUBLIC_EVENT_START_DATE`

### Backend Approach

- **API Design**: Route handler `src/app/api/notifications/route.ts` — `GET`, trả về danh sách notifications của user hiện tại (dùng Supabase session)
- **Data Access**: Supabase SDK (`@supabase/ssr` server client) — query bảng `notifications` với RLS
- **Validation**: Zod schema validate query params nếu có; không cần body validation cho GET

### Integration Points

- **Existing Services**: `src/middleware.ts` (auth redirect đã có) — `/` đã là protected route; không cần thay đổi middleware
- **Shared Components**:
  - `src/hooks/useCountdown.ts` → tái dùng **trực tiếp** trong `CountdownSection`
  - `src/components/countdown/CountdownUnit.tsx` → tái dùng trong `CountdownSection`
  - `src/components/countdown/DigitCard.tsx` → tái dùng qua `CountdownUnit`
  - `src/components/ui/Logo.tsx` → tái dùng trong Header
  - `src/components/auth/LanguageSelector.tsx` → tái dùng trong Header
- **⚠ DO NOT reuse `CountdownTimer.tsx` on Homepage**: `CountdownTimer` contains `router.replace('/')` on expire — this would cause an **infinite redirect loop** when event is past on the Homepage. `CountdownSection` must use `useCountdown` hook + `CountdownUnit` directly, bypassing `CountdownTimer` entirely.
- **API Contracts**: Notifications API — predicted GET `/api/notifications` trả về `{ unreadCount: number }`

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/2167_9026-Homepage-SAA/
├── spec.md              # Feature specification ✅
├── design-style.md      # Visual specs ✅
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame.png        # Figma reference screenshot ✅
```

### New Files

| File | Type | Description |
|------|------|-------------|
| `src/app/api/notifications/route.ts` | Route Handler | GET notifications unread count for current user (Supabase session) |
| `src/components/homepage/HeroSection.tsx` | Server Component | Hero artwork (background + gradient), ROOT FURTHER logo, event info block, CTA buttons |
| `src/components/homepage/CountdownSection.tsx` | **Client Component** (`'use client'`) | "Coming soon" label + countdown units; uses `useCountdown` + `CountdownUnit` directly (NOT `CountdownTimer`) |
| `src/components/homepage/RootFurtherSection.tsx` | Server Component | Long-form description text block (Node `5001:14827`) |
| `src/components/homepage/AwardsSection.tsx` | Server Component | Section header + 3-col grid of 6 award cards; reads from `awards.ts` |
| `src/components/homepage/AwardCard.tsx` | Server Component | Single award card: image + title + description (line-clamp-2) + Chi tiết link |
| `src/components/homepage/KudosSection.tsx` | Server Component | Sun* Kudos promo block: label + title + desc + Chi tiết button + image |
| `src/components/layout/Header.tsx` | **Client Component** (`'use client'`) | Sticky nav: logo + 3 nav links (usePathname active state) + lang switcher + notification bell + avatar |
| `src/components/layout/Footer.tsx` | Server Component | Logo + nav links + copyright |
| `src/components/layout/WidgetButton.tsx` | **Client Component** (`'use client'`) | Fixed pill button bottom-right; toggle menu on click |
| `src/lib/awards.ts` | Static Config | 6 award objects: `{ id, slug, name, description, imageUrl, linkSlug }` |
| `src/types/awards.ts` | TypeScript Types | `Award` type definition |
| `src/types/notifications.ts` | TypeScript Types | `NotificationsResponse` type: `{ unreadCount: number }` |

> **Note**: `src/lib/` directory does not yet exist and must be created.

### Modified Files

| File | Changes |
|------|---------|
| `src/app/page.tsx` | Complete rewrite: Server Component, export `metadata`, compose all sections (Header, HeroSection, RootFurtherSection, AwardsSection, KudosSection, Footer, WidgetButton) |
| `src/app/globals.css` | Add CSS variable: `--gradient-overlay-homepage: linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` |

### Source Code Tree

```text
src/
├── app/
│   ├── page.tsx                          # MODIFY: rewrite as Homepage Server Component
│   ├── globals.css                       # MODIFY: add --gradient-overlay-homepage var
│   └── api/
│       └── notifications/
│           └── route.ts                  # NEW
├── components/
│   ├── homepage/                         # NEW directory
│   │   ├── HeroSection.tsx               # Server
│   │   ├── CountdownSection.tsx          # Client ('use client')
│   │   ├── RootFurtherSection.tsx        # Server
│   │   ├── AwardsSection.tsx             # Server
│   │   ├── AwardCard.tsx                 # Server
│   │   └── KudosSection.tsx              # Server
│   └── layout/                           # NEW directory
│       ├── Header.tsx                    # Client ('use client')
│       ├── Footer.tsx                    # Server
│       └── WidgetButton.tsx              # Client ('use client')
├── lib/                                  # NEW directory
│   └── awards.ts                         # NEW
└── types/
    ├── awards.ts                         # NEW
    └── notifications.ts                  # NEW
    (auth.ts, countdown.ts already exist)
```

### Dependencies

No new packages required. All needed libraries already in project:
- `next/image` ✅
- `next/navigation` (`usePathname`) ✅
- `@supabase/ssr` ✅
- TailwindCSS 4 ✅

---

## Implementation Strategy

### Phase 0: Asset Preparation

- Verify `public/images/login-bg.jpg` exists (shared hero background)
- Verify `public/images/root-further-logo.png` exists (shared with Login page)
- Download award card images từ Figma: `public/images/awards/` (6 images: `top-talent.jpg`, `top-project.jpg`, `top-project-leader.jpg`, `best-manager.jpg`, `signature-creator.jpg`, `mvp.jpg`)
- **Add to `src/app/globals.css`**: `--gradient-overlay-homepage: linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` (distinct from `--gradient-overlay-countdown` which uses 18deg)

### Phase 1: Foundation (Unblocked Prerequisites)

- Define `Award` type trong `src/types/awards.ts`
- Create `src/lib/awards.ts` với 6 award entries (slug, name, description, imageUrl)
- Create `src/app/api/notifications/route.ts` (GET, Supabase session → unreadCount)

### Phase 2: Core Features — US1 (P1: Hero + Countdown + Awards)

**Goal**: Trang chủ load được, hiển thị hero, countdown, 6 award cards, CTA buttons

- Implement `CountdownSection.tsx` (Client Component, `'use client'`):
  - Uses `useCountdown(process.env.NEXT_PUBLIC_EVENT_START_DATE)` directly
  - Uses `CountdownUnit` (reused from `src/components/countdown/CountdownUnit.tsx`)
  - Contains ROOT FURTHER `<Image>` + "Coming soon" label (hidden if `isExpired`) + countdown units row
  - Shows `isMounted ? value : 0` for each digit (SSR hydration safety)
  - **Does NOT use `CountdownTimer.tsx`** (that component redirects to `/` on expire — infinite loop)
- Implement `HeroSection.tsx` (Server Component):
  - Background `<Image>` (`login-bg.jpg`, fill, object-cover, z-0)
  - Gradient overlay div (`--gradient-overlay-homepage`, z-1)
  - Content section (z-2, flex-col, px-36, py-24, gap-[120px]):
    - `<CountdownSection>` (client island)
    - `<EventInfoBlock>` (inline: date + venue items, flex row, gold text)
    - CTA buttons row: "ABOUT AWARDS" (`href="/award-information"`) + "ABOUT KUDOS" (`href="/sun-kudos"`)
- Implement `AwardCard.tsx` (`href="/award-information#${slug}"`, image + title + desc line-clamp-2 + Chi tiết link)
- Implement `AwardsSection.tsx` (Server Component, section header + 3-col grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3)
- Rewrite `src/app/page.tsx` (Server Component, export metadata, compose: Header + Hero + RootFurther + Awards + Kudos + Footer + WidgetButton)

**Independent test**: `yarn dev` → `/` → logo visible, ROOT FURTHER image visible, 3 countdown units, 6 award cards, "ABOUT AWARDS" button clickable

### Phase 3: Extended Features

**US2 (P2)**: Countdown real-time — already handled by `useCountdown` (1s interval, visibilitychange). Verify in `CountdownSection`:
  - Shows `00 00 00` before hydration (`isMounted = false`)
  - Hides "Coming soon" label when `isExpired = true`
  - No redirect on expire (homepage stays on `/`)

**US3 (P3)**: Kudos section
- Implement `RootFurtherSection.tsx` (Server Component: long-form description text, px-36, 16px white Montserrat, Node `5001:14827`)
- Implement `KudosSection.tsx` (Server Component: label "Phong trào ghi nhận" + title "Sun* Kudos" + desc + Chi tiết button → `href="/sun-kudos"` + image right side, bg #0F0F0F, max-w-[1224px])

**US4 (P2)**: Header + Footer
- Implement `Header.tsx` (Client Component, `'use client'`):
  - Logo (`Logo.tsx` reused) + 3 nav links (`usePathname()` active state: text `#FFEA9E` + bg `#FFEA9E/10`)
  - `LanguageSelector` (reused from `src/components/auth/LanguageSelector.tsx`)
  - Notification bell: fetch `GET /api/notifications` on mount → show red badge if `unreadCount > 0`; hide badge on API failure (no error toast)
  - Avatar icon → dropdown with Profile / Sign out (Admin Dashboard if admin role)
- Implement `Footer.tsx` (Server Component: Logo + 3 nav links + copyright text)
- Header + Footer are rendered in `src/app/page.tsx`. Decision: **keep in page.tsx for now**. Promote to `src/app/(main)/layout.tsx` when Awards and Sun* Kudos pages are built.

**US5 (P3)**: Widget Button
- Implement `WidgetButton.tsx` (Client Component: fixed `bottom-8 right-8 z-50`, 106×64px pill `#FFEA9E`, click → local `isOpen` boolean toggle; menu content is placeholder pending Q1 answer)

### Phase 4: Polish & Accessibility

- Verify `aria-live="polite"` + `aria-atomic="true"` on countdown timer container (in `CountdownSection`)
- Verify `alt` text on all images: hero bg (`aria-hidden`), ROOT FURTHER (`"ROOT FURTHER – SAA 2025"`), award card images, logos
- Verify keyboard navigation: all interactive elements (nav links, CTA buttons, award cards, footer links, widget button) are keyboard-focusable with `focus-visible:outline-2 focus-visible:outline-[#FFEA9E]`
- Verify hover transitions: buttons 150ms ease, award card `translateY(-4px)` + box-shadow 200ms ease-out
- Responsive check at 375px (1-col awards, flex-col CTAs), 768px (2-col awards), 1440px (3-col awards, 144px padding)
- Verify `yarn build` passes with no TypeScript errors and no Cloudflare runtime violations
- Run `yarn lint` — no ESLint errors

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/UI interactions**: CountdownSection hydration, AwardCard click navigation, Header active state
- [x] **External dependencies**: `GET /api/notifications` — Supabase session validation
- [x] **User workflows**: P1 flow (load homepage → see countdown → click award card → navigate to award page)

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | CountdownSection shows 00/00/00 pre-hydration; updates after mount; hides "Coming soon" when expired |
| App ↔ External API | Yes | Notification badge shows count; hides when 0; hides when API fails |
| Cross-platform | Yes | Responsive: 375px (1-col awards), 768px (2-col), 1440px (3-col) |

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| `useCountdown` hook | Real (unit test with fake timers) | Core logic, must be tested directly |
| Supabase client (notifications) | Mock in unit/integration tests | Avoids DB dependency in CI |
| `Date.now()` in countdown | Mock with `vi.setSystemTime()` | Deterministic time-based tests |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Homepage loads with hero, ROOT FURTHER image, event info, 2 CTA buttons
   - [ ] 6 award cards render with correct titles and Chi tiết links
   - [ ] Clicking "ABOUT AWARDS" navigates to `/award-information`
   - [ ] Clicking award card navigates to `/award-information#[slug]`
   - [ ] Header shows "About SAA 2025" as active (yellow) on homepage

2. **Error Handling**
   - [ ] `NEXT_PUBLIC_EVENT_START_DATE` not set → countdown shows `00 00 00`
   - [ ] `NEXT_PUBLIC_EVENT_START_DATE` invalid string → countdown shows `00 00 00`
   - [ ] Notifications API 500 → badge stays hidden, no error toast

3. **Edge Cases**
   - [ ] Event date in past → "Coming soon" hidden, countdown frozen at `00`
   - [ ] days > 99 → countdown shows `99`
   - [ ] Award card description >2 lines → ellipsis (`line-clamp-2`)
   - [ ] Switch tab for 2 min → countdown shows correct value on return (`visibilitychange`)

### Tooling & Framework

- **Test framework**: Vitest (unit), Playwright (E2E)
- **Supporting tools**: `vi.setSystemTime()` for countdown tests; MSW or direct Supabase mock for notifications
- **CI integration**: `yarn test` (unit) + `yarn test:e2e` (Playwright) in GitHub Actions

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| `useCountdown` hook | 90%+ | High |
| Award card navigation | 85%+ | High |
| Notification badge logic | 75%+ | Medium |
| Countdown edge cases | 80%+ | High |

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| `CountdownTimer` redirect reuse bug | Confirmed | High | **Fixed in plan**: `CountdownSection` uses `useCountdown` + `CountdownUnit` directly, NOT `CountdownTimer` |
| Award data source undefined (static vs API) | Medium | Low | Use static `awards.ts` as default; `Award` type defined so API swap only changes data source |
| Sun* Kudos URL unknown | Low | Low | Use `/sun-kudos` per SCREENFLOW.md; href is a string constant easy to update |
| Widget Button menu content unknown | Medium | Low | Implement toggle only; render empty `<ul>` placeholder marked TODO |
| Digital Numbers font not available | High | Low | `Courier New` fallback already in `globals.css`; documented as tech debt |
| Notifications API not yet built | High | Medium | Build `GET /api/notifications` as Phase 1; fallback `{ unreadCount: 0 }` if API fails |
| Header/Footer promote to shared layout | Low | Medium | Implement in `page.tsx`; promote to `(main)/layout.tsx` when sibling pages are built (clear trigger) |
| `src/lib/` directory doesn't exist | High (certain) | Low | Create directory as first step in Phase 1 |

### Estimated Complexity

- **Frontend**: High (7 new components, responsive grid, animation states)
- **Backend**: Low (1 simple notifications endpoint)
- **Testing**: Medium (countdown timer tests need fake timers; E2E for P1 nav flow)

---

## Open Questions

- [ ] **Q1**: Widget Button menu items — what actions? (Navigate to Awards? Kudos? Back to top?) — Implement toggle-only until confirmed
- [ ] **Q2**: Award data source — confirm static `awards.ts` is final (no CMS/API) for v1
- [ ] **Q3**: Sun* Kudos route — is it `/sun-kudos` or another slug?

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (5 user stories, 8 FR/TR, reviewed ×4 passes)
- [x] `design-style.md` complete (23 components, all states, responsive values)
- [x] `useCountdown` hook implemented and tested (`src/hooks/useCountdown.ts`)
- [x] Background image `public/images/login-bg.jpg` available
- [x] ROOT FURTHER logo `public/images/root-further-logo.png` available
- [x] Middleware auth at `src/middleware.ts` protects `/` (redirect to `/login` if unauthenticated)
- [ ] Award card images downloaded to `public/images/awards/`
- [ ] `GET /api/notifications` backend spec confirmed

### External Dependencies

- `NEXT_PUBLIC_EVENT_START_DATE` environment variable — must be set in `.env.local` and Cloudflare environment
- Supabase `notifications` table (or equivalent) with RLS — needed for notification badge

---

## Notes

- **⚠ CountdownTimer redirect**: `src/components/countdown/CountdownTimer.tsx` contains `router.replace('/')` on `isExpired`. On the `/countdown` page this makes sense (redirect after countdown expires). On the Homepage, reusing it would cause an infinite redirect loop. `CountdownSection.tsx` MUST use `useCountdown` + `CountdownUnit` directly.
- **CountdownSection structure**: Contains ROOT FURTHER `<Image>` (static, can live in Client Component fine), "Coming soon" label (`hidden` when `isExpired`), and countdown units row. Digits display `isMounted ? value : 0` to prevent SSR/client hydration mismatch.
- **Header/Footer placement**: Rendered in `src/app/page.tsx`. Trigger to promote: when `award-information` or `sun-kudos` page is built, extract into `src/app/(main)/layout.tsx` shared group layout.
- **EventInfoBlock**: Implemented inline inside `HeroSection.tsx` (not a separate file) — two items (date + venue) in a `flex row gap-8` container. Keeps component count manageable.
- **AwardsSectionHeader**: Implemented inline inside `AwardsSection.tsx` — just a caption + heading element, not worth a separate file.
- **`globals.css` change**: Add `--gradient-overlay-homepage: linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)` in Phase 0. Distinct from `--gradient-overlay-countdown` (18deg angle).
- **Cloudflare compliance**: `awards.ts` is plain JS — safe. Notifications route uses Supabase SDK (edge-compatible). No `fs`, `path`, or Node crypto used anywhere.
- **Notification API response**: Simplified to `{ unreadCount: number }` — Header only needs to know if there are unread notifications, not the full list.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** Phase 0 (asset download) + Phase 1 (foundation) in parallel
