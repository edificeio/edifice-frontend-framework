import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { buildCssMap } from './build-css-map.js';

const bootstrapSrcDir = fileURLToPath(
  new URL('../../test/fixtures/scss-fixture', import.meta.url),
);
const appDir = fileURLToPath(
  new URL('../../test/fixtures/app-fixture/frontend', import.meta.url),
);

describe('buildCssMap', () => {
  it('correlates _dropdown.scss with the Dropdown component and greps app usage', () => {
    const ffSymbols = [
      // Dropdown is deliberately 'const' here: compound components built via
      // `Object.assign(Root, {...})` get misclassified by the kind heuristic
      // (see symbol-extractor.ts) — correlation must still find them.
      {
        package: 'p',
        entry: '.',
        name: 'Dropdown',
        kind: 'const' as const,
        sourceFiles: [],
        consumers: [],
      },
      {
        package: 'p',
        entry: '.',
        name: 'Button',
        kind: 'component' as const,
        sourceFiles: [],
        consumers: [],
      },
    ];

    const { cssComponents, cssGlobalRisks } = buildCssMap(
      bootstrapSrcDir,
      ffSymbols,
      [
        {
          appName: 'fixture-app',
          appBranch: 'develop',
          org: 'edificeio',
          repo: 'test-app',
          appCommit: 'abc1234',
          repoRoot: `${appDir}/src`,
          pinsBootstrap: true,
          srcRoot: `${appDir}/src`,
        },
      ],
    );

    const dropdownEntry = cssComponents.find((c) =>
      c.file.endsWith('_dropdown.scss'),
    );
    expect(dropdownEntry?.reactPeer).toBe('Dropdown');
    expect(dropdownEntry?.selectors).toEqual(
      expect.arrayContaining([
        'dropdown',
        'dropdown-item',
        'dropdown-menu',
        'active',
      ]),
    );
    // "active" is a generic short class -> confidence downgraded even though a peer was found.
    expect(dropdownEntry?.confidence).toBe('medium');

    const buttonEntry = cssComponents.find((c) =>
      c.file.endsWith('_button.scss'),
    );
    expect(buttonEntry?.reactPeer).toBe('Button');
    expect(buttonEntry?.confidence).toBe('high');

    expect(cssGlobalRisks).toEqual([
      {
        file: 'themes/_dark.scss',
        scope: 'theme',
        affectedApps: ['fixture-app'],
      },
    ]);
  });

  it('isolates a malformed .scss file as a cssScanError instead of crashing the whole map', () => {
    const { cssComponents, cssScanErrors } = buildCssMap(
      bootstrapSrcDir,
      [],
      [
        {
          appName: 'fixture-app',
          appBranch: 'develop',
          org: 'edificeio',
          repo: 'test-app',
          appCommit: 'abc1234',
          repoRoot: `${appDir}/src`,
          pinsBootstrap: true,
          srcRoot: `${appDir}/src`,
        },
      ],
    );

    expect(cssComponents.some((c) => c.file.endsWith('_malformed.scss'))).toBe(
      false,
    );
    expect(cssScanErrors).toEqual([
      expect.objectContaining({
        app: 'components/_malformed.scss',
        branch: null,
        error: expect.stringContaining('Unclosed block'),
      }),
    ]);
    // Other files must still parse fine — one bad file doesn't take down the rest.
    expect(cssComponents.some((c) => c.file.endsWith('_button.scss'))).toBe(
      true,
    );
  });

  it('excludes an app from cssGlobalRisks.affectedApps when it does not pin bootstrap', () => {
    const { cssGlobalRisks } = buildCssMap(
      bootstrapSrcDir,
      [],
      [
        {
          appName: 'no-bootstrap-app',
          appBranch: 'develop',
          org: 'edificeio',
          repo: 'test-app',
          appCommit: 'abc1234',
          repoRoot: `${appDir}/src`,
          pinsBootstrap: false,
          srcRoot: `${appDir}/src`,
        },
      ],
    );
    expect(cssGlobalRisks[0].affectedApps).toEqual([]);
  });
});
