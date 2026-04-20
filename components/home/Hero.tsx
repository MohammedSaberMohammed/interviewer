import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Map } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="container mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs text-muted-foreground mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden="true" />
          Phase 1 fully available · 13 phases total
        </div>

        <h1 className="mx-auto max-w-3xl text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
          From Junior to{' '}
          <span className="text-primary">Senior .NET</span>{' '}
          Engineer
        </h1>

        <p className="mx-auto max-w-xl text-muted-foreground text-base md:text-lg mb-8 leading-relaxed">
          A deep, structured interview preparation journey across 13 phases.
          We teach the <em>why</em> behind every concept — from CLR internals
          to distributed system design.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button size="lg" className="gap-2" render={<Link href="/phases/01-csharp-core/clr-cts-cls" />}>
            Start Phase 1
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button size="lg" variant="outline" className="gap-2" render={<Link href="/phases" />}>
            <Map className="h-4 w-4" aria-hidden="true" />
            View Roadmap
          </Button>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          No sign-up required. Progress saved in your browser.
        </p>
      </div>
    </section>
  )
}
