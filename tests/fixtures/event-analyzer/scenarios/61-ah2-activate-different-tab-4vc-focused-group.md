# Scenario: AH2: activate different tab (4vc, focused group)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AH2: activate different tab (4vc, focused group)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE"]},{"viewColumn":3,"tabs":["README.md","tsconfig.json","vitest.config.ts"]},{"viewColumn":4,"tabs":["CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE"]},{"viewColumn":3,"tabs":["README.md","tsconfig.json","vitest.config.ts"]},{"viewColumn":4,"tabs":["CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 2
- **Observed events:** 2

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:38.442Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-4","label":"README.md","kind":"text","viewColumn":3,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |
| 1 | 2026-04-12T15:21:38.442Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":2,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-8"]},{"groupRefId":"group-7","viewColumn":3,"isActive":true,"activeTabRefId":"tab-9","tabCount":3,"tabLabels":["README.md","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-9","tab-10","tab-11"]},{"groupRefId":"group-8","viewColumn":4,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-12"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:38.442Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-4" |
| CHANGE | `2.tabs.0.isActive` | false | true |
| CHANGE | `2.tabs.1.isActive` | true | false |

**[seq=1, time=2026-04-12T15:21:38.442Z] GROUP v1 -> v2** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-5" |
| CHANGE | `0.activeTabRefId` | "tab-1" | "tab-7" |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-7" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-7" |
| CHANGE | `1.groupRefId` | "group-2" | "group-6" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-8" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-8" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-8" |
| CHANGE | `2.groupRefId` | "group-3" | "group-7" |
| CHANGE | `2.activeTabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-9" |
| CHANGE | `2.tabRefIds.1` | "tab-3" | "tab-10" |
| CHANGE | `2.tabRefIds.2` | "tab-5" | "tab-11" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-9" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-3" | "tab-10" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-5" | "tab-11" |
| CHANGE | `3.groupRefId` | "group-4" | "group-8" |
| CHANGE | `3.activeTabRefId` | "tab-6" | "tab-12" |
| CHANGE | `3.tabRefIds.0` | "tab-6" | "tab-12" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-6" | "tab-12" |

---
