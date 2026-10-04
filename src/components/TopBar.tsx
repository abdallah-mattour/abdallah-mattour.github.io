import { useEffect, useState, useSyncExternalStore } from 'react'
import { profile, sections } from '../data/profile'
import { SearchIcon } from './Icons'
import { useUi } from '../state/ui'

const noop = () => () => {}

export function TopBar() {
  const { recruiter, setRecruiter, setPaletteOpen } = useUi()
  const isMac = useSyncExternalStore(noop, () => /Mac|iPhone|iPad/i.test(navigator.userAgent), () => false)
  const [active, setActive] = useState<string>('overview')

  // Highlight the section currently in view
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-30% 0px -60% 0px', threshold: [0, 0.25, 0.5] },
    )
    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    return () => io.disconnect()
  }, [recruiter])

  const toggleRecruiter = () => {
    const next = !recruiter
    setRecruiter(next)
    if (next) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="topbar">
      <div className="topbar__inner">
        <a className="brand" href="#overview">
          <span className="dot dot--ok dot--pulse" aria-hidden="true" />
          <span className="mono">abdullah-mattour</span>
          <span className="mono faint">/ prod</span>
        </a>
        <nav className="nav" aria-label="Sections">
          {sections.map((s) => (
            <a key={s.id} href={`#${s.id}`} aria-current={active === s.id ? 'true' : undefined}>
              {s.label}
            </a>
          ))}
        </nav>
        <div className="topbar__actions">
          <button type="button" className="kbd-btn" onClick={() => setPaletteOpen(true)}>
            <SearchIcon />
            <span className="kbd-btn__text" aria-hidden="true">Search</span>
            <span className="sr-only">Search commands</span>
            <kbd aria-hidden="true">{isMac ? '⌘' : 'Ctrl'} K</kbd>
          </button>
          <button
            type="button"
            className="switch"
            aria-pressed={recruiter}
            aria-label="Recruiter mode"
            title="Show a 30-second summary for recruiters"
            onClick={toggleRecruiter}
          >
            <span className="switch__track" aria-hidden="true"><span className="switch__thumb" /></span>
            <span className="switch__text">Recruiter mode</span>
            <span className="switch__short" aria-hidden="true">Recruiter</span>
          </button>
          <a className="btn btn--accent btn--sm" href={profile.resume} target="_blank" rel="noopener">Resume</a>
        </div>
      </div>
    </header>
  )
}
