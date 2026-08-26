import { useEffect, useMemo, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import type { DiffManifestEntry } from '../data/loadIndex.js';

export interface DiffReportPickerProps {
  /** Already sorted by App.tsx/loadManifest (most recent first) — this component only filters, it never reorders. */
  diffs: DiffManifestEntry[];
  selectedFile: string | null;
  onSelectFile: (file: string) => void;
}

const ROW_HEIGHT = 34;
const LIST_ID = 'diff-report-listbox';

function diffLabel(d: DiffManifestEntry): string {
  return `${d.base} → ${d.head}`;
}

function optionId(index: number): string {
  return `${LIST_ID}-option-${index}`;
}

/**
 * Replaces a plain <select> once the report list outgrows it (hundreds of
 * PR diffs accumulate over time — a native dropdown with no search and no
 * virtualization becomes unusable well before that). Search + a listbox
 * popup, virtualized with @tanstack/react-virtual so the DOM cost stays
 * flat regardless of how many reports exist.
 */
export function DiffReportPicker({
  diffs,
  selectedFile,
  onSelectFile,
}: DiffReportPickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selected = useMemo(
    () => diffs.find((d) => d.file === selectedFile) ?? null,
    [diffs, selectedFile],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? diffs.filter((d) => diffLabel(d).toLowerCase().includes(q))
      : diffs;
  }, [diffs, query]);

  const virtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 8,
  });

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!open) return;
    setHighlightedIndex(
      Math.max(0, diffs.indexOf(selected as DiffManifestEntry)),
    );
    inputRef.current?.focus();
    // Only on the open transition — re-running on every `selected`/`diffs`
    // change would fight the user's own arrow-key navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) virtualizer.scrollToIndex(highlightedIndex, { align: 'auto' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightedIndex, open]);

  function close(): void {
    setOpen(false);
    setQuery('');
    triggerRef.current?.focus();
  }

  function select(file: string): void {
    onSelectFile(file);
    close();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const target = filtered[highlightedIndex];
      if (target) select(target.file);
    }
  }

  return (
    <div className="diff-picker" ref={wrapperRef}>
      <button
        ref={triggerRef}
        type="button"
        className="diff-picker-trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="diff-picker-trigger-label">
          {selected ? diffLabel(selected) : 'Sélectionner un rapport'}
        </span>
        <span className="diff-picker-caret" aria-hidden="true" />
      </button>

      {open && (
        <div className="diff-picker-popup">
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            className="search-input"
            placeholder="Rechercher une branche..."
            aria-label="Rechercher un rapport de diff"
            aria-expanded={open}
            aria-controls={LIST_ID}
            aria-autocomplete="list"
            aria-activedescendant={
              filtered[highlightedIndex]
                ? optionId(highlightedIndex)
                : undefined
            }
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHighlightedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />

          {filtered.length === 0 ? (
            <p className="hint diff-picker-empty">Aucun résultat.</p>
          ) : (
            <div
              ref={scrollRef}
              id={LIST_ID}
              role="listbox"
              aria-label="Rapports de diff"
              className="diff-picker-list"
            >
              <div
                style={{
                  height: virtualizer.getTotalSize(),
                  position: 'relative',
                }}
              >
                {virtualizer.getVirtualItems().map((virtualRow) => {
                  const d = filtered[virtualRow.index];
                  return (
                    <div
                      key={d.file}
                      id={optionId(virtualRow.index)}
                      role="option"
                      aria-selected={d.file === selectedFile}
                      className={`diff-picker-option${
                        virtualRow.index === highlightedIndex
                          ? ' diff-picker-option-active'
                          : ''
                      }${d.file === selectedFile ? ' diff-picker-option-selected' : ''}`}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: virtualRow.size,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      onMouseEnter={() => setHighlightedIndex(virtualRow.index)}
                      onClick={() => select(d.file)}
                    >
                      {diffLabel(d)}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
