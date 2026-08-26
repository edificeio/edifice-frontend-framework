import { describe, expect, it } from 'vitest';
import {
  computeRiskScore,
  computeUsageMultiplier,
  extractUsageMultiplier,
  severityForChangeKind,
  severityForCssChange,
} from './risk-score.js';

describe('severityForChangeKind', () => {
  it('maps removed to breaking, signature-changed to likely-breaking, body-changed to needs-review', () => {
    expect(severityForChangeKind('removed')).toBe('breaking');
    expect(severityForChangeKind('signature-changed')).toBe('likely-breaking');
    expect(severityForChangeKind('body-changed')).toBe('needs-review');
  });
});

describe('severityForCssChange', () => {
  it('maps a theme change to breaking, token/abstract/base to likely-breaking', () => {
    expect(severityForCssChange('global', 'theme', undefined)).toBe('breaking');
    expect(severityForCssChange('global', 'token', undefined)).toBe(
      'likely-breaking',
    );
    expect(severityForCssChange('global', 'abstract', undefined)).toBe(
      'likely-breaking',
    );
    expect(severityForCssChange('global', 'base', undefined)).toBe(
      'likely-breaking',
    );
  });

  it('maps a high-confidence localized component change to likely-breaking, else needs-review', () => {
    expect(severityForCssChange('component', undefined, 'high')).toBe(
      'likely-breaking',
    );
    expect(severityForCssChange('component', undefined, 'medium')).toBe(
      'needs-review',
    );
    expect(severityForCssChange('component', undefined, 'low')).toBe(
      'needs-review',
    );
    expect(severityForCssChange('component', undefined, undefined)).toBe(
      'needs-review',
    );
  });
});

describe('computeUsageMultiplier', () => {
  it('scales with usage sites (log2) and app count (linear)', () => {
    expect(computeUsageMultiplier(0, 0)).toBe(1); // log2(0+2) = 1
    expect(computeUsageMultiplier(9, 1)).toBe(Math.log2(11) * 2);
  });
});

describe('computeRiskScore', () => {
  it('ranks breaking above likely-breaking above needs-review for identical usage', () => {
    const breaking = computeRiskScore('breaking', 5, 3);
    const likelyBreaking = computeRiskScore('likely-breaking', 5, 3);
    const needsReview = computeRiskScore('needs-review', 5, 3);
    expect(breaking).toBeGreaterThan(likelyBreaking);
    expect(likelyBreaking).toBeGreaterThan(needsReview);
  });

  it('never lets a huge usage count on a lower severity outrank a higher one — severity is the dominant, unconditional signal', () => {
    // Regression: under the old single-factor formula (severity as a linear
    // multiplier), a `needs-review` change reused registry-wide could
    // outscore an unused `breaking` removal — a real case seen in
    // production data (REVIEW-impact-analyzer.md §4.3). Exercise the
    // extreme: a needs-review change at maximal plausible usage (deep into
    // the hundreds of sites, every app in a 50-app registry) still must not
    // reach into likely-breaking's band, let alone breaking's.
    const massUsageNeedsReview = computeRiskScore('needs-review', 10_000, 50);
    const unusedLikelyBreaking = computeRiskScore('likely-breaking', 0, 0);
    const unusedBreaking = computeRiskScore('breaking', 0, 0);

    expect(massUsageNeedsReview).toBeLessThan(unusedLikelyBreaking);
    expect(massUsageNeedsReview).toBeLessThan(unusedBreaking);
  });

  it("only refines the order *within* a severity band — doesn't affect cross-band ranking", () => {
    const lowUsage = computeRiskScore('likely-breaking', 0, 0);
    const highUsage = computeRiskScore('likely-breaking', 58, 7);
    expect(highUsage).toBeGreaterThan(lowUsage);
  });
});

describe('extractUsageMultiplier', () => {
  it('recovers the usage×apps multiplier from a riskScore + severity (rounded, same as computeRiskScore stores it)', () => {
    const multiplier = computeUsageMultiplier(12, 3);
    const score = computeRiskScore('likely-breaking', 12, 3);
    expect(extractUsageMultiplier('likely-breaking', score)).toBe(
      Math.round(multiplier),
    );
  });
});
