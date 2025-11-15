const { runTests } = require('@vscode/test-electron');
const path = require('node:path');

async function main() {
  try {
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
