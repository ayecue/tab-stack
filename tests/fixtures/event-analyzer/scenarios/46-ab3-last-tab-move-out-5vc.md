# Scenario: AB3: last-tab move-out (5vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AB3: last-tab move-out (5vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts"]},{"viewColumn":5,"tabs":["LICENSE","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:11.636Z | TAB | 0 | 1 | [{"tabRefId":"tab-8","label":"vitest.config.ts","kind":"text","viewColumn":5,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |  |
| 1 | 2026-04-12T15:21:11.636Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-8","label":"vitest.config.ts","kind":"text","viewColumn":5,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 2 | 2026-04-12T15:21:11.637Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-9"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-10"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-11"]},{"groupRefId":"group-9","viewColumn":4,"isActive":true,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-12"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-13","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"],"tabRefIds":["tab-14","tab-15","tab-16","tab-13"]}] |
| 3 | 2026-04-12T15:21:11.637Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-10","viewColumn":5,"isActive":true,"activeTabRefId":"tab-13","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"],"tabRefIds":["tab-14","tab-15","tab-16","tab-13"]}] |
| 4 | 2026-04-12T15:21:11.638Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-11","viewColumn":1,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-17"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-18"]},{"groupRefId":"group-13","viewColumn":3,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-19"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["vitest.config.ts"],"tabRefIds":["tab-20"]},{"groupRefId":"group-15","viewColumn":5,"isActive":true,"activeTabRefId":"tab-21","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"],"tabRefIds":["tab-22","tab-23","tab-24","tab-21"]}] |
| 5 | 2026-04-12T15:21:11.639Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-20","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |
| 6 | 2026-04-12T15:21:11.654Z | GROUP | 6 | 7 |  | [{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-25","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-25"]},{"groupRefId":"group-17","viewColumn":2,"isActive":false,"activeTabRefId":"tab-26","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-26"]},{"groupRefId":"group-18","viewColumn":3,"isActive":false,"activeTabRefId":"tab-27","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-27"]},{"groupRefId":"group-19","viewColumn":4,"isActive":true,"activeTabRefId":"tab-28","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"],"tabRefIds":["tab-29","tab-30","tab-31","tab-28"]}] |
| 7 | 2026-04-12T15:21:11.654Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-20","viewColumn":1,"isActive":false,"activeTabRefId":"tab-32","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-32"]},{"groupRefId":"group-21","viewColumn":2,"isActive":false,"activeTabRefId":"tab-33","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-33"]},{"groupRefId":"group-22","viewColumn":3,"isActive":false,"activeTabRefId":"tab-34","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-34"]},{"groupRefId":"group-23","viewColumn":4,"isActive":true,"activeTabRefId":"tab-35","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"],"tabRefIds":["tab-36","tab-37","tab-38","tab-35"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:11.636Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.tabCount` | 3 | 4 |
| CREATE | `4.tabLabels.3` |  | "vitest.config.ts" |
| CREATE | `4.tabRefIds.3` |  | "tab-8" |
| CREATE | `4.tabs.3` |  | {"tabRefId":"tab-8","label":"vitest.config.ts","kind":"text","viewColumn":5,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |

**[seq=1, time=2026-04-12T15:21:11.636Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `4.activeTabRefId` | "tab-5" | "tab-8" |
| CHANGE | `4.tabs.2.isActive` | true | false |
| CHANGE | `4.tabs.3.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:11.637Z] GROUP v2 -> v3** — 26 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-9" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-9" |
| CHANGE | `1.groupRefId` | "group-2" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-10" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-10" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-10" |
| CHANGE | `2.groupRefId` | "group-3" | "group-8" |
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-11" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-11" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-11" |
| CHANGE | `3.groupRefId` | "group-4" | "group-9" |
| CHANGE | `3.activeTabRefId` | "tab-4" | "tab-12" |
| CHANGE | `3.tabRefIds.0` | "tab-4" | "tab-12" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-4" | "tab-12" |
| CHANGE | `4.groupRefId` | "group-5" | "group-10" |
| CHANGE | `4.activeTabRefId` | "tab-8" | "tab-13" |
| CHANGE | `4.tabRefIds.0` | "tab-6" | "tab-14" |
| CHANGE | `4.tabRefIds.1` | "tab-7" | "tab-15" |
| CHANGE | `4.tabRefIds.2` | "tab-5" | "tab-16" |
| CHANGE | `4.tabRefIds.3` | "tab-8" | "tab-13" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-6" | "tab-14" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-7" | "tab-15" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-5" | "tab-16" |
| CHANGE | `4.tabs.3.tabRefId` | "tab-8" | "tab-13" |

**[seq=3, time=2026-04-12T15:21:11.637Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.isActive` | true | false |
| CHANGE | `4.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:11.638Z] GROUP v4 -> v5** — 27 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-11" |
| CHANGE | `0.activeTabRefId` | "tab-9" | "tab-17" |
| CHANGE | `0.tabRefIds.0` | "tab-9" | "tab-17" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-9" | "tab-17" |
| CHANGE | `1.groupRefId` | "group-7" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-10" | "tab-18" |
| CHANGE | `1.tabRefIds.0` | "tab-10" | "tab-18" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-10" | "tab-18" |
| CHANGE | `2.groupRefId` | "group-8" | "group-13" |
| CHANGE | `2.activeTabRefId` | "tab-11" | "tab-19" |
| CHANGE | `2.tabRefIds.0` | "tab-11" | "tab-19" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-11" | "tab-19" |
| CHANGE | `3.groupRefId` | "group-9" | "group-14" |
| CHANGE | `3.activeTabRefId` | "tab-12" | null |
| CHANGE | `3.tabRefIds.0` | "tab-12" | "tab-20" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-12" | "tab-20" |
| CHANGE | `3.tabs.0.isActive` | true | false |
| CHANGE | `4.groupRefId` | "group-10" | "group-15" |
| CHANGE | `4.activeTabRefId` | "tab-13" | "tab-21" |
| CHANGE | `4.tabRefIds.0` | "tab-14" | "tab-22" |
| CHANGE | `4.tabRefIds.1` | "tab-15" | "tab-23" |
| CHANGE | `4.tabRefIds.2` | "tab-16" | "tab-24" |
| CHANGE | `4.tabRefIds.3` | "tab-13" | "tab-21" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-14" | "tab-22" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-15" | "tab-23" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-16" | "tab-24" |
| CHANGE | `4.tabs.3.tabRefId` | "tab-13" | "tab-21" |

**[seq=5, time=2026-04-12T15:21:11.639Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 0 |
| REMOVE | `3.tabLabels.0` | "vitest.config.ts" |  |
| REMOVE | `3.tabRefIds.0` | "tab-20" |  |
| REMOVE | `3.tabs.0` | {"tabRefId":"tab-20","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=6, time=2026-04-12T15:21:11.654Z] GROUP v6 -> v7** — 29 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-17" | "tab-25" |
| CHANGE | `0.tabRefIds.0` | "tab-17" | "tab-25" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-17" | "tab-25" |
| CHANGE | `1.groupRefId` | "group-12" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-18" | "tab-26" |
| CHANGE | `1.tabRefIds.0` | "tab-18" | "tab-26" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-18" | "tab-26" |
| CHANGE | `2.groupRefId` | "group-13" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-19" | "tab-27" |
| CHANGE | `2.tabRefIds.0` | "tab-19" | "tab-27" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-19" | "tab-27" |
| CHANGE | `3.groupRefId` | "group-14" | "group-19" |
| CHANGE | `3.isActive` | false | true |
| CHANGE | `3.activeTabRefId` | null | "tab-28" |
| CHANGE | `3.tabCount` | 0 | 4 |
| CREATE | `3.tabLabels.0` |  | "LICENSE" |
| CREATE | `3.tabLabels.1` |  | "CHANGELOG.md" |
| CREATE | `3.tabLabels.2` |  | "webview.html" |
| CREATE | `3.tabLabels.3` |  | "vitest.config.ts" |
| CREATE | `3.tabRefIds.0` |  | "tab-29" |
| CREATE | `3.tabRefIds.1` |  | "tab-30" |
| CREATE | `3.tabRefIds.2` |  | "tab-31" |
| CREATE | `3.tabRefIds.3` |  | "tab-28" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-29","label":"LICENSE","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |
| CREATE | `3.tabs.1` |  | {"tabRefId":"tab-30","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |
| CREATE | `3.tabs.2` |  | {"tabRefId":"tab-31","label":"webview.html","kind":"text","viewColumn":4,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |
| CREATE | `3.tabs.3` |  | {"tabRefId":"tab-28","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |
| REMOVE | `4` | {"groupRefId":"group-15","viewColumn":5,"isActive":true,"activeTabRefId":"tab-21","tabCount":4,"tabLabels":["LICENSE","CHANGELOG.md","webview.html","vitest.config.ts"],"tabRefIds":["tab-22","tab-23","tab-24","tab-21"],"tabs":[{"tabRefId":"tab-22","label":"LICENSE","kind":"text","viewColumn":5,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"},{"tabRefId":"tab-23","label":"CHANGELOG.md","kind":"text","viewColumn":5,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"},{"tabRefId":"tab-24","label":"webview.html","kind":"text","viewColumn":5,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"},{"tabRefId":"tab-21","label":"vitest.config.ts","kind":"text","viewColumn":5,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}]} |  |

**[seq=7, time=2026-04-12T15:21:11.654Z] GROUP v7 -> v8** — 22 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-16" | "group-20" |
| CHANGE | `0.activeTabRefId` | "tab-25" | "tab-32" |
| CHANGE | `0.tabRefIds.0` | "tab-25" | "tab-32" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-25" | "tab-32" |
| CHANGE | `1.groupRefId` | "group-17" | "group-21" |
| CHANGE | `1.activeTabRefId` | "tab-26" | "tab-33" |
| CHANGE | `1.tabRefIds.0` | "tab-26" | "tab-33" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-26" | "tab-33" |
| CHANGE | `2.groupRefId` | "group-18" | "group-22" |
| CHANGE | `2.activeTabRefId` | "tab-27" | "tab-34" |
| CHANGE | `2.tabRefIds.0` | "tab-27" | "tab-34" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-27" | "tab-34" |
| CHANGE | `3.groupRefId` | "group-19" | "group-23" |
| CHANGE | `3.activeTabRefId` | "tab-28" | "tab-35" |
| CHANGE | `3.tabRefIds.0` | "tab-29" | "tab-36" |
| CHANGE | `3.tabRefIds.1` | "tab-30" | "tab-37" |
| CHANGE | `3.tabRefIds.2` | "tab-31" | "tab-38" |
| CHANGE | `3.tabRefIds.3` | "tab-28" | "tab-35" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-29" | "tab-36" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-30" | "tab-37" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-31" | "tab-38" |
| CHANGE | `3.tabs.3.tabRefId` | "tab-28" | "tab-35" |

---
