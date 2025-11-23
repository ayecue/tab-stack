import { describe, expect, it } from 'vitest';

import {
  isSelectionMapEqual,
  isTabInfoEqual,
  isTabStateEqual
} from '../../../src/utils/tab-utils';
import { SelectionRange } from '../../../src/types/selection-tracker';
import { TabInfo, TabKind, TabState } from '../../../src/types/tabs';
import { tabFactory, tabStateFactory } from '../../factories';

describe('tab-utils equality helpers', () => {
  it('compares tab infos by kind-specific fields', () => {
    const tabOverrides = { uri: 'file:///note.ts', label: 'note.ts' };
    const textA = tabFactory.build(tabOverrides);
    const textB = tabFactory.build(tabOverrides);
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
    const activeTab = tabFactory.build({ uri: 'file:///note.ts', label: 'note.ts', isActive: true });
    const baseState = tabStateFactory.build({}, { transient: { tabs: [activeTab] } });

    const sameState: TabState = tabStateFactory.build({}, { transient: { tabs: [activeTab] } });

    const differentOrder: TabState = {
      activeGroup: 1,
      tabGroups: {
        2: baseState.tabGroups[1]
      }
    } as TabState;

    expect(isTabStateEqual(baseState, sameState)).toBe(true);
    expect(isTabStateEqual(baseState, differentOrder)).toBe(false);
  });

  it('ignores unrecoverable tabs when comparing states', () => {
    const recoverableTab = tabFactory.build({ 
      uri: 'file:///note.ts', 
      label: 'note.ts', 
      isRecoverable: true 
    });
    const unrecoverableTab1 = tabFactory.build({ 
      label: 'Terminal 1', 
      kind: TabKind.TabInputTerminal,
      isRecoverable: false 
    });
    const unrecoverableTab2 = tabFactory.build({ 
      label: 'Terminal 2', 
      kind: TabKind.TabInputTerminal,
      isRecoverable: false 
    });

    const stateWithUnrecoverable1 = tabStateFactory.build({}, { 
      transient: { tabs: [recoverableTab, unrecoverableTab1] } 
    });
    const stateWithUnrecoverable2 = tabStateFactory.build({}, { 
      transient: { tabs: [recoverableTab, unrecoverableTab2] } 
    });
    const stateWithoutUnrecoverable = tabStateFactory.build({}, { 
      transient: { tabs: [recoverableTab] } 
    });

    // States with different unrecoverable tabs should be considered equal
    // if their recoverable tabs are the same
    expect(isTabStateEqual(stateWithUnrecoverable1, stateWithUnrecoverable2)).toBe(true);
    expect(isTabStateEqual(stateWithUnrecoverable1, stateWithoutUnrecoverable)).toBe(true);
  });

  it('treats unrecoverable active tabs as equal', () => {
    const recoverableTab = tabFactory.build({ 
      uri: 'file:///note.ts', 
      label: 'note.ts', 
      isRecoverable: true 
    });
    const unrecoverableActiveTab1 = tabFactory.build({ 
      label: 'Terminal 1', 
      kind: TabKind.TabInputTerminal,
      isRecoverable: false,
      isActive: true
    });
    const unrecoverableActiveTab2 = tabFactory.build({ 
      label: 'Terminal 2', 
      kind: TabKind.TabInputTerminal,
      isRecoverable: false,
      isActive: true
    });

    const state1 = tabStateFactory.build({}, { 
      transient: { tabs: [recoverableTab, unrecoverableActiveTab1] } 
    });
    const state2 = tabStateFactory.build({}, { 
      transient: { tabs: [recoverableTab, unrecoverableActiveTab2] } 
    });

    // States with different unrecoverable active tabs should be treated as equal
    expect(isTabStateEqual(state1, state2)).toBe(true);
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
