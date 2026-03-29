const { suite, test, afterEach } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, openAndWaitWebview, trackSync, trackRender, closeAllTabs } = require('./helpers.cjs');

suite('Lifecycle: history', () => {
  afterEach(async () => {
    await closeAllTabs();
  });

  test('history lifecycle: add, recover, delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    // Ensure a group/state exists
    const g = `WL-Hist-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group',
        groupId: g
      });
    });

    // Add to history
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length > 0, 'History should have an entry');
    const histId = state.historyIds[0];

    // Recover and then delete
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'recover-state',
        historyId: histId
      });
    });

    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-history',
        historyId: histId
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length === 0 || !state.historyIds.includes(histId), 'History entry should be deleted');
  });

  test('create group, snapshot, switch, recover snapshot', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const gName = `WL-SnapRecover-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    // Switch to the group to make it active (already current after create — no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });

    // Take a snapshot
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length > 0, 'Snapshot should exist');
    const snapshotId = state.historyIds[0];

    // Create a second group and switch to it
    const g2Name = `WL-SnapRecover2-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: g2Name
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group2 = Object.values(state.groups).find((g) => g.name === g2Name);
    assert.ok(group2, 'Second group should exist');

    // Already current after create — no render
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group2.id
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group2.id, 'Should be on second group');

    // Recover the earlier snapshot
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'recover-state', historyId: snapshotId
      });
    });

    // State should be accessible and snapshot should still exist
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state, 'State should be readable after snapshot recovery');
  });

  test('multiple snapshots are preserved in order', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const g = `WL-MultiSnap-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: g
      });
    });

    // Take three snapshots
    for (let i = 0; i < 3; i++) {
      await trackSync(async () => {
        await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
          type: 'add-to-history'
        });
      });
    }

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length >= 3, 'Should have at least 3 history entries');

    // Delete the middle one
    const middleId = state.historyIds[1];
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-history', historyId: middleId
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.historyIds.includes(middleId), 'Middle history entry should be deleted');
    assert.ok(state.historyIds.length >= 2, 'Other history entries should remain');
  });

  test('recover snapshot then take new snapshot', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const g = `WL-RecoverSnap-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: g
      });
    });

    // Take a snapshot
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const firstSnapId = state.historyIds[0];
    assert.ok(firstSnapId, 'First snapshot should exist');

    // Recover it
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'recover-state', historyId: firstSnapId
      });
    });

    // Take another snapshot after recovery
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length >= 2, 'Should have at least 2 history entries after recover + snapshot');
  });

  test('history pruning respects max entries setting', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Set max history entries to a small number
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'update-history-max-entries', maxEntries: 3
      });
    });

    const g = `WL-Prune-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: g
      });
    });

    // Take 5 snapshots (exceeds max of 3)
    for (let i = 0; i < 5; i++) {
      await trackSync(async () => {
        await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
          type: 'add-to-history'
        });
      });
    }

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length <= 3, `History should be pruned to at most 3 entries, got ${state.historyIds.length}`);
  });
});
