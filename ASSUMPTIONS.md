# Technical, Financial & Domain Assumptions 📌

---

## 1. 🌐 What is Egress & Data Transfer Economics?

### Ingress vs. Egress Definition
* **Ingress (Inbound Traffic):** Data moving *into* a cloud datacenter (e.g., uploading files, database writes). Cloud providers charge **$0.00** (Free) for ingress.
* **Egress (Outbound Traffic):** Data *leaving* a cloud provider's datacenter or region (e.g., streaming video to end users, downloading files, syncing databases between America and Europe).
* **The Financial Hazard:** Cloud providers charge **$0.08 to $0.12 per Gigabyte** for public internet and cross-cloud egress. A workload transferring 50 Terabytes/month incurs over **$4,200/month** in bandwidth transfer fees alone.

---

## 2. 🔄 How Numerical Data is Gathered & Maintained (Dynamic Updates)

### How Data is Gathered
1. **Public Cloud Price Lists:** Sourced from official public rate cards and REST APIs:
   * **AWS:** AWS Price List API (`https://pricing.us-east-1.amazonaws.com/offers/v1.0/aws/AmazonEC2/current/index.json`)
   * **Google Cloud:** GCP Cloud Billing Catalog API (`https://cloudbilling.googleapis.com/v1/services`)
   * **Microsoft Azure:** Azure Retail Prices API (`https://prices.azure.com/api/retail/prices`)
   * **Cloudflare:** Published Cloudflare Developer platform and R2 object storage rate schedules.
2. **Datacenter Geospatial Coordinates:** Latitude and Longitude coordinates for each cloud region (`us-east-1`, `eu-central-1`, `ap-northeast-1`, etc.) mapped to calculate geodesic fiber propagation delay.

### How Data is Updated Over Time
* **Modular Catalog File:** All cloud SKUs, hourly/monthly prices, discount brackets, and tiered egress curves are isolated in `src/data/catalog.ts`.
* **Automated CI/CD Sync:** In production, a scheduled GitHub Action or serverless cron worker queries cloud pricing APIs quarterly, validates the JSON schema against `ResourceSKU[]`, and generates automated pull requests with updated rate books.
* **Zero Disruption:** Because the FinOps engine (`finopsEngine.ts`) relies on typed interfaces (`ResourceSKU`, `CloudRegion`, `ProviderEgressRules`), updating pricing requires zero changes to the UI canvas or graph traversal algorithms.

---

## 3. 📉 Commitment Discount Tiers & Dropdown Reactive State Changes

When the user modifies the **FinOps Commitment Plan** dropdown in the top header, the application executes a sub-5ms reactive state transition across all components:

| Dropdown Option | Discount Multiplier | Financial Behavior & State Transition |
| :--- | :---: | :--- |
| **On-Demand** | **0% (Baseline)** | Standard pay-as-you-go hourly rate. Zero commitment. Shows highest monthly spend baseline. |
| **1-Yr Savings Plan** | **~28% – 38% Off** | Applies 1-Year All-Upfront commitment discount to compute and database nodes. Total Monthly Spend drops, and Monthly Savings counter increases. |
| **3-Yr Savings Plan** | **~50% – 62% Off** | Maximum enterprise discount for steady-state workloads. Reduces core database and server spend by more than half. |
| **Spot Instances** | **~65% – 70% Off** | Applies ephemeral spare compute discounts for fault-tolerant workers and AI batch jobs. |

### Visual Changes Triggered by Dropdown Selection:
1. **Node Price Badges:** Every node card on the canvas updates its `Est. Monthly: $XX/mo` badge immediately.
2. **Top Header KPIs:** `Total Monthly Spend`, `Monthly Savings ($ and %)`, and `Baseline Spend` recalculate in `<5ms`.
3. **CPQ Quote Modal:** Line-item unit prices and total enterprise quote figures update dynamically.

---

## 4. 🌍 Latency & GDPR Assumptions
1. **Speed of Light in Fiber:** Refractive index of silica optical fiber $n \approx 1.52$, yielding propagation speed $v \approx 200,\!000\text{ km/s}$ ($2\text{ ms per }200\text{ km RTT}$).
2. **Switching Overhead:** +3ms for Direct Connect/ExpressRoute, +5ms for VPC Peering, +15ms for public internet transit.
3. **GDPR Sovereign Scope:** Regions `aws-eu-central-1` (Frankfurt), `aws-eu-west-1` (Ireland), `gcp-europe-west3`, and `azure-westeurope` are designated EU sovereign. Connecting a PII database in these regions to non-EU nodes triggers an automated compliance violation.
