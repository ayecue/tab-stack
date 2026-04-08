# Scenario: AL2: multi-tab split approximation (3vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AL2: multi-tab split approximation (3vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json","LICENSE","CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json","LICENSE","CHANGELOG.md"]},{"viewColumn":4,"tabs":["LICENSE","CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:58.028Z | GROUP | 0 | 1 | [{"groupRefId":"group-7","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-6","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-6"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":3,"isActive":true,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","CHANGELOG.md"],"tabRefIds":["tab-9","tab-10","tab-8"]}] |
| 1 | 2026-04-12T15:21:58.029Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-7","viewColumn":4,"isActive":true,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |
| 2 | 2026-04-12T15:21:58.034Z | TAB | 2 | 3 | [{"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |  |
| 3 | 2026-04-12T15:21:58.036Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 4 | 2026-04-12T15:21:58.036Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-12"]},{"groupRefId":"group-9","viewColumn":2,"isActive":false,"activeTabRefId":"tab-13","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-13"]},{"groupRefId":"group-10","viewColumn":3,"isActive":false,"activeTabRefId":"tab-14","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","CHANGELOG.md"],"tabRefIds":["tab-15","tab-16","tab-14"]},{"groupRefId":"group-11","viewColumn":4,"isActive":true,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-17"]}] |
| 5 | 2026-04-12T15:21:58.053Z | TAB | 5 | 6 | [{"tabRefId":"tab-18","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |  |
| 6 | 2026-04-12T15:21:58.053Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-18","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 7 | 2026-04-12T15:21:58.054Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-19"]},{"groupRefId":"group-13","viewColumn":2,"isActive":false,"activeTabRefId":"tab-20","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-20"]},{"groupRefId":"group-14","viewColumn":3,"isActive":false,"activeTabRefId":"tab-21","tabCount":3,"tabLabels":["tsconfig.json","LICENSE","CHANGELOG.md"],"tabRefIds":["tab-22","tab-23","tab-21"]},{"groupRefId":"group-15","viewColumn":4,"isActive":true,"activeTabRefId":"tab-24","tabCount":2,"tabLabels":["LICENSE","CHANGELOG.md"],"tabRefIds":["tab-25","tab-24"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:58.028Z] GROUP v0 -> v1** — 17 change(s)

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

**[seq=1, time=2026-04-12T15:21:58.029Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:58.034Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 0 | 1 |
| CREATE | `3.tabLabels.0` |  | "LICENSE" |
| CREATE | `3.tabRefIds.0` |  | "tab-11" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-11","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |

**[seq=3, time=2026-04-12T15:21:58.036Z] TAB v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | null | "tab-11" |
| CHANGE | `3.tabs.0.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:58.036Z] GROUP v4 -> v5** — 20 change(s)

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

**[seq=5, time=2026-04-12T15:21:58.053Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 2 |
| CREATE | `3.tabLabels.1` |  | "CHANGELOG.md" |
| CREATE | `3.tabRefIds.1` |  | "tab-18" |
| CREATE | `3.tabs.1` |  | {"tabRefId":"tab-18","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |

**[seq=6, time=2026-04-12T15:21:58.053Z] TAB v6 -> v7** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | "tab-17" | "tab-18" |
| CHANGE | `3.tabs.0.isActive` | true | false |
| CHANGE | `3.tabs.1.isActive` | false | true |

**[seq=7, time=2026-04-12T15:21:58.054Z] GROUP v7 -> v8** — 22 change(s)

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
| CHANGE | `2.tabRefIds.1` | "tab-16" | "tab-23" |
| CHANGE | `2.tabRefIds.2` | "tab-14" | "tab-21" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-15" | "tab-22" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-16" | "tab-23" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-14" | "tab-21" |
| CHANGE | `3.groupRefId` | "group-11" | "group-15" |
| CHANGE | `3.activeTabRefId` | "tab-18" | "tab-24" |
| CHANGE | `3.tabRefIds.0` | "tab-17" | "tab-25" |
| CHANGE | `3.tabRefIds.1` | "tab-18" | "tab-24" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-17" | "tab-25" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-18" | "tab-24" |

---
