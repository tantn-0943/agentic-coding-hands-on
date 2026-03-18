# Implementation Plan: Viết Kudo (Write Kudos)

**Frame**: `520:11602-viet-kudo`
**Date**: 2026-03-18
**Spec**: `specs/520-11602-viet-kudo/spec.md`

---

## Summary

Implement a modal dialog for composing and sending kudos messages. The modal includes: recipient search (autocomplete), honorary title field, rich text editor (Tiptap) with @mention support, hashtag picker (1-5), image attachments (0-5 via Supabase Storage), anonymous toggle with name field, and submit/cancel actions. The modal is triggered from the Live Board search input and the Homepage "Write Kudo" button.

**Key technical decisions**: Tiptap for rich text (lightweight, edge-compatible), Server Action for form submission, Supabase Storage for images, Zod for validation.

---

## Technical Context

**Language/Framework**: TypeScript / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, Supabase SSR, Tiptap
**Database**: PostgreSQL (Supabase) — existing schema + 1 migration
**Testing**: Vitest (unit/integration), Playwright (E2E)
**State Management**: React hooks (local state)
**API Style**: Server Actions (mutations) + REST (reads)

---

## Constitution Compliance Check

*GATE: Must pass before implementation can begin*

- [x] **Principle I** — Clean Code: Feature-based folder under `src/components/kudos/`, small focused files
- [x] **Principle II** — Next.js: Server Action for form mutation, Client Component for modal interactivity
- [x] **Principle III** — Cloudflare Edge: Tiptap is browser-only (Client Component), no Node.js APIs used
- [x] **Principle IV** — Supabase: RLS policies exist for kudos/media/hashtags tables, Storage with auth
- [x] **Principle V** — Responsive: Mobile fullscreen, tablet 90vw, desktop 752px (per design-style.md)
- [x] **Principle VI** — OWASP: Zod validation, sanitize rich text HTML, no dangerouslySetInnerHTML
- [x] **Principle VII** — TDD: Tests written before implementation for each phase

**Violations (library addition required)**:

| Violation | Justification | Alternative Rejected |
|-----------|---------------|---------------------|
| Add `@tiptap/react` + extensions | Rich text editor required by FR-003/FR-004. No existing editor in project. | Lexical: heavier bundle, less mature React integration. Textarea: no formatting support. |
| Add `@tiptap/starter-kit` | Provides Bold, Italic, Strike, BulletList, Blockquote out of the box | Building custom editor: too much effort for standard formatting |
| Add `@tiptap/extension-link` | FR-003 requires link insertion | - |
| Add `@tiptap/extension-mention` | FR-004 requires @mention with autocomplete | - |
| Add `@tiptap/extension-placeholder` | Spec requires placeholder text in editor | - |
| Add `@tiptap/pm` | Required peer dependency for Tiptap v2 | - |
| Add `dompurify` | Sanitize rich text HTML **client-side** before sending to Server Action (OWASP XSS prevention). Cannot run on edge — DOM APIs required. | `sanitize-html`: also needs Node.js. Client-side DOMPurify is the only edge-safe option. |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based — all new components under `src/components/kudos/write/`
- **Modal Pattern**: Custom modal with overlay, focus trap, Escape key handler. No external dialog library (keeping the project's custom-component approach).
- **Rich Text Editor**: Tiptap with StarterKit + Link + Mention + Placeholder extensions. Rendered as Client Component.
- **Form State**: Single `useWriteKudo` hook managing all form state, validation, and submission logic.
- **Image Upload**: Client-side upload to Supabase Storage, returning public URLs. Upload on file selection (eager), not on form submit. Accepted formats: `image/jpeg`, `image/png`, `image/gif`, `image/webp`.
- **HTML Sanitization**: DOMPurify runs **client-side only** (before calling Server Action). Server Action trusts sanitized input + validates shape with Zod. DOMPurify cannot run on Cloudflare Workers edge (requires DOM APIs).
- **Styling**: Tailwind utilities matching design-style.md tokens. Add modal-specific CSS variables to `globals.css`.

### Backend Approach

- **Create Kudos**: Server Action `createKudo()` in `src/lib/kudos/actions.ts` — validates with Zod, inserts kudos row → inserts kudos_hashtags rows → inserts kudos_media rows (from pre-uploaded URLs). Content is pre-sanitized client-side.
- **Image Upload**: Server Action `uploadKudoImage()` — validates file type/size → uploads to Supabase Storage bucket `kudos-images` → returns public URL. Accepted: jpeg, png, gif, webp, max 5MB.
- **Database**: Add `is_anonymous` (boolean) and `anonymous_name` (text, nullable) columns to `kudos` table via migration.
- **Validation**: New Zod schema `createKudoSchema` in `validators.ts` — includes `media_urls: z.array(z.string().url()).max(5).default([])`.
- **Feed Refresh**: After successful `createKudo`, call `router.refresh()` on the client to trigger Server Component re-fetch. The `useKudosFeed` hook resets via `useEffect` when `initialData` changes.

### Integration Points

- **Existing Services**:
  - `useProfileSearch()` hook — reuse for recipient search (already debounced, 300ms)
  - `/api/hashtags` — existing endpoint for fetching hashtag list
  - `/api/users/search` — existing endpoint for recipient autocomplete
  - `KudosSearchInput` — wire `onOpenDialog` prop to open the modal
  - `HeroBanner` — pass `onOpenDialog` down to `KudosSearchInput` (currently missing)
  - `WidgetButton` — add "Write Kudo" menu item to open modal (Homepage entry point, currently TODO)
  - `Icon` component — add new icon paths (bold, italic, strikethrough, ordered-list, link, quote, close-x, plus, send, checkbox-checked)

- **Shared Components**: `Avatar`, `Icon`, `Toast` (for error/success notifications)

- **Data Flow**:
  ```
  KudosSearchInput.onOpenDialog → WriteKudoModal (open)
  WidgetButton "Write Kudo" → WriteKudoModal (open)
    → useProfileSearch (recipient)
    → fetch /api/hashtags (hashtags)
    → Tiptap editor (content)
    → DOMPurify.sanitize(html) (client-side)
    → uploadKudoImage Server Action (images, eager)
    → createKudo Server Action (submit)
    → router.refresh() → Server Component re-fetches → useKudosFeed resets
  ```

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/520-11602-viet-kudo/
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
├── components/kudos/write/
│   ├── WriteKudoModal.tsx        # Modal overlay + dialog container
│   ├── WriteKudoForm.tsx         # Form layout with all sections
│   ├── RecipientField.tsx        # Recipient search with autocomplete dropdown
│   ├── CategoryField.tsx         # Danh hiệu text input + hint
│   ├── RichTextEditor.tsx        # Tiptap editor + toolbar + hint text
│   ├── EditorToolbar.tsx         # Formatting toolbar buttons
│   ├── HashtagSection.tsx        # Hashtag picker with chips
│   ├── ImageSection.tsx          # Image thumbnails + upload button
│   ├── AnonymousToggle.tsx       # Checkbox + conditional name field
│   └── FormActions.tsx           # Cancel + Submit buttons
├── hooks/
│   └── useWriteKudo.ts           # Form state, validation, submission logic
├── lib/kudos/
│   # (additions to existing files)
│   # actions.ts  → add createKudo(), uploadKudoImage()
│   # validators.ts → add createKudoSchema, uploadImageSchema
└── types/
    # kudos.ts → add CreateKudoInput, WriteKudoState interfaces

# Modified Files
src/
├── components/kudos/
│   ├── KudosSearchInput.tsx      # Wire onOpenDialog → open modal
│   └── HeroBanner.tsx            # Accept + pass onOpenDialog to KudosSearchInput
├── components/layout/
│   └── WidgetButton.tsx          # Add "Write Kudo" menu item → open modal
├── components/ui/
│   └── Icon.tsx                  # Add 10+ new icon paths for toolbar
├── app/globals.css               # Add modal CSS variables (--color-modal-bg, etc.)
├── types/kudos.ts                # Add CreateKudoInput, WriteKudoState, UploadResult
└── lib/kudos/
    ├── actions.ts                # Add createKudo(), uploadKudoImage()
    └── validators.ts             # Add createKudoSchema, uploadImageSchema

# Database
supabase/migrations/
└── 20260318000000_add_kudos_anonymous_fields.sql  # Add is_anonymous, anonymous_name

# Tests
tests/
├── unit/
│   ├── useWriteKudo.test.ts
│   ├── createKudoSchema.test.ts
│   └── WriteKudoForm.test.tsx
├── integration/
│   └── createKudo.test.ts
└── e2e/
    └── write-kudo.spec.ts
```

### Dependencies to Add

| Package | Version | Purpose |
|---------|---------|---------|
| `@tiptap/react` | ^2.x | React integration for Tiptap editor |
| `@tiptap/starter-kit` | ^2.x | Bold, Italic, Strike, OrderedList, Blockquote |
| `@tiptap/extension-link` | ^2.x | Link insertion in editor |
| `@tiptap/extension-mention` | ^2.x | @mention with autocomplete |
| `@tiptap/extension-placeholder` | ^2.x | Placeholder text in empty editor |
| `@tiptap/pm` | ^2.x | Required peer dependency for Tiptap |
| `dompurify` | ^3.x | Sanitize rich text HTML client-side (XSS prevention) |
| `@types/dompurify` | ^3.x | TypeScript types for DOMPurify |

---

## Implementation Strategy

### Phase 0: Asset Preparation & Foundation

1. Download required UI assets from Figma (toolbar icons, send arrow) using `get_media_files` to `public/icons/`
2. Add new icon paths to `Icon.tsx` (bold, italic, strikethrough, ordered-list, link, quote, close-x, plus, send, checkbox-checked)
3. Add modal CSS variables to `globals.css`:
   - `--color-modal-bg: #FFF8E1`
   - `--color-overlay: rgba(0, 16, 26, 0.80)`
   - `--color-required-red: #CF1322`
4. Install packages: `yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/pm dompurify` + `yarn add -D @types/dompurify`
5. Create database migration: add `is_anonymous BOOLEAN DEFAULT false` and `anonymous_name TEXT` to `kudos` table
6. Create Supabase Storage bucket `kudos-images`:
   - Policy: authenticated users can upload (`INSERT`) to `kudos-images/{user_id}/*`
   - Policy: public read access (`SELECT`) for displaying images
   - Max file size: 5MB (enforced in bucket config)
   - Allowed MIME types: `image/jpeg`, `image/png`, `image/gif`, `image/webp`

### Phase 1: Types, Validators & Server Actions (Backend)

**User Stories**: Supports US1 (P1), US5 (P2), US6 (P3)

1. Add types to `src/types/kudos.ts`:
   - `CreateKudoInput` — form data shape
   - `WriteKudoState` — component state
   - `UploadResult` — image upload response

2. Add Zod schemas to `src/lib/kudos/validators.ts`:
   - `createKudoSchema` — receiver_id (required uuid), category_tag (required string, 1-100 chars), content (required string, non-empty HTML), hashtag_ids (array of 1-5 uuids), media_urls (array of 0-5 valid URLs), is_anonymous (boolean, default false), anonymous_name (optional string, max 50 chars)
   - `uploadImageSchema` — file type (image/jpeg, image/png, image/gif, image/webp), max 5MB

3. Add Server Actions to `src/lib/kudos/actions.ts`:
   - `createKudo(input)` — validate → auth check → insert kudos → insert kudos_hashtags → return success
   - `uploadKudoImage(formData)` — validate → auth check → upload to Supabase Storage `kudos-images` bucket → return public URL

### Phase 2: Modal Shell & Form Layout (US7 - Cancel/Close, P1)

1. `WriteKudoModal.tsx` — overlay + dialog + focus trap + Escape key + click-outside-to-close
2. `WriteKudoForm.tsx` — form layout with section gap (32px modal, 24px content)
3. `FormActions.tsx` — Cancel ("Hủy") + Submit ("Gửi") buttons with states
4. Wire entry points:
   - `HeroBanner.tsx` → accept `onOpenDialog` prop → pass to `KudosSearchInput`
   - `WidgetButton.tsx` → add "Viết Kudo" menu item → call `onOpenDialog`
   - Parent page (Live Board) manages modal open state, passes callback down
5. **Test**: Modal opens from search input, opens from widget button, closes on Cancel/Escape/overlay click, focus trap works

### Phase 3: Recipient Search (US2, P1)

1. `RecipientField.tsx` — label + search input + autocomplete dropdown
2. Reuse `useProfileSearch()` hook (already debounced)
3. Show dropdown results with avatar + name + department
4. Selection fills field, clears dropdown
5. Error state: red border when empty on submit attempt
6. **Test**: Type → results appear, select → fills field, empty → error shown

### Phase 4: Rich Text Editor (US3, P1)

1. `RichTextEditor.tsx` — Tiptap editor with placeholder, min-height 200px
2. `EditorToolbar.tsx` — 6 toggle buttons (B, I, S, OrderedList, Link, Quote) + "Tiêu chuẩn cộng đồng" link
3. @mention extension with suggestion config:
   - `items({ query })` → fetch `/api/users/search?q=${query}` (debounced 300ms, max 10 results)
   - `render()` → floating dropdown component showing avatar + name + department for each match
   - On select → insert `@Name` as inline mention node
   - Reuse same API as `useProfileSearch()` but adapted for Tiptap's suggestion API
4. Toolbar visually connected to editor (top-radius `8px 8px 0 0` toolbar, bottom-radius `0 0 8px 8px` editor)
5. Hint text below: "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác"
6. Link button: on click, show inline URL input (Tiptap's `setLink` command). Maps to Addlink Box (1002:12917) in spec but implementation is a simple prompt/popover.
7. **Test**: Each toolbar button toggles formatting, @mention shows suggestions, link dialog works

### Phase 5: Category Field + Form Submission (US1, P1)

1. `CategoryField.tsx` — "Danh hiệu *" label + text input + description hint ("Ví dụ: Người truyền động lực cho tôi...")
2. `useWriteKudo.ts` — orchestrate all form state, validation, submission:
   - State: recipientId, categoryTitle, editorContent, selectedHashtags, attachedImages, isAnonymous, anonymousName, isSubmitting, errors
   - `validate()` → check all required fields, return errors map
   - `submit()` → DOMPurify.sanitize(content) → createKudo Server Action → on success: close modal + `router.refresh()` to trigger Server Component re-fetch → `useKudosFeed` resets via `useEffect([initialData])`
3. Submit flow: validate all fields → sanitize HTML client-side → `createKudo` Server Action → close modal → `router.refresh()`
4. Disabled "Gửi" button when required fields empty (recipientId, categoryTitle, editorContent, selectedHashtags.length >= 1)
5. Loading state on submit button (spinner replaces text)
6. Error toast on failure (form data preserved for retry)
7. **Test**: Fill all required fields → submit → kudos appears in feed

### Phase 6: Hashtag Picker (US4, P2)

1. `HashtagSection.tsx` — label + "+ Hashtag" button + chips + "Tối đa 5" note
2. Fetch hashtags from `/api/hashtags` on button click
3. Show dropdown, select → add chip, click "x" → remove chip
4. Enforce min 1, max 5 validation
5. Hide "+ Hashtag" button when 5 selected
6. **Test**: Add/remove hashtags, max 5 enforced, min 1 on submit

### Phase 7: Image Attachments (US5, P2)

1. `ImageSection.tsx` — label + thumbnails (80x80) + "+ Image" button + "Tối đa 5"
2. File picker → eager upload via `uploadKudoImage` → show thumbnail with delete button
3. Max 5 images, hide button when full
4. Red circular delete button (20x20, #D4271D) positioned top-right
5. **Test**: Upload image → thumbnail appears, delete → removed, max 5 enforced

### Phase 8: Anonymous Toggle (US6, P3)

1. `AnonymousToggle.tsx` — checkbox + label + conditional name field
2. Check → show text input for anonymous name
3. Uncheck → hide field, clear name
4. Submit with anonymous: name field value or default "Ẩn danh"
5. **Test**: Toggle shows/hides field, submit with custom name, submit with default

### Phase 9: Polish & Accessibility

1. Focus trap: Tab cycles within modal, no escape to background
2. Escape key closes modal
3. ARIA: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` for title
4. Responsive: mobile fullscreen, tablet 90vw, desktop 752px
5. Animation: modal open/close opacity + scale (200ms ease-out)
6. Error toasts for network failures, image upload failures
7. Session expiry handling
8. **Test**: Keyboard navigation, screen reader labels, responsive breakpoints

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Tiptap bundle size too large for edge | Low | High | Tiptap is browser-only (Client Component), not edge-deployed. Tree-shake unused extensions. |
| Rich text HTML XSS vulnerability | Medium | High | Sanitize with DOMPurify before storage AND before display. Never use dangerouslySetInnerHTML. |
| Image upload timeout on slow networks | Medium | Medium | Show progress indicator, allow retry on failure, max 5MB per image. |
| @mention dropdown performance with many users | Low | Medium | Reuse existing debounced search (300ms), limit results to 10. |
| Concurrent form submissions | Low | Low | Disable submit button during submission (isSubmitting state). |
| Database migration breaks existing data | Low | High | Migration only adds nullable columns — zero impact on existing rows. |

### Estimated Complexity

- **Frontend**: High — Rich text editor, multi-section form, file upload, conditional UI
- **Backend**: Low — 2 Server Actions, 1 migration, Zod validation
- **Testing**: Medium — Many interactions to test, but patterns are standard

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: Modal ↔ Form ↔ Editor ↔ Actions
- [x] **External dependencies**: Supabase Auth, Supabase Storage, Supabase DB
- [x] **Data layer**: kudos insert + hashtags insert + media insert
- [x] **User workflows**: Open modal → fill form → submit → feed refresh

### Test Categories

| Category | Applicable? | Key Scenarios |
|----------|-------------|---------------|
| UI ↔ Logic | Yes | Form validation flow, submit disabling, anonymous toggle reveal |
| Service ↔ Service | No | N/A |
| App ↔ External API | Yes | Supabase Auth check, Storage upload, DB insert |
| App ↔ Data Layer | Yes | createKudo inserts to kudos + kudos_hashtags + kudos_media |
| Cross-platform | Yes | Mobile fullscreen modal, desktop centered modal |

### Test Environment

- **Environment type**: Local Supabase (via `supabase start`) + Vitest for unit/integration
- **Test data strategy**: Factories for user profiles, hashtags; seeded test DB
- **Isolation approach**: Transaction rollback per test for DB tests

### Mocking Strategy

| Dependency Type | Strategy | Rationale |
|-----------------|----------|-----------|
| Supabase Auth | Mock | Unit tests don't need real auth; integration tests use test user |
| Supabase Storage | Mock (unit) / Real (integration) | File uploads need real Storage for integration |
| Supabase DB | Mock (unit) / Real (integration) | Schema validation needs real DB |
| Tiptap editor | Real | Testing actual editor behavior, not mocking it |
| fetch (API calls) | Mock (unit) | Isolate component logic from network |

### Test Scenarios Outline

1. **Happy Path**
   - [x] Open modal → fill all required fields → submit → success → modal closes → feed updated
   - [x] Upload 3 images → submit → all images attached to kudos
   - [x] Send anonymous kudos with custom name → sender shown as custom name
   - [x] Add 3 hashtags → submit → all hashtags linked to kudos

2. **Error Handling**
   - [x] Submit with empty required fields → validation errors shown, button stays disabled
   - [x] Image upload fails → error toast, form data preserved
   - [x] Network error on submit → error toast, form data preserved, retry possible
   - [x] Session expired → redirect to login

3. **Edge Cases**
   - [x] Add 6th hashtag → blocked (max 5)
   - [x] Upload 6th image → blocked (max 5)
   - [x] Very long text content → accepted (no char limit, but guidance shown)
   - [x] Double submit → prevented by isSubmitting guard
   - [x] Cancel with data entered → modal closes, data discarded

### Tooling & Framework

- **Test framework**: Vitest + @testing-library/react (unit), Vitest (integration), Playwright (E2E)
- **Supporting tools**: Supabase local, msw (mock service worker) for API mocking in unit tests
- **CI integration**: `vitest run` in pre-commit hook, Playwright in CI pipeline

### Coverage Goals

| Area | Target | Priority |
|------|--------|----------|
| Core submission flow (US1) | 90%+ | High |
| Form validation (validators) | 95%+ | High |
| Rich text editor interactions | 70%+ | Medium |
| Image upload/delete | 80%+ | Medium |
| Responsive/accessibility | E2E only | Low |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved (status: Reviewed)
- [x] `design-style.md` approved (status: Reviewed)
- [ ] Tiptap packages installed (`yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/pm dompurify && yarn add -D @types/dompurify`)
- [ ] Database migration applied (`is_anonymous`, `anonymous_name` columns)
- [ ] Supabase Storage bucket `kudos-images` created with auth policy

### External Dependencies

- Supabase Storage bucket for image uploads (needs to be created)
- Community Standards page URL (for "Tiêu chuẩn cộng đồng" link — placeholder until provided)

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` to generate task breakdown
2. **Review** tasks.md for parallelization opportunities
3. **Begin** implementation following phase order (0 → 9)

---

## Notes

- The `Kudos` interface currently lacks `is_anonymous` and `anonymous_name` — these will be added to both the DB schema and TypeScript types.
- `KudosSearchInput` already has an `onOpenDialog` prop but it's **not connected** in `HeroBanner.tsx` (line 45) — Phase 2 wires this up.
- `HeroBanner` is a Server Component — modal state must be managed by a Client Component parent. The Live Board page will need a Client Component wrapper that renders `HeroBanner` + `WriteKudoModal` and manages the open state.
- `WidgetButton` has a TODO for menu items — Phase 2 populates it with "Viết Kudo" action.
- `useProfileSearch()` is reusable for both recipient search and @mention autocomplete (same `/api/users/search` endpoint).
- The existing `ProfileSearchBar` component is a different pattern (inline search bar) — we build `RecipientField` from scratch.
- **CRITICAL: DOMPurify must run client-side only.** Server Actions on Cloudflare Workers have no DOM. Sanitize HTML in `useWriteKudo.submit()` before calling `createKudo()`.
- Rich text content is stored as sanitized HTML in the `content` column. Display-side rendering must also avoid `dangerouslySetInnerHTML` — use a safe renderer or re-sanitize.
- The `kudos_images` Supabase Storage bucket needs: authenticated upload policy, public read policy, 5MB limit, image MIME type restriction.
- Icons for the toolbar will be added to the existing `Icon.tsx` as new SVG paths, maintaining the project's icon pattern.
- Feed refresh uses `router.refresh()` (not `revalidatePath`) because the feed is managed by `useKudosFeed()` client hook which resets when `initialData` prop changes from the Server Component parent.
