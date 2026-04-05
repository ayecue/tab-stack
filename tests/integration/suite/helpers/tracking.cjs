const vscode = require('vscode');
const { CMD, sleep, waitUntil } = require('./core.cjs');

const TRACK_RENDER_TIMEOUT = 5000;
const TRACK_SYNC_TIMEOUT = 10000;
const TRACK_RETRIES = 1;

/**
 * Wrap an operation that triggers a render event. Captures the current render
 * timestamp, runs the callback, then waits for a render after that timestamp.
 * Retries the wait (not the callback) if the first attempt times out.
 */
async function trackRender(callback) {
  await sleep(200);
  const fromTime = await vscode.commands.executeCommand(CMD('__test__getLastRenderTime'));
  await callback();
  for (let attempt = 0; attempt <= TRACK_RETRIES; attempt++) {
    const result = await vscode.commands.executeCommand(
      CMD('__test__waitForRender'), String(fromTime), String(TRACK_RENDER_TIMEOUT)
    );
    if (result) {
      await sleep(200);
      return;
    }
  }
  throw new Error('trackRender timed out waiting for render event');
}

/**
 * Wrap an operation that triggers a sync event. Captures the current sync
 * timestamp, runs the callback, then waits for a sync after that timestamp.
 * Retries the wait (not the callback) if the first attempt times out.
 */
async function trackSync(callback) {
  await sleep(200);
  const fromTime = await vscode.commands.executeCommand(CMD('__test__getLastSyncTime'));
  await callback();
  for (let attempt = 0; attempt <= TRACK_RETRIES; attempt++) {
    const result = await vscode.commands.executeCommand(
      CMD('__test__waitForSync'), String(fromTime), String(TRACK_SYNC_TIMEOUT)
    );
    if (result) {
      await sleep(200);
      return;
    }
  }
  throw new Error('trackSync timed out waiting for sync event');
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
  trackRender,
  trackSync,
  startCapture,
  getCaptured,
  stopCapture,
  waitForCapturedSync
};
