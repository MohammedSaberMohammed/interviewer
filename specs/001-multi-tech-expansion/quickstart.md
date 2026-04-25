# Quickstart: Multi-Technology Expansion

**Date**: 2026-04-25
**Feature**: Multi-Technology Expansion

---

## Prerequisites

- Node.js 20+
- pnpm installed
- Working `frontend/` directory with existing .NET content

## Development Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Start dev server
pnpm dev
```

## Content Directory Structure

After implementation, content lives under:

```
frontend/content/technologies/
├── dotnet/
│   ├── _tech.json
│   └── phases/
│       ├── 01-csharp-core/
│       │   ├── _meta.json
│       │   └── *.mdx
│       ...
└── angular/
    ├── _tech.json
    └── phases/
        ├── 01-typescript-essentials/
        │   ├── _meta.json
        │   └── *.mdx
        ...
```

## Adding a New Technology

1. Create `content/technologies/{tech-slug}/` directory
2. Add `_tech.json` with technology metadata:
   ```json
   {
     "slug": "react",
     "title": "React",
     "subtitle": "React & TypeScript Interview Prep",
     "description": "...",
     "icon": "Atom",
     "color": "cyan",
     "status": "coming-soon",
     "order": 3,
     "defaultLanguage": "typescript",
     "docsBaseUrl": "https://react.dev",
     "keywords": ["React", "TypeScript", "frontend"],
     "estimatedTotalHours": 0
   }
   ```
3. Create `phases/` directory with phase subdirectories
4. Each phase needs a `_meta.json` following the existing schema
5. Add lesson `.mdx` files following the existing frontmatter schema
6. Set `status` to `"active"` once content is ready
7. Rebuild the site — no code changes needed

## Key Files to Understand

| File | Purpose |
|------|---------|
| `lib/content.ts` | Content loading pipeline — all filesystem reads |
| `lib/constants.ts` | UI config, nav items, gamification constants |
| `types/index.ts` | TypeScript interfaces for all entities |
| `stores/progressStore.ts` | Zustand store for progress tracking |
| `stores/basketStore.ts` | Zustand store for interview templates |
| `app/layout.tsx` | Root layout with providers |
| `app/page.tsx` | Landing page |
| `app/technologies/page.tsx` | Technology selection page (new) |
| `app/[techSlug]/` | All technology-scoped routes |

## URL Structure

```
/                                             → Landing page
/technologies                                 → Technology selection
/dotnet/phases                                → .NET phases
/dotnet/phases/01-csharp-core                 → Phase detail
/dotnet/phases/01-csharp-core/clr-cts-cls     → Lesson
/angular/phases                               → Angular phases
/angular/phases/01-typescript-essentials       → Phase detail
```

## Verification Checklist

After implementation, verify:

1. `pnpm build` completes successfully
2. Landing page at `/` shows branding (no .NET references)
3. Technology selection at `/technologies` shows .NET and Angular cards
4. `/dotnet/phases` shows all 13 .NET phases
5. `/angular/phases` shows all 13 Angular phases
6. Lesson pages render with interactive components
7. Progress tracking works independently per technology
8. Streaks are shared globally
9. Old `/phases/...` URLs redirect to `/dotnet/phases/...`
10. Search works with technology filtering
11. Light/dark mode works on all new pages
12. Mobile layout is correct at 360px
