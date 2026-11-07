#!/usr/bin/env python3
"""
build-gloaming-plates.py — explore ONE supplied painting into a whole material library.

Source: brand/gloaming/blue-hour-master.jpg (the user's blue-hour pastoral plate,
        1511 x 851). Nothing in this script invents a colour: every stop, swatch
        and dot is sampled from the master file.

Writes into public/brand/gloaming/:

  blue-hour.jpg            full plate, the hero banner
  plate-horizon.jpg        the sky -> warm band -> far ridge transition
  plate-ridge.jpg          distant violet ridges and the right-hand oak
  plate-oaks.jpg           sunlit hill and oak clusters, left
  plate-meadow.jpg         the lupine foreground and the grazing line
  plate-meadow-detail.jpg  a tight crop of the flower texture
  plate-night.jpg          the same frame graded 40 minutes later (night scope)
  field-lupine.svg         a procedural halftone: every dot sampled from the meadow
  horizon-ramp.svg         the eleven measured sky/land strips as one artifact
  plate-source.json        the measured values, kept so the tokens can be re-derived

  node scripts/build-gloaming.mjs  reads plate-source.json for the palette.
  python3 scripts/build-gloaming-plates.py
"""
from __future__ import annotations

import colorsys
import json
import random
from collections import Counter
from pathlib import Path

from PIL import Image, ImageEnhance

ROOT = Path(__file__).resolve().parent.parent
MASTER = ROOT / "brand/gloaming/blue-hour-master.jpg"
OUT = ROOT / "public/brand/gloaming"
OUT.mkdir(parents=True, exist_ok=True)

im = Image.open(MASTER).convert("RGB")
W, H = im.size


def crop_frac(name: str, x0: float, y0: float, x1: float, y1: float, quality: int = 88):
    box = (round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H))
    plate = im.crop(box)
    plate.save(OUT / name, "JPEG", quality=quality, optimize=True, progressive=True)
    return name, plate.size


def median_hex(box: Image.Image) -> str:
    small = box.resize((80, 8))
    px = sorted(small.getdata(), key=lambda p: sum(p))
    c = px[len(px) // 2]
    return f"#{c[0]:02X}{c[1]:02X}{c[2]:02X}"


# ---------------------------------------------------------------- 01 · plates
im.save(OUT / "blue-hour.jpg", "JPEG", quality=90, optimize=True, progressive=True)

plates = [
    crop_frac("plate-horizon.jpg", 0.00, 0.38, 1.00, 0.64),
    crop_frac("plate-ridge.jpg", 0.44, 0.50, 1.00, 0.74),
    crop_frac("plate-oaks.jpg", 0.00, 0.44, 0.46, 0.80),
    crop_frac("plate-meadow.jpg", 0.00, 0.70, 1.00, 1.00),
    crop_frac("plate-meadow-detail.jpg", 0.04, 0.79, 0.42, 1.00, quality=92),
]

# Night scope: the same frame 40 minutes later. Cool the shadows, hold the last
# warm band, then lift a little blue into the darks so it stays a photograph
# and not a black rectangle. Deterministic, no second source image.
night = im.copy()
px = night.load()
for y in range(H):
    # the horizon keeps more of its warmth than the zenith or the foreground
    horizon_weight = max(0.0, 1.0 - abs(y / H - 0.545) / 0.10)
    for x in range(W):
        r, g, b = px[x, y]
        f = 0.40 + 0.12 * horizon_weight
        r, g, b = r * f, g * f, b * f
        cool = 0.20 * (1.0 - horizon_weight * 0.55)
        r = r * (1 - cool) + 22 * cool
        g = g * (1 - cool) + 32 * cool
        b = b * (1 - cool) + 62 * cool
        px[x, y] = (int(r), int(g), int(b))
night = ImageEnhance.Contrast(night).enhance(1.08)
night.save(OUT / "plate-night.jpg", "JPEG", quality=88, optimize=True, progressive=True)

# --------------------------------------------------- 02 · measured strip ledger
STRIPS = [
    ("zenith", 0.00, 0.08),
    ("sky high", 0.14, 0.22),
    ("sky mid", 0.30, 0.38),
    ("sky low", 0.42, 0.48),
    ("glow", 0.48, 0.53),
    ("warm band", 0.53, 0.575),
    ("far ridge", 0.60, 0.65),
    ("hills", 0.66, 0.73),
    ("herd line", 0.74, 0.79),
    ("meadow", 0.82, 0.90),
    ("foreground", 0.92, 1.00),
]
strips = []
for label, y0, y1 in STRIPS:
    strip = im.crop((round(W * 0.30), round(H * y0), round(W * 0.70), round(H * y1)))
    strips.append({"name": label, "y": [y0, y1], "hex": median_hex(strip)})

# Global 14-colour reduction, kept as provenance for the twelve primitives.
reduced = im.resize((378, 213)).quantize(colors=14, method=Image.Quantize.MEDIANCUT).convert("RGB")
freq = Counter(reduced.getdata())
global_palette = [
    {"hex": f"#{c[0]:02X}{c[1]:02X}{c[2]:02X}", "share": round(n * 100 / sum(freq.values()), 2)}
    for c, n in freq.most_common(14)
]

# Violet lupine pixels: the flower is a field of dots, not a flat swatch.
meadow = im.crop((0, round(H * 0.74), W, H)).resize((378, 100))
violets = []
for p in meadow.getdata():
    hh, ss, vv = colorsys.rgb_to_hsv(*(v / 255 for v in p))
    if 0.66 < hh < 0.82 and ss > 0.13 and vv > 0.32:
        violets.append(p)
violet_mean = (
    f"#{sum(p[0] for p in violets) // len(violets):02X}"
    f"{sum(p[1] for p in violets) // len(violets):02X}"
    f"{sum(p[2] for p in violets) // len(violets):02X}"
)

# ------------------------------------------ 03 · procedural lupine halftone SVG
# 80 x 22 dots. Each dot keeps the colour the painting actually had at that
# point; its radius grows with how violet that point was. The result is a
# surface that is derived from the asset rather than merely cropped from it.
COLS, ROWS = 80, 22
rand = random.Random(2507)
field = im.crop((0, round(H * 0.755), W, H)).resize((COLS, ROWS))
dots = []
for row in range(ROWS):
    for col in range(COLS):
        r, g, b = field.getpixel((col, row))
        hh, ss, vv = colorsys.rgb_to_hsv(r / 255, g / 255, b / 255)
        violet = 1.0 if (0.66 < hh < 0.84) else 0.25
        weight = min(1.0, ss * 1.9) * violet
        radius = 0.9 + weight * 2.5 + (row / ROWS) * 0.5
        x = col * 12 + 6 + rand.uniform(-2.6, 2.6)
        y = row * 12 + 6 + rand.uniform(-2.4, 2.4)
        dots.append(
            f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{radius:.2f}" '
            f'fill="#{r:02X}{g:02X}{b:02X}" opacity="{0.55 + weight * 0.45:.2f}"/>'
        )
field_svg = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 264" width="960" height="264" '
    'role="img" aria-label="A procedural halftone of the lupine meadow, every dot sampled from the source painting">\n'
    '<rect width="960" height="264" fill="#D8A57C"/>\n' + "\n".join(dots) + "\n</svg>\n"
)
(OUT / "field-lupine.svg").write_text(field_svg, encoding="utf-8")

# --------------------------------------------- 04 · the horizon ramp artifact
stops = "".join(
    f'<stop offset="{i / (len(strips) - 1) * 100:.1f}%" stop-color="{s["hex"]}"/>'
    for i, s in enumerate(strips)
)
ramp = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 640" width="240" height="640" '
    'role="img" aria-label="Eleven measured colour strips from the blue-hour plate">\n'
    '  <defs><linearGradient id="gl-ramp" x1="0" y1="0" x2="0" y2="1">'
    + stops
    + '</linearGradient></defs>\n'
    '  <rect width="240" height="640" fill="url(#gl-ramp)"/>\n'
    + "".join(
        f'  <line x1="0" y1="{i * 640 / len(strips):.1f}" x2="240" '
        f'y2="{i * 640 / len(strips):.1f}" stroke="#FFFFFF" stroke-opacity=".28"/>\n'
        for i in range(len(strips) + 1)
    )
    + "</svg>\n"
)
(OUT / "horizon-ramp.svg").write_text(ramp, encoding="utf-8")

# ------------------------------------------------------------- 05 · provenance
source = {
    "master": "brand/gloaming/blue-hour-master.jpg",
    "size": [W, H],
    "strips": strips,
    "globalPalette": global_palette,
    "lupine": {
        "sampleCount": len(violets),
        "mean": violet_mean,
        "top": [f"#{p[0]:02X}{p[1]:02X}{p[2]:02X}" for p, _ in Counter(violets).most_common(8)],
    },
    "plates": [p[0] for p in plates]
    + ["blue-hour.jpg", "plate-night.jpg", "field-lupine.svg", "horizon-ramp.svg"],
}
(OUT.parent / "gloaming" / "plate-source.json").write_text(
    json.dumps(source, indent=2) + "\n", encoding="utf-8"
)

print(f"gloaming: {len(source['plates'])} plates from one 1511x851 master")
for s in strips:
    print(f"  {s['name']:12s} {s['hex']}")
print(f"  lupine mean {violet_mean} across {len(violets)} sampled pixels")
print(f"  halftone {COLS * ROWS} dots -> field-lupine.svg")
