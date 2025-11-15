import { describe, expect, it } from 'vitest';
import type { Tab as VsCodeTab, TabGroup as VsCodeTabGroup } from 'vscode';
import {
  TabInputCustom,
  TabInputNotebook,
  TabInputNotebookDiff,
  TabInputTerminal,
  TabInputText,
  TabInputTextDiff,
  Uri
} from 'vscode';

import { transformTabToTabInfo } from '../../../src/transformers/tab';
import { TabKind } from '../../../src/types/tabs';

const createGroup = (
  overrides: Partial<VsCodeTabGroup> = {}
): VsCodeTabGroup =>
  ({
    viewColumn: undefined,
    tabs: [] as unknown as readonly VsCodeTab[],
    ...overrides
  }) as VsCodeTabGroup;

const createTab = (input: unknown, overrides: Partial<VsCodeTab> = {}): VsCodeTab => ({
  label: 'tab',
  isActive: false,
  isPinned: false,
  isDirty: false,
  isPreview: overrides.isPreview ?? false,
  input,
  group: overrides.group ?? createGroup(),
  ...overrides
}) as VsCodeTab;

describe('transformTabToTabInfo', () => {
  it('maps TabInputText to TabInfoText', () => {
    const tab = createTab(new TabInputText(Uri.parse('file:///doc.ts')));

    const result = transformTabToTabInfo(tab, 1);

    expect(result).toMatchObject({
      kind: TabKind.TabInputText,
      uri: 'file:///doc.ts',
      viewColumn: 1
    });
  });

  it('maps TabInputTextDiff to TabInfoTextDiff', () => {
    const tab = createTab(
      new TabInputTextDiff(Uri.parse('file:///doc.ts'), Uri.parse('file:///doc.ts'))
    );

    const result = transformTabToTabInfo(tab, 2);

    expect(result).toMatchObject({
      kind: TabKind.TabInputTextDiff,
      originalUri: 'file:///doc.ts',
      modifiedUri: 'file:///doc.ts'
    });
  });

  it('maps TabInputCustom to TabInfoCustom', () => {
    const tab = createTab(new TabInputCustom(Uri.file('/custom'), 'preview'));

    const result = transformTabToTabInfo(tab, 3);

    expect(result).toMatchObject({
      kind: TabKind.TabInputCustom,
      uri: Uri.file('/custom').toString(),
      viewType: 'preview'
    });
  });

  it('maps notebook inputs', () => {
    const notebook = createTab(
      new TabInputNotebook(Uri.file('/notebook'), 'jupyter-notebook')
    );
    const diff = createTab(
      new TabInputNotebookDiff(
        Uri.file('/notebookA'),
        Uri.file('/notebookB'),
        'jupyter-notebook'
      )
    );

    const notebookResult = transformTabToTabInfo(notebook, 4);
    const diffResult = transformTabToTabInfo(diff, 5);

    expect(notebookResult).toMatchObject({
      kind: TabKind.TabInputNotebook,
      notebookType: 'jupyter-notebook',
      uri: Uri.file('/notebook').toString()
    });
    expect(diffResult).toMatchObject({
      kind: TabKind.TabInputNotebookDiff,
      notebookType: 'jupyter-notebook',
      originalUri: Uri.file('/notebookA').toString(),
      modifiedUri: Uri.file('/notebookB').toString()
    });
  });

  it('maps terminal inputs without URIs', () => {
    const tab = createTab(new TabInputTerminal(), { isActive: true });

    const result = transformTabToTabInfo(tab, 6);

    expect(result.kind).toBe(TabKind.TabInputTerminal);
    expect(result).not.toHaveProperty('uri');
  });

  it('returns base info for unknown inputs', () => {
    const tab = createTab({});

    const result = transformTabToTabInfo(tab, 7);

    expect(result.kind).toBe(TabKind.Unknown);
    expect(result.viewColumn).toBe(7);
  });
});
