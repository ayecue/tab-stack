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
  sleep,
  waitUntil,
  openAndWaitWebview,
  getState
};
