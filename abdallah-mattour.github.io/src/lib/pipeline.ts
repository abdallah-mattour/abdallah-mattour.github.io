export type StageState = 'idle' | 'run' | 'ok' | 'fail' | 'skip' | 'rollback'
export type Scenario = 'ok' | 'test' | 'release'
export type Tone = 'info' | 'ok' | 'bad' | 'warn'

export interface Stage {
  id: string
  step: string
  name: string
  tool: string
  detail: string
}

export const stages: Stage[] = [
  { id: 'push', step: 'commit', name: 'Push', tool: 'git push', detail: 'A push to the repository starts the pipeline. Nothing reaches production any other way.' },
  { id: 'test', step: 'build', name: 'Test', tool: 'JUnit 5 · Mockito', detail: 'The full JUnit 5 and Mockito suite runs on every change. Coverage held at 85%.' },
  { id: 'gate', step: 'gate', name: 'Quality gate', tool: 'SonarQube', detail: 'SonarQube checks code quality and coverage. If the gate fails, nothing ships.' },
  { id: 'image', step: 'package', name: 'Image', tool: 'Docker', detail: 'The service is packaged as a Docker image, so every environment runs exactly the same build.' },
  { id: 'deploy', step: 'release', name: 'Deploy', tool: 'AWS ECS · Terraform', detail: 'Terraform describes the infrastructure. The new version rolls out on AWS ECS, and the previous one stays ready for rollback.' },
  { id: 'monitor', step: 'observe', name: 'Monitor', tool: 'Actuator · CloudWatch', detail: 'Spring Boot Actuator health checks and CloudWatch logs confirm the release. A bad release rolls back.' },
]

/** One step of a run: optionally change a stage, optionally print a log line. */
export interface RunStep {
  stage?: number
  state?: StageState
  line?: string
  tone?: Tone
  /** mark every stage still idle as skipped */
  skipRest?: boolean
}

export const scenarios: Record<Scenario, { label: string; steps: RunStep[] }> = {
  ok: {
    label: 'Run pipeline',
    steps: [
      { stage: 0, state: 'ok', line: '▶ pipeline started · main', tone: 'info' },
      { stage: 1, state: 'ok', line: '✓ tests passed · coverage 85%', tone: 'ok' },
      { stage: 2, state: 'ok', line: '✓ quality gate passed', tone: 'ok' },
      { stage: 3, state: 'ok', line: '✓ image built', tone: 'ok' },
      { stage: 4, state: 'ok', line: '✓ released to AWS ECS', tone: 'ok' },
      { stage: 5, state: 'ok', line: '✓ health checks green', tone: 'ok' },
      { line: '● deploy complete', tone: 'ok' },
    ],
  },
  test: {
    label: 'Push a failing test',
    steps: [
      { stage: 0, state: 'ok', line: '▶ pipeline started · feature branch', tone: 'info' },
      { stage: 1, state: 'fail', line: '✗ 1 test failed', tone: 'bad' },
      { skipRest: true, line: '■ pipeline stopped · nothing shipped, production untouched', tone: 'bad' },
    ],
  },
  release: {
    label: 'Ship a bad release',
    steps: [
      { stage: 0, state: 'ok', line: '▶ pipeline started · main', tone: 'info' },
      { stage: 1, state: 'ok', line: '✓ tests passed · coverage 85%', tone: 'ok' },
      { stage: 2, state: 'ok', line: '✓ quality gate passed', tone: 'ok' },
      { stage: 3, state: 'ok', line: '✓ image built', tone: 'ok' },
      { stage: 4, state: 'ok', line: '✓ released to AWS ECS', tone: 'ok' },
      { stage: 5, state: 'fail', line: '✗ health checks failing after release', tone: 'bad' },
      { stage: 4, state: 'rollback', line: '↩ rolling back to the previous version', tone: 'warn' },
      { stage: 5, state: 'ok', line: '✓ previous version healthy', tone: 'ok' },
      { line: '● rolled back · previous version restored', tone: 'warn' },
    ],
  },
}

export interface PipelineSnapshot {
  states: StageState[]
  log: { text: string; tone: Tone }[]
}

export const finishedOk: PipelineSnapshot = applySteps(scenarios.ok.steps)

/** Pure reducer: apply steps to an idle pipeline. Used by the UI (step by step) and by the tests. */
export function applySteps(steps: RunStep[], from?: PipelineSnapshot): PipelineSnapshot {
  const states = from ? [...from.states] : stages.map((): StageState => 'idle')
  const log = from ? [...from.log] : []
  for (const s of steps) {
    if (s.stage !== undefined && s.state) states[s.stage] = s.state
    if (s.skipRest) states.forEach((st, i) => { if (st === 'idle') states[i] = 'skip' })
    if (s.line) log.push({ text: s.line, tone: s.tone ?? 'info' })
  }
  return { states, log }
}
