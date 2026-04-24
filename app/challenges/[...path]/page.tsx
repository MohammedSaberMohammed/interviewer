import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, BookOpen } from 'lucide-react'
import { getChallengeById, getAllChallenges } from '@/lib/content'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { CodeChallenge } from '@/components/lesson/CodeChallenge'
import { Quiz } from '@/components/lesson/Quiz'
import { LessonContextProvider } from '@/components/lesson/LessonContext'
import { NavPrevNext } from '@/components/layout/NavPrevNext'
import type { Difficulty } from '@/types/content'

interface Props {
  params: Promise<{ path: string[] }>
}

export async function generateStaticParams() {
  return getAllChallenges().map((c) => ({
    path: c.id.split('/'),
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path } = await params
  const challenge = getChallengeById(path.join('/'))
  if (!challenge) return {}
  const label = challenge.title ?? (challenge.type === 'quiz' ? 'Quiz' : 'Code Challenge')
  return {
    title: `${label} — ${challenge.lessonTitle}`,
    description: challenge.prompt,
  }
}

export default async function ChallengePage({ params }: Props) {
  const { path } = await params
  const challengeId = path.join('/')
  const challenge = getChallengeById(challengeId)
  if (!challenge) notFound()

  const all = getAllChallenges()
  const idx = all.findIndex((c) => c.id === challengeId)
  const prev = idx > 0 ? all[idx - 1] : null
  const next = idx < all.length - 1 ? all[idx + 1] : null

  const challengeLabel = (c: typeof challenge) =>
    c.title ?? (c.type === 'quiz' ? 'Quiz' : 'Code Challenge')

  const lessonHref = `/phases/${challenge.phaseSlug}/${challenge.lessonSlug}`

  return (
    <>
      <Navbar />
      <main id="main-content" className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted-foreground mb-6">
          <Link href="/challenges" className="hover:text-foreground transition-colors">Challenges</Link>
          <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="text-foreground truncate max-w-56">{challenge.lessonTitle}</span>
        </nav>

        {/* Lesson link */}
        <div className="mb-2">
          <Link
            href={lessonHref}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            View full lesson: <span className="font-medium">{challenge.lessonTitle}</span>
          </Link>
        </div>

        {/* Challenge component — wrapped in LessonContext so basket button works */}
        <LessonContextProvider
          value={{
            lessonSlug: challenge.lessonSlug,
            phaseSlug: challenge.phaseSlug,
            lessonTitle: challenge.lessonTitle,
            phaseTitle: challenge.phaseTitle,
            phaseNumber: challenge.phaseNumber,
          }}
        >
          {challenge.type === 'challenge' ? (
            <CodeChallenge
              id={challenge.id}
              title={challenge.title}
              prompt={challenge.prompt}
              code={challenge.code ?? ''}
              options={challenge.options}
              correctAnswer={challenge.correctAnswer}
              explanation={challenge.explanation}
              difficulty={challenge.difficulty as Difficulty}
            />
          ) : (
            <Quiz
              id={challenge.id}
              question={challenge.prompt ?? ''}
              options={challenge.options}
              correctAnswer={challenge.correctAnswer}
              explanation={challenge.explanation}
              difficulty={challenge.difficulty as Difficulty}
            />
          )}
        </LessonContextProvider>

        {/* Prev / Next navigation */}
        <NavPrevNext
          prev={prev ? { title: challengeLabel(prev), href: `/challenges/${prev.id}` } : undefined}
          next={next ? { title: challengeLabel(next), href: `/challenges/${next.id}` } : undefined}
        />
      </main>
      <Footer />
    </>
  )
}
