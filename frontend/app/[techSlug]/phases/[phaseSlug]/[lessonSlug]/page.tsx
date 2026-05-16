import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeShiki from '@shikijs/rehype'
import {
  getAllTechSlugs,
  getAllPhaseSlugs,
  getLessonMeta,
  getLesson,
  getAdjacentLessons,
  getPhaseMeta,
  getLessonRawMdx,
  getTechMeta,
  extractQuestStepIds,
} from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Sidebar } from '@/components/layout/Sidebar'
import { NavPrevNext } from '@/components/layout/NavPrevNext'
import { DifficultyBadge } from '@/components/lesson/DifficultyBadge'
import { DocsLink, DocsLinks } from '@/components/lesson/DocsLink'
import { LessonActions } from '@/components/lesson/LessonActions'
import { LessonTOC } from '@/components/lesson/LessonTOC'
import { Callout } from '@/components/lesson/Callout'
import { CodeChallenge } from '@/components/lesson/CodeChallenge'
import { Quiz } from '@/components/lesson/Quiz'
import { ComparisonTable } from '@/components/lesson/ComparisonTable'
import { MythBuster } from '@/components/lesson/MythBuster'
import { MemoryVisualizer } from '@/components/lesson/MemoryVisualizer'
import { CodePlayground } from '@/components/lesson/CodePlayground'
import { ArchDiagram } from '@/components/lesson/ArchDiagram'
import { CodeBlock } from '@/components/lesson/CodeBlock'
import { QuestStep, CharacterTeach, TapToSpot, QuestLayout } from '@/components/quest'
import { AddLessonToBasketButton } from '@/components/basket/AddLessonToBasketButton'
import { ReadingProgress } from '@/components/lesson/ReadingProgress'

interface Props {
  params: Promise<{ techSlug: string; phaseSlug: string; lessonSlug: string }>
}

const mdxComponents = {
  ArchDiagram, Callout, CodeChallenge, Quiz, ComparisonTable, MythBuster,
  MemoryVisualizer, CodePlayground, DocsLink, DocsLinks,
  pre: CodeBlock,
  QuestStep, CharacterTeach, TapToSpot,
}

export async function generateStaticParams() {
  const params: { techSlug: string; phaseSlug: string; lessonSlug: string }[] = []
  for (const techSlug of getAllTechSlugs()) {
    for (const phaseSlug of getAllPhaseSlugs(techSlug)) {
      const lessons = getLessonMeta(techSlug, phaseSlug)
      for (const lesson of lessons) {
        params.push({ techSlug, phaseSlug, lessonSlug: lesson.slug })
      }
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { techSlug, phaseSlug, lessonSlug } = await params
  const lesson = getLesson(techSlug, phaseSlug, lessonSlug)
  if (!lesson) return {}
  return { title: lesson.title, description: lesson.summary }
}

export default async function LessonPage({ params }: Props) {
  const { techSlug, phaseSlug, lessonSlug } = await params
  const lesson = getLesson(techSlug, phaseSlug, lessonSlug)
  if (!lesson) notFound()

  const tech = getTechMeta(techSlug)
  const phaseMeta = getPhaseMeta(techSlug, phaseSlug)
  const allLessons = getLessonMeta(techSlug, phaseSlug)
  const { prev, next } = getAdjacentLessons(techSlug, phaseSlug, lessonSlug)

  const rawMdx = lesson.status === 'published' ? getLessonRawMdx(techSlug, phaseSlug, lessonSlug) : null
  const stepIds = rawMdx ? extractQuestStepIds(rawMdx) : []
  const questMode = !!(lesson.questMode && stepIds.length > 0)
  const nextLesson = next ? { slug: next.slug, title: next.title } : null

  const defaultLanguage = tech?.defaultLanguage ?? 'typescript'

  const mdxContent = rawMdx ? (
    <MDXRemote
      source={rawMdx}
      components={mdxComponents}
      options={{
        blockJS: false,
        mdxOptions: {
          remarkPlugins: [remarkFrontmatter],
          rehypePlugins: [
            [rehypeShiki, {
              themes: { light: 'github-light', dark: 'github-dark' },
              langs: ['csharp', 'typescript', 'tsx', 'javascript', 'jsx', 'html', 'json', 'bash', 'xml', 'sql'],
              defaultLanguage,
              addLanguageClass: true,
            }],
          ],
        },
      }}
    />
  ) : (
    <div className="rounded-xl border border-border bg-muted/30 p-8 text-center">
      <p className="font-semibold mb-1">Content Coming Soon</p>
      <p className="text-muted-foreground text-sm">This lesson is being written. Check back soon.</p>
    </div>
  )

  return (
    <>
      <ReadingProgress />
      <Navbar techSlug={techSlug} />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb — mono style matching mockup */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground mb-6">
          <Link href={`/${techSlug}/phases`} className="hover:text-foreground transition-colors">{tech?.title ?? techSlug}</Link>
          <span aria-hidden="true" className="text-muted-foreground/50">›</span>
          <Link href={`/${techSlug}/phases/${phaseSlug}`} className="hover:text-foreground transition-colors">
            Phase {phaseMeta?.number ?? ''}
          </Link>
          <span aria-hidden="true" className="text-muted-foreground/50">›</span>
          <span className="text-foreground truncate max-w-48">{lesson.title}</span>
        </nav>

        <div className="flex gap-8">
          {/* Left sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <Sidebar
                techSlug={techSlug}
                phaseSlug={phaseSlug}
                phaseTitle={phaseMeta?.title ?? ''}
                lessons={allLessons}
              />
            </div>
          </aside>

          {/* Main content */}
          <main id="main-content" className="flex-1 min-w-0">
            <div className="mb-8">
              {/* Meta badges row */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <DifficultyBadge level={lesson.difficulty} />
                {lesson.questMode && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[oklch(0.68_0.25_320/0.3)] bg-[oklch(0.68_0.25_320/0.1)] px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] text-brand-magenta">
                    ⚡ Quest
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                  <Clock className="h-2.5 w-2.5" aria-hidden="true" />
                  {lesson.readingTime} min read
                </span>
                {lesson.status === 'published' && (
                  <div className="ml-auto">
                    <AddLessonToBasketButton
                      lessonSlug={lessonSlug}
                      phaseSlug={phaseSlug}
                      techSlug={techSlug}
                      lessonTitle={lesson.title}
                      phaseTitle={phaseMeta?.title ?? ''}
                      phaseNumber={phaseMeta?.number ?? 0}
                      difficulty={lesson.difficulty}
                      summary={lesson.summary}
                    />
                  </div>
                )}
              </div>

              {/* Large title */}
              <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-[-0.03em] leading-[1.05] mb-4">
                {lesson.title}
              </h1>

              {lesson.summary && (
                <p className="text-muted-foreground text-base leading-relaxed max-w-2xl mb-6">{lesson.summary}</p>
              )}

              <LessonActions techSlug={techSlug} phaseSlug={phaseSlug} lessonSlug={lessonSlug} />
            </div>

            <QuestLayout
              techSlug={techSlug}
              phaseSlug={phaseSlug}
              lessonSlug={lessonSlug}
              lessonTitle={lesson.title}
              phaseTitle={phaseMeta?.title ?? ''}
              phaseNumber={phaseMeta?.number ?? 0}
              stepIds={stepIds}
              questMode={questMode}
              nextLesson={nextLesson}
            >
              <div className="prose-lesson" id="lesson-content">
                {mdxContent}
              </div>
            </QuestLayout>

            {lesson.docsLinks.length > 0 && (
              <div className="mt-8"><DocsLinks links={lesson.docsLinks} /></div>
            )}

            {lesson.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs text-foreground/60 dark:bg-[oklch(0.20_0.016_264)] dark:border-[oklch(0.30_0.016_264/0.7)] dark:text-[oklch(0.72_0.012_264)]">{tag}</span>
                ))}
              </div>
            )}

            <NavPrevNext
              prev={prev ? { title: prev.title, href: `/${techSlug}/phases/${phaseSlug}/${prev.slug}` } : undefined}
              next={next ? { title: next.title, href: `/${techSlug}/phases/${phaseSlug}/${next.slug}` } : undefined}
            />
          </main>

          {/* Right sidebar — TOC + XP card */}
          <aside className="hidden xl:block w-52 shrink-0">
            <div className="sticky top-20">
              <LessonTOC techSlug={techSlug} />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
