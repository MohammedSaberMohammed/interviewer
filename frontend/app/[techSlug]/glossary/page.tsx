import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTechSlugs, getTechMeta, getGlossary } from '@/lib/content'
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
  const meta = getTechMeta(techSlug)
  const title = meta?.title ? `${meta.title} Glossary` : 'Glossary'
  return {
    title,
    description: `Key terms and definitions for ${meta?.title ?? techSlug} interview preparation.`,
  }
}

export default async function TechGlossaryPage({ params }: Props) {
  const { techSlug } = await params
  const tech = getTechMeta(techSlug)
  if (!tech) notFound()

  const terms = getGlossary(techSlug)

  const grouped = terms.reduce<Record<string, typeof terms>>((acc, term) => {
    const letter = term.term[0]?.toUpperCase() ?? '#'
    if (!acc[letter]) acc[letter] = []
    acc[letter]!.push(term)
    return acc
  }, {})

  const letters = Object.keys(grouped).sort()

  return (
    <>
      <Navbar techSlug={techSlug} />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tech.title} Glossary</h1>
          <p className="text-muted-foreground">Key terms and definitions, A–Z.</p>
        </div>

        {terms.length === 0 ? (
          <p className="text-muted-foreground">Glossary coming soon.</p>
        ) : (
          <>
            {/* Letter index */}
            <nav aria-label="Glossary index" className="flex flex-wrap gap-1 mb-8">
              {letters.map((letter) => (
                <a
                  key={letter}
                  href={`#${letter}`}
                  className="flex h-7 w-7 items-center justify-center rounded text-xs font-mono font-semibold hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                >
                  {letter}
                </a>
              ))}
            </nav>

            <div className="space-y-8">
              {letters.map((letter) => (
                <section key={letter} id={letter}>
                  <h2 className="text-xl font-bold text-primary mb-3 border-b border-border pb-1">{letter}</h2>
                  <dl className="space-y-3">
                    {grouped[letter]!.map(({ term, definition }) => (
                      <div key={term} className="flex gap-4">
                        <dt className="shrink-0 w-36 font-mono font-semibold text-sm text-foreground">{term}</dt>
                        <dd className="text-sm text-muted-foreground leading-relaxed">{definition}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
