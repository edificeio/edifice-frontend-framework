import { emptyScreenMapping, type AppKeys } from './emptyscreen-mapping';

const expectedKeys: AppKeys[] = [
  'blog',
  'wiki',
  'empty',
  'collaborative-wall',
  'community',
  'exercizer',
  'formulaire',
  'forum',
  'homeworks',
  'magneto',
];

describe('emptyScreenMapping', () => {
  it('exposes the same app keys for both themes', () => {
    expect(Object.keys(emptyScreenMapping.one).sort()).toEqual(
      [...expectedKeys].sort(),
    );
    expect(Object.keys(emptyScreenMapping.neo).sort()).toEqual(
      [...expectedKeys].sort(),
    );
  });

  it.each(expectedKeys)('provides a mapping for %s in both themes', (key) => {
    expect(emptyScreenMapping.one[key]).toEqual(expect.any(String));
    expect(emptyScreenMapping.neo[key]).toEqual(expect.any(String));
  });
});
