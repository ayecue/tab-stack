# Scenario: Z1: new group creation (1vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## Z1: new group creation (1vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":[]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:56.247Z | GROUP | 0 | 1 | [{"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-2","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-2"]}] |
| 1 | 2026-04-12T15:20:56.249Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":2,"isActive":true,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:56.247Z] GROUP v0 -> v1** — 5 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-2" |
| CREATE | `1` |  | {"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:56.249Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

---
