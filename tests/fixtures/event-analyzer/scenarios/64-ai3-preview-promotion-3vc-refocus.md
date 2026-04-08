# Scenario: AI3: preview promotion (3vc, refocus)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AI3: preview promotion (3vc, refocus)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json","package.json"]},{"viewColumn":3,"tabs":["LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json","package.json"]},{"viewColumn":3,"tabs":["LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 1
- **Observed events:** 1

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:43.289Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-2","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:43.289Z] TAB v0 -> v1** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabs.1.isPreview` | true | false |

---
