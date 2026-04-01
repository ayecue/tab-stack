const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const {
  CMD,
  sleep,
  openFile,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  trackSync,
  trackRender,
  waitUntil,
  startCapture,
  getCaptured,
  stopCapture,
  createGroup,
  addToHistory,
  createAddon,
  applyAddon,
  assignQuickSlot,
  switchToGroup,
  recoverState,
  dispatch,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

suite('Lifecycle: tab state with real editors', () => {
  lifecycleSetup();

  test('group captures open files and restores them on switch', async function () {
    this.timeout(1000 * 60);
    // Start from a clean slate
    await closeAllTabs();

    // Open 5 real files across 2 editor columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    const initialCount = totalTabCount();
    assert.ok(initialCount >= 5, `Should have at least 5 tabs open, got ${initialCount}`);
    assert.ok(getOpenTabs().length >= 2, 'Should have at least 2 editor columns');

    // Create group A — captures the current tabs, A becomes current
    const gA = `WL-TabState-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should be created');

    // Create group B immediately — captures same state, B becomes current
    const gB = `WL-TabState-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
    const groupB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupB, 'Group B should be created');

    // Now open extra files — updates B (current), not A
    await trackSync(async () => {
      await openFile('LICENSE', { viewColumn: vscode.ViewColumn.Two });
    });
    await trackSync(async () => {
      await openFile('build-browser.cjs', { viewColumn: vscode.ViewColumn.One });
    });

    const tabsOnB = totalTabCount();
    assert.ok(tabsOnB >= 7, `Group B should have at least 7 tabs, got ${tabsOnB}`);

    // Switch to group A — should restore the original 5 files across 2 columns
    await switchToGroup(groupA.id);

    // Wait for all tabs to be restored and stale tabs to be removed
    await waitUntil(
      () => {
        const labels = getOpenTabs().flatMap((g) => g.tabLabels);
        return labels.some((l) => l.includes('package.json')) &&
          labels.some((l) => l.includes('CHANGELOG')) &&
          !labels.includes('LICENSE') &&
          !labels.includes('build-browser.cjs');
      },
      'group A tabs to fully restore (stale tabs removed)',
      15000
    );

    const tabsAfterSwitch = getOpenTabs();
    const countAfterSwitch = totalTabCount();

    assert.ok(
      countAfterSwitch <= initialCount + 2,
      `After switching back to A, should have ~${initialCount} tabs, got ${countAfterSwitch}`
    );

    const allLabels = tabsAfterSwitch.flatMap((g) => g.tabLabels);
    assert.ok(
      allLabels.some((l) => l.includes('package.json')),
      'package.json should be open in group A'
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
    await closeAllTabs();

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Create group A
    const gA = `WL-CloseOpen-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-CloseOpen-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Now close everything and open different files — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.One },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two },
      { file: 'build-webview.cjs', column: vscode.ViewColumn.Two }
    ]);

    // Switch to A — should restore package.json, README.md, tsconfig, vitest, CHANGELOG
    await switchToGroup(groupA.id);

    // Wait for multi-column restore to complete
    await waitUntil(
      () => totalTabCount() >= 3 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after switch to A'
    );

    let labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `Group A should have package.json open, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('README')),
      `Group A should have README.md open, got: ${labels.join(', ')}`
    );

    // Switch to B — should restore build-browser, build-node, LICENSE, copy-assets, build-webview
    await switchToGroup(groupB.id);

    await waitUntil(
      () => getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('build-browser')),
      'build-browser to appear after switch to B'
    );

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
    await closeAllTabs();

    // Open 5 real files in a single column
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.One },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.One }
    ]);

    // Create a group — captures 5 files, becomes current
    const group = `WL-SnapTabs-${Date.now()}`;
    await createGroup(group);

    // Take a snapshot of the current state
    await addToHistory();

    let state = await getState();
    assert.ok(state.historyIds.length > 0, 'Should have at least one history entry');
    const historyId = state.historyIds[state.historyIds.length - 1];

    // Change the tabs — close all and open something completely different
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.One }
    ]);

    const tabsAfterChange = totalTabCount();
    assert.ok(tabsAfterChange >= 1, 'Should have at least 1 tab');

    // Recover the snapshot — should restore 5 files
    await recoverState(historyId);

    // Wait until recovered files appear (including multi-column tabs)
    await waitUntil(
      () => totalTabCount() >= 4 && getOpenTabs().flatMap((gr) => gr.tabLabels).some((l) => l.includes('package.json')),
      'recovered tabs to appear'
    );

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
      totalTabCount() >= 4,
      `Should have at least 4 recovered tabs, got ${totalTabCount()}`
    );
  });

  test('addon apply opens the addon tabs into current editor', async function () {
    this.timeout(1000 * 60);
    await closeAllTabs();

    // Open 5 files across 2 columns for the addon
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Create a group so we can take a snapshot of the current state
    const group = `WL-AddonTabs-${Date.now()}`;
    await createGroup(group);

    // Create addon from current state (5 files across 2 columns)
    const addonName = `WL-AddonTabs-${Date.now()}`;
    await createAddon(addonName);

    let state = await getState();
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, 'Addon should be created');

    // Now close all tabs and open different ones in 2 columns
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two }
    ]);

    const labelsBeforeApply = getOpenTabs().flatMap((gr) => gr.tabLabels);
    assert.ok(
      labelsBeforeApply.some((l) => l.includes('build-browser')),
      'Should have build-browser.cjs before addon apply'
    );

    // Apply the addon — should add the addon's tabs (addon bypasses render, triggers sync)
    await applyAddon(addon.id);

    await waitUntil(
      () => getOpenTabs().flatMap((gr) => gr.tabLabels).some((l) => l.includes('package.json')),
      'addon tabs to appear'
    );

    const labelsAfterApply = getOpenTabs().flatMap((gr) => gr.tabLabels);
    assert.ok(
      labelsAfterApply.some((l) => l.includes('package.json')),
      `After addon apply, package.json should be open. Got: ${labelsAfterApply.join(', ')}`
    );
    assert.ok(
      labelsAfterApply.some((l) => l.includes('README')),
      `After addon apply, README.md should be open. Got: ${labelsAfterApply.join(', ')}`
    );
  });

  test('quick slot switch restores correct tabs', async function () {
    this.timeout(1000 * 60);
    await closeAllTabs();

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Create group A
    const gA = `WL-QSTabs-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-QSTabs-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Close all, open different files — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two }
    ]);

    // Assign quick slots
    await dispatch({ type: 'assign-quick-slot', slot: '1', groupId: groupA.id });
    await assignQuickSlot('2', groupB.id);

    // Apply quick slot 1 (group A) — should restore 5 files across 2 columns
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot1'));
    });

    // Wait for multi-column restore
    await waitUntil(
      () => totalTabCount() >= 4 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after quickSlot1'
    );

    let labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `After quickSlot1, package.json should be open. Got: ${labels.join(', ')}`
    );

    // Apply quick slot 2 (group B) — should restore build-browser, build-node, LICENSE, copy-assets
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('quickSlot2'));
    });

    await waitUntil(
      () => {
        const l = getOpenTabs().flatMap((g) => g.tabLabels);
        return l.some((x) => x.includes('build-browser')) && l.some((x) => x.includes('LICENSE'));
      },
      'build-browser and LICENSE to appear after quickSlot2'
    );

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
    await dispatch({ type: 'assign-quick-slot', slot: '1', groupId: null });
    await dispatch({ type: 'assign-quick-slot', slot: '2', groupId: null });
  });

  test('group switch with multi-file set verifies tab count', async function () {
    this.timeout(1000 * 60);
    await closeAllTabs();

    // Open 6 files across 3 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Three },
      { file: 'LICENSE', column: vscode.ViewColumn.Three }
    ]);

    const countInA = totalTabCount();
    assert.ok(countInA >= 6, `Group A should have >= 6 tabs, got ${countInA}`);
    assert.ok(getOpenTabs().length >= 3, `Should have >= 3 editor columns, got ${getOpenTabs().length}`);

    // Create group A
    const gA = `WL-MultiFile-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-MultiFile-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Close all and open 2 files in 1 column — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One }
    ]);

    const countInB = totalTabCount();
    assert.ok(countInB >= 2, `Group B should have >= 2 tabs, got ${countInB}`);
    assert.ok(countInA > countInB, `Group A (${countInA}) should have more tabs than B (${countInB})`);

    // Switch to A — should restore 6 tabs across 3 columns
    await switchToGroup(groupA.id);

    await waitUntil(
      () => {
        const l = getOpenTabs().flatMap((g) => g.tabLabels);
        return totalTabCount() >= 4 && l.some((x) => x.includes('package.json'));
      },
      'at least 4 tabs to be restored',
      15000
    );

    const countAfterReturn = totalTabCount();
    assert.ok(
      countAfterReturn >= 4,
      `After switching back to A, should have >= 4 tabs, got ${countAfterReturn}`
    );

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(labels.some((l) => l.includes('package.json')), 'package.json should be in group A');
    assert.ok(labels.some((l) => l.includes('README')), 'README.md should be in group A');
    assert.ok(labels.some((l) => l.includes('tsconfig')), 'tsconfig.json should be in group A');
  });

  test('clearAllTabs command closes all open editors', async function () {
    this.timeout(1000 * 30);
    // Open 5 files across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    assert.ok(totalTabCount() >= 5, `Should have >= 5 tabs open before clearing, got ${totalTabCount()}`);
    assert.ok(getOpenTabs().length >= 2, 'Should have >= 2 editor columns before clearing');

    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('clearAllTabs'));
    });

    assert.strictEqual(totalTabCount(), 0, 'All tabs should be closed after clearAllTabs');
  });

  test('rapid group switch with real tabs does not lose state', async function () {
    this.timeout(1000 * 90);
    await closeAllTabs();

    // Open 5 files across 2 columns for group A
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Create group A
    const gA = `WL-Rapid-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Verify state capture has all 5 tabs
    assert.ok(
      groupA.tabCount >= 5,
      `Group A state should have >= 5 tabs after creation, got ${groupA.tabCount}. Labels: ${groupA.tabLabels?.join(', ')}`
    );

    // Create group B immediately — B becomes current, freezes A
    const gB = `WL-Rapid-B-${Date.now()}`;
    await createGroup(gB);

    state = await getState();
    const groupB = Object.values(state.groups).find((g) => g.name === gB);

    // Close all and open different files — updates B, not A
    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two },
      { file: 'copy-assets.cjs', column: vscode.ViewColumn.Two }
    ]);

    // First do a clean switch to A then B to ensure both states are rendered
    await switchToGroup(groupA.id);

    await switchToGroup(groupB.id);

    // Rapidly switch back and forth 3 times
    for (let i = 0; i < 3; i++) {
      await switchToGroup(groupA.id);
      await sleep(600);
      await switchToGroup(groupB.id);
      await sleep(600);
    }

    // Should end on group B
    state = await getState();
    assert.strictEqual(state.selectedGroupId, groupB.id, 'Should end on group B');

    // Check A's stored state BEFORE final switch — has it degraded from rapid switching?
    const groupABeforeFinal = Object.values(state.groups).find((g) => g.name === gA);
    const aStateBeforeFinal = `Group A before final switch: ${groupABeforeFinal?.tabCount} tabs, labels=[${groupABeforeFinal?.tabLabels?.join(', ')}]`;

    // Capture extension logs during the final restore
    await startCapture();

    // Switch to A one final time — verify package.json is restored
    await switchToGroup(groupA.id);

    // Wait for multi-column restore to complete
    await waitUntil(
      () => totalTabCount() >= 3 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after final switch to A'
    );

    // Get captured extension logs from the restore
    const captured = await getCaptured(true);
    await stopCapture();
    const restoreLogs = captured.logs
      .filter((l) => l.message && (l.message.includes('applyTabState') || l.message.includes('failed to open') || l.message.includes('not found in any tab group') || l.message.includes('moving tab')))
      .map((l) => l.message)
      .join(' | ');

    // Check state AFTER restore — compare with before
    state = await getState();
    const groupAAfterFinal = Object.values(state.groups).find((g) => g.name === gA);
    const aStateAfterFinal = `Group A after final switch: ${groupAAfterFinal?.tabCount} tabs, labels=[${groupAAfterFinal?.tabLabels?.join(', ')}]`;

    const allLabels = getOpenTabs().flatMap((g) => `[col${g.viewColumn}: ${g.tabLabels.join(', ')}]`);
    const diagnosticInfo = `\nLive tabs: ${allLabels.join(' ')}\n${aStateBeforeFinal}\n${aStateAfterFinal}\nExtension logs: ${restoreLogs || '(none)'}`;

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `After rapid switching, group A should still have package.json.${diagnosticInfo}`
    );
    assert.ok(
      totalTabCount() >= 5,
      `After rapid switching, group A should have >= 5 tabs, got ${totalTabCount()}.${diagnosticInfo}`
    );
  });
});
