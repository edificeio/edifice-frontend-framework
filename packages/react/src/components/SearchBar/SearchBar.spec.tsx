import { render, screen } from '~/setup';
import SearchBar from './SearchBar';

describe('SearchBar', () => {
  describe('default variant (with submit button)', () => {
    it('renders a search input and a submit button', () => {
      render(<SearchBar isVariant={false} onClick={vi.fn()} />);

      expect(screen.getByRole('searchbox')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('triggers onClick when the submit button is clicked', async () => {
      const onClick = vi.fn();
      const { user } = render(
        <SearchBar isVariant={false} onClick={onClick} />,
      );

      await user.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('triggers onClick when Enter is pressed in the input', async () => {
      const onClick = vi.fn();
      const { user } = render(
        <SearchBar isVariant={false} onClick={onClick} />,
      );

      await user.type(screen.getByRole('searchbox'), 'hello{Enter}');

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('calls onChange while typing', async () => {
      const onChange = vi.fn();
      const { user } = render(
        <SearchBar isVariant={false} onClick={vi.fn()} onChange={onChange} />,
      );

      await user.type(screen.getByRole('searchbox'), 'abc');

      expect(onChange).toHaveBeenCalledTimes(3);
    });

    it('disables the input and the button independently', () => {
      render(
        <SearchBar
          isVariant={false}
          onClick={vi.fn()}
          disabled
          buttonDisabled
        />,
      );

      expect(screen.getByRole('searchbox')).toBeDisabled();
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });

  describe('dynamic variant (live search)', () => {
    it('renders no submit button', () => {
      render(<SearchBar isVariant onChange={vi.fn()} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows a clear button that resets the value through onChange', async () => {
      const onChange = vi.fn();
      const { user } = render(
        <SearchBar isVariant clearable value="foo" onChange={onChange} />,
      );

      const clearButton = screen.getByRole('button');
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].target.value).toBe('');
    });

    it('does not show the clear button when there is no value', () => {
      render(<SearchBar isVariant clearable value="" onChange={vi.fn()} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
