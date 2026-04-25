import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { InterviewMode } from '@/components/interview/InterviewMode'
import { getAllPhases } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Interview Mode',
  description: 'Timed interview simulation with random .NET and C# questions.',
}

export default function InterviewPage() {
  const phases = getAllPhases('dotnet')
  const publishedLessons = phases.flatMap((phase) =>
    phase.lessons
      .filter((l) => l.status === 'published')
      .map((l) => ({ ...l, phaseSlug: phase.slug, phaseTitle: phase.title }))
  )

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Interview Mode</h1>
          <p className="text-muted-foreground">
            Simulate a real interview: timed questions, no looking back. See how you perform under pressure.
          </p>
        </div>
        <InterviewMode lessons={publishedLessons} />
      </main>
      <Footer />
    </>
  )
}
