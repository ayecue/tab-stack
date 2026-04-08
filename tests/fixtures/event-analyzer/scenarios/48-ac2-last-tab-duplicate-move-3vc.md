# Scenario: AC2: last-tab duplicate-move (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AC2: last-tab duplicate-move (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["package.json"]},{"viewColumn":3,"tabs":["package.json","tsconfig.json","vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["package.json","tsconfig.json","vitest.config.ts"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 7
- **Observed events:** 7

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:15.214Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-4","label":"package.json","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 1 | 2026-04-12T15:21:15.214Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["package.json","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-8","tab-9","tab-10"]}] |
| 2 | 2026-04-12T15:21:15.216Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-6","viewColumn":3,"isActive":true,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["package.json","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-8","tab-9","tab-10"]}] |
| 3 | 2026-04-12T15:21:15.218Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-11"]},{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-12"]},{"groupRefId":"group-9","viewColumn":3,"isActive":true,"activeTabRefId":"tab-13","tabCount":3,"tabLabels":["package.json","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-13","tab-14","tab-15"]}] |
| 4 | 2026-04-12T15:21:15.218Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-12","label":"package.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 5 | 2026-04-12T15:21:15.228Z | GROUP | 5 | 6 |  | [{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-10","viewColumn":1,"isActive":false,"activeTabRefId":"tab-16","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-16"]},{"groupRefId":"group-11","viewColumn":2,"isActive":true,"activeTabRefId":"tab-17","tabCount":3,"tabLabels":["package.json","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-17","tab-18","tab-19"]}] |
| 6 | 2026-04-12T15:21:15.228Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-20","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-20"]},{"groupRefId":"group-13","viewColumn":2,"isActive":true,"activeTabRefId":"tab-21","tabCount":3,"tabLabels":["package.json","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-21","tab-22","tab-23"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:15.214Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-4" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.2.isActive` | true | false |

**[seq=1, time=2026-04-12T15:21:15.214Z] GROUP v1 -> v2** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-7" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-8" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-8" |
| CHANGE | `2.tabRefIds.1` | "tab-5" | "tab-9" |
| CHANGE | `2.tabRefIds.2` | "tab-3" | "tab-10" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-8" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-3" | "tab-10" |

**[seq=2, time=2026-04-12T15:21:15.216Z] GROUP v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:15.218Z] GROUP v3 -> v4** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-11" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-11" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-11" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-7" | null |
| CHANGE | `1.tabRefIds.0` | "tab-7" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-7" | "tab-12" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-8" | "tab-13" |
| CHANGE | `2.tabRefIds.0` | "tab-8" | "tab-13" |
| CHANGE | `2.tabRefIds.1` | "tab-9" | "tab-14" |
| CHANGE | `2.tabRefIds.2` | "tab-10" | "tab-15" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-9" | "tab-14" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-10" | "tab-15" |

**[seq=4, time=2026-04-12T15:21:15.218Z] TAB v4 -> v5** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "package.json" |  |
| REMOVE | `1.tabRefIds.0` | "tab-12" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-12","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=5, time=2026-04-12T15:21:15.228Z] GROUP v5 -> v6** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-10" |
| CHANGE | `0.activeTabRefId` | "tab-11" | "tab-16" |
| CHANGE | `0.tabRefIds.0` | "tab-11" | "tab-16" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-11" | "tab-16" |
| CHANGE | `1.groupRefId` | "group-8" | "group-11" |
| CHANGE | `1.isActive` | false | true |
| CHANGE | `1.activeTabRefId` | null | "tab-17" |
| CHANGE | `1.tabCount` | 0 | 3 |
| CREATE | `1.tabLabels.0` |  | "package.json" |
| CREATE | `1.tabLabels.1` |  | "tsconfig.json" |
| CREATE | `1.tabLabels.2` |  | "vitest.config.ts" |
| CREATE | `1.tabRefIds.0` |  | "tab-17" |
| CREATE | `1.tabRefIds.1` |  | "tab-18" |
| CREATE | `1.tabRefIds.2` |  | "tab-19" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-17","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-18","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-19","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |
| REMOVE | `2` | {"groupRefId":"group-9","viewColumn":3,"isActive":true,"activeTabRefId":"tab-13","tabCount":3,"tabLabels":["package.json","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-13","tab-14","tab-15"],"tabs":[{"tabRefId":"tab-13","label":"package.json","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"},{"tabRefId":"tab-14","label":"tsconfig.json","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"},{"tabRefId":"tab-15","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}]} |  |

**[seq=6, time=2026-04-12T15:21:15.228Z] GROUP v6 -> v7** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-10" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-16" | "tab-20" |
| CHANGE | `0.tabRefIds.0` | "tab-16" | "tab-20" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-16" | "tab-20" |
| CHANGE | `1.groupRefId` | "group-11" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-17" | "tab-21" |
| CHANGE | `1.tabRefIds.0` | "tab-17" | "tab-21" |
| CHANGE | `1.tabRefIds.1` | "tab-18" | "tab-22" |
| CHANGE | `1.tabRefIds.2` | "tab-19" | "tab-23" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-17" | "tab-21" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-18" | "tab-22" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-19" | "tab-23" |

---
