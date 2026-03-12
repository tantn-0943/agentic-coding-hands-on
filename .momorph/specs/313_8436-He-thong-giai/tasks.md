# Tasks: Hệ thống giải

**Frame**: `313_8436-He-thong-giai`
**Prerequisites**: plan.md ✅, spec.md ✅, design-style.md ✅

---

## Task Format

```text
- [ ] T### [P?] [Story?] Description | file/path.ts
```

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this belongs to (US1, US2, US3)
- **|**: File path affected by this task

---

## Phase 1: Setup (Route & Feature Skeleton)

**Purpose**: Tạo khung route và thư mục feature riêng cho màn Awards Information

- [ ] T001 Create route directory for dedicated screen | src/app/award-information/
- [ ] T002 [P] Create feature component directory for award-information screen | src/components/award-information/
- [ ] T003 [P] Create menu mapping helper file skeleton | src/lib/awards-menu.ts
- [ ] T004 Confirm route constants/assumptions used in tasks (`/award-information`, `/sun-kudos`) in code comments/docs | .momorph/specs/313_8436-He-thong-giai/tasks.md

---

## Phase 2: Foundation (Blocking Prerequisites)

**Purpose**: Chuẩn hóa data model và source of truth cho menu/card trước khi làm UI

**⚠️ CRITICAL**: Không bắt đầu user story work cho màn riêng trước khi phase này xong

- [ ] T005 Extend `Award` type to support detail-screen metadata: `quantity`, `unit`, `prizeValue`, optional `note` | src/types/awards.ts
- [ ] T006 [P] Add `AwardNavigationItem` type for left-menu mapping | src/types/awards.ts
- [ ] T007 Normalize `awards.ts` data to match reviewed spec fields and stable slugs | src/lib/awards.ts
- [ ] T008 Create `awards-menu.ts` as single source of truth for 6 menu items and target section IDs | src/lib/awards-menu.ts
- [ ] T009 Verify `Header.tsx` active-state logic covers `/award-information` correctly without extra changes, or patch if pathname handling is insufficient | src/components/layout/Header.tsx
- [ ] T010 Verify middleware protects `/award-information` via existing non-public route logic; add/update tests if missing | src/middleware.ts

**Checkpoint**: Detail-screen data contract + route protection ready

---

## Phase 3: User Story 1 — Xem tổng quan hệ thống giải thưởng (Priority: P1) 🎯 MVP

**Goal**: Tạo màn `/award-information` hiển thị keyvisual, section title, 6 award detail cards và metadata đúng theo spec

**Independent Test**: Người dùng đã đăng nhập mở `/award-information` và thấy keyvisual + tiêu đề + đủ 6 card (`Top Talent`, `Top Project`, `Top Project Leader`, `Best Manager`, `Signature 2025 - Creator`, `MVP`) với mô tả, số lượng, đơn vị, giá trị

### Frontend (US1)

- [ ] T011 [P] [US1] Create `AwardDetailCard.tsx` for detail-screen card layout with image, title, description, quantity/unit, prize value | src/components/award-information/AwardDetailCard.tsx
- [ ] T012 [P] [US1] Create `AwardsKudosPromo.tsx` for Sun\* Kudos promo block with CTA shell/fallback state | src/components/award-information/AwardsKudosPromo.tsx
- [ ] T013 [P] [US1] Create `AwardsInfoPageContent.tsx` to compose keyvisual, section heading, left menu slot, cards column, and Kudos promo | src/components/award-information/AwardsInfoPageContent.tsx
- [ ] T014 [US1] Create route page as Server Component and export metadata | src/app/award-information/page.tsx
- [ ] T015 [US1] Wire static awards data into `AwardsInfoPageContent.tsx` and render all 6 detail cards in spec order | src/components/award-information/AwardsInfoPageContent.tsx
- [ ] T016 [US1] Add keyvisual/section heading implementation matching design-style tokens and spacing | src/components/award-information/AwardsInfoPageContent.tsx

### Data & Presentation (US1)

- [ ] T017 [P] [US1] Add formatting helper or inline utility for `prizeValue`/quantity presentation if current data shape is insufficient | src/lib/awards.ts
- [ ] T018 [US1] Ensure all award detail cards use `next/image` and responsive sizing per design-style | src/components/award-information/AwardDetailCard.tsx

### Tests (US1)

- [ ] T019 [P] [US1] Add unit tests for award data mapping and field completeness | src/lib/awards.test.ts
- [ ] T020 [US1] Add integration test for `/award-information` render with 6 cards and expected metadata | tests/integration/award-information.render.spec.ts

**Checkpoint**: Dedicated screen renders correctly and is independently testable

---

## Phase 4: User Story 2 — Điều hướng nhanh bằng menu bên trái (Priority: P1)

**Goal**: Menu trái click/hover/active hoạt động đúng và đồng bộ với section trong màn riêng

**Independent Test**: Click `Top Project` trên menu trái → màn cuộn đến đúng section, item active đổi đúng; load `/award-information#best-manager` → đúng section được focus/scroll tới

### Frontend Interaction (US2)

- [ ] T021 [P] [US2] Create `AwardsMenuItem.tsx` with default/hover/active/focus-visible states | src/components/award-information/AwardsMenuItem.tsx
- [ ] T022 [P] [US2] Create `AwardsMenu.tsx` to render 6 items from `awards-menu.ts` | src/components/award-information/AwardsMenu.tsx
- [ ] T023 [US2] Add smooth-scroll navigation from menu item click to section IDs with header offset handling | src/components/award-information/AwardsMenu.tsx
- [ ] T024 [US2] Add active-state sync by click + IntersectionObserver while scrolling | src/components/award-information/AwardsMenu.tsx
- [ ] T025 [US2] Support deep-link hash on initial page load (`/award-information#top-talent`) | src/components/award-information/AwardsInfoPageContent.tsx
- [ ] T026 [US2] Attach stable `id` anchors to each award section/card container based on slug map | src/components/award-information/AwardDetailCard.tsx

### Error / Edge Handling (US2)

- [ ] T027 [US2] Implement safe fallback when `targetSectionId` is invalid or target node is missing (no crash, keep current active state) | src/components/award-information/AwardsMenu.tsx
- [ ] T028 [US2] Ensure rapid repeated menu clicks do not create broken active state or scroll jitter | src/components/award-information/AwardsMenu.tsx

### Tests (US2)

- [ ] T029 [P] [US2] Add unit tests for menu slug mapping and target-section validity | src/lib/awards-menu.test.ts
- [ ] T030 [US2] Add component/integration tests for click-to-scroll and active-state transitions | tests/integration/award-information.menu.spec.ts
- [ ] T031 [US2] Add E2E test for deep-link hash + left menu navigation | tests/e2e/award-information.spec.ts

**Checkpoint**: Menu trái fully functional and independently testable

---

## Phase 5: User Story 3 — Xem thông tin Sun\* Kudos liên quan (Priority: P2)

**Goal**: Khối Sun\* Kudos ở cuối màn hiển thị đúng và CTA `Chi tiết` điều hướng/fallback chuẩn

**Independent Test**: Scroll đến khối Sun\* Kudos trên `/award-information` → thấy label/title/description/CTA; click CTA → sang route đích, hoặc disabled nếu route không hợp lệ

### Frontend (US3)

- [ ] T032 [US3] Finalize `AwardsKudosPromo.tsx` content, CTA aria-label, icon/text-link styling per design-style | src/components/award-information/AwardsKudosPromo.tsx
- [ ] T033 [US3] Wire `kudos.ctaRoute` / constant route into promo block | src/components/award-information/AwardsKudosPromo.tsx
- [ ] T034 [US3] Implement disabled fallback state when CTA route is missing/invalid | src/components/award-information/AwardsKudosPromo.tsx

### Tests (US3)

- [ ] T035 [P] [US3] Add component tests for CTA enabled vs disabled states | src/components/award-information/AwardsKudosPromo.test.tsx
- [ ] T036 [US3] Extend E2E flow to verify CTA navigation or disabled fallback | tests/e2e/award-information.spec.ts

**Checkpoint**: Kudos promo complete and independently testable

---

## Phase 6: Security, Auth & Edge Runtime

**Purpose**: Xác thực route protection và tính tương thích Cloudflare/Supabase cho màn mới

- [ ] T037 [P] Verify `/award-information` redirects unauthenticated users to `/login?returnTo=/award-information` | src/middleware.ts
- [ ] T038 [P] Add/update middleware tests for protected award-information route and preserved returnTo param | src/middleware.test.ts
- [ ] T039 Verify no Node.js built-ins are introduced in award-information feature files | src/app/award-information/page.tsx
- [ ] T040 Verify no sensitive auth/session data is logged or rendered while loading the screen | src/components/award-information/

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Hoàn thiện responsive, accessibility, loading/error states, và cleanup

- [ ] T041 [P] Add/finalize loading and empty-safe UI states if awards data source becomes async in V2 (document static V1 fallback) | src/components/award-information/AwardsInfoPageContent.tsx
- [ ] T042 [P] Ensure keyboard navigation order and focus-visible states for all interactive elements (menu items, CTA) | src/components/award-information/AwardsMenuItem.tsx
- [ ] T043 [P] Verify responsive layout at 375px / 768px / 1440px and fix overflow issues | src/components/award-information/AwardsInfoPageContent.tsx
- [ ] T044 [P] Ensure long descriptions do not break layout (clamp/wrap strategy) | src/components/award-information/AwardDetailCard.tsx
- [ ] T045 Review and clean shared homepage coupling: keep homepage teaser intact while detail-screen logic stays isolated | src/components/homepage/AwardsSection.tsx
- [ ] T046 Run lint/build/test suite and fix regressions for affected files | src/app/award-information/page.tsx

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: no dependencies
- **Phase 2 (Foundation)**: depends on Phase 1 and blocks all user story work
- **Phase 3 (US1)**: depends on Phase 2
- **Phase 4 (US2)**: depends on Phase 2; best started after US1 route shell exists
- **Phase 5 (US3)**: depends on Phase 3 basic page composition
- **Phase 6 (Security/Auth)**: can start after route file exists, parallel với late US2/US3
- **Phase 7 (Polish)**: after all target stories complete

### Within Each User Story

- Data/types before component wiring
- Route page shell before interaction logic
- Menu anchor IDs before hash/deep-link tests
- Tests SHOULD be written before or alongside implementation following TDD

### Parallel Opportunities

- Phase 1: T002 ‖ T003
- Phase 2: T005 ‖ T006, then T007 ‖ T008
- Phase 3: T011 ‖ T012 ‖ T013, then T014/T015/T016
- Phase 4: T021 ‖ T022, then T023–T028, while T029 can start once mapping stabilizes
- Phase 6: T037 ‖ T038 ‖ T039 ‖ T040
- Phase 7: T041 ‖ T042 ‖ T043 ‖ T044, then T045/T046

---

## Implementation Strategy

### MVP First (Recommended)

1. Complete Phase 1 + 2
2. Complete Phase 3 (US1)
3. Complete core navigation tasks T021–T026 from Phase 4
4. **STOP and VALIDATE** `/award-information` before moving to CTA polish

### Incremental Delivery

1. Route + data foundation
2. Render detail screen
3. Add left-menu interactions
4. Add Sun\* Kudos CTA
5. Add hardening + tests + polish

---

## Notes

- Assumption hiện tại: route màn là `/award-information`, CTA Sun\* Kudos đi tới `/sun-kudos`.
- URL frame public không expose full frame payload, nên task breakdown dựa trên `spec.md`, `design-style.md`, `plan.md` và hiện trạng codebase.
- Ưu tiên tách feature màn riêng khỏi homepage để tránh coupling và dễ maintain/test hơn.
