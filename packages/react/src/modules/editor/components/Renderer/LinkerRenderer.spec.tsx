import { Node } from '@tiptap/pm/model';
import { Editor } from '@tiptap/react';

import { render, screen } from '~/setup';
import LinkerRenderer from './LinkerRenderer';

function makeNode(attrs: Record<string, any> = {}, textContent = ''): Node {
  return { attrs, textContent } as unknown as Node;
}

function renderLinker(props: {
  node: Node;
  selected?: boolean;
  editor?: Editor;
}) {
  const editor = props.editor ?? ({ isEditable: true } as unknown as Editor);

  return render(
    <LinkerRenderer
      node={props.node}
      selected={props.selected ?? false}
      editor={editor}
    />,
  );
}

describe('LinkerRenderer', () => {
  it('adds the highlight class when selected is true', () => {
    const node = makeNode({ 'data-app-prefix': 'blog' }, 'My link');
    renderLinker({ node, selected: true });

    expect(screen.getByText('My link').closest('.badge')).toHaveClass(
      'bg-secondary-200',
    );
  });

  it('does not add the highlight class when selected is false', () => {
    const node = makeNode({ 'data-app-prefix': 'blog' }, 'My link');
    renderLinker({ node, selected: false });

    expect(screen.getByText('My link').closest('.badge')).not.toHaveClass(
      'bg-secondary-200',
    );
  });

  it('prefers node.attrs.title over node.textContent when both are present', () => {
    const node = makeNode(
      { 'data-app-prefix': 'blog', 'title': 'Explicit title' },
      'Fallback text',
    );
    renderLinker({ node });

    expect(screen.getByText('Explicit title')).toBeInTheDocument();
    expect(screen.queryByText('Fallback text')).not.toBeInTheDocument();
  });

  it('falls back to node.textContent when title is absent', () => {
    const node = makeNode({ 'data-app-prefix': 'blog' }, 'Fallback text');
    renderLinker({ node });

    expect(screen.getByText('Fallback text')).toBeInTheDocument();
  });

  describe('handleBadgeClick', () => {
    it('calls window.open with href/target in read mode when both attrs are set', async () => {
      const node = makeNode(
        {
          'data-app-prefix': 'blog',
          'href': '/workspace/document/abc',
          'target': '_blank',
        },
        'My link',
      );
      const editor = { isEditable: false } as unknown as Editor;
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const { user } = renderLinker({ node, editor });
      await user.click(screen.getByText('My link'));

      expect(openSpy).toHaveBeenCalledWith('/workspace/document/abc', '_blank');

      openSpy.mockRestore();
    });

    it('calls window.open with the about:blank/_self fallbacks in read mode when href/target are absent', async () => {
      const node = makeNode({ 'data-app-prefix': 'blog' }, 'My link');
      const editor = { isEditable: false } as unknown as Editor;
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const { user } = renderLinker({ node, editor });
      await user.click(screen.getByText('My link'));

      expect(openSpy).toHaveBeenCalledWith('about:blank', '_self');

      openSpy.mockRestore();
    });

    it('does not call window.open in edit mode', async () => {
      const node = makeNode(
        {
          'data-app-prefix': 'blog',
          'href': '/workspace/document/abc',
          'target': '_blank',
        },
        'My link',
      );
      const editor = { isEditable: true } as unknown as Editor;
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      const { user } = renderLinker({ node, editor });
      await user.click(screen.getByText('My link'));

      expect(openSpy).not.toHaveBeenCalled();

      openSpy.mockRestore();
    });
  });
});
