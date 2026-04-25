# Data Model: Multi-Technology Expansion

**Date**: 2026-04-25
**Feature**: Multi-Technology Expansion

---

## New Entity: Technology

**Source file:** `_tech.json` at each technology's content root

```typescript
interface TechnologyMeta {
  slug: string              // URL-safe identifier, e.g., "dotnet", "angular"
  title: string             // Display name, e.g., ".NET", "Angular"
  subtitle: string          // Short tagline, e.g., "C# & .NET Senior Interview Prep"
  description: string       // Paragraph description for selection page
  icon: string              // Lucide icon name or emoji
  color: string             // Tailwind color name for theming (e.g., "violet", "red")
  status: 'active' | 'coming-soon'  // Controls visibility/clickability
  order: number             // Display order on technology selection page
  defaultLanguage: string   // Default Shiki language for code blocks (e.g., "csharp", "typescript")
  docsBaseUrl: string       // Base URL for official docs (e.g., "https://learn.microsoft.com", "https://angular.dev")
  keywords: string[]        // SEO keywords for this technology
  estimatedTotalHours: number  // Aggregate across all phases (computed at build time, or hardcoded)
}
```

**Example — .NET:**
```json
{
  "slug": "dotnet",
  "title": ".NET",
  "subtitle": "C# & .NET Senior Interview Prep",
  "description": "Master C# internals, async/await, EF Core, ASP.NET Core, and system design. 13 phases covering everything from CLR fundamentals to distributed architecture.",
  "icon": "Cpu",
  "color": "violet",
  "status": "active",
  "order": 1,
  "defaultLanguage": "csharp",
  "docsBaseUrl": "https://learn.microsoft.com/en-us/dotnet",
  "keywords": [".NET", "C#", "ASP.NET Core", "Entity Framework", "dotnet"],
  "estimatedTotalHours": 131
}
```

**Example — Angular:**
```json
{
  "slug": "angular",
  "title": "Angular",
  "subtitle": "Angular & TypeScript Interview Prep",
  "description": "Deep dive into Angular architecture, RxJS, state management, performance, and testing. 13 phases from TypeScript fundamentals to advanced patterns.",
  "icon": "Triangle",
  "color": "red",
  "status": "active",
  "order": 2,
  "defaultLanguage": "typescript",
  "docsBaseUrl": "https://angular.dev",
  "keywords": ["Angular", "TypeScript", "RxJS", "NgRx", "frontend"],
  "estimatedTotalHours": 100
}
```

---

## Updated Entity: Phase (PhaseMeta)

**No schema changes.** The existing `_meta.json` schema is fully reusable:

```typescript
interface PhaseMeta {
  slug: string
  number: number
  title: string
  subtitle: string
  level: PhaseLevel        // 'junior' | 'mid' | 'senior'
  estimatedHours: number
  emoji: string
  color: string
  description: string
  prerequisites: string[]  // Phase slugs within the SAME technology
  learningOutcomes: string[]
}
```

**Note:** Prerequisites reference phase slugs within the same technology only. Cross-technology prerequisites are not supported.

---

## Updated Entity: Lesson (LessonMeta)

**No schema changes.** The existing MDX frontmatter schema is fully reusable:

```typescript
interface LessonMeta {
  title: string
  slug: string
  order: number
  difficulty: Difficulty
  readingTime: number
  status: 'draft' | 'published'
  tags: string[]
  summary: string
  docsLinks: DocsLinkItem[]
  questMode?: boolean
}
```

---

## Updated Entity: ExtractedChallenge

**Add `techSlug` and `techTitle` fields:**

```typescript
interface ExtractedChallenge {
  id: string                // "challengeId" (component-level)
  type: 'challenge' | 'quiz'
  title?: string
  prompt?: string
  code?: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: Difficulty
  techSlug: string          // NEW — technology slug
  techTitle: string         // NEW — technology display name
  phaseSlug: string
  lessonSlug: string
  lessonTitle: string
  phaseTitle: string
  phaseNumber: number
}
```

---

## Updated Entity: SearchEntry

**Add technology context:**

```typescript
interface SearchEntry {
  id: string                // "techSlug/phaseSlug/lessonSlug"
  title: string
  summary: string
  techSlug: string          // NEW
  techTitle: string         // NEW
  phaseSlug: string
  phaseTitle: string
  lessonSlug: string
  difficulty: Difficulty
  tags: string[]
  url: string               // "/techSlug/phases/phaseSlug/lessonSlug"
}
```

---

## Updated Entity: ProgressState (v2)

**Restructured with per-technology scoping and global streaks:**

```typescript
// Per-technology progress
interface TechnologyProgress {
  completedLessons: string[]
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: string[]
  xpTotal: number
  xpToday: number
  xpByLesson: Record<string, number>
  level: XPLevel
  unlockedBadges: string[]
  currentPhase: string | null
  currentLesson: string | null
}

// Full store state
interface ProgressState {
  // Global (shared across technologies)
  streakDays: number
  streakFreezeCount: number
  lastActiveDate: string | null
  dailyGoal: number
  lessonsCompletedToday: number
  lastDailyReset: string | null
  preferences: UserPreferences
  lastActiveAt: number

  // Per-technology
  technologies: Record<string, TechnologyProgress>

  // Actions — all now require techSlug parameter
  markLessonComplete: (techSlug: string, lessonId: string) => void
  unmarkLessonComplete: (techSlug: string, lessonId: string) => void
  recordChallengeAnswer: (techSlug: string, challengeId: string, selectedOption: number, correct: boolean) => void
  toggleBookmark: (techSlug: string, lessonId: string) => void
  setCurrentLesson: (techSlug: string, phaseSlug: string, lessonSlug: string) => void
  awardXP: (techSlug: string, amount: number, reason: string) => void
  recordLessonComplete: (techSlug: string, phaseSlug: string, lessonSlug: string, accuracy: number) => void
  unlockBadge: (techSlug: string, badgeId: string) => void

  // Global actions (unchanged signature)
  checkStreak: () => void
  useStreakFreeze: () => void
  resetDailyCounters: () => void
  reset: () => void

  // Selectors — now require techSlug
  getPhaseProgress: (techSlug: string, phaseSlug: string, totalLessons: number) => number
  getTotalProgress: (techSlug: string, totalLessons: number) => number
  getWeakAreas: (techSlug: string) => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: (techSlug: string) => ChallengeAnswer[]
  getXPToNextLevel: (techSlug: string) => number
  getLevelProgress: (techSlug: string) => number
}
```

**Storage key:** `interviewer-app-progress-v2`

**Migration (v1 → v2):**
```
1. Read v1 data from localStorage
2. Create v2 structure with technologies.dotnet = {v1 per-tech fields}
3. Move global fields (streak, preferences) to v2 root
4. Write v2 data, remove v1 key
```

---

## Updated Entity: BasketState

**Add technology context to baskets:**

```typescript
interface Basket {
  id: string
  name: string
  createdAt: number
  questionIds: string[]
  techSlug: string          // NEW — technology this basket belongs to
}

interface BasketQuestion {
  // Existing fields unchanged
  id: string
  type: 'challenge' | 'quiz' | 'lesson'
  title: string
  // ...all existing fields...
  techSlug: string          // NEW
}
```

**Storage key:** `interviewer-app-baskets-v2`

---

## Entity Relationship Diagram

```
Technology (1) ──── (N) Phase (1) ──── (N) Lesson
     │                                       │
     │                                       │
     └── TechnologyProgress (1:1)    ExtractedChallenge (N)
              │                              │
              ├── completedLessons      SearchEntry (1:1 with Lesson)
              ├── XP/Level/Badges
              └── challengeAnswers

Global State (singleton)
  ├── streakDays
  ├── preferences
  └── dailyCounters
```
