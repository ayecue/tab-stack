/**
 * VS Code Event Analyzer — captures raw tab/group event payloads for
 * various editor operations and writes structured output files.
 *
 * Run with:  node tools/vscode-event-analyzer/run-analyzer.cjs
 *
 * This is NOT an extension test — it's a diagnostic tool for understanding
 * the exact event sequences VS Code fires.
 */
const { suite, test, suiteSetup, setup, teardown, suiteTeardown } = require('mocha');
const assert = require('assert');
const fs = require('fs');
const vscode = require('vscode');
const path = require('path');
const { writeCaptureFixture } = require('../report-writer.cjs');
const {
  sleep,
  waitUntil,
  openFile,
  closeAllTabs,
  startCapture,
  stopCapture,
  getEvents,
  getSnapshot,
  getLayout,
} = require('./helpers.cjs');

// ── result collector ─────────────────────────────────────────────────

const scenarioResults = [];

function captureScenario(name, capture, layoutBefore, layoutAfter) {
  const {
    tabEvents = [],
    groupEvents = [],
    snapshotDiffs = [],
    observedEvents = [],
    initialSnapshot = null,
    finalSnapshot = null,
  } = capture;

  scenarioResults.push({
    scenario: name,
    events: { tabEvents, groupEvents, snapshotDiffs },
    replay: {
      observedEvents,
      initialSnapshot,
      finalSnapshot,
    },
    layout: { before: layoutBefore, after: layoutAfter },
  });
}

function dumpEvents(label, events) {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`  SCENARIO: ${label}`);
  console.log(`${'═'.repeat(70)}`);

  if (events.initialSnapshot && events.finalSnapshot) {
    console.log(
      `  snapshots: v${events.initialSnapshot.version} -> v${events.finalSnapshot.version}`,
    );
  }

  const allEvents = [
    ...events.tabEvents.map((e) => ({ ...e, kind: 'TAB' })),
    ...events.groupEvents.map((e) => ({ ...e, kind: 'GROUP' })),
  ].sort((a, b) => a.seq - b.seq);
  const observedBySeq = new Map(
    (events.observedEvents ?? []).map((observed) => [observed.seq, observed]),
  );

  if (allEvents.length === 0) {
    console.log('  (no events fired)');
    return;
  }

  for (const evt of allEvents) {
    console.log(`\n  [seq=${evt.seq}, time=${new Date(evt.timestamp).toISOString()}] ${evt.kind} EVENT`);
    const observed = observedBySeq.get(evt.seq);
    if (observed) {
      console.log(
        `    snapshot: v${observed.beforeSnapshot.version} -> v${observed.afterSnapshot.version}`,
      );
    }
    if (evt.opened?.length) {
      console.log('    opened:');
      for (const t of evt.opened) console.log(`      ${JSON.stringify(t)}`);
    }
    if (evt.closed?.length) {
      console.log('    closed:');
      for (const t of evt.closed) console.log(`      ${JSON.stringify(t)}`);
    }
    if (evt.changed?.length) {
      console.log('    changed:');
      for (const t of evt.changed) console.log(`      ${JSON.stringify(t)}`);
    }
  }

  // Snapshot diffs
  const diffs = events.snapshotDiffs ?? [];
  if (diffs.length > 0) {
    console.log(`\n  ── Snapshot Diffs ──`);
    for (const sd of diffs) {
      const sdTs = sd.timestamp ? new Date(sd.timestamp).toISOString() : '';
      const versionLabel =
        typeof sd.beforeVersion === 'number' && typeof sd.afterVersion === 'number'
          ? ` v${sd.beforeVersion} -> v${sd.afterVersion}`
          : '';
      console.log(`\n  [seq=${sd.seq}, time=${sdTs}] ${sd.trigger.toUpperCase()}${versionLabel} — ${sd.diff.length} change(s)`);
      for (const d of sd.diff) {
        const pathStr = d.path.join('.');
        if (d.type === 'CREATE') {
          console.log(`    + ${pathStr} = ${JSON.stringify(d.value)}`);
        } else if (d.type === 'REMOVE') {
          console.log(`    - ${pathStr} (was ${JSON.stringify(d.oldValue)})`);
        } else {
          console.log(`    ~ ${pathStr}: ${JSON.stringify(d.oldValue)} → ${JSON.stringify(d.value)}`);
        }
      }
    }
  }
  console.log('');
}

const GROUP_FOCUS_COMMANDS = {
  1: 'workbench.action.focusFirstEditorGroup',
  2: 'workbench.action.focusSecondEditorGroup',
  3: 'workbench.action.focusThirdEditorGroup',
  4: 'workbench.action.focusFourthEditorGroup',
  5: 'workbench.action.focusFifthEditorGroup',
  6: 'workbench.action.focusSixthEditorGroup',
  7: 'workbench.action.focusSeventhEditorGroup',
  8: 'workbench.action.focusEighthEditorGroup',
  9: 'workbench.action.focusLastEditorGroup',
};

function getWorkspaceRoot() {
  const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
  assert.ok(workspaceFolder, 'A workspace folder must be open');
  return workspaceFolder.uri.fsPath;
}

function getWorkspaceUri(relativePath) {
  return vscode.Uri.file(path.join(getWorkspaceRoot(), relativePath));
}

function getGroup(viewColumn) {
  return vscode.window.tabGroups.all.find((group) => group.viewColumn === viewColumn) ?? null;
}

function getTabCount(viewColumn) {
  return getGroup(viewColumn)?.tabs.length ?? 0;
}

function getTotalTabCount() {
  return vscode.window.tabGroups.all.reduce((sum, group) => sum + group.tabs.length, 0);
}

async function openFilesInLayout(entries) {
  for (const entry of entries) {
    await openFile(entry.file, {
      viewColumn: entry.viewColumn,
      preview: entry.preview ?? false,
    });
  }
  await sleep(300);
}

async function focusGroup(viewColumn) {
  const command = GROUP_FOCUS_COMMANDS[viewColumn];
  assert.ok(command, `No focus command found for viewColumn ${viewColumn}`);
  await vscode.commands.executeCommand(command);
  await sleep(150);
}

async function activateFile(relativePath, viewColumn) {
  const uri = getWorkspaceUri(relativePath);
  const document = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(document, {
    viewColumn,
    preview: false,
    preserveFocus: false,
  });
  await sleep(200);
}

async function openPreviewFile(relativePath, viewColumn) {
  const uri = getWorkspaceUri(relativePath);
  const document = await vscode.workspace.openTextDocument(uri);
  await vscode.window.showTextDocument(document, {
    viewColumn,
    preview: true,
    preserveFocus: false,
  });
  await waitUntil(
    () => {
      const targetGroup = getGroup(viewColumn);
      return targetGroup?.activeTab?.label === path.basename(relativePath);
    },
    `preview tab ${relativePath} to become active in vc${viewColumn}`,
  );
  await sleep(200);
}

async function executeEditorCommandForFile(commandId, relativePath) {
  await vscode.commands.executeCommand(commandId, getWorkspaceUri(relativePath));
}

async function moveFileAcrossGroups(relativePath, direction, hops = 1) {
  const commandId = direction === 'left'
    ? 'workbench.action.moveEditorToLeftGroup'
    : 'workbench.action.moveEditorToRightGroup';

  for (let index = 0; index < hops; index++) {
    await executeEditorCommandForFile(commandId, relativePath);
  }
}

function groupContainsFiles(viewColumn, relativePaths) {
  const targetGroup = getGroup(viewColumn);
  return Boolean(
    targetGroup && relativePaths.every((relativePath) =>
      targetGroup.tabs.some((tab) => tab.label === path.basename(relativePath))
    )
  );
}

function getGroupTabLabels(viewColumn) {
  return getGroup(viewColumn)?.tabs.map((tab) => tab.label) ?? [];
}

function groupMatchesOrder(viewColumn, relativePaths) {
  const actualLabels = getGroupTabLabels(viewColumn);
  const expectedLabels = relativePaths.map((relativePath) => path.basename(relativePath));

  return (
    actualLabels.length === expectedLabels.length &&
    actualLabels.every((label, index) => label === expectedLabels[index])
  );
}

function countTabsWithLabel(viewColumn, relativePath) {
  const targetGroup = getGroup(viewColumn);
  if (!targetGroup) {
    return 0;
  }

  const label = path.basename(relativePath);
  return targetGroup.tabs.filter((tab) => tab.label === label).length;
}

async function moveFileWithinGroup(relativePath, viewColumn, toIndex) {
  const label = path.basename(relativePath);

  await activateFile(relativePath, viewColumn);
  await waitUntil(
    () => getGroup(viewColumn)?.activeTab?.label === label,
    `${label} to become active in vc${viewColumn}`,
  );

  const targetGroup = getGroup(viewColumn);
  assert.ok(targetGroup, `Expected vc${viewColumn} to exist`);

  const currentIndex = targetGroup.tabs.findIndex((tab) => tab.isActive);
  assert.ok(currentIndex >= 0, `Expected ${label} to be active in vc${viewColumn}`);

  if (currentIndex === toIndex) {
    return;
  }

  const moveCommand = toIndex > currentIndex
    ? 'workbench.action.moveEditorRightInGroup'
    : 'workbench.action.moveEditorLeftInGroup';

  for (let step = 0; step < Math.abs(toIndex - currentIndex); step++) {
    await vscode.commands.executeCommand(moveCommand);
    await sleep(150);
  }
}

async function runCapturedScenario(
  scenarioName,
  label,
  action,
  waitDescription,
  waitPredicate,
  delay = 800,
) {
  const layoutBefore = getLayout();
  await startCapture();
  await action();
  if (waitPredicate) {
    await waitUntil(waitPredicate, waitDescription);
  }
  await sleep(delay);

  const events = await getEvents();
  dumpEvents(label, events);
  captureScenario(scenarioName, events, layoutBefore, getLayout());

  return events;
}

function assertCapturedEvents(events) {
  assert.ok(
    events.tabEvents.length > 0 || events.groupEvents.length > 0,
    'Should fire tab and/or group events',
  );
}

function ensureTemporaryWorkspaceFile(fileName, content) {
  const relativePath = path.posix.join('tools', 'vscode-event-analyzer', 'output', fileName);
  const absolutePath = path.join(getWorkspaceRoot(), relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, content);
  return relativePath;
}

function removeTemporaryWorkspaceFile(relativePath) {
  const absolutePath = path.join(getWorkspaceRoot(), relativePath);
  if (fs.existsSync(absolutePath)) {
    fs.unlinkSync(absolutePath);
  }
}

// ── test suite ───────────────────────────────────────────────────────

suite('VS Code Event Analyzer', () => {
  suiteSetup(async function () {
    this.timeout(1000 * 30);
    await closeAllTabs();
    await sleep(500);
  });

  setup(async function () {
    await closeAllTabs();
    await sleep(300);
  });

  teardown(async function () {
    await stopCapture();
    await closeAllTabs();
  });

  suiteTeardown(async function () {
    this.timeout(1000 * 10);
    await closeAllTabs();

    const fixtureDir = path.resolve(
      __dirname,
      '../../../tests/fixtures/event-analyzer',
    );

    const workspaceRoot =
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? '';

    const written = writeCaptureFixture(fixtureDir, scenarioResults, {
      generatedAt: new Date(),
      vscodeVersion: vscode.version,
      anonymizeRoot: workspaceRoot || undefined,
    });

    console.log(`\n  ✓ Fixture directory: ${written.captureDir}`);
    console.log(`  ✓ Index JSON: ${written.indexJsonPath}`);
    console.log(`  ✓ Index Markdown: ${written.indexMarkdownPath}`);
    console.log(
      `  ✓ Scenario files: ${written.scenarioJsonPaths.length} JSON, ${written.scenarioMarkdownPaths.length} Markdown`,
    );
  });

  // ─── Scenario A: Open a single file ──────────────────────────────────

  test('A: open a single file', async function () {
    this.timeout(1000 * 20);
    const layoutBefore = getLayout();

    await startCapture();
    await openFile('package.json');
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Open a single file (package.json)', events);
    captureScenario('A: open a single file', events, layoutBefore, getLayout());

    assert.ok(events.tabEvents.length > 0, 'Should fire at least one tab event');
  });

  // ─── Scenario B: Close a single tab ─────────────────────────────────

  test('B: close a single tab', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json');
    await sleep(300);

    const pkgUri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, 'package.json');
    await vscode.window.showTextDocument(pkgUri, { preview: false });
    await sleep(200);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    await waitUntil(
      () => {
        const tabs = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
        return !tabs.some((t) => t.label === 'package.json');
      },
      'tab closed'
    );
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Close a single tab', events);
    captureScenario('B: close a single tab', events, layoutBefore, getLayout());

    assert.ok(events.tabEvents.length > 0, 'Should fire at least one tab event');
  });

  // ─── Scenario C: Move tab cross-column ──────────────────────────────

  test('C: move tab from column 1 to column 2', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);

    const tabs = vscode.window.tabGroups.all.flatMap((g) => g.tabs);
    const readmeTab = tabs.find((t) => t.label.includes('README'));
    if (readmeTab) {
      const uri = readmeTab.input?.uri;
      if (uri) {
        await vscode.window.showTextDocument(uri, { viewColumn: vscode.ViewColumn.One, preserveFocus: false });
        await sleep(200);
      }
    }

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Move tab from column 1 → column 2', events);
    captureScenario('C: move tab cross-column', events, layoutBefore, getLayout());

    assert.ok(events.tabEvents.length > 0, 'Should fire tab events for cross-column move');
  });

  // ─── Scenario D: Reorder tab within same group ──────────────────────

  test('D: reorder tab within same group', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.One });
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Reorder tab within same group (moveEditorLeftInGroup)', events);
    captureScenario('D: reorder within group', events, layoutBefore, getLayout());
  });

  // ─── Scenario E: Move entire tab group ──────────────────────────────

  test('E: move entire tab group (column swap)', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Move entire tab group right', events);
    captureScenario('E: group swap', events, layoutBefore, getLayout());
  });

  // ─── Scenario F: Pin a tab ──────────────────────────────────────────

  test('F: pin a tab', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json');
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.pinEditor');
    await waitUntil(
      () => vscode.window.tabGroups.activeTabGroup?.activeTab?.isPinned,
      'tab pinned'
    );
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Pin a tab', events);
    captureScenario('F: pin a tab', events, layoutBefore, getLayout());
  });

  // ─── Scenario G: Dirty a tab ───────────────────────────────────────

  test('G: dirty a tab', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json');
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      await editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), '/* test */');
      });
    }
    await waitUntil(
      () => vscode.window.tabGroups.activeTabGroup?.activeTab?.isDirty,
      'tab dirty'
    );
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Dirty a tab (edit without saving)', events);
    captureScenario('G: dirty a tab', events, layoutBefore, getLayout());

    await vscode.commands.executeCommand('workbench.action.files.revert');
    await sleep(300);
  });

  // ─── Scenario H: Activate a different tab ───────────────────────────

  test('H: activate a different tab', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    const group = vscode.window.tabGroups.all[0];
    const pkgTab = group?.tabs.find((t) => t.label.includes('package'));
    if (pkgTab?.input?.uri) {
      await vscode.window.showTextDocument(pkgTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
    }
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Activate a different tab in same group', events);
    captureScenario('H: activate different tab', events, layoutBefore, getLayout());
  });

  // ─── Scenario I: Open duplicate file in another column ──────────────

  test('I: open same file in another column', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    await openFile('package.json', { viewColumn: vscode.ViewColumn.Two });
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Open same file (package.json) in second column', events);
    captureScenario('I: duplicate in another column', events, layoutBefore, getLayout());
  });

  // ─── Scenario J: Close last tab in a group ──────────────────────────

  test('J: close last tab in a group (group should close)', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);

    const group2 = vscode.window.tabGroups.all.find((g) => g.viewColumn === 2);
    if (group2?.activeTab?.input?.uri) {
      await vscode.window.showTextDocument(group2.activeTab.input.uri, {
        viewColumn: vscode.ViewColumn.Two,
        preserveFocus: false,
      });
    }
    await sleep(200);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    await waitUntil(
      () => vscode.window.tabGroups.all.length <= 1,
      'group closed'
    );
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Close last tab in group (group should close)', events);
    captureScenario('J: close last in group', events, layoutBefore, getLayout());

    assert.ok(
      events.tabEvents.length > 0 || events.groupEvents.length > 0,
      'Should fire tab and/or group events'
    );
  });

  // ─── Scenario K: Move tab within group and observe neighbor effects ─

  test('K: move tab and observe neighbor index changes', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.One });
    await sleep(300);

    const groupBefore = vscode.window.tabGroups.all[0];
    const lastTab = groupBefore.tabs[groupBefore.tabs.length - 1];
    if (lastTab?.input?.uri) {
      await vscode.window.showTextDocument(lastTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
      await sleep(200);
    }

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
    await sleep(200);
    await vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
    await sleep(200);
    await vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Move tab from index 3 → 0 (3 left moves)', events);
    captureScenario('K: multi-step reorder', events, layoutBefore, getLayout());
  });

  // ─── Scenario L: Move group with 3 columns ─────────────────────────

  test('L: move group with 3 columns', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.Two });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Three });
    await sleep(300);

    const group1 = vscode.window.tabGroups.all.find((g) => g.viewColumn === 1);
    if (group1?.activeTab?.input?.uri) {
      await vscode.window.showTextDocument(group1.activeTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
    }
    await sleep(200);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Move group right with 3 columns', events);
    captureScenario('L: 3-column group move', events, layoutBefore, getLayout());
  });

  // ─── Scenario M: 4 columns, move vc1 → vc4 ─────────────────────────

  test('M: 4 columns, move vc1 → vc4', async function () {
    this.timeout(1000 * 30);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.Two });
    await openFile('LICENSE', { viewColumn: vscode.ViewColumn.Two });
    await openFile('CHANGELOG.md', { viewColumn: vscode.ViewColumn.Three });
    await openFile('webview.html', { viewColumn: vscode.ViewColumn.Three });
    await openFile('webview.css', { viewColumn: 4 });
    await openFile('webview.js', { viewColumn: 4 });
    await sleep(500);

    const group1 = vscode.window.tabGroups.all.find((g) => g.viewColumn === 1);
    if (group1?.activeTab?.input?.uri) {
      await vscode.window.showTextDocument(group1.activeTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
    }
    await sleep(200);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(400);
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(400);
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('4 columns: move vc1 → vc4 (3 right moves)', events);
    captureScenario('M: 4-col move vc1→vc4', events, layoutBefore, getLayout());
  });

  // ─── Scenario N: Move tab from vc1 to vc3 ──────────────────────────

  test('N: move tab from vc1 to vc3 (skipping vc2)', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.Three });
    await sleep(300);

    const readmeTab = vscode.window.tabGroups.all
      .flatMap((g) => g.tabs)
      .find((t) => t.label.includes('README'));
    if (readmeTab?.input?.uri) {
      await vscode.window.showTextDocument(readmeTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
      await sleep(200);
    }

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
    await sleep(400);
    await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Move tab from vc1 → vc3 (two moveEditorToNextGroup)', events);
    captureScenario('N: multi-hop tab move', events, layoutBefore, getLayout());
  });

  // ─── Scenario O: Group swap then close ──────────────────────────────

  test('O: group swap then close a tab', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.Two });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);

    const group1 = vscode.window.tabGroups.all.find((g) => g.viewColumn === 1);
    if (group1?.activeTab?.input?.uri) {
      await vscode.window.showTextDocument(group1.activeTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
    }
    await sleep(200);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(100);
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Group swap + close active tab', events);
    captureScenario('O: group swap + close', events, layoutBefore, getLayout());
  });

  // ─── Scenario P: Group move then reorder ────────────────────────────

  test('P: move group right then reorder tab', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.One });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);

    const tsTab = vscode.window.tabGroups.all
      .flatMap((g) => g.tabs)
      .find((t) => t.label.includes('tsconfig'));
    if (tsTab?.input?.uri) {
      await vscode.window.showTextDocument(tsTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
      await sleep(200);
    }

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveActiveEditorGroupRight');
    await sleep(400);
    await vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Move group right then reorder tab left', events);
    captureScenario('P: group move + reorder', events, layoutBefore, getLayout());
  });

  // ─── Scenario Q: Close all tabs in middle group ─────────────────────

  test('Q: close all tabs in vc2 (middle group destroyed)', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.Two });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.Three });
    await sleep(300);

    const group2 = vscode.window.tabGroups.all.find((g) => g.viewColumn === 2);
    if (group2?.activeTab?.input?.uri) {
      await vscode.window.showTextDocument(group2.activeTab.input.uri, {
        viewColumn: vscode.ViewColumn.Two,
        preserveFocus: false,
      });
    }
    await sleep(200);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.closeEditorsInGroup');
    await waitUntil(
      () => !vscode.window.tabGroups.all.some((g) => g.viewColumn === 3),
      'middle group closed and vc3 renumbered'
    );
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Close all tabs in vc2 (middle group destroyed)', events);
    captureScenario('Q: close middle group', events, layoutBefore, getLayout());
  });

  // ─── Scenario R: Split editor ───────────────────────────────────────

  test('R: split editor (same file in two columns)', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await sleep(300);

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.splitEditor');
    await waitUntil(
      () => vscode.window.tabGroups.all.length >= 2,
      'split created second group'
    );
    await sleep(500);

    const events = await getEvents();
    dumpEvents('Split editor (package.json in two groups)', events);
    captureScenario('R: split editor', events, layoutBefore, getLayout());
  });

  // ─── Scenario S: Move tab cross-group (observe destination index) ──

  test('S: move tab cross-group and observe destination index', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json', { viewColumn: vscode.ViewColumn.One });
    await openFile('README.md', { viewColumn: vscode.ViewColumn.Two });
    await openFile('tsconfig.json', { viewColumn: vscode.ViewColumn.Two });
    await openFile('vitest.config.ts', { viewColumn: vscode.ViewColumn.Two });
    await sleep(300);

    const pkgTab = vscode.window.tabGroups.all
      .flatMap((g) => g.tabs)
      .find((t) => t.label.includes('package'));
    if (pkgTab?.input?.uri) {
      await vscode.window.showTextDocument(pkgTab.input.uri, {
        viewColumn: vscode.ViewColumn.One,
        preserveFocus: false,
      });
      await sleep(200);
    }

    const layoutBefore = getLayout();
    await startCapture();
    await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
    await sleep(800);

    const events = await getEvents();
    dumpEvents('Move sole tab in vc1 to vc2 (group destroys)', events);
    captureScenario('S: cross-group with index', events, layoutBefore, getLayout());
  });

  // ─── Scenario T: Close other tabs ─────────────────────────────────

  const closeOtherTabsScenarios = [
    {
      name: 'T1: close other tabs in one group',
      scenario: 'T1: close other tabs (1vc)',
      label: 'Close other tabs in vc1 (4 tabs total)',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'README.md',
      focusViewColumn: 1,
      targetViewColumn: 1,
    },
    {
      name: 'T2: close other tabs with a second group present',
      scenario: 'T2: close other tabs (2vc)',
      label: 'Close other tabs from vc1 while vc2 exists',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Two },
      ],
      focusFile: 'README.md',
      focusViewColumn: 1,
      targetViewColumn: 1,
    },
    {
      name: 'T3: close other tabs from a middle group',
      scenario: 'T3: close other tabs (4vc)',
      label: 'Close other tabs from vc2 while other groups remain',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Four },
        { file: 'webview.css', viewColumn: vscode.ViewColumn.Four },
      ],
      focusFile: 'tsconfig.json',
      focusViewColumn: 2,
      targetViewColumn: 2,
    },
  ];

  for (const setup of closeOtherTabsScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 20);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const initialTabCount = getTotalTabCount();
      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.closeOtherEditors');
        },
        'target group to keep only the focused tab',
        () => getTabCount(setup.targetViewColumn) === 1,
      );

      assertCapturedEvents(events);
      assert.ok(getTotalTabCount() < initialTabCount, 'Close other tabs should reduce the total tab count');
    });
  }

  // ─── Scenario U: Move tab to a new group ──────────────────────────

  const moveToNewGroupScenarios = [
    {
      name: 'U1: move tab to a new group from vc1',
      scenario: 'U1: move tab to new group (1vc)',
      label: 'Move active tab from vc1 into newly created vc2',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'README.md',
      focusViewColumn: 1,
      expectedGroups: 2,
      expectedNewViewColumn: 2,
    },
    {
      name: 'U2: move tab to a new group from vc3',
      scenario: 'U2: move tab to new group (3vc)',
      label: 'Move active tab from rightmost vc3 into newly created vc4',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'LICENSE',
      focusViewColumn: 3,
      expectedGroups: 4,
      expectedNewViewColumn: 4,
    },
    {
      name: 'U3: move tab to a new group from vc5',
      scenario: 'U3: move tab to new group (5vc)',
      label: 'Move active tab from rightmost vc5 into newly created vc6',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Five },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Five },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      focusFile: 'CHANGELOG.md',
      focusViewColumn: 5,
      expectedGroups: 6,
      expectedNewViewColumn: 6,
    },
  ];

  for (const setup of moveToNewGroupScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
        },
        `new group vc${setup.expectedNewViewColumn} to exist with the moved tab`,
        () => vscode.window.tabGroups.all.length === setup.expectedGroups && getTabCount(setup.expectedNewViewColumn) === 1,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario V: Dirty then save ──────────────────────────────────

  const dirtySaveScenarios = [
    {
      name: 'V1: dirty and save in one group',
      scenario: 'V1: dirty then save (1vc)',
      label: 'Dirty then save a temp file in vc1',
      tempFile: 'temp-dirty-save-1.txt',
      entries: [],
      targetViewColumn: 1,
    },
    {
      name: 'V2: dirty and save with another group present',
      scenario: 'V2: dirty then save (2vc)',
      label: 'Dirty then save a temp file in vc1 while vc2 exists',
      tempFile: 'temp-dirty-save-2.txt',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
      ],
      targetViewColumn: 1,
    },
    {
      name: 'V3: dirty and save from a middle group',
      scenario: 'V3: dirty then save (4vc)',
      label: 'Dirty then save a temp file in vc2 across four groups',
      tempFile: 'temp-dirty-save-3.txt',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Four },
      ],
      targetViewColumn: 2,
    },
  ];

  for (const setup of dirtySaveScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      const tempRelativePath = ensureTemporaryWorkspaceFile(
        setup.tempFile,
        'temporary analyzer file\n',
      );

      try {
        await openFilesInLayout([
          ...setup.entries,
          { file: tempRelativePath, viewColumn: setup.targetViewColumn },
        ]);
        await activateFile(tempRelativePath, setup.targetViewColumn);

        const events = await runCapturedScenario(
          setup.scenario,
          setup.label,
          async () => {
            const editor = vscode.window.activeTextEditor;
            assert.ok(editor, 'An active editor is required for dirty/save capture');

            await editor.edit((editBuilder) => {
              editBuilder.insert(new vscode.Position(0, 0), '/* analyzer */\n');
            });
            await waitUntil(
              () => vscode.window.tabGroups.activeTabGroup?.activeTab?.isDirty,
              'tab to become dirty',
            );
            await vscode.commands.executeCommand('workbench.action.files.save');
          },
          'tab to become clean again after save',
          () => !vscode.window.tabGroups.activeTabGroup?.activeTab?.isDirty,
        );

        assertCapturedEvents(events);
      } finally {
        await closeAllTabs();
        removeTemporaryWorkspaceFile(tempRelativePath);
      }
    });
  }

  // ─── Scenario W: Pin then unpin ───────────────────────────────────

  const pinUnpinScenarios = [
    {
      name: 'W1: pin and unpin a single tab',
      scenario: 'W1: pin then unpin (1vc)',
      label: 'Pin then unpin package.json in vc1',
      entries: [{ file: 'package.json', viewColumn: vscode.ViewColumn.One }],
      focusFile: 'package.json',
      focusViewColumn: 1,
    },
    {
      name: 'W2: pin and unpin a middle tab',
      scenario: 'W2: pin then unpin (1vc-many)',
      label: 'Pin then unpin a middle tab in a longer vc1 strip',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'tsconfig.json',
      focusViewColumn: 1,
    },
    {
      name: 'W3: pin and unpin with surrounding groups',
      scenario: 'W3: pin then unpin (3vc)',
      label: 'Pin then unpin a tab in vc2 while vc1 and vc3 exist',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'tsconfig.json',
      focusViewColumn: 2,
    },
  ];

  for (const setup of pinUnpinScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 20);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.pinEditor');
          await waitUntil(
            () => vscode.window.tabGroups.activeTabGroup?.activeTab?.isPinned,
            'tab to become pinned',
          );
          await vscode.commands.executeCommand('workbench.action.unpinEditor');
        },
        'tab to become unpinned again',
        () => !vscode.window.tabGroups.activeTabGroup?.activeTab?.isPinned,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario X: Group activation ─────────────────────────────────

  const groupActivationScenarios = [
    {
      name: 'X1: focus vc2 from vc1',
      scenario: 'X1: group activation (2vc)',
      label: 'Activate vc2 while vc1 starts active',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
      ],
      action: async () => {
        await focusGroup(2);
      },
      expectedActiveViewColumn: 2,
    },
    {
      name: 'X2: focus vc2 then vc3',
      scenario: 'X2: group activation (3vc)',
      label: 'Activate vc2 then vc3 in a 3-group layout',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
      ],
      action: async () => {
        await focusGroup(2);
        await focusGroup(3);
      },
      expectedActiveViewColumn: 3,
    },
    {
      name: 'X3: focus vc4 from vc1',
      scenario: 'X3: group activation (5vc)',
      label: 'Activate vc4 in a 5-group layout',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Five },
      ],
      action: async () => {
        await focusGroup(4);
      },
      expectedActiveViewColumn: 4,
    },
  ];

  for (const setup of groupActivationScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 20);

      await openFilesInLayout(setup.entries);
      await focusGroup(1);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        setup.action,
        `vc${setup.expectedActiveViewColumn} to become active`,
        () => vscode.window.tabGroups.activeTabGroup?.viewColumn === setup.expectedActiveViewColumn,
        500,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario Y: Group close cases ────────────────────────────────

  const groupCloseScenarios = [
    {
      name: 'Y1: close a trailing group with one tab',
      scenario: 'Y1: close group (2vc, 1 tab)',
      label: 'Close vc2 when it contains a single tab',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
      ],
      focusViewColumn: 2,
      expectedGroupCount: 1,
      missingViewColumn: 2,
    },
    {
      name: 'Y2: close middle group with two tabs',
      scenario: 'Y2: close group (3vc, 2 tabs)',
      label: 'Close vc2 when it contains two tabs',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
      ],
      focusViewColumn: 2,
      expectedGroupCount: 2,
      missingViewColumn: 3,
    },
    {
      name: 'Y3: close vc4 in a five-group layout',
      scenario: 'Y3: close group (5vc, 3 tabs)',
      label: 'Close vc4 when it contains three tabs',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Four },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Four },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      focusViewColumn: 4,
      expectedGroupCount: 4,
      missingViewColumn: 5,
    },
  ];

  for (const setup of groupCloseScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 20);

      await openFilesInLayout(setup.entries);
      await focusGroup(setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.closeEditorsInGroup');
        },
        'group count to shrink after closing the group',
        () => vscode.window.tabGroups.all.length === setup.expectedGroupCount && !vscode.window.tabGroups.all.some((group) => group.viewColumn === setup.missingViewColumn),
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario Z: New empty group creation ────────────────────────

  const newGroupCreationScenarios = [
    {
      name: 'Z1: create empty vc2 from vc1',
      scenario: 'Z1: new group creation (1vc)',
      label: 'Create an empty vc2 to the right of vc1',
      entries: [{ file: 'package.json', viewColumn: vscode.ViewColumn.One }],
      focusViewColumn: 1,
      expectedGroupCount: 2,
      expectedNewViewColumn: 2,
    },
    {
      name: 'Z2: create empty vc4 from vc3',
      scenario: 'Z2: new group creation (3vc)',
      label: 'Create an empty vc4 to the right of vc3',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
      ],
      focusViewColumn: 3,
      expectedGroupCount: 4,
      expectedNewViewColumn: 4,
    },
    {
      name: 'Z3: create empty vc6 from vc5',
      scenario: 'Z3: new group creation (5vc)',
      label: 'Create an empty vc6 to the right of vc5',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Five },
      ],
      focusViewColumn: 5,
      expectedGroupCount: 6,
      expectedNewViewColumn: 6,
    },
  ];

  for (const setup of newGroupCreationScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 20);

      await openFilesInLayout(setup.entries);
      await focusGroup(setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.newGroupRight');
        },
        `empty vc${setup.expectedNewViewColumn} to be created`,
        () => vscode.window.tabGroups.all.length === setup.expectedGroupCount && getTabCount(setup.expectedNewViewColumn) === 0,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AA: Duplicate-target move evaporation ───────────────

  const duplicateTargetMoveScenarios = [
    {
      name: 'AA1: move duplicate into adjacent target group',
      scenario: 'AA1: duplicate-target move (2vc)',
      label: 'Move package.json from vc1 into vc2 where package.json already exists',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
      ],
      focusFile: 'package.json',
      focusViewColumn: 1,
      action: async () => {
        await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
      },
      waitDescription: 'duplicate move to reduce total tabs while both groups survive',
      waitPredicate: () => getTotalTabCount() === 3 && getTabCount(1) === 1 && getTabCount(2) === 2,
    },
    {
      name: 'AA2: move duplicate across an intermediate group',
      scenario: 'AA2: duplicate-target move (3vc)',
      label: 'Move package.json from vc1 into vc3 where package.json already exists',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'package.json',
      focusViewColumn: 1,
      action: async () => {
        await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
        await sleep(300);
        await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
      },
      waitDescription: 'duplicate move to vc3 to reduce total tabs after the second hop',
      waitPredicate: () => getTotalTabCount() === 5 && getTabCount(1) === 1 && getTabCount(3) === 2,
    },
    {
      name: 'AA3: move duplicate into a farther target group',
      scenario: 'AA3: duplicate-target move (5vc)',
      label: 'Move package.json from vc2 into vc4 where package.json already exists',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Four },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      focusFile: 'package.json',
      focusViewColumn: 2,
      action: async () => {
        await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
        await sleep(300);
        await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
      },
      waitDescription: 'duplicate move to vc4 to reduce total tabs after the second hop',
      waitPredicate: () => getTotalTabCount() === 7 && getTabCount(2) === 1 && getTabCount(4) === 2,
    },
  ];

  for (const setup of duplicateTargetMoveScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        setup.action,
        setup.waitDescription,
        setup.waitPredicate,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AB: Last-tab move-out with source-group destruction ─

  const lastTabMoveOutScenarios = [
    {
      name: 'AB1: move sole tab from vc1 into vc2',
      scenario: 'AB1: last-tab move-out (2vc)',
      label: 'Move the only tab in vc1 into vc2 and destroy vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Two },
      ],
      focusFile: 'package.json',
      focusViewColumn: 1,
      waitDescription: 'source group to close while target group absorbs the moved tab',
      waitPredicate: () => vscode.window.tabGroups.all.length === 1 && getTabCount(1) === 4,
    },
    {
      name: 'AB2: move sole tab from middle vc2 into vc3',
      scenario: 'AB2: last-tab move-out (3vc)',
      label: 'Move the only tab in vc2 into vc3 and destroy vc2',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'package.json',
      focusViewColumn: 2,
      waitDescription: 'middle source group to close and vc3 to renumber into vc2',
      waitPredicate: () => vscode.window.tabGroups.all.length === 2 && getTabCount(2) === 4 && !vscode.window.tabGroups.all.some((group) => group.viewColumn === 3),
    },
    {
      name: 'AB3: move sole tab from vc4 into vc5',
      scenario: 'AB3: last-tab move-out (5vc)',
      label: 'Move the only tab in vc4 into vc5 and destroy vc4',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Five },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Five },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      focusFile: 'vitest.config.ts',
      focusViewColumn: 4,
      waitDescription: 'vc4 to close and vc5 to renumber into vc4 with the moved tab',
      waitPredicate: () => vscode.window.tabGroups.all.length === 4 && getTabCount(4) === 4 && !vscode.window.tabGroups.all.some((group) => group.viewColumn === 5),
    },
  ];

  for (const setup of lastTabMoveOutScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
        },
        setup.waitDescription,
        setup.waitPredicate,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AC: Last-tab duplicate evaporation ─────────────────

  const lastTabDuplicateMoveScenarios = [
    {
      name: 'AC1: move sole duplicate from vc1 into vc2',
      scenario: 'AC1: last-tab duplicate-move (2vc)',
      label: 'Move the only package.json tab in vc1 into vc2 where package.json already exists',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
      ],
      focusFile: 'package.json',
      focusViewColumn: 1,
      waitDescription: 'source group to close and the duplicate move to evaporate',
      waitPredicate: () => vscode.window.tabGroups.all.length === 1 && getTotalTabCount() === 3 && getTabCount(1) === 3,
    },
    {
      name: 'AC2: move sole duplicate from vc2 into vc3',
      scenario: 'AC2: last-tab duplicate-move (3vc)',
      label: 'Move the only package.json tab in vc2 into vc3 where package.json already exists',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'package.json',
      focusViewColumn: 2,
      waitDescription: 'source group to close and vc3 to renumber into vc2 without gaining a new tab',
      waitPredicate: () => vscode.window.tabGroups.all.length === 2 && getTotalTabCount() === 4 && getTabCount(2) === 3 && !vscode.window.tabGroups.all.some((group) => group.viewColumn === 3),
    },
    {
      name: 'AC3: move sole duplicate from vc4 into vc5',
      scenario: 'AC3: last-tab duplicate-move (5vc)',
      label: 'Move the only package.json tab in vc4 into vc5 where package.json already exists',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Four },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Five },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Five },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      focusFile: 'package.json',
      focusViewColumn: 4,
      waitDescription: 'vc4 to close and vc5 to renumber into vc4 without a duplicate tab being added',
      waitPredicate: () => vscode.window.tabGroups.all.length === 4 && getTotalTabCount() === 6 && getTabCount(4) === 3 && !vscode.window.tabGroups.all.some((group) => group.viewColumn === 5),
    },
  ];

  for (const setup of lastTabDuplicateMoveScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
        },
        setup.waitDescription,
        setup.waitPredicate,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AD: Join all groups approximation ──────────────────

  const joinAllGroupsScenarios = [
    {
      name: 'AD1: join all groups from a 2-group layout',
      scenario: 'AD1: join all groups (2vc)',
      label: 'Join all groups from a 2-group layout with distinct files',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
      ],
      focusViewColumn: 2,
      expectedTotalTabs: 2,
    },
    {
      name: 'AD2: join all groups from a 3-group layout',
      scenario: 'AD2: join all groups (3vc)',
      label: 'Join all groups from a 3-group layout with multiple tabs',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
      ],
      focusViewColumn: 2,
      expectedTotalTabs: 4,
    },
    {
      name: 'AD3: join all groups with a duplicate file present',
      scenario: 'AD3: join all groups (5vc-duplicate)',
      label: 'Join all groups from a 5-group layout where package.json is already duplicated',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Four },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Five },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Five },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      focusViewColumn: 4,
    },
  ];

  for (const setup of joinAllGroupsScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await focusGroup(setup.focusViewColumn);

      const initialGroupCount = vscode.window.tabGroups.all.length;
      const initialTabCount = getTotalTabCount();

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.joinAllGroups');
        },
        'all groups to collapse into a single group',
        () => vscode.window.tabGroups.all.length === 1,
      );

      assertCapturedEvents(events);
      assert.ok(
        vscode.window.tabGroups.all.length < initialGroupCount,
        'Joining all groups should reduce the number of groups',
      );

      if (typeof setup.expectedTotalTabs === 'number') {
        assert.strictEqual(
          getTotalTabCount(),
          setup.expectedTotalTabs,
          'Joining distinct groups should preserve the total tab count',
        );
      } else {
        assert.ok(
          getTotalTabCount() <= initialTabCount,
          'Joining groups with duplicates should not increase the total tab count',
        );
      }
    });
  }

  // ─── Scenario AE: Open file into populated groups ────────────────

  const openFileExpansionScenarios = [
    {
      name: 'AE1: open a new file into populated vc1',
      scenario: 'AE1: open file in active group (1vc, populated)',
      label: 'Open LICENSE into populated vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'README.md',
      focusViewColumn: 1,
      openedFile: 'LICENSE',
      targetViewColumn: 1,
      expectedTabCount: 4,
      expectedOccurrences: 1,
      requireEvents: true,
    },
    {
      name: 'AE2: open a new file into populated vc2',
      scenario: 'AE2: open file in active group (3vc, populated)',
      label: 'Open ARCHITECTURE.md into populated vc2 while vc1 and vc3 exist',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'tsconfig.json',
      focusViewColumn: 2,
      openedFile: 'ARCHITECTURE.md',
      targetViewColumn: 2,
      expectedTabCount: 3,
      expectedOccurrences: 1,
      requireEvents: true,
    },
    {
      name: 'AE3: reopen a file already open in vc1',
      scenario: 'AE3: reopen same file in active group (1vc)',
      label: 'Reopen README.md while it is already open in vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'package.json',
      focusViewColumn: 1,
      openedFile: 'README.md',
      targetViewColumn: 1,
      expectedTabCount: 3,
      expectedOccurrences: 1,
      requireEvents: false,
    },
  ];

  for (const setup of openFileExpansionScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await openFile(setup.openedFile);
        },
        `tab ${setup.openedFile} to be present in vc${setup.targetViewColumn}`,
        () => {
          const targetGroup = getGroup(setup.targetViewColumn);
          return (
            getTabCount(setup.targetViewColumn) === setup.expectedTabCount &&
            Boolean(targetGroup?.tabs.some((tab) => tab.label === path.basename(setup.openedFile)))
          );
        },
      );

      if (setup.requireEvents) {
        assertCapturedEvents(events);
      }

      const targetGroup = getGroup(setup.targetViewColumn);
      assert.ok(targetGroup, `Expected vc${setup.targetViewColumn} to exist`);
      assert.strictEqual(
        targetGroup.tabs.filter((tab) => tab.label === path.basename(setup.openedFile)).length,
        setup.expectedOccurrences,
        'Open-file capture should preserve the expected number of matching tabs in the target group',
      );
    });
  }

  // ─── Scenario AF: Close populated-group tabs ─────────────────────

  const singleTabCloseExpansionScenarios = [
    {
      name: 'AF1: close active middle tab in populated vc1',
      scenario: 'AF1: close single tab (1vc, populated)',
      label: 'Close active middle tab in populated vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'README.md',
      focusViewColumn: 1,
      closedFile: 'README.md',
      expectedGroupCount: 1,
      expectedTabCount: 2,
    },
    {
      name: 'AF2: close active middle tab in populated vc3',
      scenario: 'AF2: close single tab (4vc, populated middle group)',
      label: 'Close active middle tab in populated vc3 while other groups remain',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Three },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Four },
      ],
      focusFile: 'tsconfig.json',
      focusViewColumn: 3,
      closedFile: 'tsconfig.json',
      expectedGroupCount: 4,
      expectedTabCount: 2,
    },
  ];

  for (const setup of singleTabCloseExpansionScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.closeActiveEditor');
        },
        `${setup.closedFile} to close without removing its group`,
        () => {
          const targetGroup = getGroup(setup.focusViewColumn);
          return (
            vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
            getTabCount(setup.focusViewColumn) === setup.expectedTabCount &&
            Boolean(targetGroup) &&
            !targetGroup.tabs.some((tab) => tab.label === setup.closedFile)
          );
        },
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AG: Split editor in populated layouts ──────────────

  const splitEditorExpansionScenarios = [
    {
      name: 'AG1: split active middle tab in populated vc1',
      scenario: 'AG1: split editor (1vc, populated)',
      label: 'Split active middle tab in populated vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
      ],
      focusFile: 'README.md',
      focusViewColumn: 1,
      duplicatedFile: 'README.md',
      sourceViewColumn: 1,
      duplicateViewColumn: 2,
      expectedGroupCount: 2,
    },
    {
      name: 'AG2: split active tab in vc2 with surrounding groups',
      scenario: 'AG2: split editor (3vc, middle group)',
      label: 'Split active vc2 tab and observe vc3 shifting to vc4',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
      ],
      focusFile: 'tsconfig.json',
      focusViewColumn: 2,
      duplicatedFile: 'tsconfig.json',
      sourceViewColumn: 2,
      duplicateViewColumn: 3,
      shiftedFile: 'LICENSE',
      shiftedViewColumn: 4,
      expectedGroupCount: 4,
    },
  ];

  for (const setup of splitEditorExpansionScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.focusViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.splitEditor');
        },
        `split editor to duplicate ${setup.duplicatedFile} into vc${setup.duplicateViewColumn}`,
        () => {
          const sourceGroup = getGroup(setup.sourceViewColumn);
          const duplicateGroup = getGroup(setup.duplicateViewColumn);
          const shiftedGroup = typeof setup.shiftedViewColumn === 'number'
            ? getGroup(setup.shiftedViewColumn)
            : null;

          return (
            vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
            Boolean(sourceGroup?.tabs.some((tab) => tab.label === setup.duplicatedFile)) &&
            Boolean(duplicateGroup?.tabs.some((tab) => tab.label === setup.duplicatedFile)) &&
            (
              !setup.shiftedFile ||
              Boolean(shiftedGroup?.tabs.some((tab) => tab.label === setup.shiftedFile))
            )
          );
        },
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AH: Activate a different tab in multi-group layouts ──

  const tabActivationExpansionScenarios = [
    {
      name: 'AH1: activate a different tab in active vc2',
      scenario: 'AH1: activate different tab (2vc, active group)',
      label: 'Activate a different tab inside already active vc2',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
      ],
      focusFile: 'tsconfig.json',
      targetFile: 'README.md',
      targetViewColumn: 2,
      expectedGroupCount: 2,
      expectedTabCount: 3,
    },
    {
      name: 'AH2: activate a different tab in focused vc3',
      scenario: 'AH2: activate different tab (4vc, focused group)',
      label: 'Focus vc3 and activate a different tab within vc3',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Three },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Four },
      ],
      focusFile: 'tsconfig.json',
      targetFile: 'README.md',
      targetViewColumn: 3,
      expectedGroupCount: 4,
      expectedTabCount: 3,
    },
  ];

  for (const setup of tabActivationExpansionScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await activateFile(setup.focusFile, setup.targetViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await activateFile(setup.targetFile, setup.targetViewColumn);
        },
        `${setup.targetFile} to become active in vc${setup.targetViewColumn}`,
        () => {
          const targetGroup = getGroup(setup.targetViewColumn);
          return (
            vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
            getTabCount(setup.targetViewColumn) === setup.expectedTabCount &&
            targetGroup?.activeTab?.label === setup.targetFile
          );
        },
        500,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AI: Preview promotion via keep editor ──────────────

  const previewPromotionScenarios = [
    {
      name: 'AI1: keep a preview editor in one group',
      scenario: 'AI1: preview promotion (1vc)',
      label: 'Promote a preview editor in vc1 via keep editor',
      entries: [],
      previewFile: 'package.json',
      previewViewColumn: 1,
    },
    {
      name: 'AI2: keep a preview editor in a populated group',
      scenario: 'AI2: preview promotion (1vc, populated)',
      label: 'Promote only the preview tab in a populated vc1 strip',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
      ],
      previewFile: 'package.json',
      previewViewColumn: 1,
    },
    {
      name: 'AI3: keep a preview editor after focus changes',
      scenario: 'AI3: preview promotion (3vc, refocus)',
      label: 'Promote a preview editor in vc2 after switching focus away and back',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
      ],
      previewFile: 'package.json',
      previewViewColumn: 2,
      beforeCapture: async () => {
        await focusGroup(1);
        await focusGroup(2);
      },
    },
  ];

  for (const setup of previewPromotionScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await openPreviewFile(setup.previewFile, setup.previewViewColumn);
      await waitUntil(
        () => getGroup(setup.previewViewColumn)?.activeTab?.isPreview,
        `${setup.previewFile} to be in preview mode before keep editor`,
      );

      if (setup.beforeCapture) {
        await setup.beforeCapture();
      }

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.keepEditor');
        },
        `${setup.previewFile} to stop being preview in vc${setup.previewViewColumn}`,
        () => {
          const targetGroup = getGroup(setup.previewViewColumn);
          return (
            targetGroup?.activeTab?.label === path.basename(setup.previewFile) &&
            targetGroup.activeTab.isPreview === false
          );
        },
        500,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AJ: Multi-tab cross-group approximation ────────────

  const multiTabCrossGroupApproxScenarios = [
    {
      name: 'AJ1: approximate moving two tabs into vc2',
      scenario: 'AJ1: multi-tab cross-group approximation (2vc, 2 tabs)',
      label: 'Approximate moving two tabs from vc1 into existing vc2 via parallel per-tab commands',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Two },
      ],
      movedFiles: ['README.md', 'tsconfig.json'],
      sourceViewColumn: 1,
      targetViewColumn: 2,
      groupHops: 1,
      expectedGroupCount: 2,
      expectedSourceCount: 1,
      expectedTargetCount: 4,
    },
    {
      name: 'AJ2: approximate moving two tabs from vc1 into vc3',
      scenario: 'AJ2: multi-tab cross-group approximation (3vc, 2 tabs)',
      label: 'Approximate moving two tabs from vc1 across vc2 into existing vc3',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Two },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Three },
      ],
      movedFiles: ['README.md', 'tsconfig.json'],
      sourceViewColumn: 1,
      targetViewColumn: 3,
      groupHops: 2,
      expectedGroupCount: 3,
      expectedSourceCount: 1,
      expectedTargetCount: 4,
    },
    {
      name: 'AJ3: approximate moving two tabs from vc2 into vc4',
      scenario: 'AJ3: multi-tab cross-group approximation (5vc, 2 tabs)',
      label: 'Approximate moving two tabs from vc2 across vc3 into existing vc4',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Four },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Four },
        { file: 'webview.css', viewColumn: vscode.ViewColumn.Five },
      ],
      movedFiles: ['tsconfig.json', 'vitest.config.ts'],
      sourceViewColumn: 2,
      targetViewColumn: 4,
      groupHops: 2,
      expectedGroupCount: 5,
      expectedSourceCount: 1,
      expectedTargetCount: 4,
    },
  ];

  for (const setup of multiTabCrossGroupApproxScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 30);

      await openFilesInLayout(setup.entries);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await Promise.all(
            setup.movedFiles.map((relativePath) =>
              moveFileAcrossGroups(relativePath, 'right', setup.groupHops)
            )
          );
        },
        `all moved files to appear in vc${setup.targetViewColumn}`,
        () => (
          vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
          getTabCount(setup.sourceViewColumn) === setup.expectedSourceCount &&
          getTabCount(setup.targetViewColumn) === setup.expectedTargetCount &&
          groupContainsFiles(setup.targetViewColumn, setup.movedFiles)
        ),
        1000,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AK: Multi-tab new-group approximation ──────────────

  const multiTabNewGroupApproxScenarios = [
    {
      name: 'AK1: approximate moving two tabs into new vc2',
      scenario: 'AK1: multi-tab new-group approximation (1vc, 2 tabs)',
      label: 'Approximate moving two tabs from vc1 into a newly created vc2',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      ],
      movedFiles: ['README.md', 'tsconfig.json'],
      sourceViewColumn: 1,
      targetViewColumn: 2,
      expectedGroupCount: 2,
      expectedSourceCount: 1,
      expectedTargetCount: 2,
    },
    {
      name: 'AK2: approximate moving two tabs from vc3 into new vc4',
      scenario: 'AK2: multi-tab new-group approximation (3vc, 2 tabs)',
      label: 'Approximate moving two tabs from rightmost vc3 into a newly created vc4',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
      ],
      movedFiles: ['LICENSE', 'CHANGELOG.md'],
      sourceViewColumn: 3,
      targetViewColumn: 4,
      expectedGroupCount: 4,
      expectedSourceCount: 1,
      expectedTargetCount: 2,
    },
    {
      name: 'AK3: approximate moving two tabs from vc5 into new vc6',
      scenario: 'AK3: multi-tab new-group approximation (5vc, 2 tabs)',
      label: 'Approximate moving two tabs from rightmost vc5 into a newly created vc6',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Five },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Five },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      movedFiles: ['CHANGELOG.md', 'webview.html'],
      sourceViewColumn: 5,
      targetViewColumn: 6,
      expectedGroupCount: 6,
      expectedSourceCount: 1,
      expectedTargetCount: 2,
    },
  ];

  for (const setup of multiTabNewGroupApproxScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 30);

      await openFilesInLayout(setup.entries);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await Promise.all(
            setup.movedFiles.map((relativePath) =>
              moveFileAcrossGroups(relativePath, 'right', 1)
            )
          );
        },
        `all moved files to appear in new vc${setup.targetViewColumn}`,
        () => (
          vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
          getTabCount(setup.sourceViewColumn) === setup.expectedSourceCount &&
          getTabCount(setup.targetViewColumn) === setup.expectedTargetCount &&
          groupContainsFiles(setup.targetViewColumn, setup.movedFiles)
        ),
        1000,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AL: Multi-tab split approximation ──────────────────

  const multiTabSplitApproxScenarios = [
    {
      name: 'AL1: approximate splitting two tabs into new vc2',
      scenario: 'AL1: multi-tab split approximation (1vc, 2 tabs)',
      label: 'Approximate splitting two tabs from vc1 into a newly created vc2',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      ],
      duplicatedFiles: ['README.md', 'tsconfig.json'],
      sourceViewColumn: 1,
      targetViewColumn: 2,
      expectedGroupCount: 2,
      expectedSourceCount: 3,
      expectedTargetCount: 2,
    },
    {
      name: 'AL2: approximate splitting two tabs from vc3 into new vc4',
      scenario: 'AL2: multi-tab split approximation (3vc, 2 tabs)',
      label: 'Approximate splitting two tabs from rightmost vc3 into a newly created vc4',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Three },
      ],
      duplicatedFiles: ['LICENSE', 'CHANGELOG.md'],
      sourceViewColumn: 3,
      targetViewColumn: 4,
      expectedGroupCount: 4,
      expectedSourceCount: 3,
      expectedTargetCount: 2,
    },
    {
      name: 'AL3: approximate splitting two tabs from vc5 into new vc6',
      scenario: 'AL3: multi-tab split approximation (5vc, 2 tabs)',
      label: 'Approximate splitting two tabs from rightmost vc5 into a newly created vc6',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.Four },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Five },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Five },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.Five },
      ],
      duplicatedFiles: ['CHANGELOG.md', 'webview.html'],
      sourceViewColumn: 5,
      targetViewColumn: 6,
      expectedGroupCount: 6,
      expectedSourceCount: 3,
      expectedTargetCount: 2,
    },
  ];

  for (const setup of multiTabSplitApproxScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 30);

      await openFilesInLayout(setup.entries);
      await focusGroup(setup.sourceViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.newGroupRight');
          await Promise.all(
            setup.duplicatedFiles.map((relativePath) =>
              openFile(relativePath, {
                viewColumn: setup.targetViewColumn,
                preview: false,
              })
            )
          );
        },
        `all duplicated files to appear in new vc${setup.targetViewColumn}`,
        () => (
          vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
          getTabCount(setup.sourceViewColumn) === setup.expectedSourceCount &&
          getTabCount(setup.targetViewColumn) === setup.expectedTargetCount &&
          groupContainsFiles(setup.sourceViewColumn, setup.duplicatedFiles) &&
          groupContainsFiles(setup.targetViewColumn, setup.duplicatedFiles)
        ),
        1000,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AM: Join two groups targeted merge ────────────────

  const joinTwoGroupsScenarios = [
    {
      name: 'AM1: join vc1 into vc2',
      scenario: 'AM1: join two groups (2vc)',
      label: 'Join active vc1 into its right-hand neighbor vc2',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
      ],
      sourceViewColumn: 1,
      expectedGroupCount: 1,
      expectedTargetViewColumn: 1,
      expectedTargetFiles: ['package.json', 'README.md'],
      expectedTotalTabs: 2,
    },
    {
      name: 'AM2: join middle vc2 into vc3',
      scenario: 'AM2: join two groups (3vc-middle-right)',
      label: 'Join active middle vc2 into vc3 and observe the merged target renumber into vc2',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.Two },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
      ],
      sourceViewColumn: 2,
      expectedGroupCount: 2,
      expectedTargetViewColumn: 2,
      expectedTargetFiles: ['README.md', 'tsconfig.json', 'LICENSE'],
      expectedTotalTabs: 4,
      removedViewColumn: 3,
    },
    {
      name: 'AM3: join rightmost vc4 into vc3 with duplicate package.json',
      scenario: 'AM3: join two groups (4vc-rightmost-duplicate)',
      label: 'Join active rightmost vc4 left into vc3 while package.json already exists in the target',
      entries: [
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.Two },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Three },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.Three },
        { file: 'package.json', viewColumn: vscode.ViewColumn.Four },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.Four },
      ],
      sourceViewColumn: 4,
      expectedGroupCount: 3,
      expectedTargetViewColumn: 3,
      expectedTargetFiles: ['package.json', 'LICENSE', 'CHANGELOG.md'],
      duplicateFile: 'package.json',
      expectedDuplicateCount: 1,
      expectedTotalTabs: 5,
      removedViewColumn: 4,
    },
  ];

  for (const setup of joinTwoGroupsScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 25);

      await openFilesInLayout(setup.entries);
      await focusGroup(setup.sourceViewColumn);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          await vscode.commands.executeCommand('workbench.action.joinTwoGroups');
        },
        `source vc${setup.sourceViewColumn} to merge into its neighboring group`,
        () => (
          vscode.window.tabGroups.all.length === setup.expectedGroupCount &&
          getTotalTabCount() === setup.expectedTotalTabs &&
          groupContainsFiles(setup.expectedTargetViewColumn, setup.expectedTargetFiles) &&
          (
            typeof setup.removedViewColumn !== 'number' ||
            !vscode.window.tabGroups.all.some((group) => group.viewColumn === setup.removedViewColumn)
          ) &&
          (
            !setup.duplicateFile ||
            countTabsWithLabel(setup.expectedTargetViewColumn, setup.duplicateFile) === setup.expectedDuplicateCount
          )
        ),
        1000,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AN: Multi-tab same-group approximation ─────────────

  const multiTabSameGroupApproxScenarios = [
    {
      name: 'AN1: approximate moving middle pair to the end',
      scenario: 'AN1: multi-tab same-group approximation (1vc-rightward-pair)',
      label: 'Approximate moving a 2-tab block right within vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
      ],
      moves: [
        { file: 'tsconfig.json', toIndex: 3 },
        { file: 'README.md', toIndex: 2 },
      ],
      expectedOrder: ['package.json', 'LICENSE', 'README.md', 'tsconfig.json'],
    },
    {
      name: 'AN2: approximate moving middle triple to the end',
      scenario: 'AN2: multi-tab same-group approximation (1vc-middle-triple-to-end)',
      label: 'Approximate moving a 3-tab middle block to the end within vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.One },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.One },
      ],
      moves: [
        { file: 'LICENSE', toIndex: 5 },
        { file: 'tsconfig.json', toIndex: 4 },
        { file: 'README.md', toIndex: 3 },
      ],
      expectedOrder: [
        'package.json',
        'CHANGELOG.md',
        'webview.html',
        'README.md',
        'tsconfig.json',
        'LICENSE',
      ],
    },
    {
      name: 'AN3: approximate moving later pair to the front',
      scenario: 'AN3: multi-tab same-group approximation (1vc-late-pair-to-front)',
      label: 'Approximate moving a later 2-tab block to the front within vc1',
      entries: [
        { file: 'package.json', viewColumn: vscode.ViewColumn.One },
        { file: 'README.md', viewColumn: vscode.ViewColumn.One },
        { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
        { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
        { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.One },
        { file: 'webview.html', viewColumn: vscode.ViewColumn.One },
        { file: 'webview.css', viewColumn: vscode.ViewColumn.One },
        { file: 'vitest.config.ts', viewColumn: vscode.ViewColumn.One },
      ],
      moves: [
        { file: 'CHANGELOG.md', toIndex: 0 },
        { file: 'webview.html', toIndex: 1 },
      ],
      expectedOrder: [
        'CHANGELOG.md',
        'webview.html',
        'package.json',
        'README.md',
        'tsconfig.json',
        'LICENSE',
        'webview.css',
        'vitest.config.ts',
      ],
    },
  ];

  for (const setup of multiTabSameGroupApproxScenarios) {
    test(setup.name, async function () {
      this.timeout(1000 * 30);

      await openFilesInLayout(setup.entries);

      const events = await runCapturedScenario(
        setup.scenario,
        setup.label,
        async () => {
          for (const move of setup.moves) {
            await moveFileWithinGroup(move.file, vscode.ViewColumn.One, move.toIndex);
          }
        },
        'vc1 tab order to match the approximated block move',
        () => (
          vscode.window.tabGroups.all.length === 1 &&
          getTabCount(vscode.ViewColumn.One) === setup.expectedOrder.length &&
          groupMatchesOrder(vscode.ViewColumn.One, setup.expectedOrder)
        ),
        1000,
      );

      assertCapturedEvents(events);
    });
  }

  // ─── Scenario AO: Same-group rightward reorder ───────────────────

  test('AO: move middle tab to the end within the same group', async function () {
    this.timeout(1000 * 25);

    await openFilesInLayout([
      { file: 'package.json', viewColumn: vscode.ViewColumn.One },
      { file: 'README.md', viewColumn: vscode.ViewColumn.One },
      { file: 'tsconfig.json', viewColumn: vscode.ViewColumn.One },
      { file: 'LICENSE', viewColumn: vscode.ViewColumn.One },
      { file: 'CHANGELOG.md', viewColumn: vscode.ViewColumn.One },
      { file: 'webview.html', viewColumn: vscode.ViewColumn.One },
    ]);
    await activateFile('tsconfig.json', vscode.ViewColumn.One);

    const events = await runCapturedScenario(
      'AO: rightward multi-step reorder',
      'Move tab from index 2 to index 5 (3 right moves)',
      async () => {
        for (let step = 0; step < 3; step++) {
          await vscode.commands.executeCommand('workbench.action.moveEditorRightInGroup');
          await sleep(150);
        }
      },
      'vc1 tab order to reflect the rightward move',
      () => (
        vscode.window.tabGroups.all.length === 1 &&
        getTabCount(vscode.ViewColumn.One) === 6 &&
        groupMatchesOrder(vscode.ViewColumn.One, [
          'package.json',
          'README.md',
          'LICENSE',
          'CHANGELOG.md',
          'webview.html',
          'tsconfig.json',
        ])
      ),
      1000,
    );

    assertCapturedEvents(events);
  });
});
