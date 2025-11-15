const { suite, test } = require('mocha');
const assert = require('assert');
const vscode = require('vscode');

const EXTENSION_ID = 'ayecue.tab-stack';
const CMD = (name) => `tabStack.${name}`;

async function activateExtension() {
  const ext = vscode.extensions.getExtension(EXTENSION_ID);
  assert.ok(ext, 'Extension should be discoverable');
  if (!ext.isActive) {
    await ext.activate();
  }
  assert.strictEqual(ext.isActive, true, 'Extension should be active');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

suite('Command smoke tests', () => {
  test('create -> switch -> delete group', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    const groupName = `IntTestGroup-${Date.now()}`;

    // Create group
    await vscode.commands.executeCommand(CMD('createGroup'), groupName);
    // Give the extension a moment to persist the new group
    await sleep(200);

    // Switch to that group by name (no quick pick)
    await vscode.commands.executeCommand(CMD('switchGroup'), groupName);

    // Assign and clear quick slot using params to avoid prompts
    await vscode.commands.executeCommand(CMD('assignQuickSlot'), groupName, '1');
    await vscode.commands.executeCommand(CMD('quickSlot1'));
    await vscode.commands.executeCommand(CMD('clearQuickSlot'), '1');

    // Delete the group by name (no quick pick)
    await vscode.commands.executeCommand(CMD('deleteGroup'), groupName);

    assert.ok(true, 'Commands executed without throwing');
  });

  test('add-on lifecycle: create -> apply -> delete', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    // Ensure state is initialized by creating a group first
    const bootstrapGroup = `IntTestBootstrap-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('createGroup'), bootstrapGroup);
    await sleep(200);

    const addonName = `IntTestAddon-${Date.now()}`;

    await vscode.commands.executeCommand(CMD('createAddon'), addonName);
    await vscode.commands.executeCommand(CMD('applyAddon'), addonName);
    await vscode.commands.executeCommand(CMD('deleteAddon'), addonName);

    assert.ok(true, 'Add-on commands executed');
  });

  test('utility commands: refresh, clear selection, quick switch, clear all tabs', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    // Ensure state is initialized by creating a group first
    const bootstrapGroup = `IntTestBootstrap-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('createGroup'), bootstrapGroup);

    await vscode.commands.executeCommand(CMD('refresh'));
    await vscode.commands.executeCommand(CMD('clearSelection'));
    await vscode.commands.executeCommand(CMD('quickSwitch'));
    await vscode.commands.executeCommand(CMD('clearAllTabs'));

    assert.ok(true, 'Utility commands executed');
  });

  test('assign quick slot validates index and does not throw', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    const groupName = `IntTestGroupQS-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('createGroup'), groupName);

    // Invalid index should be handled gracefully (shows warning internally)
    await vscode.commands.executeCommand(CMD('assignQuickSlot'), groupName, '12');
    await vscode.commands.executeCommand(CMD('clearQuickSlot'), '0');

    assert.ok(true, 'Invalid quick slot indices handled without throwing');
  });

  test('quick switch toggles between two groups without throwing', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    const g1 = `IntTestQS1-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('createGroup'), g1);
    await sleep(200);

    const g2 = `IntTestQS2-${Date.now()}`;
    await vscode.commands.executeCommand(CMD('createGroup'), g2);
    await sleep(200);

    // Now previous/current are defined; quickSwitch should be safe
    await vscode.commands.executeCommand(CMD('quickSwitch'));

    assert.ok(true, 'quickSwitch executed');
  });

  test('assign and apply multiple quick slots', async function () {
    this.timeout(1000 * 20);
    await activateExtension();

    const gA = `IntTestG-A-${Date.now()}`;
    const gB = `IntTestG-B-${Date.now()}`;
    const gC = `IntTestG-C-${Date.now()}`;

    await vscode.commands.executeCommand(CMD('createGroup'), gA);
    await vscode.commands.executeCommand(CMD('createGroup'), gB);
    await vscode.commands.executeCommand(CMD('createGroup'), gC);
    await sleep(200);

    await vscode.commands.executeCommand(CMD('assignQuickSlot'), gA, '2');
    await vscode.commands.executeCommand(CMD('assignQuickSlot'), gB, '3');
    await vscode.commands.executeCommand(CMD('assignQuickSlot'), gC, '4');

    await vscode.commands.executeCommand(CMD('quickSlot2'));
    await vscode.commands.executeCommand(CMD('quickSlot3'));
    await vscode.commands.executeCommand(CMD('quickSlot4'));

    await vscode.commands.executeCommand(CMD('clearQuickSlot'), '2');
    await vscode.commands.executeCommand(CMD('clearQuickSlot'), '3');
    await vscode.commands.executeCommand(CMD('clearQuickSlot'), '4');

    assert.ok(true, 'Multiple quick slots assigned, applied, and cleared');
  });
});
