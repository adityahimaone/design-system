# DESIGN.md — TAVOLA (Case 16)
> Around the table · Coastal lunch in afternoon light

Tavola is an unhurried coastal Mediterranean dining identity and interactive design system. Built with ivory linen tablecloth surfaces, sun-baked limestone terraces, glazed porcelain dinnerware, and low afternoon Mediterranean sun shadows.

## 3-Axis Synthesis Summary
- **Surface Tactility:** Woven Ivory Linen & Sunlit Specular Sea Glass (fine slub weave `#FAF6EE`, limestone `#F2ECE0`, terracotta `#D85A38`).
- **Spatial Density:** Editorial Balanced (generous margins, 12-column asymmetric dining rhythm, unhurried leading).
- **Corner & Stroke Physics:** Precision Organic (concentric nested radii `R_outer = R_inner + padding`, 1px linen thread hairlines, low-angle shadows).

## The Kuwayama Mark
The mark synthesizes a communal round table intersecting an afternoon sun arc with a 45° angled light ray cut (`viewBox="0 0 64 64"`, compound filled vector with zero circles).

## Dual-Scope Palette
| Token | Day Light (Afternoon Terrace) | Night Dark (Wine Cellar) | Target WCAG |
| :--- | :--- | :--- | :--- |
| `--tv-bg-canvas` | `#FAF6EE` (Linen Ivory) | `#161311` (Dusk Horizon) | Ground |
| `--tv-bg-surface` | `#F2ECE0` (Limestone) | `#201B18` (Cellar Stave) | Cards |
| `--tv-bg-elevated` | `#FFFFFF` (Porcelain) | `#2C2522` (Cypress Tile) | Plates |
| `--tv-ink-primary` | `#221A15` (Roast Espresso) | `#F5F1E8` (Linen Starlight) | AAA (14.8:1) |
| `--tv-ink-secondary` | `#6E5D52` (Weathered Cedar) | `#B3A898` (Sea Mist) | AA (5.4:1) |
| `--tv-accent-primary` | `#D85A38` (Blood Orange) | `#E86D48` (Warm Terracotta) | AA Large (4.6:1) |
| `--tv-accent-secondary` | `#2A62B6` (Sea Cobalt) | `#4D85DE` (Luminous Azure) | AA (6.2:1) |

## Typographic Stack
- **Display:** Fraunces (warm, optical-sized humanist serif)
- **UI Sans:** Plus Jakarta Sans (crisp, modern legible neutral)
- **Mono:** JetBrains Mono (cellar ledger & table coordinates)