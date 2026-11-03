---
version: alpha
name: "Halation"
description: "Light does not stop at the edge of what it lights."
colors:
  porcelain: "#FDF1EC"
  shell: "#FFFAF7"
  wash: "#F8DCD8"
  ink: "#1C0B10"
  mute: "#74545F"
  coral: "#FF4A34"
  coral-deep: "#B01F2D"
  ember: "#F2892F"
  lilac: "#CBB0D8"
  obsidian: "#0B0409"
  wine: "#240309"
  chalk: "#FBEAE6"
  mute-night: "#A98E97"
  coral-light: "#FF8F7D"
  crimson: "#8F1026"
  moss: "#24604B"
  danger-night: "#FF9AA6"
  success-night: "#86D3AE"
  primary: "#0B0409"
  neutral: "#FFFAF7"
  tertiary: "#FF4A34"
  secondary: "#74545F"
typography:
  display:
    fontFamily: "Syne"
  reading:
    fontFamily: "Schibsted Grotesk"
  mono:
    fontFamily: "Geist Mono"
rounded:
  rib: "3px"
  crop: "8px"
  pane: "14px"
  sheet: "22px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "72px"
  9: "112px"
omitted:
  - section: components
    reason: "component tokens live in the case CSS module, not tokens.json"
---

# Halation

## Overview

Light does not stop at the edge of what it lights.

Generated from `features/halation/tokens.json`; edit the tokens, not this file.

## Colors

- **porcelain (#FDF1EC):** Core · page ground, the warm light surface
- **shell (#FFFAF7):** Core · solid plate under small type
- **wash (#F8DCD8):** Core · raised pane, one tint step over the ground
- **ink (#1C0B10):** Core · body ink and the pane body
- **mute (#74545F):** Core · secondary text, metadata, labels
- **coral (#FF4A34):** Signal · the escaping light — graphic only, never type on porcelain
- **coral-deep (#B01F2D):** Signal · the same light at text weight
- **ember (#F2892F):** Material · second stop of the spectrum
- **lilac (#CBB0D8):** Material · third, cool stop of the spectrum
- **obsidian (#0B0409):** Night · page ground, the blue-black the ember falls into
- **wine (#240309):** Night · solid plate and pane body
- **chalk (#FBEAE6):** Night · body ink
- **mute-night (#A98E97):** Night · secondary text
- **coral-light (#FF8F7D):** Night · the signal, lifted so it reads on wine
- **crimson (#8F1026):** State · error, cooler than the signal so it is not mistaken for brand
- **moss (#24604B):** State · success, the palette's only cool note
- **danger-night (#FF9AA6):** State · error on wine
- **success-night (#86D3AE):** State · success on wine

Role aliases added for tooling: `primary` = obsidian, `neutral` = shell, `tertiary` = coral, `secondary` = mute.

## Typography

- **display:** Syne.
- **reading:** Schibsted Grotesk.
- **mono:** Geist Mono.

