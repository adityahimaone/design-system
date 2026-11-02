# Meniscus — Case 00, the shelf

**Name.** Meniscus — the curve a liquid makes where it meets its container. The name of the hero,
the name of the mark, the name of the system.

**Category.** A design-system library: fourteen documented cases, each with its own primitives,
mark family and published contrast failures.

**Audience.** Design leads, hiring managers and clients who have ninety seconds to decide whether
the person who built this can build their product. They are scanning, on a laptop, probably at
night, with the page competing against twenty other tabs.

**Use case.** Judge the work fast, then open one case. The shelf must not out-shout the cases it
holds — it has to frame them.

**Promise.** The frame is glass; the work is the colour. Nothing on this page is allowed to be more
interesting than the fourteen covers moving through it.

**Enemy.** The dark portfolio grid: black page, neon accent, a gradient behind the headline, every
card the same 16:9 with a hover lift. It photographs well, and the work disappears into the mood.

**Rejectable sentence.** A smoked-glass shelf whose only colour is the light bending through it and
the fourteen covers passing behind it — and which will not put a single gradient behind the type.

**Track.** Constructed. Fill only, no strokes, no circles, 2–3 primitives.

## Design context

- **Tone.** Precise, quiet, expensive. Not playful, not brutalist, not "AI dashboard".
- **Material.** Smoked glass over graphite: a near-neutral blue-black ground, panes that lift by a
  1px specular edge rather than a shadow, and one warm caustic where the light exits.
- **The one memorable thing.** The hero band: fourteen covers curved round the inside of a cylinder,
  flattening at the centre and swelling as they come past the lens. The system's mark is that curve
  cut into a tile.

## Decisions

| Decision | Because | Not when | Breaks next |
| --- | --- | --- | --- |
| The ground is smoked graphite, not black | Pure black flattens a pane to nothing; #0e1013 leaves room for a 6% white lift to read as glass | A case's own cover is the ground (full-bleed imagery) | Someone "deepens" the ground to #000 for contrast and every pane edge disappears |
| One caustic, warm, and never a gradient | The amber is the only place light exits the glass; a gradient would make it a mood | A case owns the accent — the shelf never recolours a case's own signal | Amber is used as a background wash "for warmth" and the covers stop being the colour |
| Panes lift by a 1px specular edge, not a shadow | Glass has an edge, not a drop shadow; a shadow says "card", an edge says "pane" | Dense tabular UI where a hairline is not enough separation | A `box-shadow: 0 18px 48px` gets added because it "needs depth" |
| The mark is the curve, scooped out of a tile | The hero is a curve; the mark must be the same curve at 16px or the identity is two ideas | The context needs a pictogram — that is a different case | Someone squares off the scoop to make it "cleaner" at 16px and the family splits |

## Assumptions

- Fonts are Google-hosted: Bricolage Grotesque (display) and Schibsted Grotesk (reading). Neither is
  used by any sibling case; the shelf's previous identity used Syne.
- The fourteen case covers are the hero media. Four generated caustic plates alternate with them so
  the band has rhythm and is not a solid strip of screenshots.
