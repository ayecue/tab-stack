# Scenario: AK2: multi-tab new-group approximation (3vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AK2: multi-tab new-group approximation (3vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json","LICENSE","CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["LICENSE","CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 12
- **Observed events:** 12

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:52.018Z | GROUP | 0 | 1 | [{"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","CHANGELOG.md"],"tabRefIds":["tab-9","tab-10","tab-8"]}] |
| 1 | 2026-04-12T15:21:52.018Z | TAB | 1 | 2 | [{"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |  |
| 2 | 2026-04-12T15:21:52.018Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 3 | 2026-04-12T15:21:52.018Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":true,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-12"]},{"groupRefId":"group-9","viewColumn":2,"isActive":false,"activeTabRefId":"tab-13","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-13"]},{"groupRefId":"group-10","viewColumn":3,"isActive":false,"activeTabRefId":"tab-14","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","CHANGELOG.md"],"tabRefIds":["tab-15","tab-16","tab-14"]},{"groupRefId":"group-11","viewColumn":4,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-17"]}] |
| 4 | 2026-04-12T15:21:52.024Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-11","viewColumn":4,"isActive":true,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-17"]}] |
| 5 | 2026-04-12T15:21:52.028Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-16","label":"LICENSE","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |
| 6 | 2026-04-12T15:21:52.042Z | TAB | 6 | 7 | [{"tabRefId":"tab-18","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |  |
| 7 | 2026-04-12T15:21:52.043Z | TAB | 7 | 8 |  |  | [{"tabRefId":"tab-18","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 8 | 2026-04-12T15:21:52.043Z | GROUP | 8 | 9 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-19"]},{"groupRefId":"group-13","viewColumn":2,"isActive":false,"activeTabRefId":"tab-20","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-20"]},{"groupRefId":"group-14","viewColumn":3,"isActive":false,"activeTabRefId":"tab-21","tabCount":2,"tabLabels":["tsconfig.json","CHANGELOG.md"],"tabRefIds":["tab-22","tab-21"]},{"groupRefId":"group-15","viewColumn":4,"isActive":true,"activeTabRefId":"tab-23","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-24","tab-23"]}] |
| 9 | 2026-04-12T15:21:52.045Z | TAB | 9 | 10 |  |  | [{"tabRefId":"tab-22","label":"tsconfig.json","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 10 | 2026-04-12T15:21:52.045Z | GROUP | 10 | 11 |  |  | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-25","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-25"]},{"groupRefId":"group-17","viewColumn":2,"isActive":false,"activeTabRefId":"tab-26","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-26"]},{"groupRefId":"group-18","viewColumn":3,"isActive":false,"activeTabRefId":"tab-27","tabCount":2,"tabLabels":["tsconfig.json","CHANGELOG.md"],"tabRefIds":["tab-27","tab-28"]},{"groupRefId":"group-19","viewColumn":4,"isActive":true,"activeTabRefId":"tab-29","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-30","tab-29"]}] |
| 11 | 2026-04-12T15:21:52.045Z | TAB | 11 | 12 |  | [{"tabRefId":"tab-28","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:52.018Z] GROUP v0 -> v1** — 17 change(s)

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
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-8" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-9" |
| CHANGE | `2.tabRefIds.1` | "tab-5" | "tab-10" |
| CHANGE | `2.tabRefIds.2` | "tab-3" | "tab-8" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-5" | "tab-10" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-3" | "tab-8" |
| CREATE | `3` |  | {"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:21:52.018Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 0 | 1 |
| CREATE | `3.tabLabels.0` |  | "LICENSE" |
| CREATE | `3.tabRefIds.0` |  | "tab-11" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |

**[seq=2, time=2026-04-12T15:21:52.018Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | null | "tab-11" |
| CHANGE | `3.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:52.018Z] GROUP v3 -> v4** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-8" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-12" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-12" |
| CHANGE | `1.groupRefId` | "group-5" | "group-9" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-13" |
| CHANGE | `1.tabRefIds.0` | "tab-7" | "tab-13" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-7" | "tab-13" |
| CHANGE | `2.groupRefId` | "group-6" | "group-10" |
| CHANGE | `2.activeTabRefId` | "tab-8" | "tab-14" |
| CHANGE | `2.tabRefIds.0` | "tab-9" | "tab-15" |
| CHANGE | `2.tabRefIds.1` | "tab-10" | "tab-16" |
| CHANGE | `2.tabRefIds.2` | "tab-8" | "tab-14" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-9" | "tab-15" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-10" | "tab-16" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `3.groupRefId` | "group-7" | "group-11" |
| CHANGE | `3.activeTabRefId` | "tab-11" | "tab-17" |
| CHANGE | `3.tabRefIds.0` | "tab-11" | "tab-17" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-11" | "tab-17" |

**[seq=4, time=2026-04-12T15:21:52.024Z] GROUP v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

**[seq=5, time=2026-04-12T15:21:52.028Z] TAB v5 -> v6** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 3 | 2 |
| CHANGE | `2.tabLabels.1` | "LICENSE" | "CHANGELOG.md" |
| REMOVE | `2.tabLabels.2` | "CHANGELOG.md" |  |
| CHANGE | `2.tabRefIds.1` | "tab-16" | "tab-14" |
| REMOVE | `2.tabRefIds.2` | "tab-14" |  |
| CHANGE | `2.tabs.1.tabRefId` | "tab-16" | "tab-14" |
| CHANGE | `2.tabs.1.label` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `2.tabs.1.isActive` | false | true |
| CHANGE | `2.tabs.1.uri` | "file:///workspace/LICENSE" | "file:///workspace/CHANGELOG.md" |
| REMOVE | `2.tabs.2` | {"tabRefId":"tab-14","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=6, time=2026-04-12T15:21:52.042Z] TAB v6 -> v7** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 2 |
| CREATE | `3.tabLabels.1` |  | "CHANGELOG.md" |
| CREATE | `3.tabRefIds.1` |  | "tab-18" |
| CREATE | `3.tabs.1` |  | {"tabRefId":"tab-18","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |

**[seq=7, time=2026-04-12T15:21:52.043Z] TAB v7 -> v8** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | "tab-17" | "tab-18" |
| CHANGE | `3.tabs.0.isActive` | true | false |
| CHANGE | `3.tabs.1.isActive` | false | true |

**[seq=8, time=2026-04-12T15:21:52.043Z] GROUP v8 -> v9** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-8" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-12" | "tab-19" |
| CHANGE | `0.tabRefIds.0` | "tab-12" | "tab-19" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-12" | "tab-19" |
| CHANGE | `1.groupRefId` | "group-9" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-13" | "tab-20" |
| CHANGE | `1.tabRefIds.0` | "tab-13" | "tab-20" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-13" | "tab-20" |
| CHANGE | `2.groupRefId` | "group-10" | "group-14" |
| CHANGE | `2.activeTabRefId` | "tab-14" | "tab-21" |
| CHANGE | `2.tabRefIds.0` | "tab-15" | "tab-22" |
| CHANGE | `2.tabRefIds.1` | "tab-14" | "tab-21" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-15" | "tab-22" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-14" | "tab-21" |
| CHANGE | `3.groupRefId` | "group-11" | "group-15" |
| CHANGE | `3.activeTabRefId` | "tab-18" | "tab-23" |
| CHANGE | `3.tabRefIds.0` | "tab-17" | "tab-24" |
| CHANGE | `3.tabRefIds.1` | "tab-18" | "tab-23" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-17" | "tab-24" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-18" | "tab-23" |

**[seq=9, time=2026-04-12T15:21:52.045Z] TAB v9 -> v10** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-21" | "tab-22" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.1.isActive` | true | false |

**[seq=10, time=2026-04-12T15:21:52.045Z] GROUP v10 -> v11** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-12" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-19" | "tab-25" |
| CHANGE | `0.tabRefIds.0` | "tab-19" | "tab-25" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-19" | "tab-25" |
| CHANGE | `1.groupRefId` | "group-13" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-20" | "tab-26" |
| CHANGE | `1.tabRefIds.0` | "tab-20" | "tab-26" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-20" | "tab-26" |
| CHANGE | `2.groupRefId` | "group-14" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-22" | "tab-27" |
| CHANGE | `2.tabRefIds.0` | "tab-22" | "tab-27" |
| CHANGE | `2.tabRefIds.1` | "tab-21" | "tab-28" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-22" | "tab-27" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-21" | "tab-28" |
| CHANGE | `3.groupRefId` | "group-15" | "group-19" |
| CHANGE | `3.activeTabRefId` | "tab-23" | "tab-29" |
| CHANGE | `3.tabRefIds.0` | "tab-24" | "tab-30" |
| CHANGE | `3.tabRefIds.1` | "tab-23" | "tab-29" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-24" | "tab-30" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-23" | "tab-29" |

**[seq=11, time=2026-04-12T15:21:52.045Z] TAB v11 -> v12** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 1 |
| REMOVE | `2.tabLabels.1` | "CHANGELOG.md" |  |
| REMOVE | `2.tabRefIds.1` | "tab-28" |  |
| REMOVE | `2.tabs.1` | {"tabRefId":"tab-28","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

---
