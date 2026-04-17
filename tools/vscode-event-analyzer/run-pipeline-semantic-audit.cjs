const path = require('node:path');
const { spawnSync } = require('node:child_process');

function main() {
  const workspaceRoot = path.resolve(__dirname, '../..');
  const vitestCli = require.resolve('vitest/vitest.mjs', {
    paths: [workspaceRoot],
  });
  const testFile = path.resolve(
    workspaceRoot,
    'tests/unit/handlers/tab-change-pipeline.semantic-audit.analyzer.test.ts',
  );

  const result = spawnSync(
    process.execPath,
    [vitestCli, 'run', testFile],
    {
      cwd: workspaceRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        TAB_STACK_SEMANTIC_AUDIT: '1',
      },
    },
  );

  if (result.error) {
    console.error('Failed to run pipeline semantic audit', result.error);
    process.exit(1);
  }

  process.exit(result.status ?? 0);
}

main();