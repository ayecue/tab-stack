# Scenario: AF1: close single tab (1vc, populated)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AF1: close single tab (1vc, populated)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:29.515Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-3","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 1 | 2026-04-12T15:21:29.515Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-4","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-5","tab-6","tab-4"]}] |
| 2 | 2026-04-12T15:21:29.515Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-6","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:29.515Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.2.isActive` | false | true |

**[seq=1, time=2026-04-12T15:21:29.515Z] GROUP v1 -> v2** — 8 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-3" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-5" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.2` | "tab-3" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-3" | "tab-4" |

**[seq=2, time=2026-04-12T15:21:29.515Z] TAB v2 -> v3** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 2 |
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| REMOVE | `0.tabLabels.2` | "tsconfig.json" |  |
| CHANGE | `0.tabRefIds.1` | "tab-6" | "tab-4" |
| REMOVE | `0.tabRefIds.2` | "tab-4" |  |
| CHANGE | `0.tabs.1.tabRefId` | "tab-6" | "tab-4" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `0.tabs.2` | {"tabRefId":"tab-4","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

---
