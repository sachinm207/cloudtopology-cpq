# CloudTopology CPQ — Demo Video Guide & Voiceover Script ☁️📊🎬

> **Video Guidelines (Devpost):**
> * **Maximum Duration:** Strictly under 3 minutes (Target: **2 minutes 35 seconds**)
> * **Host Platform:** YouTube (Set visibility to **Public** or **Unlisted**)
> * **Logical Narrative Flow:**
>   1. **The Hook & The Problem:** The $150B cloud waste problem, opaque egress fees, and static diagrams with no financial intelligence.
>   2. **The Manual Way (Without WebMCP):** Manually designing topologies, calculating non-linear tiered egress by hand, and missing critical GDPR data residency violations.
>   3. **The Built-In Canvas & Local FinOps Math:** Using the visual canvas, interactive handles, and local Haversine latency / egress engine—and why pure calculators alone are limited.
>   4. **The WebMCP Way (Strategic AI Co-Pilot):** How an external AI Agent executes natural language commands to audit compliance, inject zero-egress edge caching, apply 3-Year Savings Plans, and synthesize Terraform IaC.
>   5. **Architecture & Wrap-Up:** 8 WebMCP tools on `modelContext`, 14 passing automated unit tests, and production deployment.

---

## 🎬 Video Recording Plan & Timeline (2 min 35 sec)

```
0:00 ─── 0:25  [1. Hook & The Problem]
        • Show CloudTopology CPQ live on screen (Default Light Theme).
        • Explain the $150B cloud waste crisis: static diagrams (Draw.io) don't know pricing or compliance.

0:25 ─── 0:55  [2. The Manual Way — Without WebMCP]
        • Show the Global E-Commerce preset.
        • Point out the manual pain: calculating non-linear bandwidth tariffs across 50 tabs.
        • Notice the critical red alert: EU customer PII database in US East violating GDPR, plus a $153/mo cross-region egress spike.

0:55 ─── 1:25  [3. The Built-in Canvas & Local FinOps Solver]
        • Drag nodes, inspect an EC2 node, adjust instances from 2x to 4x, switch commitment plan to 1-Yr SP.
        • Explain what the local engine does: calculates piecewise egress and geodesic optical latency in <10ms.
        • Explain its limits: it's a passive calculator. It doesn't know high-level architecture strategy, can't auto-refactor to zero-egress tunnels, and can't write your infrastructure code.

1:25 ─── 2:10  [4. The WebMCP Way — The Strategic AI Co-Pilot]
        • Show ChatGPT in-app browser or agent prompt interface.
        • Paste the exact natural language command.
        • Watch the agent call WebMCP tools:
            - Audits GDPR compliance & p95 latency (`validate_compliance_and_latency`)
            - Injects Cloudflare edge caching to cut bandwidth (`optimize_cloud_architecture`)
            - Moves PII database to Frankfurt datacenter (GDPR badge turns green "Compliant")
            - Applies 3-Year Savings Plans (~55% off)
            - Generates formal CPQ Quote & Terraform HCL (`export_terraform_iac`)

2:10 ─── 2:35  [5. WebMCP Architecture, Testing & Wrap-Up]
        • Open "WebMCP Guide" showing the 8 typed tools registered on `modelContext`.
        • Highlight 14 passing unit tests, sub-10ms deterministic speed, and zero AI hallucinations.
        • Call to action: Live URL at cloudtopology-cpq.vercel.app and open-source GitHub repo.
```

---

## 🎙️ Word-for-Word Voiceover Narration Script

### ⏱️ Section 1: The Hook & The Problem (0:00 – 0:25)
*(Screen: Show CloudTopology CPQ live at [https://cloudtopology-cpq.vercel.app](https://cloudtopology-cpq.vercel.app) in default light mode)*

> "Hi everyone! This is **CloudTopology CPQ**—an interactive multi-cloud FinOps architecture and CPQ workspace powered by **WebMCP**.
>
> Enterprises waste over **$150 Billion every year** on misconfigured cloud infrastructure, surprise cross-region egress bills, and GDPR data residency fines.
>
> Traditional diagramming tools like Draw.io or Lucidchart are just static pictures—they don't know what cloud resources cost, they can't calculate tiered bandwidth tariffs, and they can't audit regulatory compliance.
>
> Let's look at how cloud architecture is designed manually, what our local FinOps engine does, and how WebMCP transforms the entire experience."

---

### ⏱️ Section 2: The Manual Way — Without WebMCP (0:25 – 0:55)
*(Screen: Show the active canvas with US Web API, EU Web API, and Aurora Global DB in US East. Point to the red GDPR warning and the cross-Atlantic egress badge)*

> "Here is our visual multi-cloud canvas.
> 
> Imagine you're architecting a global web application spanning AWS US East and Frankfurt.
> 
> Without an intelligent co-pilot, estimating this manually is a nightmare. You have to open dozens of cloud calculator tabs across AWS, GCP, and Azure.
> 
> Even worse, look at the canvas: our EU web servers are querying an Aurora database hosted in North Virginia that contains customer personal data. That's a **critical GDPR cross-border data residency violation**. 
> 
> On top of that, raw internet database sync across the Atlantic generates an unbudgeted **$153 a month in bandwidth egress fees** at a high **78 milliseconds of optical latency**.
> 
> Manually calculating tiered bandwidth discounts, verifying GDPR laws, and re-architecting this takes days of tedious spreadsheet work."

---

### ⏱️ Section 3: The Built-in Canvas & Local FinOps Solver (0:55 – 1:25)
*(Screen: Click the US Web API node, open Inspect panel, slide instance count to 4x, then toggle the Commitment Plan dropdown to '1-Yr Savings Plan')*

> "To help with this, CloudTopology CPQ includes an interactive visual canvas and a deterministic TypeScript FinOps engine.
> 
> We can click any node, inspect its CPU cores and memory, scale instances, and switch commitment plans in the top header.
> 
> Notice the KPI bar: our local engine calculates **Haversine geodesic fiber latency** and **piecewise non-linear egress tariffs** in under 10 milliseconds.
> 
> But notice what this visual canvas is on its own: it's a **local calculator**. It doesn't know *why* your architecture is structured this way, doesn't know how to refactor your network to zero-egress edge tunnels, and can't synthesize your deployment code.
> 
> To do true, high-level cloud engineering, we need a **strategic AI Co-Pilot**. And that's where **WebMCP** comes in."

---

### ⏱️ Section 4: The WebMCP Way — The Strategic AI Co-Pilot (1:25 – 2:10)
*(Screen: Show ChatGPT in-app browser or side-by-side prompt interface connected to the running app)*

> "Because CloudTopology CPQ implements the WebMCP standard directly on `window.modelContext` and `document.modelContext`, an external AI agent can interact with our live canvas as an expert Cloud Architect.
> 
> We give the AI agent this exact natural language instruction:

```text
"Open https://cloudtopology-cpq.vercel.app in the canvas simulation workspace. Audit our active canvas topology for GDPR compliance and cross-region egress costs. Run optimize_cloud_architecture with strategy 'all_optimizations' to simulate the target-state on the visual canvas, then call export_terraform_iac to synthesize the deployable Terraform HCL."
```

*(Screen: Show the AI agent executing WebMCP tools in sequence. The canvas updates dynamically: Cloudflare edge node appears, DB moves to Frankfurt, GDPR badge turns green "Compliant", and monthly savings leap)*

> "Watch what happens live in real time:
> 1. The agent calls `validate_compliance_and_latency`—detecting the unencrypted cross-Atlantic link and the EU PII residency breach.
> 2. It calls `optimize_cloud_architecture` with the zero-egress edge caching strategy. A Cloudflare Global CDN edge node is injected, cutting bandwidth transfer fees to **$0.00** via Bandwidth Alliance routing.
> 3. It relocates the PII database to Frankfurt (`aws-eu-central-1`). Instantly, the GDPR audit badge turns green: **'GDPR Compliant'**.
> 4. It switches eligible nodes to 3-Year Savings Plans, slashing monthly spend by over 50%.
> 5. Finally, it invokes `export_terraform_iac`—generating a legally itemized CPQ Quote with ACV metrics and **ready-to-run Terraform HCL 2.0 code**."

---

### ⏱️ Section 5: WebMCP Architecture, Testing & Wrap-Up (2:10 – 2:35)
*(Screen: Click the "WebMCP Guide" button to show the 8 tools, then show the CPQ Quote modal and terminal with 14 passing tests)*

> "Under the hood, CloudTopology CPQ registers **8 typed WebMCP tools** conforming to the official Model Context Protocol standard.
> 
> The AI agent brings high-level architectural reasoning, while our client-side engine guarantees **100% mathematical precision with zero pricing hallucinations**. The entire system is validated by **14 automated unit tests** and features 1-click JSON project persistence and dark/light themes.
> 
> CloudTopology CPQ is 100% open-source under the MIT license and live right now at **cloudtopology-cpq.vercel.app**.
> 
> Thank you for watching!"

---

## 📋 Exact Agent Command for Copy-Pasting During Demo

When demonstrating the WebMCP agent in your video recording or live testing, paste this exact prompt into ChatGPT Desktop or your AI agent:

```text
Open https://cloudtopology-cpq.vercel.app in the canvas simulation workspace. Audit our active canvas topology for GDPR compliance and cross-region egress costs. Run optimize_cloud_architecture with strategy 'all_optimizations' to simulate the target-state on the visual canvas, then call export_terraform_iac to synthesize the deployable Terraform HCL.
```

---

## 🛠️ Step-by-Step Recording Tips (Devpost Best Practices)

1. **Resolution:** Record in **1080p (1920 × 1080)** or **1440 × 960 (3:2 ratio)** fullscreen.
2. **Recording Tool:** Use **OBS Studio** (free, open-source) or **Loom** for crisp screen capture with microphone voiceover.
3. **Pacing Checkpoints:**
   * **0:00 – 0:25:** The $150B problem & introduction
   * **0:25 – 0:55:** The manual pain (show the red GDPR alert & $153 egress fee)
   * **0:55 – 1:25:** Canvas & local math engine (what it does vs. its limitations)
   * **1:25 – 2:10:** WebMCP prompt & agent auto-refactoring live
   * **2:10 – 2:35:** 8 WebMCP tools, 14 unit tests, and sign-off
   * **Total Time:** **~2 minutes 30 seconds** (comfortably under Devpost's 3:00 limit).
4. **Audio:** Ensure your microphone is clear with minimal background noise. Do not use copyrighted background music.
5. **YouTube Upload Settings:**
   * Title: `CloudTopology CPQ — Multi-Cloud FinOps & Architecture Co-Pilot (WebMCP Hackathon Demo)`
   * Visibility: **Public** or **Unlisted**
   * Category: **Science & Technology**
   * Paste the YouTube URL directly into the Devpost submission field.
