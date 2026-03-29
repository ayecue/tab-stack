const { suite, test, afterEach } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, openAndWaitWebview, trackSync, closeAllTabs } = require('./helpers.cjs');

suite('Lifecycle: addon', () => {
  afterEach(async () => {
    await closeAllTabs();
  });

  test('addon lifecycle: create, rename, apply, delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Ensure a state exists
    const bootstrap = `WL-Bootstrap-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group',
        groupId: bootstrap
      });
    });

    const addonName = `WL-Addon-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon',
        name: addonName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    const renamed = `${addonName}-renamed`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'rename-addon',
        addonId: addon.id,
        name: renamed
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.addons[addon.id].name, renamed, 'Addon should be renamed');

    // Apply addon (should not throw)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon',
      addonId: addon.id
    });

    // Delete addon
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-addon',
        addonId: addon.id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.addons[addon.id], 'Addon should be deleted');
  });

  test('duplicate addon name is silently ignored', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const bootstrap = `WL-AddonDupBoot-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: bootstrap
      });
    });

    const addonName = `WL-AddonDup-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addonName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addonCountBefore = Object.keys(state.addons).length;

    // Create another addon with the same name
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addonName
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(Object.keys(state.addons).length, addonCountBefore, 'Duplicate addon name should not create a new addon');
  });

  test('apply addon from a different group context', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Create group A and make an addon from its state
    const gA = `WL-AddonCtx-A-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gA
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should exist');

    // Already current after create — no render
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });

    const addonName = `WL-AddonCtx-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addonName
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Create group B and switch to it
    const gB = `WL-AddonCtx-B-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gB
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupB, 'Group B should exist');

    // Group B is already current after create — no render needed
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupB.id
    });

    // Apply addon (created in group A context) while on group B — should not crash
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'apply-addon', addonId: addon.id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be accessible after cross-context addon apply');
  });

  test('multiple addons applied in sequence', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const bootstrap = `WL-MultiAddonBoot-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: bootstrap
      });
    });

    const addon1 = `WL-MultiAddon-1-${Date.now()}`;
    const addon2 = `WL-MultiAddon-2-${Date.now()}`;

    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addon1
      });
    });
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addon2
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const a1 = Object.values(state.addons).find((a) => a.name === addon1);
    const a2 = Object.values(state.addons).find((a) => a.name === addon2);
    assert.ok(a1 && a2, 'Both addons should exist');

    // Apply them in sequence (addon bypasses render pipeline, triggers sync)
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'apply-addon', addonId: a1.id
      });
    });
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'apply-addon', addonId: a2.id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be stable after sequential addon applies');
  });
});
