import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, Clock } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkFrontmatter from 'remark-frontmatter'
import rehypeShiki from '@shikijs/rehype'
import {
  getAllPhaseSlugs,
  getLessonMeta,
  getLesson,
  getAdjacentLessons,
  getPhaseMeta,
  getLessonRawMdx,
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
import { CodeBlock } from '@/components/lesson/CodeBlock'
import {
  QuestStep,
  CharacterTeach,
  TapToSpot,
  QuestLayout,
  ReadAsArticleToggle,
} from '@/components/quest'
import { AddLessonToBasketButton } from '@/components/basket/AddLessonToBasketButton'

interface Props {
  params: Promise<{ phaseSlug: string; lessonSlug: string }>
}

const mdxComponents = {
  Callout,
  CodeChallenge,
  Quiz,
  ComparisonTable,
  MythBuster,
  MemoryVisualizer,
  CodePlayground,
  DocsLink,
  DocsLinks,
  // Override <pre> to add language label + copy button around Shiki output
  pre: CodeBlock,
  // Quest components — available for re-authored lessons
  QuestStep,
  CharacterTeach,
  TapToSpot,
}

export async function generateStaticParams() {
  const params: { phaseSlug: string; lessonSlug: string }[] = []
  for (const phaseSlug of getAllPhaseSlugs()) {
    const lessons = getLessonMeta(phaseSlug)
    for (const lesson of lessons) {
      params.push({ phaseSlug, lessonSlug: lesson.slug })
    }
  }
  return params
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { phaseSlug, lessonSlug } = await params
  const lesson = getLesson(phaseSlug, lessonSlug)
  if (!lesson) return {}
  return {
    title: lesson.title,
    description: lesson.summary,
  }
}

export default async function LessonPage({ params }: Props) {
  const { phaseSlug, lessonSlug } = await params
  const lesson = getLesson(phaseSlug, lessonSlug)
  if (!lesson) notFound()

  const phaseMeta = getPhaseMeta(phaseSlug)
  const allLessons = getLessonMeta(phaseSlug)
  const { prev, next } = getAdjacentLessons(phaseSlug, lessonSlug)

  const rawMdx = lesson.status === 'published' ? getLessonRawMdx(phaseSlug, lessonSlug) : null
  const stepIds = rawMdx ? extractQuestStepIds(rawMdx) : []
  const questMode = !!(lesson.questMode && stepIds.length > 0)

  const nextLesson = next ? { slug: next.slug, title: next.title } : null

  const mdxContent = rawMdx ? (
    <MDXRemote
      source={rawMdx}
      components={mdxComponents}
      options={{
        // Allow JS expressions in MDX props (template literals, arrays, numbers).
        // Safe because MDX files are static content we control, not user input.
        blockJS: false,
        mdxOptions: {
          remarkPlugins: [remarkFrontmatter],
          rehypePlugins: [
            [rehypeShiki, {
              themes: { light: 'github-light', dark: 'github-dark' },
              langs: ['csharp', 'typescript', 'tsx', 'json', 'bash', 'xml', 'sql'],
              defaultLanguage: 'csharp',
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
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/phases" className="hover:text-foreground transition-colors">Phases</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <Link href={`/phases/${phaseSlug}`} className="hover:text-foreground transition-colors">
            {phaseMeta?.title ?? phaseSlug}
          </Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground truncate max-w-48">{lesson.title}</span>
        </nav>

        <div className="flex gap-8">
          {/* Left sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-20">
              <Sidebar
                phaseSlug={phaseSlug}
                phaseTitle={phaseMeta?.title ?? ''}
                lessons={allLessons}
              />
            </div>
          </aside>

          {/* Main content */}
          <main id="main-content" className="flex-1 min-w-0 max-w-2xl">
            {/* Lesson header */}
            <div className="mb-8">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                  <DifficultyBadge level={lesson.difficulty} />
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {lesson.readingTime} min read
                  </span>
                </div>
                {/* Basket + article mode */}
                <div className="flex items-center gap-2">
                  {lesson.status === 'published' && (
                    <AddLessonToBasketButton
                      lessonSlug={lessonSlug}
                      phaseSlug={phaseSlug}
                      lessonTitle={lesson.title}
                      phaseTitle={phaseMeta?.title ?? ''}
                      phaseNumber={phaseMeta?.number ?? 0}
                      difficulty={lesson.difficulty}
                      summary={lesson.summary}
                    />
                  )}
                  <ReadAsArticleToggle />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{lesson.title}</h1>
              {lesson.summary && (
                <p className="text-muted-foreground text-base leading-relaxed">{lesson.summary}</p>
              )}
              <div className="mt-4">
                <LessonActions phaseSlug={phaseSlug} lessonSlug={lessonSlug} />
              </div>
            </div>

            {/* Lesson content — wrapped in QuestLayout for step navigation */}
              <QuestLayout
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

            {/* Docs links */}
            {lesson.docsLinks.length > 0 && (
              <div className="mt-8">
                <DocsLinks links={lesson.docsLinks} />
              </div>
            )}

            {/* Tags */}
            {lesson.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {lesson.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Prev/Next navigation */}
            <NavPrevNext
              prev={prev ? { title: prev.title, href: `/phases/${phaseSlug}/${prev.slug}` } : undefined}
              next={next ? { title: next.title, href: `/phases/${phaseSlug}/${next.slug}` } : undefined}
            />
          </main>

          {/* Right sidebar — TOC */}
          <aside className="hidden xl:block w-48 shrink-0">
            <div className="sticky top-20">
              <LessonTOC />
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </>
  )
}
