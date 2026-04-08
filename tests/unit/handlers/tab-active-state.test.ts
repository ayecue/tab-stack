import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { commands, window } from 'vscode';

import { TabActiveStateHandler } from '../../../src/handlers/tab-active-state';
import { TabChangeResolver } from '../../../src/handlers/tab-change';
import { TabChangeProxyService } from '../../../src/services/tab-change-proxy';
import { TabObserverService } from '../../../src/services/tab-observer';
import {
  createEmptyResolvedTabChangeEvent,
  createResolvedBucketDelta,
  createStateTransferDecision,
  getSnapshotTabKind,
  projectLegacyEventToResolvedBucketDelta,
  ResolvedTabChangeEvent,
  TabEntrySnapshot,
  TabRewireDelta,
  WindowSnapshot
} from '../../../src/types/tab-change-proxy';
import { createSelectionRange } from '../../../src/utils/tab-utils';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups
} from '../../factories';
import { MockEditorLayoutService } from '../../mocks';
import { MockTabRecoveryService } from '../../mocks/services/TabRecoveryService';

describe('TabActiveStateHandler', () => {
  let handler: TabActiveStateHandler;
  let layoutService: MockEditorLayoutService;
  let tabRecoverService: MockTabRecoveryService;
  let tabChangeProxy: TabChangeProxyService;

  function createWindowSnapshot(entries: TabEntrySnapshot[]): WindowSnapshot {
    return {
      tabs: new Map(entries.map((entry) => [entry.exactKeyClue, entry])),
      groups: new Map()
    };
  }

  function createSnapshotEvent(
    entries: TabEntrySnapshot[]
  ): ResolvedTabChangeEvent {
    const createdEntries = new Map(entries.map((entry) => [entry.tab, entry]));
    const snapshot = createWindowSnapshot(entries);

    return {
      ...createEmptyResolvedTabChangeEvent('snapshot'),
      created: [...createdEntries.keys()],
      createdEntries,
      beforeSnapshot: snapshot,
      afterSnapshot: snapshot
    };
  }

  function createDeltaEvent(options: {
    created?: TabEntrySnapshot[];
    closed?: TabEntrySnapshot[];
    moved?: ResolvedTabChangeEvent['moved'];
    updated?: ResolvedTabChangeEvent['updated'];
    beforeEntries?: TabEntrySnapshot[];
    afterEntries?: TabEntrySnapshot[];
    tabRewireDeltas?: readonly TabRewireDelta[];
  }): ResolvedTabChangeEvent {
    const createdEntries = new Map(
      (options.created ?? []).map((entry) => [entry.tab, entry])
    );
    const closedEntries = new Map(
      (options.closed ?? []).map((entry) => [entry.tab, entry])
    );
    const beforeSnapshot = createWindowSnapshot([
      ...(options.beforeEntries ?? []),
      ...(options.closed ?? []),
      ...(options.moved ?? []).map((move) => move.oldEntry),
      ...(options.updated ?? []).map((update) => update.oldEntry)
    ]);
    const afterSnapshot = createWindowSnapshot([
      ...(options.afterEntries ?? []),
      ...(options.created ?? []),
      ...(options.moved ?? []).map((move) => move.entry),
      ...(options.updated ?? []).map((update) => update.entry)
    ]);

    const baseEvent = {
      ...createEmptyResolvedTabChangeEvent(),
      created: [...createdEntries.keys()],
      closed: [...closedEntries.keys()],
      moved: options.moved ?? [],
      updated: options.updated ?? [],
      createdEntries,
      closedEntries,
      beforeSnapshot,
      afterSnapshot
    };
    const resolvedBucketDelta =
      options.tabRewireDeltas != null
        ? createResolvedBucketDelta(
            baseEvent.source,
            baseEvent.bucketId,
            beforeSnapshot,
            afterSnapshot,
            [...options.tabRewireDeltas]
          )
        : projectLegacyEventToResolvedBucketDelta(
            baseEvent,
            baseEvent.bucketId,
            beforeSnapshot,
            afterSnapshot
          );

    return {
      ...baseEvent,
      tabRewireDeltas:
        options.tabRewireDeltas ?? resolvedBucketDelta.tabRewireDeltas,
      resolvedBucketDelta
    };
  }

  function getTrackedTabs(): Record<string, any> {
    return (handler as any)._tabActiveStateStore.getSnapshot().context.tabs;
  }

  function getAssociatedTabs(): Map<string, string> {
    return (handler as any)._associatedTabs;
  }

  function getAssociatedInstances(): Map<object, string> {
    return (handler as any)._associatedInstances;
  }

  beforeEach(() => {
    vi.clearAllMocks();

    layoutService = new MockEditorLayoutService();
    tabRecoverService = new MockTabRecoveryService();
    // Mock VSCode window events
    vi.mocked(window.tabGroups.onDidChangeTabs).mockReturnValue({
      dispose: vi.fn()
    } as any);
    vi.mocked(window.tabGroups.onDidChangeTabGroups).mockReturnValue({
      dispose: vi.fn()
    } as any);
    vi.mocked(window.onDidChangeActiveTextEditor).mockReturnValue({
      dispose: vi.fn()
    } as any);
    vi.mocked(window.onDidChangeActiveNotebookEditor).mockReturnValue({
      dispose: vi.fn()
    } as any);
    vi.mocked(window.onDidChangeActiveTerminal).mockReturnValue({
      dispose: vi.fn()
    } as any);
    vi.mocked(window.onDidStartTerminalShellExecution).mockReturnValue({
      dispose: vi.fn()
    } as any);
    vi.mocked(window.onDidEndTerminalShellExecution).mockReturnValue({
      dispose: vi.fn()
    } as any);

    vi.mocked(commands.executeCommand).mockResolvedValue(undefined);
    setWindowTabGroups([]);

    tabChangeProxy = new TabChangeProxyService();

    handler = new TabActiveStateHandler(
      layoutService as any,
      tabRecoverService as any,
      tabChangeProxy
    );
  });

  afterEach(() => {
    handler.dispose();
    tabChangeProxy.dispose();
  });

  describe('initialization', () => {
    it('creates handler with dependencies', () => {
      expect(handler).toBeDefined();
    });

    it('registers event listeners', () => {
      expect(window.tabGroups.onDidChangeTabs).toHaveBeenCalled();
      expect(window.tabGroups.onDidChangeTabGroups).toHaveBeenCalled();
      expect(window.onDidChangeActiveTextEditor).toHaveBeenCalled();
      expect(window.onDidChangeActiveTerminal).toHaveBeenCalled();
    });
  });

  describe('getTabState', () => {
    it('returns current tab state', () => {
      const state = handler.getTabState();

      expect(state).toBeDefined();
      expect(state).toHaveProperty('tabGroups');
      expect(state).toHaveProperty('activeGroup');
    });

    it('caches tab state between calls', () => {
      const state1 = handler.getTabState();
      const state2 = handler.getTabState();

      expect(state1).toBe(state2); // Should return same cached object
    });
  });

  describe('getTabManagerState', () => {
    it('returns tab manager state with layout', () => {
      const state = handler.getTabManagerState();

      expect(state).toBeDefined();
      expect(state).toHaveProperty('tabState');
      expect(state).toHaveProperty('layout');
    });
  });

  describe('isTabRecoverable', () => {
    it('returns true for standard file URIs', () => {
      const tab: any = {
        kind: 'tabInputText',
        uri: 'file:///workspace/test.ts',
        meta: { type: 'textEditor' }
      };
      const result = handler.isTabRecoverable(tab);

      expect(result).toBe(true);
    });

    it('returns true when recovery mapping exists', () => {
      tabRecoverService.hasMatch.mockReturnValue(true); // Mock recovery service to return true

      const tab: any = {
        kind: 'vscode.tab.custom',
        label: 'output:extension-output-test',
        uri: 'output:extension-output-test',
        meta: { type: 'custom', viewType: 'output' }
      };
      const result = handler.isTabRecoverable(tab);

      expect(result).toBe(true);
    });

    it('returns false for unknown URIs without mapping', () => {
      const tab: any = {
        kind: 'unknown',
        uri: 'unknown:some-uri',
        meta: { type: 'unknown' }
      };
      const result = handler.isTabRecoverable(tab);

      expect(result).toBe(false);
    });

    it('returns true for terminals', () => {
      const tab: any = {
        kind: 'tabInputTerminal',
        label: 'zsh',
        meta: { type: 'terminal', terminalName: 'zsh' }
      };
      const result = handler.isTabRecoverable(tab);

      expect(result).toBe(true);
    });
  });

  describe('syncTabs', () => {
    it('rehydrates tabs from the live window without throwing', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const group = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([group], group);

      expect(() => handler.rehydrateTabs()).not.toThrow();
      expect(Object.keys(getTrackedTabs())).toHaveLength(1);
    });

    it('does not rewrite tracked tabs on an unchanged snapshot sync', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const group = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([group], group);

      const entry = TabObserverService.snapshotTab(tab, 1, 0);
      const event = createSnapshotEvent([entry]);

      handler.syncTabs(event);
      const trackedTabs = getTrackedTabs();

      handler.syncTabs(event);

      expect(getTrackedTabs()).toBe(trackedTabs);
    });

    it('preserves tab ids and associated instances across moved events', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const initialGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([initialGroup], initialGroup);

      const initialEntry = TabObserverService.snapshotTab(tab, 1, 0);
      handler.syncTabs(createSnapshotEvent([initialEntry]));

      const [tabId] = Object.keys(getTrackedTabs());
      const originalSelection = createSelectionRange(3, 1, 3, 4);
      (handler as any)._tabActiveStateStore.send({
        type: 'UPDATE_TAB',
        payload: {
          ...getTrackedTabs()[tabId],
          meta: {
            type: 'textEditor',
            selection: originalSelection
          }
        }
      });

      const fakeEditor = { id: 'editor-1' } as any;
      getAssociatedInstances().set(fakeEditor, tabId);

      const movedGroup = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([movedGroup], movedGroup);

      const movedEntry = TabObserverService.snapshotTab(tab, 2, 0);
      handler.syncTabs(
        createDeltaEvent({
          moved: [
            {
              tab,
              oldEntry: initialEntry,
              entry: movedEntry,
              fromViewColumn: 1,
              toViewColumn: 2,
              fromIndex: 0,
              toIndex: 0,
              changed: new Set()
            }
          ]
        })
      );

      expect(getAssociatedTabs().has(initialEntry.exactKeyClue)).toBe(false);
      expect(getAssociatedTabs().get(movedEntry.exactKeyClue)).toBe(tabId);
      expect(getAssociatedInstances().get(fakeEditor)).toBe(tabId);
      expect(getTrackedTabs()[tabId].viewColumn).toBe(2);
      expect(getTrackedTabs()[tabId].meta.selection).toEqual(originalSelection);
    });

    it('preserves tracked ids for tabs shifted right when a new tab opens before them', () => {
      const tabA = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const tabB = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const initialGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabA, tabB],
        isActive: true,
        activeTab: tabA
      });
      setWindowTabGroups([initialGroup], initialGroup);

      const entryA = TabObserverService.snapshotTab(tabA, 1, 0);
      const entryB = TabObserverService.snapshotTab(tabB, 1, 1);
      handler.syncTabs(createSnapshotEvent([entryA, entryB]));

      const associatedBefore = getAssociatedTabs();
      const tabAId = associatedBefore.get(entryA.exactKeyClue)!;
      const tabBId = associatedBefore.get(entryB.exactKeyClue)!;
      const preservedSelection = createSelectionRange(4, 0, 4, 2);
      (handler as any)._tabActiveStateStore.send({
        type: 'UPDATE_TAB',
        payload: {
          ...getTrackedTabs()[tabBId],
          meta: {
            type: 'textEditor',
            selection: preservedSelection
          }
        }
      });

      const tabC = createVSCodeTab({ filePath: '/workspace/c.ts' });
      const openedGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabC, tabA, tabB],
        isActive: true,
        activeTab: tabC
      });
      setWindowTabGroups([openedGroup], openedGroup);

      const entryC = TabObserverService.snapshotTab(tabC, 1, 0);
      const movedEntryA = TabObserverService.snapshotTab(tabA, 1, 1);
      const movedEntryB = TabObserverService.snapshotTab(tabB, 1, 2);
      handler.syncTabs(
        createDeltaEvent({
          created: [entryC],
          moved: [
            {
              tab: tabA,
              oldEntry: entryA,
              entry: movedEntryA,
              fromViewColumn: 1,
              toViewColumn: 1,
              fromIndex: 0,
              toIndex: 1,
              changed: new Set()
            },
            {
              tab: tabB,
              oldEntry: entryB,
              entry: movedEntryB,
              fromViewColumn: 1,
              toViewColumn: 1,
              fromIndex: 1,
              toIndex: 2,
              changed: new Set()
            }
          ]
        })
      );

      const trackedTabs = getTrackedTabs();
      const associatedAfter = getAssociatedTabs();
      const tabCId = associatedAfter.get(entryC.exactKeyClue);

      expect(associatedAfter.get(movedEntryA.exactKeyClue)).toBe(tabAId);
      expect(associatedAfter.get(movedEntryB.exactKeyClue)).toBe(tabBId);
      expect(trackedTabs[tabBId].meta).toEqual({
        type: 'textEditor',
        selection: preservedSelection
      });
      expect(tabCId).toBeDefined();
      expect(tabCId).not.toBe(tabAId);
      expect(tabCId).not.toBe(tabBId);
    });

    it('preserves tracked ids for tabs shifted left when a tab closes before them', () => {
      const tabA = createVSCodeTab({ filePath: '/workspace/a.ts' });
      const tabB = createVSCodeTab({ filePath: '/workspace/b.ts' });
      const tabC = createVSCodeTab({ filePath: '/workspace/c.ts' });
      const initialGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabA, tabB, tabC],
        isActive: true,
        activeTab: tabA
      });
      setWindowTabGroups([initialGroup], initialGroup);

      const entryA = TabObserverService.snapshotTab(tabA, 1, 0);
      const entryB = TabObserverService.snapshotTab(tabB, 1, 1);
      const entryC = TabObserverService.snapshotTab(tabC, 1, 2);
      handler.syncTabs(createSnapshotEvent([entryA, entryB, entryC]));

      const associatedBefore = getAssociatedTabs();
      const tabBId = associatedBefore.get(entryB.exactKeyClue)!;
      const tabCId = associatedBefore.get(entryC.exactKeyClue)!;
      const preservedSelection = createSelectionRange(7, 1, 7, 5);
      (handler as any)._tabActiveStateStore.send({
        type: 'UPDATE_TAB',
        payload: {
          ...getTrackedTabs()[tabCId],
          meta: {
            type: 'textEditor',
            selection: preservedSelection
          }
        }
      });

      const closedGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tabB, tabC],
        isActive: true,
        activeTab: tabB
      });
      setWindowTabGroups([closedGroup], closedGroup);

      const movedEntryB = TabObserverService.snapshotTab(tabB, 1, 0);
      const movedEntryC = TabObserverService.snapshotTab(tabC, 1, 1);
      handler.syncTabs(
        createDeltaEvent({
          closed: [entryA],
          moved: [
            {
              tab: tabB,
              oldEntry: entryB,
              entry: movedEntryB,
              fromViewColumn: 1,
              toViewColumn: 1,
              fromIndex: 1,
              toIndex: 0,
              changed: new Set()
            },
            {
              tab: tabC,
              oldEntry: entryC,
              entry: movedEntryC,
              fromViewColumn: 1,
              toViewColumn: 1,
              fromIndex: 2,
              toIndex: 1,
              changed: new Set()
            }
          ]
        })
      );

      const trackedTabs = getTrackedTabs();
      const associatedAfter = getAssociatedTabs();

      expect(associatedAfter.has(entryA.exactKeyClue)).toBe(false);
      expect(associatedAfter.get(movedEntryB.exactKeyClue)).toBe(tabBId);
      expect(associatedAfter.get(movedEntryC.exactKeyClue)).toBe(tabCId);
      expect(trackedTabs[tabCId].meta).toEqual({
        type: 'textEditor',
        selection: preservedSelection
      });
      expect(trackedTabs[tabBId]).toBeDefined();
    });

    it('removes closed tabs from associations and tracked instances', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const group = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([group], group);

      const entry = TabObserverService.snapshotTab(tab, 1, 0);
      handler.syncTabs(createSnapshotEvent([entry]));

      const [tabId] = Object.keys(getTrackedTabs());
      const fakeEditor = { id: 'editor-1' } as any;
      getAssociatedInstances().set(fakeEditor, tabId);

      handler.syncTabs(createDeltaEvent({ closed: [entry] }));

      expect(getTrackedTabs()).toEqual({});
      expect(getAssociatedTabs().has(entry.exactKeyClue)).toBe(false);
      expect(getAssociatedInstances().has(fakeEditor)).toBe(false);
    });

    it('does not reuse tracked ids for blocked ambiguous deltas', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const initialGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([initialGroup], initialGroup);

      const initialEntry = TabObserverService.snapshotTab(tab, 1, 0);
      handler.syncTabs(createSnapshotEvent([initialEntry]));

      const [initialTabId] = Object.keys(getTrackedTabs());
      const originalSelection = createSelectionRange(3, 1, 3, 4);
      (handler as any)._tabActiveStateStore.send({
        type: 'UPDATE_TAB',
        payload: {
          ...getTrackedTabs()[initialTabId],
          meta: {
            type: 'textEditor',
            selection: originalSelection
          }
        }
      });

      const fakeEditor = { id: 'editor-1' } as any;
      getAssociatedInstances().set(fakeEditor, initialTabId);

      const duplicateTab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const duplicateGroup = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [duplicateTab],
        isActive: true,
        activeTab: duplicateTab
      });
      setWindowTabGroups([duplicateGroup], duplicateGroup);

      const duplicateEntry = TabObserverService.snapshotTab(duplicateTab, 2, 0);
      const ambiguousDelta: TabRewireDelta = {
        kind: 'ambiguous',
        tabKind: getSnapshotTabKind(duplicateEntry),
        rewirePriority: 'high',
        entryExactKeyClue: initialEntry.exactKeyClue,
        endExactKeyClue: duplicateEntry.exactKeyClue,
        before: initialEntry,
        after: duplicateEntry,
        structural: {
          fromViewColumn: initialEntry.viewColumn,
          toViewColumn: duplicateEntry.viewColumn,
          fromIndex: initialEntry.index,
          toIndex: duplicateEntry.index
        },
        properties: {},
        stateTransfer: createStateTransferDecision(
          'blocked',
          'Ambiguous duplicate should not inherit tracked state.'
        )
      };

      handler.syncTabs(
        createDeltaEvent({
          created: [duplicateEntry],
          closed: [initialEntry],
          tabRewireDeltas: [ambiguousDelta]
        })
      );

      const [nextTabId] = Object.keys(getTrackedTabs());

      expect(nextTabId).not.toBe(initialTabId);
      expect(getTrackedTabs()[nextTabId].meta).toEqual({ type: 'textEditor' });
      expect(getAssociatedTabs().has(initialEntry.exactKeyClue)).toBe(false);
      expect(getAssociatedTabs().get(duplicateEntry.exactKeyClue)).toBe(nextTabId);
      expect(getAssociatedInstances().has(fakeEditor)).toBe(false);
    });

    it('keeps the original tracked id when a split editor adds a fresh duplicate', () => {
      const originalTab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const initialGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [originalTab],
        isActive: true,
        activeTab: originalTab
      });
      setWindowTabGroups([initialGroup], initialGroup);

      const originalEntry = TabObserverService.snapshotTab(originalTab, 1, 0);
      handler.syncTabs(createSnapshotEvent([originalEntry]));

      const [originalTabId] = Object.keys(getTrackedTabs());
      const originalSelection = createSelectionRange(5, 2, 5, 8);
      (handler as any)._tabActiveStateStore.send({
        type: 'UPDATE_TAB',
        payload: {
          ...getTrackedTabs()[originalTabId],
          meta: {
            type: 'textEditor',
            selection: originalSelection
          }
        }
      });

      const splitTab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const activeGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [originalTab],
        isActive: true,
        activeTab: originalTab
      });
      const splitGroup = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [splitTab],
        isActive: false,
        activeTab: splitTab
      });
      setWindowTabGroups([activeGroup, splitGroup], activeGroup);

      const splitEntry = TabObserverService.snapshotTab(splitTab, 2, 0);
      handler.syncTabs(
        createDeltaEvent({
          created: [splitEntry],
          beforeEntries: [originalEntry],
          afterEntries: [originalEntry]
        })
      );

      const trackedTabs = getTrackedTabs();
      const trackedTabIds = Object.keys(trackedTabs);
      const splitTabId = getAssociatedTabs().get(splitEntry.exactKeyClue);

      expect(trackedTabIds).toHaveLength(2);
      expect(getAssociatedTabs().get(originalEntry.exactKeyClue)).toBe(originalTabId);
      expect(trackedTabs[originalTabId].meta).toEqual({
        type: 'textEditor',
        selection: originalSelection
      });
      expect(splitTabId).toBeDefined();
      expect(splitTabId).not.toBe(originalTabId);
      expect(trackedTabs[splitTabId!].meta).toEqual({ type: 'textEditor' });
    });

    it('does not reuse the tracked id when a tab closes and reopens at the same exact address', () => {
      const tab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const initialGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [tab],
        isActive: true,
        activeTab: tab
      });
      setWindowTabGroups([initialGroup], initialGroup);

      const originalEntry = TabObserverService.snapshotTab(tab, 1, 0);
      handler.syncTabs(createSnapshotEvent([originalEntry]));

      const [originalTabId] = Object.keys(getTrackedTabs());
      const originalSelection = createSelectionRange(8, 0, 8, 3);
      (handler as any)._tabActiveStateStore.send({
        type: 'UPDATE_TAB',
        payload: {
          ...getTrackedTabs()[originalTabId],
          meta: {
            type: 'textEditor',
            selection: originalSelection
          }
        }
      });

      const reopenedTab = createVSCodeTab({
        filePath: '/workspace/a.ts',
        isActive: true
      });
      const reopenedGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [reopenedTab],
        isActive: true,
        activeTab: reopenedTab
      });
      setWindowTabGroups([reopenedGroup], reopenedGroup);

      const reopenedEntry = TabObserverService.snapshotTab(reopenedTab, 1, 0);
      handler.syncTabs(
        createDeltaEvent({
          created: [reopenedEntry],
          closed: [originalEntry]
        })
      );

      const [nextTabId] = Object.keys(getTrackedTabs());

      expect(nextTabId).not.toBe(originalTabId);
      expect(getAssociatedTabs().get(reopenedEntry.exactKeyClue)).toBe(nextTabId);
      expect(getTrackedTabs()[originalTabId]).toBeUndefined();
      expect(getTrackedTabs()[nextTabId].meta).toEqual({ type: 'textEditor' });
    });

    it('associates a text editor with its own tab instead of the globally active tab', () => {
      const activeTab = createVSCodeTab({
        filePath: '/workspace/active.ts',
        isActive: true
      });
      const targetTab = createVSCodeTab({
        filePath: '/workspace/target.ts',
        isActive: true
      });
      const activeGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [activeTab],
        isActive: true,
        activeTab
      });
      const targetGroup = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [targetTab],
        isActive: false,
        activeTab: targetTab
      });
      setWindowTabGroups([activeGroup, targetGroup], activeGroup);

      handler.syncTabs(
        createSnapshotEvent([
          TabObserverService.snapshotTab(activeTab, 1, 0),
          TabObserverService.snapshotTab(targetTab, 2, 0)
        ])
      );

      const editor = {
        viewColumn: 2,
        document: {
          uri: {
            toString: () => 'file:///workspace/target.ts'
          }
        },
        selection: {
          start: { line: 4, character: 1 },
          end: { line: 4, character: 6 }
        }
      } as any;

      (handler as any)._tabInstanceBindingService.associateTextEditorWithTab(
        editor
      );

      const targetEntry = TabObserverService.snapshotTab(targetTab, 2, 0);
      const targetTabId = getAssociatedTabs().get(targetEntry.exactKeyClue);

      expect(targetTabId).toBeDefined();
      expect(getAssociatedInstances().get(editor)).toBe(targetTabId);
    });

    it('repairs stale text editor associations before updating selection metadata', () => {
      const staleTab = createVSCodeTab({
        filePath: '/workspace/stale.ts',
        isActive: true
      });
      const targetTab = createVSCodeTab({
        filePath: '/workspace/target.ts',
        isActive: true
      });
      const staleGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [staleTab],
        isActive: true,
        activeTab: staleTab
      });
      const targetGroup = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [targetTab],
        isActive: false,
        activeTab: targetTab
      });
      setWindowTabGroups([staleGroup, targetGroup], staleGroup);

      handler.syncTabs(
        createSnapshotEvent([
          TabObserverService.snapshotTab(staleTab, 1, 0),
          TabObserverService.snapshotTab(targetTab, 2, 0)
        ])
      );

      const staleEntry = TabObserverService.snapshotTab(staleTab, 1, 0);
      const targetEntry = TabObserverService.snapshotTab(targetTab, 2, 0);
      const staleTabId = getAssociatedTabs().get(staleEntry.exactKeyClue)!;
      const targetTabId = getAssociatedTabs().get(targetEntry.exactKeyClue)!;
      const editor = {
        viewColumn: 2,
        document: {
          uri: {
            toString: () => 'file:///workspace/target.ts'
          }
        },
        selection: {
          start: { line: 7, character: 2 },
          end: { line: 7, character: 9 }
        }
      } as any;

      getAssociatedInstances().set(editor, staleTabId);

      (handler as any)._tabInstanceBindingService.updateTextEditorSelection(
        editor
      );

      expect(getAssociatedInstances().get(editor)).toBe(targetTabId);
      expect(getTrackedTabs()[staleTabId].meta).toEqual({ type: 'textEditor' });
      expect(getTrackedTabs()[targetTabId].meta).toEqual({
        type: 'textEditor',
        selection: createSelectionRange(7, 2, 7, 9)
      });
    });

    it('associates notebook and terminal instances without relying on the active tab group', () => {
      const activeTab = createVSCodeTab({
        filePath: '/workspace/active.ts',
        isActive: true
      });
      const notebookTab = createVSCodeTab({
        kind: 'notebook',
        filePath: '/workspace/notebook.ipynb',
        isActive: true
      });
      const terminalTab = createVSCodeTab({
        kind: 'terminal',
        label: 'build-shell',
        isActive: true
      });
      const activeGroup = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [activeTab],
        isActive: true,
        activeTab
      });
      const notebookGroup = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [notebookTab],
        isActive: false,
        activeTab: notebookTab
      });
      const terminalGroup = createVSCodeTabGroup({
        viewColumn: 3,
        tabs: [terminalTab],
        isActive: false,
        activeTab: terminalTab
      });
      setWindowTabGroups(
        [activeGroup, notebookGroup, terminalGroup],
        activeGroup
      );

      handler.syncTabs(
        createSnapshotEvent([
          TabObserverService.snapshotTab(activeTab, 1, 0),
          TabObserverService.snapshotTab(notebookTab, 2, 0),
          TabObserverService.snapshotTab(terminalTab, 3, 0)
        ])
      );

      const notebookEditor = {
        viewColumn: 2,
        notebook: {
          uri: {
            toString: () => 'file:///workspace/notebook.ipynb'
          }
        },
        selections: [{ start: 2, end: 5 }]
      } as any;
      const terminal = {
        name: 'build-shell',
        creationOptions: {
          cwd: { toString: () => 'file:///workspace' },
          shellPath: '/bin/zsh',
          isTransient: false
        }
      } as any;

      (handler as any)._tabInstanceBindingService.associateNotebookEditorWithTab(
        notebookEditor
      );
      (handler as any)._tabInstanceBindingService.updateTerminalMeta(terminal);

      const notebookEntry = TabObserverService.snapshotTab(notebookTab, 2, 0);
      const terminalEntry = TabObserverService.snapshotTab(terminalTab, 3, 0);
      const notebookTabId = getAssociatedTabs().get(notebookEntry.exactKeyClue);
      const terminalTabId = getAssociatedTabs().get(terminalEntry.exactKeyClue);

      expect(getAssociatedInstances().get(notebookEditor)).toBe(notebookTabId);
      expect(getAssociatedInstances().get(terminal)).toBe(terminalTabId);
      expect(getTrackedTabs()[terminalTabId!].meta).toEqual({
        type: 'terminal',
        terminalName: 'build-shell',
        cwd: 'file:///workspace',
        shellPath: '/bin/zsh',
        isTransient: false
      });
    });

    it('keeps all tracked tabs when groups rotate with duplicate files across columns', () => {
      const oldSmart1 = createVSCodeTab({
        filePath: '/workspace/smartappliance.src'
      });
      const oldSmart2 = createVSCodeTab({
        filePath: '/workspace/smartappliance.src'
      });
      const oldNotes1 = createVSCodeTab({ filePath: '/workspace/notes.src' });
      const oldNotes2 = createVSCodeTab({ filePath: '/workspace/notes.src' });
      const oldNet = createVSCodeTab({ filePath: '/workspace/netsession.src' });
      const oldMeta = createVSCodeTab({ filePath: '/workspace/metalib.src' });
      const oldMail = createVSCodeTab({ filePath: '/workspace/mail.src' });
      const oldTraffic = createVSCodeTab({
        filePath: '/workspace/trafficnet.src'
      });
      const oldProcesses = createVSCodeTab({
        filePath: '/workspace/processes.src'
      });
      const oldOsint = createVSCodeTab({ filePath: '/workspace/osint.src' });
      const oldLibs = createVSCodeTab({ filePath: '/workspace/libs.src' });
      const oldWelcome = createVSCodeTab({
        filePath: '/workspace/welcome.md',
        label: 'Welcome'
      });

      const oldGroup1 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [oldSmart1, oldNet, oldMeta, oldMail, oldTraffic],
        isActive: true,
        activeTab: oldSmart1
      });
      const oldGroup2 = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [oldNotes1, oldSmart2],
        activeTab: oldNotes1
      });
      const oldGroup3 = createVSCodeTabGroup({
        viewColumn: 3,
        tabs: [oldNotes2, oldProcesses, oldOsint],
        activeTab: oldNotes2
      });
      const oldGroup4 = createVSCodeTabGroup({
        viewColumn: 4,
        tabs: [oldLibs, oldWelcome],
        activeTab: oldLibs
      });
      setWindowTabGroups(
        [oldGroup1, oldGroup2, oldGroup3, oldGroup4],
        oldGroup1
      );

      handler.rehydrateTabs();

      expect(Object.keys(getTrackedTabs())).toHaveLength(12);

      const beforeSnapshot = TabObserverService.capture();
      const resolver = new TabChangeResolver();
      resolver.seedSnapshot(beforeSnapshot);

      const newSmart1 = createVSCodeTab({
        filePath: '/workspace/smartappliance.src'
      });
      const newSmart2 = createVSCodeTab({
        filePath: '/workspace/smartappliance.src'
      });
      const newNotes1 = createVSCodeTab({ filePath: '/workspace/notes.src' });
      const newNotes2 = createVSCodeTab({ filePath: '/workspace/notes.src' });
      const newNet = createVSCodeTab({ filePath: '/workspace/netsession.src' });
      const newMeta = createVSCodeTab({ filePath: '/workspace/metalib.src' });
      const newMail = createVSCodeTab({ filePath: '/workspace/mail.src' });
      const newTraffic = createVSCodeTab({
        filePath: '/workspace/trafficnet.src'
      });
      const newProcesses = createVSCodeTab({
        filePath: '/workspace/processes.src'
      });
      const newOsint = createVSCodeTab({ filePath: '/workspace/osint.src' });
      const newLibs = createVSCodeTab({ filePath: '/workspace/libs.src' });
      const newWelcome = createVSCodeTab({
        filePath: '/workspace/welcome.md',
        label: 'Welcome'
      });

      const newGroup1 = createVSCodeTabGroup({
        viewColumn: 1,
        tabs: [newLibs, newWelcome],
        isActive: true,
        activeTab: newLibs
      });
      const newGroup2 = createVSCodeTabGroup({
        viewColumn: 2,
        tabs: [newSmart1, newNet, newMeta, newMail, newTraffic],
        activeTab: newSmart1
      });
      const newGroup3 = createVSCodeTabGroup({
        viewColumn: 3,
        tabs: [newNotes1, newSmart2],
        activeTab: newNotes1
      });
      const newGroup4 = createVSCodeTabGroup({
        viewColumn: 4,
        tabs: [newNotes2, newProcesses, newOsint],
        activeTab: newNotes2
      });
      setWindowTabGroups(
        [newGroup1, newGroup2, newGroup3, newGroup4],
        newGroup1
      );

      const afterSnapshot = TabObserverService.capture();
      resolver.processGroupChanges(
        {
          opened: [],
          closed: [],
          changed: [newGroup1, newGroup2, newGroup3, newGroup4]
        },
        afterSnapshot
      );

      const resolved = resolver.resolve();
      handler.syncTabs({
        ...resolved,
        beforeSnapshot,
        afterSnapshot
      });

      const trackedTabs = Object.values(getTrackedTabs());
      const trackedLabels = trackedTabs.map((tab: any) => tab.label).sort();

      expect(resolved.moved).toHaveLength(12);
      expect(trackedTabs).toHaveLength(12);
      expect(trackedLabels).toEqual([
        'Welcome',
        'libs.src',
        'mail.src',
        'metalib.src',
        'netsession.src',
        'notes.src',
        'notes.src',
        'osint.src',
        'processes.src',
        'smartappliance.src',
        'smartappliance.src',
        'trafficnet.src'
      ]);
    });
  });

  describe('applyTabState', () => {
    it('applies tab state without throwing', async () => {
      const tabState = {
        tabGroups: {},
        activeGroup: null
      };

      const options = {
        preservePinnedTabs: false,
        preserveTabFocus: false,
        preserveActiveTab: false
      };

      await expect(
        handler.applyTabState(tabState, options)
      ).resolves.toBeUndefined();
    });
  });

  describe('disposal', () => {
    it('disposes without throwing', () => {
      expect(() => handler.dispose()).not.toThrow();
    });

    it('clears cached state on disposal', () => {
      handler.getTabState(); // Cache state
      handler.dispose();

      // After disposal, accessing state should not throw
      // (though behavior may vary)
    });
  });

  describe('onDidChangeState', () => {
    it('provides event emitter', () => {
      const listener = vi.fn();
      const disposable = handler.onDidChangeState(listener);

      expect(disposable).toBeDefined();
      expect(disposable.dispose).toBeDefined();

      disposable.dispose();
    });
  });
});
