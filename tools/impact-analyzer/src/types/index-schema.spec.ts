import { describe, expect, it } from 'vitest';
import {
  IMPACT_INDEX_SCHEMA_VERSION,
  isCompatibleImpactIndex,
} from './index-schema.js';

describe('isCompatibleImpactIndex', () => {
  it('accepts a value with the current schemaVersion', () => {
    expect(
      isCompatibleImpactIndex({ schemaVersion: IMPACT_INDEX_SCHEMA_VERSION }),
    ).toBe(true);
  });

  it('rejects a value with an incompatible schemaVersion', () => {
    expect(isCompatibleImpactIndex({ schemaVersion: 999 })).toBe(false);
  });

  it('rejects a value with a missing schemaVersion', () => {
    expect(isCompatibleImpactIndex({})).toBe(false);
  });

  it('rejects non-object values', () => {
    expect(isCompatibleImpactIndex(null)).toBe(false);
    expect(isCompatibleImpactIndex('index')).toBe(false);
    expect(isCompatibleImpactIndex(undefined)).toBe(false);
  });
});
