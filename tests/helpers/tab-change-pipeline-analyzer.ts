import { TabChangeBatchCoordinator } from '../../src/handlers/tab-change-batch-coordinator';
import { TabChangeResolver } from '../../src/handlers/tab-change';
import type {
  ResolvedTabChangeEvent,
  TabMoved,
  TabUpdated,
} from '../../src/types/tab-change-proxy';
import { loadAnalyzerScenario } from './event-analyzer-fixture';

export interface NormalizedMove {
  label: string;
  fromViewColumn: number;
  toViewColumn: number;
  fromIndex: number;
  toIndex: number;
  changed: string[];
}

export interface NormalizedUpdate {
  label: string;
  changed: string[];
}

export interface NormalizedResult {
  created: string[];
  closed: string[];
  moved: NormalizedMove[];
  updated: NormalizedUpdate[];
}

export function getAnalyzerScenarioCode(name: string): string {
  return name.split(':', 1)[0].trim();
}

export function runAnalyzerScenario(name: string): ResolvedTabChangeEvent {
  const fixture = loadAnalyzerScenario(name);
  const resolver = new TabChangeResolver();
  const coordinator = new TabChangeBatchCoordinator(resolver);

  fixture.observedEvents.forEach((observed) => coordinator.record(observed));

  return coordinator.buildResolvedEvent();
}

export function labels(tabs: readonly { label: string }[]): string[] {
  return tabs.map((tab) => tab.label);
}

export function findMovedTab(
  result: ResolvedTabChangeEvent,
  label: string,
): TabMoved | undefined {
  return result.moved.find((move) => move.tab.label === label);
}

export function findUpdatedTab(
  result: ResolvedTabChangeEvent,
  label: string,
): TabUpdated | undefined {
  return result.updated.find((update) => update.tab.label === label);
}

export function normalizeResolvedResult(
  result: ResolvedTabChangeEvent,
): NormalizedResult {
  return {
    created: [...result.created.map((tab) => tab.label)].sort(compareLabels),
    closed: [...result.closed.map((tab) => tab.label)].sort(compareLabels),
    moved: result.moved
      .map((move) => ({
        label: move.tab.label,
        fromViewColumn: move.fromViewColumn,
        toViewColumn: move.toViewColumn,
        fromIndex: move.fromIndex,
        toIndex: move.toIndex,
        changed: [...move.changed].sort(),
      }))
      .sort(compareMoves),
    updated: result.updated
      .map((update) => ({
        label: update.tab.label,
        changed: [...update.changed].sort(),
      }))
      .sort(compareUpdates),
  };
}

function compareLabels(left: string, right: string): number {
  return left.toLowerCase().localeCompare(right.toLowerCase());
}

function compareMoves(left: NormalizedMove, right: NormalizedMove): number {
  return (
    left.fromViewColumn - right.fromViewColumn ||
    left.fromIndex - right.fromIndex ||
    left.toViewColumn - right.toViewColumn ||
    left.toIndex - right.toIndex ||
    compareLabels(left.label, right.label) ||
    left.changed.join(',').localeCompare(right.changed.join(','))
  );
}

function compareUpdates(left: NormalizedUpdate, right: NormalizedUpdate): number {
  return (
    compareLabels(left.label, right.label) ||
    left.changed.join(',').localeCompare(right.changed.join(','))
  );
}