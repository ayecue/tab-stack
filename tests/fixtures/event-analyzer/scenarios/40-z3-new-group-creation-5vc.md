# Scenario: Z3: new group creation (5vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## Z3: new group creation (5vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE"]},{"viewColumn":6,"tabs":[]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:59.795Z | GROUP | 0 | 1 | [{"groupRefId":"group-11","viewColumn":6,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-7"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-9"]},{"groupRefId":"group-10","viewColumn":5,"isActive":true,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-10"]}] |
| 1 | 2026-04-12T15:20:59.796Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-11","viewColumn":6,"isActive":true,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:59.795Z] GROUP v0 -> v1** — 21 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-7" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `2.groupRefId` | "group-3" | "group-8" |
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-8" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-8" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-8" |
| CHANGE | `3.groupRefId` | "group-4" | "group-9" |
| CHANGE | `3.activeTabRefId` | "tab-4" | "tab-9" |
| CHANGE | `3.tabRefIds.0` | "tab-4" | "tab-9" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-4" | "tab-9" |
| CHANGE | `4.groupRefId` | "group-5" | "group-10" |
| CHANGE | `4.activeTabRefId` | "tab-5" | "tab-10" |
| CHANGE | `4.tabRefIds.0` | "tab-5" | "tab-10" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-5" | "tab-10" |
| CREATE | `5` |  | {"groupRefId":"group-11","viewColumn":6,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:59.796Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.isActive` | true | false |
| CHANGE | `5.isActive` | false | true |

---
