import { describe, expect, it } from 'vitest';
import { Uri } from 'vscode';

import { extractUnknownTabIdentity } from '../../../src/utils/unknown-tab-identity';

describe('extractUnknownTabIdentity', () => {
  it('returns empty for nullish input', () => {
    expect(extractUnknownTabIdentity(null)).toEqual({});
    expect(extractUnknownTabIdentity(undefined)).toEqual({});
  });

  it('reads uri and viewType from a duck-typed custom-like input', () => {
    expect(
      extractUnknownTabIdentity({
        uri: Uri.file('/tmp/foo.plan.md'),
        viewType: 'workbench.editor.markdownPlan'
      })
    ).toEqual({
      uri: Uri.file('/tmp/foo.plan.md').toString(),
      viewType: 'workbench.editor.markdownPlan'
    });
  });

  it('reads resource and constructor EditorID', () => {
    class FakePlanInput {
      static EditorID = 'workbench.editor.markdownPlan';
      resource = Uri.file('/home/me/.cursor/plans/demo.plan.md');
    }

    expect(extractUnknownTabIdentity(new FakePlanInput())).toEqual({
      uri: Uri.file('/home/me/.cursor/plans/demo.plan.md').toString(),
      viewType: 'workbench.editor.markdownPlan'
    });
  });

  it('reads canvas path via resource scheme', () => {
    expect(
      extractUnknownTabIdentity({
        resource: Uri.parse('cursor-canvas:/my-canvas')
      })
    ).toEqual({
      uri: 'cursor-canvas:/my-canvas',
      viewType: undefined
    });
  });
});
