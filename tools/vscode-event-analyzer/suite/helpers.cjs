const assert = require('assert');
const vscode = require('vscode');
const path = require('path');

const POLL_INTERVAL = 100;
const POLL_TIMEOUT = 10000;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitUntil(predicate, description, timeout = POLL_TIMEOUT) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const result = await predicate();
    if (result) return result;
    await sleep(POLL_INTERVAL);
  }
  throw new Error(`Timed out waiting for: ${description}`);
}

async function openFile(relativePath, opts = {}) {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  assert.ok(workspaceFolder, 'A workspace folder must be open');
  const uri = vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, relativePath));
  const doc = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(doc, {
    viewColumn: opts.viewColumn ?? vscode.ViewColumn.Active,
    preview: opts.preview ?? false,
    preserveFocus: true,
  });
  await waitUntil(
    () => {
      const allLabels = vscode.window.tabGroups.all.flatMap((g) =>
        g.tabs.map((t) => t.label)
      );
      return allLabels.some((l) =>
        l.includes(path.basename(relativePath, path.extname(relativePath)))
      );
    },
    `tab "${relativePath}" to appear`
  );
}

async function closeAllTabs() {
  await vscode.commands.executeCommand('workbench.action.closeAllEditors');
  const remaining = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
  if (remaining.length > 0) {
    await vscode.window.tabGroups.close(remaining, true);
  }
  await waitUntil(
    () => vscode.window.tabGroups.all.flatMap((g) => g.tabs).length === 0,
    'all tabs closed'
  );
}

async function startCapture() {
  await vscode.commands.executeCommand('eventAnalyzer.startCapture');
}

async function stopCapture() {
  await vscode.commands.executeCommand('eventAnalyzer.stopCapture');
}

async function getEvents(clear = true) {
  return vscode.commands.executeCommand('eventAnalyzer.getEvents', clear);
}

async function getSnapshot() {
  return vscode.commands.executeCommand('eventAnalyzer.getSnapshot');
}

function getLayout() {
  return vscode.window.tabGroups.all.map((g) => ({
    viewColumn: g.viewColumn,
    tabs: g.tabs.map((t) => t.label),
  }));
}

module.exports = {
  sleep,
  waitUntil,
  openFile,
  closeAllTabs,
  startCapture,
  stopCapture,
  getEvents,
  getSnapshot,
  getLayout,
};
