# V79 Academy DP-700 Lab Data Pack

Use these small files for the practical exercises in **Data Engineering Foundations to Microsoft Fabric (DP-700 Prep) v1.1**.

## Files

- `customers.csv` — includes a later version of customer C003 and one missing email for validation/deduplication work.
- `products.csv` — product dimension data.
- `sales.csv` — includes cancelled data, an orphan customer, an orphan product and a negative quantity so quality checks produce meaningful results.
- `events.jsonl` — includes a duplicate event, server errors and an event that arrives outside the normal sequence for streaming/late-arrival practice.

## Suggested use

1. Start locally with SQL/Python if you do not yet have Fabric access.
2. In Fabric, land the files in a Lakehouse Bronze layer.
3. Build validated Silver outputs.
4. Build Gold analytical tables at a documented grain.
5. Use `events.jsonl` for Eventstream/Eventhouse/KQL or Spark Structured Streaming practice.

These files are intentionally small. The learning goal is correct engineering logic, observability and trade-off reasoning before scale.
