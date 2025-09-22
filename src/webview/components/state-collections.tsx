import React, { useCallback, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { GroupsCollection } from './groups-collection';
import { HistoryCollection } from './history-collection';

export const StateCollections: React.FC = () => {
  const { actions } = useTabContext();
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(
    () => new Set()
  );

  const markDeleting = useCallback((key: string) => {
    setDeletingKeys((prev) => {
      const next = new Set(prev);
      next.add(key);
      return next;
    });
  }, []);

  const clearDeleting = useCallback((key: string) => {
    setDeletingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  }, []);

  const handleDeleteGroup = useCallback(
    async (groupId: string) => {
      const key = `group:${groupId}`;
      markDeleting(key);
      try {
        await actions.deleteGroup(groupId);
      } catch (error) {
        console.error('Failed to delete group', error);
      } finally {
        clearDeleting(key);
      }
    },
    [actions, markDeleting, clearDeleting]
  );

  const handleDeleteHistory = useCallback(
    async (historyId: string) => {
      const key = `history:${historyId}`;
      markDeleting(key);
      try {
        await actions.deleteHistory(historyId);
      } catch (error) {
        console.error('Failed to delete snapshot', error);
      } finally {
        clearDeleting(key);
      }
    },
    [actions, markDeleting, clearDeleting]
  );

  return (
    <div className="state-collections">
      <GroupsCollection
        deletingKeys={deletingKeys}
        onDelete={handleDeleteGroup}
      />
      <HistoryCollection
        deletingKeys={deletingKeys}
        onDelete={handleDeleteHistory}
      />
    </div>
  );
};
