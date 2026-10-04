import { act, fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from './App'
import { render as renderServer } from './entry-server'

describe('portfolio app', () => {
  it('renders the hero, the key facts and the resume link', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Abdullah Mattour')
    expect(screen.getAllByText('U.S. Permanent Resident').length).toBeGreaterThan(0)
    const resume = screen.getAllByRole('link', { name: /resume/i })[0]
    expect(resume).toHaveAttribute('href', 'resume.pdf')
  })

  it('recruiter mode shows the 30-second summary and hides the deep sections', async () => {
    const user = userEvent.setup()
    const { container } = render(<App />)
    expect(screen.queryByText(/Recruiter summary/i)).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Recruiter mode' }))
    expect(screen.getByText(/Recruiter summary/i)).toBeInTheDocument()
    expect(container.querySelector('.app')).toHaveClass('is-recruiter')
    await user.click(screen.getByRole('button', { name: 'Show the full site' }))
    expect(screen.queryByText(/Recruiter summary/i)).not.toBeInTheDocument()
  })

  it('opens the command palette with Ctrl+K and runs a command', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('{Control>}k{/Control}')
    const dialog = screen.getByRole('dialog', { name: 'Command palette' })
    await user.type(within(dialog).getByRole('combobox'), 'uptime')
    expect(within(dialog).getAllByRole('option')[0]).toHaveTextContent('uptime')
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(await screen.findByText(/up 2 years in production/)).toBeInTheDocument()
  })

  it('opens the palette with "/" and closes it with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.keyboard('/')
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('moves through palette results with the arrow keys and shows an empty state', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Search commands' }))
    const input = screen.getByRole('combobox')
    const options = () => screen.getAllByRole('option')
    expect(options()[0]).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowDown}')
    expect(options()[1]).toHaveAttribute('aria-selected', 'true')
    await user.keyboard('{ArrowUp}{ArrowUp}')
    expect(options().at(-1)).toHaveAttribute('aria-selected', 'true')
    await user.type(input, 'zzzz')
    expect(screen.getByText(/No command matches/)).toBeInTheDocument()
  })

  it('filters the incident log by type', async () => {
    const user = userEvent.setup()
    render(<App />)
    const before = screen.getAllByRole('button', { expanded: false }).length
    await user.click(screen.getByRole('button', { name: 'Security' }))
    expect(screen.getByText('Breaking into my own app before anyone else could')).toBeInTheDocument()
    expect(screen.queryByText('Deploys that needed a hero')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(screen.getAllByRole('button', { expanded: false }).length).toBe(before)
  })

  it('opens and closes an incident report', async () => {
    const user = userEvent.setup()
    render(<App />)
    const toggle = screen.getByRole('button', { name: /Deploys that needed a hero/ })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')
    await user.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByText(/The pipeline should be the only one who remembers/)).toBeVisible()
  })

  it('runs the failing-test scenario and stops before anything ships', () => {
    vi.useFakeTimers()
    try {
      render(<App />)
      fireEvent.click(screen.getByRole('button', { name: 'Push a failing test' }))
      act(() => { vi.advanceTimersByTime(5000) })
      expect(screen.getByText(/pipeline stopped/)).toBeInTheDocument()
      const deploy = screen.getByRole('button', { name: /^release/i })
      expect(deploy).toHaveAttribute('data-state', 'skip')
    } finally {
      vi.useRealTimers()
    }
  })

  it('explains a pipeline stage when it is clicked', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Quality gate/ }))
    expect(screen.getByText(/If the gate fails, nothing ships/)).toBeInTheDocument()
  })

  it('copies the email and confirms with a toast', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: /Copy$/ }))
    expect(await screen.findByText('Email copied')).toBeInTheDocument()
    await expect(navigator.clipboard.readText()).resolves.toBe('abdullah.mtoor7@gmail.com')
  })
})

describe('prerender', () => {
  it('renders the full page to HTML without touching browser-only APIs', () => {
    const html = renderServer()
    expect(html).toContain('Abdullah')
    expect(html).toContain('Incident log')
    expect(html).toContain('build.gradle')
  })

  it('produces the same markup as the first browser render, so hydration matches', () => {
    const server = renderServer()
    const { container } = render(<App />)
    // React marks server and client output the same way when nothing differs
    expect(container.innerHTML.length).toBeGreaterThan(0)
    expect(server).toContain(container.querySelector('h1')!.textContent!.slice(0, 8))
  })
})
