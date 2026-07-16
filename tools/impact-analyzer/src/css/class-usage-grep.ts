// Plan §5.2's own suggested blocklist — kept deliberately short: the goal is
// to catch the most obvious collision-prone utility/state words, not to
// second-guess every plausible class name.
const GENERIC_CLASS_NAMES = new Set([
  'active',
  'open',
  'disabled',
  'header',
  'footer',
  'icon',
]);

/**
 * Short or very generic class names (state modifiers, layout helpers) are
 * likely to appear all over an app's code for unrelated reasons — grepping
 * them proves little, so they're marked low confidence rather than
 * silently treated the same as a specific component class.
 */
export function classConfidence(className: string): 'high' | 'low' {
  if (className.length < 5) return 'low';
  if (GENERIC_CLASS_NAMES.has(className)) return 'low';
  return 'high';
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Matches a class name as a standalone token inside `className="a b c"`
 * literals and `clsx(...)` call arguments (string literals or object
 * keys) — bounded so "dropdown-item" never matches inside
 * "dropdown-item-large". Deliberately regex-based, not a JS AST pass
 * (plan §5.2: this is a grep, not meant to be exhaustive).
 */
function buildClassTokenRegex(className: string): RegExp {
  const boundary = String.raw`[\s"'\`{}(),:]`;
  return new RegExp(
    `(?:^|${boundary})${escapeRegExp(className)}(?=$|${boundary})`,
    'g',
  );
}

export interface SourceFileContent {
  path: string;
  content: string;
}

export interface AppClassUsage {
  matchedSelectors: string[];
  files: string[];
  matchCount: number;
}

export function findClassUsageInApp(
  classNames: string[],
  sourceFiles: SourceFileContent[],
): AppClassUsage | null {
  const matchedSelectors = new Set<string>();
  const files = new Set<string>();
  let matchCount = 0;

  for (const className of classNames) {
    const regex = buildClassTokenRegex(className);
    for (const file of sourceFiles) {
      const matches = file.content.match(regex);
      if (matches && matches.length > 0) {
        matchedSelectors.add(className);
        files.add(file.path);
        matchCount += matches.length;
      }
    }
  }

  if (matchedSelectors.size === 0) return null;
  return {
    matchedSelectors: [...matchedSelectors],
    files: [...files],
    matchCount,
  };
}
