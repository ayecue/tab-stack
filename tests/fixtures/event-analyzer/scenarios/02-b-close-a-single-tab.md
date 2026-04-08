# Scenario: B: close a single tab

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## B: close a single tab

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]}]
- **After:** [{"viewColumn":1,"tabs":[]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:19:54.182Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-2"]}] |
| 1 | 2026-04-12T15:19:54.182Z | TAB | 1 | 2 |  | [{"tabRefId":"tab-2","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:19:54.182Z] GROUP v0 -> v1** — 5 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | null |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.isActive` | true | false |

**[seq=1, time=2026-04-12T15:19:54.182Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-2" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-2","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

---
