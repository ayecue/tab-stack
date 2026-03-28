const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, sleep, openAndWaitWebview } = require('./helpers.cjs');

suite('Lifecycle: addon', () => {
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

  test('duplicate addon name is silently ignored', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const bootstrap = `WL-AddonDupBoot-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: bootstrap
    });
    await sleep(1000);

    const addonName = `WL-AddonDup-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addonCountBefore = Object.keys(state.addons).length;

    // Create another addon with the same name
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(Object.keys(state.addons).length, addonCountBefore, 'Duplicate addon name should not create a new addon');
  });

  test('apply addon from a different group context', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Create group A and make an addon from its state
    const gA = `WL-AddonCtx-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should exist');

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(1000);

    const addonName = `WL-AddonCtx-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Create group B and switch to it
    const gB = `WL-AddonCtx-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupB, 'Group B should exist');

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupB.id
    });
    await sleep(1000);

    // Apply addon (created in group A context) while on group B — should not crash
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon', addonId: addon.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be accessible after cross-context addon apply');
  });

  test('multiple addons applied in sequence', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const bootstrap = `WL-MultiAddonBoot-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: bootstrap
    });
    await sleep(1000);

    const addon1 = `WL-MultiAddon-1-${Date.now()}`;
    const addon2 = `WL-MultiAddon-2-${Date.now()}`;

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addon1
    });
    await sleep(500);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addon2
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const a1 = Object.values(state.addons).find((a) => a.name === addon1);
    const a2 = Object.values(state.addons).find((a) => a.name === addon2);
    assert.ok(a1 && a2, 'Both addons should exist');

    // Apply them in sequence
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon', addonId: a1.id
    });
    await sleep(500);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon', addonId: a2.id
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be stable after sequential addon applies');
  });
});
