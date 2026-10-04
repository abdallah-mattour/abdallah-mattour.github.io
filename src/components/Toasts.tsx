import { useUi } from '../state/ui'

export function Toasts() {
  const { toasts } = useUi()
  return (
    <div className="toasts" role="status" aria-live="polite">
      {toasts.map((t) => <div key={t.id} className="toast mono">{t.text}</div>)}
    </div>
  )
}
