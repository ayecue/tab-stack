const { suite, test, suiteSetup, suiteTeardown, setup, teardown } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');
const path = require('path');
const { CMD, activateExtension, sleep, waitUntil } = require('./helpers/core.cjs');
const { openFile, closeAllTabs, pinActiveEditor, totalTabCount } = require('./helpers/editor.cjs');

/**
 * Integration tests for the TabChangeProxyService resolved-event pipeline.
 *
 * These tests verify that VS Code tab actions produce the correct
 * ResolvedTabChangeEvent (created/closed/moved/updated) through the full
 * pipeline: VS Code events → TabObserverService → state machine → resolve.
 *
 * The proxy buffers events for 500 ms before emitting a resolved batch.
 * Each test starts capture, performs an action, waits for the batch, then
 * asserts the resolved arrays.
 */

const BUFFER_WAIT = 1500; // Allow well beyond the 500 ms buffer

async function startResolvedCapture() {
  return vscode.commands.executeCommand(CMD('__test__startResolvedEventCapture'));
}

async function stopResolvedCapture() {
  return vscode.commands.executeCommand(CMD('__test__stopResolvedEventCapture'));
}

async function getResolvedEvents(clear = false) {
  return vscode.commands.executeCommand(CMD('__test__getResolvedEvents'), clear);
}

/**
 * Wait until at least `count` resolved event batches have been captured.
 */
async function waitForResolvedEvents(count = 1, timeout = 5000) {
  return waitUntil(
    async () => {
      const result = await getResolvedEvents();
      return result.events.length >= count ? result : null;
    },
    `at least ${count} resolved event batch(es)`,
    timeout
  );
}

suite('TabChangeProxyService – resolved events', () => {
  suiteSetup(async function () {
    this.timeout(1000 * 30);
    await activateExtension();
  });

  setup(async function () {
    await closeAllTabs();
    await sleep(300);
    // Start fresh capture before each test
    await startResolvedCapture();
    // Give proxy time to settle after close-all
    await sleep(BUFFER_WAIT);
    // Clear any events from closeAllTabs
    await getResolvedEvents(true);
  });

  teardown(async function () {
    await stopResolvedCapture();
    await closeAllTabs();
  });

  // ── Open file ─────────────────────────────────────────────────────────

  test('open file emits created event', async function () {
    this.timeout(1000 * 15);

    await openFile('package.json');

    const result = await waitForResolvedEvents(1);
    const batch = result.events[0];

    assert.ok(batch.created.length >= 1, 'should have at least 1 created entry');
    const created = batch.created.find((c) => c.label === 'package.json');
    assert.ok(created, 'created entry should include package.json');
  });

  // ── Close file ────────────────────────────────────────────────────────

  test('close file emits closed event', async function () {
    this.timeout(1000 * 15);

    await openFile('package.json');

    // Wait for the open event to flush, then clear
    await sleep(BUFFER_WAIT);
    await getResolvedEvents(true);

    // Close the active editor
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

    const result = await waitForResolvedEvents(1);
    const allClosed = result.events.flatMap((e) => e.closed);

    assert.ok(allClosed.length >= 1, 'should have at least 1 closed entry');
    const closed = allClosed.find((c) => c.label === 'package.json');
    assert.ok(closed, 'closed entry should include package.json');
  });

  // ── Cross-group move ──────────────────────────────────────────────────

  test('cross-group move emits moved event', async function () {
    this.timeout(1000 * 20);

    // Keep one tab behind so the source group survives and the net endpoint
    // still has a cross-group structural move to report.
    await openFile('package.json');
    await openFile('tsconfig.json');
    await sleep(BUFFER_WAIT);
    await getResolvedEvents(true);

    // Move to a new group (right split)
    await vscode.commands.executeCommand('workbench.action.moveEditorToNextGroup');
    await sleep(300);

    const result = await waitForResolvedEvents(1);
    const allMoved = result.events.flatMap((e) => e.moved);

    assert.ok(allMoved.length >= 1, 'should have at least 1 moved entry');
    const moved = allMoved.find((m) => m.label === 'tsconfig.json');
    assert.ok(moved, 'moved entry should include tsconfig.json');
    assert.notStrictEqual(
      moved.fromViewColumn,
      moved.toViewColumn,
      'viewColumn should change for cross-group move'
    );
  });

  // ── Pin/unpin ─────────────────────────────────────────────────────────

  test('pin tab emits updated event with isPinned', async function () {
    this.timeout(1000 * 15);

    await openFile('package.json', { preview: false });
    // Make it the active editor
    const ws = vscode.workspace.workspaceFolders[0];
    const uri = vscode.Uri.file(path.join(ws.uri.fsPath, 'package.json'));
    const doc = await vscode.workspace.openTextDocument(uri);
    await vscode.window.showTextDocument(doc, { preserveFocus: false });
    await sleep(BUFFER_WAIT);
    await getResolvedEvents(true);

    await pinActiveEditor();

    const result = await waitForResolvedEvents(1);
    const allUpdated = result.events.flatMap((e) => e.updated);

    assert.ok(allUpdated.length >= 1, 'should have at least 1 updated entry');
    const updated = allUpdated.find(
      (u) => u.label === 'package.json' && u.changed.includes('isPinned')
    );
    assert.ok(updated, 'updated entry should show isPinned change for package.json');
  });

  // ── Open multiple files ───────────────────────────────────────────────

  test('open multiple files emits created for each', async function () {
    this.timeout(1000 * 20);

    await openFile('package.json');
    await openFile('tsconfig.json');
    await openFile('README.md');

    const result = await waitForResolvedEvents(1);
    const allCreated = result.events.flatMap((e) => e.created);

    // At least 3 created entries (may be in one or multiple batches)
    assert.ok(
      allCreated.length >= 3,
      `expected >= 3 created entries, got ${allCreated.length}`
    );

    const labels = allCreated.map((c) => c.label);
    assert.ok(labels.includes('package.json'), 'should include package.json');
    assert.ok(labels.includes('tsconfig.json'), 'should include tsconfig.json');
    assert.ok(labels.includes('README.md'), 'should include README.md');
  });

  // ── Close last tab in group ───────────────────────────────────────────

  test('close last tab in group emits closed, no stale artifacts', async function () {
    this.timeout(1000 * 15);

    await openFile('package.json');
    await sleep(BUFFER_WAIT);
    await getResolvedEvents(true);

    // Close the only tab — this also closes the group
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor');

    const result = await waitForResolvedEvents(1);
    const allClosed = result.events.flatMap((e) => e.closed);

    assert.ok(allClosed.length >= 1, 'should have at least 1 closed entry');
    const closed = allClosed.find((c) => c.label === 'package.json');
    assert.ok(closed, 'closed entry should include package.json');

    // Verify no lingering moved/created artifacts
    const allMoved = result.events.flatMap((e) => e.moved);
    const allCreated = result.events.flatMap((e) => e.created);
    const staleCreated = allCreated.filter((c) => c.label === 'package.json');
    assert.strictEqual(
      staleCreated.length,
      0,
      'should have no stale created entries for the closed file'
    );
  });

  // ── Dirty tab ─────────────────────────────────────────────────────────

  test('editing a file emits updated event with isDirty', async function () {
    this.timeout(1000 * 15);

    await openFile('README.md', { preview: false });
    const ws = vscode.workspace.workspaceFolders[0];
    const uri = vscode.Uri.file(path.join(ws.uri.fsPath, 'README.md'));
    const doc = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(doc, { preserveFocus: false });
    await sleep(BUFFER_WAIT);
    await getResolvedEvents(true);

    // Make the document dirty by inserting text
    await editor.edit((editBuilder) => {
      editBuilder.insert(new vscode.Position(0, 0), '/* test */');
    });

    const result = await waitForResolvedEvents(1);
    const allUpdated = result.events.flatMap((e) => e.updated);

    assert.ok(allUpdated.length >= 1, 'should have at least 1 updated entry');
    const updated = allUpdated.find(
      (u) => u.label === 'README.md' && u.changed.includes('isDirty')
    );
    assert.ok(updated, 'updated entry should show isDirty change for README.md');

    // Revert the change so we don't leave dirty state
    await vscode.commands.executeCommand('workbench.action.files.revert');
    await sleep(300);
  });

  // ── Within-group reorder ──────────────────────────────────────────────

  test('within-group reorder emits moved event with same viewColumn', async function () {
    this.timeout(1000 * 20);

    // Open two files in the same group
    await openFile('package.json');
    await openFile('tsconfig.json');
    await sleep(BUFFER_WAIT);
    await getResolvedEvents(true);

    // Move active editor (tsconfig.json) to the left within the group
    await vscode.commands.executeCommand('workbench.action.moveEditorLeftInGroup');
    await sleep(300);

    const result = await waitForResolvedEvents(1, 8000);
    const allMoved = result.events.flatMap((e) => e.moved);

    // At least one moved entry for the reorder
    assert.ok(allMoved.length >= 1, 'should have at least 1 moved entry for reorder');
    const moved = allMoved.find((m) => m.label === 'tsconfig.json');
    assert.ok(moved, 'moved entry should include tsconfig.json');
    assert.strictEqual(
      moved.fromViewColumn,
      moved.toViewColumn,
      'viewColumn should remain the same for within-group reorder'
    );
  });
});
