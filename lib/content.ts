import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Phase, PhaseMeta, LessonMeta, Lesson, SearchEntry } from '@/types'

const CONTENT_DIR = path.join(process.cwd(), 'content', 'phases')

function getPhaseDir(phaseSlug: string) {
  return path.join(CONTENT_DIR, phaseSlug)
}

export function getAllPhaseSlugs(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return []
  return fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

export function getPhaseMeta(phaseSlug: string): PhaseMeta | null {
  const metaPath = path.join(getPhaseDir(phaseSlug), '_meta.json')
  if (!fs.existsSync(metaPath)) return null
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')) as PhaseMeta
  } catch {
    return null
  }
}

export function getLessonMeta(phaseSlug: string): LessonMeta[] {
  const dir = getPhaseDir(phaseSlug)
  if (!fs.existsSync(dir)) return []

  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))
    .map((file) => {
      const content = fs.readFileSync(path.join(dir, file), 'utf8')
      const { data } = matter(content)
      return data as LessonMeta
    })
    .filter(Boolean)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
}

export function getAllPhases(): Phase[] {
  return getAllPhaseSlugs()
    .map((slug) => {
      const meta = getPhaseMeta(slug)
      if (!meta) return null
      const lessons = getLessonMeta(slug)
      return { ...meta, lessons }
    })
    .filter((p): p is Phase => p !== null)
}

export function getPhase(phaseSlug: string): Phase | null {
  const meta = getPhaseMeta(phaseSlug)
  if (!meta) return null
  const lessons = getLessonMeta(phaseSlug)
  return { ...meta, lessons }
}

export function getLesson(phaseSlug: string, lessonSlug: string): Lesson | null {
  const dir = getPhaseDir(phaseSlug)
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))

  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data } = matter(content)
    if ((data as LessonMeta).slug === lessonSlug) {
      const phaseMeta = getPhaseMeta(phaseSlug)
      return {
        ...(data as LessonMeta),
        phaseSlug,
        phaseNumber: phaseMeta?.number ?? 0,
        phaseTitle: phaseMeta?.title ?? '',
      }
    }
  }
  return null
}

export function getAdjacentLessons(
  phaseSlug: string,
  lessonSlug: string
): { prev: LessonMeta | null; next: LessonMeta | null } {
  const lessons = getLessonMeta(phaseSlug)
  const idx = lessons.findIndex((l) => l.slug === lessonSlug)
  return {
    prev: idx > 0 ? (lessons[idx - 1] ?? null) : null,
    next: idx < lessons.length - 1 ? (lessons[idx + 1] ?? null) : null,
  }
}

export function getLessonRawMdx(phaseSlug: string, lessonSlug: string): string | null {
  const dir = getPhaseDir(phaseSlug)
  if (!fs.existsSync(dir)) return null

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))

  for (const file of files) {
    const filePath = path.join(dir, file)
    const content = fs.readFileSync(filePath, 'utf8')
    const { data } = matter(content)
    if ((data as LessonMeta).slug === lessonSlug) {
      return content
    }
  }
  return null
}

/**
 * Extracts the ordered list of <QuestStep id="..."> IDs from raw MDX source.
 * Used server-side to pass stepIds to the QuestLayout client component.
 */
export function extractQuestStepIds(rawMdx: string): string[] {
  const ids: string[] = []
  // Match <QuestStep id="..." or <QuestStep id='...'
  const re = /<QuestStep[^>]+\bid=["']([^"']+)["']/g
  let m: RegExpExecArray | null
  while ((m = re.exec(rawMdx)) !== null) {
    if (m[1]) ids.push(m[1])
  }
  return ids
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const phaseSlug of getAllPhaseSlugs()) {
    const phaseMeta = getPhaseMeta(phaseSlug)
    if (!phaseMeta) continue

    const lessons = getLessonMeta(phaseSlug)
    for (const lesson of lessons) {
      if (lesson.status !== 'published') continue
      entries.push({
        id: `${phaseSlug}/${lesson.slug}`,
        title: lesson.title,
        summary: lesson.summary,
        phaseSlug,
        phaseTitle: phaseMeta.title,
        lessonSlug: lesson.slug,
        difficulty: lesson.difficulty,
        tags: lesson.tags,
        url: `/phases/${phaseSlug}/${lesson.slug}`,
      })
    }
  }

  return entries
}
