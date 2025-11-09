# Changelog

All notable changes to this project will be documented in this file.

## [1.2.4] - 10-11-2025

### Fix

- Fix quick slot selection when reassigning an index

## [1.2.3] - 09-11-2025

### Improved

- Pass `retainContextWhenHidden` option to webview so it does not reload every time it's selected in the sidebar

## [1.2.2] - 09-11-2025

### Fix

- Fix quick switch state synchronization - Thanks for reporting to [@Vadim-Kul](https://github.com/Vadim-Kul)
- Fix view mode toggle overflow issue by adding proper box-sizing to prevent it from extending beyond its container

## [1.2.1] - 09-11-2025

### Fix

- Replace proposed API usage (`workspace.encode`/`workspace.decode`) with standard JavaScript `TextEncoder`/`TextDecoder` for better compatibility with VS Code forks like Cursor IDE - Thanks for reporting to [@Vadim-Kul](https://github.com/Vadim-Kul)

## [1.2.0] - 09-11-2025

### Added

- Drag and drop support for tabs between columns
- Import/Export functionality for tab collections
- Tab filters for better organization
- Quick button for creating new addons
- Rename functionality for addons
- Collapsible collection panels for better space management
- Collection item tooltips showing tab and column counts
- Max history setting for webview

### Improved

- UI cleanup and component refactoring
- Toolbar element repositioning for better UX
- State synchronization improvements
- Filter UI enhancements
- Drag and drop UI improvements
- Icon assets updated

## [1.1.0] - 26-10-2025

### Fix

- Show properly that webview tabs cannot be recovered
- Fix tab search visual alignment

### Added

- Add addon states
- Add indicator tab state gets applied

## [1.0.10] - 26-10-2025

### Fix

- Fix selection not getting persisted when group gets deselected

### Added

- Check for state changes prior to applying a group or snapshot

## [1.0.9] - 26-10-2025

### Added

- Improve handling of unsaved tabs when switching groups

## [1.0.8] - 23-10-2025

### Added

- Groups are now automatically sorted by most recently selected (most recent first)
- Git integration with context-sensitive group management
  - AutoSwitch mode: Automatically switch to a group when switching Git branches (if group exists)
  - AutoCreate mode: Automatically create a group for new Git branches
  - FullAuto mode: Combination of AutoSwitch and AutoCreate
  - Configurable group prefix for Git-based groups
- Settings panel in webview for managing extension configuration
- Workspace folder selection from the UI
- Timestamp tracking on group entities (`lastSelectedAt`)

## [1.0.7] - 19-10-2025

### Fix

- fix caching issue in group items component of webview
- fix tab list view interactions

## [1.0.6] - 18-10-2025

### Added

- optimization in regards of disposing handles

## [1.0.5] - 18-10-2025

### Fix

- fix clearing of quick slots

### Added

- clean up structure to support multiple parallel webviews

## [1.0.4] - 18-10-2025

### Fix

- fix tab states getting overridden by too fast switching

## [1.0.3] - 18-10-2025

### Fix

- fix flaky active tab recovery in all non active tab groups
- fix quick slot reassignment

## [1.0.2] - 17-10-2025

### Fix

- fix tabs as group button in navbar

### Added

- support tabs which are not text documents
- support recovery of pinned tabs
- improve render state
- add renaming of groups
- add coloring depending on tab kind
- add indicator in case tab is not recoverable

## [1.0.1] - 17-10-2025

### Fix

- add build for browser version

## [1.0.0] - 17-10-2025

### Added

- initial release