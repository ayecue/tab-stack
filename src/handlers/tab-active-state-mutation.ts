import { getLogger, ScopedLogger } from '../services/logger';
import type { TabActiveStateStore } from '../stores/tab-active-state';
import type {
  TabActiveStateMutationEffects,
  TabChangeMuteController
} from '../types/tab-active-state';

export class TabActiveStateMutationHandler {
  private _isLocked = false;
  private _log: ScopedLogger;

  constructor(
    private readonly _tabActiveStateStore: TabActiveStateStore,
    private readonly _tabChangeMuteController: TabChangeMuteController,
    private readonly _effects: TabActiveStateMutationEffects
  ) {
    this._log = getLogger().child('ActiveStateMutation');
  }

  get isLocked(): boolean {
    return this._isLocked;
  }

  async runLocked<T>(operation: () => Promise<T>): Promise<T> {
    this._lockState();

    try {
      return await operation();
    } finally {
      this._unlockState();
    }
  }

  private _lockState(): void {
    this._log.debug('lockState');
    this._isLocked = true;
    this._tabChangeMuteController.mute();
    this._tabActiveStateStore.send({ type: 'LOCK_STATE' });
  }

  private _unlockState(): void {
    this._log.debug('unlockState');
    this._isLocked = false;
    this._tabChangeMuteController.unmute();
    this._tabActiveStateStore.send({ type: 'UNLOCK_STATE' });
    this._effects.rehydrateTabs();
    this._effects.scheduleStateUpdate();
  }
}
