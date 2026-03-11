# Feature Specification: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**File Key**: `9ypp4enmFmdK3YAFJLIu6C`
**Created**: 2026-03-11
**Status**: Reviewed

---

## Overview

Màn hình Login là điểm vào chính của ứng dụng SAA 2025 (Sun Annual Awards 2025). Người dùng chưa xác thực được điều hướng đến trang này và đăng nhập bằng tài khoản Google. Màn hình có thiết kế hero toàn màn hình với hình nền nghệ thuật, logo thương hiệu "ROOT FURTHER", mô tả ngắn, một nút đăng nhập duy nhất bằng Google, header chứa logo + chọn ngôn ngữ, và footer bản quyền.

---

## User Scenarios & Testing

### User Story 1 - Đăng nhập bằng Google (Priority: P1)

**As a** người dùng chưa đăng nhập
**I want to** nhấn nút "LOGIN With Google" để xác thực tài khoản
**So that** tôi có thể truy cập vào nội dung SAA 2025

**Why this priority**: Đây là chức năng cốt lõi duy nhất của màn hình — không có đăng nhập thì ứng dụng không thể sử dụng được.

**Independent Test**: Mở trang `/login` (hoặc trang gốc khi chưa xác thực), nhấn nút → trình duyệt mở popup/redirect Google OAuth → sau khi xác thực thành công, người dùng được điều hướng vào trang chính.

**Acceptance Scenarios**:

1. **Given** người dùng chưa đăng nhập và truy cập `/login`, **When** trang tải xong, **Then** hiển thị nút "LOGIN With Google" ở trạng thái active (không disabled).

2. **Given** người dùng nhấn nút "LOGIN With Google", **When** Google OAuth được kích hoạt, **Then** nút chuyển sang trạng thái disabled (hiển thị mờ) và không phản hồi click thêm trong khi đang xử lý.

3. **Given** người dùng hoàn tất xác thực Google thành công, **When** callback OAuth tại `/auth/callback` trả về, **Then** người dùng được redirect đến **Homepage SAA** (`/`) và không thể quay lại `/login` bằng back button khi đã có session.

4. **Given** người dùng hủy OAuth hoặc xác thực thất bại, **When** callback trả về lỗi, **Then** nút trở lại trạng thái active và hiển thị thông báo lỗi phù hợp (toast hoặc inline message).

5. **Given** người dùng đã đăng nhập và truy cập `/login`, **When** trang tải, **Then** tự động redirect sang trang chính mà không hiển thị màn hình login.

---

### User Story 2 - Chọn ngôn ngữ (Priority: P2)

**As a** người dùng muốn xem nội dung bằng ngôn ngữ khác
**I want to** nhấn vào selector ngôn ngữ trên header để chọn ngôn ngữ hiển thị
**So that** giao diện hiển thị đúng ngôn ngữ tôi mong muốn

**Why this priority**: Tính năng đa ngôn ngữ hỗ trợ trải nghiệm người dùng nhưng không chặn đăng nhập.

**Independent Test**: Nhấn vào nút "VN" ở header → dropdown mở ra với danh sách ngôn ngữ → chọn ngôn ngữ khác → UI cập nhật ngôn ngữ (nếu i18n được implement).

**Acceptance Scenarios**:

1. **Given** màn hình login hiển thị, **When** người dùng nhấn vào nút Language ("VN" + cờ + chevron), **Then** dropdown danh sách ngôn ngữ mở ra (frame 721:4942).

2. **Given** dropdown ngôn ngữ đang mở, **When** người dùng chọn một ngôn ngữ, **Then** dropdown đóng và ngôn ngữ được lưu (localStorage hoặc cookie).

3. **Given** dropdown ngôn ngữ đang mở, **When** người dùng click ra ngoài dropdown, **Then** dropdown đóng lại.

---

### Edge Cases

- Màn hình login MUST hiển thị chính xác trên viewport 375px (mobile), 768px (tablet), và 1440px (desktop).
- Nút login MUST có accessible label `aria-label="Login with Google"`.
- Khi mạng chậm hoặc mất kết nối, thông báo lỗi rõ ràng MUST được hiển thị thay vì nút bị treo vô hạn.
- Hình nền và gradient overlay MUST không che khuất nội dung văn bản quan trọng ở mọi kích thước màn hình.
- **Popup bị chặn**: Nếu trình duyệt chặn OAuth popup, hệ thống MUST chuyển sang chế độ redirect thay vì popup (`redirectTo` option của Supabase), và hiển thị thông báo hướng dẫn phù hợp.
- **Session timeout**: Nếu Supabase session hết hạn trong khi người dùng đang ở trang khác, middleware MUST redirect về `/login` và sau khi đăng nhập lại sẽ redirect về trang gốc mà người dùng muốn truy cập (lưu `returnTo` param).
- **OAuth callback lỗi**: Route `/auth/callback` MUST xử lý các lỗi OAuth (error param trong URL) và redirect về `/login?error=auth_failed`.

---

## UI/UX Requirements *(from Figma)*

### Screen Components

| Component | ID | Description | Interactions |
|-----------|----|-------------|--------------|
| Background Key Visual | 662:14388 | Hình nền nghệ thuật trang trí toàn màn | None – decorative |
| Gradient Overlay Left | 662:14392 | Gradient ngang từ #00101A sang trong suốt | None – decorative |
| Gradient Overlay Bottom | 662:14390 | Gradient dọc từ dưới lên từ #00101A | None – decorative |
| Header | 662:14391 | Thanh navigation: Logo (trái) + Language selector (phải) | Xem bên dưới |
| Logo SAA | I662:14391;186:2166 | Logo Sun Annual Awards 2025 ở góc trên trái (52×56px) | Không tương tác |
| Language Selector | I662:14391;186:1601 | Nút "VN" + cờ + chevron ở góc trên phải | Click → mở dropdown |
| ROOT FURTHER Key Visual | 662:14395 | Ảnh logo "ROOT FURTHER" (451×200px) | None – decorative |
| Hero Content Text | 662:14753 | 2 dòng text giới thiệu SAA 2025 | None – static text |
| Login Button | 662:14425 | Nút "LOGIN With Google" + Google icon (305×60px) | Click → OAuth flow |
| Footer | 662:14447 | Dòng bản quyền "Bản quyền thuộc về Sun* © 2025" | Không tương tác |

### Navigation Flow

- **From**:
  - Countdown - Prelaunch page (2268:35127) khi countdown kết thúc hoặc ứng dụng mở
  - Bất kỳ route protected nào khi chưa xác thực (redirect về `/login`)
- **To**:
  - Homepage SAA (2167:9026) sau khi đăng nhập Google thành công
  - Dropdown-ngôn ngữ (721:4942) khi nhấn Language selector
- **Triggers**: Google OAuth callback thành công; Language button click; Middleware redirect từ protected routes

### Visual Requirements

- **Design reference**: Xem `design-style.md` cho toàn bộ giá trị CSS/Tailwind chính xác
- **Responsive breakpoints**: Desktop (≥1024px), Tablet (768–1023px), Mobile (<768px)
- **Animations/Transitions**: Nút login có hover effect (elevation/shadow); Language button có hover highlight; Dropdown fade-in 150ms
- **Accessibility**: WCAG AA — tất cả interactive elements có focus ring; nút có `aria-label="Login with Google"`; ảnh trang trí có `alt=""` hoặc `aria-hidden="true"`; tab order: Language Selector → Login Button; contrast ratio tối thiểu 4.5:1 cho text

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Hệ thống MUST redirect người dùng chưa xác thực về `/login` khi truy cập các route protected.
- **FR-002**: Hệ thống MUST khởi tạo Supabase Google OAuth flow khi người dùng click nút login.
- **FR-003**: Người dùng MUST được redirect đến trang chính sau khi OAuth thành công.
- **FR-004**: Hệ thống MUST hiển thị trạng thái loading trên nút và disable click trong khi đang xử lý OAuth.
- **FR-005**: Hệ thống MUST hiển thị thông báo lỗi rõ ràng khi OAuth thất bại hoặc bị hủy.
- **FR-006**: Hệ thống MUST tự động redirect người dùng đã có session hợp lệ ra khỏi trang login.

### Technical Requirements

- **TR-001**: Authentication MUST sử dụng Supabase Auth với Google OAuth provider (PKCE flow) — không implement custom auth flow.
- **TR-002**: Session MUST được quản lý qua `@supabase/ssr` để đảm bảo tương thích với Cloudflare Workers edge runtime.
- **TR-003**: Route protection MUST được implement trong Next.js middleware (`src/middleware.ts`), không phải ở component level.
- **TR-004**: OAuth `redirectTo` MUST sử dụng giá trị từ biến môi trường `NEXT_PUBLIC_SITE_URL` + `/auth/callback` — không hardcode URL. Giá trị này phải được cấu hình trong Supabase Dashboard → Authentication → URL Configuration.
- **TR-005**: Màn hình MUST responsive và functional ở tất cả breakpoints (mobile ≥320px, tablet ≥768px, desktop ≥1024px).
- **TR-006**: Hình nền MUST sử dụng `next/image` với `fill` layout cho responsive display.
- **TR-007**: Không có thông tin nhạy cảm (token, key) được log ra console hay render ra DOM.
- **TR-008**: Ảnh trang trí (background, gradients) MUST có `alt=""` hoặc `aria-hidden="true"` để screen readers bỏ qua. Tab order: Language Selector → Login Button (decorative elements bị skip).

---

## API Dependencies

| Endpoint / Action | Method | Purpose | Status |
|-------------------|--------|---------|--------|
| `supabase.auth.signInWithOAuth({ provider: 'google' })` | SDK | Khởi tạo Google OAuth flow với PKCE. Truyền `redirectTo: ${NEXT_PUBLIC_SITE_URL}/auth/callback` | Exists (Supabase) |
| `supabase.auth.exchangeCodeForSession(code)` | SDK | **PKCE step**: Đổi authorization `code` (từ URL query param) lấy session. Gọi trong `/auth/callback` route handler. KHÔNG dùng `getSession()` ở bước này | Exists (Supabase) |
| `supabase.auth.getSession()` | SDK | Kiểm tra session hiện tại (dùng trong middleware và Server Components) | Exists (Supabase) |
| `/auth/callback` | GET | Xử lý OAuth callback từ Google. Query params: `code` (success) hoặc `error` + `error_description` (failure). Gọi `exchangeCodeForSession(code)` → redirect → `/` hoặc `returnTo`. | New — cần tạo route handler |

---

## State Management

- **Local state**: `isLoading: boolean` — disable nút, thay Google icon bằng spinner (animated SVG / CSS spinner, 24×24px, màu `#00101A`) trong khi OAuth đang xử lý; `error: string | null` — lưu thông báo lỗi từ OAuth callback (đọc từ URL query param `?error=`).
- **Global state**: Supabase session — lưu trong `@supabase/ssr` cookie (server-side accessible)
- **Language state**: `locale: string` — lưu trong localStorage/cookie, đọc khi app init
- **Cache**: Không cần cache đặc biệt cho màn hình login

---

## Success Criteria *(mandatory)*

- **SC-001**: Người dùng click nút "LOGIN With Google" và hoàn tất xác thực Google trong vòng 30 giây được redirect thành công vào trang chính.
- **SC-002**: Màn hình login render đúng design (pixel-perfect theo `design-style.md`) trên Chrome/Safari/Firefox ở 3 breakpoints.
- **SC-003**: Không có lỗi console (error level) khi load và sử dụng trang login.
- **SC-004**: Lighthouse accessibility score ≥ 90 trên màn hình login.

---

## Out of Scope

- Đăng nhập bằng email/password (chỉ hỗ trợ Google OAuth trong phiên bản này).
- Đăng ký tài khoản mới (registration flow).
- Trang quên mật khẩu / reset password.
- Logic hiển thị dropdown ngôn ngữ (frame 721:4942) — cần spec riêng.
- Dashboard/Home page sau khi đăng nhập.

---

## Dependencies

- [x] Constitution document exists (`.momorph/constitution.md`)
- [ ] API specifications available (`.momorph/API.yml`) — *not required for this screen*
- [ ] Database design completed (`.momorph/database.sql`) — *not required for Login (no DB writes)*
- [x] Screen flow documented (`.momorph/SCREENFLOW.md`) — *completed*

---

## Notes

- Google OAuth provider đã được enable trong Supabase (theo commit lịch sử: `feat(auth): enable Google OAuth provider`).
- Màn hình thiết kế cho viewport 1440×1024px; cần implement responsive xuống mobile.
- Font chính: **Montserrat** (Bold) — cần load qua `next/font/google`.
- Font phụ: **Montserrat Alternates** (Bold) — dùng cho footer text.
- Màu nền chủ đạo: `#00101A` (dark navy).
- Nút login màu vàng: `#FFEA9E` với text đen `#00101A` — đảm bảo contrast đạt WCAG AA.
