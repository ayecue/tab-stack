# Scenario: I: duplicate in another column

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## I: duplicate in another column

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 4
- **Observed events:** 4

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:03.762Z | GROUP | 0 | 1 | [{"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-2","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-2"]}] |
| 1 | 2026-04-12T15:20:03.764Z | TAB | 1 | 2 | [{"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 2 | 2026-04-12T15:20:03.764Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 3 | 2026-04-12T15:20:03.764Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-4","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-4"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-5"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:03.762Z] GROUP v0 -> v1** — 5 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-2" |
| CREATE | `1` |  | {"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:03.764Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 0 | 1 |
| CREATE | `1.tabLabels.0` |  | "package.json" |
| CREATE | `1.tabRefIds.0` |  | "tab-3" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=2, time=2026-04-12T15:20:03.764Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | null | "tab-3" |
| CHANGE | `1.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:20:03.764Z] GROUP v3 -> v4** — 8 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-2" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-4" |
| CHANGE | `1.groupRefId` | "group-3" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-5" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-5" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-5" |

---
