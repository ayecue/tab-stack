const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, sleep, openAndWaitWebview } = require('./helpers.cjs');

suite('Lifecycle: webview sync', () => {
  test('webview sync roundtrip: webview sync message triggers extension sync output', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Start capturing service sync events (no webview patching)
    await vscode.commands.executeCommand(CMD('__test__startCapture'));

    // Send Sync message from webview to trigger a service sync
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'sync'
    });
    await sleep(250);

    const captured = await vscode.commands.executeCommand(CMD('__test__getCapturedMessages'), true);
    assert.ok(captured.sync && captured.sync.length > 0, 'Expected at least one sync payload');

    await vscode.commands.executeCommand(CMD('__test__stopCapture'));
  });
});
