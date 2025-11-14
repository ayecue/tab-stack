import { suite, test } from 'mocha';
import assert from 'node:assert';
import * as vscode from 'vscode';

const EXTENSION_ID = 'ayecue.tab-stack';
const COMMAND_PREFIX = 'tabStack.';

suite('Extension activation', () => {
  test('Extension activates successfully', async () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(extension, 'Extension should be discoverable');

    await extension.activate();

    assert.strictEqual(extension.isActive, true);
  });

  test('Core commands are registered', async () => {
    const extension = vscode.extensions.getExtension(EXTENSION_ID);
    assert.ok(extension, 'Extension should be discoverable');

    await extension.activate();

    const registeredCommands = await vscode.commands.getCommands(true);
    const commandsToCheck = ['quickSwitch', 'refresh', 'createGroup'];

    for (const command of commandsToCheck) {
      assert.ok(
        registeredCommands.includes(`${COMMAND_PREFIX}${command}`),
        `Command ${command} should be registered`
      );
    }
  });
});
