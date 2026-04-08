# Scenario: AA1: duplicate-target move (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AA1: duplicate-target move (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md"]},{"viewColumn":2,"tabs":["package.json","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["package.json","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 6
- **Observed events:** 6

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:01.675Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-4","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 1 | 2026-04-12T15:21:01.675Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-5","tab-6"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-7","tab-8"]}] |
| 2 | 2026-04-12T15:21:01.678Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-7","tab-8"]}] |
| 3 | 2026-04-12T15:21:01.680Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-6","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 4 | 2026-04-12T15:21:01.681Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-9","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-10","tab-9"]},{"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-11","tab-12"]}] |
| 5 | 2026-04-12T15:21:01.681Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-10","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:01.675Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-4" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.1.isActive` | true | false |

**[seq=1, time=2026-04-12T15:21:01.675Z] GROUP v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.1` | "tab-2" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-4" | "tab-7" |
| CHANGE | `1.tabRefIds.1` | "tab-3" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-3" | "tab-8" |

**[seq=2, time=2026-04-12T15:21:01.678Z] GROUP v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:01.680Z] TAB v3 -> v4** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-6" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `0.tabs.1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:01.681Z] GROUP v4 -> v5** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-5" | "tab-10" |
| CHANGE | `0.tabRefIds.1` | "tab-6" | "tab-9" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-5" | "tab-10" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-6" | "tab-9" |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.1` | "tab-8" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-8" | "tab-12" |

**[seq=5, time=2026-04-12T15:21:01.681Z] TAB v5 -> v6** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| CHANGE | `0.tabLabels.0` | "package.json" | "README.md" |
| REMOVE | `0.tabLabels.1` | "README.md" |  |
| CHANGE | `0.tabRefIds.0` | "tab-10" | "tab-9" |
| REMOVE | `0.tabRefIds.1` | "tab-9" |  |
| CHANGE | `0.tabs.0.tabRefId` | "tab-10" | "tab-9" |
| CHANGE | `0.tabs.0.label` | "package.json" | "README.md" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/README.md" |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

---
