# Scenario: V1: dirty then save (1vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## V1: dirty then save (1vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["temp-dirty-save-1.txt"]}]
- **After:** [{"viewColumn":1,"tabs":["temp-dirty-save-1.txt"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:35.579Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"temp-dirty-save-1.txt","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":true,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tools/vscode-event-analyzer/output/temp-dirty-save-1.txt"}] |
| 1 | 2026-04-12T15:20:35.590Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-1","label":"temp-dirty-save-1.txt","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tools/vscode-event-analyzer/output/temp-dirty-save-1.txt"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:35.579Z] TAB v0 -> v1** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isDirty` | false | true |

**[seq=1, time=2026-04-12T15:20:35.590Z] TAB v1 -> v2** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isDirty` | true | false |

---
