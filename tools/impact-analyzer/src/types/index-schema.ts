/** Impact Analyzer index — the JSON contract produced by the core and consumed by all outputs. */
export interface ImpactIndex {
  schemaVersion: 1;
  generatedAt: string;
  mode: 'local' | 'ci';
  ffBranch: string;
  ffCommit: string;
  ffDirty: boolean;
  packages: string[];
  scanErrors: ScanError[];
  symbols: SymbolEntry[];
  outOfContractImports: OutOfContractImport[];
  cssComponents: CssComponentEntry[];
  cssGlobalRisks: CssGlobalRisk[];
}

export interface ScanError {
  app: string;
  branch: string | null;
  error: string;
  staleSince?: string;
}

export type SymbolKind = 'component' | 'hook' | 'type' | 'util' | 'const';

export interface SymbolEntry {
  package: string;
  entry: string;
  name: string;
  kind: SymbolKind;
  sourceFiles: string[];
  cssPeer?: string;
  isAggregate?: boolean;
  aggregateCount?: number;
  consumers: ConsumerEntry[];
}

export interface ConsumerEntry {
  app: string;
  org: string;
  appBranch: string;
  pins: string;
  appCommit: string;
  appDirty: boolean;
  usageSites: number;
  files: string[];
  importedAs?: string;
  viaNamespace?: boolean;
}

export interface OutOfContractImport {
  app: string;
  appBranch: string;
  package: string;
  importPath: string;
  files: string[];
}

export type CssConfidence = 'high' | 'medium' | 'low';

export interface CssComponentEntry {
  file: string;
  reactPeer?: string;
  selectors: string[];
  consumers: CssConsumerEntry[];
  confidence: CssConfidence;
}

export interface CssConsumerEntry {
  app: string;
  appBranch: string;
  matchedSelectors: string[];
  files: string[];
  matchCount: number;
}

export type CssGlobalScope = 'theme' | 'token' | 'abstract' | 'base';

export interface CssGlobalRisk {
  file: string;
  scope: CssGlobalScope;
  affectedApps: string[];
}
