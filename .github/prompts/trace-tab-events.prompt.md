---
description: Investigate raw VS Code tab or tab-group event behavior and align fixes with the active tab-change plan.
agent: agent
---

Start with [AI_SETUP.md](../../AI_SETUP.md).

Use this workflow:

1. Restate the scenario in terms of the resolved outcome categories: `created`, `closed`, `moved`, and `updated`.
2. If the issue is about raw VS Code events, missing moves, or duplicate group events, run `npm run analyze:events` and inspect `tests/fixtures/event-analyzer`.
3. Keep observation, compression, synthetic generation, replay, and final resolution responsibilities separate.
4. Prefer deterministic `before` and `after` snapshot provenance over live fallback capture.
5. End with the smallest code and test change that resolves the mismatch, plus the validation steps you ran.