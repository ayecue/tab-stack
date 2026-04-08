# Scenario: AJ1: multi-tab cross-group approximation (2vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AJ1: multi-tab cross-group approximation (2vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]},{"viewColumn":2,"tabs":["LICENSE","CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE","CHANGELOG.md","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 11
- **Observed events:** 11

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:44.535Z | TAB | 0 | 1 | [{"tabRefId":"tab-6","label":"README.md","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 1 | 2026-04-12T15:21:44.535Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-6","label":"README.md","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 2 | 2026-04-12T15:21:44.535Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-7","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-8","tab-9","tab-7"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","README.md"],"tabRefIds":["tab-11","tab-12","tab-10"]}] |
| 3 | 2026-04-12T15:21:44.537Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","README.md"],"tabRefIds":["tab-11","tab-12","tab-10"]}] |
| 4 | 2026-04-12T15:21:44.539Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 5 | 2026-04-12T15:21:44.549Z | TAB | 5 | 6 | [{"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 6 | 2026-04-12T15:21:44.549Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":2,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 7 | 2026-04-12T15:21:44.549Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-14","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-15","tab-14"]},{"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-16","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","README.md","tsconfig.json"],"tabRefIds":["tab-17","tab-18","tab-19","tab-16"]}] |
| 8 | 2026-04-12T15:21:44.550Z | TAB | 8 | 9 |  |  | [{"tabRefId":"tab-15","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 9 | 2026-04-12T15:21:44.550Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-20","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-20","tab-21"]},{"groupRefId":"group-8","viewColumn":2,"isActive":true,"activeTabRefId":"tab-22","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","README.md","tsconfig.json"],"tabRefIds":["tab-23","tab-24","tab-25","tab-22"]}] |
| 10 | 2026-04-12T15:21:44.550Z | TAB | 10 | 11 |  | [{"tabRefId":"tab-21","label":"tsconfig.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:44.535Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 3 |
| CREATE | `1.tabLabels.2` |  | "README.md" |
| CREATE | `1.tabRefIds.2` |  | "tab-6" |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-6","label":"README.md","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=1, time=2026-04-12T15:21:44.535Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-4" | "tab-6" |
| CHANGE | `1.tabs.1.isActive` | true | false |
| CHANGE | `1.tabs.2.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:44.535Z] GROUP v2 -> v3** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-8" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-9" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-8" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-9" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-6" | "tab-10" |
| CHANGE | `1.tabRefIds.0` | "tab-5" | "tab-11" |
| CHANGE | `1.tabRefIds.1` | "tab-4" | "tab-12" |
| CHANGE | `1.tabRefIds.2` | "tab-6" | "tab-10" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-5" | "tab-11" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-4" | "tab-12" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-6" | "tab-10" |

**[seq=3, time=2026-04-12T15:21:44.537Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:44.539Z] TAB v4 -> v5** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 2 |
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| REMOVE | `0.tabLabels.2` | "tsconfig.json" |  |
| CHANGE | `0.tabRefIds.1` | "tab-9" | "tab-7" |
| REMOVE | `0.tabRefIds.2` | "tab-7" |  |
| CHANGE | `0.tabs.1.tabRefId` | "tab-9" | "tab-7" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `0.tabs.2` | {"tabRefId":"tab-7","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=5, time=2026-04-12T15:21:44.549Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 4 |
| CREATE | `1.tabLabels.3` |  | "tsconfig.json" |
| CREATE | `1.tabRefIds.3` |  | "tab-13" |
| CREATE | `1.tabs.3` |  | {"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=6, time=2026-04-12T15:21:44.549Z] TAB v6 -> v7** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-10" | "tab-13" |
| CHANGE | `1.tabs.2.isActive` | true | false |
| CHANGE | `1.tabs.3.isActive` | false | true |

**[seq=7, time=2026-04-12T15:21:44.549Z] GROUP v7 -> v8** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-14" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-15" |
| CHANGE | `0.tabRefIds.1` | "tab-7" | "tab-14" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-15" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-7" | "tab-14" |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-13" | "tab-16" |
| CHANGE | `1.tabRefIds.0` | "tab-11" | "tab-17" |
| CHANGE | `1.tabRefIds.1` | "tab-12" | "tab-18" |
| CHANGE | `1.tabRefIds.2` | "tab-10" | "tab-19" |
| CHANGE | `1.tabRefIds.3` | "tab-13" | "tab-16" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-11" | "tab-17" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-12" | "tab-18" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-10" | "tab-19" |
| CHANGE | `1.tabs.3.tabRefId` | "tab-13" | "tab-16" |

**[seq=8, time=2026-04-12T15:21:44.550Z] TAB v8 -> v9** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-14" | "tab-15" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.1.isActive` | true | false |

**[seq=9, time=2026-04-12T15:21:44.550Z] GROUP v9 -> v10** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-15" | "tab-20" |
| CHANGE | `0.tabRefIds.0` | "tab-15" | "tab-20" |
| CHANGE | `0.tabRefIds.1` | "tab-14" | "tab-21" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-15" | "tab-20" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-14" | "tab-21" |
| CHANGE | `1.groupRefId` | "group-6" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-16" | "tab-22" |
| CHANGE | `1.tabRefIds.0` | "tab-17" | "tab-23" |
| CHANGE | `1.tabRefIds.1` | "tab-18" | "tab-24" |
| CHANGE | `1.tabRefIds.2` | "tab-19" | "tab-25" |
| CHANGE | `1.tabRefIds.3` | "tab-16" | "tab-22" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-17" | "tab-23" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-18" | "tab-24" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-19" | "tab-25" |
| CHANGE | `1.tabs.3.tabRefId` | "tab-16" | "tab-22" |

**[seq=10, time=2026-04-12T15:21:44.550Z] TAB v10 -> v11** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| REMOVE | `0.tabLabels.1` | "tsconfig.json" |  |
| REMOVE | `0.tabRefIds.1` | "tab-21" |  |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-21","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

---
