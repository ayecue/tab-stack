const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const { CMD, waitUntil, sleep } = require('./core.cjs');

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
  const editor = await vscode.window.showTextDocument(doc, {
    viewColumn: opts.viewColumn ?? vscode.ViewColumn.Active,
    preview: false,
    preserveFocus: false
  });
  const pos = new vscode.Position(line, character);
  editor.selection = new vscode.Selection(pos, pos);
  editor.revealRange(new vscode.Range(pos, pos));
  // Wait for this file to be the active editor (not just visible)
  const baseName = path.basename(relativePath);
  await waitUntil(
    () => vscode.window.activeTextEditor?.document.uri.path.endsWith(baseName),
    `"${relativePath}" to become active editor`
  );
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
