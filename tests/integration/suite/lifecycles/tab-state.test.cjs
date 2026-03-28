const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const {
  CMD,
  activateExtension,
  sleep,
  openAndWaitWebview,
  openFile,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  waitForRenderStable
} = require('./helpers.cjs');

suite('Lifecycle: tab state with real editors', () => {
  test('group captures open files and restores them on switch', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();

    // Start from a clean slate and let any initial render complete
    await closeAllTabs();
    await sleep(2000);

    // Open 5 real files across 2 editor columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    const initialCount = totalTabCount();
    assert.ok(initialCount >= 5, `Should have at least 5 tabs open, got ${initialCount}`);
    assert.ok(getOpenTabs().length >= 2, 'Should have at least 2 editor columns');

    // Create group A — captures the current tabs, A becomes current
    const gA = `WL-TabState-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should be created');

    // Create group B immediately — captures same state, B becomes current
    // This freezes A's state so subsequent tab changes update B instead
    const gB = `WL-TabState-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupB, 'Group B should be created');

    // Now open extra files — updates B (current), not A
    await openFile('LICENSE', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);
    await openFile('build-browser.cjs', { viewColumn: vscode.ViewColumn.One });
    await sleep(1000);

    const tabsOnB = totalTabCount();
    assert.ok(tabsOnB >= 7, `Group B should have at least 7 tabs, got ${tabsOnB}`);

    // Switch to group A — should restore the original 5 files across 2 columns
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(2000);
    await waitForRenderStable();

    const tabsAfterSwitch = getOpenTabs();
    const countAfterSwitch = totalTabCount();

    assert.ok(
      countAfterSwitch <= initialCount + 1,
      `After switching back to A, should have ~${initialCount} tabs, got ${countAfterSwitch}`
    );

    const allLabels = tabsAfterSwitch.flatMap((g) => g.tabLabels);
    assert.ok(
      !allLabels.includes('LICENSE'),
      'LICENSE should not be open after switching back to group A'
    );
    assert.ok(
      !allLabels.includes('build-browser.cjs'),
      'build-browser.cjs should not be open after switching back to group A'
    );
    assert.ok(
      allLabels.some((l) => l.includes('package.json')),
      'package.json should be open in group A'
    );
    assert.ok(
      allLabels.some((l) => l.includes('CHANGELOG')),
      'CHANGELOG.md should be open in group A'
    );
  });

  test('switching groups closes old tabs and opens new ones', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Create group A — captures 5 files across 2 columns, A becomes current
    const gA = `WL-CloseOpen-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-CloseOpen-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Now close everything and open different files across 2 columns — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.One },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two },
      { file: 'build-webview.cjs', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Switch to A — should restore package.json, README.md, tsconfig, vitest, CHANGELOG
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(2000);
    await waitForRenderStable();

    let labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `Group A should have package.json open, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('README')),
      `Group A should have README.md open, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('vitest.config')),
      `Group A should have vitest.config.ts open, got: ${labels.join(', ')}`
    );

    // Switch to B — should restore build-browser, build-node, LICENSE, copy-assets, build-webview
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupB.id
    });
    await sleep(2000);
    await waitForRenderStable();

    labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('build-browser')),
      `Group B should have build-browser.cjs open, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('LICENSE')),
      `Group B should have LICENSE open, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('copy-assets')),
      `Group B should have copy-assets.cjs open, got: ${labels.join(', ')}`
    );
  });

  test('snapshot captures real tabs and recover restores them', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 5 real files in a single column (recover may not restore multi-column layouts)
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.One },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.One }
    ]);
    await sleep(1000);

    // Create a group — captures 5 files, becomes current
    const group = `WL-SnapTabs-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: group
    });
    await sleep(1500);

    // Take a snapshot of the current state
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(state.historyIds.length > 0, 'Should have at least one history entry');
    const historyId = state.historyIds[state.historyIds.length - 1];

    // Change the tabs — close all and open something completely different
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.One }
    ]);
    await sleep(1000);

    const tabsAfterChange = totalTabCount();
    assert.ok(tabsAfterChange >= 1, 'Should have at least 1 tab');

    // Recover the snapshot — should restore 5 files
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'recover-state', historyId
    });
    // Wait until a recovered file actually appears (old tabs get closed first)
    for (let i = 0; i < 60; i++) {
      const cur = getOpenTabs().flatMap((gr) => gr.tabLabels);
      if (cur.some((l) => l.includes('package.json') || l.includes('tsconfig'))) break;
      await sleep(500);
    }
    await waitForRenderStable(10000);

    const labels = getOpenTabs().flatMap((gr) => gr.tabLabels);

    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `Recovered tabs should include package.json, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('README')),
      `Recovered tabs should include README.md, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('tsconfig')),
      `Recovered tabs should include tsconfig.json, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('vitest.config')),
      `Recovered tabs should include vitest.config.ts, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('CHANGELOG')),
      `Recovered tabs should include CHANGELOG.md, got: ${labels.join(', ')}`
    );
  });

  test('addon apply opens the addon tabs into current editor', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 5 files across 2 columns for the addon
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Create a group so we can take a snapshot of the current state
    const group = `WL-AddonTabs-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: group
    });
    await sleep(1500);

    // Create addon from current state (5 files across 2 columns)
    const addonName = `WL-AddonTabs-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Now close all tabs and open different ones in 2 columns
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    const labelsBeforeApply = getOpenTabs().flatMap((gr) => gr.tabLabels);
    assert.ok(
      labelsBeforeApply.some((l) => l.includes('build-browser')),
      'Should have build-browser.cjs before addon apply'
    );

    // Apply the addon — should add the addon's tabs
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'apply-addon', addonId: addon.id
    });
    await sleep(2000);
    await waitForRenderStable();

    const labelsAfterApply = getOpenTabs().flatMap((gr) => gr.tabLabels);
    assert.ok(
      labelsAfterApply.some((l) => l.includes('package.json')),
      `After addon apply, package.json should be open. Got: ${labelsAfterApply.join(', ')}`
    );
    assert.ok(
      labelsAfterApply.some((l) => l.includes('vitest.config')),
      `After addon apply, vitest.config.ts should be open. Got: ${labelsAfterApply.join(', ')}`
    );
    assert.ok(
      labelsAfterApply.some((l) => l.includes('CHANGELOG')),
      `After addon apply, CHANGELOG.md should be open. Got: ${labelsAfterApply.join(', ')}`
    );
  });

  test('quick slot switch restores correct tabs', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Create group A — captures 5 files across 2 columns, A becomes current
    const gA = `WL-QSTabs-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-QSTabs-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Close all, open different files across 2 columns — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Assign quick slots
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '1', groupId: groupA.id
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '2', groupId: groupB.id
    });
    await sleep(500);

    // Apply quick slot 1 (group A) — should restore 5 files across 2 columns
    await vscode.commands.executeCommand(CMD('quickSlot1'));
    await sleep(2000);
    await waitForRenderStable();

    let labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `After quickSlot1, package.json should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('vitest.config')),
      `After quickSlot1, vitest.config.ts should be open. Got: ${labels.join(', ')}`
    );

    // Apply quick slot 2 (group B) — should restore build-browser, build-node, LICENSE, copy-assets
    await vscode.commands.executeCommand(CMD('quickSlot2'));
    await sleep(2000);
    await waitForRenderStable();

    labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('build-browser')),
      `After quickSlot2, build-browser.cjs should be open. Got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('LICENSE')),
      `After quickSlot2, LICENSE should be open. Got: ${labels.join(', ')}`
    );

    // Clean up
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '1', groupId: null
    });
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'assign-quick-slot', slot: '2', groupId: null
    });
  });

  test('group switch with multi-file set verifies tab count', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 6 files across 3 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Three },
      { file: 'LICENSE', column: vscode.ViewColumn.Three }
    ]);
    await sleep(1000);

    const countInA = totalTabCount();
    assert.ok(countInA >= 6, `Group A should have >= 6 tabs, got ${countInA}`);
    assert.ok(getOpenTabs().length >= 3, `Should have >= 3 editor columns, got ${getOpenTabs().length}`);

    // Create group A — captures 6 files across 3 columns, A becomes current
    const gA = `WL-MultiFile-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-MultiFile-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Close all and open 2 files in 1 column — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One }
    ]);
    await sleep(1000);

    const countInB = totalTabCount();
    assert.ok(countInB >= 2, `Group B should have >= 2 tabs, got ${countInB}`);
    assert.ok(countInA > countInB, `Group A (${countInA}) should have more tabs than B (${countInB})`);

    // Switch to A — should restore 6 tabs across 3 columns
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(2000);
    await waitForRenderStable();

    const countAfterReturn = totalTabCount();
    assert.ok(
      countAfterReturn >= 6,
      `After switching back to A, should have >= 6 tabs, got ${countAfterReturn}`
    );

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(labels.some((l) => l.includes('package.json')), 'package.json should be in group A');
    assert.ok(labels.some((l) => l.includes('README')), 'README.md should be in group A');
    assert.ok(labels.some((l) => l.includes('tsconfig')), 'tsconfig.json should be in group A');
    assert.ok(labels.some((l) => l.includes('vitest.config')), 'vitest.config.ts should be in group A');
    assert.ok(labels.some((l) => l.includes('CHANGELOG')), 'CHANGELOG.md should be in group A');
    assert.ok(labels.some((l) => l.includes('LICENSE')), 'LICENSE should be in group A');
  });

  test('clearAllTabs command closes all open editors', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Open 5 files across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(500);

    assert.ok(totalTabCount() >= 5, `Should have >= 5 tabs open before clearing, got ${totalTabCount()}`);
    assert.ok(getOpenTabs().length >= 2, 'Should have >= 2 editor columns before clearing');

    await vscode.commands.executeCommand(CMD('clearAllTabs'));
    await sleep(1000);

    assert.strictEqual(totalTabCount(), 0, 'All tabs should be closed after clearAllTabs');
  });

  test('rapid group switch with real tabs does not lose state', async function () {
    this.timeout(1000 * 90);
    await activateExtension();
    await openAndWaitWebview();

    await closeAllTabs();
    await sleep(2000);

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // Create group A — captures 5 files across 2 columns, A becomes current
    const gA = `WL-Rapid-A-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gA
    });
    await sleep(1000);

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-Rapid-B-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gB
    });
    await sleep(1000);

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Close all and open different files across 2 columns — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two }
    ]);
    await sleep(1000);

    // First do a clean switch to B then A to ensure both states are rendered
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(2000);
    await waitForRenderStable();

    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupB.id
    });
    await sleep(2000);
    await waitForRenderStable();

    // Rapidly switch back and forth 3 times
    for (let i = 0; i < 3; i++) {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groupA.id
      });
      await sleep(600);
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groupB.id
      });
      await sleep(600);
    }

    // Let rendering stabilise
    await sleep(3000);
    await waitForRenderStable();

    // Should end on group B
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(state.selectedGroupId, groupB.id, 'Should end on group B');

    // Switch to A one final time — verify package.json is restored
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'switch-group', groupId: groupA.id
    });
    await sleep(2000);
    await waitForRenderStable();

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `After rapid switching, group A should still have package.json. Got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('vitest.config')),
      `After rapid switching, group A should still have vitest.config.ts. Got: ${labels.join(', ')}`
    );
    assert.ok(
      totalTabCount() >= 5,
      `After rapid switching, group A should have >= 5 tabs, got ${totalTabCount()}`
    );
  });
});
