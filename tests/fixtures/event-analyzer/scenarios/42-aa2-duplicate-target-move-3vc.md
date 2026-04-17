# Scenario: AA2: duplicate-target move (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AA2: duplicate-target move (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md"]},{"viewColumn":2,"tabs":["tsconfig.json","LICENSE"]},{"viewColumn":3,"tabs":["package.json","vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json","LICENSE"]},{"viewColumn":3,"tabs":["package.json","vitest.config.ts"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 13
- **Observed events:** 13

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:03.493Z | TAB | 0 | 1 | [{"tabRefId":"tab-7","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:21:03.493Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-7","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 2 | 2026-04-12T15:21:03.493Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-8","tab-9"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","package.json"],"tabRefIds":["tab-11","tab-12","tab-10"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-13","tabCount":2,"tabLabels":["package.json","vitest.config.ts"],"tabRefIds":["tab-14","tab-13"]}] |
| 3 | 2026-04-12T15:21:03.494Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","package.json"],"tabRefIds":["tab-11","tab-12","tab-10"]}] |
| 4 | 2026-04-12T15:21:03.496Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 5 | 2026-04-12T15:21:03.496Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-15","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-16","tab-15"]},{"groupRefId":"group-8","viewColumn":2,"isActive":true,"activeTabRefId":"tab-17","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","package.json"],"tabRefIds":["tab-18","tab-19","tab-17"]},{"groupRefId":"group-9","viewColumn":3,"isActive":false,"activeTabRefId":"tab-20","tabCount":2,"tabLabels":["package.json","vitest.config.ts"],"tabRefIds":["tab-21","tab-20"]}] |
| 6 | 2026-04-12T15:21:03.496Z | TAB | 6 | 7 |  | [{"tabRefId":"tab-16","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 7 | 2026-04-12T15:21:03.804Z | TAB | 7 | 8 |  |  | [{"tabRefId":"tab-21","label":"package.json","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 8 | 2026-04-12T15:21:03.804Z | GROUP | 8 | 9 |  |  | [{"groupRefId":"group-10","viewColumn":1,"isActive":false,"activeTabRefId":"tab-22","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-22"]},{"groupRefId":"group-11","viewColumn":2,"isActive":true,"activeTabRefId":"tab-23","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","package.json"],"tabRefIds":["tab-24","tab-25","tab-23"]},{"groupRefId":"group-12","viewColumn":3,"isActive":false,"activeTabRefId":"tab-26","tabCount":2,"tabLabels":["package.json","vitest.config.ts"],"tabRefIds":["tab-26","tab-27"]}] |
| 9 | 2026-04-12T15:21:03.806Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-12","viewColumn":3,"isActive":true,"activeTabRefId":"tab-26","tabCount":2,"tabLabels":["package.json","vitest.config.ts"],"tabRefIds":["tab-26","tab-27"]}] |
| 10 | 2026-04-12T15:21:03.808Z | TAB | 10 | 11 |  |  | [{"tabRefId":"tab-25","label":"LICENSE","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 11 | 2026-04-12T15:21:03.808Z | GROUP | 11 | 12 |  |  | [{"groupRefId":"group-13","viewColumn":1,"isActive":false,"activeTabRefId":"tab-28","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-28"]},{"groupRefId":"group-14","viewColumn":2,"isActive":false,"activeTabRefId":"tab-29","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","package.json"],"tabRefIds":["tab-30","tab-29","tab-31"]},{"groupRefId":"group-15","viewColumn":3,"isActive":true,"activeTabRefId":"tab-32","tabCount":2,"tabLabels":["package.json","vitest.config.ts"],"tabRefIds":["tab-32","tab-33"]}] |
| 12 | 2026-04-12T15:21:03.808Z | TAB | 12 | 13 |  | [{"tabRefId":"tab-31","label":"package.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:03.493Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 3 |
| CREATE | `1.tabLabels.2` |  | "package.json" |
| CREATE | `1.tabRefIds.2` |  | "tab-7" |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-7","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:21:03.493Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-7" |
| CHANGE | `1.tabs.1.isActive` | true | false |
| CHANGE | `1.tabs.2.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:03.493Z] GROUP v2 -> v3** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-8" |
| CHANGE | `0.tabRefIds.1` | "tab-2" | "tab-9" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-8" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-2" | "tab-9" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-10" |
| CHANGE | `1.tabRefIds.0` | "tab-4" | "tab-11" |
| CHANGE | `1.tabRefIds.1` | "tab-3" | "tab-12" |
| CHANGE | `1.tabRefIds.2` | "tab-7" | "tab-10" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-4" | "tab-11" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-3" | "tab-12" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-7" | "tab-10" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-5" | "tab-13" |
| CHANGE | `2.tabRefIds.0` | "tab-6" | "tab-14" |
| CHANGE | `2.tabRefIds.1` | "tab-5" | "tab-13" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-6" | "tab-14" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-5" | "tab-13" |

**[seq=3, time=2026-04-12T15:21:03.494Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:03.496Z] TAB v4 -> v5** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-9" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `0.tabs.1.isActive` | false | true |

**[seq=5, time=2026-04-12T15:21:03.496Z] GROUP v5 -> v6** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-9" | "tab-15" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-16" |
| CHANGE | `0.tabRefIds.1` | "tab-9" | "tab-15" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-16" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-9" | "tab-15" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-10" | "tab-17" |
| CHANGE | `1.tabRefIds.0` | "tab-11" | "tab-18" |
| CHANGE | `1.tabRefIds.1` | "tab-12" | "tab-19" |
| CHANGE | `1.tabRefIds.2` | "tab-10" | "tab-17" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-11" | "tab-18" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-12" | "tab-19" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-10" | "tab-17" |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-13" | "tab-20" |
| CHANGE | `2.tabRefIds.0` | "tab-14" | "tab-21" |
| CHANGE | `2.tabRefIds.1` | "tab-13" | "tab-20" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-14" | "tab-21" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-13" | "tab-20" |

**[seq=6, time=2026-04-12T15:21:03.496Z] TAB v6 -> v7** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| CHANGE | `0.tabLabels.0` | "package.json" | "README.md" |
| REMOVE | `0.tabLabels.1` | "README.md" |  |
| CHANGE | `0.tabRefIds.0` | "tab-16" | "tab-15" |
| REMOVE | `0.tabRefIds.1` | "tab-15" |  |
| CHANGE | `0.tabs.0.tabRefId` | "tab-16" | "tab-15" |
| CHANGE | `0.tabs.0.label` | "package.json" | "README.md" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/README.md" |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-15","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

**[seq=7, time=2026-04-12T15:21:03.804Z] TAB v7 -> v8** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-20" | "tab-21" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.1.isActive` | true | false |

**[seq=8, time=2026-04-12T15:21:03.804Z] GROUP v8 -> v9** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-10" |
| CHANGE | `0.activeTabRefId` | "tab-15" | "tab-22" |
| CHANGE | `0.tabRefIds.0` | "tab-15" | "tab-22" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-15" | "tab-22" |
| CHANGE | `1.groupRefId` | "group-8" | "group-11" |
| CHANGE | `1.activeTabRefId` | "tab-17" | "tab-23" |
| CHANGE | `1.tabRefIds.0` | "tab-18" | "tab-24" |
| CHANGE | `1.tabRefIds.1` | "tab-19" | "tab-25" |
| CHANGE | `1.tabRefIds.2` | "tab-17" | "tab-23" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-18" | "tab-24" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-19" | "tab-25" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-17" | "tab-23" |
| CHANGE | `2.groupRefId` | "group-9" | "group-12" |
| CHANGE | `2.activeTabRefId` | "tab-21" | "tab-26" |
| CHANGE | `2.tabRefIds.0` | "tab-21" | "tab-26" |
| CHANGE | `2.tabRefIds.1` | "tab-20" | "tab-27" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-21" | "tab-26" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-20" | "tab-27" |

**[seq=9, time=2026-04-12T15:21:03.806Z] GROUP v9 -> v10** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=10, time=2026-04-12T15:21:03.808Z] TAB v10 -> v11** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-23" | "tab-25" |
| CHANGE | `1.tabs.1.isActive` | false | true |
| CHANGE | `1.tabs.2.isActive` | true | false |

**[seq=11, time=2026-04-12T15:21:03.808Z] GROUP v11 -> v12** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-10" | "group-13" |
| CHANGE | `0.activeTabRefId` | "tab-22" | "tab-28" |
| CHANGE | `0.tabRefIds.0` | "tab-22" | "tab-28" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-22" | "tab-28" |
| CHANGE | `1.groupRefId` | "group-11" | "group-14" |
| CHANGE | `1.activeTabRefId` | "tab-25" | "tab-29" |
| CHANGE | `1.tabRefIds.0` | "tab-24" | "tab-30" |
| CHANGE | `1.tabRefIds.1` | "tab-25" | "tab-29" |
| CHANGE | `1.tabRefIds.2` | "tab-23" | "tab-31" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-24" | "tab-30" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-25" | "tab-29" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-23" | "tab-31" |
| CHANGE | `2.groupRefId` | "group-12" | "group-15" |
| CHANGE | `2.activeTabRefId` | "tab-26" | "tab-32" |
| CHANGE | `2.tabRefIds.0` | "tab-26" | "tab-32" |
| CHANGE | `2.tabRefIds.1` | "tab-27" | "tab-33" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-26" | "tab-32" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-27" | "tab-33" |

**[seq=12, time=2026-04-12T15:21:03.808Z] TAB v12 -> v13** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 2 |
| REMOVE | `1.tabLabels.2` | "package.json" |  |
| REMOVE | `1.tabRefIds.2` | "tab-31" |  |
| REMOVE | `1.tabs.2` | {"tabRefId":"tab-31","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

---
