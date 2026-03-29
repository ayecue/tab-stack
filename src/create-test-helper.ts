import {
  commands,
  Disposable,
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
  ExtensionNotificationMessage,
  ExtensionTabsSyncMessage
} from './types/messages';
import { TabManagerService } from './services/tab-manager';
import { getLogger } from './services/logger';

type CapturedSync = Omit<ExtensionTabsSyncMessage, 'type'>;
type CapturedNotify = Omit<ExtensionNotificationMessage, 'type'>;

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

    this._channel.info = function (message: string, ...args: unknown[]) {
      this._logMessages.push({
        level: 2,
        message,
        args
      });
      return originalInfo.call(this, message, ...args);
    };

    this._channel.debug = function (message: string, ...args: unknown[]) {
      this._logMessages.push({
        level: 1,
        message,
        args
      });
      return originalDebug.call(this, message, ...args);
    };
    
    this._channel.warn = function (message: string, ...args: unknown[]) {
      this._logMessages.push({
        level: 3,
        message,
        args
      });
      return originalWarn.call(this, message, ...args);
    };

    this._channel.error = function (message: string, ...args: unknown[]) {
      this._logMessages.push({
        level: 4,
        message,
        args
      });
      return originalError.call(this, message, ...args);
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
      this._tabManagerService.onDidSyncTabs(() => {
        this._lastSync = Date.now();
      }),

      this._tabManagerService.onDidCompleteRender(() => {
        this._lastRender = Date.now();
      }),

      this._tabManagerService.onDidSyncTabs((p) => this._syncMessages.push(p)),
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

  if (process.env.VSCODE_TAB_STACK_TEST) {
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
            Object.values(groups).map((g) => [
              g.id,
              { id: g.id, name: g.name }
            ])
          ),
          addons: Object.fromEntries(
            Object.values(addons).map((a) => [
              a.id,
              { id: a.id, name: a.name }
            ])
          ),
          historyIds: Object.keys(history),
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

        if (tracker.lastRender >= fromTime) {
          return Promise.resolve(true);
        }

        const maxWaitTime = maxTimeParam ? Number(maxTimeParam) : 10000;
        const endTime = Date.now() + maxWaitTime;

        return new Promise<boolean>((resolve) => {
          const check = () => {
            if (tracker.lastRender >= fromTime) {
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

        if (tracker.lastSync >= fromTime) {
          return Promise.resolve(true);
        }

        const maxWaitTime = maxTimeParam ? Number(maxTimeParam) : 10000;
        const endTime = Date.now() + maxWaitTime;

        return new Promise<boolean>((resolve) => {
          const check = () => {
            if (tracker.lastSync >= fromTime) {
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

  return testCommands;
}