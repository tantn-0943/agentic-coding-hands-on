# Design Style: Hệ thống giải

**Frame ID**: `313:8436`
**Frame Name**: `Hệ thống giải`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/313:8436
**Extracted At**: 2026-03-12

---

## Design Tokens

> Lưu ý: API hiện tại không trả về đầy đủ style primitives (fills/font/effects) cho frame này. Các token dưới đây được tổng hợp từ mô tả item và style nhất quán đã dùng ở các màn SAA khác trong cùng file.

### Colors

| Token Name               | Hex Value              | Opacity | Usage                       |
| ------------------------ | ---------------------- | ------- | --------------------------- |
| `--color-bg-page`        | #00101A                | 100%    | Nền dark theme SAA          |
| `--color-text-primary`   | #FFFFFF                | 100%    | Nội dung chính trên nền tối |
| `--color-text-heading`   | #FFEA9E                | 100%    | Heading/active highlight    |
| `--color-text-secondary` | #B9C2CC                | 100%    | Caption/mô tả phụ           |
| `--color-border-subtle`  | #2E3940                | 100%    | Viền nhẹ cho card/section   |
| `--color-surface-card`   | rgba(255,255,255,0.04) | 100%    | Background card giải        |
| `--color-accent-active`  | #FFEA9E                | 100%    | Màu active menu trái        |

### Typography

| Token Name               | Font Family | Size | Weight | Line Height | Letter Spacing |
| ------------------------ | ----------- | ---- | ------ | ----------- | -------------- |
| `--text-section-caption` | Montserrat  | 16px | 600    | 24px        | 0.15px         |
| `--text-section-title`   | Montserrat  | 40px | 700    | 56px        | 0px            |
| `--text-menu-item`       | Montserrat  | 20px | 700    | 32px        | 0.2px          |
| `--text-card-title`      | Montserrat  | 28px | 700    | 40px        | 0px            |
| `--text-card-body`       | Montserrat  | 16px | 500    | 28px        | 0.1px          |
| `--text-meta-label`      | Montserrat  | 16px | 600    | 24px        | 0.1px          |
| `--text-meta-value`      | Montserrat  | 24px | 700    | 32px        | 0px            |

### Text Element Mapping

| UI Text Element                               | Token                    | Color                                            | Notes             |
| --------------------------------------------- | ------------------------ | ------------------------------------------------ | ----------------- |
| Section caption `Sun* annual awards 2025`     | `--text-section-caption` | `--color-text-secondary`                         | Header phụ        |
| Section title `Hệ thống giải thưởng SAA 2025` | `--text-section-title`   | `--color-text-heading`                           | Heading chính     |
| Menu items (C.1 → C.6)                        | `--text-menu-item`       | `--color-text-primary` / `--color-accent-active` | Default/Active    |
| Award card title                              | `--text-card-title`      | `--color-text-primary`                           | Tên hạng mục      |
| Award card description                        | `--text-card-body`       | `--color-text-primary`                           | Nội dung mô tả    |
| Metadata label (`Số lượng`, `Giá trị`)        | `--text-meta-label`      | `--color-text-secondary`                         | Nhãn phụ          |
| Metadata value (`7.000.000 VNĐ`, ...)         | `--text-meta-value`      | `--color-text-heading`                           | Giá trị nhấn mạnh |
| CTA `Chi tiết` (Sun\* Kudos)                  | `--text-meta-label`      | `--color-text-heading`                           | Text-link style   |

### Spacing

| Token Name                | Value | Usage                                |
| ------------------------- | ----- | ------------------------------------ |
| `--spacing-section-x`     | 90px  | Horizontal padding section (desktop) |
| `--spacing-section-y`     | 96px  | Vertical padding section             |
| `--spacing-grid-gap`      | 40px  | Gap giữa menu và content             |
| `--spacing-card-gap`      | 32px  | Gap giữa các card giải               |
| `--spacing-card-padding`  | 24px  | Padding card                         |
| `--spacing-menu-item-gap` | 20px  | Khoảng cách menu item                |

### Border & Radius

| Token Name      | Value             | Usage            |
| --------------- | ----------------- | ---------------- |
| `--radius-card` | 16px              | Card giải thưởng |
| `--radius-pill` | 9999px            | Badge/indicator  |
| `--border-card` | 1px solid #2E3940 | Viền card        |

### Shadows

| Token Name       | Value                          | Usage                     |
| ---------------- | ------------------------------ | ------------------------- |
| `--shadow-card`  | `0 6px 20px rgba(0,0,0,0.22)`  | Nổi nhẹ card              |
| `--shadow-hover` | `0 10px 28px rgba(0,0,0,0.30)` | Hover card/menu tương tác |

---

## Layout Specifications

### Container

| Property          | Value     | Notes                     |
| ----------------- | --------- | ------------------------- |
| section width     | 100%      | Full width                |
| content max-width | ~1260px   | Căn giữa desktop          |
| section padding   | 96px 90px | Theo hệ thống spacing SAA |
| main layout       | 2-column  | Menu trái + content phải  |

### Layout Structure (ASCII)

```
┌───────────────────────────────────────────────────────────────────────────────┐
│ PAGE / AWARDS INFORMATION                                                     │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ KEYVISUAL (Node 313:8437)                                               │  │
│  │ - Artwork campaign + ROOT FURTHER + subtitle                             │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ SECTION HEADER (Node 313:8453)                                          │  │
│  │ - Caption: Sun* annual awards 2025                                      │  │
│  │ - Title: Hệ thống giải thưởng SAA 2025                                  │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ AWARDS BODY (Node 313:8458)                                              │  │
│  │  ┌──────────────────────┐   ┌────────────────────────────────────────┐ │  │
│  │  │ MENU LIST (313:8459) │   │ AWARD CARDS LIST                        │ │  │
│  │  │ C.1 Top Talent       │   │ D.1 Top Talent (313:8467)               │ │  │
│  │  │ C.2 Top Project      │   │ D.2 Top Project (313:8468)              │ │  │
│  │  │ C.3 Top Proj Leader  │   │ D.3 Top Project Leader (313:8469)       │ │  │
│  │  │ C.4 Best Manager     │   │ D.4 Best Manager (313:8470)             │ │  │
│  │  │ C.5 Signature 2025   │   │ D.5 Signature 2025 - Creator (313:8471) │ │  │
│  │  │ C.6 MVP              │   │ D.6 MVP (313:8510)                       │ │  │
│  │  └──────────────────────┘   └────────────────────────────────────────┘ │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐  │
│  │ SUN* KUDOS BLOCK (Node 335:12023)                                       │  │
│  │ - Label + title + description + CTA "Chi tiết"                          │  │
│  └─────────────────────────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Keyvisual

| Property    | Value                   | CSS/Tailwind                                 |
| ----------- | ----------------------- | -------------------------------------------- |
| **Node ID** | `313:8437`              | -                                            |
| image size  | 1200×871px              | `w-full h-auto object-cover`                 |
| role        | Decorative hero banner  | `aria-hidden="true"` nếu ảnh thuần trang trí |
| text layer  | ROOT FURTHER + subtitle | Overlay text                                 |

---

### Awards Section Title

| Property      | Value                      | CSS/Tailwind                                    |
| ------------- | -------------------------- | ----------------------------------------------- |
| **Node ID**   | `313:8453`                 | -                                               |
| caption style | small, light               | `text-sm md:text-base text-slate-300`           |
| title style   | large, yellow              | `text-3xl md:text-5xl font-bold text-[#FFEA9E]` |
| spacing       | caption cách title ~8–12px | `space-y-2`                                     |

---

### Menu List (Left Navigation)

| Property     | Value                          | CSS/Tailwind                                  |
| ------------ | ------------------------------ | --------------------------------------------- |
| **Node ID**  | `313:8459`                     | -                                             |
| item count   | 6 items                        | mapped từ C.1 → C.6                           |
| item style   | text + icon + active indicator | `flex items-center gap-3`                     |
| active state | màu vàng + underline           | `text-[#FFEA9E] underline underline-offset-4` |
| hover state  | highlight nhẹ                  | `hover:text-[#FFEA9E]/90`                     |

**States:**

| State   | Changes                              |
| ------- | ------------------------------------ |
| Default | Text trắng/secondary                 |
| Hover   | Text sáng hơn, underline nhẹ         |
| Active  | Text vàng + underline rõ + indicator |
| Focus   | `outline: 2px solid #FFEA9E`         |

---

### Award Card (Pattern D.1 → D.6)

| Property     | Value                                                                  | CSS/Tailwind                                              |
| ------------ | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| **Node IDs** | `313:8467`, `313:8468`, `313:8469`, `313:8470`, `313:8471`, `313:8510` | -                                                         |
| container    | Card info block                                                        | `rounded-2xl border border-[#2E3940] bg-white/[0.04] p-6` |
| image area   | award visual, vuông                                                    | `w-[336px] h-[336px] object-cover` _(theo D.1.1)_         |
| title        | tên giải                                                               | `text-2xl md:text-3xl font-bold text-white`               |
| description  | mô tả giải                                                             | `text-base leading-7 text-slate-200`                      |
| metadata     | số lượng + giá trị                                                     | `grid gap-3`                                              |

**States:**

| State        | Changes                                 |
| ------------ | --------------------------------------- |
| Default      | Shadow nhẹ                              |
| Hover        | Elevation tăng nhẹ (`--shadow-hover`)   |
| Focus-within | Viền/outline vàng cho khả năng truy cập |

---

### Sun\* Kudos Block

| Property    | Value                             | CSS/Tailwind                             |
| ----------- | --------------------------------- | ---------------------------------------- |
| **Node ID** | `335:12023`                       | -                                        |
| content     | label + title + description + CTA | `flex flex-col gap-4`                    |
| CTA node    | `I335:12023;313:8426`             | text-link button                         |
| CTA hover   | nhẹ + icon translate              | `hover:opacity-90 hover:translate-x-0.5` |

---

### CTA Button `Chi tiết` (Sun\* Kudos)

| Property         | Value                    | CSS/Tailwind                        |
| ---------------- | ------------------------ | ----------------------------------- |
| **Node ID**      | `I335:12023;313:8426`    | -                                   |
| type             | text-link button         | `inline-flex items-center gap-2`    |
| min touch target | 44x44px                  | `min-h-11 min-w-11`                 |
| typography       | Montserrat 16px/24px 600 | `text-base leading-6 font-semibold` |
| color            | `#FFEA9E`                | `text-[#FFEA9E]`                    |
| icon             | trailing arrow/icon      | `size-4`~`size-5`                   |

**States:**

| State    | Changes                                                         |
| -------- | --------------------------------------------------------------- |
| Default  | Text-link vàng trên nền tối                                     |
| Hover    | Opacity giảm nhẹ + icon dịch phải 2px                           |
| Active   | Giảm opacity thêm một mức nhỏ                                   |
| Focus    | `outline: 2px solid #FFEA9E`, `outline-offset: 2px`             |
| Disabled | `opacity: .45`, `cursor: not-allowed`, không trigger navigation |

---

## Component Hierarchy with Styles

```
AwardsSystemScreen
├── KeyvisualBanner (313:8437)
├── AwardsSectionHeader (313:8453)
├── AwardsSystemContainer (313:8458)
│   ├── AwardsMenuList (313:8459)
│   │   ├── MenuItemTopTalent (313:8460)
│   │   ├── MenuItemTopProject (313:8461)
│   │   ├── MenuItemTopProjectLeader (313:8462)
│   │   ├── MenuItemBestManager (313:8463)
│   │   ├── MenuItemSignature2025 (313:8464)
│   │   └── MenuItemMVP (313:8465)
│   └── AwardsCardsColumn
│       ├── AwardCardTopTalent (313:8467)
│       ├── AwardCardTopProject (313:8468)
│       ├── AwardCardTopProjectLeader (313:8469)
│       ├── AwardCardBestManager (313:8470)
│       ├── AwardCardSignature2025 (313:8471)
│       └── AwardCardMVP (313:8510)
└── SunKudosPromo (335:12023)
    └── SunKudosCTAButton (I335:12023;313:8426)
```

---

## Responsive Specifications

### Breakpoints

| Name    | Min Width | Max Width |
| ------- | --------- | --------- |
| Mobile  | 0         | 767px     |
| Tablet  | 768px     | 1023px    |
| Desktop | 1024px    | ∞         |

### Responsive Changes

#### Mobile (< 768px)

| Component        | Changes                                            |
| ---------------- | -------------------------------------------------- |
| Main layout      | Chuyển từ 2 cột sang 1 cột (`menu` ở trên `cards`) |
| Menu list        | Có thể render dạng horizontal scroll/chips         |
| Award card image | Scale xuống `w-full`, max-width ~240px             |
| Card typography  | Title giảm còn 22–24px, body 14–15px               |

#### Tablet (768px - 1023px)

| Component    | Changes                              |
| ------------ | ------------------------------------ |
| Main layout  | Giữ 2 cột nhưng giảm khoảng cách cột |
| Menu column  | Width cố định nhỏ hơn desktop        |
| Card spacing | Gap cards giảm 20–24px               |

#### Desktop (≥ 1024px)

| Component    | Changes                           |
| ------------ | --------------------------------- |
| Main layout  | 2 cột đầy đủ như thiết kế         |
| Card content | Hiển thị đầy đủ mô tả và metadata |

---

## Icon Specifications

| Icon Name         | Size    | Color            | Usage                      |
| ----------------- | ------- | ---------------- | -------------------------- |
| Menu leading icon | 20–24px | Theo theme sáng  | Đầu mỗi menu item          |
| CTA arrow/icon    | 16–20px | Đồng bộ text CTA | Nút `Chi tiết` Sun\* Kudos |

---

## Animation & Transitions

| Element           | Property               | Duration      | Easing          | Trigger      |
| ----------------- | ---------------------- | ------------- | --------------- | ------------ |
| Menu item         | color, underline       | 120–150ms     | ease-in-out     | Hover/Active |
| Scroll navigation | transform/scroll       | native smooth | browser default | Click menu   |
| Award card        | box-shadow, translateY | 180–220ms     | ease-out        | Hover        |
| CTA `Chi tiết`    | opacity, transform     | 150ms         | ease            | Hover        |

---

## Implementation Mapping

| Design Element   | Figma Node ID           | Tailwind / CSS Class                   | React Component          |
| ---------------- | ----------------------- | -------------------------------------- | ------------------------ |
| Keyvisual        | `313:8437`              | `relative w-full overflow-hidden`      | `<HeroSection />`        |
| Section Title    | `313:8453`              | `space-y-2`                            | `<AwardsSectionTitle />` |
| Awards Container | `313:8458`              | `grid lg:grid-cols-[280px_1fr] gap-10` | `<AwardsSection />`      |
| Menu List        | `313:8459`              | `sticky top-24 space-y-5`              | `<AwardsMenu />`         |
| Menu Item        | `313:8460`...`313:8465` | `group cursor-pointer`                 | `<AwardsMenuItem />`     |
| Award Card       | `313:8467`...`313:8510` | `rounded-2xl border p-6`               | `<AwardCard />`          |
| Kudos Block      | `335:12023`             | `rounded-2xl p-8`                      | `<KudosSection />`       |
| CTA Chi tiết     | `I335:12023;313:8426`   | `inline-flex items-center gap-2`       | `<KudosDetailButton />`  |

---

## Notes

- Frame này đã có đặc tả hành vi rõ ở design items; style pixel-level (fills/font/effects) cần xác thực thêm bằng API style chi tiết nếu tool hỗ trợ trong phiên tiếp theo.
- Item `I354:4323;1161:9487` có `status: none`, chưa dùng trong mapping.
- Ưu tiên tái sử dụng token màu/typography từ các màn SAA đã có (`Login`, `Homepage`) để đảm bảo đồng bộ hệ thống thiết kế.
