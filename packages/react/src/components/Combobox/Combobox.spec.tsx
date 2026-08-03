import { ChangeEvent, useState } from 'react';

import { createRef } from 'react';
import { render, screen, waitFor } from '~/setup';
import Combobox, { ComboboxRef, OptionListItemType } from './Combobox';

const allOptions: OptionListItemType[] = [
  { value: 'first', label: 'First Item' },
  { value: 'second', label: 'Second Item' },
  { value: 'third', label: 'Third Item' },
];

function getInput() {
  return screen.getByTestId('combobox-search-input');
}

function ControlledCombobox({
  onSearchResultsChange,
  comboboxRef,
  ...extraProps
}: {
  onSearchResultsChange?: (model: (string | number)[]) => void;
  comboboxRef?: React.Ref<ComboboxRef>;
} & Partial<React.ComponentProps<typeof Combobox>>) {
  const [value, setValue] = useState('');
  const [options, setOptions] = useState<OptionListItemType[]>([]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setOptions(
      allOptions.filter((option) =>
        (option.label ?? '')
          .toLowerCase()
          .includes(event.target.value.toLowerCase()),
      ),
    );
  };

  return (
    <Combobox
      ref={comboboxRef}
      value={value}
      options={options}
      isLoading={false}
      noResult={value.length >= 3 && options.length === 0}
      onSearchInputChange={handleChange}
      onSearchResultsChange={onSearchResultsChange}
      placeholder="Rechercher…"
      {...extraProps}
    />
  );
}

describe('Combobox', () => {
  it('displays the placeholder', () => {
    render(<ControlledCombobox />);

    expect(getInput()).toHaveAttribute('placeholder', 'Rechercher…');
  });

  it('shows the loading indicator when isLoading is true', () => {
    render(
      <Combobox
        value="abc"
        options={[]}
        isLoading
        noResult={false}
        onSearchInputChange={vi.fn()}
      />,
    );

    expect(screen.getByText('explorer.search.pending')).toBeInTheDocument();
  });

  it('shows the default no-result message', async () => {
    const { user } = render(<ControlledCombobox />);

    await user.type(getInput(), 'zzz');

    await waitFor(() => {
      expect(screen.getByText('portal.no.result')).toBeInTheDocument();
    });
  });

  it('shows a custom no-result message via renderNoResult', () => {
    render(
      <Combobox
        value="zzz"
        options={[]}
        isLoading={false}
        noResult
        onSearchInputChange={vi.fn()}
        renderNoResult={<div>Aucun résultat personnalisé</div>}
      />,
    );

    expect(screen.getByText('Aucun résultat personnalisé')).toBeInTheDocument();
  });

  it('filters and displays matching options as the user types', async () => {
    const { user } = render(<ControlledCombobox />);

    await user.type(getInput(), 'sec');

    await waitFor(() => {
      expect(screen.getByText('Second Item')).toBeInTheDocument();
    });
    expect(screen.queryByText('First Item')).not.toBeInTheDocument();
  });

  it('selects an option on click and reports it via onSearchResultsChange', async () => {
    const onSearchResultsChange = vi.fn();
    const { user } = render(
      <ControlledCombobox onSearchResultsChange={onSearchResultsChange} />,
    );

    await user.type(getInput(), 'First');
    await waitFor(() => {
      expect(screen.getByText('First Item')).toBeInTheDocument();
    });

    await user.click(screen.getByText('First Item'));

    expect(onSearchResultsChange).toHaveBeenCalledWith(['first']);
  });

  it('clears the input value when the dropdown closes', async () => {
    const { user } = render(<ControlledCombobox />);

    const input = getInput();
    await user.type(input, 'sec');
    await waitFor(() => {
      expect(screen.getByText('Second Item')).toBeInTheDocument();
    });

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('exposes an imperative focus() via ComboboxRef', () => {
    const ref = createRef<ComboboxRef>();
    render(<ControlledCombobox comboboxRef={ref} />);

    ref.current?.focus();

    expect(getInput()).toHaveFocus();
  });

  describe('custom rendering', () => {
    it('hands the whole list over to renderList', async () => {
      const { user } = render(
        <ControlledCombobox
          renderList={(options) => (
            <div data-testid="custom-list">{options.length} options</div>
          )}
        />,
      );

      await user.type(getInput(), 'ite');

      expect(await screen.findByTestId('custom-list')).toHaveTextContent(
        '3 options',
      );
    });

    it('lets renderListItem decorate each option', async () => {
      const { user } = render(
        <ControlledCombobox
          renderListItem={(option) => (
            <span data-testid={`option-${option.value}`}>{option.label}</span>
          )}
        />,
      );

      await user.type(getInput(), 'ite');

      expect(await screen.findByTestId('option-first')).toHaveTextContent(
        'First Item',
      );
    });

    it('renders the extra input-group content and the selected items', () => {
      render(
        <Combobox
          value=""
          options={[]}
          onSearchInputChange={vi.fn()}
          renderInputGroup={<span data-testid="input-group">@</span>}
          renderSelectedItems={<span data-testid="selected">1 selected</span>}
        />,
      );

      expect(screen.getByTestId('input-group')).toBeInTheDocument();
      expect(screen.getByTestId('selected')).toBeInTheDocument();
    });

    it('drops the input border in the ghost variant', () => {
      render(
        <Combobox
          value=""
          options={[]}
          onSearchInputChange={vi.fn()}
          variant="ghost"
        />,
      );

      expect(getInput()).toHaveClass('border-0');
    });
  });

  describe('keyboard', () => {
    it('reports the key releases to the caller', async () => {
      const onSearchInputKeyUp = vi.fn();
      const { user } = render(
        <Combobox
          value=""
          options={[]}
          onSearchInputChange={vi.fn()}
          onSearchInputKeyUp={onSearchInputKeyUp}
        />,
      );

      await user.type(getInput(), 'a');

      expect(onSearchInputKeyUp).toHaveBeenCalled();
    });

    it('survives a key release without a handler', async () => {
      const { user } = render(
        <Combobox value="" options={[]} onSearchInputChange={vi.fn()} />,
      );

      await user.type(getInput(), 'a');

      expect(getInput()).toHaveValue('a');
    });
  });

  describe('opening rules', () => {
    it('opens as soon as the input reaches the minimum length', async () => {
      const { user } = render(<ControlledCombobox searchMinLength={2} />);

      await user.type(getInput(), 'it');

      expect(await screen.findByText('First Item')).toBeInTheDocument();
    });

    it('opens on click when a default option is offered', async () => {
      const { user } = render(
        <Combobox
          value=""
          options={allOptions}
          hasDefault
          onSearchInputChange={vi.fn()}
        />,
      );

      await user.click(getInput());

      expect(await screen.findByText('First Item')).toBeInTheDocument();
    });
  });
});
