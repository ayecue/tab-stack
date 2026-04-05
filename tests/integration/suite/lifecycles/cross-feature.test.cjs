const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const {
  CMD,
  openFile,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  trackSync,
  trackRender,
  sleep,
  waitUntil,
  createGroup,
  assignQuickSlot,
  renameGroup,
  createAddon,
  deleteGroup,
  addToHistory,
  applyAddon,
  updateHistoryMaxEntries,
  updateGitIntegration,
  recoverState,
  dispatch,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

suite('Lifecycle: cross-feature scenarios', () => {
  lifecycleSetup();
  
  test('quick slot survives group rename', async function () {
    this.timeout(1000 * 20);
    const name = `WL-SlotRename-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Assign quick slot 3
    await assignQuickSlot('3', group.id);

    // Rename the group
    const newName = `${name}-renamed`;
    await renameGroup(group.id, newName);

    state = await getState();
    assert.strictEqual(state.quickSlots['3'], group.id, 'Quick slot should still point to group after rename');
    assert.strictEqual(state.groups[group.id].name, newName, 'Group should be renamed');

    // Apply the slot — should still work
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot3'));
    });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group.id, 'Quick slot should switch to renamed group');

    // Clean up
    await dispatch({ type: 'assign-quick-slot', slot: '3', groupId: null });
  });

  test('addon created, group deleted, addon still exists', async function () {
    this.timeout(1000 * 20);
    const gName = `WL-AddonSurvive-${Date.now()}`;
    await createGroup(gName);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    // Already current after create — no render
    await dispatch({ type: 'switch-group', groupId: group.id });

    // Create addon while on this group
    const addonName = `WL-AddonSurvive-Addon-${Date.now()}`;
    await createAddon(addonName);

    state = await getState();
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should exist');

    // Delete the group
    await deleteGroup(group.id);

    // Addon should still exist (addons are independent of groups)
    state = await getState();
    assert.ok(!state.groups[group.id], 'Group should be deleted');
    assert.ok(state.addons[addon.id], 'Addon should survive group deletion');
  });

  test('snapshot, delete group, recover from snapshot', async function () {
    this.timeout(1000 * 30);
    const gName = `WL-SnapDelRecover-${Date.now()}`;
    await createGroup(gName);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    // Already current after create — no render
    await dispatch({ type: 'switch-group', groupId: group.id });

    // Take snapshot
    await addToHistory();

    state = await getState();
    const snapId = state.historyIds[0];
    assert.ok(snapId, 'Snapshot should exist');

    // Delete the group
    await deleteGroup(group.id);

    state = await getState();
    assert.ok(!state.groups[group.id], 'Group should be deleted');

    // Recover from snapshot — should not crash even though the original group is gone
    await recoverState(snapId);

    state = await getState();
    assert.ok(state, 'State should be accessible after snapshot recovery of deleted group');
  });

  test('full workflow: create groups, assign slots, snapshot, switch, recover, delete', async function () {
    this.timeout(1000 * 40);
    const g1 = `WL-Full-A-${Date.now()}`;
    const g2 = `WL-Full-B-${Date.now()}`;

    // Create two groups
    await createGroup(g1);
    await createGroup(g2);

    let state = await getState();
    const group1 = Object.values(state.groups).find((g) => g.name === g1);
    const group2 = Object.values(state.groups).find((g) => g.name === g2);
    assert.ok(group1 && group2, 'Both groups should exist');

    // Assign quick slots
    await dispatch({ type: 'assign-quick-slot', slot: '1', groupId: group1.id });
    await assignQuickSlot('2', group2.id);

    // Switch to group 1 via slot
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot1'));
    });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group1.id, 'Should be on group 1');

    // Take snapshot
    await addToHistory();

    // Switch to group 2 via slot
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot2'));
    });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group2.id, 'Should be on group 2');

    // Create addon from group 2 state
    const addonName = `WL-Full-Addon-${Date.now()}`;
    await createAddon(addonName);

    state = await getState();
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should exist');

    // Quick switch back to group 1
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSwitch'));
    });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group1.id, 'quickSwitch should go back to group 1');

    // Apply addon (created from group 2 state) on group 1
    await applyAddon(addon.id);

    // Recover earlier snapshot
    const snapId = state.historyIds[0];
    if (snapId) {
      await recoverState(snapId);
    }

    // Delete group 2
    await deleteGroup(group2.id);

    state = await getState();
    assert.ok(!state.groups[group2.id], 'Group 2 should be deleted');
    assert.ok(state.addons[addon.id], 'Addon should survive group deletion');

    // Clean up
    await dispatch({ type: 'assign-quick-slot', slot: '1', groupId: null });
    await dispatch({ type: 'assign-quick-slot', slot: '2', groupId: null });
  });

  test('settings changes during active lifecycle', async function () {
    this.timeout(1000 * 20);
    const g = `WL-Settings-${Date.now()}`;
    await createGroup(g);

    // Update settings in the middle of a lifecycle
    await updateHistoryMaxEntries(20);

    await updateGitIntegration(false, '');

    // Take a snapshot after settings change — open a file first so state container has tab data
    await trackSync(async () => {
      await openFile('package.json');
    });
    // Wait for triggerStateUpdate debounce to fire so state container is populated
    await sleep(200);
    await addToHistory();

    let state = await getState();
    assert.ok(state.historyIds.length > 0, 'Snapshot should be taken after settings change');
    assert.ok(state, 'State should be stable after settings changes');
  });

  test('full workflow with real tabs: groups capture different file sets', async function () {
    this.timeout(1000 * 90);
    await closeAllTabs();

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Create group A — captures 5 files across 2 columns, A becomes current
    const gA = `WL-CrossTabs-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should exist');

    // Create addon from current state (5 files across 2 columns)
    const addonName = `WL-CrossTabs-Addon-${Date.now()}`;
    await createAddon(addonName);

    state = await getState();
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-CrossTabs-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
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

    // Assign quick slots
    await dispatch({ type: 'assign-quick-slot', slot: '6', groupId: groupA.id });
    await assignQuickSlot('7', groupB.id);

    // Take snapshot while on group B
    await addToHistory();

    // Switch to A via quick slot — should restore 5 files across 2 columns
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot6'));
    });

    await waitUntil(
      () => totalTabCount() >= 4 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'package.json to appear after quickSlot6'
    );

    let labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `After quickSlot6, package.json should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      totalTabCount() >= 3,
      `After quickSlot6, should have >= 3 tabs, got ${totalTabCount()}`
    );

    // Apply addon (same file set as A) — verifies it doesn't crash
    await applyAddon(addon.id);

    const countAfterAddon = totalTabCount();
    assert.ok(countAfterAddon >= 3, `Should still have >= 3 tabs after addon apply, got ${countAfterAddon}`);

    // Switch back to B via quick slot — should restore build-browser, build-node, LICENSE, etc.
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot7'));
    });

    await waitUntil(
      () => getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('build-browser')),
      'build-browser to appear after quickSlot7'
    );

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
      totalTabCount() >= 3,
      `After quickSlot7, should have >= 3 tabs, got ${totalTabCount()}`
    );

    // Clean up quick slots
    await dispatch({ type: 'assign-quick-slot', slot: '6', groupId: null });
    await dispatch({ type: 'assign-quick-slot', slot: '7', groupId: null });
  });
});
