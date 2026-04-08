# Scenario: AN2: multi-tab same-group approximation (1vc-middle-triple-to-end)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AN2: multi-tab same-group approximation (1vc-middle-triple-to-end)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","LICENSE","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","CHANGELOG.md","webview.html","README.md","tsconfig.json","LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 12
- **Observed events:** 12

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:10.399Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-5","label":"LICENSE","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 1 | 2026-04-12T15:22:10.399Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-7","tabCount":6,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE","CHANGELOG.md","webview.html"],"tabRefIds":["tab-8","tab-9","tab-10","tab-7","tab-11","tab-12"]}] |
| 2 | 2026-04-12T15:22:10.610Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-7","label":"LICENSE","kind":"text","viewColumn":1,"index":4,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 3 | 2026-04-12T15:22:10.766Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-7","label":"LICENSE","kind":"text","viewColumn":1,"index":5,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |
| 4 | 2026-04-12T15:22:10.918Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-10","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 5 | 2026-04-12T15:22:10.919Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-13","tabCount":6,"tabLabels":["package.json","README.md","tsconfig.json","CHANGELOG.md","webview.html","LICENSE"],"tabRefIds":["tab-14","tab-15","tab-13","tab-16","tab-17","tab-18"]}] |
| 6 | 2026-04-12T15:22:11.131Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 7 | 2026-04-12T15:22:11.288Z | TAB | 7 | 8 |  |  | [{"tabRefId":"tab-13","label":"tsconfig.json","kind":"text","viewColumn":1,"index":4,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 8 | 2026-04-12T15:22:11.444Z | TAB | 8 | 9 |  |  | [{"tabRefId":"tab-15","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 9 | 2026-04-12T15:22:11.444Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":true,"activeTabRefId":"tab-19","tabCount":6,"tabLabels":["package.json","README.md","CHANGELOG.md","webview.html","tsconfig.json","LICENSE"],"tabRefIds":["tab-20","tab-19","tab-21","tab-22","tab-23","tab-24"]}] |
| 10 | 2026-04-12T15:22:11.659Z | TAB | 10 | 11 |  |  | [{"tabRefId":"tab-19","label":"README.md","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 11 | 2026-04-12T15:22:11.812Z | TAB | 11 | 12 |  |  | [{"tabRefId":"tab-19","label":"README.md","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:10.399Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.5.isActive` | true | false |

**[seq=1, time=2026-04-12T15:22:10.399Z] GROUP v1 -> v2** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-8" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-9" |
| CHANGE | `0.tabRefIds.2` | "tab-4" | "tab-10" |
| CHANGE | `0.tabRefIds.3` | "tab-5" | "tab-7" |
| CHANGE | `0.tabRefIds.4` | "tab-6" | "tab-11" |
| CHANGE | `0.tabRefIds.5` | "tab-1" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-8" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-9" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-4" | "tab-10" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-5" | "tab-7" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-6" | "tab-11" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-1" | "tab-12" |

**[seq=2, time=2026-04-12T15:22:10.610Z] TAB v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.3` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.4` | "CHANGELOG.md" | "LICENSE" |
| CHANGE | `0.tabRefIds.3` | "tab-7" | "tab-11" |
| CHANGE | `0.tabRefIds.4` | "tab-11" | "tab-7" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-7" | "tab-11" |
| CHANGE | `0.tabs.3.label` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `0.tabs.3.isActive` | true | false |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/LICENSE" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-11" | "tab-7" |
| CHANGE | `0.tabs.4.label` | "CHANGELOG.md" | "LICENSE" |
| CHANGE | `0.tabs.4.isActive` | false | true |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/LICENSE" |

**[seq=3, time=2026-04-12T15:22:10.766Z] TAB v3 -> v4** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.4` | "LICENSE" | "webview.html" |
| CHANGE | `0.tabLabels.5` | "webview.html" | "LICENSE" |
| CHANGE | `0.tabRefIds.4` | "tab-7" | "tab-12" |
| CHANGE | `0.tabRefIds.5` | "tab-12" | "tab-7" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-7" | "tab-12" |
| CHANGE | `0.tabs.4.label` | "LICENSE" | "webview.html" |
| CHANGE | `0.tabs.4.isActive` | true | false |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/LICENSE" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-12" | "tab-7" |
| CHANGE | `0.tabs.5.label` | "webview.html" | "LICENSE" |
| CHANGE | `0.tabs.5.isActive` | false | true |
| CHANGE | `0.tabs.5.uri` | "file:///workspace/webview.html" | "file:///workspace/LICENSE" |

**[seq=4, time=2026-04-12T15:22:10.918Z] TAB v4 -> v5** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-10" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.5.isActive` | true | false |

**[seq=5, time=2026-04-12T15:22:10.919Z] GROUP v5 -> v6** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-10" | "tab-13" |
| CHANGE | `0.tabRefIds.0` | "tab-8" | "tab-14" |
| CHANGE | `0.tabRefIds.1` | "tab-9" | "tab-15" |
| CHANGE | `0.tabRefIds.2` | "tab-10" | "tab-13" |
| CHANGE | `0.tabRefIds.3` | "tab-11" | "tab-16" |
| CHANGE | `0.tabRefIds.4` | "tab-12" | "tab-17" |
| CHANGE | `0.tabRefIds.5` | "tab-7" | "tab-18" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-8" | "tab-14" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-9" | "tab-15" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-10" | "tab-13" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-11" | "tab-16" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-12" | "tab-17" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-7" | "tab-18" |

**[seq=6, time=2026-04-12T15:22:11.131Z] TAB v6 -> v7** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.3` | "CHANGELOG.md" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.2` | "tab-13" | "tab-16" |
| CHANGE | `0.tabRefIds.3` | "tab-16" | "tab-13" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-13" | "tab-16" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "CHANGELOG.md" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-16" | "tab-13" |
| CHANGE | `0.tabs.3.label` | "CHANGELOG.md" | "tsconfig.json" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/tsconfig.json" |

**[seq=7, time=2026-04-12T15:22:11.288Z] TAB v7 -> v8** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.3` | "tsconfig.json" | "webview.html" |
| CHANGE | `0.tabLabels.4` | "webview.html" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.3` | "tab-13" | "tab-17" |
| CHANGE | `0.tabRefIds.4` | "tab-17" | "tab-13" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-13" | "tab-17" |
| CHANGE | `0.tabs.3.label` | "tsconfig.json" | "webview.html" |
| CHANGE | `0.tabs.3.isActive` | true | false |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-17" | "tab-13" |
| CHANGE | `0.tabs.4.label` | "webview.html" | "tsconfig.json" |
| CHANGE | `0.tabs.4.isActive` | false | true |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/webview.html" | "file:///workspace/tsconfig.json" |

**[seq=8, time=2026-04-12T15:22:11.444Z] TAB v8 -> v9** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-13" | "tab-15" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.4.isActive` | true | false |

**[seq=9, time=2026-04-12T15:22:11.444Z] GROUP v9 -> v10** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-15" | "tab-19" |
| CHANGE | `0.tabRefIds.0` | "tab-14" | "tab-20" |
| CHANGE | `0.tabRefIds.1` | "tab-15" | "tab-19" |
| CHANGE | `0.tabRefIds.2` | "tab-16" | "tab-21" |
| CHANGE | `0.tabRefIds.3` | "tab-17" | "tab-22" |
| CHANGE | `0.tabRefIds.4` | "tab-13" | "tab-23" |
| CHANGE | `0.tabRefIds.5` | "tab-18" | "tab-24" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-14" | "tab-20" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-15" | "tab-19" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-16" | "tab-21" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-17" | "tab-22" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-13" | "tab-23" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-18" | "tab-24" |

**[seq=10, time=2026-04-12T15:22:11.659Z] TAB v10 -> v11** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "README.md" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.2` | "CHANGELOG.md" | "README.md" |
| CHANGE | `0.tabRefIds.1` | "tab-19" | "tab-21" |
| CHANGE | `0.tabRefIds.2` | "tab-21" | "tab-19" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-19" | "tab-21" |
| CHANGE | `0.tabs.1.label` | "README.md" | "CHANGELOG.md" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-21" | "tab-19" |
| CHANGE | `0.tabs.2.label` | "CHANGELOG.md" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/README.md" |

**[seq=11, time=2026-04-12T15:22:11.812Z] TAB v11 -> v12** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "README.md" | "webview.html" |
| CHANGE | `0.tabLabels.3` | "webview.html" | "README.md" |
| CHANGE | `0.tabRefIds.2` | "tab-19" | "tab-22" |
| CHANGE | `0.tabRefIds.3` | "tab-22" | "tab-19" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-19" | "tab-22" |
| CHANGE | `0.tabs.2.label` | "README.md" | "webview.html" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/README.md" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-22" | "tab-19" |
| CHANGE | `0.tabs.3.label` | "webview.html" | "README.md" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/webview.html" | "file:///workspace/README.md" |

---
