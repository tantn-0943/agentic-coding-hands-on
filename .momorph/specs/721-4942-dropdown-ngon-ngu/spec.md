# Feature Specification: Dropdown Ngôn Ngữ (Language Selector Dropdown)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-20
**Status**: Reviewed

---

## Overview

The "Dropdown-ngôn ngữ" (Language Dropdown) is a compact dropdown menu that allows users to switch the application UI language between Vietnamese (VN) and English (EN). It appears when the user clicks the language selector button in the navigation bar (visible on the Login screen and the global Header). The dropdown shows two options — each displaying a country flag icon and a language code — with the currently selected language visually highlighted.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Switch Language (Priority: P1)

A user wants to change the application language from Vietnamese to English (or vice versa) by clicking the language selector and choosing the desired option from the dropdown.

**Why this priority**: Language selection is the core and only function of this component. Without it, the dropdown has no purpose.

**Independent Test**: Click the language button in the nav bar → dropdown opens showing VN (selected) and EN → click EN → dropdown closes, UI language changes to English, button label updates to "EN" with the UK flag.

**Acceptance Scenarios**:

1. **Given** the language selector button shows "VN" with the Vietnam flag, **When** the user clicks the button, **Then** a dropdown appears with two options: "VN" (highlighted as selected) and "EN".
2. **Given** the dropdown is open and "VN" is currently selected, **When** the user clicks "EN", **Then** the dropdown closes, the button updates to show "EN" with the UK flag, and the application UI language switches to English.
3. **Given** the dropdown is open and "EN" is currently selected, **When** the user clicks "VN", **Then** the dropdown closes, the button updates to show "VN" with the Vietnam flag, and the application UI language switches to Vietnamese.
4. **Given** the dropdown is open, **When** the user clicks the already-selected language, **Then** the dropdown closes with no change.

---

### User Story 2 - Open and Close Dropdown (Priority: P1)

A user can open the language dropdown by clicking the selector button and close it by clicking outside or pressing Escape.

**Why this priority**: Basic open/close behavior is essential for the dropdown to be usable.

**Independent Test**: Click the language button → dropdown opens. Click outside → dropdown closes. Open again → press Escape → dropdown closes.

**Acceptance Scenarios**:

1. **Given** the dropdown is closed, **When** the user clicks the language button, **Then** the dropdown opens below the button.
2. **Given** the dropdown is open, **When** the user clicks outside the dropdown, **Then** the dropdown closes.
3. **Given** the dropdown is open, **When** the user presses Escape, **Then** the dropdown closes.
4. **Given** the dropdown is open, **When** the user clicks the language button again, **Then** the dropdown closes (toggle behavior).

---

### User Story 3 - Keyboard Accessibility (Priority: P2)

A user navigates the language dropdown using keyboard only (Tab, Arrow keys, Enter/Space).

**Why this priority**: Accessibility is important but secondary to core functionality.

**Independent Test**: Tab to language button → press Enter → dropdown opens → Arrow Down to EN → press Enter → language changes.

**Acceptance Scenarios**:

1. **Given** the language button is focused, **When** the user presses Enter or Space, **Then** the dropdown opens.
2. **Given** the dropdown is open, **When** the user presses Arrow Down/Up, **Then** focus moves between the two options.
3. **Given** a dropdown option is focused, **When** the user presses Enter, **Then** the option is selected, the dropdown closes, and the language changes.

---

### Edge Cases

- What if the language change fails (e.g., i18n resource not loaded)? → Show the previous language, log error.
- What if the dropdown is opened while an async operation is in progress? → Dropdown should still work; language switch is a client-side operation.
- What if the same language is selected? → Close dropdown, no change triggered.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Language Button (trigger) | Displays current language flag + code (e.g., 🇻🇳 VN) with chevron-down icon | Click → toggle dropdown |
| Dropdown Container (A) | Dark container with 2 language options, border #998C5F, rounded 8px | Appears below trigger button |
| Selected Language Item (A.1) | Highlighted row: flag icon + language code, bg rgba(255,234,158,0.20) | Click → close dropdown (already selected) |
| Unselected Language Item (A.2) | Default row: flag icon + language code, dark bg | Click → select language, close dropdown |

### Navigation Flow

- **From**: Login screen language selector button (`662:14387`) OR global Header language selector (all authenticated screens)
- **To**: Closes back to the same screen with updated language
- **Triggers**: Click on language selector button
- **Note**: The dropdown is an inline overlay, not a separate route. It appears at the same position regardless of which screen triggers it.

### Visual Requirements

- Dropdown positioned below the language selector button, **right-aligned** with the trigger (dropdown right edge aligns with button right edge) to avoid overflow on smaller viewports
- Dark theme matching the navbar/login page aesthetic
- Responsive: same behavior on all screen sizes (dropdown width is fixed ~122px)
- Animations: opacity + transform 150ms ease-out on open/close
- Accessibility: WCAG AA, keyboard navigable, `role="listbox"` with `role="option"` items

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a dropdown with exactly two language options: VN (Vietnamese) and EN (English).
- **FR-002**: Each option MUST show a country flag icon (24x24) and language code text.
- **FR-003**: The currently selected language MUST be visually highlighted with a distinct background color.
- **FR-004**: Clicking an unselected language MUST switch the application UI language and close the dropdown.
- **FR-005**: Clicking the selected language or clicking outside MUST close the dropdown without changes.
- **FR-006**: The language selector button in the nav MUST update its flag + code to reflect the selected language.
- **FR-007**: Language preference MUST be persisted in a cookie across page reloads. Default locale is `vi` (Vietnamese).

### Technical Requirements

- **TR-001**: Language switching MUST use Next.js internationalization (i18n) or a client-side locale context — no full page reload required.
- **TR-002**: The dropdown MUST close when clicking outside (click-outside handler).
- **TR-003**: The dropdown MUST support keyboard navigation (Arrow keys, Enter, Escape) per WCAG 2.1 AA.
- **TR-004**: The dropdown MUST use `role="listbox"` and `role="option"` ARIA attributes. Each option MUST have `aria-selected="true|false"` to indicate selection state.

### Key Entities *(data)*

- **Locale**: `{ code: 'vi' | 'en', label: 'VN' | 'EN', flagIcon: string }`

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A | - | Language switching is client-side only (no API needed) | - |

---

## State Management

### Local Component State

| State | Type | Description |
|-------|------|-------------|
| isOpen | boolean | Whether the dropdown is open |
| selectedLocale | 'vi' \| 'en' | Currently selected language |
| focusedIndex | number \| null | Index of keyboard-focused option (0 = first, 1 = second) |

### Loading & Error States

| State | Behavior |
|-------|----------|
| Language switch in progress | Immediate — client-side context update, no loading indicator needed |
| Language resource load failure | Revert to previous locale, log error to console. No user-visible error (graceful degradation). |

### Persistence

- Selected locale MUST be stored in a cookie (`locale` or `NEXT_LOCALE`) for SSR hydration and persistence across sessions.
- Default locale: `vi` (Vietnamese) when no cookie exists.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Language switch completes within 100ms (no perceptible delay).
- **SC-002**: Dropdown open/close animation is smooth (150ms, no jank).
- **SC-003**: Keyboard-only users can switch language without a mouse.

---

## Out of Scope

- Adding more languages beyond VN and EN (future enhancement)
- Server-side language detection based on browser `Accept-Language` header
- RTL (right-to-left) layout support
- Language-specific content translation (handled by i18n system, not this component)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [x] Existing `LanguageSelector` button component exists (`src/components/auth/LanguageSelector.tsx`)
- [ ] i18n/locale infrastructure set up in the project

---

## Notes

- The existing `LanguageSelector.tsx` component renders only the trigger button (flag + "VN" + chevron). It does NOT have dropdown functionality yet — the dropdown is what this spec defines.
- The dropdown uses a dark color scheme (`#00070C` container bg) consistent with the Login page and global Header theme.
- The selected item has a subtle gold highlight (`rgba(255,234,158,0.20)`) matching the project's gold accent.
- Flag icons are used as 24x24 country flag components — VN (Vietnam) and GB-NIR (Northern Ireland / UK).
- The dropdown appears in the Login screen (`662:14387`) and potentially in the global Header across all screens.
- Per SCREENFLOW.md: Login → Language selector click → Dropdown-ngôn ngữ → Language selected → Login.
