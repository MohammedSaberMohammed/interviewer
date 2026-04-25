# Upgrade Prompt — Gamify the .NET Senior Interview Prep Platform

## 🎯 Context

You previously built (or are building) a Next.js 15 + Tailwind + shadcn/ui + MDX learning platform for .NET engineers, following the PRD at `docs/PRD-dotnet-interview-prep.md`. The existing architecture, tech stack, routes, component naming conventions, content pipeline, and design tokens MUST be preserved.

This prompt adds a **gamification layer** on top of what already exists. Do not tear down. Do not migrate to a different framework. Do not rename existing files. You are *extending* the design language — not replacing it.

---

## 🔒 Non-Negotiable Constraints (Read First)

1. **Keep the existing stack as-is**: Next.js 15 App Router, TypeScript strict, Tailwind v4, shadcn/ui, MDX with frontmatter, Zustand + persist, Fuse.js, next-themes, Framer Motion. No new frameworks. No rewrites.
2. **Keep the existing design tokens**: `dotnet-purple #512BD4` primary, Inter font for UI, JetBrains Mono for code, slate neutrals, light + dark mode parity. All new gamified components must use the existing token system — do not introduce a parallel color palette.
3. **Keep existing routes and MDX lesson files**: `/phases`, `/phases/[phaseSlug]`, `/phases/[phaseSlug]/[lessonSlug]`, `/challenges`, `/cheatsheet`, `/glossary`, `/progress`, `/about` all remain. Existing MDX content keeps working without rewrites.
4. **Keep existing reusable components functional**: `<Callout>`, `<CodeChallenge>`, `<Quiz>`, `<ComparisonTable>`, `<MythBuster>`, `<DocsLink>`, `<Diagram>`, `<DifficultyBadge>`, `<PhaseProgressBar>`, `<NavPrevNext>`, `<TableOfContents>` — all still render. Lessons authored before this upgrade must still display correctly.
5. **Dark mode parity is mandatory for every new element**. No light-mode-only components.
6. **Zero regressions**: existing Lighthouse scores, existing TypeScript strictness, existing accessibility standards must be maintained or improved.

---

## 🎮 The Upgrade — What to Add

The user has asked for a hybrid experience: **gamified by default, with a long-form reading toggle for people who want the article feel**. The gamification should feel like a premium layer — polished micro-interactions, subtle XP celebrations, streak pressure — without turning the product into a childish app. Think Brilliant.org or modern Duolingo web, not elementary-school Khan Academy.

Add seven new systems:

### 1. Quest Mode (Primary Lesson Experience)
Convert the lesson page experience to a **quest-based micro-progression** by default. Each lesson becomes a sequence of 4–10 small "steps" rather than one long scroll. MDX content is parsed into steps at component boundaries — specifically, each `<CodeChallenge>`, `<Quiz>`, or `<QuestStep>` marker creates a step boundary. Intro prose before the first step = step 0 (context). After the last step, user sees completion screen.

Requirements:
- A sticky HUD bar at the top of every lesson showing: step progress (segmented bar, Duolingo-style), streak flame with count, XP delta earned in this session, a close/exit button that returns to phase page.
- Keyboard navigation: `Enter` submits answer, `→` advances to next step after correct answer, `Esc` opens exit confirmation.
- Each step renders one "block" at a time. User must interact (answer, tap continue) to reveal the next block. No infinite scroll.
- Completion screen at end of lesson: XP earned, streak bump, unlock animation, "Next quest" CTA linking to next lesson in phase.

### 2. XP System
Award XP for:
- Completing a step: 10 XP
- Correct on first try: +10 XP bonus
- Completing a full lesson: 50 XP
- Completing a phase: 500 XP
- Daily goal met (3 lessons/day default, configurable): 100 XP

Store XP in the existing Zustand progress store. Add a `xpTotal` number, `xpToday` number, `xpByLesson: Record<string, number>`, and a `dailyGoal` number (default 3 lessons). Display XP in HUD with a subtle number roll-up animation (200ms) when it increases.

### 3. Streak Tracking
A streak is the number of consecutive days the user completed at least 1 quest. If they miss a day, streak resets to 0 unless they use a "streak freeze" (earn 1 freeze per 5 days of streak, max 2 banked).

Store: `streakDays: number`, `streakFreezeCount: number`, `lastActiveDate: string` (YYYY-MM-DD).

Display:
- HUD flame icon with count.
- On streak increase, trigger a subtle flame-pulse animation.
- "Streak at risk" gentle nudge banner if user hasn't completed a quest by 8pm local time on a streak day.
- "Streak saved" celebration if a freeze is auto-used.

### 4. Level Progression
Four levels, mapped to the content difficulty:
- **Novice** (0–999 XP)
- **Apprentice** (1,000–4,999 XP)
- **Senior** (5,000–14,999 XP)
- **Architect** (15,000+ XP)

On level-up, show a full-screen modal celebration (respecting `prefers-reduced-motion` — fade instead of animation). Use existing dotnet-purple gradient. Include a brief message relevant to the level (e.g., "Apprentice: you've outgrown syntax questions. Ready for the internals?").

### 5. Daily Quest Widget
A small card on `/progress` (user dashboard) and the homepage `/` hero showing:
- Today's goal: "3 quests today" (or configurable)
- Progress: "1 of 3 done"
- Next best quest suggestion (link to a specific lesson — picked by recency + weakness)
- Streak status + freeze count

### 6. Achievement Badges
A minimal set of 12 earnable badges for MVP. Badges are unlocked silently in the background and surfaced via:
- Toast notification on unlock (bottom-right, 4s auto-dismiss, dotnet-purple accent)
- `/progress` page: badge collection grid
- Share button on each badge (generates a static shareable image — post-MVP; MVP uses a static Open Graph image per badge)

Initial badge list:
1. **First Trap Spotted** — Complete first Phase 13 challenge
2. **Async Master** — 100% accuracy on Phase 5
3. **Memory Wizard** — Complete Phase 4
4. **Streak Keeper** — 7-day streak
5. **Streak Legend** — 30-day streak
6. **Perfect Phase** — 100% accuracy on any full phase
7. **Foundation Solid** — Complete Phase 1
8. **Senior Certified** — Complete all 13 phases
9. **Night Owl** — Study between 10pm–4am 5 times
10. **Early Bird** — Study between 5am–8am 5 times
11. **Weekend Warrior** — Study Saturday and Sunday
12. **Trap Hunter** — Complete all of Phase 13

### 7. Long-Form Toggle (Important)
A single toggle at the top of every lesson page labeled "Read as article" (default off). When on:
- Lesson renders as continuous scrollable prose (the current design from PRD v1.0).
- HUD is dimmed/hidden.
- XP still awards but silently (no animations).
- Toggle preference persists in user's Zustand state.

This is the escape hatch for senior users who just want to read. Preserve it faithfully. Many users will toggle it on for Phase 4/5/12 (dense topics) and leave it off for Phase 1/2 (foundational).

---

## 🧩 New Components to Build

Place these in `components/quest/` (new subfolder — do not pollute `components/lesson/`):

### `<QuestHUD>`
Sticky top bar. Props: none (reads from Zustand). Contains: close button, step progress segmented bar, streak flame+count, XP delta badge. Dims opacity to 0.5 when user hovers into the content area below after 5s of inactivity (optional polish).

### `<QuestStepper>`
Visual representation of steps remaining in the current lesson. 4–10 horizontal segments. Filled = done, pulsing = current, empty = upcoming. Use dotnet-purple for current, success green for done, slate for upcoming.

### `<QuestStep>`
MDX component authors wrap a logical step. Props: `{ id: string; prompt?: string }`. The step's body is the children. Used to define step boundaries in MDX:
```mdx
<QuestStep id="intro">
  Short teaching block explaining one idea.
</QuestStep>

<QuestStep id="challenge-1" prompt="Which lifetime is safe here?">
  <CodeChallenge ... />
</QuestStep>
```

### `<TapToSpot>`
A code-highlighting interactive challenge. User is shown a code block with multiple "hotspots" (marked in MDX by wrapping suspicious code in a special syntax). User taps the line they think is buggy. Gets immediate red/green feedback. Uses existing Shiki highlighting underneath.

Props:
```ts
interface TapToSpotProps {
  id: string
  code: string
  language?: string
  hotspotLineNumbers: number[]   // user taps these to guess
  correctLineNumbers: number[]   // what's actually buggy
  prompt: string
  explanation: string
}
```

### `<CharacterTeach>`
A small card with a circular avatar (just "N" on dotnet-purple background for MVP — no illustration needed) and a short teaching message beside it. Max 2 sentences. Creates the "being taught by a character" feel without cartoon art.

Props: `{ children: React.ReactNode }`. The avatar is fixed.

### `<XPToast>`
Shows "+XX XP" in a small card that slides up from bottom-right, auto-dismisses after 2.5s. Rendered via a portal. Triggered imperatively from the Zustand store:
```ts
useProgressStore.getState().awardXP(20, 'Correct answer!')
```

### `<StreakBadge>`
Small flame+count component. Props: `{ count: number; at_risk?: boolean }`. `at_risk` adds a subtle orange pulse.

### `<AchievementToast>`
Bottom-right toast when a badge unlocks. Includes badge icon, title, and a subtle celebration (respects reduced-motion). Auto-dismiss 4s, or click to go to progress page.

### `<LevelUpModal>`
Full-screen overlay on level-up. Preserves existing shadcn `<Dialog>` component as the base.

### `<DailyQuestCard>`
Compact card for homepage/dashboard. Shows today's progress against the 3-quest daily goal, streak count, freeze count, and a "Start today's quest" CTA.

### `<QuestCompletionScreen>`
End-of-lesson screen. Shows: XP earned broken down by source, streak status, badges unlocked (if any), next lesson preview card with a big "Continue quest" CTA.

### `<ReadAsArticleToggle>`
Small pill toggle at top-right of lesson pages. Persisted in Zustand.

---

## 🗃️ Zustand Store Additions

Extend the existing progress store (don't create a new one):

```ts
interface ProgressState {
  // ... existing fields

  // Gamification additions
  xpTotal: number
  xpToday: number
  xpByLesson: Record<string, number>

  streakDays: number
  streakFreezeCount: number
  lastActiveDate: string | null  // 'YYYY-MM-DD' local

  level: 'novice' | 'apprentice' | 'senior' | 'architect'

  dailyGoal: number  // default 3
  lessonsCompletedToday: number
  lastDailyReset: string | null  // 'YYYY-MM-DD'

  unlockedBadges: string[]  // badge IDs
  
  preferences: {
    readAsArticle: boolean
    reduceMotion: boolean  // respects OS setting but can override
    hudDimOnIdle: boolean
  }

  // Actions
  awardXP: (amount: number, reason: string) => void
  recordLessonComplete: (phaseSlug: string, lessonSlug: string, accuracy: number) => void
  checkStreak: () => void  // run on app load; handles rollover + freeze logic
  useStreakFreeze: () => boolean
  unlockBadge: (badgeId: string) => void
  setReadAsArticle: (on: boolean) => void
  resetDailyCounters: () => void
}
```

Storage key: continue using existing key, just extend the shape. Migrate silently on first load (missing fields get defaults).

---

## 📝 MDX Authoring Upgrade

Existing MDX lessons (written before this upgrade) continue to work unchanged — they render in "article mode" by default since they lack `<QuestStep>` boundaries. Gradually, lessons can be re-authored to use quest mode by wrapping sections:

```mdx
---
title: "The Captive Dependency Problem"
slug: "captive-dependency"
difficulty: "advanced"
questMode: true   # NEW frontmatter flag — enables quest mode by default for this lesson
---

import { QuestStep, CharacterTeach, TapToSpot, CodeChallenge, Callout } from '@/components/quest'

<QuestStep id="hook">
  <CharacterTeach>
    A singleton is built once, lives forever. A scoped service is built fresh per request. What happens when the first eats the second?
  </CharacterTeach>
</QuestStep>

<QuestStep id="spot-the-bug" prompt="Which line creates the trap?">
  <TapToSpot
    id="captive-dep-spot"
    code={`services.AddSingleton<CartService>();
services.AddScoped<DbContext>();`}
    hotspotLineNumbers={[1, 2]}
    correctLineNumbers={[1]}
    prompt="Tap the registration that starts the trap."
    explanation="Once the singleton is built, it captures the first DbContext forever."
  />
</QuestStep>

<QuestStep id="deepen">
  <CharacterTeach>
    Because the singleton holds it, every user shares the same DbContext. Race conditions. Data leaks. Nightmare.
  </CharacterTeach>
</QuestStep>

<QuestStep id="solution" prompt="Which fix is safest?">
  <CodeChallenge
    id="captive-dep-fix"
    prompt="Pick the correct registration."
    options={["Both scoped", "Both singleton", "Both transient"]}
    correctAnswer={0}
    explanation="Matching lifetimes prevents capture. Both scoped is safe and idiomatic."
  />
</QuestStep>
```

If a lesson's frontmatter is `questMode: false` OR the lesson has no `<QuestStep>` boundaries, it renders as a long-form article (backward compatibility).

---

## 🎨 Visual Design Guidelines for New Components

All new components must feel native to the existing design language:

- **Corners**: Use `rounded-lg` (8px) for interactive elements, `rounded-xl` (12px) for cards, `rounded-2xl` (16px) for elevated cards like the QuestCard. Never `rounded-full` except on avatars, dots, and the flame.
- **Borders**: Default to `border border-slate-200 dark:border-slate-800`. On hover for interactive cards, shift to `border-slate-300 dark:border-slate-700`.
- **Shadows**: Minimal. Use `shadow-sm` for cards, never `shadow-lg` except on the QuestCompletionScreen hero panel.
- **Animations**: All between 120ms (hover) and 300ms (page-level). Never longer. Use Framer Motion for layout/transition; never CSS keyframes for anything user-facing except `pulse` on the current step indicator.
- **Gradients**: Allowed ONLY on the XP progress fill (`from-emerald-500 to-emerald-400`), the streak flame shine, and level-up modal background. Everything else stays flat.
- **Typography stays locked**: Inter 400/500, no 600 or 700. Headings: 20px (quest title), 18px (section), 15px (prompt), 14px (body), 13px (meta), 12px (labels), 11px (ribbon). Don't invent new sizes.
- **XP number formatting**: Always `font-variant-numeric: tabular-nums` so digits don't jump on increment.
- **Color semantics stay consistent**: success = emerald-600, warning = amber-500, danger = rose-500, info = dotnet-purple. Never mix palettes.
- **Dark mode**: Every new component must be tested in both modes. Never use `bg-white` without `dark:bg-slate-900`. Never use `text-slate-900` without `dark:text-slate-100`.

---

## ♿ Accessibility Requirements

- `prefers-reduced-motion`: flatten all celebration animations to simple opacity fades. No pulse, no shine, no spring animations for these users.
- XP toasts and achievement toasts must be announced via `aria-live="polite"` regions.
- Keyboard navigation: full support. Tab through choices, Enter to submit, arrow keys to select. Never require a mouse.
- Streak flame must not be the sole indicator of streak state — also include a numeric count with a proper `aria-label`.
- Level-up modal must trap focus and be dismissable via Esc.
- Touch targets on quest steps and choice buttons minimum 44×44px.

---

## 📊 Metrics to Track (Instrument From Day One)

Add these analytics events to the existing analytics pipeline (use a lightweight wrapper like `lib/analytics.ts` with no-op in dev):

- `quest_step_started` (lessonId, stepId, stepIndex)
- `quest_step_completed` (lessonId, stepId, correct, attempts, timeMs)
- `quest_lesson_completed` (lessonId, xpEarned, accuracy, totalTimeMs)
- `streak_day_earned` (streakCount)
- `streak_broken` (previousStreakCount)
- `streak_freeze_used` (remainingFreezes)
- `level_up` (fromLevel, toLevel, xpTotal)
- `badge_unlocked` (badgeId)
- `article_mode_toggled` (on)
- `daily_goal_met` (goalCount)

---

## 🚀 Execution Plan

Build in this order. Do not skip ahead — each step depends on the previous:

1. **Extend the Zustand store** with the new gamification state. Add migration logic that silently upgrades existing localStorage data. Write unit tests for streak rollover, XP awarding, and level calculation.

2. **Build the quest primitives**: `<QuestStep>`, `<QuestHUD>`, `<QuestStepper>`, `<CharacterTeach>`, `<XPToast>`, `<StreakBadge>`. Get these rendering cleanly in Storybook-style MDX examples first.

3. **Build the MDX quest-mode parser**: detects `<QuestStep>` boundaries and `questMode` frontmatter flag. Splits rendering into step-by-step flow vs continuous article flow. Preserve a scroll position fallback.

4. **Build the interactive challenge components**: `<TapToSpot>` (new), and ensure existing `<CodeChallenge>` and `<Quiz>` integrate with the XP + step system. Existing components should award XP through the store and trigger toasts automatically when used inside a `<QuestStep>`.

5. **Build the completion and level-up flows**: `<QuestCompletionScreen>`, `<LevelUpModal>`, `<AchievementToast>`, `<DailyQuestCard>`.

6. **Build the toggle**: `<ReadAsArticleToggle>` on every lesson page. Persist in Zustand. Respect it in the page layout.

7. **Instrument analytics**: wire up the event catalog above.

8. **Update Phase 1 lesson authoring**: take 2–3 existing Phase 1 lessons and re-author them in quest mode (wrap sections in `<QuestStep>`, add `<CharacterTeach>` intros, use `<TapToSpot>` where it fits). The remaining Phase 1 lessons can stay article-mode for now and be converted progressively.

9. **Update homepage and progress page**: add `<DailyQuestCard>`, streak widget, level badge, XP-to-next-level ring.

10. **Accessibility + reduced-motion pass**: test every new component with keyboard-only, screen reader, and reduced-motion on. Fix all violations before shipping.

11. **Dark mode audit**: toggle every new screen in dark mode. Fix contrast, shadow, and border issues.

---

## ✅ Acceptance Criteria

The upgrade is complete when:

- [ ] Existing MDX lessons without quest markers render as articles (unchanged behavior).
- [ ] 2–3 re-authored Phase 1 lessons render in quest mode with full step-by-step flow.
- [ ] HUD appears on quest-mode lessons, hidden on article-mode.
- [ ] XP awards correctly on step completion, lesson completion, phase completion.
- [ ] Streak increments on first daily quest; rolls over correctly at local midnight; freezes consume correctly.
- [ ] Level-up modal triggers at 1000, 5000, 15000 XP thresholds.
- [ ] 12 badges unlock correctly based on their criteria.
- [ ] "Read as article" toggle works on every lesson and persists.
- [ ] All new components pass accessibility audit (keyboard, screen reader, reduced motion).
- [ ] Dark mode parity maintained across every new element.
- [ ] No regressions in Lighthouse scores (≥ 95 Performance/A11y/Best Practices/SEO).
- [ ] No TypeScript errors, no ESLint warnings, no hydration errors.
- [ ] Bundle size per route increased by < 40 KB gzipped (measure before/after).

---

## 🚫 Don'ts

- Don't introduce a second UI library (no Radix directly — shadcn wraps it; no Chakra; no MUI).
- Don't add a gamification SDK (no Mixpanel game SDK, no proprietary XP lib). Build it in-house; it's simple.
- Don't move existing files. Additive only.
- Don't break the content authoring contract — old MDX must still render.
- Don't add sounds or audio feedback. Even if tempting. The product is studied at work and on commutes; audio is a liability.
- Don't make gamification inescapable — the article toggle is a contract with senior users.
- Don't add a social/friends system. The PRD explicitly scopes this out.
- Don't modify the .NET curriculum content structure — this is purely a presentation layer upgrade.

---

## 💡 Quality Bar

This upgrade should make the product feel more alive, not more childish. The bar is Brilliant.org on web — sophisticated gamification that senior engineers respect. If the result looks like a mobile kids' app, start over. If it looks like a focused desktop product with clever momentum mechanics, you've nailed it.

When this is done, ping the user with a summary of what was built, the files touched, screenshots of quest mode + article mode side by side, and a link to 2–3 converted lessons so they can feel the difference.

---

**Remember the prime directive: extend, don't replace. Keep what works. Layer on what delights.**