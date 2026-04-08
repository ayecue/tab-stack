# Agent Notes

- Start with `README.md` for product behavior and command IDs.
- Write reviewable plan documents under `plan/`. When a user asks for a plan, create or update a markdown file there for review instead of leaving the plan only in chat.
- Always place interfaces, enums, and type aliases in the `src/types/` folder — not inline in handler, service, or utility files.
- Validate with `npm run compile`, the smallest relevant test command, and `npm run analyze:events` when debugging raw VS Code tab or group behavior.
- After fixing event-pipeline or tab-state behavior, always run `npm run test:integration` as a verification step. Unit tests alone cannot catch runtime wiring, timing, or classification issues that only surface in the Electron host. Expect ~4 minutes for the full suite.
- Use `AI_SETUP.md` for the workspace MCP setup, reusable prompt files, and the Octocode-first codebase research workflow.
- Refresh or rebuild the local Octocode index with `npm run octo:index` or `npm run octo:reindex` before deeper architecture research if the repo changed significantly.