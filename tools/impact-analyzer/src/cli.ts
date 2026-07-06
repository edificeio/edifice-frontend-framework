import { parseArgs } from 'node:util';
import { runDiff } from './cli/diff-command.js';
import { runGenerate } from './cli/generate-command.js';
import { runSymbol } from './cli/symbol-command.js';

async function main(): Promise<void> {
  // `pnpm run <script> -- --flag` inserts a literal "--" ahead of the
  // forwarded args — Node's parseArgs treats that as an option terminator
  // and would otherwise silently dump every flag after it into positionals.
  const args = process.argv.slice(2).filter((arg) => arg !== '--');
  const { positionals, values } = parseArgs({
    args,
    allowPositionals: true,
    options: {
      'mode': { type: 'string', default: 'local' },
      'cached': { type: 'boolean', default: false },
      'base': { type: 'string', default: 'develop' },
      'cache': { type: 'string' },
      'head-index': { type: 'string' },
    },
  });

  const [command, ...rest] = positionals;
  switch (command) {
    case 'generate':
      await runGenerate(values.mode ?? 'local', { cachePath: values.cache });
      return;
    case 'symbol':
      runSymbol(rest.join(' '), { cached: values.cached ?? false });
      return;
    case 'diff':
      await runDiff({
        base: values.base ?? 'develop',
        mode: values.mode,
        headIndexPath: values['head-index'],
      });
      return;
    default:
      console.error(
        `Unknown command: ${command ?? '(none)'}.\n` +
          'Usage:\n' +
          '  cli.ts generate --mode=local|ci [--cache=<path-to-previous-index.json>]\n' +
          '  cli.ts symbol <name> [--cached]\n' +
          '  cli.ts diff [--base=<ref>] [--mode=local|ci] [--head-index=<path-to-index.json>]',
      );
      process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
