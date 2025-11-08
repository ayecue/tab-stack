import React, { useMemo, useState } from 'react';

import { AddonsCollection } from './addons-collection';
import { GroupsCollection } from './groups-collection';
import { HistoryCollection } from './history-collection';

export const CollectionsPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'groups' | 'history' | 'addons'>(
    'groups'
  );
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = useMemo(
    () => [
      { id: 'groups' as const, label: 'Groups' },
      { id: 'history' as const, label: 'Snapshots' },
      { id: 'addons' as const, label: 'Add-ons' }
    ],
    []
  );

  return (
    <section
      className={`collections-panel ${isCollapsed ? 'collapsed' : ''}`}
      aria-label="Saved layouts"
    >
      <button
        className="collections-panel-toggle"
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-expanded={!isCollapsed}
        type="button"
      >
        <i
          className={`codicon codicon-chevron-${isCollapsed ? 'right' : 'down'}`}
          aria-hidden="true"
        />
        <i className="codicon codicon-layers" aria-hidden="true" />
        <span>Collections</span>
      </button>

      {!isCollapsed && (
        <>
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

          <div className="collections-panel-body">
            {activeTab === 'groups' && <GroupsCollection />}
            {activeTab === 'history' && <HistoryCollection />}
            {activeTab === 'addons' && <AddonsCollection />}
          </div>
        </>
      )}
    </section>
  );
};
