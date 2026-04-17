# Scenario: X3: group activation (5vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## X3: group activation (5vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 1
- **Observed events:** 1

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:49.359Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-4","viewColumn":4,"isActive":true,"activeTabRefId":"tab-4","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-4"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:49.359Z] GROUP v0 -> v1** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

---
