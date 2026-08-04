import { describe, expect, it } from 'vitest';
import { Uri } from 'vscode';

import {
  CURSOR_CANVAS_EDITOR_ID,
  CURSOR_PLAN_EDITOR_ID,
  inferCursorEditorViewType,
  isCanvasUri,
  isPlanUri,
  resolvePlanOpenUri
} from '../../../src/utils/cursor-editors';

describe('cursor-editors', () => {
  it('detects plan uris', () => {
    expect(isPlanUri(Uri.file('/tmp/x.plan.md').toString())).toBe(true);
    expect(isPlanUri('cursor-plan:/abc.plan.md')).toBe(true);
    expect(isPlanUri(Uri.file('/tmp/x.ts').toString())).toBe(false);
  });

  it('detects canvas uris', () => {
    expect(isCanvasUri('cursor-canvas:/welcome')).toBe(true);
    expect(isCanvasUri(Uri.file('/tmp/x.ts').toString())).toBe(false);
  });

  it('infers plan and canvas editor ids', () => {
    expect(
      inferCursorEditorViewType({
        uri: Uri.file('/tmp/demo.plan.md').toString()
      })
    ).toBe(CURSOR_PLAN_EDITOR_ID);

    expect(
      inferCursorEditorViewType({
        viewType: 'workbench.editor.markdownPlan',
        uri: Uri.file('/tmp/demo.plan.md').toString()
      })
    ).toBe(CURSOR_PLAN_EDITOR_ID);

    expect(
      inferCursorEditorViewType({
        uri: 'cursor-canvas:/foo'
      })
    ).toBe(CURSOR_CANVAS_EDITOR_ID);

    expect(
      inferCursorEditorViewType({
        label: 'my.plan.md'
      })
    ).toBe(CURSOR_PLAN_EDITOR_ID);

    expect(
      inferCursorEditorViewType({
        uri: Uri.file('/tmp/foo.ts').toString(),
        label: 'foo.ts'
      })
    ).toBeUndefined();
  });

  it('resolvePlanOpenUri returns file uris unchanged', async () => {
    const fileUri = Uri.file('/tmp/demo.plan.md').toString();
    const resolved = await resolvePlanOpenUri(fileUri);
    expect(resolved?.toString()).toBe(fileUri);
  });

  it('resolvePlanOpenUri returns null for unknown virtual plans', async () => {
    const resolved = await resolvePlanOpenUri(
      'cursor-plan:/definitely-missing-xyz.plan.md'
    );
    expect(resolved).toBeNull();
  });
});
