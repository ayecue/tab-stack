const { glob } = require('glob');
const Mocha = require('mocha');
const path = require('node:path');

exports.run = async function () {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    parallel: false,
    timeout: 1000 * 30,
  });

  const testsRoot = path.resolve(__dirname, '.');
  const files = await glob('**/*.test.cjs', { cwd: testsRoot });

  for (const file of files) {
    mocha.addFile(path.resolve(testsRoot, file));
  }

  return new Promise((resolve, reject) => {
    try {
      mocha.run((failures) => {
        if (failures > 0) {
          reject(new Error(`${failures} analyzer tests failed.`));
        } else {
          resolve();
        }
      });
    } catch (error) {
      reject(error);
    }
  });
};
