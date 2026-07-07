import type { GithubFileRef } from '../lib/github-link.js';
import { FileLink } from './FileLink.js';

const MAX_FILES_SHOWN = 200;

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

  return (
    <div className="file-grid-panel">
      {title && <p className="file-grid-title">{title}</p>}
      <ul className="file-grid">
        {shown.map((file) => (
          <li key={file}>
            <FileLink fileRef={fileRef} file={file} />
          </li>
        ))}
        {hidden > 0 && <li className="hint">… et {hidden} autres</li>}
      </ul>
    </div>
  );
}
