# 🧠 Interview Assistant App — Full System Plan (MVP → Scalable)

---

# 🎯 Vision

Build a platform that allows users to:

* Write code
* Execute it
* Validate correctness against test cases
* Receive clear feedback

---

# 🧱 System Overview

## High-Level Architecture

```text
Frontend (Monaco Editor)
        ↓
.NET API (Execution + Evaluation)
        ↓
Code Wrapping Engine
        ↓
Execution Engine (Piston API - MVP)
        ↓
Result Comparison
        ↓
Response to UI
```

---

# 🚀 PHASE 1 — MVP (Ship Fast, Zero Cost)

## 🎯 Goal

Deliver a working flow:

> Write → Run → Validate → Feedback

---

## 🧰 Tech Stack

### Frontend

* React
* Monaco Editor (`@monaco-editor/react`)

### Backend

* .NET Web API

### Execution

* Piston API (free, no infra)

---

## 🧩 MVP Features

### ✅ 1. Single Hardcoded Problem

Example:

**Title:** Sum of Array

```csharp
public int Sum(int[] nums) {
    // your code here
}
```

---

### ✅ 2. Simple UI Layout

```
-------------------------------------
| Editor (left) | Output (right)    |
-------------------------------------
|         Run Button               |
-------------------------------------
```

---

### ✅ 3. API Endpoint

```
POST /run
```

#### Request

```json
{
  "code": "user code"
}
```

---

### ✅ 4. Code Wrapping (Core Logic)

Backend injects user code into a full program:

```csharp
using System;
using System.Linq;

public class Solution {
    public int Sum(int[] nums) {
        // USER CODE HERE
    }
}

public class Program {
    public static void Main() {
        var sol = new Solution();
        var result = sol.Sum(new int[]{1,2,3});
        Console.WriteLine(result);
    }
}
```

---

### ✅ 5. Execution (Piston)

Send request:

```json
{
  "language": "csharp",
  "version": "latest",
  "files": [
    {
      "content": "FULL GENERATED CODE"
    }
  ]
}
```

---

### ✅ 6. Result Validation

```csharp
var passed = output.Trim() == expected.Trim();
```

---

### ✅ 7. Response Format

```json
{
  "passed": true,
  "expected": "6",
  "actual": "6"
}
```

---

### ✅ 8. UI Output

```
✅ Passed
```

or

```
❌ Failed
Expected: 6
Got: 5
```

---

## ⚠️ What NOT to Build

* Authentication
* Database
* Multiple problems
* Hidden test cases
* Performance analysis
* Multi-language support

---

## ⏱ Estimated Time

| Task               | Time      |
| ------------------ | --------- |
| Monaco setup       | 2–3 hours |
| Backend API        | 3–4 hours |
| Piston integration | 2–3 hours |
| UI wiring          | 2–3 hours |

👉 Total: **1–2 days**

---

## ✅ Definition of Done

* Code editor works
* Run button works
* Output is validated
* Pass/Fail displayed

---

# ⚙️ PHASE 2 — Core Evaluation System

## 🎯 Goal

Improve correctness validation

---

## 🧪 Features

### 1. Multiple Test Cases

```json
[
  { "input": "[1,2,3]", "expected": "6" },
  { "input": "[]", "expected": "0" },
  { "input": "[5]", "expected": "5" }
]
```

---

### 2. Execution Strategy

#### Option A (simple):

* Run code once per test case

#### Option B (better):

* Inject multiple calls into one execution

---

### 3. Structured Result

```json
{
  "passed": 2,
  "total": 3,
  "details": [
    { "input": "[1,2,3]", "passed": true },
    { "input": "[]", "passed": false }
  ]
}
```

---

### 4. Hidden Test Cases

* Store in backend only
* Prevent hardcoding

---

### 5. Improved UI

* Show passed count
* Highlight failed cases

---

## ⏱ Time

👉 2–3 days

---

# 🧱 PHASE 3 — Problem System

## 🎯 Goal

Support multiple problems

---

## 🗂 Problem Model

```csharp
public class Problem {
    public string Id;
    public string Title;
    public string Description;
    public string FunctionSignature;
    public string StarterCode;
    public List<TestCase> TestCases;
}

public class TestCase {
    public string Input;
    public string Expected;
    public bool IsHidden;
}
```

---

## Features

* Problem list page
* Dynamic loading
* Starter code injection

---

## Storage

* Start: in-memory list
* Later: database

---

## ⏱ Time

👉 2–4 days

---

# 🔒 PHASE 4 — Execution Control

## 🎯 Goal

Gain control over execution

---

## Replace

* Piston API → Docker-based runner

---

## Add

* Timeout limits
* Memory limits
* Process isolation

---

## Why

* Security
* Reliability
* Performance control

---

## ⏱ Time

👉 1–2 weeks

---

# 🧠 PHASE 5 — Interview-Level Features

## 🎯 Goal

Make it production-grade

---

## Features

### 1. Run vs Submit

* Run → visible tests
* Submit → hidden tests

---

### 2. Persistence

* Save user solutions

---

### 3. Analytics

* Attempts
* Pass rate

---

### 4. Multi-language Support

* Start with C#
* Add JS, Python later

---

# 🔮 FUTURE (Optional)

* AI hints
* Adaptive difficulty
* Code quality scoring
* Time complexity analysis

---

# 🔐 Security Considerations

## Risks

* Infinite loops
* Memory abuse
* Malicious code

---

## MVP Handling

* Delegate to Piston

---

## Later

* Sandbox via Docker
* Resource limits
* Disable networking

---

# 🧠 Key Design Decisions

## Why Predefined Problems?

* Deterministic evaluation
* Easier debugging
* Reliable scoring

---

## Why Code Wrapping?

* Standardizes execution
* Enables automated testing

---

## Why Start Simple?

* Avoid overengineering
* Ship faster
* Validate idea early

---

# 🎯 Final Strategy

## Step-by-step

1. Build Phase 1 ONLY
2. Ship immediately
3. Collect feedback
4. Move to Phase 2

---

# 🧠 Core Principle

You are NOT building:

> a code editor

You ARE building:

> a system that evaluates problem-solving ability

---

# 🚀 End Goal

A platform that can:

* Simulate real interviews
* Evaluate logic, not just syntax
* Scale to multiple users and problems

---
