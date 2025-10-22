# Changelog

All notable changes to this project will be documented in this file.

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