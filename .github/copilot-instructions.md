# Tab Stack Copilot Instructions

- This repository is a VS Code extension for saving, restoring, and switching full tab layouts with groups, snapshots, add-ons, and Git-aware workflows.
- Start with `README.md` for product behavior and command IDs
- Main extension code lives under `src/`. Webview source lives under `src/webview/`. Standalone event-analysis tooling lives under `tools/vscode-event-analyzer/`.
- Build with `npm run compile`. Lint with `npm run lint`. Unit tests run with `npm run test:unit`. Full validation is `npm run test`, which also runs the Electron integration suite. Prefer the smallest relevant command before widening to the full suite.
- Use `npm run analyze:events` when diagnosing raw VS Code tab or tab-group event ordering, duplication, or missing events. That analyzer is the source of truth for what VS Code actually emitted.
- Tab/group change work should prefer deterministic replay over live fallback capture. Snapshot provenance, compression, replay order, and separation of observation versus resolution are central concerns.
- Keep changes localized. Reuse the existing handler, service, mediator, store, and factory patterns instead of introducing parallel abstractions.
- When changing observable extension behavior, update or add tests in `tests/unit` or `tests/integration` that cover the external behavior.
- For structural analysis and codebase research, use the Octocode MCP setup documented in `AI_SETUP.md`. Start with Octocode semantic search, view/signatures, and GraphRAG before widening to direct source reads. Refresh the local index with `npm run octo:index` or `npm run octo:reindex` when repo structure changes significantly.