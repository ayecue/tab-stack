const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, sleep, openAndWaitWebview } = require('./helpers.cjs');

suite('Lifecycle: quick slots', () => {
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

  test('rapid quick slot switching: fast toggling between multiple slots', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const g1 = `WL-RapidQS-A-${Date.now()}`;
    const g2 = `WL-RapidQS-B-${Date.now()}`;
    const g3 = `WL-RapidQS-C-${Date.now()}`;

    // Create three groups
    for (const name of [g1, g2, g3]) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group',
        groupId: name
      });
      await sleep(500);
    }

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group1 = Object.values(state.groups).find((g) => g.name === g1);
    const group2 = Object.values(state.groups).find((g) => g.name === g2);
    const group3 = Object.values(state.groups).find((g) => g.name === g3);

    assert.ok(group1 && group2 && group3, 'All three groups should exist');

    // Assign quick slots
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '1', groupId: group1.id
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '2', groupId: group2.id
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '3', groupId: group3.id
    });
    await sleep(500);

    // Rapidly switch between slots (simulate fast hotbar switching)
    const slotSequence = ['quickSlot1', 'quickSlot2', 'quickSlot3', 'quickSlot1', 'quickSlot3', 'quickSlot2', 'quickSlot1'];
    for (const slotCmd of slotSequence) {
      await vscode.commands.executeCommand(CMD(slotCmd));
    }
    await sleep(1500);

    // After rapid switching, the last slot applied was quickSlot1
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group1.id, 'After rapid switching, should land on group 1');

    // Clean up
    for (const slot of ['1', '2', '3']) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'assign-quick-slot', slot, groupId: null
      });
    }
  });

  test('quick switch interleaved with quick slots', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const gA = `WL-QSI-A-${Date.now()}`;
    const gB = `WL-QSI-B-${Date.now()}`;

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(500);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupA && groupB, 'Both groups should exist');

    // Assign quick slots
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '7', groupId: groupA.id
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '8', groupId: groupB.id
    });
    await sleep(500);

    // Switch to group A via quick slot
    await vscode.commands.executeCommand(CMD('quickSlot7'));
    await sleep(1000);
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupA.id, 'Should be on group A');

    // Switch to group B via quick slot
    await vscode.commands.executeCommand(CMD('quickSlot8'));
    await sleep(1000);
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupB.id, 'Should be on group B');

    // Quick switch should go back to A (previous)
    await vscode.commands.executeCommand(CMD('quickSwitch'));
    await sleep(1000);
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupA.id, 'quickSwitch should return to group A');

    // Another quickSwitch goes back to B
    await vscode.commands.executeCommand(CMD('quickSwitch'));
    await sleep(1000);
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupB.id, 'quickSwitch should toggle back to group B');

    // Clean up
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '7', groupId: null
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '8', groupId: null
    });
  });

  test('quick slot with deleted group clears the slot', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-QSDeleted-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: name
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Assign slot 9
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '9', groupId: group.id
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.quickSlots['9'], group.id, 'Slot 9 should be assigned');

    // Delete the group
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-group', groupId: group.id
    });
    await sleep(1000);

    // Applying the quick slot should clear it and show a warning (not crash)
    await vscode.commands.executeCommand(CMD('quickSlot9'));
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.quickSlots['9'], 'Quick slot should be cleared after group deletion');
  });

  test('reassign quick slot from one group to another', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const nameA = `WL-Reassign-A-${Date.now()}`;
    const nameB = `WL-Reassign-B-${Date.now()}`;

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: nameA
    });
    await sleep(500);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: nameB
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === nameA);
    const groupB = Object.values(state.groups).find((g) => g.name === nameB);
    assert.ok(groupA && groupB, 'Both groups should exist');

    // Assign slot 4 to group A
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '4', groupId: groupA.id
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.quickSlots['4'], groupA.id, 'Slot 4 should point to group A');

    // Reassign slot 4 to group B
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '4', groupId: groupB.id
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.quickSlots['4'], groupB.id, 'Slot 4 should now point to group B');

    // Apply slot 4 — should switch to group B
    await vscode.commands.executeCommand(CMD('quickSlot4'));
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupB.id, 'Should be on group B after applying reassigned slot');

    // Clean up
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '4', groupId: null
    });
  });

  test('apply unassigned quick slot does not crash', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Ensure slot 5 is not assigned
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '5', groupId: null
    });
    await sleep(500);

    // Apply unassigned slot — should show warning, not crash
    await vscode.commands.executeCommand(CMD('quickSlot5'));
    await sleep(500);

    const state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be accessible after applying unassigned slot');
  });

  test('quick switch with no previous group is a no-op', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Just call quickSwitch on a fresh state — should not crash
    await vscode.commands.executeCommand(CMD('quickSwitch'));
    await sleep(500);

    const state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be accessible after quickSwitch with no previous');
  });

  test('assign all slots to same group then clear all', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-AllSlots-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: name
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Assign slots 1-9 to the same group
    for (let i = 1; i <= 9; i++) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'assign-quick-slot', slot: String(i), groupId: group.id
      });
    }
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    for (let i = 1; i <= 9; i++) {
      assert.strictEqual(state.quickSlots[String(i)], group.id, `Slot ${i} should be assigned`);
    }

    // Clear all slots
    for (let i = 1; i <= 9; i++) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'assign-quick-slot', slot: String(i), groupId: null
      });
    }
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    for (let i = 1; i <= 9; i++) {
      assert.ok(!state.quickSlots[String(i)], `Slot ${i} should be cleared`);
    }
  });

  test('rapid quick switch bounce between two groups', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const gA = `WL-Bounce-A-${Date.now()}`;
    const gB = `WL-Bounce-B-${Date.now()}`;

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(500);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupA && groupB, 'Both groups should exist');

    // Switch to A then B to establish previous
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(1000);
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupB.id
    });
    await sleep(1000);

    // Rapidly fire quickSwitch 6 times (should toggle A->B->A->B->A->B)
    for (let i = 0; i < 6; i++) {
      await vscode.commands.executeCommand(CMD('quickSwitch'));
    }
    await sleep(2000);

    // 6 toggles from B: B->A->B->A->B->A->B => ends on B (even count from B)
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupB.id, 'After 6 rapid quickSwitches from B, should end on B');
  });
});
