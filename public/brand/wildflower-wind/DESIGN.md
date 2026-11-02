---
version: alpha
name: "Wildflower Wind"
description: "A meadow, caught in the act of scattering."
colors:
  ground: "#F7F0E4"
  plate: "#FFFCF6"
  ink: "#22181B"
  muted: "#6C5B57"
  wash: "#F2DBE8"
  signal: "#7C2A76"
  leaf: "#4F6238"
  gold: "#C8873A"
  sky: "#A9C4DC"
  primary: "#22181B"
  neutral: "#FFFCF6"
  tertiary: "#7C2A76"
  secondary: "#6C5B57"
typography:
  display-1:
    fontFamily: "Instrument Serif"
    fontWeight: 400
  display-2:
    fontFamily: "Instrument Serif"
    fontWeight: 400
  display-3:
    fontFamily: "Instrument Serif"
    fontWeight: 400
  title-1:
    fontFamily: "Instrument Sans"
    fontWeight: 600
  title-2:
    fontFamily: "Instrument Sans"
    fontWeight: 600
  body-1:
    fontFamily: "Instrument Sans"
    fontWeight: 400
  body-2:
    fontFamily: "Instrument Sans"
    fontWeight: 400
  caption:
    fontFamily: "Instrument Sans"
    fontWeight: 400
  label:
    fontFamily: "Instrument Sans"
    fontWeight: 600
  mono:
    fontFamily: "IBM Plex Mono"
    fontWeight: 400
  figure:
    fontFamily: "Instrument Sans"
    fontWeight: 500
rounded:
  xs: "0px"
  sm: "2px"
  md: "6px"
  lg: "12px"
  pill: "999px"
spacing:
  1: "2px"
  2: "4px"
  3: "8px"
  4: "12px"
  5: "16px"
  6: "24px"
  7: "32px"
  8: "48px"
  9: "64px"
  10: "96px"
  11: "128px"
omitted:
  - section: components
    reason: "component tokens live in the case CSS module, not tokens.json"
---

# Wildflower Wind

## Overview

A meadow, caught in the act of scattering.

Generated from `features/wildflower-wind/tokens.json`; edit the tokens, not this file.

## Colors

- **ground (#F7F0E4):** Sun-bleached stock. The page.
- **plate (#FFFCF6):** A sheet laid on the stock. Reading only.
- **ink (#22181B):** The shadow under the flowers. All text.
- **muted (#6C5B57):** Metadata, captions, second voice.
- **wash (#F2DBE8):** Petal tint. Surface only, never text.
- **signal (#7C2A76):** Cosmos, dried. The one accent — ≤8% of a viewport.
- **leaf (#4F6238):** Plate ink 2. Graphic and large type only.
- **gold (#C8873A):** Plate ink 3. Graphic only — fails as text.
- **sky (#A9C4DC):** Plate ink 4. Surface only — fails as text.

Role aliases added for tooling: `primary` = ink, `neutral` = plate, `tertiary` = signal, `secondary` = muted.

## Typography

- **display-1:** Instrument Serif.
- **display-2:** Instrument Serif.
- **display-3:** Instrument Serif.
- **title-1:** Instrument Sans.
- **title-2:** Instrument Sans.
- **body-1:** Instrument Sans.
- **body-2:** Instrument Sans.
- **caption:** Instrument Sans.
- **label:** Instrument Sans.
- **mono:** IBM Plex Mono.
- **figure:** Instrument Sans.

