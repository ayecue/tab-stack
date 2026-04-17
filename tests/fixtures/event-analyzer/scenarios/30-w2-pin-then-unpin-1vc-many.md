# Scenario: W2: pin then unpin (1vc-many)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## W2: pin then unpin (1vc-many)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","vitest.config.ts","LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["tsconfig.json","package.json","README.md","vitest.config.ts","LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:42.538Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 1 | 2026-04-12T15:20:42.538Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":true,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 2 | 2026-04-12T15:20:42.540Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-1","label":"tsconfig.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:42.538Z] TAB v0 -> v1** — 17 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.0` | "package.json" | "tsconfig.json" |
| CHANGE | `0.tabLabels.1` | "README.md" | "package.json" |
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "README.md" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-1" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-2" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-1" |
| CHANGE | `0.tabs.0.label` | "package.json" | "tsconfig.json" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/tsconfig.json" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-2" |
| CHANGE | `0.tabs.1.label` | "README.md" | "package.json" |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/package.json" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-3" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/README.md" |

**[seq=1, time=2026-04-12T15:20:42.538Z] TAB v1 -> v2** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isPinned` | false | true |

**[seq=2, time=2026-04-12T15:20:42.540Z] TAB v2 -> v3** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isPinned` | true | false |

---
