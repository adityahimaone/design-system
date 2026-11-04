#!/usr/bin/env python3
"""
Outline the "Kanon" wordmark from Instrument Serif — same pipeline as the
Serenica lockup: real glyph contours, no live <text>, ink baked per file.

  python3 scripts/build-kanon-wordmark.py
"""
import json
import os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, "public/brand/serenica/fonts/InstrumentSerif-Regular.woff2")
OUT = os.path.join(ROOT, "public/brand/kanon")
os.makedirs(OUT, exist_ok=True)

TEXT = "Kanon"
TRACK = -14          # letter-spacing in font units (slight optical tightening)
SIZE = 1000          # font units per em

font = TTFont(FONT, fontNumber=0)
glyph_set = font.getGlyphSet()
cmap = font.getBestCmap()
upem = font["head"].unitsPerEm
hmtx = font["hmtx"]

# kerning
kern = {}
if "kern" in font:
    for st in font["kern"].kernTables:
        for pair, val in st.kernTable.items():
            kern[pair] = val
GPOS_pairs = {}
try:
    gpos = font["GPOS"].table
    for lookup in gpos.LookupList.Lookup:
        for sub in lookup.SubTable:
            if sub.LookupType == 2 or sub.LookupType == 9:
                continue
            if hasattr(sub, "PairSet") and sub.PairSet:
                for i, ps in enumerate(sub.PairSet):
                    left = sub.Coverage.glyphs[i]
                    for rec in ps.PairValueRecord:
                        v = getattr(rec.Value1, "XAdvance", 0) if rec.Value1 else 0
                        if v:
                            GPOS_pairs[(left, rec.SecondGlyph)] = v
except Exception:
    pass


def pair_kern(a, b):
    ka, kb = cmap[ord(a)], cmap[ord(b)]
    return GPOS_pairs.get((ka, kb), kern.get((ka, kb), 0))


paths = []
x = 0.0
prev = None
for ch in TEXT:
    gname = cmap[ord(ch)]
    if prev is not None:
        x += pair_kern(prev, ch)
    pen = SVGPathPen(glyph_set)
    # flip Y into SVG space at the end; collect in font units now
    glyph_set[gname].draw(pen)
    d = pen.getCommands()
    if d:
        paths.append((d, x))
    x += hmtx[gname][0] + TRACK
    prev = ch

# Ink bounds
from fontTools.pens.boundsPen import BoundsPen

minx, miny, maxx, maxy = 1e9, 1e9, -1e9, -1e9
xx = 0.0
prev = None
for ch in TEXT:
    gname = cmap[ord(ch)]
    if prev is not None:
        xx += pair_kern(prev, ch)
    bp = BoundsPen(glyph_set)
    glyph_set[gname].draw(bp)
    if bp.bounds:
        b = bp.bounds
        minx = min(minx, b[0] + xx)
        maxx = max(maxx, b[2] + xx)
        miny = min(miny, b[1])
        maxy = max(maxy, b[3])
    xx += hmtx[gname][0] + TRACK
    prev = ch

PAD = 0
W = maxx - minx
H = maxy - miny
# baseline sits at maxy below the top; translate so ink starts at 0,0 and flip Y
def make_svg(fill, label, w_css):
    h_css = round(w_css * H / W, 2)
    body = []
    for d, gx in paths:
        body.append(
            f'    <path transform="translate({(gx - minx):.2f} {maxy:.2f}) scale(1 -1)" d="{d}"/>'
        )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.0f} {H:.0f}" '
        f'width="{w_css}" height="{h_css}" role="img" aria-label="{label}">'
        f'<g fill="{fill}">\n' + "\n".join(body) + "\n</g></svg>\n"
    )

INK = "#11140D"
PAPER = "#F4F0E6"

with open(os.path.join(OUT, "wordmark.svg"), "w") as f:
    f.write(make_svg(INK, "Kanon", 260))
with open(os.path.join(OUT, "wordmark-reverse.svg"), "w") as f:
    f.write(make_svg(PAPER, "Kanon, reverse", 260))

print(json.dumps({
    "text": TEXT,
    "ink_w": round(W, 2),
    "ink_h": round(H, 2),
    "ratio": round(W / H, 4),
    "glyphs": len(paths),
}, indent=2))
