/** `edificeio` -> `EDIFICEIO`, `OPEN-ENT-NG` -> `OPEN_ENT_NG`. */
export function sanitizeOrgForEnvVar(org: string): string {
  return org.toUpperCase().replace(/[^A-Z0-9]/g, '_');
}

/**
 * `IMPACT_ANALYZER_GITHUB_TOKEN_<ORG>` takes precedence over the generic
 * `IMPACT_ANALYZER_GITHUB_TOKEN` — lets a single classic PAT cover every
 * org, or a fine-grained PAT be scoped per org (a fine-grained PAT only
 * ever has one owner, so two orgs need two separate tokens).
 */
export function resolveGithubToken(org: string): string | undefined {
  return (
    process.env[`IMPACT_ANALYZER_GITHUB_TOKEN_${sanitizeOrgForEnvVar(org)}`] ??
    process.env.IMPACT_ANALYZER_GITHUB_TOKEN
  );
}

export class MissingGithubTokenError extends Error {}

/**
 * Throws when no token is configured for `org`. The caller (remote
 * discovery) catches this per (app, branch) and turns it into a
 * `scanError` — never a global crash.
 */
export function requireGithubToken(org: string): string {
  const token = resolveGithubToken(org);
  if (!token) {
    throw new MissingGithubTokenError(
      `No GitHub token found for org "${org}". Set IMPACT_ANALYZER_GITHUB_TOKEN_${sanitizeOrgForEnvVar(org)} or the generic IMPACT_ANALYZER_GITHUB_TOKEN.`,
    );
  }
  return token;
}
