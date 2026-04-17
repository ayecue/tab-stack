# Scenario: AE2: open file in active group (3vc, populated)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AE2: open file in active group (3vc, populated)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json"]},{"viewColumn":3,"tabs":["CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["README.md","tsconfig.json","ARCHITECTURE.md"]},{"viewColumn":3,"tabs":["CHANGELOG.md","webview.html"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:26.056Z | TAB | 0 | 1 | [{"tabRefId":"tab-6","label":"ARCHITECTURE.md","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/ARCHITECTURE.md"}] |  |  |
| 1 | 2026-04-12T15:21:26.057Z | TAB | 1 | 2 |  |  | [{"tabRefId":"tab-6","label":"ARCHITECTURE.md","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/ARCHITECTURE.md"}] |
| 2 | 2026-04-12T15:21:26.057Z | GROUP | 2 | 3 |  |  | [{"groupRefId":"group-4","viewColumn":1,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-5","viewColumn":2,"isActive":true,"activeTabRefId":"tab-8","tabCount":3,"tabLabels":["README.md","tsconfig.json","ARCHITECTURE.md"],"tabRefIds":["tab-9","tab-10","tab-8"]},{"groupRefId":"group-6","viewColumn":3,"isActive":false,"activeTabRefId":"tab-11","tabCount":2,"tabLabels":["CHANGELOG.md","webview.html"],"tabRefIds":["tab-12","tab-11"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:26.056Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 3 |
| CREATE | `1.tabLabels.2` |  | "ARCHITECTURE.md" |
| CREATE | `1.tabRefIds.2` |  | "tab-6" |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-6","label":"ARCHITECTURE.md","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/ARCHITECTURE.md"} |

**[seq=1, time=2026-04-12T15:21:26.057Z] TAB v1 -> v2** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-6" |
| CHANGE | `1.tabs.1.isActive` | true | false |
| CHANGE | `1.tabs.2.isActive` | false | true |

**[seq=2, time=2026-04-12T15:21:26.057Z] GROUP v2 -> v3** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-4" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-2" | "group-5" |
| CHANGE | `1.activeTabRefId` | "tab-6" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-3" | "tab-9" |
| CHANGE | `1.tabRefIds.1` | "tab-2" | "tab-10" |
| CHANGE | `1.tabRefIds.2` | "tab-6" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-3" | "tab-9" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-2" | "tab-10" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-6" | "tab-8" |
| CHANGE | `2.groupRefId` | "group-3" | "group-6" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-11" |
| CHANGE | `2.tabRefIds.0` | "tab-5" | "tab-12" |
| CHANGE | `2.tabRefIds.1` | "tab-4" | "tab-11" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-5" | "tab-12" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-4" | "tab-11" |

---
