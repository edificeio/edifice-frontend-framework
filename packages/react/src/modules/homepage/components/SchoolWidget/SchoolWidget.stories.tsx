import type { Meta, StoryObj } from '@storybook/react';
import SchoolWidget, { SchoolWidgetProps } from './SchoolWidget';

const meta: Meta<typeof SchoolWidget> = {
  title: 'Modules/Homepage/SchoolWidget',
  component: SchoolWidget,
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
        component: 'Description 1',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SchoolWidget>;

const renderWithProps = (props: SchoolWidgetProps) => () => (
  <div style={{ maxWidth: 420 }}>
    <SchoolWidget {...props} />
  </div>
);

export const MultipleSchools: Story = {
  render: renderWithProps({
    schools: [
      {
        id: 'school-1',
        name: 'Collège Jean Moulin',
        UAI: '0012345A',
        classes: [],
        exports: [],
      },
      {
        id: 'school-2',
        name: 'Lycée Louise Michel',
        UAI: '0098765Z',
        classes: [],
        exports: [],
      },
    ],
    selectedSchool: {
      id: 'school-2',
      name: 'Lycée Louise Michel',
      UAI: '0098765Z',
      classes: [],
      exports: [],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Description for many schools',
      },
    },
  },
};

export const SingleSchool: Story = {
  render: renderWithProps({
    schools: [
      {
        id: 'school-1',
        name: 'Collège Jean Moulin',
        UAI: '0012345A',
        classes: [],
        exports: [],
      },
    ],
    selectedSchool: {
      id: 'school-1',
      name: 'Collège Jean Moulin',
      UAI: '0012345A',
      classes: [],
      exports: [],
    },
  }),
  parameters: {
    docs: {
      description: {
        story: 'Description for 1 school',
      },
    },
  },
};

export const Empty: Story = {
  render: renderWithProps({ selectedSchool: undefined }),
  parameters: {
    docs: {
      description: {
        story: 'Description for no school',
      },
    },
  },
};
