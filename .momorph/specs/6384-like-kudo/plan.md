# Implementation Plan: Like Kudo (Heart)

**Frame**: `6384-like-kudo`
**Spec**: `spec.md`
**Created**: 2026-03-25

---

## Summary

The Like Kudo feature is **mostly implemented** but has one critical gap: the `toggleHeart()` server action does NOT update `user_profiles.hearts_received_count` on the kudos sender's profile. This denormalized counter is required by the spec for stats display.

The implementation uses: Next.js Server Actions + Supabase RLS + optimistic UI via React hook.

---

## Constitution Compliance

| Requirement | Constitution Rule | Status |
|-------------|------------------|--------|
| TypeScript strict | All files .ts/.tsx | ✅ Compliant |
| Server Components default | HeartButton is Client Component (needs interaction) | ✅ Compliant |
| Supabase Auth | RLS policies enforce auth | ✅ Compliant |
| Edge runtime | No Node.js built-ins in actions.ts | ✅ Compliant |
| Icon component | Uses `<Icon>` not raw SVG | ✅ Compliant |
| Zod validation | heartToggleSchema validates input | ✅ Compliant |

---

## Architecture Decisions

### Frontend
- **Component**: `HeartButton` — pure presentational with `variant` prop (default/highlight)
- **State management**: `useHeartToggle` custom hook — optimistic toggle with rollback
- **Data flow**: HeartButton → useHeartToggle → toggleHeart server action → Supabase

### Backend
- **API**: Server Action `toggleHeart()` in `src/lib/kudos/actions.ts` (not REST route)
- **Auth**: Supabase RLS on `hearts` table enforces:
  - Only authenticated users can read
  - Users cannot like their own kudos (`auth.uid() != sender_id`)
  - Users can only delete their own hearts
- **Special days**: Queries `app_config.special_days` to determine points (1 or 2)

### Database
- **hearts table**: Existing with UNIQUE(kudos_id, user_id) constraint
- **Denormalized counter**: `user_profiles.hearts_received_count` updated on toggle
- No new migrations needed

---

## Project Structure

### Existing Files (no new files needed)

| File | Purpose | Status |
|------|---------|--------|
| `src/components/kudos/HeartButton.tsx` | Heart button UI with variant support | ✅ Implemented |
| `src/hooks/useHeartToggle.ts` | Optimistic toggle hook | ✅ Implemented |
| `src/lib/kudos/actions.ts` | `toggleHeart()` server action | ✅ Implemented |
| `src/lib/kudos/validators.ts` | `heartToggleSchema` Zod schema | ✅ Implemented |
| `supabase/migrations/20260316000000_create_kudos_tables.sql` | hearts table + RLS | ✅ Applied |

### Integration Points

| Consumer | How it uses HeartButton |
|----------|------------------------|
| `src/components/kudos/KudoPostCard.tsx` | `<HeartButton variant="default" />` in action bar |
| `src/components/kudos/HighlightKudoCard.tsx` | `<HeartButton variant="highlight" />` in action bar |

### Dependencies
No new dependencies needed.

---

## Implementation Approach

### Phase 1: Fix Critical Gap — hearts_received_count

**Bug**: `toggleHeart()` in `src/lib/kudos/actions.ts` does NOT update `user_profiles.hearts_received_count` on the kudos **sender's** profile when a heart is added or removed. The spec (Data Requirements) requires this counter to be maintained.

**Fix needed**:
1. After inserting a heart: increment `hearts_received_count` by `points` (1 or 2) on the **sender's** user_profiles row (the person who sent the kudos, not the person who liked it)
2. After deleting a heart: look up the deleted heart's `points` value, decrement `hearts_received_count` by that amount
3. The counter update targets the kudos **sender** (the person who receives recognition when their kudos gets hearts)

**Files to modify**:
- `src/lib/kudos/actions.ts` — add counter increment/decrement after heart insert/delete

### Phase 2: Verification (Mostly implemented)

| User Story | Implementation | Status |
|------------|----------------|--------|
| US1 - Like/Unlike toggle | HeartButton + useHeartToggle + toggleHeart action | ✅ Done |
| US2 - Heart count display | `count.toLocaleString()` in HeartButton | ✅ Done |
| US3 - Special day double points | `toggleHeart()` checks `app_config.special_days` | ✅ Done |
| Counter update | `hearts_received_count` on sender profile | ❌ **Missing** |

### Phase 3: Testing Gaps

| Test | File | Status |
|------|------|--------|
| Unit: HeartButton renders states | Needs verification | 📋 Check |
| Unit: useHeartToggle optimistic update | Needs verification | 📋 Check |
| Integration: toggleHeart with RLS | Needs verification | 📋 Check |
| Integration: hearts_received_count updated | **Must add** | ❌ Missing |
| Edge: self-like blocked | RLS policy exists | ✅ DB-level |
| Edge: duplicate prevention | UNIQUE constraint | ✅ DB-level |
| Edge: special day logic | In toggleHeart action | 📋 Check |

---

## Testing Strategy

| Type | Focus | Coverage |
|------|-------|----------|
| Unit | HeartButton rendering (3 states: default, liked, disabled) | 📋 Plan |
| Unit | useHeartToggle (toggle, rollback, loading guard) | 📋 Plan |
| Integration | toggleHeart action (like, unlike, special day, self-like) | 📋 Plan |
| E2E | Click heart → count changes → persists on reload | 📋 Plan |

---

## Risk Assessment

| Risk | Impact | Mitigation |
|------|--------|------------|
| hearts_received_count out of sync | Medium | Counter is updated in same transaction as heart insert/delete |
| Special day timezone issues | Low | Compare dates as strings (YYYY-MM-DD) in server timezone |
| Optimistic UI flicker on slow networks | Low | isPending flag prevents double-toggle; rollback is smooth |

---

## Open Questions

- [x] ~~Feature fully implemented~~ **hearts_received_count update is missing** — needs fix in toggleHeart action

---

## Next Steps

1. Run `/momorph.tasks` to generate verification task list
2. Verify existing tests cover all acceptance scenarios
3. Add missing test coverage if gaps found
