import Link from 'next/link'
import { ArrowRight, Code2, Zap, Brain } from 'lucide-react'
import { getAllTechnologies, getAllPhaseSlugs, getPhaseMeta } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Gem3D } from '@/components/ui/Gem3D'
import { OnboardingDialog } from '@/components/onboarding/OnboardingDialog'
import { HeroOrb } from '@/components/home/HeroOrb'

const FEATURES = [
  {
    icon: Code2,
    color: 'text-[oklch(0.72_0.18_195)]',
    glow: 'bg-[oklch(0.72_0.18_195/0.1)]',
    title: 'Real Code Challenges',
    description: 'Every lesson ends with an embedded challenge. Read it once, solve it under pressure — the way interviews actually work.',
  },
  {
    icon: Zap,
    color: 'text-[oklch(0.85_0.20_320)]',
    glow: 'bg-[oklch(0.68_0.25_320/0.1)]',
    title: 'Quest Mode',
    description: 'Earn XP, maintain streaks, unlock badges — from Novice to Architect. Progress that feels earned, not handed out.',
  },
  {
    icon: Brain,
    color: 'text-[oklch(0.88_0.18_85)]',
    glow: 'bg-[oklch(0.78_0.18_85/0.1)]',
    title: 'Memory Visualizer',
    description: 'See memory layout, heap vs stack, reference pointers — animated diagrams that make the abstract concrete.',
  },
]

export default function HomePage() {
  const technologies = getAllTechnologies().filter((t) => t.status === 'active')

  // Get first few phases from dotnet for the teaser strip
  const dotnetSlugs = getAllPhaseSlugs('dotnet').slice(0, 6)
  const dotnetPhases = dotnetSlugs
    .map((slug) => ({ slug, meta: getPhaseMeta('dotnet', slug) }))
    .filter((p) => p.meta !== null)

  return (
    <>
      <Navbar />
      <main id="main-content" className="overflow-x-hidden">

        {/* ─── Hero ──────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          {/* Animated grid background */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-[0.18]"
            style={{
              backgroundImage: 'linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.12) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
              maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)',
            }}
            aria-hidden
          />
          {/* Radial gradient top-center */}
          <div
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(ellipse 80% 55% at 50% -5%, rgba(34,211,238,0.09) 0%, transparent 65%)' }}
            aria-hidden
          />

          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-20 items-center py-20 lg:py-28">

              {/* Left — copy */}
              <div>
                {/* Eyebrow */}
                <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-[oklch(0.72_0.18_195/0.25)] bg-[oklch(0.72_0.18_195/0.07)] px-4 py-1.5 font-mono text-[11px] tracking-[0.14em] uppercase text-[oklch(0.82_0.18_195)]">
                  <span className="relative flex size-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.72_0.18_195)] opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-[oklch(0.72_0.18_195)]" />
                  </span>
                  Interviewer-app · Now with Angular
                </div>

                {/* Headline */}
                <h1 className="mb-6 font-display text-[clamp(52px,7.5vw,96px)] font-medium leading-[0.93] tracking-[-0.04em]">
                  <span className="block">Train like you</span>
                  <span className="block italic font-light text-gradient-brand">actually have to</span>
                  <span className="block">ace it.</span>
                </h1>

                <p className="mb-10 max-w-[520px] text-[19px] leading-[1.55] text-muted-foreground">
                  A guided, gamified path from junior fundamentals to senior interview traps — built for engineers who want depth, not flashcards.
                </p>

                {/* CTAs */}
                <div className="mb-12 flex flex-wrap gap-4">
                  <Link
                    href="/technologies"
                    className="btn-glow gap-2"
                  >
                    Start your journey
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="#roadmap"
                    className="btn-ghost-border gap-2"
                  >
                    See the roadmap
                  </Link>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 border-t border-border pt-8">
                  {[
                    { num: '13', label: 'Phases' },
                    { num: '~400', label: 'Lessons' },
                    { num: '12', label: 'Achievements' },
                    { num: String(technologies.length), label: 'Stacks', accent: true },
                  ].map(({ num, label, accent }) => (
                    <div key={label} className="flex flex-col gap-1">
                      <span className={`font-display text-3xl font-semibold tracking-tight leading-none ${accent ? 'text-[oklch(0.72_0.18_195)]' : ''}`}>
                        {num}
                      </span>
                      <span className="font-mono text-[11px] tracking-[0.1em] uppercase text-muted-foreground">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right — hero orb */}
              <div className="hidden lg:flex items-center justify-center">
                <HeroOrb />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Phase Teaser ──────────────────────────────────────────────────── */}
        <section id="roadmap" className="py-4 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="card-glass p-8 md:p-12">
              <div className="mb-2 font-mono text-[11px] tracking-[0.16em] uppercase text-[oklch(0.72_0.18_195)]">
                Your path
              </div>
              <h2 className="mb-2 font-display text-3xl font-medium tracking-tight">
                Your path starts at <em className="italic font-light text-gradient-brand">Phase 01</em>
              </h2>
              <p className="mb-8 text-muted-foreground">
                13 phases. Each unlocks the next. No more wondering what to study tomorrow.
              </p>

              {/* Phase strip */}
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                {dotnetPhases.map(({ slug, meta }, i) => (
                  <Link
                    key={slug}
                    href={i === 0 ? `/dotnet/phases` : '#'}
                    className={`flex shrink-0 items-center gap-3 rounded-2xl border px-5 py-4 min-w-[200px] transition-all duration-200 ${
                      i === 0
                        ? 'border-[oklch(0.72_0.18_195/0.4)] bg-[oklch(0.72_0.18_195/0.06)] shadow-[var(--shadow-glow-cyan)] hover:shadow-[0_0_60px_rgba(34,211,238,.5)]'
                        : 'border-border bg-card/50 opacity-50 cursor-default pointer-events-none'
                    }`}
                  >
                    <div className={`flex size-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold ${
                      i === 0
                        ? 'bg-[oklch(0.72_0.18_195)] text-[oklch(0.095_0.025_270)] shadow-[0_0_16px_rgba(34,211,238,.5)]'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <div className="text-sm font-semibold leading-tight">{meta!.title}</div>
                      <div className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">
                        {i === 0 ? 'Start here' : 'Locked'} · {meta!.level ?? 'Junior'}
                      </div>
                    </div>
                  </Link>
                ))}

                {/* "And X more" pill */}
                <div className="flex shrink-0 items-center justify-center rounded-2xl border border-dashed border-border px-6 min-w-[140px] text-sm text-muted-foreground">
                  +{13 - dotnetPhases.length} more
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Feature Strip ─────────────────────────────────────────────────── */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <div className="mb-3 font-mono text-[11px] tracking-[0.16em] uppercase text-muted-foreground">
                What makes it different
              </div>
              <h2 className="font-display text-4xl font-medium tracking-tight">
                Built for depth,<br />
                <em className="italic font-light text-gradient-brand">not breadth.</em>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURES.map(({ icon: Icon, color, glow, title, description }) => (
                <div key={title} className="card-glass group p-6">
                  <div className={`mb-5 flex size-11 items-center justify-center rounded-xl ${glow}`}>
                    <Icon className={`size-5 ${color}`} />
                  </div>
                  <h3 className="mb-2 font-display text-xl font-medium tracking-tight">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Bottom CTA ────────────────────────────────────────────────────── */}
        <section className="border-t border-border py-20 px-4">
          <div className="container mx-auto max-w-2xl text-center">
            <div className="mb-6 flex justify-center">
              <Gem3D color="cyan" size={80} />
            </div>
            <h2 className="mb-4 font-display text-4xl font-medium tracking-tight">
              Pick your stack.<br />
              <em className="italic font-light text-gradient-brand">Begin the path.</em>
            </h2>
            <p className="mb-8 text-muted-foreground">
              No sign-up required. Progress saved locally. Start right now.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {technologies.map((tech) => (
                <Link
                  key={tech.slug}
                  href={`/${tech.slug}/phases`}
                  className="btn-glow gap-2"
                >
                  {tech.title}
                  <ArrowRight className="size-4" />
                </Link>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />

      {/* First-run onboarding */}
      <OnboardingDialog />
    </>
  )
}
