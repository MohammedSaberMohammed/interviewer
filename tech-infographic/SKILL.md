---
name: tech-infographic
description: >
  Generates premium, poster-quality educational infographics for engineering, system design,
  and architecture concepts using GPT Image 2 via the Kie.ai API. Decision-driven and adaptive:
  picks the right emphasis (problem-led, solution-led, contrast, mechanism, trade-off, flow,
  or system) based on what the lesson is teaching, then builds a custom layout. Optimized
  for premium aesthetics — hero illustrations, gradient pills, grouped badge clusters, inline
  diagram annotations, and editorial-grade typography.
---

# Tech Infographic Generator (Adaptive Premium Edition)

Generate **premium educational infographic posters** that look like top-tier developer documentation or O'Reilly-grade reference posters.

This skill is **decision-driven**, not template-driven. You decide what the lesson is *actually teaching* — then build a layout around that emphasis. A pure-mechanism lesson does not need a "Problem" section. A trade-off lesson does not need a "Happy Path." A comparison lesson should make the comparison the centerpiece, not a side panel.

The reference quality bar is `frontend/public/infographics/guideline-source.png`. Read it before generating. Pass it to the API as a style reference image when possible.

---

## Core Philosophy

> **Less text. More graphics. Right emphasis for what's being taught.**

A premium infographic communicates through:
- **Icons and shapes** doing the heavy lifting — never paragraphs
- **One clear focal point** — the eye knows where to land first
- **Editorial polish** — hero illustration, gradient pills, grouped badges, footer signature
- **Whitespace** — every element has room to breathe
- **Inline annotations** — labels float on diagrams ("FAILURE OCCURS →", "Global Transaction 🔒") instead of sitting in separate boxes
- **One concept per slot** — no cramming
- **Emphasis matches lesson** — if the contrast is the lesson, the contrast gets the canvas

Reject any output where text density beats visual density, or where the focal point is unclear in 3 seconds.

---

## When to Generate (and When Not To)

### Generate for
- Design patterns (Mediator, CQRS, Saga, Repository, Factory, Observer)
- Architectural styles (microservices, layered, hexagonal, event-driven, MVC, Clean)
- System design concepts (load balancing, sharding, consistency models, replication)
- Distributed systems patterns (circuit breaker, bulkhead, retry, leader election, outbox)
- Trade-off frameworks (CAP, PACELC, latency vs throughput, consistency vs availability)
- Process and lifecycle flows (deployment pipelines, request lifecycles, OAuth, TLS)
- Architecture decisions (monolith vs microservices, SQL vs NoSQL, REST vs GraphQL)
- Protocol explainers (TLS handshake, TCP, BGP, gRPC, WebSocket)

### Skip for
- Language syntax features (code beats diagram)
- API or CLI reference documentation
- Concepts that fit in two sentences
- Anything where a code snippet beats a visual

---

## Output Specification

| Property | Value |
|----------|-------|
| Model | `gpt-image-2-text-to-image` (best text rendering and layout precision) |
| Format | PNG |
| Resolution | `2K` default; `4K` only for detail-heavy architectures (note: 1:1 cannot be 4K) |
| Save to | `frontend/public/infographics/` |
| Naming | `{topic-slug}.png` (kebab-case) |

After saving, reference in MDX:
```mdx
<img src="/infographics/{topic-slug}.png" alt="{Title} — {subtitle}" />
```

---

## Prerequisites

Kie.ai API key in `frontend/.env`:
```
KIE_API_KEY=your_api_key_here
```

Reference image: `frontend/public/infographics/guideline-source.png`. View it before generating.

---

# THE PIPELINE

---

## STEP 1 — Read the Source Content

Read the lesson MDX:
```
frontend/content/technologies/{tech}/phases/{phase-slug}/{lesson-file}.mdx
```

View `guideline-source.png` to anchor on the visual quality bar.

---

## STEP 2 — Decide What the Lesson Is Teaching (CRITICAL)

This is the most important step. Do not skip it. Do not pick a template until you have answered these questions.

### Question 1: What is the *primary* thing the reader should walk away understanding?

Choose ONE — not multiple:

- **A mechanism** — "How does X work internally?" (e.g., Mediator, Repository, Factory, hash table internals)
- **A failure-and-recovery story** — "What happens when X breaks, and how does it heal?" (e.g., Saga, Circuit Breaker, Retry with backoff)
- **A trade-off** — "What does X give up to get Y?" (e.g., CAP, consistency models, sync vs async)
- **A comparison** — "When do I pick A over B?" (e.g., SQL vs NoSQL, REST vs GraphQL, monolith vs microservices)
- **A system topology** — "What are the moving parts and how do they connect?" (e.g., Clean Architecture, microservices, URL shortener)
- **A protocol or process** — "What happens step-by-step over time?" (e.g., TLS handshake, OAuth flow, deployment pipeline)
- **A concept explainer** — "What is X and why does it matter?" (e.g., idempotency, eventual consistency, backpressure)

### Question 2: Does the lesson explicitly contrast a "before" with an "after"?

If YES → the contrast must be the centerpiece, regardless of which type you picked above.
If NO → do not invent a contrast. Skip the Problem section entirely.

### Question 3: Is failure-handling part of the lesson, or just a footnote?

If failure-handling is a **named part** of the concept (Saga's compensation, Circuit Breaker's open state, Retry's backoff) → it deserves its own dedicated panel.
If failure is mentioned only as a benefit ("more resilient") → do NOT create a failure panel. Make resilience a benefit badge.

### Question 4: Where should the visual focal point sit?

The focal point is whatever the reader should see first. It is one of:
- The **mechanism diagram** (for mechanism lessons)
- The **side-by-side contrast** (for comparison or before/after lessons)
- The **geometric core** (triangle, spectrum, quadrant — for trade-off lessons)
- The **system topology** (for architecture or system-design lessons)
- The **timeline / sequence** (for protocol or process lessons)

Whatever the focal point is, it gets ~50% of canvas real estate. Everything else supports it.

---

## STEP 3 — Build a Custom Layout from Composable Blocks

Forget rigid templates. Instead, pick from these blocks and arrange them around your focal point.

### Available Blocks

#### `header` (always present)
- Hero illustration in top-left corner (decorative — abstract nodes, network shapes, flowing lines)
- Large uppercase title (1–3 words ideal)
- **Gradient pill subtitle** — one short line on a colored gradient pill (purple→blue, teal→cyan, etc.)
- 1–2 sentence intro in dark gray
- **Grouped property card** in top-right — 2–4 property badges inside a single subtle-bordered card

#### `focal-mechanism`
- Large central diagram showing how the concept works
- Nodes connected by primary flow arrows
- Inline annotations float on the diagram (not in side boxes)
- ~50% of canvas

#### `focal-contrast` (Problem vs Solution / A vs B / Before vs After)
- Two equal cards side-by-side
- VS badge in the center (white circle, "VS" text, colored border)
- Each card has its own header bar, sub-statement, internal diagram, and 3 callout bullets
- Each card uses contrasting color theme (red/green for problem/solution; blue/purple for A/B comparisons)
- ~50% of canvas
- Use this when contrast IS the lesson

#### `focal-tradeoff`
- Geometric core (triangle, spectrum, quadrant, Venn) centered
- Vertices/axes labeled with single concept words
- Real systems mapped to positions inside
- ~50% of canvas

#### `focal-topology`
- Architecture diagram (concentric rings, stacked layers, distributed nodes)
- Each component: distinct color, icon, 1-2 word label, small caption outside the shape
- Arrows show data/dependency flow
- ~50% of canvas

#### `focal-timeline`
- Linear or vertical sequence between two actors
- Numbered alternating-color circles
- Action labels on arrows
- 1-line detail below each step
- ~50% of canvas

#### `success-path` (optional supporting block)
- Horizontal numbered sequence showing the happy path
- Each step: numbered circle + icon + 1-2 word label + checkmark
- Ends with "Confirmed" / "Done" state
- Bottom callout: "All steps succeed → outcome ✓"

#### `failure-recovery` (only when failure is part of the lesson)
- Same nodes as success path, but with one step marked with red X
- Backward dashed orange arrows showing compensation
- Each compensation arrow labeled with undo action
- Final state: "Compensated" or "Graceful failure"

#### `key-takeaways`
- 4–6 short statements with green checkmarks
- 2-column grid (preferred) or single row of icon cards
- Use icons + bold label + tiny detail line for premium feel

#### `real-world-example`
- Horizontal strip with 4–6 numbered items
- Each item: icon + 1-line scenario
- Used to ground the concept in a relatable scenario

#### `decision-criteria` (for comparison lessons)
- Two columns: "Pick A when" / "Pick B when"
- 3 checkmark bullets each
- Tight, scannable

#### `footer-signature` (always present, premium polish)
- Single thin strip at the bottom
- Two short statements separated by a vertical divider
- Each statement starts with a small icon or emoji (💡, ❤️, ⚡, 🎯)
- Examples:
  - "💡 Saga ensures consistency without sacrificing availability. | ❤️ Built for microservices. Built for scale."
  - "⚡ One pattern, infinite scale. | 🎯 Decoupled by design."

---

## STEP 4 — Layout Recipes by Emphasis

Now combine your focal block with supporting blocks. Some sample compositions:

### Mechanism-led (no contrast in lesson)
```
[header]
[focal-mechanism] (full width, 50% canvas)
[key-takeaways] + [real-world-example] (50/50 split)
[footer-signature]
```
Aspect: `3:4`

### Problem→Solution-led (contrast IS the lesson)
```
[header]
[focal-contrast] (Problem card | VS badge | Solution card, full width, 50% canvas)
[success-path] | [key-takeaways] (50/50 split)
[real-world-example] (full width strip)
[footer-signature]
```
Aspect: `16:9` or `4:3` (more horizontal canvas to fit the contrast)

### Failure-and-recovery-led (Saga, Circuit Breaker)
```
[header]
[focal-contrast] (Problem: 2PC | Solution: Saga, full width, 45% canvas)
[success-path] | [key-takeaways] (50/50 split, includes compensation row beneath success path)
[real-world-example] (full width strip)
[footer-signature]
```
Aspect: `4:3` or `16:9`

### Trade-off-led (CAP, PACELC)
```
[header]
[focal-tradeoff] (centered geometric core, 50% canvas)
[key-takeaways] (full width — examples mapped to vertices)
[footer-signature]
```
Aspect: `1:1`

### Comparison-led (SQL vs NoSQL)
```
[header]
[focal-contrast] (themed for A/B, not problem/solution)
[decision-criteria] (full width)
[real-world-example] (logos of real systems)
[footer-signature]
```
Aspect: `1:1` or `4:3`

### Topology-led (Clean Architecture, microservices)
```
[header]
[focal-topology] (centered, 60% canvas)
[key-takeaways] | [common-pitfalls] (50/50 split)
[footer-signature]
```
Aspect: `16:9`

### Timeline-led (TLS, OAuth)
```
[header]
[focal-timeline] (vertical sequence between two actors, 60% canvas)
[key-takeaways] (full width)
[footer-signature]
```
Aspect: `3:4`

**These are starting points, not contracts.** If the lesson needs a hybrid, build it. The rule is: one focal block, supporting blocks below, footer signature.

---

## STEP 5 — Word Economy Pass

Before writing the prompt, ruthlessly trim text:

- **Inside shapes/pills:** max 2 words, common English. "Validates" not "Validation Layer". "Send" not "Send Command".
- **Captions outside shapes:** max 7 words.
- **Step descriptions:** max 10 words.
- **Section titles:** max 4 words ("HOW IT WORKS", "KEY TAKEAWAYS", "FAILURE & RECOVERY").
- **Banish:** "the", "a", "is", "are" — almost always cuttable.
- **Banish:** parentheticals inside shapes — move to caption below.

If a label feels like it needs more words, **show it as a small caption underneath the shape**. Image-gen models render small text *outside* shapes far better than text *inside* shapes.

---

## STEP 6 — Build the Prompt

A premium prompt has 5 parts: **Style Anchor → Premium Polish Layer → Layout Skeleton → Content with Coordinates → Negative Constraints**.

### Style Anchor (always identical)

```
Premium educational infographic poster, clean modern flat-design illustration style.
White background (#FAFBFC). Soft shadows on rounded cards (radius 12px, shadow blur 20px,
opacity 8%). Crisp readable typography. Generous whitespace. Visual hierarchy with one
clear focal point. High-contrast monoline icons in flat geometric style. Editorial
documentation aesthetic — like a top-tier developer documentation poster from Stripe,
Linear, or Vercel. Match the visual style of the reference image.
```

### Premium Polish Layer (NEW — mandatory)

```
PREMIUM POLISH:
- Hero illustration in top-left corner: small abstract decorative graphic related to the
  topic (e.g., interconnected nodes, flowing data lines, geometric network shapes).
  Soft colors, monoline style, NOT the main diagram.
- Subtitle on a GRADIENT PILL — gradient from one accent color to another (purple to
  blue, teal to cyan, indigo to violet). Pill is large, prominent, white text inside.
- Property badges in top-right are GROUPED inside a single subtle-bordered card
  (1px border, very light gray, slight inner padding). Each badge: icon + bold label +
  one short descriptive line.
- Inline diagram annotations: labels like "Global Transaction 🔒" or "FAILURE OCCURS →"
  float ON the diagram with leader lines, NOT in separate boxes.
- Step state indicators: small green checkmark or red X overlaid on the top-right corner
  of each step card, not next to it.
- Footer signature: thin strip at the bottom with two short editorial statements separated
  by a vertical divider, each starting with a small icon or emoji. Italic or light weight.
- Subtle background tints differentiate sections without heavy borders (light green
  #F0FDF4 for success, light red #FEF2F2 for problem, light blue #EFF6FF for neutral).
```

### Layout Skeleton

Describe the spatial layout in plain English with explicit coordinates and percentages.
Use the recipe you picked in Step 4. Be specific about block sizes.

### Content with Coordinates

For each visual element, specify:
1. **Where** it goes (quadrant or coordinate)
2. **What shape** (rounded rectangle, circle, hexagon, pill)
3. **What color** (use design system palette, name the hex)
4. **What icon** is inside it
5. **What text** is inside it (max 2 words) and what caption is outside it
6. **Where arrows go** (from X to Y, color, solid/dashed)

### Negative Constraints (always identical)

```
NEGATIVE CONSTRAINTS:
- No dark background — light theme only, white #FAFBFC base
- No gibberish, no random characters, no misspelled labels
- No text inside small shapes longer than 2 words
- No 3D effects, no skeuomorphism, no clip art, no stock-photo imagery
- No overlapping text and arrows
- No more than ONE primary focal point
- No duplicate labels across the entire image
- No paragraphs — only short labels, captions, step descriptions
- No mixed icon styles — monoline throughout
- No inconsistent card sizes or spacing
- No section competing with the focal block for visual dominance
- Equal spacing between all sections (8pt grid rhythm)
- No flat plain-text subtitle — subtitle MUST be on a gradient pill
- No floating ungrouped property badges — they MUST be in a grouped card
- No missing footer signature

ICON RULES:
- Consistent monoline UI icons (Material/Heroicons style)
- All icons same size, centered in containers
- Each icon uses ONE color matching its context
- No emoji in main diagrams (emoji only allowed in footer signature)
- No 3D, no detailed illustrations, no clip art
```

---

## STEP 7 — Design System

### Colors (semantic, never random)

| Role | Hex | Use For |
|------|-----|---------|
| Success | `#10B981` | Solution, checkmarks, happy path |
| Failure | `#EF4444` | Problem, X marks, errors |
| Compensation | `#F59E0B` | Rollback, recovery, warnings |
| Flow | `#3B82F6` | Primary arrows, processes, header banners |
| Grouping | `#8B5CF6` | Boundaries, secondary, tags |
| Data | `#06B6D4` | Subtitle banners, events, signals |
| Text Primary | `#1E293B` | Titles, headers, labels |
| Text Secondary | `#64748B` | Subtitles, annotations |
| Background | `#FAFBFC` | Canvas |
| Card surface | `#FFFFFF` | Card fills |
| Subtle fill | `#F0FDF4` (green), `#FEF2F2` (red), `#FEF3C7` (orange), `#EFF6FF` (blue), `#F5F3FF` (purple) | Section backgrounds |

### Gradient Pairs for Subtitle Pills

| Gradient | When to Use |
|----------|-------------|
| Purple → Blue (`#8B5CF6 → #3B82F6`) | Default, works for most patterns |
| Teal → Cyan (`#14B8A6 → #06B6D4`) | Data, distributed systems, networking |
| Indigo → Violet (`#6366F1 → #A855F7`) | Architecture, system design |
| Emerald → Teal (`#10B981 → #14B8A6`) | Success-led, optimization concepts |
| Rose → Orange (`#F43F5E → #F59E0B`) | Failure modes, critical concepts |

### Visual Hierarchy

The focal block gets ~50% of visual weight. Header gets ~15%. Supporting blocks share ~30%. Footer gets ~5%.

**Rule:** Test by squinting. The focal block must still be obviously dominant.

### Spacing & Rhythm

- 8px — within cards
- 16px — between elements
- 24px — section padding
- 32px — section gaps

Equal spacing between sections. Aligned edges. No random gaps. No overlapping elements. Consistent card sizes.

### Component Consistency Lock

- All cards: same border radius (12px) and shadow style
- All icons: same style (monoline) and size
- All arrows: same curvature and stroke weight
- All badges: same pill style
- All spacing: 8pt grid

Reject if mixed styles detected.

### Icon System

**Style: Monoline outline icons only.** Medium consistent stroke. Rounded edges. No fills, gradients, 3D, or emoji-style.

**Color:** Each icon ONE color, inheriting context.

**Size:** All icons same size across the poster. Centered in containers. Consistent padding.

**Role mapping:**
- User/Client → person icon
- Service/API → server or box icon
- Database → cylinder icon
- Processing → gear icon
- Security → shield icon
- Success → checkmark
- Failure → X
- Compensation/retry → loop arrow
- Events/async → lightning bolt
- Messaging → envelope
- Network → globe
- Timeouts → clock
- Auth → key or lock

### Typography

- Title: massive, bold, dark navy `#1E293B` — biggest text on the poster
- Subtitle: white text on gradient pill — second-largest
- Section headers: bold, colored to match section theme, max 4 words
- Labels inside shapes: max 2 words, simple common English
- Captions outside shapes: max 5 words
- Descriptions: short phrases, never full sentences
- Footer signature: light weight, dark gray, italic optional

### Reduction Rule

Remove any element that does not improve understanding.

- Max 5–6 sections total
- Max 6 nodes in main flow
- No duplicate information
- No decorative elements without meaning (the hero illustration is the only allowed decoration)

### Final Design Check

Before generating, validate:
- Is the focal block instantly visible and dominant?
- Is the layout balanced with equal spacing?
- Any duplicated elements?
- Text minimal and readable?
- All icons consistent in style and size?
- Header has hero illustration + gradient pill + grouped badge card?
- Footer has signature strip?

If any answer is NO → refine before generating.

---

## STEP 8 — Validation Before API Call

Reject and revise if:

- ❌ Any label inside a shape exceeds 2 words
- ❌ Any concept appears as a label more than once
- ❌ A "Problem" section was added when the lesson doesn't contrast before/after
- ❌ A "Failure path" was added when failure isn't part of the named concept
- ❌ More than 6 elements in the focal block
- ❌ More than 5–6 total sections
- ❌ Focal block is NOT the largest element
- ❌ Layout has no clear focal point
- ❌ Mixed icon styles
- ❌ Inconsistent card sizes or spacing
- ❌ Aspect ratio doesn't match the chosen recipe
- ❌ Style anchor or premium polish layer or negative constraints missing from prompt
- ❌ Subtitle is plain text instead of gradient pill
- ❌ Property badges are floating instead of grouped in a card
- ❌ No footer signature
- ❌ No hero illustration in top-left

---

## STEP 9 — Call the API (GPT Image 2)

### Get the API key

```bash
export KIE_API_KEY=$(grep KIE_API_KEY frontend/.env | cut -d'=' -f2)
```

### Create the task

```bash
PROMPT_JSON=$(python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))" <<< "$PROMPT")

RESPONSE=$(curl -s -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"gpt-image-2-text-to-image\",
    \"input\": {
      \"prompt\": $PROMPT_JSON,
      \"aspect_ratio\": \"$ASPECT_RATIO\",
      \"resolution\": \"2K\"
    }
  }")

TASK_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['taskId'])")
echo "Task created: $TASK_ID"
```

### Aspect ratio per recipe

| Recipe | aspect_ratio |
|--------|-------------|
| Mechanism-led | `3:4` |
| Problem→Solution-led | `16:9` or `4:3` |
| Failure-and-recovery-led | `4:3` or `16:9` |
| Trade-off-led | `1:1` |
| Comparison-led | `1:1` or `4:3` |
| Topology-led | `16:9` |
| Timeline-led | `3:4` |

Supported: `auto`, `1:1`, `9:16`, `16:9`, `4:3`, `3:4`.

### Poll for completion

```bash
for i in $(seq 1 60); do
  RESULT=$(curl -s -X GET "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=$TASK_ID" \
    -H "Authorization: Bearer $KIE_API_KEY")
  STATE=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['state'])" 2>/dev/null)
  echo "Attempt $i: state=$STATE"
  if [ "$STATE" = "success" ]; then
    break
  elif [ "$STATE" = "fail" ]; then
    echo "FAILED: $RESULT"
    exit 1
  fi
  sleep 5
done
```

### Download the result

```bash
IMAGE_URL=$(echo "$RESULT" | python3 -c "
import sys, json
data = json.load(sys.stdin)
result = json.loads(data['data']['resultJson'])
print(result['resultUrls'][0])
")

mkdir -p frontend/public/infographics
curl -s -o "frontend/public/infographics/{topic-slug}.png" "$IMAGE_URL"
```

### Error codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Task accepted | Poll |
| 401 | Invalid API key | Check `KIE_API_KEY` |
| 402 | Insufficient credits | Top up at kie.ai |
| 422 | Validation error | Prompt likely too long — trim |
| 429 | Rate limited | Wait and retry |

---

## STEP 10 — Auto-Rejection & Iteration

After download, **view the image** and reject if any of these are present:

| Issue | Fix in next iteration |
|-------|----------------------|
| Garbled or misspelled labels | Reduce labels further; move long text outside shapes as captions |
| Duplicate labels | Rename to unique 1–2 word terms |
| Multiple disconnected focal points | Strengthen "ONE focal block, supporting blocks below" in prompt |
| Dark background | Repeat "WHITE background (#FAFBFC), light theme only" 3x |
| Plain text subtitle (no gradient pill) | Re-emphasize: "subtitle MUST be on a large gradient pill, white text inside" |
| Floating ungrouped badges | Re-emphasize: "property badges grouped inside a single bordered card" |
| Missing hero illustration | Add: "small abstract decorative graphic in top-left corner of header, monoline style" |
| Missing footer signature | Add: "thin footer strip with two short statements separated by vertical divider, each prefixed by a small icon" |
| No inline annotations | Add: "labels float on the diagram with leader lines, not in separate side boxes" |
| Plain text instead of pill badges | "rounded pill badge with colored fill" |
| Mixed icon styles | "monoline outline icons throughout, single stroke weight" |
| Crammed layout | Cut content; enforce 8pt grid spacing |
| Focal block not dominant | "focal block is LARGEST, ~50% of canvas, with thickest arrows" |
| Inconsistent card sizes | "all cards same dimensions and 12px border radius" |
| Forced Problem section where none exists | Re-do Step 2 — was the lesson actually contrasting before/after? If no, remove |
| Forced failure flow | Re-do Step 2 — is failure named in the concept? If no, remove |

Typical: 1–3 iterations to match reference quality.

---

## STEP 11 — Quality Verification Checklist

Before finalizing, verify against the reference image:

**Premium polish:**
- [ ] Hero illustration in top-left
- [ ] Subtitle on gradient pill (not flat text)
- [ ] Property badges grouped inside a bordered card
- [ ] Inline annotations on diagrams (not in separate boxes)
- [ ] Footer signature strip with two short statements

**Composition:**
- [ ] One clear focal block, dominant in size
- [ ] Layout matches the chosen recipe
- [ ] No section competes with focal block
- [ ] Equal spacing, aligned edges

**Content:**
- [ ] No "Problem" section unless lesson contrasts before/after
- [ ] No "Failure" panel unless failure is named in the concept
- [ ] Each section the lesson needs is present (no more, no less)

**Quality:**
- [ ] Light background (#FAFBFC)
- [ ] All text crisp and readable, zero garbled labels
- [ ] Icons consistent (monoline, same size, single color)
- [ ] Color palette matches design system
- [ ] No duplicate labels
- [ ] Aspect ratio matches recipe
- [ ] Aesthetic matches `guideline-source.png`

---

## STEP 12 — Finalize

1. Save with kebab-case filename: `{topic-slug}.png`
2. Verify file is at `frontend/public/infographics/{topic-slug}.png`
3. Provide MDX reference tag for the lesson
4. Delete intermediate or versioned files