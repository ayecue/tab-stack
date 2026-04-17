# Scenario: X2: group activation (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## X2: group activation (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:47.534Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-2","viewColumn":2,"isActive":true,"activeTabRefId":"tab-2","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-2"]}] |
| 1 | 2026-04-12T15:20:47.701Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":3,"isActive":true,"activeTabRefId":"tab-3","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-3"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:47.534Z] GROUP v0 -> v1** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=1, time=2026-04-12T15:20:47.701Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

---
