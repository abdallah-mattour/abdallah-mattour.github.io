import { profile } from '../data/profile'
import { CopyIcon, FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from './Icons'
import { Reveal } from './Reveal'
import { copyText } from '../lib/dom'
import { useUi } from '../state/ui'

export function Contact() {
  const { toast } = useUi()
  return (
    <Reveal as="section" id="contact" className="panel contact" aria-labelledby="contact-title">
      <div>
        <h2 id="contact-title" className="label">Contact</h2>
        <p className="contact__title">Hiring for a backend team? <span className="accent-text">Page me.</span></p>
        <p className="muted">I’m in the NYC metro area, open to relocation, and authorized to work in the U.S. with no sponsorship needed. Email is the fastest way to reach me.</p>
      </div>
      <div className="contact__card">
        <div className="email">
          <span className="mono">{profile.email}</span>
          <button type="button" className="btn btn--sm" onClick={async () => toast((await copyText(profile.email)) ? 'Email copied' : profile.email)}>
            <CopyIcon />Copy
          </button>
        </div>
        <div className="contact__links">
          <a className="btn btn--accent" href={`mailto:${profile.email}?subject=Backend%20role%20for%20Abdullah`}><MailIcon />Email me</a>
          <a className="btn" href={profile.linkedin} target="_blank" rel="noopener"><LinkedInIcon />LinkedIn</a>
          <a className="btn" href={profile.github} target="_blank" rel="noopener"><GitHubIcon />GitHub</a>
          <a className="btn" href={profile.resume} target="_blank" rel="noopener"><FileIcon />Resume</a>
        </div>
      </div>
    </Reveal>
  )
}
