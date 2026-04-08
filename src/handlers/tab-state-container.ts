import { Disposable, EventEmitter } from 'vscode';

import { getLogger, ScopedLogger } from '../services/logger';
import { isLayoutEqual } from '../utils/is-layout-equal';
import { isTabStateEqual } from '../utils/tab-utils';
import {
  createTabStateContainerStore,
  TabStateContainerStore
} from '../stores/tab-state-container';
import { TabStateContainerStoreContext } from '../types/store';
import { StateContainer, TabManagerState } from '../types/tab-manager';

export class TabStateContainerHandler implements Disposable {
  private _tabStateContainerStore: TabStateContainerStore;
  private _disposables: Disposable[];
  private _stateUpdateEmitter: EventEmitter<TabStateContainerStoreContext>;
  private _storeSubscription: { unsubscribe: () => void } | null;
  private _log: ScopedLogger;

  constructor() {
    this._tabStateContainerStore = createTabStateContainerStore();
    this._disposables = [];
    this._stateUpdateEmitter =
      new EventEmitter<TabStateContainerStoreContext>();
    this._storeSubscription = null;
    this._log = getLogger().child('StateContainerHandler');

    this.initializeEvents();
  }

  private initializeEvents() {
    // Store subscription to emit state updates
    this._storeSubscription = this._tabStateContainerStore.subscribe(() => {
      this._stateUpdateEmitter.fire(
        this._tabStateContainerStore.getSnapshot().context
      );
    });
  }

  get onDidChangeState() {
    return this._stateUpdateEmitter.event;
  }

  get currentStateContainer(): StateContainer | null {
    return this._tabStateContainerStore.getSnapshot().context
      .currentStateContainer;
  }

  get previousStateContainer(): StateContainer | null {
    return this._tabStateContainerStore.getSnapshot().context
      .previousStateContainer;
  }

  get isLocked(): boolean {
    return this._tabStateContainerStore.getSnapshot().context.isLocked;
  }

  initialize(
    stateContainer: StateContainer,
    previousStateContainer: StateContainer
  ): void {
    this._tabStateContainerStore.send({
      type: 'INITIALIZE',
      stateContainer,
      previousStateContainer
    });
  }

  setCurrentStateContainer(stateContainer: StateContainer): void {
    this._log.debug(`setCurrentStateContainer: ${stateContainer.name} (${stateContainer.id})`);
    this._tabStateContainerStore.send({
      type: 'SET_STATE',
      stateContainer: {
        ...stateContainer,
        lastSelectedAt: Date.now()
      }
    });
  }

  updateTabState(newState: TabManagerState): void {
    const current = this.currentStateContainer;
    if (!current) return;

    if (
      isTabStateEqual(current.state.tabState, newState.tabState) &&
      isLayoutEqual(current.state.layout, newState.layout)
    ) {
      return;
    }

    const updatedContainer: StateContainer = {
      ...current,
      state: newState
    };

    this._tabStateContainerStore.send({
      type: 'SYNC_STATE',
      stateContainer: updatedContainer
    });
  }

  syncState(stateContainer: StateContainer): void {
    this._tabStateContainerStore.send({
      type: 'SYNC_STATE',
      stateContainer
    });
  }

  forkState(): void {
    this._log.debug('forkState: creating new state from current');
    this._tabStateContainerStore.send({
      type: 'FORK_STATE'
    });
  }

  lockState(): void {
    this._log.debug('lockState');
    this._tabStateContainerStore.send({
      type: 'LOCK_STATE'
    });
  }

  unlockState(): void {
    this._log.debug('unlockState');
    this._tabStateContainerStore.send({
      type: 'UNLOCK_STATE'
    });
  }

  reset(): void {
    this._tabStateContainerStore.send({
      type: 'RESET'
    });
  }

  dispose() {
    this._storeSubscription?.unsubscribe();
    this._disposables.forEach((d) => d.dispose());
    this._stateUpdateEmitter.dispose();
  }
}
