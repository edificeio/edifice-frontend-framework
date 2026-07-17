import { createRef } from 'react';

import { render, screen } from '~/setup';
import ActionBar from './ActionBar';

describe('ActionBar', () => {
  it('renders its children inside an actionbar container', () => {
    render(
      <ActionBar>
        <button>Delete</button>
      </ActionBar>,
    );

    expect(screen.getByRole('button', { name: 'Delete' })).toBeInTheDocument();
  });

  it('applies the actionbar class', () => {
    const { container } = render(
      <ActionBar>
        <span>content</span>
      </ActionBar>,
    );

    expect(container.firstChild).toHaveClass('actionbar');
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <ActionBar ref={ref}>
        <span>content</span>
      </ActionBar>,
    );

    expect(ref.current).toHaveClass('actionbar');
  });
});
