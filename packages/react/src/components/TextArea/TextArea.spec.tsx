import { render, screen } from '~/setup';
import { FormControl } from '../Form';
import TextArea from './TextArea';

describe('TextArea', () => {
  it('renders a textarea wired to the FormControl id', () => {
    render(
      <FormControl id="bio">
        <TextArea size="md" placeholder="About you" />
      </FormControl>,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'bio');
    expect(textarea).toHaveAttribute('placeholder', 'About you');
  });

  it('calls onChange with the native event and updates its value', async () => {
    const handleChange = vi.fn();
    const { user } = render(
      <FormControl id="bio">
        <TextArea size="md" onChange={handleChange} />
      </FormControl>,
    );

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'hey');

    expect(handleChange).toHaveBeenCalledTimes(3);
    expect(textarea).toHaveValue('hey');
  });

  it('is disabled when the disabled prop is set', () => {
    render(
      <FormControl id="bio">
        <TextArea size="md" disabled />
      </FormControl>,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies the height and validation classes', () => {
    render(
      <FormControl id="bio" status="invalid">
        <TextArea size="md" height="lg" />
      </FormControl>,
    );

    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('textarea-height-lg');
    expect(textarea).toHaveClass('is-invalid');
  });

  it('shows a character counter when showCounter is set', () => {
    render(
      <FormControl id="bio">
        <TextArea size="md" showCounter maxLength={20} defaultValue="abc" />
      </FormControl>,
    );

    expect(screen.getByText('3 / 20')).toBeInTheDocument();
  });
});
