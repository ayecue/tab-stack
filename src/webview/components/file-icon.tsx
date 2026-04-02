import React, { useMemo, useState } from 'react';
import { getIconForFile } from 'vscode-icons-js';

const ICONS_CDN_BASE =
  'https://cdn.jsdelivr.net/gh/vscode-icons/vscode-icons@12.17.0/icons/';

interface FileIconProps {
  fileName: string;
  extension: string;
}

export const FileIcon: React.FC<FileIconProps> = React.memo(({ fileName }) => {
  const [hasError, setHasError] = useState(false);

  const iconFileName = useMemo(() => getIconForFile(fileName), [fileName]);

  if (!iconFileName || hasError) {
    return (
      <i className="codicon codicon-file" style={{ color: '#6c6c6c' }}></i>
    );
  }

  return (
    <img
      className="file-icon"
      src={`${ICONS_CDN_BASE}${iconFileName}`}
      alt=""
      onError={() => setHasError(true)}
    />
  );
});
