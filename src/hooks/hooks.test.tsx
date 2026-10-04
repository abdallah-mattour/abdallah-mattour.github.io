import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { LiveMonitor } from '../components/LiveMonitor'
import { UiProvider } from '../components/UiProvider'
import { useCountUp } from './useCountUp'
import { useEntrance } from './useEntrance'

// A controllable IntersectionObserver: tests decide what is on screen.
type Cb = (entries: { isIntersecting: boolean; target: Element; intersectionRatio: number }[]) => void
const observers: { cb: Cb; el?: Element }[] = []
class FakeIO {
  private rec: { cb: Cb; el?: Element }
  constructor(cb: Cb) { this.rec = { cb }; observers.push(this.rec) }
  observe(el: Element) { this.rec.el = el }
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
const setVisible = (visible: boolean) =>
  act(() => observers.forEach((o) => o.el && o.cb([{ isIntersecting: visible, target: o.el, intersectionRatio: visible ? 1 : 0 }])))

let original: typeof IntersectionObserver
beforeEach(() => {
  observers.length = 0
  original = window.IntersectionObserver
  window.IntersectionObserver = FakeIO as unknown as typeof IntersectionObserver
})
afterEach(() => { window.IntersectionObserver = original })

function Probe({ target = 85 }: { target?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const phase = useEntrance(ref)
  const n = useCountUp(target, phase, 200)
  return <div ref={ref} data-testid="probe" data-phase={phase}>{n}</div>
}

describe('entrance animations never hide visible content', () => {
  it('stays at rest when the element is already on screen at load', () => {
    render(<Probe />)
    setVisible(true)
    expect(screen.getByTestId('probe')).toHaveAttribute('data-phase', 'rest')
    expect(screen.getByTestId('probe')).toHaveTextContent('85')
  })

  it('arms only while off screen, then counts up to the real value once visible', async () => {
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame', 'performance'] })
    try {
      render(<Probe />)
      setVisible(false)
      expect(screen.getByTestId('probe')).toHaveAttribute('data-phase', 'armed')
      expect(screen.getByTestId('probe')).toHaveTextContent('0')
      setVisible(true)
      expect(screen.getByTestId('probe')).toHaveAttribute('data-phase', 'play')
      await act(async () => { vi.advanceTimersByTime(400) })
      expect(screen.getByTestId('probe')).toHaveTextContent('85')
    } finally {
      vi.useRealTimers()
    }
  })
})

describe('live monitor', () => {
  it('streams new latency points and feed events while on screen, and pauses off screen', () => {
    vi.useFakeTimers()
    try {
      const { container } = render(<UiProvider><LiveMonitor /></UiProvider>)
      expect(screen.getByText(/paused/)).toBeInTheDocument()
      setVisible(true)
      expect(screen.getByText(/streaming/)).toBeInTheDocument()
      const firstRow = () => container.querySelector('.feed__row')?.textContent
      const before = firstRow()
      act(() => { vi.advanceTimersByTime(3000) })
      expect(firstRow()).not.toBe(before)
      expect(container.querySelector('.feed__row')).toHaveTextContent('now')
      setVisible(false)
      expect(screen.getByText(/paused/)).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })
})
