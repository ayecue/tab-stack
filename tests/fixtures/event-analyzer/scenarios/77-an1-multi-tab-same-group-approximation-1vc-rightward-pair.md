# Scenario: AN1: multi-tab same-group approximation (1vc-rightward-pair)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AN1: multi-tab same-group approximation (1vc-rightward-pair)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json","LICENSE"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","LICENSE","README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 6
- **Observed events:** 6

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:07.948Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-4","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 1 | 2026-04-12T15:22:07.948Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-6","tab-7","tab-5","tab-8"]}] |
| 2 | 2026-04-12T15:22:08.164Z | TAB | 2 | 3 |  |  | [{"tabRefId":"tab-5","label":"tsconfig.json","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 3 | 2026-04-12T15:22:08.322Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 4 | 2026-04-12T15:22:08.322Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-9","tabCount":4,"tabLabels":["package.json","README.md","LICENSE","tsconfig.json"],"tabRefIds":["tab-10","tab-9","tab-11","tab-12"]}] |
| 5 | 2026-04-12T15:22:08.535Z | TAB | 5 | 6 |  |  | [{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":1,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:07.948Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.3.isActive` | true | false |

**[seq=1, time=2026-04-12T15:22:07.948Z] GROUP v1 -> v2** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-4" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-7" |
| CHANGE | `0.tabRefIds.2` | "tab-4" | "tab-5" |
| CHANGE | `0.tabRefIds.3` | "tab-1" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-7" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-4" | "tab-5" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-1" | "tab-8" |

**[seq=2, time=2026-04-12T15:22:08.164Z] TAB v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabLabels.3` | "LICENSE" | "tsconfig.json" |
| CHANGE | `0.tabRefIds.2` | "tab-5" | "tab-8" |
| CHANGE | `0.tabRefIds.3` | "tab-8" | "tab-5" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-5" | "tab-8" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabs.2.isActive` | true | false |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/LICENSE" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-8" | "tab-5" |
| CHANGE | `0.tabs.3.label` | "LICENSE" | "tsconfig.json" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/LICENSE" | "file:///workspace/tsconfig.json" |

**[seq=3, time=2026-04-12T15:22:08.322Z] TAB v3 -> v4** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-7" |
| CHANGE | `0.tabs.1.isActive` | false | true |
| CHANGE | `0.tabs.3.isActive` | true | false |

**[seq=4, time=2026-04-12T15:22:08.322Z] GROUP v4 -> v5** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-7" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-10" |
| CHANGE | `0.tabRefIds.1` | "tab-7" | "tab-9" |
| CHANGE | `0.tabRefIds.2` | "tab-8" | "tab-11" |
| CHANGE | `0.tabRefIds.3` | "tab-5" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-10" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-7" | "tab-9" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-8" | "tab-11" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-5" | "tab-12" |

**[seq=5, time=2026-04-12T15:22:08.535Z] TAB v5 -> v6** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.1` | "README.md" | "LICENSE" |
| CHANGE | `0.tabLabels.2` | "LICENSE" | "README.md" |
| CHANGE | `0.tabRefIds.1` | "tab-9" | "tab-11" |
| CHANGE | `0.tabRefIds.2` | "tab-11" | "tab-9" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-9" | "tab-11" |
| CHANGE | `0.tabs.1.label` | "README.md" | "LICENSE" |
| CHANGE | `0.tabs.1.isActive` | true | false |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/LICENSE" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-11" | "tab-9" |
| CHANGE | `0.tabs.2.label` | "LICENSE" | "README.md" |
| CHANGE | `0.tabs.2.isActive` | false | true |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/LICENSE" | "file:///workspace/README.md" |

---
