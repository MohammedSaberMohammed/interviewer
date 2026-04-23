import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock, BookOpen, CheckCircle2, Lock } from 'lucide-react'
import { getAllPhaseSlugs, getPhase } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { AddLessonToBasketButton } from '@/components/basket/AddLessonToBasketButton'
import { PhaseDetailProgress } from '@/components/phases/PhaseDetailProgress'
import { Gem3D } from '@/components/ui/Gem3D'
import { PHASE_LEVEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface Props {
  params: Promise<{ phaseSlug: string }>
}

export async function generateStaticParams() {
  return getAllPhaseSlugs().map((phaseSlug) => ({ phaseSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phaseSlug } = await params
  const phase = getPhase(phaseSlug)
  if (!phase) return {}
  return { title: phase.title, description: phase.description }
}

/* Tailwind-safe tint map per phase color (light + dark) */
const HERO_TINT: Record<string, string> = {
  blue:   'bg-blue-50/80 dark:bg-blue-950/30',
  indigo: 'bg-indigo-50/80 dark:bg-indigo-950/30',
  violet: 'bg-violet-50/80 dark:bg-violet-950/30',
  purple: 'bg-purple-50/80 dark:bg-purple-950/30',
  amber:  'bg-amber-50/80 dark:bg-amber-950/30',
  teal:   'bg-teal-50/80 dark:bg-teal-950/30',
  rose:   'bg-rose-50/80 dark:bg-rose-950/30',
  cyan:   'bg-cyan-50/80 dark:bg-cyan-950/30',
  green:  'bg-green-50/80 dark:bg-green-950/30',
  orange: 'bg-orange-50/80 dark:bg-orange-950/30',
  slate:  'bg-slate-100/80 dark:bg-slate-900/30',
}


export default async function PhaseOverviewPage({ params }: Props) {
  const { phaseSlug } = await params
  const phase = getPhase(phaseSlug)
  if (!phase) notFound()

  const levelConfig = PHASE_LEVEL_CONFIG[phase.level]
  const publishedLessons = phase.lessons.filter((l) => l.status === 'published')
  const heroTint = HERO_TINT[phase.color] ?? HERO_TINT.indigo

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-10 max-w-4xl">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/phases" className="hover:text-foreground transition-colors">Phases</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground truncate">{phase.title}</span>
        </nav>

        {/* Hero — split layout: content left, illustration right */}
        <div className={cn('relative mb-8 overflow-hidden rounded-2xl border border-border', heroTint)}>
          <div className="flex items-center gap-6 px-6 py-8 sm:px-8 sm:py-10">

            {/* Left: content */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-xs font-medium text-muted-foreground backdrop-blur-sm">
                  Phase {phase.number}
                </span>
                <span className={cn(
                  'rounded-full px-2.5 py-0.5 text-xs font-medium',
                  levelConfig.bgClass,
                  levelConfig.textClass,
                )}>
                  {levelConfig.label}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold leading-tight mb-2 text-foreground">
                {phase.title}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                {phase.subtitle}
              </p>

              <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  ~{phase.estimatedHours} hours
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" aria-hidden="true" />
                  {phase.lessons.length} lessons ({publishedLessons.length} available)
                </span>
              </div>
            </div>

            {/* Right: 3D gem illustration */}
            <div aria-hidden="true" className="hidden sm:flex shrink-0 items-center justify-center">
              <Gem3D color={phase.color} emoji={phase.emoji} size={130} />
            </div>
          </div>
        </div>

        {/* Progress (client) */}
        <PhaseDetailProgress phaseSlug={phaseSlug} totalLessons={phase.lessons.length} />

        {/* Description */}
        {phase.description && (
          <p className="mb-8 text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
        )}

        {/* Learning outcomes */}
        {phase.learningOutcomes.length > 0 && (
          <div className="mb-8 rounded-xl border border-border bg-card p-5">
            <h2 className="text-sm font-semibold mb-3 text-foreground">What you&apos;ll learn</h2>
            <ul className="space-y-2">
              {phase.learningOutcomes.map((outcome, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" aria-hidden="true" />
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {phase.prerequisites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold mb-3">Prerequisites</h2>
            <div className="flex flex-wrap gap-2">
              {phase.prerequisites.map((prereq) => (
                <Link
                  key={prereq}
                  href={`/phases/${prereq}`}
                  className="rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  {prereq}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Lessons list */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Lessons</h2>
          <div className="space-y-2">
            {phase.lessons.map((lesson, i) => {
              const isPublished = lesson.status === 'published'
              return (
                <div key={lesson.slug}>
                  {isPublished ? (
                    <div className="group flex items-center rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-px hover:border-primary/25 hover:shadow-[0_4px_12px_oklch(0_0_0/0.05)] dark:hover:shadow-[0_4px_12px_oklch(0_0_0/0.3)]">
                      <Link
                        href={`/phases/${phaseSlug}/${lesson.slug}`}
                        className="flex flex-1 items-center gap-3 px-4 py-3.5 min-w-0"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-muted text-[11px] font-semibold tabular-nums text-muted-foreground">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                            {lesson.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <DifficultyBadge level={lesson.difficulty} />
                            <span className="text-xs text-muted-foreground">{lesson.readingTime} min read</span>
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-primary transition-colors" aria-hidden="true" />
                      </Link>
                      <AddLessonToBasketButton
                        lessonSlug={lesson.slug}
                        phaseSlug={phaseSlug}
                        lessonTitle={lesson.title}
                        phaseTitle={phase.title}
                        phaseNumber={phase.number}
                        difficulty={lesson.difficulty}
                        summary={lesson.summary}
                        iconOnly
                        className="mr-3"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card/40 px-4 py-3.5 opacity-50">
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-muted-foreground truncate">{lesson.title}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">Coming soon</p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
