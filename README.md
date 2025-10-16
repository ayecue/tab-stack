# Tab Stack

Tab Stack is a Visual Studio Code extension for capturing, curating, and recalling complete editor layouts. Save named tab groups, snapshot every open column, jump between task-focused workspaces with quick slots, and keep your tab setup synchronized while you work.

![Preview](https://github.com/ayecue/tab-stack/blob/main/assets/preview.gif?raw=true)

## Highlights

- **Save named tab groups** and reopen entire working sets with a single click.
- **Capture timestamped snapshots** of every open tab and roll back to any previous state.
- **Assign quick slots (1–9)** to your favourite groups and recall them instantly through the Command Palette or keyboard shortcuts.
- **Quick switch** between the two most recently used layouts when you are bouncing between tasks.
- **Visual overview** of columns, pinned tabs, and history from a dedicated activity bar view.

## Installation

### From the Marketplace

Search for **“Tab Stack”** by `ayecue` in the Extensions Marketplace (or follow the link once it is published) and click **Install**.

## Getting started

1. Open the **Tab Stack** view from the activity bar.
2. Use the **Quick Actions** panel to refresh the view, save the current layout as a group, capture snapshots, or close all tabs.
3. Manage saved groups and snapshot history from the collections pane. Each group entry lets you:
	- Apply or clear the group selection.
	- Assign a quick slot (1–9) via the dropdown beside the group name.
	- Remove groups or history entries without leaving the view.
4. When you capture snapshots, the latest entry appears in the history list and can be restored later or assigned to a quick slot.
5. Use the keyboard shortcuts below to recall layouts without leaving the editor.

## Commands & shortcuts

| Command ID | Description | Default keybinding* |
| --- | --- | --- |
| `tabStack.refresh` | Sync the view with the current VS Code tab state. | — |
| `tabStack.quickSwitch` | Toggle between the two most recent tab states. | `Ctrl`/`Cmd` + `Alt` + `Shift` + `0` |
| `tabStack.clearSelection` | Return to the live layout without a saved group applied. | — |
| `tabStack.switchGroup` | Choose and apply any saved group. | — |
| `tabStack.createGroup` | Save the current set of open tabs as a reusable group. | — |
| `tabStack.deleteGroup` | Remove a saved group. | — |
| `tabStack.snapshot` | Capture a snapshot of every open tab (saved to history). | — |
| `tabStack.restoreSnapshot` | Restore one of the saved snapshots. | — |
| `tabStack.deleteSnapshot` | Delete a snapshot from history. | — |
| `tabStack.quickSlot1` – `tabStack.quickSlot9` | Apply the group assigned to quick slots 1–9. | `Ctrl`/`Cmd` + `Alt` + `Shift` + `1` … `9` |

\*On macOS the shortcuts use `Cmd` instead of `Ctrl`.

## Tips

- Assign quick slots straight from the **Groups** list—select a slot in the dropdown beside a group to bind it to that number. The Command Palette entries and keybindings will follow the new assignment immediately.
- Use **Quick Switch** (`tabStack.quickSwitch`) to bounce between two active contexts, perfect for code reviews or pairing sessions.
- The extension now keeps an eye on editor column sizing, automatically refreshing the saved state when you resize or rearrange splits so your snapshots stay accurate.
- Snapshots are timestamped automatically, making it easy to spot the state you want to restore even after a long session.

## Contributing & feedback

Bug reports and feature suggestions are welcome! Open an issue on [GitHub](https://github.com/ayecue/tab-stack/issues). If you are contributing code, run `npm run compile` before submitting a pull request so the bundled assets stay up to date.

---

Enjoy a tidy editor! Tab Stack keeps your context safe so you can focus on building.

