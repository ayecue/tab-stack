# Tab Stack

Save, switch, and recover complete VS Code tab layouts. Git‑aware, renameable, and fast.

Create named groups and snapshots, assign quick slots for instant recall, and optionally auto‑switch groups when you change branches.

![Preview](https://github.com/ayecue/tab-stack/blob/main/assets/preview.gif?raw=true)

## Highlights

- **Save named tab groups** and reopen entire working sets with a click.
- **Capture snapshots** of every open tab and restore them later.
- **Assign quick slots (1–9)** for instant recall via UI, palette, or keys.
- **Git‑aware workflows** — auto‑create or auto‑switch groups on branch change (configurable).
- **Smart ordering** — groups are sorted by most recently used.
- **Multi‑root friendly** — choose which workspace folder to track.

## Installation

### From the Marketplace

Search for **“Tab Stack”** by `ayecue` in the Extensions Marketplace (or follow the link once it is published) and click **Install**.

## Getting started

1. Open the **Tab Stack** view from the activity bar.
2. Click **Save Group** to capture your current layout.
3. In **Groups**:
  - Click the edit icon to rename the group (names are fully editable).
  - Assign a quick slot (1–9) from the dropdown for instant recall.
4. In **Snapshots**:
  - Click the camera to capture a snapshot.
5. (Optional) **Git Integration**:
  - Open the Settings panel and enable Git Integration. Choose auto‑switch, auto‑create, or full‑auto. Optionally set a prefix like `git:`.
6. Use shortcuts:
  - Quick Switch: Cmd/Ctrl + Alt + Shift + 0
  - Quick Slots: Cmd/Ctrl + Alt + Shift + 1…9

## Commands & shortcuts

| Command ID | Description | Default keybinding* |
| --- | --- | --- |
| `tabStack.refresh` | Sync the view with the current VS Code tab state. | — |
| `tabStack.quickSwitch` | Toggle between the two most recent tab states. | `Ctrl`/`Cmd` + `Alt` + `Shift` + `0` |
| `tabStack.clearSelection` | Return to the live layout without a saved group applied. | — |
| `tabStack.switchGroup` | Choose and apply any saved group. | — |
| `tabStack.createGroup` | Save the current set of open tabs as a reusable group. | — |
| `tabStack.assignQuickSlot` | Assign the current group to a quick slot (also available in the UI). | — |
| `tabStack.deleteGroup` | Remove a saved group. | — |
| `tabStack.snapshot` | Capture a snapshot of every open tab (saved to history). | — |
| `tabStack.restoreSnapshot` | Restore one of the saved snapshots. | — |
| `tabStack.deleteSnapshot` | Delete a snapshot from history. | — |
| `tabStack.quickSlot1` – `tabStack.quickSlot9` | Apply the group assigned to quick slots 1–9. | `Ctrl`/`Cmd` + `Alt` + `Shift` + `1` … `9` |

\*On macOS the shortcuts use `Cmd` instead of `Ctrl`.

## Tips

- **Rename groups anytime** — rename from the Groups list; saved tabs and quick slots stay intact.
- **Git Integration modes** — choose auto‑switch, auto‑create, or full‑auto to match your workflow.
- **Custom prefixes** — keep Git‑created groups tidy with a prefix like `git:` (e.g., `git:main`).
- **MRU sorting** — your most recently used groups surface to the top automatically.
- **Snapshots** — labels with timestamps make restores obvious.
- **Quick slots from the UI** — assign 1–9 directly from the Groups list.
- **Quick Switch** — jump between two active contexts with a single shortcut.
- **Layout accuracy** — column sizing and splits are tracked and refreshed automatically.
- **Multi‑root** — pick which workspace folder to track in Settings.

## Configuration

Tab Stack can be configured through the Settings panel in the webview or via VS Code settings:

### Git Integration Settings

- `tabStack.gitIntegration.enabled` (boolean): Enable automatic group management based on Git branch changes.
  - Default: `false`

- `tabStack.gitIntegration.mode` (string): How Tab Stack manages groups based on Git branches.
  - Values: `auto-switch`, `auto-create`, `full-auto`
  - Default: `full-auto`
  - Behavior:
    - `auto-switch`: Automatically switch to an existing group when the branch changes
    - `auto-create`: Automatically create a group for new branches and switch to it
    - `full-auto`: Create groups for new branches and auto-switch between them

- `tabStack.gitIntegration.groupPrefix` (string): Prefix for automatically created Git-based groups.
  - Default: `"git:"`
  - Example: `git:main`, `git:feature/login`

### Workspace Settings

- `tabStack.masterWorkspaceFolder` (string | null): Path to the workspace folder used for storing tab state and tracking Git branches.
  - If not set, the first workspace folder will be used.
  - You can also configure this from the Settings panel in the Tab Stack view.

## Contributing & feedback

Bug reports and feature suggestions are welcome! Open an issue on [GitHub](https://github.com/ayecue/tab-stack/issues).

---

Enjoy a tidy editor! Tab Stack keeps your context safe so you can focus on building.

