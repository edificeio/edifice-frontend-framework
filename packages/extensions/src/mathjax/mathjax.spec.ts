import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { MathJax } from './mathjax';

describe('MathJax', () => {
  const extensions = [StarterKit, MathJax];

  it('extracts the equation text from <mathjax>', () => {
    const json = generateJSON(
      '<p><mathjax>\\begin{equation}{x^2}\\end{equation}</mathjax></p>',
      extensions,
    );

    expect(json.content[0].content[0]).toMatchObject({
      type: 'mathjaxnode',
      attrs: { equation: '\\begin{equation}{x^2}\\end{equation}' },
    });
  });

  it('renders the equation wrapped in $...$ for MathJax to pick up', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'mathjaxnode',
              attrs: { equation: '\\begin{equation}{x^2}\\end{equation}' },
            },
          ],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toContain('$x^2$');
  });
});
