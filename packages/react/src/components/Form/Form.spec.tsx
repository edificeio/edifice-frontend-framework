import { render, screen } from '~/setup';
import { Input } from '../Input';
import FormControl from './FormControl';

describe('FormControl', () => {
  it('exposes the Label, Input and Text compound subcomponents', () => {
    expect(FormControl.Label).toBeDefined();
    expect(FormControl.Input).toBeDefined();
    expect(FormControl.Text).toBeDefined();
  });

  it('shares its id, required and invalid status with its children', () => {
    render(
      <FormControl id="email" isRequired status="invalid">
        <FormControl.Label>Email</FormControl.Label>
        <FormControl.Input type="email" size="md" />
        <FormControl.Text>Required field</FormControl.Text>
      </FormControl>,
    );

    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute('id', 'email');
    expect(input).toBeRequired();
    expect(input).toHaveClass('is-invalid');

    const helpText = screen.getByText('Required field');
    expect(helpText.closest('.form-text')).toHaveClass('is-invalid');
  });

  it('forwards extra props to the wrapping div', () => {
    render(
      <FormControl id="email" data-testid="form-control" className="my-field">
        <FormControl.Input type="email" size="md" />
      </FormControl>,
    );

    expect(screen.getByTestId('form-control')).toHaveClass('my-field');
  });

  it('throws when a field is rendered outside a FormControl', () => {
    // useFormControl() throws synchronously during render without a provider.
    expect(() => render(<Input type="text" size="md" />)).toThrow(
      /outside the FormControl/,
    );
  });
});
