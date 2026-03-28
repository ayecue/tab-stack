const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

const EXTENSION_ID = 'ayecue.tab-stack';

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

async function openAndWaitWebview() {
  await vscode.commands.executeCommand(CMD('__test__openView'));
  for (let i = 0; i < 30; i++) {
    const ready = await vscode.commands.executeCommand(CMD('__test__webviewReady'));
    if (ready) return;
    await sleep(100);
  }
  throw new Error('Webview did not initialize in time');
}

/**
 * Open a workspace file as an editor tab.
 * @param {string} relativePath - path relative to workspace root (e.g. 'package.json')
 * @param {object} [opts]
 * @param {number} [opts.viewColumn] - target editor column (default: Active)
 * @param {boolean} [opts.preview] - open as preview tab (default: false)
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
}

/**
 * Return an array describing the currently open VS Code tab groups.
 * Each entry: { viewColumn, tabCount, tabLabels }
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
 * Close all open editor tabs.
 */
async function closeAllTabs() {
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  await sleep(300);
}

/**
 * Open multiple workspace files, optionally across different editor columns.
 * @param {{ file: string, column?: number }[]} entries
 */
async function openFiles(entries) {
  for (const { file, column } of entries) {
    await openFile(file, { viewColumn: column ?? vscode.ViewColumn.Active });
    await sleep(300);
  }
}

/**
 * Wait for a render to complete after a group switch.
 * Polls until vscode tab count stabilises.
 */
async function waitForRenderStable(maxWaitMs = 5000) {
  let prev = -1;
  let stableCount = 0;
  const start = Date.now();
  while (Date.now() - start < maxWaitMs) {
    const count = totalTabCount();
    if (count === prev) {
      stableCount++;
      if (stableCount >= 3) return;
    } else {
      stableCount = 0;
    }
    prev = count;
    await sleep(300);
  }
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
  waitForRenderStable
};
