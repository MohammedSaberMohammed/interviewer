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
          className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-accent hover:border-primary/30 max-w-[45%]"
          aria-label={`Previous lesson: ${prev.title}`}
        >
          <ChevronLeft className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="flex flex-col items-start">
            <span className="text-xs text-muted-foreground">Previous</span>
            <span className="font-medium text-foreground line-clamp-1">{prev.title}</span>
          </span>
        </Link>
      ) : (
        <div />
      )}

      {next ? (
        <Link
          href={next.href}
          className="group flex items-center gap-2 rounded-lg border border-border px-4 py-3 text-sm transition-colors hover:bg-accent hover:border-primary/30 max-w-[45%] ml-auto"
          aria-label={`Next lesson: ${next.title}`}
        >
          <span className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">Next</span>
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
