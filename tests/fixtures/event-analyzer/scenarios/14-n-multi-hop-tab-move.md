# Scenario: N: multi-hop tab move

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## N: multi-hop tab move

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["vitest.config.ts","README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 14
- **Observed events:** 14

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:13.534Z | TAB | 0 | 1 | [{"tabRefId":"tab-5","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 1 | 2026-04-12T15:20:13.534Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-5","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 2 | 2026-04-12T15:20:13.534Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-6","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-7","tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-9","tab-8"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-10"]}] |
| 3 | 2026-04-12T15:20:13.536Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-9","tab-8"]}] |
| 4 | 2026-04-12T15:20:13.538Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-7","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 5 | 2026-04-12T15:20:13.538Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-11","tab-12"]},{"groupRefId":"group-8","viewColumn":2,"isActive":true,"activeTabRefId":"tab-13","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-14","tab-13"]},{"groupRefId":"group-9","viewColumn":3,"isActive":false,"activeTabRefId":"tab-15","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-15"]}] |
| 6 | 2026-04-12T15:20:13.538Z | TAB | 6 | 7 |  | [{"tabRefId":"tab-12","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 7 | 2026-04-12T15:20:13.949Z | TAB | 7 | 8 | [{"tabRefId":"tab-16","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 8 | 2026-04-12T15:20:13.950Z | TAB | 8 | 9 |  |  | [{"tabRefId":"tab-16","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 9 | 2026-04-12T15:20:13.950Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-10","viewColumn":1,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-17"]},{"groupRefId":"group-11","viewColumn":2,"isActive":true,"activeTabRefId":"tab-18","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-19","tab-18"]},{"groupRefId":"group-12","viewColumn":3,"isActive":false,"activeTabRefId":"tab-20","tabCount":2,"tabLabels":["vitest.config.ts","README.md"],"tabRefIds":["tab-21","tab-20"]}] |
| 10 | 2026-04-12T15:20:13.952Z | GROUP | 10 | 11 |  |  | [{"groupRefId":"group-12","viewColumn":3,"isActive":true,"activeTabRefId":"tab-20","tabCount":2,"tabLabels":["vitest.config.ts","README.md"],"tabRefIds":["tab-21","tab-20"]}] |
| 11 | 2026-04-12T15:20:13.954Z | TAB | 11 | 12 |  |  | [{"tabRefId":"tab-19","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 12 | 2026-04-12T15:20:13.954Z | GROUP | 12 | 13 |  |  | [{"groupRefId":"group-13","viewColumn":1,"isActive":false,"activeTabRefId":"tab-22","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-22"]},{"groupRefId":"group-14","viewColumn":2,"isActive":false,"activeTabRefId":"tab-23","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-23","tab-24"]},{"groupRefId":"group-15","viewColumn":3,"isActive":true,"activeTabRefId":"tab-25","tabCount":2,"tabLabels":["vitest.config.ts","README.md"],"tabRefIds":["tab-26","tab-25"]}] |
| 13 | 2026-04-12T15:20:13.955Z | TAB | 13 | 14 |  | [{"tabRefId":"tab-24","label":"README.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:13.534Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 2 |
| CREATE | `1.tabLabels.1` |  | "README.md" |
| CREATE | `1.tabRefIds.1` |  | "tab-5" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-5","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=1, time=2026-04-12T15:20:13.534Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-5" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.isActive` | false | true |

**[seq=2, time=2026-04-12T15:20:13.534Z] GROUP v2 -> v3** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-7" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-5" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-9" |
| CHANGE | `1.tabRefIds.1` | "tab-5" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-9" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-5" | "tab-8" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-10" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-10" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-10" |

**[seq=3, time=2026-04-12T15:20:13.536Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:20:13.538Z] TAB v4 -> v5** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-7" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.1.isActive` | true | false |

**[seq=5, time=2026-04-12T15:20:13.538Z] GROUP v5 -> v6** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-11" |
| CHANGE | `0.tabRefIds.0` | "tab-7" | "tab-11" |
| CHANGE | `0.tabRefIds.1` | "tab-6" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-7" | "tab-11" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-6" | "tab-12" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-14" |
| CHANGE | `1.tabRefIds.1` | "tab-8" | "tab-13" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-14" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-10" | "tab-15" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-15" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-15" |

**[seq=6, time=2026-04-12T15:20:13.538Z] TAB v6 -> v7** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| REMOVE | `0.tabLabels.1` | "README.md" |  |
| REMOVE | `0.tabRefIds.1` | "tab-12" |  |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-12","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

**[seq=7, time=2026-04-12T15:20:13.949Z] TAB v7 -> v8** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 1 | 2 |
| CREATE | `2.tabLabels.1` |  | "README.md" |
| CREATE | `2.tabRefIds.1` |  | "tab-16" |
| CREATE | `2.tabs.1` |  | {"tabRefId":"tab-16","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=8, time=2026-04-12T15:20:13.950Z] TAB v8 -> v9** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-15" | "tab-16" |
| CHANGE | `2.tabs.0.isActive` | true | false |
| CHANGE | `2.tabs.1.isActive` | false | true |

**[seq=9, time=2026-04-12T15:20:13.950Z] GROUP v9 -> v10** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-10" |
| CHANGE | `0.activeTabRefId` | "tab-11" | "tab-17" |
| CHANGE | `0.tabRefIds.0` | "tab-11" | "tab-17" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-11" | "tab-17" |
| CHANGE | `1.groupRefId` | "group-8" | "group-11" |
| CHANGE | `1.activeTabRefId` | "tab-13" | "tab-18" |
| CHANGE | `1.tabRefIds.0` | "tab-14" | "tab-19" |
| CHANGE | `1.tabRefIds.1` | "tab-13" | "tab-18" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-14" | "tab-19" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-13" | "tab-18" |
| CHANGE | `2.groupRefId` | "group-9" | "group-12" |
| CHANGE | `2.activeTabRefId` | "tab-16" | "tab-20" |
| CHANGE | `2.tabRefIds.0` | "tab-15" | "tab-21" |
| CHANGE | `2.tabRefIds.1` | "tab-16" | "tab-20" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-15" | "tab-21" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-16" | "tab-20" |

**[seq=10, time=2026-04-12T15:20:13.952Z] GROUP v10 -> v11** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=11, time=2026-04-12T15:20:13.954Z] TAB v11 -> v12** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-18" | "tab-19" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.1.isActive` | true | false |

**[seq=12, time=2026-04-12T15:20:13.954Z] GROUP v12 -> v13** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-10" | "group-13" |
| CHANGE | `0.activeTabRefId` | "tab-17" | "tab-22" |
| CHANGE | `0.tabRefIds.0` | "tab-17" | "tab-22" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-17" | "tab-22" |
| CHANGE | `1.groupRefId` | "group-11" | "group-14" |
| CHANGE | `1.activeTabRefId` | "tab-19" | "tab-23" |
| CHANGE | `1.tabRefIds.0` | "tab-19" | "tab-23" |
| CHANGE | `1.tabRefIds.1` | "tab-18" | "tab-24" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-19" | "tab-23" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-18" | "tab-24" |
| CHANGE | `2.groupRefId` | "group-12" | "group-15" |
| CHANGE | `2.activeTabRefId` | "tab-20" | "tab-25" |
| CHANGE | `2.tabRefIds.0` | "tab-21" | "tab-26" |
| CHANGE | `2.tabRefIds.1` | "tab-20" | "tab-25" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-21" | "tab-26" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-20" | "tab-25" |

**[seq=13, time=2026-04-12T15:20:13.955Z] TAB v13 -> v14** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| REMOVE | `1.tabLabels.1` | "README.md" |  |
| REMOVE | `1.tabRefIds.1` | "tab-24" |  |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-24","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

---
