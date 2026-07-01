/** Simple hand-rolled column alignment — no formatting library, full control over truncation. */
export function renderTable(headers: string[], rows: string[][]): string {
  const widths = headers.map((header, i) =>
    Math.max(header.length, ...rows.map((row) => (row[i] ?? '').length)),
  );

  const renderRow = (cells: string[]) =>
    cells
      .map((cell, i) => cell.padEnd(widths[i]))
      .join('  ')
      .trimEnd();

  const separator = widths.map((w) => '-'.repeat(w)).join('  ');

  return [renderRow(headers), separator, ...rows.map(renderRow)].join('\n');
}
