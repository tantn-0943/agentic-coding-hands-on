# Design Style: Like Kudo (Heart)

**Frame ID**: `6384` (sub-feature of `2940:13431`)
**Frame Name**: `Like Kudo`
**Figma Link**: https://momorph.ai/files/9ypp4enmFmdK3YAFJLIu6C/frames/6384
**Extracted At**: 2026-03-24

---

## Design Tokens

### Colors

| Token Name | Hex Value | Usage |
|------------|-----------|-------|
| --color-heart-red | #F17676 | Liked heart icon |
| --color-text-muted | #999999 | Unliked heart icon + count (default) |
| --color-text-white | #FFFFFF | Heart count text (default variant) |
| --color-text-dark | #00101A | Heart count text (highlight variant) |

### Typography

| Variant | Font | Size | Weight | Line Height | Color |
|---------|------|------|--------|-------------|-------|
| Default count | SVN-Gotham | 16px | 500 | 24px | #FFFFFF |
| Highlight count | SVN-Gotham | 24px | 400 | 32px | #00101A |

---

## Component Style Details

### HeartButton (Default — dark background cards)

| Property | Value | CSS |
|----------|-------|-----|
| **Node ID** | `I3127:21871;256:5175` (from C.4.1_Hearts) |
| display | flex | `display: flex` |
| align-items | center | `align-items: center` |
| gap | 6px | `gap: 6px` |
| cursor | pointer | `cursor: pointer` |
| transition | transform 200ms | `transition: transform 200ms ease-out` |

**Icon:**
| Property | Value |
|----------|-------|
| name (not liked) | heart-outline |
| name (liked) | heart-filled |
| size | 20x20 |
| color (not liked) | #999 |
| color (liked) | #F17676 |

**Count Text:**
| Property | Value |
|----------|-------|
| font-family | SVN-Gotham (fallback: Montserrat) |
| font-size | 16px |
| font-weight | 500 |
| color | #FFFFFF |
| format | locale string (e.g., "1,000") |

**States:**

| State | Icon | Count Color | Other |
|-------|------|-------------|-------|
| Not liked | heart-outline, #999 | #FFF | Normal cursor |
| Liked | heart-filled, #F17676 | #FFF | Scale animation |
| Disabled (own kudos) | heart-outline, #999 | #FFF | opacity: 0.5, cursor: not-allowed |
| Hover | — | — | scale: 1.05 |
| Active (clicking) | — | — | scale: 0.95 |

---

### HeartButton (Highlight — light background cards)

Same layout as default, but with different count text styling:

| Property | Value | CSS |
|----------|-------|-----|
| count font-size | 24px | `font-size: 24px` |
| count font-weight | 400 | `font-weight: 400` |
| count color | #00101A | `color: #00101A` |

All icon styles remain the same.

---

## Layout Structure (ASCII)

```
HeartButton (flex, items-center, gap-6px)
├── Icon (20x20)
│   ├── heart-outline (not liked, #999)
│   └── heart-filled (liked, #F17676)
└── Count Text
    ├── Default: 16px/500/#FFF
    └── Highlight: 24px/400/#00101A
```

---

## Animation & Transitions

| Element | Property | Duration | Easing | Trigger |
|---------|----------|----------|--------|---------|
| HeartButton | transform (scale) | 200ms | ease-out | Click |
| Icon color | color | instant | — | State change |

**Click animation sequence:**
1. scale(1) → scale(1.05) on hover
2. scale(0.95) on mousedown
3. scale(1) on release
4. Icon swaps from outline↔filled instantly

---

## Implementation Mapping

| Design Element | Figma Node ID | Tailwind / CSS | React Component |
|----------------|---------------|----------------|-----------------|
| Heart container | I3127:21871;256:5175 | `flex items-center gap-1.5 cursor-pointer` | `<HeartButton />` |
| Heart icon | — | `w-5 h-5` | `<Icon name="heart-outline/filled" />` |
| Heart count | — | `text-base font-medium text-white` | `<span>` |

---

## Responsive Specifications

No responsive changes — HeartButton is consistent across all breakpoints. The only variation is the `variant` prop (default vs highlight) which changes count text styling.

---

## Notes

- Icon **MUST** be rendered via the `<Icon>` component, not as img/svg tags
- Font `SVN-Gotham` falls back to `Montserrat` via CSS variable `--font-gotham`
- The UNIQUE constraint `(kudos_id, user_id)` on the `hearts` table prevents duplicate likes
- RLS policy blocks self-liking: `auth.uid() != (SELECT sender_id FROM kudos WHERE id = kudos_id)`
