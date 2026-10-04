import { useRef } from 'react'
import { metrics, type Metric } from '../data/profile'
import { useCountUp } from '../hooks/useCountUp'
import { useEntrance, type EntrancePhase } from '../hooks/useEntrance'

function Viz({ m }: { m: Metric }) {
  const v = m.viz
  switch (v.kind) {
    case 'blocks':
      return (
        <div className="viz-blocks" aria-hidden="true">
          {Array.from({ length: v.count }, (_, i) => <span key={i} style={{ ['--i' as string]: i }} />)}
          <span className="more" />
        </div>
      )
    case 'budget':
      return (
        <div aria-hidden="true">
          <div className="viz-budget"><i style={{ width: `${(v.value / v.max) * 100}%` }} /><b style={{ left: '50%' }} /></div>
          <div className="viz-budget__scale mono"><span>0</span><span>150 ms budget</span><span>{v.max}</span></div>
        </div>
      )
    case 'bars':
      return (
        <div className="viz-bars mono" aria-hidden="true">
          <div><span>before</span><b style={{ width: '100%' }} /></div>
          <div><span>after</span><b className="after" style={{ width: `${v.after}%` }} /></div>
        </div>
      )
    case 'ring': {
      const c = 2 * Math.PI * 26
      return (
        <svg className="viz-ring" viewBox="0 0 64 64" aria-hidden="true">
          <circle className="track" cx="32" cy="32" r="26" />
          <circle className="val" cx="32" cy="32" r="26" strokeDasharray={`${(v.pct / 100) * c} ${c}`} />
        </svg>
      )
    }
    case 'steps':
      return (
        <div className="viz-steps mono" aria-hidden="true"><span>{v.from}</span><i>→</i><span className="now">{v.to}</span></div>
      )
  }
}

function Tile({ m, phase, index }: { m: Metric; phase: EntrancePhase; index: number }) {
  const n = useCountUp(m.value ?? 0, phase)
  return (
    <div className="kpi" style={{ ['--i' as string]: index }}>
      <span className="kpi__label">{m.label}</span>
      <span className={`kpi__value${m.text ? ' kpi__value--text' : ''}`}>
        {m.text ?? (
          <>
            {m.prefix}
            <span className="num">{n}</span>
            {m.suffix}
            {m.unit && <small> {m.unit}</small>}
          </>
        )}
      </span>
      <div className="kpi__viz"><Viz m={m} /></div>
    </div>
  )
}

export function Metrics() {
  const ref = useRef<HTMLDivElement>(null)
  const phase = useEntrance(ref, 0.25)
  return (
    <section className="metrics" aria-labelledby="metrics-title">
      <div className="section-head">
        <h2 id="metrics-title" className="label">Production metrics</h2>
        <span className="tag mono">source: Al Shini retail platform · Jul 2024 – Jul 2026</span>
      </div>
      <div ref={ref} className={`kpis draw draw--${phase}`}>
        {metrics.map((m, i) => <Tile key={m.id} m={m} phase={phase} index={i} />)}
      </div>
    </section>
  )
}
