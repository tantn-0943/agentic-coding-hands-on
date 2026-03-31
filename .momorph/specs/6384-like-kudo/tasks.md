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

- [ ] T001 Verify HeartButton renders 3 states (default, liked, disabled/own-kudo) with correct design tokens from design-style.md | src/components/kudos/HeartButton.tsx
- [ ] T002 [P] Verify useHeartToggle hook handles optimistic toggle, rollback on error, and isLoading guard | src/hooks/useHeartToggle.ts
- [ ] T003 [P] Verify HeartButton integration in KudoPostCard (variant="default") | src/components/kudos/KudoPostCard.tsx
- [ ] T004 [P] Verify HeartButton integration in HighlightKudoCard (variant="highlight") | src/components/kudos/HighlightKudoCard.tsx

**Checkpoint**: Existing code verified — gaps identified for next phase

---

## Phase 2: US1 — Like/Unlike Toggle [P1] — Fix Critical Gap

**Goal**: Fix `toggleHeart()` to update `user_profiles.hearts_received_count` on the kudos sender's profile when a heart is added or removed.

**Independent Test**: Like a kudo → check sender's `hearts_received_count` incremented. Unlike → check decremented.

- [ ] T005 [US1] In toggleHeart() LIKE branch: after inserting heart, look up the kudos sender_id, then increment user_profiles.hearts_received_count by `points` (1 or 2) for that sender | src/lib/kudos/actions.ts
- [ ] T006 [US1] In toggleHeart() UNLIKE branch: before deleting heart, read the heart's `points` value, look up the kudos sender_id, then decrement user_profiles.hearts_received_count by that amount after delete | src/lib/kudos/actions.ts

**Checkpoint**: toggleHeart() now maintains hearts_received_count in sync with hearts table

---

## Phase 3: US2 — Heart Count Display [P1]

**Goal**: Verify locale-formatted heart count display works correctly

**Independent Test**: Kudo with 1000 hearts → renders "1,000". Kudo with 0 hearts → renders "0".

- [ ] T007 [US2] Verify HeartButton count formatting uses `toLocaleString()` for numbers >= 1000 | src/components/kudos/HeartButton.tsx

**Checkpoint**: Heart count display verified

---

## Phase 4: US3 — Special Day Double Points [P2]

**Goal**: Verify special day logic awards 2 points and decrements correctly

**Independent Test**: On a special day, like a kudo → heart.points = 2, hearts_received_count += 2. Unlike → hearts_received_count -= 2.

- [ ] T008 [US3] Verify toggleHeart() reads app_config.special_days, sets is_special_day=true and points=2 when today matches | src/lib/kudos/actions.ts
- [ ] T009 [US3] Verify unlike on special-day heart decrements hearts_received_count by 2 (reads stored points, not current day) | src/lib/kudos/actions.ts

**Checkpoint**: Special day logic verified end-to-end

---

## Phase 5: Testing

**Purpose**: Ensure test coverage for the critical gap fix and edge cases

- [ ] T010 [P] Add integration test: toggleHeart like → hearts_received_count incremented on sender profile | tests/integration/heart-toggle.test.ts
- [ ] T011 [P] Add integration test: toggleHeart unlike → hearts_received_count decremented on sender profile | tests/integration/heart-toggle.test.ts
- [ ] T012 [P] Add integration test: special day like/unlike → hearts_received_count changes by 2 | tests/integration/heart-toggle.test.ts
- [ ] T013 Verify existing test: self-like blocked by RLS (hearts_insert policy checks sender_id) | tests/integration/heart-toggle.test.ts
- [ ] T014 Verify existing test: duplicate heart blocked by UNIQUE(kudos_id, user_id) | tests/integration/heart-toggle.test.ts
- [ ] T015 Run full test suite — all tests pass, no regressions | all files

**Checkpoint**: All acceptance scenarios from spec.md covered by tests

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
- The critical gap is in `src/lib/kudos/actions.ts` lines 25-71
- The counter update must target the **kudos sender** (not the person who liked)
- For unlike: must read the heart's stored `points` before deleting (not assume current day)
