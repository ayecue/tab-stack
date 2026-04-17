import { describe, expect, it } from 'vitest';

import { auditAnalyzerScenarioSemantics } from '../../helpers/tab-change-pipeline-semantic-audit';
import { runAnalyzerScenario } from '../../helpers/tab-change-pipeline-analyzer';

describe('tab/group event pipeline delta parity', () => {
  it('AD3 carries the README.md activity flip as a move-and-patch in tabRewireDeltas', () => {
    const result = runAnalyzerScenario('AD3: join all groups (5vc-duplicate)');
    const readmeDeltas = result.tabRewireDeltas
      .filter(
        (delta) =>
          delta.before?.globalRefClue === 'text:file:///workspace/README.md' ||
          delta.after?.globalRefClue === 'text:file:///workspace/README.md',
      )
      .map((delta) => ({
        kind: delta.kind,
        beforeExactKeyClue: delta.before?.exactKeyClue ?? null,
        afterExactKeyClue: delta.after?.exactKeyClue ?? null,
        beforeActive: delta.before?.isActive ?? null,
        afterActive: delta.after?.isActive ?? null,
        changed: Object.keys(delta.properties).sort(),
      }));

    expect(readmeDeltas).toContainEqual({
      kind: 'move-and-patch',
      beforeExactKeyClue: '1:text:file:///workspace/README.md',
      afterExactKeyClue: '4:text:file:///workspace/README.md',
      beforeActive: true,
      afterActive: false,
      changed: ['isActive'],
    });
  });

  it('AD3 is semantically clean after canonicalizing collapsed move-and-patch updates', () => {
    const finding = auditAnalyzerScenarioSemantics(
      'AD3: join all groups (5vc-duplicate)',
    );

    expect(finding.missingUpdates).toEqual([]);
    expect(finding.extraUpdates).toEqual([]);
    expect(finding.suspicious).toBe(false);
  });

  it('AM3 exposes the LICENSE endpoint delta shape on tabRewireDeltas', () => {
    const result = runAnalyzerScenario('AM3: join two groups (4vc-rightmost-duplicate)');
    const licenseDeltas = result.tabRewireDeltas
      .filter(
        (delta) =>
          delta.before?.globalRefClue === 'text:file:///workspace/LICENSE' ||
          delta.after?.globalRefClue === 'text:file:///workspace/LICENSE',
      )
      .map((delta) => ({
        kind: delta.kind,
        beforeExactKeyClue: delta.before?.exactKeyClue ?? null,
        afterExactKeyClue: delta.after?.exactKeyClue ?? null,
        beforeActive: delta.before?.isActive ?? null,
        afterActive: delta.after?.isActive ?? null,
        changed: Object.keys(delta.properties).sort(),
      }));

    expect(licenseDeltas).toContainEqual({
      kind: 'move',
      beforeExactKeyClue: '3:text:file:///workspace/LICENSE',
      afterExactKeyClue: '3:text:file:///workspace/LICENSE',
      beforeActive: true,
      afterActive: true,
      changed: [],
    });
  });

  it('AM3 is semantically clean after canonicalizing same-clue move endpoints', () => {
    const finding = auditAnalyzerScenarioSemantics(
      'AM3: join two groups (4vc-rightmost-duplicate)',
    );

    expect(finding.missingUpdates).toEqual([]);
    expect(finding.extraUpdates).toEqual([]);
    expect(finding.suspicious).toBe(false);
  });
});