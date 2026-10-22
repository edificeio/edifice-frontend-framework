import { waitFor } from '@testing-library/react';
import { renderHook } from '~/setup';
import { useCommentEditor } from './useCommentEditor';

describe('useCommentEditor', () => {
  it("parses <a href> as a hyperlink mark, not StarterKit's bundled link", async () => {
    const { result } = renderHook(() =>
      useCommentEditor(true, '<p><a href="https://example.com">link</a></p>'),
    );

    await waitFor(() => expect(result.current.editor).toBeTruthy());

    const types = JSON.stringify(result.current.editor!.getJSON());

    // v3's StarterKit bundles its own 'link' mark, which must stay disabled
    // wherever Hyperlink is used, or it silently wins the parse instead.
    expect(types).toContain('"hyperlink"');
    expect(types).not.toContain('"type":"link"');
  });
});
