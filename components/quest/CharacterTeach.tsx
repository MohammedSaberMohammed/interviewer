'use client'

import { cn } from '@/lib/utils'

interface CharacterTeachProps {
  children: React.ReactNode
  className?: string
}

export function CharacterTeach({ children, className }: CharacterTeachProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4',
        'dark:border-slate-800 dark:bg-slate-900/60',
        className,
      )}
    >
      {/* Avatar */}
      <div
        aria-hidden="true"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#512BD4] text-sm font-semibold text-white select-none"
      >
        N
      </div>
      {/* Message */}
      <p className="mt-0.5 text-[14px] leading-relaxed text-slate-700 dark:text-slate-300">
        {children}
      </p>
    </div>
  )
}
