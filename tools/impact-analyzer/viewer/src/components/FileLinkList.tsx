import type { ReactNode } from 'react';
import { githubBlobUrl, type GithubFileRef } from '../lib/github-link.js';

const MAX_FILES_SHOWN = 30;

/**
 * IDE-style single-line path: the (long) directory part is dimmed and
 * middle-truncated by flexbox, the file name stays fully visible and
 * carries the emphasis — a wrapped full-blue underlined URL is unreadable
 * past a handful of entries.
 */
function SplitPath({ file }: { file: string }) {
  const lastSlash = file.lastIndexOf('/');
  const dir = lastSlash >= 0 ? file.slice(0, lastSlash + 1) : '';
  const name = lastSlash >= 0 ? file.slice(lastSlash + 1) : file;
  return (
    <>
      {dir && <span className="file-link-dir">{dir}</span>}
      <span className="file-link-name">{name}</span>
    </>
  );
}

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
  /** Summary content override — defaults to the file count. */
  label?: ReactNode;
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
                <a
                  className="file-link"
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  title={file}
                >
                  <SplitPath file={file} />
                  <span className="file-link-ext" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ) : (
                <span
                  className="file-link file-link--plain"
                  title="Entrée héritée d'un ancien index — lien indisponible"
                >
                  <SplitPath file={file} />
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
