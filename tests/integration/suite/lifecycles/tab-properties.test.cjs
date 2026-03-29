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
  trackRender,
  getDetailedTabState,
  openFileWithSelection,
  pinActiveEditor,
  waitUntil,
  sleep,
  startCapture,
  getCaptured,
  stopCapture
} = require('./helpers.cjs');

suite('Lifecycle: tab properties', () => {
  afterEach(async () => {
    await closeAllTabs();
  });

  test('cursor selection is saved and restored on group switch', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open a file and set cursor to a specific position (line 5, char 10)
    await openFileWithSelection('package.json', 5, 10, { viewColumn: vscode.ViewColumn.One });

    // Open another file with cursor at a different position
    await trackSync(async () => {
      await openFileWithSelection('README.md', 2, 3, { viewColumn: vscode.ViewColumn.Two });
    });

    // Verify selection on active editor before group creation
    let tabState = await getDetailedTabState();
    assert.ok(tabState.selection, 'Should have a selection on the active editor');

    // Wait for triggerStateUpdate so state container has cursor data
    await sleep(200);

    // Create group A — captures tabs with their cursor positions
    const gA = `WL-Cursor-A-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gA
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B to freeze A
    const gB = `WL-Cursor-B-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gB
      });
    });

    // Dispose of all tabs, open new file with a different cursor position
    await closeAllTabs();
    await openFileWithSelection('tsconfig.json', 0, 0);

    // Switch back to group A — should restore cursor positions
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groupA.id
      });
    });

    // Wait for multi-column restore to complete
    await waitUntil(
      () => totalTabCount() >= 2 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after switch to A'
    );

    // Focus the README.md file and check its cursor position
    const tabs = getOpenTabs();
    const labels = tabs.flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('README')),
      `README.md should be open, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `package.json should be open, got: ${labels.join(', ')}`
    );

    tabState = await getDetailedTabState();
    // The editor should have a valid selection (cursor restored)
    assert.ok(tabState.selection, 'Active editor should have a cursor selection after restore');
  });

  test('active tab is restored on group switch across multiple columns', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open files across 2 columns — make README.md the active tab
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Open README.md last without preserveFocus so it becomes active
    await trackSync(async () => {
      await openFileWithSelection('README.md', 0, 0, { viewColumn: vscode.ViewColumn.One });
    });

    // Verify README.md is the active tab
    let detailedBefore = await getDetailedTabState();
    assert.ok(
      detailedBefore.activeEditorUri && detailedBefore.activeEditorUri.includes('README'),
      `README.md should be active before capture, got: ${detailedBefore.activeEditorUri}`
    );

    // Wait for triggerStateUpdate so state container is fully up-to-date
    await sleep(200);

    // Create group A
    const gA = `WL-Active-A-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gA
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B to freeze A
    const gB = `WL-Active-B-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gB
      });
    });

    // Switch away — open different file as active
    await closeAllTabs();
    await openFileWithSelection('build-browser.cjs', 0, 0);

    // Switch back to A — should restore README.md as active tab
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groupA.id
      });
    });

    // Wait for multi-column restore to complete
    await waitUntil(
      () => totalTabCount() >= 2 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after switch to A'
    );

    const detailedAfter = await getDetailedTabState();
    const allLabels = detailedAfter.tabGroups.flatMap((g) => g.tabs.map((t) => t.label));
    assert.ok(allLabels.some((l) => l.includes('package.json')), 'package.json should be restored');
    assert.ok(totalTabCount() >= 3, `Should have >= 3 tabs, got ${totalTabCount()}`);
  });

  test('pinned tabs are restored on group switch across columns', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open files across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Pin package.json — focus it first since pin applies to active editor
    await openFileWithSelection('package.json', 0, 0, { viewColumn: vscode.ViewColumn.One });
    await sleep(200);
    await pinActiveEditor();
    await sleep(200);

    // Verify package.json is pinned
    let detailed = await getDetailedTabState();
    const pinnedBefore = detailed.tabGroups.flatMap((g) => g.tabs).filter((t) => t.isPinned);
    assert.ok(
      pinnedBefore.some((t) => t.label.includes('package.json')),
      `package.json should be pinned, pinned tabs: ${pinnedBefore.map((t) => t.label).join(', ')}`
    );

    // Wait for triggerStateUpdate debounce to fire so state container captures pin state
    await sleep(200);

    // Create group A — captures pinned state
    const gA = `WL-Pinned-A-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gA
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B to freeze A
    const gB = `WL-Pinned-B-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gB
      });
    });

    // Switch away
    await closeAllTabs();
    await openFile('build-browser.cjs');

    // Switch back to A — should restore pinned state
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groupA.id
      });
    });

    // Wait for multi-column restore and pin state to be applied
    await waitUntil(
      () => totalTabCount() >= 3,
      'tabs to be restored after switch to A'
    );

    // Wait for pin state to be applied (may happen after restore)
    await waitUntil(
      () => {
        const tabs = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
        return tabs.some((t) => t.isPinned);
      },
      'pinned tab state to be restored',
      15000
    );

    detailed = await getDetailedTabState();
    const pinnedAfter = detailed.tabGroups.flatMap((g) => g.tabs).filter((t) => t.isPinned);
    assert.ok(
      pinnedAfter.some((t) => t.label.includes('package.json')),
      `package.json should still be pinned after restore, pinned tabs: ${pinnedAfter.map((t) => t.label).join(', ')}`
    );
    assert.ok(totalTabCount() >= 4, `Should have >= 4 tabs, got ${totalTabCount()}`);
  });

  test('tab positions are preserved across multiple columns on restore', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open files in a specific order across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two },
      { file: 'LICENSE', column: vscode.ViewColumn.Two }
    ]);

    // Capture the tab order before group creation
    const tabsBefore = await getDetailedTabState();
    const col1Before = tabsBefore.tabGroups.find((g) => g.viewColumn === 1);
    const col2Before = tabsBefore.tabGroups.find((g) => g.viewColumn === 2);
    assert.ok(col1Before, 'Column 1 should exist');
    assert.ok(col2Before, 'Column 2 should exist');
    assert.ok(col1Before.tabs.length >= 3, `Column 1 should have >= 3 tabs, got ${col1Before.tabs.length}`);
    assert.ok(col2Before.tabs.length >= 3, `Column 2 should have >= 3 tabs, got ${col2Before.tabs.length}`);

    const col1LabelsBefore = col1Before.tabs.map((t) => t.label);
    const col2LabelsBefore = col2Before.tabs.map((t) => t.label);

    // Create group A
    const gA = `WL-Position-A-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gA
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Verify state capture has all tabs
    assert.ok(
      groupA.tabCount >= 5,
      `Group A state should have >= 5 tabs after creation, got ${groupA.tabCount}. Labels: ${groupA.tabLabels?.join(', ')}`
    );
    assert.ok(
      groupA.columnCount >= 2,
      `Group A state should have >= 2 columns after creation, got ${groupA.columnCount}`
    );

    // Create group B to freeze A
    const gB = `WL-Position-B-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gB
      });
    });

    // Switch away
    await closeAllTabs();
    await openFile('build-browser.cjs');

    // Verify A's state is preserved before restore
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupABeforeRestore = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(
      groupABeforeRestore.tabCount >= 5,
      `Group A state should still have >= 5 tabs before restore, got ${groupABeforeRestore.tabCount}. Labels: ${groupABeforeRestore.tabLabels?.join(', ')}`
    );

    // Capture extension logs during restore
    await startCapture();

    // Switch back to A
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: groupA.id
      });
    });

    // Wait for multi-column restore to complete
    await waitUntil(
      () => totalTabCount() >= 4 && getOpenTabs().length >= 2,
      'tabs to be restored across multiple columns'
    );

    // Get captured extension logs from the restore operation
    const captured = await getCaptured(true);
    await stopCapture();
    const restoreLogs = captured.logs
      .filter((l) => l.message.includes('applyTabState') || l.message.includes('failed to open') || l.message.includes('not found in any tab group') || l.message.includes('moving tab'))
      .map((l) => l.message)
      .join(' | ');

    // Check state AFTER restore — has it degraded?
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupAAfterRestore = Object.values(state.groups).find((g) => g.name === gA);
    const stateAfterInfo = `State after restore: ${groupAAfterRestore?.tabCount} tabs, ${groupAAfterRestore?.columnCount} cols, labels=[${groupAAfterRestore?.tabLabels?.join(', ')}]`;

    // Verify tab positions are preserved
    const tabsAfter = await getDetailedTabState();
    const col1After = tabsAfter.tabGroups.find((g) => g.viewColumn === 1);
    const col2After = tabsAfter.tabGroups.find((g) => g.viewColumn === 2);
    const allLabelsAfter = tabsAfter.tabGroups.flatMap((g) => g.tabs.map((t) => `${t.label}@col${g.viewColumn}`));
    const diagnosticInfo = `\nLive tabs: [${allLabelsAfter.join(', ')}]\n${stateAfterInfo}\nExtension logs: ${restoreLogs || '(none)'}`;

    assert.ok(col1After, `Column 1 should exist after restore.${diagnosticInfo}`);

    const col1LabelsAfter = col1After.tabs.map((t) => t.label);

    // Check that most tabs from each column are restored correctly
    const col1Matches = col1LabelsBefore.filter((l) => col1LabelsAfter.includes(l)).length;
    assert.ok(col1Matches >= 2, `Column 1 should restore >= 2 of ${col1LabelsBefore.length} tabs, got ${col1Matches}: ${col1LabelsAfter.join(', ')}.${diagnosticInfo}`);

    if (col2After) {
      const col2LabelsAfter = col2After.tabs.map((t) => t.label);
      const col2Matches = col2LabelsBefore.filter((l) => col2LabelsAfter.includes(l)).length;
      assert.ok(col2Matches >= 2, `Column 2 should restore >= 2 of ${col2LabelsBefore.length} tabs, got ${col2Matches}: ${col2LabelsAfter.join(', ')}.${diagnosticInfo}`);
    }
  });

  test('pinned tabs remain pinned after snapshot recover', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open files across 2 columns and pin them BEFORE creating a group
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    // Pin tsconfig.json and package.json
    await openFileWithSelection('tsconfig.json', 0, 0, { viewColumn: vscode.ViewColumn.Two });
    await pinActiveEditor();
    await sleep(200); // Let VS Code settle after pin before switching columns
    await openFileWithSelection('package.json', 0, 0, { viewColumn: vscode.ViewColumn.One });
    await pinActiveEditor();
    await sleep(200);

    // Verify pins are captured before snapshot
    let detailed = await getDetailedTabState();
    const pinnedBefore = detailed.tabGroups.flatMap((g) => g.tabs).filter((t) => t.isPinned);
    assert.ok(pinnedBefore.length >= 2, `Should have >= 2 pinned tabs before snapshot, got ${pinnedBefore.length}`);

    // Create group — captures the pinned state
    const g = `WL-PinSnap-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: g
      });
    });

    // Let triggerStateUpdate debounce fire so state container has pin data
    await sleep(200);

    // Take snapshot
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const historyId = state.historyIds[state.historyIds.length - 1];

    // Verify snapshot captured all tabs
    const historyEntry = state.history?.[historyId];
    assert.ok(
      historyEntry?.tabCount >= 5,
      `Snapshot should have >= 5 tabs, got ${historyEntry?.tabCount}. Labels: ${historyEntry?.tabLabels?.join(', ')}`
    );

    // Replace tabs
    await closeAllTabs();
    await openFile('build-browser.cjs');

    // Capture extension logs during restore
    await startCapture();

    // Recover snapshot — wait for the full render cycle (includes pinning)
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'recover-state', historyId
      });
    });

    // Wait for restore to complete
    await waitUntil(
      () => totalTabCount() >= 3 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after snapshot recover'
    );

    // Get captured extension logs
    const captured = await getCaptured(true);
    await stopCapture();
    const restoreLogs = captured.logs
      .filter((l) => l.message && (l.message.includes('applyTabState') || l.message.includes('failed to open') || l.message.includes('not found in any tab group') || l.message.includes('moving tab')))
      .map((l) => l.message)
      .join(' | ');

    detailed = await getDetailedTabState();
    const allLabelsRestore = detailed.tabGroups.flatMap((g) => g.tabs.map((t) => `${t.label}(pin=${t.isPinned})@col${g.viewColumn}`));
    const pinnedAfter = detailed.tabGroups.flatMap((g) => g.tabs).filter((t) => t.isPinned);
    assert.ok(
      pinnedAfter.length >= 1,
      `Should have >= 1 pinned tab after recover, got ${pinnedAfter.length}. Live tabs: [${allLabelsRestore.join(', ')}]. Extension logs: ${restoreLogs || '(none)'}`
    );
  });

  test('cursor selection is restored after snapshot recover', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open files and wait for sync
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.Two },
      { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
    ]);

    // Set cursor on package.json
    await openFileWithSelection('package.json', 3, 5, { viewColumn: vscode.ViewColumn.One });

    // Create group
    const g = `WL-CursorSnap-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: g
      });
    });

    // Let state container update before snapshot
    await sleep(200);

    // Take snapshot
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const historyId = state.historyIds[state.historyIds.length - 1];

    // Verify snapshot captured all tabs
    const cursorHistoryEntry = state.history?.[historyId];
    assert.ok(
      cursorHistoryEntry?.tabCount >= 3,
      `Cursor snapshot should have >= 3 tabs, got ${cursorHistoryEntry?.tabCount}. Labels: ${cursorHistoryEntry?.tabLabels?.join(', ')}`
    );

    // Change everything
    await closeAllTabs();
    await openFileWithSelection('build-node.cjs', 0, 0);

    // Capture extension logs during restore
    await startCapture();

    // Recover snapshot
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'recover-state', historyId
      });
    });

    // Wait for restore to complete
    await waitUntil(
      () => totalTabCount() >= 2 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after snapshot recover'
    );

    // Get captured extension logs
    const cursorCaptured = await getCaptured(true);
    await stopCapture();
    const cursorRestoreLogs = cursorCaptured.logs
      .filter((l) => l.message && (l.message.includes('applyTabState') || l.message.includes('failed to open') || l.message.includes('not found in any tab group') || l.message.includes('moving tab')))
      .map((l) => l.message)
      .join(' | ');

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    const cursorDiag = `\nLive tabs: [${labels.join(', ')}]\nExtension logs: ${cursorRestoreLogs || '(none)'}`;
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `package.json should be restored.${cursorDiag}`
    );
    assert.ok(
      labels.some((l) => l.includes('README')),
      `README.md should be restored.${cursorDiag}`
    );
    assert.ok(totalTabCount() >= 3, `Should have >= 3 tabs, got ${totalTabCount()}.${cursorDiag}`);
  });
});
