const fs = require('fs');
const path = require('path');

function createCaptureFolderName(generatedAt = new Date()) {
  return `event-capture-${generatedAt
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, 19)}`;
}

function sanitizeScenarioName(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'scenario';
}

function createScenarioBaseName(index, scenarioName) {
  const prefix = String(index + 1).padStart(2, '0');
  return `${prefix}-${sanitizeScenarioName(scenarioName)}`;
}

function createScenarioSummary(result, index) {
  const baseName = createScenarioBaseName(index, result.scenario);
  const observedEvents = result.replay?.observedEvents?.length ?? 0;
  const tabEvents = result.events?.tabEvents?.length ?? 0;
  const groupEvents = result.events?.groupEvents?.length ?? 0;

  return {
    order: index + 1,
    scenario: result.scenario,
    baseName,
    jsonFile: `scenarios/${baseName}.json`,
    markdownFile: `scenarios/${baseName}.md`,
    observedEvents,
    tabEvents,
    groupEvents,
    initialSnapshotVersion: result.replay?.initialSnapshot?.version ?? null,
    finalSnapshotVersion: result.replay?.finalSnapshot?.version ?? null,
  };
}

function buildCaptureIndex(results, options = {}) {
  const generatedAt = options.generatedAt ?? new Date();
  const vscodeVersion = options.vscodeVersion ?? 'unknown';

  return {
    outputVersion: 2,
    generatedAt: generatedAt.toISOString(),
    vscodeVersion,
    scenarioCount: results.length,
    scenarios: results.map((result, index) => createScenarioSummary(result, index)),
  };
}

function formatMarkdownReport(results, options = {}) {
  const generatedAt = options.generatedAt ?? new Date();
  const vscodeVersion = options.vscodeVersion ?? 'unknown';
  const title = options.title ?? 'VS Code Event Capture Report';
  const lines = [
    `# ${title}`,
    ``,
    `Generated: ${generatedAt.toISOString()}`,
    `VS Code version: ${vscodeVersion}`,
    ``,
  ];

  for (const r of results) {
    lines.push(`## ${r.scenario}`);
    lines.push(``);
    lines.push(`### Layout`);
    lines.push(`- **Before:** ${JSON.stringify(r.layout.before)}`);
    lines.push(`- **After:** ${JSON.stringify(r.layout.after)}`);
    lines.push(``);

    if (r.replay?.initialSnapshot || r.replay?.finalSnapshot) {
      lines.push(`### Replay`);
      lines.push(
        `- **Initial snapshot version:** ${r.replay.initialSnapshot?.version ?? 'n/a'}`,
      );
      lines.push(
        `- **Final snapshot version:** ${r.replay.finalSnapshot?.version ?? 'n/a'}`,
      );
      lines.push(`- **Observed events:** ${r.replay.observedEvents?.length ?? 0}`);
      lines.push(``);
    }

    const allEvents = (r.replay?.observedEvents?.length
      ? r.replay.observedEvents.map((event) => ({
          ...event,
          kind: event.type.toUpperCase(),
        }))
      : [
          ...r.events.tabEvents.map((event) => ({ ...event, kind: 'TAB' })),
          ...r.events.groupEvents.map((event) => ({ ...event, kind: 'GROUP' })),
        ]).sort((left, right) => left.seq - right.seq);

    if (allEvents.length === 0) {
      lines.push(`*(no events fired)*`);
    } else {
      lines.push(
        `| Seq | Timestamp | Kind | Before v | After v | Opened | Closed | Changed |`,
      );
      lines.push(`|-----|-----------|------|----------|---------|--------|--------|---------|`);
      for (const evt of allEvents) {
        const ts = evt.timestamp ? new Date(evt.timestamp).toISOString() : '';
        const payload = evt.event ?? evt;
        const opened = payload.opened?.length ? JSON.stringify(payload.opened) : '';
        const closed = payload.closed?.length ? JSON.stringify(payload.closed) : '';
        const changed = payload.changed?.length ? JSON.stringify(payload.changed) : '';
        const beforeVersion = evt.beforeSnapshot?.version ?? '';
        const afterVersion = evt.afterSnapshot?.version ?? '';
        lines.push(
          `| ${evt.seq} | ${ts} | ${evt.kind} | ${beforeVersion} | ${afterVersion} | ${opened} | ${closed} | ${changed} |`,
        );
      }
    }
    lines.push(``);

    const diffs = r.events.snapshotDiffs ?? [];
    if (diffs.length > 0) {
      lines.push(`### Snapshot Diffs`);
      lines.push(``);
      for (const sd of diffs) {
        const sdTs = sd.timestamp ? new Date(sd.timestamp).toISOString() : '';
        const versionLabel =
          typeof sd.beforeVersion === 'number' && typeof sd.afterVersion === 'number'
            ? ` v${sd.beforeVersion} -> v${sd.afterVersion}`
            : '';
        lines.push(
          `**[seq=${sd.seq}, time=${sdTs}] ${sd.trigger.toUpperCase()}${versionLabel}** — ${sd.diff.length} change(s)`,
        );
        lines.push(``);
        if (sd.diff.length > 0) {
          lines.push(`| Type | Path | Old Value | New Value |`);
          lines.push(`|------|------|-----------|-----------|`);
          for (const d of sd.diff) {
            const pathStr = d.path.join('.');
            const oldVal = d.type === 'CREATE' ? '' : JSON.stringify(d.oldValue);
            const newVal = d.type === 'REMOVE' ? '' : JSON.stringify(d.value);
            lines.push(`| ${d.type} | \`${pathStr}\` | ${oldVal} | ${newVal} |`);
          }
          lines.push(``);
        }
      }
    }

    lines.push(`---`);
    lines.push(``);
  }

  return lines.join('\n');
}

function formatIndexMarkdown(index) {
  const lines = [
    '# VS Code Event Capture Index',
    '',
    `Generated: ${index.generatedAt}`,
    `VS Code version: ${index.vscodeVersion}`,
    `Output version: ${index.outputVersion}`,
    `Scenarios: ${index.scenarioCount}`,
    '',
  ];

  if (index.scenarios.length === 0) {
    lines.push('*(no scenarios captured)*');
    lines.push('');
    return lines.join('\n');
  }

  lines.push(
    '| # | Scenario | JSON | Markdown | Observed Events | Tab Events | Group Events | Initial v | Final v |',
  );
  lines.push(
    '|---|----------|------|----------|-----------------|------------|--------------|-----------|---------|',
  );

  for (const scenario of index.scenarios) {
    lines.push(
      `| ${scenario.order} | ${scenario.scenario} | ${scenario.jsonFile} | ${scenario.markdownFile} | ${scenario.observedEvents} | ${scenario.tabEvents} | ${scenario.groupEvents} | ${scenario.initialSnapshotVersion ?? ''} | ${scenario.finalSnapshotVersion ?? ''} |`,
    );
  }

  lines.push('');
  return lines.join('\n');
}

function anonymizePaths(content, anonymizeRoot) {
  if (!anonymizeRoot) {
    return content;
  }
  return content.replaceAll(anonymizeRoot, '/workspace');
}

function writeCaptureFiles(captureDir, results, options = {}) {
  const generatedAt = options.generatedAt ?? new Date();
  const vscodeVersion = options.vscodeVersion ?? 'unknown';
  const anonymizeRoot = options.anonymizeRoot ?? null;
  const captureIndex = buildCaptureIndex(results, { generatedAt, vscodeVersion });

  const scenariosDir = path.join(captureDir, 'scenarios');
  fs.mkdirSync(scenariosDir, { recursive: true });

  const scenarioJsonPaths = [];
  const scenarioMarkdownPaths = [];

  captureIndex.scenarios.forEach((summary, index) => {
    const result = results[index];
    const scenarioJsonPath = path.join(captureDir, summary.jsonFile);
    const scenarioMarkdownPath = path.join(captureDir, summary.markdownFile);

    fs.writeFileSync(
      scenarioJsonPath,
      anonymizePaths(JSON.stringify(result, null, 2), anonymizeRoot),
    );
    fs.writeFileSync(
      scenarioMarkdownPath,
      anonymizePaths(
        formatMarkdownReport([result], {
          generatedAt,
          vscodeVersion,
          title: `Scenario: ${result.scenario}`,
        }),
        anonymizeRoot,
      ),
    );

    scenarioJsonPaths.push(scenarioJsonPath);
    scenarioMarkdownPaths.push(scenarioMarkdownPath);
  });

  const indexJsonPath = path.join(captureDir, 'index.json');
  const indexMarkdownPath = path.join(captureDir, 'index.md');
  fs.writeFileSync(indexJsonPath, JSON.stringify(captureIndex, null, 2));
  fs.writeFileSync(indexMarkdownPath, formatIndexMarkdown(captureIndex));

  return {
    captureDir,
    indexJsonPath,
    indexMarkdownPath,
    scenarioJsonPaths,
    scenarioMarkdownPaths,
    scenarioCount: captureIndex.scenarioCount,
  };
}

function writeCaptureBundle(outputRoot, results, options = {}) {
  const generatedAt = options.generatedAt ?? new Date();
  const captureDir = path.join(outputRoot, createCaptureFolderName(generatedAt));
  return writeCaptureFiles(captureDir, results, options);
}

function writeCaptureFixture(fixtureDir, results, options = {}) {
  fs.rmSync(fixtureDir, { recursive: true, force: true });
  return writeCaptureFiles(fixtureDir, results, options);
}

module.exports = {
  buildCaptureIndex,
  createCaptureFolderName,
  createScenarioBaseName,
  formatIndexMarkdown,
  formatMarkdownReport,
  sanitizeScenarioName,
  writeCaptureBundle,
  writeCaptureFixture,
};