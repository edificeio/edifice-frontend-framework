import { buildCiIndex } from '../index-builder/build-ci-index.js';
import { buildLocalIndex } from '../index-builder/build-index.js';
import { writeIndex } from '../index-builder/write-index.js';
import type { ImpactIndex } from '../types/index-schema.js';

export async function runGenerate(mode: string): Promise<void> {
  if (mode !== 'local' && mode !== 'ci') {
    console.error(`Unknown mode "${mode}". Supported: local, ci.`);
    process.exitCode = 1;
    return;
  }

  const index: ImpactIndex =
    mode === 'ci' ? await buildCiIndex() : buildLocalIndex();
  const filePath = writeIndex(index);

  console.log(`Wrote ${filePath}`);
  console.log(
    `  mode=${index.mode} ffBranch=${index.ffBranch} ffCommit=${index.ffCommit.slice(0, 7)} ffDirty=${index.ffDirty}`,
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
