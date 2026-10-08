import path from 'node:path';

/**
 * Resolves the path of a binary installed locally in a given `node_modules/.bin`
 * -- never a global system binary, to guarantee we use
 * exactly the version that pnpm installed for this package.
 */
export function resolveBin(nodeModulesDir: string, binName: string): string {
  const fileName = process.platform === 'win32' ? `${binName}.cmd` : binName;
  return path.join(nodeModulesDir, '.bin', fileName);
}
