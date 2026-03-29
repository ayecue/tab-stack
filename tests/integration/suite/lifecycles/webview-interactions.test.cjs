const { suite, test, afterEach } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const {
  CMD,
  activateExtension,
  openAndWaitWebview,
  openFile,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  trackSync,
  getDetailedTabState,
  startCapture,
  getCaptured,
  stopCapture,
  waitForCapturedSync,
  waitUntil
} = require('./helpers.cjs');

suite('Lifecycle: webview interactions', () => {
  afterEach(async () => {
    await closeAllTabs();
  });

  test('tab-open selects the correct tab via webview dispatch', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    // Dispatch tab-open on column 1, index 0 (should focus package.json)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-open', index: 0, columnView: 1
    });

    await waitUntil(() => {
      const state = getOpenTabs();
      const col1 = state.find((g) => g.viewColumn === 1);
      return col1 && col1.tabLabels[0] && true;
    }, 'tab-open to take effect');

    const state = await getDetailedTabState();
    const col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    assert.ok(col1, 'Column 1 should exist');
    const activeTab1 = col1.tabs.find((t) => t.isActive);
    assert.ok(activeTab1, 'Column 1 should have an active tab');
    assert.ok(
      activeTab1.label.includes('package.json'),
      `Active tab should be package.json, got: ${activeTab1.label}`
    );

    // Now open tab at index 1 in column 1 (should focus README.md)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-open', index: 1, columnView: 1
    });

    await waitUntil(() => {
      const groups = vscode.window.tabGroups.all;
      const g1 = groups.find((g) => g.viewColumn === 1);
      return g1 && g1.activeTab && g1.activeTab.label.includes('README');
    }, 'README to become active');

    const state2 = await getDetailedTabState();
    const col1b = state2.tabGroups.find((g) => g.viewColumn === 1);
    const activeTab2 = col1b.tabs.find((t) => t.isActive);
    assert.ok(
      activeTab2.label.includes('README'),
      `Active tab should be README.md, got: ${activeTab2.label}`
    );
  });

  test('tab-close removes tab via webview dispatch', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    const beforeCount = totalTabCount();
    assert.ok(beforeCount >= 5, `Should start with >= 5 tabs, got ${beforeCount}`);

    // Close the first tab in column 1 via dispatch
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-close', index: 0, columnView: 1
    });
    await waitUntil(
      () => totalTabCount() === beforeCount - 1,
      'tab count to decrease after close'
    );

    const afterCount = totalTabCount();
    assert.strictEqual(afterCount, beforeCount - 1, `Should have one fewer tab after close`);

    // Verify the closed tab is no longer present
    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      !labels.includes('package.json'),
      `package.json should be closed, remaining: ${labels.join(', ')}`
    );
  });

  test('tab-toggle-pin toggles pin state via webview dispatch', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    // Verify tab is not pinned initially
    let state = await getDetailedTabState();
    let col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    assert.ok(col1, 'Column 1 should exist');
    assert.ok(!col1.tabs[0].isPinned, 'First tab should not be pinned initially');

    // Toggle pin on first tab in column 1
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-toggle-pin', index: 0, columnView: 1
    });
    await waitUntil(() => {
      const groups = vscode.window.tabGroups.all;
      const g1 = groups.find((g) => g.viewColumn === 1);
      return g1 && g1.tabs.some((t) => t.isPinned);
    }, 'tab to become pinned');

    state = await getDetailedTabState();
    col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    const pinnedTab = col1.tabs.find((t) => t.isPinned);
    assert.ok(pinnedTab, 'Should have a pinned tab after toggle');
    assert.ok(
      pinnedTab.label.includes('package.json'),
      `Pinned tab should be package.json, got: ${pinnedTab.label}`
    );

    // Toggle pin again to unpin
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-toggle-pin', index: 0, columnView: 1
    });
    await waitUntil(() => {
      const groups = vscode.window.tabGroups.all;
      const g1 = groups.find((g) => g.viewColumn === 1);
      return g1 && !g1.tabs.some((t) => t.isPinned);
    }, 'tab to become unpinned');

    state = await getDetailedTabState();
    col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    const stillPinned = col1.tabs.some((t) => t.isPinned);
    assert.ok(!stillPinned, 'Tab should be unpinned after second toggle');
  });

  test('tab-move reorders tabs within same column', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    // Get initial order in column 1
    let state = await getDetailedTabState();
    let col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    const firstLabel = col1.tabs[0].label;
    const secondLabel = col1.tabs[1].label;

    // Move tab from index 0 to index 1 within column 1 (swap first two)
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-move', fromIndex: 0, toIndex: 1, fromColumnView: 1, toColumnView: 1
    });

    await waitUntil(() => {
      const groups = vscode.window.tabGroups.all;
      const g1 = groups.find((g) => g.viewColumn === 1);
      return g1 && g1.tabs[0] && g1.tabs[0].label === secondLabel;
    }, 'tab order to change');

    state = await getDetailedTabState();
    col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    assert.strictEqual(
      col1.tabs[0].label, secondLabel,
      `First tab should now be "${secondLabel}", got "${col1.tabs[0].label}"`
    );
    assert.strictEqual(
      col1.tabs[1].label, firstLabel,
      `Second tab should now be "${firstLabel}", got "${col1.tabs[1].label}"`
    );
  });

  test('tab-move moves tab across columns', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    let state = await getDetailedTabState();
    let col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    let col2 = state.tabGroups.find((g) => g.viewColumn === 2);
    const col1Count = col1.tabs.length;
    const col2Count = col2.tabs.length;

    // Move first tab from column 1 to column 2 at index 0
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'tab-move', fromIndex: 0, toIndex: 0, fromColumnView: 1, toColumnView: 2
    });

    await waitUntil(() => {
      const groups = vscode.window.tabGroups.all;
      const g2 = groups.find((g) => g.viewColumn === 2);
      return g2 && g2.tabs.length === col2Count + 1;
    }, 'tab to move to column 2');

    state = await getDetailedTabState();
    col1 = state.tabGroups.find((g) => g.viewColumn === 1);
    col2 = state.tabGroups.find((g) => g.viewColumn === 2);

    // Column 1 should have one fewer tab
    if (col1) {
      assert.strictEqual(col1.tabs.length, col1Count - 1,
        `Column 1 should have ${col1Count - 1} tabs, got ${col1.tabs.length}`);
    }

    // Column 2 should have one more tab
    assert.ok(col2, 'Column 2 should still exist');
    assert.strictEqual(col2.tabs.length, col2Count + 1,
      `Column 2 should have ${col2Count + 1} tabs, got ${col2.tabs.length}`);

    // Verify the moved tab is in column 2
    assert.ok(
      col2.tabs.some((t) => t.label.includes('package.json')),
      `Column 2 should now have package.json, got: ${col2.tabs.map((t) => t.label).join(', ')}`
    );
  });

  test('sync messages emitted when creating groups', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    await startCapture();

    // Create a new group
    const gName = `WL-SyncGroup-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-group', groupId: gName
    });
    await waitForCapturedSync(1);

    const captured = await getCaptured(true);
    await stopCapture();

    // Should have at least one sync message with the new group
    assert.ok(captured.sync.length > 0, `Should have sync messages, got ${captured.sync.length}`);
    const lastSync = captured.sync[captured.sync.length - 1];
    assert.ok(
      lastSync.groups.some((g) => g.name === gName),
      `Sync should contain group "${gName}", got groups: ${lastSync.groups.map((g) => g.name).join(', ')}`
    );
    const groupEntry = lastSync.groups.find((g) => g.name === gName);
    assert.ok(groupEntry, `Sync should contain group "${gName}"`);
    assert.ok(groupEntry.tabCount >= 3, `Group should have >= 3 tabs, got ${groupEntry.tabCount}`);
    assert.ok(groupEntry.columnCount >= 1, `Group should have >= 1 column, got ${groupEntry.columnCount}`);
  });

  test('sync messages emitted when taking snapshots', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Create a group so the state container is active
    const gName = `WL-Snapshot-Sync-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gName
      });
    });

    // Record history count before snapshot
    let stateBefore = await vscode.commands.executeCommand(CMD('__test__getState'));
    const historyCountBefore = stateBefore.historyIds.length;

    await startCapture();

    // Take snapshot
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'add-to-history'
    });
    await waitForCapturedSync(1);

    const captured = await getCaptured(true);
    await stopCapture();

    // Should have emitted sync messages
    assert.ok(captured.sync.length > 0, `Should have sync messages after snapshot`);
    const lastSync = captured.sync[captured.sync.length - 1];

    // The sync should contain a new history entry
    assert.ok(lastSync.histories.length > historyCountBefore,
      `Sync should have more history entries than before (${historyCountBefore}), got ${lastSync.histories.length}`);

    // Verify the new history entry exists in state
    let stateAfter = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(stateAfter.historyIds.length, historyCountBefore + 1,
      `Should have exactly one more history entry`);

    // The group in the sync should still reflect the 5-tab state
    const groupEntry = lastSync.groups.find((g) => g.name === gName);
    assert.ok(groupEntry, `Sync should contain group "${gName}"`);
    assert.ok(groupEntry.tabCount >= 4, `Group should have >= 4 tabs, got ${groupEntry.tabCount}`);
    assert.ok(groupEntry.columnCount >= 1, `Group should have >= 1 column, got ${groupEntry.columnCount}`);
  });

  test('sync messages emitted when creating/deleting addons', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    await startCapture();

    // Create addon
    const addonName = `WL-SyncAddon-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'new-addon', name: addonName
    });
    await waitForCapturedSync(1);

    let captured = await getCaptured(true);

    // Should have sync with the addon
    assert.ok(captured.sync.length > 0, 'Should have sync after addon creation');
    let lastSync = captured.sync[captured.sync.length - 1];
    const addonEntry = lastSync.addons.find((a) => a.name === addonName);
    assert.ok(addonEntry, `Sync should contain addon "${addonName}"`);
    assert.ok(addonEntry.tabCount >= 3, `Addon should have >= 3 tabs, got ${addonEntry.tabCount}`);

    // Now delete the addon
    await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
      type: 'delete-addon', addonId: addonEntry.addonId
    });
    // After getCaptured(true) cleared the buffer, wait for 1 new sync from delete
    await waitForCapturedSync(1);

    captured = await getCaptured(true);
    await stopCapture();

    assert.ok(captured.sync.length > 0, 'Should have sync after addon deletion');
    lastSync = captured.sync[captured.sync.length - 1];
    const deletedAddon = lastSync.addons.find((a) => a.name === addonName);
    assert.ok(!deletedAddon, `Addon "${addonName}" should be removed from sync`);
  });

  test('rename group via webview dispatch', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    // Create group
    const gName = `WL-Rename-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, `Group "${gName}" should exist`);

    // Rename via dispatch
    const newName = `WL-Renamed-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'rename-group', groupId: group.id, name: newName
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const renamed = Object.values(state.groups).find((g) => g.id === group.id);
    assert.ok(renamed, 'Group should still exist after rename');
    assert.strictEqual(renamed.name, newName, `Group name should be "${newName}", got "${renamed.name}"`);
  });

  test('addon apply merges tabs into current editor', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 5 files across 2 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
      ]);
    });

    // Create addon with these 5 tabs
    const addonName = `WL-Apply-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addonName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const addon = Object.values(state.addons).find((a) => a.name === addonName);
    assert.ok(addon, `Addon "${addonName}" should exist`);

    // Close all tabs first
    await closeAllTabs();

    // Open just one tab
    await openFile('LICENSE', { viewColumn: vscode.ViewColumn.One });
    const beforeCount = totalTabCount();

    // Apply addon — should ADD its tabs without clearing existing
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'apply-addon', addonId: addon.id
      });
    });

    await waitUntil(
      () => totalTabCount() > beforeCount,
      'tab count to increase after addon apply'
    );

    const afterCount = totalTabCount();
    assert.ok(afterCount > beforeCount,
      `Tab count should increase after addon apply: before=${beforeCount}, after=${afterCount}`);

    // Verify addon tabs were added
    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `Should have package.json from addon, got: ${labels.join(', ')}`
    );
  });
});
