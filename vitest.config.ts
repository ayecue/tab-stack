import { defineConfig } from 'vitest/config';
import path from 'node:path';

const isCI = process.env.CI === 'true' || process.env.CI === '1';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['tests/setup/vitest.setup.ts'],
    include: ['tests/unit/**/*.test.ts', 'tests/unit/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      reportsDirectory: 'coverage/unit',
      all: false,
      clean: true,
      reportOnFailure: true,
      exclude: [
        '**/node_modules/**',
        '**/tests/**',
        '**/*.test.ts',
        '**/*.test.tsx',
        '**/test/**',
        '**/__mocks__/**',
        '**/mocks/**',
        '**/build-*.cjs',
        '**/copy-assets.cjs',
        '**/*.config.*',
        '**/coverage/**'
      ]
    }
  },
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'tests/__mocks__/vscode.ts')
    }
  }
});
