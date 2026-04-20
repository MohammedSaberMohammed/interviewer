# Implementation Plan: Interviewer-App MVP

> Status: Approved
> Created: 2026-04-20
> Constitution: v1.0.0
> Spec: interviewer-app/spec.md

---

## 1. Architecture Overview

```
interviewer-app/
├── app/                           # Next.js 15 App Router (SSG)
│   ├── layout.tsx                 # Root layout: theme provider, nav, footer
│   ├── page.tsx                   # Landing page (hero, roadmap, phase grid)
│   ├── phases/
│   │   ├── page.tsx               # Phases index (all 13 phases grid)
│   │   └── [phaseSlug]/
│   │       ├── page.tsx           # Phase overview (lesson list, progress)
│   │       └── [lessonSlug]/
│   │           └── page.tsx       # Lesson page (MDX render, sidebar, TOC)
│   ├── challenges/page.tsx        # All challenges aggregated
│   ├── cheatsheet/page.tsx        # Quick reference
│   ├── glossary/page.tsx          # A-Z terms
│   ├── progress/page.tsx          # Progress dashboard
│   ├── interview/page.tsx         # Interview mode
│   └── not-found.tsx              # 404 page
├── components/
│   ├── ui/                        # shadcn/ui primitives (Button, Card, Badge, etc.)
│   ├── lesson/                    # MDX-embeddable interactive components
│   │   ├── Callout.tsx
│   │   ├── CodeChallenge.tsx
│   │   ├── Quiz.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── MythBuster.tsx
│   │   ├── DocsLink.tsx
│   │   ├── CodePlayground.tsx     # Shiki-based (read-only)
│   │   ├── Diagram.tsx            # Mermaid wrapper
│   │   ├── MemoryVisualizer.tsx   # SVG stack/heap visualization
│   │   ├── DifficultyBadge.tsx
│   │   └── index.ts               # Barrel export for MDX imports
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── Sidebar.tsx            # Phase lesson list (left)
│   │   ├── TableOfContents.tsx    # Lesson TOC (right)
│   │   ├── NavPrevNext.tsx
│   │   ├── MobileDrawer.tsx
│   │   └── ThemeToggle.tsx
│   ├── progress/
│   │   ├── PhaseProgressBar.tsx
│   │   ├── StreakCounter.tsx
│   │   └── WeakAreas.tsx
│   ├── home/
│   │   ├── Hero.tsx
│   │   ├── Roadmap.tsx
│   │   ├── FeatureGrid.tsx
│   │   └── PhaseCard.tsx
│   └── search/
│       └── SearchPalette.tsx      # Cmd+K fuzzy search
├── content/
│   └── phases/
│       ├── 01-csharp-core/
│       │   ├── _meta.json         # Phase metadata
│       │   ├── 01-clr-cts-cls.mdx
│       │   ├── 02-value-vs-reference-types.mdx
│       │   └── ... (15 lessons)
│       ├── 02-oop/
│       │   ├── _meta.json
│       │   └── ... (placeholder lessons)
│       └── ... (03-13, scaffolded)
├── lib/
│   ├── content.ts                 # Content loading: parse phases, lessons, frontmatter
│   ├── search.ts                  # Fuse.js index builder
│   ├── progress.ts                # Progress utility functions
│   ├── mdx.ts                     # MDX compilation config (Shiki, components)
│   └── constants.ts               # Phase metadata, colors, emojis
├── stores/
│   └── progressStore.ts           # Zustand + persist middleware
├── types/
│   └── index.ts                   # Shared TypeScript interfaces
├── styles/
│   └── globals.css                # Tailwind directives, custom properties
├── public/
│   └── fonts/                     # Inter, JetBrains Mono (self-hosted)
├── .eslintrc.json
├── .prettierrc
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── CONTENT_GUIDE.md
└── prd.md
```

---

## 2. Data Models

### 2.1 Phase Metadata (`_meta.json`)
```typescript
interface PhaseMeta {
  slug: string
  number: number
  title: string
  subtitle: string
  level: 'junior' | 'mid' | 'senior'
  estimatedHours: number
  emoji: string
  color: string              // Tailwind color key
  description: string
  prerequisites: string[]    // phase slugs
  learningOutcomes: string[]
}
```

### 2.2 Lesson Frontmatter
```typescript
interface LessonMeta {
  title: string
  slug: string
  order: number
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  readingTime: number
  status: 'draft' | 'published'
  tags: string[]
  summary: string
  docsLinks: { label: string; url: string }[]
}
```

### 2.3 Zustand Progress Store
```typescript
interface ChallengeAnswer {
  challengeId: string
  correct: boolean
  answeredAt: number
  attempts: number
  selectedOption: number
}

interface ProgressState {
  completedLessons: string[]
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: string[]
  currentPhase: string | null
  currentLesson: string | null
  lastActiveAt: number
  streakDays: number

  markLessonComplete: (lessonId: string) => void
  unmarkLessonComplete: (lessonId: string) => void
  recordChallengeAnswer: (challengeId: string, selectedOption: number, correct: boolean) => void
  toggleBookmark: (lessonId: string) => void
  setCurrentLesson: (phaseSlug: string, lessonSlug: string) => void
  updateStreak: () => void
  reset: () => void
  getPhaseProgress: (phaseSlug: string, totalLessons: number) => number
  getTotalProgress: (totalLessons: number) => number
  getWeakAreas: () => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: () => ChallengeAnswer[]
}
```

---

## 3. Key Technical Decisions

### 3.1 MDX Pipeline
- Use `@next/mdx` with `next.config.mjs` MDX support
- Shiki for syntax highlighting via `@shikijs/rehype`
- Frontmatter parsed via `gray-matter`
- Custom components passed via `mdx-components.tsx`
- Content loaded at build time via `fs` + `glob` in `generateStaticParams`

### 3.2 Routing
- `/phases` — static page, reads all `_meta.json` files
- `/phases/[phaseSlug]` — `generateStaticParams` from phase directories
- `/phases/[phaseSlug]/[lessonSlug]` — `generateStaticParams` from MDX files per phase
- All other pages are static (no params)

### 3.3 Styling Strategy
- Tailwind CSS v4 with CSS custom properties for theme colors
- `.NET purple` (#512BD4) as primary accent
- Slate scale for neutrals
- shadcn/ui components customized to match design system
- Dark mode via `next-themes` + Tailwind `dark:` variant

### 3.4 Search Implementation
- Build-time: script generates `search-index.json` from all lesson frontmatter
- Runtime: Fuse.js loads index, searches on keystroke
- SearchPalette component triggered by Cmd+K / Ctrl+K

### 3.5 Memory Visualizer
- SVG-based component using inline SVG elements
- Props: `stack[]`, `heap[]`, `references[]`
- Draws labeled boxes for stack frames, rounded boxes for heap objects
- Arrows (SVG `<line>` or `<path>`) for references
- Color-coded: stack = blue tones, heap = purple tones
- Responsive: scales within container

---

## 4. Implementation Phases

### Phase A: Project Foundation (Setup & Config)
- Scaffold Next.js 15 project with pnpm
- Configure TypeScript strict mode
- Set up Tailwind CSS v4 + shadcn/ui
- Configure ESLint + Prettier
- Set up MDX pipeline (next/mdx, Shiki, gray-matter)
- Install all dependencies
- Create project structure (directories, barrel exports)
- Set up fonts (Inter, JetBrains Mono)
- Create global styles + CSS custom properties
- Configure next-themes

### Phase B: Core Layout & Navigation
- Root layout with theme provider
- Navbar (logo, nav links, theme toggle, progress indicator)
- Footer
- Sidebar component (phase lesson list)
- TableOfContents component (heading observer)
- NavPrevNext component
- MobileDrawer component
- 3-column lesson layout (responsive)
- 404 page

### Phase C: Interactive Lesson Components
- Callout (6 variants: info, tip, warning, critical, trap, senior)
- CodeChallenge (code display, options, feedback, tracking)
- Quiz (conceptual MCQ, same UX as CodeChallenge minus code)
- ComparisonTable (two-column contrast)
- MythBuster (myth vs truth)
- DocsLink (styled external link)
- CodePlayground (Shiki read-only with copy button)
- Diagram (Mermaid wrapper)
- MemoryVisualizer (SVG stack/heap)
- DifficultyBadge (pill with color by level)

### Phase D: State Management & Progress
- Zustand store with persist middleware
- Lesson completion tracking
- Challenge answer recording
- Bookmark toggle
- Phase progress computation
- Total progress computation
- Streak tracking
- Weak areas identification
- Review queue

### Phase E: Content Infrastructure
- `lib/content.ts` — load phases, lessons, parse frontmatter
- `_meta.json` for all 13 phases
- `generateStaticParams` for phase and lesson routes
- Lesson page template (MDX render + layout)
- Phase overview page template
- Phases index page
- Content type definitions

### Phase F: Phase 1 Content (15 Lessons)
- AI-generate all 15 C# Language Core lessons
- Each with ≥ 2 interactive components (CodeChallenge, Quiz, ComparisonTable, etc.)
- Each with ≥ 1 Microsoft Docs link
- Follow lesson structure template
- Test MDX compilation for each

### Phase G: Scaffold Phases 2-13
- `_meta.json` per phase (metadata, outcomes, prerequisites)
- Placeholder MDX per lesson (Coming Soon callout)
- Phase overview pages render correctly

### Phase H: Supplementary Pages
- Landing page (Hero, Roadmap, FeatureGrid, PhaseGrid)
- Cheatsheet page (collapsible sections)
- Glossary page (A-Z with back-links)
- Challenges page (aggregated, filterable)
- Progress Dashboard (completion, streaks, weak areas)

### Phase I: Search & Interview Mode
- Fuse.js search index generation
- SearchPalette (Cmd+K) component
- Interview Mode page (random challenges, timer, scoring)

### Phase J: Polish & Quality
- Responsive audit (all breakpoints)
- Accessibility audit (keyboard nav, ARIA, contrast)
- Dark mode audit (all components)
- Animation polish (respecting reduced-motion)
- SEO basics (meta tags, sitemap — for future deployment)
- CONTENT_GUIDE.md

---

## 5. Dependency Graph

```
Phase A (Foundation)
  └─► Phase B (Layout)
  └─► Phase C (Components) — can parallel with B
  └─► Phase D (State) — can parallel with B, C
       └─► Phase E (Content Infra) — needs B, C, D
            └─► Phase F (Phase 1 Content) — needs E
            └─► Phase G (Scaffold 2-13) — needs E, can parallel with F
            └─► Phase H (Supplementary Pages) — needs E, can parallel with F
                 └─► Phase I (Search & Interview) — needs F, H
                      └─► Phase J (Polish) — needs all above
```

---

## 6. Risk Mitigations

| Risk | Mitigation |
|---|---|
| MDX compilation errors | Validate each lesson with `pnpm build` as written |
| Shiki bundle size | Use `@shikijs/rehype` with minimal language set (csharp only) |
| MemoryVisualizer complexity | Start with simple box+arrow SVG, iterate |
| 15 AI-generated lessons quality | Human review pass after generation |
| Zustand hydration mismatch | Use `skipHydration` pattern, mount-only rendering |
| Mermaid SSR issues | Lazy-load Mermaid client-side only |
