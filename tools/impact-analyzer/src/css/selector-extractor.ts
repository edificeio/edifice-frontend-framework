import selectorParser from 'postcss-selector-parser';

/** A Sass interpolation like `.#{$variant}` isn't a literal, greppable class name. */
function isSassInterpolation(className: string): boolean {
  return className.includes('#{');
}

/**
 * Extracts real class tokens from resolved selectors, discarding
 * pseudo-classes/elements, attribute selectors, tags, ids, and Sass
 * interpolations — those are never a literal `className` value in React.
 */
export function extractClassNames(resolvedSelectors: string[]): string[] {
  const classes = new Set<string>();
  const parser = selectorParser((selectors) => {
    selectors.walkClasses((classNode) => {
      if (!isSassInterpolation(classNode.value)) classes.add(classNode.value);
    });
  });

  for (const selector of resolvedSelectors) {
    try {
      parser.processSync(selector);
    } catch {
      // A handful of resolved selectors can be invalid standalone CSS
      // (rare Sass-specific edge cases) — skip rather than abort the scan.
    }
  }

  return [...classes].sort();
}
