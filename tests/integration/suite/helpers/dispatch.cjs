const vscode = require('vscode');
const { CMD } = require('./core.cjs');
const { trackRender, trackSync } = require('./tracking.cjs');

/**
 * Raw webview dispatch — sends a message to the webview without any tracker.
 */
async function dispatch(payload) {
  await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), payload);
}

// ── Group helpers ──────────────────────────────────────────────

async function createGroup(groupId) {
  await trackSync(async () => {
    await dispatch({ type: 'new-group', groupId });
  });
}

async function switchToGroup(groupId) {
  await trackRender(async () => {
    await dispatch({ type: 'switch-group', groupId });
  });
}

async function deleteGroup(groupId) {
  await trackSync(async () => {
    await dispatch({ type: 'delete-group', groupId });
  });
}

async function renameGroup(groupId, name) {
  await trackSync(async () => {
    await dispatch({ type: 'rename-group', groupId, name });
  });
}

// ── Addon helpers ──────────────────────────────────────────────

async function createAddon(name) {
  await trackSync(async () => {
    await dispatch({ type: 'new-addon', name });
  });
}

async function renameAddon(addonId, name) {
  await trackSync(async () => {
    await dispatch({ type: 'rename-addon', addonId, name });
  });
}

async function deleteAddon(addonId) {
  await trackSync(async () => {
    await dispatch({ type: 'delete-addon', addonId });
  });
}

async function applyAddon(addonId) {
  await trackSync(async () => {
    await dispatch({ type: 'apply-addon', addonId });
  });
}

// ── History helpers ────────────────────────────────────────────

async function addToHistory() {
  await trackSync(async () => {
    await dispatch({ type: 'add-to-history' });
  });
}

async function deleteHistory(historyId) {
  await trackSync(async () => {
    await dispatch({ type: 'delete-history', historyId });
  });
}

async function recoverState(historyId) {
  await trackRender(async () => {
    await dispatch({ type: 'recover-state', historyId });
  });
}

// ── Quick slot helpers ─────────────────────────────────────────

async function assignQuickSlot(slot, groupId) {
  await trackSync(async () => {
    await dispatch({ type: 'assign-quick-slot', slot, groupId });
  });
}

// ── Sync helper ────────────────────────────────────────────────

async function syncWebview() {
  await trackSync(async () => {
    await dispatch({ type: 'sync' });
  });
}

// ── Settings helpers ───────────────────────────────────────────

async function updateHistoryMaxEntries(maxEntries) {
  await trackSync(async () => {
    await dispatch({ type: 'update-history-max-entries', maxEntries });
  });
}

async function updateGitIntegration(enabled, groupPrefix) {
  await trackSync(async () => {
    await dispatch({ type: 'update-git-integration', enabled, groupPrefix });
  });
}

module.exports = {
  dispatch,
  createGroup,
  switchToGroup,
  deleteGroup,
  renameGroup,
  createAddon,
  renameAddon,
  deleteAddon,
  applyAddon,
  addToHistory,
  deleteHistory,
  recoverState,
  assignQuickSlot,
  syncWebview,
  updateHistoryMaxEntries,
  updateGitIntegration
};
