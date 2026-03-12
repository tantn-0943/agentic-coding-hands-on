# Feature Specification: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-12
**Status**: Draft

---

## Overview

Trang chủ của hệ thống Sun* Annual Awards 2025 (SAA). Đây là điểm vào chính cho mọi người dùng, giới thiệu chủ đề sự kiện "ROOT FURTHER", hiển thị đồng hồ đếm ngược đến ngày tổ chức, giới thiệu các hạng mục giải thưởng, và quảng bá phong trào Sun* Kudos.

Người dùng mục tiêu: Sunner (nhân viên Sun*) — đã đăng nhập, muốn xem thông tin sự kiện và điều hướng đến nội dung chi tiết.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Xem trang chủ và điều hướng đến thông tin giải thưởng (Priority: P1)

Người dùng truy cập trang chủ SAA 2025, đọc thông tin sự kiện và nhấn vào nút CTA hoặc thẻ giải thưởng để xem chi tiết hạng mục.

**Why this priority**: Đây là luồng chính của sản phẩm — mọi người dùng đều bắt đầu từ đây. Thiếu trang chủ thì không có MVP.

**Independent Test**: `yarn dev` → navigate `/` → kiểm tra logo hiển thị, image "ROOT FURTHER" (`root-further-logo.png`) visible trong hero section, 3 unit DAYS/HOURS/MINUTES của countdown hiển thị, ít nhất 1 thẻ giải thưởng hiển thị, nút "ABOUT AWARDS" visible và click được.

**Acceptance Scenarios**:

1. **Given** người dùng đã đăng nhập, **When** truy cập `/`, **Then** thấy header với logo + 3 nav links + notification/language/avatar; thấy hero section với image "ROOT FURTHER" (`/images/root-further-logo.png`); countdown hiển thị đúng số DAYS/HOURS/MINUTES; thấy event info (thời gian + địa điểm); thấy 2 nút CTA "ABOUT AWARDS" và "ABOUT KUDOS".
2. **Given** trang chủ đang load, **When** click "ABOUT AWARDS", **Then** navigate đến trang Awards Information.
3. **Given** trang chủ đang load, **When** click "ABOUT KUDOS", **Then** navigate đến trang Sun* Kudos.
4. **Given** trang chủ đang load, **When** scroll xuống section giải thưởng, **Then** thấy 6 thẻ giải: Top Talent, Top Project, Top Project Leader, Best Manager, Signature 2025 - Creator, MVP.
5. **Given** trang chủ đang load, **When** click thẻ giải thưởng (ảnh / tiêu đề / "Chi tiết"), **Then** navigate đến trang Awards Information với anchor là slug của hạng mục (`/award-information#top-talent`).

---

### User Story 2 — Countdown real-time cập nhật trên trang chủ (Priority: P2)

Đồng hồ đếm ngược trong hero section cập nhật liên tục, hiển thị thời gian còn lại đến sự kiện.

**Why this priority**: Tạo cảm giác urgency và engagement; quan trọng thứ hai sau luồng điều hướng cơ bản.

**Independent Test**: Truy cập `/`, đợi 65 giây → số MINUTES giảm 1 mà không reload trang. Khi event date đã qua: "Coming soon" text bị ẩn, các ô số dừng ở 00.

**Acceptance Scenarios**:

1. **Given** event date trong tương lai, **When** trang load xong, **Then** countdown hiển thị đúng giá trị DAYS/HOURS/MINUTES còn lại.
2. **Given** countdown đang chạy, **When** sau 60 giây, **Then** MINUTES giảm 1 unit mà không reload.
3. **Given** event date đã qua, **When** trang load, **Then** label "Coming soon" bị ẩn và countdown hiển thị "00 00 00".
4. **Given** trang chủ đang mở, **When** switch tab và quay lại sau 2 phút, **Then** countdown hiển thị giá trị đúng (không stale).

---

### User Story 3 — Xem và điều hướng từ Sun* Kudos section (Priority: P3)

Người dùng đọc thông tin về phong trào Sun* Kudos và nhấn "Chi tiết" để xem thêm.

**Why this priority**: Tính năng phụ, giới thiệu Sun* Kudos — quan trọng nhưng không blocking MVP.

**Independent Test**: Scroll đến section Sun* Kudos → thấy title "Sun* Kudos", mô tả, nút "Chi tiết" → click nút navigate sang trang Sun* Kudos.

**Acceptance Scenarios**:

1. **Given** trang chủ đang load, **When** scroll đến section Sun* Kudos, **Then** thấy label "Phong trào ghi nhận", title "Sun* Kudos", mô tả ngắn, và nút "Chi tiết".
2. **Given** section Sun* Kudos visible, **When** click "Chi tiết", **Then** navigate đến trang Sun* Kudos.

---

### User Story 4 — Điều hướng qua Header và Footer (Priority: P2)

Người dùng sử dụng header để điều hướng giữa các section/trang, đổi ngôn ngữ, xem thông báo, và quản lý tài khoản.

**Why this priority**: Header là component dùng chung trên toàn trang; navigation là core workflow.

**Independent Test**: Kiểm tra header visible ở top, mỗi nav link click đúng trang, language switcher mở dropdown VN/EN, notification icon toggle panel, avatar icon mở dropdown profile.

**Acceptance Scenarios**:

1. **Given** header visible, **When** click logo, **Then** scroll về đầu trang chủ.
2. **Given** header visible, **When** hover nav link, **Then** link highlight (bg sáng).
3. **Given** đang ở trang chủ, **When** xem header, **Then** "About SAA 2025" hiển thị trạng thái selected (màu vàng #FFEA9E).
4. **Given** header visible, **When** click "Awards Information", **Then** navigate tới trang Awards Information.
5. **Given** header visible, **When** click "Sun* Kudos", **Then** navigate tới trang Sun* Kudos.
6. **Given** header visible, **When** click language button (VN), **Then** mở dropdown với option VN/EN.
7. **Given** header visible, **When** click notification bell, **Then** mở notification panel; badge đỏ hiển thị khi có thông báo chưa đọc.
8. **Given** header visible, **When** click avatar icon, **Then** mở dropdown profile với options: Profile / Sign out / Admin Dashboard (cho admin).

---

### User Story 5 — Widget Button nổi (Priority: P3)

Nút hành động nhanh cố định ở góc dưới màn hình.

**Why this priority**: Shortcut tiện ích, nhưng không blocking.

**Independent Test**: Scroll trang → widget button luôn visible ở mép phải dưới; click → mở menu options.

**Acceptance Scenarios**:

1. **Given** bất kỳ vị trí scroll nào, **When** nhìn vào góc dưới phải, **Then** widget button (pill vàng 106×64px) luôn visible.
2. **Given** widget button visible, **When** click, **Then** mở menu các hành động nhanh.

---

### Edge Cases

- Khi `NEXT_PUBLIC_EVENT_START_DATE` không set: countdown hiển thị "00 00 00", "Coming soon" ẩn hoặc giữ nguyên tùy impl.
- Khi event date đã qua: "Coming soon" ẩn, countdown frozen ở "00".
- Khi số ngày còn lại > 99: `useCountdown` cap tại `99` (`Math.min(99, days)`), hiển thị `99` thay vì giá trị thực.
- Trước khi hydration (`isMounted = false`): countdown hiển thị `00 00 00` (SSR-safe, tránh hydration mismatch).
- Award card description dài hơn 2 dòng: hiển thị ellipsis (`…`) via `line-clamp-2`.
- Người dùng chưa đăng nhập cố truy cập `/`: middleware redirect về `/login?returnTo=/`.
- Khi không có thông báo: notification badge ẩn.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | Node ID | Description | Interactions |
|-----------|---------|-------------|--------------|
| Header | `2167:9091` | Sticky nav: logo + links + controls | Click logo, links, lang, bell, avatar |
| Hero / Keyvisual | `2167:9027` | Full-screen hero với artwork + gradient overlay | Static background |
| Countdown section | `2167:9035` | "Coming soon" + 3 digit-units countdown | Auto-update real-time |
| Event info block | `2167:9053` | Thời gian + Địa điểm + Livestream note | Static display |
| CTA buttons | `2167:9062` | "ABOUT AWARDS" (primary) + "ABOUT KUDOS" (secondary) | Click navigate |
| Root Further content | `5001:14827` | Long-form description text | Static display |
| Awards section header | `2167:9069` | Caption + Heading "Hệ thống giải thưởng" | Static |
| Award card list | `5005:14974` | 6 award cards in 3-col grid | Click navigate to Awards |
| Award card | `2167:9075`–`9081` | Image + title + description + "Chi tiết" link | Click → Awards page + anchor |
| Sun* Kudos section | `3390:10349` | Kudos promo block with CTA | Click "Chi tiết" → Kudos page |
| Widget button | `5022:15169` | Fixed floating pill button | Click → quick-action menu |
| Footer | `5001:14800` | Logo + nav links + copyright | Click links navigate |

### Navigation Flow

- From: `/login` (sau khi xác thực)
- To: `/award-information`, `/sun-kudos`, `/award-information#[slug]`
- Triggers:
  - Click "ABOUT AWARDS" → `/award-information`
  - Click "ABOUT KUDOS" → `/sun-kudos`
  - Click Award card (image/title/"Chi tiết") → `/award-information#[award-slug]`
  - Click "Chi tiết" trong Kudos section → `/sun-kudos`
  - Click nav links → respective pages
  - Click logo → scroll-to-top of `/`

### Visual Requirements

- Dark theme throughout: nền `#00101A`, text trắng và vàng `#FFEA9E`
- Responsive breakpoints: mobile (375px), tablet (768px), desktop (1440px+)
- Award cards grid: desktop 3 cols → tablet 2 cols → mobile 1 col
- Transitions: button hover 150ms ease; card hover transform + glow 200ms ease
- Accessibility: WCAG 2.1 AA; `aria-live="polite"` + `aria-atomic="true"` trên countdown timer; alt text cho tất cả ảnh (logo, ROOT FURTHER, award cards); keyboard navigation hoạt động cho tất cả interactive elements (nav links, CTA buttons, award cards, footer links); focus visible outline `2px solid #FFEA9E` trên dark backgrounds

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST hiển thị countdown đếm ngược đến `NEXT_PUBLIC_EVENT_START_DATE` với 3 units: DAYS, HOURS, MINUTES.
- **FR-002**: System MUST ẩn label "Coming soon" khi event date đã qua (countdown expired).
- **FR-003**: System MUST hiển thị 6 hạng mục giải thưởng dưới dạng card grid 3 cột (desktop).
- **FR-004**: Users MUST có thể click award card để navigate đến trang Awards với anchor đúng hạng mục.
- **FR-005**: System MUST render trang chủ như Server Component (SSR) để SEO và performance.
- **FR-006**: Users MUST có thể navigate qua header đến mọi section của app.
- **FR-007**: Widget button MUST được fixed position, luôn visible khi scroll.
- **FR-008**: Header MUST hiển thị active state cho trang hiện tại.

### Technical Requirements

- **TR-001**: Countdown MUST dùng `useCountdown` hook đã implement (tái dùng từ `/countdown` page).
- **TR-002**: Page MUST là Server Component (`src/app/page.tsx`), chỉ CountdownSection là Client Component. Page MUST export `metadata` (title, description) cho SEO.
- **TR-003**: `next/image` MUST được dùng cho tất cả ảnh (hero background, award cards, logos, ROOT FURTHER logo).
- **TR-004**: Award data MUST được định nghĩa trong static config file (e.g., `src/lib/awards.ts`) — không inline hardcode trong component. *(Pending confirmation: nếu có API thì dùng API.)*
- **TR-005**: Header MUST dùng `usePathname()` để detect active nav item.
- **TR-006**: Page MUST pass build với Cloudflare edge runtime (no Node.js built-ins).
- **TR-007**: Hero background MUST shared với `/countdown` page (`public/images/login-bg.jpg`).
- **TR-008**: "ROOT FURTHER" logo MUST dùng `next/image` từ `public/images/root-further-logo.png` (shared với Login page) — không render như DOM text.

### Key Entities *(if feature involves data)*

- **Award**: `{ id, slug, name, description, imageUrl, linkSlug }` — 6 hạng mục tĩnh hoặc từ API
- **EventInfo**: `{ date: string, venue: string, livestreamNote: string }` — từ env vars hoặc config
- **CountdownState**: `{ days, hours, minutes, isExpired, isMounted }` — từ `useCountdown` hook

### State Management

| State | Location | Notes |
|-------|----------|-------|
| `CountdownState` | Client Component (`CountdownSection`) | days/hours/minutes/isExpired/isMounted — managed by `useCountdown` hook |
| `isExpired` | CountdownSection | Controls visibility of "Coming soon" label |
| `isMounted` | CountdownSection | Prevents SSR/client hydration mismatch — digits show `0` until mounted |
| Notification badge count | Header (Client Component) | Fetched from `/api/notifications`, controls badge visibility |
| Active nav item | Header (Client Component) | Derived from `usePathname()` — no external state needed |
| Widget menu open/close | Widget Component | Local boolean state — no global state needed |

**Loading states:**
- Award cards: rendered via SSR — no loading state needed if static config
- Notification badge: shows nothing (hidden) until API responds — no skeleton needed
- Countdown: shows `00 00 00` before hydration (intentional, not a loading state)

**Error states:**
- If `NEXT_PUBLIC_EVENT_START_DATE` is invalid: countdown shows `00 00 00`, no error message shown
- If notifications API fails: badge stays hidden — no error toast needed on homepage

---

## API Dependencies

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| N/A (awards static) | — | Award data hardcoded hoặc từ env | Predicted: static |
| `/api/notifications` | GET | Lấy notifications cho user | Predicted: New |

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Trang chủ load trong < 2s (LCP) trên kết nối 4G thông thường.
- **SC-002**: 6 award cards hiển thị đầy đủ, click đúng anchor tương ứng.
- **SC-003**: Countdown tick interval 1s — số MINUTES giảm chính xác mỗi 60 giây, không gây layout shift (CLS = 0).
- **SC-004**: Header active state đúng trên mọi trang.
- **SC-005**: Không có console errors khi load trang chủ.
- **SC-006**: Responsive không có horizontal overflow tại 375px, 768px, 1440px.

---

## Out of Scope

- Logic nội bộ của trang Awards Information và Sun* Kudos.
- Dropdown profile menu (spec riêng).
- Notification panel nội dung (spec riêng).
- Language switching logic (i18n).
- Admin dashboard.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [x] `useCountdown` hook đã implemented (`src/hooks/useCountdown.ts`)
- [x] Background image `public/images/login-bg.jpg` đã download
- [x] ROOT FURTHER logo `public/images/root-further-logo.png` đã download (shared với Login page)
- [x] Montserrat font đã configured trong `layout.tsx`
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`)
- [ ] Award data source xác nhận (static JSON vs API)
- [ ] API spec cho notifications

---

## Notes

- Countdown trên Homepage dùng cùng `useCountdown` hook như trang `/countdown` — không duplicate logic.
- Hero artwork background (`login-bg.jpg`) shared giữa Homepage, Countdown page, và Login page.
- Award slugs sẽ match với anchor IDs trên trang Awards Information (cần coordinate với Awards spec).
- "Coming soon" label trên Homepage countdown là text riêng biệt với `/countdown` page heading.
- Widget button là component global floating — có thể là một phần của `layout.tsx` hoặc riêng.
