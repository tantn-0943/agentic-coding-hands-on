# Feature Specification: Like Kudo (Heart)

**Frame ID**: `6384` (sub-feature of `2940:13431` Sun* Kudos - Live Board)
**Frame Name**: `Like Kudo`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-24
**Status**: Reviewed

---

## Overview

The Like Kudo (Heart) feature allows authenticated Sunners to express appreciation for a kudos message by toggling a heart icon. Each user gets exactly one heart per kudos. Hearts contribute to the receiver's total heart count and influence the Highlight Kudos ranking. Special days (configured by admin) award double points per heart.

**Target users**: All authenticated Sunners
**Business context**: Hearts drive engagement and determine which kudos appear in the Highlight section (top 5 by heart count).

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Like a Kudos [P1]

**As a** logged-in Sunner
**I want to** tap the heart icon on a kudos card
**So that** I can show appreciation and the kudos receiver gets recognition

**Why this priority**: Core engagement mechanism. Without it, there's no way to rank or highlight kudos.

**Independent Test**: Click the heart icon on a kudos card → heart turns red, count increments by 1.

**Acceptance Scenarios**:

1. **Given** a kudos card with heart count 5 and the user has NOT liked it, **When** the user clicks the heart icon, **Then** the icon changes from grey outline to red filled, the count changes to 6, and the receiver's `hearts_received_count` increments by 1 (or 2 on special days).
2. **Given** a kudos card the user has already liked (red heart, count 6), **When** the user clicks the heart icon again, **Then** the icon changes back to grey outline, the count changes to 5, and the receiver's `hearts_received_count` decrements by 1 (or 2 if originally liked on a special day).
3. **Given** a kudos card where the current user is the **sender**, **When** the page renders, **Then** the heart button is disabled (opacity 0.5, cursor not-allowed) and clicking it does nothing.

---

### User Story 2 - Heart Count Display [P1]

**As a** Sunner browsing kudos
**I want to** see how many hearts each kudos has received
**So that** I can gauge which messages resonate most with the community

**Acceptance Scenarios**:

1. **Given** a kudos with 1000 hearts, **When** it renders, **Then** the count displays as "1,000" (locale-formatted).
2. **Given** a kudos with 0 hearts, **When** it renders, **Then** the count displays as "0".

---

### User Story 3 - Special Day Double Points [P2]

**As a** system
**I want to** award 2 heart points instead of 1 on admin-configured special days
**So that** engagement is incentivized during key event periods

**Acceptance Scenarios**:

1. **Given** today is a special day (configured in `app_config.special_days`), **When** a user likes a kudos, **Then** the `hearts` record has `is_special_day=true` and `points=2`, and the receiver's `hearts_received_count` increments by 2.
2. **Given** a heart was given on a special day, **When** the user unlikes it, **Then** the receiver's `hearts_received_count` decrements by 2.

---

### Edge Cases

- Rapid double-click: Should not create duplicate hearts (UNIQUE constraint on `kudos_id, user_id`).
- Network failure during toggle: Show optimistic UI update, rollback on error.
- Anonymous kudos: Heart button works normally — liking an anonymous kudos is allowed.
- User likes their own kudos sent anonymously: RLS policy should still block (checks `sender_id`, not display name).

---

## UI/UX Requirements

### Component: HeartButton

| Property | Value |
|----------|-------|
| Layout | `flex items-center gap-1.5` |
| Icon (not liked) | `heart-outline`, 20x20, color `#999` |
| Icon (liked) | `heart-filled`, 20x20, color `#F17676` |
| Count text (default) | SVN-Gotham 16px/500, white |
| Count text (highlight card) | SVN-Gotham 24px/400, `#00101A` |
| Disabled state | opacity 0.5, cursor not-allowed |
| Click animation | scale 1→1.05→0.95→1, 200ms ease-out |

See [design-style.md](../2940-13431-sun-kudos-live-board/design-style.md#heart-button) for full visual specs.

### Contexts where HeartButton appears:
1. **All Kudos feed cards** (KudoPostCard) — default variant
2. **Highlight Kudos carousel cards** (HighlightKudoCard) — highlight variant (larger count, dark text on light bg)

### Accessibility
- `aria-label`: "Like this kudos" / "Unlike this kudos" (toggle)
- `aria-live="polite"` on count span for screen reader updates
- Keyboard: focusable via Tab, activatable via Enter/Space

---

## Data Requirements

### Database Tables

**hearts** (existing):
| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PK, auto-generated |
| kudos_id | UUID | FK → kudos(id) ON DELETE CASCADE, NOT NULL |
| user_id | UUID | FK → auth.users(id), NOT NULL |
| is_special_day | BOOLEAN | DEFAULT false |
| points | INT | DEFAULT 1 |
| created_at | TIMESTAMPTZ | DEFAULT now() |
| | | UNIQUE(kudos_id, user_id) |

**user_profiles.hearts_received_count** (denormalized counter):
- Incremented/decremented when hearts are added/removed
- Points: 1 (normal day) or 2 (special day)

**app_config** (key: `special_days`):
- Value: JSON array of date strings, e.g. `["2025-12-25", "2025-11-15"]`

### RLS Policies (existing)

| Policy | Rule |
|--------|------|
| hearts_select | All authenticated users can read |
| hearts_insert | User can insert if `auth.uid() = user_id AND auth.uid() != kudos.sender_id` |
| hearts_delete | User can delete only their own hearts |

---

## API Requirements

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| `/api/kudos` | POST | Toggle heart (action: "heart") | Existing |
| `/api/kudos` | GET | Fetch kudos with `has_hearted` and `heart_count` | Existing |

### Heart Toggle Request
```json
POST /api/kudos
{
  "action": "heart",
  "kudosId": "uuid"
}
```

### Heart Toggle Response
```json
{
  "hearted": true,
  "heart_count": 6,
  "points_awarded": 1
}
```

---

## State Management

### Local State (useHeartToggle hook)
| State | Type | Initial | Purpose |
|-------|------|---------|---------|
| hearted | boolean | from server | Current like status |
| count | number | from server | Current heart count |
| disabled | boolean | isOwnKudos | Prevent self-like |
| isLoading | boolean | false | Prevent rapid double-click during API call |

### Optimistic Update Flow
1. User clicks heart → set `isLoading=true`, immediately toggle icon + count
2. Send API request in background
3. On success → set `isLoading=false`, keep state
4. On failure → set `isLoading=false`, rollback to previous state

### Error State
- On API failure: rollback UI optimistic update, keep heart in previous state
- No toast/error message needed — silent rollback is sufficient for toggle actions

---

## Success Criteria

- **SC-001**: Heart toggle completes in < 200ms (optimistic UI)
- **SC-002**: No duplicate hearts per user per kudos (DB constraint)
- **SC-003**: Self-like blocked by RLS policy
- **SC-004**: Heart count accurately reflects in Highlight ranking
- **SC-005**: Special day double points applied correctly

---

## Dependencies

- [x] `hearts` table exists with RLS policies
- [x] `HeartButton` component implemented
- [x] `useHeartToggle` hook implemented
- [x] Heart toggle server action exists
- [x] Design tokens documented in parent spec
