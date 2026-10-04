import { createRng } from './rng'

export const LATENCY_BUDGET_MS = 150

/**
 * Simulated request latency that behaves like a healthy service:
 * a steady baseline, small jitter, and rare spikes that still stay under the budget.
 */
export function createLatencyStream(seed = 7) {
  const rand = createRng(seed)
  let level = 96
  return function next(): number {
    level += (rand() - 0.5) * 10
    level = Math.min(118, Math.max(78, level))
    const jitter = (rand() - 0.5) * 14
    const spike = rand() < 0.06 ? 14 + rand() * 18 : 0
    const value = Math.round(level + jitter + spike)
    return Math.min(LATENCY_BUDGET_MS - 4, Math.max(42, value))
  }
}

export function initialSeries(length: number, seed = 7): number[] {
  const next = createLatencyStream(seed)
  return Array.from({ length }, () => next())
}

/** Nearest-rank percentile. */
export function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const rank = Math.ceil((p / 100) * sorted.length)
  return sorted[Math.min(sorted.length - 1, Math.max(0, rank - 1))]!
}

/** SVG path for a series scaled into a width x height box with a fixed y max. */
export function toPath(values: number[], width: number, height: number, yMax: number): string {
  if (values.length === 0) return ''
  const step = values.length > 1 ? width / (values.length - 1) : 0
  return values
    .map((v, i) => {
      const x = i * step
      const y = height - (Math.min(v, yMax) / yMax) * height
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
}
