import { career } from '../data/profile'
import { buildMonths } from './timeline'

describe('career timeline', () => {
  const months = buildMonths(career.start, '2026-10', career.phases)

  it('has one bar per month, inclusive', () => {
    expect(months).toHaveLength(50)
    expect(months[0]?.label).toBe('Sep 2022')
    expect(months.at(-1)?.label).toBe('Oct 2026')
  })

  it('tags each month with the right phase', () => {
    const at = (key: string) => months.find((m) => m.key === key)?.state
    expect(at('2023-01')).toBe('study')
    expect(at('2024-07')).toBe('both')
    expect(at('2026-06')).toBe('both')
    expect(at('2026-07')).toBe('prod')
    expect(at('2026-08')).toBe('open')
  })

  it('crosses year boundaries correctly', () => {
    const keys = buildMonths('2023-11', '2024-02', career.phases).map((m) => m.key)
    expect(keys).toEqual(['2023-11', '2023-12', '2024-01', '2024-02'])
  })
})
