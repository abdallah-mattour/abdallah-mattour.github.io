import { education, experience } from '../data/profile'
import { boldParts } from '../lib/text'
import { Reveal } from './Reveal'

export function Experience() {
  return (
    <section id="experience" className="two" aria-label="Experience and education">
      <Reveal as="article" className="panel job">
        <div className="panel__head">
          <h2 className="label">Experience</h2>
          <span className="pill">completed · Jul 2026</span>
        </div>
        <h3 className="card-title">{experience.title}</h3>
        <p className="job__org">{experience.org} · <span className="faint">{experience.meta}</span></p>
        <ul className="bullets">
          {experience.bullets.map((b) => (
            <li key={b}>{boldParts(b).map((p, i) => (p.bold ? <strong key={i}>{p.text}</strong> : <span key={i}>{p.text}</span>))}</li>
          ))}
        </ul>
        <div className="chips">{experience.tags.map((t) => <span key={t} className="chip mono">{t}</span>)}</div>
      </Reveal>
      <Reveal as="aside" className="panel edu" aria-labelledby="edu-title">
        <div className="panel__head"><h2 id="edu-title" className="label">Education</h2></div>
        <p className="label faint">{education.dates}</p>
        <h3 className="card-title card-title--sm">{education.degree}</h3>
        <p className="muted">{education.school}</p>
        <div className="chips">{education.courses.map((c) => <span key={c} className="chip mono">{c}</span>)}</div>
        <p className="edu__note">{education.note}</p>
      </Reveal>
    </section>
  )
}
