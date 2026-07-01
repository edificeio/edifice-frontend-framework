import { describe, expect, it } from 'vitest';
import { buildIconSymbolEntries, isIconsEntry } from './icons-aggregator.js';

describe('isIconsEntry', () => {
  it('matches ./icons and its nested subpaths', () => {
    expect(isIconsEntry('./icons')).toBe(true);
    expect(isIconsEntry('./icons/nav')).toBe(true);
    expect(isIconsEntry('./icons/apps')).toBe(true);
  });

  it('does not match unrelated entries', () => {
    expect(isIconsEntry('.')).toBe(false);
    expect(isIconsEntry('./modals')).toBe(false);
  });
});

describe('buildIconSymbolEntries', () => {
  it('produces one entry per icon plus one aggregate entry', () => {
    const symbols = [
      {
        name: 'IconOne',
        kind: 'component' as const,
        sourceFiles: ['/a/IconOne.tsx'],
      },
      {
        name: 'IconTwo',
        kind: 'component' as const,
        sourceFiles: ['/a/IconTwo.tsx'],
      },
    ];
    const entries = buildIconSymbolEntries(
      '@edifice.io/react',
      './icons',
      symbols,
    );

    expect(entries).toHaveLength(3);
    expect(entries.filter((e) => !e.isAggregate).map((e) => e.name)).toEqual([
      'IconOne',
      'IconTwo',
    ]);

    const aggregate = entries.find((e) => e.isAggregate);
    expect(aggregate?.aggregateCount).toBe(2);
    expect(aggregate?.name).toBe('icons (./icons)');
    expect(aggregate?.sourceFiles).toEqual([
      '/a/IconOne.tsx',
      '/a/IconTwo.tsx',
    ]);
  });
});
