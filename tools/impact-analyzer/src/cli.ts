import { parseArgs } from 'node:util';
import { runDiff } from './cli/diff-command.js';
import { runGenerate } from './cli/generate-command.js';
import { runSymbol } from './cli/symbol-command.js';

function main(): void {
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
      runGenerate(values.mode ?? 'local');
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
          '  cli.ts generate --mode=local\n' +
          '  cli.ts symbol <name> [--cached]\n' +
          '  cli.ts diff [--base=<ref>]',
      );
      process.exitCode = 1;
  }
}

main();
