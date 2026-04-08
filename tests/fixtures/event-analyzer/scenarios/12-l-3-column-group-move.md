# Scenario: L: 3-column group move

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## L: 3-column group move

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]}]
- **After:** [{"viewColumn":2,"tabs":["package.json"]},{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:08.531Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-4","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-4"]},{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-5"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-6"]}] |
| 1 | 2026-04-12T15:20:08.532Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-7","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-8","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-8"]},{"groupRefId":"group-9","viewColumn":3,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-9"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:08.531Z] GROUP v0 -> v1** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.viewColumn` | 1 | 2 |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.viewColumn` | 1 | 2 |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.viewColumn` | 2 | 1 |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.0.viewColumn` | 2 | 1 |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-6" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-6" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-6" |

**[seq=1, time=2026-04-12T15:20:08.532Z] GROUP v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-4" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-4" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-5" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-5" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-5" | "tab-8" |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-6" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-6" | "tab-9" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-6" | "tab-9" |

---
