import { useRef, type ElementType, type ReactNode, type HTMLAttributes } from 'react'
import { useEntrance } from '../hooks/useEntrance'

type Props = HTMLAttributes<HTMLElement> & { as?: ElementType; children: ReactNode }

/** Eases a block up into place when it scrolls into view. Never hides content that's already visible. */
export function Reveal({ as: Tag = 'div', className = '', children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null)
  const phase = useEntrance(ref, 0.12)
  return (
    <Tag ref={ref} className={`reveal reveal--${phase} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  )
}
