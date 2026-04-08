# Scenario: F: pin a tab

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## F: pin a tab

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 1
- **Observed events:** 1

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:19:59.990Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":true,"isPreview":false,"uri":"file:///workspace/package.json"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:19:59.990Z] TAB v0 -> v1** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isPinned` | false | true |

---
