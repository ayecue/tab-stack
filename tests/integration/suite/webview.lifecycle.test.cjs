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

async function openAndWaitWebview() {
  await vscode.commands.executeCommand(CMD('__test__openView'));
  for (let i = 0; i < 30; i++) {
    const ready = await vscode.commands.executeCommand(CMD('__test__webviewReady'));
    if (ready) return;
    await sleep(100);
  }
  throw new Error('Webview did not initialize in time');
}

suite('Webview lifecycle flows', () => {
  test('group lifecycle: create, rename, switch, delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-Group-${Date.now()}`;

    // Create group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group',
      groupId: name
    });
    await sleep(1000);

    // Lookup newly created group id
    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const created = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(created, 'Group should be created');

    const newName = `${name}-renamed`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'rename-group',
      groupId: created.id,
      name: newName
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.groups[created.id].name, newName, 'Group should be renamed');

    // Switch to group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group',
      groupId: created.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, created.id, 'Selected group should match');

    // Delete group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-group',
      groupId: created.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[created.id], 'Group should be deleted');
  });

  test('addon lifecycle: create, rename, apply, delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Ensure a state exists
    const bootstrap = `WL-Bootstrap-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group',
      groupId: bootstrap
    });
    await sleep(1000);

    const addonName = `WL-Addon-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon',
      name: addonName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    const renamed = `${addonName}-renamed`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'rename-addon',
      addonId: addon.id,
      name: renamed
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.addons[addon.id].name, renamed, 'Addon should be renamed');

    // Apply addon (should not throw)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon',
      addonId: addon.id
    });

    // Delete addon
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-addon',
      addonId: addon.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.addons[addon.id], 'Addon should be deleted');
  });

  test('history lifecycle: add, recover, delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Ensure a group/state exists
    const g = `WL-Hist-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group',
      groupId: g
    });
    await sleep(1000);

    // Add to history
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length > 0, 'History should have an entry');
    const histId = state.historyIds[0];

    // Recover and then delete
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'recover-state',
      historyId: histId
    });
    await sleep(1000);

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-history',
      historyId: histId
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length === 0 || !state.historyIds.includes(histId), 'History entry should be deleted');
  });

  test('quick slot lifecycle: assign, apply via command, clear', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const groupName = `WL-QS-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group',
      groupId: groupName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === groupName);
    assert.ok(group, 'Group should exist');

    // Assign slot 6 to this group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot',
      slot: '6',
      groupId: group.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.quickSlots['6'], group.id, 'Quick slot assigned');

    // Apply quick slot via command (webview does not have apply message)
    await vscode.commands.executeCommand(CMD('quickSlot6'));
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group.id, 'Applying quick slot should select group');

    // Clear quick slot via message
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot',
      slot: '6',
      groupId: null
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.quickSlots['6'], 'Quick slot cleared');
  });

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
