# Feature Specification: Viết Kudo (Write Kudos)

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-17
**Status**: Reviewed

---

## Overview

The "Viết Kudo" (Write Kudos) screen is a modal dialog that allows Sunners to compose and send appreciation messages (kudos) to their colleagues. It features a rich text editor with formatting toolbar, recipient search, hashtag selection, image attachments, and an anonymous sending option. This is the primary write action in the SAA 2025 Kudos system.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Send a Basic Kudos (Priority: P1)

A Sunner wants to send a simple appreciation message to a colleague by filling in the required fields (recipient, content, hashtag) and clicking "Gửi".

**Why this priority**: This is the core action — without it, no kudos content exists. Every other feature on the Live Board depends on kudos being created.

**Independent Test**: Open the modal, fill in recipient, type a message, add a hashtag, click "Gửi" — verify the kudos appears in the feed.

**Acceptance Scenarios**:

1. **Given** the modal is open, **When** the user selects a recipient from the search dropdown, types a message in the rich text area, adds at least 1 hashtag, and clicks "Gửi", **Then** the kudos is saved to the database and the modal closes.
2. **Given** the modal is open, **When** the user clicks "Gửi" without filling required fields (recipient, content, or hashtag), **Then** the button is disabled or validation errors are shown with red borders on empty required fields.
3. **Given** the user has filled all required fields, **When** they click "Gửi", **Then** a loading state is shown on the button, and on success the modal closes and the new kudos appears in the All Kudos feed.

---

### User Story 2 - Search and Select Recipient (Priority: P1)

A Sunner searches for a colleague by name in the "Người nhận" (Recipient) field using an autocomplete dropdown.

**Why this priority**: The recipient is a required field — the form cannot be submitted without it.

**Independent Test**: Type a colleague's name in the search field, verify dropdown results appear, select one, verify it fills the field.

**Acceptance Scenarios**:

1. **Given** the recipient search field is focused, **When** the user types at least 1 character, **Then** a dropdown of matching Sunner profiles appears (filtered by typed text).
2. **Given** the dropdown shows results, **When** the user clicks a result, **Then** the recipient is selected and displayed in the field.
3. **Given** no results match, **When** the user types a query, **Then** an empty state message is shown in the dropdown.
4. **Given** the recipient field is empty, **When** the user attempts to submit, **Then** a red border appears on the field indicating it's required.

---

### User Story 3 - Use Rich Text Editor (Priority: P1)

A Sunner formats their appreciation message using the toolbar (bold, italic, strikethrough, numbered list, link, quote) and can @mention colleagues.

**Why this priority**: The rich text editor is the primary content input — it's part of the core writing experience.

**Independent Test**: Type text, apply bold formatting, verify it renders bold. Type "@" followed by a name, verify mention suggestions appear.

**Acceptance Scenarios**:

1. **Given** the text area is focused, **When** the user clicks the Bold (B) button and types text, **Then** the text is rendered in bold.
2. **Given** text is selected, **When** the user clicks Italic (I), **Then** the selected text becomes italic.
3. **Given** text is selected, **When** the user clicks Strikethrough (S), **Then** the text is struck through.
4. **Given** the cursor is in the text area, **When** the user clicks the Numbered List button, **Then** a numbered list is started.
5. **Given** the cursor is in the text area, **When** the user clicks the Link button, **Then** a dialog appears to enter a URL.
6. **Given** the cursor is in the text area, **When** the user clicks the Quote button, **Then** a blockquote format is applied.
7. **Given** the user types "@" followed by characters, **When** matching colleagues are found, **Then** a mention suggestion dropdown appears.
8. **Given** the text area is empty, **When** the placeholder is visible, **Then** it reads "Hãy gửi gắm lời cám ơn và ghi nhận đến đồng đội tại đây nhé!"

---

### User Story 4 - Add Hashtags (Priority: P2)

A Sunner adds 1-5 hashtags to categorize their kudos by clicking "+ Hashtag" and selecting from a dropdown.

**Why this priority**: Hashtags are required (min 1) and enable filtering on the Live Board, but the core message can function without them initially.

**Independent Test**: Click "+ Hashtag", select a tag, verify it appears as a chip. Try adding a 6th — verify it's blocked.

**Acceptance Scenarios**:

1. **Given** the hashtag section is visible, **When** the user clicks "+ Hashtag", **Then** a dropdown of available hashtags opens.
2. **Given** the dropdown is open, **When** the user selects a hashtag, **Then** it appears as a chip/tag below the label.
3. **Given** 5 hashtags are already added, **When** the user views the section, **Then** the "+ Hashtag" button is hidden.
4. **Given** a hashtag chip is displayed, **When** the user clicks the "x" on the chip, **Then** the hashtag is removed.
5. **Given** no hashtags are selected, **When** the user tries to submit, **Then** validation prevents submission and shows an error.

---

### User Story 5 - Attach Images (Priority: P2)

A Sunner attaches up to 5 images to their kudos by clicking "+ Image" and selecting files.

**Why this priority**: Images are optional and enhance the kudos but are not required for the core flow.

**Independent Test**: Click "+ Image", select a file, verify thumbnail appears with "x" delete button. Add 5 images, verify button hides.

**Acceptance Scenarios**:

1. **Given** the image section is visible, **When** the user clicks "+ Image", **Then** a file picker opens for image selection.
2. **Given** an image is selected, **When** it's uploaded, **Then** a thumbnail (80x80px) appears with a red "x" delete button.
3. **Given** 5 images are attached, **When** the user views the section, **Then** the "+ Image" button is hidden.
4. **Given** an image thumbnail is displayed, **When** the user clicks the red "x", **Then** the image is removed from the attachment list.

---

### User Story 6 - Send Anonymous Kudos (Priority: P3)

A Sunner toggles the "Gửi lời cám ơn và ghi nhận ẩn danh" checkbox to send the kudos anonymously, optionally entering a custom anonymous display name.

**Why this priority**: Anonymous sending is a nice-to-have feature that enhances privacy but is not required for basic kudos functionality.

**Independent Test**: Check the anonymous checkbox, verify a text field appears for anonymous name. Enter a name, submit the form, verify the kudos shows as anonymous with the custom name in the feed.

**Acceptance Scenarios**:

1. **Given** the anonymous checkbox is unchecked (default), **When** the user checks it, **Then** the anonymous mode is enabled and a text field for entering an anonymous display name appears.
2. **Given** anonymous mode is enabled and the user enters a custom name, **When** the user submits the kudos, **Then** the sender is shown with the custom anonymous name in the feed.
3. **Given** anonymous mode is enabled and the name field is left empty, **When** the user submits the kudos, **Then** the sender is shown as "Ẩn danh" (Anonymous) in the feed.
4. **Given** anonymous mode is enabled, **When** the user unchecks the checkbox, **Then** the anonymous name field is hidden and the mode is disabled.

---

### User Story 7 - Cancel and Close Modal (Priority: P1)

A Sunner cancels the kudos writing process by clicking "Hủy" or closing the modal.

**Why this priority**: Users must always be able to exit without saving — this is a basic UX requirement.

**Independent Test**: Fill in some fields, click "Hủy", verify modal closes and no data is saved.

**Acceptance Scenarios**:

1. **Given** the modal is open with data entered, **When** the user clicks "Hủy" (Cancel), **Then** the modal closes and all entered data is discarded.
2. **Given** the modal is open, **When** the user clicks outside the modal (overlay), **Then** the modal closes.

---

### Edge Cases

- What if the user's session expires while the modal is open? → Show session expired error, prompt to log in again.
- What if the image upload fails? → Show error toast, allow retry.
- What if the network drops while submitting? → Show error message, keep form data intact for retry.
- What if the recipient search returns too many results? → Limit dropdown to 10 results with "type more to narrow" hint.
- What if the user pastes very long text? → Allow it but show character count guidance.
- What if the user tries to submit while another submission is in progress? → Disable the "Gửi" button during submission (loading state).

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Modal Overlay | Dark semi-transparent backdrop (80% opacity #00101A) | Click → close modal |
| Modal Dialog | Cream (#FFF8E1) rounded container (752x1012px, radius 24px) | Scrollable if content exceeds |
| Title (A) | "Gửi lời cám ơn và ghi nhận đến đồng đội" centered heading | Static display |
| Recipient Field (B) | "Người nhận *" label + search dropdown input | Type → autocomplete, Select → fill |
| Category/Title Field | "Danh hiệu *" label + text input for honorary title (required) | Type → fill, placeholder guidance + description hint below |
| Rich Text Toolbar (C) | 6 formatting buttons: B, I, S, numbered list, link, quote + "Tiêu chuẩn cộng đồng" link | Toggle → apply/remove formatting |
| Text Area (D) | Rich text editor with placeholder and @mention support | Type → compose message |
| Hint Text (D.1) | "Bạn có thể '@ + tên' để nhắc tới đồng nghiệp khác" | Static display |
| Hashtag Section (E) | "Hashtag *" label + "+ Hashtag" button + chips | Click → add/remove tags |
| Image Section (F) | "Image" label + thumbnails (80x80) + "+ Image" button | Click → add/remove images |
| Anonymous Checkbox (G) | "Gửi lời cám ơn và ghi nhận ẩn danh" toggle | Check/uncheck → reveals name field |
| Anonymous Name Field (G.1) | Text input for custom anonymous display name (conditional) | Type name, shown only when checkbox checked |
| Cancel Button (H.1) | "Hủy ✕" text button with border | Click → close modal |
| Submit Button (H.2) | "Gửi ▷" primary gold button | Click → validate + submit |

### Navigation Flow

- **From**: Sun* Kudos Live Board (pill search input click) OR Homepage (Write Kudo button)
- **To**: Closes back to Live Board (on submit or cancel)
- **Sub-navigations**: Hashtag picker → Dropdown list hashtag (1002:13013), Link dialog → Addlink Box (1002:12917)
- **Triggers**: Click pill input on Live Board, click "Write Kudo" on Homepage

### Visual Requirements

- **Modal behavior**: Centered overlay, cream background (#FFF8E1), 24px border-radius
- **Responsive**: Modal should be full-screen on mobile, centered with max-width 752px on desktop
- **Animations**: Modal open/close: opacity + scale transition (200ms ease-out)
- **Accessibility**: WCAG AA, focus trap within modal, Escape key closes modal, all form fields labeled

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the modal with all form fields: recipient (required), category/title (required), rich text content (required), hashtags (required, 1-5), images (optional, 0-5), anonymous toggle.
- **FR-002**: "Người nhận" field MUST provide autocomplete search with Sunner profile results.
- **FR-003**: Rich text editor MUST support: Bold, Italic, Strikethrough, Numbered List, Link insertion, Blockquote.
- **FR-004**: Rich text editor MUST support @mention with colleague name autocomplete.
- **FR-005**: Hashtag section MUST enforce minimum 1 and maximum 5 hashtags.
- **FR-006**: Image section MUST allow 0-5 image attachments with thumbnail preview (80x80px) and delete capability.
- **FR-007**: "Gửi" button MUST be disabled when required fields (recipient, category/title, content, hashtag) are not filled.
- **FR-008**: On successful submission, the modal MUST close and the new kudos MUST appear in the Live Board feed.
- **FR-009**: "Hủy" button MUST close the modal and discard all entered data.
- **FR-010**: Anonymous checkbox MUST toggle sender visibility in the resulting kudos. When enabled, a text field MUST appear for the user to enter a custom anonymous display name.
- **FR-010a**: If the anonymous name field is left empty, the system MUST default the sender name to "Ẩn danh".
- **FR-011**: "Danh hiệu" (Title/Category) field MUST allow entering a custom honorary title that displays as the kudos heading.
- **FR-012**: "Tiêu chuẩn cộng đồng" (Community Standards) link in the toolbar MUST open the community guidelines.

### Technical Requirements

- **TR-001**: Rich text editor SHOULD use a lightweight library (e.g., Tiptap, Lexical) compatible with Cloudflare Workers edge runtime.
- **TR-002**: Image uploads MUST use Supabase Storage with max 5MB per image.
- **TR-003**: Form submission MUST use a Server Action (per constitution Principle II).
- **TR-004**: All user inputs MUST be validated with Zod schemas (per constitution Principle VI).
- **TR-005**: The modal MUST implement focus trap (no Tab escape) per accessibility requirements.
- **TR-006**: @mention search MUST be debounced (300ms) to avoid excessive API calls.

### Key Entities *(data)*

- **Kudos** (extends existing): sender_id, receiver_id, content (rich text HTML), category_tag (honorary title), is_anonymous, anonymous_name (nullable), created_at
- **KudosMedia** (existing): kudos_id, media_type='image', url, sort_order
- **KudosHashtags** (existing): kudos_id, hashtag_id (1-5 required)

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/kudos | POST | Create new kudos (Server Action preferred) | Exists (action in actions.ts) |
| /api/users/search | GET | Search Sunner profiles for recipient field | Exists |
| /api/hashtags | GET | Fetch available hashtags for picker | Exists |
| /api/kudos/upload | POST | Upload image to Supabase Storage | New |

---

## State Management

### Local Component State

| State | Type | Description |
|-------|------|-------------|
| recipientId | string \| null | Selected recipient user ID |
| recipientQuery | string | Search input text for recipient |
| categoryTitle | string | Honorary title text |
| editorContent | string | Rich text HTML content |
| selectedHashtags | Hashtag[] | Selected hashtags (1-5) |
| attachedImages | File[] | Uploaded image files (0-5) |
| isAnonymous | boolean | Anonymous toggle state |
| anonymousName | string | Custom anonymous display name (shown when isAnonymous is true) |
| isSubmitting | boolean | Form submission loading state |
| errors | Record<string, string> | Validation error messages per field |

### Loading & Error States

| State | Loading | Error |
|-------|---------|-------|
| Recipient search | Spinner in dropdown | "Search failed" message |
| Image upload | Progress indicator on thumbnail | Toast "Upload failed", allow retry |
| Form submission | "Gửi" button shows spinner, disabled | Error toast, form data preserved |
| Hashtag fetch | Skeleton in dropdown | Inline error in dropdown |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can compose and submit a kudos within 60 seconds (fill form + submit).
- **SC-002**: Form validation prevents submission of incomplete kudos 100% of the time.
- **SC-003**: Image upload completes within 3 seconds per image on 4G.
- **SC-004**: @mention autocomplete responds within 300ms of typing.
- **SC-005**: Modal open/close animation is smooth (no jank, < 200ms).

---

## Out of Scope

- Rich text content moderation / filtering (future enhancement)
- Video attachment support (images only for now)
- Draft saving / auto-save (future enhancement)
- Scheduling kudos for later delivery
- Multiple recipients per kudos (one recipient per kudos)
- Addlink Box dialog implementation (separate frame 1002:12917)
- Hashtag dropdown implementation (separate frame 1002:13013)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] Kudos Live Board implemented (`.momorph/specs/2940-13431-sun-kudos-live-board/`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [ ] Rich text editor library chosen (Tiptap or Lexical)

---

## Notes

- The modal background is cream (#FFF8E1), distinct from the dark theme of the Live Board — this creates a visual "writing space" feel.
- The "Danh hiệu" (Title) field is visible in the screenshot between the recipient and the toolbar — it allows entering a custom honorary title like "Người truyền động lực cho tôi" which displays as the kudos category tag.
- The rich text toolbar includes a "Tiêu chuẩn cộng đồng" (Community Standards) link in gold text — this opens community guidelines to encourage appropriate content.
- Image thumbnails have a red circular delete button (#D4271D, 20x20px) positioned at the top-right corner of each thumbnail.
- The modal uses Montserrat font throughout (not SVN-Gotham) with weight 700 for all text elements, **except** the required asterisk (*) which uses **Noto Sans JP** font.
- The asterisk (*) for required fields uses red color (#CF1322) and Noto Sans JP font family.
- When the anonymous checkbox is enabled, a text field appears for entering a custom anonymous display name.
