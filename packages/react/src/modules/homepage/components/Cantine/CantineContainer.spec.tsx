import type { School } from '@edifice.io/client';
import { useEffect, useState } from 'react';
import { render, screen } from '~/setup';
import { CantineContainer } from './CantineContainer';

const mockUseUserSchools = vi.fn();
vi.mock('../../hooks/useUserSchools', () => ({
  useUserSchools: (widgetName: string) => mockUseUserSchools(widgetName),
}));

vi.mock('./hooks/useCantine', () => ({
  useCantine: () => ({ sections: [], status: 'empty' }),
}));

function makeSchool(id: string, name: string): School {
  return { id, name, UAI: `UAI-${id}`, exports: [], classes: [] } as School;
}

const schools = [
  makeSchool('school-1', 'École Jacques Prévert'),
  makeSchool('school-2', 'École Victor Hugo'),
];

describe('CantineContainer', () => {
  const handleSelectedSchoolChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseUserSchools.mockReturnValue({
      schools,
      selectedSchool: schools[0],
      handleSelectedSchoolChange,
    });
  });

  it('keeps its own school preference, apart from the directory widget', () => {
    render(<CantineContainer />);

    expect(mockUseUserSchools).toHaveBeenCalledWith('cantine-widget');
  });

  it('does not save the school the select echoes back on mount', () => {
    render(<CantineContainer />);

    expect(screen.getByText('École Jacques Prévert')).toBeInTheDocument();
    expect(handleSelectedSchoolChange).not.toHaveBeenCalled();
  });

  it('saves the school picked in the widget', async () => {
    const { user } = render(<CantineContainer />);

    await user.click(screen.getByText('École Jacques Prévert'));
    await user.click(
      await screen.findByRole('menuitem', { name: 'École Victor Hugo' }),
    );

    expect(handleSelectedSchoolChange).toHaveBeenCalledWith(schools[1]);
  });

  it('does not save a stale echo when the saved school replaces the default one', () => {
    // Settles on the saved school in the same commit as the select's first
    // sync, like `useUserSchools` does when preferences are already cached.
    mockUseUserSchools.mockImplementation(function useSettlingSchools() {
      const [selectedSchool, setSelectedSchool] = useState(schools[0]);
      useEffect(() => setSelectedSchool(schools[1]), []);
      return { schools, selectedSchool, handleSelectedSchoolChange };
    });

    render(<CantineContainer />);

    expect(screen.getByText('École Victor Hugo')).toBeInTheDocument();
    expect(handleSelectedSchoolChange).not.toHaveBeenCalled();
  });
});
