# Scenario: J: close last in group

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## J: close last in group

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 4
- **Observed events:** 4

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:05.203Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-1","viewColumn":1,"isActive":true,"activeTabRefId":"tab-1","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-1"]}] |
| 1 | 2026-04-12T15:20:05.205Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-3","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-3"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-4"]}] |
| 2 | 2026-04-12T15:20:05.205Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-4","label":"README.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 3 | 2026-04-12T15:20:05.214Z | GROUP | 3 | 4 |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-5","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-5"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:05.203Z] GROUP v0 -> v1** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | false | true |
| CHANGE | `1.isActive` | true | false |

**[seq=1, time=2026-04-12T15:20:05.205Z] GROUP v1 -> v2** — 9 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-3" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-3" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-2" | null |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-4" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-4" |
| CHANGE | `1.tabs.0.isActive` | true | false |

**[seq=2, time=2026-04-12T15:20:05.205Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "README.md" |  |
| REMOVE | `1.tabRefIds.0` | "tab-4" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-4","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

**[seq=3, time=2026-04-12T15:20:05.214Z] GROUP v3 -> v4** — 5 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-3" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-3" | "tab-5" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-3" | "tab-5" |
| REMOVE | `1` | {"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |  |

---
