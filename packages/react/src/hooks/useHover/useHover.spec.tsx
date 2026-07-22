import { fireEvent, render, screen } from '~/setup';
import useHover from './useHover';

function HookHost() {
  const [ref, isHovered] = useHover<HTMLButtonElement>();

  return (
    <>
      <button ref={ref} data-testid="hover-target" type="button">
        Hover me
      </button>
      <span>{isHovered ? 'hovered' : 'not-hovered'}</span>
    </>
  );
}

describe('useHover', () => {
  it('sets hovered state to true on mouseover and false on mouseout', () => {
    render(<HookHost />);
    const target = screen.getByTestId('hover-target');

    fireEvent.mouseOver(target);
    expect(screen.getByText('hovered')).toBeInTheDocument();

    fireEvent.mouseOut(target);
    expect(screen.getByText('not-hovered')).toBeInTheDocument();
  });
});
