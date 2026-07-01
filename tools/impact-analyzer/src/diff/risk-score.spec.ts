import { describe, expect, it } from 'vitest';
import {
  computeRiskScore,
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

describe('computeRiskScore', () => {
  it('scales with severity, usage sites and app count', () => {
    expect(computeRiskScore('breaking', 0, 0)).toBe(100);
    expect(computeRiskScore('breaking', 9, 1)).toBe(100 * 10 * 2);
    expect(computeRiskScore('likely-breaking', 9, 1)).toBe(10 * 10 * 2);
    expect(computeRiskScore('needs-review', 9, 1)).toBe(1 * 10 * 2);
  });

  it('ranks breaking above likely-breaking above needs-review for identical usage', () => {
    const breaking = computeRiskScore('breaking', 5, 3);
    const likelyBreaking = computeRiskScore('likely-breaking', 5, 3);
    const needsReview = computeRiskScore('needs-review', 5, 3);
    expect(breaking).toBeGreaterThan(likelyBreaking);
    expect(likelyBreaking).toBeGreaterThan(needsReview);
  });
});
