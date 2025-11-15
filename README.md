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

## Commands & keybindings

Most functionality is available both through the **Tab Stack view** and the **Command Palette**.

| Command ID | What it does | Default keybinding* |
| --- | --- | --- |
| `tabStack.quickSwitch` | Toggle between the two most recent tab states | `Ctrl`/`Cmd` + `Alt` + `Shift` + `0` |
| `tabStack.quickSlot1` - `tabStack.quickSlot9` | Apply groups assigned to quick slots 1-9 | `Ctrl`/`Cmd` + `Alt` + `Shift` + `1` ... `9` |
| `tabStack.createGroup` | Save current tabs as a named group | - |
| `tabStack.switchGroup` | Pick and apply a saved group | - |
| `tabStack.snapshot` | Capture a snapshot of all open tabs | - |
| `tabStack.restoreSnapshot` | Restore a snapshot from history | - |
| `tabStack.createAddon` | Save current tabs as an add-on (overlay) | - |
| `tabStack.applyAddon` | Apply an add-on on top of the current layout | - |

\*On macOS the shortcuts use `Cmd` instead of `Ctrl`.

Additional commands like refresh, delete group/add‑on/snapshot, and quick slot assignment are also available via the Command Palette and the Tab Stack UI.

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

---

## Notes & limitations

- Some tab types (such as certain webviews or terminals) cannot be reopened automatically by VS Code; Tab Stack marks these as **not recoverable** so you can spot them at a glance.
- State is tracked **per workspace** - different workspaces can have independent collections.

For detailed changes over time, see the [Changelog](https://github.com/ayecue/tab-stack/blob/main/CHANGELOG.md).

---

## Contributing & feedback

Bug reports, ideas, and PRs are very welcome.

- Issues: <https://github.com/ayecue/tab-stack/issues>

If Tab Stack improves your workflow, consider sharing it with your team or leaving a review in the Marketplace.

