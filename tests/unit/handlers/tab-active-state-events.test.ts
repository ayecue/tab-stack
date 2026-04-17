import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { window } from 'vscode';

import { TabActiveStateEventsHandler } from '../../../src/handlers/tab-active-state-events';
import { createTabActiveStateStore } from '../../../src/stores/tab-active-state';
import { createEmptyResolvedTabChangeEvent } from '../../../src/types/tab-change-proxy';

describe('TabActiveStateEventsHandler', () => {
  let handler: TabActiveStateEventsHandler;

  let resolvedTabsListener: ((event: any) => void) | null;
  let layoutChangeListener: (() => void) | null;
  let activeTextEditorListener: ((editor: any) => void) | null;
  let activeNotebookEditorListener: ((editor: any) => void) | null;
  let activeTerminalListener: ((terminal: any) => void) | null;
  let textEditorSelectionListener: ((event: any) => void) | null;
  let notebookEditorSelectionListener: ((event: any) => void) | null;
  let startTerminalShellExecutionListener: ((event: any) => void) | null;
  let endTerminalShellExecutionListener: ((event: any) => void) | null;

  const resolvedTabsDisposable = { dispose: vi.fn() };
  const layoutDisposable = { dispose: vi.fn() };
  const activeTextEditorDisposable = { dispose: vi.fn() };
  const activeNotebookEditorDisposable = { dispose: vi.fn() };
  const activeTerminalDisposable = { dispose: vi.fn() };
  const textEditorSelectionDisposable = { dispose: vi.fn() };
  const notebookEditorSelectionDisposable = { dispose: vi.fn() };
  const startTerminalShellExecutionDisposable = { dispose: vi.fn() };
  const endTerminalShellExecutionDisposable = { dispose: vi.fn() };

  const lockedState = { current: false };

  const associatedTabs = {
    associatedTabs: new Map<string, string>([['stale', 'stale-id']])
  };

  const tabInstanceBindingService = {
    associateTextEditorWithTab: vi.fn(),
    associateNotebookEditorWithTab: vi.fn(),
    associateTerminalWithTab: vi.fn(),
    updateTextEditorSelection: vi.fn(),
    updateNotebookEditorSelection: vi.fn(),
    updateTerminalMeta: vi.fn()
  };

  const trackedTabIdentityHandler = {
    syncTabs: vi.fn(() => new Map([['resolved', 'resolved-id']])),
    rehydrateTabs: vi.fn(() => new Map([['rehydrated', 'rehydrated-id']]))
  };

  const projector = {
    invalidateTabState: vi.fn()
  };

  const scheduler = {
    scheduleStateUpdate: vi.fn()
  };

  const mutationGate = {
    get isLocked() {
      return lockedState.current;
    }
  };

  const layoutService = {
    onDidChangeLayout: vi.fn((listener: () => void) => {
      layoutChangeListener = listener;
      return layoutDisposable;
    })
  } as any;

  const tabChangeProxy = {
    onDidChangeTabs: vi.fn((listener: (event: any) => void) => {
      resolvedTabsListener = listener;
      return resolvedTabsDisposable;
    })
  } as any;

  beforeEach(() => {
    vi.clearAllMocks();

    resolvedTabsListener = null;
    layoutChangeListener = null;
    activeTextEditorListener = null;
    activeNotebookEditorListener = null;
    activeTerminalListener = null;
    textEditorSelectionListener = null;
    notebookEditorSelectionListener = null;
    startTerminalShellExecutionListener = null;
    endTerminalShellExecutionListener = null;
    lockedState.current = false;
    associatedTabs.associatedTabs = new Map([['stale', 'stale-id']]);

    vi.mocked(window.onDidChangeActiveTextEditor).mockImplementation(
      (listener: any) => {
        activeTextEditorListener = listener;
        return activeTextEditorDisposable as any;
      }
    );
    vi.mocked(window.onDidChangeActiveNotebookEditor).mockImplementation(
      (listener: any) => {
        activeNotebookEditorListener = listener;
        return activeNotebookEditorDisposable as any;
      }
    );
    vi.mocked(window.onDidChangeActiveTerminal).mockImplementation(
      (listener: any) => {
        activeTerminalListener = listener;
        return activeTerminalDisposable as any;
      }
    );
    vi.mocked(window.onDidChangeTextEditorSelection).mockImplementation(
      (listener: any) => {
        textEditorSelectionListener = listener;
        return textEditorSelectionDisposable as any;
      }
    );
    vi.mocked(window.onDidChangeNotebookEditorSelection).mockImplementation(
      (listener: any) => {
        notebookEditorSelectionListener = listener;
        return notebookEditorSelectionDisposable as any;
      }
    );
    vi.mocked(window.onDidStartTerminalShellExecution).mockImplementation(
      (listener: any) => {
        startTerminalShellExecutionListener = listener;
        return startTerminalShellExecutionDisposable as any;
      }
    );
    vi.mocked(window.onDidEndTerminalShellExecution).mockImplementation(
      (listener: any) => {
        endTerminalShellExecutionListener = listener;
        return endTerminalShellExecutionDisposable as any;
      }
    );

    handler = new TabActiveStateEventsHandler(
      createTabActiveStateStore(),
      associatedTabs,
      layoutService,
      tabChangeProxy,
      mutationGate,
      tabInstanceBindingService as any,
      trackedTabIdentityHandler as any,
      projector,
      scheduler
    );
  });

  afterEach(() => {
    handler.dispose();
  });

  it('registers listeners and routes events while unlocked', () => {
    const resolvedEvent = createEmptyResolvedTabChangeEvent();
    const editor = { id: 'editor' };
    const notebookEditor = { id: 'notebook-editor' };
    const terminal = { id: 'terminal' };

    resolvedTabsListener?.(resolvedEvent);
    activeTextEditorListener?.(editor);
    activeNotebookEditorListener?.(notebookEditor);
    activeTerminalListener?.(terminal);
    textEditorSelectionListener?.({ textEditor: editor });
    notebookEditorSelectionListener?.({ notebookEditor });
    startTerminalShellExecutionListener?.({ terminal });
    endTerminalShellExecutionListener?.({ terminal });
    layoutChangeListener?.();

    expect(tabChangeProxy.onDidChangeTabs).toHaveBeenCalled();
    expect(layoutService.onDidChangeLayout).toHaveBeenCalled();
    expect(trackedTabIdentityHandler.syncTabs).toHaveBeenCalledWith(
      resolvedEvent,
      associatedTabs.associatedTabs
    );
    expect(Array.from(associatedTabs.associatedTabs.entries())).toEqual([
      ['resolved', 'resolved-id']
    ]);
    expect(
      tabInstanceBindingService.associateTextEditorWithTab
    ).toHaveBeenCalledWith(editor);
    expect(
      tabInstanceBindingService.associateNotebookEditorWithTab
    ).toHaveBeenCalledWith(notebookEditor);
    expect(
      tabInstanceBindingService.associateTerminalWithTab
    ).toHaveBeenCalledWith(terminal);
    expect(
      tabInstanceBindingService.updateTextEditorSelection
    ).toHaveBeenCalledWith(editor);
    expect(
      tabInstanceBindingService.updateNotebookEditorSelection
    ).toHaveBeenCalledWith(notebookEditor);
    expect(tabInstanceBindingService.updateTerminalMeta).toHaveBeenCalledTimes(2);
    expect(scheduler.scheduleStateUpdate).toHaveBeenCalled();
  });

  it('invalidates projected state and schedules update on store changes', () => {
    projector.invalidateTabState.mockClear();
    scheduler.scheduleStateUpdate.mockClear();

    const store = (handler as any)._tabActiveStateStore;
    store.send({ type: 'SET_TABS', tabs: {} });

    expect(projector.invalidateTabState).toHaveBeenCalledTimes(1);
    expect(scheduler.scheduleStateUpdate).toHaveBeenCalledTimes(1);
  });

  it('skips routed work while locked', () => {
    lockedState.current = true;
    const resolvedEvent = createEmptyResolvedTabChangeEvent();
    const editor = { id: 'editor' };
    const notebookEditor = { id: 'notebook-editor' };
    const terminal = { id: 'terminal' };

    resolvedTabsListener?.(resolvedEvent);
    activeTextEditorListener?.(editor);
    activeNotebookEditorListener?.(notebookEditor);
    activeTerminalListener?.(terminal);
    textEditorSelectionListener?.({ textEditor: editor });
    notebookEditorSelectionListener?.({ notebookEditor });
    startTerminalShellExecutionListener?.({ terminal });
    endTerminalShellExecutionListener?.({ terminal });
    handler.rehydrateTabs();

    expect(trackedTabIdentityHandler.syncTabs).not.toHaveBeenCalled();
    expect(trackedTabIdentityHandler.rehydrateTabs).not.toHaveBeenCalled();
    expect(
      tabInstanceBindingService.associateTextEditorWithTab
    ).not.toHaveBeenCalled();
    expect(
      tabInstanceBindingService.associateNotebookEditorWithTab
    ).not.toHaveBeenCalled();
    expect(
      tabInstanceBindingService.associateTerminalWithTab
    ).not.toHaveBeenCalled();
    expect(
      tabInstanceBindingService.updateTextEditorSelection
    ).not.toHaveBeenCalled();
    expect(
      tabInstanceBindingService.updateNotebookEditorSelection
    ).not.toHaveBeenCalled();
    expect(tabInstanceBindingService.updateTerminalMeta).not.toHaveBeenCalled();
  });

  it('disposes attached listeners', () => {
    handler.dispose();

    expect(resolvedTabsDisposable.dispose).toHaveBeenCalled();
    expect(layoutDisposable.dispose).toHaveBeenCalled();
    expect(activeTextEditorDisposable.dispose).toHaveBeenCalled();
    expect(activeNotebookEditorDisposable.dispose).toHaveBeenCalled();
    expect(activeTerminalDisposable.dispose).toHaveBeenCalled();
    expect(textEditorSelectionDisposable.dispose).toHaveBeenCalled();
    expect(notebookEditorSelectionDisposable.dispose).toHaveBeenCalled();
    expect(startTerminalShellExecutionDisposable.dispose).toHaveBeenCalled();
    expect(endTerminalShellExecutionDisposable.dispose).toHaveBeenCalled();
  });
});