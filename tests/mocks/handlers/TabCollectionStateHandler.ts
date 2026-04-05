import { vi } from 'vitest';
import type { QuickSlotAssignments } from '../../../src/types/tab-manager';

export class MockTabCollectionStateHandler {
  public groups: Record<string, any> = {};
  public history: Record<string, any> = {};
  public addons: Record<string, any> = {};
  public quickSlots: QuickSlotAssignments = {};

  public initialize = vi.fn();
  public addGroup = vi.fn();
  public updateGroup = vi.fn();
  public renameGroup = vi.fn();
  public removeGroup = vi.fn();
  public loadGroup = vi.fn();
  public addHistory = vi.fn();
  public pruneHistory = vi.fn();
  public removeHistory = vi.fn();
  public addAddon = vi.fn();
  public renameAddon = vi.fn();
  public removeAddon = vi.fn();
  public setQuickSlot = vi.fn();
  public getQuickSlotAssignment = vi.fn();
  public onDidChangeState = vi.fn();
  public dispose = vi.fn();

  constructor() {
    this.initialize.mockReturnValue(undefined);
    this.addGroup.mockReturnValue(undefined);
    this.updateGroup.mockReturnValue(undefined);
    this.renameGroup.mockReturnValue(undefined);
    this.removeGroup.mockReturnValue(undefined);
    this.loadGroup.mockReturnValue(undefined);
    this.addHistory.mockReturnValue(undefined);
    this.pruneHistory.mockReturnValue(undefined);
    this.removeHistory.mockReturnValue(undefined);
    this.addAddon.mockReturnValue(undefined);
    this.renameAddon.mockReturnValue(undefined);
    this.removeAddon.mockReturnValue(undefined);
    this.setQuickSlot.mockReturnValue(undefined);
    this.getQuickSlotAssignment.mockReturnValue(null);
    this.onDidChangeState.mockReturnValue({ dispose: vi.fn() });
  }
}
