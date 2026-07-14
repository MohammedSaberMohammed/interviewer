import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavLesson {
  title: string
  href: string
}

interface NavPrevNextProps {
  prev?: NavLesson
  next?: NavLesson
  className?: string
}

export function NavPrevNext({ prev, next, className }: NavPrevNextProps) {
  return (
    <nav
      aria-label="Lesson navigation"
      className={cn('flex items-center justify-between gap-4 border-t border-border pt-8 mt-8', className)}
    >
      {prev ? (
        <Link
          href={prev.href}
          className="group flex items-center gap-2 rounded-lg border border-border bg-card dark:bg-[oklch(0.103_0.018_264)] dark:border-[oklch(0.820_0.155_195/0.12)] px-4 py-3 text-sm transition-all hover:bg-accent dark:hover:bg-[oklch(0.138_0.030_195/0.30)] hover:border-primary/30 dark:hover:border-[oklch(0.820_0.155_195/0.30)] max-w-[45%]"
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground dark:text-[oklch(0.62_0.012_264)]">Previous</span>
            <span className="font-medium text-foreground line-clamp-1">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 rounded-lg border border-border bg-card dark:bg-[oklch(0.103_0.018_264)] dark:border-[oklch(0.820_0.155_195/0.12)] px-4 py-3 text-sm transition-all hover:bg-accent dark:hover:bg-[oklch(0.138_0.030_195/0.30)] hover:border-primary/30 dark:hover:border-[oklch(0.820_0.155_195/0.30)] max-w-[45%] ml-auto"
        >
          <span className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground dark:text-[oklch(0.62_0.012_264)]">Next</span>
            <span className="font-medium text-foreground line-clamp-1">{next.title}</span>
          </span>
          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
        </Link>
      ) : (
        <div />
      )}
    </nav>
  )
}
