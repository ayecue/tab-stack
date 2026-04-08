# Scenario: AF2: close single tab (4vc, populated middle group)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AF2: close single tab (4vc, populated middle group)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE"]},{"viewColumn":3,"tabs":["README.md","tsconfig.json","vitest.config.ts"]},{"viewColumn":4,"tabs":["CHANGELOG.md"]}]
- **After:** [{"viewColumn":1,"tabs":["package.json"]},{"viewColumn":2,"tabs":["LICENSE"]},{"viewColumn":3,"tabs":["README.md","vitest.config.ts"]},{"viewColumn":4,"tabs":["CHANGELOG.md"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 3
- **Observed events:** 3

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:31.310Z | TAB | 0 | 1 |  |  | [{"tabRefId":"tab-5","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"}] |
| 1 | 2026-04-12T15:21:31.311Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-5","viewColumn":1,"isActive":false,"activeTabRefId":"tab-7","tabCount":1,"tabLabels":["package.json"],"tabRefIds":["tab-7"]},{"groupRefId":"group-6","viewColumn":2,"isActive":false,"activeTabRefId":"tab-8","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-8"]},{"groupRefId":"group-7","viewColumn":3,"isActive":true,"activeTabRefId":"tab-9","tabCount":3,"tabLabels":["README.md","tsconfig.json","vitest.config.ts"],"tabRefIds":["tab-10","tab-11","tab-9"]},{"groupRefId":"group-8","viewColumn":4,"isActive":false,"activeTabRefId":"tab-12","tabCount":1,"tabLabels":["CHANGELOG.md"],"tabRefIds":["tab-12"]}] |
| 2 | 2026-04-12T15:21:31.311Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-11","label":"tsconfig.json","kind":"text","viewColumn":3,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:31.310Z] TAB v0 -> v1** — 3 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-5" |
| CHANGE | `2.tabs.1.isActive` | true | false |
| CHANGE | `2.tabs.2.isActive` | false | true |

**[seq=1, time=2026-04-12T15:21:31.311Z] GROUP v1 -> v2** — 20 change(s)

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
| CHANGE | `2.activeTabRefId` | "tab-5" | "tab-9" |
| CHANGE | `2.tabRefIds.0` | "tab-4" | "tab-10" |
| CHANGE | `2.tabRefIds.1` | "tab-3" | "tab-11" |
| CHANGE | `2.tabRefIds.2` | "tab-5" | "tab-9" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-4" | "tab-10" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-3" | "tab-11" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-5" | "tab-9" |
| CHANGE | `3.groupRefId` | "group-4" | "group-8" |
| CHANGE | `3.activeTabRefId` | "tab-6" | "tab-12" |
| CHANGE | `3.tabRefIds.0` | "tab-6" | "tab-12" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-6" | "tab-12" |

**[seq=2, time=2026-04-12T15:21:31.311Z] TAB v2 -> v3** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 3 | 2 |
| CHANGE | `2.tabLabels.1` | "tsconfig.json" | "vitest.config.ts" |
| REMOVE | `2.tabLabels.2` | "vitest.config.ts" |  |
| CHANGE | `2.tabRefIds.1` | "tab-11" | "tab-9" |
| REMOVE | `2.tabRefIds.2` | "tab-9" |  |
| CHANGE | `2.tabs.1.tabRefId` | "tab-11" | "tab-9" |
| CHANGE | `2.tabs.1.label` | "tsconfig.json" | "vitest.config.ts" |
| CHANGE | `2.tabs.1.isActive` | false | true |
| CHANGE | `2.tabs.1.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/vitest.config.ts" |
| REMOVE | `2.tabs.2` | {"tabRefId":"tab-9","label":"vitest.config.ts","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/vitest.config.ts"} |  |

---
