# Screen Flow

File key: `9ypp4enmFmdK3YAFJLIu6C`

This document describes the navigation flows, entry conditions, and exit targets for each screen in the project.

---

## Countdown - Prelaunch

- **Frame ID:** `2268:35127`
- **Status:** spec
- **Purpose:** A pre-launch holding page displayed before the main application goes live. Shows a live countdown timer (days, hours, minutes) to the launch date, along with a background media image and awards/navigation information links.

**Entry Conditions:**
- User visits the application URL before the official launch date/time.
- The system determines the current time is before the configured launch timestamp.

**Exit Targets:**
- Homepage SAA (`2167:9026`) — automatically redirected (or user navigates) once the countdown reaches zero and the platform goes live.
- Login (`662:14387`) — if authentication is triggered or a direct link is followed while the countdown is still active.

**Key Flows:**
1. **Waiting state:** User lands on this page; countdown timer ticks down in real time (Days / Hours / Minutes units displayed as flip-style digit tiles).
2. **Launch reached:** Countdown expires → system redirects to the live Homepage SAA.
3. **Navigation links:** "Awards Information Navigation Links" text element may surface informational links or anchor navigation before launch.

**UI Components (from node tree):**
- `MM_MEDIA_BG Image` — full-background media/image layer.
- `Cover` — overlay rectangle (dimming/branding layer).
- `Countdown time` — container holding the countdown label and time units.
  - `1_Days` — two-digit tile display for days remaining.
  - `2_Hours` — two-digit tile display for hours remaining.
  - `3_Minutes` — two-digit tile display for minutes remaining.
- `Awards Information Navigation Links` — text/link area for supplementary navigation.

---

## Related Screens (same file)

| Frame ID | Screen Name | Status |
|---|---|---|
| `2268:35127` | Countdown - Prelaunch page | spec |
| `2167:9026` | Homepage SAA | spec |
| `662:14387` | Login | spec |
| `520:11602` | Viết Kudo | spec |
| `2940:13431` | Sun* Kudos - Live board | spec |
| `313:8436` | Hệ thống giải | spec |
| `1466:7676` | Open secret box - chưa mở | spec |
| `3204:6051` | Thể lệ UPDATE | spec |
| `1002:12917` | Addlink Box | spec |
| `721:5580` | Dropdown Hashtag filter | spec |
| `1002:13013` | Dropdown list hashtag | spec |
| `721:4942` | Dropdown-ngôn ngữ | spec |
| `721:5684` | Dropdown Phòng ban | spec |
| `721:5223` | Dropdown-profile | spec |
| `721:5277` | Dropdown-profile Admin | spec |
| `313:9137` | Floating Action Button - phim nổi chức năng | spec |
| `313:9139` | Floating Action Button - phim nổi chức năng 2 | spec |
