import type { ReactNode } from 'react';

/**
 * Chevron toggle controlling a full-width FileGridPanel row — replaces the
 * old in-cell <details>, whose expansion distorted the table layout.
 */
export function FileToggle({
  expanded,
  onToggle,
  label,
}: {
  expanded: boolean;
  onToggle: () => void;
  label: ReactNode;
}) {
  return (
    <button
      type="button"
      className="file-toggle"
      aria-expanded={expanded}
      onClick={onToggle}
    >
      <span className="file-toggle-chevron" aria-hidden="true">
        {expanded ? '▾' : '▸'}
      </span>{' '}
      {label}
    </button>
  );
}
