import type { DiffReport } from '@edifice.io/impact-analyzer';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DiffView } from './DiffView.js';
import type { DiffManifestEntry } from '../data/loadIndex.js';
import { loadDiffReport } from '../data/loadIndex.js';

// jsdom has no layout engine at all (every element measures 0×0, and there's
// no ResizeObserver), so the real @tanstack/react-virtual would render zero
// rows regardless of how the container is stubbed. Swapped for a
// deterministic "render everything, no windowing" stand-in: these tests are
// about DiffReportPicker's own behavior (filtering, selection, a11y wiring),
// not about the virtualization library — the real windowing was verified
// against a real browser (dev server + Playwright).
vi.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: ({ count }: { count: number }) => ({
    getTotalSize: () => count * 34,
    getVirtualItems: () =>
      Array.from({ length: count }, (_, index) => ({
        index,
        start: index * 34,
        size: 34,
      })),
    scrollToIndex: () => {},
  }),
}));

vi.mock('../data/loadIndex.js', () => ({
  loadDiffReport: vi.fn(),
}));

function makeReport(overrides: Partial<DiffReport> = {}): DiffReport {
  return {
    schemaVersion: 1,
    generatedAt: '2026-01-01T00:00:00.000Z',
    base: { ref: 'develop', commit: 'abc1234' },
    head: { ref: 'feat-x', commit: 'def5678' },
    symbolDiffs: [],
    cssDiffs: [],
    scanErrors: [],
    ...overrides,
  };
}

function makeDiff(
  overrides: Partial<DiffManifestEntry> = {},
): DiffManifestEntry {
  return {
    base: 'develop',
    head: 'feat-x',
    file: 'diff.a.json',
    generatedAt: null,
    ...overrides,
  };
}

describe('DiffView', () => {
  it('shows a hint when no diff has been generated', () => {
    render(<DiffView diffs={[]} selectedFile={null} onSelectFile={vi.fn()} />);
    expect(screen.getByText(/pas encore de rapport de diff/i)).toBeTruthy();
  });

  it('falls back to the first diff when the deep-linked selection no longer exists', () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const onSelectFile = vi.fn();
    const diffs = [
      makeDiff({ head: 'feat-a', file: 'diff.develop..feat-a.json' }),
      makeDiff({ head: 'feat-b', file: 'diff.develop..feat-b.json' }),
    ];

    render(
      <DiffView
        diffs={diffs}
        selectedFile="diff.develop..deleted-report.json"
        onSelectFile={onSelectFile}
      />,
    );

    expect(onSelectFile).toHaveBeenCalledWith('diff.develop..feat-a.json');
  });

  it('opens the report picker on a search combobox with an accessible name, and can select a report from it', () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const onSelectFile = vi.fn();
    const diffs = [
      makeDiff({ head: 'feat-a', file: 'diff.develop..feat-a.json' }),
      makeDiff({ head: 'feat-b', file: 'diff.develop..feat-b.json' }),
    ];

    render(
      <DiffView
        diffs={diffs}
        selectedFile="diff.develop..feat-a.json"
        onSelectFile={onSelectFile}
      />,
    );

    // The trigger button itself carries the current selection as its label.
    const trigger = screen.getByRole('button', { name: /develop.*feat-a/i });
    fireEvent.click(trigger);

    const search = screen.getByRole('combobox', {
      name: /rechercher un rapport/i,
    });
    expect(search).toBeTruthy();

    fireEvent.click(screen.getByRole('option', { name: /develop.*feat-b/i }));
    expect(onSelectFile).toHaveBeenCalledWith('diff.develop..feat-b.json');
  });

  it('filters the picker options by search query', () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const diffs = [
      makeDiff({ head: 'feat-a', file: 'diff.develop..feat-a.json' }),
      makeDiff({
        head: 'storybook-guides',
        file: 'diff.develop..storybook.json',
      }),
    ];

    render(
      <DiffView
        diffs={diffs}
        selectedFile="diff.develop..feat-a.json"
        onSelectFile={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /develop.*feat-a/i }));
    fireEvent.change(
      screen.getByRole('combobox', { name: /rechercher un rapport/i }),
      { target: { value: 'storybook' } },
    );

    expect(screen.getByRole('option', { name: /storybook/i })).toBeTruthy();
    expect(screen.queryByRole('option', { name: /feat-a/i })).toBeNull();
  });

  it('requests the first diff via onSelectFile, then loads it once the (controlled) selection arrives', async () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const onSelectFile = vi.fn();
    const diffs = [makeDiff()];

    // Like SymbolSearch/AppSearch, DiffView is a controlled component: it
    // asks the parent to pick a default via onSelectFile but can't apply
    // that choice itself — the test must feed the prop back, same as
    // App.tsx does in the real app.
    const { rerender } = render(
      <DiffView
        diffs={diffs}
        selectedFile={null}
        onSelectFile={onSelectFile}
      />,
    );
    expect(onSelectFile).toHaveBeenCalledWith('diff.a.json');

    rerender(
      <DiffView
        diffs={diffs}
        selectedFile="diff.a.json"
        onSelectFile={onSelectFile}
      />,
    );
    await waitFor(() =>
      expect(screen.getByText(/aucun changement risqué détecté/i)).toBeTruthy(),
    );
  });

  it("copies a chip's commit SHA to the clipboard and shows a temporary confirmation", async () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <DiffView
        diffs={[makeDiff()]}
        selectedFile="diff.a.json"
        onSelectFile={vi.fn()}
      />,
    );

    const baseButton = await screen.findByRole('button', {
      name: /copier le sha de base/i,
    });
    fireEvent.click(baseButton);

    expect(writeText).toHaveBeenCalledWith('abc1234');
    await waitFor(() => expect(screen.getByText('✓ Copié')).toBeTruthy());

    // Each chip copies its own SHA, independently of the other's state.
    const headButton = screen.getByRole('button', {
      name: /copier le sha de tête/i,
    });
    fireEvent.click(headButton);
    expect(writeText).toHaveBeenCalledWith('def5678');
  });

  it('copies a pointer to the report (not its content) for the verify-impact-finding skill', async () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });

    render(
      <DiffView
        diffs={[makeDiff({ file: 'diff.develop..feat-x.json' })]}
        selectedFile="diff.develop..feat-x.json"
        onSelectFile={vi.fn()}
      />,
    );

    const button = await screen.findByRole('button', {
      name: /copier le prompt de vérification/i,
    });
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('diff.develop..feat-x.json'),
    );
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('edificeio/impact-analyzer-data'),
    );
    await waitFor(() => expect(screen.getByText('✓ Copié')).toBeTruthy());
  });

  it('renders symbol diffs sorted by risk with severity and change kind', async () => {
    vi.mocked(loadDiffReport).mockResolvedValue(
      makeReport({
        symbolDiffs: [
          {
            package: '@edifice.io/react',
            entry: '.',
            name: 'Dropdown',
            kind: 'component',
            changeKind: 'signature-changed',
            severity: 'likely-breaking',
            sourceFilesBase: [],
            sourceFilesHead: [],
            consumers: [],
            riskScore: 42,
          },
        ],
      }),
    );

    render(
      <DiffView
        diffs={[makeDiff()]}
        selectedFile="diff.a.json"
        onSelectFile={vi.fn()}
      />,
    );

    await waitFor(() => expect(screen.getByText('42')).toBeTruthy());
    const row = screen.getAllByRole('row')[1]; // skip header row
    expect(row.textContent).toContain('Dropdown');
    expect(row.textContent).toContain('signature-changed');
  });
});
