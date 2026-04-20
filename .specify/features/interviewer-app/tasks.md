# Tasks: Interviewer-App MVP

> Status: Pending
> Created: 2026-04-20
> Plan: interviewer-app/plan.md
> Spec: interviewer-app/spec.md
> Constitution: v1.0.0

---

## Phase 1: Project Foundation

- [ ] T001 [P] [US-ALL] Scaffold Next.js 15 project with pnpm, TypeScript strict mode, App Router
- [ ] T002 [P] [US-ALL] Configure Tailwind CSS v4 with custom theme (dotnet-purple #512BD4, slate neutrals, semantic colors)
- [ ] T003 [P] [US-ALL] Install and configure shadcn/ui (Button, Card, Badge, Dialog, Tabs, Accordion, ScrollArea, Tooltip, DropdownMenu, Sheet)
- [ ] T004 [P] [US-ALL] Configure ESLint + Prettier with strict rules, zero-warning policy
- [ ] T005 [US-ALL] Set up MDX pipeline: @next/mdx, @shikijs/rehype (csharp language), gray-matter, mdx-components.tsx
- [ ] T006 [P] [US-ALL] Self-host fonts: Inter (variable, 400/500/600/700) and JetBrains Mono (variable, 400/500/700)
- [ ] T007 [US-ALL] Create global styles (globals.css): Tailwind directives, CSS custom properties for theme, typography scale, spacing
- [ ] T008 [US-ALL] Create project directory structure: app/, components/, content/, lib/, stores/, types/, styles/
- [ ] T009 [US-ALL] Create shared TypeScript interfaces in types/index.ts: PhaseMeta, LessonMeta, ChallengeAnswer, ProgressState, Difficulty
- [ ] T010 [US-ALL] Configure next-themes for light/dark/system theme switching
- [ ] T011 [US-ALL] Install remaining dependencies: zustand, lucide-react, mermaid, fuse.js, clsx, tailwind-merge

## Phase 2: Core Layout & Navigation

- [ ] T012 [US5,US6] Build root layout (app/layout.tsx): ThemeProvider, Navbar, Footer, font loading, metadata
- [ ] T013 [US5] Build Navbar component: logo, nav links (Phases, Challenges, Cheatsheet, Glossary), ThemeToggle, progress indicator pill
- [ ] T014 [US5] Build Footer component: links, copyright, built-with
- [ ] T015 [US5] Build Sidebar component: phase lesson list with completion indicators, current lesson highlight, collapsible
- [ ] T016 [US5] Build TableOfContents component: auto-generated from h2/h3/h4, IntersectionObserver for active highlight, sticky
- [ ] T017 [US5] Build NavPrevNext component: previous/next lesson buttons with titles
- [ ] T018 [US9] Build MobileDrawer component: hamburger menu, full drawer with nav + phase list (Sheet-based)
- [ ] T019 [US5,US9] Build 3-column lesson layout: left sidebar (240px) | content (720px max) | right sidebar (240px), responsive collapse
- [ ] T020 [US-ALL] Build 404 page (not-found.tsx): friendly message, search link, back to phases
- [ ] T021 [US6] Build ThemeToggle component: light/dark/system cycle, icon animation, persisted via next-themes

## Phase 3: Interactive Lesson Components

- [ ] T022 [P] [US2] Build Callout component: 6 variants (info, tip, warning, critical, trap, senior) with icons, colors, optional title
- [ ] T023 [P] [US3] Build CodeChallenge component: Shiki code display, selectable option cards, submit button, correct/incorrect feedback with animation, explanation reveal, hint toggle, Zustand tracking
- [ ] T024 [P] [US3] Build Quiz component: conceptual MCQ (same UX as CodeChallenge without code block), Zustand tracking
- [ ] T025 [P] [US2] Build ComparisonTable component: two-column contrast with configurable colors, item labels with optional details
- [ ] T026 [P] [US2] Build MythBuster component: myth (crossed out) vs truth display, optional explanation
- [ ] T027 [P] [US2] Build DocsLink component: styled external link with book icon, opens new tab, Microsoft Docs branding
- [ ] T028 [P] [US2] Build CodePlayground component: Shiki read-only code display with copy button, optional .NET Fiddle deep-link
- [ ] T029 [US2] Build Diagram component: Mermaid.js wrapper, client-side only rendering, dark mode support, optional title
- [ ] T030 [US17] Build MemoryVisualizer component: SVG stack/heap boxes, labeled frames, reference arrows, responsive, color-coded
- [ ] T031 [P] [US2] Build DifficultyBadge component: pill with color per level (foundation=green, intermediate=blue, advanced=purple, expert=red)
- [ ] T032 [US2] Create lesson components barrel export (components/lesson/index.ts)

## Phase 4: State Management & Progress

- [ ] T033 [US4] Build Zustand progress store (stores/progressStore.ts): state shape, persist middleware, localStorage key "interviewer-app-progress-v1"
- [ ] T034 [US4] Implement lesson completion actions: markLessonComplete, unmarkLessonComplete
- [ ] T035 [US3,US4] Implement challenge answer recording: recordChallengeAnswer with attempts, timestamp, correctness
- [ ] T036 [US14] Implement bookmark actions: toggleBookmark
- [ ] T037 [US4] Implement progress computation: getPhaseProgress, getTotalProgress
- [ ] T038 [US16] Implement weak areas identification: getWeakAreas (accuracy per phase below threshold)
- [ ] T039 [US16] Implement review queue: getReviewQueue (incorrect answers sorted by recency)
- [ ] T040 [US19] Implement streak tracking: updateStreak (daily activity check)
- [ ] T041 [US4] Handle Zustand hydration: skipHydration pattern to prevent SSR/client mismatch

## Phase 5: Content Infrastructure

- [ ] T042 [US1,US2] Build content loader (lib/content.ts): getAllPhases, getPhase, getLesson, getLessonsByPhase, parse frontmatter
- [ ] T043 [US1] Create _meta.json for all 13 phases with full metadata (slug, title, subtitle, level, hours, emoji, color, description, prerequisites, outcomes)
- [ ] T044 [US2] Build lesson page (app/phases/[phaseSlug]/[lessonSlug]/page.tsx): generateStaticParams, MDX rendering, sidebar, TOC, prev/next, mark complete button
- [ ] T045 [US8] Build phase overview page (app/phases/[phaseSlug]/page.tsx): generateStaticParams, lesson list with difficulty badges, progress bar, learning outcomes
- [ ] T046 [US1] Build phases index page (app/phases/page.tsx): grid of all 13 phases with PhaseCard, progress indicators
- [ ] T047 [US1] Build PhaseCard component: phase number, emoji, title, subtitle, level badge, progress bar, lesson count
- [ ] T048 [US2] Create lib/constants.ts: phase colors, difficulty colors, callout config, navigation structure

## Phase 6: Phase 1 Content — C# Language Core (15 Lessons)

- [ ] T049 [US7] Write lesson 01: The CLR, CTS, and CLS (foundation) — include Quiz + ComparisonTable + DocsLink
- [ ] T050 [US7] Write lesson 02: Value Types vs Reference Types (foundation) — include CodeChallenge + ComparisonTable + MythBuster + MemoryVisualizer
- [ ] T051 [US7] Write lesson 03: Stack vs Heap — The Real Rules (foundation) — include MythBuster + MemoryVisualizer + CodeChallenge
- [ ] T052 [US7] Write lesson 04: Boxing & Unboxing — The Silent Perf Killer (foundation) — include CodeChallenge + Callout(trap) + Diagram
- [ ] T053 [US7] Write lesson 05: Nullable Types — Value Nullables vs NRT (intermediate) — include ComparisonTable + CodeChallenge + Quiz
- [ ] T054 [US7] Write lesson 06: Parameter Passing: ref, out, in (intermediate) — include CodeChallenge + ComparisonTable + Callout(trap)
- [ ] T055 [US7] Write lesson 07: var, dynamic, object (foundation) — include ComparisonTable + CodeChallenge + MythBuster
- [ ] T056 [US7] Write lesson 08: const vs readonly vs static readonly vs init (intermediate) — include ComparisonTable + CodeChallenge + Quiz
- [ ] T057 [US7] Write lesson 09: Operators & Overloading Gotchas (intermediate) — include CodeChallenge + Callout(trap) + Quiz
- [ ] T058 [US7] Write lesson 10: Strings, Immutability & StringBuilder (foundation) — include CodeChallenge + MythBuster + CodePlayground
- [ ] T059 [US7] Write lesson 11: DateTime vs DateTimeOffset vs DateOnly (intermediate) — include ComparisonTable + CodeChallenge + Callout(warning)
- [ ] T060 [US7] Write lesson 12: decimal vs double — Financial Calculations (foundation) — include CodeChallenge + Callout(critical) + Quiz
- [ ] T061 [US7] Write lesson 13: IComparable vs IComparer (intermediate) — include CodeChallenge + ComparisonTable + CodePlayground
- [ ] T062 [US7] Write lesson 14: Enums & [Flags] (foundation) — include CodeChallenge + Quiz + Callout(tip)
- [ ] T063 [US7] Write lesson 15: Attributes & Reflection Basics (intermediate) — include CodeChallenge + Quiz + Callout(senior)

## Phase 7: Scaffold Phases 2-13

- [ ] T064 [P] [US10] Create placeholder lessons for Phase 2 — OOP in C# (12 lessons)
- [ ] T065 [P] [US10] Create placeholder lessons for Phase 3 — Intermediate C# (14 lessons)
- [ ] T066 [P] [US10] Create placeholder lessons for Phase 4 — Memory, GC & Performance (15 lessons)
- [ ] T067 [P] [US10] Create placeholder lessons for Phase 5 — Async/Await & Concurrency (16 lessons)
- [ ] T068 [P] [US10] Create placeholder lessons for Phase 6 — SOLID & Design Principles (11 lessons)
- [ ] T069 [P] [US10] Create placeholder lessons for Phase 7 — Design Patterns (31 lessons)
- [ ] T070 [P] [US10] Create placeholder lessons for Phase 8 — Data Structures (10 lessons)
- [ ] T071 [P] [US10] Create placeholder lessons for Phase 9 — EF Core Deep Dive (20 lessons)
- [ ] T072 [P] [US10] Create placeholder lessons for Phase 10 — ASP.NET Core (20 lessons)
- [ ] T073 [P] [US10] Create placeholder lessons for Phase 11 — Clean Architecture & DDD (16 lessons)
- [ ] T074 [P] [US10] Create placeholder lessons for Phase 12 — System Design (20 lessons)
- [ ] T075 [P] [US10] Create placeholder lessons for Phase 13 — Hidden/Misleading Traps (20 lessons)

## Phase 8: Supplementary Pages

- [ ] T076 [US1] Build landing page (app/page.tsx): Hero section, Roadmap visualization, FeatureGrid ("What makes this different"), PhaseGrid, call-to-actions
- [ ] T077 [US1] Build Hero component: headline, subhead, primary CTA ("Start Phase 1"), secondary CTA ("View Roadmap"), background code snippet
- [ ] T078 [US1] Build Roadmap component: visual path showing 13 phases as connected nodes
- [ ] T079 [US1] Build FeatureGrid component: 5 differentiator cards (progressive, trap-focused, interactive, foundation-first, docs-anchored)
- [ ] T080 [US12] Build Cheatsheet page: collapsible sections per phase topic, quick-reference content
- [ ] T081 [US13] Build Glossary page: A-Z term list, definitions, back-links to relevant lessons, search/filter
- [ ] T082 [US-ALL] Build Challenges page: aggregated challenges from all lessons, filterable by phase and difficulty
- [ ] T083 [US16] Build Progress Dashboard page: overall completion %, phase progress bars, streak counter, weak areas chart, bookmarked lessons, review queue
- [ ] T084 [US16] Build PhaseProgressBar component: animated fill bar with label and percentage
- [ ] T085 [US19] Build StreakCounter component: flame icon, day count, motivational text

## Phase 9: Search & Interview Mode

- [ ] T086 [US11] Build search index generator (lib/search.ts): collect all lesson frontmatter, write search-index.json at build time
- [ ] T087 [US11] Build SearchPalette component: Cmd+K / Ctrl+K trigger, Fuse.js fuzzy search, result list with navigation, keyboard-navigable
- [ ] T088 [US15] Build Interview Mode page: phase selector, challenge count (default 10), timer config (default 15 min)
- [ ] T089 [US15] Build Interview Mode quiz flow: random challenge selection, sequential presentation, timer countdown, answer tracking
- [ ] T090 [US15] Build Interview Mode results: score display, list of incorrect answers with explanations, retry option

## Phase 10: Polish & Quality

- [ ] T091 [US9] Responsive audit: test all pages at 360px, 375px, 768px, 1024px, 1440px — fix any overflow or layout issues
- [ ] T092 [US-ALL] Accessibility audit: keyboard navigation on all interactive components, ARIA labels, focus indicators, contrast check
- [ ] T093 [US6] Dark mode audit: verify all components, code blocks, callouts, diagrams render correctly in dark mode
- [ ] T094 [US18] Implement keyboard shortcuts: ←/→ lesson navigation, Cmd+K search, Esc close modals
- [ ] T095 [US-ALL] Animation polish: challenge feedback (green pulse / red shake), progress bar fill, theme transition — respect prefers-reduced-motion
- [ ] T096 [US-ALL] SEO foundations: meta tags per page, OpenGraph tags, structured data (JSON-LD), sitemap.xml, robots.txt (for future deployment)
- [ ] T097 [US-ALL] Write CONTENT_GUIDE.md: MDX syntax, component usage, tone guide, code example conventions, review checklist
- [ ] T098 [US-ALL] Final build validation: pnpm build succeeds, zero TypeScript errors, zero ESLint warnings, no console errors

---

## Dependency Summary

```
T001-T011 (Phase 1: Foundation) — all parallelizable where marked [P]
    │
    ├─► T012-T021 (Phase 2: Layout) — needs T001,T002,T003,T006,T007,T010
    ├─► T022-T032 (Phase 3: Components) — needs T001,T002,T003,T005,T009
    ├─► T033-T041 (Phase 4: State) — needs T001,T009,T011
    │       │
    │       └─► T042-T048 (Phase 5: Content Infra) — needs Phase 2,3,4
    │               │
    │               ├─► T049-T063 (Phase 6: Phase 1 Content) — needs Phase 5
    │               ├─► T064-T075 (Phase 7: Scaffold) — needs Phase 5, parallel with Phase 6
    │               └─► T076-T085 (Phase 8: Supplementary) — needs Phase 5, parallel with Phase 6
    │                       │
    │                       └─► T086-T090 (Phase 9: Search & Interview) — needs Phase 6,7,8
    │                               │
    │                               └─► T091-T098 (Phase 10: Polish) — needs all above
```

---

## Task Statistics

- **Total tasks**: 98
- **Phase 1 (Foundation)**: 11 tasks
- **Phase 2 (Layout)**: 10 tasks
- **Phase 3 (Components)**: 11 tasks
- **Phase 4 (State)**: 9 tasks
- **Phase 5 (Content Infra)**: 7 tasks
- **Phase 6 (Content)**: 15 tasks
- **Phase 7 (Scaffold)**: 12 tasks
- **Phase 8 (Supplementary)**: 10 tasks
- **Phase 9 (Search & Interview)**: 5 tasks
- **Phase 10 (Polish)**: 8 tasks
- **Parallel-eligible tasks**: 32 (marked [P])
