import { describe, expect, it } from 'vitest';

import { TabKindColorRule } from '../../../src/types/config';
import { resolveTabKindColor } from '../../../src/webview/lib/resolve-tab-kind-color';

describe('resolveTabKindColor', () => {
  const rules: TabKindColorRule[] = [
    { kind: 'tabInputText', color: '#2472c8' },
    { kind: 'tabInputText', color: '#ff0000', pattern: '\\.test\\.' },
    { kind: 'tabInputTerminal', color: '#3b8eea' },
    { kind: 'unknown', color: '#ff6161' },
  ];

  it('matches by kind when no pattern is specified', () => {
    expect(resolveTabKindColor(rules, 'tabInputTerminal', 'bash')).toBe('#3b8eea');
  });

  it('returns undefined when no rule matches', () => {
    expect(resolveTabKindColor(rules, 'tabInputWebview', 'Preview')).toBeUndefined();
  });

  it('matches case-insensitively on kind', () => {
    expect(resolveTabKindColor(rules, 'TabInputTerminal', 'zsh')).toBe('#3b8eea');
  });

  it('returns the first matching rule (kind-only before pattern)', () => {
    // The first tabInputText rule (no pattern) matches before the pattern rule
    expect(resolveTabKindColor(rules, 'tabInputText', 'app.test.ts')).toBe('#2472c8');
  });

  it('matches a pattern rule when listed first', () => {
    const patternFirst: TabKindColorRule[] = [
      { kind: 'tabInputText', color: '#ff0000', pattern: '\\.test\\.' },
      { kind: 'tabInputText', color: '#2472c8' },
    ];
    expect(resolveTabKindColor(patternFirst, 'tabInputText', 'app.test.ts')).toBe('#ff0000');
  });

  it('falls through pattern rule when label does not match', () => {
    const patternFirst: TabKindColorRule[] = [
      { kind: 'tabInputText', color: '#ff0000', pattern: '\\.test\\.' },
      { kind: 'tabInputText', color: '#2472c8' },
    ];
    expect(resolveTabKindColor(patternFirst, 'tabInputText', 'app.ts')).toBe('#2472c8');
  });

  it('skips rules with invalid regex patterns', () => {
    const badRules: TabKindColorRule[] = [
      { kind: 'tabInputText', color: '#ff0000', pattern: '[invalid' },
      { kind: 'tabInputText', color: '#2472c8' },
    ];
    expect(resolveTabKindColor(badRules, 'tabInputText', 'file.ts')).toBe('#2472c8');
  });

  it('returns undefined for empty rules array', () => {
    expect(resolveTabKindColor([], 'tabInputText', 'file.ts')).toBeUndefined();
  });
});
