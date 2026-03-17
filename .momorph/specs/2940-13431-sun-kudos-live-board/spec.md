# Feature Specification: Sun* Kudos - Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live Board`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-16
**Status**: Draft

---

## Overview

The Sun* Kudos - Live Board is the main landing page for the Sun* Kudos recognition system within the SAA (Sun* Annual Awards) 2025 platform. It allows Sunners (Sun* employees) to view, send, and interact with kudos (appreciation messages). The page features a hero banner, a highlight carousel of top kudos, an interactive spotlight board, a scrollable kudos feed with sidebar stats, and gift box (Secret Box) functionality.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View and Browse All Kudos (Priority: P1)

A logged-in Sunner visits the Live Board to browse appreciation messages sent across the organization. They can scroll through an infinite feed of kudos cards, each showing sender, receiver, message content, attached images, hashtags, and engagement metrics.

**Why this priority**: This is the core read experience — without it, the page has no value. Every other feature builds on the ability to view kudos.

**Independent Test**: Load the Live Board page and verify kudos cards render with correct sender/receiver info, timestamps, content, images, hashtags, and heart counts.

**Acceptance Scenarios**:

1. **Given** the user is logged in and navigates to Sun* Kudos page, **When** the page loads, **Then** the All Kudos section displays kudos cards sorted by most recent, with sender/receiver avatars, names, star badges, timestamps, content (max 5 lines truncated), hashtag badges, heart count, and Copy Link button.
2. **Given** the All Kudos feed is displayed, **When** the user scrolls to the bottom of the visible cards, **Then** the next batch of kudos is loaded via infinite scroll without page refresh.
3. **Given** a kudos has more than 5 lines of content, **When** displayed in the All Kudos feed, **Then** the content is truncated with "..." and clicking it navigates to the full kudos detail.
4. **Given** a kudos has attached images, **When** displayed, **Then** up to 5 thumbnail images are shown in a horizontal row; clicking an image opens the full-size view.
5. **Given** a kudos has an attached video, **When** displayed, **Then** a video thumbnail with a play button overlay is shown; clicking it plays the video or opens a video player.
6. **Given** a kudos has a category tag (e.g., "IDOL GIOI TRE"), **When** displayed, **Then** a gold-bordered tag badge appears between the timestamp and content.
7. **Given** there are no kudos matching the current filter, **When** the page loads, **Then** the empty state message "Hien tai chua co Kudos nao." is displayed.
8. **Given** the page is loading, **When** data is being fetched, **Then** skeleton placeholders are shown for kudos cards until data arrives.

---

### User Story 2 - Send a Kudos (Priority: P1)

A Sunner wants to send an appreciation message to a colleague. They click the pill-shaped input field in the hero banner, which opens a send-kudos dialog where they can compose and submit their message.

**Why this priority**: Sending kudos is the primary write action — it generates the content that the entire page depends on.

**Independent Test**: Click the search/input field in the hero banner and verify the send-kudos dialog opens correctly.

**Acceptance Scenarios**:

1. **Given** the user is on the Live Board, **When** they click the pill input with placeholder "Hom nay, ban muon gui loi cam on va ghi nhan den ai?", **Then** the send-kudos dialog opens.
2. **Given** the send-kudos dialog is open, **When** the user fills in required fields and submits, **Then** the kudos is saved to the database and appears in the All Kudos feed.

---

### User Story 3 - Interact with Kudos (Heart / Copy Link) (Priority: P1)

A Sunner wants to engage with kudos by liking them (heart) or sharing them via URL.

**Why this priority**: Engagement features drive interaction and determine the Highlight Kudos ranking.

**Independent Test**: Click the heart icon on a kudos card and verify the state toggles; click Copy Link and verify clipboard + toast behavior.

**Acceptance Scenarios**:

1. **Given** a kudos the user has not liked, **When** they click the heart icon, **Then** the heart turns red (#F17676), the count increments by 1, and 1 heart point is added to the kudos sender's account.
2. **Given** a kudos the user has already liked, **When** they click the heart icon again, **Then** the heart reverts to grey (#999), the count decrements by 1, and 1 heart point is revoked from the sender's account.
3. **Given** the current day is an admin-configured "special day", **When** the user hearts a kudos, **Then** 2 heart points (instead of 1) are added to the sender's account.
4. **Given** the user is the sender of a kudos, **When** viewing their own kudos, **Then** the heart button is disabled (greyed out, not clickable).
5. **Given** any kudos card, **When** the user clicks "Copy Link", **Then** the kudos URL is copied to the clipboard and a toast notification "Link copied -- ready to share!" appears.

---

### User Story 4 - View Highlight Kudos Carousel (Priority: P2)

A Sunner views the top 5 most-hearted kudos in an interactive carousel with center-highlighted display.

**Why this priority**: Highlights surface the most appreciated kudos, driving engagement. It's a showcase feature but not required for basic functionality.

**Independent Test**: Load the page and verify the carousel renders 5 cards with the center card prominent and side cards dimmed; arrow navigation works correctly.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the Highlight section renders, **Then** the top 5 kudos by heart count are displayed in a carousel with the center card at full opacity/scale and side cards dimmed (opacity: 0.5, scale: 0.9).
2. **Given** the carousel is on page 2/5, **When** the user clicks the left arrow, **Then** the carousel slides to page 1/5 and the pagination indicator updates.
3. **Given** the carousel is on page 1/5, **When** viewing the left arrow, **Then** the left arrow is disabled (opacity: 0.3, not clickable).
4. **Given** the carousel is on page 5/5, **When** viewing the right arrow, **Then** the right arrow is disabled.
5. **Given** a highlight card, **When** the user clicks "Xem chi tiet", **Then** they are navigated to the full kudos detail page.

---

### User Story 5 - Filter Kudos by Hashtag or Department (Priority: P2)

A Sunner wants to filter the displayed kudos by hashtag or department to find relevant appreciation messages.

**Why this priority**: Filtering enables discovery and relevance, but users can browse without it.

**Independent Test**: Click the Hashtag filter, select a tag, and verify both the Highlight Carousel and All Kudos feed update to show only matching kudos.

**Acceptance Scenarios**:

1. **Given** the user clicks the "Hashtag" filter button, **When** the dropdown opens, **Then** a list of available hashtags is displayed.
2. **Given** the user selects a hashtag from the dropdown, **When** the filter is applied, **Then** BOTH the Highlight Kudos carousel AND the All Kudos feed are filtered to show only kudos with that hashtag.
3. **Given** the user clicks the "Phong ban" (Department) filter button, **When** a department is selected, **Then** both sections filter by that department.
4. **Given** a hashtag badge on any kudos card, **When** the user clicks it, **Then** both sections are filtered by that specific hashtag.
5. **Given** a filter is currently active, **When** the user clears or deselects the filter, **Then** both sections revert to showing all kudos (unfiltered).
6. **Given** both Hashtag and Department filters are applied, **When** the results are displayed, **Then** only kudos matching BOTH filters are shown (AND logic).

---

### User Story 6 - View Personal Stats and Open Secret Box (Priority: P2)

A Sunner views their personal kudos statistics in the right sidebar and can open Secret Boxes they've earned.

**Why this priority**: Stats and rewards are key engagement drivers but secondary to the core view/send/interact flows.

**Independent Test**: Verify the sidebar displays correct stats; click "Mo Secret Box" and verify the dialog opens.

**Acceptance Scenarios**:

1. **Given** the user is logged in, **When** the sidebar loads, **Then** it displays: "So Kudos ban nhan duoc" (received), "So Kudos ban da gui" (sent), "So tim ban nhan duoc" (hearts received), "So Secret Box ban da mo" (opened), "So Secret Box chua mo" (unopened) — all with correct values from the user's account.
2. **Given** the user has unopened Secret Boxes, **When** they click "Mo Secret Box", **Then** the Secret Box dialog opens (linkedFrame 1466:7676).
3. **Given** the user has no unopened Secret Boxes, **When** viewing the button, **Then** the "Mo Secret Box" button is disabled.

---

### User Story 7 - Interact with Spotlight Board (Priority: P2)

A Sunner explores the interactive word cloud / spotlight visualization showing kudos recipients.

**Why this priority**: The Spotlight Board is a visual engagement feature; it enhances discovery but is not critical for basic functionality.

**Independent Test**: Verify the Spotlight Board renders with "388 KUDOS" count, supports hover tooltips, click-to-detail, and pan/zoom.

**Acceptance Scenarios**:

1. **Given** the page loads, **When** the Spotlight Board section renders, **Then** an interactive visualization with scattered recipient names is displayed, along with the total kudos count (e.g., "388 KUDOS").
2. **Given** the Spotlight Board is displayed, **When** the user hovers over a name node, **Then** a tooltip with the recipient's name and timestamp appears.
3. **Given** a name node in the Spotlight Board, **When** the user clicks it, **Then** they are navigated to that kudos detail.
4. **Given** the Spotlight Board, **When** the user uses the pan/zoom controls, **Then** the visualization pans and zooms accordingly.
5. **Given** the search input in the Spotlight Board, **When** the user types a keyword and presses Enter, **Then** matching names are highlighted in the visualization.

---

### User Story 8 - View User Profiles & Search Sunners (Priority: P3)

A Sunner can search for colleagues via the hero search bar, preview profiles by hovering on avatars/names, and navigate to full profiles by clicking.

**Why this priority**: Profile interactions and search enhance the social experience but are supplementary to the core kudos features.

**Independent Test**: Type a name in "Tim kiem profile Sunner" and verify results appear; hover over a user avatar and verify the preview popup; click and verify navigation to the profile page.

**Acceptance Scenarios**:

1. **Given** the user is on the Live Board, **When** they click the search bar "Tim kiem profile Sunner" in the hero banner, **Then** the profile search is activated with a text input and a dropdown of matching results appears as the user types.
2. **Given** the profile search shows results, **When** the user clicks a result, **Then** they are navigated to that user's full profile.
3. **Given** the profile search input has text, **When** no matching Sunners are found, **Then** "Khong tim thay Sunner" empty state is shown in the dropdown.
4. **Given** any avatar or username on the page, **When** the user hovers over it, **Then** a profile preview popup is displayed (linkedFrame 721:5827).
5. **Given** any avatar or username, **When** the user clicks it, **Then** they are navigated to that user's full profile.
6. **Given** a user with star badges, **When** hovering over the stars, **Then** a tooltip explains: 1 star = 10 Kudos received, 2 stars = 20, 3 stars = 50.

---

### User Story 9 - View Leaderboard (10 SUNNER NHAN QUA MOI NHAT) (Priority: P3)

A Sunner views the latest 10 Sunners who received gifts in the right sidebar.

**Why this priority**: The leaderboard is a nice-to-have engagement feature that shows recent gift recipients.

**Independent Test**: Verify the leaderboard renders with up to 10 items showing avatar, name, and gift description.

**Acceptance Scenarios**:

1. **Given** the sidebar loads, **When** the leaderboard section renders, **Then** up to 10 recent gift recipients are displayed with avatar, name, and gift description.
2. **Given** a leaderboard entry, **When** the user clicks the name or avatar, **Then** they navigate to that user's profile.
3. **Given** no recent gift recipients, **When** the leaderboard renders, **Then** "Chua co du lieu" empty state is displayed.

---

### Edge Cases

- What happens when the user's session expires while browsing? -> Redirect to login.
- How does the system handle slow/offline network on infinite scroll? -> Show loading spinner; retry on reconnect.
- What if the Spotlight Board has too many nodes to render performantly? -> Implement virtualization or limit visible nodes with zoom-based detail levels.
- What if an image attachment fails to load? -> Show placeholder with broken image icon.
- What if a video fails to load or is unsupported? -> Show placeholder with error message.
- What if two users heart the same kudos simultaneously? -> Optimistic UI update with server reconciliation.
- What if the user rapidly toggles heart on/off? -> Debounce API calls, use optimistic UI.
- What if the clipboard API is unavailable (Copy Link)? -> Fallback to manual copy prompt or show URL in a modal.
- What if the profile search returns no results? -> Show "Khong tim thay Sunner" empty state.
- What if the highlight carousel has fewer than 5 kudos? -> Show only available cards, disable navigation if only 1.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Description | Interactions |
|-----------|-------------|--------------|
| Navbar | Sticky top navigation with logo, links, bell, language, avatar | Nav link click, bell notification, avatar menu |
| Hero Banner (KV Kudos) | Full-width banner with title, KUDOS logo, search input | Click search input -> open dialog |
| Search Input (Send Kudos) | Pill-shaped text field with pen icon, left side of hero | Click -> open send-kudos dialog |
| Profile Search Bar | Search bar with magnifying glass "Tim kiem profile Sunner", right side of hero | Type -> search Sunner profiles |
| Category Tag Badge | Gold-bordered badge (e.g., "IDOL GIOI TRE") above content | Static display, may be filterable |
| Video Player Overlay | Play button overlay on video attachment thumbnails | Click -> play video |
| Toast Notification | Temporary notification bar for Copy Link confirmation | Auto-dismiss after ~3s |
| Section Header | Subtitle + title with gold glow | Static display |
| Filter Buttons | Hashtag and Phong ban dropdown triggers | Click -> open dropdown, filter content |
| Highlight Carousel | Top 5 kudos cards with center highlighting | Arrow navigation, card click -> detail |
| Highlight Kudo Card | Card with sender/receiver, content, tags, actions | Heart, Copy Link, Xem chi tiet, hover preview |
| Pagination | Arrow + page indicator (2/5) | Arrow click to navigate |
| Spotlight Board | Interactive word cloud with search | Hover tooltip, click -> detail, pan/zoom, search |
| All Kudos Feed | Infinite scroll list of kudos post cards | Scroll, heart, copy link, click -> detail |
| Kudos Post Card | Full card with images, 5-line content | Heart, Copy Link, image click -> full view |
| Stats Card | Personal stats summary | Static display |
| Secret Box Button | Primary gold pill button | Click -> open Secret Box dialog |
| Leaderboard | Top 10 recent gift recipients | Click avatar/name -> profile |
| Footer | Site links and copyright | Link navigation |

### Navigation Flow

- **From**: Any SAA page via navbar
- **To**: Kudos detail (via card click / Xem chi tiet), User profile (via avatar/name click), Send-kudos dialog (via search input), Secret Box dialog (via Mo qua button), Hashtag dropdown (via filter), Department dropdown (via filter)
- **Triggers**: Click, hover (profile preview), scroll (infinite load)

### Visual Requirements

- **Responsive breakpoints**: Mobile (320px+), Tablet (768px+), Desktop (1024px+)
- **Design reference**: See [design-style.md](./design-style.md) for complete visual specifications
- **Animations/Transitions**: Carousel slide (300ms ease-out), heart toggle (200ms), hover effects (150ms), toast notifications (300ms)
- **Accessibility**: WCAG AA compliance, minimum 44x44px touch targets, keyboard navigation for carousel and filters

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display kudos cards with sender info (avatar, name, star count, department), receiver info, timestamp, message content, attached images, hashtag badges, heart count, and copy link button.
- **FR-002**: System MUST support infinite scroll on the All Kudos feed, loading new batches as the user scrolls.
- **FR-003**: Users MUST be able to send kudos by clicking the hero search input, which opens a send-kudos dialog.
- **FR-004**: Users MUST be able to toggle heart (like) on any kudos except their own, with correct point calculation (1 point normal, 2 points on special days).
- **FR-005**: System MUST copy the kudos URL to clipboard and show a toast when "Copy Link" is clicked.
- **FR-006**: System MUST display the top 5 kudos by heart count in the Highlight Carousel with center-card highlighting and arrow navigation.
- **FR-007**: Hashtag and Department filters MUST filter BOTH the Highlight Carousel and All Kudos feed simultaneously.
- **FR-008**: System MUST display the user's personal stats (kudos received, sent, hearts received, Secret Boxes opened/unopened) in the right sidebar.
- **FR-009**: System MUST allow opening Secret Boxes via the "Mo Secret Box" button, linking to the Secret Box dialog.
- **FR-010**: System MUST display an interactive Spotlight Board with total kudos count, hover tooltips, click-to-detail, pan/zoom, and search.
- **FR-011**: System MUST show user profile preview on avatar/name hover, and navigate to full profile on click.
- **FR-012**: System MUST display the "10 SUNNER NHAN QUA MOI NHAT" leaderboard in the sidebar.
- **FR-013**: Content truncation: Highlight cards = max 3 lines, All Kudos cards = max 5 lines, Hashtags = max 5 per line — all with "..." overflow.
- **FR-014**: Star badge system: 1 star = 10 Kudos received, 2 stars = 20, 3 stars = 50. Tooltip on hover.
- **FR-015**: System MUST display a profile search bar ("Tim kiem profile Sunner") in the hero banner that searches and displays matching Sunner profiles.
- **FR-016**: System MUST support video attachments in kudos cards with a play button overlay; clicking plays the video.
- **FR-017**: System MUST display category tag badges (e.g., "IDOL GIOI TRE") on kudos cards when applicable, positioned between timestamp and content.
- **FR-018**: System MUST show skeleton loading placeholders during initial page load and infinite scroll loading.
- **FR-019**: System MUST show a toast notification ("Link copied -- ready to share!") that auto-dismisses after ~3 seconds when Copy Link is clicked.
- **FR-020**: Timestamps MUST be displayed in the format "HH:mm - MM/DD/YYYY" (e.g., "10:00 - 10/30/2025").
- **FR-021**: Highlight Kudos cards MUST display a prominent image/video area at the top of the card (above sender/receiver row), unlike All Kudos cards which show thumbnails inline below the content.
- **FR-022**: Leaderboard entries MUST display a colored rank indicator circle (red for top positions, transitioning through orange, yellow, green, blue) to the left of each avatar.

### Technical Requirements

- **TR-001**: Page MUST load initial above-the-fold content (navbar + hero + first section) within 2 seconds on 4G connection.
- **TR-002**: Infinite scroll MUST implement virtualization or lazy loading to maintain smooth performance with 1000+ kudos.
- **TR-003**: Spotlight Board SHOULD use canvas/SVG rendering (e.g., d3.js or react-force-graph) for performance with many nodes.
- **TR-004**: All user inputs (search, filters) MUST be validated and sanitized per OWASP guidelines.
- **TR-005**: Heart toggle MUST use optimistic UI updates with server reconciliation for responsive UX.
- **TR-006**: Copy Link MUST use the Clipboard API with fallback for unsupported browsers.
- **TR-007**: Images MUST use `next/image` with lazy loading and responsive sizing.

### Key Entities *(data)*

- **Kudos**: id, sender_id, receiver_id, content, hashtags[], images[], videos[], category_tag, created_at, heart_count
- **User (Sunner)**: id, name, avatar_url, department, title/position, star_count, kudos_received_count, kudos_sent_count, hearts_received_count
- **Heart**: id, kudos_id, user_id, created_at, is_special_day, points
- **SecretBox**: id, user_id, is_opened, gift_description, opened_at
- **Hashtag**: id, name
- **Department (Phong ban)**: id, name
- **CategoryTag**: id, name (e.g., "IDOL GIOI TRE") — displayed as badge on kudos cards

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/kudos | GET | Fetch kudos feed (paginated, filterable by hashtag/department) | Predicted |
| /api/kudos | POST | Create new kudos | Predicted |
| /api/kudos/highlights | GET | Fetch top 5 kudos by heart count | Predicted |
| /api/kudos/:id/heart | POST | Toggle heart on a kudos | Predicted |
| /api/kudos/:id/heart | DELETE | Remove heart from a kudos | Predicted |
| /api/users/me/stats | GET | Fetch current user's stats (kudos, hearts, secret boxes) | Predicted |
| /api/secret-box/open | POST | Open a secret box | Predicted |
| /api/spotlight | GET | Fetch spotlight board data (aggregated kudos recipients) | Predicted |
| /api/leaderboard/gifts | GET | Fetch top 10 recent gift recipients | Predicted |
| /api/hashtags | GET | Fetch available hashtags for filter | Predicted |
| /api/departments | GET | Fetch departments for filter | Predicted |
| /api/users/:id/preview | GET | Fetch user preview data (hover popup) | Predicted |
| /api/users/search | GET | Search Sunner profiles by keyword | Predicted |
| /api/category-tags | GET | Fetch available category tags | Predicted |

---

## State Management

### Local Component State

| State | Component | Type | Description |
|-------|-----------|------|-------------|
| carouselPage | HighlightCarousel | number | Current carousel page (1-5) |
| heartStates | KudoPostCard / HighlightKudoCard | Map<kudos_id, boolean> | Optimistic heart toggle per card |
| toastVisible | CopyLinkButton | boolean | Whether toast notification is shown |
| spotlightZoom | SpotlightBoard | { x, y, scale } | Pan/zoom state for the canvas |
| spotlightSearch | SpotlightBoard | string | Current search query in spotlight |
| profileSearchQuery | ProfileSearchBar | string | Profile search input value |
| profileSearchResults | ProfileSearchBar | User[] | Search results for Sunner profiles |

### Global State (via React Context or URL params)

| State | Scope | Type | Description |
|-------|-------|------|-------------|
| activeHashtagFilter | Page-wide | string \| null | Currently selected hashtag filter — affects both Highlight and All Kudos |
| activeDepartmentFilter | Page-wide | string \| null | Currently selected department filter — affects both Highlight and All Kudos |
| currentUser | App-wide | User | Logged-in user data (for stats sidebar, heart disabled check) |
| isSpecialDay | App-wide | boolean | Whether today is admin-configured special day (2x heart points) |

### Server/Cache State

| State | Fetch Strategy | Cache |
|-------|---------------|-------|
| Kudos feed | Infinite scroll, cursor-based pagination | Cache pages, invalidate on new kudos |
| Highlight kudos | Fetch top 5, refetch on filter change | Cache per filter combination |
| User stats | Fetch on mount, refetch after heart/kudos actions | Short TTL (30s) |
| Spotlight data | Fetch on mount | Cache until page refresh |
| Leaderboard | Fetch on mount | Cache with moderate TTL (60s) |

### Loading & Error States

| State | Loading Behavior | Error Behavior |
|-------|-----------------|----------------|
| Initial page load | Skeleton placeholders for all sections | Error banner with retry button |
| Infinite scroll | Loading spinner at bottom of feed | "Failed to load, tap to retry" inline |
| Heart toggle | Optimistic UI (instant visual change) | Revert to previous state, show error toast |
| Copy Link | Instant clipboard write | Fallback: show URL in modal for manual copy |
| Spotlight Board | Loading spinner overlay | "Failed to load visualization" with retry |
| Profile Search | Spinner in search results area | "Search failed, try again" message |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Page fully loads (above-the-fold) in < 2 seconds on 4G for 95% of users.
- **SC-002**: Users can send a kudos end-to-end in < 30 seconds (click input -> fill form -> submit -> see in feed).
- **SC-003**: Heart toggle responds optimistically within 100ms of click.
- **SC-004**: Infinite scroll loads next batch within 1 second of trigger.
- **SC-005**: All interactive elements (buttons, links, avatars) have minimum 44x44px touch targets.
- **SC-006**: Carousel navigation is smooth with no visible jank or layout shift.

---

## Out of Scope

- Send-kudos dialog implementation (separate frame/spec)
- Secret Box dialog implementation (separate frame 1466:7676)
- User profile page implementation (separate flow)
- Hashtag dropdown list implementation (separate frame 1002:13013)
- Department dropdown implementation (separate frame 721:5684)
- Profile preview popup implementation (separate frame 721:5827)
- Admin configuration for "special day" heart points
- Push notifications for new kudos
- Real-time updates via WebSocket/Supabase Realtime (can be added later)

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- The page uses a dark theme with gold (#FFEA9E) as the primary accent color — all visual specs are in [design-style.md](./design-style.md).
- Font `SVN-Gotham` is a custom font that must be hosted locally (not available on Google Fonts).
- The Spotlight Board interactive word cloud may require a specialized library (d3.js, react-force-graph, or similar).
- Star badge logic (1★=10, 2★=20, 3★=50 kudos received) is a display-only calculation based on `kudos_received_count`.
- Heart point system has a "special day" multiplier (2x) that is admin-configured — the API must return whether the current day is special.
- All filter actions (Hashtag, Phong ban, clicking a hashtag badge) affect BOTH the Highlight Carousel AND the All Kudos feed simultaneously.
- The sidebar should be sticky and independently scrollable on desktop viewports.
