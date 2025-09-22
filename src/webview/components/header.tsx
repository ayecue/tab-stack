import React from 'react';

interface HeaderProps {
  connectionStatus: string;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  connectionStatus,
  isLoading
}) => {
  const statusClass = `status-indicator ${connectionStatus.toLowerCase()}`;

  return (
    <header className="tab-manager-header" aria-label="Tab Stack status">
      <h1>Tab Stack</h1>
      <div className={statusClass} role="status">
        <span className="status-dot" aria-hidden="true" />
        <span className="status-label">
          {isLoading
            ? 'Syncing…'
            : connectionStatus === 'connected'
              ? 'Connected'
              : 'Reconnecting…'}
        </span>
      </div>
    </header>
  );
};
