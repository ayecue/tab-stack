# Scenario: AO: rightward multi-step reorder

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AO: rightward multi-step reorder

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","LICENSE","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md","LICENSE","CHANGELOG.md","webview.html","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:17.277Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 1 | 2026-04-12T15:22:17.433Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":4,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 2 | 2026-04-12T15:22:17.589Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":5,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:17.277Z] TAB v0 -> v1** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabLabels.3` | "LICENSE" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.3` | "tab-4" | "tab-1" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/LICENSE" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-4" | "tab-1" |
| CHANGE | `0.tabs.3.label` | "LICENSE" | "tsconfig.json" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/LICENSE" | "file:///workspace/tsconfig.json" |

**[seq=1, time=2026-04-12T15:22:17.433Z] TAB v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.3` | "tsconfig.json" | "CHANGELOG.md" |
| CHANGE | `0.tabLabels.4` | "CHANGELOG.md" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.3` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.4` | "tab-5" | "tab-1" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.3.label` | "tsconfig.json" | "CHANGELOG.md" |
| CHANGE | `0.tabs.3.isActive` | true | false |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-5" | "tab-1" |
| CHANGE | `0.tabs.4.label` | "CHANGELOG.md" | "tsconfig.json" |
| CHANGE | `0.tabs.4.isActive` | false | true |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/tsconfig.json" |

**[seq=2, time=2026-04-12T15:22:17.589Z] TAB v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.4` | "tsconfig.json" | "webview.html" |
| CHANGE | `0.tabLabels.5` | "webview.html" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.4` | "tab-1" | "tab-6" |
| CHANGE | `0.tabRefIds.5` | "tab-6" | "tab-1" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-1" | "tab-6" |
| CHANGE | `0.tabs.4.label` | "tsconfig.json" | "webview.html" |
| CHANGE | `0.tabs.4.isActive` | true | false |
| CHANGE | `0.tabs.4.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/webview.html" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-6" | "tab-1" |
| CHANGE | `0.tabs.5.label` | "webview.html" | "tsconfig.json" |
| CHANGE | `0.tabs.5.isActive` | false | true |
| CHANGE | `0.tabs.5.uri` | "file:///workspace/webview.html" | "file:///workspace/tsconfig.json" |

---
