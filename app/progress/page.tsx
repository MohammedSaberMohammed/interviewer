import type { Metadata } from 'next'
import { getAllPhases } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ProgressDashboard } from '@/components/progress/ProgressDashboard'

export const metadata: Metadata = {
  title: 'Progress',
  description: 'Track your .NET interview prep progress.',
}

export default function ProgressPage() {
  const phases = getAllPhases()
  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Your Progress</h1>
        <p className="text-muted-foreground mb-8">Track your learning journey across all 13 phases.</p>
        <ProgressDashboard phases={phases} />
      </main>
      <Footer />
    </>
  )
}
