# Design Style: Homepage SAA

**Frame ID**: `2167:9026`
**Frame Name**: `Homepage SAA`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2167:9026
**Extracted At**: 2026-03-12

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| `--color-bg-page` | #00101A | 100% | Page background |
| `--color-bg-header` | rgba(11,15,18,0.8) | 80% | Header (sticky nav) background — CSS var: `--color-header-bg` |
| `--color-bg-header-solid` | #0B0F12 | 100% | Header background (no transparency) |
| `--color-accent` | #FFEA9E | 100% | CTA primary bg, headings, award titles, active nav |
| `--color-border-gold` | #998C5F | 100% | Secondary CTA border, award card image border |
| `--color-text-white` | #FFFFFF | 100% | Body text, nav links, labels |
| `--color-text-dark` | #00101A | 100% | Text on accent (CTA buttons) |
| `--color-kudos-bg` | #0F0F0F | 100% | Sun* Kudos section background |
| `--color-nav-hover-bg` | #FFEA9E1A | ~10% | Nav link hover background |
| `--color-nav-active-bg` | #FFEA9E1A | ~10% | Nav link selected/active background |
| `--color-cta-secondary-bg` | #FFEA9E1A | 10% | Secondary CTA button background |
| `--color-digit-gradient-start` | #FFFFFF | 100% | Digit card gradient top |
| `--color-digit-gradient-end` | #FFFFFF1A | 10% | Digit card gradient bottom |
| `--color-badge-notification` | #EF4444 | 100% | Notification badge (red dot) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| `--text-nav-link` | Montserrat | 14px | 700 | auto | normal |
| `--text-coming-soon` | Montserrat | 24px | 700 | auto | normal |
| `--text-countdown-digit` | Digital Numbers (`--font-digital`) | 46px/60px/74px | 400 | auto | normal |
| `--text-countdown-label` | Montserrat | 16px/24px/36px | 700 | 48px | normal |
| `--text-event-value` | Montserrat | 24px | 700 | auto | normal |
| `--text-event-label` | Montserrat | 16px | 700 | auto | normal |
| `--text-cta-primary` | Montserrat | 22px | 700 | auto | normal |
| `--text-cta-secondary` | Montserrat | 22px | 700 | auto | normal |
| `--text-awards-caption` | Montserrat | 24px | 700 | auto | normal |
| `--text-awards-heading` | Montserrat | 57px | 700 | 64px | -0.25px |
| `--text-award-title` | Montserrat | 24px | 400 | auto | normal |
| `--text-award-desc` | Montserrat | 16px | 400 | auto | 0.5px |
| `--text-award-link` | Montserrat | 16px | 500 | auto | normal |
| `--text-kudos-label` | Montserrat | 24px | 700 | auto | normal |
| `--text-kudos-title` | Montserrat | 57px | 700 | 64px | normal |
| `--text-kudos-desc` | Montserrat | 16px | 700 | auto | 0.5px |
| `--text-kudos-cta` | Montserrat | 16px | 700 | auto | normal |
| `--text-footer-link` | Montserrat | 16px | 700 | auto | normal |
| `--text-footer-copyright` | Montserrat Alternates | 16px | 700 | auto | normal |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| `--spacing-page-x` | 144px | Desktop horizontal page padding |
| `--spacing-page-x-tablet` | 40px | Tablet horizontal page padding |
| `--spacing-page-x-mobile` | 16px | Mobile horizontal page padding |
| `--spacing-header-y` | 12px | Header vertical padding |
| `--spacing-header-gap` | 238px | Header flex gap (logo↔nav) |
| `--spacing-hero-content-x` | 144px | Hero content horizontal padding |
| `--spacing-hero-content-y` | 96px | Hero content vertical padding |
| `--spacing-hero-content-gap` | 120px | Gap between hero content blocks |
| `--spacing-countdown-gap` | 40px | Gap between countdown units |
| `--spacing-card-gap` | 24px | Gap within award card |
| `--spacing-card-grid-gap` | 32px | Gap between award cards |
| `--spacing-footer-y` | 40px | Footer vertical padding |
| `--spacing-footer-x` | 90px | Footer horizontal padding |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| `--radius-btn-primary` | 8px | Primary CTA button |
| `--radius-btn-kudos` | 4px | Kudos "Chi tiết" button |
| `--radius-btn-pill` | 100px | Widget floating button (pill) |
| `--radius-nav-hover` | 4px | Nav link hover background |
| `--border-card-image` | 0.955px solid #FFEA9E | Award card image border |
| `--border-cta-secondary` | 1px solid #998C5F | Secondary CTA button border |
| `--border-digit-card` | 0.75px solid #FFEA9E | Digit card glass border (actual from `DigitCard.tsx`) |

### Shadows & Effects

| Token Name | Value | Usage |
|------------|-------|-------|
| `--gradient-overlay-hero` | linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%) | Hero overlay gradient |
| `--gradient-digit-card` | linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.10) 100%) | Digit card glass |
| `--backdrop-digit-blur` | blur(24.96px) | Digit card backdrop-filter (actual from `DigitCard.tsx`) |

---

## Layout Specifications

### Page Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 1512px | Figma canvas width (desktop) |
| padding-x | 144px | Desktop side padding |
| background | #00101A | Dark navy |

### Grid/Flex Layout

| Section | Layout | Notes |
|---------|--------|-------|
| Header | flex row, justify-between | Logo + center nav + controls |
| Hero content | flex column | Stacked vertically with 120px gap |
| Countdown units | flex row, gap 40px | 3 units side by side |
| CTA buttons | flex row, gap 16px | Two buttons side by side |
| Awards grid | CSS grid 3-col | Desktop: 3 cols, tablet: 2 cols, mobile: 1 col |
| Sun* Kudos | flex row | Content left + image right |
| Footer | flex row, justify-between | Logo + nav links + copyright |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PAGE (bg: #00101A, width: 1512px)                                          │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  HEADER (sticky, h: 80px, px: 144px, bg: #10141780)                 │   │
│  │  [Logo 48×48]  [Nav: About SAA | Awards Info | Sun* Kudos]  [Lang|🔔|👤] │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  HERO / KEYVISUAL (h: 1392px, full-width)                           │   │
│  │  [Background Image: login-bg.jpg, object-cover]                     │   │
│  │  [Gradient Overlay: 12deg from #00101A to transparent]              │   │
│  │                                                                      │   │
│  │  ┌──────────────────────────────────────────────────────────┐       │   │
│  │  │  CONTENT (px: 144px, py: 96px, gap: 120px)              │       │   │
│  │  │                                                          │       │   │
│  │  │  ┌────────────────────────────────────────────────┐     │       │   │
│  │  │  │  COUNTDOWN SECTION (gap: 16px)                 │     │       │   │
│  │  │  │  "Coming soon" (24px Montserrat 700 white)     │     │       │   │
│  │  │  │  [DAYS 116×128] [HOURS 116×128] [MINUTES 116×128] gap:40px   │   │
│  │  │  └────────────────────────────────────────────────┘     │       │   │
│  │  │                                                          │       │   │
│  │  │  ┌────────────────────────────────────────────────┐     │       │   │
│  │  │  │  EVENT INFO BLOCK                              │     │       │   │
│  │  │  │  [📅 DATE value] [📍 VENUE value]              │     │       │   │
│  │  │  │  value: 24px #FFEA9E | label: 16px white       │     │       │   │
│  │  │  └────────────────────────────────────────────────┘     │       │   │
│  │  │                                                          │       │   │
│  │  │  ┌──────────────────────────────────────────────────┐   │       │   │
│  │  │  │  CTA BUTTONS (flex row, gap: 16px)               │   │       │   │
│  │  │  │  [ABOUT AWARDS btn: bg #FFEA9E, r:8px, 22px bold]│   │       │   │
│  │  │  │  [ABOUT KUDOS btn: border #998C5F, 22px bold]    │   │       │   │
│  │  │  └──────────────────────────────────────────────────┘   │       │   │
│  │  └──────────────────────────────────────────────────────────┘       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  ROOT FURTHER CONTENT SECTION (px: 144px)                           │   │
│  │  [Long-form description text, white]                                │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  AWARDS SECTION (px: 144px)                                         │   │
│  │  Caption (24px white) + Heading "Hệ thống giải thưởng" (57px #FFEA9E) │
│  │                                                                      │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │   │
│  │  │ Award Card   │ │ Award Card   │ │ Award Card   │               │   │
│  │  │ 336×504px    │ │ 336×504px    │ │ 336×504px    │               │   │
│  │  │ [img 336×336]│ │ [img 336×336]│ │ [img 336×336]│               │   │
│  │  │ [Title 24px] │ │ [Title 24px] │ │ [Title 24px] │               │   │
│  │  │ [Desc 16px]  │ │ [Desc 16px]  │ │ [Desc 16px]  │               │   │
│  │  │ [Chi tiết →] │ │ [Chi tiết →] │ │ [Chi tiết →] │               │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  SUN* KUDOS SECTION (1224×500px, inner 1120×500px, bg: #0F0F0F)    │   │
│  │  [Label: "Phong trào ghi nhận" 24px white]                         │   │
│  │  [Title: "Sun* Kudos" 57px #FFEA9E]                                │   │
│  │  [Desc 16px white]  [Chi tiết btn: 127×56, bg #FFEA9E, r:4px]     │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  FOOTER (px: 90px, py: 40px)                                        │   │
│  │  [Logo]  [Nav: About SAA | Awards Info | Sun* Kudos]  [Copyright]  │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                               [Widget Button 106×64px pill, #FFEA9E] ↗     │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Header — `2167:9091`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9091` | — |
| width | 1512px (full) | `w-full` |
| height | 80px | `h-20` |
| padding | 12px 144px | `py-3 px-36` |
| background | rgba(11,15,18,0.8) | `style={{ background: 'var(--color-header-bg)' }}` — CSS var defined in globals.css |
| position | sticky top-0 | `sticky top-0 z-50` |
| display | flex row | `flex flex-row items-center` |
| gap | 238px | `gap-[238px]` |

**Nav Link:**
| State | Property | Value |
|-------|----------|-------|
| Default | font | 14px Montserrat 700 white |
| Default | padding | 4px 8px |
| Default | radius | 4px |
| Hover | background | rgba(255,234,158,0.10) |
| Active/Selected | background | rgba(255,234,158,0.10), color | #FFEA9E |

---

### ROOT FURTHER Logo — Hero Image

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| source | `/images/root-further-logo.png` | `next/image` |
| intrinsic | 451×200px | `width={451} height={200}` |
| responsive | w-full, max-w responsive | `w-full max-w-[280px] md:max-w-[320px] lg:w-[451px] lg:max-w-none` |
| object-fit | contain | `object-contain` |
| alt | "ROOT FURTHER – SAA 2025" | accessibility text |

> "ROOT FURTHER" is a **PNG logo image** (shared with Login page), NOT a DOM text element.

---

### Hero / Keyvisual — `2167:9027`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9027` | — |
| width | 1512px (full) | `w-full` |
| height | 1392px | `min-h-screen` |
| background image | `public/images/login-bg.jpg` | `next/image fill object-cover` |
| gradient overlay | linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%) | `absolute inset-0 z-[1]` — add `--gradient-overlay-homepage` to globals.css |
| content z-index | z-[2] | `relative z-[2]` |

> **Note**: globals.css currently has `--gradient-overlay-countdown` (18deg angle). Homepage needs a **separate** CSS var `--gradient-overlay-homepage` (12deg angle) to be added.

---

### Countdown Section — `2167:9035`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9035` | — |
| display | flex column | `flex flex-col items-start gap-4` |

**"Coming soon" label:**
| Property | Value |
|----------|-------|
| font-size | 24px |
| font-weight | 700 |
| font-family | Montserrat |
| color | #FFFFFF |

**Countdown units container:**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| display | flex row | `flex flex-row` |
| gap | 40px | `gap-10` |
| role | timer | `role="timer"` |
| aria-live | polite | `aria-live="polite"` |
| aria-atomic | true | `aria-atomic="true"` |

> **Hydration**: Before `isMounted = true` (SSR render), all digits display `0` to avoid hydration mismatch. This is handled by `useCountdown` returning `isMounted: false` initially.

**Single Countdown Unit — `2167:9038` (DAYS), `2167:9043` (HOURS), `2167:9048` (MINUTES):**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| width (desktop) | 175px | `lg:w-[175px]` |
| display | flex column | `flex flex-col items-start gap-[21px]` |

> **Note**: Figma shows 116×128px at 1512px canvas. Actual responsive implementation in `CountdownUnit.tsx`: `gap-[21px]` between digit row and label.

**Digit Card (glass rectangle) — from `DigitCard.tsx`:**
| Property | Breakpoint | Value | CSS / Tailwind |
|----------|-----------|-------|----------------|
| width | mobile | 48px | `w-[48px]` |
| width | tablet | 62px | `md:w-[62px]` |
| width | desktop | 77px | `lg:w-[77px]` |
| height | mobile | 76px | `h-[76px]` |
| height | tablet | 100px | `md:h-[100px]` |
| height | desktop | 123px | `lg:h-[123px]` |
| background | all | linear-gradient(180deg, #FFF 0%, rgba(255,255,255,0.10) 100%) | `var(--gradient-digit-card)` |
| border | all | 0.75px solid #FFEA9E | `var(--color-accent)` in style prop |
| border-radius | all | 12px | `rounded-xl` |
| backdrop-filter | all | blur(24.96px) | `backdrop-blur-[24.96px]` |
| background opacity | all | 0.5 applied to bg div | inner div `opacity-50` |
| overflow | all | hidden | `overflow-hidden` |

**Digit text inside card:**
| Property | Breakpoint | Value | CSS / Tailwind |
|----------|-----------|-------|----------------|
| font-family | all | Digital Numbers (CSS var `--font-digital`) | `font-[family-name:var(--font-digital)]` |
| font-size | mobile | 46px | `text-[46px]` |
| font-size | tablet | 60px | `md:text-[60px]` |
| font-size | desktop | 74px | `lg:text-[74px]` |
| font-weight | all | 400 | `font-normal` |
| color | all | #FFFFFF | `text-white` |

> **⚠ Tech Debt**: `--font-digital` is currently `'Courier New', monospace` (fallback) in globals.css until Digital Numbers TTF is sourced. This is documented as tech debt.

**Unit label (DAYS / HOURS / MINUTES):**
| Property | Breakpoint | Value | CSS / Tailwind |
|----------|-----------|-------|----------------|
| font-size | mobile | 16px (1rem) | `text-base` |
| font-size | tablet | 24px | `md:text-[24px]` |
| font-size | desktop | 36px | `lg:text-[36px]` |
| line-height | all | 48px | `leading-[48px]` |
| font-weight | all | 700 | `font-bold` |
| font-family | all | Montserrat | `font-[family-name:var(--font-montserrat)]` |
| color | all | #FFFFFF | `text-white` |

---

### Event Info Block — `2167:9053`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9053` | — |
| display | flex row | `flex flex-row gap-8` |

**Value text (date/venue):**
| Property | Value |
|----------|-------|
| font-size | 24px |
| font-weight | 700 |
| font-family | Montserrat |
| color | #FFEA9E |

**Label text (icon/description):**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| font-family | Montserrat |
| color | #FFFFFF |

---

### CTA Buttons — `2167:9062`

**Primary CTA — `2167:9063` "ABOUT AWARDS":**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9063` | — |
| padding | 16px 24px | `py-4 px-6` |
| background | #FFEA9E | `bg-[#FFEA9E]` |
| border-radius | 8px | `rounded-lg` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| font-family | Montserrat | Montserrat |
| color | #00101A | `text-[#00101A]` |

**States:**
| State | Changes |
|-------|---------|
| Hover | opacity: 0.9, transition 150ms ease |
| Active | opacity: 0.8 |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |
| Disabled | opacity: 0.4, cursor: not-allowed |

**Secondary CTA — `2167:9064` "ABOUT KUDOS":**

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9064` | — |
| padding | 16px 24px | `py-4 px-6` |
| background | rgba(255,234,158,0.10) | `bg-[#FFEA9E]/10` |
| border | 1px solid #998C5F | `border border-[#998C5F]` |
| border-radius | 8px | `rounded-lg` |
| font-size | 22px | `text-[22px]` |
| font-weight | 700 | `font-bold` |
| color | #FFFFFF | `text-white` |

**States:**
| State | Changes |
|-------|---------|
| Hover | background: rgba(255,234,158,0.15), transition 150ms ease |
| Active | background: rgba(255,234,158,0.20) |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Root Further Content Section — `5001:14827`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `5001:14827` | — |
| padding-x | 144px (desktop) | `px-36` |
| display | block | prose/long-form |

**Body text:**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| font-size | 16px | `text-base` |
| font-weight | 400 | `font-normal` |
| font-family | Montserrat | `font-[family-name:var(--font-montserrat)]` |
| color | #FFFFFF | `text-white` |
| letter-spacing | 0.5px | `tracking-[0.5px]` |
| line-height | ~1.6 (approx 25.6px) | `leading-relaxed` |

---

### Awards Section Header — `2167:9069`

| Property | Value |
|----------|-------|
| **Node ID** | `2167:9069` |
| padding | 0 144px |

**Caption text — `2167:9070`:**
| Property | Value |
|----------|-------|
| font-size | 24px |
| font-weight | 700 |
| color | #FFFFFF |

**Heading "Hệ thống giải thưởng" — `2167:9073`:**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| font-size | 57px | `text-[57px]` |
| font-weight | 700 | `font-bold` |
| font-family | Montserrat | Montserrat |
| color | #FFEA9E | `text-[#FFEA9E]` |
| line-height | 64px | `leading-[64px]` |
| letter-spacing | -0.25px | `tracking-[-0.25px]` |

---

### Award Card — `2167:9075`–`2167:9081`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `2167:9075`–`2167:9081` | — |
| width | 336px | `w-[336px]` |
| height | 504px | `h-[504px]` |
| display | flex column | `flex flex-col` |
| gap | 24px | `gap-6` |
| cursor | pointer | `cursor-pointer` |

**Card Image:**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| width | 336px | `w-full` |
| height | 336px | `h-[336px]` |
| border | 0.955px solid #FFEA9E | `border border-[#FFEA9E]` |
| object-fit | cover | `object-cover` |

**Award Title:**
| Property | Value |
|----------|-------|
| font-size | 24px |
| font-weight | 400 |
| font-family | Montserrat |
| color | #FFEA9E |

**Award Description:**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 400 |
| font-family | Montserrat |
| color | #FFFFFF |
| letter-spacing | 0.5px |
| max-lines | 2 (overflow: ellipsis) |

**"Chi tiết" link:**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 500 |
| font-family | Montserrat |
| color | #FFFFFF |
| style | text-link with arrow or underline |

**"Chi tiết" link states:**
| State | Changes |
|-------|---------|
| Hover | text-decoration: underline, color: #FFEA9E |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

**Award card states (whole card as clickable element):**
| State | Changes |
|-------|---------|
| Hover | transform: translateY(-4px), box-shadow glow, transition 200ms ease-out |
| Active | opacity: 0.9 |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 4px |

---

### Award Card Grid — `5005:14974`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `5005:14974` | — |
| display | CSS grid | `grid` |
| columns (desktop) | 3 | `grid-cols-3` |
| columns (tablet) | 2 | `md:grid-cols-2` |
| columns (mobile) | 1 | `grid-cols-1` |
| gap | 32px | `gap-8` |
| padding | 0 144px | `px-36` |

---

### Sun* Kudos Section — `3390:10349`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `3390:10349` | — |
| outer width | 1224px | `max-w-[1224px] mx-auto` |
| height | 500px | `min-h-[500px]` |
| inner width | 1120px | inner container `max-w-[1120px] mx-auto` |
| background | #0F0F0F | `bg-[#0F0F0F]` |
| display | flex row | `flex flex-row items-center justify-between` |
| outer padding-x | (1512-1224)/2 = 144px auto | centered via `mx-auto` |
| inner padding | 40px 52px (approx) | `py-10 px-[52px]` |

**Kudos Label — "Phong trào ghi nhận":**
| Property | Value |
|----------|-------|
| font-size | 24px |
| font-weight | 700 |
| color | #FFFFFF |

**Kudos Title — "Sun* Kudos":**
| Property | Value |
|----------|-------|
| font-size | 57px |
| font-weight | 700 |
| color | #FFEA9E |
| line-height | 64px |

**Kudos Description:**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| color | #FFFFFF |
| letter-spacing | 0.5px |

**Kudos CTA "Chi tiết":**
| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| width | 127px | `w-[127px]` |
| height | 56px | `h-14` |
| background | #FFEA9E | `bg-[#FFEA9E]` |
| border-radius | 4px | `rounded` |
| font-size | 16px | `text-base` |
| font-weight | 700 | `font-bold` |
| color | #00101A | `text-[#00101A]` |

**Kudos CTA states:**
| State | Changes |
|-------|---------|
| Hover | opacity: 0.9, transition 150ms ease |
| Active | opacity: 0.8 |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

---

### Widget Button — `5022:15169`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `5022:15169` | — |
| width | 106px | `w-[106px]` |
| height | 64px | `h-16` |
| background | #FFEA9E | `bg-[#FFEA9E]` |
| border-radius | 100px | `rounded-full` |
| position | fixed bottom-right | `fixed bottom-8 right-8 z-50` |
| cursor | pointer | `cursor-pointer` |
| content | icon + text (pending — see Q1 open question) | pill layout |

**States:**
| State | Changes |
|-------|---------|
| Hover | scale: 1.05, transition 150ms ease |
| Active | scale: 0.97 |
| Focus | outline: 2px solid #00101A, outline-offset: 2px |

---

### Footer — `5001:14800`

| Property | Value | CSS / Tailwind |
|----------|-------|----------------|
| **Node ID** | `5001:14800` | — |
| padding | 40px 90px | `py-10 px-[90px]` |
| display | flex row | `flex flex-row items-center justify-between` |
| background | #00101A | `bg-[#00101A]` |

**Footer Nav Link:**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| font-family | Montserrat |
| color | #FFFFFF |

**Footer Nav Link states:**
| State | Changes |
|-------|---------|
| Hover | background: rgba(255,234,158,0.10), transition 150ms ease |
| Active/Selected | background: rgba(255,234,158,0.10), padding: 4px 8px, radius: 4px |
| Focus | outline: 2px solid #FFEA9E, outline-offset: 2px |

**Footer Copyright:**
| Property | Value |
|----------|-------|
| font-size | 16px |
| font-weight | 700 |
| font-family | Montserrat Alternates |
| color | #FFFFFF |

---

## Component Hierarchy with Styles

```
Page (bg: #00101A)
├── Header (sticky, h:80px, bg: rgba(11,15,18,0.8) via --color-header-bg, px:144px)
│   ├── Logo (48×48, click → scroll-to-top)
│   ├── Nav (flex row, gap:24px)
│   │   ├── NavLink (14px Montserrat 700 white, hover:bg #FFEA9E/10, active:text #FFEA9E)
│   │   └── ... (About SAA 2025, Awards Information, Sun* Kudos)
│   └── Controls (flex row)
│       ├── LangButton (VN/EN dropdown)
│       ├── NotificationBell (badge: #EF4444 if unread)
│       └── Avatar (dropdown: Profile/Sign out/Admin)
│
├── Hero (full-width, h:1392px, relative overflow-hidden)
│   ├── BackgroundImage (fill, object-cover, z:0) ← login-bg.jpg
│   ├── GradientOverlay (absolute inset-0, z:1, 12deg gradient)
│   └── ContentSection (relative z:2, flex-col, px:144px, py:96px, gap:120px)
│       ├── CountdownSection (flex-col, gap:16px) ← CLIENT COMPONENT
│       │   ├── ROOT FURTHER logo (Image 451×200 → responsive, object-contain)
│       │   ├── "Coming soon" (24px Montserrat 700 white, hidden if expired)
│       │   └── CountdownUnits (flex row, gap:40px, role:timer, aria-live:polite, aria-atomic:true)
│       │       ├── CountdownUnit DAYS (lg:w-175px, gap-[21px])
│       │       │   ├── DigitCards (2× glass card: mob 48×76, tab 62×100, desk 77×123, blur:24.96px)
│       │       │   └── Label "DAYS" (mob:base, md:24px, lg:36px Montserrat 700 white)
│       │       ├── CountdownUnit HOURS (same)
│       │       └── CountdownUnit MINUTES (same)
│       ├── EventInfoBlock (flex row, gap:32px)
│       │   ├── EventItem [📅 date value #FFEA9E + label white]
│       │   └── EventItem [📍 venue value #FFEA9E + label white]
│       └── CTAButtons (flex row, gap:16px)
│           ├── PrimaryBtn "ABOUT AWARDS" (bg:#FFEA9E, r:8px, 22px Montserrat 700 #00101A)
│           └── SecondaryBtn "ABOUT KUDOS" (bg:#FFEA9E/10, border #998C5F, 22px bold white)
│
├── RootFurtherSection (px:144px)
│   └── DescriptionText (16px Montserrat white, long-form)
│
├── AwardsSection (px:144px, flex-col, gap:48px)
│   ├── AwardsHeader (flex-col)
│   │   ├── Caption (24px Montserrat 700 white)
│   │   └── Heading "Hệ thống giải thưởng" (57px Montserrat 700 #FFEA9E, lh:64px)
│   └── AwardsGrid (grid 3-col, gap:32px)
│       └── AwardCard × 6 (336×504px, flex-col, gap:24px, cursor-pointer)
│           ├── CardImage (336×336px, border 0.955px #FFEA9E, object-cover)
│           ├── CardTitle (24px Montserrat 400 #FFEA9E)
│           ├── CardDesc (16px Montserrat 400 white, ls:0.5px, 2-line clamp)
│           └── ChiTietLink (16px Montserrat 500 white, text-link)
│
├── KudosSection (max-w:1224px, h:500px, bg:#0F0F0F, flex row)
│   ├── KudosContent (flex-col, gap:16px)
│   │   ├── Label "Phong trào ghi nhận" (24px Montserrat 700 white)
│   │   ├── Title "Sun* Kudos" (57px Montserrat 700 #FFEA9E, lh:64px)
│   │   ├── Desc (16px Montserrat 700 white, ls:0.5px)
│   │   └── CTA "Chi tiết" (127×56, bg:#FFEA9E, r:4px, 16px bold #00101A)
│   └── KudosImage (right side)
│
├── Footer (px:90px, py:40px, flex row justify-between)
│   ├── Logo
│   ├── FooterNav (flex row, gap:24px)
│   │   └── FooterNavLink (16px Montserrat 700 white, active:bg #FFEA9E/10)
│   └── Copyright (16px Montserrat Alternates 700 white)
│
└── WidgetButton (fixed bottom-8 right-8, 106×64px, bg:#FFEA9E, rounded-full, z:50)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width | Tailwind Prefix |
|------|-----------|-----------|-----------------|
| Mobile | 0 | 767px | (default) |
| Tablet | 768px | 1023px | `md:` |
| Desktop | 1440px+ | ∞ | `lg:` or `xl:` |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Page padding-x | 16px |
| Header padding-x | 16px |
| Hero content padding | 24px 16px |
| Hero content gap | 40px |
| Awards grid | 1 column |
| Award card | width: 100% |
| Kudos section | flex-col, stacked |
| Awards heading | font-size: 32px |
| Kudos title | font-size: 32px |
| CTA buttons | flex-col, width 100% |
| Footer | flex-col, gap: 24px |

#### Tablet (768px – 1023px)

| Component | Changes |
|-----------|---------|
| Page padding-x | 40px |
| Header padding-x | 40px |
| Awards grid | 2 columns |
| Award card | width: calc(50% - 16px) |
| Awards heading | font-size: 42px |
| Hero content padding | 60px 40px |

#### Desktop (≥ 1440px)

| Component | Changes |
|-----------|---------|
| Page padding-x | 144px |
| Header padding-x | 144px |
| Awards grid | 3 columns |
| Award card | 336×504px fixed |
| Container | max-width: 1512px, margin: 0 auto |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Primary CTA | opacity | 150ms | ease | Hover |
| Secondary CTA | background | 150ms | ease | Hover |
| Nav link | background | 150ms | ease | Hover |
| Award card | transform, box-shadow | 200ms | ease-out | Hover |
| Widget button | transform | 150ms | ease | Hover |
| Kudos CTA | opacity | 150ms | ease | Hover |
| Countdown digit | content | instant | — | Per-second tick |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind Classes | React Component |
|----------------|---------------|-----------------|-----------------|
| Header | `2167:9091` | `sticky top-0 z-50 flex px-36 py-3` + `style={{ background: 'var(--color-header-bg)' }}` | `<Header />` |
| Hero section | `2167:9027` | `relative w-full min-h-screen overflow-hidden` | `<HeroSection />` |
| Countdown section | `2167:9035` | `flex flex-col items-start gap-4` | `<CountdownSection />` (Client) |
| Countdown timer | — | `flex flex-row gap-10` | `<CountdownTimer />` (reused) |
| Countdown unit | `2167:9038` | `flex flex-col items-start gap-[21px] lg:w-[175px]` | `<CountdownUnit />` (reused) |
| Event info block | `2167:9053` | `flex flex-row gap-8` | `<EventInfoBlock />` |
| CTA primary | `2167:9063` | `bg-[#FFEA9E] text-[#00101A] py-4 px-6 rounded-lg font-bold text-[22px]` | `<Button variant="primary" />` |
| CTA secondary | `2167:9064` | `bg-[#FFEA9E]/10 border border-[#998C5F] text-white py-4 px-6 rounded-lg font-bold text-[22px]` | `<Button variant="secondary" />` |
| Awards section header | `2167:9069` | `flex flex-col gap-3` | `<AwardsSectionHeader />` |
| Awards grid | `5005:14974` | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8` | `<AwardsGrid />` |
| Award card | `2167:9075`–`9081` | `flex flex-col gap-6 w-[336px] cursor-pointer group` | `<AwardCard />` |
| Sun* Kudos section | `3390:10349` | `flex flex-row bg-[#0F0F0F] max-w-[1224px] min-h-[500px]` | `<KudosSection />` |
| Widget button | `5022:15169` | `fixed bottom-8 right-8 z-50 w-[106px] h-16 bg-[#FFEA9E] rounded-full` | `<WidgetButton />` |
| Footer | `5001:14800` | `flex flex-row justify-between py-10 px-[90px] bg-[#00101A]` | `<Footer />` |

---

## Notes

- All layout uses **Tailwind CSS** utility classes per project constitution
- Fonts loaded via `next/font/google` in `layout.tsx`:
  - `Montserrat` → `--font-montserrat` (used for all body/heading text)
  - `Montserrat_Alternates` → `--font-montserrat-alt` (footer copyright only)
- **`Digital Numbers` font**: Currently `--font-digital: 'Courier New', monospace` (tech debt fallback) in `globals.css`. Replace with proper TTF font-face when sourced.
- `next/image` required for all images (hero background, award cards, logos, ROOT FURTHER logo)
- Hero background `public/images/login-bg.jpg` shared with Login and Countdown pages
- "ROOT FURTHER" logo at `public/images/root-further-logo.png` shared with Login page — render as `<Image>`, not text
- **CSS vars to add to `globals.css`**:
  - `--gradient-overlay-homepage` — `linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)`
  - (distinct from `--gradient-overlay-countdown` which uses 18deg angle)
- Header background uses existing CSS var `--color-header-bg` = `rgba(11,15,18,0.8)` — reuse, do not duplicate
- Countdown section is the **only Client Component** on the page; everything else is Server-rendered
- Award card `description` uses CSS `line-clamp-2` for 2-line overflow ellipsis
- WCAG 2.1 AA: ensure 4.5:1 contrast for all text; use `aria-live="polite"` + `aria-atomic="true"` on countdown timer
- All icons (bell, globe, chevron, clock, location) use project **Icon Component**, not raw SVGs
