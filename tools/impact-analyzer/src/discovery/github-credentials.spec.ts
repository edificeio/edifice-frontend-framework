import { afterEach, describe, expect, it } from 'vitest';
import {
  MissingGithubTokenError,
  requireGithubToken,
  resolveGithubToken,
  sanitizeOrgForEnvVar,
} from './github-credentials.js';

const ENV_KEYS = [
  'IMPACT_ANALYZER_GITHUB_TOKEN',
  'IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO',
  'IMPACT_ANALYZER_GITHUB_TOKEN_OPEN_ENT_NG',
];

describe('sanitizeOrgForEnvVar', () => {
  it('uppercases and replaces non-alphanumeric characters with underscores', () => {
    expect(sanitizeOrgForEnvVar('edificeio')).toBe('EDIFICEIO');
    expect(sanitizeOrgForEnvVar('OPEN-ENT-NG')).toBe('OPEN_ENT_NG');
  });
});

describe('resolveGithubToken / requireGithubToken', () => {
  const originalValues = Object.fromEntries(
    ENV_KEYS.map((k) => [k, process.env[k]]),
  );

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (originalValues[key] === undefined) delete process.env[key];
      else process.env[key] = originalValues[key];
    }
  });

  it('prefers the org-specific token over the generic one', () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'generic-token';
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO = 'edificeio-token';
    expect(resolveGithubToken('edificeio')).toBe('edificeio-token');
  });

  it('falls back to the generic token when no org-specific one is set', () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN = 'generic-token';
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN_OPEN_ENT_NG;
    expect(resolveGithubToken('OPEN-ENT-NG')).toBe('generic-token');
  });

  it('returns undefined when neither is set', () => {
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN;
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO;
    expect(resolveGithubToken('edificeio')).toBeUndefined();
  });

  it('requireGithubToken throws MissingGithubTokenError when nothing is configured', () => {
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN;
    delete process.env.IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO;
    expect(() => requireGithubToken('edificeio')).toThrow(
      MissingGithubTokenError,
    );
  });

  it('requireGithubToken returns the token when available', () => {
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN_EDIFICEIO = 'tok';
    expect(requireGithubToken('edificeio')).toBe('tok');
  });
});
