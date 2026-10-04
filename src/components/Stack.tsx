import { runbook, stack } from '../data/profile'
import { Reveal } from './Reveal'

const MAX_LINE = 64

/** Group quoted items into lines no longer than MAX_LINE characters after the indent. */
function wrapItems(config: string, items: string[]): string[][] {
  const lines: string[][] = [[]]
  let width = 4 + config.length + 1
  for (const it of items) {
    const w = it.length + 4
    const line = lines[lines.length - 1]!
    if (line.length > 0 && width + w > MAX_LINE) {
      lines.push([it])
      width = 4 + config.length + 1 + w
    } else {
      line.push(it)
      width += w
    }
  }
  return lines
}

export function Stack() {
  return (
    <section id="stack" className="two" data-deep aria-label="Stack and principles">
      <Reveal className="panel">
        <div className="panel__head">
          <h2 className="label">Stack</h2>
          <span className="tag mono">no skill bars, just what I ship with</span>
        </div>
        <div className="code__file mono"><span className="dot dot--warn" aria-hidden="true" />build.gradle</div>
        <pre className="code mono">
          <span className="c">{'// what this engineer runs on'}</span>{'\n'}
          <span className="k">java</span>{' { toolchain { languageVersion = '}<span className="f">17</span>{' } }\n\n'}
          <span className="k">dependencies</span>{' {\n'}
          {stack.map((g, gi) => (
            <span key={g.comment}>
              {'    '}<span className="c">{`// ${g.comment}`}</span>{'\n'}
              {'    '}{g.config}{' '}
              {wrapItems(g.config, g.items).map((line, li, all) => (
                <span key={li}>
                  {li > 0 && ' '.repeat(g.config.length + 5)}
                  {line.map((it, i) => (
                    <span key={it}>
                      <span className="s">{`'${it}'`}</span>
                      {i < line.length - 1 ? ', ' : li < all.length - 1 ? ',\n' : ''}
                    </span>
                  ))}
                </span>
              ))}
              {gi < stack.length - 1 ? '\n\n' : '\n'}
            </span>
          ))}
          {'}'}
        </pre>
      </Reveal>
      <Reveal as="aside" className="panel" aria-labelledby="runbook-title">
        <div className="panel__head">
          <h2 id="runbook-title" className="label">Runbook</h2>
          <span className="tag mono">how I work</span>
        </div>
        <ul className="runbook">
          {runbook.map((r) => (
            <li key={r.rule}><code className="mono">{r.rule}</code><span>{r.text}</span></li>
          ))}
        </ul>
      </Reveal>
    </section>
  )
}
