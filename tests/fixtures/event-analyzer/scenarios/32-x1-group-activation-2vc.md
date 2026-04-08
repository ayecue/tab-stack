# Scenario: X1: group activation (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## X1: group activation (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 1
- **Observed events:** 1

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:45.974Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-2","viewColumn":2,"isActive":true,"activeTabRefId":"tab-2","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-2"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:45.974Z] GROUP v0 -> v1** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

---
