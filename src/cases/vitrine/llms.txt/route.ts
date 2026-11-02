import {
  DITHER_AUDIT,
  GAPS,
  MARK_FAMILIES,
  MARK_GATE,
  OUTPUT_CONTRACT,
  SKILL_RESOURCES,
  STORY_BEATS,
} from '@/features/vitrine/audit'
import tokens from '@/features/vitrine/tokens.json'

const table = (head: string[], rows: string[][]) =>
  [
    `| ${head.join(' | ')} |`,
    `| ${head.map(() => '---').join(' | ')} |`,
    ...rows.map((row) => `| ${row.join(' | ')} |`),
  ].join('\n')

export function GET() {
  const dark = Object.fromEntries(
    tokens.semantic.dark.map((token) => [token.name, token]),
  ) as Record<string, { value: string; resolved?: string; role: string }>

  const brand = `# Vitrine — design system, brand guide and audit (v2.5)

> A glass case for a low-resolution light.

Vitrine is the second case in the Sunnyside portfolio: a glass-and-dither
design system documented at https://adityahimaone.space/design-system/vitrine. It is a
separate system from Sunnyside (paper, cobalt, sun). The source of truth is the
live route and the files below; this Markdown twin is for agents and for readers
who do not run JavaScript.

## 1. The one idea

**The case and the grain.** A vitrine holds one lit object; the halftone label
is the only print. In the interface, glass is the container and dither is the
information layer. The glass never becomes the content, and the dither never
sits under the words that explain it.

- Essence: a glass case for a low-resolution light.
- Promise: depth without fog.
- Family: architectural monogram.
- Gate: v2.3 constructed — zero circle, fill-only, 2–4 primitives, one accent.
- Voice: precise, lit, unhurried. Museum labels, not marketing.
- Not this: a frosted card with an unreadable paragraph, a gradient blob, a
  1-bit retro toy, or a Sunnyside re-skin.

## 2. Mark

The mark is **Half-light V**: one architectural monogram split vertically at
x32. The ink arm is the glass, the Signal arm is the light; the plinth is flat.
Two solid primitives in the primary, one in the compact. No stroke, no circle,
no detached accent.

| Property | Value |
| --- | --- |
| ViewBox | 64 × 64 |
| Family | Architectural monogram |
| Glass arm | M8 8H24L32 34V56H24Z |
| Light arm | M32 34L40 8H56L40 56H32Z, Signal |
| Compact path | M6 6H22L32 32L42 6H58L42 58H22Z |
| Primitive count | 2 primary / 1 compact |
| Frame | 8 units |
| Vertex | 32 / 34 |
| Plinth | 16 × 22 units |
| Arms | 16 units |
| Bbox | 48 × 48 units |
| Full mark minimum | 32px |
| Compact minimum | 16px |
| Clear space | Half the mark height on every side |

Files: \`public/brand/vitrine/mark.svg\`, \`mark-reverse.svg\`,
\`mark-compact.svg\`, \`mark-compact-reverse.svg\`, \`glyph.svg\`,
\`mark-mono.svg\`.

### Five families, one material

${table(
  ['Family', 'Mark', 'Result'],
  MARK_FAMILIES.map((family) => [
    family.family,
    family.name,
    family.verdict === 'kept' ? 'Kept' : `Lost — ${family.reason}`,
  ]),
)}

The full rejection notes and eight decision cards are in
\`design/brand/vitrine/story.md\`; the bake-off sheet is
\`design/brand/vitrine/explorations/marks-v2.5.html\`.

### The constructed gate (v2.3)

${table(
  ['Gate', 'Result', 'Evidence'],
  MARK_GATE.map((check) => [
    `${check.gate}. ${check.title}`,
    'Pass',
    check.evidence,
  ]),
)}

## 3. Wordmark and lockups

The wordmark is the real type, frozen as outlines: Space Grotesk 700,
\`vitrine\`, tracking −0.04em, seven glyph paths, no \`<text>\`. It is 2.87 ×
0.76 em. At 25px high it is 94.8px wide.

| Lockup | File | Spec |
| --- | --- | --- |
| Horizontal | \`lockup.svg\` | mark 34, gap 10, wordmark 25 high |
| Horizontal reverse | \`lockup-reverse.svg\` | Frost on Case |
| Stacked | \`lockup-stacked.svg\` | mark 48, gap 12, wordmark 28 |
| Stacked reverse | \`lockup-stacked-reverse.svg\` | Frost on Case |
| Wordmark | \`wordmark.svg\` | currentColor; reverse copy exists |

Minimum lockup width: 130px. The Signal arm stays Signal in both themes. The
header uses the horizontal lockup at 30px high; the footer uses the wordmark at
44px high.

## 4. Palette

| Token | Value | Role | Contrast |
| --- | --- | --- | --- |
| \`--vt-case\` | #0B0D10 | Ground, ink, the case | 17.89:1 on Frost |
| \`--vt-frost\` | #F2F6F8 | Light ground, glass white | 17.89:1 on Case |
| \`--vt-graphite\` | #45525B | Secondary text on light | 7.40:1 on Frost |
| \`--vt-signal\` | #D9FF43 | The one loud field and label | 16.99:1 with Case |
| \`--vt-iris\` | #5B4BE8 | Focus, links, cool accent | 5.34:1 on Frost |
| \`--vt-clay\` | #B23A1D | Error on light | 5.49:1 on Frost |
| \`--vt-mint\` | #7CF0C4 | Success on dark | 14.01:1 on Case |

Rules: one loud field per page. Signal is the field and the mark's light arm;
the rest are surfaces, text roles or status accents. Glass is a material, not a
colour. The mark is Case on light, Frost on dark, with the Signal arm fixed.

## 5. Type

| Voice | Face | Size / tracking |
| --- | --- | --- |
| Display | Space Grotesk 700 | 64–190px, −0.055em, 0.94 leading |
| Reading | Geist 400 | 16–18px, 1.6 leading |
| Label | Geist Mono 500 | 10–12px, 0.14em, uppercase |

Typography gate: three voices; body 16–18px; inputs 14px, 16px on mobile;
captions 13px; unitless leading; balance on headings, pretty on paragraphs;
tracking in em; tabular numbers on changing values; real specimens, not lorem.
The wordmark is outlined.

## 6. Tokens

The token source is \`features/vitrine/tokens.json\`. It generates
\`features/vitrine/vitrine-tokens.css\` and the public JSON/CSS downloads.
161 declarations across four layers:

1. **Theme DNA** — family, material, hard edge, square tile, solid ring, cosy
   density, mono-caps label. Emitted as \`--vt-dna-*\`.
2. **Primitive** — Case, Frost, Graphite, Signal, Iris, Clay, Mint.
3. **Semantic** — bg, fg, muted, border, surface, accent, focus, danger,
   glass-fill, dither-ink, dither-paper.
4. **Component** — field-bg, field-border, field-focus-ring, field-h,
   field-gap, field-pad, field-radius, field-shadow, button-bg, card-bg, tab-bg,
   chip-bg.

### Theme DNA

${table(
  ['Token', 'Value'],
  Object.entries(tokens.theme).map(([name, value]) => [
    `--vt-dna-${name}`,
    value,
  ]),
)}

### Semantic roles

${table(
  ['Token', 'Light', 'Dark', 'Role'],
  tokens.semantic.light.map((token) => [
    `--vt-${token.name}`,
    token.resolved ?? token.value,
    dark[token.name]?.resolved ?? dark[token.name]?.value ?? '',
    token.role,
  ]),
)}

### Component roles

${table(
  ['Token', 'Light', 'Dark', 'Role'],
  tokens.components.light.map((token) => {
    const darkToken = tokens.components.dark.find(
      (candidate) => candidate.name === token.name,
    )
    return [
      `--vt-${token.name}`,
      token.value,
      darkToken?.value ?? '',
      token.role,
    ]
  }),
)}

### Glass recipe

- Fill: 58% white on light, 9% white on case.
- Edge: 1px \`--vt-glass-edge\`.
- Specular: \`inset 0 1px 0 --vt-glass-highlight\`.
- Hard line: \`0 1px 0 --vt-glass-edge\`; the soft lift is lighting only.
- Blur: 18px with saturate 1.45. Never on body copy.

### Contrast pairs

${table(
  ['Pair', 'Ratio', 'Use'],
  tokens.contrast.map((pair) => [pair.label, `${pair.ratio}:1`, pair.use]),
)}

## 7. Components and forms

The case page ships ten native controls in one specimen form. There is no
component package; the page is the reference and the CSS lives with the feature.

- Text input (name), email, password with show/hide.
- Native select, styled with a chevron and \`appearance: none\`.
- Textarea with a 280-character counter.
- Radio group (team size) in a \`<fieldset>\` with a \`<legend>\`.
- Checkbox (updates) and a button with \`role="switch"\`.
- Range input with a visible value.
- File input inside a dropzone label.
- Disabled example, hint text, error text, error summary with links.
- Focus: 2px outline plus a 3px ring; never removed.
- Error summary takes focus; fields use \`aria-invalid\` and
  \`aria-describedby\`.

The portable form kit is generated from the same theme DNA:
\`public/brand/vitrine/vitrine-forms.css\` and \`vitrine-forms.html\`. It has no
raw colours and includes \`:focus-visible\`, \`[aria-invalid]\`, \`:disabled\`
and \`prefers-reduced-motion\`.

Paths: \`features/vitrine/components/form-demo.tsx\`,
\`features/vitrine/vitrine.module.css\`,
\`app/design-system/vitrine/page.tsx\`.

## 8. Dither

The dithercn engine is installed in \`lib/dither\` (13 files) with the agent
skill in \`.agents/skills/dithercn\` and \`.claude/skills/dithercn\` (9 files
each). The engine is current: \`colorField\` is present.

The signature field is \`features/vitrine/components/dither-lens.tsx\`: a
refraction lens. The field computes a caustic ring map in square units, and the
colour field runs iris at the core to signal at the rim. It uses
\`palette={['--vt-bg', '--vt-iris', '--vt-signal']}\`, \`matrix="bayer8"\`,
\`levels={17}\`, \`cell={4}\`, \`stillTime={6}\`. Under
\`prefers-reduced-motion: reduce\` the engine holds a finished frame
(\`data-state="static"\`).

No example component was installed: none of the examples is a lens case. The
rest of the page uses CSS dot fields (the card edge, material study and case
quote), so only one WebGL context is live.

## 9. Story spine

${table(
  ['Beat', 'Line'],
  STORY_BEATS.map((beat) => [beat.beat, beat.line]),
)}

## 10. Audit

Skill resources: ${SKILL_RESOURCES.filter((r) => r.present).length}/${SKILL_RESOURCES.length} present.
Used as shipped: ${SKILL_RESOURCES.filter((r) => r.status === 'used').length};
substituted: ${SKILL_RESOURCES.filter((r) => r.status === 'substituted').length};
not used: ${SKILL_RESOURCES.filter((r) => r.status === 'not used').length}.

Output contract: ${OUTPUT_CONTRACT.filter((i) => i.status === 'shipped').length}/${OUTPUT_CONTRACT.length} shipped.

### Skill resources

${table(
  ['Resource', 'Present', 'Use', 'Evidence'],
  SKILL_RESOURCES.map((resource) => [
    `\`${resource.path.replace('skills/sunnyside-brand-system/', '')}\``,
    resource.present ? 'yes' : 'no',
    resource.status,
    resource.evidence,
  ]),
)}

### Output contract

${table(
  ['Item', 'Status', 'Evidence'],
  OUTPUT_CONTRACT.map((item) => [item.item, item.status, item.evidence]),
)}

### Dithercn check

${table(
  ['Item', 'Status', 'Evidence'],
  DITHER_AUDIT.map((item) => [item.item, item.status, item.evidence]),
)}

### Known gaps

${GAPS.map((gap) => `- ${gap}`).join('\n')}

## 11. File map

| Concern | Path |
| --- | --- |
| Route and tokens | \`app/design-system/vitrine/page.tsx\` (\`.vt-scope\` on the page root) |
| Token source | \`features/vitrine/tokens.json\` |
| Generated CSS | \`features/vitrine/vitrine-tokens.css\` |
| Portable form kit | \`public/brand/vitrine/vitrine-forms.css\` + \`.html\` |
| Page CSS | \`features/vitrine/vitrine.module.css\` |
| Form specimen | \`features/vitrine/components/form-demo.tsx\` |
| Dither lens | \`features/vitrine/components/dither-lens.tsx\` |
| Brand components | \`features/vitrine/components/brand.tsx\` |
| Audit data | \`features/vitrine/audit.ts\` |
| Brand brief | \`design/brand/vitrine/brief.md\` |
| Story | \`design/brand/vitrine/story.md\` |
| Bake-off | \`design/brand/vitrine/explorations/marks-v2.5.html\` |
| Brand board | \`design/brand/vitrine/vitrine-brandkit.png\` |
| Board source | \`design/brand/vitrine/brandkit.html\` |
| Guide | \`design/brand/vitrine/README.md\` |
| Audit | \`docs/vitrine-design-system-audit.md\` |
| Logo SVGs | \`public/brand/vitrine/\` |
| Favicon | \`public/brand/vitrine/favicon.ico\` |
| Tokens download | \`public/brand/vitrine/vitrine-tokens.json\` |

## 12. Verification

- Mark tested at 16, 24, 32, 64, 512 and as a favicon on light/dark chrome.
- Lockup tested at 130, 240 and 512; compact mark at 16 and 24.
- ICO contains 16, 32 and 48.
- Body contrast 4.5:1; large 3:1; every pair listed in section 6.
- Page checked at 1440 and 390, light and dark, reduced motion, in Chromium.
- 1024px: no horizontal overflow; nav fits.
- Form: empty submit focuses the error summary and marks three fields invalid.
- Typography: body 16px, desktop input 14px, mobile input 16px, h1 700.
- Shader: running at 1440; static under reduced motion after 2.5s.
- Dev note: use \`localhost\`, not \`127.0.0.1\`; Next 16 blocks dev resources
  from the IP by default.
- Page is readable without JavaScript: the prose, tables and downloads are
  server-rendered; the dither and form states need JS.

---

Source: https://adityahimaone.space/design-system/vitrine
Brand board: https://adityahimaone.space/brand/vitrine/vitrine-brandkit.png
Engine: https://dithercn.dev
`

  return new Response(brand, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
