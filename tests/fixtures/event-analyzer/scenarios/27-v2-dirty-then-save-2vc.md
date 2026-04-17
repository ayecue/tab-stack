# Scenario: V2: dirty then save (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## V2: dirty then save (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["temp-dirty-save-2.txt"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["temp-dirty-save-2.txt"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:37.275Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-1","label":"temp-dirty-save-2.txt","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":true,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tools/vscode-event-analyzer/output/temp-dirty-save-2.txt"}] |
| 1 | 2026-04-12T15:20:37.284Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-1","label":"temp-dirty-save-2.txt","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tools/vscode-event-analyzer/output/temp-dirty-save-2.txt"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:37.275Z] TAB v0 -> v1** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isDirty` | false | true |

**[seq=1, time=2026-04-12T15:20:37.284Z] TAB v1 -> v2** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabs.0.isDirty` | true | false |

---
