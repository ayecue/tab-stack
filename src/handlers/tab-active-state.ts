import debounce, { DebouncedFunction } from 'debounce';
import { Disposable, EventEmitter } from 'vscode';

import { EditorLayoutService } from '../services/editor-layout';
import { getLogger, ScopedLogger } from '../services/logger';
import { TabChangeProxyService } from '../services/tab-change-proxy';
import { TabInstanceBindingService } from '../services/tab-instance-binding';
import { TabRecoveryService } from '../services/tab-recovery-resolver';
import {
  createTabActiveStateStore,
  TabActiveStateStore
} from '../stores/tab-active-state';
import { TabStateReplayOptions } from '../types/tab-active-state';
import { ResolvedTabChangeEvent } from '../types/tab-change-proxy';
import { TabManagerState } from '../types/tab-manager';
import {
  AssociatedTabInstance,
  TabInfo,
  TabInfoId,
  TabState
} from '../types/tabs';
import { TabActiveStateEventsHandler } from './tab-active-state-events';
import { TabActiveStateMutationHandler } from './tab-active-state-mutation';
import { TabFactory } from './tab-factory';
import { TabReplayHandler } from './tab-replay';
import { TabStateProjector } from './tab-state-projector';
import { TrackedTabIdentityHandler } from './tracked-tab-identity';

export class TabActiveStateHandler implements Disposable {
  static readonly STATE_UPDATE_DEBOUNCE_DELAY = 10 as const;

  private _tabActiveStateStore: TabActiveStateStore;
  private _associatedTabs: Map<string, TabInfoId>;
  private _associatedInstances: Map<AssociatedTabInstance, TabInfoId>;

  private _stateUpdateEmitter: EventEmitter<TabManagerState>;
  private _layoutService: EditorLayoutService;
  private _tabChangeProxy: TabChangeProxyService;
  private _tabEventsHandler: TabActiveStateEventsHandler;
  private _tabInstanceBindingService: TabInstanceBindingService;
  private _tabMutationHandler: TabActiveStateMutationHandler;
  private _tabReplayHandler: TabReplayHandler;
  private _tabStateProjector: TabStateProjector;
  private _trackedTabIdentityHandler: TrackedTabIdentityHandler;
  private _recoveryResolver: TabRecoveryService;

  private _log: ScopedLogger;

  public readonly triggerStateUpdate: DebouncedFunction<() => Promise<void>>;
  public readonly syncTabs: (event: ResolvedTabChangeEvent) => void;
  public readonly rehydrateTabs: () => void;

  constructor(
    layoutService: EditorLayoutService,
    tabRecoveryService: TabRecoveryService,
    tabChangeProxy: TabChangeProxyService
  ) {
    this._tabActiveStateStore = createTabActiveStateStore();
    this._associatedTabs = new Map();
    this._stateUpdateEmitter = new EventEmitter<TabManagerState>();
    this._layoutService = layoutService;
    this._tabChangeProxy = tabChangeProxy;
    this._log = getLogger().child('ActiveStateHandler');
    this._recoveryResolver = tabRecoveryService;

    this.triggerStateUpdate = debounce(
      this._triggerStateUpdate.bind(this),
      TabActiveStateHandler.STATE_UPDATE_DEBOUNCE_DELAY
    );

    this._tabInstanceBindingService = new TabInstanceBindingService(
      this._tabActiveStateStore,
      this._associatedTabs
    );
    this._associatedInstances =
      this._tabInstanceBindingService.associatedInstances;
    this._tabMutationHandler = new TabActiveStateMutationHandler(
      this._tabActiveStateStore,
      this._tabChangeProxy,
      this
    );
    this._tabReplayHandler = new TabReplayHandler(
      this._tabActiveStateStore,
      this._layoutService,
      new TabFactory(this._recoveryResolver),
      this,
      this._tabInstanceBindingService
    );
    this._tabStateProjector = new TabStateProjector(
      this._tabActiveStateStore,
      this,
      this._layoutService
    );
    this._trackedTabIdentityHandler = new TrackedTabIdentityHandler(
      this._tabActiveStateStore,
      this._recoveryResolver,
      this._tabInstanceBindingService
    );
    this._tabEventsHandler = new TabActiveStateEventsHandler(
      this._tabActiveStateStore,
      this,
      this._layoutService,
      this._tabChangeProxy,
      this._tabMutationHandler,
      this._tabInstanceBindingService,
      this._trackedTabIdentityHandler,
      this._tabStateProjector,
      this
    );

    this.syncTabs = this._tabEventsHandler.syncTabs.bind(this._tabEventsHandler);
    this.rehydrateTabs = this._tabEventsHandler.rehydrateTabs.bind(
      this._tabEventsHandler
    );
  }

  get onDidChangeState() {
    return this._stateUpdateEmitter.event;
  }

  get associatedTabs(): Map<string, TabInfoId> {
    return this._associatedTabs;
  }

  scheduleStateUpdate(): void {
    void this.triggerStateUpdate();
  }
  
  getTabManagerState(): TabManagerState {
    return this._tabStateProjector.getTabManagerState();
  }

  getTabState(): TabState {
    return this._tabStateProjector.getTabState();
  }

  private async _triggerStateUpdate(): Promise<void> {
    if (this._tabMutationHandler.isLocked) return;
    this._stateUpdateEmitter.fire(this.getTabManagerState());
  }

  isTabRecoverable(tab: TabInfo): boolean {
    return this._recoveryResolver.isRecoverable(tab);
  }

  async moveEditorGroup(
    fromViewColumn: number,
    toViewColumn: number
  ): Promise<void> {
    if (fromViewColumn === toViewColumn) return;

    await this._tabMutationHandler.runLocked(async () => {
      await this._tabReplayHandler.moveEditorGroup(fromViewColumn, toViewColumn);
    });
  }

  mergeTabState(tabState: TabState): void {
    this._tabReplayHandler.mergeTabState(tabState);
  }

  async applyTabState(
    tabState: TabState,
    options: TabStateReplayOptions
  ): Promise<void> {
    await this._tabMutationHandler.runLocked(async () => {
      await this._tabReplayHandler.applyTabState(tabState, options);
    });
  }

  dispose() {
    this._tabEventsHandler.dispose();
    this._stateUpdateEmitter.dispose();
  }
}
