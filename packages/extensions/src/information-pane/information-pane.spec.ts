import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { InformationPane } from './information-pane';

describe('InformationPane', () => {
  const extensions = [StarterKit, InformationPane];

  it('parses the type from data-type', () => {
    const json = generateJSON(
      '<div data-information-pane data-type="warning"><p>text</p></div>',
      extensions,
    );

    expect(json.content[0]).toMatchObject({
      type: 'information-pane',
      attrs: { type: 'warning' },
    });
  });

  it('defaults type to "info" when data-type is absent', () => {
    const json = generateJSON(
      '<div data-information-pane><p>text</p></div>',
      extensions,
    );

    expect(json.content[0].attrs.type).toBe('info');
  });

  it('renders the type into the class name', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'information-pane',
          attrs: { type: 'warning' },
          content: [{ type: 'paragraph' }],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('class="information-pane information-pane-warning"');
  });
});
