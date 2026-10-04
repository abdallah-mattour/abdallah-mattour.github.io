import { applySteps, finishedOk, scenarios, stages } from './pipeline'

describe('pipeline scenarios', () => {
  it('a clean run ends with every stage green', () => {
    expect(finishedOk.states).toEqual(stages.map(() => 'ok'))
    expect(finishedOk.log.at(-1)?.text).toContain('deploy complete')
  })

  it('a failing test stops the pipeline before anything ships', () => {
    const snap = applySteps(scenarios.test.steps)
    expect(snap.states[1]).toBe('fail')
    // quality gate, image, deploy and monitor never run
    expect(snap.states.slice(2)).toEqual(['skip', 'skip', 'skip', 'skip'])
    expect(snap.log.at(-1)?.tone).toBe('bad')
  })

  it('a bad release is rolled back and the previous version is healthy again', () => {
    const snap = applySteps(scenarios.release.steps)
    expect(snap.states[4]).toBe('rollback')
    expect(snap.states[5]).toBe('ok')
    expect(snap.log.some((l) => l.text.includes('health checks failing'))).toBe(true)
    expect(snap.log.at(-1)?.text).toContain('rolled back')
  })

  it('applies steps on top of an existing snapshot without mutating it', () => {
    const start = applySteps([])
    const after = applySteps([{ stage: 0, state: 'ok', line: 'x' }], start)
    expect(start.states[0]).toBe('idle')
    expect(start.log).toHaveLength(0)
    expect(after.states[0]).toBe('ok')
  })
})
