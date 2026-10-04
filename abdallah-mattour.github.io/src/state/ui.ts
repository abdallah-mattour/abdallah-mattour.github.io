import { createContext, useContext } from 'react'
import type { Scenario } from '../lib/pipeline'

export interface Toast { id: number; text: string }
export type PipelineHandler = (scenario: Scenario) => void

export interface Ui {
  toasts: Toast[]
  toast: (text: string) => void
  recruiter: boolean
  setRecruiter: (on: boolean) => void
  paletteOpen: boolean
  setPaletteOpen: (open: boolean) => void
  /** Ask the pipeline section to run a scenario (used by the command palette). */
  runPipeline: (scenario: Scenario) => void
  /** The pipeline section subscribes here; returns an unsubscribe function. */
  onPipelineRequest: (handler: PipelineHandler) => () => void
}

export const UiContext = createContext<Ui | null>(null)

export function useUi(): Ui {
  const ctx = useContext(UiContext)
  if (!ctx) throw new Error('useUi must be used inside <UiProvider>')
  return ctx
}
