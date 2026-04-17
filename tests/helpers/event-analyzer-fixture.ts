import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { Tab, TabGroup } from 'vscode';

import { TabObserverService } from '../../src/services/tab-observer';
import type {
  GroupChangeEventPayload,
  ObservedWindowEvent,
  TabChangeEventPayload,
  VersionedWindowSnapshot,
} from '../../src/types/tab-change-proxy';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
} from '../factories';

type SerializedTabKind =
  | 'text'
  | 'textDiff'
  | 'custom'
  | 'webview'
  | 'notebook'
  | 'notebookDiff'
  | 'terminal'
  | 'unknown';

interface SerializedTab {
  tabRefId: string;
  label: string;
  kind: SerializedTabKind;
  viewColumn: number | null;
  index: number;
  isActive: boolean;
  isDirty: boolean;
  isPinned: boolean;
  isPreview: boolean;
  uri?: string;
  originalUri?: string;
  modifiedUri?: string;
  viewType?: string;
  notebookType?: string;
}

interface SerializedGroupSummary {
  groupRefId: string;
  viewColumn: number;
  isActive: boolean;
  activeTabRefId: string | null;
  tabCount: number;
  tabLabels: string[];
  tabRefIds: string[];
}

interface SerializedSnapshotGroup extends SerializedGroupSummary {
  tabs: SerializedTab[];
}

interface SerializedSnapshot {
  version: number;
  groups: SerializedSnapshotGroup[];
}

interface SerializedObservedEvent {
  seq: number;
  timestamp: number;
  observedAtMs: number;
  type: 'tab' | 'group';
  event:
    | {
        opened: SerializedTab[];
        closed: SerializedTab[];
        changed: SerializedTab[];
        moved?: SerializedTab[];
      }
    | {
        opened: SerializedGroupSummary[];
        closed: SerializedGroupSummary[];
        changed: SerializedGroupSummary[];
      };
  beforeSnapshot: SerializedSnapshot;
  afterSnapshot: SerializedSnapshot;
}

interface SerializedScenario {
  scenario: string;
  replay: {
    observedEvents: SerializedObservedEvent[];
    initialSnapshot: SerializedSnapshot;
    finalSnapshot: SerializedSnapshot;
  };
}

interface AnalyzerScenarioIndex {
  scenarios: Array<{
    scenario: string;
    jsonFile: string;
  }>;
}

interface MaterializedSnapshot {
  snapshot: VersionedWindowSnapshot;
  tabsByRefId: Map<string, Tab>;
  groupsByRefId: Map<string, TabGroup>;
}

export interface RehydratedAnalyzerScenario {
  readonly scenario: string;
  readonly observedEvents: ObservedWindowEvent[];
  readonly initialSnapshot: VersionedWindowSnapshot;
  readonly finalSnapshot: VersionedWindowSnapshot;
}

const DEFAULT_ANALYZER_FIXTURE_DIR = path.resolve(
  __dirname,
  '../fixtures/event-analyzer',
);
const ANALYZER_FIXTURE_DIR = process.env.TAB_STACK_ANALYZER_FIXTURE_DIR
  ? path.resolve(process.env.TAB_STACK_ANALYZER_FIXTURE_DIR)
  : DEFAULT_ANALYZER_FIXTURE_DIR;

let scenarioIndexCache: AnalyzerScenarioIndex | null = null;

export function listAnalyzerScenarioNames(): string[] {
  return getAnalyzerScenarioIndex().scenarios.map((scenario) => scenario.scenario);
}

export function loadAnalyzerScenario(scenarioName: string): RehydratedAnalyzerScenario {
  const scenarioIndex = getAnalyzerScenarioIndex();
  const summary = scenarioIndex.scenarios.find(
    (scenario) => scenario.scenario === scenarioName,
  );

  if (!summary) {
    throw new Error(
      `Analyzer scenario "${scenarioName}" not found in fixture ${ANALYZER_FIXTURE_DIR}`,
    );
  }

  const filePath = path.join(ANALYZER_FIXTURE_DIR, summary.jsonFile);
  const raw = JSON.parse(fs.readFileSync(filePath, 'utf8')) as SerializedScenario;

  return rehydrateAnalyzerScenario(raw);
}

function getAnalyzerScenarioIndex(): AnalyzerScenarioIndex {
  if (scenarioIndexCache) {
    return scenarioIndexCache;
  }

  const indexPath = path.join(ANALYZER_FIXTURE_DIR, 'index.json');

  try {
    scenarioIndexCache = JSON.parse(
      fs.readFileSync(indexPath, 'utf8'),
    ) as AnalyzerScenarioIndex;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Analyzer fixture not found at ${ANALYZER_FIXTURE_DIR}. Run \"npm run analyze:events\" to refresh the test fixture. Original error: ${message}`,
    );
  }

  return scenarioIndexCache;
}

function rehydrateAnalyzerScenario(raw: SerializedScenario): RehydratedAnalyzerScenario {
  const tabCache = new Map<string, Tab>();

  const observedEvents = raw.replay.observedEvents.map((observed) =>
    rehydrateObservedEvent(observed, tabCache),
  );
  const initialSnapshot = materializeSnapshot(raw.replay.initialSnapshot, tabCache).snapshot;
  const finalSnapshot = materializeSnapshot(raw.replay.finalSnapshot, tabCache).snapshot;

  return {
    scenario: raw.scenario,
    observedEvents,
    initialSnapshot,
    finalSnapshot,
  };
}

function rehydrateObservedEvent(
  observed: SerializedObservedEvent,
  tabCache: Map<string, Tab>,
): ObservedWindowEvent {
  const before = materializeSnapshot(observed.beforeSnapshot, tabCache);
  const after = materializeSnapshot(observed.afterSnapshot, tabCache);

  if (observed.type === 'tab') {
    const payload = observed.event as SerializedObservedEvent['event'] & {
      opened: SerializedTab[];
      closed: SerializedTab[];
      changed: SerializedTab[];
      moved?: SerializedTab[];
    };

    const event: TabChangeEventPayload = {
      opened: payload.opened.map((tab) => requireTab(tab.tabRefId, after.tabsByRefId)),
      closed: payload.closed.map((tab) => requireTab(tab.tabRefId, before.tabsByRefId)),
      changed: payload.changed.map((tab) => requireTab(tab.tabRefId, after.tabsByRefId)),
    };

    if (payload.moved?.length) {
      event.moved = payload.moved.map((tab) => requireTab(tab.tabRefId, after.tabsByRefId));
    }

    return {
      type: 'tab',
      observedAtMs: observed.observedAtMs,
      event,
      beforeSnapshot: before.snapshot,
      afterSnapshot: after.snapshot,
    };
  }

  const payload = observed.event as SerializedObservedEvent['event'] & {
    opened: SerializedGroupSummary[];
    closed: SerializedGroupSummary[];
    changed: SerializedGroupSummary[];
  };

  const event: GroupChangeEventPayload = {
    opened: payload.opened.map((group) => requireGroup(group.groupRefId, after.groupsByRefId)),
    closed: payload.closed.map((group) => requireGroup(group.groupRefId, before.groupsByRefId)),
    changed: payload.changed.map((group) => requireGroup(group.groupRefId, after.groupsByRefId)),
  };

  return {
    type: 'group',
    observedAtMs: observed.observedAtMs,
    event,
    beforeSnapshot: before.snapshot,
    afterSnapshot: after.snapshot,
  };
}

function materializeSnapshot(
  serialized: SerializedSnapshot,
  tabCache: Map<string, Tab>,
): MaterializedSnapshot {
  const tabs = new Map<string, ReturnType<typeof TabObserverService.snapshotTab>>();
  const groups = new Map<number, ReturnType<typeof TabObserverService.snapshotGroup>>();
  const tabsByRefId = new Map<string, Tab>();
  const groupsByRefId = new Map<string, TabGroup>();

  for (const serializedGroup of serialized.groups) {
    const groupTabs = serializedGroup.tabs.map((serializedTab) => {
      const tab = getOrCreateTab(serializedTab, tabCache);
      applySerializedTabState(tab, serializedTab);
      tabsByRefId.set(serializedTab.tabRefId, tab);
      return tab;
    });

    const activeTab =
      serializedGroup.activeTabRefId != null
        ? tabsByRefId.get(serializedGroup.activeTabRefId)
        : undefined;

    const group = createVSCodeTabGroup({
      viewColumn: serializedGroup.viewColumn,
      tabs: groupTabs,
      isActive: serializedGroup.isActive,
      activeTab,
    });

    groupsByRefId.set(serializedGroup.groupRefId, group);
    groups.set(group.viewColumn, TabObserverService.snapshotGroup(group));

    serializedGroup.tabs.forEach((serializedTab, index) => {
      const tab = tabsByRefId.get(serializedTab.tabRefId)!;
      applySerializedTabState(tab, serializedTab);
      const entry = TabObserverService.snapshotTab(tab, group.viewColumn, index);
      tabs.set(entry.exactKeyClue, entry);
    });
  }

  return {
    snapshot: {
      tabs,
      groups,
      version: serialized.version,
    },
    tabsByRefId,
    groupsByRefId,
  };
}

function getOrCreateTab(serializedTab: SerializedTab, tabCache: Map<string, Tab>): Tab {
  const existing = tabCache.get(serializedTab.tabRefId);
  if (existing) {
    return existing;
  }

  const created = createVSCodeTab(createTabFactoryOptions(serializedTab));
  tabCache.set(serializedTab.tabRefId, created);
  return created;
}

function applySerializedTabState(tab: Tab, serializedTab: SerializedTab): void {
  const mutableTab = tab as unknown as {
    label: string;
    isActive: boolean;
    isDirty: boolean;
    isPinned: boolean;
    isPreview: boolean;
    input: unknown;
  };
  mutableTab.label = serializedTab.label;
  mutableTab.isActive = serializedTab.isActive;
  mutableTab.isDirty = serializedTab.isDirty;
  mutableTab.isPinned = serializedTab.isPinned;
  mutableTab.isPreview = serializedTab.isPreview;

  if (!mutableTab.input) {
    mutableTab.input = createVSCodeTab(createTabFactoryOptions(serializedTab)).input;
  }
}

function createTabFactoryOptions(serializedTab: SerializedTab) {
  const shared = {
    label: serializedTab.label,
    isActive: serializedTab.isActive,
    isDirty: serializedTab.isDirty,
    isPinned: serializedTab.isPinned,
    isPreview: serializedTab.isPreview,
  };

  switch (serializedTab.kind) {
    case 'text':
      return {
        ...shared,
        kind: 'text' as const,
        filePath: toFsPath(serializedTab.uri) ?? `/workspace/${serializedTab.label}`,
      };
    case 'textDiff':
      return {
        ...shared,
        kind: 'textDiff' as const,
        originalFilePath:
          toFsPath(serializedTab.originalUri) ?? `/workspace/original-${serializedTab.label}`,
        modifiedFilePath:
          toFsPath(serializedTab.modifiedUri) ?? `/workspace/modified-${serializedTab.label}`,
      };
    case 'custom':
      return {
        ...shared,
        kind: 'custom' as const,
        filePath: toFsPath(serializedTab.uri) ?? `/workspace/${serializedTab.label}`,
        viewType: serializedTab.viewType ?? `custom.${serializedTab.tabRefId}`,
      };
    case 'webview':
      return {
        ...shared,
        kind: 'webview' as const,
        viewType: serializedTab.viewType ?? `webview.${serializedTab.tabRefId}`,
      };
    case 'notebook':
      return {
        ...shared,
        kind: 'notebook' as const,
        filePath: toFsPath(serializedTab.uri) ?? `/workspace/${serializedTab.label}`,
        notebookType: serializedTab.notebookType ?? 'jupyter-notebook',
      };
    case 'notebookDiff':
      return {
        ...shared,
        kind: 'notebookDiff' as const,
        originalFilePath:
          toFsPath(serializedTab.originalUri) ?? `/workspace/original-${serializedTab.label}`,
        modifiedFilePath:
          toFsPath(serializedTab.modifiedUri) ?? `/workspace/modified-${serializedTab.label}`,
        notebookType: serializedTab.notebookType ?? 'jupyter-notebook',
      };
    case 'terminal':
      return {
        ...shared,
        kind: 'terminal' as const,
      };
    default:
      return {
        ...shared,
        kind: 'unknown' as const,
      };
  }
}

function toFsPath(value?: string): string | undefined {
  if (!value) {
    return undefined;
  }

  if (!value.startsWith('file://')) {
    return value;
  }

  return fileURLToPath(value);
}

function requireTab(tabRefId: string, tabsByRefId: Map<string, Tab>): Tab {
  const tab = tabsByRefId.get(tabRefId);
  if (!tab) {
    throw new Error(`Tab ref ${tabRefId} missing from materialized snapshot`);
  }

  return tab;
}

function requireGroup(
  groupRefId: string,
  groupsByRefId: Map<string, TabGroup>,
): TabGroup {
  const group = groupsByRefId.get(groupRefId);
  if (!group) {
    throw new Error(`Group ref ${groupRefId} missing from materialized snapshot`);
  }

  return group;
}
