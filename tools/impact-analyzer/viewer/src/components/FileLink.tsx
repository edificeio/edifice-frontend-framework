import { githubBlobUrl, type GithubFileRef } from '../lib/github-link.js';

/**
 * IDE-style single-line path: the (long) directory part is dimmed and
 * middle-truncated by flexbox, the file name stays fully visible and
 * carries the emphasis.
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
 * One file row, linking to its SHA-pinned GitHub blob when the index data
 * allows it (plain text otherwise — carried-forward entries, see
 * github-link.ts).
 */
export function FileLink({
  fileRef,
  file,
}: {
  fileRef: GithubFileRef;
  file: string;
}) {
  const url = githubBlobUrl(fileRef, file);
  if (!url) {
    return (
      <span
        className="file-link file-link--plain"
        title="Entrée héritée d'un ancien index — lien indisponible"
      >
        <SplitPath file={file} />
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
      <SplitPath file={file} />
      <span className="file-link-ext" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}
