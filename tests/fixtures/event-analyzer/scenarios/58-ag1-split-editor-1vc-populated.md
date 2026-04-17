# Scenario: AG1: split editor (1vc, populated)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AG1: split editor (1vc, populated)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","LICENSE"]},{"viewColumn":2,"tabs":["README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 5
- **Observed events:** 5

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:33.090Z | GROUP | 0 | 1 | [{"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-6","tab-5","tab-7","tab-8"]}] |
| 1 | 2026-04-12T15:21:33.091Z | TAB | 1 | 2 | [{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 2 | 2026-04-12T15:21:33.091Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 3 | 2026-04-12T15:21:33.092Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-10","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-11","tab-10","tab-12","tab-13"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-14","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-14"]}] |
| 4 | 2026-04-12T15:21:33.100Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-14","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-14"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:33.090Z] GROUP v0 -> v1** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.2` | "tab-3" | "tab-7" |
| CHANGE | `0.tabRefIds.3` | "tab-4" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-3" | "tab-7" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-4" | "tab-8" |
| CREATE | `1` |  | {"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:21:33.091Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 0 | 1 |
| CREATE | `1.tabLabels.0` |  | "README.md" |
| CREATE | `1.tabRefIds.0` |  | "tab-9" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=2, time=2026-04-12T15:21:33.091Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | null | "tab-9" |
| CHANGE | `1.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:33.092Z] GROUP v3 -> v4** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-10" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-11" |
| CHANGE | `0.tabRefIds.1` | "tab-5" | "tab-10" |
| CHANGE | `0.tabRefIds.2` | "tab-7" | "tab-12" |
| CHANGE | `0.tabRefIds.3` | "tab-8" | "tab-13" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-11" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-5" | "tab-10" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-7" | "tab-12" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.groupRefId` | "group-3" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-9" | "tab-14" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-14" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-14" |

**[seq=4, time=2026-04-12T15:21:33.100Z] GROUP v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

---
