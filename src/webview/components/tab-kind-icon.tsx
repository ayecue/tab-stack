import React from 'react';

import { TabKind } from '../../types/tabs';
import { FileIcon } from './file-icon';

interface TabKindIconProps {
  kind: TabKind;
  fileName: string;
  color?: string;
}

const ICON_BY_KIND: Partial<Record<TabKind, { icon: string; className: string }>> = {
  [TabKind.TabInputTerminal]: { icon: 'codicon-terminal', className: 'kind-icon-terminal' },
  [TabKind.TabInputWebview]: { icon: 'codicon-browser', className: 'kind-icon-webview' },
  [TabKind.TabInputCustom]: { icon: 'codicon-extensions', className: 'kind-icon-custom' },
  [TabKind.Unknown]: { icon: 'codicon-question', className: 'kind-icon-unknown' },
};

const FILE_KINDS = new Set<TabKind>([
  TabKind.TabInputText,
  TabKind.TabInputTextDiff,
  TabKind.TabInputNotebook,
  TabKind.TabInputNotebookDiff,
]);

export const TabKindIcon: React.FC<TabKindIconProps> = ({ kind, fileName, color }) => {
  if (FILE_KINDS.has(kind)) {
    const extension = fileName.includes('.') ? fileName.split('.').pop() ?? '' : '';
    return <FileIcon fileName={fileName} extension={extension} />;
  }

  const entry = ICON_BY_KIND[kind];
  if (entry) {
    return (
      <i
        className={`codicon ${entry.icon} ${entry.className}`}
        aria-hidden="true"
        style={color ? { color } : undefined}
      />
    );
  }

  // Fallback for any future unknown kinds
  return (
    <i
      className="codicon codicon-question kind-icon-unknown"
      aria-hidden="true"
      style={color ? { color } : undefined}
    />
  );
};
