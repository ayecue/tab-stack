# Changelog

All notable changes to this project will be documented in this file.

## [1.3.1] - 07-04-2026

### Added

- **Close others**: Right-click context menu on tab items with options to close all other editors across all groups, or close others within the same group only

### Fix

- **Duplicate tabs on addon**: Tabs that already exist in the target editor group are now properly detected and skipped during addon application
- **Stale tab references**: Fixed an issue where removed tabs could still appear in the tab state due to stale ID lookups

## [1.3.0] - 03-04-2026

### Added

- **Terminal support**: Terminal tabs can now be saved and restored
- **Group import/export**: Save groups as `.tabstack` files and import them across workspaces or machines
- **URI handler**: Trigger Tab Stack commands from outside VS Code via `vscode://ayecue.tab-stack/<path>` URIs (e.g. `/switch-group`, `/snapshot`, `/quick-slot`, `/import-group`, `/export-group`)
- **Tab recovery mappings**: New `tabStack.tabRecoveryMappings` setting to configure how non-recoverable tab types (e.g. Settings, Extensions) are restored, with support for command arguments and `{{property}}` interpolation
- **Tab kind colors**: New `tabStack.appearance.tabKindColors` setting to customize colors for tab kind labels and icons, with optional regex pattern matching against tab labels
- **Quick slot keypad**: Visual keypad UI for assigning groups to quick slots 1–9
- **Tooltips**: New tooltip system with consistent positioning and arrow indicators across all UI elements

### Improved

- **File icons**: Switched to VS Code's native icon theme for consistent file type icons
- **Settings panel**: Uses full available width; split into dedicated sections for better readability
- **UI performance**: Optimized component architecture with better separation of concerns
- **Tab tracking**: More reliable tab restoration with improved recovery and group handling
- **Word wrapping**: Fixed layout issues in the sidebar when the panel is narrow

## [1.2.7] - 16-11-2025

### Fix

- Always pass git service regardless if git extension is available or not

## [1.2.6] - 15-11-2025

### Added

- **Storage type setting**: Users can now choose between file-based storage (`.vscode/tmstate.json`) and VS Code's workspace state storage (hidden, not in git)
- **Selection persistence**: The cursor/selection position is now persisted for each tab and restored when applying groups, snapshots, or using quick switch

## [1.2.5] - 10-11-2025

### Improved

- Resync with VSCode tab groups after applying groups or snapshot
- Change "Save current tabs as add-on" toolbar position to align with collections toggle
- Optimize debounce delays

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