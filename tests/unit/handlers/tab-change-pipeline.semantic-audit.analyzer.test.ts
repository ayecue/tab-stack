import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  buildAnalyzerSemanticAuditReport,
  renderAnalyzerSemanticAuditMarkdown,
} from '../../helpers/tab-change-pipeline-semantic-audit';

const describeSemanticAudit = process.env.TAB_STACK_SEMANTIC_AUDIT === '1'
  ? describe
  : describe.skip;

describeSemanticAudit('tab/group event pipeline semantic analyzer audit', () => {
  it('writes a deterministic semantic mismatch report', () => {
    const report = buildAnalyzerSemanticAuditReport();
    const outputDir = path.resolve(
      __dirname,
      '../../../tools/vscode-event-analyzer/output',
    );
    const jsonPath = path.join(outputDir, 'pipeline-semantic-audit.json');
    const markdownPath = path.join(outputDir, 'pipeline-semantic-audit.md');

    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(markdownPath, `${renderAnalyzerSemanticAuditMarkdown(report)}\n`);

    console.log(
      `Semantic audit report written to ${path.relative(process.cwd(), markdownPath)}`,
    );

    expect(report.summary.totalScenarios).toBeGreaterThan(0);
    expect(report.summary.totalScenarios).toBe(
      report.summary.cleanScenarios + report.summary.suspiciousScenarios,
    );
  });
});