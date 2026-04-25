import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Phase, PhaseMeta, LessonMeta, Lesson, SearchEntry, ExtractedChallenge, Difficulty, TechnologyMeta } from '@/types'

const TECHNOLOGIES_DIR = path.join(process.cwd(), 'content', 'technologies')

function getTechDir(techSlug: string) {
  return path.join(TECHNOLOGIES_DIR, techSlug)
}

function getPhaseDir(techSlug: string, phaseSlug: string) {
  return path.join(getTechDir(techSlug), 'phases', phaseSlug)
}

export function getAllTechSlugs(): string[] {
  if (!fs.existsSync(TECHNOLOGIES_DIR)) return []
  return fs
    .readdirSync(TECHNOLOGIES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

export function getTechMeta(techSlug: string): TechnologyMeta | null {
  const metaPath = path.join(getTechDir(techSlug), '_tech.json')
  if (!fs.existsSync(metaPath)) return null
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')) as TechnologyMeta
  } catch {
    return null
  }
}

export function getAllTechnologies(): TechnologyMeta[] {
  return getAllTechSlugs()
    .map((slug) => getTechMeta(slug))
    .filter((t): t is TechnologyMeta => t !== null)
    .sort((a, b) => a.order - b.order)
}

export function getAllPhaseSlugs(techSlug: string): string[] {
  const phasesDir = path.join(getTechDir(techSlug), 'phases')
  if (!fs.existsSync(phasesDir)) return []
  return fs
    .readdirSync(phasesDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort()
}

export function getPhaseMeta(techSlug: string, phaseSlug: string): PhaseMeta | null {
  const metaPath = path.join(getPhaseDir(techSlug, phaseSlug), '_meta.json')
  if (!fs.existsSync(metaPath)) return null
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf8')) as PhaseMeta
  } catch {
    return null
  }
}

export function getLessonMeta(techSlug: string, phaseSlug: string): LessonMeta[] {
  const dir = getPhaseDir(techSlug, phaseSlug)
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

export function getAllPhases(techSlug: string): Phase[] {
  return getAllPhaseSlugs(techSlug)
    .map((slug) => {
      const meta = getPhaseMeta(techSlug, slug)
      if (!meta) return null
      const lessons = getLessonMeta(techSlug, slug)
      return { ...meta, lessons }
    })
    .filter((p): p is Phase => p !== null)
}

export function getPhase(techSlug: string, phaseSlug: string): Phase | null {
  const meta = getPhaseMeta(techSlug, phaseSlug)
  if (!meta) return null
  const lessons = getLessonMeta(techSlug, phaseSlug)
  return { ...meta, lessons }
}

export function getLesson(techSlug: string, phaseSlug: string, lessonSlug: string): Lesson | null {
  const dir = getPhaseDir(techSlug, phaseSlug)
  if (!fs.existsSync(dir)) return null
  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.mdx') && !f.startsWith('_'))

  const techMeta = getTechMeta(techSlug)
  for (const file of files) {
    const content = fs.readFileSync(path.join(dir, file), 'utf8')
    const { data } = matter(content)
    if ((data as LessonMeta).slug === lessonSlug) {
      const phaseMeta = getPhaseMeta(techSlug, phaseSlug)
      return {
        ...(data as LessonMeta),
        techSlug,
        techTitle: techMeta?.title ?? '',
        phaseSlug,
        phaseNumber: phaseMeta?.number ?? 0,
        phaseTitle: phaseMeta?.title ?? '',
      }
    }
  }
  return null
}

export function getAdjacentLessons(
  techSlug: string,
  phaseSlug: string,
  lessonSlug: string
): { prev: LessonMeta | null; next: LessonMeta | null } {
  const lessons = getLessonMeta(techSlug, phaseSlug)
  const idx = lessons.findIndex((l) => l.slug === lessonSlug)
  return {
    prev: idx > 0 ? (lessons[idx - 1] ?? null) : null,
    next: idx < lessons.length - 1 ? (lessons[idx + 1] ?? null) : null,
  }
}

export function getLessonRawMdx(techSlug: string, phaseSlug: string, lessonSlug: string): string | null {
  const dir = getPhaseDir(techSlug, phaseSlug)
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

export function extractQuestStepIds(rawMdx: string): string[] {
  const ids: string[] = []
  const re = /<QuestStep[^>]+\bid=["']([^"']+)["']/g
  let m: RegExpExecArray | null
  while ((m = re.exec(rawMdx)) !== null) {
    if (m[1]) ids.push(m[1])
  }
  return ids
}

// ─── Challenge extraction ─────────────────────────────────────────────────────

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
  techSlug: string,
  techTitle: string,
  phaseSlug: string,
  lessonSlug: string,
  lessonTitle: string,
  phaseTitle: string,
  phaseNumber: number,
  defaultLanguage: string,
): ExtractedChallenge | null {
  const rawId = getStringProp(block, 'id')
  if (!rawId) return null
  // Composite ID: techSlug/phaseSlug/lessonSlug/rawId → maps directly to URL path segments
  const id = `${techSlug}/${phaseSlug}/${lessonSlug}/${rawId}`
  const type: 'challenge' | 'quiz' = block.startsWith('<Quiz') ? 'quiz' : 'challenge'
  const difficultyRaw = getStringProp(block, 'difficulty') as Difficulty | undefined
  return {
    id,
    type,
    title: getStringProp(block, 'title'),
    prompt: getStringProp(block, 'description', 'prompt', 'question'),
    code: getTemplateProp(block, 'code'),
    language: getStringProp(block, 'language') ?? defaultLanguage,
    options: getArrayProp(block, 'options'),
    correctAnswer: getNumberProp(block, 'correctAnswer') ?? 0,
    explanation: getStringProp(block, 'explanation') ?? getTemplateProp(block, 'explanation') ?? '',
    difficulty: difficultyRaw ?? lessonDifficulty,
    techSlug,
    techTitle,
    phaseSlug,
    lessonSlug,
    lessonTitle,
    phaseTitle,
    phaseNumber,
  }
}

export function getAllChallenges(): ExtractedChallenge[] {
  const challenges: ExtractedChallenge[] = []
  for (const techSlug of getAllTechSlugs()) {
    const techMeta = getTechMeta(techSlug)
    if (!techMeta) continue
    for (const phaseSlug of getAllPhaseSlugs(techSlug)) {
      const phaseMeta = getPhaseMeta(techSlug, phaseSlug)
      if (!phaseMeta) continue
      const lessons = getLessonMeta(techSlug, phaseSlug)
      for (const lesson of lessons) {
        if (lesson.status !== 'published') continue
        const rawMdx = getLessonRawMdx(techSlug, phaseSlug, lesson.slug)
        if (!rawMdx) continue
        for (const block of findChallengeBlocks(rawMdx)) {
          const c = blockToChallenge(block, lesson.difficulty, techSlug, techMeta.title, phaseSlug, lesson.slug, lesson.title, phaseMeta.title, phaseMeta.number, techMeta.defaultLanguage)
          if (c) challenges.push(c)
        }
      }
    }
  }
  return challenges
}

export function getChallengeById(challengeId: string): ExtractedChallenge | null {
  // Challenge IDs encode location: "techSlug/phaseSlug/lessonSlug/challengeSlug"
  const parts = challengeId.split('/')
  if (parts.length < 4) return null
  const techSlug = parts[0]!
  const phaseSlug = parts[1]!
  const lessonSlug = parts[2]!
  const techMeta = getTechMeta(techSlug)
  const phaseMeta = getPhaseMeta(techSlug, phaseSlug)
  if (!phaseMeta || !techMeta) return null
  const lesson = getLesson(techSlug, phaseSlug, lessonSlug)
  if (!lesson) return null
  const rawMdx = getLessonRawMdx(techSlug, phaseSlug, lessonSlug)
  if (!rawMdx) return null
  for (const block of findChallengeBlocks(rawMdx)) {
    const c = blockToChallenge(block, lesson.difficulty, techSlug, techMeta.title, phaseSlug, lessonSlug, lesson.title, phaseMeta.title, phaseMeta.number, techMeta.defaultLanguage)
    if (c?.id === challengeId) return c
  }
  return null
}

// ─── Cheatsheet & Glossary ────────────────────────────────────────────────────

export interface CheatsheetSection {
  id: string
  title: string
  content: { label: string; value: string }[]
}

export interface GlossaryTerm {
  term: string
  definition: string
}

export function getCheatsheet(techSlug: string): CheatsheetSection[] {
  const filePath = path.join(getTechDir(techSlug), 'cheatsheet.json')
  if (!fs.existsSync(filePath)) return []
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as { sections: CheatsheetSection[] }
    return data.sections ?? []
  } catch {
    return []
  }
}

export function getGlossary(techSlug: string): GlossaryTerm[] {
  const filePath = path.join(getTechDir(techSlug), 'glossary.json')
  if (!fs.existsSync(filePath)) return []
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as { terms: GlossaryTerm[] }
    return data.terms ?? []
  } catch {
    return []
  }
}

export function buildSearchIndex(): SearchEntry[] {
  const entries: SearchEntry[] = []

  for (const techSlug of getAllTechSlugs()) {
    const techMeta = getTechMeta(techSlug)
    if (!techMeta) continue

    for (const phaseSlug of getAllPhaseSlugs(techSlug)) {
      const phaseMeta = getPhaseMeta(techSlug, phaseSlug)
      if (!phaseMeta) continue

      const lessons = getLessonMeta(techSlug, phaseSlug)
      for (const lesson of lessons) {
        if (lesson.status !== 'published') continue
        entries.push({
          id: `${techSlug}/${phaseSlug}/${lesson.slug}`,
          title: lesson.title,
          summary: lesson.summary,
          techSlug,
          techTitle: techMeta.title,
          phaseSlug,
          phaseTitle: phaseMeta.title,
          lessonSlug: lesson.slug,
          difficulty: lesson.difficulty,
          tags: lesson.tags,
          url: `/${techSlug}/phases/${phaseSlug}/${lesson.slug}`,
        })
      }
    }
  }

  return entries
}
