# Scenario: AM3: join two groups (4vc-rightmost-duplicate)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AM3: join two groups (4vc-rightmost-duplicate)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["package.json","LICENSE"]},{"viewColumn":4,"tabs":["package.json","CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE","package.json","CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 9
- **Observed events:** 9

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:06.148Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-4","label":"package.json","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 1 | 2026-04-12T15:22:06.148Z | TAB | 1 | 2 |  | [{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 2 | 2026-04-12T15:22:06.148Z | TAB | 2 | 3 | [{"tabRefId":"tab-7","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |  |
| 3 | 2026-04-12T15:22:06.148Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-7","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 4 | 2026-04-12T15:22:06.149Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-8"]},{"groupRefId":"group-6","viewColumn":2,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-9"]},{"groupRefId":"group-7","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["LICENSE","package.json","CHANGELOG.md"],"tabRefIds":["tab-11","tab-12","tab-10"]},{"groupRefId":"group-8","viewColumn":4,"isActive":true,"activeTabRefId":"tab-13","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-13"]}] |
| 5 | 2026-04-12T15:22:06.151Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-7","viewColumn":3,"isActive":true,"activeTabRefId":"tab-10","tabCount":3,"tabLabels":["LICENSE","package.json","CHANGELOG.md"],"tabRefIds":["tab-11","tab-12","tab-10"]}] |
| 6 | 2026-04-12T15:22:06.152Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-9","viewColumn":1,"isActive":false,"activeTabRefId":"tab-14","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-14"]},{"groupRefId":"group-10","viewColumn":2,"isActive":false,"activeTabRefId":"tab-15","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-15"]},{"groupRefId":"group-11","viewColumn":3,"isActive":true,"activeTabRefId":"tab-16","tabCount":3,"tabLabels":["LICENSE","package.json","CHANGELOG.md"],"tabRefIds":["tab-17","tab-18","tab-16"]},{"groupRefId":"group-12","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-19"]}] |
| 7 | 2026-04-12T15:22:06.152Z | TAB | 7 | 8 |  | [{"tabRefId":"tab-19","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |
| 8 | 2026-04-12T15:22:06.162Z | GROUP | 8 | 9 |  | [{"groupRefId":"group-12","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-13","viewColumn":1,"isActive":false,"activeTabRefId":"tab-20","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-20"]},{"groupRefId":"group-14","viewColumn":2,"isActive":false,"activeTabRefId":"tab-21","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-21"]},{"groupRefId":"group-15","viewColumn":3,"isActive":true,"activeTabRefId":"tab-22","tabCount":3,"tabLabels":["LICENSE","package.json","CHANGELOG.md"],"tabRefIds":["tab-23","tab-24","tab-22"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:06.148Z] TAB v0 -> v1** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabLabels.0` | "package.json" | "LICENSE" |
| CHANGE | `2.tabLabels.1` | "LICENSE" | "package.json" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-3" |
| CHANGE | `2.tabRefIds.1` | "tab-3" | "tab-4" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-3" |
| CHANGE | `2.tabs.0.label` | "package.json" | "LICENSE" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/LICENSE" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-3" | "tab-4" |
| CHANGE | `2.tabs.1.label` | "LICENSE" | "package.json" |
| CHANGE | `2.tabs.1.isActive` | true | false |
| CHANGE | `2.tabs.1.uri` | "file:///workspace/LICENSE" | "file:///workspace/package.json" |

**[seq=1, time=2026-04-12T15:22:06.148Z] TAB v1 -> v2** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 2 | 1 |
| CHANGE | `3.tabLabels.0` | "package.json" | "CHANGELOG.md" |
| REMOVE | `3.tabLabels.1` | "CHANGELOG.md" |  |
| CHANGE | `3.tabRefIds.0` | "tab-6" | "tab-5" |
| REMOVE | `3.tabRefIds.1` | "tab-5" |  |
| CHANGE | `3.tabs.0.tabRefId` | "tab-6" | "tab-5" |
| CHANGE | `3.tabs.0.label` | "package.json" | "CHANGELOG.md" |
| CHANGE | `3.tabs.0.isActive` | false | true |
| CHANGE | `3.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/CHANGELOG.md" |
| REMOVE | `3.tabs.1` | {"tabRefId":"tab-5","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=2, time=2026-04-12T15:22:06.148Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 3 |
| CREATE | `2.tabLabels.2` |  | "CHANGELOG.md" |
| CREATE | `2.tabRefIds.2` |  | "tab-7" |
| CREATE | `2.tabs.2` |  | {"tabRefId":"tab-7","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |

**[seq=3, time=2026-04-12T15:22:06.148Z] TAB v3 -> v4** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-7" |
| CHANGE | `2.tabs.0.isActive` | true | false |
| CHANGE | `2.tabs.2.isActive` | false | true |

**[seq=4, time=2026-04-12T15:22:06.149Z] GROUP v4 -> v5** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-8" |
| CHANGE | `1.groupRefId` | "group-2" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-9" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-9" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-9" |
| CHANGE | `2.groupRefId` | "group-3" | "group-7" |
| CHANGE | `2.activeTabRefId` | "tab-7" | "tab-10" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-11" |
| CHANGE | `2.tabRefIds.1` | "tab-4" | "tab-12" |
| CHANGE | `2.tabRefIds.2` | "tab-7" | "tab-10" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-11" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-4" | "tab-12" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-7" | "tab-10" |
| CHANGE | `3.groupRefId` | "group-4" | "group-8" |
| CHANGE | `3.activeTabRefId` | "tab-5" | "tab-13" |
| CHANGE | `3.tabRefIds.0` | "tab-5" | "tab-13" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-5" | "tab-13" |

**[seq=5, time=2026-04-12T15:22:06.151Z] GROUP v5 -> v6** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.isActive` | false | true |
| CHANGE | `3.isActive` | true | false |

**[seq=6, time=2026-04-12T15:22:06.152Z] GROUP v6 -> v7** — 21 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-9" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-14" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-14" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `1.groupRefId` | "group-6" | "group-10" |
| CHANGE | `1.activeTabRefId` | "tab-9" | "tab-15" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-15" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-15" |
| CHANGE | `2.groupRefId` | "group-7" | "group-11" |
| CHANGE | `2.activeTabRefId` | "tab-10" | "tab-16" |
| CHANGE | `2.tabRefIds.0` | "tab-11" | "tab-17" |
| CHANGE | `2.tabRefIds.1` | "tab-12" | "tab-18" |
| CHANGE | `2.tabRefIds.2` | "tab-10" | "tab-16" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-11" | "tab-17" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-12" | "tab-18" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-10" | "tab-16" |
| CHANGE | `3.groupRefId` | "group-8" | "group-12" |
| CHANGE | `3.activeTabRefId` | "tab-13" | null |
| CHANGE | `3.tabRefIds.0` | "tab-13" | "tab-19" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-13" | "tab-19" |
| CHANGE | `3.tabs.0.isActive` | true | false |

**[seq=7, time=2026-04-12T15:22:06.152Z] TAB v7 -> v8** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 0 |
| REMOVE | `3.tabLabels.0` | "CHANGELOG.md" |  |
| REMOVE | `3.tabRefIds.0` | "tab-19" |  |
| REMOVE | `3.tabs.0` | {"tabRefId":"tab-19","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=8, time=2026-04-12T15:22:06.162Z] GROUP v8 -> v9** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-9" | "group-13" |
| CHANGE | `0.activeTabRefId` | "tab-14" | "tab-20" |
| CHANGE | `0.tabRefIds.0` | "tab-14" | "tab-20" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-14" | "tab-20" |
| CHANGE | `1.groupRefId` | "group-10" | "group-14" |
| CHANGE | `1.activeTabRefId` | "tab-15" | "tab-21" |
| CHANGE | `1.tabRefIds.0` | "tab-15" | "tab-21" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-15" | "tab-21" |
| CHANGE | `2.groupRefId` | "group-11" | "group-15" |
| CHANGE | `2.activeTabRefId` | "tab-16" | "tab-22" |
| CHANGE | `2.tabRefIds.0` | "tab-17" | "tab-23" |
| CHANGE | `2.tabRefIds.1` | "tab-18" | "tab-24" |
| CHANGE | `2.tabRefIds.2` | "tab-16" | "tab-22" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-17" | "tab-23" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-18" | "tab-24" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-16" | "tab-22" |
| REMOVE | `3` | {"groupRefId":"group-12","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |  |

---
