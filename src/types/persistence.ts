import { TabStateFileContent } from './tab-manager';

export interface PersistenceHandler {
  load: () => Promise<void>;
  save: (data: TabStateFileContent) => void;
  write: (data: TabStateFileContent) => Promise<void>;
  get(): TabStateFileContent | null;
  reset: () => void;
}
