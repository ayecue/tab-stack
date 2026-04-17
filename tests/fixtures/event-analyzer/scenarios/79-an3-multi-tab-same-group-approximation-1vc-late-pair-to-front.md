# Scenario: AN3: multi-tab same-group approximation (1vc-late-pair-to-front)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AN3: multi-tab same-group approximation (1vc-late-pair-to-front)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","LICENSE","CHANGELOG.md","webview.html","webview.css","vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["CHANGELOG.md","webview.html","package.json","README.md","tsconfig.json","LICENSE","webview.css","vitest.config.ts"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 12
- **Observed events:** 12

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:13.706Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-6","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":4,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 1 | 2026-04-12T15:22:13.706Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-9","tabCount":8,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE","CHANGELOG.md","webview.html","webview.css","vitest.config.ts"],"tabRefIds":["tab-10","tab-11","tab-12","tab-13","tab-9","tab-14","tab-15","tab-16"]}] |
| 2 | 2026-04-12T15:22:13.921Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-9","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 3 | 2026-04-12T15:22:14.072Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-9","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 4 | 2026-04-12T15:22:14.224Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-9","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 5 | 2026-04-12T15:22:14.380Z | TAB | 5 | 6 |  |  | [{"tabRefId":"tab-9","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |
| 6 | 2026-04-12T15:22:14.536Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-14","label":"webview.html","kind":"text","viewColumn":1,"index":5,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |
| 7 | 2026-04-12T15:22:14.537Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-17","tabCount":8,"tabLabels":["CHANGELOG.md","package.json","README.md","tsconfig.json","LICENSE","webview.html","webview.css","vitest.config.ts"],"tabRefIds":["tab-18","tab-19","tab-20","tab-21","tab-22","tab-17","tab-23","tab-24"]}] |
| 8 | 2026-04-12T15:22:14.747Z | TAB | 8 | 9 |  |  | [{"tabRefId":"tab-17","label":"webview.html","kind":"text","viewColumn":1,"index":4,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |
| 9 | 2026-04-12T15:22:14.903Z | TAB | 9 | 10 |  |  | [{"tabRefId":"tab-17","label":"webview.html","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |
| 10 | 2026-04-12T15:22:15.058Z | TAB | 10 | 11 |  |  | [{"tabRefId":"tab-17","label":"webview.html","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |
| 11 | 2026-04-12T15:22:15.209Z | TAB | 11 | 12 |  |  | [{"tabRefId":"tab-17","label":"webview.html","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:13.706Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.4.isActive` | false | true |
| CHANGE | `0.tabs.7.isActive` | true | false |

**[seq=1, time=2026-04-12T15:22:13.706Z] GROUP v1 -> v2** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-10" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-11" |
| CHANGE | `0.tabRefIds.2` | "tab-4" | "tab-12" |
| CHANGE | `0.tabRefIds.3` | "tab-5" | "tab-13" |
| CHANGE | `0.tabRefIds.4` | "tab-6" | "tab-9" |
| CHANGE | `0.tabRefIds.5` | "tab-7" | "tab-14" |
| CHANGE | `0.tabRefIds.6` | "tab-8" | "tab-15" |
| CHANGE | `0.tabRefIds.7` | "tab-1" | "tab-16" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-10" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-11" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-4" | "tab-12" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-5" | "tab-13" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-6" | "tab-9" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-7" | "tab-14" |
| CHANGE | `0.tabs.6.tabRefId` | "tab-8" | "tab-15" |
| CHANGE | `0.tabs.7.tabRefId` | "tab-1" | "tab-16" |

**[seq=2, time=2026-04-12T15:22:13.921Z] TAB v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.3` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.4` | "CHANGELOG.md" | "LICENSE" |
| CHANGE | `0.tabRefIds.3` | "tab-13" | "tab-9" |
| CHANGE | `0.tabRefIds.4` | "tab-9" | "tab-13" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-13" | "tab-9" |
| CHANGE | `0.tabs.3.label` | "LICENSE" | "CHANGELOG.md" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/LICENSE" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-9" | "tab-13" |
| CHANGE | `0.tabs.4.label` | "CHANGELOG.md" | "LICENSE" |
| CHANGE | `0.tabs.4.isActive` | true | false |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/LICENSE" |

**[seq=3, time=2026-04-12T15:22:14.072Z] TAB v3 -> v4** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.3` | "CHANGELOG.md" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.2` | "tab-12" | "tab-9" |
| CHANGE | `0.tabRefIds.3` | "tab-9" | "tab-12" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-12" | "tab-9" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "CHANGELOG.md" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-9" | "tab-12" |
| CHANGE | `0.tabs.3.label` | "CHANGELOG.md" | "tsconfig.json" |
| CHANGE | `0.tabs.3.isActive` | true | false |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/tsconfig.json" |

**[seq=4, time=2026-04-12T15:22:14.224Z] TAB v4 -> v5** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "README.md" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.2` | "CHANGELOG.md" | "README.md" |
| CHANGE | `0.tabRefIds.1` | "tab-11" | "tab-9" |
| CHANGE | `0.tabRefIds.2` | "tab-9" | "tab-11" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-11" | "tab-9" |
| CHANGE | `0.tabs.1.label` | "README.md" | "CHANGELOG.md" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-9" | "tab-11" |
| CHANGE | `0.tabs.2.label` | "CHANGELOG.md" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/README.md" |

**[seq=5, time=2026-04-12T15:22:14.380Z] TAB v5 -> v6** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.0` | "package.json" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.1` | "CHANGELOG.md" | "package.json" |
| CHANGE | `0.tabRefIds.0` | "tab-10" | "tab-9" |
| CHANGE | `0.tabRefIds.1` | "tab-9" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-10" | "tab-9" |
| CHANGE | `0.tabs.0.label` | "package.json" | "CHANGELOG.md" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-9" | "tab-10" |
| CHANGE | `0.tabs.1.label` | "CHANGELOG.md" | "package.json" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/package.json" |

**[seq=6, time=2026-04-12T15:22:14.536Z] TAB v6 -> v7** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-9" | "tab-14" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `0.tabs.5.isActive` | false | true |

**[seq=7, time=2026-04-12T15:22:14.537Z] GROUP v7 -> v8** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-14" | "tab-17" |
| CHANGE | `0.tabRefIds.0` | "tab-9" | "tab-18" |
| CHANGE | `0.tabRefIds.1` | "tab-10" | "tab-19" |
| CHANGE | `0.tabRefIds.2` | "tab-11" | "tab-20" |
| CHANGE | `0.tabRefIds.3` | "tab-12" | "tab-21" |
| CHANGE | `0.tabRefIds.4` | "tab-13" | "tab-22" |
| CHANGE | `0.tabRefIds.5` | "tab-14" | "tab-17" |
| CHANGE | `0.tabRefIds.6` | "tab-15" | "tab-23" |
| CHANGE | `0.tabRefIds.7` | "tab-16" | "tab-24" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-9" | "tab-18" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-10" | "tab-19" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-11" | "tab-20" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-12" | "tab-21" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-13" | "tab-22" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-14" | "tab-17" |
| CHANGE | `0.tabs.6.tabRefId` | "tab-15" | "tab-23" |
| CHANGE | `0.tabs.7.tabRefId` | "tab-16" | "tab-24" |

**[seq=8, time=2026-04-12T15:22:14.747Z] TAB v8 -> v9** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.4` | "LICENSE" | "webview.html" |
| CHANGE | `0.tabLabels.5` | "webview.html" | "LICENSE" |
| CHANGE | `0.tabRefIds.4` | "tab-22" | "tab-17" |
| CHANGE | `0.tabRefIds.5` | "tab-17" | "tab-22" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-22" | "tab-17" |
| CHANGE | `0.tabs.4.label` | "LICENSE" | "webview.html" |
| CHANGE | `0.tabs.4.isActive` | false | true |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/LICENSE" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-17" | "tab-22" |
| CHANGE | `0.tabs.5.label` | "webview.html" | "LICENSE" |
| CHANGE | `0.tabs.5.isActive` | true | false |
| CHANGE | `0.tabs.5.uri` | "file:///workspace/webview.html" | "file:///workspace/LICENSE" |

**[seq=9, time=2026-04-12T15:22:14.903Z] TAB v9 -> v10** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.3` | "tsconfig.json" | "webview.html" |
| CHANGE | `0.tabLabels.4` | "webview.html" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.3` | "tab-21" | "tab-17" |
| CHANGE | `0.tabRefIds.4` | "tab-17" | "tab-21" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-21" | "tab-17" |
| CHANGE | `0.tabs.3.label` | "tsconfig.json" | "webview.html" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-17" | "tab-21" |
| CHANGE | `0.tabs.4.label` | "webview.html" | "tsconfig.json" |
| CHANGE | `0.tabs.4.isActive` | true | false |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/webview.html" | "file:///workspace/tsconfig.json" |

**[seq=10, time=2026-04-12T15:22:15.058Z] TAB v10 -> v11** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "README.md" | "webview.html" |
| CHANGE | `0.tabLabels.3` | "webview.html" | "README.md" |
| CHANGE | `0.tabRefIds.2` | "tab-20" | "tab-17" |
| CHANGE | `0.tabRefIds.3` | "tab-17" | "tab-20" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-20" | "tab-17" |
| CHANGE | `0.tabs.2.label` | "README.md" | "webview.html" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/README.md" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-17" | "tab-20" |
| CHANGE | `0.tabs.3.label` | "webview.html" | "README.md" |
| CHANGE | `0.tabs.3.isActive` | true | false |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/webview.html" | "file:///workspace/README.md" |

**[seq=11, time=2026-04-12T15:22:15.209Z] TAB v11 -> v12** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "package.json" | "webview.html" |
| CHANGE | `0.tabLabels.2` | "webview.html" | "package.json" |
| CHANGE | `0.tabRefIds.1` | "tab-19" | "tab-17" |
| CHANGE | `0.tabRefIds.2` | "tab-17" | "tab-19" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-19" | "tab-17" |
| CHANGE | `0.tabs.1.label` | "package.json" | "webview.html" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/package.json" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-17" | "tab-19" |
| CHANGE | `0.tabs.2.label` | "webview.html" | "package.json" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/webview.html" | "file:///workspace/package.json" |

---
