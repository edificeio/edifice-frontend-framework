import { patchFlatFile } from './patch/patch-flat-file.js';
import { patchThemeFile } from './patch/patch-theme-file.js';
import { buildPrimitiveDictionary } from './primitives/build-primitive-dictionary.js';
import {
  THEME_MODE_TO_FILE,
  figmaPathToDotPath,
  isIgnoredSemanticKey,
  resolveSemanticToken,
} from './semantic/resolve-semantic-token.js';
import type {
  LegacyWarning,
  PrimitivesExportData,
  SemanticExportData,
  ThemeDotPathEntry,
} from './types.js';

/** dotPath/scssVar (cle du fichier plat) -> nom de fichier reel dans configs/. */
export const FLAT_FILE_NAMES: Record<
  'primitives' | 'primitives-legacy',
  string
> = {
  'primitives': '_primitives.scss',
  'primitives-legacy': '_primitives-legacy.scss',
};

export const ALL_CONFIG_FILE_NAMES: string[] = [
  ...Object.values(FLAT_FILE_NAMES),
  ...Object.values(THEME_MODE_TO_FILE),
];

/** Une primitive resolue via le kebab-case generique, jamais confrontee a une
 *  convention verifiee -- a relire en priorite dans le rapport. */
export interface GuessedName {
  bucket: string;
  figmaName: string;
  file: string;
  scssVar: string;
}

export interface FilePatchSummary {
  changes: Array<{ key: string; from: string; to: string }>;
  added: string[];
  removed?: string[];
  unplaced?: Array<{
    parent: string;
    leaves: Array<{ leaf: string; value: string }>;
  }>;
}

export interface OrchestrationReport {
  files: Record<string, FilePatchSummary>;
  warnings: LegacyWarning[];
  guessedNames: GuessedName[];
  skippedThemes: string[];
}

export interface OrchestrationResult {
  patchedText: Record<string, string>;
  report: OrchestrationReport;
}

function ensureTrailingNewline(text: string): string {
  return text.endsWith('\n') ? text : `${text}\n`;
}

/**
 * Coeur pur de l'outil : prend les deux exports Figma et le texte actuel des 7
 * fichiers de configs, et produit (a) le texte patche de chacun, en memoire, et
 * (b) le rapport (changements/ajouts/tokens devines/warnings). N'ecrit rien sur
 * disque et ne lance ni sass ni prettier/stylelint -- cli.ts s'occupe de l'I/O
 * et de la validation reelle autour de cette fonction.
 */
export function buildPatchPlan(
  primitivesData: PrimitivesExportData,
  semanticData: SemanticExportData,
  existingTexts: Record<string, string>,
): OrchestrationResult {
  const dictionary = buildPrimitiveDictionary(primitivesData);

  const guessedNames: GuessedName[] = [];
  for (const [key, entry] of dictionary) {
    if (entry.confidence !== 'guessed') continue;
    const sepIdx = key.indexOf('|');
    guessedNames.push({
      bucket: key.slice(0, sepIdx),
      figmaName: key.slice(sepIdx + 1),
      file: entry.file,
      scssVar: entry.scssVar,
    });
  }

  const patchedText: Record<string, string> = {};
  const files: Record<string, FilePatchSummary> = {};

  for (const [fileKey, fileName] of Object.entries(FLAT_FILE_NAMES) as Array<
    [keyof typeof FLAT_FILE_NAMES, string]
  >) {
    const existing = existingTexts[fileName];
    if (existing === undefined) {
      throw new Error(
        `Fichier attendu absent des textes fournis : "${fileName}"`,
      );
    }
    const entries = [...dictionary.values()].filter((e) => e.file === fileKey);
    const result = patchFlatFile(existing, entries);
    patchedText[fileName] = ensureTrailingNewline(result.text);
    files[fileName] = {
      changes: result.changes.map((c) => ({
        key: c.scssVar,
        from: c.from,
        to: c.to,
      })),
      added: result.added.map((e) => e.scssVar),
      removed: result.removed,
    };
  }

  const warnings: LegacyWarning[] = [];
  const skippedThemes: string[] = [];

  for (const [mode, fileName] of Object.entries(THEME_MODE_TO_FILE)) {
    const modeTokens = semanticData[mode];
    if (!modeTokens) {
      skippedThemes.push(mode);
      continue;
    }

    const existing = existingTexts[fileName];
    if (existing === undefined) {
      throw new Error(
        `Fichier attendu absent des textes fournis : "${fileName}"`,
      );
    }

    const dotPathEntries: ThemeDotPathEntry[] = [];
    for (const figmaName of Object.keys(modeTokens)) {
      if (isIgnoredSemanticKey(figmaName)) continue;
      const ctx = { mode, topLevelName: figmaName, warnings };
      const value = resolveSemanticToken(
        figmaName,
        modeTokens,
        dictionary,
        ctx,
        0,
      );
      dotPathEntries.push({ dotPath: figmaPathToDotPath(figmaName), value });
    }

    const result = patchThemeFile(existing, dotPathEntries);
    patchedText[fileName] = ensureTrailingNewline(result.text);
    files[fileName] = {
      changes: result.changes.map((c) => ({
        key: c.dotPath,
        from: c.from,
        to: c.to,
      })),
      added: result.added.map((e) => e.dotPath),
      unplaced: result.unplaced,
    };
  }

  return {
    patchedText,
    report: { files, warnings, guessedNames, skippedThemes },
  };
}
