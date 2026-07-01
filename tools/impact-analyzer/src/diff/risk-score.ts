import type {
  CssChangeScope,
  DiffSeverity,
  SymbolChangeKind,
} from '../types/diff-schema.js';
import type { CssConfidence, CssGlobalScope } from '../types/index-schema.js';

/**
 * First-pass weights, deliberately arbitrary — isolated here so calibrating
 * them with the QA after the first real report (plan §13) is a one-line
 * diff, not a hunt through the codebase.
 */
export const SEVERITY_WEIGHT: Record<DiffSeverity, number> = {
  'breaking': 100,
  'likely-breaking': 10,
  'needs-review': 1,
};

export function severityForChangeKind(
  changeKind: SymbolChangeKind,
): DiffSeverity {
  switch (changeKind) {
    case 'removed':
      return 'breaking';
    case 'signature-changed':
      return 'likely-breaking';
    case 'body-changed':
      return 'needs-review';
  }
}

export function severityForCssChange(
  scope: CssChangeScope,
  globalScope: CssGlobalScope | undefined,
  confidence: CssConfidence | undefined,
): DiffSeverity {
  if (scope === 'global') {
    return globalScope === 'theme' ? 'breaking' : 'likely-breaking'; // token/abstract/base
  }
  return confidence === 'high' ? 'likely-breaking' : 'needs-review';
}

/**
 * +1 on both usage/app counts so a touched symbol with no known consumer in
 * the current registry still sorts (last), rather than collapsing to 0 and
 * looking indistinguishable from "not risky at all".
 */
export function computeRiskScore(
  severity: DiffSeverity,
  totalUsageSites: number,
  affectedAppCount: number,
): number {
  return (
    SEVERITY_WEIGHT[severity] * (totalUsageSites + 1) * (affectedAppCount + 1)
  );
}
