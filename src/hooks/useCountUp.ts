import { useEffect, useState } from 'react'
import type { EntrancePhase } from './useEntrance'

const ease = (t: number) => 1 - Math.pow(1 - t, 3)

/** Shows `target` at rest, 0 while armed off screen, and counts up when the phase turns to 'play'. */
export function useCountUp(target: number, phase: EntrancePhase, duration = 1100): number {
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    if (phase !== 'play') return
    let raf = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      setAnimated(Math.round(ease(t) * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [phase, target, duration])
  if (phase === 'rest') return target
  if (phase === 'armed') return 0
  return animated
}
