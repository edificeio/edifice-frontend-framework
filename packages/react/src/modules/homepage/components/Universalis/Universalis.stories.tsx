import { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { School } from '@edifice.io/client';
import Universalis, { UniversalisProps } from './Universalis';

const meta: Meta<typeof Universalis> = {
  title: 'Modules/Homepage/Universalis',
  component: Universalis,
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
        component: 'Universalis Éducation',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Universalis>;

const mockSchools: School[] = [
  {
    id: 'school-1',
    name: 'École Jacques Prévert',
    UAI: '0012345A',
    classes: [],
    exports: [],
  },
  {
    id: 'school-2',
    name: 'Collège Jean Moulin',
    UAI: '0098765Z',
    classes: [],
    exports: [],
  },
  {
    id: 'school-3',
    name: 'Collège Antoine de Saint-Exupéry',
    UAI: '0012345B',
    classes: [],
    exports: [],
  },
];

function openUniversalis() {
  window.open(
    'http://www.universalis-edu.com',
    '_blank',
    'noopener,noreferrer',
  );
}

const renderWithProps = (props: UniversalisProps) => () => (
  <div style={{ maxWidth: 397 }}>
    <Universalis {...props} />
  </div>
);

const RenderWithState = (props: UniversalisProps) => {
  const [selectedSchool, setSelectedSchool] = useState(props.selectedSchool);

  return (
    <div style={{ maxWidth: 397 }}>
      <Universalis
        {...props}
        selectedSchool={selectedSchool}
        onSelectedSchoolChange={setSelectedSchool}
      />
    </div>
  );
};

export const MonoEtab: Story = {
  render: renderWithProps({
    handleActionClick: openUniversalis,
    selectedSchool: mockSchools[0],
  }),
};

export const MultiEtab: Story = {
  render: () => (
    <RenderWithState
      handleActionClick={openUniversalis}
      schools={mockSchools}
      selectedSchool={mockSchools[0]}
    />
  ),
};
