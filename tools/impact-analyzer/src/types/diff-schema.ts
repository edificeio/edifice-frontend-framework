import type {
  CssConfidence,
  CssGlobalScope,
  SymbolKind,
} from './index-schema.js';

/**
 * The diff report compares two states of the FF repo (base vs head) — it is
 * intentionally NOT part of ImpactIndex's schema, which is a single-state
 * snapshot. schemaVersion is its own counter, independent of ImpactIndex's.
 */
export interface DiffReport {
  schemaVersion: 1;
  generatedAt: string;
  base: { ref: string; commit: string };
  head: { ref: string; commit: string };
  /** Sorted by riskScore descending. */
  symbolDiffs: SymbolDiffEntry[];
  /** Sorted by riskScore descending. */
  cssDiffs: CssDiffEntry[];
  scanErrors: ScanError[];
}

export interface ScanError {
  app: string;
  branch: string | null;
  error: string;
}

/**
 * breaking -> export removed (renames collapse into this: the old key
 * simply disappears); likely-breaking -> signature/shape changed;
 * needs-review -> only the implementation body changed. Display-only emoji
 * mapping (🔴/🟠/🟡) lives in the CLI layer, not in this data contract.
 */
export type DiffSeverity = 'breaking' | 'likely-breaking' | 'needs-review';

export type SymbolChangeKind = 'removed' | 'signature-changed' | 'body-changed';

export interface SymbolDiffEntry {
  package: string;
  entry: string;
  name: string;
  /** kind at head if the symbol still exists there, otherwise kind at base. */
  kind: SymbolKind;
  changeKind: SymbolChangeKind;
  severity: DiffSeverity;
  sourceFilesBase: string[];
  sourceFilesHead: string[];
  /** Derived from the head index — a summary, not the full consumer file list. */
  consumers: ConsumerImpactSummary[];
  riskScore: number;
}

export interface ConsumerImpactSummary {
  app: string;
  appBranch: string;
  usageSites: number;
  /**
   * GitHub coordinates + SHA-pinned file list, denormalized from the head
   * index at diff time so the viewer can link straight to the impacted
   * code. Optional: reports written before this field existed don't have
   * them, and carried-forward head entries may lack org/repo/commit.
   */
  org?: string;
  repo?: string;
  appCommit?: string;
  files?: string[];
}

/** Per-app impact of a component-scoped CSS diff — same linking fields as ConsumerImpactSummary. */
export interface CssConsumerImpactSummary {
  app: string;
  appBranch: string;
  matchCount: number;
  org?: string;
  repo?: string;
  appCommit?: string;
  files?: string[];
}

export type CssChangeScope = 'component' | 'global';

export interface CssDiffEntry {
  file: string;
  scope: CssChangeScope;
  /** Present only when scope === 'global'. */
  globalScope?: CssGlobalScope;
  /** Present only when scope === 'component' and a peer was correlated at head. */
  reactPeer?: string;
  confidence?: CssConfidence;
  severity: DiffSeverity;
  affectedApps: string[];
  /** Present only when scope === 'component' — global changes affect apps without a specific file list. */
  consumers?: CssConsumerImpactSummary[];
  riskScore: number;
}
