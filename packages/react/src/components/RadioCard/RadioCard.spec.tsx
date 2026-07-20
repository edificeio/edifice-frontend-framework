import { render, screen } from '~/setup';
import RadioCard from './RadioCard';

describe('RadioCard', () => {
  it('marks itself selected via border class and the inner radio as checked', () => {
    render(
      <RadioCard
        selectedValue="a"
        value="a"
        label="Option A"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('border-secondary');
    expect(screen.getByRole('radio')).toBeChecked();
  });

  it('is not selected when selectedValue does not match its value', () => {
    render(
      <RadioCard
        selectedValue="b"
        value="a"
        label="Option A"
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button')).toHaveClass('border-light');
    expect(screen.getByRole('radio')).not.toBeChecked();
  });

  it('calls onChange when the radio input is clicked directly', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <RadioCard
        selectedValue="b"
        value="a"
        label="Option A"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('radio'));

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('clicks the inner radio when Enter is pressed on the card', async () => {
    const onChange = vi.fn();
    const { user } = render(
      <RadioCard
        selectedValue="b"
        value="a"
        label="Option A"
        onChange={onChange}
      />,
    );

    screen.getByRole('button').focus();
    await user.keyboard('{Enter}');

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('renders the description only when provided', () => {
    const { rerender } = render(
      <RadioCard
        selectedValue="a"
        value="a"
        label="Option A"
        description="Some details"
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByText('Some details')).toBeInTheDocument();

    rerender(
      <RadioCard
        selectedValue="a"
        value="a"
        label="Option A"
        onChange={vi.fn()}
      />,
    );
    expect(screen.queryByText('Some details')).not.toBeInTheDocument();
  });

  it('associates the radio with the label via aria-labelledby', () => {
    render(
      <RadioCard
        selectedValue="a"
        value="a"
        label="Option A"
        onChange={vi.fn()}
      />,
    );

    const radio = screen.getByRole('radio');
    const labelId = radio.getAttribute('aria-labelledby');
    expect(document.getElementById(labelId as string)).toHaveTextContent(
      'Option A',
    );
  });

  it('shares the groupName as the radio input name across a group', () => {
    render(
      <>
        <RadioCard
          selectedValue="a"
          value="a"
          label="Option A"
          groupName="colors"
          onChange={vi.fn()}
        />
        <RadioCard
          selectedValue="a"
          value="b"
          label="Option B"
          groupName="colors"
          onChange={vi.fn()}
        />
      </>,
    );

    const radios = screen.getAllByRole('radio');
    expect(radios[0]).toHaveAttribute('name', 'colors');
    expect(radios[1]).toHaveAttribute('name', 'colors');
  });
});
