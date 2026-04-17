---
description: Add or tighten an integration test around resolved tab-change behavior.
agent: agent
---

Read [README.md](../../README.md), and the existing integration suite under [tests/integration](../../tests/integration).

When using this prompt:

1. Identify the user-visible scenario and the expected resolved event payload.
2. Prefer covering `TabChangeProxyService.onDidChangeTabs` outcomes rather than testing internal helpers unless the task explicitly targets a reducer.
3. Reuse the existing integration helpers and any test-only extension surface instead of inventing a parallel harness.
4. Keep timing control explicit: subscribe first, perform the editor action, then await the next resolved event with a timeout.
5. Validate with the smallest relevant command set, usually `npm run test:integration` or a narrower targeted run if the suite supports it.