const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, sleep, openAndWaitWebview, openFile, openFiles, getOpenTabs, totalTabCount, closeAllTabs, waitForRenderStable } = require('./helpers.cjs');

suite('Lifecycle: cross-feature scenarios', () => {
  test('quick slot survives group rename', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-SlotRename-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: name
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Assign quick slot 3
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '3', groupId: group.id
    });
    await sleep(500);

    // Rename the group
    const newName = `${name}-renamed`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'rename-group', groupId: group.id, name: newName
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.quickSlots['3'], group.id, 'Quick slot should still point to group after rename');
    assert.strictEqual(state.groups[group.id].name, newName, 'Group should be renamed');

    // Apply the slot — should still work
    await vscode.commands.executeCommand(CMD('quickSlot3'));
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group.id, 'Quick slot should switch to renamed group');

    // Clean up
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '3', groupId: null
    });
  });

  test('addon created, group deleted, addon still exists', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const gName = `WL-AddonSurvive-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });
    await sleep(1000);

    // Create addon while on this group
    const addonName = `WL-AddonSurvive-Addon-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should exist');

    // Delete the group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-group', groupId: group.id
    });
    await sleep(1000);

    // Addon should still exist (addons are independent of groups)
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[group.id], 'Group should be deleted');
    assert.ok(state.addons[addon.id], 'Addon should survive group deletion');
  });

  test('snapshot, delete group, recover from snapshot', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const gName = `WL-SnapDelRecover-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });
    await sleep(1000);

    // Take snapshot
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const snapId = state.historyIds[0];
    assert.ok(snapId, 'Snapshot should exist');

    // Delete the group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-group', groupId: group.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[group.id], 'Group should be deleted');

    // Recover from snapshot — should not crash even though the original group is gone
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'recover-state', historyId: snapId
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be accessible after snapshot recovery of deleted group');
  });

  test('full workflow: create groups, assign slots, snapshot, switch, recover, delete', async function () {
    this.timeout(1000 * 40);
    await activateExtension();
    await openAndWaitWebview();

    const g1 = `WL-Full-A-${Date.now()}`;
    const g2 = `WL-Full-B-${Date.now()}`;

    // Create two groups
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g1
    });
    await sleep(500);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g2
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group1 = Object.values(state.groups).find((g) => g.name === g1);
    const group2 = Object.values(state.groups).find((g) => g.name === g2);
    assert.ok(group1 && group2, 'Both groups should exist');

    // Assign quick slots
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '1', groupId: group1.id
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '2', groupId: group2.id
    });
    await sleep(500);

    // Switch to group 1 via slot
    await vscode.commands.executeCommand(CMD('quickSlot1'));
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group1.id, 'Should be on group 1');

    // Take snapshot
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    // Switch to group 2 via slot
    await vscode.commands.executeCommand(CMD('quickSlot2'));
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group2.id, 'Should be on group 2');

    // Create addon from group 2 state
    const addonName = `WL-Full-Addon-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should exist');

    // Quick switch back to group 1
    await vscode.commands.executeCommand(CMD('quickSwitch'));
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group1.id, 'quickSwitch should go back to group 1');

    // Apply addon (created from group 2 state) on group 1
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon', addonId: addon.id
    });
    await sleep(1000);

    // Recover earlier snapshot
    const snapId = state.historyIds[0];
    if (snapId) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'recover-state', historyId: snapId
      });
      await sleep(1000);
    }

    // Delete group 2
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-group', groupId: group2.id
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[group2.id], 'Group 2 should be deleted');
    assert.ok(state.addons[addon.id], 'Addon should survive group deletion');

    // Clean up
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '1', groupId: null
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '2', groupId: null
    });
  });

  test('settings changes during active lifecycle', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const g = `WL-Settings-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g
    });
    await sleep(1000);

    // Update settings in the middle of a lifecycle
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'update-history-max-entries', maxEntries: 20
    });
    await sleep(200);

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'update-git-integration', enabled: false, groupPrefix: ''
    });
    await sleep(200);

    // Take a snapshot after settings change
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length > 0, 'Snapshot should be taken after settings change');
    assert.ok(state, 'State should be stable after settings changes');
  });

  test('full workflow with real tabs: groups capture different file sets', async function () {
    this.timeout(1000 * 90);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Create group A — captures 5 files across 2 columns, A becomes current
    const gA = `WL-CrossTabs-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should exist');

    // Create addon from current state (5 files across 2 columns)
    const addonName = `WL-CrossTabs-Addon-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-CrossTabs-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupB, 'Group B should exist');

    // Close all, open different files across 2 columns — updates B (current), not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two },
      { file: 'build-webview.cjs', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Assign quick slots
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '6', groupId: groupA.id
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '7', groupId: groupB.id
    });
    await sleep(500);

    // Take snapshot while on group B
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    // Switch to A via quick slot — should restore 5 files across 2 columns
    await vscode.commands.executeCommand(CMD('quickSlot6'));
    await sleep(2000);
    await waitForRenderStable();

    let labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `After quickSlot6, package.json should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('vitest.config')),
      `After quickSlot6, vitest.config.ts should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      totalTabCount() >= 5,
      `After quickSlot6, should have >= 5 tabs, got ${totalTabCount()}`
    );

    // Apply addon (same file set as A) — verifies it doesn't crash
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon', addonId: addon.id
    });
    await sleep(1500);
    await waitForRenderStable();

    const countAfterAddon = totalTabCount();
    assert.ok(countAfterAddon >= 5, `Should still have >= 5 tabs after addon apply, got ${countAfterAddon}`);

    // Switch back to B via quick slot — should restore build-browser, build-node, LICENSE, etc.
    await vscode.commands.executeCommand(CMD('quickSlot7'));
    await sleep(2000);
    await waitForRenderStable();

    labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('build-browser')),
      `After quickSlot7, build-browser.cjs should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('LICENSE')),
      `After quickSlot7, LICENSE should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      totalTabCount() >= 5,
      `After quickSlot7, should have >= 5 tabs, got ${totalTabCount()}`
    );

    // Clean up quick slots
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '6', groupId: null
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '7', groupId: null
    });
  });
});
