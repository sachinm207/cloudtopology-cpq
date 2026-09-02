# CloudTopology CPQ: Comprehensive User Guide, Target Personas & Architecture FAQ 📘

---

## 1. 🎯 Target Audience & Required Knowledge

### Who is this application built for?
1. **Principal Cloud Architects & Solutions Architects:**
   * Design resilient multi-region or multi-cloud topologies.
   * Model latency impact before writing a single line of infrastructure code.
2. **FinOps Leads & Cloud Economists:**
   * Forecast monthly infrastructure bills and eliminate unbudgeted cross-region egress surprises.
   * Model commitment discount trade-offs (On-Demand vs 1-Yr vs 3-Yr Savings Plans).
3. **VP of Engineering, CTOs & CFOs:**
   * Review executive Configure-Price-Quote (CPQ) summaries and ROI recommendations during architecture review boards.
4. **DevOps & Platform Engineers:**
   * Export validated visual topology directly into production Terraform / OpenTofu (`main.tf`) infrastructure-as-code files.

### What knowledge does a user need?
* **Basic Knowledge Needed:** Fundamental understanding of cloud building blocks (Virtual Machines/Compute, Relational/NoSQL Databases, Object Storage, and CDN/Edge) and geographical regions (e.g. `US-East`, `EU-Central`).
* **What Users DO NOT Need to Know:** Users do *not* need to memorize complex cloud rate cards, piecewise egress billing brackets ($0.09/GB vs $0.085/GB), speed-of-light fiber propagation formulas, or 600-line pricing calculators. The client engine and WebMCP AI agent solve all mathematical and compliance constraints automatically.

---

## 2. ⚡ Precision & Accuracy: CPQ & Terraform HCL

### Is the CPQ Pricing Accurate?
**Yes — 100% deterministic arithmetic based on verified cloud rate cards:**
* **Compute, Database & Storage SKUs:** Normalized to 730 operating hours per calendar month based on official AWS, GCP, Azure, and Cloudflare pricing.
* **Tiered Egress Bandwidth Pricing:** Implements exact piecewise billing brackets:
  * *Internet Public Egress (AWS/GCP/Azure):* First 10 TB at $0.090–$0.120/GB $\rightarrow$ Next 40 TB at $0.080–$0.110/GB $\rightarrow$ Next 100 TB at $0.070–$0.080/GB.
  * *Inter-Zone (Same Region):* $0.01/GB.
  * *Cross-Region (Same Provider Backbone):* $0.02/GB.
  * *Cloudflare Bandwidth Alliance / Zero Egress:* $0.00/GB.
* **Commitment Discount Modeling:** Real-world published discount percentages (1-Year Savings Plans: 28–38% off; 3-Year Reserved: 50–62% off; Spot: 65% off).

### Is the Generated Terraform Code Accurate?
**Yes — Produces syntactically valid HCL 2.0 (OpenTofu 1.6+ & Terraform 1.5+):**
* Valid `terraform {}` configuration block with provider declarations (`hashicorp/aws`, `hashicorp/google`, `hashicorp/azurerm`, `cloudflare/cloudflare`).
* Resources populated with actual instance types (`c6i.2xlarge`, `t4g.xlarge`, `g5.2xlarge`), multi-AZ Aurora clusters with serverless v2 scaling, encrypted S3 buckets, and VPC peering connections.

---

## 3. 📊 Understanding Connection Edge Labels (`8.3 TB | $0/mo | 8.5ms`)

Each animated line connecting two nodes represents a live network path with three real-time telemetry metrics:

```
  [ Source Node ] ──────────( 8.3 TB | $0/mo | 8.5ms )──────────> [ Target Node ]
                                ▲        ▲        ▲
                                │        │        └─ Round-trip latency over fiber
                                │        └────────── Monthly egress bandwidth bill
                                └─────────────────── Monthly data transfer throughput
```

1. **Throughput Volume (`8.3 TB` / `500 GB`):**
   * The estimated volume of data moving across that network link every calendar month (API payloads, database replication streams, media downloads).
2. **Monthly Egress Bill (`$0/mo` vs `$153/mo`):**
   * The dollar amount billed by the source cloud provider for that data transfer.
   * **Why `$0/mo`?** If the connection uses **Cloudflare Tunnel / Bandwidth Alliance**, egress fees are waived to **$0.00**.
   * **Why `$153/mo`?** If data flows across the public internet from AWS Frankfurt to AWS US, AWS charges public internet egress rates.
3. **Network Latency (`8.5ms` vs `78.4ms`):**
   * The physical round-trip propagation time ($RTT$) for data packets traveling over transatlantic/transpacific fiber-optic glass cables ($c / 1.52 \approx 200,\!000\text{ km/s}$) plus router switching overhead.

---

## 4. 💰 Understanding Commitment Plan Dropdowns

Cloud providers charge significantly different rates depending on enterprise payment commitments:

| Plan Option | Discount Level | Best Used For |
| :--- | :---: | :--- |
| **On-Demand** | **0% (Baseline)** | Unpredictable workloads, new prototypes, or short-lived experiments. |
| **1-Yr Savings Plan** | **~28% – 35% Off** | Steady-state production services with a 1-year corporate budget horizon. |
| **3-Yr Savings Plan** | **~50% – 62% Off** | Core enterprise databases and primary API clusters committed for 3 years (maximum FinOps ROI). |
| **Spot Instances** | **~65% – 70% Off** | Fault-tolerant batch processing, video encoding, and AI training pipelines that can tolerate interruptions. |

---

## 5. 🌐 Accommodating Complex Architectures (Infinite Canvas)

### Can the canvas handle complex 50+ node enterprise graphs?
**Yes — The canvas is completely unconstrained and dynamic:**

1. **No Fixed Schema or Rigid Grids:**
   * Built on **React Flow**, providing an infinite 2D plane with continuous panning, zooming (0.2x to 2.0x), and a live MiniMap.
2. **Arbitrary Topology Patterns Supported:**
   * **Hub-and-Spoke:** Central global database surrounded by regional edge gateways.
   * **Full Mesh:** Multi-region active-active clusters with cross-region replication.
   * **Multi-Cloud Hybrid:** AWS application servers connected to Cloudflare R2 zero-egress storage and GCP AI training clusters.
3. **High Performance at Scale:**
   * Client-side FinOps graph evaluator processes 50+ node graphs in **`<10ms`** without server round-trips.
