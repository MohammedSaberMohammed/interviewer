# 🎯 Interviewer App — Complete Design System & UI Architecture (Figma-Ready)

This document defines the **full design system, component library, and page-level design rules** for the Interviewer App.

It is based on the **latest refined visual direction**:

* Light mode
* Premium feel
* Soft gradients
* Full-width hero headers
* No unnecessary illustrations
* Clean, structured, scalable UI

---

# 🧠 1. DESIGN PRINCIPLES (NON-NEGOTIABLE)

### 1. Premium over playful

* No clutter
* No random colors
* Controlled use of gradients

### 2. Structure first

* Clear hierarchy
* Predictable layout
* Consistent spacing

### 3. Reusability

* Every UI element = component
* Never duplicate UI manually

### 4. Soft depth

* Subtle shadows
* Layered cards
* No harsh borders

---

# 🎨 2. DESIGN SYSTEM

## 🎨 Colors

### Primary

* `Primary / 500`: #6C5CE7
* `Primary / 600`: #5A4BD1
* `Primary Gradient`: linear-gradient(135deg, #6C5CE7 → #8A7CFF)

### Background

* `Background / Base`: #F8F9FC
* `Surface / Card`: #FFFFFF
* `Surface / Elevated`: #FFFFFF

### Borders

* `Border / Default`: #E6E8F0
* `Border / Subtle`: #F0F2F7

### Text

* `Text / Primary`: #1A1D2E
* `Text / Secondary`: #6B7280
* `Text / Muted`: #9CA3AF

### Semantic

* Success: #22C55E
* Warning: #F59E0B
* Info: #3B82F6

---

## ✍️ Typography

### Headings

* H1: 40–48px / bold (Hero)
* H2: 28–32px
* H3: 20–24px

### Body

* Default: 16px
* Small: 14px

### Labels

* 12–13px (badges, metadata)

---

## 📏 Spacing Scale

```
4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64
```

---

## 🔲 Radius

* `Card`: 16px
* `Input/Button`: 12px
* `Pill`: 999px

---

## 🌫️ Shadows

* Soft: `0 2px 8px rgba(0,0,0,0.04)`
* Medium: `0 6px 16px rgba(0,0,0,0.08)`
* Strong: `0 12px 32px rgba(0,0,0,0.12)`

---

# 🧩 3. COMPONENT LIBRARY

All components MUST use:

* Auto Layout
* Variants
* Design tokens

---

## 🔷 3.1 Navbar

### Structure

```
[ Logo ] [ Nav Links ]        [ Search ] [ Actions ]
```

### Behavior

* Sticky
* Subtle bottom border
* Active tab highlighted with pill

---

## 🔷 3.2 Hero Header (CRITICAL COMPONENT)

### Full-width container

* Height: 260–320px
* Background: gradient (very soft)

### Structure

```
[ Breadcrumb ]
[ Badge + Title ]
[ Description ]
[ Metadata Row ]
[ CTA Buttons ]
```

### Rules

* MUST be full width
* No heavy illustrations
* Subtle abstract shapes only

---

## 🔷 3.3 Cards System

### Base Card

* Background: white
* Radius: 16px
* Shadow: soft
* Padding: 16–24px

---

### Phase Card

Includes:

* Title
* Level badge
* Description
* Meta (time, lessons)
* Progress

Variants:

* Default
* Hover
* Completed

---

### Lesson Item

```
[ Checkbox ] [ Title ] [ Badge ] [ Duration ] [ Arrow ]
```

Variants:

* Default
* Hover
* Completed

---

### Challenge Item

```
[ Index ] [ Title ] [ Type Badge ] [ Difficulty ] [ Time ] [ Action ]
```

Variants:

* Quiz
* Code
* Active
* Completed

---

## 🔷 3.4 Sidebar Cards

Used for:

* Summary
* Resources
* Tips

Structure:

```
[ Title ]
[ Content List ]
```

---

## 🔷 3.5 Buttons

Variants:

* Primary (gradient)
* Secondary (outline)
* Ghost

States:

* Default
* Hover
* Disabled

---

## 🔷 3.6 Badges

Variants:

* Junior (green)
* Mid (blue)
* Senior (purple)
* Foundation / Intermediate

---

## 🔷 3.7 Progress Bar

* Height: 6–8px
* Rounded
* Gradient fill

---

## 🔷 3.8 Code Block

* Dark theme inside light UI
* Radius: 12px
* Copy button
* Language label

---

# 📱 4. PAGE DESIGNS

---

# 🏠 4.1 Landing Page (1)

## Sections

### Hero

* Full width
* Strong headline
* CTA buttons

### Learning Path

* Grid of phases
* Connected visually

---

# 🏠 4.2 Landing Page (2)

## Sections

### “What makes this different”

* 4–6 feature cards

### Phases Grid

* Reuse Phase Card

---

# 📚 4.3 Curriculum Phases Page

## Layout

* No hero
* Clean header

## Content

* Grid (3–4 columns desktop)
* Phase cards only

---

# 📖 4.4 Phase Details Page

## Hero

* Full width gradient
* Phase info

## Layout

```
[ Main Content ]   [ Sidebar ]
```

### Main

* Progress
* Learning outcomes
* Lessons list

### Sidebar

* Summary
* Resources

---

# 📘 4.5 Lesson Page (REFERENCE DESIGN)

## Layout

3 columns:

```
[ Left Nav ] [ Content ] [ Right TOC ]
```

### Content

* Sections
* Code blocks
* Callouts

---

# 🧪 4.6 Challenges Page

## Hero

* Full width
* Stats (total, quizzes, etc.)

## Layout

```
[ Filters Sidebar ] [ Challenge List ]
```

### Filters

* Search
* Difficulty
* Type
* Status

### Challenge List

* Grouped by topic
* Clean spacing
* Highlight active item

---

# 🎯 4.7 Single Challenge Page

## Layout

3 columns:

```
[ Left Sidebar ] [ Main Question ] [ Right Sidebar ]
```

---

### Left Sidebar

* Progress circle
* Navigation (question, options, explanation)

---

### Main Content

* Title
* Code block
* Question
* Options
* Submit button

---

### Right Sidebar

* Challenge info
* Tips

---

### Bottom Navigation

```
[ Previous ]                [ Next ]
```

---

# 📐 5. RESPONSIVE RULES

---

## Desktop

* 3-column layouts
* Full hero

---

## Tablet

* Collapse sidebar
* 2-column

---

## Mobile

* Single column
* Stack everything
* Sticky CTA

---

# ⚙️ 6. FIGMA IMPLEMENTATION RULES

---

## Auto Layout everywhere

* Vertical stacking
* Proper spacing

---

## Variants

* States handled inside components

---

## Naming Convention

```
Component / Type / State

Examples:
Button / Primary / Default
Card / Phase / Hover
Item / Lesson / Completed
```

---

## File Structure

### File 1: Design System

* Colors
* Typography
* Tokens

### File 2: Components

* All reusable components

### File 3: Screens

* Pages built from components

---

# 🚫 7. WHAT TO NEVER DO

* Don’t hardcode colors
* Don’t duplicate components
* Don’t mix styles
* Don’t change spacing randomly
* Don’t add random visuals

---

# 🧠 FINAL RULE

> If a UI element appears more than once — it MUST be a component.

---

This system ensures:

* Consistency
* Scalability
* Clean dev handoff
* Premium UI quality
