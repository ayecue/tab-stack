# Scenario: V3: dirty then save (4vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## V3: dirty then save (4vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","temp-dirty-save-3.txt"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","temp-dirty-save-3.txt"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:20:39.122Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-2","label":"temp-dirty-save-3.txt","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":true,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tools/vscode-event-analyzer/output/temp-dirty-save-3.txt"}] |
| 1 | 2026-04-12T15:20:39.130Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-2","label":"temp-dirty-save-3.txt","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tools/vscode-event-analyzer/output/temp-dirty-save-3.txt"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:20:39.122Z] TAB v0 -> v1** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabs.1.isDirty` | false | true |

**[seq=1, time=2026-04-12T15:20:39.130Z] TAB v1 -> v2** — 1 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabs.1.isDirty` | true | false |

---
