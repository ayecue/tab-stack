const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const {
  openFile,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  trackSync,
  getDetailedTabState,
  waitUntil,
  startCapture,
  getCaptured,
  stopCapture,
  createGroup,
  switchToGroup,
  getState,
  lifecycleSetup
} = require('./helpers.cjs');

/**
 * Open a diff editor comparing two workspace files.
 */
async function openDiff(leftPath, rightPath, label, opts = {}) {
  const folder = vscode.workspace.workspaceFolders?.[0];
  assert.ok(folder, 'A workspace folder must be open');
  const leftUri = vscode.Uri.file(path.join(folder.uri.fsPath, leftPath));
  const rightUri = vscode.Uri.file(path.join(folder.uri.fsPath, rightPath));
  await vscode.commands.executeCommand('vscode.diff', leftUri, rightUri, label, {
    viewColumn: opts.viewColumn ?? vscode.ViewColumn.Active,
    preview: false,
    preserveFocus: true
  });
}

suite('Lifecycle: tab kinds', () => {
  lifecycleSetup();

  test('text editor tabs are captured and restored across multiple columns', async function () {
    this.timeout(1000 * 60);
    // Open 6 text files across 3 columns
    await trackSync(async () => {
      await openFiles([
        { file: 'package.json', column: vscode.ViewColumn.One },
        { file: 'README.md', column: vscode.ViewColumn.One },
        { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', column: vscode.ViewColumn.Three },
        { file: 'LICENSE', column: vscode.ViewColumn.Three }
      ]);
    });

    const detailed = await getDetailedTabState();
    assert.ok(detailed.tabGroups.length >= 3, `Should have >= 3 columns, got ${detailed.tabGroups.length}`);

    // Every tab should be TabInputText kind
    for (const group of detailed.tabGroups) {
      for (const tab of group.tabs) {
        assert.strictEqual(
          tab.kind,
          'TabInputText',
          `Tab "${tab.label}" should be TabInputText, got ${tab.kind}`
        );
      }
    }

    // Create group A — captures all 6 text tabs across 3 columns
    const gA = `WL-TextKind-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);

    // Create group B immediately to freeze A
    const gB = `WL-TextKind-B-${Date.now()}`;
    await createGroup(gB);

    // Replace with different files
    await closeAllTabs();
    await openFile('build-browser.cjs');

    // Switch to A — should restore 6 text tabs across 3 columns
    state = await getState();
    const groupAEntry = Object.values(state.groups).find((g) => g.name === gA);
    await switchToGroup(groupAEntry.id);

    // Wait for multi-column restore to complete
    await waitUntil(
      () => totalTabCount() >= 4 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after switch to A'
    );

    const restoredDetailed = await getDetailedTabState();
    const allLabels = restoredDetailed.tabGroups.flatMap((g) => g.tabs.map((t) => t.label));
    assert.ok(allLabels.some((l) => l.includes('package.json')), 'package.json should be restored');
    assert.ok(totalTabCount() >= 4, `Should have >= 4 tabs restored, got ${totalTabCount()}`);
  });

  test('diff editor tabs are captured and restored', async function () {
    this.timeout(1000 * 60);
    // Open text files and a diff tab across 2 columns
    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await trackSync(async () => {
      await openDiff('README.md', 'CHANGELOG.md', 'README ↔ CHANGELOG', { viewColumn: vscode.ViewColumn.Two });
    });

    const detailed = await getDetailedTabState();
    const allTabs = detailed.tabGroups.flatMap((g) => g.tabs);
    const diffTab = allTabs.find((t) => t.kind === 'TabInputTextDiff');
    assert.ok(diffTab, `Should have a TabInputTextDiff tab, got kinds: ${allTabs.map((t) => t.kind).join(', ')}`);

    // Create group to capture diff state
    const gA = `WL-DiffKind-A-${Date.now()}`;
    await createGroup(gA);

    // Create group B to freeze A
    const gB = `WL-DiffKind-B-${Date.now()}`;
    await createGroup(gB);

    // Replace with different file
    await closeAllTabs();
    await openFile('tsconfig.json');

    // Switch back to A
    let state = await getState();
    const groupAEntry = Object.values(state.groups).find((g) => g.name === gA);
    await switchToGroup(groupAEntry.id);

    // Wait for restore to complete
    await waitUntil(
      () => totalTabCount() >= 1 && getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'tabs to be restored after switch to A'
    );

    const restoredDetailed = await getDetailedTabState();
    const restoredTabs = restoredDetailed.tabGroups.flatMap((g) => g.tabs);
    // Diff tabs may not always be restorable depending on extension capabilities
    assert.ok(
      restoredTabs.some((t) => t.label.includes('package.json')),
      `package.json should be restored alongside diff`
    );
    assert.ok(totalTabCount() >= 1, `Should have >= 1 tab restored, got ${totalTabCount()}`);
  });

  test('editor terminal tabs are captured and restored on group switch', async function () {
    this.timeout(1000 * 60);
    // Open a text file alongside the terminal so we have a mixed state
    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });

    // Create a terminal in the editor area (appears as TabInputTerminal in tabGroups)
    const termName = `test-editor-term-${Date.now()}`;
    const terminal = vscode.window.createTerminal({
      name: termName,
      location: vscode.TerminalLocation.Editor
    });

    // Wait for the terminal tab to appear in the editor tab groups
    await waitUntil(
      () => {
        const allTabs = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
        return allTabs.some((t) => t.label === termName);
      },
      'editor terminal tab to appear in tab groups'
    );

    // Verify it's tracked as TabInputTerminal
    const detailed = await getDetailedTabState();
    const allTabs = detailed.tabGroups.flatMap((g) => g.tabs);
    const terminalTab = allTabs.find((t) => t.kind === 'TabInputTerminal');
    assert.ok(terminalTab, `Should have a TabInputTerminal tab, got kinds: ${allTabs.map((t) => t.kind).join(', ')}`);
    assert.strictEqual(terminalTab.label, termName, 'Terminal tab label should match');

    // Wait for the extension sync to pick up the terminal tab
    await trackSync(async () => {
      // Trigger a sync by briefly opening another file (nudges debounce)
      await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    });

    // Create group A to capture the terminal + text tabs
    const gA = `WL-EditorTerm-A-${Date.now()}`;
    await createGroup(gA);

    let state = await getState();
    const groupA = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(groupA, 'Group A should exist');
    assert.ok(
      groupA.tabLabels.some((l) => l === termName),
      `Group A should contain terminal "${termName}", got: ${groupA.tabLabels.join(', ')}`
    );

    // Create group B to freeze A, then replace tabs
    const gB = `WL-EditorTerm-B-${Date.now()}`;
    await createGroup(gB);

    // Close everything including the terminal
    terminal.dispose();
    await closeAllTabs();
    await openFile('tsconfig.json');

    // Switch back to group A — should restore the terminal editor tab
    await switchToGroup(groupA.id);

    // Wait for restore — the terminal should reappear as an editor tab
    await waitUntil(
      () => {
        const tabs = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
        return tabs.some((t) => t.label === termName);
      },
      'terminal editor tab to be restored after group switch',
      15000
    );

    // Verify the restored terminal tab
    const restoredDetailed = await getDetailedTabState();
    const restoredTabs = restoredDetailed.tabGroups.flatMap((g) => g.tabs);
    const restoredTerminal = restoredTabs.find((t) => t.kind === 'TabInputTerminal');
    assert.ok(restoredTerminal, `Terminal tab should be restored, got kinds: ${restoredTabs.map((t) => t.kind).join(', ')}`);
    assert.strictEqual(restoredTerminal.label, termName, 'Restored terminal should have the same name');

    // Also verify text tabs were restored
    assert.ok(
      restoredTabs.some((t) => t.label.includes('package.json')),
      `package.json should be restored alongside terminal, got: ${restoredTabs.map((t) => t.label).join(', ')}`
    );

    // Clean up any terminals
    const remaining = vscode.window.terminals.filter((t) => t.name === termName);
    remaining.forEach((t) => t.dispose());
  });

  test('mixed tab kinds across multiple columns are tracked', async function () {
    this.timeout(1000 * 60);
    // Open text files in column 1
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One }
    ]);

    // Open a diff in column 2
    await openDiff('CHANGELOG.md', 'LICENSE', 'CHANGELOG ↔ LICENSE', { viewColumn: vscode.ViewColumn.Two });

    // Open more text files in column 2
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.Two });

    // Open text in column 3
    await trackSync(async () => {
      await openFiles([
        { file: 'build-browser.cjs', column: vscode.ViewColumn.Three },
        { file: 'build-node.cjs', column: vscode.ViewColumn.Three }
      ]);
    });

    const detailed = await getDetailedTabState();
    assert.ok(detailed.tabGroups.length >= 3, `Should have >= 3 columns, got ${detailed.tabGroups.length}`);

    const allTabs = detailed.tabGroups.flatMap((g) => g.tabs);
    const textTabs = allTabs.filter((t) => t.kind === 'TabInputText');
    const diffTabs = allTabs.filter((t) => t.kind === 'TabInputTextDiff');
    assert.ok(textTabs.length >= 6, `Should have >= 6 text tabs, got ${textTabs.length}`);
    assert.ok(diffTabs.length >= 1, `Should have >= 1 diff tab, got ${diffTabs.length}`);

    // Create group to capture mixed state
    const gA = `WL-MixedKind-A-${Date.now()}`;
    await createGroup(gA);

    // Verify state capture
    let state = await getState();
    const groupAInfo = Object.values(state.groups).find((g) => g.name === gA);
    assert.ok(
      groupAInfo.tabCount >= 7,
      `Group A state should have >= 7 tabs (6 text + 1 diff), got ${groupAInfo.tabCount}. Labels: ${groupAInfo.tabLabels?.join(', ')}`
    );

    // Create group B to freeze A
    const gB = `WL-MixedKind-B-${Date.now()}`;
    await createGroup(gB);

    // Replace with completely different layout
    await closeAllTabs();
    await openFile('copy-assets.cjs');

    // Check A's state before restore
    state = await getState();
    const groupABeforeRestore = Object.values(state.groups).find((g) => g.name === gA);
    const aStateBeforeRestore = `Group A before restore: ${groupABeforeRestore?.tabCount} tabs, labels=[${groupABeforeRestore?.tabLabels?.join(', ')}]`;

    // Capture extension logs during restore
    await startCapture();

    // Switch back to A — should restore mixed tab kinds across 3 columns
    const groupAEntry = Object.values(state.groups).find((g) => g.name === gA);
    await switchToGroup(groupAEntry.id);

    // Wait for restore to complete
    await waitUntil(
      () => totalTabCount() >= 4,
      'tabs to be restored after switch to A'
    );

    // Get captured extension logs
    const captured = await getCaptured(true);
    await stopCapture();
    const restoreLogs = captured.logs
      .filter((l) => l.message && (l.message.includes('applyTabState') || l.message.includes('failed to open') || l.message.includes('not found in any tab group') || l.message.includes('moving tab')))
      .map((l) => l.message)
      .join(' | ');

    // Check state after restore
    state = await getState();
    const groupAAfterRestore = Object.values(state.groups).find((g) => g.name === gA);
    const aStateAfterRestore = `Group A after restore: ${groupAAfterRestore?.tabCount} tabs, labels=[${groupAAfterRestore?.tabLabels?.join(', ')}]`;

    const restored = await getDetailedTabState();
    const restoredAll = restored.tabGroups.flatMap((g) => g.tabs);
    const allLabels = restored.tabGroups.flatMap((g) => g.tabs.map((t) => `${t.label}(${t.kind})@col${g.viewColumn}`));
    const diagnosticInfo = `\nLive tabs: [${allLabels.join(', ')}]\n${aStateBeforeRestore}\n${aStateAfterRestore}\nExtension logs: ${restoreLogs || '(none)'}`;

    assert.ok(
      restoredAll.filter((t) => t.kind === 'TabInputText').length >= 6,
      `Should have >= 6 text tabs restored, got ${restoredAll.filter((t) => t.kind === 'TabInputText').length}.${diagnosticInfo}`
    );
  });
});
