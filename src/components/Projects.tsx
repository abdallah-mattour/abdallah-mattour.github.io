import { otherProjects, projects } from '../data/profile'
import { ArrowIcon } from './Icons'
import { Reveal } from './Reveal'

export function Projects() {
  return (
    <section id="projects" className="projects" aria-labelledby="proj-title">
      <div className="section-head"><h2 id="proj-title" className="label">Projects</h2></div>
      <div className="projects__grid">
        {projects.map((p) => (
          <Reveal as="article" key={p.id} className="panel proj">
            <a className="proj__repo mono" href={p.repo} target="_blank" rel="noopener">
              {p.repoLabel}<ArrowIcon />
            </a>
            <h3 className="card-title">{p.name}<span className="proj__kind">, {p.kind.toLowerCase()}</span></h3>
            <p className="muted">{p.summary}</p>
            <dl className="proj__stats">
              {p.stats.map((s) => <div key={s.k}><dt className="mono">{s.k}</dt><dd>{s.v}</dd></div>)}
            </dl>
            <p className="label faint">What I built</p>
            <ul className="bullets">{p.built.map((b) => <li key={b}>{b}</li>)}</ul>
            <div className="chips">{p.tags.map((t) => <span key={t} className="chip mono">{t}</span>)}</div>
          </Reveal>
        ))}
      </div>
      <p className="also">
        Also on GitHub:{' '}
        {otherProjects.map((o, i) => (
          <span key={o.name}>
            {i > 0 && ' · '}
            <a href={o.url} target="_blank" rel="noopener">{o.name}</a> ({o.note})
          </span>
        ))}
      </p>
    </section>
  )
}
