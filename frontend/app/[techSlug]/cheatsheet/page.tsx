import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getAllTechSlugs, getTechMeta, getCheatsheet } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface Props {
  params: Promise<{ techSlug: string }>
}

export async function generateStaticParams() {
  return getAllTechSlugs().map((techSlug) => ({ techSlug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { techSlug } = await params
  const meta = getTechMeta(techSlug)
  const title = meta?.title ? `${meta.title} Cheatsheet` : 'Cheatsheet'
  return {
    title,
    description: `Quick-reference interview cheatsheet for ${meta?.title ?? techSlug}.`,
  }
}

export default async function TechCheatsheetPage({ params }: Props) {
  const { techSlug } = await params
  const tech = getTechMeta(techSlug)
  if (!tech) notFound()

  const sections = getCheatsheet(techSlug)

  return (
    <>
      <Navbar techSlug={techSlug} />
      <main id="main-content" className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{tech.title} Cheatsheet</h1>
          <p className="text-muted-foreground">
            Quick-reference cards for last-minute review. Expand any section.
          </p>
        </div>

        {sections.length === 0 ? (
          <p className="text-muted-foreground">Cheatsheet coming soon.</p>
        ) : (
          <Accordion multiple className="space-y-3">
            {sections.map((section) => (
              <AccordionItem
                key={section.id}
                value={section.id}
                className="rounded-xl border border-border bg-card overflow-hidden"
              >
                <AccordionTrigger className="px-4 py-3 text-sm font-semibold hover:no-underline hover:bg-accent">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <dl className="space-y-2 mt-2">
                    {section.content.map((item) => (
                      <div key={item.label} className="flex gap-3 text-sm">
                        <dt className="shrink-0 font-mono text-primary min-w-[160px]">{item.label}</dt>
                        <dd className="text-muted-foreground">{item.value}</dd>
                      </div>
                    ))}
                  </dl>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
      <Footer />
    </>
  )
}
