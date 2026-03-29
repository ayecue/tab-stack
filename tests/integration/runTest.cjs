const { runTests } = require('@vscode/test-electron');
const path = require('node:path');

async function main() {
  try {
    // Set before runTests so it's inherited by the extension host process
    process.env.VSCODE_TAB_STACK_TEST = '1';

    // Pass TEST_FILE env to run only a specific test file
    // Usage: TEST_FILE=tab-state node tests/integration/runTest.cjs
    if (process.env.TEST_FILE) {
      process.env.TEST_FILE = process.env.TEST_FILE;
    }

    const extensionDevelopmentPath = path.resolve(__dirname, '../..');
    const extensionTestsPath = path.resolve(__dirname, './suite/index.cjs');

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [extensionDevelopmentPath, '--disable-extensions']
    });
  } catch (err) {
    console.error('Failed to run integration tests', err);
    process.exit(1);
  }
}

main();
