import { githubBlobUrl, type GithubFileRef } from '../lib/github-link.js';

/**
 * File-name-first rendering (JetBrains-style): the name is always fully
 * visible and carries the emphasis, the remaining directory is dimmed after
 * it and end-truncates when space runs out. `stripPrefix` removes the part
 * shared by every file of the panel (shown once in its header instead of
 * repeated on each row).
 */
function SplitPath({
  file,
  stripPrefix,
}: {
  file: string;
  stripPrefix?: string;
}) {
  const rel =
    stripPrefix && file.startsWith(stripPrefix)
      ? file.slice(stripPrefix.length)
      : file;
  const lastSlash = rel.lastIndexOf('/');
  const dir = lastSlash >= 0 ? rel.slice(0, lastSlash + 1) : '';
  const name = lastSlash >= 0 ? rel.slice(lastSlash + 1) : rel;
  return (
    <>
      <span className="file-link-name">{name}</span>
      {dir && <span className="file-link-dir">{dir}</span>}
    </>
  );
}

/**
 * One file row, linking to its SHA-pinned GitHub blob when the index data
 * allows it (plain text otherwise — carried-forward entries, see
 * github-link.ts).
 */
export function FileLink({
  fileRef,
  file,
  stripPrefix,
}: {
  fileRef: GithubFileRef;
  file: string;
  stripPrefix?: string;
}) {
  const url = githubBlobUrl(fileRef, file);
  if (!url) {
    return (
      <span
        className="file-link file-link--plain"
        title="Entrée héritée d'un ancien index — lien indisponible"
      >
        <SplitPath file={file} stripPrefix={stripPrefix} />
      </span>
    );
  }
  return (
    <a
      className="file-link"
      href={url}
      target="_blank"
      rel="noreferrer"
      title={file}
    >
      <SplitPath file={file} stripPrefix={stripPrefix} />
      <span className="file-link-ext" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
