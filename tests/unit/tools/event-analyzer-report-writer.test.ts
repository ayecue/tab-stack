import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

const {
  createCaptureFolderName,
  createScenarioBaseName,
  writeCaptureBundle,
  writeCaptureFixture,
} = require('../../../tools/vscode-event-analyzer/report-writer.cjs');

function createScenarioResult(name: string, overrides: Record<string, unknown> = {}) {
  const observedEvents = (overrides.observedEvents as number) ?? 2;
  const tabUri = (overrides.tabUri as string) ?? undefined;
  const tabEntry = {
    seq: 0,
    timestamp: 1,
    opened: tabUri
      ? [{ tabRefId: 'tab-1', label: 'file.ts', uri: tabUri }]
      : [],
    closed: [],
    changed: [],
  };

  return {
    scenario: name,
    events: {
      tabEvents: [tabEntry],
      groupEvents: [],
      snapshotDiffs: [],
    },
    replay: {
      observedEvents: Array.from({ length: observedEvents }, (_, index) => ({
        seq: index,
        timestamp: index + 1,
        type: 'tab',
        event: { opened: [], closed: [], changed: [] },
        beforeSnapshot: { version: index, groups: [] },
        afterSnapshot: { version: index + 1, groups: [] },
      })),
      initialSnapshot: { version: 0, groups: [] },
      finalSnapshot: { version: observedEvents, groups: [] },
    },
    layout: {
      before: [{ viewColumn: 1, tabs: [] }],
      after: [{ viewColumn: 1, tabs: ['package.json'] }],
    },
  };
}

describe('event analyzer report writer', () => {
  let tempDir: string | null = null;

  afterEach(() => {
    if (tempDir) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it('creates a timestamped directory with per-scenario JSON and Markdown files', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tab-stack-event-analyzer-'));
    const generatedAt = new Date('2026-04-11T12:00:00.000Z');

    const written = writeCaptureBundle(
      tempDir,
      [
        createScenarioResult('A: open a single file'),
        createScenarioResult('B: close a single tab', { observedEvents: 3 }),
      ],
      {
        generatedAt,
        vscodeVersion: '1.115.0',
      },
    );

    expect(path.basename(written.captureDir)).toBe(
      createCaptureFolderName(generatedAt),
    );
    expect(fs.existsSync(written.indexJsonPath)).toBe(true);
    expect(fs.existsSync(written.indexMarkdownPath)).toBe(true);
    expect(written.scenarioJsonPaths).toHaveLength(2);
    expect(written.scenarioMarkdownPaths).toHaveLength(2);

    const scenarioOneBaseName = createScenarioBaseName(0, 'A: open a single file');
    const scenarioTwoBaseName = createScenarioBaseName(1, 'B: close a single tab');

    expect(
      fs.existsSync(
        path.join(written.captureDir, 'scenarios', `${scenarioOneBaseName}.json`),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(written.captureDir, 'scenarios', `${scenarioOneBaseName}.md`),
      ),
    ).toBe(true);
    expect(
      fs.existsSync(
        path.join(written.captureDir, 'scenarios', `${scenarioTwoBaseName}.json`),
      ),
    ).toBe(true);

    const index = JSON.parse(fs.readFileSync(written.indexJsonPath, 'utf8'));
    expect(index.outputVersion).toBe(2);
    expect(index.scenarioCount).toBe(2);
    expect(index.scenarios[0].jsonFile).toBe(`scenarios/${scenarioOneBaseName}.json`);
    expect(index.scenarios[1].markdownFile).toBe(`scenarios/${scenarioTwoBaseName}.md`);

    const scenarioJson = JSON.parse(
      fs.readFileSync(
        path.join(written.captureDir, 'scenarios', `${scenarioOneBaseName}.json`),
        'utf8',
      ),
    );
    expect(scenarioJson.scenario).toBe('A: open a single file');

    const indexMarkdown = fs.readFileSync(written.indexMarkdownPath, 'utf8');
    expect(indexMarkdown).toContain('VS Code Event Capture Index');
    expect(indexMarkdown).toContain(`scenarios/${scenarioTwoBaseName}.json`);
  });

  it('refreshes a stable fixture directory and removes stale files', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tab-stack-event-analyzer-fixture-'));
    const fixtureDir = path.join(tempDir, 'event-analyzer');

    fs.mkdirSync(path.join(fixtureDir, 'stale'), { recursive: true });
    fs.writeFileSync(path.join(fixtureDir, 'stale', 'old.json'), '{}');

    const written = writeCaptureFixture(
      fixtureDir,
      [createScenarioResult('A: open a single file')],
      {
        generatedAt: new Date('2026-04-11T12:34:56.000Z'),
        vscodeVersion: '1.115.0',
      },
    );

    expect(written.captureDir).toBe(fixtureDir);
    expect(fs.existsSync(path.join(fixtureDir, 'stale'))).toBe(false);
    expect(fs.existsSync(path.join(fixtureDir, 'index.json'))).toBe(true);
    expect(fs.existsSync(path.join(fixtureDir, 'index.md'))).toBe(true);
    expect(
      fs.existsSync(
        path.join(fixtureDir, 'scenarios', `${createScenarioBaseName(0, 'A: open a single file')}.json`),
      ),
    ).toBe(true);

    const index = JSON.parse(fs.readFileSync(path.join(fixtureDir, 'index.json'), 'utf8'));
    expect(index.generatedAt).toBe('2026-04-11T12:34:56.000Z');
    expect(index.scenarioCount).toBe(1);
  });

  it('anonymizes workspace root paths in scenario files when anonymizeRoot is set', () => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'tab-stack-event-analyzer-anon-'));
    const realRoot = '/Users/dev/projects/my-extension';
    const uri = `file://${realRoot}/src/index.ts`;

    const written = writeCaptureFixture(
      tempDir,
      [createScenarioResult('A: open a single file', { tabUri: uri })],
      {
        generatedAt: new Date('2026-04-11T13:00:00.000Z'),
        vscodeVersion: '1.115.0',
        anonymizeRoot: realRoot,
      },
    );

    const scenarioJson = fs.readFileSync(written.scenarioJsonPaths[0], 'utf8');
    expect(scenarioJson).not.toContain(realRoot);
    expect(scenarioJson).toContain('file:///workspace/src/index.ts');

    const scenarioMd = fs.readFileSync(written.scenarioMarkdownPaths[0], 'utf8');
    expect(scenarioMd).not.toContain(realRoot);
  });
});