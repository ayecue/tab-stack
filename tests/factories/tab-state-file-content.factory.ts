import { Factory } from 'fishery';
import { TabStateFileContent, createDefaultTabStateFileContent } from '../../src/types/tab-manager';

export const tabStateFileContentFactory = Factory.define<TabStateFileContent>(({
  params
}) => {
  const defaultFileContent = createDefaultTabStateFileContent();

  return {
    ...defaultFileContent,
    ...params as Partial<TabStateFileContent>
  };
});

export default tabStateFileContentFactory;