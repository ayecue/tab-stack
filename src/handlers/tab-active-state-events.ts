import {
  Disposable,
  NotebookEditor,
  Terminal,
  TextEditor,
  window
} from 'vscode';

import { EditorLayoutService } from '../services/editor-layout';
import { getLogger, ScopedLogger } from '../services/logger';
import { TabChangeProxyService } from '../services/tab-change-proxy';
import { TabInstanceBindingService } from '../services/tab-instance-binding';
import type { TabActiveStateStore } from '../stores/tab-active-state';
import type {
  TabActiveStateMutationGate,
  TabStateProjectionInvalidator,
  TabStateUpdateScheduler,
  TrackedTabAssociationRegistry
} from '../types/tab-active-state';
import { ResolvedTabChangeEvent } from '../types/tab-change-proxy';
import { TabInfoId } from '../types/tabs';
import { TrackedTabIdentityHandler } from './tracked-tab-identity';

export class TabActiveStateEventsHandler implements Disposable {
  private _disposables: Disposable[] = [];
  private _storeSubscription: { unsubscribe: () => void } | null = null;
  private _log: ScopedLogger;

  constructor(
    private readonly _tabActiveStateStore: TabActiveStateStore,
    private readonly _associatedTabs: Pick<
      TrackedTabAssociationRegistry,
      'associatedTabs'
    >,
    private readonly _layoutService: EditorLayoutService,
    private readonly _tabChangeProxy: TabChangeProxyService,
    private readonly _mutationGate: TabActiveStateMutationGate,
    private readonly _tabInstanceBindingService: TabInstanceBindingService,
    private readonly _trackedTabIdentityHandler: TrackedTabIdentityHandler,
    private readonly _tabStateProjector: TabStateProjectionInvalidator,
    private readonly _stateUpdateScheduler: TabStateUpdateScheduler
  ) {
    this._log = getLogger().child('ActiveStateEvents');
    this._initializeEvents();
  }

  syncTabs(event: ResolvedTabChangeEvent): void {
    if (this._mutationGate.isLocked) {
      this._log.debug('syncTabs skipped — state is locked');
      return;
    }

    this._replaceAssociatedTabs(
      this._trackedTabIdentityHandler.syncTabs(
        event,
        this._associatedTabs.associatedTabs
      )
    );
  }

  rehydrateTabs(): void {
    if (this._mutationGate.isLocked) {
      this._log.debug('rehydrateTabs skipped — state is locked');
      return;
    }

    this._replaceAssociatedTabs(
      this._trackedTabIdentityHandler.rehydrateTabs(
        this._associatedTabs.associatedTabs
      )
    );
  }

  dispose(): void {
    this._storeSubscription?.unsubscribe();
    this._disposables.forEach((disposable) => disposable.dispose());
    this._disposables = [];
  }

  private _initializeEvents(): void {
    this._disposables.push(
      this._tabChangeProxy.onDidChangeTabs((event) => {
        this._log.debug(
          `tab change resolved: created=${event.created.length} closed=${event.closed.length} moved=${event.moved.length} updated=${event.updated.length}`
        );
        this.syncTabs(event);
      }),
      window.onDidChangeActiveTextEditor((editor) => {
        this._associateTextEditorWithTab(editor);
      }),
      window.onDidChangeActiveNotebookEditor((editor) => {
        this._associateNotebookEditorWithTab(editor);
      }),
      window.onDidChangeActiveTerminal((terminal) => {
        this._associateTerminalWithTab(terminal);
      }),
      window.onDidChangeTextEditorSelection((event) => {
        this._updateTextEditorSelection(event.textEditor);
      }),
      window.onDidChangeNotebookEditorSelection((event) => {
        this._updateNotebookEditorSelection(event.notebookEditor);
      }),
      window.onDidStartTerminalShellExecution((event) => {
        this._updateTerminalMeta(event.terminal);
      }),
      window.onDidEndTerminalShellExecution((event) => {
        this._updateTerminalMeta(event.terminal);
      }),
      this._layoutService.onDidChangeLayout(() => {
        this._stateUpdateScheduler.scheduleStateUpdate();
      })
    );

    this._storeSubscription = this._tabActiveStateStore.subscribe(() => {
      this._tabStateProjector.invalidateTabState();
      this._stateUpdateScheduler.scheduleStateUpdate();
    });
  }

  private _associateTextEditorWithTab(editor: TextEditor | undefined): void {
    if (this._mutationGate.isLocked) return;
    this._tabInstanceBindingService.associateTextEditorWithTab(editor);
  }

  private _associateNotebookEditorWithTab(
    editor: NotebookEditor | undefined
  ): void {
    if (this._mutationGate.isLocked) return;
    this._tabInstanceBindingService.associateNotebookEditorWithTab(editor);
  }

  private _associateTerminalWithTab(terminal: Terminal | undefined): void {
    if (this._mutationGate.isLocked) return;
    this._tabInstanceBindingService.associateTerminalWithTab(terminal);
  }

  private _updateTextEditorSelection(editor: TextEditor): void {
    if (this._mutationGate.isLocked) return;
    this._tabInstanceBindingService.updateTextEditorSelection(editor);
  }

  private _updateNotebookEditorSelection(editor: NotebookEditor): void {
    if (this._mutationGate.isLocked) return;
    this._tabInstanceBindingService.updateNotebookEditorSelection(editor);
  }

  private _updateTerminalMeta(terminal: Terminal): void {
    if (this._mutationGate.isLocked) return;
    this._tabInstanceBindingService.updateTerminalMeta(terminal);
  }

  private _replaceAssociatedTabs(
    nextAssociatedTabs: Map<string, TabInfoId>
  ): void {
    if (nextAssociatedTabs === this._associatedTabs.associatedTabs) {
      return;
    }

    this._associatedTabs.associatedTabs.clear();

    for (const [tabKey, tabId] of nextAssociatedTabs) {
      this._associatedTabs.associatedTabs.set(tabKey, tabId);
    }
  }
}
