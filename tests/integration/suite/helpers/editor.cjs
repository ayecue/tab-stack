const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const { CMD, waitUntil, sleep } = require('./core.cjs');

const GROUP_FOCUS_COMMANDS = {
  [vscode.ViewColumn.One]: 'workbench.action.focusFirstEditorGroup',
  [vscode.ViewColumn.Two]: 'workbench.action.focusSecondEditorGroup',
  [vscode.ViewColumn.Three]: 'workbench.action.focusThirdEditorGroup',
  [vscode.ViewColumn.Four]: 'workbench.action.focusFourthEditorGroup',
  [vscode.ViewColumn.Five]: 'workbench.action.focusFifthEditorGroup',
  [vscode.ViewColumn.Six]: 'workbench.action.focusSixthEditorGroup',
  [vscode.ViewColumn.Seven]: 'workbench.action.focusSeventhEditorGroup',
  [vscode.ViewColumn.Eight]: 'workbench.action.focusEighthEditorGroup',
  [vscode.ViewColumn.Nine]: 'workbench.action.focusNinthEditorGroup'
};

const OPEN_EDITOR_AT_INDEX_COMMANDS = {
  0: 'workbench.action.openEditorAtIndex1',
  1: 'workbench.action.openEditorAtIndex2',
  2: 'workbench.action.openEditorAtIndex3',
  3: 'workbench.action.openEditorAtIndex4',
  4: 'workbench.action.openEditorAtIndex5',
  5: 'workbench.action.openEditorAtIndex6',
  6: 'workbench.action.openEditorAtIndex7',
  7: 'workbench.action.openEditorAtIndex8',
  8: 'workbench.action.openEditorAtIndex9'
};

async function focusEditorGroup(viewColumn) {
  const command = GROUP_FOCUS_COMMANDS[viewColumn];
  if (!command) {
    return;
  }

  try {
    await vscode.commands.executeCommand(command);
  } catch (_) {
    // Ignore when the requested group does not exist yet.
  }
}

async function focusOpenTabInGroup(relativePath, viewColumn) {
  if (viewColumn == null) {
    return false;
  }

  const targetGroup = vscode.window.tabGroups.all.find(
    (group) => group.viewColumn === viewColumn
  );
  if (!targetGroup) {
    return false;
  }

  const baseName = path.basename(relativePath);
  const targetIndex = targetGroup.tabs.findIndex((tab) => tab.label === baseName);
  const command = OPEN_EDITOR_AT_INDEX_COMMANDS[targetIndex];
  if (command == null) {
    return false;
  }

  try {
    await focusEditorGroup(viewColumn);
    await vscode.commands.executeCommand(command);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Open a workspace file as an editor tab and wait for it to appear.
 */
async function openFile(relativePath, opts = {}) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  assert.ok(workspaceFolder, 'A workspace folder must be open');
  const uri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, relativePath));
  const doc = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(doc, {
    viewColumn: opts.viewColumn ?? vscode.ViewColumn.Active,
    preview: opts.preview ?? false,
    preserveFocus: true
  });
  // Wait for the tab to actually appear in VS Code
  await waitUntil(
    () => {
      const allLabels = vscode.window.tabGroups.all.flatMap((g) => g.tabs.map((t) => t.label));
      return allLabels.some((l) => l.includes(path.basename(relativePath, path.extname(relativePath))));
    },
    `tab "${relativePath}" to appear`
  );
}

/**
 * Return an array describing the currently open VS Code tab groups.
 */
function getOpenTabs() {
  return vscode.window.tabGroups.all.map((group) => ({
    viewColumn: group.viewColumn,
    tabCount: group.tabs.length,
    tabLabels: group.tabs.map((t) => t.label)
  }));
}

/**
 * Count total open editor tabs across all groups.
 */
function totalTabCount() {
  return vscode.window.tabGroups.all.reduce((sum, g) => sum + g.tabs.length, 0);
}

/**
 * Close all open editor tabs and wait for count to reach 0.
 */
async function closeAllTabs() {
  // Use VS Code's built-in command which handles edge cases
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');

  // If any tabs survive, force close them via the API
  const remaining = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
  if (remaining.length > 0) {
    await vscode.window.tabGroups.close(remaining, true);
  }

  await waitUntil(
    () => totalTabCount() === 0,
    'all tabs to close'
  );
}

/**
 * Open multiple workspace files, optionally across different editor columns.
 * Waits for all tabs to appear before returning.
 */
async function openFiles(entries) {
  // Capture sync time before opening files so we can wait for sync after
  const fromTime = await vscode.commands.executeCommand(CMD('__test__getLastSyncTime'));
  for (const { file, column } of entries) {
    await openFile(file, { viewColumn: column ?? vscode.ViewColumn.Active });
  }
  // Wait for the expected tab count
  await waitUntil(
    () => totalTabCount() >= entries.length,
    `all ${entries.length} tabs to appear`
  );
  await vscode.commands.executeCommand(CMD('__test__waitForSync'), String(fromTime));
  await sleep(200);
}

/**
 * Get detailed tab state including per-tab properties like isPinned, isActive, kind.
 */
async function getDetailedTabState() {
  return vscode.commands.executeCommand(CMD('__test__getTabState'));
}

/**
 * Open a file, set cursor to a specific position, and wait for it to be the active editor.
 */
async function openFileWithSelection(relativePath, line, character, opts = {}) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  assert.ok(workspaceFolder, 'A workspace folder must be open');
  const uri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, relativePath));
  const doc = await vscode.workspace.openTextDocument(uri);
  const requestedViewColumn = opts.viewColumn;
  const pos = new vscode.Position(line, character);
  const selection = new vscode.Range(pos, pos);
  const baseName = path.basename(relativePath);

  const isTargetEditorActive = () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor?.document.uri.toString() !== uri.toString()) {
      return false;
    }

    if (requestedViewColumn == null) {
      return true;
    }

    return activeEditor.viewColumn === requestedViewColumn;
  };

  const isTargetTabActive = () => {
    if (requestedViewColumn == null) {
      return false;
    }

    const activeGroup = vscode.window.tabGroups.activeTabGroup;
    if (activeGroup?.viewColumn !== requestedViewColumn) {
      return false;
    }

    return activeGroup.activeTab?.label === baseName;
  };

  const isTargetReady = () => isTargetEditorActive() || isTargetTabActive();

  const openTargetEditor = async () => {
    if (requestedViewColumn != null) {
      await vscode.commands.executeCommand('vscode.open', uri, {
        viewColumn: requestedViewColumn,
        preview: false,
        preserveFocus: false,
        selection
      });
      return vscode.window.activeTextEditor;
    }

    return vscode.window.showTextDocument(doc, {
      viewColumn: vscode.ViewColumn.Active,
      preview: false,
      preserveFocus: false
    });
  };

  await focusOpenTabInGroup(relativePath, requestedViewColumn);
  await focusEditorGroup(opts.viewColumn);

  let editor = isTargetEditorActive()
    ? vscode.window.activeTextEditor
    : await openTargetEditor();
  editor.selection = new vscode.Selection(pos, pos);
  editor.revealRange(new vscode.Range(pos, pos));

  for (let attempt = 0; attempt < 3; attempt++) {
    if (isTargetReady()) {
      break;
    }

    await focusOpenTabInGroup(relativePath, requestedViewColumn);
    await focusEditorGroup(opts.viewColumn);
    editor = isTargetEditorActive()
      ? vscode.window.activeTextEditor
      : await openTargetEditor();
    editor.selection = new vscode.Selection(pos, pos);
    editor.revealRange(new vscode.Range(pos, pos));
    await sleep(100);
  }

  // Wait for this file to be the active editor (not just visible)
  try {
    await waitUntil(
      () => isTargetReady(),
      `"${relativePath}" to become active editor`
    );
  } catch (error) {
    const activeEditor = vscode.window.activeTextEditor;
    const activeGroup = vscode.window.tabGroups.activeTabGroup;
    const groups = vscode.window.tabGroups.all.map((group) => ({
      viewColumn: group.viewColumn,
      isActive: group.isActive,
      activeTab: group.activeTab?.label ?? null,
      tabLabels: group.tabs.map((tab) => tab.label)
    }));
    const activeEditorInfo = activeEditor == null
      ? 'none'
      : `${activeEditor.document.uri.toString()}@${activeEditor.viewColumn}`;
    throw new Error(
      `${error.message}. Active group=${activeGroup?.viewColumn ?? 'none'}. Active editor=${activeEditorInfo}. Groups=${JSON.stringify(groups)}`
    );
  }
}

/**
 * Pin the currently active editor tab and wait for pin state to apply.
 */
async function pinActiveEditor() {
  await vscode.commands.executeCommand('workbench.action.pinEditor');
  await waitUntil(
    () => {
      const activeGroup = vscode.window.tabGroups.activeTabGroup;
      const activeTab = activeGroup?.activeTab;
      return activeTab?.isPinned === true;
    },
    'active tab to become pinned'
  );
}

module.exports = {
  openFile,
  openFiles,
  openFileWithSelection,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  getDetailedTabState,
  pinActiveEditor
};
