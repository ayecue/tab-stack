export enum GitIntegrationMode {
  AutoSwitch = 'auto-switch',
  AutoCreate = 'auto-create',
  FullAuto = 'full-auto'
}

export enum StorageType {
  File = 'file',
  WorkspaceState = 'workspace-state'
}

export interface GitIntegrationConfig {
  enabled: boolean;
  mode: GitIntegrationMode;
  groupPrefix: string;
}

export interface TabRecoveryMatchCriteria {
  label?: string;
  kind?: string;
  uri?: string;
  viewType?: string;
}

export type TabRecoveryMappingEntry = string | {
  command: string;
  args?: unknown[];
  nextTickDelay?: number;
  match?: TabRecoveryMatchCriteria;
};
export type TabRecoveryMapping = Record<string, TabRecoveryMappingEntry>;

export interface RecoveryCommandResult {
  command: string;
  args: unknown[];
  nextTickDelay: number;
}

export interface ConfigChangeEvent {
  masterWorkspaceFolder: string | null;
  gitIntegration?: GitIntegrationConfig;
  storageType?: StorageType;
  tabRecoveryMappings?: TabRecoveryMapping;
}
