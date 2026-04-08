# Scenario: AB2: last-tab move-out (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AB2: last-tab move-out (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["package.json"]},{"viewColumn":3,"tabs":["tsconfig.json","vitest.config.ts","LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json","vitest.config.ts","LICENSE","package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:09.739Z | TAB | 0 | 1 | [{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":3,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:21:09.739Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":3,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 2 | 2026-04-12T15:21:09.739Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-7"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-9","tabCount":4,"tabLabels":["tsconfig.json","vitest.config.ts","LICENSE","package.json"],"tabRefIds":["tab-10","tab-11","tab-12","tab-9"]}] |
| 3 | 2026-04-12T15:21:09.740Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-6","viewColumn":3,"isActive":true,"activeTabRefId":"tab-9","tabCount":4,"tabLabels":["tsconfig.json","vitest.config.ts","LICENSE","package.json"],"tabRefIds":["tab-10","tab-11","tab-12","tab-9"]}] |
| 4 | 2026-04-12T15:21:09.742Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-13","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-13"]},{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-14"]},{"groupRefId":"group-9","viewColumn":3,"isActive":true,"activeTabRefId":"tab-15","tabCount":4,"tabLabels":["tsconfig.json","vitest.config.ts","LICENSE","package.json"],"tabRefIds":["tab-16","tab-17","tab-18","tab-15"]}] |
| 5 | 2026-04-12T15:21:09.742Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-14","label":"package.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 6 | 2026-04-12T15:21:09.751Z | GROUP | 6 | 7 |  | [{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-10","viewColumn":1,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-19"]},{"groupRefId":"group-11","viewColumn":2,"isActive":true,"activeTabRefId":"tab-20","tabCount":4,"tabLabels":["tsconfig.json","vitest.config.ts","LICENSE","package.json"],"tabRefIds":["tab-21","tab-22","tab-23","tab-20"]}] |
| 7 | 2026-04-12T15:21:09.752Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-24","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-24"]},{"groupRefId":"group-13","viewColumn":2,"isActive":true,"activeTabRefId":"tab-25","tabCount":4,"tabLabels":["tsconfig.json","vitest.config.ts","LICENSE","package.json"],"tabRefIds":["tab-26","tab-27","tab-28","tab-25"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:09.739Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 3 | 4 |
| CREATE | `2.tabLabels.3` |  | "package.json" |
| CREATE | `2.tabRefIds.3` |  | "tab-6" |
| CREATE | `2.tabs.3` |  | {"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":3,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:21:09.739Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-6" |
| CHANGE | `2.tabs.2.isActive` | true | false |
| CHANGE | `2.tabs.3.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:09.739Z] GROUP v2 -> v3** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-8" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-6" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-10" |
| CHANGE | `2.tabRefIds.1` | "tab-5" | "tab-11" |
| CHANGE | `2.tabRefIds.2` | "tab-3" | "tab-12" |
| CHANGE | `2.tabRefIds.3` | "tab-6" | "tab-9" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-10" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-5" | "tab-11" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-3" | "tab-12" |
| CHANGE | `2.tabs.3.tabRefId` | "tab-6" | "tab-9" |

**[seq=3, time=2026-04-12T15:21:09.740Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:09.742Z] GROUP v4 -> v5** — 19 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-13" |
| CHANGE | `0.tabRefIds.0` | "tab-7" | "tab-13" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-7" | "tab-13" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-8" | null |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-14" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-9" | "tab-15" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-16" |
| CHANGE | `2.tabRefIds.1` | "tab-11" | "tab-17" |
| CHANGE | `2.tabRefIds.2` | "tab-12" | "tab-18" |
| CHANGE | `2.tabRefIds.3` | "tab-9" | "tab-15" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-16" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-11" | "tab-17" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-12" | "tab-18" |
| CHANGE | `2.tabs.3.tabRefId` | "tab-9" | "tab-15" |

**[seq=5, time=2026-04-12T15:21:09.742Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "package.json" |  |
| REMOVE | `1.tabRefIds.0` | "tab-14" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-14","label":"package.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=6, time=2026-04-12T15:21:09.751Z] GROUP v6 -> v7** — 21 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-10" |
| CHANGE | `0.activeTabRefId` | "tab-13" | "tab-19" |
| CHANGE | `0.tabRefIds.0` | "tab-13" | "tab-19" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-13" | "tab-19" |
| CHANGE | `1.groupRefId` | "group-8" | "group-11" |
| CHANGE | `1.isActive` | false | true |
| CHANGE | `1.activeTabRefId` | null | "tab-20" |
| CHANGE | `1.tabCount` | 0 | 4 |
| CREATE | `1.tabLabels.0` |  | "tsconfig.json" |
| CREATE | `1.tabLabels.1` |  | "vitest.config.ts" |
| CREATE | `1.tabLabels.2` |  | "LICENSE" |
| CREATE | `1.tabLabels.3` |  | "package.json" |
| CREATE | `1.tabRefIds.0` |  | "tab-21" |
| CREATE | `1.tabRefIds.1` |  | "tab-22" |
| CREATE | `1.tabRefIds.2` |  | "tab-23" |
| CREATE | `1.tabRefIds.3` |  | "tab-20" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-21","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-22","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-23","label":"LICENSE","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |
| CREATE | `1.tabs.3` |  | {"tabRefId":"tab-20","label":"package.json","kind":"text","viewColumn":2,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| REMOVE | `2` | {"groupRefId":"group-9","viewColumn":3,"isActive":true,"activeTabRefId":"tab-15","tabCount":4,"tabLabels":["tsconfig.json","vitest.config.ts","LICENSE","package.json"],"tabRefIds":["tab-16","tab-17","tab-18","tab-15"],"tabs":[{"tabRefId":"tab-16","label":"tsconfig.json","kind":"text","viewColumn":3,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"},{"tabRefId":"tab-17","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"},{"tabRefId":"tab-18","label":"LICENSE","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"},{"tabRefId":"tab-15","label":"package.json","kind":"text","viewColumn":3,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}]} |  |

**[seq=7, time=2026-04-12T15:21:09.752Z] GROUP v7 -> v8** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-10" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-19" | "tab-24" |
| CHANGE | `0.tabRefIds.0` | "tab-19" | "tab-24" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-19" | "tab-24" |
| CHANGE | `1.groupRefId` | "group-11" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-20" | "tab-25" |
| CHANGE | `1.tabRefIds.0` | "tab-21" | "tab-26" |
| CHANGE | `1.tabRefIds.1` | "tab-22" | "tab-27" |
| CHANGE | `1.tabRefIds.2` | "tab-23" | "tab-28" |
| CHANGE | `1.tabRefIds.3` | "tab-20" | "tab-25" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-21" | "tab-26" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-22" | "tab-27" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-23" | "tab-28" |
| CHANGE | `1.tabs.3.tabRefId` | "tab-20" | "tab-25" |

---
