# Design Style: Viết Kudo (Write Kudos)

**Frame ID**: `520:11602`
**Frame Name**: `Viết Kudo`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/520:11602
**Extracted At**: 2026-03-17

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-modal-bg | #FFF8E1 | 100% | Modal dialog background (cream) |
| --color-overlay | rgba(0, 16, 26, 0.80) | 80% | Modal overlay/mask |
| --color-text-dark | #00101A | 100% | Heading text, body text, button text |
| --color-text-muted | #999999 | 100% | Placeholder text, secondary text, anonymous label |
| --color-required-red | #CF1322 | 100% | Required field asterisk (*) |
| --color-error-text | #E46060 | 100% | Error/warning text |
| --color-border-gold | #998C5F | 100% | Input borders, toolbar borders, tag borders |
| --color-primary-gold | #FFEA9E | 100% | Submit button bg, image thumbnail border, community link |
| --color-input-bg | #FFFFFF | 100% | Input field backgrounds, textarea bg, checkbox bg |
| --color-delete-red | #D4271D | 100% | Delete button background (image remove) |
| --color-secondary-btn | rgba(255, 234, 158, 0.10) | 10% | Cancel button background |
| --color-divider | #2E3940 | 100% | Toolbar section divider |

### Typography

All text uses **Montserrat** font family, weight **700** (bold).

| Token Name | Size | Weight | Line Height | Letter Spacing | Color | Usage |
|------------|------|--------|-------------|----------------|-------|-------|
| --text-modal-heading | 32px | 700 | 40px | 0 | #00101A | Modal title |
| --text-field-label | 22px | 700 | 28px | 0 | #00101A | Field labels (Người nhận, Hashtag, Image) |
| --text-input | 16px | 700 | 24px | 0.15px | #00101A | Input text, textarea content |
| --text-placeholder | 16px | 700 | 24px | 0.15px | #999 | Placeholder text |
| --text-hint | 16px | 700 | 24px | 0.5px | #00101A | Hint text (@ mention tip) |
| --text-button-submit | 22px | 700 | 28px | 0 | #00101A | Submit button text "Gửi" |
| --text-button-cancel | 16px | 700 | 24px | 0.15px | #00101A | Cancel button text "Hủy" |
| --text-tag-label | 11px | 700 | 16px | 0.5px | #999 | Tag/chip label text, "Tối đa 5" note |
| --text-required | 16px | 700 | 20px | 0 | #CF1322 | Required asterisk (*) — uses **Noto Sans JP** |
| --text-danh-hieu-hint | 16px | 700 | 24px | 0 | #999 | Danh hiệu description hint text |
| --text-community-link | 16px | 700 | 24px | 0.15px | #FFEA9E | "Tiêu chuẩn cộng đồng" link |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --modal-padding | 40px | Modal internal padding (all sides) |
| --section-gap | 32px | Gap between top-level form sections (modal flex children) |
| --content-gap | 24px | Gap between editor, hashtag, and image sections within Content frame |
| --field-gap | 16px | Gap between label and input |
| --button-gap | 24px | Gap between Cancel and Submit buttons |
| --tag-gap | 8px | Gap between hashtag chips |
| --image-gap | 16px | Gap between image thumbnails |
| --toolbar-btn-padding | 10px 16px | Toolbar button padding |
| --input-padding | 16px 24px | Input field padding |
| --cancel-btn-padding | 16px 40px | Cancel button padding |
| --submit-btn-padding | 16px | Submit button padding |
| --checkbox-gap | 16px | Gap between checkbox and label |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --modal-radius | 24px | Modal dialog corners |
| --input-radius | 8px | Input fields, submit button |
| --toolbar-radius-first | 8px 0 0 0 | First toolbar button (top-left) |
| --toolbar-radius-last | 0 8px 0 0 | Last toolbar section (top-right) |
| --textarea-radius | 0 0 8px 8px | Textarea (bottom corners only) |
| --tag-radius | 8px | Tag/chip buttons |
| --cancel-radius | 4px | Cancel button |
| --checkbox-radius | 4px | Checkbox |
| --thumbnail-radius | 4px | Image thumbnails |
| --image-placeholder-radius | 18px | Image upload placeholder |
| --delete-btn-radius | 9999px | Delete button (circle) |
| --border-input | 1px solid #998C5F | Input fields, toolbar, tags, cancel |
| --border-thumbnail | 1px solid #FFEA9E | Image thumbnails |
| --border-checkbox | 1px solid #999 | Checkbox |

### Shadows

No box-shadows on modal dialog or form elements. The overlay provides visual depth.

---

## Layout Specifications

### Modal Container

| Property | Value | Notes |
|----------|-------|-------|
| width | 752px | Fixed on desktop |
| height | auto (max ~1012px) | Scrollable if content exceeds |
| padding | 40px | All sides |
| content-width | 672px | 752 - 2*40 padding |
| background | #FFF8E1 | Cream |
| border-radius | 24px | All corners |
| position | centered | Over dark overlay |

### Layout Structure (ASCII)

```
┌─── Overlay (1440x1024, bg: rgba(0,16,26,0.8)) ──────────────────────┐
│                                                                       │
│   ┌─── Modal (752px, bg: #FFF8E1, r: 24px, p: 40px) ──────────┐    │
│   │                                                              │    │
│   │  [A] Title (32px, center, 672x80)                            │    │
│   │  "Gửi lời cám ơn và ghi nhận đến đồng đội"                  │    │
│   │                          gap: 32px                           │    │
│   │  [B] Người nhận *        [Search Input ▾] (514x56)           │    │
│   │  (22px label)            (16px placeholder, #998C5F border)  │    │
│   │                          gap: 32px                           │    │
│   │  [B2] Danh hiệu *       [Text Input] (514x56)               │    │
│   │  (22px label)            "Dành tặng một danh hiệu..."       │    │
│   │                          Description: "Ví dụ: Người..."     │    │
│   │                          gap: 32px                           │    │
│   │  ┌─── Content (672px, gap: 24px) ───────────────────────┐    │    │
│   │  │ [C] Toolbar ┌──┬──┬──┬──┬──┬──┐ Tiêu chuẩn cộng đồng│    │    │
│   │  │             │B │I │S │≡ │🔗│❝ │ (gold link)           │    │    │
│   │  │             └──┴──┴──┴──┴──┴──┘                        │    │    │
│   │  │ [D] Textarea (672x200, white bg, bottom-radius 8px)    │    │    │
│   │  │ "Hãy gửi gắm lời cám ơn..."                           │    │    │
│   │  │ [D.1] Hint: 'Bạn có thể "@ + tên"...'                │    │    │
│   │  │                         gap: 24px                      │    │    │
│   │  │ [E] Hashtag * [+ Hashtag] Tối đa 5                    │    │    │
│   │  │ (22px label)  (chip btn)  (11px note)                  │    │    │
│   │  │                         gap: 24px                      │    │    │
│   │  │ [F] Image  [📷][📷][📷][📷][📷] [+ Image]            │    │    │
│   │  │ (22px)     (80x80 thumbnails)     Tối đa 5            │    │    │
│   │  └────────────────────────────────────────────────────────┘    │    │
│   │                          gap: 32px                           │    │
│   │  [G] ☐ Gửi lời cám ơn và ghi nhận ẩn danh                  │    │
│   │  (24x24 checkbox + 22px label, #999)                         │    │
│   │  [G.1] ┌─ Anonymous Name Input ─┐ (conditional)             │    │
│   │                          gap: 32px                           │    │
│   │  [H] [Hủy ✕]  [        Gửi ▷        ]                      │    │
│   │      (border)   (gold bg, 502x60, center)                    │    │
│   │                                                              │    │
│   └──────────────────────────────────────────────────────────────┘    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Modal Overlay

| Property | Value | CSS |
|----------|-------|-----|
| width | 100vw | `width: 100vw` |
| height | 100vh | `height: 100vh` |
| background | rgba(0, 16, 26, 0.80) | `background: rgba(0, 16, 26, 0.8)` |
| position | fixed | `position: fixed; inset: 0` |
| z-index | 50 | `z-index: 50` |
| display | flex, center | `display: flex; align-items: center; justify-content: center` |

### Modal Dialog

| Property | Value | CSS |
|----------|-------|-----|
| width | 752px | `width: 752px; max-width: 95vw` |
| max-height | 90vh | `max-height: 90vh; overflow-y: auto` |
| padding | 40px | `padding: 40px` |
| background | #FFF8E1 | `background: #FFF8E1` |
| border-radius | 24px | `border-radius: 24px` |
| display | flex column | `display: flex; flex-direction: column; gap: 32px` |

### Title (A)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9870 | - |
| font-family | Montserrat | `font-family: var(--font-montserrat)` |
| font-size | 32px | `font-size: 32px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 40px | `line-height: 40px` |
| color | #00101A | `color: #00101A` |
| text-align | center | `text-align: center` |

### Field Label (Người nhận, Hashtag, Image)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Montserrat | `font-family: var(--font-montserrat)` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 28px | `line-height: 28px` |
| color | #00101A | `color: #00101A` |

### Required Asterisk (*)

| Property | Value | CSS |
|----------|-------|-----|
| font-family | Noto Sans JP | `font-family: 'Noto Sans JP'` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| color | #CF1322 | `color: #CF1322` |
| margin-left | 2px | `margin-left: 2px` |

### Search Input (Recipient)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9873 | - |
| width | fill (514px in row) | `flex: 1` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 16px | `font-size: 16px` |
| color | #00101A | `color: #00101A` |
| placeholder-color | #999 | `placeholder: color #999` |

**States:**
| State | Changes |
|-------|---------|
| Default | border: 1px solid #998C5F |
| Focus | border: 2px solid #FFEA9E |
| Error | border: 1px solid #CF1322 |
| Filled | shows selected user name |

### Rich Text Toolbar (C)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9877 | - |
| height | 40px | `height: 40px` |
| display | flex row | `display: flex` |
| border | 1px solid #998C5F | Top + sides border |
| border-radius | 8px 8px 0 0 | `border-radius: 8px 8px 0 0` |

### Toolbar Button

| Property | Value | CSS |
|----------|-------|-----|
| padding | 10px 16px | `padding: 10px 16px` |
| background | transparent | `background: transparent` |
| border-right | 1px solid #998C5F | Separator between buttons |
| icon-size | 24x24 | `width: 24px; height: 24px` |
| cursor | pointer | `cursor: pointer` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: transparent |
| Hover | bg: rgba(255, 234, 158, 0.10) |
| Active (toggled) | bg: rgba(255, 234, 158, 0.20), font-weight: bold |

### Text Area (D)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9886 | - |
| width | 672px (full) | `width: 100%` |
| min-height | 200px | `min-height: 200px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 0 0 8px 8px | `border-radius: 0 0 8px 8px` (connects to toolbar) |
| font-size | 16px | `font-size: 16px` |
| color | #00101A | `color: #00101A` |

### Hashtag Chip/Tag

| Property | Value | CSS |
|----------|-------|-----|
| height | 48px | `height: 48px` |
| padding | 4px 8px | `padding: 4px 8px` |
| background | #FFFFFF | `background: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 11px | `font-size: 11px` |
| color | #999 | `color: #999` |

### Image Thumbnail

| Property | Value | CSS |
|----------|-------|-----|
| width | 80px | `width: 80px` |
| height | 80px | `height: 80px` |
| border-radius | 4px | `border-radius: 4px` |
| border | 1px solid #FFEA9E | `border: 1px solid var(--color-primary-gold)` |
| object-fit | cover | `object-fit: cover` |
| position | relative | For delete button positioning |

### Image Delete Button

| Property | Value | CSS |
|----------|-------|-----|
| width | 20px | `width: 20px` |
| height | 20px | `height: 20px` |
| background | #D4271D | `background: var(--color-delete-red)` |
| border-radius | 9999px | `border-radius: 9999px` (circle) |
| position | absolute top-right | `position: absolute; top: -6px; right: -6px` |
| color | white | Icon color: white |

### Anonymous Checkbox (G)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:14099 | - |
| checkbox-size | 24x24 | `width: 24px; height: 24px` |
| border | 1px solid #999 | `border: 1px solid #999` |
| border-radius | 4px | `border-radius: 4px` |
| background | #FFFFFF | `background: white` |
| label font-size | 22px | `font-size: 22px` (matches field labels) |
| label color | #999 | `color: #999` |
| gap | 16px | `gap: 16px` (between checkbox and label) |

### Anonymous Name Text Field (G.1 — conditional)

Appears when the anonymous checkbox is checked.

| Property | Value | CSS |
|----------|-------|-----|
| width | fill (672px) | `width: 100%` |
| height | 56px | `height: 56px` |
| padding | 16px 24px | `padding: 16px 24px` |
| background | #FFFFFF | `background: white` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 16px | `font-size: 16px` |
| placeholder | "Nhập tên ẩn danh" | Placeholder text |
| visibility | hidden (default) | Shown only when anonymous is checked |

### Cancel Button (H.1)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9906 | - |
| padding | 16px 40px | `padding: 16px 40px` |
| background | rgba(255, 234, 158, 0.10) | `background: var(--color-secondary-btn)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-border-gold)` |
| border-radius | 4px | `border-radius: 4px` |
| font-size | 16px | `font-size: 16px` |
| color | #00101A | `color: #00101A` |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: rgba(255, 234, 158, 0.10) |
| Hover | bg: rgba(255, 234, 158, 0.40) |

### Submit Button (H.2)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I520:11647;520:9907 | - |
| width | fill (~502px) | `flex: 1` |
| height | 60px | `height: 60px` |
| padding | 16px | `padding: 16px` |
| background | #FFEA9E | `background: var(--color-primary-gold)` |
| border | none | `border: none` |
| border-radius | 8px | `border-radius: 8px` |
| font-size | 22px | `font-size: 22px` |
| font-weight | 700 | `font-weight: 700` |
| color | #00101A | `color: #00101A` |
| text-align | center | `text-align: center` |
| icon | send arrow (24x24) | Right of text |

**States:**
| State | Changes |
|-------|---------|
| Default | bg: #FFEA9E |
| Hover | bg: #FFF8E1 |
| Disabled | opacity: 0.5, cursor: not-allowed |
| Loading | text replaced with spinner |

---

## Component Hierarchy with Styles

```
ModalOverlay (fixed inset-0, bg: rgba(0,16,26,0.8), flex center, z-50)
└── ModalDialog (w: 752px, bg: #FFF8E1, r: 24px, p: 40px, flex-col, gap: 32px)
    ├── Title (32px, 700, #00101A, center)
    │
    ├── RecipientField (flex row, gap: 16px, items-center)
    │   ├── Label "Người nhận" (22px, 700) + Asterisk (16px, #CF1322)
    │   └── SearchInput (flex-1, h: 56px, p: 16px 24px, r: 8px, border: #998C5F)
    │
    ├── CategoryField (flex col, gap: 4px) — Node: I520:11647;1688:10448
    │   ├── Row (flex row, gap: 16px, items-center)
    │   │   ├── Label "Danh hiệu" (22px, 700) + Asterisk (Noto Sans JP, #CF1322)
    │   │   └── TextInput (flex-1, h: 56px, same style as search)
    │   └── Description hint (16px, #999) "Ví dụ: Người truyền động lực..."
    │
    ├── ContentSection (flex col, gap: 24px) — Node: I520:11647;520:9874
    │
    ├── EditorSection (flex col, gap: 0)
    │   ├── Toolbar (flex row, h: 40px, border: #998C5F, r: 8px 8px 0 0)
    │   │   ├── BoldBtn (10px 16px)
    │   │   ├── ItalicBtn
    │   │   ├── StrikethroughBtn
    │   │   ├── NumberedListBtn
    │   │   ├── LinkBtn
    │   │   ├── QuoteBtn
    │   │   └── CommunityLink (gold text, right-aligned)
    │   └── TextArea (min-h: 200px, p: 16px 24px, r: 0 0 8px 8px, white bg)
    │
    ├── HintText (16px, #00101A, center) — "Bạn có thể '@ + tên'..."
    │
    ├── HashtagSection (flex row, gap: 16px, items-center)
    │   ├── Label "Hashtag" (22px) + Asterisk
    │   ├── AddButton "+ Hashtag" (chip style, h: 48px)
    │   ├── Chips (flex row, gap: 8px) — selected tags with x
    │   └── Note "Tối đa 5" (11px, #999)
    │
    ├── ImageSection (flex row, gap: 16px, items-center)
    │   ├── Label "Image" (22px)
    │   ├── Thumbnails (flex row, gap: 8px) — 80x80, gold border, delete btn
    │   └── AddButton "+ Image" (same chip style)
    │
    ├── AnonymousSection (flex col, gap: 16px)
    │   ├── AnonymousCheckbox (flex row, gap: 16px, items-center)
    │   │   ├── Checkbox (24x24, r: 4px, border: #999)
    │   │   └── Label (22px, #999) "Gửi lời cám ơn và ghi nhận ẩn danh"
    │   └── AnonymousNameField (conditional, shown when checked)
    │       └── TextInput (h: 56px, same style as other inputs)
    │
    └── Footer (flex row, gap: 24px)
        ├── CancelButton (p: 16px 40px, r: 4px, border, gold/10 bg)
        └── SubmitButton (flex-1, h: 60px, r: 8px, gold bg, 22px text)
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
| Modal | width: 100%, height: 100vh, border-radius: 0 (fullscreen) |
| Padding | 16px instead of 40px |
| Field rows | Stack vertically (label above input) |
| Image thumbnails | Smaller (60x60px), scroll horizontally |
| Footer buttons | Stack vertically or equal width |

#### Tablet (768px - 1023px)

| Component | Changes |
|-----------|---------|
| Modal | width: 90vw, max-width: 752px |

#### Desktop (>= 1024px)

| Component | Changes |
|-----------|---------|
| Modal | width: 752px, centered with overlay |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| icon-bold | 24x24 | #00101A | Toolbar bold button |
| icon-italic | 24x24 | #00101A | Toolbar italic button |
| icon-strikethrough | 24x24 | #00101A | Toolbar strikethrough |
| icon-numbered-list | 24x24 | #00101A | Toolbar numbered list |
| icon-link | 24x24 | #00101A | Toolbar link insert |
| icon-quote | 24x24 | #00101A | Toolbar blockquote |
| icon-dropdown | 24x24 | #998C5F | Recipient search dropdown arrow |
| icon-close | 12x12 | #FFFFFF | Image delete button, Cancel button |
| icon-send | 24x24 | #00101A | Submit button send arrow |
| icon-add | 16x16 | #999 | "+ Hashtag" and "+ Image" buttons |
| icon-checkbox | 24x24 | #00101A | Checkbox check mark (when checked) |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Modal Overlay | opacity | 200ms | ease-out | Open/Close |
| Modal Dialog | opacity, transform (scale) | 200ms | ease-out | Open/Close |
| Toolbar Button | background-color | 150ms | ease-in-out | Hover/Active |
| Submit Button | background-color | 150ms | ease-in-out | Hover |
| Cancel Button | background-color | 150ms | ease-in-out | Hover |
| Image Thumbnail | opacity | 200ms | ease-out | Add/Remove |
| Hashtag Chip | opacity, transform | 150ms | ease-out | Add/Remove |

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS | React Component |
|----------------|---------------|----------------|-----------------|
| Modal Overlay | - | `fixed inset-0 z-50 bg-black/80 flex items-center justify-center` | `<WriteKudoModal />` |
| Modal Dialog | I520:11647 | `w-[752px] max-w-[95vw] bg-[#FFF8E1] rounded-3xl p-10 flex flex-col gap-8` | `<WriteKudoDialog />` |
| Title | I520:11647;520:9870 | `text-[32px] font-bold text-center text-[#00101A]` | `<ModalTitle />` |
| Recipient Field | I520:11647;520:9871 | `flex items-center gap-4` | `<RecipientField />` |
| Search Input | I520:11647;520:9873 | `flex-1 h-14 px-6 rounded-lg border border-[#998C5F] bg-white` | `<RecipientSearch />` |
| Category Field | I520:11647;1688:10448 | `flex flex-col gap-1` | `<CategoryField />` |
| Category Input | I520:11647;1688:10437 | `flex-1 h-14 px-6 rounded-lg border border-[#998C5F] bg-white` | `<CategoryInput />` |
| Category Hint | I520:11647;1688:10447 | `text-base text-[#999]` | inline text |
| Toolbar | I520:11647;520:9877 | `flex h-10 border border-[#998C5F] rounded-t-lg` | `<EditorToolbar />` |
| Toolbar Button | I520:11647;520:9881 | `px-4 py-2.5 border-r border-[#998C5F]` | `<ToolbarButton />` |
| Text Area | I520:11647;520:9886 | `w-full min-h-[200px] p-4 bg-white border border-[#998C5F] rounded-b-lg` | `<RichTextEditor />` |
| Hint | I520:11647;520:9887 | `text-base text-center text-[#00101A]` | inline text |
| Hashtag Section | I520:11647;520:9890 | `flex items-center gap-4` | `<HashtagSection />` |
| Tag Chip | I520:11647;662:8595 | `h-12 px-2 rounded-lg border border-[#998C5F] bg-white text-xs text-[#999]` | `<HashtagChip />` |
| Image Section | I520:11647;520:9896 | `flex items-center gap-4` | `<ImageSection />` |
| Image Thumbnail | I520:11647;662:9197 | `w-20 h-20 rounded border border-[#FFEA9E] object-cover relative` | `<ImageThumbnail />` |
| Delete Button | - | `absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#D4271D] rounded-full` | `<DeleteButton />` |
| Checkbox | I520:11647;520:14099 | `w-6 h-6 rounded border border-[#999] bg-white` | `<AnonymousCheckbox />` |
| Anonymous Name | - | `w-full h-14 px-6 rounded-lg border border-[#998C5F] bg-white` (conditional) | `<AnonymousNameField />` |
| Content Section | I520:11647;520:9874 | `flex flex-col gap-6` (24px) | `<ContentSection />` |
| Cancel Button | I520:11647;520:9906 | `px-10 py-4 rounded border border-[#998C5F] bg-gold/10` | `<CancelButton />` |
| Submit Button | I520:11647;520:9907 | `flex-1 h-[60px] rounded-lg bg-[#FFEA9E] text-[22px] font-bold` | `<SubmitButton />` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as project uses TailwindCSS 4.x
- Icons **MUST BE** in **Icon Component** instead of svg files or img tags
- The modal uses Montserrat throughout (not SVN-Gotham) — consistent with the project's primary font
- The toolbar connects visually to the textarea: toolbar has top border-radius (8px 8px 0 0), textarea has bottom border-radius (0 0 8px 8px)
- The "Tiêu chuẩn cộng đồng" link is positioned at the right end of the toolbar row
- The "Danh hiệu" field is visible in the screenshot between recipient and toolbar — it has a description hint below: "Ví dụ: Người truyền động lực cho tôi. Danh hiệu sẽ hiển thị làm tiêu đề Kudos của bạn."
