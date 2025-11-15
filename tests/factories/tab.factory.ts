import { Factory } from 'fishery';
import { TabInfo, TabKind } from '../../src/types/tabs';

export interface TabFactoryParams {
  kind?: TabKind;
  uri?: string;
  label?: string;
  isActive?: boolean;
  isDirty?: boolean;
  isPinned?: boolean;
  viewColumn?: number;
  originalUri?: string;
  modifiedUri?: string;
}

export const tabFactory = Factory.define<TabInfo, TabFactoryParams>(({
  sequence,
  transientParams
}) => {
  const seq = sequence || 1;

  const kind = transientParams?.kind ?? TabKind.TabInputText;

  const base: Partial<TabInfo> = {
    label: transientParams?.label ?? `file-${seq}.ts`,
    isActive: transientParams?.isActive ?? false,
    isDirty: transientParams?.isDirty ?? false,
    isPinned: transientParams?.isPinned ?? false,
    viewColumn: transientParams?.viewColumn ?? 1,
    kind
  };

  if (kind === TabKind.TabInputTextDiff) {
    return {
      ...base,
      originalUri: transientParams?.originalUri ?? `file:///workspace/old-${seq}.ts`,
      modifiedUri: transientParams?.modifiedUri ?? `file:///workspace/new-${seq}.ts`
    } as TabInfo;
  }

  return {
    ...base,
    uri: transientParams?.uri ?? `file:///workspace/file-${seq}.ts`
  } as TabInfo;
});

export default tabFactory;