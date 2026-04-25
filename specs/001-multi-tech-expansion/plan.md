# Implementation Plan: Multi-Technology Expansion

**Branch**: `001-multi-tech-expansion` | **Date**: 2026-04-25 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/001-multi-tech-expansion/spec.md`

## Summary

Expand the interview prep platform from .NET-only to multi-technology, starting with Angular. This involves: (1) restructuring content directories to nest phases under technology slugs, (2) adding a `[techSlug]` dynamic route segment to all content pages, (3) creating a branding landing page and technology selection page, (4) refactoring content loading and progress stores to be technology-aware, (5) authoring a 13-phase Angular curriculum, and (6) updating search, navigation, and challenges to be technology-scoped.

## Technical Context

**Language/Version**: TypeScript (strict mode), React 19, Next.js 16.2.4
**Primary Dependencies**: next-mdx-remote, Zustand, Tailwind CSS v4, shadcn/ui, Shiki, Fuse.js, Lucide React
**Storage**: localStorage via Zustand persist middleware (no backend)
**Testing**: Manual verification (no test framework in current project)
**Target Platform**: Static site (SSG), localhost for MVP
**Project Type**: Web application (Next.js App Router, static export)
**Performance Goals**: Standard static site performance — all pages pre-rendered at build time
**Constraints**: No backend, no database, no authentication, no external services
**Scale/Scope**: 2 technologies (dotnet, angular), ~13 phases each, ~200+ lessons each, ~400+ total lessons

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Principle 1: Foundation-First | **AMENDMENT NEEDED** | Text says "how .NET actually works" — needs generalization to "how the technology actually works" |
| Principle 2: Interactive-First | PASS | Technology-agnostic principle |
| Principle 3: Progressive Complexity | PASS | Technology-agnostic principle |
| Principle 4: Static & Client-Side Only | PASS | No backend added |
| Principle 5: Accessibility | PASS | New pages follow same standards |
| Section 3: Content Targeting | **AMENDMENT NEEDED** | ".NET 8 LTS" needs to become per-technology targeting |
| Gate 5: Content Quality | **AMENDMENT NEEDED** | "Microsoft Docs link" → "official docs link"; "C# code examples" → "code examples for target language" |
| AD-2: MDX Content Pipeline | **AMENDMENT NEEDED** | Path reference needs updating |
| AD-3: Client-Side State | PASS | Store restructured but still localStorage/Zustand |
| All other gates | PASS | No conflicts |

**Action**: Propose constitution PATCH amendment (v1.0.1) to the project owner before implementation. All amendments are minor wording generalizations — no principles are changed.

## Project Structure

### Documentation (this feature)

```text
specs/001-multi-tech-expansion/
├── plan.md              # This file
├── research.md          # Phase 0 output — all research decisions
├── data-model.md        # Phase 1 output — entity definitions
├── quickstart.md        # Phase 1 output — setup guide
└── tasks.md             # Phase 2 output (created by /speckit-tasks)
```

### Source Code (repository root)

```text
frontend/
├── app/
│   ├── layout.tsx                          # UPDATE: generalize metadata
│   ├── page.tsx                            # REWRITE: branding landing page
│   ├── technologies/
│   │   └── page.tsx                        # NEW: technology selection page
│   ├── [techSlug]/
│   │   ├── layout.tsx                      # NEW: technology-scoped layout (optional)
│   │   ├── phases/
│   │   │   ├── page.tsx                    # MOVE + UPDATE: phases listing
│   │   │   ├── [phaseSlug]/
│   │   │   │   ├── page.tsx               # MOVE + UPDATE: phase detail
│   │   │   │   └── [lessonSlug]/
│   │   │   │       └── page.tsx           # MOVE + UPDATE: lesson page
│   │   ├── challenges/
│   │   │   ├── page.tsx                   # MOVE + UPDATE
│   │   │   └── [...path]/
│   │   │       └── page.tsx               # MOVE + UPDATE
│   │   ├── progress/
│   │   │   └── page.tsx                   # MOVE + UPDATE
│   │   ├── interview-templates/
│   │   │   ├── page.tsx                   # MOVE + UPDATE
│   │   │   └── [templateId]/
│   │   │       └── page.tsx               # MOVE + UPDATE
│   │   ├── cheatsheet/
│   │   │   └── page.tsx                   # MOVE + UPDATE
│   │   └── glossary/
│   │       └── page.tsx                   # MOVE + UPDATE
│   ├── about/
│   │   └── page.tsx                       # KEEP: global page (unchanged)
│   └── not-found.tsx                      # KEEP: unchanged
├── components/
│   ├── home/
│   │   ├── Hero.tsx                       # REWRITE: brand-focused hero
│   │   ├── FeatureGrid.tsx                # UPDATE: technology-neutral features
│   │   └── TechCard.tsx                   # NEW: technology selection card
│   ├── layout/
│   │   ├── Navbar.tsx                     # UPDATE: add tech context + switcher
│   │   ├── Sidebar.tsx                    # UPDATE: accept techSlug prop
│   │   ├── NavPrevNext.tsx                # UPDATE: tech-scoped URLs
│   │   └── Footer.tsx                     # UPDATE: remove .NET references
│   └── ...                                # Other components unchanged
├── content/
│   └── technologies/                       # NEW: restructured content root
│       ├── dotnet/
│       │   ├── _tech.json                 # NEW: .NET technology metadata
│       │   └── phases/                    # MOVED from content/phases/
│       │       ├── 01-csharp-core/
│       │       ...
│       │       └── 13-traps/
│       └── angular/
│           ├── _tech.json                 # NEW: Angular technology metadata
│           └── phases/                    # NEW: all Angular content
│               ├── 01-typescript-essentials/
│               ...
│               └── 13-angular-traps/
├── lib/
│   ├── content.ts                         # UPDATE: add techSlug to all functions
│   ├── constants.ts                       # UPDATE: nav items, remove .NET refs
│   └── utils.ts                           # KEEP: unchanged
├── stores/
│   ├── progressStore.ts                   # REWRITE: per-technology state
│   └── basketStore.ts                     # UPDATE: add techSlug to baskets
├── types/
│   └── index.ts                           # UPDATE: add TechnologyMeta, update interfaces
└── mdx-components.tsx                      # KEEP: unchanged
```

**Structure Decision**: Single Next.js web application (frontend-only). Content restructured under `content/technologies/` with per-technology phase directories. No new projects or services added. This matches the existing architecture (static site, client-side state) and the constitution's "Static & Client-Side Only" principle.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Constitution amendments (4 items) | Multi-technology support requires generalizing .NET-specific wording | Keeping .NET-specific wording would contradict multi-tech goals |

## Implementation Phases

### Phase A: Foundation (Content & Types)

**Goal**: Restructure content directories and update the type system.

1. **Create `TechnologyMeta` interface** in `types/index.ts`
2. **Add `techSlug`/`techTitle` fields** to `ExtractedChallenge`, `SearchEntry`, `Lesson`
3. **Create `TechnologyProgress` interface** for per-tech progress state
4. **Move .NET content**: `content/phases/*` → `content/technologies/dotnet/phases/*`
5. **Create `_tech.json`** for dotnet
6. **Update `CONTENT_DIR`** constant in `lib/constants.ts`
7. **Refactor `lib/content.ts`**:
   - Add `getAllTechnologies()`, `getTechMeta(techSlug)`
   - Parameterize all existing functions with `techSlug`
   - Update `buildSearchIndex()` and `getAllChallenges()` to iterate technologies
   - Update paths: `content/technologies/{techSlug}/phases/{phaseSlug}/`

**Key files:**
- `frontend/types/index.ts` (lines 14–160, 177–187)
- `frontend/lib/content.ts` (line 6: CONTENT_DIR, all function signatures)
- `frontend/lib/constants.ts` (line 127: CONTENT_DIR)

### Phase B: Routing & Pages

**Goal**: Add `[techSlug]` dynamic segment and create new pages.

1. **Create `app/technologies/page.tsx`** — technology selection grid
2. **Rewrite `app/page.tsx`** — branding landing page (technology-neutral)
3. **Create `app/[techSlug]/` directory** and move all existing route pages into it
4. **Update all moved pages** to:
   - Read `params.techSlug`
   - Pass `techSlug` to content loading functions
   - Update `generateStaticParams()` to iterate technologies
   - Update `generateMetadata()` to include technology name
5. **Update breadcrumbs** to include technology level
6. **Add redirect** from old `/phases/...` to `/dotnet/phases/...`

**Key files:**
- `frontend/app/page.tsx` (full rewrite)
- `frontend/app/phases/page.tsx` → `frontend/app/[techSlug]/phases/page.tsx`
- `frontend/app/phases/[phaseSlug]/page.tsx` → `frontend/app/[techSlug]/phases/[phaseSlug]/page.tsx`
- `frontend/app/phases/[phaseSlug]/[lessonSlug]/page.tsx` → `frontend/app/[techSlug]/phases/[phaseSlug]/[lessonSlug]/page.tsx`
- All other route pages similarly moved

### Phase C: Navigation & Layout

**Goal**: Update all navigation components to be technology-aware.

1. **Update `app/layout.tsx`**: Generalize metadata (remove .NET references)
2. **Update `Navbar.tsx`**: Add technology context indicator and tech switcher dropdown
3. **Update `Sidebar.tsx`**: Accept and use `techSlug` prop for lesson links
4. **Update `NavPrevNext.tsx`**: Generate tech-scoped URLs
5. **Update `constants.ts`**: Parameterize `NAV_ITEMS` to use `techSlug` in href paths
6. **Update `Footer.tsx`**: Remove .NET-specific references
7. **Update `SearchProvider`**: Add technology filtering to search results

**Key files:**
- `frontend/app/layout.tsx` (lines 24–32: metadata)
- `frontend/components/layout/Navbar.tsx` (lines 50–69: nav items, 24–47: logo/branding)
- `frontend/components/layout/Sidebar.tsx` (lines 10–15: props)
- `frontend/components/layout/NavPrevNext.tsx` (lines 5–14: props)
- `frontend/lib/constants.ts` (lines 114–119: NAV_ITEMS)

### Phase D: State Management

**Goal**: Refactor progress and basket stores for per-technology scoping.

1. **Rewrite `progressStore.ts`**:
   - Restructure state with `technologies: Record<string, TechnologyProgress>`
   - Keep streaks, preferences, daily counters at global level
   - All actions take `techSlug` as first parameter
   - All selectors take `techSlug` as first parameter
   - Add v1 → v2 migration in Zustand persist `migrate` function
   - Update storage key to `interviewer-app-progress-v2`
2. **Update `basketStore.ts`**:
   - Add `techSlug` to `Basket` and `BasketQuestion`
   - Update storage key to `interviewer-app-baskets-v2`
   - Add migration logic
3. **Update all components** that consume stores to pass `techSlug`

**Key files:**
- `frontend/stores/progressStore.ts` (full rewrite)
- `frontend/stores/basketStore.ts` (update)
- All components using `useProgressStore` or `useBasketStore`

### Phase E: Angular Content Authoring

**Goal**: Create the full Angular curriculum.

1. **Create `content/technologies/angular/_tech.json`**
2. **Create 13 phase directories** with `_meta.json` for each
3. **Author lesson MDX files** for all 13 phases (~170 lessons)
   - Use TypeScript/HTML code examples
   - Include interactive components (CodeChallenge, Quiz, Callout, etc.)
   - Add Angular official docs links
   - Follow frontmatter schema (same as .NET lessons)
4. **Add `angular` language** to Shiki config if not already present (HTML is needed)
5. **Verify content renders** correctly at build time

**Content generation approach**: AI-assisted authoring following the same quality standards and lesson structure (Hook → Core → Visual → Challenge → Senior Insight → Summary → Docs) as .NET content.

**Angular phases (13 total):**

| # | Slug | Title | Level |
|---|------|-------|-------|
| 01 | 01-typescript-essentials | TypeScript Essentials | Junior |
| 02 | 02-angular-fundamentals | Angular Fundamentals | Junior |
| 03 | 03-dependency-injection | Dependency Injection | Mid |
| 04 | 04-component-architecture | Component Architecture | Mid |
| 05 | 05-routing-navigation | Routing & Navigation | Mid |
| 06 | 06-rxjs-reactive | RxJS & Reactive Patterns | Mid |
| 07 | 07-forms-validation | Forms & Validation | Mid |
| 08 | 08-state-management | State Management | Senior |
| 09 | 09-performance-optimization | Performance & Optimization | Senior |
| 10 | 10-testing-strategies | Testing Strategies | Senior |
| 11 | 11-security-patterns | Security Patterns | Senior |
| 12 | 12-advanced-angular | Advanced Angular | Senior |
| 13 | 13-angular-traps | Angular Interview Traps | Senior |

### Phase F: Verification & Polish

**Goal**: End-to-end verification and cleanup.

1. **Build verification**: `pnpm build` succeeds with no errors
2. **Type check**: `pnpm tsc --noEmit` passes
3. **Lint**: `pnpm lint` passes
4. **Visual verification**:
   - Landing page: branding, no .NET references
   - Technology selection: .NET and Angular cards
   - .NET journey: all 13 phases, lessons render correctly
   - Angular journey: all 13 phases, lessons render correctly
   - Progress tracking: independent per technology
   - Streaks: shared globally
   - Search: technology-scoped
   - Challenges: technology-scoped
   - Baskets: technology-scoped
5. **Backward compatibility**: Old `/phases/...` URLs redirect to `/dotnet/phases/...`
6. **Responsive**: Test at 360px, 768px, 1024px, 1440px
7. **Dark/light mode**: All new pages work in both themes

## Dependencies Between Phases

```
Phase A (Foundation) ──→ Phase B (Routing)
                    ──→ Phase D (State)
                    ──→ Phase E (Content)

Phase B (Routing)   ──→ Phase C (Navigation)

Phase C + D + E     ──→ Phase F (Verification)
```

Phases B, D, and E can proceed in parallel after Phase A completes. Phase C depends on Phase B. Phase F is the final verification after all other phases complete.
