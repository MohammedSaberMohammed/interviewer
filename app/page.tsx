import { getAllPhases } from '@/lib/content'
import { Hero } from '@/components/home/Hero'
import { Roadmap } from '@/components/home/Roadmap'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { PhaseCard } from '@/components/home/PhaseCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  const phases = getAllPhases()

  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Roadmap phases={phases} />
        <FeatureGrid />

        {/* Phase grid */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">All 13 Phases</h2>
              <p className="text-sm text-muted-foreground">
                Phase 1 is fully available. Phases 2–13 are scaffolded and publishing progressively.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {phases.map((phase) => (
                <PhaseCard key={phase.slug} phase={phase} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
