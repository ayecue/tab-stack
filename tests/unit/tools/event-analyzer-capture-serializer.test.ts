import { describe, expect, it } from 'vitest';

import { createVSCodeTab, createVSCodeTabGroup } from '../../factories';

const { CaptureSerializer } = require('../../../tools/vscode-event-analyzer/capture-serializer.cjs');

describe('CaptureSerializer', () => {
  it('records versioned snapshots and stable tab refs across repeated events', () => {
    const serializer = new CaptureSerializer();
    const tab = createVSCodeTab({ filePath: '/workspace/a.ts', isActive: false });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab],
      isActive: true,
      activeTab: tab,
    });

    const initialSnapshot = serializer.reset([]);
    expect(initialSnapshot.version).toBe(0);

    const first = serializer.recordTabEvent(
      { opened: [tab], closed: [], changed: [] },
      [group],
      0,
      100,
    );

    expect(first.observedEvent.beforeSnapshot.version).toBe(0);
    expect(first.observedEvent.afterSnapshot.version).toBe(1);

    const tabRefId = first.observedEvent.event.opened[0].tabRefId;
    expect(tabRefId).toBe('tab-1');
    expect(first.observedEvent.afterSnapshot.groups[0].tabs[0].tabRefId).toBe(tabRefId);

    (tab as any).isActive = true;
    const second = serializer.recordTabEvent(
      { opened: [], closed: [], changed: [tab] },
      [group],
      1,
      101,
    );

    expect(second.observedEvent.beforeSnapshot.version).toBe(1);
    expect(second.observedEvent.afterSnapshot.version).toBe(2);
    expect(second.observedEvent.event.changed[0].tabRefId).toBe(tabRefId);
  });

  it('keeps the snapshot version stable for duplicate no-op group events', () => {
    const serializer = new CaptureSerializer();
    const tab = createVSCodeTab({ filePath: '/workspace/a.ts' });
    const group = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [tab],
      isActive: true,
      activeTab: tab,
    });

    serializer.reset([group]);

    const result = serializer.recordGroupEvent(
      { opened: [], closed: [], changed: [group] },
      [group],
      0,
      200,
    );

    expect(result.snapshotDiff.diff).toEqual([]);
    expect(result.snapshotDiff.beforeVersion).toBe(0);
    expect(result.snapshotDiff.afterVersion).toBe(0);
    expect(result.observedEvent.beforeSnapshot.version).toBe(0);
    expect(result.observedEvent.afterSnapshot.version).toBe(0);
  });

  it('assigns a new ref id when VS Code replaces a tab object', () => {
    const serializer = new CaptureSerializer();
    const originalTab = createVSCodeTab({ filePath: '/workspace/a.ts', isActive: true });
    const originalGroup = createVSCodeTabGroup({
      viewColumn: 1,
      tabs: [originalTab],
      isActive: true,
      activeTab: originalTab,
    });

    serializer.reset([originalGroup]);

    const replacementTab = createVSCodeTab({ filePath: '/workspace/a.ts', isActive: true });
    const emptyGroup = createVSCodeTabGroup({ viewColumn: 1, tabs: [] });
    const replacementGroup = createVSCodeTabGroup({
      viewColumn: 2,
      tabs: [replacementTab],
      isActive: true,
      activeTab: replacementTab,
    });

    const result = serializer.recordTabEvent(
      { opened: [replacementTab], closed: [originalTab], changed: [] },
      [emptyGroup, replacementGroup],
      0,
      300,
    );

    const closedRefId = result.observedEvent.event.closed[0].tabRefId;
    const openedRefId = result.observedEvent.event.opened[0].tabRefId;

    expect(closedRefId).toBe('tab-1');
    expect(openedRefId).toBe('tab-2');
    expect(openedRefId).not.toBe(closedRefId);
  });
});