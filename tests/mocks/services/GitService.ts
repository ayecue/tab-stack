import { vi } from 'vitest';
import { EventEmitter } from 'vscode';

export class MockGitService {
  public getCurrentBranch = vi.fn();
  public updateRepository = vi.fn();
  public dispose = vi.fn();
  private _branchEmitter = new EventEmitter<any>();
  private _repoEmitter = new EventEmitter<any>();
  
  constructor() {
    this.getCurrentBranch.mockResolvedValue('main');
    this.updateRepository.mockResolvedValue(undefined);
  }
  
  public get onDidChangeBranch() {
    return this._branchEmitter.event;
  }
  
  public get onDidOpenRepository() {
    return this._repoEmitter.event;
  }
  
  public emitBranchChange(event: any): void {
    this._branchEmitter.fire(event);
  }
  
  public emitOpenRepository(event: any): void {
    this._repoEmitter.fire(event);
  }
}
