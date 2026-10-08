/** A raw entry of the "Edifice Token Extractor" plugin export. */
export interface FigmaEntry {
  value?: string | number;
  alias?: string;
  aliasCollection?: string;
  error?: string;
}

export type FigmaTokenMap = Record<string, FigmaEntry>;

/** The three real Figma collections exposed by the primitives export. */
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

/** A mode (theme) of the semantic export -> its tokens. */
export type SemanticExportData = Record<string, FigmaTokenMap>;

export interface SemanticExport {
  fileName: string;
  exportedAt: string;
  data: SemanticExportData;
}

export type PrimitiveBucket = 'primitives' | 'primitivesLegacy' | 'text';
export type PrimitiveFile = 'primitives' | 'primitives-legacy';

/**
 * "certain" = found via an explicit exceptions table (variable name
 * known and verified against the repo). "guessed" = generic kebab-case, never
 * verified against an existing convention -- to review first.
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
