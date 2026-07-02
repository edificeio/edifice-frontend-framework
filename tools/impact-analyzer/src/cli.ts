import { parseArgs } from 'node:util';
import { runDiff } from './cli/diff-command.js';
import { runGenerate } from './cli/generate-command.js';
import { runSymbol } from './cli/symbol-command.js';

async function main(): Promise<void> {
  const { positionals, values } = parseArgs({
    args: process.argv.slice(2),
    allowPositionals: true,
    options: {
      mode: { type: 'string', default: 'local' },
      cached: { type: 'boolean', default: false },
      base: { type: 'string', default: 'develop' },
    },
  });

  const [command, ...rest] = positionals;
  switch (command) {
    case 'generate':
      await runGenerate(values.mode ?? 'local');
      return;
    case 'symbol':
      runSymbol(rest.join(' '), { cached: values.cached ?? false });
      return;
    case 'diff':
      runDiff({ base: values.base ?? 'develop' });
      return;
    default:
      console.error(
        `Unknown command: ${command ?? '(none)'}.\n` +
          'Usage:\n' +
          '  cli.ts generate --mode=local|ci\n' +
          '  cli.ts symbol <name> [--cached]\n' +
          '  cli.ts diff [--base=<ref>]',
      );
      process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
