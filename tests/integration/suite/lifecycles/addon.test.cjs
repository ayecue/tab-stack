const { suite, test } = require('mocha');
const assert = require('assert');
const {
  sleep,
  createGroup,
  createAddon,
  renameAddon,
  deleteAddon,
  applyAddon,
  dispatch,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

suite('Lifecycle: addon', () => {
  lifecycleSetup();

  test('addon lifecycle: create, rename, apply, delete', async function () {
    this.timeout(1000 * 20);
    // Ensure a state exists
    const bootstrap = `WL-Bootstrap-${Date.now()}`;
    await createGroup(bootstrap);

    const addonName = `WL-Addon-${Date.now()}`;
    await createAddon(addonName);

    let state = await getState();
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    const renamed = `${addonName}-renamed`;
    await renameAddon(addon.id, renamed);

    state = await getState();
    assert.strictEqual(state.addons[addon.id].name, renamed, 'Addon should be renamed');

    // Apply addon (should not throw)
    await dispatch({ type: 'apply-addon', addonId: addon.id });

    // Delete addon
    await deleteAddon(addon.id);

    state = await getState();
    assert.ok(!state.addons[addon.id], 'Addon should be deleted');
  });

  test('duplicate addon name is silently ignored', async function () {
    this.timeout(1000 * 20);
    const bootstrap = `WL-AddonDupBoot-${Date.now()}`;
    await createGroup(bootstrap);

    const addonName = `WL-AddonDup-${Date.now()}`;
    await createAddon(addonName);

    let state = await getState();
    const addonCountBefore = Object.keys(state.addons).length;

    // Create another addon with the same name — no sync fires for a duplicate
    await dispatch({ type: 'new-addon', name: addonName });
    await sleep(500);

    state = await getState();
    assert.strictEqual(Object.keys(state.addons).length, addonCountBefore, 'Duplicate addon name should not create a new addon');
  });

  test('apply addon from a different group context', async function () {
    this.timeout(1000 * 30);
    // Create group A and make an addon from its state
    const gA = `WL-AddonCtx-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should exist');

    // Already current after create — no render
    await dispatch({ type: 'switch-group', groupId: groupA.id });

    const addonName = `WL-AddonCtx-${Date.now()}`;
    await createAddon(addonName);

    state = await getState();
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Create group B and switch to it
    const gB = `WL-AddonCtx-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupB, 'Group B should exist');

    // Group B is already current after create — no render needed
    await dispatch({ type: 'switch-group', groupId: groupB.id });

    // Apply addon (created in group A context) while on group B — should not crash
    await applyAddon(addon.id);

    state = await getState();
    assert.ok(state, 'State should be accessible after cross-context addon apply');
  });

  test('multiple addons applied in sequence', async function () {
    this.timeout(1000 * 30);
    const bootstrap = `WL-MultiAddonBoot-${Date.now()}`;
    await createGroup(bootstrap);

    const addon1 = `WL-MultiAddon-1-${Date.now()}`;
    const addon2 = `WL-MultiAddon-2-${Date.now()}`;

    await createAddon(addon1);
    await createAddon(addon2);

    let state = await getState();
    const a1 = Object.values(state.addons).find((a) => a.name === addon1);
    const a2 = Object.values(state.addons).find((a) => a.name === addon2);
    assert.ok(a1 && a2, 'Both addons should exist');

    // Apply them in sequence (addon bypasses render pipeline, triggers sync)
    await applyAddon(a1.id);
    await applyAddon(a2.id);

    state = await getState();
    assert.ok(state, 'State should be stable after sequential addon applies');
  });
});
