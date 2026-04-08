# Scenario: AC1: last-tab duplicate-move (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AC1: last-tab duplicate-move (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 7
- **Observed events:** 7

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:13.453Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 1 | 2026-04-12T15:21:13.453Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-5"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":"tab-6","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-6","tab-7","tab-8"]}] |
| 2 | 2026-04-12T15:21:13.455Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-6","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-6","tab-7","tab-8"]}] |
| 3 | 2026-04-12T15:21:13.456Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-9"]},{"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-10","tab-11","tab-12"]}] |
| 4 | 2026-04-12T15:21:13.456Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-9","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 5 | 2026-04-12T15:21:13.461Z | GROUP | 5 | 6 |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-7","viewColumn":1,"isActive":true,"activeTabRefId":"tab-13","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-13","tab-14","tab-15"]}] |
| 6 | 2026-04-12T15:21:13.461Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":true,"activeTabRefId":"tab-16","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-16","tab-17","tab-18"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:13.453Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-3" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.2.isActive` | true | false |

**[seq=1, time=2026-04-12T15:21:13.453Z] GROUP v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-6" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-6" |
| CHANGE | `1.tabRefIds.1` | "tab-4" | "tab-7" |
| CHANGE | `1.tabRefIds.2` | "tab-2" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-6" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-2" | "tab-8" |

**[seq=2, time=2026-04-12T15:21:13.455Z] GROUP v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:13.456Z] GROUP v3 -> v4** — 13 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-5" | null |
| CHANGE | `0.tabRefIds.0` | "tab-5" | "tab-9" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-6" | "tab-10" |
| CHANGE | `1.tabRefIds.0` | "tab-6" | "tab-10" |
| CHANGE | `1.tabRefIds.1` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.2` | "tab-8" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-6" | "tab-10" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-8" | "tab-12" |

**[seq=4, time=2026-04-12T15:21:13.456Z] TAB v4 -> v5** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-9" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-9","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=5, time=2026-04-12T15:21:13.461Z] GROUP v5 -> v6** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-7" |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-13" |
| CHANGE | `0.tabCount` | 0 | 3 |
| CREATE | `0.tabLabels.0` |  | "package.json" |
| CREATE | `0.tabLabels.1` |  | "README.md" |
| CREATE | `0.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-13" |
| CREATE | `0.tabRefIds.1` |  | "tab-14" |
| CREATE | `0.tabRefIds.2` |  | "tab-15" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-13","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-14","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.2` |  | {"tabRefId":"tab-15","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| REMOVE | `1` | {"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-10","tab-11","tab-12"],"tabs":[{"tabRefId":"tab-10","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"},{"tabRefId":"tab-11","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"},{"tabRefId":"tab-12","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}]} |  |

**[seq=6, time=2026-04-12T15:21:13.461Z] GROUP v6 -> v7** — 8 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-8" |
| CHANGE | `0.activeTabRefId` | "tab-13" | "tab-16" |
| CHANGE | `0.tabRefIds.0` | "tab-13" | "tab-16" |
| CHANGE | `0.tabRefIds.1` | "tab-14" | "tab-17" |
| CHANGE | `0.tabRefIds.2` | "tab-15" | "tab-18" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-13" | "tab-16" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-14" | "tab-17" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-15" | "tab-18" |

---
