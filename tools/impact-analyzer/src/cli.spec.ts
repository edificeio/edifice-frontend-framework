import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./cli/generate-command.js', () => ({ runGenerate: vi.fn() }));
vi.mock('./cli/symbol-command.js', () => ({ runSymbol: vi.fn() }));
vi.mock('./cli/diff-command.js', () => ({ runDiff: vi.fn() }));

import { runGenerate } from './cli/generate-command.js';
import { runSymbol } from './cli/symbol-command.js';
import { runDiff } from './cli/diff-command.js';
import { main } from './cli.js';

describe('cli dispatch', () => {
  afterEach(() => {
    vi.mocked(runGenerate).mockReset();
    vi.mocked(runSymbol).mockReset();
    vi.mocked(runDiff).mockReset();
    process.exitCode = undefined;
  });

  it('dispatches "generate" with mode and cache path', async () => {
    await main(['generate', '--mode=ci', '--cache=data/index.develop.json']);
    expect(runGenerate).toHaveBeenCalledWith('ci', {
      cachePath: 'data/index.develop.json',
    });
  });

  it('defaults "generate" to local mode when --mode is omitted', async () => {
    await main(['generate']);
    expect(runGenerate).toHaveBeenCalledWith('local', {
      cachePath: undefined,
    });
  });

  it('dispatches "symbol" joining every positional after the command into one query', async () => {
    await main(['symbol', 'Button', 'Beta', '--cached']);
    expect(runSymbol).toHaveBeenCalledWith('Button Beta', { cached: true });
  });

  it('dispatches "diff" with base, mode and PR provenance flags', async () => {
    await main([
      'diff',
      '--base=develop-enabling',
      '--mode=ci',
      '--pr-url=https://github.com/x/y/pull/1',
      '--pr-number=42',
      '--pr-title=fix things',
    ]);
    expect(runDiff).toHaveBeenCalledWith({
      base: 'develop-enabling',
      mode: 'ci',
      headIndexPath: undefined,
      prUrl: 'https://github.com/x/y/pull/1',
      prNumber: 42,
      prTitle: 'fix things',
    });
  });

  it('drops an invalid --pr-number rather than passing NaN through', async () => {
    await main(['diff', '--pr-number=not-a-number']);
    expect(runDiff).toHaveBeenCalledWith(
      expect.objectContaining({ prNumber: undefined }),
    );
  });

  it('filters out a literal "--" option terminator before parsing', async () => {
    await main(['symbol', '--', 'Button', '--cached']);
    expect(runSymbol).toHaveBeenCalledWith('Button', { cached: true });
  });

  it('prints usage and sets a non-zero exit code for an unknown command', async () => {
    const errors: unknown[] = [];
    vi.spyOn(console, 'error').mockImplementation((msg) => errors.push(msg));

    await main(['bogus-command']);

    expect(process.exitCode).toBe(1);
    expect(errors.join('\n')).toContain('Unknown command: bogus-command');
    expect(runGenerate).not.toHaveBeenCalled();
    expect(runSymbol).not.toHaveBeenCalled();
    expect(runDiff).not.toHaveBeenCalled();
  });

  it('prints usage and sets a non-zero exit code when no command is given', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    await main([]);
    expect(process.exitCode).toBe(1);
  });
});
