const { glob } = require('glob');
const Mocha = require('mocha');
const path = require('node:path');
const vscode = require('vscode');

async function resetTabStackState() {
  try {
    await vscode.commands.executeCommand('tabStack.__test__resetState');
  } catch (_) {
    // Extension may not be active yet or command not found; ignore.
  }
}

exports.run = async function() {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    parallel: false,
    timeout: 1000 * 20
  });

  const testsRoot = path.resolve(__dirname, '.');
  const testFileFilter = process.env.TEST_FILE;

  let pattern = '**/*.test.cjs';
  if (testFileFilter) {
    // Support partial match: TEST_FILE=tab-state → **/tab-state*.test.cjs
    pattern = `**/${testFileFilter}*.test.cjs`;
    console.log(`TEST_FILE="${testFileFilter}" → running only: ${pattern}`);
  }

  const files = await glob(pattern, { cwd: testsRoot });

  for (const file of files) {
    mocha.addFile(path.resolve(testsRoot, file));
  }

  return new Promise((resolve, reject) => {
    try {
      mocha.run(async (failures) => {
        // Clean up TabStack persisted state so test data does not linger
        await resetTabStackState();

        if (failures > 0) {
          reject(new Error(`${failures} integration tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
