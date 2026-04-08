# Scenario: C: move tab cross-column

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## C: move tab cross-column

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json","README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["tsconfig.json","README.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 7
- **Observed events:** 7

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:19:55.736Z | TAB | 0 | 1 | [{"tabRefId":"tab-4","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 1 | 2026-04-12T15:19:55.736Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-4","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 2 | 2026-04-12T15:19:55.736Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-3","viewColumn":1,"isActive":true,"activeTabRefId":"tab-5","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-6","tab-5"]},{"groupRefId":"group-4","viewColumn":2,"isActive":false,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-8","tab-7"]}] |
| 3 | 2026-04-12T15:19:55.739Z | GROUP | 3 | 4 |  |  | [{"groupRefId":"group-4","viewColumn":2,"isActive":true,"activeTabRefId":"tab-7","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-8","tab-7"]}] |
| 4 | 2026-04-12T15:19:55.740Z | TAB | 4 | 5 |  |  | [{"tabRefId":"tab-6","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 5 | 2026-04-12T15:19:55.740Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-9","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-9","tab-10"]},{"groupRefId":"group-6","viewColumn":2,"isActive":true,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["tsconfig.json","README.md"],"tabRefIds":["tab-12","tab-11"]}] |
| 6 | 2026-04-12T15:19:55.740Z | TAB | 6 | 7 |  | [{"tabRefId":"tab-10","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:19:55.736Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 2 |
| CREATE | `1.tabLabels.1` |  | "README.md" |
| CREATE | `1.tabRefIds.1` |  | "tab-4" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-4","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=1, time=2026-04-12T15:19:55.736Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-3" | "tab-4" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.isActive` | false | true |

**[seq=2, time=2026-04-12T15:19:55.736Z] GROUP v2 -> v3** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-3" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-5" |
| CHANGE | `0.tabRefIds.0` | "tab-2" | "tab-6" |
| CHANGE | `0.tabRefIds.1` | "tab-1" | "tab-5" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-2" | "tab-6" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-1" | "tab-5" |
| CHANGE | `1.groupRefId` | "group-2" | "group-4" |
| CHANGE | `1.activeTabRefId` | "tab-4" | "tab-7" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-8" |
| CHANGE | `1.tabRefIds.1` | "tab-4" | "tab-7" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-8" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-4" | "tab-7" |

**[seq=3, time=2026-04-12T15:19:55.739Z] GROUP v3 -> v4** — 2 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.isActive` | true | false |
| CHANGE | `1.isActive` | false | true |

**[seq=4, time=2026-04-12T15:19:55.740Z] TAB v4 -> v5** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.activeTabRefId` | "tab-5" | "tab-6" |
| CHANGE | `0.tabs.0.isActive` | false | true |
| CHANGE | `0.tabs.1.isActive` | true | false |

**[seq=5, time=2026-04-12T15:19:55.740Z] GROUP v5 -> v6** — 12 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-3" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-6" | "tab-9" |
| CHANGE | `0.tabRefIds.0` | "tab-6" | "tab-9" |
| CHANGE | `0.tabRefIds.1` | "tab-5" | "tab-10" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-6" | "tab-9" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-5" | "tab-10" |
| CHANGE | `1.groupRefId` | "group-4" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-7" | "tab-11" |
| CHANGE | `1.tabRefIds.0` | "tab-8" | "tab-12" |
| CHANGE | `1.tabRefIds.1` | "tab-7" | "tab-11" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-8" | "tab-12" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-7" | "tab-11" |

**[seq=6, time=2026-04-12T15:19:55.740Z] TAB v6 -> v7** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 2 | 1 |
| REMOVE | `0.tabLabels.1` | "README.md" |  |
| REMOVE | `0.tabRefIds.1` | "tab-10" |  |
| REMOVE | `0.tabs.1` | {"tabRefId":"tab-10","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

---
