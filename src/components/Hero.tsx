import { facts, profile } from '../data/profile'
import { FileIcon, GitHubIcon, LinkedInIcon } from './Icons'
import { scrollToSection } from '../lib/dom'

function InstanceCard() {
  return (
    <figure className="instance">
      <div className="instance__bar mono">
        <span className="instance__id"><span className="dot dot--ok dot--pulse" aria-hidden="true" />abdullah-mattour</span>
        <span className="instance__tag">running</span>
      </div>
      <div className="instance__media">
        <picture>
          <source srcSet={profile.photo.replace(/\.jpg$/, '.webp')} type="image/webp" />
          <img src={profile.photo} alt="Abdullah Mattour" width={512} height={512} fetchPriority="high" decoding="async" />
        </picture>
        <span className="instance__scan" aria-hidden="true" />
        <span className="corner corner--tl" aria-hidden="true" />
        <span className="corner corner--tr" aria-hidden="true" />
        <span className="corner corner--bl" aria-hidden="true" />
        <span className="corner corner--br" aria-hidden="true" />
      </div>
      <figcaption>
        <dl className="instance__meta mono">
          <div><dt>region</dt><dd>nyc-metro</dd></div>
          <div><dt>uptime</dt><dd>2y prod</dd></div>
          <div><dt>auth</dt><dd>U.S. PR</dd></div>
        </dl>
      </figcaption>
    </figure>
  )
}

export function Hero() {
  return (
    <section id="overview" className="hero" aria-labelledby="hero-name">
      <div className="hero__grid">
        <div className="hero__text">
          <p className="hero__status mono">
            <span><i>service</i> backend-engineer</span>
            <span><i>region</i> nyc-metro</span>
            <span><i>status</i> <b className="ok-text">● healthy</b></span>
          </p>
          <h1 id="hero-name" className="hero__name">
            <span className="hero__line"><span>{profile.firstName}</span></span>{' '}
            <span className="hero__line"><span>{profile.lastName}<span className="caret" aria-hidden="true" /></span></span>
          </h1>
          <p className="hero__role">{profile.role} <span aria-hidden="true">·</span> {profile.stackLine}</p>
          <p className="hero__lead">
            I make <strong>slow endpoints fast</strong> and <strong>manual deploys automatic</strong>. {profile.intro}
          </p>
          <div className="cta">
            <a className="btn btn--accent btn--lg" href="#incidents" onClick={(e) => { e.preventDefault(); scrollToSection('incidents') }}>
              Read my incident reports
            </a>
            <a className="btn btn--lg" href={profile.resume} target="_blank" rel="noopener"><FileIcon />Resume</a>
            <a className="btn btn--lg btn--icon" href={profile.github} target="_blank" rel="noopener" aria-label="GitHub"><GitHubIcon /></a>
            <a className="btn btn--lg btn--icon" href={profile.linkedin} target="_blank" rel="noopener" aria-label="LinkedIn"><LinkedInIcon /></a>
          </div>
          <ul className="facts">
            {facts.map((f) => (
              <li key={f.label}><b>{f.label}</b><span>{f.detail}</span></li>
            ))}
          </ul>
        </div>
        <InstanceCard />
      </div>
    </section>
  )
}
