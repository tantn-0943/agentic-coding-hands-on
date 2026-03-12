# Implementation Plan: Hệ thống giải

**Frame**: `313_8436-He-thong-giai`
**Date**: 2026-03-12
**Spec**: `specs/313_8436-He-thong-giai/spec.md`

---

## Summary

Triển khai màn hình riêng **Awards Information** (`/award-information`) cho feature **Hệ thống giải thưởng SAA 2025** theo App Router, chạy trên Cloudflare Workers (OpenNext) và bảo vệ bằng Supabase Auth trong middleware. Màn hình cần có: keyvisual, section heading, menu trái (6 mục) đồng bộ active theo click/scroll, danh sách card chi tiết từng giải thưởng, và khối CTA Sun\* Kudos.

Kế hoạch này đã tính đến hiện trạng codebase: các component section ở homepage đã tồn tại và sẽ được **tái sử dụng/tách nhỏ** thay vì làm lại từ đầu.

---

## Technical Context

**Language/Framework**: TypeScript 5 / Next.js 15 (App Router)
**Primary Dependencies**: React 19, TailwindCSS 4, `next/image`, `next/font`
**Database**: Supabase PostgreSQL (optional V2 for awards data)
**Testing**: Vitest + Testing Library (unit/integration), Playwright (E2E)
**State Management**: Local state (`useState`, `useEffect`) + URL hash + optional IntersectionObserver
**API Style**: REST Route Handlers (`/api/*`) trên Next.js

---

## Constitution Compliance Check

_GATE: Must pass before implementation can begin_

- [x] Follows project coding conventions
- [x] Uses approved libraries and patterns
- [x] Adheres to folder structure guidelines
- [x] Meets security requirements
- [x] Follows testing standards

**Rule mapping highlights**:

- Server Components by default for route page (`src/app/award-information/page.tsx`), Client Components chỉ khi cần interaction (menu active sync theo scroll).
- `next/image` cho ảnh thưởng/keyvisual.
- Không dùng Node.js built-ins trong runtime edge.
- Route/API liên quan auth phải verify Supabase session.
- Bắt buộc test ở 375/768/1440 + E2E cho flow P1.

**Violations (if any)**:

| Violation | Justification | Alternative Rejected |
| --------- | ------------- | -------------------- |
| None      | —             | —                    |

---

## Architecture Decisions

### Frontend Approach

- **Component Structure**: Feature-based, thêm cụm component `award-information` để tách màn riêng khỏi homepage.
- **Styling Strategy**: Tailwind utilities + token từ `globals.css`; bảo toàn responsive 375/768/1440.
- **Data Fetching**:
  - V1: static config (`src/lib/awards.ts`) để giảm phụ thuộc backend.
  - V2: migrate sang Route Handler `/api/awards` nếu cần CMS/Admin.

### Backend Approach

- **Auth & Authorization**: Bảo vệ route bằng middleware + Supabase session (`@supabase/ssr`).
- **API Design**:
  - Optional V1: không cần API awards nếu static.
  - Optional V2: `GET /api/awards`, `GET /api/awards/:slug`.
- **Validation**: Zod schema cho query params/API input (khi bật API).

### Integration Points

- **Existing Services**:
  - `src/middleware.ts` (auth redirect, security headers)
  - `src/libs/supabase/*` (client/server/middleware)
- **Shared Components**:
  - `src/components/homepage/AwardCard.tsx` (reuse logic card)
  - `src/components/homepage/AwardsSection.tsx` (tham chiếu cấu trúc hiện tại)
  - `src/components/layout/Header.tsx`, `Footer.tsx`
- **API Contracts**:
  - Nếu static: không cần contract runtime.
  - Nếu API: trả mảng `AwardCategory` theo định dạng trong spec.

---

## Current Baseline (Codebase Audit)

- ✅ `src/components/homepage/AwardsSection.tsx`, `AwardCard.tsx`, `KudosSection.tsx` đã tồn tại.
- ✅ `src/lib/awards.ts` đã tồn tại (data source static).
- ✅ Header đã có nav link `/award-information`.
- ❌ Chưa có route `src/app/award-information/page.tsx` (hiện link dễ dẫn đến 404).
- ⚠ `AwardsSection` hiện là grid dạng homepage, chưa có menu trái + scroll-sync theo spec màn riêng.
- ⚠ Cần tách rõ component dành cho màn `/award-information` để tránh coupling với homepage layout.

---

## Project Structure

### Documentation (this feature)

```text
.momorph/specs/313_8436-He-thong-giai/
├── spec.md
├── design-style.md
├── plan.md
├── tasks.md                # next step
└── assets/
    ├── Hệ_thống_giải.png
    └── frame-url.txt
```

### Source Code (affected areas)

```text
src/
├── app/
│   ├── award-information/
│   │   └── page.tsx                       # NEW: dedicated screen route
│   ├── page.tsx                           # keep homepage (reuse concise awards teaser)
│   └── api/
│       └── awards/                        # optional if API-driven
├── components/
│   ├── award-information/                 # NEW: dedicated screen components
│   │   ├── AwardsInfoPageContent.tsx
│   │   ├── AwardsMenu.tsx
│   │   ├── AwardsMenuItem.tsx
│   │   ├── AwardDetailCard.tsx
│   │   └── AwardsKudosPromo.tsx
│   ├── homepage/                          # existing (reuse where phù hợp)
│   │   ├── AwardsSection.tsx
│   │   ├── AwardCard.tsx
│   │   └── KudosSection.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── awards.ts                          # existing static data source (V1)
│   └── awards-menu.ts                     # NEW: menu map / slug ordering
├── types/
│   └── awards.ts                          # may extend fields for detail screen
└── middleware.ts                          # auth + security headers
```

### New Files

| File                                                         | Purpose                                             |
| ------------------------------------------------------------ | --------------------------------------------------- |
| `src/app/award-information/page.tsx`                         | Route màn hình Hệ thống giải                        |
| `src/components/award-information/AwardsInfoPageContent.tsx` | Container ghép keyvisual + menu + cards + kudos CTA |
| `src/components/award-information/AwardsMenu.tsx`            | Menu trái 6 mục, xử lý active/interaction           |
| `src/components/award-information/AwardsMenuItem.tsx`        | Atomic menu item với hover/active/focus             |
| `src/components/award-information/AwardDetailCard.tsx`       | Card chi tiết theo spec D.1–D.6                     |
| `src/components/award-information/AwardsKudosPromo.tsx`      | Khối Sun\* Kudos và nút `Chi tiết`                  |
| `src/lib/awards-menu.ts`                                     | Mapping menu ↔ section ids để tránh mismatch        |

### Modified Files

| File                               | Changes                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `src/lib/awards.ts`                | Chuẩn hóa/đủ trường cho detail screen (`quantity`, `unit`, `prizeValue`, `slug`) |
| `src/types/awards.ts`              | Bổ sung type cho dữ liệu detail + navigation mapping                             |
| `src/components/layout/Header.tsx` | Giữ nav hiện tại, xác nhận active state `/award-information`                     |
| `src/middleware.ts`                | Xác nhận route `/award-information` protected bằng Supabase session              |
| `src/app/page.tsx`                 | Chỉ giữ teaser section (không ép full behavior của màn riêng vào homepage)       |

---

## Implementation Strategy

### Phase Breakdown

1. **Setup & Baseline**
   - Confirm spec/design-style/plan approved
   - Chốt route đích CTA Sun\* Kudos (`/sun-kudos` hoặc route chính thức)
   - Chốt V1 static data, V2 API deferred

2. **Foundation (P1)**
   - Chuẩn hóa kiểu dữ liệu `AwardCategory` trong `src/types/awards.ts`
   - Chuẩn hóa dữ liệu `src/lib/awards.ts` theo spec fields
   - Tạo `src/lib/awards-menu.ts` làm single source of truth cho menu ↔ section slug

3. **User Story 1 (P1): Render full awards system**
   - Tạo route `src/app/award-information/page.tsx`
   - Render keyvisual + heading + 6 cards detail trên màn riêng
   - Hiển thị đủ metadata (số lượng/đơn vị/giá trị) theo spec

4. **User Story 2 (P1): Left menu navigation**
   - Implement menu trái click => smooth scroll đúng section
   - Active state sync theo click + IntersectionObserver
   - Hỗ trợ deep-link hash `/award-information#top-talent`

5. **User Story 3 (P2): Sun\* Kudos CTA**
   - Render khối promo + CTA `Chi tiết`
   - Điều hướng route đích + disabled fallback khi route thiếu

6. **Security + Auth + Edge hardening**
   - Verify route `/award-information` đi qua middleware auth (Supabase session)
   - Verify edge compatibility (không dùng Node built-ins)
   - Verify security headers vẫn được gắn đầy đủ

7. **Testing & Polish**
   - Unit tests: mapping, scroll-sync, formatter
   - Integration tests: menu ↔ section ↔ hash behavior
   - E2E: load screen + navigate menu + CTA

### Risk Assessment

| Risk                                    | Probability | Impact | Mitigation                                                     |
| --------------------------------------- | ----------- | ------ | -------------------------------------------------------------- |
| Mismatch slug menu ↔ section            | Medium      | High   | Dùng single source of truth (slug map)                         |
| Route CTA Sun\* Kudos chưa chốt         | Medium      | Medium | Config route qua constants + fallback disabled                 |
| Inconsistency desktop/mobile layout     | Medium      | Medium | Checkpoint bắt buộc 375/768/1440 trước merge                   |
| API migration chậm (nếu bỏ static)      | Low         | Medium | Ship static V1, tách API V2 không block UI                     |
| Route `/award-information` chưa tồn tại | High        | High   | Ưu tiên tạo route ở Phase 3 trước khi tối ưu UI                |
| Reuse component homepage gây coupling   | Medium      | Medium | Tách component riêng `award-information/*`, chỉ reuse phần nhỏ |

### Estimated Complexity

- **Frontend**: Medium
- **Backend**: Low (V1 static) / Medium (V2 API)
- **Testing**: Medium

---

## Integration Testing Strategy

### Test Scope

- [x] **Component/Module interactions**: menu trái ↔ cards ↔ hash routing
- [x] **External dependencies**: Supabase auth session qua middleware
- [ ] **Data layer**: chỉ khi chuyển qua API/DB
- [x] **User workflows**: vào màn, xem card, click điều hướng
- [x] **Route protection**: user chưa auth truy cập `/award-information` bị redirect đúng theo middleware

### Test Categories

| Category           | Applicable? | Key Scenarios                              |
| ------------------ | ----------- | ------------------------------------------ |
| UI ↔ Logic         | Yes         | Menu active/scroll sync, responsive render |
| Service ↔ Service  | No          | V1 static data                             |
| App ↔ External API | Optional    | V2 `/api/awards`                           |
| App ↔ Data Layer   | Optional    | Supabase table `awards`                    |
| Cross-platform     | Yes         | Chrome/Safari + mobile/desktop viewports   |

### Test Environment

- **Environment type**: Local + CI
- **Test data strategy**: Fixtures/static seed for awards
- **Isolation approach**: deterministic data + clean navigation state mỗi test

### Mocking Strategy

| Dependency Type       | Strategy                        | Rationale                                  |
| --------------------- | ------------------------------- | ------------------------------------------ |
| Supabase auth session | Mock (unit), Real (E2E staging) | Tách logic UI khỏi backend trong unit test |
| Award dataset         | Fixture/static                  | Ổn định assertion và snapshot              |
| Browser scroll APIs   | Mock trong unit                 | Test active state logic chính xác          |

### Test Scenarios Outline

1. **Happy Path**
   - [ ] Authenticated user mở `/award-information` thấy keyvisual + menu + 6 card
   - [ ] Click menu `Top Project` cuộn đúng section và item active đổi đúng
   - [ ] Click CTA `Chi tiết` điều hướng đúng route Sun\* Kudos

2. **Error Handling**
   - [ ] Thiếu `kudos.ctaRoute` => CTA disabled
   - [ ] targetSectionId không hợp lệ => không crash UI
   - [ ] Data awards thiếu field optional => render fallback an toàn

3. **Edge Cases**
   - [ ] Description dài vẫn không vỡ layout
   - [ ] Click nhanh nhiều menu item vẫn giữ active đúng
   - [ ] Deep link hash mở đúng section khi page load
   - [ ] Unauthenticated user vào `/award-information` bị redirect `/login?returnTo=...`

### Tooling & Framework

- **Test framework**: Vitest, Playwright
- **Supporting tools**: Testing Library, mock browser APIs
- **CI integration**: chạy trong pipeline sau lint/build

### Coverage Goals

| Area                   | Target | Priority |
| ---------------------- | ------ | -------- |
| Core user flows        | 90%+   | High     |
| Navigation integration | 85%+   | High     |
| Error/edge cases       | 75%+   | Medium   |

---

## Dependencies & Prerequisites

### Required Before Start

- [x] `constitution.md` reviewed and understood
- [x] `spec.md` approved by stakeholders
- [x] `design-style.md` reviewed
- [ ] `research.md` completed (optional but recommended)
- [ ] API contracts defined (if API mode)
- [ ] Database migrations planned (if DB mode)
- [ ] Route slug chính thức cho màn hình (`/award-information`) được chốt với team

### External Dependencies

- Supabase project env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Cloudflare env/bindings for production runtime
- Final route spec for Sun\* Kudos CTA

---

## Next Steps

After plan approval:

1. **Run** `/momorph.tasks` để sinh task breakdown chi tiết
2. **Review** `tasks.md` để tách việc song song FE/BE/test
3. **Start** implementation theo thứ tự P1 → P2 → hardening → test

---

## Notes

- URL frame public hiện không trả dữ liệu chi tiết (redirect login), nên kế hoạch dựa trên `spec.md` + `design-style.md` đã review.
- Kế hoạch ưu tiên **ship nhanh với static data + Supabase Auth guard**, sau đó mở rộng API ở phase sau để giảm rủi ro tiến độ.
- Trọng tâm reviewplan: biến kế hoạch thành dạng taskable ngay, tránh mơ hồ giữa homepage teaser và màn riêng awards information.
