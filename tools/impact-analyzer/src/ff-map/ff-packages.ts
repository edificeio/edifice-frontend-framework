export interface FfPackageSpec {
  /** Directory name under packages/, e.g. "react", "extensions". */
  packageDirName: string;
  /**
   * Some packages (react) ship a "solution style" tsconfig.json (`files: []`
   * + `references` only) purely for the TS build graph — it carries no
   * compilerOptions of its own, so pointing ts-morph at it silently loses
   * `jsx`/`moduleResolution` and breaks cross-file export resolution.
   * Defaults to "tsconfig.json"; override per package as needed.
   */
  tsconfigFileName?: string;
}

/** The FF packages in scope for Jalon 1 (plan §10 — JS-import packages). */
export const FF_PACKAGES: FfPackageSpec[] = [
  { packageDirName: 'react', tsconfigFileName: 'tsconfig.lib.json' },
  { packageDirName: 'client' },
  { packageDirName: 'utilities' },
  { packageDirName: 'extensions' },
  { packageDirName: 'rest-client-base' },
];
