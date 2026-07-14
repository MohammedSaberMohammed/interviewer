import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTechSlugs, getAllPhases, getTechMeta } from '@/lib/content'
import { PhaseCard } from '@/components/home/PhaseCard'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PhasesHeader } from '@/components/phases/PhasesHeader'

interface Props {
  params: Promise<{ techSlug: string }>
}

export async function generateStaticParams() {
  return getAllTechSlugs().map((techSlug) => ({ techSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { techSlug } = await params
  const tech = getTechMeta(techSlug)
  if (!tech) return {}
  return {
    title: `${tech.title} Curriculum`,
    description: `Browse all learning phases for ${tech.title} interview preparation.`,
  }
}

export default async function PhasesPage({ params }: Props) {
  const { techSlug } = await params
  const tech = getTechMeta(techSlug)
  if (!tech) notFound()
  const phases = getAllPhases(techSlug)
  const totalLessons = phases.reduce((acc, p) => acc + p.lessons.length, 0)

  return (
    <>
      <Navbar techSlug={techSlug} />
      <main id="main-content" className="container mx-auto px-4 py-10">
        <PhasesHeader techSlug={techSlug} totalLessons={totalLessons} techTitle={tech.title} />
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {phases.map((phase) => (
            <PhaseCard key={phase.slug} phase={phase} techSlug={techSlug} />
          ))}
        </div>
      </main>
      <Footer />
    </>
  )
}
