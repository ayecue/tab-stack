# Scenario: H: activate different tab

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## H: activate different tab

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:02.592Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-2","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 1 | 2026-04-12T15:20:02.592Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-3","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-3","tab-4"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:02.592Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.1.isActive` | true | false |

**[seq=1, time=2026-04-12T15:20:02.592Z] GROUP v1 -> v2** — 6 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-2" | "tab-3" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-3" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-3" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-4" |

---
