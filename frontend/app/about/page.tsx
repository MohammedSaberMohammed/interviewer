import type { Metadata } from 'next'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'About',
  description: 'About the Interviewer App .NET senior interview prep platform.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">About Interviewer App</h1>
        <div className="prose-lesson space-y-4">
          <p className="text-muted-foreground leading-relaxed">
            Interviewer App is a deep, structured interview preparation platform for .NET engineers.
            Unlike Q&amp;A repositories that train memorization, we build <strong>durable understanding</strong> —
            the kind that survives follow-up questions in real interviews.
          </p>
          <h2 className="text-xl font-semibold mt-6">The Philosophy</h2>
          <p className="text-muted-foreground leading-relaxed">
            Every lesson starts with <em>why</em>. Why does the CLR store value types the way it does?
            Why does async/await compile to a state machine? Why does EF Core have a first-level cache?
            Understanding the why makes the what unforgettable.
          </p>
          <h2 className="text-xl font-semibold mt-6">13 Phases</h2>
          <p className="text-muted-foreground leading-relaxed">
            The curriculum is structured as 13 phases progressing from junior fundamentals to senior-level
            system design. Each phase builds on the last — no gaps, no assumptions of prior knowledge beyond
            what&apos;s been covered.
          </p>
          <h2 className="text-xl font-semibold mt-6">No Account Required</h2>
          <p className="text-muted-foreground leading-relaxed">
            Your progress is stored locally in your browser. No sign-up, no subscription, no tracking.
            Just learning.
          </p>
        </div>
      </main>
      <Footer />
    </>
  )
}
