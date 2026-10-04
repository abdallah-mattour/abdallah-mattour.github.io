import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { applySteps, finishedOk, scenarios, stages, type PipelineSnapshot, type Scenario } from '../lib/pipeline'
import { useUi } from '../state/ui'

const STEP_MS = 650

export function Pipeline() {
  const { onPipelineRequest } = useUi()
  const reduced = useReducedMotion()
  const [snap, setSnap] = useState<PipelineSnapshot>({ ...finishedOk, log: [{ text: '▶ last run · main', tone: 'info' }, ...finishedOk.log.slice(1)] })
  const [running, setRunning] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const timers = useRef<number[]>([])
  const sectionRef = useRef<HTMLElement>(null)

  const run = useCallback((scenario: Scenario) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const steps = scenarios[scenario].steps
    const stepMs = reduced ? 60 : STEP_MS
    setBusy(true)
    setSnap(applySteps([]))
    let current = applySteps([])
    steps.forEach((step, i) => {
      if (step.stage !== undefined) {
        timers.current.push(window.setTimeout(() => setRunning(step.stage!), i * stepMs))
      }
      timers.current.push(
        window.setTimeout(() => {
          current = applySteps([step], current)
          setSnap(current)
          setRunning(null)
          if (i === steps.length - 1) setBusy(false)
        }, i * stepMs + stepMs * 0.85),
      )
    })
  }, [reduced])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  // Runs requested from the command palette
  useEffect(
    () =>
      onPipelineRequest((scenario) => {
        sectionRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
        run(scenario)
      }),
    [onPipelineRequest, run, reduced],
  )

  const detail = selected === null ? null : stages[selected]

  return (
    <section id="pipeline" ref={sectionRef} className="panel pipeline" data-deep aria-labelledby="pipe-title">
      <div className="panel__head">
        <h2 id="pipe-title" className="label">Delivery pipeline</h2>
        <span className="tag mono">simulation of the pipeline I built and ran at Al Shini</span>
      </div>
      <p className="section-title">From <code className="mono">git push</code> to production, with a gate that stops bad code and a rollback for bad releases.</p>
      <ol className="stages">
        {stages.map((s, i) => {
          const state = running === i ? 'run' : snap.states[i]
          return (
            <li key={s.id} className="stages__item">
              <button
                type="button"
                className="stage"
                data-state={state}
                aria-current={selected === i ? 'true' : undefined}
                onClick={() => setSelected(i)}
              >
                <span className="stage__state" aria-hidden="true" />
                <span className="stage__step mono">{s.step}</span>
                <span className="stage__name">{s.name}</span>
                <span className="stage__tool mono">{s.tool}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="pipeline__grid">
        <div className="pipeline__detail" aria-live="polite">
          <span className="label">{detail ? `stage ${selected! + 1} of 6 · ${detail.step}` : 'select a stage'}</span>
          <h3>{detail ? detail.name : 'Click any stage to see what it does'}</h3>
          <p>{detail ? detail.detail : 'Or run the pipeline. Try a failing test or a bad release, and watch what the pipeline does about it.'}</p>
        </div>
        <div>
          <div className="pipeline__controls">
            {(Object.keys(scenarios) as Scenario[]).map((k, i) => (
              <button key={k} type="button" className={`btn btn--sm${i === 0 ? ' btn--accent' : ''}`} disabled={busy} onClick={() => run(k)}>
                {i === 0 ? '▶ ' : ''}{scenarios[k].label}
              </button>
            ))}
          </div>
          <pre className="log mono" aria-live="polite">
            {snap.log.map((l, i) => (
              <span key={i} className={`log__line log__line--${l.tone}`}>{l.text}{'\n'}</span>
            ))}
          </pre>
        </div>
      </div>
    </section>
  )
}
