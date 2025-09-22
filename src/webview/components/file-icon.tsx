import React from 'react';

interface FileIconProps {
  fileName: string;
  extension: string;
}

interface IconInfo {
  icon: string;
  color: string;
}

interface SpecialIcon {
  color: string;
  label: string;
}

export const FileIcon: React.FC<FileIconProps> = ({ fileName, extension }) => {
  const getSpecialFileIcon = (iconType: string): React.ReactElement => {
    const specialIcons: Record<string, SpecialIcon> = {
      npm: { color: '#cb3837', label: 'NPM' },
      tsconfig: { color: '#3178c6', label: 'TS' },
      webpack: { color: '#8dd6f9', label: 'WP' },
      readme: { color: '#083fa1', label: 'README' },
      docker: { color: '#2496ed', label: 'DOCK' },
      makefile: { color: '#427819', label: 'MAKE' },
      git: { color: '#f05032', label: 'GIT' },
      license: { color: '#d4af37', label: 'LIC' }
    };

    const icon = specialIcons[iconType];
    if (icon) {
      return createFileIcon(iconType, icon.color, icon.label);
    }
    return (
      <i className="codicon codicon-file" style={{ color: '#6c6c6c' }}></i>
    );
  };

  const createFileIcon = (
    iconType: string,
    color: string,
    label: string
  ): React.ReactElement => {
    const iconStyles: Record<string, string> = {
      typescript: 'TS',
      react_ts: 'TS',
      javascript: 'JS',
      react: 'JS',
      python: 'PY',
      java: 'JAVA',
      csharp: 'C#',
      html: 'HTML',
      css: 'CSS',
      sass: 'SASS',
      json: '{}',
      markdown: 'MD'
    };

    const displayLabel = iconStyles[iconType] || label.substring(0, 3);

    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          fontSize: '7px',
          fontWeight: 'bold',
          borderRadius: '2px',
          background: color,
          color: 'white',
          textShadow: 'none',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        }}
      >
        {displayLabel}
      </span>
    );
  };

  const getVSCodeFileIcon = (): React.ReactElement => {
    const lowerFileName = fileName.toLowerCase();
    const lowerExt = extension.toLowerCase();

    const specialFiles: Record<string, string> = {
      'package.json': 'npm',
      'tsconfig.json': 'tsconfig',
      'webpack.config.js': 'webpack',
      'readme.md': 'readme',
      dockerfile: 'docker',
      makefile: 'makefile',
      '.gitignore': 'git',
      '.gitattributes': 'git',
      license: 'license',
      'license.md': 'license',
      'license.txt': 'license'
    };

    if (specialFiles[lowerFileName]) {
      return getSpecialFileIcon(specialFiles[lowerFileName]);
    }

    const extensionIcons: Record<string, IconInfo> = {
      ts: { icon: 'typescript', color: '#3178c6' },
      tsx: { icon: 'react_ts', color: '#61dafb' },
      js: { icon: 'javascript', color: '#f7df1e' },
      jsx: { icon: 'react', color: '#61dafb' },
      py: { icon: 'python', color: '#3776ab' },
      java: { icon: 'java', color: '#ed8b00' },
      c: { icon: 'c', color: '#a8b9cc' },
      cpp: { icon: 'cpp', color: '#00599c' },
      cs: { icon: 'csharp', color: '#239120' },
      php: { icon: 'php', color: '#777bb4' },
      rb: { icon: 'ruby', color: '#cc342d' },
      go: { icon: 'go', color: '#00add8' },
      rs: { icon: 'rust', color: '#ce422b' },
      swift: { icon: 'swift', color: '#fa7343' },
      kt: { icon: 'kotlin', color: '#7f52ff' },

      html: { icon: 'html', color: '#e34c26' },
      htm: { icon: 'html', color: '#e34c26' },
      css: { icon: 'css', color: '#1572b6' },
      scss: { icon: 'sass', color: '#cf649a' },
      sass: { icon: 'sass', color: '#cf649a' },
      less: { icon: 'less', color: '#1d365d' },
      vue: { icon: 'vue', color: '#4fc08d' },
      svelte: { icon: 'svelte', color: '#ff3e00' },

      json: { icon: 'json', color: '#cbcb41' },
      xml: { icon: 'xml', color: '#ff6600' },
      yaml: { icon: 'yaml', color: '#cb171e' },
      yml: { icon: 'yaml', color: '#cb171e' },
      toml: { icon: 'toml', color: '#9c4221' },
      csv: { icon: 'csv', color: '#0f9d58' },

      md: { icon: 'markdown', color: '#083fa1' },
      txt: { icon: 'text', color: '#6c6c6c' },
      pdf: { icon: 'pdf', color: '#dc143c' },

      png: { icon: 'image', color: '#9c27b0' },
      jpg: { icon: 'image', color: '#9c27b0' },
      jpeg: { icon: 'image', color: '#9c27b0' },
      gif: { icon: 'image', color: '#9c27b0' },
      svg: { icon: 'svg', color: '#ff9800' },
      webp: { icon: 'image', color: '#9c27b0' },

      zip: { icon: 'zip', color: '#8bc34a' },
      rar: { icon: 'zip', color: '#8bc34a' },
      tar: { icon: 'zip', color: '#8bc34a' },
      gz: { icon: 'zip', color: '#8bc34a' }
    };

    const iconInfo = extensionIcons[lowerExt];
    if (iconInfo) {
      return createFileIcon(
        iconInfo.icon,
        iconInfo.color,
        lowerExt.toUpperCase()
      );
    }

    return (
      <i className="codicon codicon-file" style={{ color: '#6c6c6c' }}></i>
    );
  };

  return getVSCodeFileIcon();
};
