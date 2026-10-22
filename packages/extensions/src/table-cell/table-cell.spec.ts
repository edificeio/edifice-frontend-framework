import { generateHTML, generateJSON } from '@tiptap/html';
import { Table, TableHeader, TableRow } from '@tiptap/extension-table';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { TableCell } from './table-cell';

describe('TableCell', () => {
  const extensions = [
    StarterKit,
    Table.configure({ resizable: true }),
    TableRow,
    TableHeader,
    TableCell,
  ];

  it('parses a background-color style into the backgroundColor attribute', () => {
    const html =
      '<table><tr><td style="background-color: red;">cell</td></tr></table>';

    const json = generateJSON(html, extensions);

    const cell = json.content[0].content[0].content[0];
    expect(cell.attrs.backgroundColor).toBe('red');
  });

  it('renders the backgroundColor attribute back as a style', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'table',
          content: [
            {
              type: 'tableRow',
              content: [
                {
                  type: 'tableCell',
                  attrs: { backgroundColor: 'red' },
                  content: [
                    {
                      type: 'paragraph',
                      content: [{ type: 'text', text: 'cell' }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('background-color: red');
  });

  // Pre-existing quirk (not introduced by the v3 migration, not fixed here) — same root
  // cause as FontSize/LineHeight, see font-size.spec.ts.
  it('documents the current "" (not null) value when no background color is set', () => {
    const html = '<table><tr><td>cell</td></tr></table>';

    const json = generateJSON(html, extensions);

    const cell = json.content[0].content[0].content[0];
    expect(cell.attrs.backgroundColor).toBe('');
  });
});
