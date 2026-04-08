# Scenario: O: group swap + close

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## O: group swap + close

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 6
- **Observed events:** 6

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:15.767Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-3","viewColumn":2,"isActive":true,"activeTabRefId":"tab-4","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-4"]},{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-6","tab-5"]}] |
| 1 | 2026-04-12T15:20:15.767Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-9","tab-8"]}] |
| 2 | 2026-04-12T15:20:15.878Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-9","tab-8"]}] |
| 3 | 2026-04-12T15:20:15.883Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-8","viewColumn":1,"isActive":true,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-12","tab-11"]}] |
| 4 | 2026-04-12T15:20:15.883Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-10","label":"package.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 5 | 2026-04-12T15:20:15.907Z | GROUP | 5 | 6 |  | [{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-9","viewColumn":1,"isActive":true,"activeTabRefId":"tab-13","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-14","tab-13"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:15.767Z] GROUP v0 -> v1** — 15 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.viewColumn` | 1 | 2 |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.viewColumn` | 1 | 2 |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.viewColumn` | 2 | 1 |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-6" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-6" |
| CHANGE | `1.tabs.0.viewColumn` | 2 | 1 |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.1.viewColumn` | 2 | 1 |

**[seq=1, time=2026-04-12T15:20:15.767Z] GROUP v1 -> v2** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-4" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-4" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-5" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-6" | "tab-9" |
| CHANGE | `1.tabRefIds.1` | "tab-5" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-6" | "tab-9" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-5" | "tab-8" |

**[seq=2, time=2026-04-12T15:20:15.878Z] GROUP v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=3, time=2026-04-12T15:20:15.883Z] GROUP v3 -> v4** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-7" | null |
| CHANGE | `0.tabRefIds.0` | "tab-7" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-7" | "tab-10" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-6" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-8" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-12" |
| CHANGE | `1.tabRefIds.1` | "tab-8" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-12" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-8" | "tab-11" |

**[seq=4, time=2026-04-12T15:20:15.883Z] TAB v4 -> v5** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-10" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-10","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=5, time=2026-04-12T15:20:15.907Z] GROUP v5 -> v6** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-9" |
| CHANGE | `0.viewColumn` | 2 | 1 |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-13" |
| CHANGE | `0.tabCount` | 0 | 2 |
| CREATE | `0.tabLabels.0` |  | "README.md" |
| CREATE | `0.tabLabels.1` |  | "tsconfig.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-14" |
| CREATE | `0.tabRefIds.1` |  | "tab-13" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-14","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| REMOVE | `1` | {"groupRefId":"group-8","viewColumn":1,"isActive":true,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-12","tab-11"],"tabs":[{"tabRefId":"tab-12","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"},{"tabRefId":"tab-11","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}]} |  |

---
