# VS Code Event Analyzer

This tool is the source of truth for raw VS Code tab and tab-group change behavior in this repository.

If the question is about what VS Code actually emitted for `window.tabGroups.onDidChangeTabs` or `window.tabGroups.onDidChangeTabGroups`, read the analyzer outputs first. Do not infer raw behavior from the resolver, coordinator, or unit tests when captured data already exists.

## What This Tool Is For

- Capture real VS Code tab and tab-group event sequences.
- Record the exact ordering, duplication, and before/after snapshot transitions emitted by the editor.
- Produce replay-oriented scenario files that can be turned into change-pipeline fixtures.

Use it when debugging or designing behavior around:

- event ordering
- duplicate group events
- tab activation changes
- within-group reorder behavior
- cross-group or cross-column moves
- group destruction or renumbering
- cases where implementation logic disagrees with what VS Code really does

## Where AI Should Read Data From

When you need evidence for raw tab or tab-group behavior, use this precedence order:

1. `tests/fixtures/event-analyzer/index.json`
2. `tests/fixtures/event-analyzer/scenarios/*.json` for machine-readable scenario data
3. `tests/fixtures/event-analyzer/scenarios/*.md` for human-readable inspection
4. `suite/tab-events.test.cjs` only to understand how scenarios are generated, not as proof of runtime behavior

Important:

- Treat `tests/fixtures/event-analyzer/` as the canonical checked-in fixture for tests and AI-assisted analysis.
- Each `npm run analyze:events` execution refreshes that fixture directory in place with the newest capture.
- Treat the JSON scenario files as authoritative for AI or test-fixture generation.
- Treat the Markdown scenario files as summaries for quick review.

## Output Layout

Each analyzer run refreshes the fixture directory:

```text
tests/
  fixtures/
    event-analyzer/
      index.json
      index.md
      scenarios/
        01-a-open-a-single-file.json
        01-a-open-a-single-file.md
        ...
```

### `index.json`

Use this first when you need to discover available scenarios programmatically.

It contains:

- capture metadata
- VS Code version
- scenario count
- the ordered list of scenario files
- summary counts for observed, tab, and group events

### `scenarios/*.json`

Use these files when generating tests or analyzing behavior.

Each scenario JSON contains:

- `scenario`: scenario name
- `layout`: before/after layout summary
- `events.tabEvents`: raw serialized tab event payloads
- `events.groupEvents`: raw serialized tab-group event payloads
- `events.snapshotDiffs`: structural diffs between snapshots
- `replay.initialSnapshot`: starting snapshot for the scenario
- `replay.finalSnapshot`: ending snapshot for the scenario
- `replay.observedEvents`: ordered replay-friendly events with `beforeSnapshot` and `afterSnapshot`

For AI and fixture generation, `replay.observedEvents` is usually the most useful field.

## Which Field To Use For What

Use `events.tabEvents` when you need the raw `onDidChangeTabs` payloads.

Use `events.groupEvents` when you need the raw `onDidChangeTabGroups` payloads.

Use `events.snapshotDiffs` when you need to see what changed structurally between successive snapshots.

Use `replay.observedEvents` when you want to emulate or replay a scenario in tests, because it already includes:

- event type
- ordered sequence number
- timestamp
- versioned `beforeSnapshot`
- versioned `afterSnapshot`
- stable serialized payloads

## Stable IDs And Identity Semantics

The analyzer assigns serialized IDs so captured data can preserve runtime identity changes across a scenario.

- `tabRefId` identifies a specific observed tab object instance
- `groupRefId` identifies a specific observed tab-group object instance

If VS Code replaces a tab or group object during a move or structural change, the capture may show a new ref ID. That is expected and useful. It reflects real runtime identity churn that the change pipeline may need to handle.

Do not collapse these IDs away when studying move behavior.

## Source Files In This Tool

- `suite/tab-events.test.cjs`
  - Defines the captured scenarios.
- `extension.js`
  - Hooks into VS Code tab and tab-group change events.
- `capture-serializer.cjs`
  - Serializes raw events, snapshots, and stable ref IDs.
- `report-writer.cjs`
  - Writes timestamped bundle directories and per-scenario files.
- `run-analyzer.cjs`
  - Launches the analyzer in a real VS Code extension host.

These files explain how capture works. They are not substitutes for the captured outputs when the task is about actual observed behavior.

## Running The Analyzer

From the repository root:

```bash
npm run analyze:events
```

To generate the non-gating semantic audit report that compares endpoint-derived expectations against resolver `tabRewireDeltas`:

```bash
npm run audit:pipeline:semantics
```

That command writes deterministic report files to:

- `tools/vscode-event-analyzer/output/pipeline-semantic-audit.json`
- `tools/vscode-event-analyzer/output/pipeline-semantic-audit.md`

Run it again when:

- you add a new scenario
- VS Code version changes and event behavior may have shifted
- you need fresh evidence for a case not covered by the latest capture bundle

## Guidance For AI Assistants

If asked about tab or tab-group change behavior:

1. Open `tests/fixtures/event-analyzer/index.json`.
2. Read the closest matching scenario `.json` file.
3. Base conclusions on `replay.observedEvents`, `tabEvents`, `groupEvents`, and `snapshotDiffs`.
4. Only after that, inspect `src/services/tab-observer.ts`, `src/services/tab-change-proxy.ts`, `src/handlers/tab-change-batch-coordinator.ts`, or `src/handlers/tab-change.ts` to see how the extension responds to those events.

In short:

- analyzer output explains what VS Code did
- pipeline code explains what Tab Stack did with it

Do not reverse that order.