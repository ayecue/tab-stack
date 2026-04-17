# Scenario: U2: move tab to new group (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## U2: move tab to new group (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["vitest.config.ts","LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["vitest.config.ts"]},{"viewColumn":4,"tabs":["LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:31.751Z | GROUP | 0 | 1 | [{"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-8","tab-7"]},{"groupRefId":"group-6","viewColumn":3,"isActive":true,"activeTabRefId":"tab-9","tabCount":2,"tabLabels":["vitest.config.ts","LICENSE"],"tabRefIds":["tab-10","tab-9"]}] |
| 1 | 2026-04-12T15:20:31.751Z | TAB | 1 | 2 | [{"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |  |
| 2 | 2026-04-12T15:20:31.752Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 3 | 2026-04-12T15:20:31.752Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-12"]},{"groupRefId":"group-9","viewColumn":2,"isActive":false,"activeTabRefId":"tab-13","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-14","tab-13"]},{"groupRefId":"group-10","viewColumn":3,"isActive":true,"activeTabRefId":"tab-15","tabCount":2,"tabLabels":["vitest.config.ts","LICENSE"],"tabRefIds":["tab-16","tab-15"]},{"groupRefId":"group-11","viewColumn":4,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-17"]}] |
| 4 | 2026-04-12T15:20:31.758Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-11","viewColumn":4,"isActive":true,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-17"]}] |
| 5 | 2026-04-12T15:20:31.761Z | TAB | 5 | 6 |  |  | [{"tabRefId":"tab-16","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 6 | 2026-04-12T15:20:31.762Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-18"]},{"groupRefId":"group-13","viewColumn":2,"isActive":false,"activeTabRefId":"tab-19","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-20","tab-19"]},{"groupRefId":"group-14","viewColumn":3,"isActive":false,"activeTabRefId":"tab-21","tabCount":2,"tabLabels":["vitest.config.ts","LICENSE"],"tabRefIds":["tab-21","tab-22"]},{"groupRefId":"group-15","viewColumn":4,"isActive":true,"activeTabRefId":"tab-23","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-23"]}] |
| 7 | 2026-04-12T15:20:31.762Z | TAB | 7 | 8 |  | [{"tabRefId":"tab-22","label":"LICENSE","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:31.751Z] GROUP v0 -> v1** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-8" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-7" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-8" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-5" | "tab-10" |
| CHANGE | `2.tabRefIds.1` | "tab-4" | "tab-9" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-5" | "tab-10" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-4" | "tab-9" |
| CREATE | `3` |  | {"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:31.751Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 0 | 1 |
| CREATE | `3.tabLabels.0` |  | "LICENSE" |
| CREATE | `3.tabRefIds.0` |  | "tab-11" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |

**[seq=2, time=2026-04-12T15:20:31.752Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | null | "tab-11" |
| CHANGE | `3.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:20:31.752Z] GROUP v3 -> v4** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-8" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-12" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-12" |
| CHANGE | `1.groupRefId` | "group-5" | "group-9" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-13" |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-14" |
| CHANGE | `1.tabRefIds.1` | "tab-7" | "tab-13" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-7" | "tab-13" |
| CHANGE | `2.groupRefId` | "group-6" | "group-10" |
| CHANGE | `2.activeTabRefId` | "tab-9" | "tab-15" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-16" |
| CHANGE | `2.tabRefIds.1` | "tab-9" | "tab-15" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-16" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-9" | "tab-15" |
| CHANGE | `3.groupRefId` | "group-7" | "group-11" |
| CHANGE | `3.activeTabRefId` | "tab-11" | "tab-17" |
| CHANGE | `3.tabRefIds.0` | "tab-11" | "tab-17" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-11" | "tab-17" |

**[seq=4, time=2026-04-12T15:20:31.758Z] GROUP v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

**[seq=5, time=2026-04-12T15:20:31.761Z] TAB v5 -> v6** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-15" | "tab-16" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.1.isActive` | true | false |

**[seq=6, time=2026-04-12T15:20:31.762Z] GROUP v6 -> v7** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-8" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-12" | "tab-18" |
| CHANGE | `0.tabRefIds.0` | "tab-12" | "tab-18" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-12" | "tab-18" |
| CHANGE | `1.groupRefId` | "group-9" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-13" | "tab-19" |
| CHANGE | `1.tabRefIds.0` | "tab-14" | "tab-20" |
| CHANGE | `1.tabRefIds.1` | "tab-13" | "tab-19" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-14" | "tab-20" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-13" | "tab-19" |
| CHANGE | `2.groupRefId` | "group-10" | "group-14" |
| CHANGE | `2.activeTabRefId` | "tab-16" | "tab-21" |
| CHANGE | `2.tabRefIds.0` | "tab-16" | "tab-21" |
| CHANGE | `2.tabRefIds.1` | "tab-15" | "tab-22" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-16" | "tab-21" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-15" | "tab-22" |
| CHANGE | `3.groupRefId` | "group-11" | "group-15" |
| CHANGE | `3.activeTabRefId` | "tab-17" | "tab-23" |
| CHANGE | `3.tabRefIds.0` | "tab-17" | "tab-23" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-17" | "tab-23" |

**[seq=7, time=2026-04-12T15:20:31.762Z] TAB v7 -> v8** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 1 |
| REMOVE | `2.tabLabels.1` | "LICENSE" |  |
| REMOVE | `2.tabRefIds.1` | "tab-22" |  |
| REMOVE | `2.tabs.1` | {"tabRefId":"tab-22","label":"LICENSE","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |  |

---
