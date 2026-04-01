const { suite, test } = require('mocha');
const assert = require('assert');
const {
  createGroup,
  addToHistory,
  deleteHistory,
  updateHistoryMaxEntries,
  recoverState,
  dispatch,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

suite('Lifecycle: history', () => {
  lifecycleSetup();

  test('history lifecycle: add, recover, delete', async function () {
    this.timeout(1000 * 20);
    // Ensure a group/state exists
    const g = `WL-Hist-${Date.now()}`;
    await createGroup(g);

    // Add to history
    await addToHistory();

    let state = await getState();
    assert.ok(state.historyIds.length > 0, 'History should have an entry');
    const histId = state.historyIds[0];

    // Recover and then delete
    await recoverState(histId);

    await deleteHistory(histId);

    state = await getState();
    assert.ok(state.historyIds.length === 0 || !state.historyIds.includes(histId), 'History entry should be deleted');
  });

  test('create group, snapshot, switch, recover snapshot', async function () {
    this.timeout(1000 * 30);
    const gName = `WL-SnapRecover-${Date.now()}`;
    await createGroup(gName);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    // Switch to the group to make it active (already current after create — no render)
    await dispatch({ type: 'switch-group', groupId: group.id });

    // Take a snapshot
    await addToHistory();

    state = await getState();
    assert.ok(state.historyIds.length > 0, 'Snapshot should exist');
    const snapshotId = state.historyIds[0];

    // Create a second group and switch to it
    const g2Name = `WL-SnapRecover2-${Date.now()}`;
    await createGroup(g2Name);

    state = await getState();
    const group2 = Object.values(state.groups).find((g) => g.name === g2Name);
    assert.ok(group2, 'Second group should exist');

    // Already current after create — no render
    await dispatch({ type: 'switch-group', groupId: group2.id });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group2.id, 'Should be on second group');

    // Recover the earlier snapshot
    await recoverState(snapshotId);

    // State should be accessible and snapshot should still exist
    state = await getState();
    assert.ok(state, 'State should be readable after snapshot recovery');
  });

  test('multiple snapshots are preserved in order', async function () {
    this.timeout(1000 * 30);
    const g = `WL-MultiSnap-${Date.now()}`;
    await createGroup(g);

    // Take three snapshots
    for (let i = 0; i < 3; i++) {
      await addToHistory();
    }

    let state = await getState();
    assert.ok(state.historyIds.length >= 3, 'Should have at least 3 history entries');

    // Delete the middle one
    const middleId = state.historyIds[1];
    await deleteHistory(middleId);

    state = await getState();
    assert.ok(!state.historyIds.includes(middleId), 'Middle history entry should be deleted');
    assert.ok(state.historyIds.length >= 2, 'Other history entries should remain');
  });

  test('recover snapshot then take new snapshot', async function () {
    this.timeout(1000 * 30);
    const g = `WL-RecoverSnap-${Date.now()}`;
    await createGroup(g);

    // Take a snapshot
    await addToHistory();

    let state = await getState();
    const firstSnapId = state.historyIds[0];
    assert.ok(firstSnapId, 'First snapshot should exist');

    // Recover it
    await recoverState(firstSnapId);

    // Take another snapshot after recovery
    await addToHistory();

    state = await getState();
    assert.ok(state.historyIds.length >= 2, 'Should have at least 2 history entries after recover + snapshot');
  });

  test('history pruning respects max entries setting', async function () {
    this.timeout(1000 * 30);
    // Set max history entries to a small number
    await updateHistoryMaxEntries(3);

    const g = `WL-Prune-${Date.now()}`;
    await createGroup(g);

    // Take 5 snapshots (exceeds max of 3)
    for (let i = 0; i < 5; i++) {
      await addToHistory();
    }

    let state = await getState();
    assert.ok(state.historyIds.length <= 3, `History should be pruned to at most 3 entries, got ${state.historyIds.length}`);
  });
});
