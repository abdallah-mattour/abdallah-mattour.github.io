import { useCallback, useEffect, useMemo } from 'react'
import { CareerUptime } from './components/CareerUptime'
import { CommandPalette, type PaletteAction } from './components/CommandPalette'
import { Contact } from './components/Contact'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Incidents } from './components/Incidents'
import { LiveMonitor } from './components/LiveMonitor'
import { Metrics } from './components/Metrics'
import { Pipeline } from './components/Pipeline'
import { Projects } from './components/Projects'
import { RecruiterSummary } from './components/RecruiterSummary'
import { Stack } from './components/Stack'
import { Toasts } from './components/Toasts'
import { TopBar } from './components/TopBar'
import { UiProvider } from './components/UiProvider'
import { copyText, openLink, scrollToSection } from './lib/dom'
import { useUi } from './state/ui'
import { profile, sections } from './data/profile'
import { usePaletteHotkey } from './hooks/useHotkeys'

function Shell() {
  const { recruiter, setRecruiter, setPaletteOpen, toast, runPipeline } = useUi()
  const openPalette = useCallback(() => setPaletteOpen(true), [setPaletteOpen])
  usePaletteHotkey(openPalette)

  // A link ending in #recruiter opens the 30-second summary
  useEffect(() => {
    if (window.location.hash === '#recruiter') setRecruiter(true)
  }, [setRecruiter])

  const actions = useMemo<PaletteAction[]>(() => {
    const copyEmail = async () => toast((await copyText(profile.email)) ? 'Email copied' : profile.email)
    return [
      ...sections.map((s) => ({
        id: `go-${s.id}`,
        title: `Go to ${s.id === 'monitor' ? 'live monitor' : s.label.toLowerCase()}`,
        group: 'Navigate' as const,
        keywords: s.id,
        run: () => scrollToSection(s.id),
      })),
      { id: 'resume', title: 'Open resume (PDF)', group: 'Actions', keywords: 'cv pdf download', run: () => openLink(profile.resume) },
      { id: 'email', title: 'Copy email address', group: 'Actions', keywords: 'contact mail', hint: profile.email, run: copyEmail },
      { id: 'linkedin', title: 'Open LinkedIn', group: 'Actions', keywords: 'profile social', run: () => openLink(profile.linkedin) },
      { id: 'github', title: 'Open GitHub', group: 'Actions', keywords: 'code repos', run: () => openLink(profile.github) },
      { id: 'source', title: 'View this site’s source and CI pipeline', group: 'Actions', keywords: 'repo github actions code', run: () => openLink(profile.repo) },
      {
        id: 'recruiter',
        title: recruiter ? 'Turn off recruiter mode' : 'Turn on recruiter mode',
        group: 'Actions',
        keywords: 'summary tldr hr 30 seconds',
        run: () => { setRecruiter(!recruiter); window.scrollTo({ top: 0, behavior: 'smooth' }) },
      },
      { id: 'run', title: 'Run the pipeline', group: 'Actions', keywords: 'ci deploy build', run: () => runPipeline('ok') },
      { id: 'fail', title: 'Push a failing test', group: 'Actions', keywords: 'ci broken red', run: () => runPipeline('test') },
      { id: 'bad', title: 'Ship a bad release and watch the rollback', group: 'Actions', keywords: 'ci rollback incident', run: () => runPipeline('release') },
      {
        id: 'hire',
        title: 'sudo hire abdullah',
        group: 'Just for fun',
        keywords: 'job offer recruit',
        run: async () => { await copyText(profile.email); toast('Permission granted. Email copied, let’s talk.') },
      },
      { id: 'uptime', title: 'uptime', group: 'Just for fun', keywords: 'status', run: () => toast('up 2 years in production · open to work since Aug 2026') },
      { id: 'coffee', title: 'make coffee', group: 'Just for fun', keywords: 'tea brew', run: () => toast('418 I’m a teapot. Try “sudo hire abdullah” instead.') },
    ]
  }, [recruiter, setRecruiter, toast, runPipeline])

  return (
    <div className={`app${recruiter ? ' is-recruiter' : ''}`}>
      <a className="skip" href="#overview">Skip to content</a>
      <TopBar />
      <main className="main">
        <RecruiterSummary />
        <Hero />
        <Metrics />
        <LiveMonitor />
        <CareerUptime />
        <Incidents />
        <Pipeline />
        <Experience />
        <Projects />
        <Stack />
        <Contact />
      </main>
      <Footer />
      <CommandPalette actions={actions} />
      <Toasts />
    </div>
  )
}

export function App() {
  return (
    <UiProvider>
      <Shell />
    </UiProvider>
  )
}
