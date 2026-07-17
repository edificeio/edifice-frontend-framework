import { createRef } from 'react';
import { render, screen } from '~/setup';
import { Popover, PopoverBody, PopoverFooter, PopoverHeader } from './Popover';

describe('Popover', () => {
  it('does not render when isVisible is false', () => {
    render(
      <Popover id="popover" isVisible={false}>
        Content
      </Popover>,
    );

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('does not render when isVisible is omitted', () => {
    render(<Popover id="popover">Content</Popover>);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('renders its content when isVisible is true', () => {
    render(
      <Popover id="popover" isVisible>
        Content
      </Popover>,
    );

    const popover = screen.getByRole('tooltip');
    expect(popover).toBeInTheDocument();
    expect(popover).toHaveAttribute('aria-labelledby', 'popover');
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('renders Header, Body and Footer subcomponents', () => {
    render(
      <Popover id="popover" isVisible>
        <PopoverHeader>Title</PopoverHeader>
        <PopoverBody>Body text</PopoverBody>
        <PopoverFooter>Footer text</PopoverFooter>
      </Popover>,
    );

    expect(screen.getByText('Title').closest('div')).toHaveClass(
      'popover-header',
    );
    expect(screen.getByText('Body text').closest('div')).toHaveClass(
      'popover-body',
    );
    expect(screen.getByText('Footer text').closest('div')).toHaveClass(
      'popover-footer',
    );
  });

  it('forwards a ref to the root element', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <Popover id="popover" isVisible ref={ref}>
        Content
      </Popover>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toHaveAttribute('role', 'tooltip');
  });
});
