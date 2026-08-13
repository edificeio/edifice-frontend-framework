import { describe, expect, it } from 'vitest';
import { buildSassArgs } from './build-sass-args.js';

describe('buildSassArgs', () => {
  it('matches the exact flags of the "compile" script in packages/bootstrap/package.json', () => {
    const args = buildSassArgs(
      '/repo/packages/bootstrap/node_modules',
      '/tmp/src/index.scss',
      '/tmp/dist/index.css',
    );
    expect(args).toEqual([
      '--load-path=/repo/packages/bootstrap/node_modules',
      '--style=compressed',
      '--quiet-deps',
      '--silence-deprecation=import',
      '/tmp/src/index.scss',
      '/tmp/dist/index.css',
    ]);
  });

  it('places the entry file before the output file, in that order', () => {
    const args = buildSassArgs('/nm', '/tmp/entry.scss', '/tmp/out.css');
    expect(args.at(-2)).toBe('/tmp/entry.scss');
    expect(args.at(-1)).toBe('/tmp/out.css');
  });
});
