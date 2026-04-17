# Scenario: AB1: last-tab move-out (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AB1: last-tab move-out (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md","tsconfig.json","vitest.config.ts","package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:07.983Z | TAB | 0 | 1 | [{"tabRefId":"tab-5","label":"package.json","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:21:07.983Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-5","label":"package.json","kind":"text","viewColumn":2,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 2 | 2026-04-12T15:21:07.983Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":4,"tabLabels":["README.md","tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-8","tab-9","tab-10","tab-7"]}] |
| 3 | 2026-04-12T15:21:07.985Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":4,"tabLabels":["README.md","tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-8","tab-9","tab-10","tab-7"]}] |
| 4 | 2026-04-12T15:21:07.987Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-11"]},{"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-12","tabCount":4,"tabLabels":["README.md","tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-13","tab-14","tab-15","tab-12"]}] |
| 5 | 2026-04-12T15:21:07.987Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-11","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 6 | 2026-04-12T15:21:07.991Z | GROUP | 6 | 7 |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-7","viewColumn":1,"isActive":true,"activeTabRefId":"tab-16","tabCount":4,"tabLabels":["README.md","tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-17","tab-18","tab-19","tab-16"]}] |
| 7 | 2026-04-12T15:21:07.991Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":true,"activeTabRefId":"tab-20","tabCount":4,"tabLabels":["README.md","tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-21","tab-22","tab-23","tab-20"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:07.983Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 4 |
| CREATE | `1.tabLabels.3` |  | "package.json" |
| CREATE | `1.tabRefIds.3` |  | "tab-5" |
| CREATE | `1.tabs.3` |  | {"tabRefId":"tab-5","label":"package.json","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:21:07.983Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-5" |
| CHANGE | `1.tabs.2.isActive` | true | false |
| CHANGE | `1.tabs.3.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:07.983Z] GROUP v2 -> v3** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-5" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-8" |
| CHANGE | `1.tabRefIds.1` | "tab-4" | "tab-9" |
| CHANGE | `1.tabRefIds.2` | "tab-2" | "tab-10" |
| CHANGE | `1.tabRefIds.3` | "tab-5" | "tab-7" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-8" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-4" | "tab-9" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-2" | "tab-10" |
| CHANGE | `1.tabs.3.tabRefId` | "tab-5" | "tab-7" |

**[seq=3, time=2026-04-12T15:21:07.985Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:07.987Z] GROUP v4 -> v5** — 15 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-6" | null |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-11" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-11" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-12" |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-13" |
| CHANGE | `1.tabRefIds.1` | "tab-9" | "tab-14" |
| CHANGE | `1.tabRefIds.2` | "tab-10" | "tab-15" |
| CHANGE | `1.tabRefIds.3` | "tab-7" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-9" | "tab-14" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-10" | "tab-15" |
| CHANGE | `1.tabs.3.tabRefId` | "tab-7" | "tab-12" |

**[seq=5, time=2026-04-12T15:21:07.987Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-11" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-11","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=6, time=2026-04-12T15:21:07.991Z] GROUP v6 -> v7** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-7" |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-16" |
| CHANGE | `0.tabCount` | 0 | 4 |
| CREATE | `0.tabLabels.0` |  | "README.md" |
| CREATE | `0.tabLabels.1` |  | "tsconfig.json" |
| CREATE | `0.tabLabels.2` |  | "vitest.config.ts" |
| CREATE | `0.tabLabels.3` |  | "package.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-17" |
| CREATE | `0.tabRefIds.1` |  | "tab-18" |
| CREATE | `0.tabRefIds.2` |  | "tab-19" |
| CREATE | `0.tabRefIds.3` |  | "tab-16" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-17","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-18","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CREATE | `0.tabs.2` |  | {"tabRefId":"tab-19","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |
| CREATE | `0.tabs.3` |  | {"tabRefId":"tab-16","label":"package.json","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| REMOVE | `1` | {"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-12","tabCount":4,"tabLabels":["README.md","tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-13","tab-14","tab-15","tab-12"],"tabs":[{"tabRefId":"tab-13","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"},{"tabRefId":"tab-14","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"},{"tabRefId":"tab-15","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"},{"tabRefId":"tab-12","label":"package.json","kind":"text","viewColumn":2,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}]} |  |

**[seq=7, time=2026-04-12T15:21:07.991Z] GROUP v7 -> v8** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-8" |
| CHANGE | `0.activeTabRefId` | "tab-16" | "tab-20" |
| CHANGE | `0.tabRefIds.0` | "tab-17" | "tab-21" |
| CHANGE | `0.tabRefIds.1` | "tab-18" | "tab-22" |
| CHANGE | `0.tabRefIds.2` | "tab-19" | "tab-23" |
| CHANGE | `0.tabRefIds.3` | "tab-16" | "tab-20" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-17" | "tab-21" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-18" | "tab-22" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-19" | "tab-23" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-16" | "tab-20" |

---
