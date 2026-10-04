import { useMemo, useRef, useState } from 'react'
import { career } from '../data/profile'
import { useEntrance } from '../hooks/useEntrance'
import { buildMonths } from '../lib/timeline'

const LEGEND = [
  { state: 'study', label: 'Studying, B.S. Computer Science' },
  { state: 'both', label: 'Studying + production at Al Shini' },
  { state: 'prod', label: 'Production at Al Shini' },
  { state: 'open', label: 'Open to work' },
]

export function CareerUptime() {
  const months = useMemo(() => buildMonths(career.start, __BUILD_DATE__.slice(0, 7), career.phases), [])
  const [hover, setHover] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const phase = useEntrance(ref, 0.3)
  const shown = hover === null ? null : months[hover]

  return (
    <section className="panel uptime" data-deep aria-labelledby="uptime-title">
      <div className="panel__head">
        <h2 id="uptime-title" className="label">Career uptime</h2>
        <span className="tag mono">{shown ? `${shown.label} · ${shown.phaseLabel}` : `${career.start.replace('-', '/')} → now · one bar per month`}</span>
      </div>
      <div
        ref={ref}
        className={`uptime__bars draw draw--${phase}`}
        role="img"
        aria-label="Timeline: studying from September 2022, studying while working in production at Al Shini from July 2024, graduated June 2026, worked until July 2026, open to work since August 2026."
        onMouseLeave={() => setHover(null)}
        style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}
      >
        {months.map((m, i) => (
          <span
            key={m.key}
            className={`bar bar--${m.state}${i === months.length - 1 ? ' bar--now' : ''}${hover === i ? ' is-hover' : ''}`}
            style={{ ['--i' as string]: i }}
            onMouseEnter={() => setHover(i)}
          />
        ))}
      </div>
      <div className="uptime__axis mono" aria-hidden="true" style={{ gridTemplateColumns: `repeat(${months.length}, minmax(0, 1fr))` }}>
        {months.map((m, i) =>
          m.month === 1 || i === 0 ? (
            <span key={m.key} style={{ gridColumn: `${i + 1} / span 6` }}>{i === 0 ? m.label : m.year}</span>
          ) : null,
        )}
      </div>
      <ul className="legend">
        {LEGEND.map((l) => <li key={l.state}><i className={`bar--${l.state}`} />{l.label}</li>)}
      </ul>
      <ol className="events">
        {career.events.map((e) => (
          <li key={e.when} className={'now' in e && e.now ? 'is-now' : undefined}>
            <time className="mono">{e.when}</time>
            <span>{e.text}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
