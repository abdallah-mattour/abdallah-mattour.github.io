import { createRng } from './rng'

export type FeedTone = 'ok' | 'info' | 'warn'
export interface FeedEvent { id: number; kind: string; target: string; detail: string; tone: FeedTone }

const SERVICES = ['orders-api', 'returns-api', 'accounts-api', 'reporting-service']

/** A simulated, healthy-looking event feed. Deterministic per seed. */
export function createFeed(seed = 11) {
  const rand = createRng(seed)
  let id = 0
  let version = 40
  const pick = <T,>(xs: readonly T[]): T => xs[Math.floor(rand() * xs.length)]!
  return function next(): FeedEvent {
    id++
    const svc = pick(SERVICES)
    const r = rand()
    if (r < 0.28) {
      version++
      return { id, kind: 'deploy', target: svc, detail: `v1.${version} → ECS · ✓ healthy`, tone: 'ok' }
    }
    if (r < 0.5) return { id, kind: 'health', target: svc, detail: `p95 ${Math.round(92 + rand() * 40)} ms · ✓ under budget`, tone: 'ok' }
    if (r < 0.68) return { id, kind: 'ci', target: svc, detail: 'tests ✓ · coverage 85% · gate ✓', tone: 'info' }
    if (r < 0.84) return { id, kind: 'cache', target: svc, detail: `redis hit ratio ${(0.9 + rand() * 0.08).toFixed(2)}`, tone: 'info' }
    if (r < 0.94) return { id, kind: 'scale', target: svc, detail: 'ECS tasks 2 → 3 · traffic peak', tone: 'warn' }
    return { id, kind: 'alarm', target: svc, detail: 'CloudWatch OK · 0 alarms', tone: 'ok' }
  }
}
