# Design Style: Login

**Frame ID**: `662:14387`
**Frame Name**: `Login`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/662:14387
**Extracted At**: 2026-03-11

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background, gradient base |
| `--color-header-bg` | #0B0F12 | 80% | Header background (rgba(11,15,18,0.8)) |
| `--color-btn-login` | #FFEA9E | 100% | Login button background |
| `--color-btn-login-text` | #00101A | 100% | Login button text |
| `--color-text-white` | #FFFFFF | 100% | All white text (hero content, header, footer) |
| `--color-divider` | #2E3940 | 100% | Footer top border |
| `--color-gradient-dark` | #001320 | 100% | Bottom gradient endpoint (rgba(0,19,32)) |

### Gradients

| Name | Value | Usage |
|------|-------|-------|
| `--gradient-hero-left` | `linear-gradient(90deg, #00101A 0%, #00101A 25.41%, rgba(0,16,26,0) 100%)` | Left overlay trên hero image |
| `--gradient-hero-bottom` | `linear-gradient(0deg, #00101A 22.48%, rgba(0,19,32,0) 51.74%)` | Bottom overlay trên hero image |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-hero-description` | Montserrat | 20px | 700 | 40px | 0.5px |
| `--text-btn-login` | Montserrat | 22px | 700 | 28px | 0px |
| `--text-language` | Montserrat | 16px | 700 | 24px | 0.15px |
| `--text-footer` | Montserrat Alternates | 16px | 700 | 24px | 0% |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-page-x` | 144px | Horizontal padding cho header và hero (desktop) |
| `--spacing-page-y` | 96px | Vertical padding hero section (desktop) |
| `--spacing-header-y` | 12px | Vertical padding header |
| `--spacing-footer-x` | 90px | Horizontal padding footer |
| `--spacing-footer-y` | 40px | Vertical padding footer |
| `--spacing-hero-gap` | 80px | Gap giữa key visual và content block trong hero (Frame 487 gap, xác nhận bằng pixel: endY:488 → startY:568) |
| `--spacing-content-gap` | 24px | Gap giữa text và login button |
| `--spacing-btn-px` | 24px | Horizontal padding login button |
| `--spacing-btn-py` | 16px | Vertical padding login button |
| `--spacing-lang-px` | 16px | Padding language button |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-btn-login` | 8px | Login button border-radius |
| `--radius-lang-btn` | 4px | Language selector border-radius |
| `--border-footer` | 1px solid #2E3940 | Footer top border |

### Shadows

| Token Name | Value | Usage |
|------------|-------|-------|
| `--shadow-btn-hover` | `0 4px 16px rgba(255,234,158,0.3)` | Login button hover elevation (inferred) |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| Page width | 1440px | Full viewport width (desktop) |
| Page height | 1024px | Full viewport height (desktop) |
| Header padding-x | 144px | Left and right |
| Hero padding-x | 144px | Left and right |
| Hero padding-y | 96px | Top and bottom |
| Footer padding-x | 90px | Left and right |
| Footer padding-y | 40px | Top and bottom |

### Layout Structure (ASCII)

```
┌────────────────────────────────────────────────────────────────────┐
│  PAGE (1440×1024px, bg: #00101A)                                   │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  BACKGROUND KEY VISUAL (1441×1022px, z-index:1)            │    │
│  │  [artwork image — covers full page, top: 2px]              │    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  GRADIENT OVERLAY LEFT (gradient: →  #00101A → transparent)│    │
│  └────────────────────────────────────────────────────────────┘    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  GRADIENT OVERLAY BOTTOM (gradient: ↑ #00101A → transparent│    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  HEADER (1440×80px, bg: rgba(11,15,18,0.8), px:144, py:12) │    │
│  │  ┌────────────┐                        ┌────────────────┐  │    │
│  │  │ LOGO       │                        │ LANGUAGE (VN)  │  │    │
│  │  │ 52×56px    │                        │ 108×56px       │  │    │
│  │  │ left: 144  │                        │ right: 144     │  │    │
│  │  └────────────┘                        └────────────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  HERO SECTION (1440×845px, px:144, py:96, flex-col gap:80) │    │
│  │                                                            │    │
│  │  ┌─────────────────────────────────────────────────────┐  │    │
│  │  │  B.1 KEY VISUAL                                      │  │    │
│  │  │  "ROOT FURTHER" logo image (451×200px)               │  │    │
│  │  └─────────────────────────────────────────────────────┘  │    │
│  │                                                            │    │
│  │  ┌─────────────────────────────────────────────────────┐  │    │
│  │  │  CONTENT BLOCK (pl:16, flex-col gap:24)              │  │    │
│  │  │  ┌──────────────────────────────────────────────┐   │  │    │
│  │  │  │  B.2 HERO TEXT (480×80px)                    │   │  │    │
│  │  │  │  "Bắt đầu hành trình của bạn cùng SAA 2025." │   │  │    │
│  │  │  │  "Đăng nhập để khám phá!"                    │   │  │    │
│  │  │  │  Montserrat 700 20px/40px #FFFFFF             │   │  │    │
│  │  │  └──────────────────────────────────────────────┘   │  │    │
│  │  │  ┌──────────────────────────────────────────────┐   │  │    │
│  │  │  │  B.3 LOGIN BUTTON (305×60px)                 │   │  │    │
│  │  │  │  [LOGIN With Google (225px)] [Google icon 24×24]│  │  │    │
│  │  │  │  bg:#FFEA9E, radius:8px, px:24, py:16        │   │  │    │
│  │  │  └──────────────────────────────────────────────┘   │  │    │
│  │  └─────────────────────────────────────────────────────┘  │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │  FOOTER (1440×91px, px:90, py:40, border-top: #2E3940)     │    │
│  │  "Bản quyền thuộc về Sun* © 2025" — centered               │    │
│  │  Montserrat Alternates 700 16px/24px #FFFFFF               │    │
│  └────────────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header (A_Header)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `662:14391` | - |
| width | 1440px (full) | `w-full` |
| height | 80px | `h-20` |
| padding | 12px 144px | `py-3 px-36` |
| background | rgba(11,15,18,0.8) | `bg-[#0B0F12]/80` |
| display | flex row | `flex flex-row` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| position | absolute, top:0 | `absolute top-0` |
| z-index | 1 | `z-10` |

---

### Logo (A.1_Logo)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `I662:14391;186:2166` | - |
| width | 52px | `w-[52px]` |
| height | 56px | `h-14` |
| src | `/images/saa-logo.png` | - |
| alt | `"Sun Annual Awards 2025"` | - |
| type | Image (next/image) | `<Image>` |
| interaction | None | - |

---

### Language Selector (A.2_Language)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `I662:14391;186:1601` | - |
| width | 108px | `w-[108px]` |
| height | 56px | `h-14` |
| padding | 16px | `p-4` |
| border-radius | 4px | `rounded` |
| display | flex row | `flex flex-row items-center` |
| gap | 4px | `gap-1` |
| cursor | pointer | `cursor-pointer` |
| font-family | Montserrat | `font-['Montserrat']` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0.15px | `tracking-[0.15px]` |
| color | #FFFFFF | `text-white` |

**States:**

| State | Changes |
|-------|---------|
| Default | background: transparent |
| Hover | background: rgba(255,255,255,0.1), cursor: pointer |
| Focus (keyboard) | outline: 2px solid rgba(255,255,255,0.5), outline-offset: 2px |
| Active (dropdown open) | background: rgba(255,255,255,0.15), chevron rotated 180° |

**Children:**
- Vietnam flag icon: 24×24px (`MM_MEDIA_VN`)
- Text "VN": Montserrat Bold 16px white
- Chevron down icon: 24×24px (`MM_MEDIA_Down`)

---

### Hero Section (B_Bìa)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `662:14393` | - |
| width | 1440px (full) | `w-full` |
| height | 845px | `h-[845px]` |
| padding | 96px 144px | `py-24 px-36` |
| display | flex column | `flex flex-col` |
| gap | 80px | `gap-[80px]` |
| position | absolute, top:88 | `absolute top-[88px]` |
| align-items | flex-start | `items-start` |

---

### ROOT FURTHER Key Visual (B.1_Key Visual)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `662:14395` | - |
| width | 451px | `w-[451px]` |
| height | 200px | `h-[200px]` |
| src | `/images/root-further-logo.png` | - |
| alt | `"ROOT FURTHER – SAA 2025"` | - |
| type | Image (next/image) | `<Image>` |
| object-fit | cover | `object-cover` |
| aspect-ratio | 115/51 | - |

---

### Hero Content Text (B.2_content)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `662:14753` | - |
| width | 480px | `w-[480px]` |
| height | 80px | `h-20` |
| font-family | Montserrat | `font-['Montserrat']` |
| font-size | 20px | `text-xl` |
| font-weight | 700 | `font-bold` |
| line-height | 40px | `leading-10` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |

**Content (2 lines):**
- Line 1: `Bắt đầu hành trình của bạn cùng SAA 2025.`
- Line 2: `Đăng nhập để khám phá!`

---

### Login Button (B.3_Login)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `662:14425` | - |
| width | 305px | `w-[305px]` |
| height | 60px | `h-[60px]` |
| padding | 16px 24px | `py-4 px-6` |
| background | #FFEA9E | `bg-[#FFEA9E]` |
| border-radius | 8px | `rounded-lg` |
| display | flex row | `flex flex-row items-center` |
| justify-content | space-between | `justify-between` |
| cursor | pointer | `cursor-pointer` |

**Button Text ("LOGIN With Google"):**

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `I662:14426;186:1568` | - |
| width | 225px | `w-[225px]` |
| height | 28px | `h-7` |
| font-family | Montserrat | `font-['Montserrat']` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| line-height | 28px | `leading-7` |
| letter-spacing | 0px | `tracking-normal` |
| color | #00101A | `text-[#00101A]` |
| text-align | center | `text-center` |

**Google Icon:**

| Property | Value |
|----------|-------|
| **Node ID** | `I662:14426;186:1766` |
| width | 24px |
| height | 24px |
| type | Icon Component (Google SVG) |

**States:**

| State | Changes |
|-------|---------|
| Default | background: #FFEA9E |
| Hover | background: #FFE07A (darkened ~5%), box-shadow: `0 4px 16px rgba(255,234,158,0.3)`, transform: translateY(-1px) |
| Active/Pressed | background: #FFCF4D, transform: translateY(0) |
| Loading/Disabled | background: #FFEA9E at 50% opacity (`opacity-50`), cursor: not-allowed, Google icon bị ẩn và thay bằng CSS spinner (24×24px, border 2px solid #00101A, border-top transparent, animation: spin 0.8s linear infinite) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Footer (D_Footer)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `662:14447` | - |
| width | 1440px (full) | `w-full` |
| padding | 40px 90px | `py-10 px-[90px]` |
| border-top | 1px solid #2E3940 | `border-t border-[#2E3940]` |
| display | flex | `flex` |
| justify-content | space-between | `justify-between` |
| align-items | center | `items-center` |
| position | absolute, bottom:0 | `absolute bottom-0` |

**Footer Text:**

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `I662:14447;342:1413` | - |
| content | "Bản quyền thuộc về Sun* © 2025" | - |
| font-family | Montserrat Alternates | `font-['Montserrat_Alternates']` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| line-height | 24px | `leading-6` |
| letter-spacing | 0% | `tracking-normal` |
| color | #FFFFFF | `text-white` |
| text-align | center | `text-center` |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A, position: relative, overflow: hidden, min-h: 100vh)
├── BackgroundKeyVisual (absolute, inset-0, z-0)
│   └── <Image> (fill, object-cover, object-position: right center)
├── GradientOverlayLeft (absolute, inset-0, z-1)
│   └── div (bg: linear-gradient(90deg, #00101A 0%, #00101A 25.41%, transparent 100%))
├── GradientOverlayBottom (absolute, inset-0, z-1)
│   └── div (bg: linear-gradient(0deg, #00101A 22.48%, transparent 51.74%))
├── Header (absolute, top-0, w-full, h-20, z-10)
│   ├── Logo (w-[52px], h-14)
│   └── LanguageSelector (w-[108px], h-14, flex, items-center, gap-1)
│       ├── FlagIcon (24×24)
│       ├── Text "VN" (Montserrat Bold 16px white)
│       └── ChevronIcon (24×24)
├── HeroSection (absolute, top-[88px], w-full, py-24, px-36, flex-col, gap-[80px])
│   ├── KeyVisual (w-[451px], h-[200px])
│   │   └── <Image src="root-further-logo"> (fill, object-cover)
│   └── ContentBlock (pl-4, flex-col, gap-6)
│       ├── HeroText (w-[480px], Montserrat Bold 20px/40px 0.5px white)
│       └── LoginButton (w-[305px], h-[60px], bg-[#FFEA9E], rounded-lg, flex, items-center, justify-between, px-6, py-4)
│           ├── ButtonText "LOGIN With Google" (Montserrat Bold 22px/28px #00101A, w-[225px])
│           └── GoogleIcon | Spinner (24×24 — icon khi default, spinner khi loading)
└── Footer (absolute, bottom-0, w-full, py-10, px-[90px], border-t border-[#2E3940])
    └── FooterText (Montserrat Alternates Bold 16px/24px white, text-center)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 0 | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Property | Desktop Value | Mobile Value |
|-----------|----------|---------------|--------------|
| Header | padding-x | 144px | 16px |
| Header | Logo size | 52×56px | 40×44px |
| Hero Section | padding-x | 144px | 16px |
| Hero Section | padding-y | 96px | 48px |
| Hero Section | gap | 120px | 48px |
| ROOT FURTHER Logo | width | 451px | 100% (max 280px) |
| ROOT FURTHER Logo | height | 200px | auto |
| Hero Content Text | width | 480px | 100% |
| Hero Content Text | font-size | 20px | 16px |
| Hero Content Text | line-height | 40px | 28px |
| Login Button | width | 305px | 100% |
| Login Button | font-size | 22px | 18px |
| Footer | padding-x | 90px | 16px |
| Footer | padding-y | 40px | 24px |

#### Tablet (768px - 1023px)

| Component | Property | Desktop Value | Tablet Value |
|-----------|----------|---------------|--------------|
| Header | padding-x | 144px | 48px |
| Hero Section | padding-x | 144px | 48px |
| ROOT FURTHER Logo | width | 451px | 320px |
| Login Button | width | 305px | 260px |
| Footer | padding-x | 90px | 48px |

#### Desktop (≥ 1024px)

All values as specified in the component details above (based on 1440px viewport).

---

## Icon Specifications

| Icon Name | Node ID | Size | Color | Usage |
|-----------|---------|------|-------|-------|
| Vietnam Flag | `I662:14391;186:1696;186:1821;186:1709` | 24×24px | Full color | Language selector |
| Chevron Down | `I662:14391;186:1696;186:1821;186:1441` | 24×24px | #FFFFFF | Language selector |
| Google Logo | `I662:14426;186:1766` | 24×24px | Full color | Login button |

> All icons MUST be implemented as Icon Components (SVG inline or icon component library), NOT `<img>` tags.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Login Button | background-color, box-shadow, transform | 150ms | ease-in-out | Hover |
| Login Button | opacity | 200ms | ease | Loading state |
| Language Selector | background-color | 150ms | ease-in-out | Hover |
| Language Dropdown | opacity, transform (translateY -4px → 0) | 150ms | ease-out | Toggle open |
| Chevron Icon | transform (rotate 0 → 180deg) | 150ms | ease-in-out | Dropdown open |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|-----------------|-----------------|
| Page wrapper | `662:14387` | `relative min-h-screen bg-[#00101A] overflow-hidden` | `<main>` |
| Background image | `662:14388` | `absolute inset-0 z-0` | `<Image src="/images/login-bg.jpg" fill alt="" aria-hidden="true" priority>` |
| Left gradient | `662:14392` | `absolute inset-0 z-[1] bg-gradient-to-r from-[#00101A] via-[#00101A]/[0.25] to-transparent` | `<div aria-hidden="true">` |
| Bottom gradient | `662:14390` | `absolute inset-0 z-[1]` (custom gradient) | `<div aria-hidden="true">` |
| Header | `662:14391` | `absolute top-0 w-full h-20 z-10 flex justify-between items-center px-36 py-3 bg-[#0B0F12]/80` | `<header>` |
| Logo | `I662:14391;186:2166` | `w-[52px] h-14 flex-shrink-0` | `<Logo />` |
| Language Selector | `I662:14391;186:1601` | `flex items-center gap-1 px-4 py-2 rounded cursor-pointer hover:bg-white/10` | `<LanguageSelector />` |
| Hero Section | `662:14393` | `absolute top-[88px] w-full flex flex-col py-24 px-36 gap-[80px]` | `<section>` |
| ROOT FURTHER logo | `662:14395` | `w-[451px] h-[200px] relative` | `<Image src="/images/root-further-logo.png" alt="ROOT FURTHER – SAA 2025" width={451} height={200} className="object-cover">` |
| Content block | `662:14755` | `pl-4 flex flex-col gap-6` | `<div>` |
| Hero text | `662:14753` | `w-[480px] font-bold text-xl leading-10 tracking-[0.5px] text-white` | `<p>` |
| Login button | `662:14425` | `flex items-center justify-between w-[305px] h-[60px] px-6 py-4 bg-[#FFEA9E] rounded-lg cursor-pointer transition-all duration-150 hover:bg-[#FFE07A] hover:-translate-y-px hover:shadow-[0_4px_16px_rgba(255,234,158,0.3)] active:translate-y-0 active:bg-[#FFCF4D] focus:outline-none focus:ring-2 focus:ring-[#FFEA9E] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed` | `<LoginButton />` |
| Footer | `662:14447` | `absolute bottom-0 w-full flex justify-between items-center px-[90px] py-10 border-t border-[#2E3940]` | `<footer>` |
| Footer text | `I662:14447;342:1413` | `font-bold text-base leading-6 text-white text-center` | `<span>` |

---

## Notes

- **Fonts**: Load both `Montserrat` (weights: 700) và `Montserrat_Alternates` (weight: 700) via `next/font/google`.
- **Background image**: Sử dụng `next/image` với `fill` prop và `priority` để eager-load (above-fold).
- **Gradients**: Implement bằng CSS `background` property trực tiếp (Tailwind custom gradient classes).
- **Login button text**: Chứa trailing space "LOGIN With Google " — cần trim trong implementation.
- **Login button layout**: Theo Figma coordinates — TEXT (x:184–409, w:225px) đứng TRƯỚC, GOOGLE ICON (x:417–441, w:24px) đứng SAU. Dùng `justify-between` với padding 24px để đạt đúng khoảng cách (total: 24+225+8+24+24=305px). Không đặt icon ở bên trái.
- **Color contrast check**: #FFEA9E (#255, 234, 158) text đen #00101A trên nền vàng = ratio ~10:1 (vượt WCAG AAA). Text trắng #FFFFFF trên nền tối #00101A tại các overlay ≥ 4.5:1.
- **ROOT FURTHER logo** (`662:14395`): File media từ Figma (node `2939:9548`). Lấy bằng MoMorph tool `get_media_file` với fileKey `9ypp4enmFmdK3YAFJLIu6C`. Lưu vào `public/images/root-further-logo.png`. Dùng `alt="ROOT FURTHER – SAA 2025"`.
- **SAA Logo** (`I662:14391;186:2166`): File media từ Figma (node `I662:14391;178:1033;178:1030`). Lưu vào `public/images/saa-logo.png`. Dùng `alt="Sun Annual Awards 2025"`.
- **Background artwork** (`662:14388`): File media lớn từ Figma (node `662:14389`). Lưu vào `public/images/login-bg.jpg`. Dùng `alt=""` (decorative).
