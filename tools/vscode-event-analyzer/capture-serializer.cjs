const diff = require('microdiff').default;

const TAB_KIND_BY_CONSTRUCTOR = new Map([
  ['TabInputText', 'text'],
  ['TabInputTextDiff', 'textDiff'],
  ['TabInputCustom', 'custom'],
  ['TabInputWebview', 'webview'],
  ['TabInputNotebook', 'notebook'],
  ['TabInputNotebookDiff', 'notebookDiff'],
  ['TabInputTerminal', 'terminal'],
]);

function normalizeUriLike(value) {
  if (value == null) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value.toString === 'function') {
    const rendered = value.toString();
    return rendered === '[object Object]' ? undefined : rendered;
  }

  return undefined;
}

function resolveTabKind(input) {
  if (input == null) {
    return 'unknown';
  }

  const constructorName = input.constructor?.name;
  if (constructorName && TAB_KIND_BY_CONSTRUCTOR.has(constructorName)) {
    return TAB_KIND_BY_CONSTRUCTOR.get(constructorName);
  }

  if (input.original && input.modified && input.notebookType) {
    return 'notebookDiff';
  }

  if (input.notebookType) {
    return 'notebook';
  }

  if (input.original && input.modified) {
    return 'textDiff';
  }

  if (input.uri && input.viewType) {
    return 'custom';
  }

  if (input.viewType) {
    return 'webview';
  }

  if (input.uri) {
    return 'text';
  }

  return 'unknown';
}

class CaptureSerializer {
  constructor() {
    this._tabRefIds = new WeakMap();
    this._groupRefIds = new WeakMap();
    this._nextTabRefId = 1;
    this._nextGroupRefId = 1;
    this._currentSnapshot = null;
  }

  reset(groups) {
    this._currentSnapshot = this.captureSnapshot(groups, 0);
    return this._currentSnapshot;
  }

  get currentSnapshot() {
    return this._currentSnapshot;
  }

  captureSnapshot(groups, version = 0) {
    return {
      version,
      groups: Array.from(groups ?? []).map((group) =>
        this._serializeSnapshotGroup(group),
      ),
    };
  }

  recordTabEvent(event, groups, seq, timestamp = Date.now()) {
    return this._record('tab', event, groups, seq, timestamp);
  }

  recordGroupEvent(event, groups, seq, timestamp = Date.now()) {
    return this._record('group', event, groups, seq, timestamp);
  }

  serializeTab(tab) {
    return this._serializeTab(tab, tab?.group);
  }

  serializeGroup(group) {
    return this._serializeGroup(group);
  }

  _record(type, event, groups, seq, timestamp) {
    const currentGroups = Array.from(groups ?? []);
    const beforeSnapshot = this._currentSnapshot ?? this.reset(currentGroups);
    const nextSnapshot = this.captureSnapshot(currentGroups, beforeSnapshot.version);
    const changes = diff(beforeSnapshot.groups, nextSnapshot.groups);
    const afterSnapshot = {
      ...nextSnapshot,
      version:
        changes.length === 0
          ? beforeSnapshot.version
          : beforeSnapshot.version + 1,
    };

    this._currentSnapshot = afterSnapshot;

    return {
      observedEvent: {
        seq,
        timestamp,
        observedAtMs: timestamp,
        type,
        event:
          type === 'tab'
            ? this._serializeTabEvent(event)
            : this._serializeGroupEvent(event),
        beforeSnapshot,
        afterSnapshot,
      },
      snapshotDiff: {
        seq,
        timestamp,
        trigger: type,
        beforeVersion: beforeSnapshot.version,
        afterVersion: afterSnapshot.version,
        before: beforeSnapshot.groups,
        after: afterSnapshot.groups,
        diff: changes,
      },
    };
  }

  _serializeTabEvent(event) {
    const payload = {
      opened: Array.from(event?.opened ?? []).map((tab) => this.serializeTab(tab)),
      closed: Array.from(event?.closed ?? []).map((tab) => this.serializeTab(tab)),
      changed: Array.from(event?.changed ?? []).map((tab) => this.serializeTab(tab)),
    };

    if (event?.moved) {
      payload.moved = Array.from(event.moved).map((tab) => this.serializeTab(tab));
    }

    return payload;
  }

  _serializeGroupEvent(event) {
    return {
      opened: Array.from(event?.opened ?? []).map((group) =>
        this.serializeGroup(group),
      ),
      closed: Array.from(event?.closed ?? []).map((group) =>
        this.serializeGroup(group),
      ),
      changed: Array.from(event?.changed ?? []).map((group) =>
        this.serializeGroup(group),
      ),
    };
  }

  _serializeSnapshotGroup(group) {
    return {
      ...this._serializeGroup(group),
      tabs: Array.from(group?.tabs ?? []).map((tab, index) =>
        this._serializeTab(tab, group, index),
      ),
    };
  }

  _serializeGroup(group) {
    const tabs = Array.from(group?.tabs ?? []);

    return {
      groupRefId: this._getGroupRefId(group),
      viewColumn: group?.viewColumn ?? null,
      isActive: Boolean(group?.isActive),
      activeTabRefId: group?.activeTab ? this._getTabRefId(group.activeTab) : null,
      tabCount: tabs.length,
      tabLabels: tabs.map((tab) => tab.label),
      tabRefIds: tabs.map((tab) => this._getTabRefId(tab)),
    };
  }

  _serializeTab(tab, group = tab?.group, index = null) {
    const resolvedGroup = group ?? tab?.group;
    const resolvedIndex =
      index ??
      (resolvedGroup ? Array.from(resolvedGroup.tabs ?? []).indexOf(tab) : -1);
    const input = tab?.input;

    return {
      tabRefId: this._getTabRefId(tab),
      label: tab?.label ?? '',
      kind: resolveTabKind(input),
      viewColumn: resolvedGroup?.viewColumn ?? null,
      index: resolvedIndex,
      isActive: Boolean(tab?.isActive),
      isDirty: Boolean(tab?.isDirty),
      isPinned: Boolean(tab?.isPinned),
      isPreview: Boolean(tab?.isPreview),
      uri: normalizeUriLike(input?.uri) ?? normalizeUriLike(input?.modified),
      originalUri: normalizeUriLike(input?.original),
      modifiedUri: normalizeUriLike(input?.modified),
      viewType: typeof input?.viewType === 'string' ? input.viewType : undefined,
      notebookType:
        typeof input?.notebookType === 'string' ? input.notebookType : undefined,
    };
  }

  _getTabRefId(tab) {
    if (!tab || typeof tab !== 'object') {
      return null;
    }

    let refId = this._tabRefIds.get(tab);
    if (!refId) {
      refId = `tab-${this._nextTabRefId++}`;
      this._tabRefIds.set(tab, refId);
    }

    return refId;
  }

  _getGroupRefId(group) {
    if (!group || typeof group !== 'object') {
      return null;
    }

    let refId = this._groupRefIds.get(group);
    if (!refId) {
      refId = `group-${this._nextGroupRefId++}`;
      this._groupRefIds.set(group, refId);
    }

    return refId;
  }
}

module.exports = {
  CaptureSerializer,
  normalizeUriLike,
  resolveTabKind,
};