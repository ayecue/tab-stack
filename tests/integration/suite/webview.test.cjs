const { suite, test } = require('mocha');
const assert = require('assert');
const {
  sleep,
  getState,
  lifecycleSetup,
  dispatch
} = require('./helpers/index.cjs');

suite('Webview interaction via test bridge', () => {
  lifecycleSetup();

  test('create and delete group through webview messages', async function () {
    this.timeout(1000 * 20);

    const name = `WVGroup-${Date.now()}`;

    // Simulate webview creating a group
    await dispatch({ type: 'new-group', groupId: name });

    await sleep(1000);

    // Verify group exists by reading state
    let state = await getState();
    const created = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(created, 'Group should have been created via webview message');

    // Assign quick slot to the created group id
    await dispatch({ type: 'assign-quick-slot', slot: '5', groupId: created.id });

    await sleep(1000);

    state = await getState();
    assert.strictEqual(state.quickSlots['5'], created.id, 'Quick slot should be set');

    // Delete the group using its id
    await dispatch({ type: 'delete-group', groupId: created.id });

    await sleep(1000);

    state = await getState();
    const stillThere = Object.values(state.groups).find((g) => g.name === name);
    assert.ok(!stillThere, 'Group should have been deleted via webview message');
  });

  test('history and settings updates via webview messages', async function () {
    this.timeout(1000 * 20);

    // Ensure at least one group/state exists
    const bootstrap = `WVBootstrap-${Date.now()}`;
    await dispatch({ type: 'new-group', groupId: bootstrap });

    await sleep(200);

    // Add to history through the webview
    await dispatch({ type: 'add-to-history' });

    await sleep(100);

    let state = await getState();
    assert.ok(state.historyIds.length >= 1, 'History should contain at least one entry');

    // Update settings from the webview (these trigger sync)
    await dispatch({ type: 'update-history-max-entries', maxEntries: 5 });
    await dispatch({ type: 'update-git-integration', enabled: true, groupPrefix: 'branch/' });

    // Just assert that nothing throws and state is still accessible
    state = await getState();
    assert.ok(state, 'State should be readable after settings updates');
  });
});
