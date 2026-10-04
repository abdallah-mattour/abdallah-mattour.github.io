export interface Phase { from: string; to: string; state: string; label: string }
export interface Month { key: string; label: string; year: number; month: number; state: string; phaseLabel: string }

const NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** Every month from `start` (YYYY-MM) through `end` (YYYY-MM), tagged with the phase it falls in. */
export function buildMonths(start: string, end: string, phases: readonly Phase[]): Month[] {
  const [sy, sm] = start.split('-').map(Number) as [number, number]
  const [ey, em] = end.split('-').map(Number) as [number, number]
  const out: Month[] = []
  for (let y = sy, m = sm; y < ey || (y === ey && m <= em); m === 12 ? (y++, (m = 1)) : m++) {
    const key = `${y}-${String(m).padStart(2, '0')}`
    const phase = phases.find((p) => key >= p.from && key <= p.to)
    out.push({ key, label: `${NAMES[m - 1]} ${y}`, year: y, month: m, state: phase?.state ?? 'none', phaseLabel: phase?.label ?? '' })
  }
  return out
}
