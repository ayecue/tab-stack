export interface GitBranchChangeEvent {
  repository: string;
  previousBranch: string | null;
  currentBranch: string | null;
}

export interface GitRepositoryOpenEvent {
  repository: string;
  currentBranch: string | null;
}
