import type { GithubFileRef } from '../lib/github-link.js';
import { FileLink } from './FileLink.js';

const MAX_FILES_SHOWN = 200;

/** Longest directory prefix shared by every file — hoisted to the panel header instead of repeated on each row. */
export function commonDirPrefix(files: string[]): string {
  if (files.length === 0) return '';
  let prefix = files[0].slice(0, files[0].lastIndexOf('/') + 1);
  for (const file of files) {
    const dir = file.slice(0, file.lastIndexOf('/') + 1);
    while (prefix && !dir.startsWith(prefix)) {
      prefix = prefix.slice(0, prefix.lastIndexOf('/', prefix.length - 2) + 1);
    }
    if (!prefix) break;
  }
  return prefix;
}

/**
 * Full-width expansion panel rendered in its own colspan table row: the
 * file list gets the whole panel width (multi-column grid) instead of
 * squeezing inside one table cell — which used to distort the column
 * widths and force a horizontal scrollbar.
 */
export function FileGridPanel({
  fileRef,
  files,
  title,
}: {
  fileRef: GithubFileRef;
  files: string[];
  /** Optional heading, e.g. "communities (develop-enabling)" when several apps expand under one row. */
  title?: string;
}) {
  const shown = files.slice(0, MAX_FILES_SHOWN);
  const hidden = files.length - shown.length;
  const prefix = commonDirPrefix(shown);

  return (
    <div className="file-grid-panel">
      {(title || prefix) && (
        <p className="file-grid-title">
          {title}
          {title && prefix && ' — '}
          {prefix && <span className="file-grid-prefix">{prefix}</span>}
        </p>
      )}
      <ul className="file-grid">
        {shown.map((file) => (
          <li key={file}>
            <FileLink fileRef={fileRef} file={file} stripPrefix={prefix} />
          </li>
        ))}
        {hidden > 0 && <li className="hint">… et {hidden} autres</li>}
      </ul>
    </div>
  );
}
