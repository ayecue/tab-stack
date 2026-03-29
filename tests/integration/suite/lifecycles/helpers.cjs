const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

const EXTENSION_ID = 'ayecue.tab-stack';
const POLL_INTERVAL = 100;
const POLL_TIMEOUT = 10000;

function CMD(name) {
  return `tabStack.${name}`;
}

async function activateExtension() {
  const ext = vscode.extensions.getExtension(EXTENSION_ID);
  assert.ok(ext, 'Extension should be discoverable');
  if (!ext.isActive) {
    await ext.activate();
  }
  assert.strictEqual(ext.isActive, true, 'Extension should be active');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Poll until `predicate()` returns a truthy value, then return it.
 * @template T
 * @param {() => T | Promise<T>} predicate
 * @param {string} description
 * @param {number} [timeout]
 * @returns {Promise<T>}
 */
async function waitUntil(predicate, description, timeout = POLL_TIMEOUT) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await predicate();
    if (result) return result;
    await sleep(POLL_INTERVAL);
  }
  throw new Error(`Timed out waiting for: ${description}`);
}

async function openAndWaitWebview() {
  await vscode.commands.executeCommand(CMD('__test__openView'));
  await waitUntil(
    () => vscode.commands.executeCommand(CMD('__test__webviewReady')),
    'webview to become ready'
  );
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
  // Wait for extension's debounced sync to complete so internal state is up-to-date.
  // Without this, creating a group immediately after openFiles may capture stale state.
  const result = await vscode.commands.executeCommand(CMD('__test__waitForSync'), String(fromTime));
  if (!result) throw new Error('openFiles: sync timed out after tabs appeared');
  // Also wait for the second debounce (triggerStateUpdate, 10ms) to update state container
  await sleep(200);
}

/**
 * Wrap an operation that triggers a render event. Captures the current render
 * timestamp, runs the callback, then waits for a render after that timestamp.
 *
 * Usage:
 *   await trackRender(async () => {
 *     await vscode.commands.executeCommand(CMD('switchGroup'), groupId);
 *   });
 */
async function trackRender(callback) {
  const fromTime = await vscode.commands.executeCommand(CMD('__test__getLastRenderTime'));
  await callback();
  const result = await vscode.commands.executeCommand(CMD('__test__waitForRender'), String(fromTime));
  if (!result) throw new Error('trackRender timed out waiting for render event');
}

/**
 * Wrap an operation that triggers a sync event. Captures the current sync
 * timestamp, runs the callback, then waits for a sync after that timestamp.
 *
 * Usage:
 *   await trackSync(async () => {
 *     await vscode.commands.executeCommand(CMD('newGroup'));
 *   });
 */
async function trackSync(callback) {
  const fromTime = await vscode.commands.executeCommand(CMD('__test__getLastSyncTime'));
  await callback();
  const result = await vscode.commands.executeCommand(CMD('__test__waitForSync'), String(fromTime));
  if (!result) throw new Error('trackSync timed out waiting for sync event');
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

/**
 * Start capturing sync/notification messages.
 */
async function startCapture() {
  await vscode.commands.executeCommand(CMD('__test__startCapture'));
}

/**
 * Get captured sync/notification messages.
 */
async function getCaptured(clear = true) {
  return vscode.commands.executeCommand(CMD('__test__getCapturedMessages'), clear);
}

/**
 * Stop capture and dispose subscriptions.
 */
async function stopCapture() {
  await vscode.commands.executeCommand(CMD('__test__stopCapture'));
}

/**
 * Wait for captured sync messages to have at least `count` entries.
 */
async function waitForCapturedSync(count = 1) {
  await waitUntil(
    async () => {
      const captured = await getCaptured(false);
      return captured.sync.length >= count;
    },
    `at least ${count} captured sync message(s)`
  );
}

module.exports = {
  CMD,
  activateExtension,
  sleep,
  openAndWaitWebview,
  openFile,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  trackRender,
  trackSync,
  getDetailedTabState,
  openFileWithSelection,
  pinActiveEditor,
  startCapture,
  getCaptured,
  stopCapture,
  waitUntil,
  waitForCapturedSync
};
