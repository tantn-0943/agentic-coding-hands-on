# Feature Specification: Hệ thống giải

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-12
**Status**: Reviewed

---

## Overview

Màn hình **Hệ thống giải thưởng SAA 2025** cung cấp danh sách đầy đủ các hạng mục giải thưởng và thông tin chi tiết cho từng hạng mục (số lượng giải, đơn vị/cá nhân, giá trị giải thưởng). Màn hình gồm hero/banner giới thiệu, tiêu đề section, menu điều hướng dọc bên trái và danh sách thẻ giải thưởng ở bên phải.

Người dùng mục tiêu: Sunner đã đăng nhập, muốn tra cứu nhanh cấu trúc giải thưởng và giá trị từng giải trong chương trình SAA 2025.

---

## User Scenarios & Testing _(mandatory)_

### User Story 1 - Xem tổng quan hệ thống giải thưởng (Priority: P1)

Người dùng truy cập màn hình để xem đầy đủ 6 hạng mục giải thưởng và thông tin mô tả tương ứng.

**Why this priority**: Đây là mục tiêu cốt lõi của màn hình; thiếu luồng này thì màn hình không còn giá trị nghiệp vụ.

**Independent Test**: Truy cập trang Awards Information → thấy section title + menu trái + 6 thẻ giải (`Top Talent`, `Top Project`, `Top Project Leader`, `Best Manager`, `Signature 2025 - Creator`, `MVP`) cùng metadata giá trị giải thưởng.

**Acceptance Scenarios**:

1. **Given** người dùng mở màn hình Hệ thống giải, **When** trang render xong, **Then** hiển thị tiêu đề section “Hệ thống giải thưởng SAA 2025”.
2. **Given** màn hình đã render, **When** người dùng quan sát nội dung chính, **Then** thấy đầy đủ 6 thẻ giải thưởng với tiêu đề, mô tả, số lượng và giá trị giải.
3. **Given** người dùng đọc từng thẻ giải, **When** kiểm tra metadata, **Then** dữ liệu số lượng/giá trị hiển thị đúng theo thiết kế (vd: Top Talent 10 giải, 7.000.000 VNĐ/giải).

---

### User Story 2 - Điều hướng nhanh bằng menu bên trái (Priority: P1)

Người dùng dùng menu danh mục bên trái để nhảy nhanh tới hạng mục giải tương ứng trong vùng nội dung.

**Why this priority**: Tăng tốc độ tra cứu khi nội dung dài; là hành vi tương tác chính ngoài việc đọc thông tin.

**Independent Test**: Click lần lượt từng menu item ở cột trái và xác nhận viewport cuộn đến block nội dung tương ứng.

**Acceptance Scenarios**:

1. **Given** menu trái hiển thị 6 mục, **When** người dùng click `Top Project`, **Then** màn hình cuộn đến block `Top Project` và mục menu chuyển trạng thái active.
2. **Given** một mục menu đang active, **When** người dùng click mục khác, **Then** trạng thái active chuyển đúng mục mới.
3. **Given** người dùng hover vào một mục menu, **When** con trỏ vào vùng item, **Then** item hiển thị hiệu ứng highlight theo thiết kế.

---

### User Story 3 - Xem thông tin Sun\* Kudos liên quan (Priority: P2)

Người dùng xem khối giới thiệu Sun\* Kudos ở cuối màn và bấm “Chi tiết” để điều hướng sang nội dung liên quan.

**Why this priority**: Luồng mở rộng giúp kết nối giữa Awards và Kudos, hữu ích nhưng không chặn MVP của màn hình giải thưởng.

**Independent Test**: Scroll tới khối `Sun* Kudos` → click nút `Chi tiết` → điều hướng thành công đến màn/section đích.

**Acceptance Scenarios**:

1. **Given** người dùng scroll đến khối Sun\* Kudos, **When** khối xuất hiện trong viewport, **Then** hiển thị đầy đủ label, title, mô tả và CTA `Chi tiết`.
2. **Given** người dùng click CTA `Chi tiết`, **When** thao tác click được xử lý, **Then** hệ thống điều hướng sang trang đích Sun\* Kudos.

---

### Edge Cases

- Mục menu và block nội dung mất đồng bộ khi thêm/xóa hạng mục trong dữ liệu (phải có mapping slug/id ổn định).
- Mô tả giải thưởng dài bất thường gây vỡ layout card trên mobile.
- Người dùng click nhanh nhiều mục menu liên tiếp gây giật scroll hoặc active state sai.
- Nút `Chi tiết` của Sun\* Kudos không có đích hợp lệ (fallback: disable hoặc route mặc định).

---

## UI/UX Requirements _(from Figma)_

### Screen Components

| Component                  | Node ID               | Description                                                   | Interactions             |
| -------------------------- | --------------------- | ------------------------------------------------------------- | ------------------------ |
| Keyvisual                  | `313:8437`            | Banner chính, tiêu đề campaign ROOT FURTHER + phụ đề SAA 2025 | Không tương tác          |
| Title hệ thống giải thưởng | `313:8453`            | Caption + heading section giải thưởng                         | Không tương tác          |
| Khối hệ thống giải thưởng  | `313:8458`            | Container chính gồm menu trái và danh sách thẻ giải           | Menu click để điều hướng |
| Menu list                  | `313:8459`            | Danh mục 6 mục giải thưởng ở cột trái                         | Click/Hover/Active state |
| Top Talent menu            | `313:8460`            | Item điều hướng đến block Top Talent                          | Click scroll             |
| Top Project menu           | `313:8461`            | Item điều hướng đến block Top Project                         | Click scroll             |
| Top Project Leader menu    | `313:8462`            | Item điều hướng đến block Top Project Leader                  | Click scroll             |
| Best Manager menu          | `313:8463`            | Item điều hướng đến block Best Manager                        | Click scroll             |
| Signature 2025 menu        | `313:8464`            | Item điều hướng đến block Signature 2025 - Creator            | Click scroll             |
| MVP menu                   | `313:8465`            | Item điều hướng đến block MVP                                 | Click scroll             |
| Card Top Talent            | `313:8467`            | Thẻ thông tin giải Top Talent                                 | Read-only                |
| Card Top Project           | `313:8468`            | Thẻ thông tin giải Top Project                                | Read-only                |
| Card Top Project Leader    | `313:8469`            | Thẻ thông tin giải Top Project Leader                         | Read-only                |
| Card Best Manager          | `313:8470`            | Thẻ thông tin giải Best Manager                               | Read-only                |
| Card Signature 2025        | `313:8471`            | Thẻ thông tin Signature 2025 - Creator                        | Read-only                |
| Card MVP                   | `313:8510`            | Thẻ thông tin MVP                                             | Read-only                |
| Khối Sun\* Kudos           | `335:12023`           | Promo block liên kết sang Sun\* Kudos                         | Click CTA                |
| Nút `Chi tiết`             | `I335:12023;313:8426` | CTA text-link trong khối Sun\* Kudos                          | Click điều hướng         |

### Navigation Flow

- From:
  - Homepage SAA section Awards (CTA / nav link)
  - Header global nav “Awards Information”
  - Deep link trực tiếp `/award-information` hoặc `/award-information#<award-slug>`
- To:
  - Điều hướng nội bộ trong trang qua menu trái (anchor/scroll)
  - Trang Sun\* Kudos khi click CTA `Chi tiết`
- Triggers:
  - Click menu item trái
  - Scroll nội dung chính
  - Click CTA trong block Sun\* Kudos

### Visual Requirements

- Bố cục 2 cột ở section chính: **menu trái** + **content phải**.
- Card giải thưởng có cấu trúc thống nhất: ảnh/icon + title + mô tả + metadata.
- Responsive breakpoints: mobile (≥320), tablet (≥768), desktop (≥1024).
- Accessibility:
  - Menu trái thao tác được bằng keyboard.
  - Active item có dấu hiệu thị giác rõ ràng (underline/màu vàng).
  - Ảnh trang trí có alt phù hợp hoặc `aria-hidden` nếu thuần decor.
  - CTA `Chi tiết` có `aria-label` rõ nghĩa (ví dụ: `Xem chi tiết Sun* Kudos`).
  - Mọi interactive item có trạng thái `focus-visible` và thứ tự tab hợp lý.

---

## Requirements _(mandatory)_

### Functional Requirements

- **FR-001**: System MUST hiển thị đầy đủ 6 hạng mục giải thưởng trong màn hình.
- **FR-002**: System MUST cho phép click menu trái để cuộn đến block nội dung tương ứng.
- **FR-003**: Menu item đang được chọn MUST có trạng thái active rõ ràng.
- **FR-004**: Mỗi card giải MUST hiển thị tối thiểu: tên giải, mô tả, số lượng, giá trị giải thưởng.
- **FR-005**: CTA `Chi tiết` của Sun\* Kudos MUST điều hướng đúng trang đích.
- **FR-006**: Màn hình MUST hoạt động nhất quán ở desktop/tablet/mobile.

### Technical Requirements

- **TR-001**: Dữ liệu hạng mục giải SHOULD được cấu hình theo danh sách có `id/slug` ổn định để map menu ↔ content.
- **TR-002**: Điều hướng nội bộ SHOULD dùng cơ chế `scrollIntoView` + offset header hoặc anchor hash.
- **TR-003**: Active state SHOULD cập nhật theo click và/hoặc theo vị trí section khi scroll (intersection observer).
- **TR-004**: Hình ảnh giải thưởng MUST dùng `next/image` để tối ưu hiệu năng.
- **TR-005**: Các CTA/menu tương tác MUST có focus-visible style đảm bảo WCAG AA.
- **TR-006**: Không hardcode text đa ngôn ngữ trong component nếu dự án đang dùng i18n mapping.

### Key Entities _(if feature involves data)_

- **AwardCategory**: `{ id, slug, title, description, quantity, unit, prizeValue, note, image }`
- **AwardNavigationItem**: `{ id, label, targetSectionId, order }`
- **KudosPromo**: `{ title, subtitle, description, ctaLabel, ctaRoute }`

### Data Requirements

#### Display Fields

| Field                  | Source            | Format           | Validation/Rule                                   |
| ---------------------- | ----------------- | ---------------- | ------------------------------------------------- |
| `award.title`          | Static config/API | string           | Required, non-empty                               |
| `award.description`    | Static config/API | string           | Required, hỗ trợ xuống dòng, tránh HTML unsafe    |
| `award.quantity`       | Static config/API | string/number    | Required, hiển thị theo locale (`01`, `10`, `02`) |
| `award.unit`           | Static config/API | string           | Optional (`Cá nhân`, `Tập thể`, `Đơn vị`)         |
| `award.prizeValue`     | Static config/API | currency text    | Required, định dạng `x.xxx.xxx VNĐ`               |
| `menu.label`           | Static config/API | string           | Required, unique theo danh sách menu              |
| `menu.targetSectionId` | Static config/API | string (slug/id) | Required, phải match section thật trong DOM       |
| `kudos.ctaRoute`       | Static config/API | path             | Required khi CTA enabled                          |

#### Validation Rules

- `targetSectionId` MUST unique và tồn tại trong danh sách section render.
- `award.slug` SHOULD dùng kebab-case để hỗ trợ deep-link (`top-talent`, `best-manager`, ...).
- `award.prizeValue` SHOULD được format qua helper thống nhất (tránh hardcode mỗi component).
- Khi thiếu `kudos.ctaRoute`, CTA MUST chuyển trạng thái disabled và có tooltip/copy fallback.

---

## API Dependencies

| Endpoint             | Method | Purpose                                                | Status                       |
| -------------------- | ------ | ------------------------------------------------------ | ---------------------------- |
| `/api/awards`        | GET    | Lấy danh sách hạng mục giải thưởng                     | Predicted (New/Existing TBD) |
| `/api/awards/:slug`  | GET    | Lấy chi tiết hạng mục cụ thể (nếu tách trang chi tiết) | Predicted                    |
| `/api/notifications` | GET    | (Gián tiếp qua layout/header) badge thông báo          | Existing in project          |

> Ghi chú: nếu dữ liệu hiện đang là static config (`src/lib/awards.ts`) thì API có thể không bắt buộc ở phiên bản đầu.

---

## State Management

### Local State

| State                | Type      | Initial         | Purpose                                          |
| -------------------- | --------- | --------------- | ------------------------------------------------ |
| `activeMenuId`       | `string`  | first item slug | Theo dõi menu item đang active                   |
| `isAutoSyncByScroll` | `boolean` | `true`          | Cho phép đồng bộ active state theo vị trí scroll |
| `isKudosCtaEnabled`  | `boolean` | `true`          | Bật/tắt CTA khi có route hợp lệ                  |

### Global/Shared State

| State          | Store/Source         | Purpose                           |
| -------------- | -------------------- | --------------------------------- |
| `locale`       | i18n storage/context | Hiển thị text theo ngôn ngữ       |
| `auth session` | Supabase SSR/client  | Quyền truy cập màn hình protected |

### Loading / Error States

- **Loading data awards**: hiển thị skeleton card hoặc placeholder nếu dữ liệu lấy qua API.
- **Menu target missing**: log warning nội bộ + giữ `activeMenuId` hiện tại, không crash UI.
- **Kudos route invalid**: disable CTA + hiển thị trạng thái không khả dụng.
- **API error (nếu dùng API)**: hiển thị thông báo ngắn + retry action.

---

## Success Criteria _(mandatory)_

### Measurable Outcomes

- **SC-001**: Người dùng có thể mở màn hình và xem đủ 6 hạng mục giải thưởng mà không lỗi render.
- **SC-002**: Click menu trái điều hướng đúng section với tỉ lệ thành công 100% trong kiểm thử E2E.
- **SC-003**: Không có horizontal overflow tại 375px, 768px, 1440px.
- **SC-004**: Không có lỗi console mức `error` khi thao tác menu và CTA.

---

## Out of Scope

- Chấm điểm/bình chọn giải thưởng.
- Trang chi tiết sâu cho từng giải nếu chưa được thiết kế riêng.
- Luồng quản trị cập nhật danh mục giải thưởng.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`)
- [ ] Database design completed (`.momorph/database.sql`)
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)

---

## Notes

- Dữ liệu lấy từ danh sách design items của frame `313:8436` đã bao gồm mô tả nghiệp vụ cho từng mục C.x / D.x.
- Có một item chưa đặc tả (`I354:4323;1161:9487`, status `none`) — tạm thời loại khỏi phạm vi implement.
- Khối Sun\* Kudos (`335:12023`) thuộc section mở rộng, nên ưu tiên P2 sau khi hoàn tất luồng điều hướng menu giải thưởng.
