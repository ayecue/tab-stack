# Scenario: AD3: join all groups (5vc-duplicate)

Generated: 2026-04-12T15:22:18.760Z
VS Code version: 1.115.0

## AD3: join all groups (5vc-duplicate)

### Layout
- **Before:** [{"viewColumn":1,"tabs":["README.md"]},{"viewColumn":2,"tabs":["tsconfig.json"]},{"viewColumn":3,"tabs":["LICENSE"]},{"viewColumn":4,"tabs":["package.json"]},{"viewColumn":5,"tabs":["package.json","CHANGELOG.md","webview.html"]}]
- **After:** [{"viewColumn":1,"tabs":["README.md","tsconfig.json","LICENSE","package.json","CHANGELOG.md","webview.html"]}]

### Replay
- **Initial snapshot version:** 0
- **Final snapshot version:** 29
- **Observed events:** 29

| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |
|-----|-----------|------|----------|---------|--------|--------|---------|
| 0 | 2026-04-12T15:21:22.444Z | TAB | 0 | 1 | [{"tabRefId":"tab-8","label":"README.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |  |
| 1 | 2026-04-12T15:21:22.444Z | GROUP | 1 | 2 |  |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["README.md"],"tabRefIds":["tab-9"]},{"groupRefId":"group-7","viewColumn":2,"isActive":false,"activeTabRefId":"tab-10","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-10"]},{"groupRefId":"group-8","viewColumn":3,"isActive":false,"activeTabRefId":"tab-11","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-11"]},{"groupRefId":"group-9","viewColumn":4,"isActive":true,"activeTabRefId":"tab-12","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-12","tab-13"]},{"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-14","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-15","tab-16","tab-14"]}] |
| 2 | 2026-04-12T15:21:22.444Z | TAB | 2 | 3 |  | [{"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"}] |  |
| 3 | 2026-04-12T15:21:22.489Z | GROUP | 3 | 4 |  | [{"groupRefId":"group-6","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-11","viewColumn":1,"isActive":false,"activeTabRefId":"tab-17","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-17"]},{"groupRefId":"group-12","viewColumn":2,"isActive":false,"activeTabRefId":"tab-18","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-18"]},{"groupRefId":"group-13","viewColumn":3,"isActive":true,"activeTabRefId":"tab-19","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-19","tab-20"]},{"groupRefId":"group-14","viewColumn":4,"isActive":false,"activeTabRefId":"tab-21","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-22","tab-23","tab-21"]}] |
| 4 | 2026-04-12T15:21:22.490Z | GROUP | 4 | 5 |  |  | [{"groupRefId":"group-15","viewColumn":1,"isActive":false,"activeTabRefId":"tab-24","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-24"]},{"groupRefId":"group-16","viewColumn":2,"isActive":false,"activeTabRefId":"tab-25","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-25"]},{"groupRefId":"group-17","viewColumn":3,"isActive":true,"activeTabRefId":"tab-26","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-26","tab-27"]},{"groupRefId":"group-18","viewColumn":4,"isActive":false,"activeTabRefId":"tab-28","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-29","tab-30","tab-28"]}] |
| 5 | 2026-04-12T15:21:22.490Z | GROUP | 5 | 6 |  |  | [{"groupRefId":"group-19","viewColumn":1,"isActive":false,"activeTabRefId":"tab-31","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-31"]},{"groupRefId":"group-20","viewColumn":2,"isActive":false,"activeTabRefId":"tab-32","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-32"]},{"groupRefId":"group-21","viewColumn":3,"isActive":true,"activeTabRefId":"tab-33","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-33","tab-34"]},{"groupRefId":"group-22","viewColumn":4,"isActive":false,"activeTabRefId":"tab-35","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-36","tab-37","tab-35"]}] |
| 6 | 2026-04-12T15:21:22.490Z | GROUP | 6 | 7 |  |  | [{"groupRefId":"group-23","viewColumn":1,"isActive":false,"activeTabRefId":"tab-38","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-38"]},{"groupRefId":"group-24","viewColumn":2,"isActive":false,"activeTabRefId":"tab-39","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-39"]},{"groupRefId":"group-25","viewColumn":3,"isActive":true,"activeTabRefId":"tab-40","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-40","tab-41"]},{"groupRefId":"group-26","viewColumn":4,"isActive":false,"activeTabRefId":"tab-42","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-43","tab-44","tab-42"]}] |
| 7 | 2026-04-12T15:21:22.490Z | GROUP | 7 | 8 |  |  | [{"groupRefId":"group-27","viewColumn":1,"isActive":false,"activeTabRefId":"tab-45","tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-45"]},{"groupRefId":"group-28","viewColumn":2,"isActive":false,"activeTabRefId":"tab-46","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-46"]},{"groupRefId":"group-29","viewColumn":3,"isActive":true,"activeTabRefId":"tab-47","tabCount":2,"tabLabels":["package.json","README.md"],"tabRefIds":["tab-47","tab-48"]},{"groupRefId":"group-30","viewColumn":4,"isActive":false,"activeTabRefId":"tab-49","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-50","tab-51","tab-49"]}] |
| 8 | 2026-04-12T15:21:22.495Z | TAB | 8 | 9 | [{"tabRefId":"tab-52","label":"tsconfig.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |  |
| 9 | 2026-04-12T15:21:22.495Z | GROUP | 9 | 10 |  |  | [{"groupRefId":"group-31","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["tsconfig.json"],"tabRefIds":["tab-53"]},{"groupRefId":"group-32","viewColumn":2,"isActive":false,"activeTabRefId":"tab-54","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-54"]},{"groupRefId":"group-33","viewColumn":3,"isActive":true,"activeTabRefId":"tab-55","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-55","tab-56","tab-57"]},{"groupRefId":"group-34","viewColumn":4,"isActive":false,"activeTabRefId":"tab-58","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-59","tab-60","tab-58"]}] |
| 10 | 2026-04-12T15:21:22.495Z | TAB | 10 | 11 |  | [{"tabRefId":"tab-53","label":"tsconfig.json","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"}] |  |
| 11 | 2026-04-12T15:21:22.511Z | GROUP | 11 | 12 |  | [{"groupRefId":"group-31","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-35","viewColumn":1,"isActive":false,"activeTabRefId":"tab-61","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-61"]},{"groupRefId":"group-36","viewColumn":2,"isActive":true,"activeTabRefId":"tab-62","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-62","tab-63","tab-64"]},{"groupRefId":"group-37","viewColumn":3,"isActive":false,"activeTabRefId":"tab-65","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-66","tab-67","tab-65"]}] |
| 12 | 2026-04-12T15:21:22.512Z | GROUP | 12 | 13 |  |  | [{"groupRefId":"group-38","viewColumn":1,"isActive":false,"activeTabRefId":"tab-68","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-68"]},{"groupRefId":"group-39","viewColumn":2,"isActive":true,"activeTabRefId":"tab-69","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-69","tab-70","tab-71"]},{"groupRefId":"group-40","viewColumn":3,"isActive":false,"activeTabRefId":"tab-72","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-73","tab-74","tab-72"]}] |
| 13 | 2026-04-12T15:21:22.512Z | GROUP | 13 | 14 |  |  | [{"groupRefId":"group-41","viewColumn":1,"isActive":false,"activeTabRefId":"tab-75","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-75"]},{"groupRefId":"group-42","viewColumn":2,"isActive":true,"activeTabRefId":"tab-76","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-76","tab-77","tab-78"]},{"groupRefId":"group-43","viewColumn":3,"isActive":false,"activeTabRefId":"tab-79","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-80","tab-81","tab-79"]}] |
| 14 | 2026-04-12T15:21:22.512Z | GROUP | 14 | 15 |  |  | [{"groupRefId":"group-44","viewColumn":1,"isActive":false,"activeTabRefId":"tab-82","tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-82"]},{"groupRefId":"group-45","viewColumn":2,"isActive":true,"activeTabRefId":"tab-83","tabCount":3,"tabLabels":["package.json","README.md","tsconfig.json"],"tabRefIds":["tab-83","tab-84","tab-85"]},{"groupRefId":"group-46","viewColumn":3,"isActive":false,"activeTabRefId":"tab-86","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-87","tab-88","tab-86"]}] |
| 15 | 2026-04-12T15:21:22.517Z | TAB | 15 | 16 | [{"tabRefId":"tab-89","label":"LICENSE","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |  |
| 16 | 2026-04-12T15:21:22.517Z | GROUP | 16 | 17 |  |  | [{"groupRefId":"group-47","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["LICENSE"],"tabRefIds":["tab-90"]},{"groupRefId":"group-48","viewColumn":2,"isActive":true,"activeTabRefId":"tab-91","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-91","tab-92","tab-93","tab-94"]},{"groupRefId":"group-49","viewColumn":3,"isActive":false,"activeTabRefId":"tab-95","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-96","tab-97","tab-95"]}] |
| 17 | 2026-04-12T15:21:22.518Z | TAB | 17 | 18 |  | [{"tabRefId":"tab-90","label":"LICENSE","kind":"text","viewColumn":1,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"}] |  |
| 18 | 2026-04-12T15:21:22.529Z | GROUP | 18 | 19 |  | [{"groupRefId":"group-47","viewColumn":1,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-50","viewColumn":1,"isActive":true,"activeTabRefId":"tab-98","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-98","tab-99","tab-100","tab-101"]},{"groupRefId":"group-51","viewColumn":2,"isActive":false,"activeTabRefId":"tab-102","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-103","tab-104","tab-102"]}] |
| 19 | 2026-04-12T15:21:22.529Z | GROUP | 19 | 20 |  |  | [{"groupRefId":"group-52","viewColumn":1,"isActive":true,"activeTabRefId":"tab-105","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-105","tab-106","tab-107","tab-108"]},{"groupRefId":"group-53","viewColumn":2,"isActive":false,"activeTabRefId":"tab-109","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-110","tab-111","tab-109"]}] |
| 20 | 2026-04-12T15:21:22.529Z | GROUP | 20 | 21 |  |  | [{"groupRefId":"group-54","viewColumn":1,"isActive":true,"activeTabRefId":"tab-112","tabCount":4,"tabLabels":["package.json","README.md","tsconfig.json","LICENSE"],"tabRefIds":["tab-112","tab-113","tab-114","tab-115"]},{"groupRefId":"group-55","viewColumn":2,"isActive":false,"activeTabRefId":"tab-116","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-117","tab-118","tab-116"]}] |
| 21 | 2026-04-12T15:21:22.534Z | TAB | 21 | 22 |  |  | [{"tabRefId":"tab-112","label":"package.json","kind":"text","viewColumn":1,"index":3,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |
| 22 | 2026-04-12T15:21:22.535Z | TAB | 22 | 23 |  | [{"tabRefId":"tab-117","label":"package.json","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"}] |  |
| 23 | 2026-04-12T15:21:22.535Z | TAB | 23 | 24 | [{"tabRefId":"tab-119","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":4,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |  |
| 24 | 2026-04-12T15:21:22.536Z | TAB | 24 | 25 |  | [{"tabRefId":"tab-118","label":"CHANGELOG.md","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"}] |  |
| 25 | 2026-04-12T15:21:22.536Z | TAB | 25 | 26 | [{"tabRefId":"tab-120","label":"webview.html","kind":"text","viewColumn":1,"index":5,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |  |  |
| 26 | 2026-04-12T15:21:22.536Z | GROUP | 26 | 27 |  |  | [{"groupRefId":"group-56","viewColumn":1,"isActive":true,"activeTabRefId":"tab-121","tabCount":6,"tabLabels":["README.md","tsconfig.json","LICENSE","package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-122","tab-123","tab-124","tab-121","tab-125","tab-126"]},{"groupRefId":"group-57","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":1,"tabLabels":["webview.html"],"tabRefIds":["tab-127"]}] |
| 27 | 2026-04-12T15:21:22.536Z | TAB | 27 | 28 |  | [{"tabRefId":"tab-127","label":"webview.html","kind":"text","viewColumn":2,"index":-1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}] |  |
| 28 | 2026-04-12T15:21:22.544Z | GROUP | 28 | 29 |  | [{"groupRefId":"group-57","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[]}] | [{"groupRefId":"group-58","viewColumn":1,"isActive":true,"activeTabRefId":"tab-128","tabCount":6,"tabLabels":["README.md","tsconfig.json","LICENSE","package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-129","tab-130","tab-131","tab-128","tab-132","tab-133"]}] |

### Snapshot Diffs

**[seq=0, time=2026-04-12T15:21:22.444Z] TAB v0 -> v1** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `3.tabCount` | 1 | 2 |
| CREATE | `3.tabLabels.1` |  | "README.md" |
| CREATE | `3.tabRefIds.1` |  | "tab-8" |
| CREATE | `3.tabs.1` |  | {"tabRefId":"tab-8","label":"README.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |

**[seq=1, time=2026-04-12T15:21:22.444Z] GROUP v1 -> v2** — 27 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-1" | "group-6" |
| CHANGE | `0.activeTabRefId` | "tab-1" | null |
| CHANGE | `0.tabRefIds.0` | "tab-1" | "tab-9" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-1" | "tab-9" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-2" | "group-7" |
| CHANGE | `1.activeTabRefId` | "tab-2" | "tab-10" |
| CHANGE | `1.tabRefIds.0` | "tab-2" | "tab-10" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-2" | "tab-10" |
| CHANGE | `2.groupRefId` | "group-3" | "group-8" |
| CHANGE | `2.activeTabRefId` | "tab-3" | "tab-11" |
| CHANGE | `2.tabRefIds.0` | "tab-3" | "tab-11" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-3" | "tab-11" |
| CHANGE | `3.groupRefId` | "group-4" | "group-9" |
| CHANGE | `3.activeTabRefId` | "tab-4" | "tab-12" |
| CHANGE | `3.tabRefIds.0` | "tab-4" | "tab-12" |
| CHANGE | `3.tabRefIds.1` | "tab-8" | "tab-13" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-4" | "tab-12" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-8" | "tab-13" |
| CHANGE | `4.groupRefId` | "group-5" | "group-10" |
| CHANGE | `4.activeTabRefId` | "tab-5" | "tab-14" |
| CHANGE | `4.tabRefIds.0` | "tab-6" | "tab-15" |
| CHANGE | `4.tabRefIds.1` | "tab-7" | "tab-16" |
| CHANGE | `4.tabRefIds.2` | "tab-5" | "tab-14" |
| CHANGE | `4.tabs.0.tabRefId` | "tab-6" | "tab-15" |
| CHANGE | `4.tabs.1.tabRefId` | "tab-7" | "tab-16" |
| CHANGE | `4.tabs.2.tabRefId` | "tab-5" | "tab-14" |

**[seq=2, time=2026-04-12T15:21:22.444Z] TAB v2 -> v3** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "README.md" |  |
| REMOVE | `0.tabRefIds.0` | "tab-9" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-9","label":"README.md","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |  |

**[seq=3, time=2026-04-12T15:21:22.489Z] GROUP v3 -> v4** — 41 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-6" | "group-11" |
| CHANGE | `0.activeTabRefId` | null | "tab-17" |
| CHANGE | `0.tabCount` | 0 | 1 |
| CREATE | `0.tabLabels.0` |  | "tsconfig.json" |
| CREATE | `0.tabRefIds.0` |  | "tab-17" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-17","label":"tsconfig.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CHANGE | `1.groupRefId` | "group-7" | "group-12" |
| CHANGE | `1.activeTabRefId` | "tab-10" | "tab-18" |
| CHANGE | `1.tabLabels.0` | "tsconfig.json" | "LICENSE" |
| CHANGE | `1.tabRefIds.0` | "tab-10" | "tab-18" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-10" | "tab-18" |
| CHANGE | `1.tabs.0.label` | "tsconfig.json" | "LICENSE" |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/LICENSE" |
| CHANGE | `2.groupRefId` | "group-8" | "group-13" |
| CHANGE | `2.isActive` | false | true |
| CHANGE | `2.activeTabRefId` | "tab-11" | "tab-19" |
| CHANGE | `2.tabCount` | 1 | 2 |
| CHANGE | `2.tabLabels.0` | "LICENSE" | "package.json" |
| CREATE | `2.tabLabels.1` |  | "README.md" |
| CHANGE | `2.tabRefIds.0` | "tab-11" | "tab-19" |
| CREATE | `2.tabRefIds.1` |  | "tab-20" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-11" | "tab-19" |
| CHANGE | `2.tabs.0.label` | "LICENSE" | "package.json" |
| CHANGE | `2.tabs.0.uri` | "file:///workspace/LICENSE" | "file:///workspace/package.json" |
| CREATE | `2.tabs.1` |  | {"tabRefId":"tab-20","label":"README.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CHANGE | `3.groupRefId` | "group-9" | "group-14" |
| CHANGE | `3.isActive` | true | false |
| CHANGE | `3.activeTabRefId` | "tab-12" | "tab-21" |
| CHANGE | `3.tabCount` | 2 | 3 |
| CHANGE | `3.tabLabels.1` | "README.md" | "CHANGELOG.md" |
| CREATE | `3.tabLabels.2` |  | "webview.html" |
| CHANGE | `3.tabRefIds.0` | "tab-12" | "tab-22" |
| CHANGE | `3.tabRefIds.1` | "tab-13" | "tab-23" |
| CREATE | `3.tabRefIds.2` |  | "tab-21" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-12" | "tab-22" |
| CHANGE | `3.tabs.0.isActive` | true | false |
| CHANGE | `3.tabs.1.tabRefId` | "tab-13" | "tab-23" |
| CHANGE | `3.tabs.1.label` | "README.md" | "CHANGELOG.md" |
| CHANGE | `3.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/CHANGELOG.md" |
| CREATE | `3.tabs.2` |  | {"tabRefId":"tab-21","label":"webview.html","kind":"text","viewColumn":4,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |
| REMOVE | `4` | {"groupRefId":"group-10","viewColumn":5,"isActive":false,"activeTabRefId":"tab-14","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-15","tab-16","tab-14"],"tabs":[{"tabRefId":"tab-15","label":"package.json","kind":"text","viewColumn":5,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"},{"tabRefId":"tab-16","label":"CHANGELOG.md","kind":"text","viewColumn":5,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"},{"tabRefId":"tab-14","label":"webview.html","kind":"text","viewColumn":5,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}]} |  |

**[seq=4, time=2026-04-12T15:21:22.490Z] GROUP v4 -> v5** — 22 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-11" | "group-15" |
| CHANGE | `0.activeTabRefId` | "tab-17" | "tab-24" |
| CHANGE | `0.tabRefIds.0` | "tab-17" | "tab-24" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-17" | "tab-24" |
| CHANGE | `1.groupRefId` | "group-12" | "group-16" |
| CHANGE | `1.activeTabRefId` | "tab-18" | "tab-25" |
| CHANGE | `1.tabRefIds.0` | "tab-18" | "tab-25" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-18" | "tab-25" |
| CHANGE | `2.groupRefId` | "group-13" | "group-17" |
| CHANGE | `2.activeTabRefId` | "tab-19" | "tab-26" |
| CHANGE | `2.tabRefIds.0` | "tab-19" | "tab-26" |
| CHANGE | `2.tabRefIds.1` | "tab-20" | "tab-27" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-19" | "tab-26" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-20" | "tab-27" |
| CHANGE | `3.groupRefId` | "group-14" | "group-18" |
| CHANGE | `3.activeTabRefId` | "tab-21" | "tab-28" |
| CHANGE | `3.tabRefIds.0` | "tab-22" | "tab-29" |
| CHANGE | `3.tabRefIds.1` | "tab-23" | "tab-30" |
| CHANGE | `3.tabRefIds.2` | "tab-21" | "tab-28" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-22" | "tab-29" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-23" | "tab-30" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-21" | "tab-28" |

**[seq=5, time=2026-04-12T15:21:22.490Z] GROUP v5 -> v6** — 22 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-15" | "group-19" |
| CHANGE | `0.activeTabRefId` | "tab-24" | "tab-31" |
| CHANGE | `0.tabRefIds.0` | "tab-24" | "tab-31" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-24" | "tab-31" |
| CHANGE | `1.groupRefId` | "group-16" | "group-20" |
| CHANGE | `1.activeTabRefId` | "tab-25" | "tab-32" |
| CHANGE | `1.tabRefIds.0` | "tab-25" | "tab-32" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-25" | "tab-32" |
| CHANGE | `2.groupRefId` | "group-17" | "group-21" |
| CHANGE | `2.activeTabRefId` | "tab-26" | "tab-33" |
| CHANGE | `2.tabRefIds.0` | "tab-26" | "tab-33" |
| CHANGE | `2.tabRefIds.1` | "tab-27" | "tab-34" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-26" | "tab-33" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-27" | "tab-34" |
| CHANGE | `3.groupRefId` | "group-18" | "group-22" |
| CHANGE | `3.activeTabRefId` | "tab-28" | "tab-35" |
| CHANGE | `3.tabRefIds.0` | "tab-29" | "tab-36" |
| CHANGE | `3.tabRefIds.1` | "tab-30" | "tab-37" |
| CHANGE | `3.tabRefIds.2` | "tab-28" | "tab-35" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-29" | "tab-36" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-30" | "tab-37" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-28" | "tab-35" |

**[seq=6, time=2026-04-12T15:21:22.490Z] GROUP v6 -> v7** — 22 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-19" | "group-23" |
| CHANGE | `0.activeTabRefId` | "tab-31" | "tab-38" |
| CHANGE | `0.tabRefIds.0` | "tab-31" | "tab-38" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-31" | "tab-38" |
| CHANGE | `1.groupRefId` | "group-20" | "group-24" |
| CHANGE | `1.activeTabRefId` | "tab-32" | "tab-39" |
| CHANGE | `1.tabRefIds.0` | "tab-32" | "tab-39" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-32" | "tab-39" |
| CHANGE | `2.groupRefId` | "group-21" | "group-25" |
| CHANGE | `2.activeTabRefId` | "tab-33" | "tab-40" |
| CHANGE | `2.tabRefIds.0` | "tab-33" | "tab-40" |
| CHANGE | `2.tabRefIds.1` | "tab-34" | "tab-41" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-33" | "tab-40" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-34" | "tab-41" |
| CHANGE | `3.groupRefId` | "group-22" | "group-26" |
| CHANGE | `3.activeTabRefId` | "tab-35" | "tab-42" |
| CHANGE | `3.tabRefIds.0` | "tab-36" | "tab-43" |
| CHANGE | `3.tabRefIds.1` | "tab-37" | "tab-44" |
| CHANGE | `3.tabRefIds.2` | "tab-35" | "tab-42" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-36" | "tab-43" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-37" | "tab-44" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-35" | "tab-42" |

**[seq=7, time=2026-04-12T15:21:22.490Z] GROUP v7 -> v8** — 22 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-23" | "group-27" |
| CHANGE | `0.activeTabRefId` | "tab-38" | "tab-45" |
| CHANGE | `0.tabRefIds.0` | "tab-38" | "tab-45" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-38" | "tab-45" |
| CHANGE | `1.groupRefId` | "group-24" | "group-28" |
| CHANGE | `1.activeTabRefId` | "tab-39" | "tab-46" |
| CHANGE | `1.tabRefIds.0` | "tab-39" | "tab-46" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-39" | "tab-46" |
| CHANGE | `2.groupRefId` | "group-25" | "group-29" |
| CHANGE | `2.activeTabRefId` | "tab-40" | "tab-47" |
| CHANGE | `2.tabRefIds.0` | "tab-40" | "tab-47" |
| CHANGE | `2.tabRefIds.1` | "tab-41" | "tab-48" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-40" | "tab-47" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-41" | "tab-48" |
| CHANGE | `3.groupRefId` | "group-26" | "group-30" |
| CHANGE | `3.activeTabRefId` | "tab-42" | "tab-49" |
| CHANGE | `3.tabRefIds.0` | "tab-43" | "tab-50" |
| CHANGE | `3.tabRefIds.1` | "tab-44" | "tab-51" |
| CHANGE | `3.tabRefIds.2` | "tab-42" | "tab-49" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-43" | "tab-50" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-44" | "tab-51" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-42" | "tab-49" |

**[seq=8, time=2026-04-12T15:21:22.495Z] TAB v8 -> v9** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `2.tabCount` | 2 | 3 |
| CREATE | `2.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `2.tabRefIds.2` |  | "tab-52" |
| CREATE | `2.tabs.2` |  | {"tabRefId":"tab-52","label":"tsconfig.json","kind":"text","viewColumn":3,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |

**[seq=9, time=2026-04-12T15:21:22.495Z] GROUP v9 -> v10** — 25 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-27" | "group-31" |
| CHANGE | `0.activeTabRefId` | "tab-45" | null |
| CHANGE | `0.tabRefIds.0` | "tab-45" | "tab-53" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-45" | "tab-53" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-28" | "group-32" |
| CHANGE | `1.activeTabRefId` | "tab-46" | "tab-54" |
| CHANGE | `1.tabRefIds.0` | "tab-46" | "tab-54" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-46" | "tab-54" |
| CHANGE | `2.groupRefId` | "group-29" | "group-33" |
| CHANGE | `2.activeTabRefId` | "tab-47" | "tab-55" |
| CHANGE | `2.tabRefIds.0` | "tab-47" | "tab-55" |
| CHANGE | `2.tabRefIds.1` | "tab-48" | "tab-56" |
| CHANGE | `2.tabRefIds.2` | "tab-52" | "tab-57" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-47" | "tab-55" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-48" | "tab-56" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-52" | "tab-57" |
| CHANGE | `3.groupRefId` | "group-30" | "group-34" |
| CHANGE | `3.activeTabRefId` | "tab-49" | "tab-58" |
| CHANGE | `3.tabRefIds.0` | "tab-50" | "tab-59" |
| CHANGE | `3.tabRefIds.1` | "tab-51" | "tab-60" |
| CHANGE | `3.tabRefIds.2` | "tab-49" | "tab-58" |
| CHANGE | `3.tabs.0.tabRefId` | "tab-50" | "tab-59" |
| CHANGE | `3.tabs.1.tabRefId` | "tab-51" | "tab-60" |
| CHANGE | `3.tabs.2.tabRefId` | "tab-49" | "tab-58" |

**[seq=10, time=2026-04-12T15:21:22.495Z] TAB v10 -> v11** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "tsconfig.json" |  |
| REMOVE | `0.tabRefIds.0` | "tab-53" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-53","label":"tsconfig.json","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |  |

**[seq=11, time=2026-04-12T15:21:22.511Z] GROUP v11 -> v12** — 39 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-31" | "group-35" |
| CHANGE | `0.activeTabRefId` | null | "tab-61" |
| CHANGE | `0.tabCount` | 0 | 1 |
| CREATE | `0.tabLabels.0` |  | "LICENSE" |
| CREATE | `0.tabRefIds.0` |  | "tab-61" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-61","label":"LICENSE","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |
| CHANGE | `1.groupRefId` | "group-32" | "group-36" |
| CHANGE | `1.isActive` | false | true |
| CHANGE | `1.activeTabRefId` | "tab-54" | "tab-62" |
| CHANGE | `1.tabCount` | 1 | 3 |
| CHANGE | `1.tabLabels.0` | "LICENSE" | "package.json" |
| CREATE | `1.tabLabels.1` |  | "README.md" |
| CREATE | `1.tabLabels.2` |  | "tsconfig.json" |
| CHANGE | `1.tabRefIds.0` | "tab-54" | "tab-62" |
| CREATE | `1.tabRefIds.1` |  | "tab-63" |
| CREATE | `1.tabRefIds.2` |  | "tab-64" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-54" | "tab-62" |
| CHANGE | `1.tabs.0.label` | "LICENSE" | "package.json" |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/LICENSE" | "file:///workspace/package.json" |
| CREATE | `1.tabs.1` |  | {"tabRefId":"tab-63","label":"README.md","kind":"text","viewColumn":2,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `1.tabs.2` |  | {"tabRefId":"tab-64","label":"tsconfig.json","kind":"text","viewColumn":2,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CHANGE | `2.groupRefId` | "group-33" | "group-37" |
| CHANGE | `2.isActive` | true | false |
| CHANGE | `2.activeTabRefId` | "tab-55" | "tab-65" |
| CHANGE | `2.tabLabels.1` | "README.md" | "CHANGELOG.md" |
| CHANGE | `2.tabLabels.2` | "tsconfig.json" | "webview.html" |
| CHANGE | `2.tabRefIds.0` | "tab-55" | "tab-66" |
| CHANGE | `2.tabRefIds.1` | "tab-56" | "tab-67" |
| CHANGE | `2.tabRefIds.2` | "tab-57" | "tab-65" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-55" | "tab-66" |
| CHANGE | `2.tabs.0.isActive` | true | false |
| CHANGE | `2.tabs.1.tabRefId` | "tab-56" | "tab-67" |
| CHANGE | `2.tabs.1.label` | "README.md" | "CHANGELOG.md" |
| CHANGE | `2.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-57" | "tab-65" |
| CHANGE | `2.tabs.2.label` | "tsconfig.json" | "webview.html" |
| CHANGE | `2.tabs.2.isActive` | false | true |
| CHANGE | `2.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/webview.html" |
| REMOVE | `3` | {"groupRefId":"group-34","viewColumn":4,"isActive":false,"activeTabRefId":"tab-58","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-59","tab-60","tab-58"],"tabs":[{"tabRefId":"tab-59","label":"package.json","kind":"text","viewColumn":4,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"},{"tabRefId":"tab-60","label":"CHANGELOG.md","kind":"text","viewColumn":4,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"},{"tabRefId":"tab-58","label":"webview.html","kind":"text","viewColumn":4,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}]} |  |

**[seq=12, time=2026-04-12T15:21:22.512Z] GROUP v12 -> v13** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-35" | "group-38" |
| CHANGE | `0.activeTabRefId` | "tab-61" | "tab-68" |
| CHANGE | `0.tabRefIds.0` | "tab-61" | "tab-68" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-61" | "tab-68" |
| CHANGE | `1.groupRefId` | "group-36" | "group-39" |
| CHANGE | `1.activeTabRefId` | "tab-62" | "tab-69" |
| CHANGE | `1.tabRefIds.0` | "tab-62" | "tab-69" |
| CHANGE | `1.tabRefIds.1` | "tab-63" | "tab-70" |
| CHANGE | `1.tabRefIds.2` | "tab-64" | "tab-71" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-62" | "tab-69" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-63" | "tab-70" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-64" | "tab-71" |
| CHANGE | `2.groupRefId` | "group-37" | "group-40" |
| CHANGE | `2.activeTabRefId` | "tab-65" | "tab-72" |
| CHANGE | `2.tabRefIds.0` | "tab-66" | "tab-73" |
| CHANGE | `2.tabRefIds.1` | "tab-67" | "tab-74" |
| CHANGE | `2.tabRefIds.2` | "tab-65" | "tab-72" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-66" | "tab-73" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-67" | "tab-74" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-65" | "tab-72" |

**[seq=13, time=2026-04-12T15:21:22.512Z] GROUP v13 -> v14** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-38" | "group-41" |
| CHANGE | `0.activeTabRefId` | "tab-68" | "tab-75" |
| CHANGE | `0.tabRefIds.0` | "tab-68" | "tab-75" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-68" | "tab-75" |
| CHANGE | `1.groupRefId` | "group-39" | "group-42" |
| CHANGE | `1.activeTabRefId` | "tab-69" | "tab-76" |
| CHANGE | `1.tabRefIds.0` | "tab-69" | "tab-76" |
| CHANGE | `1.tabRefIds.1` | "tab-70" | "tab-77" |
| CHANGE | `1.tabRefIds.2` | "tab-71" | "tab-78" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-69" | "tab-76" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-70" | "tab-77" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-71" | "tab-78" |
| CHANGE | `2.groupRefId` | "group-40" | "group-43" |
| CHANGE | `2.activeTabRefId` | "tab-72" | "tab-79" |
| CHANGE | `2.tabRefIds.0` | "tab-73" | "tab-80" |
| CHANGE | `2.tabRefIds.1` | "tab-74" | "tab-81" |
| CHANGE | `2.tabRefIds.2` | "tab-72" | "tab-79" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-73" | "tab-80" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-74" | "tab-81" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-72" | "tab-79" |

**[seq=14, time=2026-04-12T15:21:22.512Z] GROUP v14 -> v15** — 20 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-41" | "group-44" |
| CHANGE | `0.activeTabRefId` | "tab-75" | "tab-82" |
| CHANGE | `0.tabRefIds.0` | "tab-75" | "tab-82" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-75" | "tab-82" |
| CHANGE | `1.groupRefId` | "group-42" | "group-45" |
| CHANGE | `1.activeTabRefId` | "tab-76" | "tab-83" |
| CHANGE | `1.tabRefIds.0` | "tab-76" | "tab-83" |
| CHANGE | `1.tabRefIds.1` | "tab-77" | "tab-84" |
| CHANGE | `1.tabRefIds.2` | "tab-78" | "tab-85" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-76" | "tab-83" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-77" | "tab-84" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-78" | "tab-85" |
| CHANGE | `2.groupRefId` | "group-43" | "group-46" |
| CHANGE | `2.activeTabRefId` | "tab-79" | "tab-86" |
| CHANGE | `2.tabRefIds.0` | "tab-80" | "tab-87" |
| CHANGE | `2.tabRefIds.1` | "tab-81" | "tab-88" |
| CHANGE | `2.tabRefIds.2` | "tab-79" | "tab-86" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-80" | "tab-87" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-81" | "tab-88" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-79" | "tab-86" |

**[seq=15, time=2026-04-12T15:21:22.517Z] TAB v15 -> v16** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 4 |
| CREATE | `1.tabLabels.3` |  | "LICENSE" |
| CREATE | `1.tabRefIds.3` |  | "tab-89" |
| CREATE | `1.tabs.3` |  | {"tabRefId":"tab-89","label":"LICENSE","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |

**[seq=16, time=2026-04-12T15:21:22.517Z] GROUP v16 -> v17** — 23 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-44" | "group-47" |
| CHANGE | `0.activeTabRefId` | "tab-82" | null |
| CHANGE | `0.tabRefIds.0` | "tab-82" | "tab-90" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-82" | "tab-90" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `1.groupRefId` | "group-45" | "group-48" |
| CHANGE | `1.activeTabRefId` | "tab-83" | "tab-91" |
| CHANGE | `1.tabRefIds.0` | "tab-83" | "tab-91" |
| CHANGE | `1.tabRefIds.1` | "tab-84" | "tab-92" |
| CHANGE | `1.tabRefIds.2` | "tab-85" | "tab-93" |
| CHANGE | `1.tabRefIds.3` | "tab-89" | "tab-94" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-83" | "tab-91" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-84" | "tab-92" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-85" | "tab-93" |
| CHANGE | `1.tabs.3.tabRefId` | "tab-89" | "tab-94" |
| CHANGE | `2.groupRefId` | "group-46" | "group-49" |
| CHANGE | `2.activeTabRefId` | "tab-86" | "tab-95" |
| CHANGE | `2.tabRefIds.0` | "tab-87" | "tab-96" |
| CHANGE | `2.tabRefIds.1` | "tab-88" | "tab-97" |
| CHANGE | `2.tabRefIds.2` | "tab-86" | "tab-95" |
| CHANGE | `2.tabs.0.tabRefId` | "tab-87" | "tab-96" |
| CHANGE | `2.tabs.1.tabRefId` | "tab-88" | "tab-97" |
| CHANGE | `2.tabs.2.tabRefId` | "tab-86" | "tab-95" |

**[seq=17, time=2026-04-12T15:21:22.518Z] TAB v17 -> v18** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 1 | 0 |
| REMOVE | `0.tabLabels.0` | "LICENSE" |  |
| REMOVE | `0.tabRefIds.0` | "tab-90" |  |
| REMOVE | `0.tabs.0` | {"tabRefId":"tab-90","label":"LICENSE","kind":"text","viewColumn":1,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |  |

**[seq=18, time=2026-04-12T15:21:22.529Z] GROUP v18 -> v19** — 38 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-47" | "group-50" |
| CHANGE | `0.isActive` | false | true |
| CHANGE | `0.activeTabRefId` | null | "tab-98" |
| CHANGE | `0.tabCount` | 0 | 4 |
| CREATE | `0.tabLabels.0` |  | "package.json" |
| CREATE | `0.tabLabels.1` |  | "README.md" |
| CREATE | `0.tabLabels.2` |  | "tsconfig.json" |
| CREATE | `0.tabLabels.3` |  | "LICENSE" |
| CREATE | `0.tabRefIds.0` |  | "tab-98" |
| CREATE | `0.tabRefIds.1` |  | "tab-99" |
| CREATE | `0.tabRefIds.2` |  | "tab-100" |
| CREATE | `0.tabRefIds.3` |  | "tab-101" |
| CREATE | `0.tabs.0` |  | {"tabRefId":"tab-98","label":"package.json","kind":"text","viewColumn":1,"index":0,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"} |
| CREATE | `0.tabs.1` |  | {"tabRefId":"tab-99","label":"README.md","kind":"text","viewColumn":1,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/README.md"} |
| CREATE | `0.tabs.2` |  | {"tabRefId":"tab-100","label":"tsconfig.json","kind":"text","viewColumn":1,"index":2,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/tsconfig.json"} |
| CREATE | `0.tabs.3` |  | {"tabRefId":"tab-101","label":"LICENSE","kind":"text","viewColumn":1,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |
| CHANGE | `1.groupRefId` | "group-48" | "group-51" |
| CHANGE | `1.isActive` | true | false |
| CHANGE | `1.activeTabRefId` | "tab-91" | "tab-102" |
| CHANGE | `1.tabCount` | 4 | 3 |
| CHANGE | `1.tabLabels.1` | "README.md" | "CHANGELOG.md" |
| CHANGE | `1.tabLabels.2` | "tsconfig.json" | "webview.html" |
| REMOVE | `1.tabLabels.3` | "LICENSE" |  |
| CHANGE | `1.tabRefIds.0` | "tab-91" | "tab-103" |
| CHANGE | `1.tabRefIds.1` | "tab-92" | "tab-104" |
| CHANGE | `1.tabRefIds.2` | "tab-93" | "tab-102" |
| REMOVE | `1.tabRefIds.3` | "tab-94" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-91" | "tab-103" |
| CHANGE | `1.tabs.0.isActive` | true | false |
| CHANGE | `1.tabs.1.tabRefId` | "tab-92" | "tab-104" |
| CHANGE | `1.tabs.1.label` | "README.md" | "CHANGELOG.md" |
| CHANGE | `1.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-93" | "tab-102" |
| CHANGE | `1.tabs.2.label` | "tsconfig.json" | "webview.html" |
| CHANGE | `1.tabs.2.isActive` | false | true |
| CHANGE | `1.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/webview.html" |
| REMOVE | `1.tabs.3` | {"tabRefId":"tab-94","label":"LICENSE","kind":"text","viewColumn":2,"index":3,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/LICENSE"} |  |
| REMOVE | `2` | {"groupRefId":"group-49","viewColumn":3,"isActive":false,"activeTabRefId":"tab-95","tabCount":3,"tabLabels":["package.json","CHANGELOG.md","webview.html"],"tabRefIds":["tab-96","tab-97","tab-95"],"tabs":[{"tabRefId":"tab-96","label":"package.json","kind":"text","viewColumn":3,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/package.json"},{"tabRefId":"tab-97","label":"CHANGELOG.md","kind":"text","viewColumn":3,"index":1,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"},{"tabRefId":"tab-95","label":"webview.html","kind":"text","viewColumn":3,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"}]} |  |

**[seq=19, time=2026-04-12T15:21:22.529Z] GROUP v19 -> v20** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-50" | "group-52" |
| CHANGE | `0.activeTabRefId` | "tab-98" | "tab-105" |
| CHANGE | `0.tabRefIds.0` | "tab-98" | "tab-105" |
| CHANGE | `0.tabRefIds.1` | "tab-99" | "tab-106" |
| CHANGE | `0.tabRefIds.2` | "tab-100" | "tab-107" |
| CHANGE | `0.tabRefIds.3` | "tab-101" | "tab-108" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-98" | "tab-105" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-99" | "tab-106" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-100" | "tab-107" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-101" | "tab-108" |
| CHANGE | `1.groupRefId` | "group-51" | "group-53" |
| CHANGE | `1.activeTabRefId` | "tab-102" | "tab-109" |
| CHANGE | `1.tabRefIds.0` | "tab-103" | "tab-110" |
| CHANGE | `1.tabRefIds.1` | "tab-104" | "tab-111" |
| CHANGE | `1.tabRefIds.2` | "tab-102" | "tab-109" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-103" | "tab-110" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-104" | "tab-111" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-102" | "tab-109" |

**[seq=20, time=2026-04-12T15:21:22.529Z] GROUP v20 -> v21** — 18 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-52" | "group-54" |
| CHANGE | `0.activeTabRefId` | "tab-105" | "tab-112" |
| CHANGE | `0.tabRefIds.0` | "tab-105" | "tab-112" |
| CHANGE | `0.tabRefIds.1` | "tab-106" | "tab-113" |
| CHANGE | `0.tabRefIds.2` | "tab-107" | "tab-114" |
| CHANGE | `0.tabRefIds.3` | "tab-108" | "tab-115" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-105" | "tab-112" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-106" | "tab-113" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-107" | "tab-114" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-108" | "tab-115" |
| CHANGE | `1.groupRefId` | "group-53" | "group-55" |
| CHANGE | `1.activeTabRefId` | "tab-109" | "tab-116" |
| CHANGE | `1.tabRefIds.0` | "tab-110" | "tab-117" |
| CHANGE | `1.tabRefIds.1` | "tab-111" | "tab-118" |
| CHANGE | `1.tabRefIds.2` | "tab-109" | "tab-116" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-110" | "tab-117" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-111" | "tab-118" |
| CHANGE | `1.tabs.2.tabRefId` | "tab-109" | "tab-116" |

**[seq=21, time=2026-04-12T15:21:22.534Z] TAB v21 -> v22** — 22 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabLabels.0` | "package.json" | "README.md" |
| CHANGE | `0.tabLabels.1` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabLabels.2` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabLabels.3` | "LICENSE" | "package.json" |
| CHANGE | `0.tabRefIds.0` | "tab-112" | "tab-113" |
| CHANGE | `0.tabRefIds.1` | "tab-113" | "tab-114" |
| CHANGE | `0.tabRefIds.2` | "tab-114" | "tab-115" |
| CHANGE | `0.tabRefIds.3` | "tab-115" | "tab-112" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-112" | "tab-113" |
| CHANGE | `0.tabs.0.label` | "package.json" | "README.md" |
| CHANGE | `0.tabs.0.isActive` | true | false |
| CHANGE | `0.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/README.md" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-113" | "tab-114" |
| CHANGE | `0.tabs.1.label` | "README.md" | "tsconfig.json" |
| CHANGE | `0.tabs.1.uri` | "file:///workspace/README.md" | "file:///workspace/tsconfig.json" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-114" | "tab-115" |
| CHANGE | `0.tabs.2.label` | "tsconfig.json" | "LICENSE" |
| CHANGE | `0.tabs.2.uri` | "file:///workspace/tsconfig.json" | "file:///workspace/LICENSE" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-115" | "tab-112" |
| CHANGE | `0.tabs.3.label` | "LICENSE" | "package.json" |
| CHANGE | `0.tabs.3.isActive` | false | true |
| CHANGE | `0.tabs.3.uri` | "file:///workspace/LICENSE" | "file:///workspace/package.json" |

**[seq=22, time=2026-04-12T15:21:22.535Z] TAB v22 -> v23** — 15 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 3 | 2 |
| CHANGE | `1.tabLabels.0` | "package.json" | "CHANGELOG.md" |
| CHANGE | `1.tabLabels.1` | "CHANGELOG.md" | "webview.html" |
| REMOVE | `1.tabLabels.2` | "webview.html" |  |
| CHANGE | `1.tabRefIds.0` | "tab-117" | "tab-118" |
| CHANGE | `1.tabRefIds.1` | "tab-118" | "tab-116" |
| REMOVE | `1.tabRefIds.2` | "tab-116" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-117" | "tab-118" |
| CHANGE | `1.tabs.0.label` | "package.json" | "CHANGELOG.md" |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/package.json" | "file:///workspace/CHANGELOG.md" |
| CHANGE | `1.tabs.1.tabRefId` | "tab-118" | "tab-116" |
| CHANGE | `1.tabs.1.label` | "CHANGELOG.md" | "webview.html" |
| CHANGE | `1.tabs.1.isActive` | false | true |
| CHANGE | `1.tabs.1.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/webview.html" |
| REMOVE | `1.tabs.2` | {"tabRefId":"tab-116","label":"webview.html","kind":"text","viewColumn":2,"index":2,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |  |

**[seq=23, time=2026-04-12T15:21:22.535Z] TAB v23 -> v24** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 4 | 5 |
| CREATE | `0.tabLabels.4` |  | "CHANGELOG.md" |
| CREATE | `0.tabRefIds.4` |  | "tab-119" |
| CREATE | `0.tabs.4` |  | {"tabRefId":"tab-119","label":"CHANGELOG.md","kind":"text","viewColumn":1,"index":4,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/CHANGELOG.md"} |

**[seq=24, time=2026-04-12T15:21:22.536Z] TAB v24 -> v25** — 10 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 2 | 1 |
| CHANGE | `1.tabLabels.0` | "CHANGELOG.md" | "webview.html" |
| REMOVE | `1.tabLabels.1` | "webview.html" |  |
| CHANGE | `1.tabRefIds.0` | "tab-118" | "tab-116" |
| REMOVE | `1.tabRefIds.1` | "tab-116" |  |
| CHANGE | `1.tabs.0.tabRefId` | "tab-118" | "tab-116" |
| CHANGE | `1.tabs.0.label` | "CHANGELOG.md" | "webview.html" |
| CHANGE | `1.tabs.0.isActive` | false | true |
| CHANGE | `1.tabs.0.uri` | "file:///workspace/CHANGELOG.md" | "file:///workspace/webview.html" |
| REMOVE | `1.tabs.1` | {"tabRefId":"tab-116","label":"webview.html","kind":"text","viewColumn":2,"index":1,"isActive":true,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |  |

**[seq=25, time=2026-04-12T15:21:22.536Z] TAB v25 -> v26** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.tabCount` | 5 | 6 |
| CREATE | `0.tabLabels.5` |  | "webview.html" |
| CREATE | `0.tabRefIds.5` |  | "tab-120" |
| CREATE | `0.tabs.5` |  | {"tabRefId":"tab-120","label":"webview.html","kind":"text","viewColumn":1,"index":5,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |

**[seq=26, time=2026-04-12T15:21:22.536Z] GROUP v26 -> v27** — 19 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-54" | "group-56" |
| CHANGE | `0.activeTabRefId` | "tab-112" | "tab-121" |
| CHANGE | `0.tabRefIds.0` | "tab-113" | "tab-122" |
| CHANGE | `0.tabRefIds.1` | "tab-114" | "tab-123" |
| CHANGE | `0.tabRefIds.2` | "tab-115" | "tab-124" |
| CHANGE | `0.tabRefIds.3` | "tab-112" | "tab-121" |
| CHANGE | `0.tabRefIds.4` | "tab-119" | "tab-125" |
| CHANGE | `0.tabRefIds.5` | "tab-120" | "tab-126" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-113" | "tab-122" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-114" | "tab-123" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-115" | "tab-124" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-112" | "tab-121" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-119" | "tab-125" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-120" | "tab-126" |
| CHANGE | `1.groupRefId` | "group-55" | "group-57" |
| CHANGE | `1.activeTabRefId` | "tab-116" | null |
| CHANGE | `1.tabRefIds.0` | "tab-116" | "tab-127" |
| CHANGE | `1.tabs.0.tabRefId` | "tab-116" | "tab-127" |
| CHANGE | `1.tabs.0.isActive` | true | false |

**[seq=27, time=2026-04-12T15:21:22.536Z] TAB v27 -> v28** — 4 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `1.tabCount` | 1 | 0 |
| REMOVE | `1.tabLabels.0` | "webview.html" |  |
| REMOVE | `1.tabRefIds.0` | "tab-127" |  |
| REMOVE | `1.tabs.0` | {"tabRefId":"tab-127","label":"webview.html","kind":"text","viewColumn":2,"index":0,"isActive":false,"isDirty":false,"isPinned":false,"isPreview":false,"uri":"file:///workspace/webview.html"} |  |

**[seq=28, time=2026-04-12T15:21:22.544Z] GROUP v28 -> v29** — 15 change(s)

| Type | Path | Old Value | New Value |
|------|------|-----------|-----------|
| CHANGE | `0.groupRefId` | "group-56" | "group-58" |
| CHANGE | `0.activeTabRefId` | "tab-121" | "tab-128" |
| CHANGE | `0.tabRefIds.0` | "tab-122" | "tab-129" |
| CHANGE | `0.tabRefIds.1` | "tab-123" | "tab-130" |
| CHANGE | `0.tabRefIds.2` | "tab-124" | "tab-131" |
| CHANGE | `0.tabRefIds.3` | "tab-121" | "tab-128" |
| CHANGE | `0.tabRefIds.4` | "tab-125" | "tab-132" |
| CHANGE | `0.tabRefIds.5` | "tab-126" | "tab-133" |
| CHANGE | `0.tabs.0.tabRefId` | "tab-122" | "tab-129" |
| CHANGE | `0.tabs.1.tabRefId` | "tab-123" | "tab-130" |
| CHANGE | `0.tabs.2.tabRefId` | "tab-124" | "tab-131" |
| CHANGE | `0.tabs.3.tabRefId` | "tab-121" | "tab-128" |
| CHANGE | `0.tabs.4.tabRefId` | "tab-125" | "tab-132" |
| CHANGE | `0.tabs.5.tabRefId` | "tab-126" | "tab-133" |
| REMOVE | `1` | {"groupRefId":"group-57","viewColumn":2,"isActive":false,"activeTabRefId":null,"tabCount":0,"tabLabels":[],"tabRefIds":[],"tabs":[]} |  |

---
