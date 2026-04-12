import { Tab } from 'vscode';

import { AssociatedTabInstance } from './tabs';

export type TabCreationEvent =
  | { type: 'TAB_FOUND'; tab: Tab }
  | { type: 'EDITOR_FOUND'; handle: AssociatedTabInstance }
  | { type: 'NEXT_TICK' }
  | { type: 'TIMEOUT' }
  | { type: 'COMMAND_FAILED'; error: any };
