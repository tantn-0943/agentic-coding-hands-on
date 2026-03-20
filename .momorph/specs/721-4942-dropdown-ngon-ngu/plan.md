# Implementation Plan: Dropdown Ngôn Ngữ (Language Selector Dropdown)

**Frame**: `721:4942-dropdown-ngon-ngu`
**Date**: 2026-03-20
**Spec**: `specs/721-4942-dropdown-ngon-ngu/spec.md`

---

## Summary

Implement a language selector dropdown that allows users to switch the application UI between Vietnamese (VN) and English (EN). The component extends the existing `LanguageSelector` trigger button with a dropdown menu, a `useLocale` hook for client-side locale state, and cookie-based persistence. No i18n infrastructure exists in the project yet — this plan creates the foundation (locale context + cookie) without implementing full translation (out of scope per spec).

**Key technical decisions**: Client-side locale context (not URL-based i18n routing) for Cloudflare Workers edge compatibility, cookie persistence for SSR hydration, `next/image` for flag icons (matching existing pattern + Constitution Principle II).

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Supabase SSR
**Database**: N/A — no database changes required
**Testing**: Vitest (unit), Playwright (E2E)
**State Management**: React Context + cookie (local state for dropdown open/close)
**API Style**: N/A — client-side only feature

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **Principle I** — Clean Code: Feature-based files under `src/components/auth/`, shared hook + context provider co-located in `src/hooks/useLocale.tsx`
- [x] **Principle II** — Next.js: Client Component for interactivity, `next/image` for flag SVGs
- [x] **Principle III** — Cloudflare Edge: Client-side locale context; no Node.js APIs. Cookie read/write via `document.cookie` (client) and middleware (server).
- [x] **Principle IV** — Supabase: N/A — no database interaction
- [x] **Principle V** — Responsive: Same fixed-width dropdown on all breakpoints, right-aligned positioning
- [x] **Principle VI** — OWASP: No user input processing, cookie is non-sensitive (locale preference)
- [x] **Principle VII** — TDD: Tests planned for hook, dropdown component, and E2E flow

**Violations**: None — no new libraries required.

---

## Architecture Decisions

### Frontend Approach

- **Locale Strategy**: Client-side React Context (`LocaleProvider`) wrapping the app. Chosen over Next.js URL-based i18n routing because:
  1. Cloudflare Workers edge runtime has limited support for Next.js i18n middleware rewrites
  2. Only 2 languages — context switch is instant with no route change
  3. Spec requires "no full page reload" (TR-001)
  4. Cookie-based persistence for SSR hydration (FR-007)

- **Component Structure**: Extend existing `LanguageSelector.tsx` to include dropdown. The trigger button already exists with correct styling — add dropdown panel + state management.

- **State Architecture**:
  - `useLocale()` hook — reads/writes locale from React Context + cookie. Shared across app.
  - `LanguageSelector` component — local `isOpen` + `focusedIndex` state for dropdown UI.
  - Cookie name: `NEXT_LOCALE` (standard Next.js convention).

- **Flag Icons**: Keep `next/image` with SVG files from `public/icons/` (existing pattern). Add missing `en-flag.svg`.

- **Cookie Attributes**: `NEXT_LOCALE` cookie settings: `Path=/; SameSite=Lax; Max-Age=31536000` (1 year). No `Secure` flag required (non-sensitive data). No `HttpOnly` (needs client-side read/write via `document.cookie`).

### Integration Points

- **Existing Components**:
  - `LanguageSelector` (`src/components/auth/LanguageSelector.tsx`) — currently trigger-only, will be extended with dropdown
  - `Header` (`src/components/layout/Header.tsx`) — already renders `<LanguageSelector />`
  - Login page (`src/app/(auth)/login/page.tsx`) — already renders `<LanguageSelector />`

- **New Shared Infrastructure**:
  - `LocaleProvider` context + `useLocale()` hook — co-located in `src/hooks/useLocale.tsx`. Provider wraps app in layout.tsx. Hook consumed by LanguageSelector and (future) translation utilities.

- **Data Flow**:
  ```
  User clicks trigger button → dropdown opens
  User selects language → useLocale().setLocale('en')
    → Updates React Context (re-render)
    → Writes cookie NEXT_LOCALE=en
    → LanguageSelector trigger updates flag + label
    → Dropdown closes
  On page reload → middleware reads NEXT_LOCALE cookie → passes to LocaleProvider initial value
  ```

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/721-4942-dropdown-ngon-ngu/
├── spec.md              # Feature specification ✅
├── design-style.md      # Design specifications ✅
├── plan.md              # This file ✅
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame-image.md   # Figma reference ✅
```

### Source Code (affected areas)

```text
# New Files
src/
├── hooks/
│   └── useLocale.tsx               # LocaleProvider context + useLocale hook
├── types/
│   └── locale.ts                   # Locale type definitions + LOCALES constant
└── components/auth/
    └── LanguageDropdown.tsx         # Dropdown panel component

# Modified Files
src/
├── components/auth/
│   └── LanguageSelector.tsx        # Refactor to named export, add dropdown + useLocale integration
├── components/layout/
│   └── Header.tsx                  # Update import: default → named import of LanguageSelector
├── app/
│   ├── layout.tsx                  # Wrap children with <LocaleProvider>
│   └── (auth)/login/page.tsx       # Update import: default → named import of LanguageSelector

# Assets
public/icons/
└── en-flag.svg                     # UK flag icon (new)

# Tests
tests/
├── unit/
│   ├── useLocale.test.ts           # Hook unit tests (cookie read/write, default, context)
│   └── LanguageDropdown.test.tsx   # Dropdown component tests (render, click, states)
└── e2e/
    └── language-selector.spec.ts   # E2E flow test (open, switch, persist, reload)
```

### Dependencies to Add

None — all capabilities exist in the current stack.

---

## Implementation Strategy

### Phase 1: Setup & Foundation

1. **Add missing asset**: Download/create `en-flag.svg` (UK flag) to `public/icons/`
2. **Create locale types**: `Locale` type + `LOCALES` constant array in `src/types/locale.ts`
3. **Create `LocaleContext`**: Provider + `useLocale()` hook with cookie read/write
4. **Wrap app**: Add `<LocaleProvider>` to root `layout.tsx`

### Phase 2: Core UI — Dropdown Component (US1 + US2)

1. **Create `LanguageDropdown`** component: dropdown panel with 2 language options, matching design-style.md exactly (dark bg, gold border, selected highlight, hover states)
2. **Extend `LanguageSelector`**: Add `isOpen` state, toggle on click, render `LanguageDropdown` when open
3. **Wire to locale context**: On option click → `setLocale()` → close dropdown
4. **Click-outside handler**: Close dropdown when clicking outside (TR-002)
5. **Escape key handler**: Close dropdown on Escape press
6. **Open/close animation**: opacity + translateY, 150ms ease-out

### Phase 3: Accessibility (US3)

1. **ARIA attributes**: `role="listbox"`, `role="option"`, `aria-selected`, `aria-expanded`, `aria-haspopup`
2. **Keyboard navigation**: Arrow Up/Down moves focus, Enter selects, Escape closes
3. **Focus management**: `focusedIndex` state, auto-focus first item on open, return focus to trigger on close

### Phase 4: Polish & Testing

1. **Unit tests**: `useLocale` hook (read/write cookie, default value), `LanguageDropdown` (render, click, states)
2. **E2E test**: Open dropdown → switch language → verify button updates → reload → verify persistence
3. **Responsive check**: Verify right-alignment on mobile (375px), tablet (768px), desktop (1440px)

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Cookie not read on SSR (Cloudflare edge) | Medium | Medium | Read cookie in middleware, pass as prop to LocaleProvider. Test with `wrangler dev`. |
| `next/image` SVG rendering issues | Low | Low | SVGs already work for `vn-flag.svg`. Same pattern for `en-flag.svg`. |
| Future translation system conflicts with locale context | Low | Medium | Design `useLocale()` with a simple `locale` value. Translation system can consume this context later without changes. |

### Estimated Complexity

- **Frontend**: Low — Small component, simple state, no complex interactions
- **Backend**: None
- **Testing**: Low — Few states to test, straightforward E2E flow

---

## Integration Testing Strategy

### Test Scope

- [x] **Component interactions**: LanguageSelector trigger ↔ LanguageDropdown ↔ useLocale context
- [ ] **External dependencies**: None
- [ ] **Data layer**: Cookie read/write only
- [x] **User workflows**: Open dropdown → select language → verify UI update + cookie persistence

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Dropdown open/close, language switch updates trigger button |
| Service ↔ Service | No | N/A |
| App ↔ External API | No | N/A |
| App ↔ Data Layer | No | Cookie only |
| Cross-platform | Yes | Responsive positioning (mobile, desktop) |

### Test Environment

- **Environment type**: Local (jsdom for unit, Playwright for E2E)
- **Test data strategy**: No test data needed — static locale options
- **Isolation approach**: Fresh component render per unit test

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Cookie (document.cookie) | Mock in unit tests | Isolate hook from browser API |
| Cookie (middleware) | Real in E2E | Test full SSR flow |
| next/image | Real | Already works in test environment |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Click trigger → dropdown opens with 2 options, current language highlighted
   - [x] Click unselected language → dropdown closes, trigger updates, cookie set
   - [x] Page reload → language persisted from cookie

2. **Error Handling**
   - [x] Cookie read failure → fall back to default `vi`

3. **Edge Cases**
   - [x] Click already-selected language → dropdown closes, no change
   - [x] Click outside → dropdown closes
   - [x] Press Escape → dropdown closes
   - [x] Keyboard navigation → Arrow Down/Up moves focus, Enter selects

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react (unit), Playwright (E2E)
- **CI integration**: `vitest run` in pre-commit, Playwright in CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| useLocale hook | 95%+ | High |
| LanguageDropdown component | 90%+ | High |
| E2E language switch flow | Key flows | Medium |
| Keyboard accessibility | E2E only | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed)
- [x] `design-style.md` approved (status: Reviewed)
- [ ] UK flag SVG asset (`en-flag.svg`) — created during Phase 1

### External Dependencies

- None — fully client-side feature

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following phase order (1 → 4)

---

## Notes

- The `LocaleProvider` context is designed to be the foundation for future i18n/translation work. Currently it only stores the locale code — a translation layer (e.g., JSON message files, `useTranslations()` hook) can be added later without changing the locale infrastructure.
- The existing `LanguageSelector` uses `export default` — Constitution Principle II recommends named exports. This will be refactored to a named export during implementation. This requires updating imports in `Header.tsx` and `login/page.tsx` (both listed in Modified Files).
- The `Header` component already handles a click-outside pattern for the profile dropdown (lines 41-49). The same pattern will be reused for the language dropdown.
- Cookie name `NEXT_LOCALE` follows Next.js conventions. The middleware can read it for server-side locale awareness if needed later.
- The dropdown appears in 2 places (Login page header + main Header), but the component is the same instance — no duplication needed.
- Since the project deploys on Cloudflare Workers, URL-based i18n (path prefixes like `/en/login`) was explicitly rejected — it requires middleware rewrites that are complex on edge and cause a route change (violating TR-001 "no full page reload").
