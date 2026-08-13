import path from 'node:path';

/**
 * Resout le chemin d'un binaire installe localement dans un `node_modules/.bin`
 * donne -- jamais un binaire global du systeme, pour garantir qu'on utilise
 * exactement la version que pnpm a installee pour ce package.
 */
export function resolveBin(nodeModulesDir: string, binName: string): string {
  const fileName = process.platform === 'win32' ? `${binName}.cmd` : binName;
  return path.join(nodeModulesDir, '.bin', fileName);
}
