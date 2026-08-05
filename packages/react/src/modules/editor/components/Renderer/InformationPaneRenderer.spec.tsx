import { Editor } from '@tiptap/react';

import { render } from '~/setup';
import { MediaResizeProps } from '../../hooks';
import InformationPaneRenderer from './InformationPaneRenderer';

function makeNode(type: string) {
  return { attrs: { type } } as any;
}

function renderInformationPane(node: any) {
  const props = {
    node,
    editor: {} as Editor,
  } as MediaResizeProps;

  return render(<InformationPaneRenderer {...props} />);
}

describe('InformationPaneRenderer', () => {
  it.each(['warning', 'success', 'info', 'question'])(
    'renders the %s type with matching className and data-type',
    (type) => {
      const { container } = renderInformationPane(makeNode(type));

      const pane = container.querySelector('[data-information-pane]');
      expect(pane).toHaveClass(`information-pane-${type}`);
      expect(pane).toHaveAttribute('data-type', type);
    },
  );

  it('falls back to the info icon/class for an unrecognized type', () => {
    const { container } = renderInformationPane(makeNode('unknown-type'));

    const pane = container.querySelector('[data-information-pane]');
    expect(pane).toHaveClass('information-pane-unknown-type');
    expect(pane).toHaveAttribute('data-type', 'unknown-type');
  });
});
