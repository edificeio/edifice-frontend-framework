import type { Meta, StoryObj } from '@storybook/react';
import StackedGroup from './StackedGroup';

import { AvatarGroup } from '../AvatarGroup';
import { Dropdown } from '../Dropdown';

const meta = {
  title: 'Components/StackedGroup',
  component: StackedGroup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof StackedGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

const CircleWithNumber = ({ number }: { number: number }) => (
  <div
    style={{
      width: '40px',
      height: '40px',
      backgroundColor: 'white',
      border: '2px solid #333',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
    }}
  >
    {number}
  </div>
);

export const Default: Story = {
  args: {
    children: [
      <CircleWithNumber key="1" number={1} />,
      <CircleWithNumber key="2" number={2} />,
      <CircleWithNumber key="3" number={3} />,
      <CircleWithNumber key="4" number={4} />,
    ],
    overlap: 15,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of usage with circles',
      },
    },
  },
};

export const RightFirstStacking: Story = {
  args: {
    children: [
      <CircleWithNumber key="1" number={1} />,
      <CircleWithNumber key="2" number={2} />,
      <CircleWithNumber key="3" number={3} />,
      <CircleWithNumber key="4" number={4} />,
    ],
    overlap: 20,
    stackingOrder: 'rightFirst',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of usage with a right first stacking order',
      },
    },
  },
};

export const LargeOverlap: Story = {
  args: {
    children: [
      <CircleWithNumber key="1" number={1} />,
      <CircleWithNumber key="2" number={2} />,
      <CircleWithNumber key="3" number={3} />,
      <CircleWithNumber key="4" number={4} />,
    ],
    overlap: 30,
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of usage with a large overlap',
      },
    },
  },
};

export const WithAvatarAndDropdown: Story = {
  args: {
    children: [
      <AvatarGroup
        key="avatars"
        maxAvatars={3}
        src={[
          'https://i.pravatar.cc/300?img=1',
          'https://i.pravatar.cc/300?img=2',
          'https://i.pravatar.cc/300?img=3',
        ]}
        alt="3 Users"
        size="sm"
        overlap={8}
        innerBorderColor="primary"
        innerBorderWidth={2}
        outerBorderColor="white"
        outerBorderWidth={2}
      />,
      <Dropdown key="dropdown">
        <Dropdown.Trigger
          pill={true}
          baseShade={true}
          variant="primary"
          innerBorderColor="primary"
          innerBorderWidth={2}
          outerBorderColor="white"
          outerBorderWidth={2}
          size="sm"
          label="12 users"
        ></Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>User 1</Dropdown.Item>
          <Dropdown.Item>User 2</Dropdown.Item>
          <Dropdown.Item>User 3</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>,
    ],
    overlap: 8,
    stackingOrder: 'leftFirst',
  },
  parameters: {
    docs: {
      description: {
        story: 'Example of usage combining an AvatarGroup with a Dropdown',
      },
    },
  },
};
