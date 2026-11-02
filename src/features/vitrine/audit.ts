export type ResourceStatus = 'used' | 'substituted' | 'not used'

export type SkillResource = {
  path: string
  kind: 'reference' | 'script' | 'template' | 'example'
  present: boolean
  status: ResourceStatus
  evidence: string
  note?: string
}

/**
 * The v2.4 sunnyside-brand-system skill advertises these resources in its
 * SKILL.md. This is the audit of that claim against the checkout, not a wish
 * list: every path was read, and the status records whether the build used it
 * as shipped.
 */
export const SKILL_RESOURCES: readonly SkillResource[] = [
  {
    path: 'skills/sunnyside-brand-system/SKILL.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence:
      'The v2.4 method for the track choice, five families, story, proof and audit.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/brief.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/brief.md',
  },
  {
    path: 'skills/sunnyside-brand-system/references/logo-brainstorm.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/explorations/marks-v2.5.html',
    note: 'The v2.3 five-family bake-off, then a v2.5 six-direction review; the half-light V was kept.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/logo-system.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'public/brand/vitrine/mark.svg',
    note: 'One 64 grid, one construction, no stroke and no circle.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/storytelling.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/story.md',
    note: 'Belief → enemy → mark → material → voice → proof → gap, plus eight decision cards.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/form-theming.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/tokens.json',
    note: 'Theme DNA (hard edge, square tile, solid ring, cosy density) drives the --field-* tokens.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/typography.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'app/design-system/vitrine/page.tsx',
    note: 'Three voices, real specimens, unitless leading, balance/pretty, tabular numbers.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/board-and-images.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/brandkit.html',
    note: '2400 × 1800, 54px outer, 14px gutters, rendered at 2×.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/tokens-and-docs.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/tokens.json',
    note: 'Primitive → semantic → component, generated to CSS and JSON.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/verification.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'docs/vitrine-design-system-audit.md',
  },
  {
    path: 'skills/sunnyside-brand-system/references/design-systems.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/components/form-demo.tsx',
    note: 'Native elements first; ten controls; no component runtime.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/workspace-contexts.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'app/design-system/vitrine/page.tsx',
    note: 'A host route and a Markdown twin; no invented routes.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/visual-directions.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'features/vitrine/vitrine.module.css',
    note: 'One effect: the dither lens. Glass is a container; content sits on a solid surface.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/image-direction.md',
    kind: 'reference',
    present: true,
    status: 'not used',
    evidence: 'No generated imagery in the kit.',
    note: 'The atmosphere is CSS dither and the real SVG, so there is no provenance to keep.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/brand-forge.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'The five-family bake-off is reproducible from one JSON config.',
    note: 'bracket, planes, louvers, ribbon, horizon on one palette and theme DNA.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/score-mark.py',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'public/brand/vitrine',
    note: 'PASS: no circle, no stroke, two primitives, compact one, 16px contrast.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/audit.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/audit.json',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/qa.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'docs/vitrine-qa.md',
    note: 'One command runs audit, score and browser; 29 pass, 1 GPU warning, 0 fail.',
  },
  {
    path: 'skills/sunnyside-brand-system/references/craft-bar.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/story.md',
    note: 'The constructed track was chosen; the drawn cast was evaluated and skipped for this technical system.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/cast-forge.mjs',
    kind: 'script',
    present: true,
    status: 'not used',
    evidence: 'No cast in the constructed Vitrine kit.',
    note: 'The drawn track is optional; the constructed track keeps the logo, wordmark and lockups.',
  },
  {
    path: 'skills/sunnyside-brand-system/templates/marks-section.html',
    kind: 'template',
    present: true,
    status: 'not used',
    evidence:
      'The Vitrine marks section is a construction card plus bake-off, not the drawn four-movement composition.',
    note: 'The cast drawer is not required on the constructed track.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/render-board.mjs',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'scripts/render-board.mjs',
    note: 'Copied into the repo because the skill lives outside it and cannot resolve the app’s Playwright.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/favicons.py',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/vitrine-icons.mjs, scripts/vitrine-ico.py',
    note: 'PNGs come from Playwright at exact 16/32/48; the ICO is packed from those bytes.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/extract-wordmark.py',
    kind: 'script',
    present: true,
    status: 'used',
    evidence: 'public/brand/vitrine/wordmark.svg',
    note: 'Space Grotesk 700, -0.04em tracking, seven glyph paths, no <text>.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/render-icons.mjs',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/vitrine-icons.mjs',
    note: 'Same Playwright approach, with the Signal favicon and the Case app icon drawn explicitly.',
  },
  {
    path: 'skills/sunnyside-brand-system/scripts/downscale.py',
    kind: 'script',
    present: true,
    status: 'substituted',
    evidence: 'scripts/render-board.mjs + Pillow LANCZOS',
    note: 'One downscale pass from 4800 × 3600 to 3000 × 2250, then 1500 × 1125.',
  },
  {
    path: 'skills/sunnyside-brand-system/templates/brandkit.html',
    kind: 'template',
    present: true,
    status: 'substituted',
    evidence: 'design/brand/vitrine/brandkit.html',
    note: 'Custom 8-panel board; the starter’s panel map was kept, its Sunnyside assets were not.',
  },
  {
    path: 'skills/sunnyside-brand-system/templates/guidelines.md',
    kind: 'template',
    present: true,
    status: 'used',
    evidence: 'design/brand/vitrine/README.md',
  },
  {
    path: 'skills/sunnyside-brand-system/examples/sunnyside.md',
    kind: 'example',
    present: true,
    status: 'not used',
    evidence: 'Read as the worked example.',
    note: 'The sun, paper and cobalt are Sunnyside-specific; Vitrine had to be a different mark and palette.',
  },
  {
    path: 'skills/sunnyside-brand-system/examples/vitrine.md',
    kind: 'example',
    present: true,
    status: 'used',
    evidence: 'This case, revised to the v2.5 half-light V.',
  },
  {
    path: 'skills/sunnyside-brand-system/README.md',
    kind: 'reference',
    present: true,
    status: 'used',
    evidence: 'Install and path notes.',
  },
]

export type ContractItem = {
  item: string
  status: 'shipped' | 'partial' | 'gap'
  evidence: string
  note?: string
}

export const OUTPUT_CONTRACT: readonly ContractItem[] = [
  {
    item: 'One-page brief with assumptions marked',
    status: 'shipped',
    evidence: 'design/brand/vitrine/brief.md',
  },
  {
    item: 'Five v2.3 families, one kept, four rejected with reasons',
    status: 'shipped',
    evidence: 'design/brand/vitrine/explorations/marks.html',
    note: 'The architectural monogram was re-drawn as the half-light V in v2.5; the open case was retired.',
  },
  {
    item: 'Story spine and decision cards',
    status: 'shipped',
    evidence: 'design/brand/vitrine/story.md',
    note: 'Belief, enemy, mark, material, voice, proof, gap; eight cards.',
  },
  {
    item: 'Mark, compact mark, glyph and mono',
    status: 'shipped',
    evidence:
      'public/brand/vitrine/mark.svg, mark-compact.svg, glyph.svg, mark-mono.svg',
  },
  {
    item: 'Wordmark as outlines',
    status: 'shipped',
    evidence: 'public/brand/vitrine/wordmark.svg',
    note: 'Seven glyph paths, currentColor, no live text.',
  },
  {
    item: 'Horizontal, stacked and reversed lockups',
    status: 'shipped',
    evidence: 'public/brand/vitrine/lockup*.svg',
    note: 'Four files: light and reverse for horizontal and stacked.',
  },
  {
    item: '3 × 3 brand board as a real image',
    status: 'shipped',
    evidence: 'design/brand/vitrine/vitrine-brandkit.png',
    note: '3000 × 2250, rendered from HTML at 2× and downscaled.',
  },
  {
    item: 'Favicon and app icon set',
    status: 'shipped',
    evidence:
      'public/brand/vitrine/favicon.ico, icon.svg, apple-icon-180.png, icon-192.png, icon-512.png',
  },
  {
    item: 'Primitive → semantic → component tokens, CSS and JSON',
    status: 'shipped',
    evidence:
      'features/vitrine/tokens.json → vitrine-tokens.css + public/brand/vitrine/vitrine-tokens.json',
    note: '161 declarations, including sixteen theme-DNA tokens.',
  },
  {
    item: 'Theme DNA and portable form kit',
    status: 'shipped',
    evidence:
      'features/vitrine/tokens.json (theme) + public/brand/vitrine/vitrine-forms.css',
    note: 'The mark and the fields share the hard edge, square tile and solid ring.',
  },
  {
    item: 'Guidelines that explain why, when not, and what breaks next',
    status: 'shipped',
    evidence: 'design/brand/vitrine/README.md',
  },
  {
    item: 'Live design-system case with form controls',
    status: 'shipped',
    evidence: 'app/design-system/vitrine/page.tsx',
    note: 'Ten controls, validation, error summary, password toggle, switch, range and file.',
  },
  {
    item: 'Agent-readable Markdown twin',
    status: 'shipped',
    evidence: 'app/design-system/vitrine/llms.txt/route.ts',
  },
  {
    item: 'Hard-gate evidence and objective score',
    status: 'shipped',
    evidence: 'docs/vitrine-design-system-audit.md',
    note: 'A zero-circle, fill-only, two-primitive mark; score-mark.py PASS.',
  },
  {
    item: 'Typography gate',
    status: 'shipped',
    evidence: 'design/brand/vitrine/story.md, page type section',
  },
  {
    item: 'Verification evidence',
    status: 'shipped',
    evidence: 'docs/vitrine-design-system-audit.md',
    note: 'Screenshots at 1440 and 390, light/dark, reduced motion.',
  },
]

export type DitherAudit = {
  item: string
  status: 'pass' | 'note'
  evidence: string
  note?: string
}

export const DITHER_AUDIT: readonly DitherAudit[] = [
  {
    item: 'Engine installed in lib/dither',
    status: 'pass',
    evidence: '13 files; index.ts exports DitherShader.',
  },
  {
    item: 'Engine current (colorField present)',
    status: 'pass',
    evidence: 'grep colorField lib/dither/shader.tsx',
  },
  {
    item: 'Agent skill installed in both locations',
    status: 'pass',
    evidence:
      '.agents/skills/dithercn and .claude/skills/dithercn, 9 files each.',
  },
  {
    item: 'Dither tokens in global CSS',
    status: 'pass',
    evidence:
      'app/globals.css defines --dither-ink and the seven named colours.',
  },
  {
    item: 'Signature dither written as a field',
    status: 'pass',
    evidence: 'features/vitrine/components/dither-lens.tsx',
    note: 'No example component installed; the lens field is six lines of geometry plus a colour field.',
  },
  {
    item: 'Reduced motion keeps a finished frame',
    status: 'pass',
    evidence: 'DitherShader data-state="static", stillTime=6.',
  },
  {
    item: 'Live shader budget',
    status: 'pass',
    evidence:
      'One DitherShader on the page; the rest of the dither is CSS dots.',
  },
]

export const GAPS = [
  'The board is 1.03 MB at 3000 × 2250, above the skill’s ~1 MB target. The 1500 × 1125 web copy is 431 KB.',
  'No social, print or Open Graph crops were produced; the case ships the board and the SVG family only.',
  'There is no automated visual regression or axe CI for the Vitrine route or the case library. The checks here are a manual Playwright pass.',
  'The favicon deliberately uses a Signal field and the compact mark instead of a transparent primary mark, so it survives dark browser chrome. The transparent marks still ship.',
  'The compact mark drops the Signal arm: below 32px the V is one colour, so the two-material idea is carried by the favicon’s Signal field, not by the drawing.',
  'The portable form CSS is a generated export for reuse; the live route consumes the same tokens through its CSS module, not the exported file.',
  'No AI-generated atmosphere image. The board and page use CSS dots and the real mark, so the kit has no generated-image provenance to maintain.',
  'The dither was checked in Chromium (Playwright). Safari and Firefox were not part of this pass.',
] as const

export const NAV = [
  { id: 'foundation', label: 'Foundation' },
  { id: 'marks', label: 'Marks' },
  { id: 'material', label: 'Material' },
  { id: 'colour', label: 'Colour' },
  { id: 'type', label: 'Type' },
  { id: 'forms', label: 'Forms' },
  { id: 'motion', label: 'Motion' },
  { id: 'voice', label: 'Voice' },
  { id: 'applications', label: 'Applications' },
  { id: 'tokens', label: 'Tokens' },
  { id: 'audit', label: 'Audit' },
] as const

export type MarkPath = {
  d: string
  accent?: boolean
}

export type MarkFamily = {
  id: string
  name: string
  family: string
  verdict: 'kept' | 'rejected'
  reason: string
  paths: readonly MarkPath[]
}

/**
 * The five v2.3 families on Vitrine's palette and theme DNA, re-judged in
 * v2.5. The architectural monogram was re-drawn as the half-light V; the open
 * case was retired because it drew the container and withheld the light.
 */
export const MARK_FAMILIES: readonly MarkFamily[] = [
  {
    id: 'monogram',
    name: 'Half-light V',
    family: 'Architectural monogram',
    verdict: 'kept',
    reason:
      'One V, split by its material: the ink arm is the glass, the Signal arm is the light. It joins the wordmark, holds at 16px, and no other mark in the library is a two-material letter.',
    paths: [
      { d: 'M8 8H24L32 34V56H24Z' },
      { d: 'M32 34L40 8H56L40 56H32Z', accent: true },
    ],
  },
  {
    id: 'planes',
    name: 'Sheared sheets',
    family: 'Offset geometric planes',
    verdict: 'rejected',
    reason:
      'Riso Co. already owns the overlapping sheared sheet. The mark reads as a misregistration effect before it reads as a case.',
    paths: [
      { d: 'M24 10H52L36 54H8Z', accent: true },
      { d: 'M34 4H62L46 48H18Z' },
    ],
  },
  {
    id: 'louvers',
    name: 'Wedge bars',
    family: 'Brutalist louvers',
    verdict: 'rejected',
    reason:
      'Hachure already owns the stepped ridge. A louver is a shelf, not a vitrine; at 16px it becomes a bar chart.',
    paths: [
      {
        d: 'M2 56V36L10 42V56Z M15.3 56V26L25.3 32V56Z M30.6 56V16L42.6 22V56Z M47.9 56V8L61.9 14V56Z',
      },
      { d: 'M54.9 2L61.9 8L54.9 14L47.9 8Z', accent: true },
    ],
  },
  {
    id: 'horizon',
    name: 'Shelf and keystone',
    family: 'Horizon & counter-form',
    verdict: 'rejected',
    reason:
      'At small sizes it collapses into Hachure’s bar-and-diamond silhouette, and the baseline carries no letter or case.',
    paths: [
      { d: 'M8 42H56V52H8Z' },
      { d: 'M32 10L42 24L32 38L22 24Z', accent: true },
    ],
  },
  {
    id: 'case',
    name: 'Open case',
    family: 'Continuous ribbon',
    verdict: 'rejected',
    reason:
      'Retired in v2.5: it draws the case but withholds the light. The empty U reads as a letter at 16px and cannot show the dither.',
    paths: [
      { d: 'M12 8L8 12V56H56V12L52 8H48V48H16V8Z' },
      { d: 'M22 49H42V54H22Z', accent: true },
    ],
  },
]

export type GateCheck = {
  gate: string
  title: string
  result: 'pass'
  evidence: string
}

export const MARK_GATE: readonly GateCheck[] = [
  {
    gate: 'A',
    title: 'Zero circle / zero Venn',
    result: 'pass',
    evidence:
      'No <circle> in the family. The V is a filled letterform, not a disc or a ring.',
  },
  {
    gate: 'B',
    title: 'Fill-only',
    result: 'pass',
    evidence:
      'No stroke attribute in mark.svg or mark-compact.svg. The two solid arms meet at x32; the compact is one solid path.',
  },
  {
    gate: 'C',
    title: '2–4 primitives, one accent',
    result: 'pass',
    evidence:
      'Two primitives in the primary (glass arm + light arm), one in the compact. Signal appears once, as the light arm.',
  },
  {
    gate: 'D',
    title: 'One family, distinct silhouette',
    result: 'pass',
    evidence:
      'Architectural monogram. The half-light V is distinct from Huginn’s brackets, Riso’s planes, Hachure’s louvers and Sunnyside’s tile.',
  },
  {
    gate: 'E',
    title: 'Compact is simpler',
    result: 'pass',
    evidence:
      'The compact is a separate one-path V with heavier walls; the primary is the same silhouette split into two materials.',
  },
  {
    gate: 'F',
    title: 'Test 16px first',
    result: 'pass',
    evidence:
      'score-mark.py PASS: compact contrast at 16px, glyph coverage 32%, no specks, no thin strokes.',
  },
]

export type StoryBeat = {
  beat: string
  line: string
}

export const STORY_BEATS: readonly StoryBeat[] = [
  {
    beat: 'Belief',
    line: 'Depth should clarify, never fog. A container earns its transparency by holding one clear object.',
  },
  {
    beat: 'Enemy',
    line: 'Glass used as decoration: the frosted card with an unreadable paragraph, the gradient blob behind body copy.',
  },
  {
    beat: 'Mark',
    line: 'The V is the case in section: one arm is glass, one arm is the light. A single vertical split at x32 makes the material the idea; the plinth is flat.',
  },
  {
    beat: 'Material',
    line: 'A glass container, a halftone information layer, a hard 1px cut edge, and fields on a solid ground.',
  },
  {
    beat: 'Voice',
    line: 'Precise, lit, unhurried. Museum labels, not marketing.',
  },
  {
    beat: 'Proof',
    line: '17.89:1 body contrast, 161 tokens, ten native controls, a 32% half-light V and a compact V that reads at 16px.',
  },
  {
    beat: 'Gap',
    line: 'Board weight, social crops, axe CI, Chromium-only QA, and a compact that drops the Signal arm below 32px.',
  },
]

export type Decision = {
  title: string
  decision: string
  because: string
  notWhen: string
  breaksNext: string
}

export const DECISIONS: readonly Decision[] = [
  {
    title: 'Draw the V, light one arm',
    decision:
      'The mark is an architectural monogram: a V split vertically, the ink arm glass and the Signal arm the light.',
    because:
      'A letter alone is a typeface choice; a letter split by its material is an idea, and it joins the wordmark.',
    notWhen:
      'The mark must read as a container before it reads as a name; use the perspective case.',
    breaksNext:
      'The split is a hard colour boundary, not a cut. The compact drops it and keeps a heavier V.',
  },
  {
    title: 'Glass is a container',
    decision:
      'Body copy never sits on a translucent surface; glass is for a container with one object.',
    because: 'Text contrast must not depend on what is behind the panel.',
    notWhen: 'A floating overlay must read above content; use a solid scrim.',
    breaksNext:
      'The .onCase inverse scope mirrors the dark tokens; change both in the same commit.',
  },
  {
    title: 'One loud field',
    decision:
      'Signal is the only accent allowed to shout; status colours are not fields.',
    because: 'Two loud fields remove the hierarchy the page is built on.',
    notWhen: 'An error needs attention; Clay is a status role, not a field.',
    breaksNext:
      'Dark focus uses Signal, so focus and accent share a colour. The ring is still visible because it is a ring, not a fill.',
  },
  {
    title: 'Hard 1px cut edge',
    decision: 'Glass uses a 1px edge, one top specular and a hard 1px shadow.',
    because: 'The mark is a solid V; a soft glow would change the material.',
    notWhen: 'The panel floats over a photograph; use a scrim first.',
    breaksNext:
      'The dark edge is 18% white and can disappear on Frost; it is a container edge, not a body-copy border.',
  },
  {
    title: 'Native controls, token fields',
    decision:
      'Text, email, password, select, textarea, radio, checkbox, switch, range and file are native; the material is CSS.',
    because:
      'The kit must work without a component runtime and survive iOS input zoom.',
    notWhen: 'A portal or focus trap is required; use Radix.',
    breaksNext:
      'Native select styling differs by browser; the chevron is drawn and tested in both themes.',
  },
  {
    title: 'The label face is a label',
    decision:
      'Uppercase Geist Mono at 0.14em is for metadata, never paragraphs.',
    because: 'The voice is a museum label; the reading face carries sentences.',
    notWhen:
      'A caption needs more than one line; use the reading face at 13px.',
    breaksNext:
      'The 10px label sits below the 13px caption floor; on the page it is paired with larger text.',
  },
  {
    title: 'The Signal arm is material',
    decision: 'The lime arm is the light, half the mark, not a label.',
    because:
      'The two materials are the idea; a thin accent would be an ornament.',
    notWhen:
      'The mark is one colour (mono, favicon on Signal); the split is dropped and the silhouette carries it.',
    breaksNext:
      'The Signal arm is 50% of the mark, so the mono and compact drawings drop it.',
  },
  {
    title: 'The board is HTML',
    decision:
      'The board is rendered from the same HTML, tokens and SVGs as the page.',
    because: 'A board that is drawn twice drifts. One source, one export.',
    notWhen: 'A print vendor requires CMYK; that is a separate artifact.',
    breaksNext:
      'The 3000 × 2250 PNG is still above the 1 MB target. The web copy is downscaled, not re-exported.',
  },
]

export const VOICE = {
  weAre: 'Precise, lit, unhurried, specific.',
  weAreNot: 'Hyped, vague, apologetic, jargon-first.',
  say: [
    'Request staged. This specimen does not call a server.',
    'Use at least 8 characters.',
    'The case holds one object. The rest is clearance.',
  ],
  dontSay: [
    'Oops! Something went wrong.',
    'Awesome! Your request was successfully submitted!',
    'Unlock the power of seamless experiences.',
  ],
} as const

export const MOTION = [
  {
    name: 'Press and hover',
    value: '120ms',
    note: 'One physical response; no bounce.',
  },
  {
    name: 'State change',
    value: '240ms',
    note: 'Colour, border and ring settle together.',
  },
  {
    name: 'Entrance',
    value: '480ms',
    note: 'Only for a first reveal; never a loop.',
  },
  {
    name: 'Ease',
    value: 'cubic-bezier(0.23, 1, 0.32, 1)',
    note: 'One ease for the system.',
  },
  {
    name: 'Reduced motion',
    value: '0.01ms',
    note: 'The shader holds a finished frame.',
  },
] as const

export const TYPE_GATE = [
  'Three voices: Space Grotesk display, Geist reading, Geist Mono label.',
  'Body 16–18px; inputs 14px, 16px on mobile; captions 13px.',
  'Unitless leading: display 0.94, body 1.6; weight ≥400 below 18px.',
  'Measure 60–75 characters; balance on headings, pretty on paragraphs.',
  'Tracking in em; tabular numbers on changing values; real specimens, not lorem.',
  'The wordmark is outlined; no paragraph is set in the display face.',
] as const
