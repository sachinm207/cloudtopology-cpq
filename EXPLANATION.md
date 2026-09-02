# CloudTopology CPQ: Plain English Guide & System Architecture 📖

---

## 1. 💡 What is "Egress"? (Explained in Plain English)

Imagine you open a self-storage unit:
* **Ingress (Moving In):** The storage company lets you drive a truck in and unload all your furniture for **free ($0.00)**.
* **Egress (Moving Out):** When you want to take your furniture out or show it to friends, the company charges you **$100 for every single box you remove**!

In the cloud world:
* **Ingress:** Putting your files and database records *into* AWS or Google Cloud is **100% free**.
* **Egress:** Sending that data *out* to users' smartphones, streaming video, or copying databases between the US and Europe costs **$0.08 to $0.12 per Gigabyte**.

### Why Egress is Dangerous for Companies
If a company's website transfers 50 Terabytes of images and API responses a month, that company receives a **$4,200+ monthly bill purely for data transfer** on top of server costs.

**CloudTopology CPQ** solves this by letting architects drag and drop **Cloudflare Zero-Egress Edge Caching** or VPC Peering to bypass expensive internet routes, slashing data transfer bills by up to 80% before the architecture is deployed.

---

## 2. 🎛️ What Happens When You Change the Plan Dropdown?

In the top header, there is a dropdown with 4 options:
1. **On-Demand** (Standard pay-as-you-go pricing)
2. **1-Yr Savings Plan** (~32% corporate commitment discount)
3. **3-Yr Savings Plan** (~55% maximum enterprise commitment discount)
4. **Spot Instances** (~65% discount for background workers)

### What changes immediately on your screen when you switch options?
* **Every Node Card on the Canvas:** The green price badge in the bottom-right of each server or database card recalculates its discounted monthly rate instantly.
* **Top Metric Bar:**
  * **"Total Monthly Spend"** updates to reflect the new net cost.
  * **"Monthly Savings"** reveals the exact dollar amount and percentage saved compared to On-Demand.
* **Enterprise CPQ Quote:** Opening the **"CPQ Quote"** modal shows the adjusted line items and total contract quote matching the active plan.

---

## 3. 📈 How is Numerical Pricing Data Gathered & Kept Fresh?

### Sourcing
* All compute, database, and storage prices come from official published cloud pricing endpoints:
  * AWS Price List API
  * GCP Cloud Billing Catalog
  * Azure Retail Prices REST API
  * Cloudflare R2 & Workers developer documentation

### Future Updates & Maintainability
* Pricing data is stored cleanly in `src/data/catalog.ts` with strict TypeScript typing (`ResourceSKU`, `ProviderEgressRules`).
* When cloud providers lower prices or release new server families (e.g. AWS Graviton4), the catalog is updated via automated CI/CD API sync without needing to rewrite any canvas or UI logic.

---

## 4. 🤖 Why WebMCP is Revolutionary Here

Instead of an engineer manually clicking through 50 dropdown forms in an AWS calculator, they simply chat with the AI Co-Pilot:
* *"Cut $4,000 from our AWS bill without making European users lag."*
* The AI Agent uses WebMCP tools (`optimize_cloud_architecture`) to inspect the visual topology, inject edge caching, and rebalance commitment plans in under **10 milliseconds**!
