---
name: tech-infographic
description: Generates premium, poster-quality infographic images that visualize complex technical concepts using the Kie.ai Nano Banana API. Designed for consistent, high-quality, structured visual learning outputs across any technical topic.
---

# Tech Infographic Generator (Production Version)

Generate **premium educational infographic posters** using the **Kie.ai Nano Banana API**.

This is NOT a simple prompt tool.
This is a **structured visual reasoning system**.

The reference quality standard is saved at `frontend/public/infographics/guideline-source.png` — always read this file before generating a new infographic to calibrate visual expectations. Every generated infographic must match or exceed this quality bar.

---

## Core Goal

> Convert any technical concept into a **single clear visual narrative** that can be understood in 10–15 seconds.

---

## Golden Rule

Every infographic MUST follow:

```
START → FLOW → FAILURE (optional) → COMPENSATION → OUTCOME
```

If this is not true — regenerate.

---

## When to Generate (and When Not To)

**Generate when the concept involves:**
- System architecture with multiple interacting components
- Process flows with sequential or branching steps
- Distributed system patterns and design patterns
- Before/after comparisons (problem → solution)
- State machines or lifecycle transitions
- Layered architectures
- Trade-off triangles or spectrums

**Skip when:**
- The topic is a language feature explained with code examples
- It's a configuration or API reference
- The concept is simple enough that a sentence explains it
- A code snippet is more useful than a diagram

## Output Specification

| Property | Value |
|----------|-------|
| Format | PNG |
| Aspect ratio | 1:1 |
| Save to | `frontend/public/infographics/` |
| Naming | `{topic-slug}.png` (kebab-case) |

After saving, reference in MDX as:
```mdx
<img src="/infographics/{topic-slug}.png" alt="{Title} — {subtitle}" />
```

## Prerequisites

The Kie.ai API key must be available in `frontend/.env`:
```
KIE_API_KEY=your_api_key_here
```

**Where to find lesson content:**
```
frontend/content/technologies/{tech}/phases/{phase-slug}/{lesson-file}.mdx
```

---

## SYSTEM PIPELINE (MANDATORY)

Follow ALL steps in order. Do NOT skip any step.

---

### STEP 1: Content Extraction

Read the lesson MDX file for the topic. Extract and enrich into ALL of these content blocks:

| Content Block | Source |
|--------------|--------|
| **Title** | Frontmatter `title` — convert to caps for the infographic |
| **Subtitle** | Frontmatter `summary` — one-line explanation |
| **Description** | First section of lesson — 1-2 sentence explanation |
| **3 Key Benefits** | Extract from lesson insights, callouts, comparison tables |
| **Problem** | The problem/challenge the concept addresses |
| **Problem Consequences** | 3-4 negative outcomes of not using this approach |
| **Solution** | How the concept/pattern solves the problem |
| **Steps (3-5 max)** | Step-by-step happy path from the lesson |
| **Failure Scenario** | What happens when something goes wrong |
| **Compensation Actions** | How the system recovers — each undo/fallback action |
| **Success Path** | Happy path end-to-end with final state |
| **Takeaways (3-6 tags)** | Short keyword tags from callouts, quizzes, comparison tables |
| **Real-World Example** | Concrete scenario with numbered steps |
| **Footer Summary** | 1-2 synthesized summary statements |

If the concept doesn't have an obvious failure/recovery scenario (e.g., a hierarchy or comparison topic), adapt those sections to show trade-offs, limitations, or "when NOT to use" instead.

---

### STEP 2: Classify Type

Choose ONE:

| Type | When to Use |
|------|------------|
| **comparison** | Problem vs solution, A vs B (default for most patterns) |
| **flow** | Step-by-step processes, request lifecycles |
| **architecture** | Components and relationships |
| **lifecycle** | State changes, cycles |
| **hierarchy** | Layered or tree structures |

---

### STEP 3: Build Structured JSON (SOURCE OF TRUTH)

```json
{
  "type": "<type from Step 2>",
  "title": "<CONCEPT NAME in caps>",
  "subtitle": "<one-line explanation>",
  "description": "<1-2 sentence description>",
  "narrative": {
    "start": "User",
    "flow": ["<step 1>", "<step 2>", "<step 3>"],
    "failurePoint": "<which step fails>",
    "compensation": ["<undo action 1>", "<undo action 2>"],
    "outcome": "<final success state>"
  },
  "benefits": [
    { "label": "<benefit>", "detail": "<short detail>", "color": "green|blue|purple" }
  ],
  "sections": {
    "problem": {
      "headerColor": "red",
      "title": "THE PROBLEM: <traditional/broken approach>",
      "subtitle": "<one-line problem summary>",
      "nodes": [
        { "id": "<id>", "label": "<Name>", "icon": "<icon>" }
      ],
      "wrapper": { "label": "<grouping label>" },
      "failureIndicator": "<failure visual description>",
      "consequences": ["<outcome 1>", "<outcome 2>", "<outcome 3>", "<outcome 4>"]
    },
    "solution": {
      "headerColor": "green",
      "title": "THE SOLUTION: <pattern name>",
      "subtitle": "<one-line solution summary>",
      "nodes": [
        { "id": "<id>", "label": "<Name>", "icon": "<icon>" }
      ],
      "steps": [
        { "num": 1, "label": "<Step>", "from": "<source>", "to": "<target>" }
      ],
      "successIndicator": "<success visual description>"
    },
    "failure": {
      "title": "FAILURE SCENARIO",
      "trigger": "<what triggers failure>",
      "compensationSteps": [
        { "label": "<recovery action>", "from": "<source>", "to": "<target>", "arrow": "dashed-orange" }
      ]
    },
    "success": {
      "title": "HOW IT WORKS (Success Path)",
      "steps": [
        { "num": 1, "label": "<Step>", "icon": "<icon>" }
      ]
    },
    "takeaways": {
      "title": "KEY TAKEAWAYS",
      "tags": [
        { "label": "<keyword>", "color": "<semantic color>" }
      ]
    },
    "example": {
      "title": "REAL-WORLD EXAMPLE: <SCENARIO>",
      "steps": [
        { "num": 1, "label": "<step>" }
      ]
    },
    "footer": {
      "statements": ["<summary 1>", "<summary 2>"]
    }
  }
}
```

**Strict rules:**
- Max 6–8 nodes per section
- **Labels: max 2 words** inside shapes — use only simple, common English words (e.g., "Order", "Payment", "Refund", "Cancel"). No technical jargon inside shapes.
- No floating elements — everything connects
- No paragraphs — annotations are single short phrases
- No duplicate labels anywhere — each concept appears exactly once
- No repeated steps — if an action was shown, do not show it again
- Every section is MANDATORY

---

### STEP 4: Flow Validation (CRITICAL)

**Reject the JSON and redo if ANY of these fail:**

- More than 1 main flow — build ONE main flow only, all sections must connect to it
- Any node is disconnected — no disconnected diagrams allowed
- Compensation does NOT reverse flow direction
- Steps are ambiguous or duplicate-labeled — each concept appears exactly once
- Flow is not readable left → right or top → bottom
- Start node (User/Client) is missing — User must be at the beginning, all arrows originate from it
- Any label exceeds 2 words

---

### STEP 5: Layout Blueprint (FIXED)

Every infographic follows this fixed layout. Do not deviate.

```
[ HEADER — title, subtitle banner, benefit badges ]

[ PROBLEM ]    [VS]    [ SOLUTION ]

[ MAIN FLOW (centered, full width) ]

[ FAILURE + COMPENSATION (connected to flow) ]

[ SUCCESS PATH ]    [ KEY TAKEAWAYS ]

[ REAL-WORLD EXAMPLE ]

[ FOOTER ]
```

For non-comparison types, adapt sections 2-3:
- `flow`: Single flow section spanning full width. Remove VS badge.
- `architecture`: Layered diagram spanning full width. Remove VS badge.
- `lifecycle`: Circular state diagram. Remove VS badge.
- `hierarchy`: Nested/layered structure. Remove VS badge.

All other sections remain the same regardless of type.

---

### STEP 6: Design System

#### Background
- MUST be white/light (#FAFBFC)
- NEVER dark

#### Colors (semantic — never random)

| Role | Color | Use For |
|------|-------|---------|
| Success | Green (#10B981) | Solution sections, checkmarks, happy path |
| Failure | Red (#EF4444) | Problem sections, X marks, error states |
| Compensation | Orange (#F59E0B) | Rollback arrows, recovery, warnings |
| Flow | Blue (#3B82F6) | Primary arrows, neutral processes, header banners |
| Grouping | Purple (#8B5CF6) | Boundaries, secondary paths, tags |
| Data | Teal (#06B6D4) | Subtitle banners, events, signals |
| Text Primary | Dark (#1E293B) | Titles, headers, labels |
| Text Secondary | Gray (#64748B) | Subtitles, annotations |

#### Components
- Rounded cards with soft shadows for each section
- Smooth curved arrows (never straight rigid lines)
- Pill badges for takeaways and benefits
- Small relevant icons for all nodes
- Numbered step circles for sequential flows
- VS badge for comparison types
- Gradient header bars for section titles

#### Icons (choose relevant to topic)
- User/person — clients, actors
- Database cylinder — storage
- Server/box — services, APIs
- Gear/cog — processing
- Shield — security
- Clock — timeouts
- Lock — transactions
- Checkmark — success
- X mark — failure
- Arrow loop — retry, compensation
- Lightning — events
- Cloud — external services

#### Typography
- Title: large, bold, dark navy — biggest text on poster
- Subtitle banner: on teal/blue gradient with white text
- Section headers: bold, colored to match section theme
- Labels: clean, **max 2 words**, simple common English only
- Annotations: small, gray, max 1 short phrase
- NO distorted text, NO gibberish, NO random characters, NO paragraphs
- NO duplicate labels — each word/concept appears once

---

### STEP 7: Prompt Generation

Build the prompt from the JSON and layout blueprint. The prompt MUST always include these mandatory instructions appended at the end:

```
MANDATORY RULES:
- Use a single continuous flow — ONE main flow only, all sections connect to it
- No disconnected diagrams
- All elements aligned to a grid with equal spacing
- Perfect readable text only — max 2 words per label, simple common English
- No duplicate labels anywhere — each concept appears exactly once
- No repeated steps or actions
- Smooth curved arrows only
- Start from User/Client node — all arrows originate from it
- WHITE background (#FAFBFC) — absolutely NOT dark
- ALL sections must be present
- Pill badges for benefits and takeaways (not plain bullets)
- Small icons next to every component name
- Show exactly one failure point with clean backward compensation
- Equal visual weight and balanced spacing across all sections
```

**Prompt-writing rules:**
- Be extremely spatial — "Place X in the upper-left quadrant, Y in the upper-right"
- Name every color explicitly — "Red (#EF4444) header bar"
- Describe every arrow individually — direction, color, label, solid vs dashed
- Describe icons explicitly — "small database icon inside the Storage card"
- Describe pill badges explicitly — shape, color, text
- Specify negatives aggressively — "No dark background, no 3D, no illustrations, no clip art"
- Keep text minimal — fewer words = crisper rendering
- Describe failure/recovery flow in extreme detail — hardest section for the model

---

### STEP 8: Compensation Rule

Compensation arrows MUST:
- Show exactly ONE failure point — not multiple
- Be backward arrows (reversing the flow direction) as a clean backward sequence
- Reverse the original steps in order
- Be shown visually (dashed orange arrows with labels)
- NOT be duplicated — do not repeat any action already shown
- Each have a clear 1-2 word label describing the undo action

---

### STEP 9: Visual Balance Check

Before sending to the API, mentally verify the layout. Reject and restructure if:
- Top heavy / bottom weak — ensure equal visual weight across all sections
- Sections are uneven in size — balance spacing between every section
- Layout feels random or unstructured
- Any section is crammed while another has excess space
- Any duplicate labels exist anywhere in the infographic
- Any label exceeds 2 words

---

### STEP 10: Start Node

Every infographic MUST include a **User / Client** as the entry point at the beginning of the main flow. All arrows originate from this node. The narrative starts from the user's perspective — this grounds the visual in a real scenario.

---

### STEP 11: Call the Kie.ai API

#### Create the Task

```bash
export KIE_API_KEY=$(grep KIE_API_KEY frontend/.env | cut -d'=' -f2)

PROMPT_JSON=$(python3 -c "import json,sys; print(json.dumps(sys.stdin.read()))" <<< "$PROMPT")

RESPONSE=$(curl -s -X POST "https://api.kie.ai/api/v1/jobs/createTask" \
  -H "Authorization: Bearer $KIE_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{
    \"model\": \"google/nano-banana\",
    \"input\": {
      \"prompt\": $PROMPT_JSON,
      \"output_format\": \"png\",
      \"image_size\": \"1:1\"
    }
  }")

TASK_ID=$(echo "$RESPONSE" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['taskId'])")
echo "Task created: $TASK_ID"
```

#### Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Task created (not completed) | Proceed to polling |
| 401 | Invalid API key | Check `KIE_API_KEY` in `frontend/.env` |
| 402 | Insufficient credits | Alert user to top up at kie.ai |
| 422 | Validation error | Prompt too long (max 5000 chars) — trim |
| 429 | Rate limited | Wait and retry |

#### Poll for Result

```bash
for i in $(seq 1 30); do
  RESULT=$(curl -s -X GET "https://api.kie.ai/api/v1/jobs/recordInfo?taskId=$TASK_ID" \
    -H "Authorization: Bearer $KIE_API_KEY")
  STATE=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['state'])" 2>/dev/null)
  echo "Attempt $i: state=$STATE"
  if [ "$STATE" = "success" ]; then
    echo "$RESULT"
    break
  elif [ "$STATE" = "fail" ]; then
    echo "FAILED: $RESULT"
    break
  fi
  sleep 5
done
```

#### Download and Save

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

---

### STEP 12: Auto-Rejection Rules

After downloading, read the generated image. **Regenerate immediately if ANY of these are true:**

- Broken/garbled text (e.g., misspelled labels, gibberish characters)
- Any label exceeds 2 words or uses complex technical phrasing
- Duplicate labels — same word/concept appears more than once
- Multiple disconnected flows instead of one continuous narrative
- Missing start node (User/Client) at the beginning
- Compensation flow is unclear, missing, or shows multiple failure points
- Compensation repeats actions already shown in the main flow
- Floating/disconnected elements
- Poor alignment — layout looks random or unbalanced
- Sections have uneven visual weight (top heavy / bottom weak)
- Dark background instead of light
- Missing mandatory sections
- Plain text bullets instead of pill badges for takeaways
- No icons next to components

---

### STEP 13: Quality Verification

Read the generated image AND the reference (`guideline-source.png`) side by side. Evaluate:

| Criteria | Pass? |
|----------|-------|
| Light background — white/cream, NOT dark | |
| All sections present (header, problem, solution, flow, failure, success, takeaways, example, footer) | |
| Benefit badges in header with colored pills | |
| VS badge between problem and solution (comparison type) | |
| Colored pill tags for takeaways | |
| Icons next to component names | |
| Gradient section headers | |
| Failure/recovery flow is VISUAL with backward arrows | |
| Single continuous narrative flow | |
| Start node (User/Client) present | |
| Text is crisp and readable | |
| Grid-based, balanced layout | |
| Premium poster feel — matches reference quality | |

**Iteration fixes:**

| Problem | Fix |
|---------|-----|
| Dark background | Repeat "WHITE background" multiple times in prompt |
| Missing sections | Number every section explicitly |
| Plain text instead of pills | Describe pills as "colored rounded pill badges" |
| No icons | Describe each icon individually |
| Text garbled | Reduce labels to 1-2 words, add "perfect readable text" |
| Multiple flows | Add "single continuous flow, no disconnected diagrams" |
| No start node | Add "Start from User/Client node at the beginning" |

Typically 1-3 iterations to match reference quality.

---

### STEP 14: Finalize

1. Save with final kebab-case filename: `{topic-slug}.png`
2. Verify saved to `frontend/public/infographics/`
3. Provide MDX reference tag for the lesson
4. Delete any intermediate/versioned files

---

## Complexity Overflow

If a concept needs more than 8 elements per section, **split into multiple infographics** rather than cramming. Name with descriptive suffixes.

---

## Limitation

Nano Banana is not a perfect layout engine. Expect 85–90% consistency. For 100% pixel-perfect results, a dedicated rendering engine would be needed. The structured pipeline maximizes consistency within the model's capabilities.
