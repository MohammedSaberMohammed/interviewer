'use client'

import { Info, Lightbulb, AlertTriangle, Zap, Skull, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CalloutType } from '@/types'

interface CalloutProps {
  type: CalloutType
  title?: string
  children: React.ReactNode
  className?: string
}

const CALLOUT_STYLES: Record<
  CalloutType,
  {
    label: string
    Icon: React.ComponentType<{ className?: string }>
    bg: string
    border: string
    bar: string
    iconBg: string
    iconColor: string
    titleColor: string
  }
> = {
  info: {
    label: 'Note',
    Icon: Info,
    bg: 'bg-[oklch(0.95_0.04_195/0.5)] dark:bg-[oklch(0.155_0.055_195/0.5)]',
    border: 'border-[oklch(0.62_0.19_195/0.25)] dark:border-[oklch(0.72_0.18_195/0.2)]',
    bar: 'bg-[oklch(0.62_0.19_195)] dark:bg-[oklch(0.72_0.18_195)] dark:shadow-[0_0_12px_oklch(0.72_0.18_195/0.5)]',
    iconBg: 'bg-[oklch(0.62_0.19_195/0.12)] dark:bg-[oklch(0.72_0.18_195/0.15)]',
    iconColor: 'text-[oklch(0.55_0.19_195)] dark:text-[oklch(0.82_0.18_195)]',
    titleColor: 'text-[oklch(0.42_0.18_195)] dark:text-[oklch(0.82_0.18_195)]',
  },
  tip: {
    label: 'Tip',
    Icon: Lightbulb,
    bg: 'bg-[oklch(0.95_0.05_145/0.5)] dark:bg-[oklch(0.155_0.05_145/0.5)]',
    border: 'border-[oklch(0.60_0.17_145/0.25)] dark:border-[oklch(0.72_0.20_145/0.2)]',
    bar: 'bg-[oklch(0.60_0.17_145)] dark:bg-[oklch(0.72_0.20_145)] dark:shadow-[0_0_12px_oklch(0.72_0.20_145/0.5)]',
    iconBg: 'bg-[oklch(0.60_0.17_145/0.12)] dark:bg-[oklch(0.72_0.20_145/0.15)]',
    iconColor: 'text-[oklch(0.50_0.17_145)] dark:text-[oklch(0.8_0.20_145)]',
    titleColor: 'text-[oklch(0.38_0.16_145)] dark:text-[oklch(0.8_0.20_145)]',
  },
  warning: {
    label: 'Warning',
    Icon: AlertTriangle,
    bg: 'bg-[oklch(0.97_0.06_85/0.5)] dark:bg-[oklch(0.165_0.05_85/0.5)]',
    border: 'border-[oklch(0.78_0.17_72/0.3)] dark:border-[oklch(0.78_0.18_85/0.2)]',
    bar: 'bg-[oklch(0.78_0.17_72)] dark:bg-[oklch(0.78_0.18_85)] dark:shadow-[0_0_12px_oklch(0.78_0.18_85/0.5)]',
    iconBg: 'bg-[oklch(0.78_0.17_72/0.12)] dark:bg-[oklch(0.78_0.18_85/0.15)]',
    iconColor: 'text-[oklch(0.62_0.16_72)] dark:text-[oklch(0.88_0.18_85)]',
    titleColor: 'text-[oklch(0.50_0.15_72)] dark:text-[oklch(0.88_0.18_85)]',
  },
  critical: {
    label: 'Critical',
    Icon: Zap,
    bg: 'bg-[oklch(0.96_0.05_27/0.5)] dark:bg-[oklch(0.155_0.055_27/0.5)]',
    border: 'border-[oklch(0.63_0.22_27/0.3)] dark:border-[oklch(0.65_0.22_27/0.25)]',
    bar: 'bg-[oklch(0.63_0.22_27)] dark:bg-[oklch(0.65_0.22_27)] dark:shadow-[0_0_12px_oklch(0.65_0.22_27/0.5)]',
    iconBg: 'bg-[oklch(0.63_0.22_27/0.12)] dark:bg-[oklch(0.65_0.22_27/0.15)]',
    iconColor: 'text-[oklch(0.55_0.22_27)] dark:text-[oklch(0.8_0.22_27)]',
    titleColor: 'text-[oklch(0.45_0.22_27)] dark:text-[oklch(0.8_0.22_27)]',
  },
  trap: {
    label: 'Interview Trap',
    Icon: Skull,
    bg: 'bg-[oklch(0.95_0.05_320/0.5)] dark:bg-[oklch(0.155_0.06_320/0.5)]',
    border: 'border-[oklch(0.68_0.25_320/0.3)] dark:border-[oklch(0.68_0.25_320/0.25)]',
    bar: 'bg-[oklch(0.68_0.25_320)] dark:bg-[oklch(0.68_0.25_320)] dark:shadow-[0_0_12px_oklch(0.68_0.25_320/0.5)]',
    iconBg: 'bg-[oklch(0.68_0.25_320/0.12)] dark:bg-[oklch(0.68_0.25_320/0.15)]',
    iconColor: 'text-[oklch(0.55_0.22_320)] dark:text-[oklch(0.85_0.20_320)]',
    titleColor: 'text-[oklch(0.45_0.22_320)] dark:text-[oklch(0.85_0.20_320)]',
  },
  senior: {
    label: 'Senior-Level Insight',
    Icon: Crown,
    bg: 'bg-[oklch(0.94_0.04_195/0.5)] dark:bg-[oklch(0.155_0.055_195/0.5)]',
    border: 'border-[oklch(0.62_0.19_195/0.25)] dark:border-[oklch(0.72_0.18_195/0.2)]',
    bar: 'bg-gradient-to-b from-[oklch(0.72_0.18_195)] to-[oklch(0.68_0.25_320)] dark:shadow-[0_0_16px_oklch(0.72_0.18_195/0.4)]',
    iconBg: 'bg-gradient-to-br from-[oklch(0.72_0.18_195/0.15)] to-[oklch(0.68_0.25_320/0.15)]',
    iconColor: 'text-[oklch(0.52_0.19_195)] dark:text-[oklch(0.8_0.18_195)]',
    titleColor: 'text-[oklch(0.42_0.18_195)] dark:text-[oklch(0.82_0.18_195)]',
  },
}

export function Callout({ type, title, children, className }: CalloutProps) {
  const s = CALLOUT_STYLES[type]
  const { Icon } = s
  const displayTitle = title ?? s.label

  return (
    <aside
      className={cn(
        'relative my-6 grid grid-cols-[auto_1fr] gap-4 overflow-hidden rounded-2xl border p-5 pl-8',
        s.bg,
        s.border,
        className
      )}
      role={type === 'warning' || type === 'critical' ? 'alert' : 'note'}
    >
      {/* Left accent bar */}
      <span
        className={cn(
          'pointer-events-none absolute left-0 top-3 bottom-3 w-[3px] rounded-full',
          s.bar
        )}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className={cn(
          'mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl',
          s.iconBg
        )}
      >
        <Icon className={cn('size-4', s.iconColor)} />
      </div>

      {/* Content */}
      <div className="min-w-0">
        <p className={cn('mb-1.5 text-sm font-semibold font-mono tracking-wide uppercase', s.titleColor)}>
          {displayTitle}
        </p>
        <div className="text-sm text-foreground/90 leading-relaxed [&>p]:mt-1.5 [&>p:first-child]:mt-0">
          {children}
        </div>
      </div>
    </aside>
  )
}
