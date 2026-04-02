import { TabKindColorRule } from '../../types/config';

const regexCache = new WeakMap<TabKindColorRule, RegExp | null>();

function getCompiledRegex(rule: TabKindColorRule): RegExp | null {
  let cached = regexCache.get(rule);
  if (cached !== undefined) {
    return cached;
  }
  try {
    cached = new RegExp(rule.pattern!, 'i');
  } catch (e) {
    console.warn(
      `[resolveTabKindColor] Invalid regex pattern "${rule.pattern}" for kind "${rule.kind}":`,
      e
    );
    cached = null;
  }
  regexCache.set(rule, cached);
  return cached;
}

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
      const regex = getCompiledRegex(rule);
      if (!regex || !regex.test(label)) {
        continue;
      }
    }

    return rule.color;
  }

  return undefined;
}
