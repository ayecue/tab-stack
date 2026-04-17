# Scenario: A: open a single file

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## A: open a single file

### Layout
- **Before:** [{"viewColumn":1,"tabs":[]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:19:52.824Z | TAB | 0 | 1 | [{"tabRefId":"tab-1","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:19:52.824Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-1","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 2 | 2026-04-12T15:19:52.824Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-2","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-2"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:19:52.824Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 0 | 1 |
| CREATE | `0.tabLabels.0` |  | "package.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-1" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-1","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:19:52.824Z] TAB v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | null | "tab-1" |
| CHANGE | `0.tabs.0.isActive` | false | true |

**[seq=2, time=2026-04-12T15:19:52.824Z] GROUP v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-2" |

---
