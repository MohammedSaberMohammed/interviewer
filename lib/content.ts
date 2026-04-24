import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Difficulty } from '@/types/content'
import type { Phase, PhaseMeta } from '@/types/phase'
import type { LessonMeta, Lesson } from '@/types/lesson'
import type { SearchEntry } from '@/types/search'
import type { ExtractedChallenge } from '@/types/challenge'

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

// ─── Challenge extraction ─────────────────────────────────────────────────────

/** Scan forward from `from` looking for `/>`, skipping strings and template literals. */
function findSelfCloseEnd(source: string, from: number): number {
  let i = from
  while (i < source.length) {
    const ch = source[i]
    if (ch === '`') {
      i++
      while (i < source.length && source[i] !== '`') i++
      i++
      continue
    }
    if (ch === '"' || ch === "'") {
      const q = ch
      i++
      while (i < source.length && source[i] !== q) i++
      i++
      continue
    }
    if (ch === '/' && i + 1 < source.length && source[i + 1] === '>') {
      return i + 2
    }
    i++
  }
  return -1
}

function findChallengeBlocks(rawMdx: string): string[] {
  const blocks: string[] = []
  const tagRe = /<(CodeChallenge|Quiz)\b/g
  let m: RegExpExecArray | null
  while ((m = tagRe.exec(rawMdx)) !== null) {
    const end = findSelfCloseEnd(rawMdx, m.index + m[0].length)
    if (end !== -1) blocks.push(rawMdx.slice(m.index, end))
  }
  return blocks
}

function getStringProp(block: string, ...names: string[]): string | undefined {
  for (const name of names) {
    const m = new RegExp(`\\b${name}="([^"]*?)"`).exec(block)
    if (m) return m[1]
  }
  return undefined
}

function getTemplateProp(block: string, propName: string): string | undefined {
  const marker = `${propName}={\``
  const pos = block.indexOf(marker)
  if (pos === -1) return undefined
  const start = pos + marker.length
  const end = block.indexOf('`}', start)
  return end === -1 ? undefined : block.slice(start, end)
}

function getNumberProp(block: string, propName: string): number | undefined {
  const m = new RegExp(`\\b${propName}=\\{(\\d+)\\}`).exec(block)
  return m ? Number(m[1]) : undefined
}

function getArrayProp(block: string, propName: string): string[] {
  const marker = `${propName}={[`
  const pos = block.indexOf(marker)
  if (pos === -1) return []
  let depth = 1
  let i = pos + marker.length
  const innerStart = i
  while (i < block.length && depth > 0) {
    if (block[i] === '[') depth++
    else if (block[i] === ']') { depth--; if (depth === 0) break }
    i++
  }
  try {
    return JSON.parse(`[${block.slice(innerStart, i).trim()}]`) as string[]
  } catch {
    return []
  }
}

function blockToChallenge(
  block: string,
  lessonDifficulty: Difficulty,
  phaseSlug: string,
  lessonSlug: string,
  lessonTitle: string,
  phaseTitle: string,
  phaseNumber: number,
): ExtractedChallenge | null {
  const id = getStringProp(block, 'id')
  if (!id) return null
  const type: 'challenge' | 'quiz' = block.startsWith('<Quiz') ? 'quiz' : 'challenge'
  const difficultyRaw = getStringProp(block, 'difficulty') as Difficulty | undefined
  return {
    id,
    type,
    title: getStringProp(block, 'title'),
    prompt: getStringProp(block, 'description', 'prompt', 'question'),
    code: getTemplateProp(block, 'code'),
    options: getArrayProp(block, 'options'),
    correctAnswer: getNumberProp(block, 'correctAnswer') ?? 0,
    explanation: getStringProp(block, 'explanation') ?? getTemplateProp(block, 'explanation') ?? '',
    difficulty: difficultyRaw ?? lessonDifficulty,
    phaseSlug,
    lessonSlug,
    lessonTitle,
    phaseTitle,
    phaseNumber,
  }
}

export function getAllChallenges(): ExtractedChallenge[] {
  const challenges: ExtractedChallenge[] = []
  for (const phaseSlug of getAllPhaseSlugs()) {
    const phaseMeta = getPhaseMeta(phaseSlug)
    if (!phaseMeta) continue
    const lessons = getLessonMeta(phaseSlug)
    for (const lesson of lessons) {
      if (lesson.status !== 'published') continue
      const rawMdx = getLessonRawMdx(phaseSlug, lesson.slug)
      if (!rawMdx) continue
      for (const block of findChallengeBlocks(rawMdx)) {
        const c = blockToChallenge(block, lesson.difficulty, phaseSlug, lesson.slug, lesson.title, phaseMeta.title, phaseMeta.number)
        if (c) challenges.push(c)
      }
    }
  }
  return challenges
}

export function getChallengeById(challengeId: string): ExtractedChallenge | null {
  // Challenge IDs encode location: "phaseSlug/lessonSlug/challengeSlug"
  const parts = challengeId.split('/')
  if (parts.length < 3) return null
  const phaseSlug = parts[0]!
  const lessonSlug = parts[1]!
  const phaseMeta = getPhaseMeta(phaseSlug)
  if (!phaseMeta) return null
  const lesson = getLesson(phaseSlug, lessonSlug)
  if (!lesson) return null
  const rawMdx = getLessonRawMdx(phaseSlug, lessonSlug)
  if (!rawMdx) return null
  for (const block of findChallengeBlocks(rawMdx)) {
    const c = blockToChallenge(block, lesson.difficulty, phaseSlug, lessonSlug, lesson.title, phaseMeta.title, phaseMeta.number)
    if (c?.id === challengeId) return c
  }
  return null
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
