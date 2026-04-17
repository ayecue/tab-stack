# Scenario: AL1: multi-tab split approximation (1vc, 2 tabs)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AL1: multi-tab split approximation (1vc, 2 tabs)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json","README.md","tsconfig.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:56.053Z | GROUP | 0 | 1 | [{"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |  | [{"groupRefId":"group-2","viewColumn":1,"isActive":true,"activeTabRefId":"tab-4","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-5","tab-6","tab-4"]}] |
| 1 | 2026-04-12T15:21:56.054Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-3","viewColumn":2,"isActive":true,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] |
| 2 | 2026-04-12T15:21:56.059Z | TAB | 2 | 3 | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 3 | 2026-04-12T15:21:56.061Z | TAB | 3 | 4 |  |  | [{"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 4 | 2026-04-12T15:21:56.061Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-9","tab-10","tab-8"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-11"]}] |
| 5 | 2026-04-12T15:21:56.075Z | TAB | 5 | 6 | [{"tabRefId":"tab-12","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 6 | 2026-04-12T15:21:56.076Z | TAB | 6 | 7 |  |  | [{"tabRefId":"tab-12","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |
| 7 | 2026-04-12T15:21:56.076Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":"tab-13","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-14","tab-15","tab-13"]},{"groupRefId":"group-7","viewColumn":2,"isActive":true,"activeTabRefId":"tab-16","tabCount":2,"tabLabels":["README.md","tsconfig.json"],"tabRefIds":["tab-17","tab-16"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:56.053Z] GROUP v0 -> v1** — 9 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-2" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-5" |
| CHANGE | `0.tabRefIds.1` | "tab-3" | "tab-6" |
| CHANGE | `0.tabRefIds.2` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-5" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-3" | "tab-6" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-1" | "tab-4" |
| CREATE | `1` |  | {"groupRefId":"group-3","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |

**[seq=1, time=2026-04-12T15:21:56.054Z] GROUP v1 -> v2** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:56.059Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 0 | 1 |
| CREATE | `1.tabLabels.0` |  | "README.md" |
| CREATE | `1.tabRefIds.0` |  | "tab-7" |
| CREATE | `1.tabs.0` |  | {"tabRefId":"tab-7","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=3, time=2026-04-12T15:21:56.061Z] TAB v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | null | "tab-7" |
| CHANGE | `1.tabs.0.isActive` | false | true |

**[seq=4, time=2026-04-12T15:21:56.061Z] GROUP v4 -> v5** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-2" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-4" | "tab-8" |
| CHANGE | `0.tabRefIds.0` | "tab-5" | "tab-9" |
| CHANGE | `0.tabRefIds.1` | "tab-6" | "tab-10" |
| CHANGE | `0.tabRefIds.2` | "tab-4" | "tab-8" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-6" | "tab-10" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-4" | "tab-8" |
| CHANGE | `1.groupRefId` | "group-3" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-7" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-7" | "tab-11" |

**[seq=5, time=2026-04-12T15:21:56.075Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 2 |
| CREATE | `1.tabLabels.1` |  | "tsconfig.json" |
| CREATE | `1.tabRefIds.1` |  | "tab-12" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-12","label":"tsconfig.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=6, time=2026-04-12T15:21:56.076Z] TAB v6 -> v7** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-11" | "tab-12" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.isActive` | false | true |

**[seq=7, time=2026-04-12T15:21:56.076Z] GROUP v7 -> v8** — 14 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-4" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-8" | "tab-13" |
| CHANGE | `0.tabRefIds.0` | "tab-9" | "tab-14" |
| CHANGE | `0.tabRefIds.1` | "tab-10" | "tab-15" |
| CHANGE | `0.tabRefIds.2` | "tab-8" | "tab-13" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-9" | "tab-14" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-10" | "tab-15" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `1.groupRefId` | "group-5" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-12" | "tab-16" |
| CHANGE | `1.tabRefIds.0` | "tab-11" | "tab-17" |
| CHANGE | `1.tabRefIds.1` | "tab-12" | "tab-16" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-11" | "tab-17" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-12" | "tab-16" |

---
