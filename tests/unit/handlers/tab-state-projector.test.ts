import { beforeEach, describe, expect, it } from 'vitest';

import { TabStateProjector } from '../../../src/handlers/tab-state-projector';
import { createTabActiveStateStore } from '../../../src/stores/tab-active-state';
import { TabKind } from '../../../src/types/tabs';
import { createTabKey } from '../../../src/utils/tab-utils';
import {
  createVSCodeTab,
  createVSCodeTabGroup,
  setWindowTabGroups
} from '../../factories';

describe('TabStateProjector', () => {
  beforeEach(() => {
    setWindowTabGroups([]);
  });

  it('uses tracked tab info for associated tabs', () => {
    const store = createTabActiveStateStore();
    const associatedTabs = { associatedTabs: new Map<string, string>() };
    const layout = { orientation: 0, groups: [] };

    const tab = createVSCodeTab({ filePath: '/workspace/a.ts', isActive: true });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab],
      isActive: true,
      activeTab: tab
    });
    setWindowTabGroups([group], group);

    const tabKey = createTabKey(tab, group, 0);
    associatedTabs.associatedTabs.set(tabKey, 'tracked-id');

    store.send({
      type: 'SET_TABS',
      tabs: {
        'tracked-id': {
          id: 'tracked-id',
          kind: TabKind.TabInputText,
          uri: 'file:///workspace/a.ts',
          label: 'Tracked A',
          isActive: true,
          isPinned: false,
          isDirty: false,
          index: 0,
          viewColumn: 1,
          isRecoverable: true,
          meta: { type: 'textEditor' }
        }
      }
    });

    const projector = new TabStateProjector(
      store,
      associatedTabs,
      { currentLayout: layout }
    );

    const state = projector.getTabState();

    expect(state.activeGroup).toBe(1);
    expect(state.tabGroups[1].tabs[0].label).toBe('Tracked A');
  });

  it('caches projected tab state until invalidated', () => {
    const store = createTabActiveStateStore();
    const associatedTabs = { associatedTabs: new Map<string, string>() };

    const tab = createVSCodeTab({ filePath: '/workspace/a.ts', isActive: true });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab],
      isActive: true,
      activeTab: tab
    });
    setWindowTabGroups([group], group);

    const projector = new TabStateProjector(
      store,
      associatedTabs,
      { currentLayout: { orientation: 0, groups: [] } }
    );

    const firstState = projector.getTabState();
    const secondState = projector.getTabState();

    expect(secondState).toBe(firstState);

    projector.invalidateTabState();

    const thirdState = projector.getTabState();
    expect(thirdState).not.toBe(firstState);
  });
});