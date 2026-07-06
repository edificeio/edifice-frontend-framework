import type { SymbolEntry } from '@edifice.io/impact-analyzer';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SymbolSearch } from './SymbolSearch.js';

function makeSymbol(overrides: Partial<SymbolEntry> = {}): SymbolEntry {
  return {
    package: '@edifice.io/react',
    entry: '.',
    name: 'Dropdown',
    kind: 'component',
    sourceFiles: [],
    consumers: [],
    ...overrides,
  };
}

describe('SymbolSearch', () => {
  it('renders every symbol and calls onSelect when one is clicked', () => {
    const symbols = [
      makeSymbol({ name: 'Dropdown' }),
      makeSymbol({ name: 'Button' }),
    ];
    const onSelect = vi.fn();

    render(
      <SymbolSearch symbols={symbols} selected={null} onSelect={onSelect} />,
    );

    expect(screen.getByText('Dropdown')).toBeTruthy();
    expect(screen.getByText('Button')).toBeTruthy();

    fireEvent.click(screen.getByText('Dropdown'));
    expect(onSelect).toHaveBeenCalledWith(symbols[0]);
  });

  it('filters by query, debounced', async () => {
    vi.useFakeTimers();
    const symbols = [
      makeSymbol({ name: 'Dropdown' }),
      makeSymbol({ name: 'Button' }),
    ];

    render(
      <SymbolSearch symbols={symbols} selected={null} onSelect={vi.fn()} />,
    );

    fireEvent.change(screen.getByPlaceholderText(/rechercher/i), {
      target: { value: 'Button' },
    });

    // Not yet applied — the filter only recomputes once the debounce fires.
    expect(screen.getByText('Dropdown')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.queryByText('Dropdown')).toBeNull();
    expect(screen.getByText('Button')).toBeTruthy();
    vi.useRealTimers();
  });

  it('renders an empty result list without crashing when there are no symbols', () => {
    render(<SymbolSearch symbols={[]} selected={null} onSelect={vi.fn()} />);
    expect(screen.getByText('Symboles (0)')).toBeTruthy();
  });
});
