const { suite, test } = require('mocha');
const assert = require('assert');
const {
  createGroup,
  renameGroup,
  deleteGroup,
  switchToGroup,
  dispatch,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

suite('Lifecycle: group', () => {
  lifecycleSetup();

  test('group lifecycle: create, rename, switch, delete', async function () {
    this.timeout(1000 * 20);
    const name = `WL-Group-${Date.now()}`;

    // Create group
    await createGroup(name);

    // Lookup newly created group id
    let state = await getState();
    const created = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(created, 'Group should be created');

    const newName = `${name}-renamed`;
    await renameGroup(created.id, newName);

    state = await getState();
    assert.strictEqual(state.groups[created.id].name, newName, 'Group should be renamed');

    // Switch to group (already current after create — no render)
    await dispatch({ type: 'switch-group', groupId: created.id });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, created.id, 'Selected group should match');

    // Delete group
    await deleteGroup(created.id);

    state = await getState();
    assert.ok(!state.groups[created.id], 'Group should be deleted');
  });

  test('delete active group falls back gracefully', async function () {
    this.timeout(1000 * 20);
    const name = `WL-DelActive-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to the group (already current after create — no render)
    await dispatch({ type: 'switch-group', groupId: group.id });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group.id, 'Should be on the group');

    // Delete the currently active group
    await deleteGroup(group.id);

    // State should still be accessible (no crash)
    state = await getState();
    assert.ok(!state.groups[group.id], 'Group should be deleted');
    assert.ok(state, 'State should still be readable after deleting active group');
  });

  test('multiple groups with interleaved create, switch, delete', async function () {
    this.timeout(1000 * 30);
    const names = [
      `WL-Multi-A-${Date.now()}`,
      `WL-Multi-B-${Date.now()}`,
      `WL-Multi-C-${Date.now()}`
    ];

    // Create all groups
    for (const name of names) {
      await createGroup(name);
    }

    let state = await getState();
    const groups = names.map((n) => Object.values(state.groups).find((g) => g.name === n));
    assert.ok(groups.every(Boolean), 'All groups should be created');

    // Switch to A, then B, then C (all have same state — mergeTabState, but render event still fires)
    for (const group of groups) {
      await switchToGroup(group.id);
    }

    state = await getState();
    assert.strictEqual(state.selectedGroupId, groups[2].id, 'Should be on group C');

    // Delete group B (middle) while on C — should not affect current
    await deleteGroup(groups[1].id);

    state = await getState();
    assert.ok(!state.groups[groups[1].id], 'Group B should be deleted');
    assert.strictEqual(state.selectedGroupId, groups[2].id, 'Should still be on group C');

    // Switch back to A
    await switchToGroup(groups[0].id);

    state = await getState();
    assert.strictEqual(state.selectedGroupId, groups[0].id, 'Should be on group A');

    // Delete A while it is active
    await deleteGroup(groups[0].id);

    state = await getState();
    assert.ok(!state.groups[groups[0].id], 'Group A should be deleted');
    assert.ok(state, 'State should still be accessible');
  });

  test('duplicate group name is silently ignored', async function () {
    this.timeout(1000 * 20);
    const name = `WL-Dup-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const groupCountBefore = Object.keys(state.groups).length;

    // Attempt to create another group with the same name (silently ignored — no sync)
    await dispatch({ type: 'new-group', groupId: name });

    state = await getState();
    const groupCountAfter = Object.keys(state.groups).length;
    assert.strictEqual(groupCountAfter, groupCountBefore, 'Duplicate group name should not create a new group');
  });

  test('rename active group preserves selection', async function () {
    this.timeout(1000 * 20);
    const name = `WL-RenameActive-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to it (already current after create — no render)
    await dispatch({ type: 'switch-group', groupId: group.id });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group.id, 'Should be on the group');

    // Rename while active
    const newName = `${name}-RENAMED`;
    await renameGroup(group.id, newName);

    state = await getState();
    assert.strictEqual(state.groups[group.id].name, newName, 'Name should be updated');
    assert.strictEqual(state.selectedGroupId, group.id, 'Selection should be preserved after rename');
  });

  test('switch to same group is idempotent', async function () {
    this.timeout(1000 * 20);
    const name = `WL-Idempotent-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to the group (already current after create — no render)
    await dispatch({ type: 'switch-group', groupId: group.id });

    // Switch again — should be idempotent (no render)
    await dispatch({ type: 'switch-group', groupId: group.id });

    state = await getState();
    assert.strictEqual(state.selectedGroupId, group.id, 'Should still be on the same group');
    assert.ok(state, 'State should remain stable after repeated switches');
  });

  test('switch to null forks state', async function () {
    this.timeout(1000 * 20);
    const name = `WL-Fork-${Date.now()}`;
    await createGroup(name);

    let state = await getState();
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to the group first (already current after create — no render)
    await dispatch({ type: 'switch-group', groupId: group.id });

    // Switch to null — should fork (no render)
    await dispatch({ type: 'switch-group', groupId: null });

    state = await getState();
    // selectedGroupId should no longer point to the group (forked to unsaved state)
    assert.ok(state, 'State should be accessible after forking');
  });
});
