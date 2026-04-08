# Scenario: AM2: join two groups (3vc-middle-right)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AM2: join two groups (3vc-middle-right)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 10
- **Observed events:** 10

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:04.142Z | TAB | 0 | 1 | [{"tabRefId":"tab-5","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 1 | 2026-04-12T15:22:04.143Z | TAB | 1 | 2 |  | [{"tabRefId":"tab-3","label":"README.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 2 | 2026-04-12T15:22:04.143Z | TAB | 2 | 3 | [{"tabRefId":"tab-6","label":"tsconfig.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 3 | 2026-04-12T15:22:04.143Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-6","label":"tsconfig.json","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 4 | 2026-04-12T15:22:04.143Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-9","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-10","tab-11","tab-9"]}] |
| 5 | 2026-04-12T15:22:04.145Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-6","viewColumn":3,"isActive":true,"activeTabRefId":"tab-9","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-10","tab-11","tab-9"]}] |
| 6 | 2026-04-12T15:22:04.147Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-12"]},{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-13"]},{"groupRefId":"group-9","viewColumn":3,"isActive":true,"activeTabRefId":"tab-14","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-15","tab-16","tab-14"]}] |
| 7 | 2026-04-12T15:22:04.147Z | TAB | 7 | 8 |  | [{"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 8 | 2026-04-12T15:22:04.154Z | GROUP | 8 | 9 |  | [{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-10","viewColumn":1,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-17"]},{"groupRefId":"group-11","viewColumn":2,"isActive":true,"activeTabRefId":"tab-18","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-19","tab-20","tab-18"]}] |
| 9 | 2026-04-12T15:22:04.154Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-21","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-21"]},{"groupRefId":"group-13","viewColumn":2,"isActive":true,"activeTabRefId":"tab-22","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-23","tab-24","tab-22"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:04.142Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 1 | 2 |
| CREATE | `2.tabLabels.1` |  | "README.md" |
| CREATE | `2.tabRefIds.1` |  | "tab-5" |
| CREATE | `2.tabs.1` |  | {"tabRefId":"tab-5","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=1, time=2026-04-12T15:22:04.143Z] TAB v1 -> v2** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| CHANGE | `1.tabLabels.0` | "README.md" | "tsconfig.json" |
| REMOVE | `1.tabLabels.1` | "tsconfig.json" |  |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-2" |
| REMOVE | `1.tabRefIds.1` | "tab-2" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-2" |
| CHANGE | `1.tabs.0.label` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-2","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=2, time=2026-04-12T15:22:04.143Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 3 |
| CREATE | `2.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `2.tabRefIds.2` |  | "tab-6" |
| CREATE | `2.tabs.2` |  | {"tabRefId":"tab-6","label":"tsconfig.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=3, time=2026-04-12T15:22:04.143Z] TAB v3 -> v4** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-6" |
| CHANGE | `2.tabs.0.isActive` | true | false |
| CHANGE | `2.tabs.2.isActive` | false | true |

**[seq=4, time=2026-04-12T15:22:04.143Z] GROUP v4 -> v5** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-8" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-6" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-10" |
| CHANGE | `2.tabRefIds.1` | "tab-5" | "tab-11" |
| CHANGE | `2.tabRefIds.2` | "tab-6" | "tab-9" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-10" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-5" | "tab-11" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-6" | "tab-9" |

**[seq=5, time=2026-04-12T15:22:04.145Z] GROUP v5 -> v6** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=6, time=2026-04-12T15:22:04.147Z] GROUP v6 -> v7** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-12" |
| CHANGE | `0.tabRefIds.0` | "tab-7" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-7" | "tab-12" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-8" | null |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-13" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-9" | "tab-14" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-15" |
| CHANGE | `2.tabRefIds.1` | "tab-11" | "tab-16" |
| CHANGE | `2.tabRefIds.2` | "tab-9" | "tab-14" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-15" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-11" | "tab-16" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-9" | "tab-14" |

**[seq=7, time=2026-04-12T15:22:04.147Z] TAB v7 -> v8** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "tsconfig.json" |  |
| REMOVE | `1.tabRefIds.0` | "tab-13" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=8, time=2026-04-12T15:22:04.154Z] GROUP v8 -> v9** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-10" |
| CHANGE | `0.activeTabRefId` | "tab-12" | "tab-17" |
| CHANGE | `0.tabRefIds.0` | "tab-12" | "tab-17" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-12" | "tab-17" |
| CHANGE | `1.groupRefId` | "group-8" | "group-11" |
| CHANGE | `1.isActive` | false | true |
| CHANGE | `1.activeTabRefId` | null | "tab-18" |
| CHANGE | `1.tabCount` | 0 | 3 |
| CREATE | `1.tabLabels.0` |  | "LICENSE" |
| CREATE | `1.tabLabels.1` |  | "README.md" |
| CREATE | `1.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `1.tabRefIds.0` |  | "tab-19" |
| CREATE | `1.tabRefIds.1` |  | "tab-20" |
| CREATE | `1.tabRefIds.2` |  | "tab-18" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-19","label":"LICENSE","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-20","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-18","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| REMOVE | `2` | {"groupRefId":"group-9","viewColumn":3,"isActive":true,"activeTabRefId":"tab-14","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-15","tab-16","tab-14"],"tabs":[{"tabRefId":"tab-15","label":"LICENSE","kind":"text","viewColumn":3,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"},{"tabRefId":"tab-16","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"},{"tabRefId":"tab-14","label":"tsconfig.json","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}]} |  |

**[seq=9, time=2026-04-12T15:22:04.154Z] GROUP v9 -> v10** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-10" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-17" | "tab-21" |
| CHANGE | `0.tabRefIds.0` | "tab-17" | "tab-21" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-17" | "tab-21" |
| CHANGE | `1.groupRefId` | "group-11" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-18" | "tab-22" |
| CHANGE | `1.tabRefIds.0` | "tab-19" | "tab-23" |
| CHANGE | `1.tabRefIds.1` | "tab-20" | "tab-24" |
| CHANGE | `1.tabRefIds.2` | "tab-18" | "tab-22" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-19" | "tab-23" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-20" | "tab-24" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-18" | "tab-22" |

---
