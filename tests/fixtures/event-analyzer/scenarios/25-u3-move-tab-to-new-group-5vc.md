# Scenario: U3: move tab to new group (5vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## U3: move tab to new group (5vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE","webview.html"]},{"viewColumn":6,"tabs":["CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:33.759Z | GROUP | 0 | 1 | [{"groupRefId":"group-11","viewColumn":6,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-9"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-11"]},{"groupRefId":"group-10","viewColumn":5,"isActive":true,"activeTabRefId":"tab-12","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","webview.html"],"tabRefIds":["tab-13","tab-12","tab-14"]}] |
| 1 | 2026-04-12T15:20:33.760Z | TAB | 1 | 2 | [{"tabRefId":"tab-15","label":"CHANGELOG.md","kind":"text","viewColumn":6,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |  |
| 2 | 2026-04-12T15:20:33.760Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-15","label":"CHANGELOG.md","kind":"text","viewColumn":6,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 3 | 2026-04-12T15:20:33.760Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":false,"activeTabRefId":"tab-16","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-16"]},{"groupRefId":"group-13","viewColumn":2,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-17"]},{"groupRefId":"group-14","viewColumn":3,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-18"]},{"groupRefId":"group-15","viewColumn":4,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-19"]},{"groupRefId":"group-16","viewColumn":5,"isActive":true,"activeTabRefId":"tab-20","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","webview.html"],"tabRefIds":["tab-21","tab-20","tab-22"]},{"groupRefId":"group-17","viewColumn":6,"isActive":false,"activeTabRefId":"tab-23","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-23"]}] |
| 4 | 2026-04-12T15:20:33.767Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-17","viewColumn":6,"isActive":true,"activeTabRefId":"tab-23","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-23"]}] |
| 5 | 2026-04-12T15:20:33.768Z | TAB | 5 | 6 |  |  | [{"tabRefId":"tab-22","label":"webview.html","kind":"text","viewColumn":5,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |
| 6 | 2026-04-12T15:20:33.769Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-18","viewColumn":1,"isActive":false,"activeTabRefId":"tab-24","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-24"]},{"groupRefId":"group-19","viewColumn":2,"isActive":false,"activeTabRefId":"tab-25","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-25"]},{"groupRefId":"group-20","viewColumn":3,"isActive":false,"activeTabRefId":"tab-26","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-26"]},{"groupRefId":"group-21","viewColumn":4,"isActive":false,"activeTabRefId":"tab-27","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-27"]},{"groupRefId":"group-22","viewColumn":5,"isActive":false,"activeTabRefId":"tab-28","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","webview.html"],"tabRefIds":["tab-29","tab-30","tab-28"]},{"groupRefId":"group-23","viewColumn":6,"isActive":true,"activeTabRefId":"tab-31","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-31"]}] |
| 7 | 2026-04-12T15:20:33.769Z | TAB | 7 | 8 |  | [{"tabRefId":"tab-30","label":"CHANGELOG.md","kind":"text","viewColumn":5,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:33.759Z] GROUP v0 -> v1** — 25 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-8" |
| CHANGE | `1.groupRefId` | "group-2" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-9" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-9" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-9" |
| CHANGE | `2.groupRefId` | "group-3" | "group-8" |
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-10" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-10" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-10" |
| CHANGE | `3.groupRefId` | "group-4" | "group-9" |
| CHANGE | `3.activeTabRefId` | "tab-4" | "tab-11" |
| CHANGE | `3.tabRefIds.0` | "tab-4" | "tab-11" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-4" | "tab-11" |
| CHANGE | `4.groupRefId` | "group-5" | "group-10" |
| CHANGE | `4.activeTabRefId` | "tab-5" | "tab-12" |
| CHANGE | `4.tabRefIds.0` | "tab-6" | "tab-13" |
| CHANGE | `4.tabRefIds.1` | "tab-5" | "tab-12" |
| CHANGE | `4.tabRefIds.2` | "tab-7" | "tab-14" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-6" | "tab-13" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-5" | "tab-12" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-7" | "tab-14" |
| CREATE | `5` |  | {"groupRefId":"group-11","viewColumn":6,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:20:33.760Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `5.tabCount` | 0 | 1 |
| CREATE | `5.tabLabels.0` |  | "CHANGELOG.md" |
| CREATE | `5.tabRefIds.0` |  | "tab-15" |
| CREATE | `5.tabs.0` |  | {"tabRefId":"tab-15","label":"CHANGELOG.md","kind":"text","viewColumn":6,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |

**[seq=2, time=2026-04-12T15:20:33.760Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `5.activeTabRefId` | null | "tab-15" |
| CHANGE | `5.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:20:33.760Z] GROUP v3 -> v4** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-12" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-16" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-16" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-16" |
| CHANGE | `1.groupRefId` | "group-7" | "group-13" |
| CHANGE | `1.activeTabRefId` | "tab-9" | "tab-17" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-17" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-17" |
| CHANGE | `2.groupRefId` | "group-8" | "group-14" |
| CHANGE | `2.activeTabRefId` | "tab-10" | "tab-18" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-18" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-18" |
| CHANGE | `3.groupRefId` | "group-9" | "group-15" |
| CHANGE | `3.activeTabRefId` | "tab-11" | "tab-19" |
| CHANGE | `3.tabRefIds.0` | "tab-11" | "tab-19" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-11" | "tab-19" |
| CHANGE | `4.groupRefId` | "group-10" | "group-16" |
| CHANGE | `4.activeTabRefId` | "tab-12" | "tab-20" |
| CHANGE | `4.tabRefIds.0` | "tab-13" | "tab-21" |
| CHANGE | `4.tabRefIds.1` | "tab-12" | "tab-20" |
| CHANGE | `4.tabRefIds.2` | "tab-14" | "tab-22" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-13" | "tab-21" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-12" | "tab-20" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-14" | "tab-22" |
| CHANGE | `5.groupRefId` | "group-11" | "group-17" |
| CHANGE | `5.activeTabRefId` | "tab-15" | "tab-23" |
| CHANGE | `5.tabRefIds.0` | "tab-15" | "tab-23" |
| CHANGE | `5.tabs.0.tabRefId` | "tab-15" | "tab-23" |

**[seq=4, time=2026-04-12T15:20:33.767Z] GROUP v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.isActive` | true | false |
| CHANGE | `5.isActive` | false | true |

**[seq=5, time=2026-04-12T15:20:33.768Z] TAB v5 -> v6** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.activeTabRefId` | "tab-20" | "tab-22" |
| CHANGE | `4.tabs.1.isActive` | true | false |
| CHANGE | `4.tabs.2.isActive` | false | true |

**[seq=6, time=2026-04-12T15:20:33.769Z] GROUP v6 -> v7** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-12" | "group-18" |
| CHANGE | `0.activeTabRefId` | "tab-16" | "tab-24" |
| CHANGE | `0.tabRefIds.0` | "tab-16" | "tab-24" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-16" | "tab-24" |
| CHANGE | `1.groupRefId` | "group-13" | "group-19" |
| CHANGE | `1.activeTabRefId` | "tab-17" | "tab-25" |
| CHANGE | `1.tabRefIds.0` | "tab-17" | "tab-25" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-17" | "tab-25" |
| CHANGE | `2.groupRefId` | "group-14" | "group-20" |
| CHANGE | `2.activeTabRefId` | "tab-18" | "tab-26" |
| CHANGE | `2.tabRefIds.0` | "tab-18" | "tab-26" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-18" | "tab-26" |
| CHANGE | `3.groupRefId` | "group-15" | "group-21" |
| CHANGE | `3.activeTabRefId` | "tab-19" | "tab-27" |
| CHANGE | `3.tabRefIds.0` | "tab-19" | "tab-27" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-19" | "tab-27" |
| CHANGE | `4.groupRefId` | "group-16" | "group-22" |
| CHANGE | `4.activeTabRefId` | "tab-22" | "tab-28" |
| CHANGE | `4.tabRefIds.0` | "tab-21" | "tab-29" |
| CHANGE | `4.tabRefIds.1` | "tab-20" | "tab-30" |
| CHANGE | `4.tabRefIds.2` | "tab-22" | "tab-28" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-21" | "tab-29" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-20" | "tab-30" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-22" | "tab-28" |
| CHANGE | `5.groupRefId` | "group-17" | "group-23" |
| CHANGE | `5.activeTabRefId` | "tab-23" | "tab-31" |
| CHANGE | `5.tabRefIds.0` | "tab-23" | "tab-31" |
| CHANGE | `5.tabs.0.tabRefId` | "tab-23" | "tab-31" |

**[seq=7, time=2026-04-12T15:20:33.769Z] TAB v7 -> v8** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.tabCount` | 3 | 2 |
| CHANGE | `4.tabLabels.1` | "CHANGELOG.md" | "webview.html" |
| REMOVE | `4.tabLabels.2` | "webview.html" |  |
| CHANGE | `4.tabRefIds.1` | "tab-30" | "tab-28" |
| REMOVE | `4.tabRefIds.2` | "tab-28" |  |
| CHANGE | `4.tabs.1.tabRefId` | "tab-30" | "tab-28" |
| CHANGE | `4.tabs.1.label` | "CHANGELOG.md" | "webview.html" |
| CHANGE | `4.tabs.1.isActive` | false | true |
| CHANGE | `4.tabs.1.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/webview.html" |
| REMOVE | `4.tabs.2` | {"tabRefId":"tab-28","label":"webview.html","kind":"text","viewColumn":5,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |  |

---
