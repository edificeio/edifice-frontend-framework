import { githubBlobUrl, type GithubFileRef } from '../lib/github-link.js';

const MAX_FILES_SHOWN = 30;

/**
 * Collapsed list of a consumer's files, each linking to the SHA-pinned
 * GitHub blob when the index data allows it (plain text otherwise —
 * carried-forward entries, see github-link.ts).
 */
export function FileLinkList({
  fileRef,
  files,
  label,
}: {
  fileRef: GithubFileRef;
  files: string[];
  /** Summary text override — defaults to the file count. */
  label?: string;
}) {
  if (files.length === 0) return <>{label ?? '0'}</>;

  const shown = files.slice(0, MAX_FILES_SHOWN);
  const hidden = files.length - shown.length;

  return (
    <details className="file-links">
      <summary>
        {label ?? `${files.length} fichier${files.length > 1 ? 's' : ''}`}
      </summary>
      <ul>
        {shown.map((file) => {
          const url = githubBlobUrl(fileRef, file);
          return (
            <li key={file}>
              {url ? (
                <a href={url} target="_blank" rel="noreferrer">
                  {file}
                </a>
              ) : (
                <span title="Entrée héritée d'un ancien index — lien indisponible">
                  {file}
                </span>
              )}
            </li>
          );
        })}
        {hidden > 0 && <li className="hint">… et {hidden} autres</li>}
      </ul>
    </details>
  );
}
