const assert = require('assert');
const vscode = require('vscode');

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
  await resetExtensionState();
}

async function resetExtensionState() {
  try {
    await vscode.commands.executeCommand(CMD('__test__resetState'));
  } catch (_) {
    // The test helper command may not be registered yet during activation races.
  }

  try {
    await vscode.commands.executeCommand('workbench.action.closeAllEditors');
    const remainingTabs = vscode.window.tabGroups.all.flatMap((group) => group.tabs);
    if (remainingTabs.length > 0) {
      await vscode.window.tabGroups.close(remainingTabs, true);
    }
  } catch (_) {
    // Ignore residual close failures during test cleanup.
  }

  try {
    await vscode.commands.executeCommand('workbench.action.joinAllGroups');
  } catch (_) {
    // Ignore if the command is unavailable in the current host.
  }

  try {
    await waitUntil(
      async () => {
        try {
          const state = await vscode.commands.executeCommand(CMD('__test__getState'));
          const tabCount = vscode.window.tabGroups.all.reduce((sum, group) => sum + group.tabs.length, 0);
          return (
            Object.keys(state.groups ?? {}).length === 0 &&
            Object.keys(state.addons ?? {}).length === 0 &&
            (state.historyIds?.length ?? 0) === 0 &&
            tabCount === 0
          );
        } catch (_) {
          return false;
        }
      },
      'Tab Stack state and editor layout to reset',
      5000,
    );
  } catch (_) {
    // Keep teardown best-effort; suite setup will reset again before the next suite.
  }

  await sleep(200);
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
 * Read the full extension state.
 */
async function getState() {
  return vscode.commands.executeCommand(CMD('__test__getState'));
}

module.exports = {
  CMD,
  activateExtension,
  resetExtensionState,
  sleep,
  waitUntil,
  openAndWaitWebview,
  getState
};
