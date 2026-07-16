import { ts } from 'ts-morph';

/**
 * Reprints source text through the TS compiler's own printer with comments
 * stripped — not a regex strip, which would corrupt a string literal that
 * happens to contain "//" or "/*" (verified by spike). Reformatting
 * (indentation, semicolons, line breaks) and comments disappear; anything
 * else in the AST survives untouched.
 */
export function normalizeForComparison(
  sourceText: string,
  fileName = 'file.tsx',
): string {
  const sourceFile = ts.createSourceFile(
    fileName,
    sourceText,
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TSX,
  );
  const printer = ts.createPrinter({ removeComments: true });
  return printer.printFile(sourceFile);
}

/**
 * True when two versions of a file differ only in formatting/comments —
 * NOT in identifier renames: renaming a local variable still changes the
 * printed text and will report `false` here. That's a deliberate
 * over-signal (flagged as a real body change) rather than attempting a
 * semantic rename-aware diff, which risks masking a real logic change
 * disguised as a rename (plan §12).
 *
 * Also NOT filtered: a string literal's quote character is preserved
 * verbatim by the TS printer, so a single-quote/double-quote-only change
 * would report `false` too — a non-issue in this repo since Prettier's
 * `singleQuote: true` keeps quoting consistent across commits.
 */
export function isCosmeticOnlyChange(
  baseText: string,
  headText: string,
  fileName = 'file.tsx',
): boolean {
  return (
    normalizeForComparison(baseText, fileName) ===
    normalizeForComparison(headText, fileName)
  );
}
