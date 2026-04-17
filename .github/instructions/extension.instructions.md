---
applyTo: "src/**/*.ts,src/**/*.tsx,tests/**/*.ts,tests/**/*.cjs,*.cjs"
---

- Keep runtime surfaces distinct: extension-host logic lives under `src/`, webview code under `src/webview/`, and analyzer or build tooling under `tools/` and root `*.cjs` scripts.
- Prefer the existing handler, service, store, and mediator split instead of introducing new cross-cutting abstractions. Commands and handlers should orchestrate, services should isolate VS Code APIs, and stores should own durable state.
- If a change touches extension behavior, validate with `npm run compile` plus the smallest relevant test command before widening to `npm run test`.
- Reuse the existing `tests/` helpers and factory patterns instead of building one-off fixtures.
- Avoid direct VS Code API access in deep utility or reducer layers when an existing service abstraction already owns that boundary.