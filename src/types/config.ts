export enum GitIntegrationMode {
  AutoSwitch = 'auto-switch',
  AutoCreate = 'auto-create',
  FullAuto = 'full-auto'
}

export interface GitIntegrationConfig {
  enabled: boolean;
  mode: GitIntegrationMode;
  groupPrefix: string;
}

export interface ConfigChangeEvent {
  masterWorkspaceFolder: string | null;
  gitIntegration?: GitIntegrationConfig;
}
