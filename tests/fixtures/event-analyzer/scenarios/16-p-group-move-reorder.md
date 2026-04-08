# Scenario: P: group move + reorder

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## P: group move + reorder

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]},{"viewColumn":2,"tabs":["vitest.config.ts"]}]
- **After:** [{"viewColumn":2,"tabs":["package.json","tsconfig.json","README.md"]},{"viewColumn":1,"tabs":["vitest.config.ts"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:17.657Z | GROUP | 0 | 1 |  |  | [{"groupRefId":"group-3","viewColumn":2,"isActive":true,"activeTabRefId":"tab-5","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-6","tab-7","tab-5"]},{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-8"]}] |
| 1 | 2026-04-12T15:20:17.658Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-9","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-10","tab-11","tab-9"]},{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-12"]}] |
| 2 | 2026-04-12T15:20:18.064Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-9","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:17.657Z] GROUP v0 -> v1** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.viewColumn` | 1 | 2 |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-7" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `0.tabs.0.viewColumn` | 1 | 2 |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-7" |
| CHANGE | `0.tabs.1.viewColumn` | 1 | 2 |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.2.viewColumn` | 1 | 2 |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.viewColumn` | 2 | 1 |
| CHANGE | `1.activeTabRefId` | "tab-4" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-4" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-4" | "tab-8" |
| CHANGE | `1.tabs.0.viewColumn` | 2 | 1 |

**[seq=1, time=2026-04-12T15:20:17.658Z] GROUP v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-10" |
| CHANGE | `0.tabRefIds.1` | "tab-7" | "tab-11" |
| CHANGE | `0.tabRefIds.2` | "tab-5" | "tab-9" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-10" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-7" | "tab-11" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-8" | "tab-12" |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-12" |

**[seq=2, time=2026-04-12T15:20:18.064Z] TAB v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "README.md" |
| CHANGE | `0.tabRefIds.1` | "tab-11" | "tab-9" |
| CHANGE | `0.tabRefIds.2` | "tab-9" | "tab-11" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-11" | "tab-9" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-9" | "tab-11" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/README.md" |

---
