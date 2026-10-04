import { createLatencyStream, initialSeries, LATENCY_BUDGET_MS, percentile, toPath } from './latency'

describe('latency simulation', () => {
  it('never breaks the 150 ms budget, even over a long run', () => {
    const next = createLatencyStream(7)
    const values = Array.from({ length: 5000 }, next)
    expect(Math.max(...values)).toBeLessThan(LATENCY_BUDGET_MS)
    expect(Math.min(...values)).toBeGreaterThan(0)
    expect(percentile(values, 95)).toBeLessThan(LATENCY_BUDGET_MS)
  })

  it('is deterministic per seed, so the server and browser render the same first frame', () => {
    expect(initialSeries(60, 7)).toEqual(initialSeries(60, 7))
    expect(initialSeries(60, 7)).not.toEqual(initialSeries(60, 8))
  })
})

describe('percentile', () => {
  it('uses nearest rank', () => {
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 95)).toBe(10)
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 50)).toBe(5)
  })
  it('handles empty and single-value input', () => {
    expect(percentile([], 95)).toBe(0)
    expect(percentile([42], 95)).toBe(42)
  })
})

describe('toPath', () => {
  it('maps values into the box, top = y max', () => {
    expect(toPath([0, 200], 100, 50, 200)).toBe('M0.0,50.0 L100.0,0.0')
  })
  it('clamps values above y max and returns empty for no data', () => {
    expect(toPath([400], 100, 50, 200)).toBe('M0.0,0.0')
    expect(toPath([], 100, 50, 200)).toBe('')
  })
})
