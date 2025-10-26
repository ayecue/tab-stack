import React, { useCallback, useMemo, useState } from 'react';

import { useTabContext } from '../hooks/use-tab-context';
import { AddonsCollection } from './addons-collection';
import { GroupsCollection } from './groups-collection';
import { HistoryCollection } from './history-collection';

export const CollectionsPanel: React.FC = () => {
  const { actions } = useTabContext();
  const [deletingKeys, setDeletingKeys] = useState<Set<string>>(
    () => new Set()
  );
  const [activeTab, setActiveTab] = useState<'groups' | 'history' | 'addons'>(
    'groups'
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

  const handleDeleteAddon = useCallback(
    async (addonId: string) => {
      const key = `addon:${addonId}`;
      markDeleting(key);
      try {
        await actions.deleteAddon(addonId);
      } catch (error) {
        console.error('Failed to delete add-on', error);
      } finally {
        clearDeleting(key);
      }
    },
    [actions, markDeleting, clearDeleting]
  );

  const tabs = useMemo(
    () => [
      { id: 'groups' as const, label: 'Groups' },
      { id: 'history' as const, label: 'Snapshots' },
      { id: 'addons' as const, label: 'Add-ons' }
    ],
    []
  );

  return (
    <section className="collections-panel" aria-label="Saved layouts">
      <header className="collections-panel-header">
        <nav className="collections-tabs" aria-label="Collections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'active' : ''}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="collections-panel-body">
        {activeTab === 'groups' && (
          <GroupsCollection
            deletingKeys={deletingKeys}
            onDelete={handleDeleteGroup}
          />
        )}
        {activeTab === 'history' && (
          <HistoryCollection
            deletingKeys={deletingKeys}
            onDelete={handleDeleteHistory}
          />
        )}
        {activeTab === 'addons' && (
          <AddonsCollection
            deletingKeys={deletingKeys}
            onDelete={handleDeleteAddon}
          />
        )}
      </div>
    </section>
  );
};
