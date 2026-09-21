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
 * Patch des fichiers de theme (maps SCSS imbriquees). Met a jour les feuilles
 * existantes en place, et cree recursivement les sous-maps manquantes pour les
 * tokens entierement nouveaux (ex: color.app.*) -- positionnees parmi leurs
 * soeurs deja presentes en respectant l'ordre d'apparition dans le JSON Figma
 * (jamais un ordre alphabetique, jamais "a la fin" par defaut).
 */
export function patchThemeFile(
  existingText: string,
  dotPathEntries: ThemeDotPathEntry[],
): ThemeFilePatchResult {
  const lines = existingText.split('\n');
  const byDotPath = new Map(dotPathEntries.map((e) => [e.dotPath, e]));
  const matched = new Set<string>();
  const changes: ThemeFilePatchResult['changes'] = [];

  // Index Figma (ordre d'apparition dans le JSON, preserve par Object.keys cote
  // main()) : seule reference utilisee pour positionner une nouvelle section
  // par rapport a ses futures soeurs -- jamais "a la fin" par defaut.
  const figmaIndex = new Map(dotPathEntries.map((e, i) => [e.dotPath, i]));

  // Pile des cles ouvertes courantes, avec la ligne ou chaque map "key: (" a ete ouverte.
  const stack: string[] = [];
  // pathString -> { openLine, closeLine, indent } pour savoir ou inserer les nouvelles cles.
  const containers = new Map<string, Container>();
  // dotPath (matched uniquement) -> ligne ou se trouve la feuille dans le fichier.
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

  /** Index Figma minimal parmi les descendants deja presents d'un conteneur -- sert
   *  a comparer une section existante a une nouvelle section pour savoir laquelle
   *  vient en premier dans l'ordre Figma. */
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

  // Regroupe chaque nouvelle entree sous le conteneur existant le plus profond
  // qu'on puisse trouver en remontant son chemin (ex: "color.app.communicate"
  // -> ancre "color", segments restants ["app", "communicate"] : "app" doit
  // etre cree, "communicate" est sa feuille a l'interieur).
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
      // Meme le conteneur racine attendu (color/font/radius) est absent du fichier :
      // on ne l'invente pas, on le signale.
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

  /** Construit recursivement les lignes d'un bloc "name: ( ... ),", en respectant
   *  l'ordre Figma d'apparition des feuilles/sous-blocs (pas d'ordre alphabetique). */
  function buildBlockLines(
    name: string,
    entries: NewEntry[],
    indent: string,
  ): string[] {
    const childIndent = `${indent}  `;
    const nested = new Map<string, NewEntry[]>(); // premier segment -> sous-entrees, ordre = 1ere apparition
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

  // Pour chaque ancre, decoupe les nouvelles entrees en sections de premier niveau
  // (ex: "app", "background") et les positionne parmi les enfants deja presents de
  // l'ancre en respectant l'ordre Figma (avant le premier enfant existant dont
  // l'index Figma est superieur ; a la fin si aucun n'en a un superieur).
  const insertions = new Map<number, string[]>(); // lineIndex -> lignes a inserer avant cette ligne

  for (const [anchorPath, entries] of byAnchor) {
    const anchor = containers.get(anchorPath)!;
    const groups = new Map<string, NewEntry[]>(); // premier segment -> entries, ordre = 1ere apparition Figma
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
      // Un groupe dont l'unique entree a deja atteint la feuille (segments.length === 1)
      // est un simple "key: value," direct sous l'ancre -- pas une nouvelle sous-map.
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
    // Meme le conteneur racine (color/font/radius) est absent : cas limite non gere
    // automatiquement, signale en commentaire pour une insertion manuelle.
    finalLines.push(
      '',
      '// Nouveaux tokens Figma sans section correspondante -- a integrer manuellement :',
    );
    for (const { parent, leaves } of unplaced) {
      for (const l of leaves) {
        finalLines.push(`//   ${parent}.${l.leaf}: ${l.value}`);
      }
    }
  }

  return { text: finalLines.join('\n'), changes, added: newEntries, unplaced };
}
