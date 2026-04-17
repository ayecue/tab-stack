# Scenario: W3: pin then unpin (3vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## W3: pin then unpin (3vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","LICENSE"]},{"viewColumn":3,"tabs":["CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["tsconfig.json","README.md","LICENSE"]},{"viewColumn":3,"tabs":["CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:44.293Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-2","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 1 | 2026-04-12T15:20:44.293Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-2","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":true,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 2 | 2026-04-12T15:20:44.295Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-2","label":"tsconfig.json","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:44.293Z] TAB v0 -> v1** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabLabels.0` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabLabels.1` | "tsconfig.json" | "README.md" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-2" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-3" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-2" |
| CHANGE | `1.tabs.0.label` | "README.md" | "tsconfig.json" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-3" |
| CHANGE | `1.tabs.1.label` | "tsconfig.json" | "README.md" |
| CHANGE | `1.tabs.1.isActive` | true | false |
| CHANGE | `1.tabs.1.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/README.md" |

**[seq=1, time=2026-04-12T15:20:44.293Z] TAB v1 -> v2** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabs.0.isPinned` | false | true |

**[seq=2, time=2026-04-12T15:20:44.295Z] TAB v2 -> v3** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabs.0.isPinned` | true | false |

---
