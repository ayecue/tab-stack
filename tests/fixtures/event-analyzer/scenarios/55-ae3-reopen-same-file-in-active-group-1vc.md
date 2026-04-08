# Scenario: AE3: reopen same file in active group (1vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AE3: reopen same file in active group (1vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:27.832Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-2","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 1 | 2026-04-12T15:21:27.832Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-4","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-5","tab-4","tab-6"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:27.832Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-2" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `0.tabs.1.isActive` | false | true |

**[seq=1, time=2026-04-12T15:21:27.832Z] GROUP v1 -> v2** — 8 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-2" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.1` | "tab-2" | "tab-4" |
| CHANGE | `0.tabRefIds.2` | "tab-3" | "tab-6" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-2" | "tab-4" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-3" | "tab-6" |

---
