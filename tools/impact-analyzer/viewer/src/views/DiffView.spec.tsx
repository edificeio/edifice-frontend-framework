import type { DiffReport } from '@edifice.io/impact-analyzer';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { DiffView } from './DiffView.js';
import { loadDiffReport } from '../data/loadIndex.js';

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

describe('DiffView', () => {
  afterEach(() => {
    vi.mocked(loadDiffReport).mockReset();
  });

  it('shows a hint when no diff has been generated', () => {
    render(<DiffView diffs={[]} selectedFile={null} onSelectFile={vi.fn()} />);
    expect(screen.getByText(/pas encore de rapport de diff/i)).toBeTruthy();
  });

  it('falls back to the first diff when the deep-linked selection no longer exists', () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const onSelectFile = vi.fn();
    const diffs = [
      { base: 'develop', head: 'feat-a', file: 'diff.develop..feat-a.json' },
      { base: 'develop', head: 'feat-b', file: 'diff.develop..feat-b.json' },
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

  it('requests the first diff via onSelectFile, then loads it once the (controlled) selection arrives', async () => {
    vi.mocked(loadDiffReport).mockResolvedValue(makeReport());
    const onSelectFile = vi.fn();
    const diffs = [{ base: 'develop', head: 'feat-x', file: 'diff.a.json' }];

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
        diffs={[{ base: 'develop', head: 'feat-x', file: 'diff.a.json' }]}
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
