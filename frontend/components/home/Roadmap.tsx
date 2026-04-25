import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Phase } from '@/types'

interface RoadmapProps {
  phases: Phase[]
}

const LEVEL_COLORS = {
  junior: 'bg-emerald-500',
  mid: 'bg-blue-500',
  senior: 'bg-violet-500',
}

export function Roadmap({ phases }: RoadmapProps) {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-2">The Learning Path</h2>
          <p className="text-sm text-muted-foreground">13 phases, carefully sequenced from foundations to senior mastery</p>
          <div className="flex items-center justify-center gap-6 mt-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500" />Junior</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-blue-500" />Mid-Level</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-500" />Senior</span>
          </div>
        </div>

        {/* Path visualization */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {phases.map((phase, i) => (
              <Link
                key={phase.slug}
                href={`/phases/${phase.slug}`}
                className="group relative flex flex-col items-center gap-2 rounded-xl border border-border bg-background p-3 text-center hover:border-primary/40 hover:bg-accent transition-all"
              >
                <div className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full text-xl',
                  'ring-2 ring-offset-2 ring-offset-background',
                  phase.level === 'junior' ? 'ring-emerald-300 dark:ring-emerald-700' :
                  phase.level === 'mid' ? 'ring-blue-300 dark:ring-blue-700' :
                  'ring-violet-300 dark:ring-violet-700'
                )}>
                  {phase.emoji}
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">Phase {phase.number}</p>
                  <p className="text-xs font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {phase.title}
                  </p>
                </div>
                <span className={cn(
                  'absolute -top-1.5 -right-1.5 h-3 w-3 rounded-full border-2 border-background',
                  LEVEL_COLORS[phase.level]
                )} aria-hidden="true" />

                {/* Arrow connector (not last) */}
                {i < phases.length - 1 && (
                  <span className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 text-muted-foreground/30 text-xs z-10" aria-hidden="true">
                    →
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
