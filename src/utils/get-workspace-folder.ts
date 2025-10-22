import { workspace } from 'vscode';

export function getWorkspaceFolder(): string | null {
  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    return workspace.workspaceFolders[0].uri.toString();
  }

  return null;
}
