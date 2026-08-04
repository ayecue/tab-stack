import { beforeEach, describe, expect, it } from 'vitest';

import { TabRecoveryService } from '../../../src/services/tab-recovery-resolver';
import { TabKind } from '../../../src/types/tabs';
import { MockConfigService } from '../../mocks';

describe('TabRecoveryService match fields', () => {
  let config: MockConfigService;
  let service: TabRecoveryService;

  beforeEach(() => {
    config = new MockConfigService({
      tabRecoveryMappings: {
        cursorMarkdownPlanByUri: {
          command: 'vscode.openWith',
          args: ['{{uri}}', 'workbench.editor.markdownPlan'],
          unique: true,
          match: {
            label: '.*',
            uri: '.*\\.plan\\.md$'
          }
        }
      }
    });
    service = new TabRecoveryService(config as any);
  });

  it('matches unknown tabs by uri field', () => {
    const tab: any = {
      id: '1',
      label: 'demo.plan.md',
      kind: TabKind.Unknown,
      isActive: false,
      isPinned: false,
      index: 0,
      viewColumn: 1,
      isRecoverable: false,
      uri: 'file:///tmp/demo.plan.md',
      viewType: 'workbench.editor.markdownPlan',
      meta: { type: 'unknown' }
    };

    expect(service.hasMatch(tab)).toBe(true);
    const match = service.findMatch(tab);
    expect(match?.command).toBe('vscode.openWith');
    expect(match?.args?.[0]).toBe('file:///tmp/demo.plan.md');
  });

  it('does not match unrelated uris', () => {
    const tab: any = {
      id: '1',
      label: 'foo.ts',
      kind: TabKind.Unknown,
      isActive: false,
      isPinned: false,
      index: 0,
      viewColumn: 1,
      isRecoverable: false,
      uri: 'file:///tmp/foo.ts',
      meta: { type: 'unknown' }
    };

    expect(service.hasMatch(tab)).toBe(false);
  });
});
