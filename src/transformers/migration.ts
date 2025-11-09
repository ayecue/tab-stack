import { window } from 'vscode';

import { transform as v0ToV1 } from '../transformers/migration/v0';
import {
  createDefaultTabStateFileContent,
  TabStateFileContent
} from '../types/tab-manager';

export function transform(payload: { version?: number }): TabStateFileContent {
  try {
    if (payload.version == null) {
      return transform(v0ToV1(payload));
    }

    return payload as TabStateFileContent;
  } catch (error) {
    window.showErrorMessage(
      'Failed to migrate saved tab state - starting with a fresh state.'
    );
    return createDefaultTabStateFileContent();
  }
}
