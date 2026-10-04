import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { filterCommands, type Command } from '../lib/commands'
import { SearchIcon } from './Icons'
import { useUi } from '../state/ui'

export interface PaletteAction extends Command {
  run: () => void
}

function PaletteDialog({ actions, onClose }: { actions: PaletteAction[]; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listId = useId()
  const results = useMemo(() => filterCommands(actions, query) as PaletteAction[], [actions, query])
  const activeIndex = Math.min(active, Math.max(0, results.length - 1))

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = overflow
      previous?.focus?.()
    }
  }, [])

  const runAt = (i: number) => {
    const action = results[i]
    if (!action) return
    onClose()
    window.setTimeout(action.run, 0)
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((activeIndex + 1) % Math.max(1, results.length)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((activeIndex - 1 + results.length) % Math.max(1, results.length)) }
    else if (e.key === 'Enter') { e.preventDefault(); runAt(activeIndex) }
    else if (e.key === 'Escape') { e.preventDefault(); onClose() }
    else if (e.key === 'Tab') { e.preventDefault() }
  }

  return (
    <div className="palette" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="palette__dialog" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette__input">
          <SearchIcon />
          <input
            ref={inputRef}
            id="palette-input"
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex]!.id}` : undefined}
            aria-autocomplete="list"
            placeholder="Type a command or search…"
            autoComplete="off"
            spellCheck={false}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setActive(0) }}
            onKeyDown={onKeyDown}
          />
          <kbd>esc</kbd>
        </div>
        <ul className="palette__list" id={listId} role="listbox" aria-label="Commands">
          {results.length === 0 && <li className="palette__empty">No command matches “{query}”. Try “resume” or “email”.</li>}
          {results.map((a, i) => {
            const header = !query && (i === 0 || results[i - 1]!.group !== a.group) ? a.group : null
            return (
              <li key={a.id} role="presentation">
                {header && <div className="palette__group" role="presentation">{header}</div>}
                <div
                  id={`${listId}-${a.id}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className="palette__item"
                  onMouseMove={() => i !== activeIndex && setActive(i)}
                  onClick={() => runAt(i)}
                >
                  <span>{a.title}</span>
                  {a.hint && <span className="palette__hint mono">{a.hint}</span>}
                  {query && <span className="palette__tag mono">{a.group}</span>}
                </div>
              </li>
            )
          })}
        </ul>
        <div className="palette__foot mono">
          <span><kbd>↑</kbd><kbd>↓</kbd> move</span>
          <span><kbd>↵</kbd> run</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </div>
  )
}

export function CommandPalette({ actions }: { actions: PaletteAction[] }) {
  const { paletteOpen, setPaletteOpen } = useUi()
  if (!paletteOpen) return null
  return <PaletteDialog actions={actions} onClose={() => setPaletteOpen(false)} />
}
