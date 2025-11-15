const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');

const EXTENSION_ID = 'ayecue.tab-stack';
const CMD = (name) => `tabStack.${name}`;

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

suite('Webview interaction via test bridge', () => {
  test('create and delete group through webview messages', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    // Ensure the view is created/resolved so the bridge has a handler
    await vscode.commands.executeCommand(CMD('__test__openView'));
    // Wait until the webview handler is ready
    for (let i = 0; i < 20; i++) {
      const ready = await vscode.commands.executeCommand(CMD('__test__webviewReady'));
      if (ready) break;
      await sleep(100);
      if (i === 19) throw new Error('Webview did not initialize in time');
    }

    const name = `WVGroup-${Date.now()}`;

    // Simulate webview creating a group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group',
      groupId: name
    });

    await sleep(200);

    // Verify group exists by reading state
    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const created = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(created, 'Group should have been created via webview message');

    // Assign quick slot to the created group id
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot',
      slot: '5',
      groupId: created.id
    });

    await sleep(50);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.quickSlots['5'], created.id, 'Quick slot should be set');

    // Delete the group using its id
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-group',
      groupId: created.id
    });

    await sleep(100);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const stillThere = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(!stillThere, 'Group should have been deleted via webview message');
  });

  test('history and settings updates via webview messages', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await vscode.commands.executeCommand(CMD('__test__openView'));
    for (let i = 0; i < 20; i++) {
      const ready = await vscode.commands.executeCommand(CMD('__test__webviewReady'));
      if (ready) break;
      await sleep(100);
      if (i === 19) throw new Error('Webview did not initialize in time');
    }

    // Ensure at least one group/state exists
    const bootstrap = `WVBootstrap-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group',
      groupId: bootstrap
    });

    await sleep(200);

    // Add to history through the webview
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });

    await sleep(100);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length >= 1, 'History should contain at least one entry');

    // Update settings from the webview (these trigger sync)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'update-history-max-entries',
      maxEntries: 5
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'update-git-integration',
      enabled: true,
      groupPrefix: 'branch/'
    });

    // Just assert that nothing throws and state is still accessible
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be readable after settings updates');
  });
});
