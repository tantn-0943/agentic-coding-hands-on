# Tasks: Login

**Frame**: `662:14387-Login`
**Prerequisites**: plan.md ✅ | spec.md ✅ | design-style.md ✅

---

## Task Format

```
- [x] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no shared dependency)
- **[US#]**: User story this task belongs to (US1, US2)
- **|**: File path affected

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install missing dependency, configure test runners, download Figma assets.

**⚠️ Run FIRST — nothing else can start until T001 is done.**

- [x] T001 Install missing devDependency: `yarn add -D @vitejs/plugin-react` (required for Vitest JSX transform) | package.json
- [x] T002 [P] Create Vitest config with jsdom env, `@/*` path alias, jest-dom setup | vitest.config.ts
- [x] T003 [P] Create Playwright config with `baseURL: 'http://localhost:3000'`, `testDir: './tests/e2e'`, Chromium | playwright.config.ts
- [x] T004 Download Figma media assets to `public/` using MoMorph `get_media_file` tool (see asset table below):
  - `I662:14391;178:1033;178:1030` → `public/images/saa-logo.png`
  - `2939:9548` → `public/images/root-further-logo.png`
  - `I662:14426;186:1766` → `public/icons/google.svg`
  - `I662:14391;186:1696;186:1821;186:1709` → `public/icons/vn-flag.svg`
  - `I662:14391;186:1696;186:1821;186:1441` → `public/icons/chevron-down.svg`
  - `662:14389` → `public/images/login-bg.jpg` (fallback: CSS gradient if node is vector)

**Checkpoint**: T001–T004 complete → test runners configured, assets available

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Shared types, fonts, and design tokens. No business logic yet.

**⚠️ CRITICAL**: Phase 3 and 4 cannot start until this phase is complete.

- [x] T005 Create TypeScript types for auth | src/types/auth.ts
  ```ts
  export type LoginPageProps = { searchParams: Promise<{ error?: string; returnTo?: string }> }
  export type AuthCallbackError = { message: string; code: string }
  ```
- [x] T006 [P] Update `layout.tsx`: replace Geist with `Montserrat` (700, latin+vietnamese) + `Montserrat_Alternates` (700) via `next/font/google`; expose as CSS variables `--font-montserrat` and `--font-montserrat-alt` | src/app/layout.tsx
- [x] T007 [P] Add login design tokens to `globals.css`: `--color-bg-page: #00101A`, `--color-btn-login: #FFEA9E`, `--color-header-bg: rgba(11,15,18,0.8)`, `--color-divider: #2E3940`, gradient CSS variables | src/app/globals.css

**Checkpoint**: Types, fonts, tokens ready → user story phases can now begin

---

## Phase 3: User Story 1 — Login With Google (Priority: P1) 🎯 MVP

**Goal**: Full Google OAuth PKCE flow — middleware protects routes, callback exchanges code for session, login button initiates OAuth, error/loading states work correctly.

**Independent Test**: Open `/login` in browser (no session) → click "LOGIN With Google" → Google OAuth popup/redirect → return to app → redirected to `/`. Navigate to `/login` with active session → auto-redirected to `/`.

### Auth Backend — TDD (US1)

- [x] T008 [P] Write FAILING unit tests for OAuth callback route (mock Supabase, assert redirect URLs for: success, returnTo, invalid returnTo, `?error` param, exchangeCodeForSession failure) | src/app/auth/callback/route.test.ts
- [x] T009 [P] Write FAILING unit tests for Next.js middleware (mock session: unauth→redirect `/login?returnTo=`, auth on `/login`→redirect `/`, public routes pass through, static assets pass through) | src/middleware.test.ts
- [x] T010 Implement OAuth callback route handler to pass T008 tests: read `code`/`error`/`returnTo` params, validate returnTo (starts with `/`, no `//`), call `exchangeCodeForSession(code)`, redirect | src/app/auth/callback/route.ts
- [x] T011 Implement Next.js middleware to pass T009 tests: session check via `supabase.auth.getUser()`, public routes list, redirect logic, security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`), export `config.matcher` | src/middleware.ts

### UI Components — TDD (US1)

- [x] T012 [P] Implement static Logo component: `<Image src="/images/saa-logo.png" alt="Sun Annual Awards 2025" width={52} height={56} priority />` (no test needed — pure static render) | src/components/ui/Logo.tsx
- [x] T013 Write FAILING unit tests for LoginButton (6 scenarios: default render, initialError prop shows error message, click→isLoading+disabled, signInWithOAuth error→reset+clientError, signInWithOAuth success→isLoading stays true, aria-label check) | src/components/auth/LoginButton.test.tsx
- [x] T014 Implement LoginButton Client Component to pass T013 tests: props `{ initialError?: string; returnTo?: string }`, state `isLoading/clientError`, CSS spinner (24×24px), error message mapping (`auth_failed`→"Authentication failed. Please try again."), calls `signInWithOAuth` with `redirectTo` including `returnTo` | src/components/auth/LoginButton.tsx
- [x] T015 Implement login page: async Server Component, `await searchParams`, validate `returnTo`, assemble full layer stack (background image → left gradient → bottom gradient → header[Logo+LanguageSelector] → hero section[ROOT FURTHER logo + hero text + LoginButton] → footer), all decorative `aria-hidden="true"` | src/app/(auth)/login/page.tsx

**Checkpoint**: Run `yarn dev` → visit `/login` → button visible → click → Google OAuth redirect → callback → session → redirect `/`. FR-001 through FR-006 satisfied.

---

## Phase 4: User Story 2 — Language Selector Stub (Priority: P2)

**Goal**: Language selector button renders correctly in header (VN flag + "VN" + chevron). Dropdown display is out of scope (needs separate spec 721:4942).

**Independent Test**: Open `/login` → header has language button showing "VN" + flag icon + chevron → button is accessible (focusable, has aria attributes). Clicking does nothing (stub).

- [x] T016 Write FAILING unit test for LanguageSelector: renders button with VN flag, "VN" text, chevron icon; has `aria-haspopup="listbox"`, `aria-expanded="false"`; onClick is no-op | src/components/auth/LanguageSelector.test.tsx
- [x] T017 [US2] Implement LanguageSelector Client Component stub to pass T016 test: `"use client"`, `<button aria-haspopup="listbox" aria-expanded="false">` with flag SVG + "VN" text + chevron SVG, `onClick` no-op, hover styles per design-style.md | src/components/auth/LanguageSelector.tsx

**Checkpoint**: Language selector visible in header at all 3 breakpoints. No console errors.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Responsive layout, accessibility compliance, E2E tests, quality gate verification.

- [x] T018 [P] Apply responsive Tailwind classes to login page per design-style.md responsive table: Mobile (`<md`: `px-4`, `py-12`, `gap-12`, `w-full max-w-[280px]` logo, `text-base` hero text, `w-full` button), Tablet (`md:`: `px-12`, `w-[320px]` logo, `w-[260px]` button), Desktop (`lg:`: `px-36`, full values) | src/app/(auth)/login/page.tsx
- [x] T019 [P] Verify accessibility: all interactive elements have focus rings, `aria-label="Login with Google"` on button, decorative images have `alt=""` + `aria-hidden="true"`, tab order Language Selector → Login Button, run Lighthouse (target ≥ 90 per SC-004) | src/app/(auth)/login/page.tsx, src/components/auth/LoginButton.tsx
- [x] T020 Write E2E tests covering US1 P1 acceptance scenarios 1–5: (1) button active on page load, (2) button disabled while loading, (3) redirect to `/` after OAuth success, (4) error shown + button active after failure, (5) auto-redirect if already logged in | tests/e2e/login.spec.ts
- [x] T021 Run quality gates: `yarn lint` (no errors), `yarn build` (successful), `yarn test` (all unit tests pass), manual responsive check at 375px/768px/1440px | —

**Checkpoint**: All gates pass. SC-001 through SC-004 satisfied.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (T001–T004)
  ↓
Phase 2 (T005–T007) — requires T001 done
  ↓
Phase 3 (T008–T015) — requires Phase 2 complete
  ↓
Phase 4 (T016–T017) — requires Phase 3 complete (uses Logo in page)
  ↓
Phase 5 (T018–T021) — requires Phase 3 + 4 complete
```

### Within Phase 3 (US1) — Detailed Order

```
T008 [P] ─────── write callback test ─┐
T009 [P] ─────── write middleware test ─┤─→ T010 impl callback
T012 [P] ─────── impl Logo ────────────┘─→ T011 impl middleware
                                             ↓
                                    T013 write LoginButton test
                                             ↓
                                    T014 impl LoginButton
                                             ↓
                         T015 impl login page (needs T010+T011+T012+T014)
```

### Parallel Opportunities

| Can run in parallel | Tasks |
|--------------------|-------|
| Phase 1 configs | T002, T003 (after T001) |
| Phase 1 assets | T004 (with T002/T003) |
| Phase 2 setup | T005, T006, T007 |
| Phase 3 test writing | T008, T009, T012 |
| Phase 5 polish | T018, T019 (after T015) |

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 → Phase 2
2. Complete **Phase 3** (US1 — Login With Google — the only critical path)
3. **STOP and VALIDATE**: Test Google OAuth flow end-to-end
4. Ship MVP if passing

### Incremental Delivery

1. Phase 1 + Phase 2 (Setup + Foundation)
2. Phase 3: Auth backend (T008–T011) → test OAuth flow with stub UI
3. Phase 3: UI components (T012–T015) → full login screen
4. Phase 4: Language selector stub (T016–T017)
5. Phase 5: Polish + E2E (T018–T021)

---

## Summary

| Metric | Value |
|--------|-------|
| Total tasks | 21 |
| Phase 1 (Setup) | 4 tasks |
| Phase 2 (Foundation) | 3 tasks |
| Phase 3 (US1 — P1 MVP) | 8 tasks |
| Phase 4 (US2 — P2) | 2 tasks |
| Phase 5 (Polish) | 4 tasks |
| Parallelizable tasks | T002, T003, T004, T005, T006, T007, T008, T009, T012, T018, T019 |
| TDD test tasks | T008, T009, T013, T016, T020 |
| MVP scope | Phase 1 + 2 + 3 (T001–T015) |

---

## Phase 6: Bug Fix — Font & Visual Corrections

**Purpose**: Fix all font, color, size, and content deviations found during design review vs. `design-style.md`.

- [x] T022 [P] Fix footer: `text-white/60` → `text-white`, add `border-t border-[#2E3940]`, fix content to "Bản quyền thuộc về Sun* © 2025", fix responsive padding (`py-10 md:py-10` → `py-6 md:py-10`), fix footer `px` tablet | src/app/(auth)/login/page.tsx
- [x] T023 [P] Fix hero text: add `tracking-[0.5px] lg:leading-[40px]`, fix content to design spec ("Bắt đầu hành trình..."), fix ROOT FURTHER alt + desktop max-w | src/app/(auth)/login/page.tsx
- [x] T024 [P] Fix LoginButton: `rounded-full` → `rounded-lg`, `px-5` → `px-6`, `disabled:opacity-70` → `disabled:opacity-50`, add hover transform/shadow, add active states | src/components/auth/LoginButton.tsx
- [x] T025 [P] Fix LanguageSelector: flag 20×14 → 24×24, chevron 12×12 → 24×24, `text-sm` → `text-base`, `gap-2` → `gap-1`, `px-3 py-2` → `p-4`, `rounded-lg` → `rounded`, add `tracking-[0.15px] leading-6` | src/components/auth/LanguageSelector.tsx

---

## Notes

- Mark tasks complete as you go: change `- [ ]` to `- [x]`
- Commit after each logical group (at minimum after each phase checkpoint)
- TDD tasks: write the test, confirm it FAILS, then implement until it passes
- Asset URLs from `get_media_files` expire after 600s — download immediately in T004
- If background image (662:14389) is unavailable, use CSS fallback: `background: linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)` on the page wrapper
- `NEXT_PUBLIC_SITE_URL` must be set in `.env.local` before testing OAuth flow
- Run `opennextjs-cloudflare preview` (not just `next dev`) to verify edge runtime compatibility before final sign-off
