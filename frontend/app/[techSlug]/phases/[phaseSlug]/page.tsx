import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock, BookOpen, CheckCircle2, Lock, ExternalLink, Users, ArrowRight, Bookmark } from 'lucide-react'
import { getAllTechSlugs, getAllPhaseSlugs, getPhase, getTechMeta } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { AddLessonToBasketButton } from '@/components/basket/AddLessonToBasketButton'
import { PhaseDetailProgress } from '@/components/phases/PhaseDetailProgress'
import { PhaseSidebarProgress } from '@/components/phases/PhaseSidebarProgress'
import { PHASE_LEVEL_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import type { DocsLinkItem } from '@/types'

interface Props {
  params: Promise<{ techSlug: string; phaseSlug: string }>
}

export async function generateStaticParams() {
  const params: { techSlug: string; phaseSlug: string }[] = []
  for (const techSlug of getAllTechSlugs()) {
    for (const phaseSlug of getAllPhaseSlugs(techSlug)) {
      params.push({ techSlug, phaseSlug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { techSlug, phaseSlug } = await params
  const phase = getPhase(techSlug, phaseSlug)
  if (!phase) return {}
  return { title: phase.title, description: phase.description }
}

const LEVEL_GRADIENT: Record<string, string> = {
  junior:  'from-[oklch(0.22_0.12_230)] via-[oklch(0.20_0.10_260)] to-[oklch(0.18_0.08_280)]',
  mid:     'from-[oklch(0.20_0.12_300)] via-[oklch(0.19_0.14_320)] to-[oklch(0.18_0.10_280)]',
  senior:  'from-[oklch(0.22_0.10_60)] via-[oklch(0.20_0.12_300)] to-[oklch(0.18_0.10_280)]',
}

const LEVEL_ICON_BG: Record<string, string> = {
  junior:  'from-[oklch(0.55_0.20_195)] to-[oklch(0.45_0.22_230)]',
  mid:     'from-[oklch(0.55_0.22_300)] to-[oklch(0.48_0.28_320)]',
  senior:  'from-[oklch(0.60_0.20_85)] to-[oklch(0.55_0.22_320)]',
}

const LEVEL_ACCENT_TEXT: Record<string, string> = {
  junior:  'text-[oklch(0.82_0.18_195)]',
  mid:     'text-[oklch(0.85_0.20_320)]',
  senior:  'text-[oklch(0.88_0.18_85)]',
}

function aggregateDocsLinks(lessons: { docsLinks: DocsLinkItem[] }[]): DocsLinkItem[] {
  const seen = new Set<string>()
  const result: DocsLinkItem[] = []
  for (const lesson of lessons) {
    for (const link of lesson.docsLinks ?? []) {
      if (!seen.has(link.url) && result.length < 5) {
        seen.add(link.url)
        result.push(link)
      }
    }
  }
  return result
}

export default async function PhaseOverviewPage({ params }: Props) {
  const { techSlug, phaseSlug } = await params
  const phase = getPhase(techSlug, phaseSlug)
  const tech = getTechMeta(techSlug)
  if (!phase || !tech) notFound()

  const levelConfig = PHASE_LEVEL_CONFIG[phase.level]
  const publishedLessons = phase.lessons.filter((l) => l.status === 'published')
  const gradientClass = LEVEL_GRADIENT[phase.level] ?? LEVEL_GRADIENT.junior
  const iconBgClass = LEVEL_ICON_BG[phase.level] ?? LEVEL_ICON_BG.junior
  const accentTextClass = LEVEL_ACCENT_TEXT[phase.level] ?? LEVEL_ACCENT_TEXT.junior

  const docLinks = aggregateDocsLinks(phase.lessons)

  return (
    <>
      <Navbar techSlug={techSlug} />
      <main id="main-content">

        {/* ── Hero ──────────────────────────────────────────── */}
        <div className={cn('relative overflow-hidden bg-gradient-to-br', gradientClass)}>
          {/* Subtle grid overlay */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `linear-gradient(oklch(1 0 0 / 0.5) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.5) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          {/* Radial glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, oklch(0.72 0.18 195 / 0.6) 0%, transparent 70%)' }}
          />

          <div className="container mx-auto px-4 pt-5 pb-8 max-w-6xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/60 mb-6">
              <Link href={`/${techSlug}/phases`} className="hover:text-white/90 transition-colors">
                Phases
              </Link>
              <ChevronRight className="h-3 w-3" aria-hidden="true" />
              <span className="text-white/90 font-medium truncate">{phase.title}</span>
            </nav>

            {/* Hero content */}
            <div className="flex items-start gap-6">
              {/* Phase icon */}
              <div
                aria-hidden="true"
                className={cn(
                  'hidden sm:flex shrink-0 h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br text-4xl shadow-[0_8px_32px_oklch(0_0_0/0.4)]',
                  iconBgClass,
                )}
              >
                {phase.emoji}
              </div>

              {/* Title block */}
              <div className="flex-1 min-w-0">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={cn('font-mono text-[10px] font-bold uppercase tracking-[0.14em]', accentTextClass)}>
                    Phase {String(phase.number).padStart(2, '0')}
                  </span>
                  <span className="h-3 w-px bg-white/20" aria-hidden />
                  <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-white/90">
                    {levelConfig.label}
                  </span>
                </div>

                <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight tracking-tight mb-2">
                  {phase.title}
                </h1>
                {phase.subtitle && (
                  <p className="text-sm text-white/70 leading-relaxed max-w-xl mb-5">
                    {phase.subtitle}
                  </p>
                )}

                {/* Stats row */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-1.5 text-white/70">
                    <Clock className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                    <span className="text-xs">~{phase.estimatedHours} hours</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/70">
                    <BookOpen className="h-3.5 w-3.5 text-white/50" aria-hidden="true" />
                    <span className="text-xs">{phase.lessons.length} lessons</span>
                    {publishedLessons.length < phase.lessons.length && (
                      <span className="text-xs text-white/40">({publishedLessons.length} available)</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main content + Sidebar ──────────────────────────── */}
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="flex gap-8 items-start">

            {/* ── Left: main content ──────────────────────────── */}
            <div className="flex-1 min-w-0">

              {/* Progress */}
              <PhaseDetailProgress
                techSlug={techSlug}
                phaseSlug={phaseSlug}
                totalLessons={phase.lessons.length}
              />

              {/* Description */}
              {phase.description && (
                <p className="mb-6 text-sm text-muted-foreground leading-relaxed">{phase.description}</p>
              )}

              {/* Learning Outcomes */}
              {phase.learningOutcomes.length > 0 && (
                <div className="mb-8">
                  <h2 className="font-display text-base font-semibold mb-4 text-foreground">
                    Learning Outcomes
                  </h2>
                  <ul className="space-y-2.5">
                    {phase.learningOutcomes.map((outcome, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
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
                  <h2 className="font-display text-base font-semibold mb-3">Prerequisites</h2>
                  <div className="flex flex-wrap gap-2">
                    {phase.prerequisites.map((prereq) => (
                      <Link
                        key={prereq}
                        href={`/${techSlug}/phases/${prereq}`}
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
                <h2 className="font-display text-base font-semibold mb-4 text-foreground">Lessons</h2>
                <div className="space-y-2">
                  {phase.lessons.map((lesson, i) => {
                    const isPublished = lesson.status === 'published'
                    return (
                      <div key={lesson.slug}>
                        {isPublished ? (
                          <div className="group flex items-center rounded-xl border border-border bg-card transition-all duration-200 hover:-translate-y-px hover:border-primary/25 hover:shadow-[0_4px_12px_oklch(0_0_0/0.05)] dark:hover:shadow-[0_4px_12px_oklch(0_0_0/0.3)]">
                            <Link
                              href={`/${techSlug}/phases/${phaseSlug}/${lesson.slug}`}
                              className="flex flex-1 items-center gap-3 px-4 py-3.5 min-w-0"
                            >
                              {/* Number */}
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold tabular-nums text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {String(i + 1).padStart(2, '0')}
                              </span>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm group-hover:text-primary transition-colors truncate">
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <DifficultyBadge level={lesson.difficulty} />
                                  <span className="text-xs text-muted-foreground">
                                    {lesson.readingTime} min read
                                  </span>
                                </div>
                              </div>

                              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" aria-hidden="true" />
                            </Link>

                            <AddLessonToBasketButton
                              lessonSlug={lesson.slug}
                              phaseSlug={phaseSlug}
                              techSlug={techSlug}
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
                          <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-4 py-3.5 cursor-not-allowed">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold tabular-nums text-muted-foreground">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
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
            </div>

            {/* ── Right: Sidebar ──────────────────────────────── */}
            <aside className="hidden lg:flex flex-col gap-4 w-72 shrink-0">

              {/* Phase Summary */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-display text-sm font-semibold text-foreground mb-4">Phase Summary</h3>
                <dl className="space-y-3">
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-muted-foreground">Level</dt>
                    <dd>
                      <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', levelConfig.bgClass, levelConfig.textClass)}>
                        {levelConfig.label}
                      </span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-muted-foreground">Lessons</dt>
                    <dd className="text-xs font-semibold text-foreground tabular-nums">
                      {phase.lessons.length} <span className="font-normal text-muted-foreground">({publishedLessons.length} available)</span>
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-xs text-muted-foreground">Est. Time</dt>
                    <dd className="text-xs font-semibold text-foreground">~{phase.estimatedHours}h</dd>
                  </div>
                  <div className="border-t border-border pt-3">
                    <PhaseSidebarProgress
                      techSlug={techSlug}
                      phaseSlug={phaseSlug}
                      totalLessons={phase.lessons.length}
                    />
                  </div>
                </dl>
              </div>

              {/* Resources */}
              {(docLinks.length > 0 || tech.docsBaseUrl) && (
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-display text-sm font-semibold text-foreground mb-4">Resources</h3>
                  <ul className="space-y-2">
                    {tech.docsBaseUrl && (
                      <li>
                        <a
                          href={tech.docsBaseUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" aria-hidden="true" />
                          Official Docs
                        </a>
                      </li>
                    )}
                    {docLinks.map((link, i) => (
                      <li key={i}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group"
                        >
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground/50 group-hover:text-primary transition-colors" aria-hidden="true" />
                          <span className="truncate">{link.label}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Need Help */}
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                  <h3 className="font-display text-sm font-semibold text-foreground">Need help?</h3>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Discuss concepts, share code, and get answers from the community.
                </p>
                <a
                  href={`https://github.com/MohammedSaberMohammed/interview-app/discussions`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-muted/50 px-3 py-2 text-xs font-medium text-foreground hover:bg-accent hover:border-primary/20 transition-colors"
                >
                  Open Community
                </a>
              </div>

            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
