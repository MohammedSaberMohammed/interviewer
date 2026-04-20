import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock, BookOpen, CheckCircle2, Circle, Lock } from 'lucide-react'
import { getAllPhaseSlugs, getPhase } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { PhaseProgressBar } from '@/components/progress/PhaseProgressBar'
import { Badge } from '@/components/ui/badge'
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
  return {
    title: phase.title,
    description: phase.description,
  }
}

export default async function PhaseOverviewPage({ params }: Props) {
  const { phaseSlug } = await params
  const phase = getPhase(phaseSlug)
  if (!phase) notFound()

  const levelConfig = PHASE_LEVEL_CONFIG[phase.level]
  const publishedLessons = phase.lessons.filter((l) => l.status === 'published')

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-10 max-w-4xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/phases" className="hover:text-foreground transition-colors">Phases</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground">{phase.title}</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <span className="text-4xl" aria-hidden="true">{phase.emoji}</span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground font-medium">Phase {phase.number}</span>
                <Badge className={cn('text-xs border-0', levelConfig.bgClass, levelConfig.textClass)}>
                  {levelConfig.label}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold mb-1">{phase.title}</h1>
              <p className="text-muted-foreground">{phase.subtitle}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{phase.description}</p>

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

        {/* Progress placeholder — client component needed for real data */}
        <div className="mb-8 rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Your Progress</span>
            <span className="text-xs text-muted-foreground">0/{phase.lessons.length}</span>
          </div>
          <PhaseProgressBar completed={0} total={phase.lessons.length} />
        </div>

        {/* Learning outcomes */}
        {phase.learningOutcomes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Learning Outcomes</h2>
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
            <h2 className="text-lg font-semibold mb-3">Prerequisites</h2>
            <div className="flex flex-wrap gap-2">
              {phase.prerequisites.map((prereq) => (
                <Link key={prereq} href={`/phases/${prereq}`}>
                  <Badge variant="secondary" className="hover:bg-accent cursor-pointer">
                    Phase: {prereq}
                  </Badge>
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
                    <Link
                      href={`/phases/${phaseSlug}/${lesson.slug}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/30 hover:bg-accent transition-all group"
                    >
                      <Circle className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                          <span className="font-medium text-sm group-hover:text-primary transition-colors truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DifficultyBadge level={lesson.difficulty} />
                          <span className="text-xs text-muted-foreground">{lesson.readingTime} min read</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                    </Link>
                  ) : (
                    <div
                      className="flex items-center gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 opacity-60 cursor-not-allowed"
                      aria-label={`${lesson.title} — coming soon`}
                    >
                      <Lock className="h-4 w-4 shrink-0 text-muted-foreground/40" aria-hidden="true" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs text-muted-foreground tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                          <span className="text-sm text-muted-foreground truncate">{lesson.title}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <DifficultyBadge level={lesson.difficulty} />
                          <span className="text-xs text-muted-foreground">Coming soon</span>
                        </div>
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
