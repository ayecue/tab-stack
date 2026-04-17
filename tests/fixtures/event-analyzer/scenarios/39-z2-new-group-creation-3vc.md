# Scenario: Z2: new group creation (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## Z2: new group creation (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":[]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:57.974Z | GROUP | 0 | 1 | [{"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-4","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-4"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-5"]},{"groupRefId":"group-6","viewColumn":3,"isActive":true,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-6"]}] |
| 1 | 2026-04-12T15:20:57.976Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-7","viewColumn":4,"isActive":true,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:57.974Z] GROUP v0 -> v1** — 13 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-6" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-6" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-6" |
| CREATE | `3` |  | {"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:57.976Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

---
