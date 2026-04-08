# Scenario: AH1: activate different tab (2vc, active group)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AH1: activate different tab (2vc, active group)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","LICENSE"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:36.710Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-3","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 1 | 2026-04-12T15:21:36.710Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":false,"activeTabRefId":"tab-5","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-5"]},{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-6","tabCount":3,"tabLabels":["README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-6","tab-7","tab-8"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:36.710Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-3" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.1.isActive` | true | false |

**[seq=1, time=2026-04-12T15:21:36.710Z] GROUP v1 -> v2** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-6" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-6" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-7" |
| CHANGE | `1.tabRefIds.2` | "tab-4" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-6" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-7" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-4" | "tab-8" |

---
