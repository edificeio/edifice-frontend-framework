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
    // React's dev-mode guarded callback both logs its own "above error
    // occurred" console.error and dispatches a real window 'error' event,
    // which jsdom would otherwise log as an "Uncaught" exception — even
    // though the test expects and handles the throw.
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const preventDefault = (event: ErrorEvent) => event.preventDefault();
    window.addEventListener('error', preventDefault);

    expect(() => render(<Input type="text" size="md" />)).toThrow(
      /outside the FormControl/,
    );

    window.removeEventListener('error', preventDefault);
    consoleError.mockRestore();
  });
});
