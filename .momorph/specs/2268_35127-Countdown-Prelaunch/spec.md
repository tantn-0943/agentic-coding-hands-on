# Feature Specification: Countdown - Prelaunch

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-11
**Status**: Draft

---

## Overview

The Countdown - Prelaunch screen is a standalone full-screen page displayed before the SAA 2025 (Sun Annual Awards 2025) event goes live. It shows a real-time countdown timer broken into DAYS, HOURS, and MINUTES until the event starts. When the timer reaches zero, users are automatically redirected to the main event page.

This screen has no navigation (no header, no footer) — it exists purely to build anticipation and inform users how long until the event begins.

See `design-style.md` for all visual specifications and design tokens.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Countdown Timer (Priority: P1)

As a visitor landing on the pre-launch page, I want to see the time remaining until the SAA 2025 event starts, so that I know when to come back.

**Why this priority**: This is the core value of the screen. Without a functional countdown display, the page has no purpose.

**Independent Test**: Navigate to `/countdown` before the event date and verify three units (DAYS, HOURS, MINUTES) are visible with correct numeric values matching the time difference from `NEXT_PUBLIC_EVENT_START_DATE`.

**Acceptance Scenarios**:

1. **Given** the event has not started yet, **When** a visitor opens the pre-launch page, **Then** they see a heading "Sự kiện sẽ bắt đầu sau" and three time units: DAYS, HOURS, MINUTES — each showing the correct numeric value.
2. **Given** the event is more than 24 hours away, **When** the page loads, **Then** the DAYS unit shows a non-zero value (e.g., "03").
3. **Given** the event is less than 24 hours but more than 1 hour away, **When** the page loads, **Then** DAYS shows "00" and HOURS shows the correct remaining hours.
4. **Given** the event is less than 1 hour away, **When** the page loads, **Then** DAYS shows "00", HOURS shows "00", and MINUTES shows the remaining minutes.
5. **Given** `NEXT_PUBLIC_EVENT_START_DATE` is not set, **When** the page loads, **Then** all digits show "00" (graceful fallback, no crash).
6. **Given** the page is server-rendered (SSR), **When** the HTML arrives before JavaScript loads, **Then** all digits show "00" as placeholder (no hydration mismatch error in console).

---

### User Story 2 - Real-Time Countdown Updates (Priority: P2)

As a visitor on the pre-launch page, I want the countdown to update every second (or minute), so that I see an accurate live countdown without refreshing.

**Why this priority**: A static countdown is confusing. Real-time updates confirm the page is live and working.

**Independent Test**: Open the page and wait for at least 60 seconds — verify that the displayed MINUTES value decrements by 1 without a page reload.

**Acceptance Scenarios**:

1. **Given** the page is open, **When** 60 seconds pass, **Then** the MINUTES digit decrements by 1 (or HOURS decrements if MINUTES was "00").
2. **Given** the page is open and HOURS is about to change, **When** the time transitions (e.g., 01:00 → 00:59 remaining), **Then** HOURS decrements from "01" to "00" and MINUTES updates to "59".
3. **Given** the timer is active, **When** the user switches browser tabs and returns, **Then** the displayed time is still accurate (timer did not pause or drift significantly).

---

### User Story 3 - Automatic Redirect When Event Starts (Priority: P3)

As a visitor watching the countdown, I want to be automatically redirected to the main event page when the timer hits zero, so that I don't miss the event launch moment.

**Why this priority**: This is a "nice-to-have" enhancement that improves the experience at the critical moment. The core countdown (P1, P2) can ship without it.

**Independent Test**: Set `NEXT_PUBLIC_EVENT_START_DATE` to 5 seconds in the future, load the page, and verify the user is redirected to `/` (main page) within 1–2 seconds of that time.

**Acceptance Scenarios**:

1. **Given** the countdown is live, **When** the timer reaches 00 days, 00 hours, 00 minutes, **Then** the page automatically navigates to `/` (the main event page).
2. **Given** `NEXT_PUBLIC_EVENT_START_DATE` is in the past (event already started), **When** a user visits the pre-launch page, **Then** they are immediately redirected to `/`.

---

### Edge Cases

- **Env var missing**: If `NEXT_PUBLIC_EVENT_START_DATE` is undefined or invalid, the countdown shows "00" for all units and no redirect occurs.
- **Past date**: If the event start date is in the past, redirect to `/` immediately on page load.
- **Negative time**: Never display negative values — clamp all units to `00` minimum.
- **Day overflow**: DAYS is capped at a reasonable maximum (e.g., 99); values beyond this are displayed as "99".
- **Timezone**: Event date is stored with timezone offset (e.g., `+07:00`). Client-side `Date` correctly handles UTC vs local time.
- **Server-side rendering**: The countdown can render `00:00:00` on the server and hydrate with the correct value on the client to avoid SSR mismatch.

---

## UI/UX Requirements *(from Figma)*

For full visual specifications see `design-style.md`.

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Page Wrapper | Full-screen container, `bg: #00101A`, `relative overflow-hidden` | None |
| Background Artwork | Full-page cover image (`/images/login-bg.jpg`), absolute positioned, `z-0` | None |
| Gradient Overlay | Diagonal gradient overlay `18deg` from `#00101A` to transparent, absolute, `z-1`, `pointer-events-none` | None |
| Hero Section | Centered flex-column section, `py-24 px-36`, contains heading + time row | None |
| Countdown Heading | "Sự kiện sẽ bắt đầu sau" — Montserrat 700 36px white centered | None |
| Time Row | Flex-row container with 3 `CountdownUnit` components, `gap-[60px]` | None |
| CountdownUnit (DAYS) | Digit pair + "DAYS" label, shows days remaining (00–99+) | Auto-updates |
| CountdownUnit (HOURS) | Digit pair + "HOURS" label, shows hours (00–23) | Auto-updates |
| CountdownUnit (MINUTES) | Digit pair + "MINUTES" label, shows minutes (00–59) | Auto-updates |
| DigitCard | Individual digit tile — glassmorphism card `77×123px`. Card wrapper is full opacity; the frosted background layer inside is `opacity-50`. LED digit text is full brightness. | None |

### Navigation Flow

- **Route**: `/countdown` — this page is served at the `/countdown` path
- **From**: Direct URL visit to `/countdown` during pre-launch period; middleware may redirect root `/` here before launch
- **To**: `/` (main event page, Homepage SAA `2167:9026`) — automatic redirect when countdown reaches zero
- **Triggers**: Timer reaching `00:00:00`, or event start date already passed on page load
- **Middleware behavior**: Next.js middleware checks `NEXT_PUBLIC_EVENT_START_DATE`; if past, redirect `/countdown` → `/`; if future, allow through

> **Figma layer note**: The heading node (`2268:35137`) is named "Awards Information Navigation Links" in the Figma layer panel — this is a **mislabeled layer name** in the Figma file. The actual text content is "Sự kiện sẽ bắt đầu sau". There is **no separate navigation links component** on this screen.

### Visual Requirements

- **Responsive breakpoints**: Mobile (< 768px), Tablet (768–1023px), Desktop (≥ 1024px) — see `design-style.md` Responsive Specifications
- **Animations/Transitions**: Digit values update instantly every second (flip animation optional — 300ms ease-in-out). Screen transition to event page: 500ms ease-out.
- **Accessibility**: WCAG 2.1 AA — countdown values exposed via `aria-live="polite"` for screen readers. Time units labeled with `aria-label` (e.g., "3 days remaining"). Background image uses `aria-hidden`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a real-time countdown showing DAYS, HOURS, and MINUTES remaining until `NEXT_PUBLIC_EVENT_START_DATE`.
- **FR-002**: System MUST update the countdown display at least once per minute (every second preferred).
- **FR-003**: System MUST redirect users from `/countdown` to `/` when the countdown reaches zero.
- **FR-004**: System MUST redirect users from `/countdown` to `/` immediately if `NEXT_PUBLIC_EVENT_START_DATE` is already in the past.
- **FR-005**: System MUST display "00" for all units when `NEXT_PUBLIC_EVENT_START_DATE` is missing or invalid — no crash.
- **FR-006**: System MUST clamp all time unit values to a minimum of `00`.
- **FR-007**: Each time unit MUST display as a two-digit zero-padded number (e.g., "03", not "3").

### Technical Requirements

- **TR-001**: Countdown MUST be implemented as a Client Component using `useEffect` + `setInterval` for real-time updates.
- **TR-002**: Initial render MUST be safe for SSR — use `00:00:00` as the server-rendered default, hydrate on client to avoid hydration mismatch.
- **TR-003**: `NEXT_PUBLIC_EVENT_START_DATE` MUST be an ISO 8601 string with timezone offset (e.g., `2025-12-31T18:00:00+07:00`).
- **TR-004**: The "Digital Numbers" font MUST be loaded via `@font-face` in `globals.css` or `next/font/local` pointing to `public/fonts/digital-numbers.ttf`.
- **TR-005**: The page MUST be compatible with Cloudflare Workers Edge Runtime (no Node.js-only APIs).
- **TR-006**: Background image MUST be lazy-loaded or use `priority` prop only if above the fold (it is — use `priority`).

### State Management

| State | Scope | Type | Initial Value | Notes |
|-------|-------|------|---------------|-------|
| `days` | Local (`CountdownTimer` component) | `number` | `0` | SSR-safe default |
| `hours` | Local | `number` | `0` | SSR-safe default |
| `minutes` | Local | `number` | `0` | SSR-safe default |
| `isMounted` | Local | `boolean` | `false` | Guards against SSR hydration mismatch; set to `true` in `useEffect` |
| `isExpired` | Local | `boolean` | `false` | `true` when countdown reaches zero → triggers redirect |

**Loading/Hydration states:**
- **Server render**: All digits display "00" — no `Date` calculations on server
- **Client hydration**: `useEffect` runs on mount, sets `isMounted = true`, calculates actual time diff, starts `setInterval`
- **Timer running**: `setInterval` fires every second, recalculates remaining time from `NEXT_PUBLIC_EVENT_START_DATE`
- **Expired**: `isExpired` becomes `true` → `useRouter().replace('/')` triggered

**No global state needed** — this screen is self-contained with no auth or user data.

### Key Entities *(if feature involves data)*

- **EventConfig**: Configuration object containing the event start date/time.
  - `startDate: Date` — parsed from `NEXT_PUBLIC_EVENT_START_DATE`
- **CountdownTime**: Computed value object.
  - `days: number`, `hours: number`, `minutes: number`, `seconds: number` (seconds for internal tick; only days/hours/minutes displayed)

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `NEXT_PUBLIC_EVENT_START_DATE` (env var) | — | Provides the event start datetime for countdown calculation | Predicted (env var, no API call) |
| `/` | GET | Redirect destination when countdown expires | Exists |

> **Note**: No API endpoint is required for this screen. The event date is provided via environment variable at build time (or runtime via Next.js `NEXT_PUBLIC_` prefix). If a dynamic date is needed (admin-configurable), a future `/api/event/info` endpoint could be added.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Countdown displays correct DAYS, HOURS, MINUTES values within ±1 second of actual remaining time.
- **SC-002**: All three digit cards render with glassmorphism styling (blur, opacity, border) matching the Figma design.
- **SC-003**: Countdown auto-redirects to `/` within 2 seconds of the event start time.
- **SC-004**: Page renders without JavaScript errors in Chrome, Firefox, and Safari (latest 2 versions each).
- **SC-005**: Page is fully responsive — countdown readable on 375px mobile and 1512px desktop without layout overflow.
- **SC-006**: "Digital Numbers" font renders correctly for digit characters `0–9`.

---

## Out of Scope

- Seconds display (Figma shows only DAYS / HOURS / MINUTES — no seconds unit)
- Language selector or header navigation (this screen has no header)
- Authentication — this page is publicly accessible (no auth required)
- Admin UI for changing the event date (env var is sufficient for MVP)
- Countdown flip card animation (optional enhancement, not in Figma design)
- Push notifications or email reminders when event is near

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — not required for this screen
- [ ] Database design completed — not required for this screen
- [x] Screen flow documented (`.momorph/contexts/SCREENFLOW.md`)
- [x] Design style complete (`.momorph/specs/2268_35127-Countdown-Prelaunch/design-style.md`)
- [ ] "Digital Numbers" font file sourced (`public/fonts/digital-numbers.ttf`)
- [x] Background artwork exists (`public/images/login-bg.jpg` — shared with Login screen)

---

## Notes

- This screen is shown during the **pre-launch period** only. Once the event starts, users should always land on the main event page. Consider using Next.js middleware to redirect `/countdown` → `/` post-launch, or conditionally serving this page based on date comparison.
- The "Digital Numbers" font is a 7-segment LED-style custom font. If the font file is unavailable, fall back to `monospace` — the layout will still work but look different.
- The background artwork (`login-bg.jpg`) is shared with the Login screen. Ensure it is served with appropriate cache headers.
- Server-side: Calculate the time diff on the client only to avoid hydration mismatch. The server renders `00:00:00` as a placeholder; on mount, the correct values are set.
