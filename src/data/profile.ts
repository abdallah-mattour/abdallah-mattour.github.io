// Every fact on the site lives here. Edit this file to update the content.

export const profile = {
  name: 'Abdullah Mattour',
  firstName: 'Abdullah',
  lastName: 'Mattour',
  role: 'Backend Engineer',
  stackLine: 'Java · Spring Boot · AWS',
  tagline: 'I make slow endpoints fast and manual deploys automatic.',
  intro:
    'For two years I built production microservices for a retail platform while finishing my CS degree. Now I’m looking for my next backend team in the U.S.',
  email: 'abdullah.mtoor7@gmail.com',
  linkedin: 'https://www.linkedin.com/in/abdullah-mattour/',
  github: 'https://github.com/abdallah-mattour',
  site: 'https://abdallah-mattour.github.io/',
  repo: 'https://github.com/abdallah-mattour/abdallah-mattour.github.io',
  resume: 'resume.pdf',
  photo: 'photo.jpg',
} as const

export const facts = [
  { label: 'U.S. Permanent Resident', detail: 'no sponsorship needed' },
  { label: 'NYC metro area', detail: 'open to relocation' },
  { label: '2 years in production', detail: 'Al Shini retail platform' },
] as const

export const serviceInfo = [
  { key: 'status', value: 'Open to work', tone: 'ok' },
  { key: 'role', value: 'Backend / Software Engineer' },
  { key: 'region', value: 'NYC metro area · open to relocation' },
  { key: 'work auth', value: 'U.S. Permanent Resident · no sponsorship needed' },
  { key: 'uptime', value: '2 years in production (part-time, remote)' },
  { key: 'build', value: 'B.S. Computer Science, Birzeit University, 2026' },
  { key: 'runtime', value: 'Java 17 · Spring Boot · PostgreSQL · Redis · AWS' },
] as const

export type MetricViz =
  | { kind: 'blocks'; count: number }
  | { kind: 'budget'; value: number; max: number }
  | { kind: 'bars'; after: number }
  | { kind: 'ring'; pct: number }
  | { kind: 'steps'; from: string; to: string }

export interface Metric {
  id: string
  label: string
  /** Number to count up to. Omit for text-only values. */
  value?: number
  prefix?: string
  suffix?: string
  unit?: string
  text?: string
  viz: MetricViz
}

export const metrics: Metric[] = [
  { id: 'services', label: 'Services shipped to production', value: 10, suffix: '+', viz: { kind: 'blocks', count: 10 } },
  { id: 'p95', label: 'p95 latency in production', value: 150, prefix: '<', unit: 'ms', viz: { kind: 'budget', value: 140, max: 300 } },
  { id: 'latency', label: 'Response time on key endpoints', value: 25, prefix: '−', suffix: '%', viz: { kind: 'bars', after: 75 } },
  { id: 'coverage', label: 'Test coverage, enforced in CI', value: 85, suffix: '%', viz: { kind: 'ring', pct: 85 } },
  { id: 'setup', label: 'New environment setup, down from days', text: 'minutes', viz: { kind: 'steps', from: 'days', to: 'minutes' } },
  { id: 'manual', label: 'Manual deployment work', value: 40, prefix: '−', suffix: '%', viz: { kind: 'bars', after: 60 } },
]

export type IncidentType = 'performance' | 'reliability' | 'security' | 'data' | 'ai'

export interface Incident {
  id: string
  type: IncidentType
  title: string
  where: string
  result: string
  happened: string
  causeLabel: string
  cause: string
  fix: string[]
  impact: string
  lesson: string
}

export const incidents: Incident[] = [
  {
    id: 'INC-001',
    type: 'performance',
    title: 'The endpoint that asked the database one question per row',
    where: 'Al Shini · order & reporting APIs',
    result: '−25% response time',
    happened:
      'Our order and reporting endpoints got slower as data grew. Nothing was broken, but the endpoints the business used every day were among the slowest we had.',
    causeLabel: 'Root cause',
    cause:
      'I followed the SQL that JPA generated for one request. Loading a list of orders ran one query for the list, then one more for each order’s related data: the classic N+1 problem.',
    fix: [
      'Loaded related data together instead of row by row',
      'Tuned the slowest SQL and added indexes that match how the endpoints filter and sort',
      'Added Redis caching for read-heavy responses across two REST services',
    ],
    impact: 'Response times on key order and reporting endpoints dropped 25%.',
    lesson: 'Measure before you cache. A cache on top of a bad query hides the problem until the next cache miss.',
  },
  {
    id: 'INC-002',
    type: 'reliability',
    title: 'Deploys that needed a hero',
    where: 'Al Shini · delivery pipeline',
    result: 'days → minutes',
    happened: 'Standing up a new environment took days, and releases depended on manual steps someone had to remember.',
    causeLabel: 'Root cause',
    cause: 'Infrastructure and release steps lived in people’s heads instead of in code, so every deploy carried risk.',
    fix: [
      'GitHub Actions pipelines that run tests and a SonarQube quality gate on every change',
      'Docker images released to AWS ECS, with rollback ready',
      'Infrastructure described in Terraform',
    ],
    impact: 'Environment setup went from days to minutes, and manual deployment work dropped 40%.',
    lesson: 'If a deploy needs a hero, it isn’t finished. The pipeline should be the only one who remembers the steps.',
  },
  {
    id: 'INC-003',
    type: 'security',
    title: 'Breaking into my own app before anyone else could',
    where: 'SATs · adaptive learning API',
    result: '3 holes closed',
    happened:
      'SATs has four roles: students, parents, teachers, and admins. One authorization mistake lets someone see or change data that isn’t theirs, so I audited the API the way an attacker would.',
    causeLabel: 'Findings',
    cause:
      'A privilege escalation path above a user’s role, refresh tokens accepted as access tokens, and answers that could be submitted to another student’s quiz attempt.',
    fix: [
      'Closed the escalation path',
      'Each token type is accepted only where it belongs',
      'Every answer is checked against the student’s own attempt and quiz',
    ],
    impact: 'Each fix shipped with regression tests in a suite of 240+ tests, so none of them can quietly come back.',
    lesson: 'Every ID in a request is a claim, not a fact. Check that it belongs to the person asking.',
  },
  {
    id: 'INC-004',
    type: 'data',
    title: 'Changing the user model without breaking a single foreign key',
    where: 'SATs · MySQL schema',
    result: '0 broken references',
    happened: 'The user model had to grow into four roles with their own data, which meant restructuring the table almost every other table points to.',
    causeLabel: 'Approach',
    cause: 'Refactored to JPA joined-table inheritance: a shared users table plus student, teacher, parent, and admin tables.',
    fix: ['Wrote the MySQL migration that copied existing rows into the new structure', 'Preserved every primary key during the copy'],
    impact: 'Every existing foreign key kept working after the switch.',
    lesson: 'A schema change is really a data change. Design the migration before you touch the entity.',
  },
  {
    id: 'INC-005',
    type: 'ai',
    title: 'An LLM in the request path, without trusting it',
    where: 'SATs · quiz generation',
    result: '3,000+ questions',
    happened: 'SATs needed far more practice questions than anyone could write by hand.',
    causeLabel: 'Risk',
    cause: 'Calling a model at quiz time adds a slow, unpredictable dependency. A bad or late answer can’t be allowed to break a student’s quiz.',
    fix: [
      'Python pipelines extracted 3,000+ questions from PDF textbooks',
      'Gemini integrated through Spring WebClient for new questions at quiz time',
      'Only validated questions are saved; a 10-second timeout falls back to the question bank',
    ],
    impact: 'Students get fresh questions when the model is fast and correct, and a normal quiz when it isn’t.',
    lesson: 'Treat an LLM like any other flaky dependency: timeout, validate, fall back.',
  },
  {
    id: 'INC-006',
    type: 'reliability',
    title: 'A workflow engine that knows how to say no',
    where: 'LRMIS · land registration',
    result: '12 states, 0 shortcuts',
    happened:
      'A land application moves between applicants, registrars, and surveyors. If it could skip a step, a parcel could be registered without being surveyed.',
    causeLabel: 'Approach',
    cause: 'Team of 3. I built the workflow engine at the core of the platform.',
    fix: [
      '12 application states, with per-state guards that reject invalid transitions on the server',
      'An append-only audit trail of every state change',
      'GeoJSON polygon validation, so invalid parcels never reach the survey step',
    ],
    impact: 'The only way through the system is the correct way, and every step leaves a record.',
    lesson: 'The UI can hide a button. Only the backend can refuse a request. Business rules belong on the server.',
  },
]

export const incidentTypes: { id: IncidentType | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'performance', label: 'Performance' },
  { id: 'reliability', label: 'Reliability' },
  { id: 'security', label: 'Security' },
  { id: 'data', label: 'Data' },
  { id: 'ai', label: 'AI' },
]

export const career = {
  start: '2022-09',
  phases: [
    { from: '2022-09', to: '2024-06', state: 'study', label: 'Studying' },
    { from: '2024-07', to: '2026-06', state: 'both', label: 'Studying + Al Shini' },
    { from: '2026-07', to: '2026-07', state: 'prod', label: 'Al Shini' },
    { from: '2026-08', to: '9999-12', state: 'open', label: 'Open to work' },
  ],
  events: [
    { when: 'Sep 2022', text: 'Started B.S. Computer Science at Birzeit University' },
    { when: 'Jul 2024', text: 'Joined Al Shini as a backend engineer' },
    { when: 'Jun 2026', text: 'Graduated' },
    { when: 'Jul 2026', text: 'Wrapped up two years at Al Shini' },
    { when: 'Now', text: 'Open to work, NYC metro area', now: true },
  ],
} as const

export const experience = {
  title: 'Backend Engineer',
  org: 'Al Shini, retail platform',
  meta: 'Part-time, remote · Jul 2024 – Jul 2026',
  bullets: [
    'Built and shipped **10+ production microservices** in Java 17, Spring Boot, and PostgreSQL, serving tens of thousands of requests a day, including a reporting service and a core API that automated order, return, and customer-account workflows.',
    'Designed versioned REST endpoints with server-side pagination, secured with Spring Security, JWT, and OAuth2 and documented in Swagger/OpenAPI, holding **p95 latency under 150 ms**.',
    'Cut response times **25%** on key order and reporting endpoints by removing JPA N+1 queries, tuning SQL and indexes, and adding Redis caching.',
    'Automated deployments with GitHub Actions, SonarQube, Docker, AWS ECS, and Terraform: environment setup from **days to minutes**, **40% less** manual deployment work.',
    'Held **85% test coverage** with JUnit 5 and Mockito, enforced by quality gates in CI; added Spring Boot Actuator and CloudWatch monitoring; worked in Agile/Scrum with Jira.',
  ],
  tags: ['Java 17', 'Spring Boot', 'PostgreSQL', 'Redis', 'AWS ECS', 'Terraform', 'GitHub Actions'],
}

export const education = {
  degree: 'B.S. Computer Science',
  school: 'Birzeit University',
  dates: 'Sep 2022 – Jun 2026',
  courses: ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Operating Systems', 'Database Systems', 'Web Services', 'Artificial Intelligence'],
  note: 'Worked two years in production alongside a full course load.',
}

export const projects = [
  {
    id: 'sats',
    name: 'SATs',
    kind: 'Adaptive learning platform',
    repo: 'https://github.com/abdallah-mattour/Manhaji',
    repoLabel: 'abdallah-mattour/Manhaji',
    summary: 'A Spring Boot REST API and a Flutter app for students, parents, teachers, and admins, with quizzes that adapt to each student’s mastery.',
    built: [
      'Security audit that closed three authorization holes, each with regression tests (240+ test suite)',
      'Joined-table user inheritance with a key-preserving MySQL migration',
      'Gemini question generation through Spring WebClient, with validation, a 10-second timeout, and fallback',
      'Python pipelines that turned PDF textbooks into 3,000+ questions',
    ],
    tags: ['Java 17', 'Spring Boot', 'Spring Security', 'JPA', 'MySQL', 'WebClient', 'Flutter'],
    stats: [
      { k: 'tests', v: '240+' },
      { k: 'roles', v: '4' },
      { k: 'questions', v: '3,000+' },
    ],
  },
  {
    id: 'lrmis',
    name: 'LRMIS',
    kind: 'Land registration system',
    repo: 'https://github.com/abdallah-mattour/land-registration-management-system',
    repoLabel: 'abdallah-mattour/land-registration-management-system',
    summary: 'A workflow-driven, map-based platform for applicants, registrars, and surveyors, in Arabic and English. Team of 3.',
    built: [
      'The workflow engine: 12 states, server-side transition guards, and an append-only audit trail',
      '11 analytics endpoints on 13 MongoDB aggregation pipelines, with a 60-second TTL cache',
      'The MongoDB layer: 15 collections with unique, TTL, and 2dsphere indexes, atomic ID counters, and GeoJSON validation',
    ],
    tags: ['Python', 'FastAPI', 'MongoDB', 'React', 'Leaflet'],
    stats: [
      { k: 'states', v: '12' },
      { k: 'endpoints', v: '11' },
      { k: 'collections', v: '15' },
    ],
  },
]

export const otherProjects = [
  { name: 'Anatomy-of-a-Goal', url: 'https://github.com/abdallah-mattour/Anatomy-of-a-Goal', note: 'football data analysis' },
  { name: 'Flight-Delay-Project', url: 'https://github.com/abdallah-mattour/Flight-Delay-Project', note: 'machine learning on flight delay data' },
]

export const stack: { comment: string; config: string; items: string[] }[] = [
  { comment: 'languages', config: 'implementation', items: ['java', 'python', 'sql', 'javascript'] },
  { comment: 'backend', config: 'implementation', items: ['spring-boot', 'spring-mvc', 'spring-data-jpa', 'spring-security', 'spring-webclient', 'fastapi'] },
  { comment: 'apis & architecture', config: 'implementation', items: ['rest', 'microservices', 'rbac', 'jwt', 'oauth2', 'api-versioning', 'pagination', 'openapi'] },
  { comment: 'data', config: 'runtimeOnly', items: ['postgresql', 'mysql', 'mongodb', 'redis', 'liquibase'] },
  { comment: 'cloud & delivery', config: 'deploy', items: ['aws:ecs,ec2,s3,iam,cloudwatch', 'docker', 'kubernetes', 'terraform', 'github-actions'] },
  { comment: 'quality & monitoring', config: 'testImplementation', items: ['junit5', 'mockito', 'sonarqube', 'tdd', 'postman', 'spring-boot-actuator'] },
]

export const runbook = [
  { rule: 'measure-first', text: 'Profile before optimizing, and fix the query before adding a cache.' },
  { rule: 'boring-deploys', text: 'If a deploy needs a hero, automate it until it doesn’t.' },
  { rule: 'verify-ownership', text: 'Every ID in a request is a claim. Check it belongs to the caller.' },
  { rule: 'migrate-data-first', text: 'Plan the data migration before changing the entity.' },
  { rule: 'expect-failure', text: 'Every dependency gets a timeout, validation, and a fallback.' },
  { rule: 'rules-on-server', text: 'The UI can hide a button. Only the backend can refuse a request.' },
]

export const sections = [
  { id: 'overview', label: 'Overview' },
  { id: 'monitor', label: 'Live' },
  { id: 'incidents', label: 'Incidents' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
] as const
