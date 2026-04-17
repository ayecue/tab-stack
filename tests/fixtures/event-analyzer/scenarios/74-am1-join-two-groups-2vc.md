# Scenario: AM1: join two groups (2vc)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AM1: join two groups (2vc)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md","package.json"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 8
- **Observed events:** 8

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:22:02.248Z | TAB | 0 | 1 | [{"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |  |
| 1 | 2026-04-12T15:22:02.248Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 2 | 2026-04-12T15:22:02.248Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-4","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-4"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-6","tab-5"]}] |
| 3 | 2026-04-12T15:22:02.249Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-6","tab-5"]}] |
| 4 | 2026-04-12T15:22:02.252Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-9","tab-8"]}] |
| 5 | 2026-04-12T15:22:02.252Z | TAB | 5 | 6 |  | [{"tabRefId":"tab-7","label":"package.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 6 | 2026-04-12T15:22:02.256Z | GROUP | 6 | 7 |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-7","viewColumn":1,"isActive":true,"activeTabRefId":"tab-10","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-11","tab-10"]}] |
| 7 | 2026-04-12T15:22:02.256Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-8","viewColumn":1,"isActive":true,"activeTabRefId":"tab-12","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-13","tab-12"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:22:02.248Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 2 |
| CREATE | `1.tabLabels.1` |  | "package.json" |
| CREATE | `1.tabRefIds.1` |  | "tab-3" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-3","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |

**[seq=1, time=2026-04-12T15:22:02.248Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-3" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.isActive` | false | true |

**[seq=2, time=2026-04-12T15:22:02.248Z] GROUP v2 -> v3** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-4" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-4" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-4" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-5" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `1.tabRefIds.1` | "tab-3" | "tab-5" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-3" | "tab-5" |

**[seq=3, time=2026-04-12T15:22:02.249Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:22:02.252Z] GROUP v4 -> v5** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-4" | null |
| CHANGE | `0.tabRefIds.0` | "tab-4" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-4" | "tab-7" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-5" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-6" | "tab-9" |
| CHANGE | `1.tabRefIds.1` | "tab-5" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-6" | "tab-9" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-5" | "tab-8" |

**[seq=5, time=2026-04-12T15:22:02.252Z] TAB v5 -> v6** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "package.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-7" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-7","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |  |

**[seq=6, time=2026-04-12T15:22:02.256Z] GROUP v6 -> v7** — 11 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-5" | "group-7" |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-10" |
| CHANGE | `0.tabCount` | 0 | 2 |
| CREATE | `0.tabLabels.0` |  | "README.md" |
| CREATE | `0.tabLabels.1` |  | "package.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-11" |
| CREATE | `0.tabRefIds.1` |  | "tab-10" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-11","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-10","label":"package.json","kind":"text","viewColumn":1,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| REMOVE | `1` | {"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-8","tabCount":2,"tabLabels":["README.md","package.json"],"tabRefIds":["tab-9","tab-8"],"tabs":[{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"},{"tabRefId":"tab-8","label":"package.json","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}]} |  |

**[seq=7, time=2026-04-12T15:22:02.256Z] GROUP v7 -> v8** — 6 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-7" | "group-8" |
| CHANGE | `0.activeTabRefId` | "tab-10" | "tab-12" |
| CHANGE | `0.tabRefIds.0` | "tab-11" | "tab-13" |
| CHANGE | `0.tabRefIds.1` | "tab-10" | "tab-12" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-11" | "tab-13" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-10" | "tab-12" |

---
