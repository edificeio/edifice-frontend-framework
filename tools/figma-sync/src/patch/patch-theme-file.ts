import type { ThemeDotPathEntry, ThemeFilePatchResult } from '../types.js';

interface Container {
  openLine: number;
  closeLine?: number;
  indent: string;
}

interface NewEntry {
  segments: string[];
  value: string;
  dotPath: string;
}

const OPEN_RE = /^(\s*)([a-zA-Z0-9%]+):\s*\($/;
const LEAF_RE = /^(\s*)([a-zA-Z0-9%]+):\s*(.+?)(,?)$/;
const CLOSE_RE = /^(\s*)\),?$/;

/**
 * Patches the theme files (nested SCSS maps). Updates the existing leaves
 * in place, and recursively creates the missing sub-maps for the
 * entirely new tokens (e.g. color.app.*) -- positioned among their
 * already-present siblings while respecting the order of appearance in the Figma JSON
 * (never alphabetical order, never "at the end" by default).
 */
export function patchThemeFile(
  existingText: string,
  dotPathEntries: ThemeDotPathEntry[],
): ThemeFilePatchResult {
  const lines = existingText.split('\n');
  const byDotPath = new Map(dotPathEntries.map((e) => [e.dotPath, e]));
  const matched = new Set<string>();
  const changes: ThemeFilePatchResult['changes'] = [];

  // Figma index (order of appearance in the JSON, preserved by Object.keys on the
  // main() side): the only reference used to position a new section
  // relative to its future siblings -- never "at the end" by default.
  const figmaIndex = new Map(dotPathEntries.map((e, i) => [e.dotPath, i]));

  // Stack of the currently open keys, with the line where each "key: (" map was opened.
  const stack: string[] = [];
  // pathString -> { openLine, closeLine, indent } to know where to insert the new keys.
  const containers = new Map<string, Container>();
  // dotPath (matched only) -> line where the leaf is located in the file.
  const leafLines = new Map<string, number>();

  const patchedLines = lines.map((line, idx) => {
    const openMatch = line.match(OPEN_RE);
    if (openMatch) {
      stack.push(openMatch[2]);
      containers.set(stack.join('.'), { openLine: idx, indent: openMatch[1] });
      return line;
    }

    const closeMatch = line.match(CLOSE_RE);
    if (closeMatch && stack.length > 0) {
      const key = stack.join('.');
      const container = containers.get(key);
      if (container) container.closeLine = idx;
      stack.pop();
      return line;
    }

    const leafMatch = line.match(LEAF_RE);
    if (leafMatch && stack.length > 0) {
      const [, indent, key, value, trailingComma] = leafMatch;
      const dotPath = [...stack, key].join('.');
      const entry = byDotPath.get(dotPath);
      if (!entry) return line;
      matched.add(dotPath);
      leafLines.set(dotPath, idx);
      if (value.trim() === entry.value.trim()) return line;
      changes.push({ dotPath, from: value.trim(), to: entry.value.trim() });
      return `${indent}${key}: ${entry.value}${trailingComma}`;
    }

    return line;
  });

  /** Minimal Figma index among the already-present descendants of a container -- used
   *  to compare an existing section with a new section to know which one
   *  comes first in the Figma order. */
  function minFigmaIndexUnder(containerPath: string): number {
    let min = Infinity;
    const prefix = `${containerPath}.`;
    for (const dotPath of matched) {
      if (dotPath === containerPath || dotPath.startsWith(prefix)) {
        min = Math.min(min, figmaIndex.get(dotPath)!);
      }
    }
    return min;
  }

  const newEntries = dotPathEntries.filter((e) => !matched.has(e.dotPath));

  // Groups each new entry under the deepest existing container
  // that can be found by walking up its path (e.g. "color.app.communicate"
  // -> anchor "color", remaining segments ["app", "communicate"]: "app" must
  // be created, "communicate" is its leaf inside).
  const byAnchor = new Map<string, NewEntry[]>();
  const unplaced: ThemeFilePatchResult['unplaced'] = [];
  for (const e of newEntries) {
    const segments = e.dotPath.split('.');
    let anchorLen = segments.length - 1;
    while (
      anchorLen > 0 &&
      !containers.has(segments.slice(0, anchorLen).join('.'))
    ) {
      anchorLen--;
    }
    const anchorPath = segments.slice(0, anchorLen).join('.');
    if (!containers.has(anchorPath)) {
      // Even the expected root container (color/font/radius) is missing from the file:
      // we don't invent it, we flag it.
      unplaced.push({
        parent: segments.slice(0, -1).join('.'),
        leaves: [{ leaf: segments.at(-1)!, value: e.value }],
      });
      continue;
    }
    if (!byAnchor.has(anchorPath)) byAnchor.set(anchorPath, []);
    byAnchor.get(anchorPath)!.push({
      segments: segments.slice(anchorLen),
      value: e.value,
      dotPath: e.dotPath,
    });
  }

  /** Recursively builds the lines of a "name: ( ... )," block, respecting
   *  the Figma order of appearance of the leaves/sub-blocks (no alphabetical order). */
  function buildBlockLines(
    name: string,
    entries: NewEntry[],
    indent: string,
  ): string[] {
    const childIndent = `${indent}  `;
    const nested = new Map<string, NewEntry[]>(); // first segment -> sub-entries, order = first appearance
    for (const e of entries) {
      if (e.segments.length === 1) continue;
      const key = e.segments[0];
      if (!nested.has(key)) nested.set(key, []);
      nested.get(key)!.push({ ...e, segments: e.segments.slice(1) });
    }
    const outLines = [`${indent}${name}: (`];
    const emitted = new Set<string>();
    for (const e of entries) {
      const key = e.segments[0];
      const tag = e.segments.length === 1 ? `leaf:${key}` : `block:${key}`;
      if (emitted.has(tag)) continue;
      emitted.add(tag);
      if (e.segments.length === 1) {
        outLines.push(`${childIndent}${key}: ${e.value},`);
      } else {
        outLines.push(...buildBlockLines(key, nested.get(key)!, childIndent));
      }
    }
    outLines.push(`${indent}),`);
    return outLines;
  }

  // For each anchor, splits the new entries into top-level sections
  // (e.g. "app", "background") and positions them among the children already present in
  // the anchor while respecting the Figma order (before the first existing child whose
  // Figma index is greater; at the end if none has a greater one).
  const insertions = new Map<number, string[]>(); // lineIndex -> lines to insert before this line

  for (const [anchorPath, entries] of byAnchor) {
    const anchor = containers.get(anchorPath)!;
    const groups = new Map<string, NewEntry[]>(); // first segment -> entries, order = first appearance in Figma
    for (const e of entries) {
      const key = e.segments[0];
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(e);
    }

    const depth = anchorPath.split('.').length;
    const existingChildren: Array<{ start: number; figmaIdx: number }> = [];
    for (const [path, c] of containers) {
      if (
        path !== anchorPath &&
        path.startsWith(`${anchorPath}.`) &&
        path.split('.').length === depth + 1
      ) {
        existingChildren.push({
          start: c.openLine,
          figmaIdx: minFigmaIndexUnder(path),
        });
      }
    }
    for (const [path, line] of leafLines) {
      if (
        path.startsWith(`${anchorPath}.`) &&
        path.split('.').length === depth + 1
      ) {
        existingChildren.push({ start: line, figmaIdx: figmaIndex.get(path)! });
      }
    }
    existingChildren.sort((a, b) => a.start - b.start);

    const childIndent = `${anchor.indent}  `;
    for (const [groupKey, groupEntries] of groups) {
      const groupFigmaIdx = Math.min(
        ...groupEntries.map((e) => figmaIndex.get(e.dotPath)!),
      );
      // A group whose only entry has already reached the leaf (segments.length === 1)
      // is a plain direct "key: value," under the anchor -- not a new sub-map.
      const blockLines =
        groupEntries.length === 1 && groupEntries[0].segments.length === 1
          ? [`${childIndent}${groupKey}: ${groupEntries[0].value},`]
          : buildBlockLines(
              groupKey,
              groupEntries.map((e) => ({
                ...e,
                segments: e.segments.slice(1),
              })),
              childIndent,
            );
      const nextSibling = existingChildren.find(
        (c) => c.figmaIdx > groupFigmaIdx,
      );
      const targetLine = nextSibling ? nextSibling.start : anchor.closeLine!;
      if (!insertions.has(targetLine)) insertions.set(targetLine, []);
      insertions.get(targetLine)!.push(...blockLines);
    }
  }

  const finalLines: string[] = [];
  patchedLines.forEach((line, idx) => {
    if (insertions.has(idx)) {
      finalLines.push(...insertions.get(idx)!);
    }
    finalLines.push(line);
  });

  if (unplaced.length > 0) {
    while (finalLines[finalLines.length - 1] === '') finalLines.pop();
    // Even the root container (color/font/radius) is missing: edge case not handled
    // automatically, flagged in a comment for manual insertion.
    finalLines.push(
      '',
      '// New Figma tokens without a matching section -- to be integrated manually:',
    );
    for (const { parent, leaves } of unplaced) {
      for (const l of leaves) {
        finalLines.push(`//   ${parent}.${l.leaf}: ${l.value}`);
      }
    }
  }

  return { text: finalLines.join('\n'), changes, added: newEntries, unplaced };
}
