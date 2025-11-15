import { vi } from 'vitest';
import type { TabState } from '../../../src/types/tabs';
import { tabStateFileContentFactory } from '../../factories';

export class MockTabStateHandler {
  public createGroup = vi.fn();
  public renameGroup = vi.fn();
  public deleteGroup = vi.fn();
  public addCurrentStateToHistory = vi.fn();
  public deleteHistoryEntry = vi.fn();
  public loadHistoryState = vi.fn();
  public addToAddons = vi.fn();
  public renameAddon = vi.fn();
  public deleteAddon = vi.fn();
  public setQuickSlot = vi.fn();
  public getQuickSlotAssignment = vi.fn();
  public loadState = vi.fn();
  public forkState = vi.fn();
  public setState = vi.fn();
  public syncStateWithVSCode = vi.fn();
  public syncSelection = vi.fn();
  public exportStateFile = vi.fn();
  public importStateFile = vi.fn();
  public getState = vi.fn();
  public dispose = vi.fn();
  
  constructor(initialState?: TabState) {
    this.getState.mockReturnValue(initialState || {
      groups: {},
      addons: {},
      history: [],
      activeGroup: null,
      quickSlots: {}
    });
    
    this.createGroup.mockResolvedValue('group-1');
    this.renameGroup.mockResolvedValue(undefined);
    this.deleteGroup.mockResolvedValue(undefined);
    this.addCurrentStateToHistory.mockResolvedValue(undefined);
    this.deleteHistoryEntry.mockResolvedValue(undefined);
    this.loadHistoryState.mockResolvedValue(undefined);
    this.addToAddons.mockResolvedValue(undefined);
    this.renameAddon.mockResolvedValue(undefined);
    this.deleteAddon.mockResolvedValue(undefined);
    this.setQuickSlot.mockResolvedValue(undefined);
    this.getQuickSlotAssignment.mockReturnValue(null);
    this.loadState.mockResolvedValue(undefined);
    this.forkState.mockResolvedValue(undefined);
    this.setState.mockResolvedValue(undefined);
    this.syncStateWithVSCode.mockResolvedValue(undefined);
    this.syncSelection.mockResolvedValue(undefined);
    this.exportStateFile.mockResolvedValue(undefined);
    this.importStateFile.mockResolvedValue(undefined);
  }
  
  public updateState(state: TabState): void {
    this.getState.mockReturnValue(state);
  }
}
