---
name: tech-infographic
description: >
  Generates premium, poster-quality infographic images for engineering patterns, system design,
  architecture decisions, distributed systems concepts, and technical comparisons using
  GPT Image 2 via the Kie.ai API. Adapts structure to the concept — failure/recovery patterns get
  failure flows, simple patterns stay simple, comparisons get side-by-side layouts, architectures
  get layered diagrams. Best-in-class text rendering and layout precision.
---

# Tech Infographic Generator (Adaptive Premium Edition)

Generate **premium educational infographic posters** for engineering content using **GPT Image 2** via the **Kie.ai API**.

This skill is **adaptive** — it selects the right template for the concept rather than forcing every topic into the same shape. A saga pattern gets failure/compensation flows. A mediator pattern gets a clean dispatch diagram. CAP theorem gets a triangle. Microservices gets a layered architecture.

The reference quality standard is `frontend/public/infographics/guideline-source.png` — read this file before generating, and **pass it to the API as a style reference image** so the model anchors to its aesthetic.

---

## Core Philosophy

> **Less text. More graphics. Right-sized structure for the concept.**

A premium infographic communicates through:
- **Icons and shapes** doing the heavy lifting, not paragraphs of label text
- **Visual hierarchy** — eyes know exactly where to start and where to go next
- **Whitespace** — every element has room to breathe
- **One concept per slot** — no cramming
- **Concept-fit structure** — the template matches what the concept actually is

Reject any output where text density beats visual density.

---

## When to Generate (and When Not To)

### Generate for:
- Design patterns (Mediator, CQRS, Saga, Repository, Factory, Observer, etc.)
- Architectural styles (microservices, layered, hexagonal, event-driven, MVC)
- System design concepts (load balancing, sharding, consistency models, replication)
- Distributed systems patterns (circuit breaker, bulkhead, retry, leader election)
- Trade-off frameworks (CAP, PACELC, latency vs throughput, consistency vs availability)
- Process/lifecycle flows (deployment pipelines, request lifecycles, OAuth flows)
- Architecture decisions (monolith vs microservices, SQL vs NoSQL, REST vs GraphQL)
- Protocols and how-they-work explainers (TLS handshake, TCP, BGP, gRPC)

### Skip for:
- Language syntax features explained better with code
- API/CLI reference documentation
- Concepts that fit in two sentences
- Anything where a code snippet beats a diagram

---

## Output Specification

| Property | Value |
|----------|-------|
| Model | `gpt-image-2-text-to-image` (best text rendering and layout precision of any image-gen model) |
| Format | PNG |
| Resolution | `2K` (default — use `4K` for detail-heavy architectures, but note 1:1 cannot be 4K) |
| Aspect ratio | `3:4` for most concepts (portrait, gives text room), `1:1` for comparisons, `16:9` for layered architectures |
| Save to | `frontend/public/infographics/` |
| Naming | `{topic-slug}.png` (kebab-case) |

After saving, reference in MDX as:
```mdx
<img src="/infographics/{topic-slug}.png" alt="{Title} — {subtitle}" />
```

---

## Prerequisites

The Kie.ai API key must be in `frontend/.env`:
```
KIE_API_KEY=your_api_key_here
```

The reference image at `frontend/public/infographics/guideline-source.png` should be read before generating to calibrate visual expectations.

---

# THE PIPELINE

Follow steps in order. Most steps are quick decisions, not long processes.

---

## STEP 1 — Read the Source Content

Read the lesson MDX file:
```
frontend/content/technologies/{tech}/phases/{phase-slug}/{lesson-file}.mdx
```

Also read `guideline-source.png` mentally to anchor on the visual quality bar.

---

## STEP 2 — Classify the Concept (CRITICAL — drives everything)

Look at the lesson and pick **ONE** concept type. The type determines the template, and the template determines what sections you generate. **Do not force a concept into the wrong template.**

| Concept Type | Pick When | Template |
|--------------|-----------|----------|
| `pattern-mechanism` | The concept is a design pattern explaining how it works (Mediator, Repository, Factory, Observer) | Problem → Mechanism → Benefits → Example |
| `pattern-with-recovery` | The pattern explicitly involves failure handling (Saga, Circuit Breaker, Retry, Bulkhead, Outbox) | Problem → Happy Path → Failure → Recovery → Outcome |
| `architecture-layered` | Concept is a layered or component architecture (MVC, Clean Architecture, Hexagonal, microservices topology) | Layers/Components diagram with annotations |
| `comparison` | A vs B, before vs after, monolith vs microservices, SQL vs NoSQL | Side-by-side with VS badge + decision criteria |
| `tradeoff-framework` | Triangles, spectrums, theorems (CAP, PACELC, consistency models) | Geometric core + descriptions of each axis |
| `process-flow` | Step-by-step protocol or lifecycle (TLS handshake, OAuth, deployment) | Linear or branching flow with numbered steps |
| `system-design` | High-level system breakdown (chat app, URL shortener, news feed) | Block diagram with data flow arrows |

**If the concept doesn't fit cleanly, pick the closest one and adapt — do NOT invent a hybrid that includes everything.**

---

## STEP 3 — Extract ONLY What the Template Needs

Each template has a **fixed slot count**. Extract content for those slots — no more.

### Universal slots (always extracted)
- **Title** — uppercase, 1–3 words ideally (e.g., "MEDIATR", "CIRCUIT BREAKER", "CAP THEOREM")
- **Subtitle** — one short line, 6–10 words max
- **Intro** — 1–2 sentences, used in header area
- **3–4 benefit/property badges** — single concept each, 1–2 words + tiny detail

### Template-specific slots

**`pattern-mechanism`** (e.g., MediatR, Repository)
- Problem: 3 nodes showing tight coupling / direct dependencies / etc, with 3 X-mark consequences
- Mechanism: 3–5 nodes showing the pattern in action, with green checkmark caption
- How it works: 4–5 numbered steps, each with icon + 1-line explanation
- Example: code snippet OR concrete scenario (skip if not in source)
- Key takeaways: 4–6 short positive statements with checkmarks
- Use cases (optional): 4–6 industries/scenarios with icons

**`pattern-with-recovery`** (e.g., Saga, Circuit Breaker)
- Problem: 1 line on what breaks without this pattern
- Happy path: 3–5 numbered steps
- Failure point: ONE clear marked step where things go wrong, with X icon
- Recovery flow: dashed orange backward arrows showing compensation
- Outcome: final state (success or graceful failure)
- Key takeaways: 4–6 short statements

**`architecture-layered`** (e.g., Clean Architecture, microservices)
- 3–5 layers/components stacked or arranged spatially
- Each layer: name + 1-line responsibility + icon
- Arrows showing data/dependency flow
- 3–4 properties/principles as badges
- Common pitfalls or trade-offs (3 items)

**`comparison`** (e.g., SQL vs NoSQL)
- Side A: name + 4–5 properties with icons
- Side B: name + 4–5 properties with icons
- VS badge between them
- "Pick A when" criteria (3 bullets)
- "Pick B when" criteria (3 bullets)

**`tradeoff-framework`** (e.g., CAP)
- Geometric core (triangle/spectrum/quadrant) — labels at vertices/axes
- Each vertex/axis: 1-line description + icon
- 3 example systems mapped to positions
- Key insight callout

**`process-flow`** (e.g., TLS handshake)
- 5–8 numbered steps in linear sequence
- Each step: actor + action + 1-line detail + icon
- Branch points if any, drawn cleanly
- Outcome state at end

**`system-design`** (e.g., URL shortener architecture)
- 4–7 main components with icons
- Data flow arrows (request path + response path)
- 2–3 callouts on bottlenecks/scaling decisions
- Storage/cache/queue layer if relevant

---

## STEP 4 — Word Economy Pass

Before writing the prompt, ruthlessly trim text:

- **Inside shapes/pills:** max 2 words, common English only. "Validates" not "Validation Layer". "Send" not "Send Command". "Order DB" not "Order Database Storage".
- **Captions/labels outside shapes:** max 7 words.
- **Step descriptions:** max 10 words.
- **Section titles:** max 4 words ("HOW IT WORKS", "KEY TAKEAWAYS", "REAL-WORLD USE CASES").
- **Banish:** "the", "a", "is", "are" — almost always cuttable.
- **Banish:** parenthetical clarifications inside shapes — move to caption below.

If a label feels like it needs more words, **show it as a small caption underneath the shape** rather than inside it. Image-gen models render small text *outside* shapes much better than text *inside* shapes.

---

## STEP 5 — Build the Prompt

A good prompt for Nano Banana Pro has 4 parts: **Style Anchor → Layout Skeleton → Content with Coordinates → Negative Constraints**.

### Style Anchor (always identical)

```
Premium educational infographic poster, clean modern flat-design illustration style.
White background (#FAFBFC). Soft shadows on rounded cards. Crisp readable typography.
Generous whitespace. Visual hierarchy with clear focal points. High-contrast icons in
flat geometric style. Professional documentation aesthetic — like a top-tier technology
company's developer documentation poster. Match the visual style of the reference image.
```

### Layout Skeleton (varies by template — see Step 6)

Describe the spatial layout in plain English with explicit coordinates:
- "Top-left quadrant contains..."
- "Centered horizontal band below the header shows..."
- "Bottom strip spans full width with..."

### Content with Coordinates

For each visual element, specify:
1. **Where** it goes (quadrant or coordinate)
2. **What shape** (rounded rectangle, circle, hexagon, pill)
3. **What color** (use the design system palette, name the hex)
4. **What icon** is inside it
5. **What text** is inside it (max 2 words) and what caption is outside it
6. **Where arrows go** (from X to Y, color, solid/dashed)

### Negative Constraints (always identical)

```
NEGATIVE CONSTRAINTS:
- No dark background
- No gibberish, no random characters, no misspelled labels
- No text inside small shapes longer than 2 words
- No 3D effects, no skeuomorphism, no clip art, no stock-photo imagery
- No overlapping text and arrows
- No more than one continuous flow per section
- No duplicate labels across the entire image
- No paragraphs — only short labels, captions, and step descriptions
```

---

## STEP 6 — Template-Specific Layout Recipes

### Recipe: `pattern-mechanism` (MediatR-style)

```
LAYOUT (3:4 aspect ratio, portrait):

[ROW 1 — HEADER, top 12% of canvas]
Left side: Logo icon + uppercase title in large bold dark navy.
Below title: subtitle in white text on a colored gradient pill.
Below pill: 1–2 sentence intro in gray.
Right side: 4 benefit cards in a row, each with circular colored icon at top,
1-word label below in matching color, 2-line tiny gray detail underneath.

[ROW 2 — PROBLEM vs SOLUTION, next 30% of canvas]
Two equal cards side-by-side with circular VS badge between them.

LEFT CARD (red theme, light pink fill #FEF2F2):
- Header bar at top: "THE PROBLEM: <2-3 word problem>" in red (#EF4444)
- Subtitle line below header: short problem statement
- 3 component shapes connected by red dashed arrows showing tight coupling
- 3 X-mark consequence bullets at bottom

RIGHT CARD (green theme, light green fill #F0FDF4):
- Header bar at top: "THE SOLUTION: <pattern name>" in green (#10B981)
- Subtitle line: short solution statement
- 3-5 component shapes connected by green solid arrows showing the pattern
- Below the diagram: small dashed lines pointing to 3 capability badges
  (e.g., Validation, Logging, Caching)
- Bottom: green checkmark + 1-line success statement

[ROW 3 — HOW IT WORKS, next 20%]
Full-width card with header "HOW <PATTERN> WORKS".
5 numbered steps in horizontal sequence, each with:
- Numbered colored circle (1, 2, 3, 4, 5 — alternating colors blue/teal/purple/orange/green)
- Step title in bold (1-3 words)
- Below: rounded card with small icon + 2-line step description
- Connected by colored arrows between steps

[ROW 4 — EXAMPLE + TAKEAWAYS, next 25%]
LEFT 60%: "EXAMPLE: <SCENARIO>" header. Code blocks with syntax highlighting,
labeled "1. Request", "2. Handler", "3. Sending". Use real readable code, not gibberish.

RIGHT 40%: Two stacked cards.
Top card: "COMMON <PATTERN> CAPABILITIES" — 4 colored icon cards in a row.
Bottom card: "KEY TAKEAWAYS" — 6 short statements with green checkmarks in 2 columns.

[ROW 5 — USE CASES, bottom 13%]
Full-width strip with header "REAL-WORLD USE CASES".
6 industry/scenario items in a row, each with circular colored icon and
2-line label (industry name + short detail).

[FOOTER, last 3%]
Single line, small gray text: "<Pattern> is <one-line clarification>. <one-line summary>."
```

### Recipe: `pattern-with-recovery` (Saga-style)

```
LAYOUT (3:4 aspect ratio, portrait):

[ROW 1 — HEADER, top 12%]
Same structure as pattern-mechanism. Title + subtitle + intro + 4 property badges.

[ROW 2 — THE PROBLEM, next 15%]
Single full-width card, light red.
"THE PROBLEM: <what fails without this pattern>"
3 X-mark bullets describing failure modes.

[ROW 3 — HAPPY PATH, next 18%]
Full-width card, light green.
Title: "HAPPY PATH"
3-5 numbered step nodes in a horizontal flow connected by solid green arrows.
Each step: circle with number + 1-2 word label + tiny icon.

[ROW 4 — FAILURE & RECOVERY, next 25%]
Full-width card, light orange.
Title: "FAILURE & COMPENSATION"
Show the SAME steps from the happy path, but with one step marked with a red X
(the failure point). Then BACKWARD dashed orange arrows showing the compensation
sequence — each arrow labeled with the undo action (e.g., "Refund", "Cancel", "Release").
End at a final "Compensated" state.

[ROW 5 — KEY PROPERTIES + TAKEAWAYS, next 22%]
LEFT 50%: "KEY PROPERTIES" — 4 colored icon cards (e.g., Atomicity, Eventual Consistency, etc.).
RIGHT 50%: "WHEN TO USE" — 4-6 checkmark bullets.

[ROW 6 — EXAMPLE, next 8%]
"REAL-WORLD EXAMPLE: <SCENARIO>" — single line scenario + 4-5 micro-step icons in a row.

[FOOTER, 0]
```

### Recipe: `architecture-layered` (Clean Architecture, microservices)

```
LAYOUT (16:9 aspect ratio, landscape):

[ROW 1 — HEADER, top 15%]
Logo + title + subtitle + intro on the left.
4 property/principle badges on the right.

[ROW 2 — ARCHITECTURE DIAGRAM, middle 60%]
Centered, large, the visual centerpiece.
Layers as concentric rings (Clean Architecture) OR stacked horizontal bands
(layered architecture) OR distributed nodes with connections (microservices).
Each layer/component:
- Distinct color from the design palette
- Icon in the center
- 1-2 word label
- Small caption outside the shape with responsibility

Arrows showing dependency direction (always pointing inward for Clean Architecture,
top-to-bottom for layered, between services for microservices).

[ROW 3 — PROPERTIES + PITFALLS, next 20%]
LEFT 50%: "KEY PROPERTIES" — 4 colored icon cards.
RIGHT 50%: "COMMON PITFALLS" — 3 X-mark bullets OR "TRADE-OFFS" — 3 balance items.

[FOOTER, 5%]
Single-line summary.
```

### Recipe: `comparison` (SQL vs NoSQL)

```
LAYOUT (1:1 aspect ratio, square):

[ROW 1 — HEADER, top 12%]
Title (e.g., "SQL VS NOSQL"), subtitle, intro.

[ROW 2 — SIDE-BY-SIDE, middle 55%]
Two equal cards with VS badge between them.

LEFT CARD (blue theme):
- Logo/icon at top
- Name in large bold
- 5 property rows: icon + 2-word label + tiny detail

RIGHT CARD (purple theme):
- Same structure, contrasting examples

[ROW 3 — DECISION CRITERIA, next 25%]
Two columns:
LEFT: "PICK SQL WHEN" — 3 checkmark bullets
RIGHT: "PICK NOSQL WHEN" — 3 checkmark bullets

[ROW 4 — REAL EXAMPLES, next 8%]
Logos/icons of real systems on each side.
```

### Recipe: `tradeoff-framework` (CAP, PACELC)

```
LAYOUT (1:1 aspect ratio, square):

[ROW 1 — HEADER, top 15%]
Title + subtitle + intro.

[ROW 2 — GEOMETRIC CORE, middle 50%]
Centered, large.
Triangle (CAP), Venn diagram (overlapping properties), or 2D quadrant.
Each vertex/axis labeled with a single concept word + colored icon.
Inside or near the geometry: 1-line description per vertex.

[ROW 3 — EXAMPLES MAPPED, next 25%]
Real systems positioned around or inside the geometry, with logos and 1-line tags.

[ROW 4 — KEY INSIGHT, next 10%]
Single full-width callout card with the central insight in 1 sentence.
```

### Recipe: `process-flow` (TLS handshake)

```
LAYOUT (3:4 aspect ratio, portrait):

[ROW 1 — HEADER, top 12%]
Title + subtitle + intro + 3 property badges.

[ROW 2 — TWO ACTORS, next 8%]
Two large icons left and right (Client and Server, or User and System) with labels.

[ROW 3 — STEP-BY-STEP FLOW, next 65%]
Vertical sequence between the two actors.
Each step:
- Numbered circle (alternating colors)
- Arrow from one actor to the other (left-to-right or right-to-left)
- 2-3 word action label on the arrow
- 1-line detail below

[ROW 4 — OUTCOME + TAKEAWAYS, next 15%]
LEFT: Outcome card (green checkmark + 1-line final state).
RIGHT: 3-4 takeaway bullets.
```

### Recipe: `system-design` (URL shortener)

```
LAYOUT (16:9 aspect ratio, landscape):

[ROW 1 — HEADER, top 12%]
Title + subtitle + intro + 3 scale/property badges (e.g., "100M URLs/day").

[ROW 2 — SYSTEM DIAGRAM, middle 60%]
Centerpiece block diagram.
Components as labeled boxes connected by arrows.
Group by tier: edge (load balancer, CDN), application (services), data (DBs, caches, queues).
Use distinct color per tier.
Show request path with one color, response/async path with another.

[ROW 3 — KEY DECISIONS, next 22%]
3 cards horizontally — each card explains one architectural decision and its rationale.

[FOOTER, 6%]
Scaling notes / capacity.
```

---

## STEP 7 — Design System (UNCHANGED — these are good)

### Colors (semantic — never random)

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
| Subtle fill | `#F0FDF4` (green tint), `#FEF2F2` (red tint), `#FEF3C7` (orange tint), `#EFF6FF` (blue tint) | Section backgrounds |

### Components
- Rounded rectangles (radius ~12px) with soft shadows for cards
- Smooth curved arrows, never zigzag
- Pill badges for benefits, takeaways, status
- Small flat icons (line-style or filled) — choose one style and stick with it
- Numbered colored circles for sequential steps
- VS badge: white circle with "VS" text, blue border, between comparison cards
- Gradient or solid colored header bars for section titles

### Icon Vocabulary (pick relevant ones)
- 👤 User/person — clients, actors
- 🛢 Database cylinder — storage
- 🖥 Server/box — services, APIs
- ⚙ Gear — processing, configuration
- 🛡 Shield — security, validation
- 🕒 Clock — timeouts, scheduling
- 🔒 Lock — transactions, secrets
- ✅ Checkmark — success, validation
- ❌ X mark — failure, rejection
- 🔁 Arrow loop — retry, compensation
- ⚡ Lightning — events, async
- ☁ Cloud — external services
- 📊 Chart — metrics, observability
- 📦 Box — packages, containers
- 🔑 Key — auth, identity
- 🌐 Globe — distributed, network
- 📨 Envelope — messages, queues

### Typography
- Title: large, bold, dark navy — biggest text on the poster
- Subtitle: white text on colored gradient pill
- Section headers: bold, colored to match section theme
- Labels inside shapes: max 2 words, simple common English
- Captions outside shapes: max 7 words
- NO distorted text, NO gibberish, NO duplicate labels

---

## STEP 8 — Validation Before API Call

Mentally walk through the prompt and reject if:

- ❌ Any label inside a shape exceeds 2 words
- ❌ Any concept appears as a label more than once
- ❌ Sections from a different template snuck in
- ❌ Failure/compensation included for a non-recovery pattern
- ❌ Forced "happy path" added to an architecture diagram
- ❌ More than 7 elements in any single section
- ❌ Layout has no clear focal point
- ❌ Aspect ratio doesn't match template
- ❌ Style anchor or negative constraints missing from prompt

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
      \"aspect_ratio\": \"3:4\",
      \"resolution\": \"2K\"
    }
  }")

TASK_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['taskId'])")
echo "Task created: $TASK_ID"
```

### Adjust `aspect_ratio` per template

| Template | aspect_ratio |
|----------|-------------|
| pattern-mechanism | `3:4` |
| pattern-with-recovery | `3:4` |
| architecture-layered | `16:9` |
| comparison | `1:1` |
| tradeoff-framework | `1:1` |
| process-flow | `3:4` |
| system-design | `16:9` |

Supported aspect ratios: `auto`, `1:1`, `9:16`, `16:9`, `4:3`, `3:4`

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

After download, **read the generated image** and reject if any of these are present:

| Issue | Fix in next iteration |
|-------|----------------------|
| Garbled text / misspelled labels | Reduce labels further; move long text outside shapes as captions |
| Duplicate labels | Rename to unique 1-2 word terms |
| Multiple disconnected flows | Strengthen "single continuous flow" in prompt |
| Dark background | Repeat "WHITE background (#FAFBFC), light theme only" 3x in prompt |
| Missing sections | Number every section explicitly in prompt: "Section 1...", "Section 2..." |
| Plain text instead of pill badges | Describe pills explicitly: "rounded pill badge with colored fill" |
| No icons | Describe each icon individually with shape and color |
| Crammed / unbalanced | Cut content; split into two infographics if needed |
| Failure flow forced where it doesn't belong | Re-classify the concept type, switch template |
| Generic / not premium-looking | Verify reference image is being passed; emphasize "match reference style" |

Typical: 1–3 iterations to match reference quality.

---

## STEP 11 — Quality Verification Checklist

Before finalizing, verify against the reference image:

- [ ] Light background (#FAFBFC), absolutely not dark
- [ ] All text crisp and readable, zero garbled labels
- [ ] Each section the template requires is present (no more, no less)
- [ ] Visual hierarchy clear — eye knows where to start
- [ ] Generous whitespace, nothing crammed
- [ ] Icons consistent in style throughout
- [ ] Color palette matches design system
- [ ] Pill badges for benefits/takeaways (not plain bullets)
- [ ] Numbered colored circles for sequential steps
- [ ] Arrows smooth, not zigzag, not overlapping text
- [ ] No duplicate labels anywhere
- [ ] Aspect ratio matches template
- [ ] Aesthetic matches `guideline-source.png`

---

## STEP 12 — Finalize

1. Save with kebab-case filename: `{topic-slug}.png`
2. Verify file is at `frontend/public/infographics/{topic-slug}.png`
3. Provide MDX reference tag for the lesson
4. Delete intermediate/versioned files

---