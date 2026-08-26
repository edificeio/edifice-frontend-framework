/**
 * apps.json is a manually curated, verified list (README: "reviewed like
 * code") — no auto-discovery. That means a squad branch created after an
 * app's entry was last edited stays invisible until someone remembers to
 * add it by hand (already happened once: homeworks was missing
 * develop-enabling for months). This script closes that gap without
 * changing apps.json's nature: it only *reports* candidates, it never
 * writes to the file.
 *
 * For every registered app, probes GitHub for each known squad branch not
 * already listed in its `branches` array, and reports the ones that do
 * exist. A 404 (branch genuinely absent) is the expected, silent case.
 *
 * Usage: pnpm check:squad-branches
 */
import { fetchBranchHead } from '../src/discovery/github-client.js';
import { requireGithubToken } from '../src/discovery/github-credentials.js';
import { loadAppsRegistry } from '../src/registry/apps-registry.js';

// One entry per squad that has (or is expected to eventually have) its own
// branch across consumer-app repos — kept in sync manually with apps.json's
// real `develop-<squad>` entries (ENABLING-1175 §4.6).
const KNOWN_SQUAD_BRANCHES = [
  'develop-enabling',
  'develop-b2school',
  'develop-pedago',
  'develop-integration',
  'develop-orga',
];

async function main() {
  const apps = loadAppsRegistry();
  const missing: { app: string; branch: string }[] = [];

  for (const app of apps) {
    const candidateBranches = KNOWN_SQUAD_BRANCHES.filter(
      (branch) => !app.branches.includes(branch),
    );
    if (candidateBranches.length === 0) continue;

    let token: string;
    try {
      token = requireGithubToken(app.org);
    } catch (error) {
      console.error(
        `Skipping ${app.name} (${app.org}/${app.repo}): ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }

    for (const branch of candidateBranches) {
      const head = await fetchBranchHead(app.org, app.repo, branch, token);
      if (head) {
        missing.push({ app: app.name, branch });
      }
    }
  }

  if (missing.length === 0) {
    console.log(
      'No gap found: every known squad branch present on GitHub is already listed in apps.json.',
    );
    return;
  }

  console.log(
    `${missing.length} branch(es) exist on GitHub but are missing from apps.json:\n`,
  );
  for (const { app, branch } of missing) {
    console.log(`  - ${app}: add "${branch}"`);
  }
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
