import { School } from '@edifice.io/client';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { mockSchools as schools } from '../../../../../../config/src/msw/data/schoolSpace';
import SchoolSpace, { SchoolSpaceProps } from './SchoolSpace';

const meta: Meta<typeof SchoolSpace> = {
  title: 'Modules/Homepage/SchoolSpace',
  component: SchoolSpace,
  decorators: [
    (Story) => (
      <div style={{ height: '35em' }}>
        <div id="portal" />
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Ce storybook documente le composant SchoolSpace, un widget de sélection d'école avec plusieurs variantes possibles.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SchoolSpace>;

const renderWithProps = (props: SchoolSpaceProps) => () => (
  <div style={{ maxWidth: 397 }}>
    <SchoolSpace {...props} />
  </div>
);

export const MultipleSchools: Story = {
  render: renderWithProps({
    schools,
    selectedSchool: {
      id: 'school-2',
      name: 'Lycée Jeanne Ferry de Loisette en Royan',
      UAI: '0098765Z',
      classes: [],
      exports: [],
    },
    onSelectedSchoolChange: (school: School) =>
      alert(`School id=${school.id} UAI=${school.UAI} is selected.`),
  }),
  parameters: {
    docs: {
      description: {
        story: `
Affiche une liste de plusieurs écoles avec sélection active.
<ul>
<li>2 écoles disponibles (Collège Jean Moulin, Lycée Jeanne Ferry de Loisette en Royan)</li>
<li>École sélectionnée : Lycée Jeanne Ferry</li>
<li>Callback au changement de sélection</li>
</ul>`,
      },
    },
  },
};

export const SingleSchool: Story = {
  render: renderWithProps({
    schools: [schools[0]],
    selectedSchool: schools[0],
  }),
  parameters: {
    docs: {
      description: {
        story: `Affiche une seule école`,
      },
    },
  },
};

export const Empty: Story = {
  render: renderWithProps({ selectedSchool: undefined }),
  parameters: {
    docs: {
      description: {
        story: `État vide (aucune école)`,
      },
    },
  },
};

export const Loading: Story = {
  render: renderWithProps({ selectedSchool: undefined, isLoading: true }),
  parameters: {
    docs: {
      description: {
        story: `État de chargement : le nom de l'école et le bouton annuaire sont remplacés par des skeletons`,
      },
    },
  },
};

const longNameSchool: School = {
  ...schools[0],
  name: 'Lycée polyvalent régional Jeanne Ferry de Loisette en Royan',
};

export const SkeletonAboveTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay-stack" style={{ maxWidth: 397 }}>
      <SchoolSpace selectedSchool={undefined} isLoading />
      <SchoolSpace schools={[longNameSchool]} selectedSchool={longNameSchool} />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state stacked on top of the loaded card. Any difference in height between the two is the layout shift the user would see when the school arrives.',
      },
    },
  },
};

export const SkeletonSuperimposedOnTheLoadedList: Story = {
  render: () => (
    <div className="skeleton-overlay" style={{ maxWidth: 397 }}>
      <SchoolSpace schools={[longNameSchool]} selectedSchool={longNameSchool} />
      <div className="skeleton-overlay-top">
        <SchoolSpace selectedSchool={undefined} isLoading />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The loading state superimposed on the loaded card, at partial opacity. The skeleton reserves two lines for the school name: this mock name wraps onto two lines at 397px, a shorter one makes the card shrink by one line box.',
      },
    },
  },
};
