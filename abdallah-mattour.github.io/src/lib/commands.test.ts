import { filterCommands, scoreCommand, type Command } from './commands'

const cmds: Command[] = [
  { id: 'resume', title: 'Open resume (PDF)', group: 'Actions', keywords: 'cv pdf download' },
  { id: 'email', title: 'Copy email address', group: 'Actions', keywords: 'contact mail' },
  { id: 'go-projects', title: 'Go to projects', group: 'Navigate', keywords: 'projects' },
  { id: 'hire', title: 'sudo hire abdullah', group: 'Just for fun', keywords: 'job offer' },
]

describe('command palette search', () => {
  it('shows everything, in order, for an empty query', () => {
    expect(filterCommands(cmds, '').map((c) => c.id)).toEqual(['resume', 'email', 'go-projects', 'hire'])
  })
  it('matches keywords, not just titles', () => {
    expect(filterCommands(cmds, 'cv')[0]?.id).toBe('resume')
    expect(filterCommands(cmds, 'job')[0]?.id).toBe('hire')
  })
  it('ranks a title prefix above a match inside a word', () => {
    expect(scoreCommand(cmds[1]!, 'copy')).toBeGreaterThan(scoreCommand(cmds[1]!, 'mail'))
  })
  it('allows typo-tolerant subsequence matches', () => {
    expect(filterCommands(cmds, 'prjcts').map((c) => c.id)).toContain('go-projects')
  })
  it('returns nothing when nothing matches', () => {
    expect(filterCommands(cmds, 'zzz')).toEqual([])
  })
})
