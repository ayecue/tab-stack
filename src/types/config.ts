export enum GitIntegrationMode {
  AutoSwitch = 'auto-switch',
  AutoCreate = 'auto-create',
  FullAuto = 'full-auto'
}

export enum ApplyMode {
  Replace = 'replace',
  Append = 'append'
}

export interface GitIntegrationConfig {
  enabled: boolean;
  mode: GitIntegrationMode;
  groupPrefix: string;
}

export interface ConfigChangeEvent {
  masterWorkspaceFolder: string | null;
  gitIntegration?: GitIntegrationConfig;
  applyMode?: ApplyMode;
}
