import type {
  CssChangeScope,
  DiffSeverity,
  SymbolChangeKind,
} from '../types/diff-schema.js';
import type { CssConfidence, CssGlobalScope } from '../types/index-schema.js';

/**
 * Ordinal rank of each severity — the sort-dominant signal (see
 * computeRiskScore). Isolated here so recalibrating the tiering with the
 * QA (plan §13) stays a one-line diff.
 */
export const SEVERITY_RANK: Record<DiffSeverity, number> = {
  'breaking': 2,
  'likely-breaking': 1,
  'needs-review': 0,
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

// Must exceed the realistic ceiling of computeUsageMultiplier by a wide
// margin, so a severity band can never reach into the one below it — see
// computeRiskScore's doc for why that guarantee matters.
const SEVERITY_BAND_SIZE = 10_000;

/**
 * The "how widely used" signal, independent of severity. Usage sites go
 * through log2 (not linear) — a CSS class or a widely-used component
 * easily racks up dozens of usage sites, and linear scaling let that single
 * factor dwarf severity itself (see the regression test in
 * risk-score.spec.ts). App count stays linear: it's bounded by the registry
 * size (apps.json), never a runaway factor the way usage sites is.
 *
 * +2/+1 so a touched symbol with no known consumer in the current registry
 * still sorts (last) at a non-zero baseline (log2(0+2) = 1) rather than
 * collapsing to 0 and looking indistinguishable from "not risky at all".
 */
export function computeUsageMultiplier(
  totalUsageSites: number,
  affectedAppCount: number,
): number {
  return Math.log2(totalUsageSites + 2) * (affectedAppCount + 1);
}

/**
 * Severity strictly dominates the score: which band a change falls into
 * (breaking > likely-breaking > needs-review) always outranks every
 * possible value of the usage×apps multiplier below it. Under the previous
 * single-factor formula (severity as a linear multiplier), a widely-used
 * low-severity change could outscore an unused higher-severity one — a real
 * case observed in production data: a `needs-review` body-only change
 * reused registry-wide scored well above an unused `breaking` export
 * removal, even though the viewer's own sort (`riskScore` descending) is
 * meant to surface the most dangerous change first (REVIEW-impact-analyzer.md
 * §4.3). The usage multiplier now only ever refines the order *within* a
 * severity band — still a first-pass, deliberately approximate formula
 * (plan §13 leaves it open pending real QA usage).
 */
export function computeRiskScore(
  severity: DiffSeverity,
  totalUsageSites: number,
  affectedAppCount: number,
): number {
  return (
    SEVERITY_RANK[severity] * SEVERITY_BAND_SIZE +
    Math.round(computeUsageMultiplier(totalUsageSites, affectedAppCount))
  );
}

/**
 * Recovers the usage×apps multiplier's contribution from a persisted
 * `riskScore` + `severity` — lets the viewer derive it for display (see
 * RiskBadge.tsx) without duplicating usage-site/app-count summation logic.
 */
export function extractUsageMultiplier(
  severity: DiffSeverity,
  riskScore: number,
): number {
  return riskScore - SEVERITY_RANK[severity] * SEVERITY_BAND_SIZE;
}
