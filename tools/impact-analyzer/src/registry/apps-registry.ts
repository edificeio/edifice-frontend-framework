import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export interface RegisteredApp {
  name: string;
  org: string;
  repo: string;
  branches: string[];
}

const DEFAULT_APPS_JSON_PATH = fileURLToPath(
  new URL('../../apps.json', import.meta.url),
);

export class AppsRegistryError extends Error {}

function assertString(value: unknown, field: string, appIndex: number): string {
  if (typeof value !== 'string' || value.length === 0) {
    throw new AppsRegistryError(
      `apps.json[${appIndex}].${field} must be a non-empty string`,
    );
  }
  return value;
}

function assertBranches(value: unknown, appIndex: number): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    !value.every((b) => typeof b === 'string' && b.length > 0)
  ) {
    throw new AppsRegistryError(
      `apps.json[${appIndex}].branches must be a non-empty array of strings`,
    );
  }
  return value;
}

/**
 * Loads and validates the manual apps registry (apps.json).
 * Throws AppsRegistryError on malformed entries or duplicate app names —
 * this file is reviewed like code (plan §4), a malformed entry should fail loudly.
 */
export function loadAppsRegistry(
  path: string = DEFAULT_APPS_JSON_PATH,
): RegisteredApp[] {
  const raw = JSON.parse(readFileSync(path, 'utf-8'));

  if (!Array.isArray(raw)) {
    throw new AppsRegistryError('apps.json must contain a top-level array');
  }

  const seenNames = new Set<string>();
  return raw.map((entry, index) => {
    const name = assertString(entry.name, 'name', index);
    const org = assertString(entry.org, 'org', index);
    const repo = assertString(entry.repo, 'repo', index);
    const branches = assertBranches(entry.branches, index);

    if (seenNames.has(name)) {
      throw new AppsRegistryError(
        `apps.json contains a duplicate app name: "${name}"`,
      );
    }
    seenNames.add(name);

    return { name, org, repo, branches };
  });
}
