# Scenario: AG2: split editor (3vc, middle group)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AG2: split editor (3vc, middle group)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE","CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":4,"tabs":["LICENSE","CHANGELOG.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 7
- **Observed events:** 7

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:34.902Z | GROUP | 0 | 1 | [{"groupRefId":"group-7","viewColumn":3,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-8","tab-7"]},{"groupRefId":"group-6","viewColumn":4,"isActive":false,"activeTabRefId":"tab-9","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-10","tab-9"]}] |
| 1 | 2026-04-12T15:21:34.902Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-11"]},{"groupRefId":"group-9","viewColumn":2,"isActive":true,"activeTabRefId":"tab-12","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-13","tab-12"]},{"groupRefId":"group-10","viewColumn":4,"isActive":false,"activeTabRefId":"tab-14","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-15","tab-14"]},{"groupRefId":"group-11","viewColumn":3,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |
| 2 | 2026-04-12T15:21:34.902Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-16","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-16"]},{"groupRefId":"group-13","viewColumn":2,"isActive":true,"activeTabRefId":"tab-17","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-18","tab-17"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":"tab-19","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-20","tab-19"]},{"groupRefId":"group-15","viewColumn":3,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |
| 3 | 2026-04-12T15:21:34.902Z | TAB | 3 | 4 | [{"tabRefId":"tab-21","label":"tsconfig.json","kind":"text","viewColumn":3,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 4 | 2026-04-12T15:21:34.903Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-21","label":"tsconfig.json","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 5 | 2026-04-12T15:21:34.903Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-22","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-22"]},{"groupRefId":"group-17","viewColumn":2,"isActive":true,"activeTabRefId":"tab-23","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-24","tab-23"]},{"groupRefId":"group-18","viewColumn":4,"isActive":false,"activeTabRefId":"tab-25","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-26","tab-25"]},{"groupRefId":"group-19","viewColumn":3,"isActive":false,"activeTabRefId":"tab-27","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-27"]}] |
| 6 | 2026-04-12T15:21:34.911Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-19","viewColumn":3,"isActive":true,"activeTabRefId":"tab-27","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-27"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:34.902Z] GROUP v0 -> v1** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-8" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-7" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-8" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.viewColumn` | 3 | 4 |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-5" | "tab-10" |
| CHANGE | `2.tabRefIds.1` | "tab-4" | "tab-9" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-5" | "tab-10" |
| CHANGE | `2.tabs.0.viewColumn` | 3 | 4 |
| CHANGE | `2.tabs.1.tabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabs.1.viewColumn` | 3 | 4 |
| CREATE | `3` |  | {"groupRefId":"group-7","viewColumn":3,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:21:34.902Z] GROUP v1 -> v2** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-8" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-11" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-11" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-11" |
| CHANGE | `1.groupRefId` | "group-5" | "group-9" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-12" |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-13" |
| CHANGE | `1.tabRefIds.1` | "tab-7" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-7" | "tab-12" |
| CHANGE | `2.groupRefId` | "group-6" | "group-10" |
| CHANGE | `2.activeTabRefId` | "tab-9" | "tab-14" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-15" |
| CHANGE | `2.tabRefIds.1` | "tab-9" | "tab-14" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-15" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-9" | "tab-14" |
| CHANGE | `3.groupRefId` | "group-7" | "group-11" |

**[seq=2, time=2026-04-12T15:21:34.902Z] GROUP v2 -> v3** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-8" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-11" | "tab-16" |
| CHANGE | `0.tabRefIds.0` | "tab-11" | "tab-16" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-11" | "tab-16" |
| CHANGE | `1.groupRefId` | "group-9" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-12" | "tab-17" |
| CHANGE | `1.tabRefIds.0` | "tab-13" | "tab-18" |
| CHANGE | `1.tabRefIds.1` | "tab-12" | "tab-17" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-13" | "tab-18" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-12" | "tab-17" |
| CHANGE | `2.groupRefId` | "group-10" | "group-14" |
| CHANGE | `2.activeTabRefId` | "tab-14" | "tab-19" |
| CHANGE | `2.tabRefIds.0` | "tab-15" | "tab-20" |
| CHANGE | `2.tabRefIds.1` | "tab-14" | "tab-19" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-15" | "tab-20" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-14" | "tab-19" |
| CHANGE | `3.groupRefId` | "group-11" | "group-15" |

**[seq=3, time=2026-04-12T15:21:34.902Z] TAB v3 -> v4** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 0 | 1 |
| CREATE | `3.tabLabels.0` |  | "tsconfig.json" |
| CREATE | `3.tabRefIds.0` |  | "tab-21" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-21","label":"tsconfig.json","kind":"text","viewColumn":3,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=4, time=2026-04-12T15:21:34.903Z] TAB v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | null | "tab-21" |
| CHANGE | `3.tabs.0.isActive` | false | true |

**[seq=5, time=2026-04-12T15:21:34.903Z] GROUP v5 -> v6** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-12" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-16" | "tab-22" |
| CHANGE | `0.tabRefIds.0` | "tab-16" | "tab-22" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-16" | "tab-22" |
| CHANGE | `1.groupRefId` | "group-13" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-17" | "tab-23" |
| CHANGE | `1.tabRefIds.0` | "tab-18" | "tab-24" |
| CHANGE | `1.tabRefIds.1` | "tab-17" | "tab-23" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-18" | "tab-24" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-17" | "tab-23" |
| CHANGE | `2.groupRefId` | "group-14" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-19" | "tab-25" |
| CHANGE | `2.tabRefIds.0` | "tab-20" | "tab-26" |
| CHANGE | `2.tabRefIds.1` | "tab-19" | "tab-25" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-20" | "tab-26" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-19" | "tab-25" |
| CHANGE | `3.groupRefId` | "group-15" | "group-19" |
| CHANGE | `3.activeTabRefId` | "tab-21" | "tab-27" |
| CHANGE | `3.tabRefIds.0` | "tab-21" | "tab-27" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-21" | "tab-27" |

**[seq=6, time=2026-04-12T15:21:34.911Z] GROUP v6 -> v7** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

---
