# CloudTopology CPQ ☁️📊⚡
### Multi-Cloud FinOps Architecture, Latency & Egress CPQ Co-Pilot powered by WebMCP

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WebMCP Standard](https://img.shields.io/badge/WebMCP-Enabled-orange.svg)](#webmcp-implementation)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![React Flow](https://img.shields.io/badge/React_Flow-12-FF0072.svg)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

> **Devpost Submission Link:** [webmcp.devpost.com](https://webmcp.devpost.com)  
> **Live Web App:** Testable in the ChatGPT Desktop in-app browser or Google Chrome with `#enable-webmcp-testing`.

---

## 📖 Overview & The Real Problem

Enterprises waste **over $150 Billion annually** on misconfigured cloud infrastructure, unbudgeted cross-region network egress bandwidth, and unoptimized commitment discounts.

### What is "Egress"?
* **Ingress (Inbound):** Data entering a cloud datacenter (always free / $0.00).
* **Egress (Outbound):** Data leaving a cloud provider's datacenter to users or other regions. Providers bill **$0.08 to $0.12 per Gigabyte**.
* Egress is an **architectural** cost (10–20%+ of monthly cloud bills) that cannot be refactored post-deployment—it must be solved at the topology design stage.

**CloudTopology CPQ** is an interactive multi-cloud Configure-Price-Quote (CPQ) and network topology co-pilot. Built on **React Flow** and powered by **WebMCP**, it enables human cloud architects and AI agents to visually design, cost-simulate, and mathematically optimize multi-region architectures (AWS, GCP, Azure, Cloudflare) in real time with sub-10ms deterministic calculation speed.

---

## 🎯 Devpost Submission Questions

### 1. Why is this use case a strong fit for WebMCP?
Raw LLMs struggle with multi-tier tiered egress curves, multi-cloud pricing tables, geodesic speed-of-light fiber latency formulas, and complex spatial network graphs. WebMCP provides the exact bridge needed: the webpage hosts a deterministic client-side FinOps calculation engine and exposes typed tools (`get_topology_summary`, `simulate_traffic_and_egress`, `optimize_cloud_architecture`, `export_terraform_iac`) directly to the AI agent. The agent reasons about high-level business constraints (e.g. *"keep European response times under 50ms while cutting our AWS bandwidth bill"*), while the client-side WebMCP application guarantees 100% mathematical precision and real-time visual feedback.

### 2. How does it create a better user experience?
Instead of an architect manually filling out 50 nested pricing calculator dropdowns or getting surprise $40,000 monthly bills after deployment, they simply interact with their AI co-pilot on a visual canvas. The user can drag and drop compute, database, and edge nodes across world regions, while the AI agent uses WebMCP tools to inject Cloudflare zero-egress edge caching, resolve GDPR cross-border violations, and apply 3-Year Savings Plans—all while updating live monthly cost counters and latency matrices in under 10ms.

### 3. What can people and agents do together that was difficult or impossible before?
* **Zero-Hallucination Multi-Cloud FinOps:** The AI agent cannot hallucinate instance prices or egress fees because every topology alteration is verified deterministically against verified cloud catalog rules.
* **Instant Talk-or-Touch Architecture Iteration:** Human architects can drag nodes on the canvas or type natural language instructions to explore complex "what-if" architectural trade-offs in seconds.
* **1-Click Terraform IaC Generation:** Instantly turns the validated visual topology into production-ready Terraform / OpenTofu HCL code and formal Enterprise CPQ Quote documents.
* **Custom Enterprise Rate Cards (Beta):** Upload custom JSON rate sheets or apply blanket EDA percentages in 100% client-side memory.

### 4. How did you implement WebMCP?
CloudTopology CPQ implements the WebMCP standard via `src/tools/modelContextBridge.ts`:
* Registers typed tools on `window.modelContext`, `document.modelContext`, and `navigator.modelContext`.
* Provides schemas and execution handlers for 7 core FinOps tools.

---

## 🏢 Air-Gapped Private VPC Deployment (Experimental Beta)

> [!WARNING]
> **EXPERIMENTAL BETA:** The Docker container setup and Air-Gapped VPC deployment are currently in **Beta**. Do not deploy directly to production VPCs without prior internal staging and security auditing.

```bash
# Build standalone air-gapped container
docker build -t cloudtopology-cpq:latest .

# Run in isolated corporate staging environment
docker run -d -p 8080:80 --name cpq-app cloudtopology-cpq:latest
```

---

## 🚀 Quick Start & Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run Vitest test suite
npm test

# Build for production
npm run build
```

---

## ⚖️ License & Devpost Competition Compliance

* **Open Source:** Licensed under the [MIT License](LICENSE).
* **Trademark Safety:** Provider identifiers use generic badges, standard cloud architecture iconography, and text labels (`AWS`, `GCP`, `Azure`, `Cloudflare`). No proprietary copyrighted corporate brand logos are included.
* **Self-Contained Data:** 100% offline JSON pricing catalog (<50 KB) ensures instant page load and zero external API dependencies or paywalls during judging.
