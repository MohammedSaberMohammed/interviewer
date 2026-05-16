import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTechSlugs, getAllPhases, getTechMeta } from '@/lib/content'
import { PhaseRoadmap } from '@/components/phases/PhaseRoadmap'
import { PhasesHeader } from '@/components/phases/PhasesHeader'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

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
      <main id="main-content" className="overflow-x-hidden">
        {/* Ambient radial bg */}
        <div
          className="pointer-events-none fixed inset-0 -z-10 opacity-40"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, oklch(0.72 0.18 195 / 0.08) 0%, transparent 60%)' }}
          aria-hidden
        />

        <div className="container mx-auto px-4 pt-12 pb-6 max-w-5xl">
          <PhasesHeader techSlug={techSlug} totalLessons={totalLessons} techTitle={tech.title} />
        </div>

        <PhaseRoadmap phases={phases} techSlug={techSlug} />
      </main>
      <Footer />
    </>
  )
}
