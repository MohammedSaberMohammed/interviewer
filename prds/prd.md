# Product Requirements Document (PRD)
## .NET Senior Interview Prep — Interactive Learning Platform

---

**Document Version:** 1.0
**Date:** April 20, 2026
**Status:** Draft — Ready for Engineering
**Owner:** Product Team
**Target Audience:** Engineering team building the platform

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users & Personas](#4-target-users--personas)
5. [Scope](#5-scope)
6. [User Stories](#6-user-stories)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Technical Architecture](#9-technical-architecture)
10. [Information Architecture](#10-information-architecture)
11. [Content Strategy](#11-content-strategy)
12. [UI/UX Requirements](#12-uiux-requirements)
13. [Component Specifications](#13-component-specifications)
14. [Data Models & State Management](#14-data-models--state-management)
15. [Curriculum Specification](#15-curriculum-specification)
16. [Milestones & Phased Delivery](#16-milestones--phased-delivery)
17. [Quality Bar & Acceptance Criteria](#17-quality-bar--acceptance-criteria)
18. [Risks & Mitigations](#18-risks--mitigations)
19. [Out of Scope](#19-out-of-scope)
20. [Open Questions](#20-open-questions)
21. [Appendices](#21-appendices)

---

## 1. Executive Summary

### 1.1 Product Vision
Build a production-quality, interactive learning website that transforms a junior or mid-level .NET engineer into a senior-ready candidate through a structured, 13-phase curriculum emphasizing **foundational understanding over memorization**.

### 1.2 Product Name
Working title: **"Senior.NET"** (placeholder — subject to branding decision)

### 1.3 Elevator Pitch
> A deep, progressive interview preparation journey for .NET engineers. Unlike traditional Q&A repositories, this platform teaches the *why* behind every concept — from CLR internals to distributed system design — through interactive challenges, traps that expose shallow understanding, and direct links to Microsoft documentation.

### 1.4 Core Differentiators
- **Progressive difficulty**: Junior → Mid → Senior, no gaps skipped.
- **Trap-focused**: Dedicated emphasis on misleading concepts and hidden gotchas.
- **Interactive, not passive**: Every lesson includes code prediction challenges and quizzes.
- **Foundation-first**: Builds mental models, not answer lists.
- **Documentation-anchored**: Every topic links to authoritative Microsoft Docs.

---

## 2. Problem Statement

### 2.1 The Problem
Most .NET interview preparation resources fall into two categories:
1. **Shallow Q&A repositories** — Memorizable answers without understanding.
2. **Academic textbooks** — Comprehensive but disconnected from real interview scenarios.

Neither builds the **intuitive, battle-tested understanding** that senior interviews actually test. Candidates either:
- Fail senior interviews despite years of experience, because they never examined foundational concepts deeply.
- Know surface-level answers but stumble on "why" follow-ups.
- Struggle with system design because they never practiced the reasoning process.

### 2.2 Why Now
- .NET ecosystem has matured rapidly (Core unification, AOT, minimal APIs, C# 12).
- Senior interviews increasingly probe internals (Span, GC, async state machines).
- Remote-first hiring has raised the technical bar for senior roles.
- Existing platforms (LeetCode, Exercism) are language-agnostic and don't cover .NET-specific depth.

### 2.3 User Pain Points (Validated via Conversation)
- *"I have 1 year of experience but senior interviews feel out of reach."*
- *"I know patterns theoretically but can't identify them in real code."*
- *"EF Core performance is a black box to me."*
- *"I freeze on system design because I've never been walked through it."*
- *"I need to understand fundamentals, not just memorize answers."*

---

## 3. Goals & Success Metrics

### 3.1 Business Goals
| Goal | Rationale |
|---|---|
| Ship a polished MVP covering Phase 1 fully, Phases 2–13 scaffolded | Validate product direction quickly |
| Build content platform that scales to 200+ lessons | Long-term growth |
| Create best-in-class .NET learning UX | Differentiation |

### 3.2 User Goals
| Goal | Rationale |
|---|---|
| Pass a senior .NET interview | Primary use case |
| Build durable understanding, not crammed knowledge | Long-term career value |
| Identify weak areas and close them | Efficient learning |
| Study at own pace | Busy working professionals |

### 3.3 Success Metrics

**Engagement Metrics**
- Lesson completion rate > 60% for users who start a phase
- Average session length > 20 minutes
- Return user rate > 40% within 7 days
- Challenge attempt rate > 80% (users who see a challenge try it)

**Learning Metrics**
- Quiz accuracy improvement > 25% from Phase 1 to Phase 5 (per-user)
- Challenge first-attempt success rate > 45%
- Phase completion time within ±20% of estimates

**Quality Metrics**
- Lighthouse Performance ≥ 95
- Lighthouse Accessibility ≥ 95
- Zero critical accessibility violations
- < 2s initial page load on 4G

**Content Metrics**
- 100% of Phase 1 lessons include ≥ 2 interactive challenges
- 100% of lessons include at least one Microsoft Docs link
- 0 broken internal links
- 0 TypeScript errors in production

---

## 4. Target Users & Personas

### 4.1 Primary Persona — "Ahmed the Ambitious Junior"
- **Role**: Junior .NET Developer
- **Experience**: 0–2 years
- **Context**: Interviewing for mid/senior roles or seeking to deepen foundations
- **Goals**: Understand the "why" behind .NET, not just syntax
- **Pain**: Has blind spots in memory, async, and architecture
- **Quote**: *"I want to understand, not memorize."*

### 4.2 Secondary Persona — "Maya the Mid-Level Engineer"
- **Role**: Mid-level .NET Developer
- **Experience**: 2–5 years
- **Context**: Preparing for senior promotion or external senior role
- **Goals**: Fill specific gaps (system design, advanced patterns, EF internals)
- **Pain**: Strong in day-to-day work but weak on deep-dive topics
- **Quote**: *"I build features, but interviews ask about internals."*

### 4.3 Tertiary Persona — "Kareem the Returning Senior"
- **Role**: Senior .NET Engineer returning to interview market
- **Experience**: 5+ years
- **Context**: Rusty on recent .NET features (Span, AOT, .NET 8/9)
- **Goals**: Rapid refresh of modern .NET + trap-focused review
- **Pain**: Needs to validate existing knowledge, not rebuild it
- **Quote**: *"I know this stuff — I just need to sharpen it."*

---

## 5. Scope

### 5.1 In Scope — MVP (Phase 1 Release)
- Complete website with 13-phase curriculum structure
- **Phase 1 (C# Language Core) fully populated** — ~15 lessons with rich interactive content
- **Phases 2–13 scaffolded** — metadata, landing pages, placeholder lessons
- Core reusable lesson components (callouts, challenges, quizzes, comparison tables, etc.)
- Client-side progress tracking (localStorage)
- Light/dark theme
- Mobile-responsive design
- Search (client-side fuzzy)
- Cheatsheet, glossary, progress dashboard pages
- Interview Mode (timed mock quiz per phase)

### 5.2 In Scope — Post-MVP
- Progressive population of Phases 2–13 (iterative content releases)
- Spaced repetition for incorrect answers
- C# code execution playground (via sandbox API)
- Print-to-PDF per phase

### 5.3 Explicitly Out of Scope
- User accounts, authentication, server-side persistence (MVP)
- Payments, subscriptions, paid tiers
- Community features (comments, forums, user submissions)
- Native mobile apps
- Video content production
- Multi-language support (English only for MVP)
- AI tutoring / chatbot integration
- Non-.NET content (Java, Python, etc.)

---

## 6. User Stories

### 6.1 As a junior engineer preparing for a senior interview…
- I want to **see a structured roadmap** so I understand the journey ahead.
- I want **lessons that build on each other** so I'm never lost.
- I want **to predict code output** so I learn by doing, not reading.
- I want **immediate feedback** on my answers so I know where I stand.
- I want **links to Microsoft Docs** so I can dive deeper.

### 6.2 As a mid-level engineer…
- I want to **jump to specific phases** without going linearly.
- I want **a cheatsheet** for last-minute review.
- I want **to filter lessons by difficulty** to skip what I know.
- I want **a glossary** to quickly look up terms.

### 6.3 As any engineer…
- I want **my progress saved** without signing up.
- I want **to resume where I left off** on return visits.
- I want **dark mode** for comfortable long sessions.
- I want **keyboard shortcuts** for efficient navigation.
- I want **a mobile experience** so I can study on commute.

### 6.4 As a content-consuming power user…
- I want **to bookmark lessons** for later review.
- I want **to retry challenges** to cement knowledge.
- I want **to see my weak areas** identified automatically.
- I want **an interview mode** that simulates real conditions.

---

## 7. Functional Requirements

### 7.1 Content Delivery
| ID | Requirement | Priority |
|---|---|---|
| FR-1.1 | System shall render MDX-based lesson content with custom React components | P0 |
| FR-1.2 | System shall support syntax highlighting for C# code blocks (light + dark themes) | P0 |
| FR-1.3 | System shall auto-generate table of contents from lesson headings | P0 |
| FR-1.4 | System shall provide previous/next lesson navigation at lesson boundaries | P0 |
| FR-1.5 | System shall calculate and display estimated reading time per lesson | P1 |
| FR-1.6 | System shall render Mermaid diagrams client-side | P1 |

### 7.2 Interactive Learning Components
| ID | Requirement | Priority |
|---|---|---|
| FR-2.1 | Code Challenge component shall present code, options, and explanation with correctness tracking | P0 |
| FR-2.2 | Quiz component shall present conceptual questions with immediate feedback | P0 |
| FR-2.3 | Comparison Table component shall present side-by-side contrasts | P0 |
| FR-2.4 | Myth Buster component shall visually contrast common misconceptions with truth | P0 |
| FR-2.5 | Callout component shall support types: info, tip, warning, critical, trap, senior | P0 |
| FR-2.6 | Code Playground (read-only) shall display editable code with copy button and .NET Fiddle deep-link | P1 |
| FR-2.7 | Memory Visualizer shall illustrate stack/heap concepts via SVG or canvas | P2 |
| FR-2.8 | Challenge components shall support hint reveal, multi-attempt tracking | P1 |

### 7.3 Progress Tracking
| ID | Requirement | Priority |
|---|---|---|
| FR-3.1 | System shall persist completion state per lesson via localStorage | P0 |
| FR-3.2 | System shall track challenge answer history (correct/incorrect, attempts, timestamps) | P0 |
| FR-3.3 | System shall compute and display phase-level progress percentage | P0 |
| FR-3.4 | System shall compute and display total-curriculum progress percentage | P0 |
| FR-3.5 | System shall support manual marking of lessons as complete | P0 |
| FR-3.6 | System shall allow progress reset with confirmation | P1 |
| FR-3.7 | System shall track user bookmarks | P1 |
| FR-3.8 | System shall identify weak areas based on quiz accuracy | P1 |
| FR-3.9 | System shall maintain a study streak counter | P2 |

### 7.4 Navigation & Discovery
| ID | Requirement | Priority |
|---|---|---|
| FR-4.1 | Homepage shall display hero, roadmap, and phase grid | P0 |
| FR-4.2 | Phases index shall show all 13 phases with progress indicators | P0 |
| FR-4.3 | Phase detail page shall list all lessons with difficulty and completion status | P0 |
| FR-4.4 | Top navigation shall provide access to Phases, Challenges, Cheatsheet, Glossary | P0 |
| FR-4.5 | Search shall perform fuzzy matching across all lesson titles and summaries | P1 |
| FR-4.6 | Keyboard shortcut `⌘K` / `Ctrl+K` shall open search | P1 |
| FR-4.7 | Keyboard shortcuts `←` / `→` shall navigate between lessons | P1 |

### 7.5 Supplementary Pages
| ID | Requirement | Priority |
|---|---|---|
| FR-5.1 | Cheatsheet page shall provide collapsible quick-reference sections | P1 |
| FR-5.2 | Glossary page shall list terms A-Z with definitions and lesson back-links | P1 |
| FR-5.3 | Progress dashboard shall visualize completion, streaks, and weak areas | P1 |
| FR-5.4 | Challenges page shall aggregate all challenges with filtering by difficulty/phase | P1 |
| FR-5.5 | About page shall describe the curriculum and its philosophy | P2 |

### 7.6 Interview Mode
| ID | Requirement | Priority |
|---|---|---|
| FR-6.1 | Interview Mode shall randomly select 10 challenges from a chosen phase | P1 |
| FR-6.2 | Interview Mode shall impose a configurable time limit (default 15 min) | P1 |
| FR-6.3 | Interview Mode shall display score and incorrect items at completion | P1 |
| FR-6.4 | Incorrect answers in Interview Mode shall feed into the review queue | P2 |

### 7.7 Theme & Personalization
| ID | Requirement | Priority |
|---|---|---|
| FR-7.1 | System shall support light, dark, and system-preference themes | P0 |
| FR-7.2 | Theme preference shall persist across sessions | P0 |
| FR-7.3 | System shall respect `prefers-reduced-motion` | P0 |

---

## 8. Non-Functional Requirements

### 8.1 Performance
- First Contentful Paint (FCP) < 1.5s on 4G
- Largest Contentful Paint (LCP) < 2.5s on 4G
- Time to Interactive (TTI) < 3s on 4G
- Cumulative Layout Shift (CLS) < 0.1
- Subsequent page navigations feel instant (< 200ms perceived)
- Code splitting per route
- Image optimization (next/image) with lazy loading

### 8.2 Accessibility
- WCAG 2.1 Level AA compliance
- Full keyboard navigation (no mouse-only features)
- ARIA labels on all interactive components
- Visible focus indicators
- Color contrast ratios ≥ 4.5:1 for body text, ≥ 3:1 for large text
- Screen reader tested (VoiceOver / NVDA)
- Semantic HTML throughout
- Skip-to-content link

### 8.3 Responsive Design
- Mobile-first approach
- Breakpoints: 640px (sm), 768px (md), 1024px (lg), 1280px (xl), 1536px (2xl)
- Touch targets ≥ 44×44px on mobile
- Readable typography without zoom on mobile
- Sidebar collapses to drawer on mobile

### 8.4 Browser Support
- Chrome, Edge, Firefox, Safari (latest 2 versions)
- Mobile Safari iOS 16+
- Chrome Android (latest 2 versions)
- Graceful degradation for older browsers (no IE11 support)

### 8.5 SEO
- Lighthouse SEO score ≥ 95
- Unique meta titles and descriptions per page
- OpenGraph tags for social sharing
- sitemap.xml auto-generated
- robots.txt configured
- Semantic heading hierarchy (single h1 per page)
- Structured data (JSON-LD) for courses/articles

### 8.6 Maintainability
- TypeScript strict mode enabled
- Zero `any` types (explicit exceptions documented)
- ESLint + Prettier configured
- Conventional commits enforced
- Component library documented
- Content authoring guide included

### 8.7 Security
- No user input execution (code playground is display-only or sandboxed via external API)
- CSP headers configured
- No third-party tracking by default
- localStorage only for non-sensitive progress data
- Dependency vulnerability scanning (npm audit, Dependabot)

---

## 9. Technical Architecture

### 9.1 Technology Stack

| Layer | Technology | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG + RSC for performance, mature ecosystem |
| Language | TypeScript (strict mode) | Type safety, maintainability |
| Styling | Tailwind CSS v4 | Utility-first, design system friendly |
| UI Components | shadcn/ui | Copy-paste primitives, full control |
| Content Format | MDX | Mix Markdown with React components |
| Code Highlighting | Shiki | VS Code-quality, dual-theme support |
| Code Editor | Monaco Editor | VS Code engine, familiar to .NET devs |
| State Management | Zustand + `persist` middleware | Lightweight, localStorage-friendly |
| Icons | Lucide React | Consistent, tree-shakeable |
| Diagrams | Mermaid.js | Markdown-native diagram syntax |
| Search | Fuse.js | Client-side fuzzy search, no backend needed |
| Theming | next-themes | SSR-safe theme switching |
| Animations | Framer Motion / View Transitions API | Smooth UX without jank |
| Deployment | Vercel | Optimized for Next.js, CDN, analytics |

### 9.2 Architecture Decisions

**AD-1: Static Site Generation (SSG)**
- All lesson pages pre-rendered at build time.
- Rationale: Instant loads, trivial hosting, excellent SEO.
- Trade-off: New content requires rebuild (acceptable for this use case).

**AD-2: No Backend for MVP**
- Progress stored client-side in localStorage.
- Rationale: Minimizes complexity, aligns with scope.
- Trade-off: No cross-device sync (deferred to post-MVP).

**AD-3: MDX for Content**
- Content authored as `.mdx` with frontmatter.
- Rationale: Maximum flexibility to embed interactive components inline.
- Trade-off: Slightly higher author overhead vs plain markdown.

**AD-4: Client-Side Search**
- Fuse.js indexes all lesson metadata at build time, shipped as JSON.
- Rationale: No search infrastructure, instant results, small index size.
- Trade-off: Index grows with content (acceptable up to ~500 lessons).

**AD-5: No Authentication in MVP**
- Progress lives in browser only.
- Rationale: Removes signup friction, accelerates time-to-value.
- Trade-off: Progress lost on browser clear (documented clearly to users).

### 9.3 Project Structure

```
root/
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # Root layout (theme, nav, footer)
│   ├── page.tsx                   # Landing page
│   ├── phases/
│   │   ├── page.tsx               # Phases index
│   │   └── [phaseSlug]/
│   │       ├── page.tsx           # Phase overview
│   │       └── [lessonSlug]/
│   │           └── page.tsx       # Lesson page (renders MDX)
│   ├── challenges/page.tsx
│   ├── cheatsheet/page.tsx
│   ├── glossary/page.tsx
│   ├── progress/page.tsx
│   └── about/page.tsx
├── components/
│   ├── ui/                        # shadcn/ui primitives
│   ├── lesson/                    # MDX-embeddable components
│   │   ├── Callout.tsx
│   │   ├── CodeChallenge.tsx
│   │   ├── Quiz.tsx
│   │   ├── ComparisonTable.tsx
│   │   ├── MythBuster.tsx
│   │   ├── DocsLink.tsx
│   │   ├── CodePlayground.tsx
│   │   ├── Diagram.tsx
│   │   ├── MemoryVisualizer.tsx
│   │   ├── DifficultyBadge.tsx
│   │   └── ...
│   ├── layout/                    # Nav, Footer, Sidebar, TOC
│   ├── progress/                  # ProgressBar, Streak, Dashboard
│   └── home/                      # Hero, Roadmap, FeatureGrid
├── content/                       # MDX content
│   └── phases/
│       ├── 01-csharp-core/
│       │   ├── _meta.json
│       │   ├── 01-clr-cts-cls.mdx
│       │   ├── 02-value-vs-reference.mdx
│       │   └── ...
│       ├── 02-oop/
│       └── ... (03–13)
├── lib/
│   ├── content.ts                 # Content loading, parsing
│   ├── search.ts                  # Fuse.js index builder
│   ├── progress.ts                # Progress utility functions
│   └── mdx.ts                     # MDX configuration
├── stores/
│   └── progressStore.ts           # Zustand store
├── styles/
│   └── globals.css
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── ...
├── CONTENT_GUIDE.md
├── README.md
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 9.4 Build & Deploy
- **CI**: GitHub Actions — lint, typecheck, build on PR
- **Deploy**: Vercel — auto-deploy on merge to main
- **Preview**: Vercel — preview deploys on every PR
- **Analytics**: Vercel Analytics (privacy-friendly) — post-MVP
- **Monitoring**: Sentry for error tracking — post-MVP

---

## 10. Information Architecture

### 10.1 Site Map

```
/                              Landing page
├── /phases                    All phases grid
│   └── /phases/[phaseSlug]    Phase overview
│       └── /phases/[phaseSlug]/[lessonSlug]    Lesson page
├── /challenges                All challenges (filterable)
├── /cheatsheet                Quick reference
├── /glossary                  Term dictionary
├── /progress                  User progress dashboard
└── /about                     About the curriculum
```

### 10.2 Navigation Hierarchy

**Top Navigation (persistent)**
- Logo → `/`
- Phases (dropdown preview) → `/phases`
- Challenges → `/challenges`
- Cheatsheet → `/cheatsheet`
- Glossary → `/glossary`
- Search (⌘K) → Command palette
- Theme toggle
- Progress indicator → `/progress`

**Lesson Page Layout**
- Left sidebar: Phase lesson list (current phase)
- Center: Lesson content
- Right sidebar: In-lesson TOC, related links, docs

**Mobile**
- Hamburger menu → full drawer with all nav + phase list
- Sticky bottom bar with prev/next lesson

### 10.3 URL Conventions
- All slugs lowercase, kebab-case
- Phase slugs prefixed with number: `01-csharp-core`, `02-oop`
- Lesson slugs descriptive: `value-vs-reference-types`
- No query parameters for core navigation

---

## 11. Content Strategy

### 11.1 Content Format: MDX with Frontmatter

Every lesson file follows this structure:

```mdx
---
title: "Lesson Title"
slug: "lesson-slug"
order: 2
difficulty: "foundation"  # foundation | intermediate | advanced | expert
readingTime: 12
status: "published"       # draft | published
tags: ["memory", "types"]
docsLinks:
  - label: "MS Docs Label"
    url: "https://learn.microsoft.com/..."
summary: "One-sentence hook explaining why this lesson matters."
---

import { Callout, CodeChallenge, Quiz, ComparisonTable, MythBuster } from '@/components/lesson'

[Content here mixing Markdown and React components]
```

### 11.2 Lesson Structure Template

Every lesson should include, in order:

1. **Hook** — Opening callout or paragraph that sets stakes
2. **Core Explanation** — The main teaching content
3. **Visual Aid** — Comparison table, myth buster, or diagram
4. **Interactive Challenge(s)** — At least one `<CodeChallenge>` or `<Quiz>`
5. **Senior-Level Insight** — A `<Callout type="senior">` with deeper nuance
6. **Summary** — Key takeaways
7. **Docs Links** — Microsoft documentation references

### 11.3 Content Quality Standards

- **No fluff**: Every paragraph earns its place.
- **Code over prose**: Illustrate with examples, not walls of text.
- **Traps surfaced**: Flag every misleading concept explicitly.
- **Senior nuance**: Where applicable, distinguish junior vs senior understanding.
- **Ownership**: Confident, direct voice. No hedging.
- **Consistency**: Same terminology across all lessons.

### 11.4 Difficulty Levels

| Level | Definition | Example Topics |
|---|---|---|
| Foundation | Must-know for any .NET dev | Value vs reference types, basic async |
| Intermediate | Expected at mid-level | LINQ internals, DI lifetimes |
| Advanced | Senior-level depth | GC generations, Span/Memory, expression trees |
| Expert | Architecture and edge cases | Event sourcing, custom middleware patterns |

### 11.5 Content Authoring Guide
A separate `CONTENT_GUIDE.md` document shall be provided with:
- MDX syntax examples
- Component usage patterns
- Tone and voice guide
- Code example conventions
- Docs link formatting rules
- Review checklist before publishing

---

## 12. UI/UX Requirements

### 12.1 Visual Design System

**Color Palette**

Primary:
- `dotnet-purple`: `#512BD4` (official .NET brand color)
- Use for primary CTAs, active states, accents

Neutrals:
- Base: Slate scale (Tailwind `slate-50` to `slate-950`)
- Maintain high contrast in both light and dark modes

Semantic Colors:
- Info: Blue (`blue-500`)
- Success: Green (`emerald-500`)
- Warning: Amber (`amber-500`)
- Danger: Red (`rose-500`)
- Trap: Purple gradient
- Senior: Gradient `from-purple-500 to-blue-500`

**Typography**

- UI Font: **Inter** (variable font, weights 400/500/600/700)
- Code Font: **JetBrains Mono** (variable, weights 400/500/700)
- Reading width: Max 72 characters (`max-w-prose`)
- Line height: 1.7 for body, 1.2 for headings

**Spacing Scale**
- Use Tailwind's default 4px-based scale
- Generous whitespace — favor `space-y-8` over `space-y-4` for section separation

**Borders & Shadows**
- Subtle borders (`border-slate-200` / `border-slate-800`)
- Soft shadows (`shadow-sm`, `shadow-lg` for cards)
- No harsh drop shadows

**Corners**
- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Inputs: `rounded-md` (6px)

### 12.2 Design Inspiration References
- **Vercel Docs** — clean, developer-focused, excellent typography
- **React Docs** — interactive components inline with content
- **Supabase Docs** — gorgeous dark mode, subtle animation
- **Frontend Masters** — progress tracking, course feel
- **Exercism** — interactive exercises, clean discipline UI

### 12.3 Landing Page (Hero)
**Above the fold:**
- Headline: "From Junior to Senior .NET Engineer"
- Subhead: "A deep, structured interview preparation journey across 13 phases"
- Primary CTA: "Start Phase 1" (prominent)
- Secondary CTA: "View Roadmap"
- Background: Subtle animated C# code snippet, syntax-highlighted

**Below the fold:**
- Roadmap visualization: Horizontal or path-based showing all 13 phases as nodes
- "What makes this different" — 5 feature cards
- Phase grid: Visual index of all 13 phases
- Testimonial placeholder (can be quote-style)
- Footer with links

### 12.4 Lesson Page Layout
**Desktop (≥ 1024px)**
- 3-column: Left sidebar (240px) | Content (720px max) | Right sidebar (240px)
- Sticky sidebars
- Right sidebar shows lesson TOC + related docs

**Tablet (768–1023px)**
- 2-column: Content + right sidebar
- Left nav becomes collapsible drawer

**Mobile (< 768px)**
- Single column
- Bottom sticky bar with prev/next
- All navigation via hamburger drawer

### 12.5 Micro-Interactions
- **Page transitions**: Subtle fade (100–150ms)
- **Hover states**: Background tint shift (80ms)
- **Challenge feedback**: Correct = green pulse; incorrect = subtle shake + red tint
- **Progress bar fill**: Animated on update (300ms ease-out)
- **Theme toggle**: Smooth color transition (not instant)
- **Respect `prefers-reduced-motion`**: Disable all non-essential animations

### 12.6 Empty States
- Progress dashboard (no activity): Encouraging prompt to start Phase 1
- Search (no results): "No lessons match your query" with suggested popular lessons
- Phase (not started): "Ready to begin? Start with lesson 1" CTA

### 12.7 Error States
- 404: Friendly page with search and link back to phases
- Broken MDX: Graceful fallback showing title and "Content unavailable" (dev-only full error)

---

## 13. Component Specifications

### 13.1 `<Callout>`
**Purpose**: Inline alert/note boxes.

**Props**:
```typescript
interface CalloutProps {
  type: 'info' | 'tip' | 'warning' | 'critical' | 'trap' | 'senior'
  title?: string
  children: React.ReactNode
}
```

**Visual Variants**:
- `info` — Blue background, ℹ️ icon
- `tip` — Green background, 💡 icon
- `warning` — Amber background, ⚠️ icon
- `critical` — Red background, 🚨 icon
- `trap` — Purple background, 🪤 icon, label "Interview Trap"
- `senior` — Gradient border, 🎯 icon, label "Senior-Level Insight"

### 13.2 `<CodeChallenge>`
**Purpose**: Interactive code prediction exercise.

**Props**:
```typescript
interface CodeChallengeProps {
  id: string                    // Unique for progress tracking
  difficulty: Difficulty
  prompt: string
  code: string
  language?: string             // default 'csharp'
  options: string[]
  correctAnswer: number         // index into options
  explanation: string
  hints?: string[]
  docsLinks?: { label: string; url: string }[]
}
```

**Behavior**:
- Shows code with Shiki syntax highlighting
- Presents options as selectable cards
- On submit: reveals correct/incorrect with animation
- Shows explanation after answer (regardless of correctness)
- Tracks attempts and correctness in Zustand store
- "Try again" allowed after incorrect answer

### 13.3 `<Quiz>`
**Purpose**: Conceptual multiple-choice question without code.

**Props**: Same as `CodeChallenge` minus `code` and `language`.

### 13.4 `<ComparisonTable>`
**Purpose**: Side-by-side comparison of two concepts.

**Props**:
```typescript
interface ComparisonTableProps {
  left: { title: string; items: (string | { label: string; detail?: string })[] }
  right: { title: string; items: (string | { label: string; detail?: string })[] }
  leftColor?: string            // default 'blue'
  rightColor?: string           // default 'purple'
}
```

### 13.5 `<MythBuster>`
**Purpose**: Contrast a common misconception with the truth.

**Props**:
```typescript
interface MythBusterProps {
  myth: string                  // Crossed out visually
  truth: string
  explanation?: string
}
```

### 13.6 `<DocsLink>`
**Purpose**: Styled external link to Microsoft Docs.

**Props**:
```typescript
interface DocsLinkProps {
  href: string
  children: React.ReactNode
}
```

**Behavior**: Opens in new tab, shows book icon, external indicator.

### 13.7 `<CodePlayground>`
**Purpose**: Monaco-based code editor (read-only or editable).

**Props**:
```typescript
interface CodePlaygroundProps {
  code: string
  language?: string             // default 'csharp'
  readOnly?: boolean            // default true for MVP
  expectedOutput?: string
  fiddleLink?: boolean          // default true — adds "Open in .NET Fiddle"
}
```

### 13.8 `<Diagram>`
**Purpose**: Render Mermaid diagrams.

**Props**:
```typescript
interface DiagramProps {
  chart: string                 // Mermaid source
  title?: string
}
```

### 13.9 `<MemoryVisualizer>`
**Purpose**: Visualize stack/heap for value vs reference examples.

**Props**:
```typescript
interface MemoryVisualizerProps {
  stack: { name: string; value: string }[]
  heap: { id: string; content: Record<string, string> }[]
  references?: { from: string; to: string }[]
}
```

**Implementation**: SVG-based, labeled boxes, arrows for references.

### 13.10 `<DifficultyBadge>`
**Purpose**: Pill showing lesson difficulty.

**Props**:
```typescript
interface DifficultyBadgeProps {
  level: 'foundation' | 'intermediate' | 'advanced' | 'expert'
}
```

### 13.11 `<PhaseProgressBar>`
**Purpose**: Show progress through a phase.

**Props**:
```typescript
interface PhaseProgressBarProps {
  completed: number
  total: number
  showLabel?: boolean
}
```

### 13.12 `<LearningPath>`
**Purpose**: Visualize all 13 phases and current position.

**Variants**: Horizontal scroll, vertical list, or path visualization.

### 13.13 `<NavPrevNext>`
**Purpose**: Previous/next lesson navigation.

### 13.14 `<TableOfContents>`
**Purpose**: Auto-generated from h2/h3/h4 headings in lesson.

**Behavior**:
- Sticky on desktop
- Collapsible on mobile
- Highlights current section via IntersectionObserver

---

## 14. Data Models & State Management

### 14.1 Zustand Progress Store

```typescript
interface ChallengeAnswer {
  challengeId: string
  correct: boolean
  answeredAt: number             // timestamp
  attempts: number
  selectedOption: number
}

interface ProgressState {
  // State
  completedLessons: Set<string>
  challengeAnswers: Record<string, ChallengeAnswer>
  bookmarkedLessons: Set<string>
  currentPhase: string | null
  currentLesson: string | null
  lastActiveAt: number
  streakDays: number
  theme: 'light' | 'dark' | 'system'

  // Actions
  markLessonComplete: (lessonId: string) => void
  unmarkLessonComplete: (lessonId: string) => void
  recordChallengeAnswer: (
    challengeId: string,
    selectedOption: number,
    correct: boolean
  ) => void
  toggleBookmark: (lessonId: string) => void
  setCurrentLesson: (phaseSlug: string, lessonSlug: string) => void
  updateStreak: () => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  reset: () => void

  // Selectors
  getPhaseProgress: (phaseSlug: string) => number
  getTotalProgress: () => number
  getWeakAreas: () => { phaseSlug: string; accuracy: number }[]
  getReviewQueue: () => ChallengeAnswer[]
}
```

**Persistence**: Zustand `persist` middleware, stored in `localStorage` under key `dotnet-prep-progress-v1`. Sets serialized as arrays.

### 14.2 Content Data Model

```typescript
interface Phase {
  slug: string
  number: number
  title: string
  subtitle: string
  level: 'junior' | 'mid' | 'senior'
  estimatedHours: number
  emoji: string
  color: string
  description: string
  prerequisites: string[]        // phase slugs
  learningOutcomes: string[]
  lessons: LessonMeta[]
}

interface LessonMeta {
  slug: string
  title: string
  order: number
  difficulty: 'foundation' | 'intermediate' | 'advanced' | 'expert'
  readingTime: number
  tags: string[]
  summary: string
  status: 'draft' | 'published'
  docsLinks: { label: string; url: string }[]
}

interface Lesson extends LessonMeta {
  phaseSlug: string
  contentComponent: React.ComponentType  // compiled MDX
  challenges: ChallengeMeta[]             // extracted from MDX
  quizzes: QuizMeta[]                     // extracted from MDX
}

interface ChallengeMeta {
  id: string
  lessonSlug: string
  phaseSlug: string
  difficulty: Difficulty
  prompt: string
}
```

### 14.3 Content Loading Flow

1. **Build time**:
   - Walk `content/phases/*/` directories
   - Parse `_meta.json` per phase
   - Parse MDX frontmatter for each lesson
   - Build `phases.json` static data file
   - Build `search-index.json` for Fuse.js
2. **Runtime**:
   - Pages import static JSON for metadata
   - MDX compiled per-page (via `next-mdx-remote` or `@next/mdx`)
   - No network calls during navigation

---

## 15. Curriculum Specification

### 15.1 Phase Overview

| # | Phase | Level | Est. Hours | Focus |
|---|---|---|---|---|
| 1 | C# Language Core | Junior | 8 | Foundational syntax, types, operators |
| 2 | OOP in C# | Junior | 6 | Classes, inheritance, polymorphism |
| 3 | Intermediate C# | Mid | 10 | Delegates, LINQ, generics, pattern matching |
| 4 | Memory, GC & Performance | Senior | 8 | GC generations, Span, perf profiling |
| 5 | Async/Await & Concurrency | Senior | 10 | TAP, state machines, threading primitives |
| 6 | SOLID & Design Principles | Mid | 5 | Principles with real code smells |
| 7 | Design Patterns | Senior | 12 | GoF + modern patterns in C# |
| 8 | Data Structures | Mid | 6 | BCL collections, Big-O, internals |
| 9 | EF Core Deep Dive | Senior | 10 | Change tracker, N+1, migrations, perf |
| 10 | ASP.NET Core | Senior | 10 | Middleware, DI, auth, Kestrel |
| 11 | Clean Architecture & DDD | Senior | 8 | Layers, aggregates, CQRS, MediatR |
| 12 | System Design | Senior | 12 | Distributed systems, CAP, resilience |
| 13 | Hidden/Misleading Traps | Senior | 6 | Trap-focused review across all topics |

**Total estimated content**: ~111 hours of material.

### 15.2 Phase 1 — C# Language Core (Full Lesson Breakdown)

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `clr-cts-cls` | The CLR, CTS, and CLS | Foundation |
| 2 | `value-vs-reference-types` | Value Types vs Reference Types | Foundation |
| 3 | `stack-vs-heap` | Stack vs Heap — The Real Rules | Foundation |
| 4 | `boxing-unboxing` | Boxing & Unboxing — The Silent Perf Killer | Foundation |
| 5 | `nullable-types` | Nullable Types — Value Nullables vs NRT | Intermediate |
| 6 | `parameter-passing` | Parameter Passing: ref, out, in | Intermediate |
| 7 | `var-dynamic-object` | var, dynamic, object — Three Different Things | Foundation |
| 8 | `const-readonly-init` | const vs readonly vs static readonly vs init | Intermediate |
| 9 | `operators` | Operators & the Overloading Gotchas | Intermediate |
| 10 | `strings` | Strings, Immutability & StringBuilder | Foundation |
| 11 | `datetime` | DateTime vs DateTimeOffset vs DateOnly | Intermediate |
| 12 | `decimal-vs-double` | decimal vs double — Financial Calculations | Foundation |
| 13 | `icomparable` | IComparable vs IComparer | Intermediate |
| 14 | `enums-flags` | Enums & [Flags] | Foundation |
| 15 | `attributes-reflection` | Attributes & Reflection Basics | Intermediate |

### 15.3 Phase 2 — OOP in C# (Lesson Breakdown)

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `classes-structs-records` | Classes, Structs, Records: When to Use Which | Foundation |
| 2 | `inheritance-diamond` | Inheritance & the Diamond Problem | Intermediate |
| 3 | `polymorphism` | Polymorphism: virtual, override, new, sealed | Intermediate |
| 4 | `abstract-vs-interfaces` | Abstract Classes vs Interfaces (Post C# 8) | Intermediate |
| 5 | `encapsulation-modifiers` | Access Modifiers & Encapsulation | Foundation |
| 6 | `static-vs-instance` | Static vs Instance Members | Foundation |
| 7 | `constructors` | Constructors, Chaining, Primary Constructors | Intermediate |
| 8 | `properties` | Properties: Auto, Computed, Init, Required | Intermediate |
| 9 | `indexers` | Indexers | Foundation |
| 10 | `partial-classes` | Partial Classes & Methods | Foundation |
| 11 | `initialization` | Object Initializers vs Constructors | Foundation |
| 12 | `composition-over-inheritance` | Composition Over Inheritance | Advanced |

### 15.4 Phase 3 — Intermediate C#

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `delegates` | Delegates: Func, Action, Predicate | Intermediate |
| 2 | `events` | Events & Event Patterns | Intermediate |
| 3 | `lambdas-closures` | Lambdas & Closures: The Capture Trap | Advanced |
| 4 | `linq-deferred` | LINQ: Deferred vs Immediate Execution | Intermediate |
| 5 | `linq-ienumerable-iqueryable` | IEnumerable vs IQueryable | Advanced |
| 6 | `linq-pitfalls` | LINQ Common Pitfalls | Advanced |
| 7 | `extension-methods` | Extension Methods: Rules & Best Practices | Intermediate |
| 8 | `generics-constraints` | Generics: Constraints | Intermediate |
| 9 | `generics-variance` | Generic Variance: in / out | Advanced |
| 10 | `iterators-yield` | Iterators: yield return / yield break | Intermediate |
| 11 | `pattern-matching` | Pattern Matching (C# 7 → 12) | Advanced |
| 12 | `tuples-deconstruction` | Tuples & Deconstruction | Foundation |
| 13 | `anonymous-types-records` | Anonymous Types vs Records vs ValueTuple | Intermediate |
| 14 | `collection-expressions` | Collection Expressions (C# 12) | Foundation |

### 15.5 Phase 4 — Memory, GC & Performance

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `managed-heap` | The Managed Heap: Gen 0/1/2, LOH, POH | Advanced |
| 2 | `gc-modes` | GC Modes: Workstation vs Server, Concurrent | Advanced |
| 3 | `loh-pitfalls` | Large Object Heap Pitfalls | Advanced |
| 4 | `finalizers-dispose` | Finalizers vs IDisposable | Intermediate |
| 5 | `dispose-pattern` | The Full Dispose Pattern | Advanced |
| 6 | `using-statements` | using / using var / await using | Intermediate |
| 7 | `span-memory` | Span<T> and Memory<T> | Expert |
| 8 | `ref-struct` | ref struct: Why They Exist | Expert |
| 9 | `stackalloc` | stackalloc | Expert |
| 10 | `arraypool` | ArrayPool<T> | Advanced |
| 11 | `valuetask-vs-task` | ValueTask vs Task | Advanced |
| 12 | `allocation-profiling` | Allocation Profiling Tools | Advanced |
| 13 | `object-pooling` | Object Pooling Patterns | Advanced |
| 14 | `string-allocations` | String Allocations & How to Avoid | Advanced |
| 15 | `escape-analysis-jit` | Escape Analysis & the JIT | Expert |

### 15.6 Phase 5 — Async/Await & Concurrency

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `tap-foundations` | Task-based Async Pattern Foundations | Intermediate |
| 2 | `async-state-machine` | How async/await Compiles (State Machine) | Advanced |
| 3 | `synchronization-context` | SynchronizationContext Deep Dive | Expert |
| 4 | `configure-await` | ConfigureAwait(false): When and Why | Advanced |
| 5 | `async-deadlocks` | Deadlocks: The Classic ASP.NET Trap | Advanced |
| 6 | `task-run-misuse` | Task.Run Misuse | Advanced |
| 7 | `cancellation-tokens` | CancellationToken Patterns | Intermediate |
| 8 | `iasyncenumerable` | IAsyncEnumerable<T> | Advanced |
| 9 | `channels` | System.Threading.Channels | Advanced |
| 10 | `lock-types` | Lock Types: lock, Monitor, Semaphore, RWLock | Advanced |
| 11 | `interlocked` | Interlocked Operations | Advanced |
| 12 | `memory-barriers` | Memory Barriers & volatile | Expert |
| 13 | `thread-pool-starvation` | Thread Pool Starvation | Advanced |
| 14 | `async-void` | async void: The Only Correct Use Case | Intermediate |
| 15 | `async-streams-backpressure` | Async Streams & Backpressure | Expert |
| 16 | `parallel-plinq-dataflow` | Parallel.For vs PLINQ vs TPL Dataflow | Advanced |

### 15.7 Phase 6 — SOLID & Design Principles

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `single-responsibility` | Single Responsibility Principle | Intermediate |
| 2 | `open-closed` | Open/Closed Principle | Intermediate |
| 3 | `liskov-substitution` | Liskov Substitution Principle | Advanced |
| 4 | `interface-segregation` | Interface Segregation Principle | Intermediate |
| 5 | `dependency-inversion` | Dependency Inversion Principle | Advanced |
| 6 | `dry-kiss-yagni` | DRY, KISS, YAGNI | Foundation |
| 7 | `law-of-demeter` | Law of Demeter | Intermediate |
| 8 | `tell-dont-ask` | Tell-Don't-Ask | Intermediate |
| 9 | `composition-inheritance` | Composition Over Inheritance | Advanced |
| 10 | `fail-fast` | Fail Fast | Intermediate |
| 11 | `least-astonishment` | Principle of Least Astonishment | Intermediate |

### 15.8 Phase 7 — Design Patterns

**Creational** (5)
- `singleton`, `factory-method`, `abstract-factory`, `builder`, `prototype`

**Structural** (7)
- `adapter`, `bridge`, `composite`, `decorator`, `facade`, `flyweight`, `proxy`

**Behavioral** (11)
- `chain-of-responsibility`, `command`, `interpreter`, `iterator`, `mediator`, `memento`, `observer`, `state`, `strategy`, `template-method`, `visitor`

**Modern/Architectural** (8)
- `repository`, `unit-of-work`, `specification`, `cqrs`, `options-pattern`, `result-pattern`, `null-object`, `pipeline-middleware`

Total: 31 lessons.

### 15.9 Phase 8 — Data Structures

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `arrays-lists-linkedlist` | Arrays vs List<T> vs LinkedList<T> | Foundation |
| 2 | `dictionary-internals` | Dictionary<K,V> Internals | Advanced |
| 3 | `hashset-sortedset` | HashSet vs SortedSet | Intermediate |
| 4 | `queue-stack-priorityqueue` | Queue, Stack, PriorityQueue | Intermediate |
| 5 | `concurrent-collections` | ConcurrentDictionary & Friends | Advanced |
| 6 | `immutable-collections` | Immutable Collections | Advanced |
| 7 | `frozen-collections` | FrozenDictionary (.NET 8+) | Advanced |
| 8 | `trees` | Trees: BST, AVL, Red-Black in BCL | Advanced |
| 9 | `graphs` | Graph Representations | Advanced |
| 10 | `big-o-bcl` | Big-O Analysis of BCL Operations | Intermediate |

### 15.10 Phase 9 — EF Core Deep Dive

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `dbcontext-lifetime` | DbContext Lifetime & DI | Advanced |
| 2 | `change-tracker` | Change Tracker & First-Level Cache | Advanced |
| 3 | `no-tracking` | AsNoTracking & Identity Resolution | Advanced |
| 4 | `loading-strategies` | Lazy vs Eager vs Explicit Loading | Advanced |
| 5 | `n-plus-one` | The N+1 Problem & Detection | Advanced |
| 6 | `iqueryable-expressions` | IQueryable & Expression Trees | Expert |
| 7 | `split-queries` | Split Queries (AsSplitQuery) | Advanced |
| 8 | `raw-sql` | Raw SQL: FromSqlInterpolated & Friends | Advanced |
| 9 | `migrations` | Migrations: Strategies & Production | Advanced |
| 10 | `concurrency-control` | Optimistic & Pessimistic Concurrency | Advanced |
| 11 | `transactions` | Transactions & Ambient Transactions | Advanced |
| 12 | `interceptors` | Interceptors: SaveChanges & Command | Expert |
| 13 | `compiled-queries` | Compiled Queries | Advanced |
| 14 | `shadow-properties` | Shadow Properties | Advanced |
| 15 | `owned-types` | Owned Types & Table Splitting | Advanced |
| 16 | `value-converters` | Value Converters | Advanced |
| 17 | `query-filters` | Global Query Filters (Soft Delete) | Advanced |
| 18 | `bulk-operations` | Bulk Operations: ExecuteUpdate/Delete | Advanced |
| 19 | `ef-performance` | EF Core Performance Profiling | Advanced |
| 20 | `ef-anti-patterns` | EF Core Anti-Patterns | Advanced |

### 15.11 Phase 10 — ASP.NET Core

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `host-builder` | Host & WebApplication Builder | Intermediate |
| 2 | `middleware-pipeline` | Middleware Pipeline (Order Matters) | Advanced |
| 3 | `builtin-middleware` | Built-in Middleware Tour | Intermediate |
| 4 | `custom-middleware` | Custom Middleware: 3 Patterns | Advanced |
| 5 | `di-lifetimes` | DI Lifetimes: Singleton, Scoped, Transient | Advanced |
| 6 | `captive-dependency` | The Captive Dependency Problem | Advanced |
| 7 | `controllers-vs-minimal` | Controllers vs Minimal APIs | Intermediate |
| 8 | `filters` | Filters: Authorization, Action, Exception | Advanced |
| 9 | `model-binding` | Model Binding & Validation | Intermediate |
| 10 | `auth-jwt` | Authentication: JWT | Advanced |
| 11 | `auth-cookies-oauth` | Authentication: Cookies, OAuth2, OIDC | Advanced |
| 12 | `authorization-policies` | Authorization: Policies & Requirements | Advanced |
| 13 | `routing` | Routing: Attribute, Conventional, Constraints | Intermediate |
| 14 | `kestrel` | Kestrel Internals & Configuration | Advanced |
| 15 | `caching` | Output Caching vs Response Caching | Advanced |
| 16 | `rate-limiting` | Rate Limiting (Built-in .NET 7+) | Advanced |
| 17 | `health-checks` | Health Checks | Intermediate |
| 18 | `problem-details` | Problem Details (RFC 7807) | Intermediate |
| 19 | `api-versioning` | API Versioning Strategies | Advanced |
| 20 | `openapi-swagger` | OpenAPI / Swagger Integration | Intermediate |

### 15.12 Phase 11 — Clean Architecture & DDD

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `clean-architecture-layers` | Clean Architecture Layers | Advanced |
| 2 | `onion-hexagonal-clean` | Onion vs Hexagonal vs Clean | Advanced |
| 3 | `dependency-rule` | The Dependency Rule | Advanced |
| 4 | `entities-value-objects` | Entities vs Value Objects | Advanced |
| 5 | `aggregates` | Aggregates & Aggregate Roots | Advanced |
| 6 | `domain-events` | Domain Events & Integration Events | Advanced |
| 7 | `bounded-contexts` | Bounded Contexts | Expert |
| 8 | `anti-corruption-layer` | Anti-Corruption Layers | Expert |
| 9 | `cqrs-mediatr` | CQRS with MediatR | Advanced |
| 10 | `repository-patterns` | Repository Pattern: Good & Bad | Advanced |
| 11 | `specification-pattern` | Specification Pattern | Advanced |
| 12 | `result-pattern` | Result Pattern vs Exceptions | Advanced |
| 13 | `unit-of-work` | Unit of Work | Advanced |
| 14 | `rich-vs-anemic-domain` | Rich vs Anemic Domain Model | Advanced |
| 15 | `ubiquitous-language` | Ubiquitous Language | Intermediate |
| 16 | `solution-structure` | Folder Structure for Clean Architecture | Advanced |

### 15.13 Phase 12 — System Design

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `cap-theorem` | CAP Theorem | Expert |
| 2 | `consistency-models` | Consistency Models | Expert |
| 3 | `caching-strategies` | Caching Strategies | Advanced |
| 4 | `redis-patterns` | Redis Patterns in .NET | Advanced |
| 5 | `message-brokers` | RabbitMQ vs Kafka vs Azure Service Bus | Expert |
| 6 | `saga-pattern` | Saga: Orchestration vs Choreography | Expert |
| 7 | `outbox-idempotency` | Outbox Pattern & Idempotency | Expert |
| 8 | `rate-limiting-algorithms` | Rate Limiting Algorithms | Advanced |
| 9 | `polly-resilience` | Circuit Breaker, Retry, Timeout, Bulkhead | Advanced |
| 10 | `observability` | OpenTelemetry: Logs, Metrics, Traces | Expert |
| 11 | `distributed-tracing` | Distributed Tracing & Correlation IDs | Advanced |
| 12 | `sharding` | Sharding Strategies | Expert |
| 13 | `read-replicas-cqrs` | Read Replicas & Infrastructure CQRS | Expert |
| 14 | `event-sourcing` | Event Sourcing Fundamentals | Expert |
| 15 | `microservices-vs-modular-monolith` | Microservices vs Modular Monolith | Expert |
| 16 | `api-gateway` | API Gateway Patterns | Advanced |
| 17 | `service-discovery` | Service Discovery | Advanced |
| 18 | `load-balancing` | Load Balancing Strategies | Advanced |
| 19 | `database-per-service` | Database per Service vs Shared DB | Expert |
| 20 | `zero-downtime-deployments` | Zero-Downtime Deployments | Expert |

### 15.14 Phase 13 — Hidden/Misleading Traps

| # | Lesson Slug | Title | Difficulty |
|---|---|---|---|
| 1 | `closure-loop-capture` | Closure Capture in for Loops | Advanced |
| 2 | `async-void-trap` | async void | Advanced |
| 3 | `configureawait-library` | ConfigureAwait Outside Library Code | Advanced |
| 4 | `datetime-now-vs-utc` | DateTime.Now vs UtcNow vs DateTimeOffset | Intermediate |
| 5 | `decimal-vs-double-trap` | decimal vs double in Financial Code | Foundation |
| 6 | `struct-mutability-collections` | Struct Mutability in Collections | Advanced |
| 7 | `linq-multiple-enumeration` | LINQ Multiple Enumeration | Intermediate |
| 8 | `ienumerable-parameter` | IEnumerable Parameter Mistaken for Collection | Intermediate |
| 9 | `dictionary-iteration-modification` | Dictionary Iteration & Modification | Intermediate |
| 10 | `string-concat-loops` | String Concatenation in Loops | Foundation |
| 11 | `tolist-on-iqueryable` | ToList on IQueryable | Advanced |
| 12 | `captive-dependency-trap` | Captive Dependency (Singleton → Scoped) | Advanced |
| 13 | `events-memory-leaks` | Events & Memory Leaks | Advanced |
| 14 | `task-wait-result` | Task.Wait / .Result | Advanced |
| 15 | `async-exception-swallowing` | Exception Swallowing in async | Advanced |
| 16 | `struct-equality-iequatable` | Equality on Custom Structs (IEquatable<T>) | Advanced |
| 17 | `gethashcode-stability` | GetHashCode Stability | Advanced |
| 18 | `enum-isdefined-perf` | Enum.IsDefined Performance | Advanced |
| 19 | `dbcontext-thread-safety` | DbContext Thread Safety | Advanced |
| 20 | `captured-variables-anonymous` | Captured Variables in Anonymous Methods | Advanced |

**Grand Total**: ~230 lessons across 13 phases.

---

## 16. Milestones & Phased Delivery

### 16.1 Milestone 1 — Foundation (Week 1–2)
- Scaffold Next.js project with all dependencies
- Configure Tailwind, shadcn/ui, MDX pipeline
- Build core layout (nav, footer, sidebar, theme toggle)
- Set up TypeScript strict mode, ESLint, Prettier
- Establish project structure

**Acceptance**: Project builds, renders layout, theme toggle works, MDX compiles.

### 16.2 Milestone 2 — Component Library (Week 2–3)
- Build all 14 reusable lesson components
- Document each component in Storybook or MDX examples
- Unit tests for interactive components

**Acceptance**: All components render correctly in light/dark modes, pass accessibility audit.

### 16.3 Milestone 3 — Page Templates (Week 3–4)
- Landing page (hero, roadmap, features)
- Phases index page
- Phase detail page
- Lesson page (with TOC, prev/next, sidebar)
- Progress dashboard skeleton

**Acceptance**: Navigation flows work end-to-end with placeholder content.

### 16.4 Milestone 4 — State & Interactivity (Week 4)
- Zustand progress store with localStorage persistence
- Challenge completion tracking
- Phase/total progress computation
- Bookmark functionality
- Theme persistence

**Acceptance**: Progress persists across reloads, challenges track attempts, dashboard reflects state.

### 16.5 Milestone 5 — Phase 1 Content (Week 5–6)
- Write and publish all 15 Phase 1 lessons
- Rich interactive content (≥ 2 challenges per lesson)
- All Microsoft Docs links
- Full review pass for quality

**Acceptance**: Phase 1 is production-ready, end-to-end learning experience validated.

### 16.6 Milestone 6 — Scaffolding Phases 2–13 (Week 6)
- `_meta.json` for each phase with metadata
- Index MDX per phase describing what's covered
- Placeholder MDX files for each lesson with TODO notice

**Acceptance**: Site shows full 13-phase structure, placeholders clearly marked.

### 16.7 Milestone 7 — Supplementary Pages (Week 6–7)
- Cheatsheet page with collapsible sections
- Glossary with A-Z index
- Challenges aggregation page
- About page

**Acceptance**: All nav links lead to polished pages.

### 16.8 Milestone 8 — Interview Mode & Search (Week 7–8)
- Interview Mode per-phase quiz with timer
- Client-side search with Fuse.js
- Command palette (⌘K)

**Acceptance**: Mock interview runs end-to-end, search returns relevant results.

### 16.9 Milestone 9 — Polish & Launch (Week 8)
- Animation polish (respecting reduced-motion)
- Keyboard shortcut coverage
- Mobile experience refinement
- Accessibility audit + fixes
- Performance audit + optimization
- SEO setup (meta tags, sitemap, robots.txt)
- README + CONTENT_GUIDE
- Deploy to Vercel

**Acceptance**: All quality gates met, site launches publicly.

### 16.10 Post-MVP (Ongoing)
- Populate Phase 2 content
- Populate Phase 3 content
- ...continue through Phase 13
- Add spaced repetition engine
- Integrate C# code execution (Piston API or .NET Fiddle)
- Print-to-PDF feature

---

## 17. Quality Bar & Acceptance Criteria

### 17.1 Code Quality
- [ ] TypeScript strict mode, zero `any`, zero suppressed errors
- [ ] ESLint passes with zero warnings
- [ ] Prettier formatted
- [ ] All components have prop types and JSDoc
- [ ] No console errors in production build
- [ ] No hydration warnings

### 17.2 Performance
- [ ] Lighthouse Performance ≥ 95 (mobile + desktop)
- [ ] FCP < 1.5s on simulated 4G
- [ ] LCP < 2.5s on simulated 4G
- [ ] CLS < 0.1
- [ ] Bundle size per route < 200 KB gzipped

### 17.3 Accessibility
- [ ] Lighthouse Accessibility ≥ 95
- [ ] Zero critical axe violations
- [ ] Full keyboard navigation
- [ ] Screen reader tested on VoiceOver + NVDA
- [ ] Color contrast meets WCAG AA

### 17.4 SEO
- [ ] Lighthouse SEO ≥ 95
- [ ] Unique meta tags per page
- [ ] OpenGraph images
- [ ] sitemap.xml generated
- [ ] robots.txt configured
- [ ] Structured data valid

### 17.5 Content Quality (Phase 1)
- [ ] 15/15 lessons published
- [ ] Each lesson ≥ 2 interactive components
- [ ] Each lesson has at least 1 Microsoft Docs link
- [ ] All code examples compile (validated)
- [ ] No typos (spellcheck + human review)
- [ ] Tone consistent across lessons

### 17.6 Browser Compatibility
- [ ] Works on latest Chrome, Firefox, Safari, Edge
- [ ] Works on mobile Safari (iOS 16+) and Chrome Android
- [ ] Graceful degradation on older browsers

### 17.7 Responsive
- [ ] Tested on 360px, 375px, 768px, 1024px, 1440px widths
- [ ] No horizontal scroll at any breakpoint
- [ ] Touch targets ≥ 44×44px on mobile
- [ ] Readable without zoom on mobile

---

## 18. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Content creation takes longer than scope allows | High | High | Start with Phase 1 fully, scaffold rest, expand progressively |
| MDX bundle size grows too large | Medium | Medium | Lazy-load MDX per route, tree-shake unused components |
| Monaco Editor bloats initial bundle | High | Medium | Lazy-load Monaco only on pages that need it |
| Browser localStorage filled (5-10MB cap) | Low | Low | Compress state, warn user at 80% usage |
| Dark mode inconsistencies | Medium | Low | Visual regression tests per theme |
| Accessibility violations in interactive components | Medium | High | Dedicated a11y audit per component |
| SEO competition for ".NET interview" keywords | High | Medium | Focus on unique value (depth + interactivity), long-tail keywords |
| User loses progress on browser clear | High | Low | Clearly document; plan cloud sync for post-MVP |
| C# code execution sandbox unavailable | High | Low | Start with read-only + .NET Fiddle deep-links |
| Content drift from modern .NET (e.g. C# 13 releases) | Medium | Medium | Version content; review quarterly; tag by .NET version |

---

## 19. Out of Scope

Explicitly **NOT** in scope for MVP or near-term roadmap:

- User authentication (email/password, OAuth)
- Cloud progress sync
- Payments, subscriptions, premium tiers
- Community features (comments, forums, user submissions, Q&A)
- Peer review / community content
- Native mobile apps (iOS/Android)
- Video tutorials / course videos
- Live coaching / tutoring integrations
- Multi-language (non-English) content
- AI chatbot / tutor
- Code execution server infrastructure (beyond external API integrations)
- LMS integrations (SCORM, xAPI)
- Corporate / team plans
- Certificates of completion
- Leaderboards / social features
- Email digests / newsletters
- Non-.NET content (Java, Python, Go, etc.)

---

## 20. Open Questions

The following require decisions before implementation:

1. **Branding**: Final product name? Logo?
2. **Domain**: Which domain to deploy to?
3. **Analytics**: Include Vercel Analytics at launch, or defer?
4. **Error tracking**: Sentry at launch, or defer?
5. **License**: Is content open-source? If yes, which license?
6. **GitHub**: Is the repo public? If yes, how should contributions be handled?
7. **Code execution**: Build sandbox integration now or wait for user demand?
8. **Memory Visualizer**: Build for MVP or defer? (Complex but pedagogically valuable)
9. **Spaced repetition**: Build lightweight version for MVP or defer entirely?
10. **.NET version targeting**: Pin to .NET 8 (LTS) or cover .NET 9+ features too?

---

## 21. Appendices

### 21.1 Appendix A — MDX Lesson Example (Reference)

```mdx
---
title: "Value Types vs Reference Types"
slug: "value-vs-reference-types"
order: 2
difficulty: "foundation"
readingTime: 12
status: "published"
tags: ["memory", "types", "fundamentals"]
summary: "The single most important distinction in C#. Get this wrong and nothing else makes sense."
docsLinks:
  - label: "Value types (C# reference)"
    url: "https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-types"
---

import { Callout, CodeChallenge, Quiz, ComparisonTable, MythBuster, DocsLink } from '@/components/lesson'

<Callout type="critical">
If you get this wrong in an interview, it's over. Let's nail it.
</Callout>

## The Two Families

All types in C# derive from `System.Object`, but they split into two families...

<ComparisonTable
  left={{
    title: "Value Types",
    items: ["struct", "enum", "primitives", "DateTime", "Guid", "ValueTuple"]
  }}
  right={{
    title: "Reference Types",
    items: ["class", "interface", "delegate", "string", "object", "arrays", "record class"]
  }}
/>

<MythBuster
  myth="Value types are on the stack, reference types are on the heap"
  truth="Storage location depends on context, not the type family. A struct field inside a class lives on the heap."
/>

## Interactive Challenge

<CodeChallenge
  id="struct-vs-class-copy"
  difficulty="foundation"
  prompt="Predict the output before revealing the answer."
  code={`struct PointS { public int X; public int Y; }
class   PointC { public int X; public int Y; }

var s1 = new PointS { X = 1, Y = 2 };
var s2 = s1;
s2.X = 99;

var c1 = new PointC { X = 1, Y = 2 };
var c2 = c1;
c2.X = 99;

Console.WriteLine($"{s1.X}, {c1.X}");`}
  options={["1, 1", "99, 99", "1, 99", "99, 1"]}
  correctAnswer={2}
  explanation="s2 = s1 copies the struct's data. c2 = c1 copies only the reference — both point to the same heap object."
/>

## Summary

- Value types copy on assignment; reference types share a pointer.
- `string` is a reference type but behaves value-like due to immutability.
- Storage location (stack vs heap) depends on context, not the type family.

<DocsLink href="https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/value-types">
  Official Microsoft Docs — Value Types
</DocsLink>
```

### 21.2 Appendix B — Placeholder MDX Format (For Scaffolded Lessons)

```mdx
---
title: "TODO: Lesson Title Here"
slug: "lesson-slug"
order: 1
difficulty: "foundation"
readingTime: 0
status: "draft"
tags: []
summary: "Coming soon."
---

import { Callout } from '@/components/lesson'

<Callout type="info">
🚧 **Content in progress.** This lesson will cover:

- Bullet 1
- Bullet 2
- Bullet 3

Check back soon, or start with a published lesson.
</Callout>
```

### 21.3 Appendix C — Glossary of Terms (Sample)

| Term | Definition |
|---|---|
| CLR | Common Language Runtime — the virtual machine that executes .NET IL |
| CTS | Common Type System — defines all types in .NET |
| CLS | Common Language Specification — subset of CTS for cross-language interop |
| BCL | Base Class Library — core standard libraries (`System.*`) |
| IL | Intermediate Language — compiled C# output, JIT-compiled at runtime |
| JIT | Just-In-Time compiler — converts IL to native machine code |
| GC | Garbage Collector — automatic memory management |
| LOH | Large Object Heap — for objects ≥ 85,000 bytes |
| POH | Pinned Object Heap — for pinned objects (.NET 5+) |
| TAP | Task-based Asynchronous Pattern |
| DI | Dependency Injection |
| SOLID | Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion |
| CQRS | Command Query Responsibility Segregation |
| DDD | Domain-Driven Design |
| ORM | Object-Relational Mapper |
| MVC | Model-View-Controller |
| AOT | Ahead-of-Time (compilation) |
| R2R | Ready-to-Run |
| NRT | Nullable Reference Types (C# 8+) |

### 21.4 Appendix D — References & Inspiration

**Learning Platforms**
- [Frontend Masters](https://frontendmasters.com)
- [Exercism](https://exercism.org)
- [Hyperskill](https://hyperskill.org)
- [Scrimba](https://scrimba.com)

**Documentation Sites**
- [Vercel Docs](https://vercel.com/docs)
- [React Docs](https://react.dev)
- [Supabase Docs](https://supabase.com/docs)

**.NET Resources**
- [Microsoft Learn](https://learn.microsoft.com/en-us/dotnet/)
- [.NET Blog](https://devblogs.microsoft.com/dotnet/)
- [Stephen Toub's Performance Posts](https://devblogs.microsoft.com/dotnet/author/toub/)
- [Andrew Lock's Blog](https://andrewlock.net)
- [Stephen Cleary's Blog](https://blog.stephencleary.com)

### 21.5 Appendix E — Approval & Sign-off

| Role | Name | Signature | Date |
|---|---|---|---|
| Product Owner | _____________ | _____________ | _____________ |
| Engineering Lead | _____________ | _____________ | _____________ |
| Design Lead | _____________ | _____________ | _____________ |
| Content Lead | _____________ | _____________ | _____________ |

---

**End of Document**

*This PRD is a living document. Updates tracked in changelog below.*

### Changelog

| Version | Date | Author | Changes |
|---|---|---|---|
| 1.0 | April 20, 2026 | Product Team | Initial PRD |