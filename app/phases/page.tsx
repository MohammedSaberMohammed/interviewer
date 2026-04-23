import type { Metadata } from 'next'
import { getAllPhases } from '@/lib/content'
import { PhaseCard } from '@/components/home/PhaseCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PhasesHeader } from '@/components/phases/PhasesHeader'

export const metadata: Metadata = {
  title: 'Curriculum Phases',
  description: 'Browse all 13 phases of the .NET senior interview preparation curriculum.',
}

export default function PhasesPage() {
  const phases = getAllPhases()
  const totalLessons = phases.reduce((acc, p) => acc + p.lessons.length, 0)

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-10">
        <PhasesHeader phases={phases} totalLessons={totalLessons} />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <PhaseCard key={phase.slug} phase={phase} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
