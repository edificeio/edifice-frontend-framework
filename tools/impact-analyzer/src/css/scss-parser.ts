import type { AtRule, Container, Rule } from 'postcss';
import scss from 'postcss-scss';

/** Splits a selector on top-level commas only — never inside `[...]`/`(...)`/quotes. */
function splitTopLevelCommaGroups(selector: string): string[] {
  const groups: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let current = '';

  for (const char of selector) {
    if (quote) {
      current += char;
      if (char === quote) quote = null;
      continue;
    }
    if (char === '"' || char === "'") {
      quote = char;
      current += char;
      continue;
    }
    if (char === '(' || char === '[') depth++;
    if (char === ')' || char === ']') depth--;
    if (char === ',' && depth === 0) {
      groups.push(current.trim());
      current = '';
      continue;
    }
    current += char;
  }
  if (current.trim()) groups.push(current.trim());
  return groups;
}

/**
 * Resolves one rule's own selector against its already-resolved ancestor
 * selectors: `&` is substituted textually (BEM suffixing, pseudo-classes,
 * attribute selectors); a plain nested selector without `&` is
 * descendant-combined, matching how Sass itself compiles nesting.
 */
function resolveSelectorGroups(
  ownSelector: string,
  ancestors: string[],
): string[] {
  const ownGroups = splitTopLevelCommaGroups(ownSelector);
  const parents = ancestors.length ? ancestors : [''];
  const resolved: string[] = [];

  for (const group of ownGroups) {
    if (group.includes('&')) {
      for (const parent of parents)
        resolved.push(group.split('&').join(parent));
    } else if (ancestors.length) {
      for (const parent of parents)
        resolved.push(parent ? `${parent} ${group}` : group);
    } else {
      resolved.push(group);
    }
  }
  return resolved;
}

/**
 * Parses a `.scss` source and returns every fully-resolved selector found
 * (nesting flattened). Not a full Sass compiler — @media/@include etc. are
 * transparently descended into without altering the selector chain, which
 * is good enough for extracting class names (plan §5.2 accepts partial
 * confidence over full Sass semantics here).
 */
export function parseScssSelectors(source: string): string[] {
  const root = scss.parse(source);
  const resolvedSelectors: string[] = [];

  function walk(container: Container, ancestors: string[]): void {
    container.each((child) => {
      if (child.type === 'rule') {
        const rule = child as Rule;
        const resolved = resolveSelectorGroups(rule.selector, ancestors);
        resolvedSelectors.push(...resolved);
        walk(rule, resolved);
      } else if (child.type === 'atrule') {
        walk(child as AtRule, ancestors);
      }
    });
  }

  walk(root, []);
  return resolvedSelectors;
}
