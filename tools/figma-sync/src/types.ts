/** Une entree brute de l'export du plugin "Edifice Token Extractor". */
export interface FigmaEntry {
  value?: string | number;
  alias?: string;
  aliasCollection?: string;
  error?: string;
}

export type FigmaTokenMap = Record<string, FigmaEntry>;

/** Les trois collections Figma reelles exposees par l'export des primitives. */
export interface PrimitivesExportData {
  primitives: FigmaTokenMap;
  primitivesLegacy: FigmaTokenMap;
  text: FigmaTokenMap;
}

export interface PrimitivesExport {
  fileName: string;
  exportedAt: string;
  data: PrimitivesExportData;
}

/** Un mode (theme) de l'export semantique -> ses tokens. */
export type SemanticExportData = Record<string, FigmaTokenMap>;

export interface SemanticExport {
  fileName: string;
  exportedAt: string;
  data: SemanticExportData;
}

export type PrimitiveBucket = 'primitives' | 'primitivesLegacy' | 'text';
export type PrimitiveFile = 'primitives' | 'primitives-legacy';

/**
 * "certain" = trouve via une table d'exceptions explicite (nom de variable
 * connu et verifie contre le repo). "guessed" = kebab-case generique, jamais
 * verifie contre une convention existante -- a relire en priorite.
 */
export type NamingConfidence = 'certain' | 'guessed';

export interface PrimitiveTarget {
  file: PrimitiveFile;
  scssVar: string;
  pinnedValue?: string;
  confidence: NamingConfidence;
}

export interface DictionaryEntry extends PrimitiveTarget {
  resolvedValue: string;
}

export type PrimitiveDictionary = Map<string, DictionaryEntry>;

export interface LegacyWarning {
  theme: string;
  token: string;
  via: string;
  primitive: string;
  message: string;
}

export interface FlatFilePatchResult {
  text: string;
  changes: Array<{ scssVar: string; from: string; to: string }>;
  added: DictionaryEntry[];
  removed: string[];
}

export interface ThemeDotPathEntry {
  dotPath: string;
  value: string;
}

export interface ThemeFilePatchResult {
  text: string;
  changes: Array<{ dotPath: string; from: string; to: string }>;
  added: ThemeDotPathEntry[];
  unplaced: Array<{
    parent: string;
    leaves: Array<{ leaf: string; value: string }>;
  }>;
}
