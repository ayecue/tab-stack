import { commands, Uri } from 'vscode';

import { Layout } from '../types/commands';

export async function getEditorLayout(): Promise<Layout> {
  return await commands.executeCommand('vscode.getEditorLayout');
}

export async function setEditorLayout(layout: Layout): Promise<void> {
  await commands.executeCommand('vscode.setEditorLayout', layout);
}

export async function pinEditor(uri: string): Promise<void> {
  await commands.executeCommand('workbench.action.pinEditor', Uri.parse(uri));
}

export async function unpinEditor(uri: string): Promise<void> {
  await commands.executeCommand('workbench.action.unpinEditor', Uri.parse(uri));
}
