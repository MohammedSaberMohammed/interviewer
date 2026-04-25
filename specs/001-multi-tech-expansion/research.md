# Research: Multi-Technology Expansion

**Date**: 2026-04-25
**Feature**: Multi-Technology Expansion
**Branch**: `001-multi-tech-expansion`

---

## Research Task 1: Content Directory Restructuring

### Decision: Nest phases under technology directories

**Current structure:**
```
frontend/content/phases/
├── 01-csharp-core/
│   ├── _meta.json
│   └── *.mdx
├── 02-oop/
...
└── 13-traps/
```

**New structure:**
```
frontend/content/technologies/
├── dotnet/
│   ├── _tech.json          # Technology metadata
│   └── phases/
│       ├── 01-csharp-core/
│       │   ├── _meta.json  # Unchanged schema
│       │   └── *.mdx       # Unchanged schema
│       ...
│       └── 13-traps/
└── angular/
    ├── _tech.json
    └── phases/
        ├── 01-typescript-essentials/
        ...
        └── 13-angular-traps/
```

**Rationale**: Clean separation per technology. Each technology is fully self-contained. The `_tech.json` file provides technology-level metadata without modifying the existing `_meta.json` or MDX frontmatter schemas.

**Alternatives considered:**
- Adding a `technology` field to each `_meta.json` → rejected: requires modifying all 13 existing files and mixes concerns.
- Flat structure with prefixed slugs (e.g., `dotnet-01-csharp-core`) → rejected: URL pollution and breaks existing slug references.

**Migration path for existing .NET content:**
1. Create `content/technologies/dotnet/phases/`
2. Move all 13 phase directories from `content/phases/` to `content/technologies/dotnet/phases/`
3. Create `content/technologies/dotnet/_tech.json`
4. Update `CONTENT_DIR` constant from `'content/phases'` to `'content/technologies'`
5. No changes needed to individual `_meta.json` or `.mdx` files

---

## Research Task 2: URL Routing Strategy

### Decision: Add `[techSlug]` dynamic segment to all content routes

**Current routes:**
```
/                                    → Home (landing)
/phases                              → Phases listing
/phases/[phaseSlug]                  → Phase detail
/phases/[phaseSlug]/[lessonSlug]     → Lesson
/challenges                          → Challenges explorer
/challenges/[...path]                → Challenge detail
/progress                            → Progress dashboard
/interview-templates                 → Templates listing
/interview-templates/[templateId]    → Template detail
/cheatsheet                          → Cheatsheet
/glossary                            → Glossary
/about                               → About
```

**New routes:**
```
/                                                → Branding landing page (new)
/technologies                                   → Technology selection (new)
/[techSlug]/phases                               → Phases listing (scoped)
/[techSlug]/phases/[phaseSlug]                   → Phase detail (scoped)
/[techSlug]/phases/[phaseSlug]/[lessonSlug]      → Lesson (scoped)
/[techSlug]/challenges                           → Challenges explorer (scoped)
/[techSlug]/challenges/[...path]                 → Challenge detail (scoped)
/[techSlug]/progress                             → Progress dashboard (scoped)
/[techSlug]/interview-templates                  → Templates listing (scoped)
/[techSlug]/interview-templates/[templateId]     → Template detail (scoped)
/[techSlug]/cheatsheet                           → Cheatsheet (scoped)
/[techSlug]/glossary                             → Glossary (scoped)
/about                                           → About (global)
```

**Implementation:**
- Create `app/[techSlug]/` directory and move all existing route directories into it.
- All page components receive `params.techSlug` and pass it to content loading functions.
- `generateStaticParams()` iterates over all technologies.
- Old `/phases/...` URLs redirect to `/dotnet/phases/...` for backward compatibility.

**Rationale**: URL-based technology context is SSG-compatible, bookmarkable, shareable, and doesn't require client-side state to determine which technology is active.

**Alternatives considered:**
- Query parameter (`/phases?tech=angular`) → rejected: not SEO-friendly, not bookmarkable for SSG.
- Subdomain (`angular.interviewer.app`) → rejected: complex hosting, overkill for static site.
- Cookie/localStorage-based tech selection → rejected: breaks SSG, not shareable.

---

## Research Task 3: Progress Store Migration

### Decision: Restructure store with per-technology state, migrate v1 data to v2

**Current store key:** `interviewer-app-progress-v1`

**Current shape (v1):**
```typescript
{
  completedLessons: string[]           // "phaseSlug/lessonSlug"
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: string[]
  xpTotal: number
  xpToday: number
  xpByLesson: Record<string, number>
  streakDays: number
  streakFreezeCount: number
  lastActiveDate: string | null
  level: XPLevel
  dailyGoal: number
  lessonsCompletedToday: number
  lastDailyReset: string | null
  unlockedBadges: string[]
  preferences: UserPreferences
  currentPhase: string | null
  currentLesson: string | null
  lastActiveAt: number
}
```

**New shape (v2):**
```typescript
{
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
  technologies: Record<string, {
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
  }>
}
```

**Migration logic (v1 → v2):**
1. Detect v1 data by absence of `technologies` key.
2. Create `technologies.dotnet` and move all per-technology fields into it.
3. Keep global fields (streak, preferences, daily counters) at root.
4. Update storage key to `interviewer-app-progress-v2` to avoid conflicts.

**Rationale**: Zustand's `persist` middleware supports version-based migration. Move all existing data under `technologies.dotnet` key. Global streak data stays at root level (per clarification: streaks shared globally, XP/level per tech).

---

## Research Task 4: Angular Curriculum Structure

### Decision: 13 phases mirroring .NET depth and progression

| # | Slug | Title | Level | Est. Lessons | Est. Hours |
|---|------|-------|-------|-------------|------------|
| 01 | `01-typescript-essentials` | TypeScript Essentials | Junior | 15 | 8 |
| 02 | `02-angular-fundamentals` | Angular Fundamentals | Junior | 14 | 8 |
| 03 | `03-dependency-injection` | Dependency Injection | Mid | 12 | 6 |
| 04 | `04-component-architecture` | Component Architecture | Mid | 14 | 8 |
| 05 | `05-routing-navigation` | Routing & Navigation | Mid | 12 | 6 |
| 06 | `06-rxjs-reactive` | RxJS & Reactive Patterns | Mid | 16 | 10 |
| 07 | `07-forms-validation` | Forms & Validation | Mid | 12 | 6 |
| 08 | `08-state-management` | State Management | Senior | 14 | 8 |
| 09 | `09-performance-optimization` | Performance & Optimization | Senior | 14 | 8 |
| 10 | `10-testing-strategies` | Testing Strategies | Senior | 14 | 8 |
| 11 | `11-security-patterns` | Security Patterns | Senior | 12 | 6 |
| 12 | `12-advanced-angular` | Advanced Angular | Senior | 16 | 10 |
| 13 | `13-angular-traps` | Angular Interview Traps | Senior | 15 | 8 |

**Total: ~170 lessons, ~100 hours**

**Rationale**: Matches the .NET curriculum's 13-phase structure. Covers Angular 17+ with Signals, standalone components, and modern patterns. Progresses Junior → Mid → Senior. Each phase has prerequisites reflecting the learning path.

**Phase prerequisites:**
- 01: None
- 02: [01]
- 03: [02]
- 04: [02, 03]
- 05: [02]
- 06: [01]
- 07: [02, 06]
- 08: [06, 04]
- 09: [04, 06]
- 10: [04, 06, 07]
- 11: [05, 03]
- 12: [04, 06, 08]
- 13: [all senior phases]

---

## Research Task 5: Constitution Compliance

### Identified Conflicts:

| Constitution Reference | Current Text | Issue | Required Amendment |
|----------------------|--------------|-------|-------------------|
| Principle 1 | "how .NET actually works (CLR, GC, type system)" | .NET-specific | Generalize to "how the technology actually works" |
| Section 3: Content Targeting | ".NET 8 LTS" | .NET-specific | Change to per-technology targeting |
| Gate 5: Content Quality | "≥ 1 Microsoft Docs link" | .NET-specific | Generalize to "≥ 1 official documentation link" |
| Gate 5: Content Quality | "All C# code examples are verified correct" | .NET-specific | Generalize to "All code examples are verified correct for their target language" |
| AD-2: MDX Content Pipeline | "organized under content/phases/{phaseSlug}/" | Hardcoded path | Update to "content/technologies/{techSlug}/phases/{phaseSlug}/" |

### Recommendation:
These are minor wording amendments (PATCH version bump) that generalize .NET-specific text to be multi-technology-aware. No core principles are violated — the principles themselves (Foundation-First Learning, Interactive-First, Progressive Complexity) apply universally to all technologies. The amendment should be proposed to the project owner before implementation begins.

---

## Research Task 6: Search Index Updates

### Decision: Add technology context to search entries

**Current `SearchEntry`:**
```typescript
{
  id: string           // "phaseSlug/lessonSlug"
  title: string
  summary: string
  phaseSlug: string
  phaseTitle: string
  lessonSlug: string
  difficulty: Difficulty
  tags: string[]
  url: string          // "/phases/phaseSlug/lessonSlug"
}
```

**Updated `SearchEntry`:**
```typescript
{
  id: string           // "techSlug/phaseSlug/lessonSlug"
  title: string
  summary: string
  techSlug: string     // NEW
  techTitle: string    // NEW
  phaseSlug: string
  phaseTitle: string
  lessonSlug: string
  difficulty: Difficulty
  tags: string[]
  url: string          // "/techSlug/phases/phaseSlug/lessonSlug"
}
```

**Fuse.js search keys** should include `techTitle` for technology-scoped filtering.

**Rationale**: Technology context in search entries enables the SearchProvider to filter results by active technology. Cross-technology search can be offered by removing the filter.
