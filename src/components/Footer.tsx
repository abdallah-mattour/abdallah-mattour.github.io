import { profile } from '../data/profile'

export function Footer() {
  const sha = __BUILD_SHA__
  const commitUrl = sha === 'local' ? profile.repo : `${profile.repo}/commit/${sha}`
  return (
    <footer className="footer mono">
      <p>
        Shipped by GitHub Actions: lint → typecheck → tests → Lighthouse gate → deploy.{' '}
        <a href={`${profile.repo}/actions`} target="_blank" rel="noopener">See the pipeline</a>
      </p>
      <p>
        build <a href={commitUrl} target="_blank" rel="noopener">{sha}</a> · {__BUILD_DATE__} ·{' '}
        <a href={profile.repo} target="_blank" rel="noopener">source</a> · press <kbd>/</kbd> for commands
      </p>
    </footer>
  )
}
