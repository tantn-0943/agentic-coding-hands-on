# Tasks: Viết Kudo (Write Kudos)

**Frame**: `520:11602-viet-kudo`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US7)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies, create project structure, prepare assets, run migration

- [x] T001 Install Tiptap packages and DOMPurify: `yarn add @tiptap/react @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-mention @tiptap/extension-placeholder @tiptap/pm dompurify && yarn add -D @types/dompurify`
- [x] T002 [P] Add modal-specific CSS variables (`--color-modal-bg: #FFF8E1`, `--color-overlay: rgba(0,16,26,0.80)`, `--color-required-red: #CF1322`) | src/app/globals.css
- [x] T003 [P] Add new icon paths to Icon component: bold, italic, strikethrough, ordered-list, link, quote, close-x, plus, send, checkbox-checked | src/components/ui/Icon.tsx
- [x] T004 [P] Download UI assets from Figma (toolbar icons, send arrow) using `get_media_files` to public/icons/ | public/icons/
- [x] T005 [P] Create database migration to add `is_anonymous BOOLEAN DEFAULT false` and `anonymous_name TEXT` columns to `kudos` table | supabase/migrations/20260318000000_add_kudos_anonymous_fields.sql
- [x] T006 [P] Create Supabase Storage bucket `kudos-images` with authenticated upload policy, public read policy, 5MB max, and MIME type restriction (jpeg, png, gif, webp) | supabase/

**Checkpoint**: Dependencies installed, assets ready, DB migration applied, storage bucket created

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Types, validators, and server actions required by ALL user stories

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Add `CreateKudoInput`, `WriteKudoState`, and `UploadResult` interfaces to existing types file. Add `is_anonymous` and `anonymous_name` fields to `Kudos` interface | src/types/kudos.ts
- [x] T008 [P] Add `createKudoSchema` Zod validator: receiver_id (uuid, required), category_tag (string, 1-100, required), content (string, non-empty), hashtag_ids (array 1-5 uuids), media_urls (array 0-5 urls), is_anonymous (boolean, default false), anonymous_name (optional, max 50) | src/lib/kudos/validators.ts
- [x] T009 [P] Add `uploadImageSchema` Zod validator: file type (image/jpeg, image/png, image/gif, image/webp), max 5MB | src/lib/kudos/validators.ts
- [x] T010 Add `createKudo` Server Action: validate with Zod → auth check → insert kudos row → insert kudos_hashtags rows → insert kudos_media rows → return `{ success, kudosId }` | src/lib/kudos/actions.ts
- [x] T011 Add `uploadKudoImage` Server Action: validate file type/size → auth check → upload to Supabase Storage `kudos-images/{userId}/{timestamp}-{filename}` → return `{ url }` | src/lib/kudos/actions.ts

### Tests (Foundation)

- [ ] T012 [P] Unit tests for `createKudoSchema`: valid input passes, missing required fields fail, hashtag count boundaries (0 fails, 1 passes, 5 passes, 6 fails), media_urls max 5, anonymous_name max 50 chars | tests/unit/createKudoSchema.test.ts
- [ ] T013 [P] Integration test for `createKudo` Server Action: creates kudos with hashtags and media, rejects unauthenticated, rejects invalid input | tests/integration/createKudo.test.ts

**Checkpoint**: Foundation ready — types, validators, server actions all in place. User story implementation can begin.

---

## Phase 3: User Story 7 — Cancel and Close Modal (Priority: P1) 🎯 MVP Shell

**Goal**: Modal opens from entry points, closes on Cancel/Escape/overlay click, focus trap works

**Independent Test**: Click search input on Live Board → modal opens. Click "Hủy" → modal closes. Press Escape → modal closes. Click overlay → modal closes. Tab key cycles within modal.

### Frontend (US7)

- [x] T014 [US7] Create `WriteKudoModal` component: overlay (fixed inset-0, z-50, bg rgba(0,16,26,0.8)), dialog container (752px, bg #FFF8E1, rounded-3xl, p-10, flex-col gap-8), focus trap, Escape key handler, click-outside-to-close | src/components/kudos/write/WriteKudoModal.tsx
- [x] T015 [US7] Create `WriteKudoForm` component: form layout skeleton with title "Gửi lời cám ơn và ghi nhận đến đồng đội" (32px, centered), section gap 32px for modal children, 24px gap for Content section. Renders placeholder slots for each form section | src/components/kudos/write/WriteKudoForm.tsx
- [x] T016 [US7] Create `FormActions` component: Cancel button ("Hủy ✕", 16px 40px padding, 4px radius, gold/10 bg, border #998C5F) + Submit button ("Gửi ▷", flex-1, 60px height, 8px radius, #FFEA9E bg, 22px bold). Submit accepts `disabled` and `isLoading` props | src/components/kudos/write/FormActions.tsx
- [x] T017 [US7] Update `HeroBanner` to accept and pass `onOpenDialog` prop to `KudosSearchInput` | src/components/kudos/HeroBanner.tsx
- [x] T018 [US7] Update `WidgetButton` to add "Viết Kudo" menu item that calls `onOpenDialog` prop | src/components/layout/WidgetButton.tsx
- [x] T019 [US7] Wire modal to Live Board page: create Client Component wrapper managing `isModalOpen` state, render `HeroBanner` with `onOpenDialog`, render `WriteKudoModal` conditionally, pass `onClose` callback | src/app/sun-kudos/

### Tests (US7)

- [ ] T020 [P] [US7] Unit test for `WriteKudoModal`: renders when open, fires onClose on Escape, fires onClose on overlay click, traps focus within dialog | tests/unit/WriteKudoModal.test.tsx

**Checkpoint**: Modal shell works — opens from Live Board search input + WidgetButton, closes correctly, focus trap active

---

## Phase 4: User Story 2 — Search and Select Recipient (Priority: P1)

**Goal**: User can search for a colleague by name and select them as the kudos recipient

**Independent Test**: Open modal → type "Nguy" in recipient field → dropdown shows matching profiles → click one → field shows selected name → clear selection works

### Frontend (US2)

- [x] T021 [US2] Create `RecipientField` component: "Người nhận" label (22px, bold) + red asterisk (16px, Noto Sans JP, #CF1322) + search input (flex-1, h-56px, px-24, rounded-lg, border #998C5F, bg white). Reuse `useProfileSearch()` hook. Show dropdown with Avatar + name + department. On select: fill field, call `onSelect(userId)`. On clear: reset. Error state: red border #CF1322 when `error` prop truthy | src/components/kudos/write/RecipientField.tsx

### Tests (US2)

- [ ] T022 [P] [US2] Unit test for `RecipientField`: renders label + input, shows dropdown on typing, selects recipient on click, shows error state, clears on reset | tests/unit/RecipientField.test.tsx

**Checkpoint**: Recipient search works independently in the modal

---

## Phase 5: User Story 3 — Rich Text Editor (Priority: P1)

**Goal**: User can format text with toolbar buttons (B, I, S, OrderedList, Link, Quote) and @mention colleagues

**Independent Test**: Open modal → type text → click Bold → text is bold → type "@Ngu" → mention dropdown shows → select → @mention inserted → click Link → URL input appears

### Frontend (US3)

- [x] T023 [P] [US3] Create `EditorToolbar` component: flex row, h-40px, border #998C5F, rounded-t-lg (8px 8px 0 0). 6 toggle buttons (B, I, S, OrderedList, Link, Quote) using Icon component, each 10px 16px padding, border-right separator. Active state: bg rgba(255,234,158,0.20). "Tiêu chuẩn cộng đồng" link (16px, #FFEA9E) right-aligned. Accepts `editor` instance prop | src/components/kudos/write/EditorToolbar.tsx
- [x] T024 [US3] Create `RichTextEditor` component: Tiptap editor with StarterKit (Bold, Italic, Strike, OrderedList, Blockquote) + Link extension + Placeholder ("Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!") + Mention extension with suggestion config. Editor container: w-full, min-h-200px, p-16px 24px, bg white, border #998C5F, rounded-b-lg (0 0 8px 8px). Mention suggestion: `items({ query })` fetches `/api/users/search?q=${query}` debounced 300ms, max 10 results. Render floating dropdown with Avatar + name. Hint text below editor: "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác" (16px, centered). Exposes `getHTML()` for form submission | src/components/kudos/write/RichTextEditor.tsx

### Tests (US3)

- [ ] T025 [P] [US3] Unit test for `EditorToolbar`: renders 6 buttons, toggles active state on click, calls editor commands | tests/unit/EditorToolbar.test.tsx

**Checkpoint**: Rich text editor works with all formatting options and @mention

---

## Phase 6: User Story 1 — Send a Basic Kudos (Priority: P1) 🎯 MVP

**Goal**: User fills all required fields (recipient, category, content, hashtag) and submits successfully. Modal closes and kudos appears in feed.

**Independent Test**: Open modal → select recipient → enter "Danh hiệu" → type message → add 1 hashtag → click "Gửi" → loading state → modal closes → new kudos visible in feed

### Frontend (US1)

- [x] T026 [US1] Create `CategoryField` component: "Danh hiệu" label (22px, bold) + red asterisk + text input (same style as RecipientField: h-56px, px-24, rounded-lg, border #998C5F, bg white, placeholder "Dành tặng một danh hiệu cho đồng đội"). Description hint below: "Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn." (16px, #999) | src/components/kudos/write/CategoryField.tsx
- [x] T027 [US1] Create `useWriteKudo` hook: manage all form state (recipientId, recipientQuery, categoryTitle, editorContent, selectedHashtags, attachedImages, isAnonymous, anonymousName, isSubmitting, errors). `validate()` checks required fields (recipientId, categoryTitle, editorContent non-empty, selectedHashtags.length >= 1), returns errors map. `submit()` calls DOMPurify.sanitize(content) client-side → calls `createKudo` Server Action → on success: calls `onClose()` + `router.refresh()` → on error: shows Toast, preserves form data. `reset()` clears all state. `isValid` computed boolean for submit button disabled state | src/hooks/useWriteKudo.ts
- [x] T028 [US1] Integrate all components into `WriteKudoForm`: wire `RecipientField` + `CategoryField` + `RichTextEditor`/`EditorToolbar` + `FormActions` with `useWriteKudo` hook. Connect submit button disabled to `!isValid`, loading to `isSubmitting`. Add placeholder sections for HashtagSection and ImageSection (will be filled in US4/US5) | src/components/kudos/write/WriteKudoForm.tsx

### Tests (US1)

- [ ] T029 [P] [US1] Unit test for `useWriteKudo` hook: validates required fields, submit calls createKudo with sanitized HTML, handles success (calls onClose + router.refresh), handles error (preserves form data, shows error), reset clears state | tests/unit/useWriteKudo.test.ts
- [ ] T030 [US1] E2E test: open modal → fill recipient → fill category → type content → add hashtag (mock) → submit → verify modal closes → verify feed refreshes | tests/e2e/write-kudo.spec.ts

**Checkpoint**: Core MVP complete — users can compose and submit kudos with all required fields

---

## Phase 7: User Story 4 — Add Hashtags (Priority: P2)

**Goal**: User can add 1-5 hashtags from a dropdown picker, displayed as chips with remove capability

**Independent Test**: Open modal → click "+ Hashtag" → dropdown shows available hashtags → select 3 → chips appear → click "x" on one → removed → try adding 6th → blocked

### Frontend (US4)

- [x] T031 [US4] Create `HashtagSection` component: "Hashtag" label (22px, bold) + red asterisk + "+ Hashtag" button (chip style: h-48px, px-8, rounded-lg, border #998C5F, bg white, 11px text). On click: fetch `/api/hashtags`, show dropdown. Selected hashtags render as chips (same chip style) with "x" close button. "Tối đa 5" note (11px, #999). Hide "+ Hashtag" when 5 selected. Calls `onAdd(hashtagId)` and `onRemove(hashtagId)` | src/components/kudos/write/HashtagSection.tsx
- [x] T032 [US4] Wire `HashtagSection` into `WriteKudoForm`: connect to `useWriteKudo.selectedHashtags`, add/remove handlers, show validation error when 0 hashtags on submit | src/components/kudos/write/WriteKudoForm.tsx

### Tests (US4)

- [ ] T033 [P] [US4] Unit test for `HashtagSection`: renders button + label, opens dropdown, adds chips on select, removes on "x" click, hides button at max 5, shows error when empty | tests/unit/HashtagSection.test.tsx

**Checkpoint**: Hashtag picker fully functional with min 1 / max 5 enforcement

---

## Phase 8: User Story 5 — Attach Images (Priority: P2)

**Goal**: User can attach 0-5 images with thumbnail preview and delete capability

**Independent Test**: Open modal → click "+ Image" → file picker opens → select image → thumbnail (80x80) appears with red delete button → click delete → removed → add 5 images → "+ Image" button hides

### Frontend (US5)

- [x] T034 [US5] Create `ImageSection` component: "Image" label (22px, bold, no asterisk). Thumbnails row: 80x80px, rounded-4px, border 1px #FFEA9E, object-cover. Delete button: absolute top-right (-6px), 20x20, bg #D4271D, rounded-full, white "x" icon. "+ Image" button (same chip style as hashtag: h-48px, px-8, rounded-lg, border #998C5F). "Tối đa 5" note. File picker accepts image/jpeg,png,gif,webp. On file select: call `uploadKudoImage` Server Action eagerly → show loading on thumbnail → on success show image → on error show Toast. Hide button when 5 attached. Calls `onUpload(url)` and `onRemove(index)` | src/components/kudos/write/ImageSection.tsx
- [x] T035 [US5] Wire `ImageSection` into `WriteKudoForm`: connect to `useWriteKudo.attachedImages`, upload/remove handlers | src/components/kudos/write/WriteKudoForm.tsx

### Tests (US5)

- [ ] T036 [P] [US5] Unit test for `ImageSection`: renders thumbnails, triggers file picker, shows loading during upload, shows thumbnail on success, removes on delete click, hides button at max 5 | tests/unit/ImageSection.test.tsx

**Checkpoint**: Image upload/delete works with eager upload to Supabase Storage

---

## Phase 9: User Story 6 — Anonymous Kudos (Priority: P3)

**Goal**: User can toggle anonymous mode and optionally enter a custom display name

**Independent Test**: Open modal → check anonymous checkbox → text field appears → enter "Người ẩn danh" → submit → kudos shows custom anonymous name. Also: check → leave empty → submit → shows "Ẩn danh". Also: check → uncheck → field disappears.

### Frontend (US6)

- [x] T037 [US6] Create `AnonymousToggle` component: flex row, gap 16px. Checkbox: 24x24, rounded-4px, border 1px #999, bg white. Label: "Gửi lời cám ơn và ghi nhận ẩn danh" (22px, #999). When checked: show text input below (h-56px, same style as other inputs, placeholder "Nhập tên ẩn danh"). When unchecked: hide input, clear value. Calls `onToggle(isAnonymous)` and `onNameChange(name)` | src/components/kudos/write/AnonymousToggle.tsx
- [x] T038 [US6] Wire `AnonymousToggle` into `WriteKudoForm`: connect to `useWriteKudo.isAnonymous` and `useWriteKudo.anonymousName` | src/components/kudos/write/WriteKudoForm.tsx

### Tests (US6)

- [ ] T039 [P] [US6] Unit test for `AnonymousToggle`: renders checkbox + label, shows input on check, hides on uncheck, clears name on uncheck | tests/unit/AnonymousToggle.test.tsx

**Checkpoint**: Anonymous mode works with conditional name field

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, responsive design, animations, error handling

- [x] T040 [P] Add ARIA attributes to `WriteKudoModal`: `role="dialog"`, `aria-modal="true"`, `aria-labelledby` pointing to title, label all form fields with `aria-label` or `<label>` | src/components/kudos/write/WriteKudoModal.tsx
- [x] T041 [P] Add responsive styles to `WriteKudoModal`: mobile (< 768px) fullscreen w-full h-full rounded-0 p-16px, tablet (768-1023px) w-90vw max-w-752px, desktop (>= 1024px) w-752px centered. Adjust field rows to stack vertically on mobile, image thumbnails 60x60 on mobile | src/components/kudos/write/WriteKudoModal.tsx
- [x] T042 [P] Add modal open/close animations: overlay opacity 200ms ease-out, dialog opacity + scale(0.95→1) 200ms ease-out | src/components/kudos/write/WriteKudoModal.tsx
- [ ] T043 [P] Add error toast integration: network failure on submit → Toast "Gửi thất bại, vui lòng thử lại", image upload failure → Toast "Tải ảnh thất bại", session expired → redirect to login | src/hooks/useWriteKudo.ts
- [x] T044 [P] Add toolbar button hover/active transitions: bg-color 150ms ease-in-out for toolbar, submit, and cancel buttons per design-style.md animation specs | src/components/kudos/write/EditorToolbar.tsx
- [ ] T045 E2E test for responsive modal: verify mobile fullscreen, desktop centered, keyboard navigation (Tab cycling, Escape close) | tests/e2e/write-kudo.spec.ts

**Checkpoint**: Feature is polished, accessible, responsive, and production-ready

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)         → No dependencies, start immediately
Phase 2 (Foundation)    → Depends on Phase 1 (packages installed, migration applied)
Phase 3 (US7 - Modal)   → Depends on Phase 2 (types needed)
Phase 4 (US2 - Search)  → Depends on Phase 3 (modal shell needed)
Phase 5 (US3 - Editor)  → Depends on Phase 3 (modal shell needed)
Phase 6 (US1 - Submit)  → Depends on Phase 3 + 4 + 5 (all P1 components needed)
Phase 7 (US4 - Hashtag)  → Depends on Phase 6 (form hook needed)
Phase 8 (US5 - Images)   → Depends on Phase 6 (form hook needed)
Phase 9 (US6 - Anon)     → Depends on Phase 6 (form hook needed)
Phase 10 (Polish)        → Depends on all user stories complete
```

### Parallel Opportunities

```
Phase 1: T002 || T003 || T004 || T005 || T006 (all independent setup tasks)
Phase 2: T008 || T009 || T012 || T013 (validators + tests in parallel)
Phase 3: After modal shell (T014-T019), test T020 runs parallel
Phase 4 || Phase 5: US2 (RecipientField) and US3 (RichTextEditor) can run in parallel
                     — they work on different files within the modal
Phase 7 || Phase 8 || Phase 9: US4, US5, US6 can all run in parallel after US1
Phase 10: All polish tasks (T040-T044) can run in parallel
```

### Within Each User Story

- Tests written first where marked [P] (can run in parallel)
- Component implementation before integration wiring
- Integration wiring connects component to parent form
- Checkpoint validates the story is independently testable

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup) + Phase 2 (Foundation)
2. Complete Phase 3 (US7 - Modal Shell)
3. Complete Phase 4 (US2 - Recipient) + Phase 5 (US3 - Editor) — in parallel
4. Complete Phase 6 (US1 - Submit) — **this is the MVP**
5. **STOP and VALIDATE**: Test end-to-end flow with hardcoded hashtag
6. Deploy if ready

### Incremental Delivery

1. Setup + Foundation → verify migration + server actions
2. US7 (Modal) → verify open/close
3. US2 + US3 (Recipient + Editor) → verify form inputs
4. US1 (Submit) → **MVP deployed**
5. US4 (Hashtags) → verify picker
6. US5 (Images) → verify upload/delete
7. US6 (Anonymous) → verify toggle
8. Polish → verify responsive + a11y

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 45 |
| **Phase 1 (Setup)** | 6 |
| **Phase 2 (Foundation)** | 7 |
| **Phase 3 (US7 - Modal)** | 7 + 1 test |
| **Phase 4 (US2 - Recipient)** | 1 + 1 test |
| **Phase 5 (US3 - Editor)** | 2 + 1 test |
| **Phase 6 (US1 - Submit)** | 3 + 2 tests |
| **Phase 7 (US4 - Hashtag)** | 2 + 1 test |
| **Phase 8 (US5 - Images)** | 2 + 1 test |
| **Phase 9 (US6 - Anon)** | 2 + 1 test |
| **Phase 10 (Polish)** | 6 |
| **Parallel opportunities** | 22 tasks (49%) |
| **MVP scope** | Phases 1–6 (T001–T030) |

---

## Notes

- Commit after each phase or logical group of tasks
- Run `vitest run` before moving to next phase
- Update spec.md if requirements change during implementation
- Mark tasks complete as you go: `[x]`
- DOMPurify sanitization happens in `useWriteKudo.submit()` — never on the server
- Feed refresh uses `router.refresh()`, not `revalidatePath`
- `HeroBanner` is a Server Component — modal state lives in a Client Component parent wrapper
