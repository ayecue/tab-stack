# Scenario: T1: close other tabs (1vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## T1: close other tabs (1vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:24.506Z | TAB | 0 | 1 |  | [{"tabRefId":"tab-2","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 1 | 2026-04-12T15:20:24.506Z | TAB | 1 | 2 |  | [{"tabRefId":"tab-3","label":"tsconfig.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 2 | 2026-04-12T15:20:24.506Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:24.506Z] TAB v0 -> v1** — 21 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 4 | 3 |
| CHANGE | `0.tabLabels.0` | "package.json" | "README.md" |
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "vitest.config.ts" |
| REMOVE | `0.tabLabels.3` | "vitest.config.ts" |  |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-1" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-3" |
| CHANGE | `0.tabRefIds.2` | "tab-3" | "tab-4" |
| REMOVE | `0.tabRefIds.3` | "tab-4" |  |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-1" |
| CHANGE | `0.tabs.0.label` | "package.json" | "README.md" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/README.md" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-3" | "tab-4" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| REMOVE | `0.tabs.3` | {"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=1, time=2026-04-12T15:20:24.506Z] TAB v1 -> v2** — 9 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 3 | 2 |
| CHANGE | `0.tabLabels.1` | "tsconfig.json" | "vitest.config.ts" |
| REMOVE | `0.tabLabels.2` | "vitest.config.ts" |  |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-4" |
| REMOVE | `0.tabRefIds.2` | "tab-4" |  |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-4" |
| CHANGE | `0.tabs.1.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| REMOVE | `0.tabs.2` | {"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

**[seq=2, time=2026-04-12T15:20:24.506Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| REMOVE | `0.tabLabels.1` | "vitest.config.ts" |  |
| REMOVE | `0.tabRefIds.1` | "tab-4" |  |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-4","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

---
