import { Uri, workspace } from 'vscode';

export function getWorkspaceFolder(): Uri | null {
  if (!workspace.name.startsWith('untitled:') && workspace.workspaceFile) {
    const folder = Uri.joinPath(workspace.workspaceFile, '..');
    return folder;
  }

  if (workspace.workspaceFolders && workspace.workspaceFolders.length > 0) {
    return workspace.workspaceFolders[0].uri;
  }

  return null;
}
