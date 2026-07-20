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
}: {
  onSearchResultsChange?: (model: (string | number)[]) => void;
  comboboxRef?: React.Ref<ComboboxRef>;
}) {
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
});
