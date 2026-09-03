# 🏆 CloudTopology CPQ — Devpost Hackathon Submission

---

## 🏷️ 1. Project Details
* **Project Name:** CloudTopology CPQ
* **Short Tagline:** Visual multi-cloud architecture CPQ & FinOps co-pilot with real-time egress modeling, GDPR audits, and WebMCP agentic control.
* **Elevator Pitch:** CloudTopology CPQ is an interactive, multi-cloud FinOps design and CPQ workspace powered by WebMCP. It empowers engineering teams and autonomous AI coding agents to visually architect cloud topologies across AWS, GCP, Azure, and Cloudflare — instantly simulating real-time compute pricing, piecewise cross-region egress bills, optical fiber latency, and GDPR compliance audits, while synthesizing deployable Terraform HCL in one click.

---

## 📖 2. About the Project

## Inspiration

Modern cloud architectures rarely live in a single region or provider. Today's engineering teams blend AWS compute, GCP AI accelerators, Azure enterprise systems, and Cloudflare edge networks. However, designing and estimating multi-cloud systems remains fragmented:

1. **Opaque Egress Pricing:** Bandwidth costs between cloud regions and providers are notoriously complex and non-linear.
2. **Regulatory & Compliance Blindspots:** Ensuring European customer PII data strictly resides in EU sovereign regions under GDPR is often audited too late.
3. **Disjointed Agentic Tooling:** While AI coding agents (ChatGPT, Claude, Gemini) can generate configuration scripts, they have historically lacked a standard, bi-directional visual canvas to test topologies, audit compliance, and simulate cloud bills in real time.

We were inspired to build **CloudTopology CPQ** — an open-standard, visual multi-cloud CPQ (Configure, Price, Quote) canvas natively controlled by human architects and autonomous AI agents via **WebMCP** (`window.modelContext` / `document.modelContext`).

---

## What it does

CloudTopology CPQ turns cloud architecture design into an interactive, FinOps-driven simulation workspace:

* **🤖 Full Autonomous WebMCP Control:** Exposes 8 standardized WebMCP tools directly in the browser DOM, allowing external AI coding agents (like ChatGPT Desktop, Claude Computer Use, Antigravity) to query 50+ enterprise SKUs, programmatically mutate canvas nodes, optimize commitment discounts, and simulate network egress.
* **💰 Real-Time Multi-Cloud FinOps Engine:** Calculates on-demand rates, 1-Year Savings Plans (~35% off), 3-Year Savings Plans (~55% off), and Spot Fleets (~65% off) with support for custom negotiated Enterprise Discount Agreements (EDA).
* **⚡ Piecewise Cross-Region Egress Simulation:** Computes non-linear data transfer costs across global regions:
  $$\text{Cost}_{\text{egress}} = \sum_{i=1}^{n} \Delta \text{Volume}_i \times \text{Rate}_i$$
* **🌍 Geodesic Speed-of-Light Latency Modeling:** Uses the Haversine distance formula to compute optical fiber flight time between global datacenters:
  $$d = 2R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta \lambda}{2}\right)}\right)$$
  $$\text{Latency}_{\text{RTT}} = 2 \times \left(\frac{d}{c_{\text{fiber}}}\right) \times \text{RefractionIndex} + \text{ProcessingOverhead}$$
* **🇪🇺 Instant GDPR & Data Residency Auditing:** Detects unencrypted cross-cloud public transit and flags databases containing EU PII located outside sovereign European regions, offering 1-click remediation.
* **📋 Enterprise CPQ Quotes & Terraform IaC Export:** Generates formal itemized CPQ procurement documents (with ACV and 3-Year TCV metrics) and produces deployable Terraform HCL 2.0 configuration files.
* **🌗 Light & Dark Theme Suite + Local Persistence:** Features default light mode, dark mode toggle, auto-save to `localStorage`, and 1-click JSON project export and import.

---

## How we built it

* **UI & Visual Canvas:** React 18, TypeScript, Vite, Tailwind CSS, and `@xyflow/react` (React Flow) for hardware-accelerated SVG/canvas rendering.
* **Agentic Protocol (WebMCP):** Implemented a bi-directional `WebMCPBridge` exposing tools on `window.modelContext` and `document.modelContext`. Built a universal JSON normalizer capable of parsing flat AI responses or nested React Flow payloads from external LLMs.
* **FinOps Calculation & Latency Engine:** Authored modular TypeScript calculation engines (`finopsEngine.ts`, `rateCardParser.ts`, `terraformGenerator.ts`) that enforce stateful vs. stateless pricing tiers and evaluate topology compliance deterministically.
* **Testing & Quality Assurance:** Comprehensive Vitest suite with 14 automated unit tests verifying WebMCP tool schemas, rate-card discounts, egress calculations, and GDPR validation rules.

---

## Challenges we ran into

1. **Chromium WebMCP Read-Only Getter Collision:** When testing with browsers running experimental WebMCP flags (`#enable-webmcp-testing`), `document.modelContext` threw a `TypeError` because Chrome initialized it as a read-only property with only a getter. We solved this by developing a safe registration wrapper using `document.modelContext.registerTool()` and `Object.defineProperty` fallbacks.
2. **AI Agent Payload Ergonomics:** Different LLMs (e.g., ChatGPT vs. Claude) output topology data in varying structures — some output flat JSON arrays while others attempt nested coordinate trees. We built a universal shape normalizer that auto-detects fields, generates missing grid coordinates, and infers default catalog parameters.
3. **Accurate Latency & Piecewise Egress Mathematics:** Simulating multi-tier cloud bandwidth tariffs required building a piecewise volume pricing engine while factoring in zero-egress Bandwidth Alliance peering routes (e.g., Cloudflare R2 and Cloudflare Tunnels).

---

## Accomplishments that we're proud of

* **Real-World ChatGPT WebMCP Compatibility:** Successfully validated live in-app agentic tool execution where ChatGPT opened the app, queried the SKU catalog, synthesized a multi-tenant SaaS architecture, and manipulated the visual canvas directly through WebMCP.
* **Rich 50+ Enterprise SKU Catalog:** Comprehensive pricing support for modern hardware including NVIDIA H100 80GB (`p5.48xlarge`, GCP A3, Azure ND96isr), Graviton3 ARM instances, Aurora Serverless, Cloud Spanner, and Cloudflare Workers AI.
* **Production-Grade CPQ & IaC Synthesis:** The app does not just draw boxes — it creates legally-formatted CPQ procurement proposals and valid Terraform HCL 2.0 infrastructure code.
* **100% Client-Side Speed & Zero Cold Starts:** Instantaneous reactivity with full offline local storage and zero server latency.

---

## What we learned

* **The Power of Standardized WebMCP:** WebMCP is transformative for web applications. Instead of forcing AI agents to parse complex visual DOM trees or execute brittle mouse clicks, exposing clean semantic JSON tool contracts allows AI agents to interact with web apps with 100% precision.
* **FinOps-First Architecture Design:** Calculating egress costs and commitment tiers *during* the visual design stage prevents millions of dollars in unexpected cloud bills before any infrastructure is provisioned.

---

## What's next for CloudTopology CPQ

* **Live Cloud Provider Telemetry Ingestion:** Direct AWS Cost Explorer, GCP Cloud Billing, and Azure Cost Management API sync to compare estimated quotes against actual telemetry.
* **Multi-Player Real-Time Collaborative Canvas:** WebRTC-based multi-user whiteboarding allowing human architects and AI agents to co-edit topologies simultaneously.
* **Kubernetes Helm & Pulumi Synthesizers:** Expanding the IaC engine to generate Kubernetes Helm charts, Pulumi TypeScript, and AWS CDK stacks.

---

## 🏷️ 3. Tags / Technologies Used
`TypeScript`, `React 18`, `Vite`, `Tailwind CSS`, `React Flow`, `WebMCP`, `Model Context Protocol`, `AI Agents`, `AWS`, `GCP`, `Microsoft Azure`, `Cloudflare`, `Terraform HCL`, `FinOps`, `CPQ`, `Vitest`, `Playwright`

---

## 🔗 4. Try-Out Links
* **🚀 Production App:** [https://cloudtopology-cpq.vercel.app](https://cloudtopology-cpq.vercel.app)
* **📦 GitHub Repository:** [https://github.com/sachinm207/cloudtopology-cpq](https://github.com/sachinm207/cloudtopology-cpq)
