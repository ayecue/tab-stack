# Scenario: AC3: last-tab duplicate-move (5vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AC3: last-tab duplicate-move (5vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["package.json"]},{"viewColumn":5,"tabs":["package.json","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["package.json","CHANGELOG.md","webview.html"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 7
- **Observed events:** 7

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:17.114Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":5,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 1 | 2026-04-12T15:21:17.114Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-8"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-9"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-10"]},{"groupRefId":"group-9","viewColumn":4,"isActive":true,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-11"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-12","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-12","tab-13","tab-14"]}] |
| 2 | 2026-04-12T15:21:17.115Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-10","viewColumn":5,"isActive":true,"activeTabRefId":"tab-12","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-12","tab-13","tab-14"]}] |
| 3 | 2026-04-12T15:21:17.117Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-11","viewColumn":1,"isActive":false,"activeTabRefId":"tab-15","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-15"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-16","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-16"]},{"groupRefId":"group-13","viewColumn":3,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-17"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-18"]},{"groupRefId":"group-15","viewColumn":5,"isActive":true,"activeTabRefId":"tab-19","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-19","tab-20","tab-21"]}] |
| 4 | 2026-04-12T15:21:17.117Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-18","label":"package.json","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 5 | 2026-04-12T15:21:17.131Z | GROUP | 5 | 6 |  | [{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-22","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-22"]},{"groupRefId":"group-17","viewColumn":2,"isActive":false,"activeTabRefId":"tab-23","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-23"]},{"groupRefId":"group-18","viewColumn":3,"isActive":false,"activeTabRefId":"tab-24","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-24"]},{"groupRefId":"group-19","viewColumn":4,"isActive":true,"activeTabRefId":"tab-25","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-25","tab-26","tab-27"]}] |
| 6 | 2026-04-12T15:21:17.131Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-20","viewColumn":1,"isActive":false,"activeTabRefId":"tab-28","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-28"]},{"groupRefId":"group-21","viewColumn":2,"isActive":false,"activeTabRefId":"tab-29","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-29"]},{"groupRefId":"group-22","viewColumn":3,"isActive":false,"activeTabRefId":"tab-30","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-30"]},{"groupRefId":"group-23","viewColumn":4,"isActive":true,"activeTabRefId":"tab-31","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-31","tab-32","tab-33"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:17.114Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.activeTabRefId` | "tab-5" | "tab-6" |
| CHANGE | `4.tabs.0.isActive` | false | true |
| CHANGE | `4.tabs.2.isActive` | true | false |

**[seq=1, time=2026-04-12T15:21:17.114Z] GROUP v1 -> v2** — 24 change(s)

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
| CHANGE | `4.activeTabRefId` | "tab-6" | "tab-12" |
| CHANGE | `4.tabRefIds.0` | "tab-6" | "tab-12" |
| CHANGE | `4.tabRefIds.1` | "tab-7" | "tab-13" |
| CHANGE | `4.tabRefIds.2` | "tab-5" | "tab-14" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-6" | "tab-12" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-7" | "tab-13" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-5" | "tab-14" |

**[seq=2, time=2026-04-12T15:21:17.115Z] GROUP v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.isActive` | true | false |
| CHANGE | `4.isActive` | false | true |

**[seq=3, time=2026-04-12T15:21:17.117Z] GROUP v3 -> v4** — 25 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-11" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-15" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-15" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-15" |
| CHANGE | `1.groupRefId` | "group-7" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-9" | "tab-16" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-16" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-16" |
| CHANGE | `2.groupRefId` | "group-8" | "group-13" |
| CHANGE | `2.activeTabRefId` | "tab-10" | "tab-17" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-17" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-17" |
| CHANGE | `3.groupRefId` | "group-9" | "group-14" |
| CHANGE | `3.activeTabRefId` | "tab-11" | null |
| CHANGE | `3.tabRefIds.0` | "tab-11" | "tab-18" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-11" | "tab-18" |
| CHANGE | `3.tabs.0.isActive` | true | false |
| CHANGE | `4.groupRefId` | "group-10" | "group-15" |
| CHANGE | `4.activeTabRefId` | "tab-12" | "tab-19" |
| CHANGE | `4.tabRefIds.0` | "tab-12" | "tab-19" |
| CHANGE | `4.tabRefIds.1` | "tab-13" | "tab-20" |
| CHANGE | `4.tabRefIds.2` | "tab-14" | "tab-21" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-12" | "tab-19" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-13" | "tab-20" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-14" | "tab-21" |

**[seq=4, time=2026-04-12T15:21:17.117Z] TAB v4 -> v5** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 0 |
| REMOVE | `3.tabLabels.0` | "package.json" |  |
| REMOVE | `3.tabRefIds.0` | "tab-18" |  |
| REMOVE | `3.tabs.0` | {"tabRefId":"tab-18","label":"package.json","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=5, time=2026-04-12T15:21:17.131Z] GROUP v5 -> v6** — 26 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-15" | "tab-22" |
| CHANGE | `0.tabRefIds.0` | "tab-15" | "tab-22" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-15" | "tab-22" |
| CHANGE | `1.groupRefId` | "group-12" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-16" | "tab-23" |
| CHANGE | `1.tabRefIds.0` | "tab-16" | "tab-23" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-16" | "tab-23" |
| CHANGE | `2.groupRefId` | "group-13" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-17" | "tab-24" |
| CHANGE | `2.tabRefIds.0` | "tab-17" | "tab-24" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-17" | "tab-24" |
| CHANGE | `3.groupRefId` | "group-14" | "group-19" |
| CHANGE | `3.isActive` | false | true |
| CHANGE | `3.activeTabRefId` | null | "tab-25" |
| CHANGE | `3.tabCount` | 0 | 3 |
| CREATE | `3.tabLabels.0` |  | "package.json" |
| CREATE | `3.tabLabels.1` |  | "CHANGELOG.md" |
| CREATE | `3.tabLabels.2` |  | "webview.html" |
| CREATE | `3.tabRefIds.0` |  | "tab-25" |
| CREATE | `3.tabRefIds.1` |  | "tab-26" |
| CREATE | `3.tabRefIds.2` |  | "tab-27" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-25","label":"package.json","kind":"text","viewColumn":4,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| CREATE | `3.tabs.1` |  | {"tabRefId":"tab-26","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |
| CREATE | `3.tabs.2` |  | {"tabRefId":"tab-27","label":"webview.html","kind":"text","viewColumn":4,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |
| REMOVE | `4` | {"groupRefId":"group-15","viewColumn":5,"isActive":true,"activeTabRefId":"tab-19","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-19","tab-20","tab-21"],"tabs":[{"tabRefId":"tab-19","label":"package.json","kind":"text","viewColumn":5,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"},{"tabRefId":"tab-20","label":"CHANGELOG.md","kind":"text","viewColumn":5,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"},{"tabRefId":"tab-21","label":"webview.html","kind":"text","viewColumn":5,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}]} |  |

**[seq=6, time=2026-04-12T15:21:17.131Z] GROUP v6 -> v7** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-16" | "group-20" |
| CHANGE | `0.activeTabRefId` | "tab-22" | "tab-28" |
| CHANGE | `0.tabRefIds.0` | "tab-22" | "tab-28" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-22" | "tab-28" |
| CHANGE | `1.groupRefId` | "group-17" | "group-21" |
| CHANGE | `1.activeTabRefId` | "tab-23" | "tab-29" |
| CHANGE | `1.tabRefIds.0` | "tab-23" | "tab-29" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-23" | "tab-29" |
| CHANGE | `2.groupRefId` | "group-18" | "group-22" |
| CHANGE | `2.activeTabRefId` | "tab-24" | "tab-30" |
| CHANGE | `2.tabRefIds.0` | "tab-24" | "tab-30" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-24" | "tab-30" |
| CHANGE | `3.groupRefId` | "group-19" | "group-23" |
| CHANGE | `3.activeTabRefId` | "tab-25" | "tab-31" |
| CHANGE | `3.tabRefIds.0` | "tab-25" | "tab-31" |
| CHANGE | `3.tabRefIds.1` | "tab-26" | "tab-32" |
| CHANGE | `3.tabRefIds.2` | "tab-27" | "tab-33" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-25" | "tab-31" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-26" | "tab-32" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-27" | "tab-33" |

---
