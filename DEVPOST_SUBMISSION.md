# 🏆 CloudTopology CPQ — Devpost Hackathon Submission

---

## 🏷️ 1. Project Details
* **Project Name:** CloudTopology CPQ
* **Short Tagline:** Visual multi-cloud architecture CPQ & FinOps co-pilot with real-time egress modeling, GDPR audits, and WebMCP agentic control.
* **Elevator Pitch:** CloudTopology CPQ is an interactive, multi-cloud FinOps design and CPQ workspace powered by WebMCP. It empowers engineering teams and autonomous AI coding agents to visually architect cloud topologies across AWS, GCP, Azure, and Cloudflare — instantly simulating real-time compute pricing, piecewise cross-region egress bills, optical fiber latency, and GDPR compliance audits, while synthesizing deployable Terraform HCL in one click.

---

## 📖 2. About the Project

## Inspiration

Modern cloud architectures rarely live in a single region or provider. Today's engineering teams blend AWS compute, GCP AI accelerators, Azure enterprise systems, and Cloudflare edge networks. However, designing and estimating multi-cloud systems is frustratingly broken:

1. **Static Diagrams vs. Dynamic Bills:** Traditional diagramming tools (Draw.io, Lucidchart) produce static pictures. They cannot calculate your monthly bill, warn you about non-linear cross-region egress tariffs, or alert you when a customer database violates European GDPR data residency laws.
2. **Opaque Egress Pricing:** Data transfer fees between cloud datacenters and internet users range from $0.00 (Cloudflare Bandwidth Alliance) to $0.09+/GB (AWS public egress). Estimating this by hand with spreadsheets is prone to massive calculation errors.
3. **AI Coding Agents Lacked a Visual Canvas:** While modern AI agents (ChatGPT, Claude, Gemini) can write infrastructure code, they lacked a standardized, bi-directional protocol to "see" a visual architecture canvas, test configuration changes, and verify FinOps mathematics in real time.

We built **CloudTopology CPQ** to solve this: an open-standard, visual multi-cloud CPQ (Configure, Price, Quote) workspace that both human engineers and AI coding agents can interact with simultaneously via **WebMCP** (`window.modelContext` / `document.modelContext`).

---

## What it does

CloudTopology CPQ turns architecture diagrams into a live, FinOps-driven simulation canvas:

* **🤖 Autonomous WebMCP 8-Tool Suite:** Exposes 8 typed tools directly on `window.modelContext` and `document.modelContext`. External AI agents (ChatGPT, Claude, Gemini, Antigravity) can query 50+ enterprise SKUs, programmatically generate or alter topologies, optimize commitment plans, and simulate network traffic in real time.
* **💰 Real-Time Multi-Cloud FinOps Engine:** Instantly calculates costs across On-Demand, 1-Year Savings Plans (~35% off), 3-Year Savings Plans (~55% off), and Spot Fleets (~65% off), with support for uploading custom negotiated Enterprise Discount Agreements (EDA).
* **⚡ Piecewise Cross-Region Egress Simulation:** Accurately models non-linear, tiered bandwidth tariffs:
  ```
  Cost_egress = ∑ (ΔVolume_i × Rate_i)
  ```
  *(Simulates standard tiered internet egress rates from 0–10 TB down to >150 TB volume discounts, as well as zero-egress Cloudflare Bandwidth Alliance routes).*
* **🌍 Geodesic Speed-of-Light Latency Modeling:** Uses the Haversine great-circle distance formula between global datacenters to calculate physical optical fiber propagation time:
  ```
  d = 2R · arcsin( √( sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2) ) )
  Latency_RTT = 2 × (d / c_fiber) × RefractionIndex + ProcessingOverhead
  ```
  *(Calculates real-world round-trip time between datacenter coordinates using Earth radius R = 6,371 km and silica fiber speed c_fiber = 200,000 km/s).*
* **🇪🇺 Built-In GDPR & Compliance Auditing:** Automatically scans the active topology to flag databases storing EU PII outside sovereign European regions and detects unencrypted cross-cloud transit, offering 1-click remediation.
* **📋 Enterprise CPQ Quotes & Terraform IaC Export:** Generates formal itemized CPQ procurement proposals (with ACV and 3-Year TCV breakdowns) and produces deployable Terraform HCL 2.0 configuration files.
* **💾 Project Persistence & Themes:** Features auto-saving to `localStorage`, a "My Saved Setups" project library, 1-click `.json` export and import, and seamless toggling between high-contrast Light Theme (default) and Obsidian Dark Theme.

---

## How we built it

* **Interactive Frontend:** Built with React 18, Vite, TypeScript, Tailwind CSS, and `@xyflow/react` (React Flow) for 60fps hardware-accelerated SVG/canvas rendering.
* **WebMCP Architecture (`src/tools/modelContextBridge.ts`):** Implemented an open WebMCP bridge that registers typed tool schemas on both `window.modelContext` and `document.modelContext`. We built a Universal JSON Normalizer that can parse flat AI responses, nested coordinate trees, or partial parameter maps from external LLMs.
* **FinOps Calculation Core (`src/engine/finopsEngine.ts`):** Created a deterministic pricing engine that enforces stateful vs. stateless pricing tiers, calculates piecewise egress curves, parses custom enterprise rate cards (`rateCardParser.ts`), and synthesizes Terraform HCL (`terraformGenerator.ts`).
* **Automated Verification:** 14 automated unit tests using Vitest covering WebMCP tool schemas, rate-card discount logic, egress calculations, and GDPR validation rules.

---

## Challenges we ran into

1. **Real-World ChatGPT In-App WebMCP Payload Mismatches:** When we tested the live app with ChatGPT Desktop asking it to create a multi-tenant SaaS architecture, ChatGPT called `apply_topology_to_canvas` with a flat list of node names and connections without X/Y pixel coordinates or pricing IDs. To make the app truly agent-friendly, we wrote a Universal AI Normalizer that auto-arranges node layout coordinates on a clean grid, maps plain-text provider names to real catalog SKUs, and infers default configurations automatically.
2. **The Chromium `#enable-webmcp-testing` Getter Collision:** When testing inside Chrome instances with experimental WebMCP flags enabled, Chrome created a native `document.modelContext` object with a read-only getter. Standard JavaScript assignment (`document.modelContext = ...`) caused an unhandled `TypeError` that produced a blank black screen. We solved this by creating a defensive bridge that first checks for native `document.modelContext.registerTool()`, falling back to `Object.defineProperty` and safe wrapping.
3. **Modeling Multi-Cloud Egress Complexity:** Capturing the difference between same-region VPC peering, inter-region internal backbones, public internet egress, and Cloudflare zero-egress peering required structuring an exact piecewise tier evaluator to avoid overestimating or underestimating network spend.
4. **Dual-Theme Legibility:** Maintaining high contrast for cloud provider cards (AWS amber, GCP blue, Azure cyan, Cloudflare orange), animated SVG traffic particles, and complex modals across both Light and Dark themes required careful Tailwind class architecture.

---

## Accomplishments that we're proud of

* **True Agent-Human Collaboration:** external AI agents (like ChatGPT) can actually connect to the running browser app via WebMCP, inspect the catalog, add nodes, optimize commitment plans, and update the visual canvas in real time.
* **Real 50+ Multi-Cloud SKU Catalog:** Includes real-world enterprise hardware like NVIDIA H100 80GB (`p5.48xlarge`, GCP A3, Azure ND96isr), AWS Graviton3, Aurora Serverless v2, Cloud Spanner, and Cloudflare Workers.
* **Production-Grade Outputs:** The app does not just draw boxes; it generates genuine procurement-ready CPQ quote proposals and copy-pasteable Terraform HCL 2.0 infrastructure code.
* **100% Client-Side Speed:** Instant calculation in under 10ms with full offline support, zero server cold starts, and complete local persistence.

---

## What we learned

* **WebMCP is the Future of Web Apps for AI:** Exposing typed semantic JSON tool contracts via WebMCP is vastly superior to having AI agents take screenshots or attempt brittle pixel-based mouse clicks. It gives LLMs deterministic control over web applications with zero hallucinations.
* **FinOps Must Start at Design Time:** Calculating egress bandwidth costs and commitment discount plans during the initial diagramming phase prevents costly architectural rewrites post-deployment.

---

## What's next for CloudTopology CPQ

* **Live Cloud Billing Ingestion:** Connecting live AWS Cost Explorer, GCP Billing, and Azure Cost Management APIs to compare pre-deployment CPQ estimates against actual telemetry.
* **Multi-User Real-Time Collaboration:** Adding WebRTC live multiplayer so distributed engineering teams and AI co-pilots can edit topologies on the same canvas simultaneously.
* **CDK & Pulumi Synthesizers:** Expanding IaC generation beyond Terraform to include AWS CDK (TypeScript/Python) and Pulumi stacks.

---

## 🏷️ 3. Built With (Tags)
`typescript`, `react`, `vite`, `tailwindcss`, `react-flow`, `webmcp`, `model-context-protocol`, `ai-agents`, `aws`, `google-cloud`, `azure`, `cloudflare`, `terraform`, `finops`, `cpq`, `vitest`

---

## 🔗 4. Try-Out Links
* **🚀 Production App:** [https://cloudtopology-cpq.vercel.app](https://cloudtopology-cpq.vercel.app)
* **📦 GitHub Repository:** [https://github.com/sachinm207/cloudtopology-cpq](https://github.com/sachinm207/cloudtopology-cpq)
* **🖼️ 12 Gallery Images (3:2 Ratio):** [https://github.com/sachinm207/cloudtopology-cpq/tree/master/gallery](https://github.com/sachinm207/cloudtopology-cpq/tree/master/gallery)
