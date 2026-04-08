const { suiteSetup, teardown } = require('mocha');
const { activateExtension, openAndWaitWebview, resetExtensionState } = require('./core.cjs');

/**
 * Standard lifecycle hooks for a Mocha suite that uses the webview.
 * Activates the extension and opens the webview once before all tests,
 * and closes all editor tabs after each test.
 *
 * Usage:
 *   suite('My tests', () => {
 *     lifecycleSetup();
 *     test('does something', async function () { ... });
 *   });
 */
function lifecycleSetup() {
  suiteSetup(async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();
  });

  teardown(async function () {
    await resetExtensionState();
  });
}

module.exports = {
  lifecycleSetup
};
