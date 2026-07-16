import { describe, expect, it } from 'vitest';
import { renderTable } from './format-table.js';

describe('renderTable', () => {
  it('aligns columns to the widest cell in each column', () => {
    const output = renderTable(
      ['Name', 'Count'],
      [
        ['communities', '12'],
        ['a', '1234'],
      ],
    );
    const lines = output.split('\n');
    expect(lines[0]).toBe('Name         Count');
    expect(lines[3]).toBe('a            1234');
  });

  it('renders a separator line matching column widths', () => {
    const output = renderTable(['A', 'B'], [['1', '22']]);
    const lines = output.split('\n');
    expect(lines[1]).toBe('-  --');
  });

  it('handles an empty row set', () => {
    const output = renderTable(['A', 'B'], []);
    expect(output.split('\n')).toEqual(['A  B', '-  -']);
  });
});
