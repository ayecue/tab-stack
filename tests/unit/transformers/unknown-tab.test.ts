import { describe, expect, it } from 'vitest';
import type { Tab as VsCodeTab, TabGroup as VsCodeTabGroup } from 'vscode';
import { Uri } from 'vscode';

import { transformTabToTabInfo } from '../../../src/transformers/tab';
import { TabKind } from '../../../src/types/tabs';

const createGroup = (
  overrides: Partial<VsCodeTabGroup> = {}
): VsCodeTabGroup =>
  ({
    viewColumn: 1,
    tabs: [] as unknown as readonly VsCodeTab[],
    ...overrides
  }) as VsCodeTabGroup;

const createTab = (
  input: unknown,
  overrides: Partial<VsCodeTab> = {}
): VsCodeTab =>
  ({
    label: 'demo.plan.md',
    isActive: false,
    isPinned: false,
    isDirty: false,
    isPreview: false,
    input,
    group: overrides.group ?? createGroup(),
    ...overrides
  }) as VsCodeTab;

describe('transformTabToTabInfo unknown Cursor editors', () => {
  it('persists uri and viewType for unrecognized plan-like inputs', () => {
    class FakePlanInput {
      static EditorID = 'workbench.editor.markdownPlan';
      resource = Uri.file('/tmp/demo.plan.md');
    }

    const result = transformTabToTabInfo(
      createTab(new FakePlanInput()),
      createGroup(),
      0
    );

    expect(result.kind).toBe(TabKind.Unknown);
    expect(result).toMatchObject({
      uri: Uri.file('/tmp/demo.plan.md').toString(),
      viewType: 'workbench.editor.markdownPlan'
    });
  });

  it('infers plan editor from .plan.md uri without viewType', () => {
    const result = transformTabToTabInfo(
      createTab({ resource: Uri.file('/tmp/other.plan.md') }),
      createGroup(),
      0
    );

    expect(result.kind).toBe(TabKind.Unknown);
    expect(result).toMatchObject({
      uri: Uri.file('/tmp/other.plan.md').toString(),
      viewType: 'workbench.editor.markdownPlan'
    });
  });

  it('persists cursor-canvas uri and infers canvas editor', () => {
    const result = transformTabToTabInfo(
      createTab(
        { resource: Uri.parse('cursor-canvas:/welcome') },
        { label: 'Canvas' }
      ),
      createGroup(),
      0
    );

    expect(result.kind).toBe(TabKind.Unknown);
    expect(result).toMatchObject({
      uri: 'cursor-canvas:/welcome',
      viewType: 'workbench.editor.canvas'
    });
  });
});
