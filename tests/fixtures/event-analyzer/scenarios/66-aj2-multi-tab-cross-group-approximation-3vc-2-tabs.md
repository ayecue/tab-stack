# Scenario: AJ2: multi-tab cross-group approximation (3vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AJ2: multi-tab cross-group approximation (3vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]},{"viewColumn":2,"tabs":["LICENSE"]},{"viewColumn":3,"tabs":["CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE"]},{"viewColumn":3,"tabs":["CHANGELOG.md","webview.html","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 22
- **Observed events:** 22

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:46.314Z | TAB | 0 | 1 | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 1 | 2026-04-12T15:21:46.314Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 2 | 2026-04-12T15:21:46.314Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-9","tab-10","tab-8"]},{"groupRefId":"group-5","viewColumn":2,"isActive":false,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["LICENSE","README.md"],"tabRefIds":["tab-12","tab-11"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-13","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-14","tab-13"]}] |
| 3 | 2026-04-12T15:21:46.316Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["LICENSE","README.md"],"tabRefIds":["tab-12","tab-11"]}] |
| 4 | 2026-04-12T15:21:46.318Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-10","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 5 | 2026-04-12T15:21:46.329Z | TAB | 5 | 6 | [{"tabRefId":"tab-15","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 6 | 2026-04-12T15:21:46.329Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-15","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 7 | 2026-04-12T15:21:46.329Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-7","viewColumn":1,"isActive":false,"activeTabRefId":"tab-16","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-17","tab-16"]},{"groupRefId":"group-8","viewColumn":2,"isActive":true,"activeTabRefId":"tab-18","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-19","tab-20","tab-18"]},{"groupRefId":"group-9","viewColumn":3,"isActive":false,"activeTabRefId":"tab-21","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-22","tab-21"]}] |
| 8 | 2026-04-12T15:21:46.331Z | TAB | 8 | 9 |  |  | [{"tabRefId":"tab-17","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 9 | 2026-04-12T15:21:46.331Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-10","viewColumn":1,"isActive":false,"activeTabRefId":"tab-23","tabCount":2,"tabLabels":["package.json","tsconfig.json"],"tabRefIds":["tab-23","tab-24"]},{"groupRefId":"group-11","viewColumn":2,"isActive":true,"activeTabRefId":"tab-25","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-26","tab-27","tab-25"]},{"groupRefId":"group-12","viewColumn":3,"isActive":false,"activeTabRefId":"tab-28","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-29","tab-28"]}] |
| 10 | 2026-04-12T15:21:46.331Z | TAB | 10 | 11 |  | [{"tabRefId":"tab-24","label":"tsconfig.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 11 | 2026-04-12T15:21:46.344Z | TAB | 11 | 12 | [{"tabRefId":"tab-30","label":"README.md","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 12 | 2026-04-12T15:21:46.344Z | TAB | 12 | 13 |  |  | [{"tabRefId":"tab-30","label":"README.md","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 13 | 2026-04-12T15:21:46.344Z | GROUP | 13 | 14 |  |  | [{"groupRefId":"group-13","viewColumn":1,"isActive":false,"activeTabRefId":"tab-31","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-31"]},{"groupRefId":"group-14","viewColumn":2,"isActive":true,"activeTabRefId":"tab-32","tabCount":3,"tabLabels":["LICENSE","README.md","tsconfig.json"],"tabRefIds":["tab-33","tab-34","tab-32"]},{"groupRefId":"group-15","viewColumn":3,"isActive":false,"activeTabRefId":"tab-35","tabCount":3,"tabLabels":["CHANGELOG.md","webview.html","README.md"],"tabRefIds":["tab-36","tab-37","tab-35"]}] |
| 14 | 2026-04-12T15:21:46.345Z | GROUP | 14 | 15 |  |  | [{"groupRefId":"group-15","viewColumn":3,"isActive":true,"activeTabRefId":"tab-35","tabCount":3,"tabLabels":["CHANGELOG.md","webview.html","README.md"],"tabRefIds":["tab-36","tab-37","tab-35"]}] |
| 15 | 2026-04-12T15:21:46.347Z | TAB | 15 | 16 |  | [{"tabRefId":"tab-34","label":"README.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 16 | 2026-04-12T15:21:46.360Z | TAB | 16 | 17 | [{"tabRefId":"tab-38","label":"tsconfig.json","kind":"text","viewColumn":3,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 17 | 2026-04-12T15:21:46.360Z | TAB | 17 | 18 |  |  | [{"tabRefId":"tab-38","label":"tsconfig.json","kind":"text","viewColumn":3,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 18 | 2026-04-12T15:21:46.360Z | GROUP | 18 | 19 |  |  | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-39","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-39"]},{"groupRefId":"group-17","viewColumn":2,"isActive":false,"activeTabRefId":"tab-40","tabCount":2,"tabLabels":["LICENSE","tsconfig.json"],"tabRefIds":["tab-41","tab-40"]},{"groupRefId":"group-18","viewColumn":3,"isActive":true,"activeTabRefId":"tab-42","tabCount":4,"tabLabels":["CHANGELOG.md","webview.html","README.md","tsconfig.json"],"tabRefIds":["tab-43","tab-44","tab-45","tab-42"]}] |
| 19 | 2026-04-12T15:21:46.361Z | TAB | 19 | 20 |  |  | [{"tabRefId":"tab-41","label":"LICENSE","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 20 | 2026-04-12T15:21:46.361Z | GROUP | 20 | 21 |  |  | [{"groupRefId":"group-19","viewColumn":1,"isActive":false,"activeTabRefId":"tab-46","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-46"]},{"groupRefId":"group-20","viewColumn":2,"isActive":false,"activeTabRefId":"tab-47","tabCount":2,"tabLabels":["LICENSE","tsconfig.json"],"tabRefIds":["tab-47","tab-48"]},{"groupRefId":"group-21","viewColumn":3,"isActive":true,"activeTabRefId":"tab-49","tabCount":4,"tabLabels":["CHANGELOG.md","webview.html","README.md","tsconfig.json"],"tabRefIds":["tab-50","tab-51","tab-52","tab-49"]}] |
| 21 | 2026-04-12T15:21:46.361Z | TAB | 21 | 22 |  | [{"tabRefId":"tab-48","label":"tsconfig.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:46.314Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 2 |
| CREATE | `1.tabLabels.1` |  | "README.md" |
| CREATE | `1.tabRefIds.1` |  | "tab-7" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=1, time=2026-04-12T15:21:46.314Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:46.314Z] GROUP v2 -> v3** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-9" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-10" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-9" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-10" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-8" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-4" | "tab-12" |
| CHANGE | `1.tabRefIds.1` | "tab-7" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-4" | "tab-12" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-7" | "tab-11" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-5" | "tab-13" |
| CHANGE | `2.tabRefIds.0` | "tab-6" | "tab-14" |
| CHANGE | `2.tabRefIds.1` | "tab-5" | "tab-13" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-6" | "tab-14" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-5" | "tab-13" |

**[seq=3, time=2026-04-12T15:21:46.316Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:46.318Z] TAB v4 -> v5** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 2 |
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| REMOVE | `0.tabLabels.2` | "tsconfig.json" |  |
| CHANGE | `0.tabRefIds.1` | "tab-10" | "tab-8" |
| REMOVE | `0.tabRefIds.2` | "tab-8" |  |
| CHANGE | `0.tabs.1.tabRefId` | "tab-10" | "tab-8" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `0.tabs.2` | {"tabRefId":"tab-8","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=5, time=2026-04-12T15:21:46.329Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 3 |
| CREATE | `1.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `1.tabRefIds.2` |  | "tab-15" |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-15","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=6, time=2026-04-12T15:21:46.329Z] TAB v6 -> v7** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-11" | "tab-15" |
| CHANGE | `1.tabs.1.isActive` | true | false |
| CHANGE | `1.tabs.2.isActive` | false | true |

**[seq=7, time=2026-04-12T15:21:46.329Z] GROUP v7 -> v8** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-7" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-16" |
| CHANGE | `0.tabRefIds.0` | "tab-9" | "tab-17" |
| CHANGE | `0.tabRefIds.1` | "tab-8" | "tab-16" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-9" | "tab-17" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-8" | "tab-16" |
| CHANGE | `1.groupRefId` | "group-5" | "group-8" |
| CHANGE | `1.activeTabRefId` | "tab-15" | "tab-18" |
| CHANGE | `1.tabRefIds.0` | "tab-12" | "tab-19" |
| CHANGE | `1.tabRefIds.1` | "tab-11" | "tab-20" |
| CHANGE | `1.tabRefIds.2` | "tab-15" | "tab-18" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-12" | "tab-19" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-11" | "tab-20" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-15" | "tab-18" |
| CHANGE | `2.groupRefId` | "group-6" | "group-9" |
| CHANGE | `2.activeTabRefId` | "tab-13" | "tab-21" |
| CHANGE | `2.tabRefIds.0` | "tab-14" | "tab-22" |
| CHANGE | `2.tabRefIds.1` | "tab-13" | "tab-21" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-14" | "tab-22" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-13" | "tab-21" |

**[seq=8, time=2026-04-12T15:21:46.331Z] TAB v8 -> v9** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-16" | "tab-17" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.1.isActive` | true | false |

**[seq=9, time=2026-04-12T15:21:46.331Z] GROUP v9 -> v10** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-10" |
| CHANGE | `0.activeTabRefId` | "tab-17" | "tab-23" |
| CHANGE | `0.tabRefIds.0` | "tab-17" | "tab-23" |
| CHANGE | `0.tabRefIds.1` | "tab-16" | "tab-24" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-17" | "tab-23" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-16" | "tab-24" |
| CHANGE | `1.groupRefId` | "group-8" | "group-11" |
| CHANGE | `1.activeTabRefId` | "tab-18" | "tab-25" |
| CHANGE | `1.tabRefIds.0` | "tab-19" | "tab-26" |
| CHANGE | `1.tabRefIds.1` | "tab-20" | "tab-27" |
| CHANGE | `1.tabRefIds.2` | "tab-18" | "tab-25" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-19" | "tab-26" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-20" | "tab-27" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-18" | "tab-25" |
| CHANGE | `2.groupRefId` | "group-9" | "group-12" |
| CHANGE | `2.activeTabRefId` | "tab-21" | "tab-28" |
| CHANGE | `2.tabRefIds.0` | "tab-22" | "tab-29" |
| CHANGE | `2.tabRefIds.1` | "tab-21" | "tab-28" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-22" | "tab-29" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-21" | "tab-28" |

**[seq=10, time=2026-04-12T15:21:46.331Z] TAB v10 -> v11** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| REMOVE | `0.tabLabels.1` | "tsconfig.json" |  |
| REMOVE | `0.tabRefIds.1` | "tab-24" |  |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-24","label":"tsconfig.json","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=11, time=2026-04-12T15:21:46.344Z] TAB v11 -> v12** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 3 |
| CREATE | `2.tabLabels.2` |  | "README.md" |
| CREATE | `2.tabRefIds.2` |  | "tab-30" |
| CREATE | `2.tabs.2` |  | {"tabRefId":"tab-30","label":"README.md","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=12, time=2026-04-12T15:21:46.344Z] TAB v12 -> v13** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-28" | "tab-30" |
| CHANGE | `2.tabs.1.isActive` | true | false |
| CHANGE | `2.tabs.2.isActive` | false | true |

**[seq=13, time=2026-04-12T15:21:46.344Z] GROUP v13 -> v14** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-10" | "group-13" |
| CHANGE | `0.activeTabRefId` | "tab-23" | "tab-31" |
| CHANGE | `0.tabRefIds.0` | "tab-23" | "tab-31" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-23" | "tab-31" |
| CHANGE | `1.groupRefId` | "group-11" | "group-14" |
| CHANGE | `1.activeTabRefId` | "tab-25" | "tab-32" |
| CHANGE | `1.tabRefIds.0` | "tab-26" | "tab-33" |
| CHANGE | `1.tabRefIds.1` | "tab-27" | "tab-34" |
| CHANGE | `1.tabRefIds.2` | "tab-25" | "tab-32" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-26" | "tab-33" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-27" | "tab-34" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-25" | "tab-32" |
| CHANGE | `2.groupRefId` | "group-12" | "group-15" |
| CHANGE | `2.activeTabRefId` | "tab-30" | "tab-35" |
| CHANGE | `2.tabRefIds.0` | "tab-29" | "tab-36" |
| CHANGE | `2.tabRefIds.1` | "tab-28" | "tab-37" |
| CHANGE | `2.tabRefIds.2` | "tab-30" | "tab-35" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-29" | "tab-36" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-28" | "tab-37" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-30" | "tab-35" |

**[seq=14, time=2026-04-12T15:21:46.345Z] GROUP v14 -> v15** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=15, time=2026-04-12T15:21:46.347Z] TAB v15 -> v16** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 2 |
| CHANGE | `1.tabLabels.1` | "README.md" | "tsconfig.json" |
| REMOVE | `1.tabLabels.2` | "tsconfig.json" |  |
| CHANGE | `1.tabRefIds.1` | "tab-34" | "tab-32" |
| REMOVE | `1.tabRefIds.2` | "tab-32" |  |
| CHANGE | `1.tabs.1.tabRefId` | "tab-34" | "tab-32" |
| CHANGE | `1.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabs.1.isActive` | false | true |
| CHANGE | `1.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| REMOVE | `1.tabs.2` | {"tabRefId":"tab-32","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=16, time=2026-04-12T15:21:46.360Z] TAB v16 -> v17** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 3 | 4 |
| CREATE | `2.tabLabels.3` |  | "tsconfig.json" |
| CREATE | `2.tabRefIds.3` |  | "tab-38" |
| CREATE | `2.tabs.3` |  | {"tabRefId":"tab-38","label":"tsconfig.json","kind":"text","viewColumn":3,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=17, time=2026-04-12T15:21:46.360Z] TAB v17 -> v18** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-35" | "tab-38" |
| CHANGE | `2.tabs.2.isActive` | true | false |
| CHANGE | `2.tabs.3.isActive` | false | true |

**[seq=18, time=2026-04-12T15:21:46.360Z] GROUP v18 -> v19** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-13" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-31" | "tab-39" |
| CHANGE | `0.tabRefIds.0` | "tab-31" | "tab-39" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-31" | "tab-39" |
| CHANGE | `1.groupRefId` | "group-14" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-32" | "tab-40" |
| CHANGE | `1.tabRefIds.0` | "tab-33" | "tab-41" |
| CHANGE | `1.tabRefIds.1` | "tab-32" | "tab-40" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-33" | "tab-41" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-32" | "tab-40" |
| CHANGE | `2.groupRefId` | "group-15" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-38" | "tab-42" |
| CHANGE | `2.tabRefIds.0` | "tab-36" | "tab-43" |
| CHANGE | `2.tabRefIds.1` | "tab-37" | "tab-44" |
| CHANGE | `2.tabRefIds.2` | "tab-35" | "tab-45" |
| CHANGE | `2.tabRefIds.3` | "tab-38" | "tab-42" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-36" | "tab-43" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-37" | "tab-44" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-35" | "tab-45" |
| CHANGE | `2.tabs.3.tabRefId` | "tab-38" | "tab-42" |

**[seq=19, time=2026-04-12T15:21:46.361Z] TAB v19 -> v20** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-40" | "tab-41" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.1.isActive` | true | false |

**[seq=20, time=2026-04-12T15:21:46.361Z] GROUP v20 -> v21** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-16" | "group-19" |
| CHANGE | `0.activeTabRefId` | "tab-39" | "tab-46" |
| CHANGE | `0.tabRefIds.0` | "tab-39" | "tab-46" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-39" | "tab-46" |
| CHANGE | `1.groupRefId` | "group-17" | "group-20" |
| CHANGE | `1.activeTabRefId` | "tab-41" | "tab-47" |
| CHANGE | `1.tabRefIds.0` | "tab-41" | "tab-47" |
| CHANGE | `1.tabRefIds.1` | "tab-40" | "tab-48" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-41" | "tab-47" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-40" | "tab-48" |
| CHANGE | `2.groupRefId` | "group-18" | "group-21" |
| CHANGE | `2.activeTabRefId` | "tab-42" | "tab-49" |
| CHANGE | `2.tabRefIds.0` | "tab-43" | "tab-50" |
| CHANGE | `2.tabRefIds.1` | "tab-44" | "tab-51" |
| CHANGE | `2.tabRefIds.2` | "tab-45" | "tab-52" |
| CHANGE | `2.tabRefIds.3` | "tab-42" | "tab-49" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-43" | "tab-50" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-44" | "tab-51" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-45" | "tab-52" |
| CHANGE | `2.tabs.3.tabRefId` | "tab-42" | "tab-49" |

**[seq=21, time=2026-04-12T15:21:46.361Z] TAB v21 -> v22** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| REMOVE | `1.tabLabels.1` | "tsconfig.json" |  |
| REMOVE | `1.tabRefIds.1` | "tab-48" |  |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-48","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

---
