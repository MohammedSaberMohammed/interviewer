'use client'

import { useProgressStore } from '@/stores/progressStore'
import { analytics } from '@/lib/analytics'
import { cn } from '@/lib/utils'

interface ReadAsArticleToggleProps {
  className?: string
}

export function ReadAsArticleToggle({ className }: ReadAsArticleToggleProps) {
  const readAsArticle = useProgressStore((s) => s.preferences.readAsArticle)
  const setReadAsArticle = useProgressStore((s) => s.setReadAsArticle)

  function toggle() {
    const next = !readAsArticle
    setReadAsArticle(next)
    analytics.articleModeToggled(next)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={readAsArticle}
      onClick={toggle}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-150',
        readAsArticle
          ? 'border-[#512BD4]/40 bg-[#512BD4]/10 text-[#512BD4] dark:border-violet-500/40 dark:bg-violet-950/40 dark:text-violet-300'
          : 'border-slate-200 bg-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:border-slate-600',
        className,
      )}
    >
      <span aria-hidden="true">{readAsArticle ? '📖' : '🎮'}</span>
      {readAsArticle ? 'Article mode' : 'Read as article'}
    </button>
  )
}
