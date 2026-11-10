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

    await user.click(screen.getByTestId('universalis-button-open'));

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

  it('calls onSearch with the trimmed query when the button is clicked', async () => {
    const onSearch = vi.fn();
    const { user } = render(
      <Universalis
        handleActionClick={vi.fn()}
        onSearch={onSearch}
        selectedSchool={mockSchool1}
      />,
    );

    await user.type(screen.getByRole('searchbox'), '  volcan ');
    await user.click(screen.getByRole('button', { name: 'Search' }));

    expect(onSearch).toHaveBeenCalledWith('volcan');
  });

  it('calls onSearch when pressing Enter, but not for an empty query', async () => {
    const onSearch = vi.fn();
    const { user } = render(
      <Universalis
        handleActionClick={vi.fn()}
        onSearch={onSearch}
        selectedSchool={mockSchool1}
      />,
    );

    await user.type(screen.getByRole('searchbox'), '   {Enter}');
    expect(onSearch).not.toHaveBeenCalled();

    await user.type(screen.getByRole('searchbox'), 'volcan{Enter}');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('disables the search field and button when the selected school has no UAI', () => {
    const schoolWithoutUai: School = { ...mockSchool1, UAI: '' };

    render(
      <Universalis
        handleActionClick={vi.fn()}
        selectedSchool={schoolWithoutUai}
      />,
    );

    expect(screen.getByRole('searchbox')).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeDisabled();
  });

  it('enables the search field and button when the selected school has an UAI', () => {
    render(
      <Universalis handleActionClick={vi.fn()} selectedSchool={mockSchool1} />,
    );

    expect(screen.getByRole('searchbox')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Search' })).toBeEnabled();
  });
});
