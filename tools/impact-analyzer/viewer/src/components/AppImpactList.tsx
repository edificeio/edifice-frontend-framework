import type { GithubFileRef } from '../lib/github-link.js';
import { FileLinkList } from './FileLinkList.js';

export interface AppImpact extends GithubFileRef {
  appBranch: string;
  files?: string[];
}

/**
 * "Apps touchées" cell content: one collapsible entry per impacted
 * (app, branch), expanding to the impacted files linked to their SHA-pinned
 * GitHub blobs. Reports written before files were denormalized fall back to
 * the previous compact comma-separated app list.
 */
export function AppImpactList({ impacts }: { impacts: AppImpact[] }) {
  if (impacts.length === 0) return <>—</>;

  if (impacts.every((i) => !i.files || i.files.length === 0)) {
    return <>{[...new Set(impacts.map((i) => i.app))].join(', ')}</>;
  }

  return (
    <ul className="app-impacts">
      {impacts.map((impact) => (
        <li key={`${impact.app}-${impact.appBranch}`}>
          {impact.files && impact.files.length > 0 ? (
            <FileLinkList
              fileRef={impact}
              files={impact.files}
              label={`${impact.app} (${impact.appBranch}) · ${impact.files.length} fichier${impact.files.length > 1 ? 's' : ''}`}
            />
          ) : (
            <span>
              {impact.app} ({impact.appBranch})
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
