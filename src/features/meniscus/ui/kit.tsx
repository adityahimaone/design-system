import React, { useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Field,
  Input,
  Radio,
  SearchField,
  Select,
  Surface,
  Switch,
  Tabs,
  Tag,
  Textarea,
} from './index'

const ROWS = [
  { pair: 'ink on ground', ratio: '17.02:1', verdict: 'Pass' },
  { pair: 'ash on ground', ratio: '6.16:1', verdict: 'Pass' },
  { pair: 'signal on ground', ratio: '9.96:1', verdict: 'Pass' },
  { pair: 'graphite on ground', ratio: '3.04:1', verdict: 'Fails' },
  { pair: 'ink on signal', ratio: '1.71:1', verdict: 'Fails' },
]

export function Kit() {
  const [tab, setTab] = useState('marks')
  const [live, setLive] = useState(true)
  const [search, setSearch] = useState('')
  const [radio, setRadio] = useState('smoked')
  const [checks, setChecks] = useState({ a: true, b: false })

  return (
    <div className="me-kit">
      <div className="me-kit__grid">
        <Surface title="Buttons" meta="4 variants · 3 sizes">
          <div className="me-kit__stack">
            <div className="me-kit__inline">
              <Button variant="primary">Open the shelf</Button>
              <Button variant="secondary">Read brief</Button>
              <Button variant="ghost">Skip</Button>
              <Button variant="danger">Remove case</Button>
            </div>
            <div className="me-kit__inline">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg" variant="primary">
                Large
              </Button>
            </div>
            <div className="me-kit__inline">
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
              <Button variant="primary" disabled>
                Disabled primary
              </Button>
            </div>
            <p className="me-kit__label" style={{ margin: '6px 0 0' }}>
              The caustic is the only filled button. Disabled drops to 42% and keeps its hue.
            </p>
          </div>
        </Surface>

        <Surface title="Badges & tags" meta="status · token · tag">
          <div className="me-kit__stack">
            <div className="me-kit__inline">
              <Badge tone="signal">Shipped</Badge>
              <Badge tone="outline">Draft</Badge>
              <Badge tone="danger">Fails 1.71:1</Badge>
              <Badge dot color="#ffa768">
                Caustic
              </Badge>
              <Badge dot color="#8d939c">
                Ash
              </Badge>
            </div>
            <div className="me-kit__inline">
              <Tag>Smoked</Tag>
              <Tag>Computed contrast</Tag>
              <Tag>Outlined wordmark</Tag>
            </div>
            <p className="me-kit__label" style={{ margin: '6px 0 0' }}>
              A swatch may appear as a 6px dot and nowhere else — the covers are the colour.
            </p>
          </div>
        </Surface>
      </div>

      <div className="me-kit__grid">
        <Surface title="Fields" meta="default · focus · invalid · disabled">
          <div className="me-kit__stack" style={{ justifyItems: 'stretch', width: '100%' }}>
            <Field label="Case title" htmlFor="kit-title" hint="Sentence case. The entry keeps its own name.">
              <Input id="kit-title" defaultValue="Bluewater Freight" />
            </Field>
            <Field label="Search" htmlFor="kit-search" meta={<span>⌘K</span>}>
              <SearchField
                id="kit-search"
                value={search}
                onValueChange={setSearch}
                placeholder="Find a case, a material, a hue…"
              />
            </Field>
            <Field label="Scope" htmlFor="kit-select" error="A scope applies to the whole page.">
              <Select id="kit-select" invalid defaultValue="smoked">
                <option value="smoked">Smoked glass</option>
                <option value="paper">Board</option>
              </Select>
            </Field>
            <Field label="Note" htmlFor="kit-note" hint="Optional. Shown in the case colophon.">
              <Textarea id="kit-note" placeholder="What was cut to get here?" />
            </Field>
            <Field label="Locked field" htmlFor="kit-locked">
              <Input id="kit-locked" defaultValue="Case 00 — the shelf" disabled />
            </Field>
          </div>
        </Surface>

        <Surface title="Selection" meta="check · radio · switch">
          <div className="me-kit__stack" style={{ justifyItems: 'start' }}>
            <Checkbox
              label="Publish the failing pair"
              description="The contrast table prints its failures."
              checked={checks.a}
              onChange={(e) => setChecks({ ...checks, a: e.target.checked })}
            />
            <Checkbox
              label="Include the bake-off"
              description="Keeps the marks that lost."
              checked={checks.b}
              onChange={(e) => setChecks({ ...checks, b: e.target.checked })}
            />
            <Checkbox label="Disabled option" disabled />
            <div style={{ display: 'grid', gap: 8, marginTop: 6 }}>
              <Radio
                name="scope"
                label="Smoked scope"
                checked={radio === 'smoked'}
                onChange={() => setRadio('smoked')}
              />
              <Radio
                name="scope"
                label="Board scope"
                checked={radio === 'paper'}
                onChange={() => setRadio('paper')}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <Switch checked={live} onCheckedChange={setLive} label={live ? 'Band running' : 'Band paused'} />
            </div>
          </div>
        </Surface>
      </div>

      <Surface title="Tabs and table" meta="one pane, real numbers">
        <Tabs
          label="Case sections"
          value={tab}
          onChange={setTab}
          items={[
            { id: 'marks', label: 'Marks', count: 3 },
            { id: 'inks', label: 'Inks', count: 12 },
            { id: 'voice', label: 'Voice', count: 7 },
            { id: 'index', label: 'Index', count: 14 },
          ]}
        />
        <div style={{ paddingTop: 16 }}>
          <table className="me-table">
            <thead>
              <tr>
                <th>Pair</th>
                <th className="num">Ratio</th>
                <th>Verdict</th>
                <th>Allowed job</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.pair}>
                  <td>{r.pair}</td>
                  <td className="num">{r.ratio}</td>
                  <td>
                    <Badge tone={r.verdict === 'Pass' ? 'outline' : 'danger'}>{r.verdict}</Badge>
                  </td>
                  <td style={{ color: 'var(--me-text-secondary)' }}>
                    {r.verdict === 'Pass' ? 'Type, labels, controls' : 'Graphic weight only'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Surface>

      <EmptyState
        title="No case matches that"
        body="Fifteen cases, five collections. Try a material — paper, glass, stone, emerald, cobalt — or clear the filter."
        action={
          <Button size="sm" onClick={() => setSearch('')}>
            Clear filters
          </Button>
        }
      />
    </div>
  )
}
