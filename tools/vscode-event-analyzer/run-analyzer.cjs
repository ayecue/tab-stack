const { runTests } = require('@vscode/test-electron');
const path = require('node:path');

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname);
    const extensionTestsPath = path.resolve(__dirname, './suite/index.cjs');

    // Use the workspace root so openFile() can find project files
    const workspacePath = path.resolve(__dirname, '../..');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [workspacePath, '--disable-extensions'],
    });
  } catch (err) {
    console.error('Failed to run event analyzer', err);
    process.exit(1);
  }
}

main();
