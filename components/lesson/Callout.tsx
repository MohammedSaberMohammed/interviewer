import { cn } from '@/lib/utils'
import { CALLOUT_CONFIG } from '@/lib/constants'
import type { CalloutType } from '@/types/content'

interface CalloutProps {
  type: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

export function Callout({ type, title, children, className }: CalloutProps) {
  const config = CALLOUT_CONFIG[type]
  const defaultTitle = title ?? config.label

  return (
    <aside
      className={cn(
        'my-6 rounded-xl border p-4',
        config.bgClass,
        config.borderClass,
        className
      )}
      role={type === 'warning' || type === 'critical' ? 'alert' : 'note'}
    >
      <p className={cn('mb-1 flex items-center gap-1.5 text-sm font-semibold', config.titleClass)}>
        <span aria-hidden="true">{config.icon}</span>
        {defaultTitle}
      </p>
      <div className="text-sm text-foreground/90 [&>p]:mt-1 [&>p:first-child]:mt-0">
        {children}
      </div>
    </aside>
  )
}
