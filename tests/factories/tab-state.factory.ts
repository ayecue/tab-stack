import { Factory } from 'fishery';
import { TabState, TabGroupInfo, TabInfo } from '../../src/types/tabs';
import { tabFactory } from './tab.factory';

export interface TabStateFactoryParams {
  tabs?: TabInfo[];
  groups?: Record<number, TabGroupInfo>;
  activeGroup?: number | null;
}

export const tabStateFactory = Factory.define<TabState, TabStateFactoryParams>(({
  params,
  transientParams
}) => {
  const tabs = transientParams?.tabs ?? [tabFactory.build()];
  const group: TabGroupInfo = {
    viewColumn: 1,
    tabs,
    activeTab: tabs[0]
  };

  return {
    ...params,
    activeGroup: transientParams?.activeGroup ?? 1,
    tabGroups: transientParams?.groups ?? { 1: group }
  };
});

export default tabStateFactory;