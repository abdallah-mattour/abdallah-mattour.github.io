import { useCallback, useEffect, useRef, useState } from 'react'
import { useInterval } from '../hooks/useInterval'
import { useLiveness } from '../hooks/useLiveness'
import { createFeed, type FeedEvent } from '../lib/feed'
import { createLatencyStream, LATENCY_BUDGET_MS, percentile, toPath } from '../lib/latency'

const POINTS = 60
const TICK_MS = 1000
const Y_MAX = 200
const FEED_EVERY = 3 // ticks
const FEED_SIZE = 6
const INITIAL_AGES = [2, 7, 13, 19, 26, 34]

interface FeedRow extends FeedEvent { bornAt: number }

export function LiveMonitor() {
  const ref = useRef<HTMLElement>(null)
  const live = useLiveness(ref)

  // Deterministic first frame (same on the server and in the browser)
  const [latency] = useState(() => {
    const next = createLatencyStream(7)
    return { next, initial: Array.from({ length: POINTS + 1 }, next) }
  })
  const [series, setSeries] = useState<number[]>(latency.initial)
  const [feed] = useState(() => {
    const next = createFeed(23)
    const rows: FeedRow[] = INITIAL_AGES.map((age) => ({ ...next(), bornAt: -age }))
    return { next, rows }
  })
  const [rows, setRows] = useState<FeedRow[]>(feed.rows)
  const [tick, setTick] = useState(0)
  const tickRef = useRef(0)
  // Draw the chart at its real pixel width so labels stay readable on phones
  const chartRef = useRef<HTMLDivElement>(null)
  const [W, setW] = useState(600)
  useEffect(() => {
    const el = chartRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(([entry]) => {
      if (entry) setW(Math.max(240, Math.round(entry.contentRect.width) - 44))
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const STEP = W / (POINTS - 1)
  const H = Math.round(Math.min(240, Math.max(160, W * 0.32)))

  const onTick = useCallback(() => {
    const nt = ++tickRef.current
    const value = latency.next()
    setTick(nt)
    setSeries((s) => [...s.slice(1), value])
    if (nt % FEED_EVERY === 0) {
      const event = { ...feed.next(), bornAt: nt }
      setRows((r) => [event, ...r].slice(0, FEED_SIZE))
    }
  }, [feed, latency])
  useInterval(onTick, live ? TICK_MS : null)

  const y = (v: number) => H - (v / Y_MAX) * H
  const window60 = series.slice(1)
  const p95 = percentile(window60, 95)
  const now = series[series.length - 1] ?? 0
  const line = toPath(series, W + STEP, H, Y_MAX)
  const area = `${line} L${(W + STEP).toFixed(1)},${H} L0,${H} Z`

  return (
    <section id="monitor" ref={ref} className="monitor" data-deep aria-labelledby="monitor-title">
      <div className="section-head">
        <h2 id="monitor-title" className="label">Live monitor</h2>
        <span className="tag mono">simulated replay · {live ? 'streaming' : 'paused'}</span>
      </div>
      <div className="monitor__grid">
        <div className="panel latency">
          <div className="latency__head">
            <div>
              <p className="label">p95 latency · last 60s</p>
              <p className="latency__big"><span className="num">{p95}</span><small>ms</small></p>
            </div>
            <dl className="latency__stats mono">
              <div><dt>now</dt><dd>{now} ms</dd></div>
              <div><dt>budget</dt><dd>{LATENCY_BUDGET_MS} ms</dd></div>
              <div><dt>status</dt><dd className="ok-text">✓ under budget</dd></div>
            </dl>
          </div>
          <div className="chart" ref={chartRef}>
            <svg viewBox={`-34 -10 ${W + 44} ${H + 34}`} role="img" aria-label={`Latency over the last minute, p95 ${p95} milliseconds, all requests under the ${LATENCY_BUDGET_MS} millisecond budget`}>
              <defs>
                <linearGradient id="lat-fill" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0" stopColor="var(--data)" stopOpacity="0.28" />
                  <stop offset="1" stopColor="var(--data)" stopOpacity="0" />
                </linearGradient>
                <clipPath id="lat-clip"><rect x="0" y="-10" width={W} height={H + 10} /></clipPath>
              </defs>
              {[50, 100, 150, 200].map((v) => (
                <g key={v}>
                  <line x1="0" x2={W} y1={y(v)} y2={y(v)} className="chart__grid" />
                  <text x="-8" y={y(v) + 4} className="chart__tick" textAnchor="end">{v}</text>
                </g>
              ))}
              <line x1="0" x2={W} y1={H} y2={H} className="chart__axis" />
              <g clipPath="url(#lat-clip)">
                <g key={tick} className={live ? 'chart__slide' : undefined} style={{ ['--step' as string]: `${-STEP}px` }}>
                  <path d={area} fill="url(#lat-fill)" />
                  <path d={line} className="chart__line" />
                </g>
              </g>
              <line x1="0" x2={W} y1={y(LATENCY_BUDGET_MS)} y2={y(LATENCY_BUDGET_MS)} className="chart__budget" />
              <text x={W - 4} y={y(LATENCY_BUDGET_MS) - 7} className="chart__budget-label" textAnchor="end">budget {LATENCY_BUDGET_MS} ms</text>
              <circle cx={W} cy={y(now)} r="4.5" className="chart__dot" />
              {live && <circle cx={W} cy={y(now)} r="4.5" className="chart__ping" />}
              <text x="0" y={H + 20} className="chart__tick">−60s</text>
              <text x={W / 2} y={H + 20} className="chart__tick" textAnchor="middle">−30s</text>
              <text x={W} y={H + 20} className="chart__tick" textAnchor="end">now</text>
            </svg>
          </div>
        </div>

        <div className="panel feed">
          <div className="feed__head">
            <p className="label">Deploy &amp; health feed</p>
            <span className="mono faint feed__src">orders · returns · accounts · reporting</span>
          </div>
          <ol className="feed__list mono" aria-live="off">
            {rows.map((r) => {
              const age = tick - r.bornAt
              return (
                <li key={r.id} className={`feed__row feed__row--${r.tone}`}>
                  <span className="feed__age">{age <= 1 ? 'now' : `${age}s`}</span>
                  <span className="feed__kind">{r.kind}</span>
                  <span className="feed__target">{r.target}</span>
                  <span className="feed__detail">{r.detail}</span>
                </li>
              )
            })}
          </ol>
          <p className="feed__note">A replay of the kind of signals I watched after every release. Real services, simulated numbers.</p>
        </div>
      </div>
    </section>
  )
}
