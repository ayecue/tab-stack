# Scenario: AD1: join all groups (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AD1: join all groups (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md","package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 5
- **Observed events:** 5

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:18.905Z | TAB | 0 | 1 | [{"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:21:18.906Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-4"]},{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-5","tab-6"]}] |
| 2 | 2026-04-12T15:21:18.906Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-4","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 3 | 2026-04-12T15:21:18.937Z | GROUP | 3 | 4 |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-5","viewColumn":1,"isActive":true,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-7","tab-8"]}] |
| 4 | 2026-04-12T15:21:18.938Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":true,"activeTabRefId":"tab-9","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-9","tab-10"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:18.905Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 2 |
| CREATE | `1.tabLabels.1` |  | "package.json" |
| CREATE | `1.tabRefIds.1` |  | "tab-3" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:21:18.906Z] GROUP v1 -> v2** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | null |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-5" |
| CHANGE | `1.tabRefIds.1` | "tab-3" | "tab-6" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-3" | "tab-6" |

**[seq=2, time=2026-04-12T15:21:18.906Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-4" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-4","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=3, time=2026-04-12T15:21:18.937Z] GROUP v3 -> v4** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-7" |
| CHANGE | `0.tabCount` | 0 | 2 |
| CREATE | `0.tabLabels.0` |  | "README.md" |
| CREATE | `0.tabLabels.1` |  | "package.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-7" |
| CREATE | `0.tabRefIds.1` |  | "tab-8" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-8","label":"package.json","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| REMOVE | `1` | {"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-5","tab-6"],"tabs":[{"tabRefId":"tab-5","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"},{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}]} |  |

**[seq=4, time=2026-04-12T15:21:18.938Z] GROUP v4 -> v5** — 6 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-7" | "tab-9" |
| CHANGE | `0.tabRefIds.1` | "tab-8" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-7" | "tab-9" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-8" | "tab-10" |

---
