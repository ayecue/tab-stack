import { Disposable, EventEmitter, extensions } from 'vscode';

import { GitBranchChangeEvent } from '../types/git';
import { API, GitExtension, Repository } from '../types/git-extension';
import { ConfigService } from './config';
export { GitBranchChangeEvent } from '../types/git';

export class GitService implements Disposable {
  private _onDidChangeBranch: EventEmitter<GitBranchChangeEvent>;
  private _gitAPI: API | null = null;
  private _disposables: Disposable[];
  private _currentBranch: string | null = null;
  private _currentRepository: Repository | null = null;
  private _repositoryListener: Disposable | null = null;
  private _configService: ConfigService;

  constructor(configService: ConfigService) {
    this._configService = configService;
    this._onDidChangeBranch = new EventEmitter<GitBranchChangeEvent>();
    this._disposables = [this._onDidChangeBranch];
    this._gitAPI = null;
    this._currentBranch = null;
    this._currentRepository = null;
    this._repositoryListener = null;
  }

  get onDidChangeBranch() {
    return this._onDidChangeBranch.event;
  }

  async initialize(): Promise<boolean> {
    try {
      const gitExtension = extensions.getExtension<GitExtension>('vscode.git');

      if (!gitExtension) {
        console.warn('Git extension not found');
        return false;
      }

      if (!gitExtension.isActive) {
        await gitExtension.activate();
      }

      this._gitAPI = gitExtension.exports.getAPI(1);

      this._disposables.push(
        this._gitAPI.onDidOpenRepository(() => this.updateRepository())
      );
      this._disposables.push(
        this._gitAPI.onDidCloseRepository(() => this.updateRepository())
      );

      this.updateRepository();

      return true;
    } catch (error) {
      console.error('Failed to initialize git service:', error);
      return false;
    }
  }

  updateRepository(): void {
    this._clearCurrentRepository();

    if (!this._gitAPI) {
      return;
    }

    const workspacePath = this._configService.getMasterWorkspaceFolder();

    if (!workspacePath) {
      return;
    }

    const repository = this._gitAPI.repositories.find(
      (repo) => repo.rootUri.toString() === workspacePath
    );

    if (repository) {
      this._attachToRepository(repository);
    }
  }

  getCurrentBranch(): string | null {
    return this._currentBranch;
  }

  private _attachToRepository(repository: Repository): void {
    if (
      this._currentRepository &&
      this._currentRepository.rootUri.toString() ===
        repository.rootUri.toString()
    ) {
      return; // Already monitoring this repository
    }

    // Clear any existing listener
    this._clearCurrentRepository();

    // Set new repository
    this._currentRepository = repository;
    this._currentBranch = this._getBranchName(repository);

    // Listen for changes to this repository's state
    this._repositoryListener = repository.state.onDidChange(() => {
      this._onRepositoryChanged(repository);
    });

    this._disposables.push(this._repositoryListener);
  }

  private _clearCurrentRepository(): void {
    if (this._repositoryListener) {
      this._repositoryListener.dispose();
      this._repositoryListener = null;
    }
    this._currentRepository = null;
    this._currentBranch = null;
  }

  private _onRepositoryChanged(repository: Repository): void {
    const repoPath = repository.rootUri.toString();
    const previousBranch = this._currentBranch;
    const currentBranch = this._getBranchName(repository);

    // Only fire event if branch actually changed
    if (previousBranch !== currentBranch) {
      this._currentBranch = currentBranch;

      this._onDidChangeBranch.fire({
        repository: repoPath,
        previousBranch,
        currentBranch
      });
    }
  }

  private _getBranchName(repository: Repository): string | null {
    return repository.state.HEAD?.name || null;
  }

  dispose() {
    this._clearCurrentRepository();

    for (const disposable of this._disposables) {
      disposable.dispose();
    }
    this._disposables = [];

    this._gitAPI = null;
  }
}
