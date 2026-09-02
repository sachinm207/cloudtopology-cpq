# Multi-Cloud Data & FinOps Architecture Specification 💡

## 1. Cloud Provider Pricing Dataset (`cloud_pricing.json`)
The pricing catalog encapsulates verified baseline rates across AWS, Google Cloud, Microsoft Azure, and Cloudflare:

### Compute SKUs (Hourly & Monthly Normalized)
- **AWS**: `t4g.xlarge` ($0.1344/hr), `c6i.2xlarge` ($0.34/hr), `m6i.4xlarge` ($0.768/hr), `r6i.4xlarge` ($1.008/hr), `p4de.24xlarge` ($32.77/hr)
- **GCP**: `e2-standard-4` ($0.134/hr), `c2-standard-8` ($0.417/hr), `n2-standard-16` ($0.776/hr), `a2-highgpu-1g` ($3.67/hr)
- **Azure**: `Standard_D4s_v5` ($0.192/hr), `Standard_F8s_v2` ($0.338/hr), `Standard_E16s_v5` ($0.88/hr)
- **Cloudflare**: `Workers Paid` ($5/mo base + $0.30/million reqs), `R2 Storage` ($0.015/GB/mo, $0.00 egress)

### Egress Bandwidth Pricing Tiers ($/GB)
| Route / Destination | AWS | GCP | Azure | Cloudflare |
| :--- | :---: | :---: | :---: | :---: |
| **Internet Egress (First 10 TB)** | $0.090 | $0.120 | $0.087 | **$0.000** |
| **Internet Egress (10 - 50 TB)** | $0.085 | $0.110 | $0.083 | **$0.000** |
| **Internet Egress (50 - 150 TB)** | $0.070 | $0.080 | $0.070 | **$0.000** |
| **Cross-Region (Inter-Continent)** | $0.020 | $0.020 | $0.020 | **$0.000** |
| **Inter-Zone (Same Region)** | $0.010 | $0.010 | $0.010 | **$0.000** |
| **Cloudflare Bandwidth Alliance** | $0.000 | $0.000 | $0.000 | **$0.000** |

## 2. Geodesic Latency Propagation Model
Calculates round-trip time ($RTT_{ms}$) between coordinates $(\text{lat}_1, \text{lon}_1)$ and $(\text{lat}_2, \text{lon}_2)$:
$$d = 2 R \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
$$RTT \approx \frac{2 \cdot d}{v_{\text{fiber}}} + \text{Switching Overheads (12ms)}$$
where $v_{\text{fiber}} \approx 200,\!000\text{ km/s}$ ($c / 1.52$).

## 3. GDPR Compliance Guardrails
- **Rule 1 (EU PII Retention)**: Customer PII databases in `eu-central-1` (Frankfurt) or `eu-west-1` (Ireland) must not transmit plaintext records to non-EU regions without an edge tokenization proxy.
- **Rule 2 (Egress Encryption & Peering)**: Inter-region connections must specify encrypted VPC Peering or Cloud Interconnect.
