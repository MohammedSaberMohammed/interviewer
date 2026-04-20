import type { Metadata } from 'next'
import { getAllPhases } from '@/lib/content'
import { PhaseCard } from '@/components/home/PhaseCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'All Phases',
  description: 'Browse all 13 phases of the .NET senior interview preparation curriculum.',
}

export default function PhasesPage() {
  const phases = getAllPhases()

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Curriculum Phases</h1>
          <p className="text-muted-foreground">
            13 phases covering everything from C# fundamentals to distributed system design.
            Phase 1 is fully available.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <PhaseCard key={phase.slug} phase={phase} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
