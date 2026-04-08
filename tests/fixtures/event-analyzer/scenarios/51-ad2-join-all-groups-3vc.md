# Scenario: AD2: join all groups (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AD2: join all groups (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md","tsconfig.json","package.json","LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 10
- **Observed events:** 10

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:20.620Z | TAB | 0 | 1 | [{"tabRefId":"tab-5","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:21:20.620Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":3,"tabLabels":["README.md","tsconfig.json","package.json"],"tabRefIds":["tab-8","tab-7","tab-9"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-10"]}] |
| 2 | 2026-04-12T15:21:20.620Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 3 | 2026-04-12T15:21:20.634Z | GROUP | 3 | 4 |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-7","viewColumn":1,"isActive":true,"activeTabRefId":"tab-11","tabCount":3,"tabLabels":["README.md","tsconfig.json","package.json"],"tabRefIds":["tab-12","tab-11","tab-13"]},{"groupRefId":"group-8","viewColumn":2,"isActive":false,"activeTabRefId":"tab-14","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-14"]}] |
| 4 | 2026-04-12T15:21:20.634Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-9","viewColumn":1,"isActive":true,"activeTabRefId":"tab-15","tabCount":3,"tabLabels":["README.md","tsconfig.json","package.json"],"tabRefIds":["tab-16","tab-15","tab-17"]},{"groupRefId":"group-10","viewColumn":2,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-18"]}] |
| 5 | 2026-04-12T15:21:20.635Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-11","viewColumn":1,"isActive":true,"activeTabRefId":"tab-19","tabCount":3,"tabLabels":["README.md","tsconfig.json","package.json"],"tabRefIds":["tab-20","tab-19","tab-21"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-22","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-22"]}] |
| 6 | 2026-04-12T15:21:20.639Z | TAB | 6 | 7 | [{"tabRefId":"tab-23","label":"LICENSE","kind":"text","viewColumn":1,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |  |
| 7 | 2026-04-12T15:21:20.640Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-13","viewColumn":1,"isActive":true,"activeTabRefId":"tab-24","tabCount":4,"tabLabels":["README.md","tsconfig.json","package.json","LICENSE"],"tabRefIds":["tab-25","tab-24","tab-26","tab-27"]},{"groupRefId":"group-14","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-28"]}] |
| 8 | 2026-04-12T15:21:20.640Z | TAB | 8 | 9 |  | [{"tabRefId":"tab-28","label":"LICENSE","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |
| 9 | 2026-04-12T15:21:20.646Z | GROUP | 9 | 10 |  | [{"groupRefId":"group-14","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-15","viewColumn":1,"isActive":true,"activeTabRefId":"tab-29","tabCount":4,"tabLabels":["README.md","tsconfig.json","package.json","LICENSE"],"tabRefIds":["tab-30","tab-29","tab-31","tab-32"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:20.620Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 3 |
| CREATE | `1.tabLabels.2` |  | "package.json" |
| CREATE | `1.tabRefIds.2` |  | "tab-5" |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-5","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:21:20.620Z] GROUP v1 -> v2** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | null |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-8" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.2` | "tab-5" | "tab-9" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-8" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-10" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-10" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-10" |

**[seq=2, time=2026-04-12T15:21:20.620Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-6" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=3, time=2026-04-12T15:21:20.634Z] GROUP v3 -> v4** — 30 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-11" |
| CHANGE | `0.tabCount` | 0 | 3 |
| CREATE | `0.tabLabels.0` |  | "README.md" |
| CREATE | `0.tabLabels.1` |  | "tsconfig.json" |
| CREATE | `0.tabLabels.2` |  | "package.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-12" |
| CREATE | `0.tabRefIds.1` |  | "tab-11" |
| CREATE | `0.tabRefIds.2` |  | "tab-13" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-12","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-11","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CREATE | `0.tabs.2` |  | {"tabRefId":"tab-13","label":"package.json","kind":"text","viewColumn":1,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.isActive` | true | false |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-14" |
| CHANGE | `1.tabCount` | 3 | 1 |
| CHANGE | `1.tabLabels.0` | "README.md" | "LICENSE" |
| REMOVE | `1.tabLabels.1` | "tsconfig.json" |  |
| REMOVE | `1.tabLabels.2` | "package.json" |  |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-14" |
| REMOVE | `1.tabRefIds.1` | "tab-7" |  |
| REMOVE | `1.tabRefIds.2` | "tab-9" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `1.tabs.0.label` | "README.md" | "LICENSE" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/README.md" | "file:///workspace/LICENSE" |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-7","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |
| REMOVE | `1.tabs.2` | {"tabRefId":"tab-9","label":"package.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |
| REMOVE | `2` | {"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-10"],"tabs":[{"tabRefId":"tab-10","label":"LICENSE","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}]} |  |

**[seq=4, time=2026-04-12T15:21:20.634Z] GROUP v4 -> v5** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-9" |
| CHANGE | `0.activeTabRefId` | "tab-11" | "tab-15" |
| CHANGE | `0.tabRefIds.0` | "tab-12" | "tab-16" |
| CHANGE | `0.tabRefIds.1` | "tab-11" | "tab-15" |
| CHANGE | `0.tabRefIds.2` | "tab-13" | "tab-17" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-12" | "tab-16" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-11" | "tab-15" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-13" | "tab-17" |
| CHANGE | `1.groupRefId` | "group-8" | "group-10" |
| CHANGE | `1.activeTabRefId` | "tab-14" | "tab-18" |
| CHANGE | `1.tabRefIds.0` | "tab-14" | "tab-18" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-14" | "tab-18" |

**[seq=5, time=2026-04-12T15:21:20.635Z] GROUP v5 -> v6** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-9" | "group-11" |
| CHANGE | `0.activeTabRefId` | "tab-15" | "tab-19" |
| CHANGE | `0.tabRefIds.0` | "tab-16" | "tab-20" |
| CHANGE | `0.tabRefIds.1` | "tab-15" | "tab-19" |
| CHANGE | `0.tabRefIds.2` | "tab-17" | "tab-21" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-16" | "tab-20" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-15" | "tab-19" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-17" | "tab-21" |
| CHANGE | `1.groupRefId` | "group-10" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-18" | "tab-22" |
| CHANGE | `1.tabRefIds.0` | "tab-18" | "tab-22" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-18" | "tab-22" |

**[seq=6, time=2026-04-12T15:21:20.639Z] TAB v6 -> v7** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 4 |
| CREATE | `0.tabLabels.3` |  | "LICENSE" |
| CREATE | `0.tabRefIds.3` |  | "tab-23" |
| CREATE | `0.tabs.3` |  | {"tabRefId":"tab-23","label":"LICENSE","kind":"text","viewColumn":1,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |

**[seq=7, time=2026-04-12T15:21:20.640Z] GROUP v7 -> v8** — 15 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-13" |
| CHANGE | `0.activeTabRefId` | "tab-19" | "tab-24" |
| CHANGE | `0.tabRefIds.0` | "tab-20" | "tab-25" |
| CHANGE | `0.tabRefIds.1` | "tab-19" | "tab-24" |
| CHANGE | `0.tabRefIds.2` | "tab-21" | "tab-26" |
| CHANGE | `0.tabRefIds.3` | "tab-23" | "tab-27" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-20" | "tab-25" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-19" | "tab-24" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-21" | "tab-26" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-23" | "tab-27" |
| CHANGE | `1.groupRefId` | "group-12" | "group-14" |
| CHANGE | `1.activeTabRefId` | "tab-22" | null |
| CHANGE | `1.tabRefIds.0` | "tab-22" | "tab-28" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-22" | "tab-28" |
| CHANGE | `1.tabs.0.isActive` | true | false |

**[seq=8, time=2026-04-12T15:21:20.640Z] TAB v8 -> v9** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "LICENSE" |  |
| REMOVE | `1.tabRefIds.0` | "tab-28" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-28","label":"LICENSE","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |  |

**[seq=9, time=2026-04-12T15:21:20.646Z] GROUP v9 -> v10** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-13" | "group-15" |
| CHANGE | `0.activeTabRefId` | "tab-24" | "tab-29" |
| CHANGE | `0.tabRefIds.0` | "tab-25" | "tab-30" |
| CHANGE | `0.tabRefIds.1` | "tab-24" | "tab-29" |
| CHANGE | `0.tabRefIds.2` | "tab-26" | "tab-31" |
| CHANGE | `0.tabRefIds.3` | "tab-27" | "tab-32" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-25" | "tab-30" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-24" | "tab-29" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-26" | "tab-31" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-27" | "tab-32" |
| REMOVE | `1` | {"groupRefId":"group-14","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |  |

---
