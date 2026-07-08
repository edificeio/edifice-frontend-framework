export * from './types/index-schema.js';
// Lets the viewer derive the underlying usage×apps multiplier from a
// persisted riskScore + severity, without duplicating the weight table.
export { SEVERITY_WEIGHT } from './diff/risk-score.js';
// diff-schema.ts has its own ScanError (intentionally distinct from
// index-schema.ts's, see its doc comment) — re-export everything else by
// name to avoid the ambiguous-export collision on that one identifier.
export type {
  CssChangeScope,
  CssDiffEntry,
  DiffReport,
  DiffSeverity,
  SymbolChangeKind,
  SymbolDiffEntry,
  ConsumerImpactSummary,
} from './types/diff-schema.js';
