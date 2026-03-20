# Design Style: Dropdown Ngôn Ngữ (Language Selector Dropdown)

**Frame ID**: `721:4942`
**Frame Name**: `Dropdown-ngôn ngữ`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/721:4942
**Extracted At**: 2026-03-20

---

## Design Tokens

### Colors

| Token Name | Hex Value | Opacity | Usage |
|------------|-----------|---------|-------|
| --color-dropdown-bg | #00070C | 100% | Dropdown container background |
| --color-dropdown-border | #998C5F | 100% | Dropdown container border |
| --color-item-selected-bg | rgba(255, 234, 158, 0.20) | 20% | Selected language item background |
| --color-item-hover-bg | rgba(255, 234, 158, 0.10) | 10% | Hover state on language items |
| --color-text-white | #FFFFFF | 100% | Language code text |
| --color-frame-bg | #696969 | 100% | Frame background (context only, not part of component) |

### Typography

| Token Name | Font Family | Size | Weight | Line Height | Letter Spacing | Color | Usage |
|------------|-------------|------|--------|-------------|----------------|-------|-------|
| --text-language-code | Montserrat | 16px | 700 | 24px | 0.15px | #FFFFFF | Language code "VN", "EN" |

### Spacing

| Token Name | Value | Usage |
|------------|-------|-------|
| --dropdown-padding | 6px | Dropdown container internal padding |
| --item-padding | 16px | Language item internal padding (all sides) |
| --item-content-gap | 4px | Gap between flag icon and language code |
| --item-internal-gap | 2px | Gap within button content row |

### Border & Radius

| Token Name | Value | Usage |
|------------|-------|-------|
| --dropdown-radius | 8px | Dropdown container corners |
| --item-radius | 4px | Individual language item (selected) |
| --item-default-radius | 4px | Individual language item (hover/active) |
| --border-dropdown | 1px solid #998C5F | Dropdown container border |

### Shadows

No box-shadows on the dropdown. The dark background and border provide visual separation from the page.

---

## Layout Specifications

### Dropdown Container

| Property | Value | Notes |
|----------|-------|-------|
| width | auto (~122px) | Fits content |
| height | auto (~124px) | Fits 2 items + padding |
| padding | 6px | All sides |
| display | flex column | Vertical stack of items |
| background | #00070C | Dark navy |
| border | 1px solid #998C5F | Gold border |
| border-radius | 8px | Rounded corners |
| position | absolute | Positioned below trigger button |
| z-index | 50 | Above other content |

### Language Item

| Property | Value | Notes |
|----------|-------|-------|
| width | 100% | Fills container width (both items same width) |
| height | 56px | Fixed height |
| padding | 16px | All sides |
| display | flex row | Horizontal layout |
| align-items | center | Vertically centered |
| justify-content | space-between | Content spread |
| border-radius | 4px | On the inner button element |
| gap (container) | 0px | No gap between items — items stack tightly |

> **Note**: Figma shows selected item at 108px and unselected at 110px. This 2px difference is a Figma artifact from the selected item's highlight bg. For implementation, both items should use `width: 100%` to fill the container equally.

### Layout Structure (ASCII)

```
┌─── Dropdown Container (auto, bg: #00070C, border: 1px #998C5F, r: 8px, p: 6px) ──┐
│                                                                                      │
│  ┌─── Selected Item (A.1) (~108x56, bg: rgba(255,234,158,0.20), r: 4px, p: 16px) ─┐│
│  │  🇻🇳 (24x24)  gap:4px  "VN" (16px, 700, white)                                  ││
│  └──────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
│  ┌─── Unselected Item (A.2) (~110x56, bg: transparent, r: 4px, p: 16px) ──────────┐│
│  │  🇬🇧 (24x24)  gap:4px  "EN" (16px, 700, white)                                  ││
│  └──────────────────────────────────────────────────────────────────────────────────┘│
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Style Details

### Dropdown Container (A_Dropdown-List)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | 525:11713 | - |
| display | flex column | `display: flex; flex-direction: column` |
| padding | 6px | `padding: 6px` |
| background | #00070C | `background: var(--color-dropdown-bg)` |
| border | 1px solid #998C5F | `border: 1px solid var(--color-dropdown-border)` |
| border-radius | 8px | `border-radius: 8px` |
| position | absolute | `position: absolute` |
| z-index | 50 | `z-index: 50` |

---

### Selected Language Item (A.1 — tiếng Việt, selected state)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085 | - |
| width | 108px | `width: 108px` |
| height | 56px | `height: 56px` |
| background | rgba(255, 234, 158, 0.20) | `background: rgba(255, 234, 158, 0.20)` |
| border-radius | 2px | `border-radius: 2px` |
| display | flex row | `display: flex; align-items: center` |

#### Inner Content (Button)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821 | - |
| width | 108px | `width: 100%` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex row | `display: flex; align-items: center; justify-content: space-between` |
| border-radius | 4px | `border-radius: 4px` |
| gap (content) | 4px | Between flag and text |

#### Flag Icon (VN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821;186:1709 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| **Component** | VN - Vietnam flag | `178:1019` (component ID) |

#### Language Code Text (VN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6085;186:1821;186:1439 | - |
| width | 25px | auto |
| font-family | Montserrat | `font-family: var(--font-montserrat)` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: white` |
| text-align | center | `text-align: center` |

---

### Unselected Language Item (A.2 — tiếng Anh, default state)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128 | - |
| width | 110px | `width: 110px` |
| height | 56px | `height: 56px` |
| background | transparent | `background: transparent` |
| border-radius | 0px | `border-radius: 0` |
| display | flex row | `display: flex; align-items: center; justify-content: center` |

#### Inner Content (Button)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903 | - |
| width | 110px | `width: 100%` |
| height | 56px | `height: 56px` |
| padding | 16px | `padding: 16px` |
| display | flex row | `display: flex; align-items: center; justify-content: space-between` |
| border-radius | 4px | `border-radius: 4px` |

#### Flag Icon (EN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903;186:1709 | - |
| width | 24px | `width: 24px` |
| height | 24px | `height: 24px` |
| **Component** | GB-NIR - Northern Ireland (UK flag) | `178:967` (component ID) |

#### Language Code Text (EN)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | I525:11713;362:6128;186:1903;186:1439 | - |
| width | 24px | auto |
| font-family | Montserrat | `font-family: var(--font-montserrat)` |
| font-size | 16px | `font-size: 16px` |
| font-weight | 700 | `font-weight: 700` |
| line-height | 24px | `line-height: 24px` |
| letter-spacing | 0.15px | `letter-spacing: 0.15px` |
| color | #FFFFFF | `color: white` |
| text-align | center | `text-align: center` |

---

### Language Item States

Applied to the inner button element (not the outer wrapper). The outer wrapper's border-radius varies in Figma (selected: 2px, unselected: 0px) but the interactive button inside always uses 4px.

| State | Background | Border-Radius | Cursor |
|-------|------------|---------------|--------|
| Default (unselected) | transparent | 4px | pointer |
| Hover | rgba(255, 234, 158, 0.10) | 4px | pointer |
| Selected (active) | rgba(255, 234, 158, 0.20) | 4px | default |
| Focus | rgba(255, 234, 158, 0.10) + outline: 2px solid rgba(255,234,158,0.50) | 4px | pointer |

> **Note on Figma data**: The selected item's outer wrapper shows `borderRadius: 2px` and the unselected shows `0px` in Figma. For implementation, use `4px` radius uniformly on the clickable button element (consistent with the inner Button component).

---

## Component Hierarchy with Styles

```
LanguageSelector (trigger button — already exists in codebase)
└── LanguageDropdown (position: absolute, below trigger)
    └── DropdownContainer (bg: #00070C, border: 1px #998C5F, r: 8px, p: 6px, flex-col)
        ├── LanguageItem[selected] (w: ~108px, h: 56px, bg: rgba(255,234,158,0.20), r: 2px)
        │   └── ItemContent (p: 16px, flex-row, items-center, gap: 4px)
        │       ├── FlagIcon (24x24) — VN flag
        │       └── LanguageCode "VN" (16px, 700, white, Montserrat)
        │
        └── LanguageItem[default] (w: ~110px, h: 56px, bg: transparent)
            └── ItemContent (p: 16px, flex-row, items-center, gap: 4px)
                ├── FlagIcon (24x24) — UK flag
                └── LanguageCode "EN" (16px, 700, white, Montserrat)
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

The dropdown is a small fixed-width overlay that does not change across breakpoints. The positioning relative to the trigger button adapts automatically.

#### Mobile (< 768px)

| Component | Changes |
|-----------|---------|
| Dropdown | Same styling, positioned below trigger. May need right-alignment to avoid overflow. |

#### Tablet & Desktop (≥ 768px)

| Component | Changes |
|-----------|---------|
| Dropdown | No changes — same layout |

---

## Icon Specifications

| Icon Name | Size | Color | Usage |
|-----------|------|-------|-------|
| flag-vn | 24x24 | (flag colors) | Vietnamese language option |
| flag-en (GB-NIR) | 24x24 | (flag colors) | English language option |
| chevron-down | 24x24 | #998C5F | Trigger button indicator (on trigger, not in dropdown) |

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| Dropdown | opacity, transform (translateY) | 150ms | ease-out | Open/Close |
| Language Item | background-color | 150ms | ease-in-out | Hover |

### Dropdown Open Animation
```css
/* Closed */
opacity: 0;
transform: translateY(-4px);
pointer-events: none;

/* Open */
opacity: 1;
transform: translateY(0);
pointer-events: auto;
transition: opacity 150ms ease-out, transform 150ms ease-out;
```

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS | React Component |
|----------------|---------------|----------------|-----------------|
| Dropdown Container | 525:11713 | `flex flex-col p-1.5 bg-[#00070C] border border-[#998C5F] rounded-lg` | `<LanguageDropdown />` |
| Selected Item | I525:11713;362:6085 | `flex items-center h-14 px-4 rounded-sm bg-[rgba(255,234,158,0.20)]` | `<LanguageOption selected />` |
| Unselected Item | I525:11713;362:6128 | `flex items-center h-14 px-4 rounded hover:bg-[rgba(255,234,158,0.10)]` | `<LanguageOption />` |
| VN Flag | I525:11713;362:6085;186:1821;186:1709 | `w-6 h-6` | `<FlagIcon locale="vi" />` |
| EN Flag | I525:11713;362:6128;186:1903;186:1709 | `w-6 h-6` | `<FlagIcon locale="en" />` |
| Language Code | I525:11713;362:6085;186:1821;186:1439 | `text-base font-bold text-white tracking-[0.15px]` | `<span>` |
| Trigger Button | (existing) | See `LanguageSelector.tsx` | `<LanguageSelector />` |

---

## Notes

- All colors should use CSS variables for theming support
- Prefer Tailwind utility classes as the project uses TailwindCSS 4.x
- **Flag icons**: The existing `LanguageSelector.tsx` uses `next/image` with SVG files from `public/icons/` (e.g., `vn-flag.svg`). Constitution Principle II says "Use `next/image` for all images". Since country flags are raster/vector images (not UI icons), `next/image` with SVG files is acceptable. However, if the project establishes flag variants in the Icon component, those should be used instead for consistency with other dropdowns. **See Clarification Needed below.**
- The dropdown uses the project's established gold accent (`#998C5F` border, `#FFEA9E` at 20% for selected state) consistent with other dropdowns in the project
- The component is reusable — it appears on both the Login page and the global Header
- The dropdown's `componentSetId` in Figma is `563:8216` (Dropdown-List) and language items use `186:1695` (language option variants)
- The dropdown should be positioned with `right: 0` relative to the trigger button wrapper to prevent overflow on the right side of the viewport
