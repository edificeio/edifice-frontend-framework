import { render, screen } from '~/setup';
import { UniversalisContainer } from './UniversalisContainer';

const mockUseUserSchools = vi.fn();
vi.mock('../../hooks/useUserSchools', () => ({
  useUserSchools: () => mockUseUserSchools(),
}));

const school = {
  id: 'school-1',
  name: 'École Jacques Prévert',
  UAI: '0012345A',
  classes: [],
  exports: [],
};

describe('UniversalisContainer', () => {
  beforeEach(() => {
    mockUseUserSchools.mockReturnValue({
      schools: [school],
      selectedSchool: school,
      handleSelectedSchoolChange: vi.fn(),
    });
  });

  it('opens the Universalis search with the UAI and query in a new tab', async () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const { user } = render(<UniversalisContainer />);

    await user.type(screen.getByRole('searchbox'), 'volcan{Enter}');

    expect(open).toHaveBeenCalledWith(
      'https://www.universalis-edu.com/nomade/precherche/?r=www&uai=0012345A&q=volcan',
      '_blank',
      'noopener,noreferrer',
    );
  });
});
