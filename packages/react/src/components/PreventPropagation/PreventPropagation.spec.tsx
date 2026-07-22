import { render, screen } from '~/setup';
import PreventPropagation from './PreventPropagation';

describe('PreventPropagation', () => {
  it('renders children', () => {
    render(
      <PreventPropagation>
        <span>Inner content</span>
      </PreventPropagation>,
    );

    expect(screen.getByText('Inner content')).toBeInTheDocument();
  });

  it('stops click event propagation', async () => {
    const parentClick = vi.fn();
    const { user } = render(
      <div onClick={parentClick}>
        <PreventPropagation>
          <button type="button">Child action</button>
        </PreventPropagation>
      </div>,
    );

    await user.click(screen.getByRole('button', { name: 'Child action' }));

    expect(parentClick).not.toHaveBeenCalled();
  });
});
