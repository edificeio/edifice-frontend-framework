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

const longNameSchools: School[] = [
  {
    id: 'school-long-1',
    name: 'Lycée polyvalent régional des métiers de l’hôtellerie, de la restauration et du tourisme Jean-Baptiste de La Salle',
    UAI: '0011111A',
    classes: [],
    exports: [],
  },
  {
    id: 'school-long-2',
    name: 'Collège d’enseignement général et professionnel adapté Marie-Madeleine Fourcade de Saint-Germain-en-Laye',
    UAI: '0022222B',
    classes: [],
    exports: [],
  },
  {
    id: 'school-long-3',
    name: 'École élémentaire publique d’application Jacques Prévert',
    UAI: '0033333C',
    classes: [],
    exports: [],
  },
  ...schools,
];

export const LongSchoolNames: Story = {
  render: renderWithProps({
    schools: longNameSchools,
    selectedSchool: longNameSchools[0],
    onSelectedSchoolChange: (school: School) =>
      alert(`School id=${school.id} UAI=${school.UAI} is selected.`),
  }),
  parameters: {
    docs: {
      description: {
        story: `
Établissements aux noms très longs : le nom sélectionné passe à la ligne, la liste reste dans le viewport (y compris sur mobile ou dans une colonne étroite à gauche de l'écran).
Un clic sur le nom ou sur le chevron ouvre la liste.`,
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
