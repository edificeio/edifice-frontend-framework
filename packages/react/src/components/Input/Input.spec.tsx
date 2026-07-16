import { render, screen } from '~/setup';
import { FormControl } from '../Form';
import { Label } from '../Label';
import Input from './Input';

describe('Input', () => {
  it('renders an input wired to the FormControl id and label', () => {
    render(
      <FormControl id="firstname">
        <Label>First name</Label>
        <Input type="text" size="md" placeholder="Type here" />
      </FormControl>,
    );

    const input = screen.getByLabelText('First name');
    expect(input).toHaveAttribute('id', 'firstname');
    expect(input).toHaveAttribute('placeholder', 'Type here');
  });

  it('calls onChange with the native event and updates its value', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <FormControl id="firstname">
        <Input type="text" size="md" onChange={handleChange} />
      </FormControl>,
    );

    const input = screen.getByRole('textbox');
    await user.type(input, 'abc');

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(input).toHaveValue('abc');
  });

  it('is disabled when the disabled prop is set', () => {
    render(
      <FormControl id="firstname">
        <Input type="text" size="md" disabled />
      </FormControl>,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('is required and readonly from the FormControl context', () => {
    const { rerender } = render(
      <FormControl id="firstname" isRequired>
        <Input type="text" size="md" />
      </FormControl>,
    );
    expect(screen.getByRole('textbox')).toBeRequired();

    rerender(
      <FormControl id="firstname" isReadOnly>
        <Input type="text" size="md" />
      </FormControl>,
    );
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('readonly');
    expect(input).toHaveClass('form-control-plaintext');
  });

  it('reflects the validation status through CSS classes', () => {
    const { rerender } = render(
      <FormControl id="firstname" status="invalid">
        <Input type="text" size="md" />
      </FormControl>,
    );
    expect(screen.getByRole('textbox')).toHaveClass('is-invalid');

    rerender(
      <FormControl id="firstname" status="valid">
        <Input type="text" size="md" />
      </FormControl>,
    );
    expect(screen.getByRole('textbox')).toHaveClass('is-valid');
  });

  it('shows a character counter when showCounter is set', () => {
    render(
      <FormControl id="firstname">
        <Input
          type="text"
          size="md"
          showCounter
          maxLength={10}
          defaultValue="hi"
        />
      </FormControl>,
    );

    expect(screen.getByText('2 / 10')).toBeInTheDocument();
  });
});
