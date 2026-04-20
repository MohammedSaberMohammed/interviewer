# Feature Specification: Interviewer-App MVP

> Status: Approved
> Created: 2026-04-20
> Source: prd.md

---

## 1. Overview

Build a production-quality, interactive learning website that transforms junior/mid-level .NET engineers into senior-ready candidates through a structured 13-phase curriculum. MVP delivers Phase 1 (C# Language Core) fully populated with 15 AI-generated lessons, all other phases scaffolded, and a complete interactive learning platform running on localhost.

---

## 2. User Stories (Priority-Ordered)

### P1 — Must Have (MVP Launch)

**US1: Structured Roadmap**
As a junior engineer, I want to see a structured roadmap of all 13 phases so I understand the full learning journey.
- Acceptance: Landing page shows all 13 phases as navigable cards with title, level, estimated hours, and progress indicator.

**US2: Lesson Consumption**
As an engineer, I want to read rich, interactive lessons with syntax-highlighted C# code so I learn by doing.
- Acceptance: Lesson pages render MDX with Callouts, CodeChallenges, Quizzes, ComparisonTables, MythBusters, and DocsLinks. Shiki highlights C# code in light/dark themes.

**US3: Interactive Challenges**
As an engineer, I want to predict code output and get immediate feedback so I test my understanding.
- Acceptance: CodeChallenge component shows code, presents options, reveals correctness with animation, shows explanation, and tracks attempts in Zustand store.

**US4: Progress Tracking**
As an engineer, I want my progress saved without signing up so I can resume where I left off.
- Acceptance: Completed lessons and challenge answers persist in localStorage. Phase progress bars and total progress update in real-time.

**US5: Navigation Flow**
As an engineer, I want prev/next lesson navigation and a phase sidebar so I move through content efficiently.
- Acceptance: Lesson pages have left sidebar (phase lessons), right sidebar (TOC), and prev/next buttons. Keyboard arrows navigate between lessons.

**US6: Theme Support**
As an engineer, I want dark mode for comfortable long sessions.
- Acceptance: Light/dark/system theme toggle persists across sessions. All components render correctly in both modes.

**US7: Phase 1 Content**
As a junior engineer, I want 15 complete lessons on C# Language Core so I can start learning immediately.
- Acceptance: All 15 lessons published with ≥ 2 interactive components and ≥ 1 Microsoft Docs link each.

**US8: Phase Overview Pages**
As an engineer, I want to see what each phase covers before starting it.
- Acceptance: Phase detail pages list all lessons with difficulty badges, reading time, completion status, and learning outcomes.

**US9: Mobile Responsive**
As an engineer, I want to study on my phone during commute.
- Acceptance: All pages responsive at 360px+. Sidebar collapses to drawer. Bottom sticky bar with prev/next on mobile.

**US10: Scaffolded Phases 2-13**
As an engineer, I want to see the full curriculum structure even for unpublished phases.
- Acceptance: Phases 2-13 have metadata, landing pages, and placeholder lessons with "Coming Soon" notices.

### P2 — Should Have

**US11: Search**
As an engineer, I want to search across all lessons by keyword.
- Acceptance: Cmd+K opens search palette. Fuse.js fuzzy matches against lesson titles and summaries.

**US12: Cheatsheet**
As a mid-level engineer, I want a quick-reference cheatsheet for last-minute review.
- Acceptance: Collapsible sections organized by phase topic.

**US13: Glossary**
As an engineer, I want to look up .NET terms quickly.
- Acceptance: A-Z term list with definitions and back-links to relevant lessons.

**US14: Bookmarks**
As an engineer, I want to bookmark lessons for later review.
- Acceptance: Bookmark toggle on lesson pages, bookmarked lessons listed on progress dashboard.

**US15: Interview Mode**
As an engineer, I want a timed mock quiz to simulate interview conditions.
- Acceptance: Selects 10 random challenges from a phase, configurable timer (default 15 min), shows score at end.

**US16: Progress Dashboard**
As an engineer, I want to see my overall progress, weak areas, and streaks.
- Acceptance: Dashboard shows completion %, streak counter, accuracy per phase, weak areas.

**US17: Memory Visualizer**
As an engineer, I want to see stack/heap memory layout visually for value vs reference type lessons.
- Acceptance: SVG-based visualization showing labeled stack frames, heap objects, and reference arrows.

### P3 — Nice to Have

**US18: Keyboard Shortcuts**
As a power user, I want keyboard shortcuts for efficient navigation.
- Acceptance: ←/→ for lesson nav, Cmd+K for search, Esc to close modals.

**US19: Study Streak**
As an engineer, I want a streak counter to motivate daily study.
- Acceptance: Streak increments on daily activity, resets on missed day, shown on dashboard.

---

## 3. Functional Requirements Summary

| Area | Key Requirements |
|---|---|
| Content Delivery | MDX rendering, Shiki highlighting, auto-TOC, prev/next nav, reading time |
| Interactive Components | Callout (6 types), CodeChallenge, Quiz, ComparisonTable, MythBuster, DocsLink, CodePlayground (Shiki), Diagram (Mermaid), MemoryVisualizer, DifficultyBadge |
| Progress | localStorage persistence, lesson completion, challenge tracking, phase/total progress, bookmarks |
| Navigation | Landing page, phases index, phase detail, lesson page, 3-column layout |
| Theme | Light/dark/system, persisted, smooth transition |
| Search | Fuse.js client-side, Cmd+K palette |
| Supplementary | Cheatsheet, Glossary, Progress Dashboard, Challenges page |
| Interview Mode | Random challenge selection, timer, scoring |

---

## 4. Content Scope

### Phase 1 — C# Language Core (15 lessons, AI-generated)
1. The CLR, CTS, and CLS
2. Value Types vs Reference Types
3. Stack vs Heap — The Real Rules
4. Boxing & Unboxing — The Silent Perf Killer
5. Nullable Types — Value Nullables vs NRT
6. Parameter Passing: ref, out, in
7. var, dynamic, object — Three Different Things
8. const vs readonly vs static readonly vs init
9. Operators & the Overloading Gotchas
10. Strings, Immutability & StringBuilder
11. DateTime vs DateTimeOffset vs DateOnly
12. decimal vs double — Financial Calculations
13. IComparable vs IComparer
14. Enums & [Flags]
15. Attributes & Reflection Basics

### Phases 2-13 — Scaffolded Only
Metadata + placeholder lessons for: OOP, Intermediate C#, Memory/GC/Perf, Async/Concurrency, SOLID, Design Patterns, Data Structures, EF Core, ASP.NET Core, Clean Architecture/DDD, System Design, Hidden Traps.

---

## 5. Non-Functional Requirements

- TypeScript strict, zero `any`
- Lighthouse Accessibility ≥ 95
- WCAG 2.1 AA
- Mobile-first responsive (360px–1536px)
- < 2s initial page load on localhost
- pnpm, ESLint, Prettier
- No external services (localhost only for MVP)
