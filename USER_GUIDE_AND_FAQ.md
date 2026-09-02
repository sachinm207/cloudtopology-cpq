# CloudTopology CPQ: Comprehensive User Guide, Target Personas & Technical FAQ 📘

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

## 2. 🛡️ Spot & Savings Plan Restrictions per Resource Type

Not every cloud service supports Spot instances or 3-Year Savings Plans:

| Service Category | Spot Instances | 1-Yr Savings Plan | 3-Yr Savings Plan | Technical Rationale |
| :--- | :---: | :---: | :---: | :--- |
| **Compute (EC2, GCE, Azure VMs)** | ✅ Supported | ✅ Supported | ✅ Supported | Stateless; can be safely terminated with 2-min notice. |
| **Databases (Aurora, Cloud SQL)** | ❌ **Forbidden** | ✅ Supported | ✅ Supported | Stateful ACID storage; abrupt termination causes database corruption. |
| **Object Storage (S3, R2)** | ❌ **Forbidden** | ⚠️ Volume Contract | ⚠️ Volume Contract | Billed on gigabyte-months stored, not compute cores. |
| **Edge CDN (Workers, CloudFront)** | ❌ **Forbidden** | ✅ Supported | ✅ Supported | Serverless request-based execution at edge point-of-presence. |

* **Automated Guardrails:** When a user inspects a Database node, Spot options are automatically locked with a `🔒 No Spot (Stateful)` indicator. If a global Spot simulation is triggered, databases gracefully fallback to their highest eligible commitment plan.

---

## 3. 📂 Custom Enterprise Rate Sheets (EDAs / PPAs)

### Why Uploading Confidential Rate Cards is 100% Safe:
* **Zero Backend Servers:** The app runs **100% inside your browser's RAM** (Client-Side SPA). No files are uploaded to any external server.
* **Standard Compatible Schema (`custom_rates.json`):**
```json
{
  "version": "1.0",
  "enterpriseName": "Acme Corp Private Pricing Addendum",
  "blanketDiscountPercent": 14.5,
  "customEgressRatePerGb": 0.045,
  "skuOverrides": [
    {
      "skuId": "aws-ec2-c6i-2xlarge",
      "customHourlyPrice": 0.285,
      "customSavingsPlan1YrDiscount": 0.40,
      "customSavingsPlan3YrDiscount": 0.62
    },
    {
      "skuId": "aws-rds-aurora-postgres-large",
      "customHourlyPrice": 0.750,
      "customSavingsPlan1YrDiscount": 0.35,
      "customSavingsPlan3YrDiscount": 0.52
    }
  ]
}
```

---

## 4. 🏢 Air-Gapped Private VPC Deployment

For defense, healthcare, and enterprise banking environments with zero outbound internet access:
1. **Self-Contained Bundle:** All cloud rates, egress rules, and icons are bundled in the local distribution.
2. **Docker Container Deployment:**
```bash
# Build standalone air-gapped container
docker build -t cloudtopology-cpq:latest .

# Run inside isolated corporate VPC (zero internet required)
docker run -d -p 8080:80 --name cpq-app cloudtopology-cpq:latest
```
3. Open `http://<internal-vpc-ip>:8080/` on your corporate intranet.

---

## 5. 📊 Understanding Connection Edge Labels (`8.3 TB | $0/mo | 8.5ms`)

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
