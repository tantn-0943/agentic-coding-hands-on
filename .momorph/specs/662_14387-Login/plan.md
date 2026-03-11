# Implementation Plan: Login

**Frame**: `662:14387-Login`
**Date**: 2026-03-11
**Spec**: `specs/662_14387-Login/spec.md`

---

## Summary

Implement màn hình Login cho SAA 2025: hero full-screen với background image + gradient overlays, header (SAA logo + language selector), ROOT FURTHER key visual, mô tả SAA, nút "LOGIN With Google" (Google OAuth PKCE via Supabase), và footer bản quyền. Auth flow sử dụng `@supabase/ssr` + PKCE — middleware bảo vệ route, callback handler trao đổi `code` → session, redirect về trang chính sau khi login thành công.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 App Router
**Primary Dependencies**: React 19, TailwindCSS 4, @supabase/ssr 0.8, @supabase/supabase-js 2.x
**Edge Runtime**: Cloudflare Workers via @opennextjs/cloudflare
**Testing**: Vitest (unit), Playwright (E2E) — đã cài sẵn
**State Management**: React `useState` (local: `isLoading`, `error`); Supabase session qua cookie (`@supabase/ssr`)
**Auth**: Supabase Google OAuth PKCE — `signInWithOAuth` → `/auth/callback` → `exchangeCodeForSession`

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

| Principle | Rule | Status | Notes |
|-----------|------|--------|-------|
| I. Clean Code | TypeScript strict (`"strict": true` in tsconfig); named exports; functions ≤ 40 lines; no `any` | ✅ | Import alias `@/*` → `./src/*` must be used throughout |
| II. Next.js Best Practices | Server Components by default; `"use client"` only for LoginButton + LanguageSelector; `next/image` for all images; `next/font/google` for fonts | ✅ | `page.tsx` must `await searchParams` (Next.js 15 Promise API) |
| III. Cloudflare Edge Runtime | No Node.js built-ins; stateless workers; `@opennextjs/cloudflare` conventions | ✅ | `src/middleware.ts` and `route.ts` must use Web APIs only |
| IV. Supabase Integration | `@supabase/ssr` cho server/middleware; `@supabase/supabase-js` cho browser client; handle `{ data, error }` responses | ✅ | Reuse existing `src/libs/supabase/` clients |
| V. Responsive Design | Mobile-first; test 375px / 768px / 1440px; touch targets ≥ 44×44px | ✅ | Planned in Phase 4 |
| VI. OWASP Security | Input validation (returnTo param); auth via Supabase; security headers in middleware; no secrets in DOM/logs | ✅ | TR-007: no token logging; open redirect protection for `returnTo` |
| VII. Test-First (TDD) | Red-Green-Refactor; unit tests trước implement; E2E cho P1 | ✅ | Phase 2 và Phase 3 đều bắt đầu bằng test |

**Violations**: Không có vi phạm.

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — `src/components/auth/` cho login-specific components; `src/components/ui/` cho primitives
- **Import alias**: Dùng `@/*` → `./src/*` (tsconfig path alias) trong mọi import thay vì relative paths
- **Server vs Client Components**:
  - `src/app/(auth)/login/page.tsx` → **async Server Component** — đọc error từ `await searchParams` (Next.js 15: `searchParams` là `Promise<{ error?: string }>`), không có interactivity
  - `src/components/auth/LoginButton.tsx` → **Client Component** (`"use client"`) — quản lý `isLoading` state, gọi Supabase browser client
  - `src/components/auth/LanguageSelector.tsx` → **Client Component** (`"use client"`) — stub UI button (dropdown hiển thị là out-of-scope — cần spec 721:4942)
- **Error display**: LoginButton nhận `initialError?: string` prop từ `page.tsx` (server-rendered, hiển thị ngay khi tải trang từ `?error=` URL param). Client-side errors từ `signInWithOAuth` được set vào `clientError` local state trong LoginButton. Cả hai render `<p role="alert">` inline dưới button — không cần component riêng, không có toast.
- **Styling Strategy**: TailwindCSS 4 utility classes với custom values (`bg-[#FFEA9E]`, `gap-[80px]`, etc.) — không cần CSS Modules
- **Fonts**: `next/font/google` — `Montserrat` (weight: 700, subsets: latin, vietnamese) + `Montserrat_Alternates` (weight: 700); thay thế Geist trong `layout.tsx`

### OAuth Call Specification

`LoginButton.tsx` gọi (props: `{ initialError?: string; returnTo?: string }`):
```ts
const callbackUrl = returnTo
  ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?returnTo=${encodeURIComponent(returnTo)}`
  : `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`

const { error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: callbackUrl,
    queryParams: { access_type: 'offline', prompt: 'consent' },
  },
})
// If error: setClientError(error.message); setIsLoading(false)
// If success: browser navigates to Google OAuth — do NOT reset isLoading
```
- `redirectTo` MUST use `NEXT_PUBLIC_SITE_URL` env var — never hardcode
- Supabase browser client uses redirect mode by default (no popup) — popup-blocked edge case is inherently avoided
- After successful call, browser navigates away automatically — no `router.push()` needed

### Backend Approach

- **OAuth Callback**: Route Handler tại `src/app/auth/callback/route.ts` — xử lý PKCE: đọc `?code`, gọi `exchangeCodeForSession(code)`, redirect đến `returnTo` (validated) hoặc `/`; nếu `?error` param tồn tại → redirect `/login?error=auth_failed`
- **Middleware**: `src/middleware.ts` — session check, redirect unauthenticated requests to `/login?returnTo=${encPath}`, add security headers
- **Protected vs Public routes**:
  - Public (no auth required): `/login`, `/auth/callback`, `/_next/*`, `/favicon.svg`, `/icons/*`, `/images/*`
  - Protected (requires session): tất cả routes còn lại (`/`, `/dashboard`, v.v.)
- **Validation**: URL params (`code`, `error`, `returnTo`) được validate trong callback route và middleware — `returnTo` MUST start with `/` và KHÔNG chứa `//` hay `http`

### returnTo Flow (Session Timeout + Deep Link)

```
1. User truy cập protected route /dashboard (chưa auth)
2. Middleware: redirect → /login?returnTo=%2Fdashboard
3. page.tsx: const { error, returnTo } = await searchParams
             validate returnTo (starts with /, no //)
             pass as props → <LoginButton initialError={error} returnTo={returnTo} />
4. LoginButton: onClick → signInWithOAuth({
                  redirectTo: `${SITE_URL}/auth/callback?returnTo=${encodeURIComponent(returnTo ?? '/')}`
                })
5. callback/route.ts: exchangeCodeForSession(code)
                       validate returnTo param
                       redirect(validatedReturnTo || '/')
```

### Integration Points

- **Existing**: `src/libs/supabase/middleware.ts` — reuse `createClient(request)` trong `src/middleware.ts`
- **Existing**: `src/libs/supabase/server.ts` — reuse `createClient()` trong callback route handler
- **Existing**: `src/libs/supabase/client.ts` — reuse `createClient()` trong `LoginButton` Client Component
- **New**: `src/app/auth/callback/route.ts` — cần tạo mới
- **New**: `src/middleware.ts` — cần tạo mới (hiện chưa tồn tại)

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/662_14387-Login/
├── spec.md              # Feature specification (Reviewed)
├── design-style.md      # Visual specs pixel-accurate
├── plan.md              # This file
├── tasks.md             # Task breakdown (next step)
└── assets/
    └── frame-url.txt    # Figma frame image URL
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # NEW — Login page (async Server Component, await searchParams)
│   ├── auth/
│   │   └── callback/
│   │       └── route.ts          # NEW — OAuth PKCE callback handler (GET)
│   ├── globals.css               # MODIFY — add login design tokens (CSS variables)
│   └── layout.tsx                # MODIFY — add Montserrat + Montserrat Alternates fonts
│
├── components/
│   ├── auth/
│   │   ├── LoginButton.tsx       # NEW — "LOGIN With Google" button (Client Component)
│   │   └── LanguageSelector.tsx  # NEW — Language selector stub UI (Client Component)
│   └── ui/
│       └── Logo.tsx              # NEW — SAA Logo component (next/image wrapper)
│
├── libs/
│   └── supabase/                 # EXISTING — không thay đổi
│       ├── client.ts             # (reuse — browser client)
│       ├── server.ts             # (reuse — server client)
│       └── middleware.ts         # (reuse — middleware client factory)
│
├── types/
│   └── auth.ts                   # NEW — AuthError, LoginState types
│
└── middleware.ts                  # NEW — Next.js middleware (route guard + security headers)

public/
├── images/
│   ├── saa-logo.png              # NEW — SAA Logo (Figma node I662:14391;178:1033;178:1030)
│   ├── root-further-logo.png     # NEW — ROOT FURTHER logo (Figma node 2939:9548)
│   └── login-bg.jpg              # NEW — Background artwork (Figma node 662:14389, fallback: CSS)
└── icons/
    ├── google.svg                # NEW — Google icon (Figma node I662:14426;186:1766)
    ├── vn-flag.svg               # NEW — Vietnam flag (Figma node I662:14391;186:1696;186:1821;186:1709)
    └── chevron-down.svg          # NEW — Chevron icon (Figma node I662:14391;186:1696;186:1821;186:1441)

# Config files (root)
vitest.config.ts                  # NEW — Vitest config (jsdom env, @/* path alias)
playwright.config.ts              # NEW — Playwright config (baseURL, test dir)

# Test files (co-located)
src/app/auth/callback/route.test.ts        # NEW — Unit tests for callback handler
src/middleware.test.ts                     # NEW — Unit tests for middleware auth logic
src/components/auth/LoginButton.test.tsx   # NEW — Unit tests for LoginButton states
tests/e2e/login.spec.ts                    # NEW — E2E tests for P1 user story
```

### Dependencies

**Already installed (no action needed):**

| Package | Version | Usage |
|---------|---------|-------|
| `@supabase/ssr` | `^0.8.0` | Server/middleware Supabase client |
| `@supabase/supabase-js` | `^2.90.1` | Browser Supabase client (LoginButton) |
| `next` | `15.5.9` | App Router, next/image, next/font |
| `tailwindcss` | `^4` | Utility styling |
| `vitest` | ✅ | Unit test runner |
| `@playwright/test` | ✅ | E2E test runner |
| `@testing-library/react` | ✅ | React component testing utilities |
| `@testing-library/user-event` | ✅ | User interaction simulation |
| `@testing-library/jest-dom` | ✅ | Custom DOM matchers |
| `jsdom` | ✅ | DOM environment for Vitest |

**Must install before Phase 1 (1 new devDependency):**

| Package | Version | Why needed |
|---------|---------|-----------|
| `@vitejs/plugin-react` | `latest` | **Required** — Vitest needs this plugin to transform JSX/TSX. Without it, component tests will fail to parse React syntax. |

```bash
yarn add -D @vitejs/plugin-react
```

---

## Implementation Strategy

### Phase 0: Asset Preparation

Download tất cả media assets từ Figma về `public/` trước khi implement UI:

| Asset | Figma Node ID | Target Path | Format |
|-------|--------------|-------------|--------|
| SAA Logo | `I662:14391;178:1033;178:1030` | `public/images/saa-logo.png` | PNG |
| ROOT FURTHER Logo | `2939:9548` | `public/images/root-further-logo.png` | PNG |
| Google Icon | `I662:14426;186:1766` | `public/icons/google.svg` | SVG |
| Vietnam Flag | `I662:14391;186:1696;186:1821;186:1709` | `public/icons/vn-flag.svg` | SVG |
| Chevron Icon | `I662:14391;186:1696;186:1821;186:1441` | `public/icons/chevron-down.svg` | SVG |
| Background KV | `662:14389` | `public/images/login-bg.jpg` | JPG/PNG |

> **Note**: Background image (662:14389) không xuất hiện trong `get_media_files` response — có thể là vector/gradient fill. Nếu không download được, dùng CSS gradient `linear-gradient` kết hợp với màu `#00101A` làm fallback.

### Phase 1: Foundation (Types + Fonts + Tokens + Test Setup)

**Goal**: Establish shared infrastructure — no business logic, no auth, no tests yet.

1. Create `vitest.config.ts` — jsdom environment, `@/*` alias → `./src/*`, include `@testing-library/jest-dom` setup file
2. Create `playwright.config.ts` — `baseURL: 'http://localhost:3000'`, `testDir: './tests/e2e'`, Chromium
3. Create `src/types/auth.ts`:
   ```ts
   export type LoginPageProps = { searchParams: Promise<{ error?: string; returnTo?: string }> }
   export type AuthCallbackError = { message: string; code: string }
   ```
4. Modify `src/app/layout.tsx` — add `Montserrat` (weight: `['700']`, subsets: `['latin', 'vietnamese']`) + `Montserrat_Alternates` (weight: `['700']`) via `next/font/google`; assign as CSS variables `--font-montserrat` + `--font-montserrat-alt`; remove Geist imports
5. Modify `src/app/globals.css` — add CSS custom properties for login tokens: `--color-bg-page: #00101A`, `--color-btn-login: #FFEA9E`, `--color-header-bg: rgba(11,15,18,0.8)`, `--color-divider: #2E3940`; gradients as CSS variables

### Phase 2: Auth Infrastructure — TDD (P1 Core)

**Goal**: OAuth PKCE flow working end-to-end. TDD: write failing test → implement → pass.

**Step 1 — Callback handler (test-first):**
1. **Test** `src/app/auth/callback/route.test.ts`:
   - `?code=valid` → calls `exchangeCodeForSession(code)` → redirects to `/`
   - `?code=valid&returnTo=%2Fdashboard` → redirects to `/dashboard` after success
   - `?code=valid&returnTo=https://evil.com` → strips invalid returnTo, redirects to `/`
   - `?error=access_denied` → redirects to `/login?error=auth_failed`
   - `exchangeCodeForSession` throws → redirects to `/login?error=auth_failed`
2. **Implement** `src/app/auth/callback/route.ts`:
   ```ts
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url)
     const code = searchParams.get('code')
     const errorParam = searchParams.get('error')
     const returnTo = searchParams.get('returnTo')
     const safeReturnTo = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/'
     if (errorParam) return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
     if (code) {
       const supabase = await createClient()
       const { error } = await supabase.auth.exchangeCodeForSession(code)
       if (!error) return NextResponse.redirect(new URL(safeReturnTo, request.url))
     }
     return NextResponse.redirect(new URL('/login?error=auth_failed', request.url))
   }
   ```

**Step 2 — Middleware (test-first):**
3. **Test** `src/middleware.test.ts`:
   - Unauthenticated GET `/` → redirect to `/login?returnTo=%2F`
   - Unauthenticated GET `/dashboard` → redirect to `/login?returnTo=%2Fdashboard`
   - Authenticated GET `/` → pass through (200)
   - Authenticated GET `/login` → redirect to `/` (already logged in, FR-006)
   - GET `/login` unauthenticated → pass through (public route)
   - GET `/auth/callback` → pass through (public route, no session check)
   - GET `/_next/static/...` → pass through (static asset)
4. **Implement** `src/middleware.ts` using `src/libs/supabase/middleware.ts` `createClient`:
   - Public routes matcher: `/login`, `/auth/callback`, `/_next/(.*)`, `/favicon.svg`, `/icons/(.*)`, `/images/(.*)`
   - Check session via `supabase.auth.getUser()` (not `getSession()` — more secure for server)
   - Add security headers to all responses: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`
   - Export `config.matcher` to exclude static files from middleware execution

### Phase 3: UI Components (P1 - Visual + States)

**Goal**: Implement login screen pixel-perfect per design-style.md, including all P1 interactive states.

1. **Test first**: `src/components/auth/LoginButton.test.tsx`:
   - Default: renders "LOGIN With Google" + Google icon; button not disabled; no error message
   - With `initialError="auth_failed"` prop: renders error text "Authentication failed. Please try again." in `<p role="alert">`
   - Click: sets `isLoading=true`, button gets `disabled`/`aria-disabled="true"`, Google icon replaced by spinner
   - `signInWithOAuth` returns `{ error }`: `isLoading` resets to false, `clientError` renders in `<p role="alert">`
   - `signInWithOAuth` succeeds (returns null error): `isLoading` stays true (browser navigates away — no reset needed)
   - Aria: has `aria-label="Login with Google"`; spinner has `aria-label="Logging in..."`
2. **Implement**: `src/components/auth/LoginButton.tsx`:
   ```ts
   // Props: { initialError?: string; returnTo?: string }
   // State: isLoading (false), clientError (initialError ?? null)
   // Error message mapping:
   //   'auth_failed' → "Authentication failed. Please try again."
   //   any other string → "An error occurred. Please try again."
   // On click: setIsLoading(true); setClientError(null); call signInWithOAuth;
   //           if error: setClientError(error.message), setIsLoading(false)
   // Render error: clientError && <p role="alert" className="text-red-400 text-sm mt-2">{mapError(clientError)}</p>
   ```
3. **Implement**: `src/components/ui/Logo.tsx` — `<Image src="/images/saa-logo.png" alt="Sun Annual Awards 2025" width={52} height={56} priority />`
4. **Implement**: `src/components/auth/LanguageSelector.tsx` — `"use client"` stub: renders `<button aria-haspopup="listbox" aria-expanded="false">` with VN flag + "VN" text + chevron; `onClick` is no-op (full dropdown is out of scope per spec — needs separate spec 721:4942)
5. **Implement**: `src/app/(auth)/login/page.tsx` — `async` Server Component:
   ```ts
   export default async function LoginPage({ searchParams }: LoginPageProps) {
     const { error, returnTo } = await searchParams
     const safeReturnTo = returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : undefined
     // Render layer stack (design-style.md Component Hierarchy):
     //   <main relative min-h-screen bg-[#00101A] overflow-hidden>
     //     <Image fill alt="" aria-hidden priority />   ← background artwork
     //     <div aria-hidden />                          ← left gradient overlay
     //     <div aria-hidden />                          ← bottom gradient overlay
     //     <header absolute top-0 z-10>
     //       <Logo />
     //       <LanguageSelector />
     //     </header>
     //     <section absolute top-[88px] flex-col gap-[80px]>
     //       <Image ROOT FURTHER logo />
     //       <div content block>
     //         <p hero text />
     //         <LoginButton initialError={error} returnTo={safeReturnTo} />
     //       </div>
     //     </section>
     //     <footer absolute bottom-0 border-t> ... </footer>
     //   </main>
   }
   ```
   - Decorative images (`background`, `gradients`): `alt=""` + `aria-hidden="true"` per TR-008
   - Tab order via DOM order: Language Selector declared before Login Button

### Phase 4: Responsive + Accessibility Polish

**Goal**: Verify responsive behavior at all breakpoints, confirm WCAG AA compliance.

1. Apply responsive Tailwind classes per design-style.md responsive table:
   - Mobile (`< md`): `px-4` header/hero, `py-12` hero, `gap-12` hero flex, `w-full max-w-[280px]` ROOT FURTHER logo, `text-base` hero text, `w-full` login button
   - Tablet (`md`): `px-12` header/hero, `w-[320px]` ROOT FURTHER logo, `w-[260px]` login button
   - Desktop (`lg`): `px-36` header/hero, all values as per design-style.md component specs
2. Verify touch targets: Language Selector (108×56px ✅), Login Button (305×60px ✅) — both exceed 44×44px minimum
3. Run Lighthouse accessibility check — target score ≥ 90 (SC-004)
4. Write E2E test: `tests/e2e/login.spec.ts` covering US1 P1 acceptance scenarios 1–5

### Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Background image không export được từ Figma | Medium | Medium | CSS gradient fallback với `#00101A` + artistic overlay |
| OAuth PKCE callback redirect URL mismatch | Low | High | Đảm bảo `NEXT_PUBLIC_SITE_URL` + `/auth/callback` khớp chính xác với Supabase Dashboard URL Config |
| `exchangeCodeForSession` deprecated/changed API | Low | High | Kiểm tra `@supabase/ssr@0.8.0` docs; có thể dùng `supabase.auth.getUser()` sau `setSession` |
| Cloudflare edge runtime incompatibility | Low | High | Test với `opennextjs-cloudflare preview` sớm; tránh Node.js built-ins |
| Montserrat font loading performance | Low | Low | Dùng `display: 'swap'`; preload trong next/font config |
| `returnTo` param XSS via open redirect | Medium | High | Validate `returnTo` chỉ cho phép internal paths (bắt đầu bằng `/`, không có `//` hay `http`) |

### Estimated Complexity

- **Frontend UI**: Medium (nhiều layers, responsive, pixel-perfect)
- **Auth Backend**: Medium (PKCE flow, callback handler, middleware)
- **Testing**: Low-Medium (unit tests straightforward; E2E cần Supabase mock)

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/UI interactions**: LoginButton states (default → loading → error/success)
- [x] **External dependencies**: Supabase Auth SDK (mock trong unit tests; real trong E2E staging)
- [x] **User workflows**: Full OAuth flow (button click → OAuth → callback → redirect)
- [ ] **Data layer**: N/A — Login không write vào DB

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Button click → `isLoading=true`; callback `?error=` → error message hiển thị |
| App ↔ External API | Yes | `signInWithOAuth` gọi đúng params; `exchangeCodeForSession` nhận đúng `code` |
| App ↔ Data Layer | No | N/A |
| Cross-platform | Yes | Responsive tại 375px, 768px, 1440px |

### Mocking Strategy

| Dependency | Strategy | Rationale |
|-----------|----------|-----------|
| `@supabase/ssr` createClient | Mock (Vitest `vi.mock`) | Tránh real network calls trong unit tests |
| Supabase `signInWithOAuth` | Mock — return `{ data: { url }, error: null }` | Kiểm tra redirect URL, không cần OAuth thật |
| Supabase `exchangeCodeForSession` | Mock | Test callback handler logic độc lập |
| Next.js `redirect()` | Mock/spy | Assert redirect target URL |
| Next.js `cookies()` | Mock | Test middleware session check |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] `/login` hiển thị với button active (không disabled)
   - [ ] Click button → `isLoading=true`, button disabled
   - [ ] Callback với `?code=xxx` → `exchangeCodeForSession` gọi, redirect `/`
   - [ ] Đã có session → access `/login` → middleware redirect `/`

2. **Error Handling**
   - [ ] Callback với `?error=access_denied` → redirect `/login?error=auth_failed`
   - [ ] `/login?error=auth_failed` → hiển thị error message, button active
   - [ ] `signInWithOAuth` throw error → button active, error hiển thị

3. **Edge Cases**
   - [ ] `returnTo` param valid `/dashboard` → redirect đúng sau login
   - [ ] `returnTo` param invalid `https://evil.com` → bị strip, redirect về `/`
   - [ ] Middleware: public routes (`/login`, `/auth/callback`) không bị redirect

### Test Environment

- **Unit tests**: Vitest với jsdom environment, mock Supabase SDK
- **E2E tests**: Playwright với local dev server; dùng Supabase test account hoặc mock server
- **Test data**: Static fixtures cho session objects; environment `.env.test` với test Supabase project

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Callback route handler | 90%+ | High |
| Middleware auth logic | 90%+ | High |
| LoginButton component | 80%+ | High |
| Login page (Server Component) | 70%+ | Medium |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed
- [x] `spec.md` approved (Status: Reviewed)
- [x] `design-style.md` self-contained với pixel-accurate values
- [x] Supabase client helpers tại `src/libs/supabase/` đã sẵn sàng
- [ ] Env vars cấu hình: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` — cần verify trong `.env.local`
- [ ] Supabase Dashboard: Google OAuth provider enabled ✅ (theo commit history); verify `Redirect URL` = `${NEXT_PUBLIC_SITE_URL}/auth/callback`

### External Dependencies

- **Supabase project**: URL + publishable key từ `.env.local`
- **Google OAuth credentials**: đã cấu hình trong Supabase Dashboard (Google OAuth enabled)
- **Figma media assets**: URL hợp lệ có thể download ngay (expire sau 600s — cần download trong Phase 0)

---

## Notes

- Env var hiện tại dùng `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (không phải `NEXT_PUBLIC_SUPABASE_ANON_KEY` như Supabase docs mặc định) — giữ nguyên convention này.
- `src/middleware.ts` (Next.js middleware) **chưa tồn tại** — cần tạo mới. `src/libs/supabase/middleware.ts` chỉ là Supabase client factory helper, không phải Next.js middleware.
- Route group `(auth)` trong `src/app/(auth)/login/` — grouping không ảnh hưởng URL, route vẫn là `/login`.
- `src/app/auth/callback/route.ts` không nằm trong `(auth)` group vì không cần layout wrapper.
- Nút login dùng `justify-between` (TEXT bên trái 225px, Google icon bên phải 24px) — không dùng `gap` vì đã fixed width 305px.
- Loading spinner: CSS pure — `border-2 border-[#00101A] border-t-transparent rounded-full animate-spin w-6 h-6`.
- Open redirect protection: `returnTo` MUST bắt đầu bằng `/` và không chứa `//` — validate trước khi redirect.

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` để generate task breakdown chi tiết
2. **Review** `tasks.md` cho parallelization opportunities (Phase 0 asset download có thể song song với Phase 1 types setup)
3. **Begin** implementation theo thứ tự: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4
