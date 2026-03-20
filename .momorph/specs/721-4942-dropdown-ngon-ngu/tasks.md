# Tasks: Dropdown Ngôn Ngữ (Language Selector Dropdown)

**Frame**: `721:4942-dropdown-ngon-ngu`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1–US3)
- **|**: File path affected by this task

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create locale infrastructure, assets, and types required by all user stories

- [x] T001 [P] Add UK flag SVG asset (`en-flag.svg`) to public/icons/ — download from Figma using `get_media_files` or create manually | public/icons/en-flag.svg
- [x] T002 [P] Create `Locale` type (`{ code: 'vi' | 'en', label: 'VN' | 'EN', flagSrc: string }`) and `LOCALES` constant array in types file | src/types/locale.ts
- [x] T003 Create `LocaleProvider` context and `useLocale()` hook: React Context holding `locale` + `setLocale`, cookie read on init (name: `NEXT_LOCALE`, default: `vi`), cookie write on change (`Path=/; SameSite=Lax; Max-Age=31536000`). Export both `LocaleProvider` and `useLocale` | src/hooks/useLocale.tsx
- [x] T004 Wrap app with `<LocaleProvider>`: import and wrap `{children}` in root layout | src/app/layout.tsx

**Checkpoint**: Locale infrastructure ready — `useLocale()` returns current locale and `setLocale()` writes cookie. No UI changes yet.

---

## Phase 2: User Story 1 + 2 — Switch Language & Open/Close Dropdown (Priority: P1) 🎯 MVP

**Goal**: User can click the language selector button → dropdown opens with VN/EN options → click an option → language switches, dropdown closes, trigger button updates. Click outside or Escape also closes the dropdown.

**Independent Test**: Click language button → dropdown opens showing VN (highlighted) and EN → click EN → dropdown closes, button shows "EN" with UK flag, cookie set to `en`. Click outside → dropdown closes. Press Escape → dropdown closes.

### Frontend (US1 + US2)

- [x] T005 [US1] Create `LanguageDropdown` component: dropdown panel with `role="listbox"`, dark bg (#00070C), border 1px #998C5F, rounded-lg, p-1.5, position absolute right-0 top-full mt-2 z-50. Renders 2 `LanguageOption` buttons from `LOCALES` array. Each option: `role="option"`, `aria-selected`, h-14, px-4, rounded, flex items-center gap-1, flag icon (next/image 24x24) + label text (16px, 700, white, Montserrat, tracking-[0.15px]). Selected: bg rgba(255,234,158,0.20). Unselected: bg transparent, hover bg rgba(255,234,158,0.10). Transition bg 150ms ease-in-out. Accepts `selectedLocale`, `onSelect(code)`, `onClose()` props | src/components/auth/LanguageDropdown.tsx
- [x] T006 [US2] Refactor `LanguageSelector` to named export. Add `isOpen` state, wrap in relative div. On button click: toggle `isOpen`. Update `aria-expanded` dynamically. When `isOpen`: render `<LanguageDropdown>`. Read current locale from `useLocale()`. Update trigger button flag src + label dynamically based on locale. On option select: call `setLocale(code)` + close. Add open/close animation: dropdown transitions opacity 0→1 + translateY(-4px→0) 150ms ease-out | src/components/auth/LanguageSelector.tsx
- [x] T007 [P] [US2] Add click-outside handler: useEffect with mousedown listener on document, close dropdown if click target is outside the wrapper ref (same pattern as Header profile dropdown) | src/components/auth/LanguageSelector.tsx
- [x] T008 [P] [US2] Add Escape key handler: useEffect with keydown listener, close dropdown on Escape key | src/components/auth/LanguageSelector.tsx
- [x] T009 [US1] Update `Header.tsx` import from `import LanguageSelector from` → `import { LanguageSelector } from` | src/components/layout/Header.tsx
- [x] T010 [P] [US1] Update login page import from `import LanguageSelector from` → `import { LanguageSelector } from` | src/app/(auth)/login/page.tsx

**Checkpoint**: MVP complete — dropdown opens/closes, language switches, cookie persists, trigger updates. Both Login and Header entry points work.

---

## Phase 3: User Story 3 — Keyboard Accessibility (Priority: P2)

**Goal**: User can navigate the dropdown using keyboard only: Enter/Space opens, Arrow Down/Up moves focus, Enter selects, Escape closes.

**Independent Test**: Tab to language button → press Enter → dropdown opens → press Arrow Down → focus moves to EN → press Enter → language changes to EN, dropdown closes.

### Frontend (US3)

- [x] T011 [US3] Add `focusedIndex` state to `LanguageSelector`. On dropdown open: set focusedIndex to index of selected locale, focus that option. On Arrow Down/Up: cycle focusedIndex between 0 and 1, move DOM focus to corresponding option button. On Enter while option focused: select that locale, close dropdown. On Escape: close dropdown, return focus to trigger button. Pass `focusedIndex` to `LanguageDropdown` for visual focus indicator | src/components/auth/LanguageSelector.tsx
- [x] T012 [US3] Update `LanguageDropdown` to accept `focusedIndex` prop, apply `ref` to each option button for programmatic focus. Add `tabIndex={0}` to options, `tabIndex={-1}` to non-focused options. Ensure `role="option"` buttons receive focus correctly | src/components/auth/LanguageDropdown.tsx

**Checkpoint**: Full keyboard navigation works — screen reader users and keyboard-only users can switch language without a mouse.

---

## Phase 4: Polish & Cross-Cutting Concerns

**Purpose**: Tests, responsive validation, final quality checks

- [x] T013 [P] Unit test for `useLocale` hook: initializes with default `vi` when no cookie, reads existing cookie, `setLocale` updates context and writes cookie, handles invalid cookie value gracefully | tests/unit/useLocale.test.ts
- [x] T014 [P] Unit test for `LanguageDropdown`: renders 2 options with correct flags/labels, highlights selected option, calls onSelect on click, calls onClose on already-selected click | tests/unit/LanguageDropdown.test.tsx
- [x] T015 E2E test: open dropdown from login page, switch VN→EN, verify trigger updates, reload page, verify EN persisted from cookie. Also test: click outside closes, Escape closes, keyboard Arrow+Enter works | tests/e2e/language-selector.spec.ts
- [x] T016 [P] Responsive verification: check dropdown right-alignment on mobile (375px), tablet (768px), desktop (1440px) — dropdown must not overflow viewport | manual or E2E

**Checkpoint**: Feature is tested, accessible, responsive, and production-ready.

---

## Phase 5: Bug Fix — Đa ngôn ngữ chưa hoạt động (i18n not functional)

**Purpose**: The locale dropdown switches the context value and cookie, but no text actually changes — all UI strings are hardcoded. Add a minimal translation system so switching VN↔EN visibly changes the UI.

- [x] T017 Create translation dictionaries (`vi.ts` and `en.ts`) with key-value pairs for Login page, Header nav links, and Footer text. Create a `useTranslations()` hook that reads locale from `useLocale()` and returns the matching dictionary | src/lib/i18n/messages.ts, src/hooks/useTranslations.ts
- [x] T018 Update Login page to use `useTranslations()` for hero text, footer, and button labels — requires extracting the login page content into a Client Component wrapper since the page is a Server Component | src/app/(auth)/login/page.tsx, src/components/auth/LoginContent.tsx
- [x] T019 [P] Update Header nav links to use `useTranslations()` for link labels | src/components/layout/Header.tsx
- [x] T020 [P] Update Footer text to use `useTranslations()` | src/components/layout/Footer.tsx
- [x] T021 Update unit tests for `useTranslations` hook and verify language switch changes visible text | tests/unit/useTranslations.test.tsx

**Checkpoint**: Switching VN↔EN visibly changes Login text, Header nav labels, and Footer copyright.

---

## Phase 6: Bug Fix — Hydration mismatch (SSR renders default locale, client reads cookie)

**Purpose**: Fix `Hydration failed because the server rendered text didn't match the client` error. Root cause: `useState(readLocaleCookie)` reads `document.cookie` on client but returns `DEFAULT_LOCALE` on server — if cookie is `en`, the initial render differs between server and client.

- [x] T022 Fix `LocaleProvider` in `useLocale.tsx`: initialize `useState` with `DEFAULT_LOCALE` always (matching SSR), then sync from cookie in `useEffect` after hydration. This ensures server and client render the same value on first render, then client updates to cookie value after mount. | src/hooks/useLocale.tsx

**Checkpoint**: No hydration errors when `NEXT_LOCALE=en` cookie exists.

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 1 (Setup)             → No dependencies, start immediately
Phase 2 (US1 + US2 - MVP)   → Depends on Phase 1 (types, hook, provider needed)
Phase 3 (US3 - Keyboard)    → Depends on Phase 2 (dropdown must exist)
Phase 4 (Polish)             → Depends on Phase 2 (tests need working component)
                               Phase 3 tasks can run in parallel with Phase 4
```

### Within Each Phase

- T001 and T002 are parallel (different files)
- T003 depends on T002 (needs Locale type)
- T004 depends on T003 (needs LocaleProvider)
- T005 depends on T002 + T001 (needs types + flag asset)
- T006 depends on T003 + T005 (needs hook + dropdown component)
- T007 and T008 are parallel (independent handlers added to same file, different useEffects)
- T009 and T010 are parallel (different files, same import change)
- T011 depends on T006 (extends LanguageSelector)
- T012 depends on T005 (extends LanguageDropdown)
- T013 and T014 are parallel (different test files)
- T015 depends on all implementation tasks

### Parallel Opportunities

```
Phase 1: T001 || T002 (asset + types in parallel)
Phase 2: T007 || T008 (click-outside + Escape handlers in parallel)
          T009 || T010 (Header + Login import updates in parallel)
Phase 3: T011 and T012 can be done together (same feature, coupled files)
Phase 4: T013 || T014 || T016 (all independent test files)
```

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Setup: asset, types, hook, provider)
2. Complete Phase 2 (US1 + US2: dropdown + language switch)
3. **STOP and VALIDATE**: Open dropdown, switch language, check cookie, reload
4. Deploy if ready — keyboard accessibility (US3) can follow

### Incremental Delivery

1. Phase 1 (Setup) → verify `useLocale()` works in isolation
2. Phase 2 (US1+US2) → **MVP deployed** — dropdown functional
3. Phase 3 (US3) → keyboard accessibility added
4. Phase 4 (Polish) → tests + responsive check

---

## Summary

| Metric | Count |
|--------|-------|
| **Total tasks** | 16 |
| **Phase 1 (Setup)** | 4 |
| **Phase 2 (US1 + US2 — MVP)** | 6 |
| **Phase 3 (US3 — Keyboard)** | 2 |
| **Phase 4 (Polish)** | 4 |
| **Parallel opportunities** | 8 tasks (50%) |
| **MVP scope** | Phases 1–2 (T001–T010) |

---

## Notes

- Commit after each phase or logical group of tasks
- Run `vitest run` before moving to next phase
- The `LanguageSelector` refactoring from `export default` to named export (T006) requires T009 and T010 to update imports — do these together to avoid build breaks
- T007 and T008 are listed separately for clarity but can be implemented in a single commit since they modify the same file
- Mark tasks complete as you go: `[x]`
