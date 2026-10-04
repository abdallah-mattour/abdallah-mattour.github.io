export interface Command {
  id: string
  title: string
  group: 'Navigate' | 'Actions' | 'Just for fun'
  keywords?: string
  hint?: string
}

/**
 * Score how well a query matches a command. Higher is better, 0 means no match.
 * Prefers prefix and word-start matches, then falls back to an in-order subsequence.
 */
export function scoreCommand(cmd: Command, query: string): number {
  const q = query.trim().toLowerCase()
  if (!q) return 1
  const title = cmd.title.toLowerCase()
  const hay = `${title} ${(cmd.keywords ?? '').toLowerCase()}`
  if (title.startsWith(q)) return 100
  if (hay.split(/[\s/·-]+/).some((w) => w.startsWith(q))) return 80
  if (hay.includes(q)) return 60
  let i = 0
  for (const ch of hay) if (ch === q[i]) i++
  return i === q.length ? 20 : 0
}

export function filterCommands(commands: Command[], query: string): Command[] {
  return commands
    .map((cmd, index) => ({ cmd, index, score: scoreCommand(cmd, query) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((r) => r.cmd)
}
