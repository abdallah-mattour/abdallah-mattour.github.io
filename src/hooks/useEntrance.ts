import { useEffect, useState, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/**
 * Entrance animation phase for an element.
 * - 'rest'  : final state. Used on the server, for anything visible at load, and with reduced motion.
 * - 'armed' : start state, only applied while the element is still off screen.
 * - 'play'  : the element scrolled into view; animate to the final state.
 * Content is never hidden while a visitor can see it.
 */
export type EntrancePhase = 'rest' | 'armed' | 'play'

export function useEntrance(ref: RefObject<Element | null>, threshold = 0.2): EntrancePhase {
  const reduced = useReducedMotion()
  const [phase, setPhase] = useState<EntrancePhase>('rest')
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || typeof IntersectionObserver === 'undefined') return
    let first = true
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        if (first) {
          first = false
          if (!entry.isIntersecting) setPhase('armed')
          else io.disconnect()
          return
        }
        if (entry.isIntersecting) {
          setPhase('play')
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ref, reduced, threshold])
  return phase
}
