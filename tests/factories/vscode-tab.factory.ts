import type { Tab as VSCodeTab, TabGroup as VSCodeTabGroup } from 'vscode';
import {
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  TabInputWebview,
  Uri,
} from 'vscode';

export type VSCodeTabInputKind =
  | 'text'
  | 'textDiff'
  | 'custom'
  | 'webview'
  | 'notebook'
  | 'notebookDiff'
  | 'terminal'
  | 'unknown';

export interface VSCodeTabFactoryOptions {
  kind?: VSCodeTabInputKind;
  filePath?: string;
  originalFilePath?: string;
  modifiedFilePath?: string;
  label?: string;
  input?: unknown;
  group?: VSCodeTabGroup;
  viewType?: string;
  notebookType?: string;
  isActive?: boolean;
  isDirty?: boolean;
  isPinned?: boolean;
  isPreview?: boolean;
}

let tabSequence = 0;

export function createVSCodeTab(options: VSCodeTabFactoryOptions = {}): VSCodeTab {
  tabSequence += 1;

  const filePath = options.filePath ?? `/workspace/file-${tabSequence}.ts`;
  const label = options.label ?? filePath.split('/').pop() ?? `tab-${tabSequence}`;

  return {
    label,
    input: options.input ?? createTabInput(options, filePath),
    group: options.group as VSCodeTabGroup,
    isActive: options.isActive ?? false,
    isDirty: options.isDirty ?? false,
    isPinned: options.isPinned ?? false,
    isPreview: options.isPreview ?? false,
  } as unknown as VSCodeTab;
}

function createTabInput(options: VSCodeTabFactoryOptions, filePath: string): unknown {
  const kind = options.kind ?? 'text';

  switch (kind) {
    case 'text':
      return new TabInputText(Uri.file(filePath));
    case 'textDiff':
      return new TabInputTextDiff(
        Uri.file(options.originalFilePath ?? `/workspace/original-${tabSequence}.ts`),
        Uri.file(options.modifiedFilePath ?? filePath)
      );
    case 'custom':
      return new TabInputCustom(Uri.file(filePath), options.viewType ?? `custom.view.${tabSequence}`);
    case 'webview':
      return new TabInputWebview(options.viewType ?? `webview.view.${tabSequence}`);
    case 'notebook':
      return new TabInputNotebook(Uri.file(filePath), options.notebookType ?? 'jupyter-notebook');
    case 'notebookDiff':
      return new TabInputNotebookDiff(
        Uri.file(options.originalFilePath ?? `/workspace/original-${tabSequence}.ipynb`),
        Uri.file(options.modifiedFilePath ?? `/workspace/modified-${tabSequence}.ipynb`),
        options.notebookType ?? 'jupyter-notebook'
      );
    case 'terminal':
      return new TabInputTerminal();
    default:
      return {};
  }
}