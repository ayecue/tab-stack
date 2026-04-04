const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const {
  CMD,
  trackSync,
  trackRender,
  createGroup,
  assignQuickSlot,
  deleteGroup,
  switchToGroup,
  dispatch,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

suite('Lifecycle: quick slots', () => {
  lifecycleSetup();

  test('quick slot lifecycle: assign, apply via command, clear', async function () {
    this.timeout(1000 * 20);
    const groupName = `WL-QS-${Date.now()}`;
    await createGroup(groupName);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === groupName);
    assert.ok(group, 'Group should exist');

    // Assign slot 6 to this group
    await assignQuickSlot('6', group.id);

    state = await getState();
    assert.strictEqual(state.quickSlots['6'], group.id, 'Quick slot assigned');

    // Apply quick slot via command
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot6'));
    });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group.id, 'Applying quick slot should select group');

    // Clear quick slot via message
    await assignQuickSlot('6', null);

    state = await getState();
    assert.ok(!state.quickSlots['6'], 'Quick slot cleared');
  });

  test('rapid quick slot switching: fast toggling between multiple slots', async function () {
    this.timeout(1000 * 30);
    const g1 = `WL-RapidQS-A-${Date.now()}`;
    const g2 = `WL-RapidQS-B-${Date.now()}`;
    const g3 = `WL-RapidQS-C-${Date.now()}`;

    // Create three groups
    for (const name of [g1, g2, g3]) {
      await createGroup(name);
    }

    let state = await getState();
    const group1 = Object.values(state.groups).find((g) => g.name === g1);
    const group2 = Object.values(state.groups).find((g) => g.name === g2);
    const group3 = Object.values(state.groups).find((g) => g.name === g3);

    assert.ok(group1 && group2 && group3, 'All three groups should exist');

    // Assign quick slots
    await dispatch({ type: 'assign-quick-slot', slot: '1', groupId: group1.id });
    await dispatch({ type: 'assign-quick-slot', slot: '2', groupId: group2.id });
    await assignQuickSlot('3', group3.id);

    // Rapidly switch between slots (simulate fast hotbar switching)
    const slotSequence = ['quickSlot1', 'quickSlot2', 'quickSlot3', 'quickSlot1', 'quickSlot3', 'quickSlot2', 'quickSlot1'];
    await trackSync(async () => {
      for (const slotCmd of slotSequence) {
        await vscode.commands.executeCommand(CMD(slotCmd));
      }
    });

    // After rapid switching, the last slot applied was quickSlot1
    state = await getState();
    assert.strictEqual(state.selectedGroupId, group1.id, 'After rapid switching, should land on group 1');

    // Clean up
    for (const slot of ['1', '2', '3']) {
      await dispatch({ type: 'assign-quick-slot', slot, groupId: null });
    }
  });

  test('quick switch interleaved with quick slots', async function () {
    this.timeout(1000 * 30);
    const gA = `WL-QSI-A-${Date.now()}`;
    const gB = `WL-QSI-B-${Date.now()}`;

    await createGroup(gA);
    await createGroup(gB);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupA && groupB, 'Both groups should exist');

    // Assign quick slots
    await dispatch({ type: 'assign-quick-slot', slot: '7', groupId: groupA.id });
    await assignQuickSlot('8', groupB.id);

    // Switch to group A via quick slot
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot7'));
    });
    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupA.id, 'Should be on group A');

    // Switch to group B via quick slot
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot8'));
    });
    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupB.id, 'Should be on group B');

    // Quick switch should go back to A (previous)
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSwitch'));
    });
    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupA.id, 'quickSwitch should return to group A');

    // Another quickSwitch goes back to B
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSwitch'));
    });
    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupB.id, 'quickSwitch should toggle back to group B');

    // Clean up
    await dispatch({ type: 'assign-quick-slot', slot: '7', groupId: null });
    await dispatch({ type: 'assign-quick-slot', slot: '8', groupId: null });
  });

  test('quick slot with deleted group clears the slot', async function () {
    this.timeout(1000 * 20);
    const name = `WL-QSDeleted-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Assign slot 9
    await assignQuickSlot('9', group.id);

    state = await getState();
    assert.strictEqual(state.quickSlots['9'], group.id, 'Slot 9 should be assigned');

    // Delete the group
    await deleteGroup(group.id);

    // Applying the quick slot should clear it and show a warning (not crash)
    await vscode.commands.executeCommand(CMD('quickSlot9'));

    state = await getState();
    assert.ok(!state.quickSlots['9'], 'Quick slot should be cleared after group deletion');
  });

  test('reassign quick slot from one group to another', async function () {
    this.timeout(1000 * 20);
    const nameA = `WL-Reassign-A-${Date.now()}`;
    const nameB = `WL-Reassign-B-${Date.now()}`;

    await createGroup(nameA);
    await createGroup(nameB);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === nameA);
    const groupB = Object.values(state.groups).find((g) => g.name === nameB);
    assert.ok(groupA && groupB, 'Both groups should exist');

    // Assign slot 4 to group A
    await assignQuickSlot('4', groupA.id);

    state = await getState();
    assert.strictEqual(state.quickSlots['4'], groupA.id, 'Slot 4 should point to group A');

    // Reassign slot 4 to group B
    await assignQuickSlot('4', groupB.id);

    state = await getState();
    assert.strictEqual(state.quickSlots['4'], groupB.id, 'Slot 4 should now point to group B');

    // Apply slot 4 — group B is already current after create, no render
    await vscode.commands.executeCommand(CMD('quickSlot4'));

    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupB.id, 'Should be on group B after applying reassigned slot');

    // Clean up
    await dispatch({ type: 'assign-quick-slot', slot: '4', groupId: null });
  });

  test('apply unassigned quick slot does not crash', async function () {
    this.timeout(1000 * 20);
    // Ensure slot 5 is not assigned
    await assignQuickSlot('5', null);

    // Apply unassigned slot — should show warning, not crash (no render)
    await vscode.commands.executeCommand(CMD('quickSlot5'));

    const state = await getState();
    assert.ok(state, 'State should be accessible after applying unassigned slot');
  });

  test('quick switch with no previous group is a no-op', async function () {
    this.timeout(1000 * 20);
    // Just call quickSwitch on a fresh state — should not crash (no render)
    await vscode.commands.executeCommand(CMD('quickSwitch'));

    const state = await getState();
    assert.ok(state, 'State should be accessible after quickSwitch with no previous');
  });

  test('reassigning the same group across all slots keeps only the latest slot', async function () {
    this.timeout(1000 * 30);
    const name = `WL-AllSlots-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Assign slots 1-9 to the same group. Only the last slot should remain,
    // because a group can only be assigned to one quick slot at a time.
    await trackSync(async () => {
      for (let i = 1; i <= 9; i++) {
        await dispatch({ type: 'assign-quick-slot', slot: String(i), groupId: group.id });
      }
    });

    state = await getState();
    for (let i = 1; i <= 8; i++) {
      assert.ok(!state.quickSlots[String(i)], `Slot ${i} should be empty after reassignment`);
    }
    assert.strictEqual(state.quickSlots['9'], group.id, 'Only the latest slot should remain assigned');

    // Clear all slots
    await trackSync(async () => {
      for (let i = 1; i <= 9; i++) {
        await dispatch({ type: 'assign-quick-slot', slot: String(i), groupId: null });
      }
    });

    state = await getState();
    for (let i = 1; i <= 9; i++) {
      assert.ok(!state.quickSlots[String(i)], `Slot ${i} should be cleared`);
    }
  });

  test('rapid quick switch bounce between two groups', async function () {
    this.timeout(1000 * 30);
    const gA = `WL-Bounce-A-${Date.now()}`;
    const gB = `WL-Bounce-B-${Date.now()}`;

    await createGroup(gA);
    await createGroup(gB);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupA && groupB, 'Both groups should exist');

    // Switch to A then B to establish previous
    await switchToGroup(groupA.id);
    await switchToGroup(groupB.id);

    // Rapidly fire quickSwitch 6 times (should toggle A->B->A->B->A->B)
    await trackRender(async () => {
      for (let i = 0; i < 6; i++) {
        await vscode.commands.executeCommand(CMD('quickSwitch'));
      }
    });

    // 6 toggles from B: B->A->B->A->B->A->B => ends on B (even count from B)
    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupB.id, 'After 6 rapid quickSwitches from B, should end on B');
  });
});
