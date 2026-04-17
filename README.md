# Tab Stack

Save and restore complete VS Code tab layouts with groups, snapshots, add-ons, and Git-aware workflows.

Tab Stack keeps your **tabs, layout, and cursor position** per tab so you can jump between tasks without losing context.

<p align="center">
  <img src="https://github.com/ayecue/tab-stack/blob/main/assets/preview.gif?raw=true" alt="Preview" width="600" />
</p>

---

## Why use Tab Stack?

VS Code already remembers a bit of your layout, but it is not built for:

- Quickly switching between **named workspaces** (e.g. "Feature A", "Bugfix 123")
- Keeping a **history of layouts** you can roll back to
- Re-using the same **tooling tabs** on top of any project
- Automatically tying groups to **Git branches**

Tab Stack does all of that while restoring the **exact tabs, columns, and cursor/selection** per tab.

---

## Features at a glance

- **Groups** - Save named tab layouts and re-apply them with a click
- **Snapshots (history)** - Capture "points in time" of all open tabs and restore later
- **Add-ons** - Reusable tab sets you can apply on top of your current layout (nothing gets closed)
- **Quick slots 1-9** - Assign groups to numbered slots for instant recall via shortcuts
- **Quick Switch** - Jump between your last two states (great for ping-ponging between tasks)
- **Git integration** - Auto-create and/or auto-switch groups when you change branches, with configurable prefixes like `git:main`
- **Layout fidelity** - Columns and splits are tracked; selections/cursors are persisted per tab (text editors and notebooks)
- **Import/Export** - Backup and share your collections across workspaces or machines
- **Multi-root aware** - Choose which workspace folder Tab Stack uses as its "master"

---

## Quick start

1. Open the **Tab Stack** view from the activity bar.
2. Arrange your tabs and editor columns as you like.
3. Click **Save Group** to capture the current layout.
4. (Optional) Assign the group to a **quick slot (1-9)** for one-keystroke recall.
5. Use **Quick Switch** to bounce between the two most recent states:
	 - `Cmd`/`Ctrl` + `Alt` + `Shift` + `0`
6. (Optional) Enable **Git integration** in the Settings panel to automatically create/switch groups per branch.

That is it - from here you can start building up groups, snapshots, and add-ons as your workflow evolves.

---

## AI workflow

- Repo instructions and reusable prompts live under `.github/`
- `ARCHITECTURE.md` is the Octocode-first architecture map for AI and contributors
- Workspace MCP server configuration lives in `.vscode/mcp.json`
- `AI_SETUP.md` documents the provided MCP servers, prompt files, and Octocode-backed research workflow
- `npm run octo:index` refreshes the local Octocode index
- `npm run octo:watch` keeps the Octocode index current during active work

---

## Commands & keybindings

Most functionality is available both through the **Tab Stack view** and the **Command Palette**.

### Groups

| Command ID | What it does | Default keybinding |
| --- | --- | --- |
| `tabStack.createGroup` | Save current tabs as a named group | - |
| `tabStack.switchGroup` | Pick and apply a saved group | - |
| `tabStack.deleteGroup` | Delete a saved group | - |
| `tabStack.clearSelection` | Clear the current group selection | - |
| `tabStack.exportGroup` | Export a group to a `.tabstack` file | - |
| `tabStack.importGroup` | Import a group from a `.tabstack` file | - |

### Snapshots (history)

| Command ID | What it does | Default keybinding |
| --- | --- | --- |
| `tabStack.snapshot` | Capture a snapshot of all open tabs | - |
| `tabStack.restoreSnapshot` | Restore a snapshot from history | - |
| `tabStack.deleteSnapshot` | Delete a snapshot from history | - |

### Add-ons

| Command ID | What it does | Default keybinding |
| --- | --- | --- |
| `tabStack.createAddon` | Save current tabs as an add-on (overlay) | - |
| `tabStack.applyAddon` | Apply an add-on on top of the current layout | - |
| `tabStack.deleteAddon` | Delete an add-on | - |

### Quick slots & switching

| Command ID | What it does | Default keybinding* |
| --- | --- | --- |
| `tabStack.quickSwitch` | Toggle between the two most recent tab states | `Ctrl`/`Cmd` + `Alt` + `Shift` + `0` |
| `tabStack.quickSlot1` – `tabStack.quickSlot9` | Apply groups assigned to quick slots 1–9 | `Ctrl`/`Cmd` + `Alt` + `Shift` + `1` … `9` |
| `tabStack.assignQuickSlot` | Assign a group to a quick slot (1–9) | - |
| `tabStack.clearQuickSlot` | Clear a quick slot assignment | - |

### Utility

| Command ID | What it does | Default keybinding |
| --- | --- | --- |
| `tabStack.refresh` | Refresh the Tab Stack view | - |
| `tabStack.clearAllTabs` | Close all open tabs | - |

\*On macOS the shortcuts use `Cmd` instead of `Ctrl`.

---

## URI handler

Tab Stack registers a URI handler so you can trigger commands from **outside VS Code** — browsers, terminals, documentation, links in chat, etc.

The URI format is:

```
vscode://ayecue.tab-stack/<path>?<params>
```

### Supported URIs

| URI path | Parameters | Example |
| --- | --- | --- |
| `/switch-group` | `name` (group name) | `vscode://ayecue.tab-stack/switch-group?name=Sprint` |
| `/create-group` | `name` (group name) | `vscode://ayecue.tab-stack/create-group?name=Debug` |
| `/delete-group` | `name` (group name) | `vscode://ayecue.tab-stack/delete-group?name=Old` |
| `/snapshot` | — | `vscode://ayecue.tab-stack/snapshot` |
| `/restore-snapshot` | `name` (snapshot name) | `vscode://ayecue.tab-stack/restore-snapshot?name=2024-01-15` |
| `/apply-addon` | `name` (add-on name) | `vscode://ayecue.tab-stack/apply-addon?name=Debug%20Tools` |
| `/export-group` | `name` (group name) | `vscode://ayecue.tab-stack/export-group?name=Sprint` |
| `/import-group` | `file` (absolute path) | `vscode://ayecue.tab-stack/import-group?file=/path/to/group.tabstack` |
| `/quick-switch` | — | `vscode://ayecue.tab-stack/quick-switch` |
| `/quick-slot` | `slot` (1–9) | `vscode://ayecue.tab-stack/quick-slot?slot=1` |
| `/assign-quick-slot` | `name`, `slot` | `vscode://ayecue.tab-stack/assign-quick-slot?name=Sprint&slot=1` |

---

## Settings

You can configure Tab Stack from **VS Code Settings** or from the **Settings panel** inside the Tab Stack view.

Key options:

- **Storage**
	- `tabStack.storage.type` - Where to store state:
			- `file` (default) - `.vscode/tmstate.json` in your workspace
			- `workspace-state` - VS Code’s internal workspace state (hidden, not in git)

- **Workspace scope**
	- `tabStack.masterWorkspaceFolder` - Which workspace folder Tab Stack uses as its main reference (defaults to the first folder)

- **Git integration**
	- `tabStack.gitIntegration.enabled` - Turn Git-based group management on/off
	- `tabStack.gitIntegration.mode` - Behavior when branches change:
		- `auto-switch` - Switch to an existing group for the branch
		- `auto-create` - Create a new group for the branch and switch to it
		- `full-auto` (default) - Combination of auto-create and auto-switch
	- `tabStack.gitIntegration.groupPrefix` - Prefix for Git groups (default `git:`), e.g. `git:main`, `git:feature/login`

- **History**
	- `tabStack.history.maxEntries` - Maximum number of snapshots to retain (default 10)

- **Appearance**
	- `tabStack.appearance.tabKindColors` - Color rules for tab kind labels and icons. Each rule matches by tab kind and optionally by a label regex pattern. The first matching rule wins.

	Example (default):
	```json
	[
	  { "kind": "tabInputText", "color": "#2472c8" },
	  { "kind": "tabInputTextDiff", "color": "#f44747" },
	  { "kind": "tabInputCustom", "color": "#c586c0" },
	  { "kind": "tabInputWebview", "color": "#2aa198" },
	  { "kind": "tabInputNotebook", "color": "#16825d" },
	  { "kind": "tabInputNotebookDiff", "color": "#c19c00" },
	  { "kind": "tabInputTerminal", "color": "#3b8eea" },
	  { "kind": "unknown", "pattern": "^Settings$", "color": "#8F38E5" },
	  { "kind": "unknown", "pattern": "^Extensions$", "color": "#c586c0" },
	  { "kind": "unknown", "pattern": "^Welcome$", "color": "#F5276C" },
	  { "kind": "tabInputWebview", "pattern": "^Release Notes: [0-9.]+$", "color": "#82E8E8" }
	]
	```

- **Tab recovery mappings**
	- `tabStack.tabRecoveryMappings` - Mapping of identifiers to recovery commands for tab types that VS Code cannot reopen automatically (e.g. Settings, Extensions, Keyboard Shortcuts). When Tab Stack detects a saved tab that matches a mapping, it executes the specified command to recreate the tab during restore.

	Values can be a simple command ID string (the key is used as a label regex) or an object with:
	- `command` - VS Code command ID to execute
	- `match` (optional) - Regex criteria matched against tab properties (`label`, `kind`, `uri`, `viewType`). All specified fields must match. If `label` is omitted inside `match`, the mapping key is used as the label pattern
	- `args` (optional) - Arguments to pass to the command. Supports `{{property}}` interpolation from the tab info (e.g. `{{viewColumn}}`, `{{label}}`). Non-string values (booleans, numbers, objects) are passed as-is
	- `nextTickDelay` (optional) - Milliseconds to wait after command execution before checking for the tab (default `0`)

	Example (default):
	```json
	{
	  "^Settings$": {
	    "command": "workbench.action.openSettings2",
	    "args": [{ "openToSide": false }]
	  },
	  "^Keyboard Shortcuts$": "workbench.action.openGlobalKeybindings",
	  "^Extensions$": "workbench.view.extensions",
	  "^Welcome$": "workbench.action.openWalkthrough",
	  "^Release Notes: [0-9.]+$": "update.showCurrentReleaseNotes"
	}
	```

---

## Notes

- State is tracked **per workspace** - different workspaces can have independent collections.

For detailed changes over time, see the [Changelog](https://github.com/ayecue/tab-stack/blob/main/CHANGELOG.md).

---

## Contributing & feedback

Bug reports, ideas, and PRs are very welcome.

- Issues: <https://github.com/ayecue/tab-stack/issues>

If Tab Stack improves your workflow, consider sharing it with your team or leaving a review in the Marketplace.

