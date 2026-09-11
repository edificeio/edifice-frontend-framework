import { School } from '@edifice.io/client';
import { render, screen } from '~/setup';
import Universalis from './Universalis';

const mockSchool1: School = {
  id: 'school-1',
  name: 'École Jacques Prévert',
  UAI: '0012345A',
  classes: [],
  exports: [],
};

const mockSchool2: School = {
  id: 'school-2',
  name: 'Collège Jean Moulin',
  UAI: '0098765Z',
  classes: [],
  exports: [],
};

describe('Universalis', () => {
  it('calls handleActionClick when the open button is clicked', async () => {
    const handleActionClick = vi.fn();
    const { user } = render(
      <Universalis handleActionClick={handleActionClick} />,
    );

    await user.click(screen.getByRole('button', { name: 'Ouvrir' }));

    expect(handleActionClick).toHaveBeenCalledTimes(1);
  });

  it('does not render a school selector when only one school is available', () => {
    render(
      <Universalis
        handleActionClick={vi.fn()}
        schools={[mockSchool1]}
        selectedSchool={mockSchool1}
      />,
    );

    expect(
      screen.queryByRole('button', { name: /Jacques Prévert/ }),
    ).not.toBeInTheDocument();
  });

  it('renders a school selector showing the selected school when several are available', () => {
    render(
      <Universalis
        handleActionClick={vi.fn()}
        schools={[mockSchool1, mockSchool2]}
        selectedSchool={mockSchool1}
      />,
    );

    expect(
      screen.getByRole('button', { name: /Jacques Prévert/ }),
    ).toBeInTheDocument();
  });

  it('sends the selected school UAI as a hidden field of the search form', () => {
    render(
      <Universalis handleActionClick={vi.fn()} selectedSchool={mockSchool1} />,
    );

    const form = screen.getByRole('textbox').closest('form');
    expect(form).toHaveAttribute(
      'action',
      'https://www.universalis-edu.com/nomade/precherche/',
    );
    expect(form?.querySelector('input[name="uai"]')).toHaveValue(
      mockSchool1.UAI,
    );
    expect(form?.querySelector('input[name="r"]')).toHaveValue('www');
  });

  it('disables the search field and button when the selected school has no UAI', () => {
    const schoolWithoutUai: School = { ...mockSchool1, UAI: '' };

    render(
      <Universalis
        handleActionClick={vi.fn()}
        selectedSchool={schoolWithoutUai}
      />,
    );

    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'UAI non renseigné' }),
    ).toBeDisabled();
  });

  it('enables the search field and button when the selected school has an UAI', () => {
    render(
      <Universalis handleActionClick={vi.fn()} selectedSchool={mockSchool1} />,
    );

    expect(screen.getByRole('textbox')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });
});
