import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Layers, BookOpen } from 'lucide-react'
import { getAllTechnologies } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Choose Your Technology',
  description: 'Select your technology track and begin your structured interview preparation journey.',
}

const TECH_STYLE_MAP: Record<string, {
  pill: string
  accent: string
  glow: string
}> = {
  violet: {
    pill:   'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700',
    accent: 'from-violet-500/10 to-purple-500/5',
    glow:   'group-hover:shadow-[0_0_40px_oklch(0.55_0.26_290_/_0.18)]',
  },
  red: {
    pill:   'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
    accent: 'from-red-500/10 to-rose-500/5',
    glow:   'group-hover:shadow-[0_0_40px_oklch(0.63_0.22_27_/_0.18)]',
  },
  blue: {
    pill:   'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    accent: 'from-blue-500/10 to-indigo-500/5',
    glow:   'group-hover:shadow-[0_0_40px_oklch(0.55_0.22_264_/_0.18)]',
  },
  cyan: {
    pill:   'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
    accent: 'from-cyan-500/10 to-sky-500/5',
    glow:   'group-hover:shadow-[0_0_40px_oklch(0.70_0.20_220_/_0.18)]',
  },
}

export default function TechnologiesPage() {
  const technologies = getAllTechnologies()
  const active = technologies.filter((t) => t.status === 'active')
  const soon = technologies.filter((t) => t.status === 'coming-soon')

  return (
    <>
      <Navbar />
      <main id="main-content" className="page-shell page-section">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="section-label mx-auto mb-5">Technology tracks</div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight gradient-text mb-5">
            Choose Your Technology
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Select a track to begin your structured interview preparation.
            Each track contains curated phases, interactive lessons, and practice challenges.
          </p>
        </div>

        {/* Active technologies */}
        {active.length > 0 && (
          <section className="mb-12">
            <h2 className="sr-only">Available tracks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {active.map((tech) => {
                const style = TECH_STYLE_MAP[tech.color] ?? TECH_STYLE_MAP['violet']!

                return (
                  <Link
                    key={tech.slug}
                    href={`/${tech.slug}/phases`}
                    className={cn(
                      'group relative surface-interactive overflow-hidden p-7 flex flex-col gap-5 transition-all duration-300',
                      style.glow,
                    )}
                  >
                    {/* Subtle gradient bleed */}
                    <div className={cn(
                      'absolute top-0 right-0 w-48 h-32 rounded-bl-[3rem] bg-gradient-to-bl opacity-60 pointer-events-none',
                      style.accent,
                    )} />

                    <div className="flex items-start gap-4 relative">
                      <div className={cn(
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-2xl font-extrabold tracking-tight',
                        style.pill,
                      )}>
                        {tech.title.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-foreground">{tech.title}</h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{tech.subtitle}</p>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 relative">
                      {tech.description}
                    </p>

                    <div className="flex items-center justify-between relative">
                      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Layers className="h-3.5 w-3.5" /> 13 phases
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5" /> ~{tech.estimatedTotalHours}h
                        </span>
                        <span className="flex items-center gap-1.5">
                          <BookOpen className="h-3.5 w-3.5" /> All levels
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        Start
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}

        {/* Coming soon */}
        {soon.length > 0 && (
          <section>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-4">
              Coming soon
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {soon.map((tech) => {
                const style = TECH_STYLE_MAP[tech.color] ?? TECH_STYLE_MAP['violet']!
                return (
                  <div
                    key={tech.slug}
                    className="relative rounded-2xl border border-border/50 bg-card/50 p-6 opacity-50 cursor-not-allowed flex items-center gap-4"
                  >
                    <div className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border text-lg font-bold',
                      style.pill,
                    )}>
                      {tech.title.slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{tech.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{tech.subtitle}</p>
                    </div>
                    <span className="ml-auto rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground shrink-0">
                      Coming soon
                    </span>
                  </div>
                )
              })}
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  )
}
