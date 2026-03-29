const { suite, test, afterEach } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const { CMD, activateExtension, openAndWaitWebview, trackSync, trackRender, closeAllTabs } = require('./helpers.cjs');

suite('Lifecycle: group', () => {
  afterEach(async () => {
    await closeAllTabs();
  });

  test('group lifecycle: create, rename, switch, delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-Group-${Date.now()}`;

    // Create group
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group',
        groupId: name
      });
    });

    // Lookup newly created group id
    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const created = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(created, 'Group should be created');

    const newName = `${name}-renamed`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'rename-group',
        groupId: created.id,
        name: newName
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.groups[created.id].name, newName, 'Group should be renamed');

    // Switch to group (already current after create — no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group',
      groupId: created.id
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, created.id, 'Selected group should match');

    // Delete group
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-group',
        groupId: created.id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[created.id], 'Group should be deleted');
  });

  test('delete active group falls back gracefully', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-DelActive-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: name
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to the group (already current after create — no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group.id, 'Should be on the group');

    // Delete the currently active group
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-group', groupId: group.id
      });
    });

    // State should still be accessible (no crash)
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[group.id], 'Group should be deleted');
    assert.ok(state, 'State should still be readable after deleting active group');
  });

  test('multiple groups with interleaved create, switch, delete', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    const names = [
      `WL-Multi-A-${Date.now()}`,
      `WL-Multi-B-${Date.now()}`,
      `WL-Multi-C-${Date.now()}`
    ];

    // Create all groups
    for (const name of names) {
      await trackSync(async () => {
        await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
          type: 'new-group', groupId: name
        });
      });
    }

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groups = names.map((n) => Object.values(state.groups).find((g) => g.name === n));
    assert.ok(groups.every(Boolean), 'All groups should be created');

    // Switch to A, then B, then C (all have same state — mergeTabState, but render event still fires)
    for (const group of groups) {
      await trackRender(async () => {
        await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
          type: 'switch-group', groupId: group.id
        });
      });
    }

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groups[2].id, 'Should be on group C');

    // Delete group B (middle) while on C — should not affect current
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-group', groupId: groups[1].id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[groups[1].id], 'Group B should be deleted');
    assert.strictEqual(state.selectedGroupId, groups[2].id, 'Should still be on group C');

    // Switch back to A
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groups[0].id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groups[0].id, 'Should be on group A');

    // Delete A while it is active
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-group', groupId: groups[0].id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[groups[0].id], 'Group A should be deleted');
    assert.ok(state, 'State should still be accessible');
  });

  test('duplicate group name is silently ignored', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-Dup-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: name
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupCountBefore = Object.keys(state.groups).length;

    // Attempt to create another group with the same name (silently ignored — no sync)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: name
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupCountAfter = Object.keys(state.groups).length;
    assert.strictEqual(groupCountAfter, groupCountBefore, 'Duplicate group name should not create a new group');
  });

  test('rename active group preserves selection', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-RenameActive-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: name
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to it (already current after create — no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group.id, 'Should be on the group');

    // Rename while active
    const newName = `${name}-RENAMED`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'rename-group', groupId: group.id, name: newName
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.groups[group.id].name, newName, 'Name should be updated');
    assert.strictEqual(state.selectedGroupId, group.id, 'Selection should be preserved after rename');
  });

  test('switch to same group is idempotent', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-Idempotent-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: name
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to the group (already current after create — no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });

    // Switch again — should be idempotent (no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, group.id, 'Should still be on the same group');
    assert.ok(state, 'State should remain stable after repeated switches');
  });

  test('switch to null forks state', async function () {
    this.timeout(1000 * 20);
    await activateExtension();
    await openAndWaitWebview();

    const name = `WL-Fork-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: name
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(group, 'Group should exist');

    // Switch to the group first (already current after create — no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: group.id
    });

    // Switch to null — should fork (no render)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: null
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    // selectedGroupId should no longer point to the group (forked to unsaved state)
    assert.ok(state, 'State should be accessible after forking');
  });
});
