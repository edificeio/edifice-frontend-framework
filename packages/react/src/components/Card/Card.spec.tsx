import { createRef } from 'react';

import { render, screen } from '~/setup';
import Card from './Card';

describe('Card', () => {
  it('renders the select-menu and clickable overlay buttons by default', async () => {
    const onSelect = vi.fn();
    const onClick = vi.fn();
    const { user } = render(
      <Card onSelect={onSelect} onClick={onClick}>
        <Card.Body>Content</Card.Body>
      </Card>,
    );

    await user.click(screen.getByRole('button', { name: 'card.open.menu' }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    await user.click(
      screen.getByRole('button', { name: 'card.open.resource' }),
    );
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders no header buttons when isSelectable and isClickable are both false', () => {
    const { container } = render(
      <Card isSelectable={false} isClickable={false}>
        <Card.Body>Content</Card.Body>
      </Card>,
    );

    expect(container.querySelector('.card-header')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('applies isSelected and isFocused classes', () => {
    const { container } = render(
      <Card isSelected isFocused>
        <Card.Body>Content</Card.Body>
      </Card>,
    );

    expect(container.firstChild).toHaveClass('is-selected', 'drag-focus');
  });

  it('Card.Image renders an img when imageSrc is provided', () => {
    const { container } = render(
      <Card>
        <Card.Image imageSrc="/cover.png" />
      </Card>,
    );

    expect(container.querySelector('img')).toHaveAttribute('src', '/cover.png');
  });

  it('Card.Image falls back to the app icon when no imageSrc is given', () => {
    const { container } = render(
      <Card>
        <Card.Image />
      </Card>,
    );

    expect(container.querySelector('.card-image')).toBeInTheDocument();
    expect(container.querySelector('.card-image img')).not.toBeInTheDocument();
  });

  it('Card.User renders an avatar when userSrc is provided, else a fallback icon', () => {
    const { rerender } = render(
      <Card>
        <Card.User userSrc="/user.png" creatorName="Jane" />
      </Card>,
    );
    expect(screen.getByAltText('Jane')).toHaveAttribute('src', '/user.png');

    rerender(
      <Card>
        <Card.User userSrc="" creatorName="Jane" />
      </Card>,
    );
    expect(screen.queryByAltText('Jane')).not.toBeInTheDocument();
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Card ref={ref}>
        <Card.Body>Content</Card.Body>
      </Card>,
    );

    expect(ref.current).toHaveClass('card');
  });
});
