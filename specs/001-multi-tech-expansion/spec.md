# Feature Specification: Multi-Technology Expansion

**Feature Branch**: `001-multi-tech-expansion`
**Created**: 2026-04-25
**Status**: Draft
**Input**: User description: "Expand from .NET-only to support multiple technologies, starting with Angular. Refactor landing page as branding/vision page, add technology selection page, then normal learning journey."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Brand-Aware Landing Page (Priority: P1)

A first-time visitor arrives at the site and sees a professional, technology-neutral branding page that communicates the platform's purpose: helping developers prepare for technical interviews across multiple technologies. The page conveys the vision, highlights key features, and guides the visitor to select a technology to study.

**Why this priority**: This is the first impression. Without a compelling, technology-neutral landing page, users won't understand the platform supports multiple technologies and may bounce.

**Independent Test**: Can be fully tested by loading the root URL (`/`) and verifying the branding, vision statement, feature highlights, and a clear call-to-action that leads to technology selection. Delivers value as a standalone marketing page.

**Acceptance Scenarios**:

1. **Given** a new visitor, **When** they navigate to the root URL (`/`), **Then** they see a branding page with the platform name, vision statement, feature highlights, and a prominent call-to-action to explore technologies.
2. **Given** a visitor on the landing page, **When** they click the primary CTA, **Then** they are navigated to the technology selection page.
3. **Given** a visitor on the landing page, **When** they view the page on mobile, **Then** the layout is fully responsive and all content is accessible.
4. **Given** a visitor on the landing page, **When** the page loads, **Then** no .NET-specific or any single-technology branding is visible — the page is technology-neutral.

---

### User Story 2 - Technology Selection Page (Priority: P1)

A visitor navigates to the technology selection page and sees a catalog of available technologies (e.g., .NET, Angular). Each technology card shows the technology name, icon/logo, number of phases and lessons, estimated total study hours, and a brief description. The visitor selects a technology to begin their learning journey.

**Why this priority**: This is the gateway to all content. Without technology selection, users cannot navigate to any learning material. Co-equal with P1 because the landing page CTA must lead somewhere functional.

**Independent Test**: Can be fully tested by navigating to the technology selection page and verifying all available technologies are displayed as cards with correct metadata, and clicking a technology navigates to its phases listing.

**Acceptance Scenarios**:

1. **Given** a visitor on the technology selection page, **When** the page loads, **Then** they see cards for each available technology with name, icon, phase count, lesson count, estimated hours, and a brief description.
2. **Given** a visitor viewing technology cards, **When** they click on ".NET", **Then** they are navigated to the .NET phases listing page showing the existing 13 phases.
3. **Given** a visitor viewing technology cards, **When** they click on "Angular", **Then** they are navigated to the Angular phases listing page showing all Angular phases.
4. **Given** only one technology has content published, **When** a visitor views the page, **Then** technologies without published content are either hidden or marked as "Coming Soon" (not clickable).

---

### User Story 3 - Angular Content Parity with .NET (Priority: P1)

An Angular developer selects "Angular" from the technology selection page and enters a structured learning journey mirroring the .NET experience: phases organized from fundamentals to advanced topics, each containing lessons with interactive elements (code challenges, quizzes, callouts, architecture diagrams). The content covers Angular-specific interview topics comprehensively.

**Why this priority**: Adding Angular content is the core deliverable — without it, the multi-technology feature is an empty shell. The content structure must match the depth and quality established by the .NET curriculum.

**Independent Test**: Can be fully tested by navigating to Angular phases, opening individual lessons, and verifying that MDX content renders correctly with interactive components (CodeChallenge, Quiz, Callout, etc.), and that all lesson metadata (difficulty, reading time, tags) is populated.

**Acceptance Scenarios**:

1. **Given** a user on the Angular phases page, **When** the page loads, **Then** they see a structured list of Angular phases covering fundamentals through advanced topics, each with title, level, lesson count, and estimated hours.
2. **Given** a user viewing an Angular phase, **When** they click a lesson, **Then** the lesson page renders with full MDX content including interactive components, code examples in TypeScript/HTML, and Angular-specific documentation links.
3. **Given** a user completing an Angular lesson, **When** they interact with code challenges and quizzes, **Then** the challenges use TypeScript/Angular code snippets and the explanations reference Angular concepts.
4. **Given** a user on any Angular lesson page, **When** they view the sidebar, **Then** they see all lessons within the current Angular phase with navigation and completion tracking.

---

### User Story 4 - Technology-Scoped Navigation (Priority: P2)

Once a user selects a technology, all navigation (navbar, sidebar, breadcrumbs, prev/next links) is scoped to that technology. The user can switch technologies at any time via a technology switcher in the navbar or by returning to the technology selection page.

**Why this priority**: Critical for usability but depends on P1 stories being complete. Users need clear context about which technology they're studying and easy ways to switch.

**Independent Test**: Can be tested by selecting a technology, navigating through phases and lessons, and verifying breadcrumbs, sidebar, and prev/next links only show content from the selected technology. Then switching technologies and verifying the scope changes.

**Acceptance Scenarios**:

1. **Given** a user has selected Angular, **When** they view any page, **Then** the navbar indicates the current technology and provides a way to switch or return to technology selection.
2. **Given** a user on an Angular lesson, **When** they view breadcrumbs, **Then** the breadcrumb trail shows: Home > Angular > Phase Name > Lesson Name.
3. **Given** a user on the last lesson of an Angular phase, **When** they click "Next", **Then** they are taken to the first lesson of the next Angular phase (not a .NET phase).
4. **Given** a user studying Angular, **When** they click a technology switcher, **Then** they can select a different technology and their view updates accordingly.

---

### User Story 5 - Technology-Scoped Progress Tracking (Priority: P2)

A user's progress (completed lessons, XP, streak, badges, challenge answers) is tracked independently per technology. The progress dashboard shows stats for the currently selected technology, with an option to view overall progress across all technologies.

**Why this priority**: Progress isolation prevents confusion (completing a .NET lesson shouldn't affect Angular progress). Depends on the technology selection being in place.

**Independent Test**: Can be tested by completing lessons in both .NET and Angular, then verifying that each technology's progress dashboard shows only its own completion data, XP, and badges.

**Acceptance Scenarios**:

1. **Given** a user who has completed 5 .NET lessons and 3 Angular lessons, **When** they view the Angular progress dashboard, **Then** they see 3 completed lessons and Angular-specific XP.
2. **Given** a user studying Angular, **When** they earn XP from an Angular quiz, **Then** the XP is recorded under Angular progress, not .NET.
3. **Given** a user on the progress page, **When** they toggle between technologies, **Then** the dashboard updates to show the selected technology's progress.

---

### User Story 6 - Technology-Scoped Challenges Explorer (Priority: P3)

The challenges explorer page filters and groups challenges by the selected technology. Users can practice code challenges and quizzes specific to their chosen technology.

**Why this priority**: Enhances the learning experience but is not required for the core learning journey. Users can still access challenges within individual lessons without this.

**Independent Test**: Can be tested by navigating to the challenges page with Angular selected, and verifying only Angular challenges appear, grouped by Angular phases.

**Acceptance Scenarios**:

1. **Given** a user with Angular selected, **When** they open the challenges explorer, **Then** they see only Angular challenges grouped by Angular phases and lessons.
2. **Given** a user switching from .NET to Angular in the challenges explorer, **When** the technology changes, **Then** the challenge list updates to show Angular-specific challenges.

---

### Edge Cases

- What happens when a user bookmarks a direct lesson URL (e.g., `/angular/phases/01-fundamentals/components`) and the technology hasn't been selected in their session?
  - The system should infer the technology from the URL path and set it as the active context.
- What happens when a user has progress in .NET and visits for the first time after Angular is added?
  - Existing .NET progress must be preserved. The user sees the new landing page and can select .NET to continue where they left off.
- What happens when a technology has zero published lessons?
  - The technology card should display "Coming Soon" and not be selectable.
- What happens when content is added to a technology after the user has already visited?
  - New lessons/phases appear automatically (static regeneration at build time).
- How does search work across technologies?
  - Search results should include the technology name and filter/group results by the active technology by default, with an option to search across all technologies.

## Clarifications

### Session 2026-04-25

- Q: Should each technology have fully independent content or share foundational phases (Design Patterns, SOLID, Data Structures)? → A: Each technology has fully independent content by default. Phases may only be shared when examples and explanations are 100% identical across technologies — in practice, nearly all content will be independent since each technology uses different languages and idioms.
- Q: Should daily streaks and XP/level be shared across technologies or isolated per technology? → A: Streaks are shared globally (studying any technology counts toward the daily streak). XP, level, and badges are isolated per technology.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a technology-neutral branding landing page at the root URL that communicates the platform's purpose and vision.
- **FR-002**: System MUST provide a technology selection page listing all available technologies with metadata (name, icon, phase count, lesson count, estimated hours, description).
- **FR-003**: System MUST support a content directory structure organized by technology, where each technology contains its own independent phases and lessons following the same schema as existing .NET content. Content is not shared across technologies unless examples and explanations are 100% identical.
- **FR-004**: System MUST render Angular lessons with the same interactive components (CodeChallenge, Quiz, Callout, ComparisonTable, MythBuster, ArchDiagram, etc.) as .NET lessons.
- **FR-005**: System MUST include technology context in all URL paths (e.g., `/dotnet/phases/...`, `/angular/phases/...`).
- **FR-006**: System MUST scope navigation (navbar, sidebar, breadcrumbs, prev/next) to the selected technology.
- **FR-007**: System MUST track user progress (completed lessons, XP, level, badges, challenge answers) independently per technology. Daily streaks are shared globally — studying any technology counts toward the streak.
- **FR-008**: System MUST preserve existing .NET content and user progress during the migration to the multi-technology structure.
- **FR-009**: System MUST support Angular content with TypeScript and HTML code examples highlighted correctly (already supported by existing CodeBlock component).
- **FR-010**: System MUST allow users to switch between technologies at any time without losing progress.
- **FR-011**: System MUST support technologies with "Coming Soon" status when no published content is available.
- **FR-012**: System MUST update the search index to include technology context and support filtering by technology.
- **FR-013**: System MUST provide an Angular curriculum with phases covering fundamentals through advanced interview topics, comparable in depth to the existing .NET curriculum.
- **FR-014**: System MUST scope the challenges explorer to the selected technology.
- **FR-015**: System MUST scope interview templates/baskets to the selected technology.

### Key Entities

- **Technology**: Represents a technology track (e.g., .NET, Angular). Has a slug, display name, icon, description, color scheme, and contains a collection of phases. Each technology is a top-level content directory.
- **Phase**: An existing entity that now belongs to a specific technology. Phases contain lessons organized by topic area. Phase metadata (`_meta.json`) remains unchanged in schema.
- **Lesson**: An existing entity within a phase. Lesson frontmatter (MDX) remains unchanged in schema. Code examples and documentation links are technology-specific.
- **User Progress**: Scoped per technology for completed lessons, XP, level, badges, and challenge answers. Daily streaks are tracked globally — studying any technology on a given day maintains the streak.
- **Technology Metadata**: A new metadata file (e.g., `_tech.json`) at each technology's content root, defining: slug, title, description, icon, color, status (active/coming-soon), and display order.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can discover and select from at least 2 technologies (.NET and Angular) within 10 seconds of landing on the site.
- **SC-002**: Angular curriculum contains at least 10 phases covering fundamentals through advanced topics, with at least 100 lessons total.
- **SC-003**: 100% of existing .NET content remains accessible and functional after the restructuring, with no broken links or missing lessons.
- **SC-004**: Users can complete the full learning journey (select technology -> browse phases -> read lessons -> take challenges) for Angular with the same interactive features available in .NET.
- **SC-005**: User progress (XP, level, badges, completed lessons) for each technology is tracked independently — completing a lesson in one technology does not affect progress in another. Daily streaks are shared globally across all technologies.
- **SC-006**: The landing page loads and renders within standard web performance expectations, with no technology-specific content visible.
- **SC-007**: Adding a new technology in the future requires only adding a content directory with the standard structure and a technology metadata file — no code changes needed.

## Assumptions

- The existing interactive components (CodeChallenge, Quiz, Callout, ComparisonTable, MythBuster, ArchDiagram, CodePlayground, MemoryVisualizer) are technology-agnostic and will work with Angular content without modification.
- The CodeBlock component already supports TypeScript and HTML syntax highlighting, which is sufficient for Angular code examples.
- Angular content will be authored as MDX files following the same frontmatter schema and component conventions as .NET content.
- Each technology maintains fully independent content. Even conceptually universal topics (e.g., Design Patterns, SOLID) are authored separately per technology with language-specific examples and idioms. Sharing is only permitted when content is 100% identical.
- Content for Angular will be generated using AI assistance, following the same quality standards and depth as the existing .NET curriculum.
- The existing localStorage-based persistence (Zustand stores) will be extended to support per-technology scoping without requiring a backend database.
- The application will remain a static Next.js site with no backend API — all content is loaded at build time from the filesystem.
- URL restructuring from `/phases/...` to `/{tech}/phases/...` will be handled via Next.js App Router dynamic routing, and existing bookmarked .NET URLs should redirect to their new paths.
- The branding/landing page replaces the current .NET-focused home page — there is no separate "marketing site".
- The app name and branding will remain "Interviewer App" (or similar) — a technology-neutral name suitable for multi-technology support.
