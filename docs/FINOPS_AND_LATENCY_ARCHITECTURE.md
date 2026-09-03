# FinOps & Network Latency Architecture Guide 📊⚡

This document details the mathematical models, financial pricing algorithms, and network physics equations implemented in **CloudTopology CPQ**.

---

## 1. 🌐 Egress & Data Transfer Economics

### Ingress vs. Egress
* **Ingress (Inbound):** Data moving *into* a cloud datacenter (e.g. uploading user files, database writes). Billed at **$0.00 (Free)** across AWS, GCP, and Azure.
* **Egress (Outbound):** Data leaving a cloud datacenter to public internet users, other cloud regions, or external providers. Billed at **$0.08 to $0.12 per Gigabyte**.
* **Bandwidth Alliance & Zero Egress:** Peering through Cloudflare Tunnels and Cloudflare R2 object storage routes traffic with **$0.00/GB** egress fees.

### Piecewise Tiered Egress Algorithm
For public internet and cross-cloud traffic, data transfer follows non-linear volume discounts:
```
Cost_egress = ∑ (ΔVolume_i × Rate_i)
```

| Volume Bracket | AWS Internet Egress | GCP Internet Egress | Azure Internet Egress | Cloudflare CDN |
| :--- | :---: | :---: | :---: | :---: |
| **First 10 TB / mo** | $0.090 / GB | $0.085 / GB | $0.087 / GB | **$0.00 / GB** |
| **Next 40 TB / mo** | $0.085 / GB | $0.080 / GB | $0.083 / GB | **$0.00 / GB** |
| **Next 100 TB / mo** | $0.070 / GB | $0.065 / GB | $0.070 / GB | **$0.00 / GB** |
| **Over 150 TB / mo** | $0.050 / GB | $0.045 / GB | $0.050 / GB | **$0.00 / GB** |

---

## 2. 🌍 Speed-of-Light Optical Latency Modeling

### Geodesic Great-Circle Distance (Haversine Formula)
To compute physical network distance ($d$) between any two cloud datacenters:
```
a = sin²(Δφ / 2) + cos(φ₁) · cos(φ₂) · sin²(Δλ / 2)
c = 2 · atan2( √a, √(1 − a) )
d = R · c   (where R = 6,371 km)
```

### Optical Fiber Propagation Time
Light propagates through silica glass fiber cables at approximately **$c_{\text{fiber}} = 200,000\text{ km/s}$** (refractive index $n \approx 1.468$):
```
Fiber_Propagation_RTT_ms = (2 × d_km) / 200
Total_RTT_ms = Fiber_Propagation_RTT_ms + Network_Hop_Overhead_ms
```

| Connection Type | Network Hop Overhead |
| :--- | :---: |
| **Direct Connect / FastConnect** | +3.0 ms |
| **Private VPC Peering** | +5.0 ms |
| **Cloudflare Tunnel (Anycast)** | +6.0 ms |
| **Public Internet Transit** | +15.0 ms |

---

## 3. 📉 Commitment Discount Pricing Multipliers

When selecting commitment plans, nodes dynamically recalculate their monthly spend:

| Commitment Plan | Compute Multiplier | Database Multiplier | Storage Multiplier |
| :--- | :---: | :---: | :---: |
| **On-Demand** | 1.00 (Baseline) | 1.00 (Baseline) | 1.00 (Baseline) |
| **1-Year Savings Plan** | 0.65 (~35% off) | 0.68 (~32% off) | 0.95 (~5% off) |
| **3-Year Savings Plan** | 0.45 (~55% off) | 0.48 (~52% off) | 0.90 (~10% off) |
| **Spot Fleets** | 0.35 (~65% off) | N/A (Stateful) | N/A (Stateful) |

---

## 4. 🔄 Catalog Rate Syncing & Maintenance

* **Catalog Source:** `src/data/catalog.ts` contains 50+ enterprise SKUs and 16 global regions.
* **Automated Sync Workflow:** `.github/workflows/update_cloud_pricing.yml` queries official cloud pricing APIs on the 1st of every month, runs test suites, and opens automated pull requests.
