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
 * Usage sites go through log2 (not linear) — a CSS class or a widely-used
 * component easily racks up dozens of usage sites, and linear scaling let
 * that single factor dwarf severity itself (observed in practice: a
 * `likely-breaking` CSS change at usageSites=58 outscored a `breaking`
 * symbol change by 47x). App count stays linear: it's bounded by the
 * registry size (apps.json), never a runaway factor the way usage sites is.
 *
 * +2/+1 so a touched symbol with no known consumer in the current registry
 * still sorts (last) at a non-zero baseline (log2(0+2) = 1) rather than
 * collapsing to 0 and looking indistinguishable from "not risky at all".
 *
 * Still a first-pass, deliberately approximate formula (plan §13 leaves the
 * weights open pending real QA usage) — isolated here so recalibrating it
 * later stays a one-line diff.
 */
export function computeRiskScore(
  severity: DiffSeverity,
  totalUsageSites: number,
  affectedAppCount: number,
): number {
  return Math.round(
    SEVERITY_WEIGHT[severity] *
      Math.log2(totalUsageSites + 2) *
      (affectedAppCount + 1),
  );
}
