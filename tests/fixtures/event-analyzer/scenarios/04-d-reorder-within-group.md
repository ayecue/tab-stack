# Scenario: D: reorder within group

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## D: reorder within group

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","tsconfig.json","README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 1
- **Observed events:** 1

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:19:57.262Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:19:57.262Z] TAB v0 -> v1** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "README.md" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-1" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-1" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/README.md" |

---
