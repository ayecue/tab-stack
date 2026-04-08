# Scenario: Q: close middle group

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## Q: close middle group

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["vitest.config.ts"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 6
- **Observed events:** 6

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:19.806Z | TAB | 0 | 1 |  | [{"tabRefId":"tab-3","label":"README.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 1 | 2026-04-12T15:20:19.810Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-1","viewColumn":1,"isActive":true,"activeTabRefId":"tab-1","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-1"]}] |
| 2 | 2026-04-12T15:20:19.811Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-5"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-7"]}] |
| 3 | 2026-04-12T15:20:19.811Z | TAB | 3 | 4 |  | [{"tabRefId":"tab-6","label":"tsconfig.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 4 | 2026-04-12T15:20:19.846Z | GROUP | 4 | 5 |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-7","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-9"]}] |
| 5 | 2026-04-12T15:20:19.846Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-9","viewColumn":1,"isActive":true,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-10","viewColumn":2,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-11"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:19.806Z] TAB v0 -> v1** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| CHANGE | `1.tabLabels.0` | "README.md" | "tsconfig.json" |
| REMOVE | `1.tabLabels.1` | "tsconfig.json" |  |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-2" |
| REMOVE | `1.tabRefIds.1` | "tab-2" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-2" |
| CHANGE | `1.tabs.0.label` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-2","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=1, time=2026-04-12T15:20:19.810Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | false | true |
| CHANGE | `1.isActive` | true | false |

**[seq=2, time=2026-04-12T15:20:19.811Z] GROUP v2 -> v3** — 13 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | null |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-7" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-7" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-7" |

**[seq=3, time=2026-04-12T15:20:19.811Z] TAB v3 -> v4** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "tsconfig.json" |  |
| REMOVE | `1.tabRefIds.0` | "tab-6" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-6","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=4, time=2026-04-12T15:20:19.846Z] GROUP v4 -> v5** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-5" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-5" | "tab-8" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | null | "tab-9" |
| CHANGE | `1.tabCount` | 0 | 1 |
| CREATE | `1.tabLabels.0` |  | "vitest.config.ts" |
| CREATE | `1.tabRefIds.0` |  | "tab-9" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-9","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |
| REMOVE | `2` | {"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-7"],"tabs":[{"tabRefId":"tab-7","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}]} |  |

**[seq=5, time=2026-04-12T15:20:19.846Z] GROUP v5 -> v6** — 8 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-9" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-10" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-10" |
| CHANGE | `1.groupRefId` | "group-8" | "group-10" |
| CHANGE | `1.activeTabRefId` | "tab-9" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-11" |

---
