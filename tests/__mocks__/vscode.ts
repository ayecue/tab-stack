import { createVSCodeMock } from 'jest-mock-vscode';
import { vi } from 'vitest';

const vscode = createVSCodeMock(vi);

// Add TabInput classes that aren't implemented in jest-mock-vscode
class TabInputText {
  constructor(public uri: any) {}
}

class TabInputTextDiff {
  constructor(public original: any, public modified: any) {}
}

class TabInputNotebook {
  constructor(public uri: any, public notebookType: string) {}
}

class TabInputNotebookDiff {
  constructor(public original: any, public modified: any, public notebookType: string = 'notebook') {}
}

class TabInputCustom {
  constructor(public uri: any, public viewType: string) {}
}

class TabInputTerminal {}

// Enhance window mock to return proper disposable objects
const enhancedWindow = {
  ...vscode.window,
  onDidChangeTextEditorSelection: vi.fn(() => ({ dispose: vi.fn() })),
  onDidChangeNotebookEditorSelection: vi.fn(() => ({ dispose: vi.fn() })),
};

const enhanced = {
  ...vscode,
  window: enhancedWindow,
  TabInputText,
  TabInputTextDiff,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputCustom,
  TabInputTerminal,
};

export default enhanced;
export const {
  Uri,
  Range,
  Position,
  Selection,
  workspace,
  commands,
  EventEmitter,
  ConfigurationTarget,
  ViewColumn,
  StatusBarAlignment,
  ColorThemeKind,
  EndOfLine,
  FileType,
  FilePermission,
} = vscode;

export const window = enhancedWindow;
export { TabInputText, TabInputTextDiff, TabInputNotebook, TabInputNotebookDiff, TabInputCustom, TabInputTerminal };
