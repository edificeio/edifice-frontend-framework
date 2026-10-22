import { generateHTML, generateJSON } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import { describe, expect, it } from 'vitest';
import { ConversationHistoryBody } from './conversation-history-body';

describe('ConversationHistoryBody', () => {
  const extensions = [StarterKit, ConversationHistoryBody];

  it('parses div.conversation-history-body', () => {
    const json = generateJSON(
      '<div class="conversation-history-body"><p>Reply</p></div>',
      extensions,
    );

    expect(json.content[0].type).toBe('converstationHistoryBody');
  });

  it('renders back with the same class', () => {
    const json = {
      type: 'doc',
      content: [
        {
          type: 'converstationHistoryBody',
          content: [
            { type: 'paragraph', content: [{ type: 'text', text: 'Reply' }] },
          ],
        },
      ],
    };

    const html = generateHTML(json, extensions);

    expect(html).toBe(
      '<div class="conversation-history-body"><p>Reply</p></div>',
    );
  });
});
