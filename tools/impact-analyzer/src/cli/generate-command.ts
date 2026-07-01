import { buildLocalIndex } from '../index-builder/build-index.js';
import { writeIndex } from '../index-builder/write-index.js';

export function runGenerate(mode: string): void {
  if (mode !== 'local') {
    console.error(
      'Only --mode=local is supported in this release (CI mode is a later milestone).',
    );
    process.exitCode = 1;
    return;
  }

  const index = buildLocalIndex();
  const filePath = writeIndex(index);

  console.log(`Wrote ${filePath}`);
  console.log(
    `  ffBranch=${index.ffBranch} ffCommit=${index.ffCommit.slice(0, 7)} ffDirty=${index.ffDirty}`,
  );
  console.log(
    `  symbols=${index.symbols.length} scanErrors=${index.scanErrors.length} outOfContractImports=${index.outOfContractImports.length}`,
  );
  for (const error of index.scanErrors) {
    console.warn(
      `  scanError: ${error.app} (${error.branch ?? 'unknown branch'}): ${error.error}`,
    );
  }
}
