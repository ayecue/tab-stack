const { suite, test, afterEach } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const {
  CMD,
  activateExtension,
  openAndWaitWebview,
  openFiles,
  getOpenTabs,
  totalTabCount,
  closeAllTabs,
  trackSync,
  trackRender,
  waitUntil,
  sleep
} = require('./helpers.cjs');

function getTmpFilePath(name) {
  const folder = vscode.workspace.workspaceFolders?.[0];
  return path.join(folder.uri.fsPath, '.tmp-test-' + name);
}

function cleanupTmpFile(filePath) {
  try { fs.unlinkSync(filePath); } catch {}
}

suite('Lifecycle: import/export', () => {
  afterEach(async () => {
    await closeAllTabs();
  });

  test('export and import a single tab group with real tabs', async function () {
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

    // Create group
    const gName = `WL-Export-Group-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(group, 'Group should exist');

    // Export the group to a temp file
    const exportPath = getTmpFilePath('group-export.tabstack');
    await vscode.commands.executeCommand(CMD('__test__exportGroup'), group.id, exportPath);
    await waitUntil(() => fs.existsSync(exportPath), 'export file to be written');

    // Verify export file exists and contains valid JSON
    assert.ok(fs.existsSync(exportPath), 'Export file should exist');
    const exportContent = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    assert.strictEqual(exportContent.type, 'tabstack-group', 'Export should be a tabstack-group');
    assert.ok(exportContent.group, 'Export should contain group data');
    assert.ok(exportContent.group.name === gName, `Export group name should be "${gName}"`);

    // Delete the original group
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'delete-group', groupId: group.id
      });
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.ok(!state.groups[group.id], 'Original group should be deleted');

    // Import the group back
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__importGroup'), exportPath);
    });

    // Verify the imported group appears (with a new ID but same name)
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const importedGroup = Object.values(state.groups).find((g) => g.name === gName);
    assert.ok(importedGroup, `Imported group "${gName}" should exist`);
    assert.notStrictEqual(importedGroup.id, group.id, 'Imported group should have a new ID');

    // Switch to the imported group to verify tab restoration
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: importedGroup.id
      });
    });

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `Imported group should have package.json, got: ${labels.join(', ')}`
    );
    assert.ok(
      labels.some((l) => l.includes('vitest.config')),
      `Imported group should have vitest.config.ts, got: ${labels.join(', ')}`
    );
    assert.ok(totalTabCount() >= 5, `Should have >= 5 tabs from import, got ${totalTabCount()}`);

    cleanupTmpFile(exportPath);
  });

  test('export and import whole tab stack state', async function () {
    this.timeout(1000 * 90);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Setup: 2 groups with different file sets
    // Group A: 5 files across 2 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.One },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Two }
    ]);

    const gA = `WL-StateExport-A-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gA
      });
    });

    // Group B: different files
    const gB = `WL-StateExport-B-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gB
      });
    });

    await closeAllTabs();
    await openFiles([
      { file: 'build-browser.cjs', column: vscode.ViewColumn.One },
      { file: 'build-node.cjs', column: vscode.ViewColumn.One },
      { file: 'LICENSE', column: vscode.ViewColumn.Two }
    ]);

    // Create an addon
    const addonName = `WL-StateExport-Addon-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-addon', name: addonName
      });
    });

    // Wait for triggerStateUpdate so state container has all tab data
    await sleep(200);

    // Take snapshot
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'add-to-history'
      });
    });

    // Verify we have groups, addon, history
    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const groupAObj = Object.values(state.groups).find((g) => g.name === gA);
    const groupBObj = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(groupAObj, 'Group A should exist');
    assert.ok(groupBObj, 'Group B should exist');
    assert.ok(Object.values(state.addons).some((a) => a.name === addonName), 'Addon should exist');
    const historyCountBefore = state.historyIds.length;
    assert.ok(historyCountBefore > 0, 'Should have history');

    // Export full state
    const exportPath = getTmpFilePath('state-export.json');
    await vscode.commands.executeCommand(CMD('__test__exportState'), exportPath);
    await waitUntil(() => fs.existsSync(exportPath), 'state export file to be written');

    // Verify export file exists and is valid JSON
    assert.ok(fs.existsSync(exportPath), 'State export file should exist');
    const exportContent = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    assert.ok(exportContent.version != null, 'Export should have a version');
    assert.ok(exportContent.groups, 'Export should have groups');

    // Reset everything
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__resetState'));
    });

    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    assert.strictEqual(Object.keys(state.groups).length, 0, 'Groups should be cleared after reset');
    assert.strictEqual(Object.keys(state.addons).length, 0, 'Addons should be cleared after reset');

    // Import the state back
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__importState'), exportPath);
    });

    // Verify groups, addon, and history are restored
    state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const restoredA = Object.values(state.groups).find((g) => g.name === gA);
    const restoredB = Object.values(state.groups).find((g) => g.name === gB);
    assert.ok(restoredA, `Group A "${gA}" should be restored after import`);
    assert.ok(restoredB, `Group B "${gB}" should be restored after import`);
    assert.ok(
      Object.values(state.addons).some((a) => a.name === addonName),
      `Addon "${addonName}" should be restored after import`
    );

    // Switch to group A to verify tabs
    await trackRender(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'switch-group', groupId: restoredA.id
      });
    });

    // Wait for tabs to be restored after import
    await waitUntil(
      () => getOpenTabs().flatMap((g) => g.tabLabels).some((l) => l.includes('package.json')),
      'package.json to appear after switching to restored group A'
    );

    const labels = getOpenTabs().flatMap((g) => g.tabLabels);
    assert.ok(
      labels.some((l) => l.includes('package.json')),
      `Restored group A should have package.json, got: ${labels.join(', ')}`
    );

    cleanupTmpFile(exportPath);
  });

  test('import invalid file shows error notification', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Write an invalid JSON file
    const invalidPath = getTmpFilePath('invalid-import.json');
    fs.writeFileSync(invalidPath, 'not valid json {{{', 'utf8');

    // Start capture to see the error notification
    await vscode.commands.executeCommand(CMD('__test__startCapture'));

    // Attempt import
    await vscode.commands.executeCommand(CMD('__test__importState'), invalidPath);
    await waitUntil(async () => {
      const c = await vscode.commands.executeCommand(CMD('__test__getCapturedMessages'), false);
      return c.notify.length > 0;
    }, 'error notification to appear');

    const captured = await vscode.commands.executeCommand(CMD('__test__getCapturedMessages'), true);
    assert.ok(
      captured.notify.some((n) => n.message.includes('Invalid') || n.message.includes('parse')),
      `Should get an error notification for invalid JSON, got: ${captured.notify.map((n) => n.message).join('; ')}`
    );

    await vscode.commands.executeCommand(CMD('__test__stopCapture'));
    cleanupTmpFile(invalidPath);
  });

  test('import invalid group file shows error notification', async function () {
    this.timeout(1000 * 30);
    await activateExtension();
    await openAndWaitWebview();

    // Write a valid JSON but wrong format
    const wrongFormatPath = getTmpFilePath('wrong-group.tabstack');
    fs.writeFileSync(wrongFormatPath, JSON.stringify({ type: 'wrong-type', data: {} }), 'utf8');

    await vscode.commands.executeCommand(CMD('__test__startCapture'));

    await vscode.commands.executeCommand(CMD('__test__importGroup'), wrongFormatPath);
    await waitUntil(async () => {
      const c = await vscode.commands.executeCommand(CMD('__test__getCapturedMessages'), false);
      return c.notify.length > 0;
    }, 'error notification to appear');

    const captured = await vscode.commands.executeCommand(CMD('__test__getCapturedMessages'), true);
    assert.ok(
      captured.notify.some((n) => n.message.includes('Invalid') || n.message.includes('Missing')),
      `Should get error for wrong format, got: ${captured.notify.map((n) => n.message).join('; ')}`
    );

    await vscode.commands.executeCommand(CMD('__test__stopCapture'));
    cleanupTmpFile(wrongFormatPath);
  });

  test('export group preserves tab positions across columns', async function () {
    this.timeout(1000 * 60);
    await activateExtension();
    await openAndWaitWebview();
    await closeAllTabs();

    // Open 6 files across 3 columns
    await openFiles([
      { file: 'package.json', column: vscode.ViewColumn.One },
      { file: 'README.md', column: vscode.ViewColumn.One },
      { file: 'tsconfig.json', column: vscode.ViewColumn.Two },
      { file: 'vitest.config.ts', column: vscode.ViewColumn.Two },
      { file: 'CHANGELOG.md', column: vscode.ViewColumn.Three },
      { file: 'LICENSE', column: vscode.ViewColumn.Three }
    ]);

    // Create group
    const gName = `WL-ExportPos-${Date.now()}`;
    await trackSync(async () => {
      await vscode.commands.executeCommand(CMD('__test__webviewDispatch'), {
        type: 'new-group', groupId: gName
      });
    });

    let state = await vscode.commands.executeCommand(CMD('__test__getState'));
    const group = Object.values(state.groups).find((g) => g.name === gName);

    // Export
    const exportPath = getTmpFilePath('pos-export.tabstack');
    await vscode.commands.executeCommand(CMD('__test__exportGroup'), group.id, exportPath);
    await waitUntil(() => fs.existsSync(exportPath), 'export file to be written');

    // Verify the export file contains tab info
    const content = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    assert.ok(content.group.state, 'Exported group should have state');
    assert.ok(content.group.state.tabState, 'Exported group should have tabState');
    const tabGroups = Object.values(content.group.state.tabState.tabGroups);
    assert.ok(tabGroups.length >= 2, `Exported state should have >= 2 tab groups, got ${tabGroups.length}`);

    // Count total tabs in export
    const totalExportedTabs = tabGroups.reduce((sum, g) => sum + g.tabs.length, 0);
    assert.ok(totalExportedTabs >= 5, `Should have >= 5 tabs exported, got ${totalExportedTabs}`);

    cleanupTmpFile(exportPath);
  });
});
