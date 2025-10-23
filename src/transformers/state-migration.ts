import { transform as v0ToV1 } from '../transformers/state-migration/v0';
import { TabStateFileContent } from '../types/tab-manager';

export function transform(payload: { version?: number }): TabStateFileContent {
  if (payload.version == null) {
    return transform(v0ToV1(payload));
  }

  return payload as TabStateFileContent;
}
