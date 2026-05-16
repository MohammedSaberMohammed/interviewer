import type { Metadata } from 'next'
import { Code2, HelpCircle, Zap, BarChart3 } from 'lucide-react'
import { getAllChallenges, getAllPhases, getAllTechSlugs } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ChallengesExplorer } from '@/components/challenges/ChallengesExplorer'

export const metadata: Metadata = {
  title: 'Challenges',
  description: 'Code challenges and quizzes across all technologies and phases.',
}

export default function ChallengesPage() {
  const challenges = getAllChallenges()
  const quizCount = challenges.filter((c) => c.type === 'quiz').length
  const codeCount = challenges.filter((c) => c.type === 'challenge').length

  // Gather unique phases across all techs
  const allPhases = getAllTechSlugs().flatMap((techSlug) =>
    getAllPhases(techSlug).map((p) => ({ slug: p.slug, number: p.number, title: p.title }))
  )
  const seenSlugs = new Set<string>()
  const phases = allPhases.filter((p) => {
    if (seenSlugs.has(p.slug)) return false
    seenSlugs.add(p.slug)
    return true
  })

  const stats = [
    { label: 'Total', value: challenges.length, icon: BarChart3, colorClass: 'text-brand-cyan', bgClass: 'bg-[oklch(0.72_0.18_195/0.12)]' },
    { label: 'Quiz', value: quizCount, icon: HelpCircle, colorClass: 'text-[oklch(0.85_0.20_320)]', bgClass: 'bg-[oklch(0.68_0.25_320/0.12)]' },
    { label: 'Coding', value: codeCount, icon: Code2, colorClass: 'text-brand-cyan', bgClass: 'bg-[oklch(0.72_0.18_195/0.12)]' },
    { label: 'System Design', value: 0, icon: Zap, colorClass: 'text-brand-amber', bgClass: 'bg-[oklch(0.78_0.18_85/0.12)]' },
  ]

  return (
    <>
      <Navbar />
      <main id="main-content">

        {/* Hero */}
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, oklch(0.20 0.12 280) 0%, oklch(0.18 0.14 310) 50%, oklch(0.20 0.10 290) 100%)',
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(oklch(1 0 0 / 0.8) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 0.8) 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-64 w-full opacity-20"
            style={{ background: 'radial-gradient(ellipse 60% 100% at 50% 0%, oklch(0.72 0.18 195 / 0.5), transparent)' }}
          />

          <div className="container mx-auto px-4 py-10 max-w-6xl relative">
            <div className="mb-8">
              <p className="mb-2 font-mono text-[10px] tracking-[0.18em] uppercase text-[oklch(0.82_0.18_195)]">
                Practice Arena
              </p>
              <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white mb-2">
                All{' '}
                <span className="bg-gradient-to-r from-[oklch(0.82_0.18_195)] to-[oklch(0.85_0.20_320)] bg-clip-text text-transparent">
                  Challenges
                </span>
              </h1>
              <p className="text-sm text-white/60">
                Practice with quizzes and code challenges — filtered by phase, difficulty, and status.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map(({ label, value, icon: Icon, colorClass, bgClass }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${bgClass}`}>
                    <Icon className={`h-4 w-4 ${colorClass}`} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-mono text-xl font-bold text-white tabular-nums">{value}</p>
                    <p className="text-[10px] text-white/50">{label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <ChallengesExplorer challenges={challenges} phases={phases} />
        </div>

      </main>
      <Footer />
    </>
  )
}
