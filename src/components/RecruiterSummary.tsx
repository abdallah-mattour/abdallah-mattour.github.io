import { profile } from '../data/profile'
import { copyText } from '../lib/dom'
import { useUi } from '../state/ui'

const SHARE = `${profile.site}#recruiter`

export function RecruiterSummary() {
  const { recruiter, setRecruiter, toast } = useUi()
  if (!recruiter) return null
  return (
    <section className="panel tldr" aria-labelledby="tldr-title">
      <div className="panel__head">
        <h2 id="tldr-title" className="label">Recruiter summary · 30 seconds</h2>
        <span className="pill pill--ok"><span className="dot dot--ok" aria-hidden="true" />Open to work</span>
      </div>
      <div className="tldr__grid">
        <div>
          <h3 className="tldr__title">{profile.name}, {profile.role}</h3>
          <p className="muted">Java · Spring Boot · PostgreSQL · Redis · AWS</p>
          <ul className="tldr__list">
            <li><b>U.S. Permanent Resident</b>: no sponsorship needed. NYC metro, open to relocation.</li>
            <li><b>2 years in production</b> at Al Shini, a retail platform (part-time, remote): 10+ microservices serving tens of thousands of requests a day.</li>
            <li><b>Measurable impact:</b> 25% faster key endpoints, p95 under 150 ms, deploy setup from days to minutes, 40% less manual deploy work, 85% test coverage.</li>
            <li><b>B.S. Computer Science</b>, Birzeit University, June 2026.</li>
            <li><b>Projects:</b> a security audit of an adaptive learning API (SATs) and the workflow engine of a land registration system (LRMIS).</li>
          </ul>
        </div>
        <div className="tldr__side">
          <a className="btn btn--accent" href={profile.resume} target="_blank" rel="noopener">Open resume (PDF)</a>
          <button type="button" className="btn" onClick={async () => toast((await copyText(profile.email)) ? 'Email copied' : profile.email)}>Copy email</button>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noopener">LinkedIn</a>
          <div className="share">
            <span>Share this view:</span>
            <code>{SHARE.replace('https://', '')}</code>
            <button type="button" className="btn btn--sm" onClick={async () => toast((await copyText(SHARE)) ? 'Link copied' : SHARE)}>Copy link</button>
          </div>
          <button type="button" className="btn btn--ghost btn--sm" onClick={() => setRecruiter(false)}>Show the full site</button>
        </div>
      </div>
    </section>
  )
}
