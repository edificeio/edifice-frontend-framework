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

  it('calls onSuccess with the raw typed latex (no $...$ wrapping)', async () => {
    // Regression: onSuccess used to be called with a `$...$`-wrapped string,
    // which useMathsModal then inserted as literal text - TipTap's input
    // rules (which would convert that syntax) only fire on live keystrokes,
    // never on a programmatic insertion, so no real equation was ever
    // created. Passing the raw latex lets the caller build a real node.
    const onSuccess = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onSuccess={onSuccess} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    // Use fireEvent-friendly typing: user.type handles simple text fine here,
    // no special characters requiring escaping are used in this input.
    await user.type(textarea, 'x+y');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSuccess).toHaveBeenCalledWith('x+y');
  });

  it('preserves newlines as-is in the latex passed to onSuccess', async () => {
    // The old `$<br/>$`-splicing hack was a workaround for the broken
    // string-insertion path above - LaTeX environments handle embedded
    // newlines natively, so there's nothing left to work around.
    const onSuccess = vi.fn();
    const { user } = render(<MathsModal isOpen={true} onSuccess={onSuccess} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    await user.type(textarea, 'a{Enter}b');

    await user.click(screen.getByRole('button', { name: 'Add' }));

    expect(onSuccess).toHaveBeenCalledWith('a\nb');
  });

  it('shows a real rendered equation in the preview, not literal $...$ text', () => {
    // Regression: setContent('$...$') never produced a math node either
    // (same input-rules-only limitation), so the preview showed raw text
    // instead of the actual formula.
    const { container } = render(<MathsModal isOpen={true} />);

    expect(
      container.querySelector('[data-type="inline-math"]'),
    ).toBeInTheDocument();
    expect(screen.queryByText(`$${FORMULA_PLACEHOLDER}$`)).toBeNull();
  });

  it('updates the preview to the newly typed equation, not just the initial one', async () => {
    const { user } = render(<MathsModal isOpen={true} />);

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    await user.clear(textarea);
    await user.type(textarea, 'x^2');

    const preview = document.querySelector('[data-latex="x^2"]');
    expect(preview).toBeInTheDocument();
    expect(
      document.querySelector(`[data-latex="${FORMULA_PLACEHOLDER}"]`),
    ).not.toBeInTheDocument();
  });

  it('does not call onSuccess when Cancel is clicked after typing a formula', async () => {
    const onSuccess = vi.fn();
    const onCancel = vi.fn();
    const { user } = render(
      <MathsModal isOpen={true} onSuccess={onSuccess} onCancel={onCancel} />,
    );

    const textarea = screen.getByPlaceholderText(
      `Exemple : ${FORMULA_PLACEHOLDER}`,
    );
    await user.type(textarea, 'x+y');
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(onCancel).toHaveBeenCalledTimes(1);
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('resets latex to an empty string when the textarea is cleared', async () => {
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

    expect(onSuccess).toHaveBeenCalledWith(FORMULA_PLACEHOLDER);
  });

  it('does not render the modal content when isOpen is false', () => {
    render(<MathsModal isOpen={false} />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText(`Exemple : ${FORMULA_PLACEHOLDER}`),
    ).not.toBeInTheDocument();
  });
});
