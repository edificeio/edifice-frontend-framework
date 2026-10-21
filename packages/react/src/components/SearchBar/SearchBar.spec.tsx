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
        <SearchBar
          isVariant={false}
          clearable={false}
          defaultValue="hello"
          onClick={onClick}
        />,
      );

      await user.click(screen.getByRole('button'));

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is active only while focused or filled', async () => {
      const onClick = vi.fn();
      const { user } = render(
        <SearchBar isVariant={false} clearable={false} onClick={onClick} />,
      );
      const searchbox = screen.getByRole('searchbox');
      const wrapper = searchbox.closest('.searchbar');

      // Empty and unfocused: idle. Idle is a visual state handled in CSS
      // (per theme), the button itself is never `disabled` for it.
      expect(wrapper).not.toHaveClass('searchbar--active');
      expect(screen.getByRole('button')).toBeEnabled();

      // Focused while empty: active, and the click still lands
      await user.click(searchbox);
      expect(wrapper).toHaveClass('searchbar--active');
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalledTimes(1);

      // Blurred while empty: idle again
      await user.tab();
      await user.tab();
      expect(wrapper).not.toHaveClass('searchbar--active');
      expect(screen.getByRole('button')).toBeEnabled();
    });

    it('stays active when filled even without focus', () => {
      render(
        <SearchBar
          isVariant={false}
          clearable={false}
          defaultValue="hello"
          onClick={vi.fn()}
        />,
      );

      expect(screen.getByRole('button')).toBeEnabled();
      expect(screen.getByRole('searchbox').closest('.searchbar')).toHaveClass(
        'searchbar--active',
      );
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
      // The clear dispatches a real input event: read the value at call
      // time, before React restores the controlled value "foo".
      const values: string[] = [];
      const onChange = vi.fn((e) => values.push(e.target.value));
      const { user } = render(
        <SearchBar isVariant clearable value="foo" onChange={onChange} />,
      );

      const clearButton = screen.getByRole('button');
      await user.click(clearButton);

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(values).toEqual(['']);
    });

    it('shows the clear button for a defaultValue and clears it', async () => {
      const { user } = render(
        <SearchBar isVariant clearable defaultValue="foo" />,
      );

      await user.click(screen.getByRole('button'));

      expect(screen.getByRole('searchbox')).toHaveValue('');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows the clear button once the user types', async () => {
      const { user } = render(<SearchBar isVariant clearable />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
      await user.type(screen.getByRole('searchbox'), 'a');

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('does not show the clear button when there is no value', () => {
      render(<SearchBar isVariant clearable value="" onChange={vi.fn()} />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
