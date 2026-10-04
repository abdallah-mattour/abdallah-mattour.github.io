import { incidents, incidentTypes, metrics, profile, projects, sections } from './profile'

describe('content', () => {
  it('has unique incident ids and only known incident types', () => {
    expect(new Set(incidents.map((i) => i.id)).size).toBe(incidents.length)
    const types = new Set(incidentTypes.map((t) => t.id))
    incidents.forEach((i) => expect(types.has(i.type)).toBe(true))
  })
  it('gives every metric either a number or a text value', () => {
    metrics.forEach((m) => expect(m.value !== undefined || m.text !== undefined).toBe(true))
  })
  it('links projects to the right GitHub repos', () => {
    projects.forEach((p) => expect(p.repo).toMatch(/^https:\/\/github\.com\/abdallah-mattour\//))
  })
  it('uses relative paths for files served next to the page', () => {
    expect(profile.resume).toBe('resume.pdf')
    expect(profile.photo).toBe('photo.jpg')
  })
  it('has unique section ids', () => {
    expect(new Set(sections.map((s) => s.id)).size).toBe(sections.length)
  })
})
