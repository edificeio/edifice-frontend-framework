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
  appStates: AppBranchState[];
}

export const IMPACT_INDEX_SCHEMA_VERSION = 1 as const;

/**
 * Guards every `--cached`/`--cache=` read: a JSON file from an older or
 * incompatible schema must be rejected explicitly rather than trusted as-is
 * (a blind `as ImpactIndex` cast would silently produce wrong results
 * downstream instead of failing where the problem actually is).
 */
export function isCompatibleImpactIndex(data: unknown): data is ImpactIndex {
  return (
    typeof data === 'object' &&
    data !== null &&
    (data as { schemaVersion?: unknown }).schemaVersion ===
      IMPACT_INDEX_SCHEMA_VERSION
  );
}

export interface ScanError {
  app: string;
  branch: string | null;
  error: string;
  staleSince?: string;
}

/**
 * Records the commit actually scanned for an (app, branch) pair — the
 * incremental cache key. `--mode=ci` skips re-cloning/re-analyzing when the
 * current branch head matches this commit, and reuses the previous run's
 * consumer/CSS data instead (carry-forward, see carry-forward.ts).
 */
export interface AppBranchState {
  app: string;
  branch: string;
  commit: string;
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
