# Scenario: AJ3: multi-tab cross-group approximation (5vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AJ3: multi-tab cross-group approximation (5vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","vitest.config.ts"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["CHANGELOG.md","webview.html"]},{"viewColumn":5,"tabs":["webview.css"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["CHANGELOG.md","webview.html","tsconfig.json","vitest.config.ts"]},{"viewColumn":5,"tabs":["webview.css"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 22
- **Observed events:** 22

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:48.312Z | TAB | 0 | 1 | [{"tabRefId":"tab-9","label":"tsconfig.json","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 1 | 2026-04-12T15:21:48.312Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-9","label":"tsconfig.json","kind":"text","viewColumn":3,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 2 | 2026-04-12T15:21:48.312Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":true,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-11","tabCount":3,"tabLabels":["README.md","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-12","tab-13","tab-11"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-14","tabCount":2,"tabLabels":["LICENSE","tsconfig.json"],"tabRefIds":["tab-15","tab-14"]},{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":"tab-16","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-17","tab-16"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["webview.css"],"tabRefIds":["tab-18"]}] |
| 3 | 2026-04-12T15:21:48.314Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-8","viewColumn":3,"isActive":true,"activeTabRefId":"tab-14","tabCount":2,"tabLabels":["LICENSE","tsconfig.json"],"tabRefIds":["tab-15","tab-14"]}] |
| 4 | 2026-04-12T15:21:48.316Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 5 | 2026-04-12T15:21:48.328Z | TAB | 5 | 6 | [{"tabRefId":"tab-19","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |  |
| 6 | 2026-04-12T15:21:48.328Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-19","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 7 | 2026-04-12T15:21:48.328Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-11","viewColumn":1,"isActive":false,"activeTabRefId":"tab-20","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-20"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-21","tabCount":2,"tabLabels":["README.md","vitest.config.ts"],"tabRefIds":["tab-22","tab-21"]},{"groupRefId":"group-13","viewColumn":3,"isActive":true,"activeTabRefId":"tab-23","tabCount":3,"tabLabels":["LICENSE","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-24","tab-25","tab-23"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":"tab-26","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-27","tab-26"]},{"groupRefId":"group-15","viewColumn":5,"isActive":false,"activeTabRefId":"tab-28","tabCount":1,"tabLabels":["webview.css"],"tabRefIds":["tab-28"]}] |
| 8 | 2026-04-12T15:21:48.330Z | TAB | 8 | 9 |  |  | [{"tabRefId":"tab-22","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 9 | 2026-04-12T15:21:48.330Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-16","viewColumn":1,"isActive":false,"activeTabRefId":"tab-29","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-29"]},{"groupRefId":"group-17","viewColumn":2,"isActive":false,"activeTabRefId":"tab-30","tabCount":2,"tabLabels":["README.md","vitest.config.ts"],"tabRefIds":["tab-30","tab-31"]},{"groupRefId":"group-18","viewColumn":3,"isActive":true,"activeTabRefId":"tab-32","tabCount":3,"tabLabels":["LICENSE","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-33","tab-34","tab-32"]},{"groupRefId":"group-19","viewColumn":4,"isActive":false,"activeTabRefId":"tab-35","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-36","tab-35"]},{"groupRefId":"group-20","viewColumn":5,"isActive":false,"activeTabRefId":"tab-37","tabCount":1,"tabLabels":["webview.css"],"tabRefIds":["tab-37"]}] |
| 10 | 2026-04-12T15:21:48.330Z | TAB | 10 | 11 |  | [{"tabRefId":"tab-31","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |
| 11 | 2026-04-12T15:21:48.342Z | TAB | 11 | 12 | [{"tabRefId":"tab-38","label":"tsconfig.json","kind":"text","viewColumn":4,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 12 | 2026-04-12T15:21:48.342Z | TAB | 12 | 13 |  |  | [{"tabRefId":"tab-38","label":"tsconfig.json","kind":"text","viewColumn":4,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 13 | 2026-04-12T15:21:48.342Z | GROUP | 13 | 14 |  |  | [{"groupRefId":"group-21","viewColumn":1,"isActive":false,"activeTabRefId":"tab-39","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-39"]},{"groupRefId":"group-22","viewColumn":2,"isActive":false,"activeTabRefId":"tab-40","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-40"]},{"groupRefId":"group-23","viewColumn":3,"isActive":true,"activeTabRefId":"tab-41","tabCount":3,"tabLabels":["LICENSE","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-42","tab-43","tab-41"]},{"groupRefId":"group-24","viewColumn":4,"isActive":false,"activeTabRefId":"tab-44","tabCount":3,"tabLabels":["CHANGELOG.md","webview.html","tsconfig.json"],"tabRefIds":["tab-45","tab-46","tab-44"]},{"groupRefId":"group-25","viewColumn":5,"isActive":false,"activeTabRefId":"tab-47","tabCount":1,"tabLabels":["webview.css"],"tabRefIds":["tab-47"]}] |
| 14 | 2026-04-12T15:21:48.344Z | GROUP | 14 | 15 |  |  | [{"groupRefId":"group-24","viewColumn":4,"isActive":true,"activeTabRefId":"tab-44","tabCount":3,"tabLabels":["CHANGELOG.md","webview.html","tsconfig.json"],"tabRefIds":["tab-45","tab-46","tab-44"]}] |
| 15 | 2026-04-12T15:21:48.345Z | TAB | 15 | 16 |  | [{"tabRefId":"tab-43","label":"tsconfig.json","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 16 | 2026-04-12T15:21:48.359Z | TAB | 16 | 17 | [{"tabRefId":"tab-48","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |  |
| 17 | 2026-04-12T15:21:48.359Z | TAB | 17 | 18 |  |  | [{"tabRefId":"tab-48","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 18 | 2026-04-12T15:21:48.359Z | GROUP | 18 | 19 |  |  | [{"groupRefId":"group-26","viewColumn":1,"isActive":false,"activeTabRefId":"tab-49","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-49"]},{"groupRefId":"group-27","viewColumn":2,"isActive":false,"activeTabRefId":"tab-50","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-50"]},{"groupRefId":"group-28","viewColumn":3,"isActive":false,"activeTabRefId":"tab-51","tabCount":2,"tabLabels":["LICENSE","vitest.config.ts"],"tabRefIds":["tab-52","tab-51"]},{"groupRefId":"group-29","viewColumn":4,"isActive":true,"activeTabRefId":"tab-53","tabCount":4,"tabLabels":["CHANGELOG.md","webview.html","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-54","tab-55","tab-56","tab-53"]},{"groupRefId":"group-30","viewColumn":5,"isActive":false,"activeTabRefId":"tab-57","tabCount":1,"tabLabels":["webview.css"],"tabRefIds":["tab-57"]}] |
| 19 | 2026-04-12T15:21:48.361Z | TAB | 19 | 20 |  |  | [{"tabRefId":"tab-52","label":"LICENSE","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 20 | 2026-04-12T15:21:48.361Z | GROUP | 20 | 21 |  |  | [{"groupRefId":"group-31","viewColumn":1,"isActive":false,"activeTabRefId":"tab-58","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-58"]},{"groupRefId":"group-32","viewColumn":2,"isActive":false,"activeTabRefId":"tab-59","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-59"]},{"groupRefId":"group-33","viewColumn":3,"isActive":false,"activeTabRefId":"tab-60","tabCount":2,"tabLabels":["LICENSE","vitest.config.ts"],"tabRefIds":["tab-60","tab-61"]},{"groupRefId":"group-34","viewColumn":4,"isActive":true,"activeTabRefId":"tab-62","tabCount":4,"tabLabels":["CHANGELOG.md","webview.html","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-63","tab-64","tab-65","tab-62"]},{"groupRefId":"group-35","viewColumn":5,"isActive":false,"activeTabRefId":"tab-66","tabCount":1,"tabLabels":["webview.css"],"tabRefIds":["tab-66"]}] |
| 21 | 2026-04-12T15:21:48.361Z | TAB | 21 | 22 |  | [{"tabRefId":"tab-61","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:48.312Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 1 | 2 |
| CREATE | `2.tabLabels.1` |  | "tsconfig.json" |
| CREATE | `2.tabRefIds.1` |  | "tab-9" |
| CREATE | `2.tabs.1` |  | {"tabRefId":"tab-9","label":"tsconfig.json","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=1, time=2026-04-12T15:21:48.312Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-5" | "tab-9" |
| CHANGE | `2.tabs.0.isActive` | true | false |
| CHANGE | `2.tabs.1.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:48.312Z] GROUP v2 -> v3** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-10" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-10" |
| CHANGE | `1.groupRefId` | "group-2" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-12" |
| CHANGE | `1.tabRefIds.1` | "tab-4" | "tab-13" |
| CHANGE | `1.tabRefIds.2` | "tab-2" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-12" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-4" | "tab-13" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-2" | "tab-11" |
| CHANGE | `2.groupRefId` | "group-3" | "group-8" |
| CHANGE | `2.activeTabRefId` | "tab-9" | "tab-14" |
| CHANGE | `2.tabRefIds.0` | "tab-5" | "tab-15" |
| CHANGE | `2.tabRefIds.1` | "tab-9" | "tab-14" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-5" | "tab-15" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-9" | "tab-14" |
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

**[seq=3, time=2026-04-12T15:21:48.314Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `2.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:48.316Z] TAB v4 -> v5** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 2 |
| CHANGE | `1.tabLabels.1` | "tsconfig.json" | "vitest.config.ts" |
| REMOVE | `1.tabLabels.2` | "vitest.config.ts" |  |
| CHANGE | `1.tabRefIds.1` | "tab-13" | "tab-11" |
| REMOVE | `1.tabRefIds.2` | "tab-11" |  |
| CHANGE | `1.tabs.1.tabRefId` | "tab-13" | "tab-11" |
| CHANGE | `1.tabs.1.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `1.tabs.1.isActive` | false | true |
| CHANGE | `1.tabs.1.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| REMOVE | `1.tabs.2` | {"tabRefId":"tab-11","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=5, time=2026-04-12T15:21:48.328Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 3 |
| CREATE | `2.tabLabels.2` |  | "vitest.config.ts" |
| CREATE | `2.tabRefIds.2` |  | "tab-19" |
| CREATE | `2.tabs.2` |  | {"tabRefId":"tab-19","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |

**[seq=6, time=2026-04-12T15:21:48.328Z] TAB v6 -> v7** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-14" | "tab-19" |
| CHANGE | `2.tabs.1.isActive` | true | false |
| CHANGE | `2.tabs.2.isActive` | false | true |

**[seq=7, time=2026-04-12T15:21:48.328Z] GROUP v7 -> v8** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-11" |
| CHANGE | `0.activeTabRefId` | "tab-10" | "tab-20" |
| CHANGE | `0.tabRefIds.0` | "tab-10" | "tab-20" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-10" | "tab-20" |
| CHANGE | `1.groupRefId` | "group-7" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-11" | "tab-21" |
| CHANGE | `1.tabRefIds.0` | "tab-12" | "tab-22" |
| CHANGE | `1.tabRefIds.1` | "tab-11" | "tab-21" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-12" | "tab-22" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-11" | "tab-21" |
| CHANGE | `2.groupRefId` | "group-8" | "group-13" |
| CHANGE | `2.activeTabRefId` | "tab-19" | "tab-23" |
| CHANGE | `2.tabRefIds.0` | "tab-15" | "tab-24" |
| CHANGE | `2.tabRefIds.1` | "tab-14" | "tab-25" |
| CHANGE | `2.tabRefIds.2` | "tab-19" | "tab-23" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-15" | "tab-24" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-14" | "tab-25" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-19" | "tab-23" |
| CHANGE | `3.groupRefId` | "group-9" | "group-14" |
| CHANGE | `3.activeTabRefId` | "tab-16" | "tab-26" |
| CHANGE | `3.tabRefIds.0` | "tab-17" | "tab-27" |
| CHANGE | `3.tabRefIds.1` | "tab-16" | "tab-26" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-17" | "tab-27" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-16" | "tab-26" |
| CHANGE | `4.groupRefId` | "group-10" | "group-15" |
| CHANGE | `4.activeTabRefId` | "tab-18" | "tab-28" |
| CHANGE | `4.tabRefIds.0` | "tab-18" | "tab-28" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-18" | "tab-28" |

**[seq=8, time=2026-04-12T15:21:48.330Z] TAB v8 -> v9** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-21" | "tab-22" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.1.isActive` | true | false |

**[seq=9, time=2026-04-12T15:21:48.330Z] GROUP v9 -> v10** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-16" |
| CHANGE | `0.activeTabRefId` | "tab-20" | "tab-29" |
| CHANGE | `0.tabRefIds.0` | "tab-20" | "tab-29" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-20" | "tab-29" |
| CHANGE | `1.groupRefId` | "group-12" | "group-17" |
| CHANGE | `1.activeTabRefId` | "tab-22" | "tab-30" |
| CHANGE | `1.tabRefIds.0` | "tab-22" | "tab-30" |
| CHANGE | `1.tabRefIds.1` | "tab-21" | "tab-31" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-22" | "tab-30" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-21" | "tab-31" |
| CHANGE | `2.groupRefId` | "group-13" | "group-18" |
| CHANGE | `2.activeTabRefId` | "tab-23" | "tab-32" |
| CHANGE | `2.tabRefIds.0` | "tab-24" | "tab-33" |
| CHANGE | `2.tabRefIds.1` | "tab-25" | "tab-34" |
| CHANGE | `2.tabRefIds.2` | "tab-23" | "tab-32" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-24" | "tab-33" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-25" | "tab-34" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-23" | "tab-32" |
| CHANGE | `3.groupRefId` | "group-14" | "group-19" |
| CHANGE | `3.activeTabRefId` | "tab-26" | "tab-35" |
| CHANGE | `3.tabRefIds.0` | "tab-27" | "tab-36" |
| CHANGE | `3.tabRefIds.1` | "tab-26" | "tab-35" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-27" | "tab-36" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-26" | "tab-35" |
| CHANGE | `4.groupRefId` | "group-15" | "group-20" |
| CHANGE | `4.activeTabRefId` | "tab-28" | "tab-37" |
| CHANGE | `4.tabRefIds.0` | "tab-28" | "tab-37" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-28" | "tab-37" |

**[seq=10, time=2026-04-12T15:21:48.330Z] TAB v10 -> v11** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| REMOVE | `1.tabLabels.1` | "vitest.config.ts" |  |
| REMOVE | `1.tabRefIds.1` | "tab-31" |  |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-31","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=11, time=2026-04-12T15:21:48.342Z] TAB v11 -> v12** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 2 | 3 |
| CREATE | `3.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `3.tabRefIds.2` |  | "tab-38" |
| CREATE | `3.tabs.2` |  | {"tabRefId":"tab-38","label":"tsconfig.json","kind":"text","viewColumn":4,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=12, time=2026-04-12T15:21:48.342Z] TAB v12 -> v13** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | "tab-35" | "tab-38" |
| CHANGE | `3.tabs.1.isActive` | true | false |
| CHANGE | `3.tabs.2.isActive` | false | true |

**[seq=13, time=2026-04-12T15:21:48.342Z] GROUP v13 -> v14** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-16" | "group-21" |
| CHANGE | `0.activeTabRefId` | "tab-29" | "tab-39" |
| CHANGE | `0.tabRefIds.0` | "tab-29" | "tab-39" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-29" | "tab-39" |
| CHANGE | `1.groupRefId` | "group-17" | "group-22" |
| CHANGE | `1.activeTabRefId` | "tab-30" | "tab-40" |
| CHANGE | `1.tabRefIds.0` | "tab-30" | "tab-40" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-30" | "tab-40" |
| CHANGE | `2.groupRefId` | "group-18" | "group-23" |
| CHANGE | `2.activeTabRefId` | "tab-32" | "tab-41" |
| CHANGE | `2.tabRefIds.0` | "tab-33" | "tab-42" |
| CHANGE | `2.tabRefIds.1` | "tab-34" | "tab-43" |
| CHANGE | `2.tabRefIds.2` | "tab-32" | "tab-41" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-33" | "tab-42" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-34" | "tab-43" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-32" | "tab-41" |
| CHANGE | `3.groupRefId` | "group-19" | "group-24" |
| CHANGE | `3.activeTabRefId` | "tab-38" | "tab-44" |
| CHANGE | `3.tabRefIds.0` | "tab-36" | "tab-45" |
| CHANGE | `3.tabRefIds.1` | "tab-35" | "tab-46" |
| CHANGE | `3.tabRefIds.2` | "tab-38" | "tab-44" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-36" | "tab-45" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-35" | "tab-46" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-38" | "tab-44" |
| CHANGE | `4.groupRefId` | "group-20" | "group-25" |
| CHANGE | `4.activeTabRefId` | "tab-37" | "tab-47" |
| CHANGE | `4.tabRefIds.0` | "tab-37" | "tab-47" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-37" | "tab-47" |

**[seq=14, time=2026-04-12T15:21:48.344Z] GROUP v14 -> v15** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.isActive` | true | false |
| CHANGE | `3.isActive` | false | true |

**[seq=15, time=2026-04-12T15:21:48.345Z] TAB v15 -> v16** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 3 | 2 |
| CHANGE | `2.tabLabels.1` | "tsconfig.json" | "vitest.config.ts" |
| REMOVE | `2.tabLabels.2` | "vitest.config.ts" |  |
| CHANGE | `2.tabRefIds.1` | "tab-43" | "tab-41" |
| REMOVE | `2.tabRefIds.2` | "tab-41" |  |
| CHANGE | `2.tabs.1.tabRefId` | "tab-43" | "tab-41" |
| CHANGE | `2.tabs.1.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `2.tabs.1.isActive` | false | true |
| CHANGE | `2.tabs.1.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| REMOVE | `2.tabs.2` | {"tabRefId":"tab-41","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=16, time=2026-04-12T15:21:48.359Z] TAB v16 -> v17** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 3 | 4 |
| CREATE | `3.tabLabels.3` |  | "vitest.config.ts" |
| CREATE | `3.tabRefIds.3` |  | "tab-48" |
| CREATE | `3.tabs.3` |  | {"tabRefId":"tab-48","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |

**[seq=17, time=2026-04-12T15:21:48.359Z] TAB v17 -> v18** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.activeTabRefId` | "tab-44" | "tab-48" |
| CHANGE | `3.tabs.2.isActive` | true | false |
| CHANGE | `3.tabs.3.isActive` | false | true |

**[seq=18, time=2026-04-12T15:21:48.359Z] GROUP v18 -> v19** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-21" | "group-26" |
| CHANGE | `0.activeTabRefId` | "tab-39" | "tab-49" |
| CHANGE | `0.tabRefIds.0` | "tab-39" | "tab-49" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-39" | "tab-49" |
| CHANGE | `1.groupRefId` | "group-22" | "group-27" |
| CHANGE | `1.activeTabRefId` | "tab-40" | "tab-50" |
| CHANGE | `1.tabRefIds.0` | "tab-40" | "tab-50" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-40" | "tab-50" |
| CHANGE | `2.groupRefId` | "group-23" | "group-28" |
| CHANGE | `2.activeTabRefId` | "tab-41" | "tab-51" |
| CHANGE | `2.tabRefIds.0` | "tab-42" | "tab-52" |
| CHANGE | `2.tabRefIds.1` | "tab-41" | "tab-51" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-42" | "tab-52" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-41" | "tab-51" |
| CHANGE | `3.groupRefId` | "group-24" | "group-29" |
| CHANGE | `3.activeTabRefId` | "tab-48" | "tab-53" |
| CHANGE | `3.tabRefIds.0` | "tab-45" | "tab-54" |
| CHANGE | `3.tabRefIds.1` | "tab-46" | "tab-55" |
| CHANGE | `3.tabRefIds.2` | "tab-44" | "tab-56" |
| CHANGE | `3.tabRefIds.3` | "tab-48" | "tab-53" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-45" | "tab-54" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-46" | "tab-55" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-44" | "tab-56" |
| CHANGE | `3.tabs.3.tabRefId` | "tab-48" | "tab-53" |
| CHANGE | `4.groupRefId` | "group-25" | "group-30" |
| CHANGE | `4.activeTabRefId` | "tab-47" | "tab-57" |
| CHANGE | `4.tabRefIds.0` | "tab-47" | "tab-57" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-47" | "tab-57" |

**[seq=19, time=2026-04-12T15:21:48.361Z] TAB v19 -> v20** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-51" | "tab-52" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.1.isActive` | true | false |

**[seq=20, time=2026-04-12T15:21:48.361Z] GROUP v20 -> v21** — 28 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-26" | "group-31" |
| CHANGE | `0.activeTabRefId` | "tab-49" | "tab-58" |
| CHANGE | `0.tabRefIds.0` | "tab-49" | "tab-58" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-49" | "tab-58" |
| CHANGE | `1.groupRefId` | "group-27" | "group-32" |
| CHANGE | `1.activeTabRefId` | "tab-50" | "tab-59" |
| CHANGE | `1.tabRefIds.0` | "tab-50" | "tab-59" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-50" | "tab-59" |
| CHANGE | `2.groupRefId` | "group-28" | "group-33" |
| CHANGE | `2.activeTabRefId` | "tab-52" | "tab-60" |
| CHANGE | `2.tabRefIds.0` | "tab-52" | "tab-60" |
| CHANGE | `2.tabRefIds.1` | "tab-51" | "tab-61" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-52" | "tab-60" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-51" | "tab-61" |
| CHANGE | `3.groupRefId` | "group-29" | "group-34" |
| CHANGE | `3.activeTabRefId` | "tab-53" | "tab-62" |
| CHANGE | `3.tabRefIds.0` | "tab-54" | "tab-63" |
| CHANGE | `3.tabRefIds.1` | "tab-55" | "tab-64" |
| CHANGE | `3.tabRefIds.2` | "tab-56" | "tab-65" |
| CHANGE | `3.tabRefIds.3` | "tab-53" | "tab-62" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-54" | "tab-63" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-55" | "tab-64" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-56" | "tab-65" |
| CHANGE | `3.tabs.3.tabRefId` | "tab-53" | "tab-62" |
| CHANGE | `4.groupRefId` | "group-30" | "group-35" |
| CHANGE | `4.activeTabRefId` | "tab-57" | "tab-66" |
| CHANGE | `4.tabRefIds.0` | "tab-57" | "tab-66" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-57" | "tab-66" |

**[seq=21, time=2026-04-12T15:21:48.361Z] TAB v21 -> v22** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 1 |
| REMOVE | `2.tabLabels.1` | "vitest.config.ts" |  |
| REMOVE | `2.tabRefIds.1` | "tab-61" |  |
| REMOVE | `2.tabs.1` | {"tabRefId":"tab-61","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

---
