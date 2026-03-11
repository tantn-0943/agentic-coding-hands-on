<!--
## Sync Impact Report

**Version Change**: N/A → 1.0.0 (initial ratification)

**Modified Principles**: None (initial creation)

**Added Sections**:
- Core Principles (7 principles)
- Tech Stack & Approved Libraries
- Development Workflow
- Governance

**Removed Sections**: N/A

**Templates Updated**:
- ✅ `.momorph/templates/plan-template.md` — Constitution Compliance Check section already aligned
- ✅ `.momorph/templates/spec-template.md` — Responsive breakpoints + security requirements already present
- ✅ `.momorph/templates/tasks-template.md` — Security hardening and TDD tasks already present

**Deferred TODOs**: None — all placeholders resolved.
-->

# Agentic Coding Hands-on Constitution

## Core Principles

### I. Clean Code & Source Organization

Code MUST be readable, concise, and self-documenting. Every file, function, and variable MUST have a clear, single responsibility.

- Files MUST be organized by feature/domain under `src/` (e.g., `src/components/`, `src/app/`, `src/lib/`, `src/types/`)
- Functions MUST remain small and focused — if a function exceeds ~40 lines, extract sub-functions
- Naming MUST be explicit and descriptive: prefer `getUserById` over `getUser` or `fetch`
- Avoid code duplication — extract shared logic into `src/lib/` or `src/hooks/`
- TypeScript MUST be used throughout; `any` is forbidden unless explicitly justified with a comment
- Imports MUST be organized: external packages first, then internal modules, then relative paths

### II. Next.js Best Practices

The project MUST use the Next.js App Router and leverage Server Components by default.

- Server Components MUST handle data fetching; Client Components MUST be used only when interactivity or browser APIs are required
- Mark Client Components explicitly with `"use client"` at the top of the file
- Route handlers in `app/api/` MUST validate all inputs before processing
- Use `next/image` for all images and `next/font` for all fonts
- Environment variables: use `NEXT_PUBLIC_` prefix only for values safe to expose to the browser
- Do NOT use `export default` for page components — use named exports where possible; always export metadata
- Prefer Server Actions for form mutations over client-side fetch calls

### III. Cloudflare Workers & Edge Runtime

All backend code MUST be compatible with the Cloudflare Workers edge runtime. Node.js-only APIs are forbidden.

- Do NOT use Node.js built-ins (e.g., `fs`, `path`, `crypto` from Node) — use Web API equivalents (`Crypto`, `fetch`, `URL`)
- Wrangler configuration (`wrangler.toml`) MUST be kept up to date with correct bindings and environment settings
- Worker functions MUST remain stateless — persist state in Supabase, not in-memory
- Use `@opennextjs/cloudflare` adapter conventions; do not bypass adapter config
- Secrets MUST be stored in Cloudflare secrets or environment bindings, never hardcoded

### IV. Supabase Integration

Supabase MUST be accessed exclusively through the official `@supabase/ssr` client on the server side and `@supabase/supabase-js` on the client side.

- Row Level Security (RLS) MUST be enabled on every Supabase table; no table may be publicly writable without explicit justification
- Authentication MUST use Supabase Auth; do not implement custom auth flows
- Supabase clients MUST be initialized using environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Database queries MUST use the Supabase client SDK — raw SQL is only permitted in migration files
- Always handle Supabase error responses (`{ data, error }`) — never silently ignore `error`

### V. Responsive Design

The application MUST be fully responsive and functional across all screen sizes: mobile (≥320px), tablet (≥768px), and desktop (≥1024px).

- Mobile-first CSS: write base styles for mobile, then use Tailwind's `md:` and `lg:` (and `xl:`) prefixes to scale up
- All interactive elements MUST have touch-friendly targets (minimum 44×44px)
- Text MUST remain readable at all viewport widths — avoid fixed pixel widths for containers
- Images and media MUST use responsive sizing (`w-full`, `max-w-*`, `aspect-ratio`)
- Test UI at three breakpoints minimum before marking any task complete: 375px, 768px, 1440px
- Do NOT use absolute positioning or fixed pixel layouts that break on smaller screens

### VI. OWASP Security (Secure Coding)

All code MUST comply with OWASP Top 10 mitigation practices. Security is non-negotiable and MUST be addressed during implementation, not as an afterthought.

- **Input Validation**: All user inputs MUST be validated and sanitized server-side; use Zod or equivalent schema validation
- **Authentication & Authorization**: Every protected route/API MUST verify session via Supabase Auth before processing; never trust client-supplied user IDs
- **XSS Prevention**: Never use `dangerouslySetInnerHTML`; sanitize any HTML content rendered from user data
- **Injection Prevention**: Use parameterized queries via Supabase SDK; never concatenate user input into queries
- **Sensitive Data Exposure**: Never log secrets, tokens, or PII; mask sensitive fields in responses
- **Security Headers**: Configure `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options` in Next.js middleware
- **Dependency Management**: Run `yarn audit` regularly; do not add packages with known high/critical vulnerabilities

### VII. Test-First Development (TDD)

Tests MUST be written before implementation code. The Red-Green-Refactor cycle is mandatory for all new features and bug fixes.

- Write a failing test → implement the minimum code to pass → refactor
- Unit tests MUST cover core business logic in `src/lib/` and `src/hooks/`
- Integration tests MUST cover API routes and Supabase interactions
- E2E tests (Playwright) MUST cover all P1 user stories end-to-end
- A task is only complete when tests pass and coverage targets are met
- Test files MUST reside alongside source files (`*.test.ts`) or in `tests/` for integration/E2E

---

## Tech Stack & Approved Libraries

### Core Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 15.x |
| Language | TypeScript | 5.x |
| Styling | TailwindCSS | 4.x |
| Edge Runtime | Cloudflare Workers via @opennextjs/cloudflare | 1.x |
| Backend-as-a-Service | Supabase (Auth + DB + Realtime) | 2.x |
| Runtime | Node.js (dev only) | 24.x |
| Package Manager | Yarn | 1.22.x |

### Approved Additions

- **Zod** — schema validation (server-side input validation)
- **Playwright** — E2E testing
- **Jest / Vitest** — unit and integration testing

### Prohibited

- Raw SQL outside migration files
- Node.js-only built-ins in edge-deployed code
- `any` TypeScript type without justification
- `dangerouslySetInnerHTML` without sanitization
- Hardcoded secrets or API keys in source files

---

## Development Workflow

### Code Quality Gates

Before merging any PR, the following MUST pass:

1. `yarn lint` — no ESLint errors
2. `yarn build` — successful Next.js build
3. All unit/integration tests passing
4. E2E tests passing for affected user stories
5. Manual responsive check at 375px, 768px, 1440px
6. Security review: no new OWASP violations introduced

### Folder Structure Convention

```
src/
├── app/                  # Next.js App Router pages and layouts
│   ├── (auth)/           # Auth-related routes (grouped)
│   ├── api/              # Route handlers
│   └── layout.tsx
├── components/           # Shared UI components
│   ├── ui/               # Primitive/atomic components
│   └── [feature]/        # Feature-specific components
├── lib/                  # Shared utilities and helpers
│   ├── supabase/         # Supabase client factories
│   └── utils/            # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── middleware.ts          # Next.js middleware (auth, security headers)
```

### Amendment Procedure

1. Propose change with rationale in a PR description
2. Bump version: MAJOR for breaking changes, MINOR for additions, PATCH for clarifications
3. Update `LAST_AMENDED_DATE` to today's date
4. Update `CONSTITUTION_VERSION` accordingly
5. Run consistency propagation check on all templates
6. PR must be reviewed by at least one team member before merging

---

## Governance

This constitution supersedes all other coding practices and style guides in this project. All implementation work MUST comply with these principles before code review begins.

- All PRs MUST include a "Constitution Compliance Check" confirming no principles are violated
- Any principle violation requires explicit written justification in the PR and acknowledgment from a reviewer
- Complexity beyond what is strictly necessary MUST be justified; YAGNI and KISS apply at all times
- Amendments are versioned and traceable; no informal overrides are permitted
- Refer to `.momorph/guidelines/frontend.md` and `.momorph/guidelines/backend.md` for additional runtime guidance

**Version**: 1.0.0 | **Ratified**: 2026-03-11 | **Last Amended**: 2026-03-11
