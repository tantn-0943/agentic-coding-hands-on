# Design Style: Countdown - Prelaunch

**Frame ID**: `2268:35127`
**Frame Name**: `Countdown - Prelaunch`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2268:35127
**Extracted At**: 2026-03-11

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background (same as Login) |
| `--color-text-white` | #FFFFFF | 100% | Heading, digit numbers, unit labels |
| `--color-accent` | #FFEA9E | 100% | Digit card border color |
| `--color-digit-card-border` | #FFEA9E | 100% | `border: 0.75px solid #FFEA9E` |
| `--color-gradient-dark` | #001320 | 46% | Gradient overlay midpoint |

### Gradients

| Name | Value | Usage |
|------|-------|-------|
| `--gradient-overlay` | `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)` | Full-page overlay trên background artwork |
| `--gradient-digit-card` | `linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)` | Digit card frosted glass background |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-countdown-heading` | Montserrat | 36px | 700 | 48px | 0px |
| `--text-unit-label` | Montserrat | 36px | 700 | 48px | 0px |
| `--text-digit` | Digital Numbers | ~73.73px | 400 | — | 0% |

> **Note on "Digital Numbers" font**: A 7-segment LED-style custom font. Must be loaded via `@font-face` or a Google Fonts / custom font provider. Fallback: `monospace`.

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-page-x` | 144px | Horizontal padding hero section (desktop) |
| `--spacing-page-y` | 96px | Vertical padding hero section (desktop) |
| `--spacing-units-gap` | 60px | Gap between DAYS / HOURS / MINUTES units |
| `--spacing-digits-gap` | 21px | Gap between the two digit cards within a unit |
| `--spacing-unit-label-gap` | 21px | Gap between digit row and unit label text |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-digit-card` | 12px | Digit card border-radius |
| `--border-digit-card` | 0.75px solid #FFEA9E | Digit card border |

### Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| `--blur-digit-card` | `blur(24.96px)` | `backdrop-filter` on digit card |
| `--opacity-digit-card` | 0.5 | Digit card glassmorphism opacity |

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| Page width | 1512px | Full viewport width (design baseline) |
| Page height | 1077px | Full viewport height (design baseline) |
| Hero padding-x | 144px | Left and right |
| Hero padding-y | 96px | Top and bottom |
| Hero layout | flex-col, justify-center, align-center | Full-height vertical centering |

### Layout Structure (ASCII)

```
┌──────────────────────────────────────────────────────────────────────┐
│  PAGE (1512×1077px, bg: #00101A)                                     │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  BACKGROUND ARTWORK (1512×1077px, absolute, cover)           │   │
│  └──────────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  GRADIENT OVERLAY (absolute, inset-0, 18deg gradient)        │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HERO SECTION (1512×456px, py:96, px:144, flex-col center)   │   │
│  │                                                              │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │  HEADING (full width, Montserrat 700 36px, center)     │  │   │
│  │  │  "Sự kiện sẽ bắt đầu sau"                             │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  │                          gap: 24px                            │   │
│  │  ┌────────────────────────────────────────────────────────┐  │   │
│  │  │  TIME ROW (644×192px, flex-row, gap:60px, centered)    │  │   │
│  │  │                                                        │  │   │
│  │  │  ┌──────────┐   gap:60px   ┌──────────┐  ┌─────────┐  │  │   │
│  │  │  │  DAYS    │             │  HOURS   │  │ MINUTES │  │  │   │
│  │  │  │ 175×192  │             │ 175×192  │  │ 175×192 │  │  │   │
│  │  │  │          │             │          │  │         │  │  │   │
│  │  │  │ ┌──┐┌──┐ │             │ ┌──┐┌──┐ │  │ ┌──┐┌──┐│  │  │   │
│  │  │  │ │D││D│ │             │ │D││D│ │  │ │D││D││  │  │   │
│  │  │  │ └──┘└──┘ │             │ └──┘└──┘ │  │ └──┘└──┘│  │  │   │
│  │  │  │ 77px each│             │ 77px each│  │         │  │  │   │
│  │  │  │ gap:21px │             │ gap:21px │  │ gap:21px│  │  │   │
│  │  │  │          │             │          │  │         │  │  │   │
│  │  │  │  "DAYS"  │             │ "HOURS"  │  │"MINUTES"│  │  │   │
│  │  │  │ 36px 700 │             │ 36px 700 │  │ 36px 700│  │  │   │
│  │  │  └──────────┘             └──────────┘  └─────────┘  │  │   │
│  │  └────────────────────────────────────────────────────────┘  │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

Each digit card (D) — layered structure:
```
┌──────────────── 77×123px (wrapper, opacity: 1.0) ───────────────┐
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  BG LAYER (absolute inset-0, opacity: 0.5)                  │ │
│ │  border: 0.75px solid #FFEA9E                               │ │
│ │  border-radius: 12px                                        │ │
│ │  backdrop-filter: blur(24.96px)                             │ │
│ │  bg: linear-gradient(↓ #FFF → #FFF/10%)                    │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│   "0"  (relative z-10, Digital Numbers ~73px white, opacity:1)  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Page Wrapper

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `2268:35127` | - |
| width | 100vw | `w-full` |
| min-height | 100vh | `min-h-screen` |
| background | #00101A | `bg-[#00101A]` |
| position | relative, overflow hidden | `relative overflow-hidden` |

---

### Background Artwork

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `2268:35129` | - |
| width | 100% | `w-full` |
| height | 100% | `h-full` |
| position | absolute, inset-0 | `absolute inset-0` |
| object-fit | cover | `object-cover` |
| z-index | 0 | `z-0` |
| src | `/images/login-bg.jpg` (shared asset) | - |

---

### Gradient Overlay

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `2268:35130` | - |
| position | absolute, inset-0 | `absolute inset-0` |
| background | `linear-gradient(18deg, #00101A 15.48%, rgba(0,18,29,0.46) 52.13%, rgba(0,19,32,0.00) 63.41%)` | inline style |
| z-index | 1 | `z-[1]` |
| pointer-events | none | `pointer-events-none` |

---

### Hero Section (Bìa)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `2268:35131` | - |
| width | 1512px (100vw) | `w-full` |
| height | 456px (Figma absolute) | — |
| position | absolute, startY=218px, endY=673px | `absolute inset-0` for implementation |
| padding | 96px 144px | `py-24 px-36` |
| display | flex column | `flex flex-col` |
| justify-content | center | `justify-center` |
| align-items | center | `items-center` |
| inner gap (heading→time) | 24px | `gap-6` |
| outer gap (Bìa) | 120px (unused, Figma artifact) | — |

> **Implementation note**: In Figma, the "Bìa" frame is an absolute-positioned 456px block placed at Y=218 (not full-screen height). For responsive implementation, use a full-screen approach instead: `min-h-screen flex flex-col items-center justify-center` on the Hero section. This centers the countdown in the viewport at all breakpoints, which is visually equivalent to the Figma intent.

> **Figma layer "Awards Information Navigation Links"**: Node `2268:35137` is named "Awards Information Navigation Links" in the Figma layer panel. This is a **mislabeled layer name** — the actual text content is `"Sự kiện sẽ bắt đầu sau"`. There is no separate navigation links component on this screen.

---

### Countdown Heading

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `2268:35137` | - |
| content | "Sự kiện sẽ bắt đầu sau" | - |
| font-family | Montserrat | `font-[family-name:var(--font-montserrat)]` |
| font-size | 36px | `text-[36px]` |
| font-weight | 700 | `font-bold` |
| line-height | 48px | `leading-[48px]` |
| letter-spacing | 0px | `tracking-normal` |
| color | #FFFFFF | `text-white` |
| text-align | center | `text-center` |

---

### Time Row (containing all 3 units)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | `2268:35138` | - |
| width | 644px (desktop) | `w-full lg:w-[644px]` |
| height | 192px | — |
| display | flex row | `flex flex-row` |
| gap | 60px | `gap-[60px]` |
| align-items | center | `items-center` |
| justify-content | `flex-start` (Figma) | `justify-start` |

> **Implementation note**: Figma sets `justifyContent: flex-start` on the Time Row itself (`2268:35138`). The visual centering of the row on the page is achieved by the parent "Countdown time" container (`2268:35136`) which uses `alignItems: center`. In implementation, wrap the Time Row in a `flex justify-center w-full` container OR apply `mx-auto` to the Time Row. Either approach achieves the centered visual result.

---

### Time Unit (Days / Hours / Minutes)

Applies to all three: `1_Days` (`2268:35139`), `2_Hours` (`2268:35144`), `3_Minutes` (`2268:35149`)

| Property | Value | Tailwind |
|----------|-------|---------|
| width | 175px | `w-[175px]` |
| height | 192px | `h-[192px]` |
| display | flex column | `flex flex-col` |
| gap | 21px | `gap-[21px]` |
| align-items | flex-start | `items-start` |

**Children:**
1. Digit pair row: `flex-row, gap-[21px], align-center`
2. Unit label text

---

### Digit Card (Single digit tile)

Applies to each individual digit instance (e.g., `2268:35141`, `2268:35142`, etc.)

**Outer wrapper** (Group node `2268:35141`):

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node ID** | e.g. `2268:35141` | - |
| width | 77px | `w-[77px]` |
| height | 123px | `h-[123px]` |
| border-radius | 12px | `rounded-xl` |
| overflow | hidden | `overflow-hidden` |
| position | relative | `relative` |
| opacity | **1.0** (full) — wrapper is NOT transparent | — |

**Inner background layer** (Rectangle `I2268:35141;186:2616`, absolute inside wrapper):

| Property | Value | Tailwind |
|----------|-------|---------|
| position | absolute, inset-0 | `absolute inset-0` |
| background | `linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%)` | inline style |
| border | 0.75px solid #FFEA9E | inline `style={{ border: '0.75px solid #FFEA9E' }}` |
| border-radius | 12px | `rounded-xl` |
| backdrop-filter | blur(24.96px) | `backdrop-blur-[24.96px]` |
| **opacity** | **0.5** ← applied here only | `opacity-50` |

**Digit Text inside card:**

| Property | Value |
|----------|-------|
| font-family | "Digital Numbers" |
| font-size | ~73.73px (≈ 74px) |
| font-weight | 400 |
| color | #FFFFFF |
| text-align | left |
| letter-spacing | 0% |

> **Opacity layering (CRITICAL)**: Figma applies `opacity: 0.5` to the card's **background Rectangle** (`I2268:35141;186:2616`) — NOT to the digit text. The card is composed of two sibling nodes inside a Group:
> 1. `Rectangle 1` (`I2268:35141;186:2616`) — glassmorphism background with `opacity: 0.5`
> 2. Digit `TEXT` (`I2268:35141;186:2617`) — `opacity: 1.0` (full opacity white text)
>
> **Implementation approach**: Do NOT apply `opacity-50` to the entire card wrapper. Instead:
> - Create an inner `<div>` for the frosted background: `absolute inset-0 opacity-50 backdrop-blur-[24.96px]` with the gradient bg and border
> - Place the digit `<span>` as a sibling, `relative z-10 opacity-100`
> - This preserves full-brightness digits on a semi-transparent card background.

---

### Unit Label (DAYS / HOURS / MINUTES)

| Property | Value | Tailwind |
|----------|-------|---------|
| **Node IDs** | `2268:35143` (DAYS), `2268:35148` (HOURS), `2268:35153` (MINUTES) | - |
| font-family | Montserrat | `font-[family-name:var(--font-montserrat)]` |
| font-size | 36px | `text-[36px]` |
| font-weight | 700 | `font-bold` |
| line-height | 48px | `leading-[48px]` |
| letter-spacing | 0px | `tracking-normal` |
| color | #FFFFFF | `text-white` |
| text-align | left | `text-left` |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A, relative, overflow-hidden, min-h-screen)
├── BackgroundArtwork (absolute, inset-0, z-0)
│   └── <Image src="/images/login-bg.jpg" fill object-cover priority alt="" aria-hidden>
├── GradientOverlay (absolute, inset-0, z-[1], pointer-events-none)
│   └── <div style="background: linear-gradient(18deg, …)" aria-hidden>
└── HeroSection (relative, z-[2], w-full, min-h-screen, flex-col, items-center, justify-center, py-24, px-36, gap-6)
    ├── Heading (text-[36px] font-bold leading-[48px] text-white text-center Montserrat)
    │   "Sự kiện sẽ bắt đầu sau"
    └── TimeRow (flex-row, gap-[60px], items-center, justify-center)
        ├── TimeUnit "DAYS" (flex-col, gap-[21px], items-start, w-[175px])
        │   ├── DigitPair (flex-row, gap-[21px], items-center)
        │   │   ├── DigitCard (w-[77px] h-[123px] rounded-xl overflow-hidden, relative)
        │   │   │   ├── <div aria-hidden: absolute inset-0, opacity-50, backdrop-blur, gradient-bg, border 0.75px #FFEA9E>
        │   │   │   └── <span relative z-10, font="Digital Numbers" text-[74px] text-white>0</span>
        │   │   └── DigitCard (same structure)
        │   └── <span class="text-[36px] font-bold text-white Montserrat">DAYS</span>
        ├── TimeUnit "HOURS" (same structure, 2 digit cards)
        └── TimeUnit "MINUTES" (same structure, 2 digit cards)
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
| Hero Section | padding-x | 144px | 16px |
| Hero Section | padding-y | 96px | 48px |
| Heading | font-size | 36px | 22px |
| Heading | line-height | 48px | 32px |
| Time Row | gap | 60px | 24px |
| Time Row | flex-direction | row | row (maintain) |
| Digit Card | width | 77px | 48px |
| Digit Card | height | 123px | 76px |
| Digit | font-size | ~74px | ~46px |
| Unit Label | font-size | 36px | 16px |
| Unit Label | line-height | 48px | 24px |

#### Tablet (768px - 1023px)

| Component | Property | Desktop Value | Tablet Value |
|-----------|----------|---------------|--------------|
| Hero Section | padding-x | 144px | 48px |
| Digit Card | width | 77px | 62px |
| Digit Card | height | 123px | 100px |
| Digit | font-size | ~74px | ~60px |
| Unit Label | font-size | 36px | 24px |

#### Desktop (≥ 1024px)

All values as specified in component details above.

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Digit Card | content (number) | instant | — | Every second tick |
| Digit Card | flip animation (optional) | 300ms | ease-in-out | Digit change |
| Countdown → Zero | screen transition | 500ms | ease-out | Timer reaches 00:00:00 |

---

## Icon Specifications

No icons on this screen. The digit characters use the "Digital Numbers" font.

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|-----------------|-----------------|
| Page wrapper | `2268:35127` | `relative min-h-screen bg-[#00101A] overflow-hidden` | `<main>` |
| Background artwork | `2268:35129` | `absolute inset-0 z-0` | `<Image fill object-cover priority alt="" aria-hidden>` |
| Gradient overlay | `2268:35130` | `absolute inset-0 z-[1] pointer-events-none` | `<div aria-hidden style="background: linear-gradient(18deg,…)">` |
| Hero section | `2268:35131` | `relative z-[2] flex flex-col items-center justify-center min-h-screen py-24 px-4 md:px-12 lg:px-36 gap-6` | `<section>` |
| Heading | `2268:35137` | `font-[family-name:var(--font-montserrat)] font-bold text-[22px] md:text-[28px] lg:text-[36px] leading-[48px] text-white text-center` | `<h1>` |
| Time row | `2268:35138` | `flex flex-row gap-6 md:gap-10 lg:gap-[60px] items-start justify-center` | `<div>` |
| Time unit (each) | `2268:35139/35144/35149` | `flex flex-col items-start gap-[21px]` | `<CountdownUnit />` |
| Digit pair | `2268:35140/35145/35150` | `flex flex-row gap-[21px] items-center` | `<div>` |
| Digit card wrapper | `2268:35141/35142/…` | `relative w-[48px] h-[76px] md:w-[62px] md:h-[100px] lg:w-[77px] lg:h-[123px] rounded-xl overflow-hidden` | `<DigitCard />` |
| Digit card bg layer | `I2268:35141;186:2616` | `absolute inset-0 rounded-xl opacity-50 backdrop-blur-[24.96px]` + `style={{ background: 'linear-gradient(…)', border: '0.75px solid #FFEA9E' }}` | `<div aria-hidden>` |
| Digit number | `I2268:35141;186:2617` | `relative z-10 font-['Digital_Numbers'] font-normal text-[46px] md:text-[60px] lg:text-[74px] text-white` | `<span>` |
| Unit label | `2268:35143/35148/35153` | `font-[family-name:var(--font-montserrat)] font-bold text-base md:text-[24px] lg:text-[36px] leading-[48px] text-white` | `<span>` |

---

## Notes

- **"Digital Numbers" font**: Custom LED/7-segment font. Must be added to `next/font/local` or via `@font-face` in `globals.css`. File path: `public/fonts/digital-numbers.ttf` (to be downloaded/sourced separately).
- **Background artwork**: Reuses `/images/login-bg.jpg` from the Login screen.
- **No header / footer**: This is a standalone pre-launch page — no navigation.
- **Backdrop blur**: `backdrop-filter: blur(24.96px)` requires `backdrop-blur-[24.96px]` in Tailwind v4, or `style={{ backdropFilter: 'blur(24.96px)' }}`.
- **Digit card layering**: `opacity-50` applies ONLY to the **background Rectangle** layer inside the card, NOT the entire card wrapper. Structure: card wrapper (`relative overflow-hidden`) → background `<div>` with `opacity-50 backdrop-blur` (absolute inset-0) → digit `<span>` with `relative z-10` (full opacity). See Digit Card component section for full details.
- **Border precision**: Figma uses `0.75px` border — use `style={{ border: '0.75px solid #FFEA9E' }}` since Tailwind only supports 1px as minimum.
- **Countdown data source**: Event start timestamp from `NEXT_PUBLIC_EVENT_START_DATE` env var (ISO 8601 format, e.g. `2025-12-31T00:00:00+07:00`).
