export interface GitBranchChangeEvent {
  repository: string;
  previousBranch: string | null;
  currentBranch: string | null;
}
