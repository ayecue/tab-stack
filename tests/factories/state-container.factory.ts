import { Factory } from 'fishery';
import { createEmptyStateContainer, StateContainer } from '../../src/types/tab-manager';
import { TabState } from '../../src/types/tabs';
import { tabStateFactory } from './tab-state.factory';

export interface StateContainerFactoryParams {
  tabState?: TabState;
  overrides?: Partial<StateContainer>;
}

export const stateContainerFactory = Factory.define<StateContainer, StateContainerFactoryParams>(({
  params,
  transientParams
}) => {
  const defaultStateContainer = createEmptyStateContainer();

  defaultStateContainer.state.tabState = transientParams.tabState ?? tabStateFactory.build();

  return {
    ...defaultStateContainer,
    ...params,
    state: {
      ...defaultStateContainer.state,
      ...(transientParams.overrides?.state ?? {})
    }
  };
});

export default stateContainerFactory;