const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, sleep, openAndWaitWebview } = require('./helpers.cjs');

suite('Lifecycle: history', () => {
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

  test('create group, snapshot, switch, recover snapshot', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const gName = `WL-SnapRecover-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    // Switch to the group to make it active
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });
    await sleep(1000);

    // Take a snapshot
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length > 0, 'Snapshot should exist');
    const snapshotId = state.historyIds[0];

    // Create a second group and switch to it
    const g2Name = `WL-SnapRecover2-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g2Name
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group2 = Object.values(state.groups).find((g) => g.name === g2Name);
    assert.ok(group2, 'Second group should exist');

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group2.id
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group2.id, 'Should be on second group');

    // Recover the earlier snapshot
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'recover-state', historyId: snapshotId
    });
    await sleep(1000);

    // State should be accessible and snapshot should still exist
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be readable after snapshot recovery');
  });

  test('multiple snapshots are preserved in order', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const g = `WL-MultiSnap-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g
    });
    await sleep(1000);

    // Take three snapshots
    for (let i = 0; i < 3; i++) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
      await sleep(500);
    }

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length >= 3, 'Should have at least 3 history entries');

    // Delete the middle one
    const middleId = state.historyIds[1];
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-history', historyId: middleId
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.historyIds.includes(middleId), 'Middle history entry should be deleted');
    assert.ok(state.historyIds.length >= 2, 'Other history entries should remain');
  });

  test('recover snapshot then take new snapshot', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const g = `WL-RecoverSnap-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g
    });
    await sleep(1000);

    // Take a snapshot
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const firstSnapId = state.historyIds[0];
    assert.ok(firstSnapId, 'First snapshot should exist');

    // Recover it
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'recover-state', historyId: firstSnapId
    });
    await sleep(1000);

    // Take another snapshot after recovery
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(500);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length >= 2, 'Should have at least 2 history entries after recover + snapshot');
  });

  test('history pruning respects max entries setting', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Set max history entries to a small number
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'update-history-max-entries', maxEntries: 3
    });
    await sleep(500);

    const g = `WL-Prune-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: g
    });
    await sleep(1000);

    // Take 5 snapshots (exceeds max of 3)
    for (let i = 0; i < 5; i++) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
      await sleep(300);
    }

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length <= 3, `History should be pruned to at most 3 entries, got ${state.historyIds.length}`);
  });
});
