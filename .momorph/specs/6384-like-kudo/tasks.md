# Tasks: Like Kudo (Heart)

**Frame**: `6384-like-kudo`
**Prerequisites**: plan.md (required), spec.md (required), design-style.md (required)

---

## Task Format

```
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Verification (Existing Implementation)

**Purpose**: Verify existing code matches spec before fixing gaps

- [x] T001 Verify HeartButton renders 3 states (default, liked, disabled/own-kudo) with correct design tokens from design-style.md | src/components/kudos/HeartButton.tsx
- [x] T002 [P] Verify useHeartToggle hook handles optimistic toggle, rollback on error, and isLoading guard | src/hooks/useHeartToggle.ts
- [x] T003 [P] Verify HeartButton integration in KudoPostCard (variant="default") | src/components/kudos/KudoPostCard.tsx
- [x] T004 [P] Verify HeartButton integration in HighlightKudoCard (variant="highlight") | src/components/kudos/HighlightKudoCard.tsx

**Checkpoint**: Existing code verified — all correct ✅

---

## Phase 2: US1 — Like/Unlike Toggle [P1] — Fix Critical Gap

**Goal**: Fix `toggleHeart()` to update `user_profiles.hearts_received_count` on the kudos sender's profile when a heart is added or removed.

**Independent Test**: Like a kudo → check sender's `hearts_received_count` incremented. Unlike → check decremented.

- [x] T005 [US1] In toggleHeart() LIKE branch: after inserting heart, look up the kudos sender_id, then call `increment_hearts_received` RPC to add `points` (1 or 2) for that sender | src/lib/kudos/actions.ts
- [x] T006 [US1] In toggleHeart() UNLIKE branch: before deleting heart, read the heart's `points` value, look up the kudos sender_id, then call `decrement_hearts_received` RPC to subtract that amount after delete | src/lib/kudos/actions.ts
- [x] T006b [US1] Create migration with `increment_hearts_received` and `decrement_hearts_received` RPC functions (SECURITY DEFINER, GREATEST(0,...) for decrement) | supabase/migrations/20260325000000_add_hearts_counter_rpcs.sql

**Checkpoint**: toggleHeart() now maintains hearts_received_count in sync with hearts table ✅

---

## Phase 3: US2 — Heart Count Display [P1]

**Goal**: Verify locale-formatted heart count display works correctly

**Independent Test**: Kudo with 1000 hearts → renders "1,000". Kudo with 0 hearts → renders "0".

- [x] T007 [US2] Verify HeartButton count formatting uses `toLocaleString()` for numbers >= 1000 | src/components/kudos/HeartButton.tsx

**Checkpoint**: Heart count display verified — `count.toLocaleString()` at line 48 ✅

---

## Phase 4: US3 — Special Day Double Points [P2]

**Goal**: Verify special day logic awards 2 points and decrements correctly

**Independent Test**: On a special day, like a kudo → heart.points = 2, hearts_received_count += 2. Unlike → hearts_received_count -= 2.

- [x] T008 [US3] Verify toggleHeart() reads app_config.special_days, sets is_special_day=true and points=2 when today matches | src/lib/kudos/actions.ts
- [x] T009 [US3] Verify unlike on special-day heart decrements hearts_received_count by stored points (reads heartData.points before delete, not current day) | src/lib/kudos/actions.ts

**Checkpoint**: Special day logic verified — uses stored points for unlike ✅

---

## Phase 5: Testing

**Purpose**: Ensure test coverage for the critical gap fix and edge cases

- [x] T010 [P] Existing test covers: toggleHeart like → heart inserted, count returned | tests/integration/heart-toggle.test.ts
- [x] T011 [P] Existing test covers: toggleHeart unlike → heart deleted, count returned | tests/integration/heart-toggle.test.ts
- [ ] T012 [P] Add integration test: hearts_received_count incremented/decremented after like/unlike (requires DB RPC — needs Docker for Supabase) | tests/integration/heart-toggle.test.ts
- [x] T013 Verify existing test: self-like blocked by RLS (hearts_insert policy checks sender_id) — verified in RLS policies test file | tests/integration/rls-policies.test.ts
- [x] T014 Verify existing test: duplicate heart blocked by UNIQUE(kudos_id, user_id) — verified in heart-toggle test | tests/integration/heart-toggle.test.ts
- [x] T015 Run full test suite — 211 passed, 20 skipped, 0 failures | all files

**Checkpoint**: All acceptance scenarios covered. T012 blocked — needs Docker for Supabase RPC test.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Verification)**: No dependencies — start immediately
- **Phase 2 (US1 Fix)**: Depends on Phase 1 (need to understand current code)
- **Phase 3 (US2)**: Independent — can run parallel with Phase 2
- **Phase 4 (US3)**: Depends on Phase 2 (special day logic touches same function)
- **Phase 5 (Testing)**: Depends on Phase 2 (tests validate the fix)

### Parallel Opportunities

- T002, T003, T004 can run in parallel (different files)
- T007 can run in parallel with Phase 2
- T010, T011, T012 can run in parallel (different test cases, same file)

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 (Verification) — understand current state
2. Complete Phase 2 (Fix hearts_received_count) — **this is the critical fix**
3. Complete Phase 5 (Testing) — validate the fix
4. **STOP and VALIDATE**: Run `npx vitest run` — all tests pass

### Incremental Delivery

1. Phase 1: Verify → Phase 2: Fix → Phase 5: Test → Commit
2. Phase 3 + 4: Verify display + special day → Commit

---

## Notes

- Most code already exists — this is primarily a **bug fix + verification** task
- The critical gap was in `src/lib/kudos/actions.ts` — toggleHeart() didn't update hearts_received_count
- The counter update targets the **kudos sender** (not the person who liked)
- For unlike: reads the heart's stored `points` before deleting (not assume current day)
- New migration: `20260325000000_add_hearts_counter_rpcs.sql` creates `increment_hearts_received` and `decrement_hearts_received` RPC functions
- T012 is blocked because it requires Docker for Supabase local to test RPC functions
