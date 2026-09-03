# User Guide & Frequently Asked Questions (FAQ) 📖

Welcome to **CloudTopology CPQ**! This guide covers everything you need to know about designing architectures, simulating costs, using WebMCP with AI agents, and exporting infrastructure.

---

## 🚀 Quick-Start Walkthrough

### 1. Load a Preset or Start Fresh
* Click the **Presets** tab in the left sidebar.
* Choose from production-ready architectures:
  * **Global E-Commerce Web App** (Multi-region CDN + Web + DB)
  * **Multi-Tenant SaaS (Modular Monolith)** (Cloudflare Edge, AWS App, Aurora pgvector)
  * **AI Inference & LLM Serving Cluster** (NVIDIA H100 / A100 GPU compute cluster)
  * **GDPR FinTech Banking Core** (EU sovereign compliance setup)
* Or click **New Canvas** / **Start with Blank Canvas** to design from scratch.

### 2. Add Multi-Cloud Nodes
* Click the **Add Node** tab.
* Filter by Cloud Provider (**AWS**, **GCP**, **Azure**, **Cloudflare**) and Service Category (**Compute**, **Database**, **Storage**, **Edge/CDN**).
* Search from 50+ enterprise SKUs (e.g. `H100`, `Aurora`, `Workers`) and click to drop nodes on the canvas.

### 3. Connect Handles to Model Traffic & Egress
* Drag from the blue output handle on a source node to an input handle on a target node.
* The animated edge immediately computes:
  * Monthly Data Transfer (GB / TB)
  * Monthly Egress Fee ($/mo)
  * Fiber-Optic Latency (ms)

### 4. Inspect & Customize Parameters
* Click any node on the canvas to open the **Inspect** panel.
* Adjust scale (e.g., 1–32 pods), storage volume (GB/TB), datacenter region, or toggle GDPR PII flags.

### 5. Export Quotes & Terraform IaC
* Click **CPQ Quote** in the header to view an itemized Bill of Materials with ACV/TCV.
* Click **Terraform** to generate ready-to-run Terraform HCL 2.0 multi-cloud IaC code.

---

## 🤖 WebMCP Agentic Guide

CloudTopology CPQ exposes 8 typed tools on `window.modelContext` and `document.modelContext`.

### Interacting with External AI Agents:
You can prompt ChatGPT Desktop, Claude, Gemini, or Antigravity with natural language prompts:
* *"Audit our active topology for GDPR compliance and report the p95 fiber latency across all global links."*
* *"Cut our AWS cross-region egress bill by injecting Cloudflare zero-egress edge caching."*
* *"Move all customer databases containing EU PII to Frankfurt (aws-eu-central-1)."*
* *"Generate production-ready Terraform HCL configuration for this topology."*

---

## ❓ Frequently Asked Questions (FAQ)

### Q1: Is an internet connection required to use the app?
**No.** CloudTopology CPQ runs 100% client-side in your browser. All FinOps calculations, graph algorithms, and local project persistence work completely offline.

### Q2: How does the app remember my work?
Your active canvas is automatically saved to `localStorage` on every change. You can also explicitly name and save architectures to your **"Saved Library"** or download a `.json` backup via the **Save / Load** modal.

### Q3: How do I switch between Light and Dark themes?
Click the **`☀️ Light` / `🌙 Dark`** toggle button in the top-right corner of the FinOps KPI bar. Your theme preference is automatically remembered.
