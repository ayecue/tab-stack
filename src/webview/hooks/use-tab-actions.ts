import { useCallback, useMemo } from 'react';

import { TabMessagingService } from '../lib/tab-messaging-service';

interface TabGroups {
  [key: string]: {
    viewColumn: number;
    tabs: Array<{ isPinned: boolean; [key: string]: any }>;
    activeTab: any;
  };
}

interface UseTabActionsOptions {
  messagingService: TabMessagingService;
  tabGroups?: TabGroups;
  groupsLength: number;
  histories: Array<{ historyId: string }>;
  rendering: boolean;
}

interface Totals {
  openTabs: number;
  pinnedTabs: number;
  groups: number;
  histories: number;
}

interface UseTabActionsResult {
  totals: Totals;
  lastSnapshotId: string | null;
  hasTabs: boolean;
  handleCloseAllTabs: () => void;
  handleSaveGroup: () => void;
  handleSnapshot: () => void;
  handleRestoreSnapshot: () => void;
  handleCreateAddon: () => void;
}

export function useTabActions({
  messagingService,
  tabGroups,
  groupsLength,
  histories,
  rendering
}: UseTabActionsOptions): UseTabActionsResult {
  const totals = useMemo(() => {
    const groups = tabGroups ?? {};
    const groupValues = Object.values(groups);
    const openTabs = groupValues.reduce(
      (count, group) => count + group.tabs.length,
      0
    );
    const pinnedTabs = groupValues.reduce(
      (count, group) => count + group.tabs.filter((tab) => tab.isPinned).length,
      0
    );

    return {
      openTabs,
      pinnedTabs,
      groups: groupsLength,
      histories: histories.length
    };
  }, [tabGroups, groupsLength, histories.length]);

  const lastSnapshotId = useMemo(() => {
    if (histories.length === 0) {
      return null;
    }
    return histories[0].historyId;
  }, [histories]);

  const handleCloseAllTabs = useCallback(() => {
    if (!tabGroups) {
      return;
    }
    messagingService.clearAllTabs();
  }, [messagingService, tabGroups]);

  const handleSaveGroup = useCallback(() => {
    const name = `Group ${new Date().toLocaleTimeString()}`;
    if (name) {
      messagingService.createGroup(name.trim());
    }
  }, [messagingService]);

  const handleSnapshot = useCallback(() => {
    messagingService.addToHistory();
  }, [messagingService]);

  const handleRestoreSnapshot = useCallback(() => {
    if (!lastSnapshotId) {
      return;
    }
    messagingService.recoverState(lastSnapshotId);
  }, [messagingService, lastSnapshotId]);

  const handleCreateAddon = useCallback(() => {
    const name = `Addon ${new Date().toLocaleTimeString()}`;
    if (name) {
      messagingService.createAddon(name.trim());
    }
  }, [messagingService]);

  const hasTabs = totals.openTabs > 0;

  return {
    totals,
    lastSnapshotId,
    hasTabs,
    handleCloseAllTabs,
    handleSaveGroup,
    handleSnapshot,
    handleRestoreSnapshot,
    handleCreateAddon
  };
}
