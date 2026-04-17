# Scenario: U1: move tab to new group (1vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## U1: move tab to new group (1vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","tsconfig.json"]},{"viewColumn":2,"tabs":["README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:29.950Z | GROUP | 0 | 1 | [{"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-4","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-5","tab-4","tab-6"]}] |
| 1 | 2026-04-12T15:20:29.950Z | TAB | 1 | 2 | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 2 | 2026-04-12T15:20:29.951Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 3 | 2026-04-12T15:20:29.951Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-9","tab-8","tab-10"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-11"]}] |
| 4 | 2026-04-12T15:20:29.956Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-11"]}] |
| 5 | 2026-04-12T15:20:29.957Z | TAB | 5 | 6 |  |  | [{"tabRefId":"tab-10","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 6 | 2026-04-12T15:20:29.957Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-12","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-13","tab-14","tab-12"]},{"groupRefId":"group-7","viewColumn":2,"isActive":true,"activeTabRefId":"tab-15","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-15"]}] |
| 7 | 2026-04-12T15:20:29.958Z | TAB | 7 | 8 |  | [{"tabRefId":"tab-14","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:29.950Z] GROUP v0 -> v1** — 9 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-5" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.2` | "tab-3" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-3" | "tab-6" |
| CREATE | `1` |  | {"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:29.950Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 0 | 1 |
| CREATE | `1.tabLabels.0` |  | "README.md" |
| CREATE | `1.tabRefIds.0` |  | "tab-7" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=2, time=2026-04-12T15:20:29.951Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | null | "tab-7" |
| CHANGE | `1.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:20:29.951Z] GROUP v3 -> v4** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-4" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-5" | "tab-9" |
| CHANGE | `0.tabRefIds.1` | "tab-4" | "tab-8" |
| CHANGE | `0.tabRefIds.2` | "tab-6" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-4" | "tab-8" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-6" | "tab-10" |
| CHANGE | `1.groupRefId` | "group-3" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-7" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-7" | "tab-11" |

**[seq=4, time=2026-04-12T15:20:29.956Z] GROUP v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=5, time=2026-04-12T15:20:29.957Z] TAB v5 -> v6** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-10" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.2.isActive` | false | true |

**[seq=6, time=2026-04-12T15:20:29.957Z] GROUP v6 -> v7** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-10" | "tab-12" |
| CHANGE | `0.tabRefIds.0` | "tab-9" | "tab-13" |
| CHANGE | `0.tabRefIds.1` | "tab-8" | "tab-14" |
| CHANGE | `0.tabRefIds.2` | "tab-10" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-9" | "tab-13" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-10" | "tab-12" |
| CHANGE | `1.groupRefId` | "group-5" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-11" | "tab-15" |
| CHANGE | `1.tabRefIds.0` | "tab-11" | "tab-15" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-11" | "tab-15" |

**[seq=7, time=2026-04-12T15:20:29.958Z] TAB v7 -> v8** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 2 |
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| REMOVE | `0.tabLabels.2` | "tsconfig.json" |  |
| CHANGE | `0.tabRefIds.1` | "tab-14" | "tab-12" |
| REMOVE | `0.tabRefIds.2` | "tab-12" |  |
| CHANGE | `0.tabs.1.tabRefId` | "tab-14" | "tab-12" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `0.tabs.2` | {"tabRefId":"tab-12","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

---
