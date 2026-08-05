import { render, screen } from '~/setup';
import ViewsCounter from './ViewsCounter';

describe('ViewsCounter', () => {
  it('displays the number of views', () => {
    render(<ViewsCounter viewsCounter={12} />);

    expect(screen.getByRole('button')).toHaveTextContent('12');
  });

  it('abbreviates a large counter', () => {
    render(<ViewsCounter viewsCounter={12000} />);

    expect(screen.getByRole('button').textContent).not.toBe('12000');
  });

  it('is disabled while nobody has viewed the resource', () => {
    render(<ViewsCounter viewsCounter={0} />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is enabled as soon as there is one view', () => {
    render(<ViewsCounter viewsCounter={1} />);

    expect(screen.getByRole('button')).toBeEnabled();
  });

  it('calls back on click', async () => {
    const onClick = vi.fn();
    const { user } = render(
      <ViewsCounter viewsCounter={3} onClick={onClick} />,
    );

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not bubble the click up to a clickable parent', async () => {
    const onParentClick = vi.fn();
    const { user } = render(
      <div onClick={onParentClick}>
        <ViewsCounter viewsCounter={3} />
      </div>,
    );

    await user.click(screen.getByRole('button'));

    expect(onParentClick).not.toHaveBeenCalled();
  });

  it('appends the custom classes to its own', () => {
    render(<ViewsCounter viewsCounter={3} className="my-class" />);

    expect(screen.getByRole('button')).toHaveClass('btn-icon', 'my-class');
  });

  it('forwards the remaining props to the button', () => {
    render(<ViewsCounter viewsCounter={3} aria-label="views" />);

    expect(screen.getByRole('button', { name: 'views' })).toBeInTheDocument();
  });
});
