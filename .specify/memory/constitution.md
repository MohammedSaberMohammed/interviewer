# Interviewer-App Constitution

> Version: 1.0.0
> Ratified: 2026-04-20
> Last Amended: 2026-04-20

---

## Preamble

This constitution governs all development decisions for **Interviewer-app**, an interactive .NET senior interview preparation platform. It establishes immutable principles, technical constraints, and quality gates that every specification, plan, task, and implementation must satisfy.

---

## Article I — Core Principles

### Principle 1: Foundation-First Learning
All content teaches the *why* before the *how*. Lessons build mental models, not memorization lists. Every concept is grounded in how .NET actually works (CLR, GC, type system) rather than surface-level answers.

### Principle 2: Interactive-First
Passive reading is insufficient. Every lesson includes at least one interactive element (CodeChallenge, Quiz, MythBuster, or ComparisonTable). Users learn by predicting, failing, and understanding — not scrolling.

### Principle 3: Progressive Complexity
Content follows a strict junior → mid → senior progression. No phase assumes knowledge from a later phase. Prerequisites are explicit. Difficulty within a phase escalates gradually.

### Principle 4: Static & Client-Side Only (MVP)
No backend, no database, no authentication. All state lives in localStorage via Zustand. All pages are statically generated at build time. This is non-negotiable for MVP — it keeps complexity minimal and time-to-value instant.

### Principle 5: Accessibility is Not Optional
WCAG 2.1 Level AA compliance from day one. Full keyboard navigation, ARIA labels, visible focus indicators, `prefers-reduced-motion` respected, color contrast ratios met. Accessibility is a launch requirement, not a post-launch fix.

---

## Article II — Technical Constraints

### Section 1: Stack (Locked for MVP)
| Layer | Choice | Locked? |
|---|---|---|
| Framework | Next.js 15 (App Router, SSG) | Yes |
| Language | TypeScript (strict mode) | Yes |
| Styling | Tailwind CSS v4 | Yes |
| UI Primitives | shadcn/ui | Yes |
| Content | MDX with frontmatter | Yes |
| Code Highlighting | Shiki (dual-theme) | Yes |
| State Management | Zustand + persist middleware | Yes |
| Icons | Lucide React | Yes |
| Diagrams | Mermaid.js | Yes |
| Search | Fuse.js (client-side) | Yes |
| Theming | next-themes | Yes |
| Package Manager | pnpm | Yes |

### Section 2: Deferred Technologies
- **Monaco Editor**: Deferred to post-MVP. Use Shiki for all code rendering.
- **Framer Motion**: Use only where pedagogically valuable (challenge feedback, progress bars). No gratuitous animation.
- **Vercel deployment**: Deferred. Target localhost only for MVP.
- **Vercel Analytics / Sentry**: Deferred. No external services.

### Section 3: Content Targeting
- Primary: **.NET 8 LTS**
- Secondary: .NET 9 features where relevant (noted explicitly in lessons)
- Code examples must compile against .NET 8 SDK

### Section 4: Code Standards
- TypeScript `strict: true` — zero `any` types
- ESLint + Prettier enforced
- No `console.log` in production code
- No hydration warnings
- Components use explicit prop interfaces (no inline types)
- All interactive components track state via Zustand store

---

## Article III — Architecture Decisions

### AD-1: Static Site Generation
All lesson pages are pre-rendered at build time via Next.js SSG. No server-side rendering, no API routes, no dynamic data fetching at runtime.

### AD-2: MDX Content Pipeline
Content is authored as `.mdx` files with YAML frontmatter. Custom React components are embedded inline. Content is organized under `content/phases/{phaseSlug}/`.

### AD-3: Client-Side State
Progress (completed lessons, challenge answers, bookmarks, streaks) persists in `localStorage` under key `interviewer-app-progress-v1`. Zustand `persist` middleware handles serialization. No cross-device sync.

### AD-4: Client-Side Search
Fuse.js indexes all lesson metadata at build time, shipped as a static JSON file. No search infrastructure.

### AD-5: Component-Driven Lessons
All interactive elements are React components importable in MDX: `Callout`, `CodeChallenge`, `Quiz`, `ComparisonTable`, `MythBuster`, `DocsLink`, `CodePlayground`, `Diagram`, `MemoryVisualizer`, `DifficultyBadge`.

---

## Article IV — Quality Gates

### Gate 1: Type Safety
- `tsc --noEmit` passes with zero errors
- Zero `any` types (documented exceptions require inline justification)

### Gate 2: Lint & Format
- ESLint passes with zero warnings
- Prettier formatting enforced

### Gate 3: Accessibility
- Every interactive component has ARIA labels
- Full keyboard navigation (no mouse-only features)
- Color contrast ratios ≥ 4.5:1 body text, ≥ 3:1 large text
- `prefers-reduced-motion` disables non-essential animation

### Gate 4: Responsive
- Mobile-first design
- Tested at 360px, 768px, 1024px, 1440px
- No horizontal scroll at any breakpoint
- Touch targets ≥ 44×44px on mobile

### Gate 5: Content Quality (Phase 1)
- Each lesson has ≥ 2 interactive components
- Each lesson has ≥ 1 Microsoft Docs link
- All C# code examples are verified correct
- Consistent terminology across lessons

---

## Article V — Development Workflow

### Section 1: Branch Strategy
- `main` — stable, buildable at all times
- Feature branches: `feature/{feature-name}`
- Conventional commits enforced

### Section 2: Definition of Done
A task is "done" when:
1. Code compiles (`pnpm build` succeeds)
2. Type checks pass
3. Lint passes
4. Component renders correctly in light and dark mode
5. Keyboard navigation works
6. Mobile layout is correct

### Section 3: Content Authoring
- Follow the lesson structure template (Hook → Core → Visual → Challenge → Senior Insight → Summary → Docs)
- Use frontmatter schema defined in content data model
- Test MDX compilation before marking complete

---

## Article VI — Governance

### Section 1: Constitutional Authority
This constitution can only be amended by the project owner. Amendments must update the version and last-amended date.

### Section 2: Conflict Resolution
In case of conflict between this constitution and any specification, plan, or task — this constitution takes precedence.

### Section 3: Version Scheme
- MAJOR: Principle changes
- MINOR: New constraints or gates added
- PATCH: Clarifications or corrections
