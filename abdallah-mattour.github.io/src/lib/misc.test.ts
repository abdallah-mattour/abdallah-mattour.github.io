import { createFeed } from './feed'
import { createRng } from './rng'
import { boldParts } from './text'

describe('rng', () => {
  it('is deterministic and stays in [0, 1)', () => {
    const a = createRng(5), b = createRng(5)
    const xs = Array.from({ length: 1000 }, a)
    expect(xs).toEqual(Array.from({ length: 1000 }, b))
    expect(xs.every((x) => x >= 0 && x < 1)).toBe(true)
  })
})

describe('deploy feed', () => {
  it('emits unique ids and known event kinds', () => {
    const next = createFeed(23)
    const events = Array.from({ length: 300 }, next)
    expect(new Set(events.map((e) => e.id)).size).toBe(300)
    expect(new Set(events.map((e) => e.kind))).toEqual(new Set(['deploy', 'health', 'ci', 'cache', 'scale', 'alarm']))
  })
  it('opens with a varied first screen', () => {
    const next = createFeed(23)
    const kinds = Array.from({ length: 6 }, () => next().kind)
    expect(kinds[0]).toBe('deploy')
    expect(new Set(kinds).size).toBeGreaterThanOrEqual(5)
  })
})

describe('boldParts', () => {
  it('splits **bold** segments', () => {
    expect(boldParts('a **b** c')).toEqual([
      { text: 'a ', bold: false },
      { text: 'b', bold: true },
      { text: ' c', bold: false },
    ])
  })
})
