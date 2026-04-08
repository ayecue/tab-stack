import {
  commands,
  Disposable,
  Tab,
  TabGroup,
  Uri,
  window,
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview,
  LogOutputChannel,
} from 'vscode';

import { ViewManagerProvider } from './providers/view-manager';
import { EXTENSION_NAME } from './types/extension';
import {
  ExtensionCollectionsSyncMessage,
  ExtensionNotificationMessage
} from './types/messages';
import { TabManagerService } from './services/tab-manager';
import { getLogger } from './services/logger';

type CapturedSync = Omit<ExtensionCollectionsSyncMessage, 'type'>;
type CapturedNotify = Omit<ExtensionNotificationMessage, 'type'>;

type RuntimeProcess = {
  env?: Record<string, string | undefined>;
};

const runtimeProcess = globalThis as typeof globalThis & {
  process?: RuntimeProcess;
};

function getTabInputKind(input: unknown): string {
  if (input instanceof TabInputText) return 'TabInputText';
  if (input instanceof TabInputTextDiff) return 'TabInputTextDiff';
  if (input instanceof TabInputCustom) return 'TabInputCustom';
  if (input instanceof TabInputWebview) return 'TabInputWebview';
  if (input instanceof TabInputNotebook) return 'TabInputNotebook';
  if (input instanceof TabInputNotebookDiff) return 'TabInputNotebookDiff';
  if (input instanceof TabInputTerminal) return 'TabInputTerminal';
  return 'unknown';
}

class LoggerInterceptor {
  private _channel: LogOutputChannel;
  private _logMessages: { level: number, message: string; args: unknown[] }[] = [];

  constructor() {
    // @ts-expect-error - accessing private member for testing purposes
    const channel = getLogger()._channel;
    this._channel = channel;
    this.attach();
  }

  private attach() {
    const originalInfo = this._channel.info;
    const originalDebug = this._channel.debug;
    const originalWarn = this._channel.warn;
    const originalError = this._channel.error;

    this._channel.info = (message: string, ...args: unknown[]) => {
      this._logMessages.push({
        level: 2,
        message,
        args
      });
      return originalInfo.call(this._channel, message, ...args);
    };

    this._channel.debug = (message: string, ...args: unknown[]) => {
      this._logMessages.push({
        level: 1,
        message,
        args
      });
      return originalDebug.call(this._channel, message, ...args);
    };
    
    this._channel.warn = (message: string, ...args: unknown[]) => {
      this._logMessages.push({
        level: 3,
        message,
        args
      });
      return originalWarn.call(this._channel, message, ...args);
    };

    this._channel.error = (message: string, ...args: unknown[]) => {
      this._logMessages.push({
        level: 4,
        message,
        args
      });
      return originalError.call(this._channel, message, ...args);
    };
  }

  get logMessages() {
    return this._logMessages;
  }

  reset() {
    this._logMessages = [];
  }
}

class RuntimeTracker implements Disposable {
  private _tabManagerService: TabManagerService;
  private _loggerInterceptor: LoggerInterceptor;

  private _lastSync: number = 0;
  private _lastRender: number = 0;

  private _syncMessages: CapturedSync[] = [];
  private _notifications: CapturedNotify[] = [];

  private _subscriptions: Disposable[] = [];

  constructor(tabManagerService: TabManagerService) {
    this._loggerInterceptor = new LoggerInterceptor();
    this._tabManagerService = tabManagerService;
    this.attach();
  }

  private attach() {
    this._subscriptions.push(
      this._tabManagerService.onDidSyncTabState(() => {
        this._lastSync++;
      }),

      this._tabManagerService.onDidSyncCollections(() => {
        this._lastSync++;
      }),

      this._tabManagerService.onDidSyncConfig(() => {
        this._lastSync++;
      }),

      this._tabManagerService.onDidCompleteRender(() => {
        this._lastRender++;
      }),

      this._tabManagerService.onDidSyncCollections((p) => this._syncMessages.push(p)),
      this._tabManagerService.onDidNotify((p) => this._notifications.push(p)),
    );
  }

  get lastSync() {
    return this._lastSync;
  }

  get lastRender() {
    return this._lastRender;
  }

  get syncMessages() {
    return this._syncMessages;
  }

  get notifications() {
    return this._notifications;
  }

  get logMessages() {
    return this._loggerInterceptor.logMessages;
  }

  resetCapture() {
    this._loggerInterceptor.reset();
    this._syncMessages = [];
    this._notifications = [];
  }

  dispose() {
    this._subscriptions.forEach((d) => d.dispose());
    this._subscriptions = [];
  }
}

export function createTestHelper(tabManagerService: TabManagerService): Disposable[] {
  // Test-only helper commands (not contributed to menus):
  const testCommands: Disposable[] = [];

  if (!runtimeProcess.process?.env?.VSCODE_TAB_STACK_TEST) {
    return testCommands;
  }

  const tracker = new RuntimeTracker(tabManagerService);

  testCommands.push(tracker);

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__startCapture`,
      async () => {
        tracker.resetCapture();
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__openView`,
      async () => {
        await commands.executeCommand('workbench.view.extension.tabStack');
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__webviewDispatch`,
      async (data: any) => {
        await ViewManagerProvider.__test__dispatchFromWebview(data);
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__webviewReady`,
      async () => {
        return ViewManagerProvider.__test__messageHandler != null;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getState`,
      async () => {
        const groups = tabManagerService.state?.groups ?? {};
        const addons = tabManagerService.state?.addons ?? {};
        const history = tabManagerService.state?.history ?? {};
        const quickSlots = tabManagerService.state?.quickSlots ?? {};
        const selectedGroupId =
          tabManagerService.state?.stateContainer?.id ?? null;
        return {
          groups: Object.fromEntries(
            Object.values(groups).map((g) => {
              const tabGroupsArray = Object.values(g.state?.tabState?.tabGroups ?? {});
              const tabCount = tabGroupsArray.reduce(
                (sum, tg) => sum + tg.tabs.length, 0
              );
              const columnCount = tabGroupsArray.length;
              const tabLabels = tabGroupsArray.flatMap((tg) => tg.tabs.map((t) => t.label));
              return [
                g.id,
                { id: g.id, name: g.name, tabCount, columnCount, tabLabels }
              ];
            })
          ),
          addons: Object.fromEntries(
            Object.values(addons).map((a) => [
              a.id,
              { id: a.id, name: a.name }
            ])
          ),
          historyIds: Object.keys(history),
          history: Object.fromEntries(
            Object.values(history).map((h) => {
              const tabGroupsArray = Object.values(h.state?.tabState?.tabGroups ?? {});
              const tabCount = tabGroupsArray.reduce(
                (sum, tg) => sum + tg.tabs.length, 0
              );
              const tabLabels = tabGroupsArray.flatMap((tg) => tg.tabs.map((t) => t.label));
              return [h.id, { id: h.id, name: h.name, tabCount, tabLabels }];
            })
          ),
          quickSlots,
          selectedGroupId
        };
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getCapturedMessages`,
      async (clear = false) => {
        const result = {
          sync: [...tracker.syncMessages],
          notify: [...tracker.notifications],
          logs: [...tracker.logMessages]
        };
        if (clear) tracker.resetCapture();
        return result;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__stopCapture`,
      async () => {
        tracker.resetCapture();
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__resetState`,
      async () => {
        await tabManagerService.clearAllTabs();
        await tabManagerService.resetState();
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__exportState`,
      async (filePath: string) => {
        const uri = Uri.file(filePath);
        await tabManagerService.exportStateFile(uri.toString());
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__importState`,
      async (filePath: string) => {
        await tabManagerService.importStateFile(filePath);
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__exportGroup`,
      async (groupId: string, filePath: string) => {
        const uri = Uri.file(filePath);
        await tabManagerService.exportGroup(groupId, uri.toString());
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__importGroup`,
      async (filePath: string) => {
        await tabManagerService.importGroup(filePath);
        return true;
      }
    )
  );
    
  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getLastRenderTime`,
      () => tracker.lastRender
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__waitForRender`,
      async (fromTimeParam?: string, maxTimeParam?: string) => {
        const fromTime = fromTimeParam ? Number(fromTimeParam) : Date.now();
        
        if (isNaN(fromTime)) {
          throw new Error('Invalid fromTime parameter');
        }

        if (tracker.lastRender > fromTime) {
          return Promise.resolve(true);
        }

        const maxWaitTime = maxTimeParam ? Number(maxTimeParam) : 1000;
        const endTime = Date.now() + maxWaitTime;

        return new Promise<boolean>((resolve) => {
          const check = () => {
            if (tracker.lastRender > fromTime) {
              resolve(true);
              return;
            } else if (Date.now() >= endTime) {
              resolve(false);
              return;
            }

            setTimeout(check, 50);
          };
          
          check();
        });
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getLastSyncTime`,
      () => tracker.lastSync
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__waitForSync`,
      (fromTimeParam?: string, maxTimeParam?: string) => {
        const fromTime = fromTimeParam ? Number(fromTimeParam) : Date.now();
        
        if (isNaN(fromTime)) {
          throw new Error('Invalid fromTime parameter');
        }

        if (tracker.lastSync > fromTime) {
          return Promise.resolve(true);
        }

        const maxWaitTime = maxTimeParam ? Number(maxTimeParam) : 10000;
        const endTime = Date.now() + maxWaitTime;

        return new Promise<boolean>((resolve) => {
          const check = () => {
            if (tracker.lastSync > fromTime) {
              resolve(true);
              return;
            } else if (Date.now() >= endTime) {
              resolve(false);
              return;
            }

            setTimeout(check, 50);
          };
          
          check();
        });
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getTabState`,
      async () => {
        const tabGroups = window.tabGroups.all.map((group) => ({
          viewColumn: group.viewColumn,
          isActive: group.isActive,
          tabs: group.tabs.map((tab, index) => ({
            label: tab.label,
            index,
            isActive: tab.isActive,
            isPinned: tab.isPinned,
            isDirty: tab.isDirty,
            kind: getTabInputKind(tab.input),
            viewColumn: group.viewColumn
          }))
        }));

        const activeEditor = window.activeTextEditor;
        const selection = activeEditor
          ? {
              start: {
                line: activeEditor.selection.start.line,
                character: activeEditor.selection.start.character
              },
              end: {
                line: activeEditor.selection.end.line,
                character: activeEditor.selection.end.character
              }
            }
          : null;

        return {
          tabGroups,
          selection,
          activeEditorUri:
            activeEditor?.document?.uri?.toString() ?? null
        };
      }
    )
  );

  // --- Raw VS Code event capture for diagnostic tests ---
  let rawEventCapture: {
    seq: number;
    tabEvents: Array<{
      seq: number;
      timestamp: number;
      opened: Array<ReturnType<typeof serializeTab>>;
      closed: Array<ReturnType<typeof serializeTab>>;
      changed: Array<ReturnType<typeof serializeTab>>;
    }>;
    groupEvents: Array<{
      seq: number;
      timestamp: number;
      opened: Array<ReturnType<typeof serializeTabGroup>>;
      closed: Array<ReturnType<typeof serializeTabGroup>>;
      changed: Array<ReturnType<typeof serializeTabGroup>>;
    }>;
    disposables: Disposable[];
  } | null = null;

  function serializeTab(tab: Tab) {
    return {
      label: tab.label,
      kind: getTabInputKind(tab.input),
      viewColumn: tab.group.viewColumn,
      index: tab.group.tabs.indexOf(tab),
      isActive: tab.isActive,
      isDirty: tab.isDirty,
      isPinned: tab.isPinned,
      isPreview: tab.isPreview,
    };
  }

  function serializeTabGroup(group: TabGroup) {
    return {
      viewColumn: group.viewColumn,
      isActive: group.isActive,
      tabCount: group.tabs.length,
      tabLabels: group.tabs.map((t) => t.label),
    };
  }

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__startRawEventCapture`,
      () => {
        if (rawEventCapture) {
          rawEventCapture.disposables.forEach((d) => d.dispose());
        }

        rawEventCapture = {
          seq: 0,
          tabEvents: [],
          groupEvents: [],
          disposables: [],
        };

        const capture = rawEventCapture;

        capture.disposables.push(
          window.tabGroups.onDidChangeTabs((e) => {
            capture.tabEvents.push({
              seq: capture.seq++,
              timestamp: Date.now(),
              opened: e.opened.map(serializeTab),
              closed: e.closed.map(serializeTab),
              changed: e.changed.map(serializeTab),
            });
          }),
          window.tabGroups.onDidChangeTabGroups((e) => {
            capture.groupEvents.push({
              seq: capture.seq++,
              timestamp: Date.now(),
              opened: e.opened.map(serializeTabGroup),
              closed: e.closed.map(serializeTabGroup),
              changed: e.changed.map(serializeTabGroup),
            });
          })
        );

        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__stopRawEventCapture`,
      () => {
        if (rawEventCapture) {
          rawEventCapture.disposables.forEach((d) => d.dispose());
          rawEventCapture.disposables = [];
        }
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getRawEvents`,
      (clear = false) => {
        if (!rawEventCapture) {
          return { tabEvents: [], groupEvents: [] };
        }
        const result = {
          tabEvents: [...rawEventCapture.tabEvents],
          groupEvents: [...rawEventCapture.groupEvents],
        };
        if (clear) {
          rawEventCapture.tabEvents = [];
          rawEventCapture.groupEvents = [];
          rawEventCapture.seq = 0;
        }
        return result;
      }
    )
  );

  // --- Resolved proxy event capture for integration tests ---
  let resolvedEventCapture: {
    events: Array<{
      seq: number;
      timestamp: number;
      created: Array<{ label: string; viewColumn: number; index: number }>;
      closed: Array<{ label: string; viewColumn: number; index: number }>;
      moved: Array<{
        label: string;
        fromViewColumn: number;
        toViewColumn: number;
        fromIndex: number;
        toIndex: number;
        changed: string[];
      }>;
      updated: Array<{
        label: string;
        changed: string[];
      }>;
    }>;
    disposable: Disposable | null;
  } | null = null;

  // @ts-expect-error - accessing private _tabChangeProxy for testing
  const tabChangeProxy = tabManagerService._tabChangeProxy as import('./services/tab-change-proxy').TabChangeProxyService;

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__startResolvedEventCapture`,
      () => {
        if (resolvedEventCapture?.disposable) {
          resolvedEventCapture.disposable.dispose();
        }

        resolvedEventCapture = {
          events: [],
          disposable: null,
        };

        const capture = resolvedEventCapture;
        let seq = 0;

        capture.disposable = tabChangeProxy.onDidChangeTabs((e) => {
          capture.events.push({
            seq: seq++,
            timestamp: Date.now(),
            created: e.created.map((t) => {
              const entry = e.createdEntries.get(t);
              return {
                label: t.label,
                viewColumn: entry?.viewColumn ?? t.group.viewColumn,
                index: entry?.index ?? t.group.tabs.indexOf(t),
              };
            }),
            closed: e.closed.map((t) => {
              const entry = e.closedEntries.get(t);
              return {
                label: t.label,
                viewColumn: entry?.viewColumn ?? t.group.viewColumn,
                index: entry?.index ?? t.group.tabs.indexOf(t),
              };
            }),
            moved: e.moved.map((m) => ({
              label: m.tab.label,
              fromViewColumn: m.fromViewColumn,
              toViewColumn: m.toViewColumn,
              fromIndex: m.fromIndex,
              toIndex: m.toIndex,
              changed: [...m.changed],
            })),
            updated: e.updated.map((u) => ({
              label: u.tab.label,
              changed: [...u.changed],
            })),
          });
        });

        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__stopResolvedEventCapture`,
      () => {
        if (resolvedEventCapture) {
          resolvedEventCapture.disposable?.dispose();
          resolvedEventCapture = null;
        }
        return true;
      }
    )
  );

  testCommands.push(
    commands.registerCommand(
      `${EXTENSION_NAME}.__test__getResolvedEvents`,
      (clear = false) => {
        if (!resolvedEventCapture) {
          return { events: [] };
        }
        const result = { events: [...resolvedEventCapture.events] };
        if (clear) {
          resolvedEventCapture.events = [];
        }
        return result;
      }
    )
  );

  return testCommands;
}