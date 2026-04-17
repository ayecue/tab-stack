# Scenario: AK3: multi-tab new-group approximation (5vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AK3: multi-tab new-group approximation (5vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE"]},{"viewColumn":6,"tabs":["CHANGELOG.md","webview.html"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 12
- **Observed events:** 12

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:53.996Z | GROUP | 0 | 1 | [{"groupRefId":"group-11","viewColumn":6,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-9"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-11"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-12","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","webview.html"],"tabRefIds":["tab-13","tab-14","tab-12"]}] |
| 1 | 2026-04-12T15:21:53.996Z | TAB | 1 | 2 | [{"tabRefId":"tab-15","label":"CHANGELOG.md","kind":"text","viewColumn":6,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |  |
| 2 | 2026-04-12T15:21:53.997Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-15","label":"CHANGELOG.md","kind":"text","viewColumn":6,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 3 | 2026-04-12T15:21:53.997Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-12","viewColumn":1,"isActive":true,"activeTabRefId":"tab-16","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-16"]},{"groupRefId":"group-13","viewColumn":2,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-17"]},{"groupRefId":"group-14","viewColumn":3,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-18"]},{"groupRefId":"group-15","viewColumn":4,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-19"]},{"groupRefId":"group-16","viewColumn":5,"isActive":false,"activeTabRefId":"tab-20","tabCount":3,"tabLabels":["LICENSE","CHANGELOG.md","webview.html"],"tabRefIds":["tab-21","tab-22","tab-20"]},{"groupRefId":"group-17","viewColumn":6,"isActive":false,"activeTabRefId":"tab-23","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-23"]}] |
| 4 | 2026-04-12T15:21:54.007Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-17","viewColumn":6,"isActive":true,"activeTabRefId":"tab-23","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-23"]}] |
| 5 | 2026-04-12T15:21:54.010Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-22","label":"CHANGELOG.md","kind":"text","viewColumn":5,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |
| 6 | 2026-04-12T15:21:54.027Z | TAB | 6 | 7 | [{"tabRefId":"tab-24","label":"webview.html","kind":"text","viewColumn":6,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |  |  |
| 7 | 2026-04-12T15:21:54.027Z | TAB | 7 | 8 |  |  | [{"tabRefId":"tab-24","label":"webview.html","kind":"text","viewColumn":6,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |
| 8 | 2026-04-12T15:21:54.027Z | GROUP | 8 | 9 |  |  | [{"groupRefId":"group-18","viewColumn":1,"isActive":false,"activeTabRefId":"tab-25","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-25"]},{"groupRefId":"group-19","viewColumn":2,"isActive":false,"activeTabRefId":"tab-26","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-26"]},{"groupRefId":"group-20","viewColumn":3,"isActive":false,"activeTabRefId":"tab-27","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-27"]},{"groupRefId":"group-21","viewColumn":4,"isActive":false,"activeTabRefId":"tab-28","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-28"]},{"groupRefId":"group-22","viewColumn":5,"isActive":false,"activeTabRefId":"tab-29","tabCount":2,"tabLabels":["LICENSE","webview.html"],"tabRefIds":["tab-30","tab-29"]},{"groupRefId":"group-23","viewColumn":6,"isActive":true,"activeTabRefId":"tab-31","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-32","tab-31"]}] |
| 9 | 2026-04-12T15:21:54.029Z | TAB | 9 | 10 |  |  | [{"tabRefId":"tab-30","label":"LICENSE","kind":"text","viewColumn":5,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 10 | 2026-04-12T15:21:54.029Z | GROUP | 10 | 11 |  |  | [{"groupRefId":"group-24","viewColumn":1,"isActive":false,"activeTabRefId":"tab-33","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-33"]},{"groupRefId":"group-25","viewColumn":2,"isActive":false,"activeTabRefId":"tab-34","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-34"]},{"groupRefId":"group-26","viewColumn":3,"isActive":false,"activeTabRefId":"tab-35","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-35"]},{"groupRefId":"group-27","viewColumn":4,"isActive":false,"activeTabRefId":"tab-36","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-36"]},{"groupRefId":"group-28","viewColumn":5,"isActive":false,"activeTabRefId":"tab-37","tabCount":2,"tabLabels":["LICENSE","webview.html"],"tabRefIds":["tab-37","tab-38"]},{"groupRefId":"group-29","viewColumn":6,"isActive":true,"activeTabRefId":"tab-39","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-40","tab-39"]}] |
| 11 | 2026-04-12T15:21:54.029Z | TAB | 11 | 12 |  | [{"tabRefId":"tab-38","label":"webview.html","kind":"text","viewColumn":5,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:53.996Z] GROUP v0 -> v1** — 25 change(s)

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
| CHANGE | `4.tabRefIds.1` | "tab-7" | "tab-14" |
| CHANGE | `4.tabRefIds.2` | "tab-5" | "tab-12" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-6" | "tab-13" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-7" | "tab-14" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-5" | "tab-12" |
| CREATE | `5` |  | {"groupRefId":"group-11","viewColumn":6,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:21:53.996Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `5.tabCount` | 0 | 1 |
| CREATE | `5.tabLabels.0` |  | "CHANGELOG.md" |
| CREATE | `5.tabRefIds.0` |  | "tab-15" |
| CREATE | `5.tabs.0` |  | {"tabRefId":"tab-15","label":"CHANGELOG.md","kind":"text","viewColumn":6,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |

**[seq=2, time=2026-04-12T15:21:53.997Z] TAB v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `5.activeTabRefId` | null | "tab-15" |
| CHANGE | `5.tabs.0.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:53.997Z] GROUP v3 -> v4** — 28 change(s)

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
| CHANGE | `4.tabRefIds.1` | "tab-14" | "tab-22" |
| CHANGE | `4.tabRefIds.2` | "tab-12" | "tab-20" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-13" | "tab-21" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-14" | "tab-22" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-12" | "tab-20" |
| CHANGE | `5.groupRefId` | "group-11" | "group-17" |
| CHANGE | `5.activeTabRefId` | "tab-15" | "tab-23" |
| CHANGE | `5.tabRefIds.0` | "tab-15" | "tab-23" |
| CHANGE | `5.tabs.0.tabRefId` | "tab-15" | "tab-23" |

**[seq=4, time=2026-04-12T15:21:54.007Z] GROUP v4 -> v5** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `5.isActive` | false | true |

**[seq=5, time=2026-04-12T15:21:54.010Z] TAB v5 -> v6** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.tabCount` | 3 | 2 |
| CHANGE | `4.tabLabels.1` | "CHANGELOG.md" | "webview.html" |
| REMOVE | `4.tabLabels.2` | "webview.html" |  |
| CHANGE | `4.tabRefIds.1` | "tab-22" | "tab-20" |
| REMOVE | `4.tabRefIds.2` | "tab-20" |  |
| CHANGE | `4.tabs.1.tabRefId` | "tab-22" | "tab-20" |
| CHANGE | `4.tabs.1.label` | "CHANGELOG.md" | "webview.html" |
| CHANGE | `4.tabs.1.isActive` | false | true |
| CHANGE | `4.tabs.1.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/webview.html" |
| REMOVE | `4.tabs.2` | {"tabRefId":"tab-20","label":"webview.html","kind":"text","viewColumn":5,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |  |

**[seq=6, time=2026-04-12T15:21:54.027Z] TAB v6 -> v7** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `5.tabCount` | 1 | 2 |
| CREATE | `5.tabLabels.1` |  | "webview.html" |
| CREATE | `5.tabRefIds.1` |  | "tab-24" |
| CREATE | `5.tabs.1` |  | {"tabRefId":"tab-24","label":"webview.html","kind":"text","viewColumn":6,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |

**[seq=7, time=2026-04-12T15:21:54.027Z] TAB v7 -> v8** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `5.activeTabRefId` | "tab-23" | "tab-24" |
| CHANGE | `5.tabs.0.isActive` | true | false |
| CHANGE | `5.tabs.1.isActive` | false | true |

**[seq=8, time=2026-04-12T15:21:54.027Z] GROUP v8 -> v9** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-12" | "group-18" |
| CHANGE | `0.activeTabRefId` | "tab-16" | "tab-25" |
| CHANGE | `0.tabRefIds.0` | "tab-16" | "tab-25" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-16" | "tab-25" |
| CHANGE | `1.groupRefId` | "group-13" | "group-19" |
| CHANGE | `1.activeTabRefId` | "tab-17" | "tab-26" |
| CHANGE | `1.tabRefIds.0` | "tab-17" | "tab-26" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-17" | "tab-26" |
| CHANGE | `2.groupRefId` | "group-14" | "group-20" |
| CHANGE | `2.activeTabRefId` | "tab-18" | "tab-27" |
| CHANGE | `2.tabRefIds.0` | "tab-18" | "tab-27" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-18" | "tab-27" |
| CHANGE | `3.groupRefId` | "group-15" | "group-21" |
| CHANGE | `3.activeTabRefId` | "tab-19" | "tab-28" |
| CHANGE | `3.tabRefIds.0` | "tab-19" | "tab-28" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-19" | "tab-28" |
| CHANGE | `4.groupRefId` | "group-16" | "group-22" |
| CHANGE | `4.activeTabRefId` | "tab-20" | "tab-29" |
| CHANGE | `4.tabRefIds.0` | "tab-21" | "tab-30" |
| CHANGE | `4.tabRefIds.1` | "tab-20" | "tab-29" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-21" | "tab-30" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-20" | "tab-29" |
| CHANGE | `5.groupRefId` | "group-17" | "group-23" |
| CHANGE | `5.activeTabRefId` | "tab-24" | "tab-31" |
| CHANGE | `5.tabRefIds.0` | "tab-23" | "tab-32" |
| CHANGE | `5.tabRefIds.1` | "tab-24" | "tab-31" |
| CHANGE | `5.tabs.0.tabRefId` | "tab-23" | "tab-32" |
| CHANGE | `5.tabs.1.tabRefId` | "tab-24" | "tab-31" |

**[seq=9, time=2026-04-12T15:21:54.029Z] TAB v9 -> v10** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.activeTabRefId` | "tab-29" | "tab-30" |
| CHANGE | `4.tabs.0.isActive` | false | true |
| CHANGE | `4.tabs.1.isActive` | true | false |

**[seq=10, time=2026-04-12T15:21:54.029Z] GROUP v10 -> v11** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-18" | "group-24" |
| CHANGE | `0.activeTabRefId` | "tab-25" | "tab-33" |
| CHANGE | `0.tabRefIds.0` | "tab-25" | "tab-33" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-25" | "tab-33" |
| CHANGE | `1.groupRefId` | "group-19" | "group-25" |
| CHANGE | `1.activeTabRefId` | "tab-26" | "tab-34" |
| CHANGE | `1.tabRefIds.0` | "tab-26" | "tab-34" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-26" | "tab-34" |
| CHANGE | `2.groupRefId` | "group-20" | "group-26" |
| CHANGE | `2.activeTabRefId` | "tab-27" | "tab-35" |
| CHANGE | `2.tabRefIds.0` | "tab-27" | "tab-35" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-27" | "tab-35" |
| CHANGE | `3.groupRefId` | "group-21" | "group-27" |
| CHANGE | `3.activeTabRefId` | "tab-28" | "tab-36" |
| CHANGE | `3.tabRefIds.0` | "tab-28" | "tab-36" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-28" | "tab-36" |
| CHANGE | `4.groupRefId` | "group-22" | "group-28" |
| CHANGE | `4.activeTabRefId` | "tab-30" | "tab-37" |
| CHANGE | `4.tabRefIds.0` | "tab-30" | "tab-37" |
| CHANGE | `4.tabRefIds.1` | "tab-29" | "tab-38" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-30" | "tab-37" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-29" | "tab-38" |
| CHANGE | `5.groupRefId` | "group-23" | "group-29" |
| CHANGE | `5.activeTabRefId` | "tab-31" | "tab-39" |
| CHANGE | `5.tabRefIds.0` | "tab-32" | "tab-40" |
| CHANGE | `5.tabRefIds.1` | "tab-31" | "tab-39" |
| CHANGE | `5.tabs.0.tabRefId` | "tab-32" | "tab-40" |
| CHANGE | `5.tabs.1.tabRefId` | "tab-31" | "tab-39" |

**[seq=11, time=2026-04-12T15:21:54.029Z] TAB v11 -> v12** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.tabCount` | 2 | 1 |
| REMOVE | `4.tabLabels.1` | "webview.html" |  |
| REMOVE | `4.tabRefIds.1` | "tab-38" |  |
| REMOVE | `4.tabs.1` | {"tabRefId":"tab-38","label":"webview.html","kind":"text","viewColumn":5,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |  |

---
