#!/usr/bin/env python3
"""Halation — site icon set.

Every icon is the mark on the coral tile, drawn at 8× and downsampled, so the
whole set shares one geometry. Two drawings ship, per the brand rule:

  full     the mark as published (36 × 44 pane, four ribs, 5 × 64 spill)
  compact  the 16px drawing (solid pane, 8-unit spill) — ribs merge below 24px

Output goes to public/ so the app can reference it from the document head.

    python3 brand/halation/icons.py
"""

from PIL import Image, ImageDraw
import os

INK = (28, 11, 16)
CORAL = (255, 74, 52)
CHALK = (251, 234, 230)

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
OUT = os.path.abspath(os.path.join(ROOT, "public"))

SS = 8  # supersample factor


def rounded_mask(size, radius):
    m = Image.new("L", (size * SS, size * SS), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle([0, 0, size * SS - 1, size * SS - 1], radius=radius * SS, fill=255)
    return m


def draw_mark(size, mode="full", ground=CORAL, pane=INK, spill=CHALK,
              radius=14.0, inset=0.0, bleed=False):
    """Draw the mark on a ground. `inset` scales the mark inside the tile."""
    px = size * SS
    im = Image.new("RGBA", (px, px), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)

    # ground: either a rounded tile or a full bleed square (iOS / maskable)
    if bleed:
        d.rectangle([0, 0, px, px], fill=ground + (255,))
    else:
        d.rounded_rectangle([0, 0, px - 1, px - 1], radius=radius * SS, fill=ground + (255,))

    # the mark lives on a 64 grid; k converts grid units to supersampled pixels.
    # its visual bbox is x 8 → 55, y 0 → 64, so centre that box in the tile.
    k = (px / 64.0) * (1.0 - inset)
    ox = (px - 47 * k) / 2 - 8 * k
    oy = (px - 64 * k) / 2

    def X(v):
        return ox + v * k

    def Y(v):
        return oy + v * k

    if mode == "full":
        d.rectangle([X(8), Y(10), X(44), Y(54)], fill=pane + (255,))
        for rx in (12, 20, 28, 36):
            d.rectangle([X(rx), Y(16), X(rx + 4), Y(48)], fill=ground + (255,))
        d.rectangle([X(50), Y(0), X(55), Y(64)], fill=spill + (255,))
    else:  # compact — the drawing that survives 16px
        d.rectangle([X(10), Y(10), X(42), Y(54)], fill=pane + (255,))
        d.rectangle([X(48), Y(4), X(56), Y(60)], fill=spill + (255,))

    if not bleed:
        mask = rounded_mask(size, radius)
        out = Image.new("RGBA", (px, px), (0, 0, 0, 0))
        out.paste(im, (0, 0), mask)
        im = out

    return im.resize((size, size), Image.LANCZOS)


def save(im, name):
    path = os.path.join(OUT, name)
    im.save(path, optimize=True)
    print(f"  {name:<26} {im.size[0]}×{im.size[1]}  {os.path.getsize(path) // 1024 or '<1'} KB")


def main():
    print("Halation — site icons")
    # favicons: the compact drawing, because 16 and 32 are where the ribs collapse
    save(draw_mark(16, "compact", radius=3.5, inset=0.2), "favicon-16.png")
    save(draw_mark(32, "compact", radius=7, inset=0.2), "favicon-32.png")
    save(draw_mark(48, "full", radius=10.5, inset=0.22), "favicon-48.png")
    # apple: full bleed, iOS applies its own mask, mark inset for the safe zone
    save(draw_mark(180, "full", radius=0, inset=0.34, bleed=True), "apple-touch-icon.png")
    save(draw_mark(192, "full", radius=42, inset=0.28), "icon-192.png")
    save(draw_mark(512, "full", radius=112, inset=0.28), "icon-512.png")
    # maskable: 40% safe zone, full bleed
    save(draw_mark(512, "full", radius=0, inset=0.46, bleed=True), "icon-maskable-512.png")


if __name__ == "__main__":
    main()
