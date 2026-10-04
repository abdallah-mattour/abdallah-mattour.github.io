import { useEffect, useState, type RefObject } from 'react'
import { useReducedMotion } from './useReducedMotion'

/** True while the element is on screen, the tab is visible, and motion is allowed. Live widgets pause otherwise. */
export function useLiveness(ref: RefObject<Element | null>): boolean {
  const reduced = useReducedMotion()
  const [onScreen, setOnScreen] = useState(false)
  const [tabVisible, setTabVisible] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(([e]) => setOnScreen(Boolean(e?.isIntersecting)))
    io.observe(el)
    return () => io.disconnect()
  }, [ref])
  useEffect(() => {
    const update = () => setTabVisible(document.visibilityState === 'visible')
    update()
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])
  return onScreen && tabVisible && !reduced
}
