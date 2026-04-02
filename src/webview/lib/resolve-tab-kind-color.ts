import { TabKindColorRule } from '../../types/config';

/**
 * Resolves the color for a tab by finding the first matching rule.
 *
 * Rules are evaluated in order. A rule matches when:
 * - `rule.kind` matches the tab's kind (case-insensitive)
 * - `rule.pattern` (if provided) matches the tab's label as a regex
 *
 * Returns the matched color string, or `undefined` if no rule matches.
 */
export function resolveTabKindColor(
  rules: TabKindColorRule[],
  kind: string,
  label: string
): string | undefined {
  const kindLower = kind.toLowerCase();

  for (const rule of rules) {
    if (rule.kind.toLowerCase() !== kindLower) {
      continue;
    }

    if (rule.pattern) {
      try {
        const regex = new RegExp(rule.pattern, 'i');
        if (!regex.test(label)) {
          continue;
        }
      } catch {
        // Invalid regex — skip this rule
        continue;
      }
    }

    return rule.color;
  }

  return undefined;
}
