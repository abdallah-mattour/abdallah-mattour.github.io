import { useState } from 'react'
import { incidents, incidentTypes, type IncidentType } from '../data/profile'
import { Reveal } from './Reveal'

const pillTone: Record<IncidentType, string> = {
  performance: 'data',
  reliability: 'warn',
  security: 'accent',
  data: 'data',
  ai: 'data',
}

export function Incidents() {
  const [filter, setFilter] = useState<IncidentType | 'all'>('all')
  const [open, setOpen] = useState<string | null>(incidents[0]?.id ?? null)
  const list = incidents.filter((i) => filter === 'all' || i.type === filter)

  return (
    <section id="incidents" className="incidents" data-deep aria-labelledby="inc-title">
      <div className="section-head">
        <h2 id="inc-title" className="label">Incident log</h2>
        <div className="filters" role="group" aria-label="Filter incidents">
          {incidentTypes.map((t) => (
            <button key={t.id} type="button" className="filter" aria-pressed={filter === t.id} onClick={() => setFilter(t.id)}>
              {t.label}
            </button>
          ))}
        </div>
      </div>
      <p className="section-title">Problems I found, fixed, and wrote up like postmortems.</p>
      <div className="inc-list">
        {list.map((inc) => {
          const isOpen = open === inc.id
          const bodyId = `${inc.id}-body`
          return (
            <Reveal as="article" key={inc.id} className={`inc${isOpen ? ' is-open' : ''}`}>
              <h3 className="inc__heading">
              <button
                type="button"
                className="inc__summary"
                aria-expanded={isOpen}
                aria-controls={bodyId}
                onClick={() => setOpen(isOpen ? null : inc.id)}
              >
                <span className="inc__id mono">{inc.id}</span>
                <span className="inc__title">
                  {inc.title}
                  <span className="inc__where mono">{inc.where}</span>
                </span>
                <span className="inc__meta">
                  <span className={`pill pill--${pillTone[inc.type]}`}>{inc.type}</span>
                  <span className="pill pill--ok">{inc.result}</span>
                  <span className="inc__chev" aria-hidden="true" />
                </span>
              </button>
              </h3>
              <div className="inc__wrap" id={bodyId} role="region" aria-label={inc.title} hidden={!isOpen}>
                <div className="inc__body">
                  <section><h4>What happened</h4><p>{inc.happened}</p></section>
                  <section><h4>{inc.causeLabel}</h4><p>{inc.cause}</p></section>
                  <section><h4>Fix</h4><ul>{inc.fix.map((f) => <li key={f}>{f}</li>)}</ul></section>
                  <section><h4>Impact</h4><p>{inc.impact}</p></section>
                  <div className="lesson"><h4>Lesson</h4><p>{inc.lesson}</p></div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
