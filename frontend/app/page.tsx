import Link from 'next/link'
import { ArrowRight, BookOpen, Zap, Target, Trophy, Users, Code2 } from 'lucide-react'
import { getAllTechnologies } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { cn } from '@/lib/utils'

const TECH_COLOR_MAP: Record<string, string> = {
  violet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
  red:    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  blue:   'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Structured Learning Path',
    description: 'Progress through carefully ordered phases, from fundamentals to advanced senior-level topics.',
  },
  {
    icon: Code2,
    title: 'Interactive Challenges',
    description: 'Practice with code challenges and quizzes embedded directly in every lesson.',
  },
  {
    icon: Target,
    title: 'Interview-Focused',
    description: 'Every lesson targets real interview questions. Learn the why, not just the what.',
  },
  {
    icon: Zap,
    title: 'Gamified Progress',
    description: 'Earn XP, maintain streaks, unlock badges, and level up from Novice to Architect.',
  },
  {
    icon: Trophy,
    title: 'Interview Templates',
    description: 'Build custom question sets from any lessons to practice mock interviews.',
  },
  {
    icon: Users,
    title: 'Multi-Technology',
    description: 'One platform, multiple technologies. Master .NET, Angular, and more.',
  },
]

export default function HomePage() {
  const technologies = getAllTechnologies().filter((t) => t.status === 'active')

  return (
    <>
      <Navbar />
      <main id="main-content">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/40 bg-gradient-to-b from-background via-background to-muted/20">
          <div className="container mx-auto px-4 py-24 text-center max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs text-muted-foreground mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Now with Angular support
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Ace Your Technical Interview
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              Deep-dive interview prep for senior engineers. Structured phases, interactive challenges,
              and gamified learning — for the technologies that matter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/technologies"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
              >
                Choose Your Technology
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-8 py-3.5 text-base font-semibold hover:bg-muted transition-colors"
              >
                Learn More
              </Link>
            </div>

            {/* Technology badges */}
            {technologies.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-3 justify-center">
                {technologies.map((tech) => {
                  const colorClass = TECH_COLOR_MAP[tech.color] ?? TECH_COLOR_MAP.violet
                  return (
                    <Link
                      key={tech.slug}
                      href={`/${tech.slug}/phases`}
                      className={cn(
                        'rounded-full px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80',
                        colorClass,
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

        {/* Features grid */}
        <section className="py-20 container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Everything you need to prepare</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Built by engineers, for engineers. No fluff, just focused preparation.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="rounded-xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-semibold mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto px-4 text-center max-w-2xl">
            <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of engineers preparing for senior-level interviews.
            </p>
            <Link
              href="/technologies"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-lg hover:opacity-90 transition-opacity"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
