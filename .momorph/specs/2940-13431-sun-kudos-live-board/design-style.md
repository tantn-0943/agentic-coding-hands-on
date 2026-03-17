# Design Style: Sun* Kudos - Live Board

**Frame ID**: `2940:13431`
**Frame Name**: `Sun* Kudos - Live Board`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/2940:13431
**Extracted At**: 2026-03-16

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-background | #00101A | 100% | Page/main background (dark navy) |
| --color-container-dark | #00070C | 100% | Container variant (darker) |
| --color-header-bg | rgba(16, 20, 23, 0.8) | 80% | Header/navbar (semi-transparent dark) |
| --color-primary-gold | #FFEA9E | 100% | Primary accent text, borders, highlights |
| --color-text-white | #FFFFFF | 100% | Secondary text, white |
| --color-text-muted | #999999 | 100% | Tertiary/muted text |
| --color-card-bg | #2E3940 | 100% | Card/container backgrounds |
| --color-border-gold | #998C5F | 100% | Muted gold borders |
| --color-divider | #2E3940 | 100% | Section dividers |
| --color-gold-light | #FFF3C6 | 100% | Light gold accent |
| --color-gold-hover | #FFF8E1 | 100% | Primary button hover |
| --color-secondary-btn | rgba(255, 234, 158, 0.10) | 10% | Secondary button normal |
| --color-secondary-btn-hover | rgba(255, 234, 158, 0.40) | 40% | Secondary button hover |
| --color-text-btn | rgba(0, 0, 0, 0.00) | 0% | Text button (transparent) |
| --color-beige | #DBD1C1 | 100% | Muted beige accent |
| --color-error | #D4271D | 100% | Error/danger red |
| --color-heart-red | #F17676 | 100% | Heart/like red |
| --color-white | #FFFFFF | 100% | White backgrounds |

**Gradient Backgrounds:**

| Gradient | Usage |
|----------|-------|
| `linear-gradient(25deg, #00101A 14.74%, rgba(0, 19, 32, 0.00) 47.8%)` | Hero banner overlay |
| `linear-gradient(90deg, #00101A 50%, rgba(255, 255, 255, 0.00) 100%)` | Carousel fade right |
| `linear-gradient(270deg, #00101A 50%, rgba(255, 255, 255, 0.00) 100%)` | Carousel fade left |
| `linear-gradient(0deg, rgba(0, 0, 0, 0.70) ...)` + image | Dark image overlay |
| `linear-gradient(0deg, rgba(9, 36, 50, 0.50) ...)` + image | Blue-tinted image overlay |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing |
|------------|-------------|------|--------|-------------|----------------|
| --text-display | SVN-Gotham | 57px | 700 | 64px | -13% |
| --text-heading-1 | SVN-Gotham | 36px | 700 | 44px | -0.25px |
| --text-heading-2 | SVN-Gotham | 32px | 700 | 40px | 0 |
| --text-heading-3 | SVN-Gotham | 24px | 700 | 32px | 0 |
| --text-heading-4 | SVN-Gotham | 22px | 700 | 32px | 0 |
| --text-body-lg | SVN-Gotham | 20px | 400 | 28px | 0.15px |
| --text-body | SVN-Gotham | 16px | 400 | 24px | 0.1px |
| --text-body-medium | SVN-Gotham | 16px | 500 | 24px | 0.1px |
| --text-body-sm | SVN-Gotham | 14px | 400 | 20px | 0.1px |
| --text-body-sm-medium | SVN-Gotham | 14px | 500 | 20px | 0.1px |
| --text-label | Montserrat | 14px | 500 | 20px | 0.5px |
| --text-button | Montserrat | 16px | 500 | 24px | 0 |
| --text-nav | Montserrat | 16px | 500 | 24px | 0 |
| --text-decorative | Montserrat Alternates | 28px | 700 | 36px | 0 |

**Text Shadows:**

| Value | Usage |
|-------|-------|
| `0 0 1.3px #FFF` | White glow effect |
| `0 4px 4px rgba(0, 0, 0, 0.25), 0 0 6px #FAE287` | Gold glow + drop shadow (headings) |
| `0 0.386px 1.543px #000` | Dark text shadow |

**Text Stroke:** `1.04px #000` (used on spotlight text)

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --spacing-2xs | 2px | Tiny gaps |
| --spacing-xs | 4px | Extra small gaps |
| --spacing-sm | 6px | Small gaps |
| --spacing-md | 8px | Small component gaps |
| --spacing-base | 10px | Base small gaps |
| --spacing-lg | 13px | Medium-small gaps |
| --spacing-xl | 16px | Base gaps, card padding |
| --spacing-2xl | 24px | Medium gaps, section padding |
| --spacing-3xl | 32px | Large gaps |
| --spacing-4xl | 40px | Extra large section gaps |
| --spacing-5xl | 48px | Section gaps |
| --spacing-6xl | 64px | Large section gaps |
| --spacing-7xl | 80px | Major section gaps |
| --spacing-8xl | 120px | Hero section gaps |
| --spacing-page-x | 144px | Horizontal page margin |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --border-thin-gold | 0.5px solid #FFEA9E | Thin gold border |
| --border-gold-muted | 1px solid #998C5F | Standard muted gold border |
| --border-gold-bright | 1px solid #FFEA9E | Standard bright gold border |
| --border-white-thick | 1.869px solid #FFF | Thick white border (avatars) |
| --border-gold-heavy | 4px solid #FFEA9E | Heavy gold accent border |
| --border-divider | 1px solid #2E3940 | Section divider |
| --radius-sm | 4px | Tags, badges |
| --radius-md | 8px | Cards |
| --radius-lg | 12px | Larger cards |
| --radius-xl | 16px | Large cards |
| --radius-2xl | 24px | Panels |
| --radius-pill | 48px-100px | Pill/rounded elements |
| --radius-full | 9999px | Avatars, circles |

### Shadows

No traditional box-shadows are used. Visual depth is achieved through:
- Text shadows (gold glow effects)
- Opacity layering (0.1, 0.3, 0.4, 0.5, 0.66, 0.7)
- Gradient overlays
- Background blend mode: `screen`

---

## Layout Specifications

### Container

| Property | Value | Notes |
|----------|-------|-------|
| max-width | 1440px | Full page width |
| content-width | 1152px | Inner content (1440 - 2*144px margins) |
| padding-x | 144px | Horizontal page margin |
| padding-y | 96px top / 120px bottom | Main content area vertical |

### Page Structure

| Property | Value | Notes |
|----------|-------|-------|
| display | flex | Vertical stack |
| flex-direction | column | Top to bottom |
| background | #00101A | Dark navy page bg |
| total-height | ~5862px | Full page scroll height |

### Layout Structure (ASCII)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Page (w: 1440px, bg: #00101A)                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Navbar (w: 1440px, h: 80px, bg: rgba(16,20,23,0.8))           ││
│  │  px: 144px, flex, justify-between, items-center                 ││
│  │  ┌──────┐ ┌───────────────────┐  ┌────┐ ┌──┐ ┌──────┐         ││
│  │  │ Logo │ │ Nav Links (gap:8) │  │Bell│ │VN│ │Avatar│         ││
│  │  │52x48 │ │About|Award|Kudos  │  │40px│ │  │ │40x40 │         ││
│  │  └──────┘ └───────────────────┘  └────┘ └──┘ └──────┘         ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Hero Banner (w: 1440px, h: 512px)                              ││
│  │  bg: gradient overlay + decorative image                        ││
│  │  p: 186px 161px 186px 80px                                      ││
│  │  ┌──────────────────────────────────────────────────┐           ││
│  │  │  "He thong ghi nhan va cam on" (20px, #FFEA9E)  │           ││
│  │  │  KUDOS logo (57px display, gold glow)            │           ││
│  │  │                                                  │           ││
│  │  │  ┌──────────────────────────────────────────┐    │           ││
│  │  │  │  Search Input (pill, placeholder text)   │    │           ││
│  │  │  │  + Search bar "Tim kiem profile Sunner"  │    │           ││
│  │  │  └──────────────────────────────────────────┘    │           ││
│  │  └──────────────────────────────────────────────────┘           ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Highlight Section (px: 144px, py: 40px)                        ││
│  │  ┌──────────────────────────────────────────────────────────┐   ││
│  │  │  Header: "Sun* Annual Awards 2025" + "HIGHLIGHT KUDOS"  │   ││
│  │  │  + Filter buttons (Hashtag ▼, Phong ban ▼) right-aligned│   ││
│  │  └──────────────────────────────────────────────────────────┘   ││
│  │  ┌──────────────────────────────────────────────────────────┐   ││
│  │  │  Carousel (5 cards, center highlighted, sides dimmed)    │   ││
│  │  │  ◄  [Card][CARD][Card]  ►                                │   ││
│  │  │     ←  2/5  →                                            │   ││
│  │  └──────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Spotlight Section (px: 144px, py: 40px)                        ││
│  │  Header: "Sun* Annual Awards 2025" + "SPOTLIGHT BOARD"          ││
│  │  ┌──────────────────────────────────────────────────────────┐   ││
│  │  │  Interactive Word Cloud (bg: dark, border: gold)         │   ││
│  │  │  "388 KUDOS" header + Pan/Zoom + Search                  │   ││
│  │  │  Scattered names with varying sizes                      │   ││
│  │  └──────────────────────────────────────────────────────────┘   ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  All Kudos Section (px: 144px, py: 40px)                        ││
│  │  Header: "Sun* Annual Awards 2025" + "ALL KUDOS"                ││
│  │  ┌────────────────────────────┐ ┌──────────────────────┐       ││
│  │  │  Kudos Feed (flex-1)       │ │  Right Sidebar       │       ││
│  │  │  ┌──────────────────────┐  │ │  ┌──────────────────┐│       ││
│  │  │  │ KudoCard 1           │  │ │  │ Stats Summary    ││       ││
│  │  │  │ sender → receiver    │  │ │  │ Kudos received:25││       ││
│  │  │  │ time | content       │  │ │  │ Kudos sent: 25   ││       ││
│  │  │  │ images | hashtags    │  │ │  │ Hearts: 25       ││       ││
│  │  │  │ ♥ 1000  Copy Link   │  │ │  │ Secret Box: 25/25││       ││
│  │  │  └──────────────────────┘  │ │  │ [Mo Secret Box]  ││       ││
│  │  │  ┌──────────────────────┐  │ │  └──────────────────┘│       ││
│  │  │  │ KudoCard 2           │  │ │  ┌──────────────────┐│       ││
│  │  │  │ ...                  │  │ │  │ 10 SUNNER NHAN   ││       ││
│  │  │  └──────────────────────┘  │ │  │ QUA MOI NHAT     ││       ││
│  │  │  (infinity scroll)        │ │  │ - User 1 + gift  ││       ││
│  │  └────────────────────────────┘ │  │ - User 2 + gift  ││       ││
│  │                                 │  │ ...              ││       ││
│  │                                 │  └──────────────────┘│       ││
│  │                                 └──────────────────────┘       ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │  Footer (h: ~56px, px: 144px, border-top: divider)              ││
│  │  Logo | About SAA | Award Info | Sun* Kudos | Links | (c) 2025  ││
│  └─────────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Navbar

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13437 (parent) | - |
| width | 1440px | `width: 100%` |
| height | 80px | `height: 80px` |
| padding | 12px 144px | `padding: 12px 144px` |
| background | rgba(16, 20, 23, 0.8) | `background: rgba(16, 20, 23, 0.8)` |
| backdrop-filter | blur | `backdrop-filter: blur(10px)` |
| display | flex | `display: flex` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| position | sticky | `position: sticky; top: 0; z-index: 50` |

### Nav Link (Active)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 500 | `font-weight: 500` |
| color | #FFEA9E | `color: var(--color-primary-gold)` |
| border-bottom | 1px solid #FFEA9E | `border-bottom: 1px solid var(--color-primary-gold)` |
| padding | 16px 24px | `padding: 16px 24px` |

### Nav Link (Inactive)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: 'Montserrat', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 500 | `font-weight: 500` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| padding | 16px 24px | `padding: 16px 24px` |

---

### Hero Banner (KV Kudos)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13437 (section) | - |
| width | 1440px | `width: 100%` |
| height | 512px | `height: 512px` |
| padding | 186px 161px 186px 80px | `padding: 186px 161px 186px 80px` |
| background | gradient overlay + image | `background: linear-gradient(25deg, #00101A 14.74%, transparent 47.8%), url(...)` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 24px | `gap: 24px` |

### Hero Title Text

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 20px | `font-size: 20px` |
| font-weight | 400 | `font-weight: 400` |
| line-height | 28px | `line-height: 28px` |
| color | #FFEA9E | `color: var(--color-primary-gold)` |

### Hero Display Text (KUDOS)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 57px | `font-size: 57px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 64px | `line-height: 64px` |
| letter-spacing | -13% | `letter-spacing: -0.13em` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Gold glow |

---

### Search Input (Button ghi nhan)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13449 | - |
| width | fill | `width: 100%` |
| height | ~48px | `height: 48px` |
| padding | 10px 24px | `padding: 10px 24px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--color-secondary-btn)` |
| border | 0.5px solid #FFEA9E | `border: 0.5px solid var(--color-primary-gold)` |
| border-radius | 100px | `border-radius: 100px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| color | #999 (placeholder) | `color: var(--color-text-muted)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | background: rgba(255, 234, 158, 0.10), border: 0.5px solid #FFEA9E |
| Hover | background: rgba(255, 234, 158, 0.40) |
| Focus | border: 1px solid #FFEA9E |

---

### Profile Search Bar (Tim kiem profile Sunner)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | (adjacent to 2940:13449) | - |
| width | ~300px | `width: 300px` |
| height | ~48px | `height: 48px` |
| padding | 10px 16px | `padding: 10px 16px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--color-secondary-btn)` |
| border | 0.5px solid #FFEA9E | `border: 0.5px solid var(--color-primary-gold)` |
| border-radius | 100px | `border-radius: 100px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| color | #999 (placeholder) | `color: var(--color-text-muted)` |
| icon | magnifying glass, left-aligned | `padding-left: 40px` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: rgba(255, 234, 158, 0.10), border: 0.5px solid #FFEA9E |
| Hover | bg: rgba(255, 234, 158, 0.40) |
| Focus | border: 1px solid #FFEA9E, color: #FFF (typed text) |

---

### Section Header

| Property | Value | CSS |
|----------|-------|-----|
| subtitle font | SVN-Gotham, 14px, 500, #FFEA9E | Small gold subtitle |
| title font | SVN-Gotham, 36px, 700, #FFFFFF | Large white heading |
| title text-shadow | 0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287 | Gold glow |
| border-top | 1px solid #2E3940 | Divider above section |
| padding-top | 40px | Space above |
| gap | 8px | Between subtitle and title |

---

### Filter Button (Hashtag / Phong ban)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13459 / 2940:13460 | - |
| padding | 10px 16px | `padding: 10px 16px` |
| background | transparent | `background: transparent` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 48px | `border-radius: 48px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 500 | `font-weight: 500` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| gap | 8px | Between text and icon |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F, bg: transparent |
| Hover | bg: rgba(255, 234, 158, 0.10) |
| Active/Open | bg: rgba(255, 234, 158, 0.40), border: 1px solid #FFEA9E |

---

### Highlight Kudos Card (Center/Active)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13465 | - |
| width | ~400px | `width: 400px` |
| padding | 24px | `padding: 24px` |
| background | #2E3940 | `background: var(--color-card-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px | `gap: 16px` |
| opacity | 1 | Active card |

**Card Structure (top to bottom):**
1. **Image/Video Area** — Large prominent thumbnail at card top (aspect-ratio ~16/9), with gradient overlay for readability. Videos show play button overlay.
2. **Sender → Receiver Row** — Avatars, names, star badges, arrow icon
3. **Timestamp** — Format: "HH:mm - MM/DD/YYYY", 14px muted
4. **Category Tag Badge** — e.g., "IDOL GIOI TRE" (if applicable)
5. **Content** — Max 3 lines, truncated with "..."
6. **Hashtags** — Max 5 per line
7. **Action Bar** — Heart count + Copy Link + "Xem chi tiet ↗"

**States:**
| State | Changes |
|-------|---------|
| Active (center) | opacity: 1, scale: 1 |
| Inactive (sides) | opacity: 0.5, scale: 0.9 |

---

### "Xem chi tiet" Link (Highlight Card)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 500 | `font-weight: 500` |
| color | #999 | `color: var(--color-text-muted)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| icon | icon-external (16x16) | External link arrow |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | color: #999 |
| Hover | color: #FFEA9E |

---

### Carousel Arrow Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13470 / 2940:13468 | - |
| width | 40px | `width: 40px` |
| height | 40px | `height: 40px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--color-secondary-btn)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 9999px | `border-radius: 9999px` |
| color | #FFFFFF | Icon color |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: rgba(255, 234, 158, 0.10) |
| Hover | bg: rgba(255, 234, 158, 0.40) |
| Disabled | opacity: 0.3, cursor: not-allowed |

---

### Pagination Indicator

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13473 | - |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 400 | `font-weight: 400` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| format | "2/5" | Current page / total |

---

### Spotlight Board

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:14174 | - |
| width | 100% (1152px inner) | `width: 100%` |
| aspect-ratio | ~39/10 | `aspect-ratio: 39/10` |
| background | dark gradient + image overlay | `background: linear-gradient(...)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| overflow | hidden | `overflow: hidden` |
| position | relative | For absolute positioned elements |

### Spotlight Title "388 KUDOS"

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3007:17482 | - |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 32px | `font-size: 32px` |
| font-weight | 700 | `font-weight: 700` |
| color | #FFEA9E | `color: var(--color-primary-gold)` |

### Spotlight Search Input

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:14833 | - |
| padding | 10px 16px | `padding: 10px 16px` |
| background | transparent | `background: transparent` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 48px | `border-radius: 48px` |
| font-size | 14px | `font-size: 14px` |
| color | #999 (placeholder) | `color: var(--color-text-muted)` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F, bg: transparent |
| Hover | bg: rgba(255, 234, 158, 0.10) |
| Focus | border: 1px solid #FFEA9E, color: #FFF (typed text) |

---

### Kudos Post Card (All Kudos)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 3127:21871 | - |
| width | 100% (fill container) | `width: 100%` |
| padding | 24px 16px 24px 24px | `padding: 24px 16px 24px 24px` |
| background | #2E3940 | `background: var(--color-card-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 16px | `gap: 16px` |

---

### Avatar

| Property | Value | CSS |
|----------|-------|-----|
| width | 40px | `width: 40px` |
| height | 40px | `height: 40px` |
| border-radius | 9999px | `border-radius: 9999px` |
| border | 1.869px solid #FFF | `border: 1.869px solid white` |
| object-fit | cover | `object-fit: cover` |
| cursor | pointer | `cursor: pointer` |

---

### User Info (Name + Stars)

| Property | Value | CSS |
|----------|-------|-----|
| name font | SVN-Gotham, 14px, 500, #FFEA9E | Gold name text |
| department font | SVN-Gotham, 14px, 400, #999 | Muted department text |
| star icons | Gold stars based on kudos count | 1★=10, 2★=20, 3★=50 |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 2px | `gap: 2px` |

---

### Hashtag Badge

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I3127:21871;2234:33038 | - |
| padding | 4px 8px | `padding: 4px 8px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--color-secondary-btn)` |
| border-radius | 4px | `border-radius: 4px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 500 | `font-weight: 500` |
| color | #FFEA9E | `color: var(--color-primary-gold)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: rgba(255, 234, 158, 0.10) |
| Hover | bg: rgba(255, 234, 158, 0.40) |

---

### Heart Button

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 500 | `font-weight: 500` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 6px | `gap: 6px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Icon Color | Text |
|-------|-----------|------|
| Not liked | #999 (grey) | Count number |
| Liked | #F17676 (red) | Count number |
| Disabled (own kudos) | #999, opacity: 0.5 | Count number |

---

### Copy Link Button

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 500 | `font-weight: 500` |
| color | #999 | `color: var(--color-text-muted)` |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 4px | `gap: 4px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | color: #999 |
| Hover | color: #FFEA9E |

---

### Category Tag Badge (e.g., "IDOL GIOI TRE")

| Property | Value | CSS |
|----------|-------|-----|
| padding | 4px 10px | `padding: 4px 10px` |
| background | transparent | `background: transparent` |
| border | 0.5px solid #FFEA9E | `border: 0.5px solid var(--color-primary-gold)` |
| border-radius | 4px | `border-radius: 4px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| font-weight | 700 | `font-weight: 700` |
| color | #FFEA9E | `color: var(--color-primary-gold)` |
| text-transform | uppercase | `text-transform: uppercase` |
| position | Between timestamp and content | Flex child in card |

---

### Image Gallery (Thumbnails)

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| gap | 8px | `gap: 8px` |
| max-items | 5 | Show up to 5 thumbnails |
| thumbnail width | ~80px | `width: 80px` |
| thumbnail height | ~80px | `height: 80px` |
| border-radius | 4px | `border-radius: 4px` |
| object-fit | cover | `object-fit: cover` |
| cursor | pointer | `cursor: pointer` |
| overflow | hidden | `overflow: hidden` |

**States:**
| State | Changes |
|-------|---------|
| Default | opacity: 1 |
| Hover | opacity: 0.8, scale: 1.02 |

---

### Video Overlay

| Property | Value | CSS |
|----------|-------|-----|
| position | absolute, centered on thumbnail | `position: absolute; inset: 0; display: flex; align-items: center; justify-content: center` |
| play-icon size | 40px | `width: 40px; height: 40px` |
| play-icon color | #FFFFFF | `color: white` |
| play-icon bg | rgba(0, 0, 0, 0.50) | `background: rgba(0, 0, 0, 0.5)` |
| play-icon radius | 9999px | `border-radius: 9999px` |
| cursor | pointer | `cursor: pointer` |

---

### Toast Notification

| Property | Value | CSS |
|----------|-------|-----|
| position | fixed, bottom-center | `position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%)` |
| padding | 12px 24px | `padding: 12px 24px` |
| background | #2E3940 | `background: var(--color-card-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 14px | `font-size: 14px` |
| color | #FFFFFF | `color: var(--color-text-white)` |
| z-index | 100 | `z-index: 100` |
| auto-dismiss | ~3 seconds | JS timer |

**Animation:**
| Property | Value |
|----------|-------|
| Enter | opacity 0→1, translateY 10px→0, 300ms ease-out |
| Exit | opacity 1→0, translateY 0→10px, 300ms ease-in |

---

### Empty State Message

| Property | Value | CSS |
|----------|-------|-----|
| text-align | center | `text-align: center` |
| padding | 48px 24px | `padding: 48px 24px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 400 | `font-weight: 400` |
| color | #999 | `color: var(--color-text-muted)` |

---

### Skeleton Loading Placeholder

| Property | Value | CSS |
|----------|-------|-----|
| background | linear-gradient(90deg, #2E3940 25%, #3A4850 50%, #2E3940 75%) | Shimmer animation |
| border-radius | 8px (cards), 4px (text), 9999px (avatar) | Match component radius |
| animation | shimmer 1.5s infinite | `background-size: 200% 100%` |

---

### Right Sidebar - Stats Summary

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13489 | - |
| padding | 24px | `padding: 24px` |
| background | #2E3940 | `background: var(--color-card-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| display | flex | `display: flex` |
| flex-direction | column | `flex-direction: column` |
| gap | 13px | `gap: 13px` |

### Stats Label

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 400 | `font-weight: 400` |
| color | #FFFFFF | `color: var(--color-text-white)` |

### Stats Value

| Property | Value | CSS |
|----------|-------|-----|
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| color | #FFEA9E | `color: var(--color-primary-gold)` |

---

### "Mo Secret Box" Button

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 2940:13497 | - |
| width | 100% | `width: 100%` |
| padding | 10px 24px | `padding: 10px 24px` |
| background | #FFEA9E | `background: var(--color-primary-gold)` |
| border | none | `border: none` |
| border-radius | 48px | `border-radius: 48px` |
| font-family | SVN-Gotham | `font-family: 'SVN-Gotham', sans-serif` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #00101A | `color: var(--color-background)` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: #FFEA9E, color: #00101A |
| Hover | bg: #FFF8E1 |
| Disabled | opacity: 0.5, cursor: not-allowed |

---

### Leaderboard List Item (10 SUNNER NHAN QUA)

| Property | Value | CSS |
|----------|-------|-----|
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 10px | `gap: 10px` |
| padding | 8px 0 | `padding: 8px 0` |
| rank-indicator | 8px circle, colored | See rank colors below |
| avatar | 40px circle | See Avatar styles |
| name font | SVN-Gotham, 14px, 500, #FFEA9E | Gold name |
| description font | SVN-Gotham, 14px, 400, #999 | Muted text |

**Rank Indicator Colors (left of avatar):**
| Position | Color |
|----------|-------|
| 1st | #D4271D (red) |
| 2nd | #F17676 (light red / orange-red) |
| 3rd | #FFEA9E (gold) |
| 4th | #FFEA9E (gold) |
| 5th-10th | #998C5F (muted gold) |

---

### Notification Badge (Bell Icon)

| Property | Value | CSS |
|----------|-------|-----|
| position | absolute, top-right of bell icon | `position: absolute; top: -2px; right: -2px` |
| width | 8px | `width: 8px` |
| height | 8px | `height: 8px` |
| background | #D4271D | `background: var(--color-error)` |
| border-radius | 9999px | `border-radius: 9999px` |
| border | 1px solid #00101A | `border: 1px solid var(--color-background)` |

---

### Footer

| Property | Value | CSS |
|----------|-------|-----|
| width | 1440px | `width: 100%` |
| padding | 16px 144px | `padding: 16px 144px` |
| background | #00070C | `background: var(--color-container-dark)` |
| border-top | 1px solid #2E3940 | `border-top: 1px solid var(--color-divider)` |
| display | flex | `display: flex` |
| justify-content | space-between | `justify-content: space-between` |
| align-items | center | `align-items: center` |
| font-size | 14px | `font-size: 14px` |
| color | #999 | `color: var(--color-text-muted)` |

---

## Component Hierarchy with Styles

```
Page (bg: --color-background, w: 1440px)
├── Navbar (h: 80px, bg: rgba(16,20,23,0.8), px: 144px, sticky top)
│   ├── Logo (52x48)
│   ├── NavLinks (flex, gap: 8px)
│   │   ├── NavLink (16px, Montserrat, 500, active: --color-primary-gold + bottom-border)
│   │   └── NavLink (16px, Montserrat, 500, inactive: --color-text-white)
│   └── Actions (flex, gap: 8px)
│       ├── BellIcon (40x40)
│       ├── LanguageSwitch
│       └── Avatar (40x40, circle)
│
├── HeroBanner (h: 512px, gradient overlay)
│   ├── Subtitle (20px, 400, --color-primary-gold)
│   ├── KudosLogo (57px display, gold glow)
│   ├── SearchInput (pill, --color-secondary-btn bg, gold border, "Hom nay, ban muon gui...")
│   └── ProfileSearchBar (pill, icon + "Tim kiem profile Sunner")
│
├── HighlightSection (px: 144px, pt: 40px, border-top: --color-divider)
│   ├── SectionHeader (subtitle: 14px gold, title: 36px white glow)
│   ├── FilterButtons (flex, gap: 8px)
│   │   ├── HashtagFilter (pill button, gold-muted border)
│   │   └── DepartmentFilter (pill button, gold-muted border)
│   ├── Carousel (flex, center-highlighted)
│   │   ├── ArrowButton (40px circle, left)
│   │   ├── HighlightCards (3 visible, center active)
│   │   │   └── HighlightCard (--color-card-bg, gold-muted border, r: 8px)
│   │   │       ├── ImageArea (aspect: ~16/9, gradient overlay, rounded top)
│   │   │       │   └── VideoOverlay (play button, if video)
│   │   │       ├── UserRow (flex, sender → receiver)
│   │   │       │   ├── Avatar + UserInfo (name: gold, dept: muted)
│   │   │       │   ├── ArrowIcon
│   │   │       │   └── Avatar + UserInfo
│   │   │       ├── Timestamp (14px, 400, --color-text-muted, "HH:mm - MM/DD/YYYY")
│   │   │       ├── CategoryTagBadge (14px, gold border, "IDOL GIOI TRE")
│   │   │       ├── Content (16px, 400, white, max 3 lines)
│   │   │       ├── Hashtags (flex, gap: 4px, max 5)
│   │   │       └── ActionBar (flex, space-between)
│   │   │           ├── HeartButton (icon + count)
│   │   │           ├── CopyLink (14px, muted)
│   │   │           └── XemChiTiet (14px, muted, "Xem chi tiet ↗")
│   │   └── ArrowButton (40px circle, right)
│   └── Pagination (← 2/5 →)
│
├── SpotlightSection (px: 144px, pt: 40px, border-top: --color-divider)
│   ├── SectionHeader
│   └── SpotlightBoard (aspect: 39/10, gold-muted border, r: 8px)
│       ├── Header ("388 KUDOS", gold, 32px)
│       ├── PanZoomButton
│       ├── SearchInput (pill, gold-muted border)
│       └── WordCloud (scattered name nodes)
│
├── AllKudosSection (px: 144px, pt: 40px, flex, gap: 24px)
│   ├── SectionHeader
│   ├── KudosFeed (flex: 1, flex-col, gap: 24px)
│   │   └── KudoPostCard (--color-card-bg, gold-muted border, r: 8px, p: 24px)
│   │       ├── UserRow (sender → receiver, same as HighlightCard)
│   │       ├── Timestamp
│   │       ├── CategoryTagBadge ("IDOL GIOI TRE", gold border, uppercase)
│   │       ├── Content (max 5 lines)
│   │       ├── ImageGallery (flex, gap: 8px, max 5 thumbnails)
│   │       │   └── VideoOverlay (play button, if video)
│   │       ├── Hashtags
│   │       └── ActionBar (heart + copy link)
│   │
│   └── RightSidebar (w: ~320px, flex-col, gap: 24px, sticky)
│       ├── StatsCard (--color-card-bg, gold-muted border, r: 8px)
│       │   ├── StatRow ("So Kudos ban nhan duoc:", value: gold bold)
│       │   ├── StatRow ("So Kudos ban da gui:", value: gold bold)
│       │   ├── StatRow ("So tim ban nhan duoc:", value: gold bold)
│       │   ├── Divider (1px --color-divider)
│       │   ├── StatRow ("So Secret Box ban da mo:", value)
│       │   ├── StatRow ("So Secret Box chua mo:", value)
│       │   └── SecretBoxButton (pill, --color-primary-gold bg, dark text)
│       └── LeaderboardCard (--color-card-bg, gold-muted border, r: 8px)
│           ├── Title ("10 SUNNER NHAN QUA MOI NHAT", gold, uppercase)
│           └── ListItems (avatar + name + gift desc, gap: 8px)
│
└── Footer (bg: --color-container-dark, border-top: --color-divider)
    ├── Logo
    ├── NavLinks (14px, muted)
    └── Copyright (14px, muted)
```

---

## Responsive Specifications

### Breakpoints

| Name | Min Width | Max Width |
|------|-----------|-----------|
| Mobile | 320px | 767px |
| Tablet | 768px | 1023px |
| Desktop | 1024px | ∞ |

### Responsive Changes

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Container | padding-x: 16px |
| Navbar | padding-x: 16px, hamburger menu |
| Hero Banner | padding: 80px 16px, title: 32px |
| Highlight Carousel | Single card view, swipe gesture |
| Spotlight Board | aspect-ratio: 16/9, simplified |
| All Kudos | Single column, sidebar hidden or below |
| Right Sidebar | Full width below feed, or collapsible |
| Footer | Stacked links, centered |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Container | padding-x: 40px |
| Highlight Carousel | 3 cards visible, smaller |
| All Kudos | Feed + sidebar stacked or narrow sidebar |
| Right Sidebar | Narrower (240px) |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Container | max-width: 1440px, padding-x: 144px |
| All sections | Full layout as designed |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-pen | 20x20 | #999 | Search input prefix |
| icon-search | 20x20 | #999 | Spotlight search prefix |
| icon-bell | 24x24 | #FFF | Navbar notification |
| icon-chevron-down | 16x16 | #FFF | Filter dropdown indicator |
| icon-arrow-left | 20x20 | #FFF | Carousel prev |
| icon-arrow-right | 20x20 | #FFF | Carousel next |
| icon-arrow-sent | 16x16 | #999 | Sender to receiver |
| icon-heart-outline | 20x20 | #999 | Not liked |
| icon-heart-filled | 20x20 | #F17676 | Liked |
| icon-copy | 16x16 | #999 | Copy link |
| icon-external | 16x16 | #999 | View detail |
| icon-play | 24x24 | #FFF | Video play |
| icon-pan-zoom | 20x20 | #FFF | Spotlight controls |
| icon-gift | 20x20 | #FFEA9E | Secret box |
| icon-star | 14x14 | #FFEA9E | User star rating |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Nav Link | border-bottom, color | 200ms | ease-in-out | Hover/Active |
| Filter Button | background-color | 150ms | ease-in-out | Hover |
| Carousel | transform, opacity | 300ms | ease-out | Nav click |
| Highlight Card | opacity, scale | 300ms | ease-out | Slide change |
| Heart Button | color, scale | 200ms | ease-out | Click |
| Copy Link | color | 150ms | ease-in-out | Hover |
| Hashtag Badge | background-color | 150ms | ease-in-out | Hover |
| Secret Box Button | background-color | 150ms | ease-in-out | Hover |
| Spotlight Node | opacity, scale | 200ms | ease-out | Hover |
| Toast | opacity, translateY | 300ms | ease-out | Appear/Dismiss |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS Class | React Component |
|----------------|---------------|---------------------|-----------------|
| Navbar | 2940:13437 | `sticky top-0 z-50 backdrop-blur bg-[rgba(16,20,23,0.8)]` | `<Navbar />` |
| Hero Banner | 2940:13437 | `relative h-[512px] bg-cover bg-center` | `<HeroBanner />` |
| Search Input (Kudos) | 2940:13449 | `rounded-full border-gold bg-gold/10 px-6 py-2.5` | `<KudosSearchInput />` |
| Section Header | - | `border-t border-divider pt-10` | `<SectionHeader />` |
| Filter Button | 2940:13459 | `rounded-full border border-gold-muted px-4 py-2.5` | `<FilterButton />` |
| Highlight Carousel | 2940:13461 | `flex items-center gap-6 overflow-hidden` | `<HighlightCarousel />` |
| Highlight Card | 2940:13465 | `bg-card border border-gold-muted rounded-lg p-6` | `<HighlightKudoCard />` |
| Arrow Button | 2940:13470 | `w-10 h-10 rounded-full border border-gold-muted` | `<CarouselArrow />` |
| Pagination | 2940:13471 | `flex items-center gap-4` | `<Pagination />` |
| Spotlight Board | 2940:14174 | `relative border border-gold-muted rounded-lg overflow-hidden` | `<SpotlightBoard />` |
| Kudos Post Card | 3127:21871 | `bg-card border border-gold-muted rounded-lg p-6` | `<KudoPostCard />` |
| Avatar | - | `w-10 h-10 rounded-full border-2 border-white` | `<Avatar />` |
| User Info | - | `flex flex-col gap-0.5` | `<UserInfo />` |
| Hashtag Badge | I3127:21871;2234:33038 | `bg-gold/10 rounded px-2 py-1 text-gold` | `<HashtagBadge />` |
| Heart Button | - | `flex items-center gap-1.5 cursor-pointer` | `<HeartButton />` |
| Copy Link Button | - | `flex items-center gap-1 text-muted hover:text-gold` | `<CopyLinkButton />` |
| Stats Card | 2940:13489 | `bg-card border border-gold-muted rounded-lg p-6` | `<StatsCard />` |
| Secret Box Button | 2940:13497 | `w-full rounded-full bg-gold text-dark py-2.5 px-6 font-bold` | `<SecretBoxButton />` |
| Leaderboard | 2940:13510 | `bg-card border border-gold-muted rounded-lg p-6` | `<LeaderboardCard />` |
| Profile Search Bar | - | `rounded-full border-gold bg-gold/10 px-4 py-2.5` | `<ProfileSearchBar />` |
| Category Tag Badge | - | `border border-gold rounded px-2.5 py-1 text-gold font-bold uppercase` | `<CategoryTagBadge />` |
| Image Gallery | - | `flex gap-2` | `<ImageGallery />` |
| Video Overlay | - | `absolute inset-0 flex items-center justify-center` | `<VideoOverlay />` |
| Toast Notification | - | `fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-gold-muted rounded-lg` | `<Toast />` |
| Empty State | - | `text-center py-12 text-muted` | `<EmptyState />` |
| Skeleton Loader | - | `animate-shimmer bg-card rounded-lg` | `<Skeleton />` |
| Xem Chi Tiet Link | - | `flex items-center gap-1 text-muted hover:text-gold` | `<ViewDetailLink />` |
| Notification Badge | - | `absolute -top-0.5 -right-0.5 w-2 h-2 bg-error rounded-full` | `<NotificationBadge />` |
| Rank Indicator | - | `w-2 h-2 rounded-full` | `<RankIndicator />` |
| Footer | - | `bg-container-dark border-t border-divider px-[144px] py-4` | `<Footer />` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as project uses TailwindCSS 4.x
- Icons **MUST BE** in **Icon Component** instead of svg files or img tags
- Font `SVN-Gotham` must be loaded locally (not on Google Fonts)
- Font `Montserrat` / `Montserrat Alternates` can be loaded via Google Fonts or `next/font`
- Ensure color contrast meets WCAG AA (4.5:1 for normal text) — verify gold (#FFEA9E) on dark (#00101A) passes
- The dark theme design requires careful attention to opacity layering for depth
- Spotlight board may require a canvas/SVG library for interactive word cloud (e.g., d3.js or react-force-graph)
