import { parseArgs } from 'node:util';
import { buildLocalIndex } from './index-builder/build-index.js';
import { writeIndex } from './index-builder/write-index.js';

function generate(mode: string): void {
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

function main(): void {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      mode: { type: 'string', default: 'local' },
    },
  });

  const command = positionals[0];
  if (command === 'generate') {
    generate(values.mode ?? 'local');
    return;
  }

  console.error(
    `Unknown command: ${command ?? '(none)'}.\nUsage: cli.ts generate --mode=local`,
  );
  process.exitCode = 1;
}

main();
