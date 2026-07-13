import { render, screen } from '~/setup';
import { FormControl } from '../Form';
import Label from './Label';

describe('Label', () => {
  it('associates the label with the FormControl id via htmlFor', () => {
    render(
      <FormControl id="email">
        <Label>Email</Label>
      </FormControl>,
    );

    expect(screen.getByText('Email').closest('label')).toHaveAttribute(
      'for',
      'email',
    );
  });

  it('renders the required indicator when the field is required', () => {
    render(
      <FormControl id="email" isRequired>
        <Label requiredText="*">Email</Label>
      </FormControl>,
    );

    const indicator = screen.getByText('*');
    expect(indicator).toHaveClass('required');
  });

  it('renders the optional indicator when the field is optional', () => {
    render(
      <FormControl id="email" isOptional>
        <Label optionalText="optional">Email</Label>
      </FormControl>,
    );

    expect(screen.getByText('- optional')).toHaveClass('optional');
  });

  it('renders a left icon when provided', () => {
    render(
      <FormControl id="email">
        <Label leftIcon={<span>icon</span>}>Email</Label>
      </FormControl>,
    );

    expect(screen.getByText('icon')).toBeInTheDocument();
    expect(screen.getByText('Email').closest('label')).toHaveClass('has-icon');
  });
});
