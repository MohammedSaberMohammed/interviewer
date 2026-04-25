import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Clock, Layers } from 'lucide-react'
import { getAllTechnologies } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Choose Your Technology',
  description: 'Select your technology track and begin your structured interview preparation journey.',
}

const TECH_COLOR_MAP: Record<string, string> = {
  violet: 'bg-violet-50 dark:bg-violet-950/20 border-violet-200 dark:border-violet-800 hover:border-violet-400 dark:hover:border-violet-600',
  red:    'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600',
  blue:   'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600',
  cyan:   'bg-cyan-50 dark:bg-cyan-950/20 border-cyan-200 dark:border-cyan-800 hover:border-cyan-400 dark:hover:border-cyan-600',
  green:  'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600',
  orange: 'bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600',
}

const TECH_BADGE_MAP: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900 dark:text-violet-300',
  red:    'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  cyan:   'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  green:  'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
}

export default function TechnologiesPage() {
  const technologies = getAllTechnologies()

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Choose Your Technology</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a technology track to begin your structured interview preparation.
            Each track contains curated phases, interactive lessons, and practice challenges.
          </p>
        </div>

        {/* Technology grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {technologies.map((tech) => {
            const isActive = tech.status === 'active'
            const colorClass = TECH_COLOR_MAP[tech.color] ?? TECH_COLOR_MAP.violet
            const badgeClass = TECH_BADGE_MAP[tech.color] ?? TECH_BADGE_MAP.violet

            const card = (
              <div className={cn(
                'relative rounded-2xl border-2 p-6 transition-all duration-200',
                colorClass,
                isActive
                  ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-lg'
                  : 'opacity-60 cursor-not-allowed',
              )}>
                {!isActive && (
                  <span className="absolute top-4 right-4 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                    Coming Soon
                  </span>
                )}

                <div className="flex items-start gap-4 mb-4">
                  <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold', badgeClass)}>
                    {tech.title.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold">{tech.title}</h2>
                    <p className="text-sm text-muted-foreground">{tech.subtitle}</p>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-5 leading-relaxed line-clamp-2">
                  {tech.description}
                </p>

                <div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    13 phases
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    ~{tech.estimatedTotalHours}h estimated
                  </span>
                </div>

                {isActive && (
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    Start Learning
                    <ArrowRight className="h-4 w-4" />
                  </div>
                )}
              </div>
            )

            return isActive ? (
              <Link key={tech.slug} href={`/${tech.slug}/phases`}>
                {card}
              </Link>
            ) : (
              <div key={tech.slug} aria-disabled="true">
                {card}
              </div>
            )
          })}
        </div>
      </main>
      <Footer />
    </>
  )
}
