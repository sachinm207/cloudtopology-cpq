# CloudTopology CPQ ☁️📊⚡
### Multi-Cloud FinOps Architecture, Latency & Egress CPQ Co-Pilot powered by WebMCP

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![WebMCP Standard](https://img.shields.io/badge/WebMCP-8_Tools_Active-emerald.svg)](#webmcp-tool-specifications)
[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live_App-black.svg)](https://cloudtopology-cpq.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![React Flow](https://img.shields.io/badge/React_Flow-12-FF0072.svg)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)

> **🌐 Live Production Web App:** [https://cloudtopology-cpq.vercel.app](https://cloudtopology-cpq.vercel.app)  
> **📦 GitHub Repository:** [https://github.com/sachinm207/cloudtopology-cpq](https://github.com/sachinm207/cloudtopology-cpq)  
> **🏆 Devpost Submission Guide:** [DEVPOST_SUBMISSION.md](DEVPOST_SUBMISSION.md)  

---

## 📖 Overview

Enterprises waste **over $150 Billion annually** on misconfigured cloud infrastructure, unbudgeted cross-region network egress bandwidth, and unoptimized commitment discounts.

**CloudTopology CPQ** is an interactive multi-cloud Configure-Price-Quote (CPQ) and network topology co-pilot. Built on **React Flow** and powered by **WebMCP**, it enables human cloud architects and autonomous AI coding agents to visually design, cost-simulate, and mathematically optimize multi-region architectures (AWS, GCP, Azure, Cloudflare) in real time with sub-10ms deterministic calculation speed.

---

## ✨ Key Features

1. **🤖 Autonomous WebMCP 8-Tool Suite:**
   * Fully exposes typed tools on `window.modelContext` and `document.modelContext` enabling external AI agents (ChatGPT Desktop, Claude, Gemini, Antigravity) to query catalogs, inspect topologies, mutate nodes, simulate traffic, and resolve GDPR violations in real time.
2. **💰 Real-Time Multi-Cloud FinOps Engine:**
   * Supports On-Demand, 1-Year Savings Plans (~35% off), 3-Year Savings Plans (~55% off), and Spot Fleets (~65% off) across 50+ enterprise SKUs (NVIDIA H100/A100 GPUs, Graviton3, Aurora Serverless, Cloud Spanner, Cloudflare Workers AI).
3. **⚡ Piecewise Egress & Speed-of-Light Latency Modeling:**
   * Calculates non-linear multi-tier bandwidth tariffs and geodesic optical fiber round-trip times (ms) using the Haversine distance formula between global datacenters.
4. **🇪🇺 Instant GDPR Data Residency Auditing:**
   * Flags databases with customer PII located outside sovereign European regions and detects unencrypted cross-cloud links with 1-click remediation.
5. **📋 Enterprise CPQ Quotes & Terraform IaC Export:**
   * Synthesizes formal procurement documents (with ACV/TCV metrics) and generates ready-to-run Terraform HCL 2.0 files.
6. **💾 Persistence & JSON Import/Export:**
   * Auto-saves active designs to `localStorage`, provides a "My Saved Setups" project library, and supports 1-click `.json` export and import.
7. **🌗 Light & Dark Theme Support:**
   * Crisp, high-contrast Light Theme (default) with 1-click toggle to obsidian Dark Theme.

---

## 🛠️ WebMCP Tool Specifications

| Tool Name | Type | Description |
| :--- | :---: | :--- |
| `list_cloud_regions_and_skus` | `readOnly` | Lists available regions, compute SKUs, database engines, and egress rates with allowed tier rules. |
| `get_topology_summary` | `readOnly` | Returns active node graph, monthly spend breakdown, egress bills, and GDPR compliance alerts. |
| `simulate_traffic_and_egress` | `mutation` | Simulates monthly GB transfer over specific links and computes exact dollar impact. |
| `validate_compliance_and_latency` | `readOnly` | Audits GDPR data residency rules and fiber-optic network latency matrices. |
| `optimize_cloud_architecture` | `mutation` | Applies FinOps optimizations (3-Yr Savings Plans, Spot stateless compute fleets, edge caching, EU database relocation). |
| `apply_topology_to_canvas` | `mutation` | Updates the live interactive React Flow topology board with universal flat/nested JSON normalization. |
| `apply_enterprise_rate_sheet` | `mutation` | Dynamically overrides catalog rates with Enterprise Discount Agreements (EDA). |
| `export_terraform_iac` | `readOnly` | Generates validated Terraform HCL code and enterprise CPQ Quote documents. |

---

## 🔄 Automated Monthly Rate Card Sync (GitHub Actions)

* **Workflow:** `.github/workflows/update_cloud_pricing.yml`
* **Schedule:** Runs automatically at `00:00 UTC` on the 1st of every month.
* **Functionality:** Queries official cloud rate APIs, validates schema integrity, executes test suites (`vitest`), and opens automated Pull Requests.

---

## 🚀 Quick Start & Local Development

```bash
# 1. Clone repository
git clone https://github.com/sachinm207/cloudtopology-cpq.git
cd cloudtopology-cpq

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Run Vitest test suite (14/14 passing)
npm test

# 5. Build for production
npm run build
```

## 📚 Documentation & Architecture Guides

* **🏆 [DEVPOST_SUBMISSION.md](DEVPOST_SUBMISSION.md):** Complete hackathon submission pitch, story with LaTeX mathematics, and tech stack.
* **📊 [FinOps & Latency Architecture](docs/FINOPS_AND_LATENCY_ARCHITECTURE.md):** In-depth breakdown of piecewise egress tariffs, Haversine geodesic distance, and commitment discount multipliers.
* **📖 [User Guide & FAQ](docs/USER_GUIDE_AND_FAQ.md):** Step-by-step visual onboarding, WebMCP agent prompts, and frequently asked questions.
* **🖼️ [Screenshot Gallery](gallery/):** 12 high-resolution 3:2 ratio screenshots showcasing all features in Light and Dark themes.

---

## 📄 License
MIT License • Built for the **WebMCP Devpost Hackathon**.
