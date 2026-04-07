import type { Meta, StoryObj } from '@storybook/react';
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

const schools = [
  {
    id: 'school-1',
    name: 'Collège Jean Moulin',
    UAI: '0012345A',
    classes: [],
    exports: [],
  },
  {
    id: 'school-2',
    name: 'Lycée Jeanne Ferry de Loisette en Royan',
    UAI: '0098765Z',
    classes: [],
    exports: [],
  },
];

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
    onSelectedSchoolChange: (idx) =>
      alert(
        `School id=${schools[idx].id} UAI=${schools[idx].UAI} is selected.`,
      ),
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
