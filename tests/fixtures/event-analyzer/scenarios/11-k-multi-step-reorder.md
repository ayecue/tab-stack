# Scenario: K: multi-step reorder

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## K: multi-step reorder

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","vitest.config.ts"]}]
- **After:** [{"viewColumn":1,"tabs":["vitest.config.ts","package.json","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:06.653Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 1 | 2026-04-12T15:20:06.860Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-1","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 2 | 2026-04-12T15:20:07.067Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-1","label":"vitest.config.ts","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:06.653Z] TAB v0 -> v1** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `0.tabLabels.3` | "vitest.config.ts" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.2` | "tab-4" | "tab-1" |
| CHANGE | `0.tabRefIds.3` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-4" | "tab-1" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.3.label` | "vitest.config.ts" | "tsconfig.json" |
| CHANGE | `0.tabs.3.isActive` | true | false |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/vitest.config.ts" | "file:///workspace/tsconfig.json" |

**[seq=1, time=2026-04-12T15:20:06.860Z] TAB v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "README.md" | "vitest.config.ts" |
| CHANGE | `0.tabLabels.2` | "vitest.config.ts" | "README.md" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-1" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-1" |
| CHANGE | `0.tabs.1.label` | "README.md" | "vitest.config.ts" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/vitest.config.ts" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.2.label` | "vitest.config.ts" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/vitest.config.ts" | "file:///workspace/README.md" |

**[seq=2, time=2026-04-12T15:20:07.067Z] TAB v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.0` | "package.json" | "vitest.config.ts" |
| CHANGE | `0.tabLabels.1` | "vitest.config.ts" | "package.json" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-1" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-1" |
| CHANGE | `0.tabs.0.label` | "package.json" | "vitest.config.ts" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/vitest.config.ts" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.1.label` | "vitest.config.ts" | "package.json" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/vitest.config.ts" | "file:///workspace/package.json" |

---
