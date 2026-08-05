import { render, screen } from '~/setup';
import MathsModal from './MathsModal';

const FORMULA_PLACEHOLDER = '\\frac{-b + \\sqrt{b^2 - 4ac}}{2a}';

describe('MathsModal', () => {
  it('shows the placeholder formula in the textarea when open', () => {
    render(<MathsModal isOpen={true} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    expect(textarea).toBeInTheDocument();
  });

  it('updates formulaEditor with the typed content wrapped in $...$', async () => {
    const onSuccess = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onSuccess={onSuccess} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    // Use fireEvent-friendly typing: user.type handles simple text fine here,
    // no special characters requiring escaping are used in this input.
    await user.type(textarea, 'x+y');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSuccess).toHaveBeenCalledWith('$x+y$');
  });

  it('replaces newlines in the typed content with $<br/>$ before calling onSuccess', async () => {
    const onSuccess = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onSuccess={onSuccess} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    await user.type(textarea, 'a{Enter}b');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSuccess).toHaveBeenCalledWith('$a$<br/>$b$');
  });

  it('resets formulaEditor to an empty string when the textarea is cleared', async () => {
    const onSuccess = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onSuccess={onSuccess} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    await user.type(textarea, 'x+y');
    await user.clear(textarea);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSuccess).toHaveBeenCalledWith('');
  });

  it('calls onCancel when the cancel button is clicked', async () => {
    const onCancel = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onCancel={onCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onSuccess with the initial placeholder formula when Add is clicked without any change', async () => {
    const onSuccess = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onSuccess={onSuccess} />);

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSuccess).toHaveBeenCalledWith(`$${FORMULA_PLACEHOLDER}$`);
  });

  it('does not render the modal content when isOpen is false', () => {
    render(<MathsModal isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(`Exemple : ${FORMULA_PLACEHOLDER}`),
    ).not.toBeInTheDocument();
  });
});
