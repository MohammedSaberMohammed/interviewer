import Link from 'next/link'
import {
  ArrowRight, BookOpen, Zap, Target, Trophy, Users, Code2,
  CheckCircle2, Layers, Flame, Star,
} from 'lucide-react'
import { getAllTechnologies } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

/* ── Color map for tech badges ─────────────────────────────────────── */
const TECH_COLOR_MAP: Record<string, { pill: string; glow: string }> = {
  violet: {
    pill: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-700',
    glow: 'group-hover:shadow-[0_0_30px_oklch(0.55_0.26_290_/_0.20)]',
  },
  red: {
    pill: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800',
    glow: 'group-hover:shadow-[0_0_30px_oklch(0.63_0.22_27_/_0.20)]',
  },
  blue: {
    pill: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    glow: 'group-hover:shadow-[0_0_30px_oklch(0.55_0.22_264_/_0.20)]',
  },
  yellow: {
    pill: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800',
    glow: 'group-hover:shadow-[0_0_30px_oklch(0.86_0.18_95_/_0.24)]',
  },
}

const FEATURES = [
  {
    icon: Layers,
    title: 'Structured Learning Path',
    description: 'Progress through carefully ordered phases — from language fundamentals to system design and architecture.',
    badge: '13 phases',
  },
  {
    icon: Code2,
    title: 'Interactive Challenges',
    description: 'Code challenges and quizzes are embedded inside every lesson. Practice exactly what you just learned.',
    badge: '200+ exercises',
  },
  {
    icon: Target,
    title: 'Interview-Focused',
    description: 'Every lesson targets real interview questions. Understand the why, not just the syntax — so nothing surprises you.',
    badge: 'Senior-ready',
  },
  {
    icon: Zap,
    title: 'Gamified Progress',
    description: 'Earn XP, maintain streaks, unlock achievement badges, and level up from Novice to Architect.',
    badge: 'XP system',
  },
  {
    icon: Trophy,
    title: 'Interview Templates',
    description: 'Curate your own question sets from any lesson and run timed mock interviews on your schedule.',
    badge: 'Mock sessions',
  },
  {
    icon: Users,
    title: 'Multi-Technology',
    description: 'One cohesive platform. Master .NET, Angular, and JavaScript today — with more technologies on the roadmap.',
    badge: 'Growing library',
  },
]

const SOCIAL_PROOF = [
  { value: '13', label: 'Structured phases' },
  { value: '200+', label: 'Lessons & challenges' },
  { value: '4', label: 'Seniority levels' },
  { value: '3', label: 'Technologies' },
]

export default function HomePage() {
  const technologies = getAllTechnologies().filter((t) => t.status === 'active')

  return (
    <>
      <Navbar />
      <main id="main-content" className="overflow-x-hidden">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative min-h-[82vh] flex flex-col items-center justify-center border-b border-border/40 overflow-hidden">
          {/* Gradient mesh background */}
          <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />
          {/* Dot grid */}
          <div className="absolute inset-0 bg-dot-pattern opacity-50 pointer-events-none" aria-hidden="true" />
          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" aria-hidden="true" />

          <div className="relative z-10 container mx-auto px-4 py-24 text-center max-w-4xl">
            {/* Live badge */}
            <div className="inline-flex items-center gap-2 section-label mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Now with JavaScript support
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-[-0.04em] mb-7">
              <span className="gradient-text">Ace Your</span>
              <br />
              <span className="gradient-text-brand">Technical Interview</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              Deep-dive interview prep for senior engineers. Structured phases,
              interactive challenges, and gamified progress — for the
              technologies that matter.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/technologies"
                className="btn-brand px-8 py-3 text-base"
              >
                Start Preparing
                <ArrowRight className="h-4.5 w-4.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/80 backdrop-blur px-8 py-3 text-sm font-semibold hover:bg-muted transition-colors"
              >
                How it works
              </Link>
            </div>

            {/* Tech links */}
            {technologies.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2.5 justify-center">
                {technologies.map((tech) => {
                  const colors = TECH_COLOR_MAP[tech.color] ?? TECH_COLOR_MAP['violet']!
                  return (
                    <Link
                      key={tech.slug}
                      href={`/${tech.slug}/phases`}
                      className={cn(
                        'rounded-full border px-4 py-1.5 text-sm font-medium transition-all hover:scale-105 hover:opacity-90',
                        colors.pill,
                      )}
                    >
                      {tech.title}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── Social proof strip ───────────────────────────────────────── */}
        <section className="border-b border-border/50 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <dl className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-border/50">
              {SOCIAL_PROOF.map(({ value, label }) => (
                <div key={label} className="flex flex-col items-center py-7 px-4 gap-1">
                  <dt className="text-3xl font-bold tracking-tight gradient-text-brand">{value}</dt>
                  <dd className="text-sm text-muted-foreground text-center">{label}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Features ─────────────────────────────────────────────────── */}
        <section className="py-24 container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="section-label mx-auto mb-5">Platform features</div>
            <h2 className="text-4xl font-bold tracking-tight gradient-text mb-4">
              Everything you need to prepare
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto leading-relaxed">
              Built by engineers for engineers. No fluff — just focused,
              deep-dive preparation that matches real interview formats.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, description, badge }) => (
              <div
                key={title}
                className="border-gradient p-6 flex flex-col gap-4 group transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary/15 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                    {badge}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1.5">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Technology showcase ───────────────────────────────────────── */}
        {technologies.length > 0 && (
          <section className="py-20 border-y border-border/50 bg-muted/20">
            <div className="container mx-auto px-4 max-w-5xl">
              <div className="text-center mb-12">
                <div className="section-label mx-auto mb-5">Active tracks</div>
                <h2 className="text-3xl font-bold tracking-tight gradient-text">
                  Pick your technology
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {technologies.map((tech) => {
                  const colors = TECH_COLOR_MAP[tech.color] ?? TECH_COLOR_MAP['violet']!
                  return (
                    <Link
                      key={tech.slug}
                      href={`/${tech.slug}/phases`}
                      className={cn(
                        'group relative surface-interactive p-6 flex items-center gap-5',
                        colors.glow,
                      )}
                    >
                      <div className={cn(
                        'flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-xl font-bold',
                        colors.pill,
                      )}>
                        {tech.title.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-foreground">{tech.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5 truncate">{tech.subtitle}</p>
                        <div className="mt-2.5 flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Layers className="h-3 w-3" /> 13 phases
                          </span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> ~{tech.estimatedTotalHours}h
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 shrink-0" />
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* ── Why it works ─────────────────────────────────────────────── */}
        <section className="py-24 container mx-auto px-4 max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label mb-5">Why engineers use this</div>
              <h2 className="text-3xl font-bold tracking-tight gradient-text mb-5">
                Interview prep that actually reflects real interviews
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Most platforms teach trivia. This one digs into the internals — memory management,
                async state machines, GC pressure, architectural tradeoffs — the things
                senior engineers are actually expected to articulate.
              </p>
              <ul className="space-y-3">
                {[
                  'Phase-gated content, junior to architect level',
                  'Challenges embedded inside lessons, not as afterthoughts',
                  'Covers the "why behind the what" in every topic',
                  'Built-in streak system to maintain daily momentum',
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            {/* Visual card stack */}
            <div className="relative h-64 md:h-80 flex items-center justify-center">
              <div className="absolute surface-panel w-56 h-32 top-4 left-1/2 -translate-x-1/2 rotate-[-3deg] opacity-40 scale-95" />
              <div className="absolute surface-panel w-56 h-32 top-8 left-1/2 -translate-x-1/2 rotate-[1.5deg] opacity-60 scale-97" />
              <div className="surface-panel w-56 h-32 flex flex-col items-center justify-center gap-2 text-center p-4">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <span className="font-bold text-foreground text-lg">7-day streak</span>
                </div>
                <p className="text-xs text-muted-foreground">Keep the momentum going</p>
                <div className="flex gap-1 mt-1">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-2 w-5 rounded-full bg-orange-400/80" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ──────────────────────────────────────────────────────── */}
        <section className="relative border-t border-border/50 py-24 overflow-hidden">
          <div className="absolute inset-0 gradient-mesh opacity-60 pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 container mx-auto px-4 text-center max-w-2xl">
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <h2 className="text-4xl font-bold tracking-tight gradient-text mb-4">
              Ready to prepare?
            </h2>
            <p className="text-muted-foreground mb-10 leading-relaxed">
              Pick your technology and start your structured path to senior-level mastery.
              Progress is saved locally — no account required.
            </p>
            <Link href="/technologies" className="btn-brand px-10 py-3.5 text-base">
              Choose Your Technology
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
