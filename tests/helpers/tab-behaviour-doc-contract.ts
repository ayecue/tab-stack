export type ValidationStatus = 'Proven' | 'Conditional' | 'Disproven';

export type DocVerifierKey =
  | 'tab-activation'
  | 'single-tab-close'
  | 'close-other-tabs'
  | 'open-file-active-group'
  | 'same-group-reorder'
  | 'cross-group-move'
  | 'move-to-new-group'
  | 'split-editor'
  | 'multi-tab-same-group'
  | 'multi-tab-cross-group'
  | 'multi-tab-new-group'
  | 'multi-tab-split'
  | 'duplicate-target-move'
  | 'last-tab-move-out'
  | 'last-tab-duplicate-move'
  | 'dirty-direct'
  | 'pin-direct'
  | 'preview-promotion'
  | 'group-activation'
  | 'group-close'
  | 'group-close-multiple'
  | 'group-create'
  | 'group-reorder'
  | 'group-merge'
  | 'no-direct-evidence';

export interface TabBehaviourSectionContract {
  heading: string;
  status: ValidationStatus;
  evidence: string[];
  verifier: DocVerifierKey;
}

export const AUXILIARY_ANALYZER_SCENARIO_CODES = [
  'I',
  'O',
  'P',
  'Q',
  'V1',
  'V2',
  'V3',
  'W1',
  'W2',
  'W3',
] as const;

export const TAB_BEHAVIOUR_SECTION_CONTRACTS: readonly TabBehaviourSectionContract[] = [
  {
    heading: 'User clicks on tab',
    status: 'Proven',
    evidence: ['H', 'AH1', 'AH2'],
    verifier: 'tab-activation',
  },
  {
    heading: 'User clicks on tab close button',
    status: 'Proven',
    evidence: ['B', 'J', 'AF1', 'AF2'],
    verifier: 'single-tab-close',
  },
  {
    heading: 'User presses on close other tabs',
    status: 'Proven',
    evidence: ['T1', 'T2', 'T3'],
    verifier: 'close-other-tabs',
  },
  {
    heading: 'User opens file in active Tab Group',
    status: 'Proven',
    evidence: ['A', 'AE1', 'AE2', 'AE3'],
    verifier: 'open-file-active-group',
  },
  {
    heading: 'User drags tab to new position within same Tab Group',
    status: 'Proven',
    evidence: ['D', 'K', 'AO'],
    verifier: 'same-group-reorder',
  },
  {
    heading: 'User drags tab to other existing Tab Group',
    status: 'Proven',
    evidence: ['C', 'N', 'S', 'AA1', 'AA2', 'AA3'],
    verifier: 'cross-group-move',
  },
  {
    heading: 'User drags tab to create new Tab Group',
    status: 'Proven',
    evidence: ['U1', 'U2', 'U3'],
    verifier: 'move-to-new-group',
  },
  {
    heading: 'User splits editor with active tab',
    status: 'Proven',
    evidence: ['R', 'AG1', 'AG2'],
    verifier: 'split-editor',
  },
  {
    heading: 'User selects multiple tabs and drags to new position within same Tab Group',
    status: 'Conditional',
    evidence: ['AN1', 'AN2', 'AN3'],
    verifier: 'multi-tab-same-group',
  },
  {
    heading: 'User selects multiple tabs and drags to other existing Tab Group',
    status: 'Conditional',
    evidence: ['AJ1', 'AJ2', 'AJ3'],
    verifier: 'multi-tab-cross-group',
  },
  {
    heading: 'User selects multiple tabs and drags to create new Tab Group',
    status: 'Conditional',
    evidence: ['AK1', 'AK2', 'AK3'],
    verifier: 'multi-tab-new-group',
  },
  {
    heading: 'User selects multiple tabs and splits editor',
    status: 'Conditional',
    evidence: ['AL1', 'AL2', 'AL3'],
    verifier: 'multi-tab-split',
  },
  {
    heading: 'User drags tab to existing Tab Group, while the Tab Group already has the same file open',
    status: 'Proven',
    evidence: ['AA1', 'AA2', 'AA3'],
    verifier: 'duplicate-target-move',
  },
  {
    heading: 'User drags last remaining tab out of a Tab Group',
    status: 'Proven',
    evidence: ['AB1', 'AB2', 'AB3'],
    verifier: 'last-tab-move-out',
  },
  {
    heading: 'User drags last remaining tab out of a Tab Group, target already has the same file open',
    status: 'Proven',
    evidence: ['AC1', 'AC2', 'AC3'],
    verifier: 'last-tab-duplicate-move',
  },
  {
    heading: 'User changes text in tab thus it becomes dirty',
    status: 'Proven',
    evidence: ['G'],
    verifier: 'dirty-direct',
  },
  {
    heading: 'User saves tab thus it becomes not dirty',
    status: 'Conditional',
    evidence: [],
    verifier: 'no-direct-evidence',
  },
  {
    heading: 'User pins tab',
    status: 'Proven',
    evidence: ['F'],
    verifier: 'pin-direct',
  },
  {
    heading: 'User unpins tab',
    status: 'Conditional',
    evidence: [],
    verifier: 'no-direct-evidence',
  },
  {
    heading: 'User double clicks on tab',
    status: 'Proven',
    evidence: ['AI1', 'AI2', 'AI3'],
    verifier: 'preview-promotion',
  },
  {
    heading: 'User clicks on tab group',
    status: 'Proven',
    evidence: ['X1', 'X2', 'X3'],
    verifier: 'group-activation',
  },
  {
    heading: 'User clicks on tab group close button',
    status: 'Proven',
    evidence: ['Y1', 'Y2', 'Y3'],
    verifier: 'group-close',
  },
  {
    heading: 'User creates new tab group',
    status: 'Proven',
    evidence: ['Z1', 'Z2', 'Z3'],
    verifier: 'group-create',
  },
  {
    heading: 'User drags tab group to new position',
    status: 'Proven',
    evidence: ['E', 'L', 'M'],
    verifier: 'group-reorder',
  },
  {
    heading: 'User drags tab group to other existing tab group, thus merging the two tab groups',
    status: 'Proven',
    evidence: ['AM1', 'AM2', 'AM3', 'AD1', 'AD2', 'AD3'],
    verifier: 'group-merge',
  },
  {
    heading: 'User closes tab group with multiple tabs, thus closing all tabs within the group',
    status: 'Proven',
    evidence: ['Y2', 'Y3'],
    verifier: 'group-close-multiple',
  },
] as const;