import { describe, expect, it } from 'vitest';

import {
  isSelectionMapEqual,
  isTabInfoEqual,
  isTabStateEqual
} from '../../../src/utils/tab-utils';
import { SelectionRange } from '../../../src/types/selection-tracker';
import { TabInfo, TabKind, TabState } from '../../../src/types/tabs';

const createTextTab = (overrides: Partial<TabInfo> = {}): TabInfo => ({
  label: 'note.ts',
  isActive: false,
  isDirty: false,
  isPinned: false,
  viewColumn: 1,
  kind: TabKind.TabInputText,
  uri: 'file:///note.ts',
  ...overrides
});

describe('tab-utils equality helpers', () => {
  it('compares tab infos by kind-specific fields', () => {
    const textA = createTextTab();
    const textB = createTextTab();
    const diff = {
      ...textA,
      kind: TabKind.TabInputTextDiff,
      originalUri: 'file:///note.old.ts',
      modifiedUri: 'file:///note.ts'
    } as TabInfo;

    expect(isTabInfoEqual(textA, textB)).toBe(true);
    const differentUri = { ...textA, uri: 'file:///another.ts' } as TabInfo;
    expect(isTabInfoEqual(textA, differentUri)).toBe(false);
    expect(isTabInfoEqual(diff, diff)).toBe(true);
  });

  it('compares tab states deeply', () => {
    const baseState: TabState = {
      activeGroup: 1,
      tabGroups: {
        1: {
          viewColumn: 1,
          tabs: [createTextTab({ isActive: true })],
          activeTab: createTextTab({ isActive: true })
        }
      }
    };

    const sameState: TabState = {
      activeGroup: 1,
      tabGroups: {
        1: {
          viewColumn: 1,
          tabs: [createTextTab({ isActive: true })],
          activeTab: createTextTab({ isActive: true })
        }
      }
    };

    const differentOrder: TabState = {
      activeGroup: 1,
      tabGroups: {
        2: baseState.tabGroups[1]
      }
    } as TabState;

    expect(isTabStateEqual(baseState, sameState)).toBe(true);
    expect(isTabStateEqual(baseState, differentOrder)).toBe(false);
  });

  it('compares selection maps structurally', () => {
    const makeSelection = (
      overrides: Partial<SelectionRange> = {}
    ): SelectionRange => ({
      start: { line: 0, character: 0 },
      end: { line: 0, character: 0 },
      isEmpty: false,
      isSingleLine: true,
      ...overrides
    });

    const mapA = {
      'file:///note.ts': makeSelection(),
      'file:///second.ts': makeSelection({
        end: { line: 10, character: 5 }
      })
    };
    const mapB = {
      'file:///note.ts': makeSelection(),
      'file:///second.ts': makeSelection({
        end: { line: 10, character: 5 }
      })
    };

    expect(isSelectionMapEqual(mapA, mapB)).toBe(true);
    expect(
      isSelectionMapEqual(mapA, {
        ...mapB,
        'file:///note.ts': makeSelection({
          end: { line: 3, character: 0 }
        })
      })
    ).toBe(false);
  });
});
