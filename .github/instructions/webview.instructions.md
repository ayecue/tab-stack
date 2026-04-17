---
applyTo: "src/webview/**/*.ts,src/webview/**/*.tsx,src/webview/**/*.css,webview.css,webview.html,webview.js"
---

- The source of truth for the UI is under `src/webview/`. Avoid manual edits to generated root webview assets unless the task is specifically about generated output.
- Keep message contracts aligned with `src/handlers/webview.ts`, `src/mediators/webview.ts`, and `src/types/messages.ts` when adding UI actions or state.
- Prefer the existing React and TypeScript patterns over adding new state libraries or heavy UI dependencies.
- Validate webview changes with `npm run compile` so the dedicated webview build step runs.