import { Tab } from 'vscode';

import {
  diffFull as computeDiffFull,
  TabChangeComputationCacheApi,
  TabChangeProperty,
  TabEntrySnapshot
} from '../types/tab-change-proxy';

/**
 * Lifecycle-scoped cache for derived tab-entry computations used across
 * the event pipeline while a bucket is being resolved.
 */
export class TabChangeComputationCache implements TabChangeComputationCacheApi {
  private _byViewColumnCache = new WeakMap<
    Map<Tab, TabEntrySnapshot>,
    Map<number, Map<Tab, TabEntrySnapshot>>
  >();

  private _groupFingerprintByViewColumnCache = new WeakMap<
    Map<Tab, TabEntrySnapshot>,
    Map<number, string>
  >();

  private _viewColumnsByGroupFingerprintCache = new WeakMap<
    Map<Tab, TabEntrySnapshot>,
    Map<string, readonly number[]>
  >();

  private _byViewColumnAndGlobalRefCache = new WeakMap<
    Map<Tab, TabEntrySnapshot>,
    Map<string, TabEntrySnapshot>
  >();

  private _fullDiffCache = new WeakMap<
    TabEntrySnapshot,
    WeakMap<TabEntrySnapshot, Set<TabChangeProperty | 'viewColumn' | 'index'>>
  >();

  private _propertyDiffCache = new WeakMap<
    TabEntrySnapshot,
    WeakMap<TabEntrySnapshot, Set<TabChangeProperty>>
  >();

  reset(): void {
    this._byViewColumnCache = new WeakMap();
    this._groupFingerprintByViewColumnCache = new WeakMap();
    this._viewColumnsByGroupFingerprintCache = new WeakMap();
    this._byViewColumnAndGlobalRefCache = new WeakMap();
    this._fullDiffCache = new WeakMap();
    this._propertyDiffCache = new WeakMap();
  }

  indexByViewColumn(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<number, Map<Tab, TabEntrySnapshot>> {
    const cached = this._byViewColumnCache.get(byRef);
    if (cached) {
      return cached;
    }

    const index = new Map<number, Map<Tab, TabEntrySnapshot>>();

    for (const [tab, entry] of byRef) {
      let group = index.get(entry.viewColumn);
      if (!group) {
        group = new Map();
        index.set(entry.viewColumn, group);
      }

      group.set(tab, entry);
    }

    this._byViewColumnCache.set(byRef, index);
    return index;
  }

  groupFingerprintCluesByViewColumn(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<number, string> {
    const cached = this._groupFingerprintByViewColumnCache.get(byRef);
    if (cached) {
      return cached;
    }

    const fingerprints = new Map<number, string>();

    for (const [, entry] of byRef) {
      if (!fingerprints.has(entry.viewColumn)) {
        fingerprints.set(entry.viewColumn, entry.groupFingerprintClue);
      }
    }

    this._groupFingerprintByViewColumnCache.set(byRef, fingerprints);
    return fingerprints;
  }

  viewColumnsByGroupFingerprintClue(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<string, readonly number[]> {
    const cached = this._viewColumnsByGroupFingerprintCache.get(byRef);
    if (cached) {
      return cached;
    }

    const grouped = new Map<string, number[]>();
    for (const [
      viewColumn,
      fingerprintClue
    ] of this.groupFingerprintCluesByViewColumn(byRef)) {
      const viewColumns = grouped.get(fingerprintClue) ?? [];

      viewColumns.push(viewColumn);
      grouped.set(fingerprintClue, viewColumns);
    }

    this._viewColumnsByGroupFingerprintCache.set(byRef, grouped);
    return grouped;
  }

  entriesByViewColumnAndGlobalRef(
    byRef: Map<Tab, TabEntrySnapshot>
  ): Map<string, TabEntrySnapshot> {
    const cached = this._byViewColumnAndGlobalRefCache.get(byRef);
    if (cached) {
      return cached;
    }

    const lookup = new Map<string, TabEntrySnapshot>();

    for (const [, entry] of byRef) {
      lookup.set(
        TabChangeComputationCache._createViewColumnGlobalRefKey(
          entry.viewColumn,
          entry.globalRefClue
        ),
        entry
      );
    }

    this._byViewColumnAndGlobalRefCache.set(byRef, lookup);
    return lookup;
  }

  diffFull(
    newEntry: TabEntrySnapshot,
    oldEntry: TabEntrySnapshot
  ): Set<TabChangeProperty | 'viewColumn' | 'index'> {
    const cached = this._getCachedDiff(this._fullDiffCache, newEntry, oldEntry);
    if (cached) {
      return cached;
    }

    const changed = computeDiffFull(newEntry, oldEntry);
    this._setCachedDiff(this._fullDiffCache, newEntry, oldEntry, changed);
    return changed;
  }

  diffProperties(
    newEntry: TabEntrySnapshot,
    oldEntry: TabEntrySnapshot
  ): Set<TabChangeProperty> {
    const cached = this._getCachedDiff(
      this._propertyDiffCache,
      newEntry,
      oldEntry
    );
    if (cached) {
      return cached;
    }

    const fullDiff = this.diffFull(newEntry, oldEntry);
    const changed = new Set<TabChangeProperty>();

    for (const property of fullDiff) {
      if (property === 'viewColumn' || property === 'index') {
        continue;
      }

      changed.add(property);
    }

    this._setCachedDiff(this._propertyDiffCache, newEntry, oldEntry, changed);
    return changed;
  }

  private _getCachedDiff<T>(
    cache: WeakMap<TabEntrySnapshot, WeakMap<TabEntrySnapshot, T>>,
    newEntry: TabEntrySnapshot,
    oldEntry: TabEntrySnapshot
  ): T | null {
    return cache.get(newEntry)?.get(oldEntry) ?? null;
  }

  private _setCachedDiff<T>(
    cache: WeakMap<TabEntrySnapshot, WeakMap<TabEntrySnapshot, T>>,
    newEntry: TabEntrySnapshot,
    oldEntry: TabEntrySnapshot,
    value: T
  ): void {
    const byOldEntry =
      cache.get(newEntry) ?? new WeakMap<TabEntrySnapshot, T>();

    byOldEntry.set(oldEntry, value);
    cache.set(newEntry, byOldEntry);
  }

  private static _createViewColumnGlobalRefKey(
    viewColumn: number,
    globalRefClue: string
  ): string {
    return `${viewColumn}\0${globalRefClue}`;
  }
}
