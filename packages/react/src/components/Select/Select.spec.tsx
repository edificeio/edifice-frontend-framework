import { render, screen } from '~/setup';
import Select, { OptionsType } from './Select';

const options: OptionsType[] = [
  { value: 'artActivity', label: 'Activités artistiques' },
  { value: 'chemistry', label: 'Chimie' },
  { value: 'law', label: 'Droit' },
];

function getTrigger() {
  return screen.getByRole('combobox');
}

describe('Select', () => {
  it('displays the placeholder option when nothing is selected', () => {
    render(<Select options={options} placeholderOption="Choisir…" />);

    expect(getTrigger()).toHaveTextContent('Choisir…');
  });

  it('opens the menu and lists every option on trigger click', async () => {
    const { user } = render(
      <Select options={options} placeholderOption="Choisir…" />,
    );

    await user.click(getTrigger());

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    });
  });

  it('selects an option on click, updates the trigger label and closes the menu', async () => {
    const onValueChange = vi.fn();
    const { user } = render(
      <Select
        options={options}
        placeholderOption="Choisir…"
        onValueChange={onValueChange}
      />,
    );

    await user.click(getTrigger());
    await user.click(screen.getByText('Chimie'));

    expect(onValueChange).toHaveBeenCalledWith('chemistry');
    expect(getTrigger()).toHaveTextContent('Chimie');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('opens the menu on ArrowDown and selects the focused option on Enter', async () => {
    const onValueChange = vi.fn();
    const { user } = render(
      <Select
        options={options}
        placeholderOption="Choisir…"
        onValueChange={onValueChange}
      />,
    );

    getTrigger().focus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(onValueChange).toHaveBeenCalledWith('chemistry');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes the menu on Escape and refocuses the trigger', async () => {
    const { user } = render(
      <Select options={options} placeholderOption="Choisir…" />,
    );

    await user.click(getTrigger());
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(getTrigger()).toHaveFocus();
  });

  it('respects the controlled selectedValue prop', () => {
    render(
      <Select
        options={options}
        placeholderOption="Choisir…"
        selectedValue={options[2]}
      />,
    );

    expect(getTrigger()).toHaveTextContent('Droit');
  });

  it('preselects the option matching defaultValue', () => {
    render(
      <Select
        options={options}
        placeholderOption="Choisir…"
        defaultValue="law"
      />,
    );

    expect(getTrigger()).toHaveTextContent('Droit');
  });
});
