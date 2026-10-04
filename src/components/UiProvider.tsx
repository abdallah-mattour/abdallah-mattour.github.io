import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react'
import type { Scenario } from '../lib/pipeline'
import { UiContext, type PipelineHandler, type Toast } from '../state/ui'

export function UiProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const [recruiter, setRecruiter] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const nextId = useRef(1)
  const pipelineHandlers = useRef(new Set<PipelineHandler>())

  const toast = useCallback((text: string) => {
    const id = nextId.current++
    setToasts((t) => [...t.slice(-2), { id, text }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  const onPipelineRequest = useCallback((handler: PipelineHandler) => {
    pipelineHandlers.current.add(handler)
    return () => { pipelineHandlers.current.delete(handler) }
  }, [])

  const runPipeline = useCallback((scenario: Scenario) => {
    pipelineHandlers.current.forEach((h) => h(scenario))
  }, [])

  const value = useMemo(
    () => ({ toasts, toast, recruiter, setRecruiter, paletteOpen, setPaletteOpen, runPipeline, onPipelineRequest }),
    [toasts, toast, recruiter, paletteOpen, runPipeline, onPipelineRequest],
  )
  return <UiContext.Provider value={value}>{children}</UiContext.Provider>
}
