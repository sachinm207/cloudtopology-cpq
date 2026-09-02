# Technical & Domain Assumptions 📌

1. **Pricing Currency**: All costs normalized in USD ($/month), assuming 730 operating hours per calendar month.
2. **Egress Tiers**: Standard published public pricing for AWS, GCP, Azure, and Cloudflare as of 2026.
3. **Commitment Discounts**:
   - 1-Year All-Upfront / No-Upfront Savings Plan: ~28% - 34% discount off On-Demand.
   - 3-Year Reserved Instances: ~52% - 62% discount off On-Demand.
4. **Latency Approximations**: Inter-region latencies modeled via speed-of-light in glass fiber ($200\text{ km/ms}$) with real-world fiber routing topology penalties (+10–15ms per transatlantic/transpacific hop).
5. **GDPR Jurisdiction**: Regions marked `eu-central-1` (Frankfurt), `eu-west-1` (Dublin), `eu-west-3` (Paris) are EU sovereign. Transmitting raw database tables to US regions triggers a GDPR compliance warning unless edge tokenization / caching is active.
