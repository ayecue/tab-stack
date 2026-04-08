# Scenario: AA3: duplicate-target move (5vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AA3: duplicate-target move (5vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["package.json","CHANGELOG.md"]},{"viewColumn":3,"tabs":["tsconfig.json","vitest.config.ts"]},{"viewColumn":4,"tabs":["package.json","LICENSE"]},{"viewColumn":5,"tabs":["webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["CHANGELOG.md"]},{"viewColumn":3,"tabs":["tsconfig.json","vitest.config.ts"]},{"viewColumn":4,"tabs":["package.json","LICENSE"]},{"viewColumn":5,"tabs":["webview.html"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 13
- **Observed events:** 13

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:05.796Z | TAB | 0 | 1 | [{"tabRefId":"tab-9","label":"package.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:21:05.796Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-9","label":"package.json","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 2 | 2026-04-12T15:21:05.797Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-10"]},{"groupRefId":"group-7","viewColumn":2,"isActive":true,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["package.json","CHANGELOG.md"],"tabRefIds":["tab-11","tab-12"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-13","tabCount":3,"tabLabels":["tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-14","tab-15","tab-13"]},{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":"tab-16","tabCount":2,"tabLabels":["package.json","LICENSE"],"tabRefIds":["tab-17","tab-16"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-18"]}] |
| 3 | 2026-04-12T15:21:05.798Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-8","viewColumn":3,"isActive":true,"activeTabRefId":"tab-13","tabCount":3,"tabLabels":["tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-14","tab-15","tab-13"]}] |
| 4 | 2026-04-12T15:21:05.800Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-12","label":"CHANGELOG.md","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 5 | 2026-04-12T15:21:05.800Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-11","viewColumn":1,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-19"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-20","tabCount":2,"tabLabels":["package.json","CHANGELOG.md"],"tabRefIds":["tab-21","tab-20"]},{"groupRefId":"group-13","viewColumn":3,"isActive":true,"activeTabRefId":"tab-22","tabCount":3,"tabLabels":["tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-23","tab-24","tab-22"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":"tab-25","tabCount":2,"tabLabels":["package.json","LICENSE"],"tabRefIds":["tab-26","tab-25"]},{"groupRefId":"group-15","viewColumn":5,"isActive":false,"activeTabRefId":"tab-27","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-27"]}] |
| 6 | 2026-04-12T15:21:05.800Z | TAB | 6 | 7 |  | [{"tabRefId":"tab-21","label":"package.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 7 | 2026-04-12T15:21:06.114Z | TAB | 7 | 8 |  |  | [{"tabRefId":"tab-26","label":"package.json","kind":"text","viewColumn":4,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 8 | 2026-04-12T15:21:06.114Z | GROUP | 8 | 9 |  |  | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-28","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-28"]},{"groupRefId":"group-17","viewColumn":2,"isActive":false,"activeTabRefId":"tab-29","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-29"]},{"groupRefId":"group-18","viewColumn":3,"isActive":true,"activeTabRefId":"tab-30","tabCount":3,"tabLabels":["tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-31","tab-32","tab-30"]},{"groupRefId":"group-19","viewColumn":4,"isActive":false,"activeTabRefId":"tab-33","tabCount":2,"tabLabels":["package.json","LICENSE"],"tabRefIds":["tab-33","tab-34"]},{"groupRefId":"group-20","viewColumn":5,"isActive":false,"activeTabRefId":"tab-35","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-35"]}] |
| 9 | 2026-04-12T15:21:06.116Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-19","viewColumn":4,"isActive":true,"activeTabRefId":"tab-33","tabCount":2,"tabLabels":["package.json","LICENSE"],"tabRefIds":["tab-33","tab-34"]}] |
| 10 | 2026-04-12T15:21:06.119Z | TAB | 10 | 11 |  |  | [{"tabRefId":"tab-32","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 11 | 2026-04-12T15:21:06.119Z | GROUP | 11 | 12 |  |  | [{"groupRefId":"group-21","viewColumn":1,"isActive":false,"activeTabRefId":"tab-36","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-36"]},{"groupRefId":"group-22","viewColumn":2,"isActive":false,"activeTabRefId":"tab-37","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-37"]},{"groupRefId":"group-23","viewColumn":3,"isActive":false,"activeTabRefId":"tab-38","tabCount":3,"tabLabels":["tsconfig.json","vitest.config.ts","package.json"],"tabRefIds":["tab-39","tab-38","tab-40"]},{"groupRefId":"group-24","viewColumn":4,"isActive":true,"activeTabRefId":"tab-41","tabCount":2,"tabLabels":["package.json","LICENSE"],"tabRefIds":["tab-41","tab-42"]},{"groupRefId":"group-25","viewColumn":5,"isActive":false,"activeTabRefId":"tab-43","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-43"]}] |
| 12 | 2026-04-12T15:21:06.119Z | TAB | 12 | 13 |  | [{"tabRefId":"tab-40","label":"package.json","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:05.796Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 3 |
| CREATE | `2.tabLabels.2` |  | "package.json" |
| CREATE | `2.tabRefIds.2` |  | "tab-9" |
| CREATE | `2.tabs.2` |  | {"tabRefId":"tab-9","label":"package.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:21:05.796Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabs.1.isActive` | true | false |
| CHANGE | `2.tabs.2.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:05.797Z] GROUP v2 -> v3** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-10" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-10" |
| CHANGE | `1.groupRefId` | "group-2" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-11" |
| CHANGE | `1.tabRefIds.1` | "tab-3" | "tab-12" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-11" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-3" | "tab-12" |
| CHANGE | `2.groupRefId` | "group-3" | "group-8" |
| CHANGE | `2.activeTabRefId` | "tab-9" | "tab-13" |
| CHANGE | `2.tabRefIds.0` | "tab-5" | "tab-14" |
| CHANGE | `2.tabRefIds.1` | "tab-4" | "tab-15" |
| CHANGE | `2.tabRefIds.2` | "tab-9" | "tab-13" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-5" | "tab-14" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-4" | "tab-15" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-9" | "tab-13" |
| CHANGE | `3.groupRefId` | "group-4" | "group-9" |
| CHANGE | `3.activeTabRefId` | "tab-6" | "tab-16" |
| CHANGE | `3.tabRefIds.0` | "tab-7" | "tab-17" |
| CHANGE | `3.tabRefIds.1` | "tab-6" | "tab-16" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-7" | "tab-17" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-6" | "tab-16" |
| CHANGE | `4.groupRefId` | "group-5" | "group-10" |
| CHANGE | `4.activeTabRefId` | "tab-8" | "tab-18" |
| CHANGE | `4.tabRefIds.0` | "tab-8" | "tab-18" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-8" | "tab-18" |

**[seq=3, time=2026-04-12T15:21:05.798Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:05.800Z] TAB v4 -> v5** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-11" | "tab-12" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.isActive` | false | true |

**[seq=5, time=2026-04-12T15:21:05.800Z] GROUP v5 -> v6** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-11" |
| CHANGE | `0.activeTabRefId` | "tab-10" | "tab-19" |
| CHANGE | `0.tabRefIds.0` | "tab-10" | "tab-19" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-10" | "tab-19" |
| CHANGE | `1.groupRefId` | "group-7" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-12" | "tab-20" |
| CHANGE | `1.tabRefIds.0` | "tab-11" | "tab-21" |
| CHANGE | `1.tabRefIds.1` | "tab-12" | "tab-20" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-11" | "tab-21" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-12" | "tab-20" |
| CHANGE | `2.groupRefId` | "group-8" | "group-13" |
| CHANGE | `2.activeTabRefId` | "tab-13" | "tab-22" |
| CHANGE | `2.tabRefIds.0` | "tab-14" | "tab-23" |
| CHANGE | `2.tabRefIds.1` | "tab-15" | "tab-24" |
| CHANGE | `2.tabRefIds.2` | "tab-13" | "tab-22" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-14" | "tab-23" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-15" | "tab-24" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-13" | "tab-22" |
| CHANGE | `3.groupRefId` | "group-9" | "group-14" |
| CHANGE | `3.activeTabRefId` | "tab-16" | "tab-25" |
| CHANGE | `3.tabRefIds.0` | "tab-17" | "tab-26" |
| CHANGE | `3.tabRefIds.1` | "tab-16" | "tab-25" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-17" | "tab-26" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-16" | "tab-25" |
| CHANGE | `4.groupRefId` | "group-10" | "group-15" |
| CHANGE | `4.activeTabRefId` | "tab-18" | "tab-27" |
| CHANGE | `4.tabRefIds.0` | "tab-18" | "tab-27" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-18" | "tab-27" |

**[seq=6, time=2026-04-12T15:21:05.800Z] TAB v6 -> v7** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| CHANGE | `1.tabLabels.0` | "package.json" | "CHANGELOG.md" |
| REMOVE | `1.tabLabels.1` | "CHANGELOG.md" |  |
| CHANGE | `1.tabRefIds.0` | "tab-21" | "tab-20" |
| REMOVE | `1.tabRefIds.1` | "tab-20" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-21" | "tab-20" |
| CHANGE | `1.tabs.0.label` | "package.json" | "CHANGELOG.md" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/CHANGELOG.md" |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-20","label":"CHANGELOG.md","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=7, time=2026-04-12T15:21:06.114Z] TAB v7 -> v8** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | "tab-25" | "tab-26" |
| CHANGE | `3.tabs.0.isActive` | false | true |
| CHANGE | `3.tabs.1.isActive` | true | false |

**[seq=8, time=2026-04-12T15:21:06.114Z] GROUP v8 -> v9** — 26 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-19" | "tab-28" |
| CHANGE | `0.tabRefIds.0` | "tab-19" | "tab-28" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-19" | "tab-28" |
| CHANGE | `1.groupRefId` | "group-12" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-20" | "tab-29" |
| CHANGE | `1.tabRefIds.0` | "tab-20" | "tab-29" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-20" | "tab-29" |
| CHANGE | `2.groupRefId` | "group-13" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-22" | "tab-30" |
| CHANGE | `2.tabRefIds.0` | "tab-23" | "tab-31" |
| CHANGE | `2.tabRefIds.1` | "tab-24" | "tab-32" |
| CHANGE | `2.tabRefIds.2` | "tab-22" | "tab-30" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-23" | "tab-31" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-24" | "tab-32" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-22" | "tab-30" |
| CHANGE | `3.groupRefId` | "group-14" | "group-19" |
| CHANGE | `3.activeTabRefId` | "tab-26" | "tab-33" |
| CHANGE | `3.tabRefIds.0` | "tab-26" | "tab-33" |
| CHANGE | `3.tabRefIds.1` | "tab-25" | "tab-34" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-26" | "tab-33" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-25" | "tab-34" |
| CHANGE | `4.groupRefId` | "group-15" | "group-20" |
| CHANGE | `4.activeTabRefId` | "tab-27" | "tab-35" |
| CHANGE | `4.tabRefIds.0` | "tab-27" | "tab-35" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-27" | "tab-35" |

**[seq=9, time=2026-04-12T15:21:06.116Z] GROUP v9 -> v10** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

**[seq=10, time=2026-04-12T15:21:06.119Z] TAB v10 -> v11** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-30" | "tab-32" |
| CHANGE | `2.tabs.1.isActive` | false | true |
| CHANGE | `2.tabs.2.isActive` | true | false |

**[seq=11, time=2026-04-12T15:21:06.119Z] GROUP v11 -> v12** — 26 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-16" | "group-21" |
| CHANGE | `0.activeTabRefId` | "tab-28" | "tab-36" |
| CHANGE | `0.tabRefIds.0` | "tab-28" | "tab-36" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-28" | "tab-36" |
| CHANGE | `1.groupRefId` | "group-17" | "group-22" |
| CHANGE | `1.activeTabRefId` | "tab-29" | "tab-37" |
| CHANGE | `1.tabRefIds.0` | "tab-29" | "tab-37" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-29" | "tab-37" |
| CHANGE | `2.groupRefId` | "group-18" | "group-23" |
| CHANGE | `2.activeTabRefId` | "tab-32" | "tab-38" |
| CHANGE | `2.tabRefIds.0` | "tab-31" | "tab-39" |
| CHANGE | `2.tabRefIds.1` | "tab-32" | "tab-38" |
| CHANGE | `2.tabRefIds.2` | "tab-30" | "tab-40" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-31" | "tab-39" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-32" | "tab-38" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-30" | "tab-40" |
| CHANGE | `3.groupRefId` | "group-19" | "group-24" |
| CHANGE | `3.activeTabRefId` | "tab-33" | "tab-41" |
| CHANGE | `3.tabRefIds.0` | "tab-33" | "tab-41" |
| CHANGE | `3.tabRefIds.1` | "tab-34" | "tab-42" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-33" | "tab-41" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-34" | "tab-42" |
| CHANGE | `4.groupRefId` | "group-20" | "group-25" |
| CHANGE | `4.activeTabRefId` | "tab-35" | "tab-43" |
| CHANGE | `4.tabRefIds.0` | "tab-35" | "tab-43" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-35" | "tab-43" |

**[seq=12, time=2026-04-12T15:21:06.119Z] TAB v12 -> v13** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 3 | 2 |
| REMOVE | `2.tabLabels.2` | "package.json" |  |
| REMOVE | `2.tabRefIds.2` | "tab-40" |  |
| REMOVE | `2.tabs.2` | {"tabRefId":"tab-40","label":"package.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

---
