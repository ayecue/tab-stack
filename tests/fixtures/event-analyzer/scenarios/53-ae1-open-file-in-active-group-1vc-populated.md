# Scenario: AE1: open file in active group (1vc, populated)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AE1: open file in active group (1vc, populated)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md","LICENSE","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:24.303Z | TAB | 0 | 1 | [{"tabRefId":"tab-4","label":"LICENSE","kind":"text","viewColumn":1,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |  |
| 1 | 2026-04-12T15:21:24.303Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-4","label":"LICENSE","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 2 | 2026-04-12T15:21:24.303Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":4,"tabLabels":["package.json","README.md","LICENSE","tsconfig.json"],"tabRefIds":["tab-6","tab-7","tab-5","tab-8"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:24.303Z] TAB v0 -> v1** — 9 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 4 |
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "LICENSE" |
| CREATE | `0.tabLabels.3` |  | "tsconfig.json" |
| CHANGE | `0.tabRefIds.2` | "tab-3" | "tab-4" |
| CREATE | `0.tabRefIds.3` |  | "tab-3" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-3" | "tab-4" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/LICENSE" |
| CREATE | `0.tabs.3` |  | {"tabRefId":"tab-3","label":"tsconfig.json","kind":"text","viewColumn":1,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=1, time=2026-04-12T15:21:24.303Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.2.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:24.303Z] GROUP v2 -> v3** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-4" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-7" |
| CHANGE | `0.tabRefIds.2` | "tab-4" | "tab-5" |
| CHANGE | `0.tabRefIds.3` | "tab-3" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-7" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-4" | "tab-5" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-3" | "tab-8" |

---
