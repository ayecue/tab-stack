import { Layout } from './commands';
import { AssociatedTabInstance, TabInfo, TabInfoId } from './tabs';

export interface TabRecoverabilityResolver {
  isRecoverable(tab: TabInfo): boolean;
}

export interface AssociatedInstanceRegistry {
  readonly associatedInstances: Map<AssociatedTabInstance, TabInfoId>;
  registerAssociatedInstance(
    instance: AssociatedTabInstance,
    tabId: TabInfoId
  ): void;
  pruneAssociatedInstances(liveTabIds: Set<TabInfoId>): void;
  findAssociatedInstanceByTabId(tabId: TabInfoId): AssociatedTabInstance | null;
}

export interface TrackedTabAssociationRegistry {
  readonly associatedTabs: Map<string, TabInfoId>;
}

export interface TabLayoutStateProvider {
  readonly currentLayout: Layout;
}

export interface TabStateReplayOptions {
  preservePinnedTabs: boolean;
  preserveTabFocus: boolean;
  preserveActiveTab: boolean;
}

export interface TabChangeMuteController {
  mute(): void;
  unmute(): void;
}

export interface TabActiveStateMutationEffects {
  rehydrateTabs(): void;
  scheduleStateUpdate(): void;
}

export interface TabActiveStateMutationGate {
  readonly isLocked: boolean;
}

export interface TabStateProjectionInvalidator {
  invalidateTabState(): void;
}

export interface TabStateUpdateScheduler {
  scheduleStateUpdate(): void;
}
