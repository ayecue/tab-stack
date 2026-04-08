# Scenario: Y3: close group (5vc, 3 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## Y3: close group (5vc, 3 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["vitest.config.ts","LICENSE","CHANGELOG.md"]},{"viewColumn":5,"tabs":["webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]},{"viewColumn":3,"tabs":["tsconfig.json"]},{"viewColumn":4,"tabs":["webview.html"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 7
- **Observed events:** 7

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:54.516Z | TAB | 0 | 1 |  | [{"tabRefId":"tab-5","label":"vitest.config.ts","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |
| 1 | 2026-04-12T15:20:54.516Z | TAB | 1 | 2 |  | [{"tabRefId":"tab-6","label":"LICENSE","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |
| 2 | 2026-04-12T15:20:54.518Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-1","viewColumn":1,"isActive":true,"activeTabRefId":"tab-1","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-1"]}] |
| 3 | 2026-04-12T15:20:54.520Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":true,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-8"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-9","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-9"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-11"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-12"]}] |
| 4 | 2026-04-12T15:20:54.520Z | TAB | 4 | 5 |  | [{"tabRefId":"tab-11","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |
| 5 | 2026-04-12T15:20:54.555Z | GROUP | 5 | 6 |  | [{"groupRefId":"group-9","viewColumn":4,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-11","viewColumn":1,"isActive":true,"activeTabRefId":"tab-13","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-13"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-14","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-14"]},{"groupRefId":"group-13","viewColumn":3,"isActive":false,"activeTabRefId":"tab-15","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-15"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":"tab-16","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-16"]}] |
| 6 | 2026-04-12T15:20:54.556Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-15","viewColumn":1,"isActive":true,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-17"]},{"groupRefId":"group-16","viewColumn":2,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-18"]},{"groupRefId":"group-17","viewColumn":3,"isActive":false,"activeTabRefId":"tab-19","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-19"]},{"groupRefId":"group-18","viewColumn":4,"isActive":false,"activeTabRefId":"tab-20","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-20"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:54.516Z] TAB v0 -> v1** — 15 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 3 | 2 |
| CHANGE | `3.tabLabels.0` | "vitest.config.ts" | "LICENSE" |
| CHANGE | `3.tabLabels.1` | "LICENSE" | "CHANGELOG.md" |
| REMOVE | `3.tabLabels.2` | "CHANGELOG.md" |  |
| CHANGE | `3.tabRefIds.0` | "tab-5" | "tab-6" |
| CHANGE | `3.tabRefIds.1` | "tab-6" | "tab-4" |
| REMOVE | `3.tabRefIds.2` | "tab-4" |  |
| CHANGE | `3.tabs.0.tabRefId` | "tab-5" | "tab-6" |
| CHANGE | `3.tabs.0.label` | "vitest.config.ts" | "LICENSE" |
| CHANGE | `3.tabs.0.uri` | "file:///workspace/vitest.config.ts" | "file:///workspace/LICENSE" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-6" | "tab-4" |
| CHANGE | `3.tabs.1.label` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `3.tabs.1.isActive` | false | true |
| CHANGE | `3.tabs.1.uri` | "file:///workspace/LICENSE" | "file:///workspace/CHANGELOG.md" |
| REMOVE | `3.tabs.2` | {"tabRefId":"tab-4","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=1, time=2026-04-12T15:20:54.516Z] TAB v1 -> v2** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 2 | 1 |
| CHANGE | `3.tabLabels.0` | "LICENSE" | "CHANGELOG.md" |
| REMOVE | `3.tabLabels.1` | "CHANGELOG.md" |  |
| CHANGE | `3.tabRefIds.0` | "tab-6" | "tab-4" |
| REMOVE | `3.tabRefIds.1` | "tab-4" |  |
| CHANGE | `3.tabs.0.tabRefId` | "tab-6" | "tab-4" |
| CHANGE | `3.tabs.0.label` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `3.tabs.0.isActive` | false | true |
| CHANGE | `3.tabs.0.uri` | "file:///workspace/LICENSE" | "file:///workspace/CHANGELOG.md" |
| REMOVE | `3.tabs.1` | {"tabRefId":"tab-4","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=2, time=2026-04-12T15:20:54.518Z] GROUP v2 -> v3** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | false | true |
| CHANGE | `3.isActive` | true | false |

**[seq=3, time=2026-04-12T15:20:54.520Z] GROUP v3 -> v4** — 21 change(s)

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
| CHANGE | `3.activeTabRefId` | "tab-4" | null |
| CHANGE | `3.tabRefIds.0` | "tab-4" | "tab-11" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-4" | "tab-11" |
| CHANGE | `3.tabs.0.isActive` | true | false |
| CHANGE | `4.groupRefId` | "group-5" | "group-10" |
| CHANGE | `4.activeTabRefId` | "tab-7" | "tab-12" |
| CHANGE | `4.tabRefIds.0` | "tab-7" | "tab-12" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-7" | "tab-12" |

**[seq=4, time=2026-04-12T15:20:54.520Z] TAB v4 -> v5** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 0 |
| REMOVE | `3.tabLabels.0` | "CHANGELOG.md" |  |
| REMOVE | `3.tabRefIds.0` | "tab-11" |  |
| REMOVE | `3.tabs.0` | {"tabRefId":"tab-11","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |  |

**[seq=5, time=2026-04-12T15:20:54.555Z] GROUP v5 -> v6** — 19 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-11" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-13" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-13" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.groupRefId` | "group-7" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-9" | "tab-14" |
| CHANGE | `1.tabRefIds.0` | "tab-9" | "tab-14" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-9" | "tab-14" |
| CHANGE | `2.groupRefId` | "group-8" | "group-13" |
| CHANGE | `2.activeTabRefId` | "tab-10" | "tab-15" |
| CHANGE | `2.tabRefIds.0` | "tab-10" | "tab-15" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-10" | "tab-15" |
| CHANGE | `3.groupRefId` | "group-9" | "group-14" |
| CHANGE | `3.activeTabRefId` | null | "tab-16" |
| CHANGE | `3.tabCount` | 0 | 1 |
| CREATE | `3.tabLabels.0` |  | "webview.html" |
| CREATE | `3.tabRefIds.0` |  | "tab-16" |
| CREATE | `3.tabs.0` |  | {"tabRefId":"tab-16","label":"webview.html","kind":"text","viewColumn":4,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |
| REMOVE | `4` | {"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-12"],"tabs":[{"tabRefId":"tab-12","label":"webview.html","kind":"text","viewColumn":5,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}]} |  |

**[seq=6, time=2026-04-12T15:20:54.556Z] GROUP v6 -> v7** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-15" |
| CHANGE | `0.activeTabRefId` | "tab-13" | "tab-17" |
| CHANGE | `0.tabRefIds.0` | "tab-13" | "tab-17" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-13" | "tab-17" |
| CHANGE | `1.groupRefId` | "group-12" | "group-16" |
| CHANGE | `1.activeTabRefId` | "tab-14" | "tab-18" |
| CHANGE | `1.tabRefIds.0` | "tab-14" | "tab-18" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-14" | "tab-18" |
| CHANGE | `2.groupRefId` | "group-13" | "group-17" |
| CHANGE | `2.activeTabRefId` | "tab-15" | "tab-19" |
| CHANGE | `2.tabRefIds.0` | "tab-15" | "tab-19" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-15" | "tab-19" |
| CHANGE | `3.groupRefId` | "group-14" | "group-18" |
| CHANGE | `3.activeTabRefId` | "tab-16" | "tab-20" |
| CHANGE | `3.tabRefIds.0` | "tab-16" | "tab-20" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-16" | "tab-20" |

---
