import type { DictionaryEntry, FlatFilePatchResult } from '../types.js';
import { normalizeForCompare } from './normalize-for-compare.js';

const VAR_LINE_RE = /^(\$([a-zA-Z0-9-]+):\s*)(.+?)(;.*)$/;

/** Patch of the flat files (_primitives.scss / _primitives-legacy.scss). */
export function patchFlatFile(
  existingText: string,
  entriesForThisFile: DictionaryEntry[],
): FlatFilePatchResult {
  const lines = existingText.split('\n');
  const byScssVar = new Map(entriesForThisFile.map((e) => [e.scssVar, e]));
  const matched = new Set<string>();
  const changes: FlatFilePatchResult['changes'] = [];

  const patchedLines = lines.map((line) => {
    const m = line.match(VAR_LINE_RE);
    if (!m) return line;
    const [, prefix, varName, currentValue, suffix] = m;
    const entry = byScssVar.get(varName);
    if (!entry) return line; // not in the Figma export -> leave as is, flagged elsewhere
    matched.add(varName);
    const current = currentValue.trim();
    const next = entry.resolvedValue.trim();
    if (normalizeForCompare(current) === normalizeForCompare(next)) return line;
    changes.push({ scssVar: varName, from: current, to: next });
    return `${prefix}${entry.resolvedValue}${suffix}`;
  });

  const newEntries = entriesForThisFile.filter((e) => !matched.has(e.scssVar));
  if (newEntries.length > 0) {
    if (patchedLines[patchedLines.length - 1] === '') patchedLines.pop();
    patchedLines.push(
      '',
      `// Added automatically from Figma on ${new Date().toISOString().slice(0, 10)}`,
    );
    for (const e of newEntries) {
      patchedLines.push(`$${e.scssVar}: ${e.resolvedValue};`);
    }
  }

  // Variables of the file that are no longer in Figma: we spot them without touching them.
  const removed: string[] = [];
  for (const line of lines) {
    const m = line.match(VAR_LINE_RE);
    if (m && !byScssVar.has(m[2])) removed.push(m[2]);
  }

  return { text: patchedLines.join('\n'), changes, added: newEntries, removed };
}
