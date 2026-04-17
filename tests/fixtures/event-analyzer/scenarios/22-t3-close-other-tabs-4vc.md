# Scenario: T3: close other tabs (4vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## T3: close other tabs (4vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","vitest.config.ts"]},{"viewColumn":3,"tabs":["LICENSE","CHANGELOG.md"]},{"viewColumn":4,"tabs":["webview.html","webview.css"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE","CHANGELOG.md"]},{"viewColumn":4,"tabs":["webview.html","webview.css"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:28.131Z | TAB | 0 | 1 |  | [{"tabRefId":"tab-3","label":"README.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 1 | 2026-04-12T15:20:28.131Z | TAB | 1 | 2 |  | [{"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:28.131Z] TAB v0 -> v1** — 16 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 2 |
| CHANGE | `1.tabLabels.0` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabLabels.1` | "tsconfig.json" | "vitest.config.ts" |
| REMOVE | `1.tabLabels.2` | "vitest.config.ts" |  |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-2" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-4" |
| REMOVE | `1.tabRefIds.2` | "tab-4" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-2" |
| CHANGE | `1.tabs.0.label` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-4" |
| CHANGE | `1.tabs.1.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `1.tabs.1.isActive` | true | false |
| CHANGE | `1.tabs.1.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| REMOVE | `1.tabs.2` | {"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=1, time=2026-04-12T15:20:28.131Z] TAB v1 -> v2** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| REMOVE | `1.tabLabels.1` | "vitest.config.ts" |  |
| REMOVE | `1.tabRefIds.1` | "tab-4" |  |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

---
