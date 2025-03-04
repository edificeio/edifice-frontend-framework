import type { Meta, StoryObj } from '@storybook/react';
import StackedGroup from './StackedGroup';

import { AvatarGroup } from '../AvatarGroup';
import { Dropdown } from '../Dropdown';
import { Card } from '../Card';
import { Avatar } from '../Avatar';
import { Switch } from '../Switch';
import { PreventPropagation } from '../PreventPropagation';

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
  decorators: [
    (Story) => (
      <div style={{ height: '350px' }}>
        <Story />
      </div>
    ),
  ],
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
      <Dropdown key="dropdown" placement="bottom-end">
        <Dropdown.Trigger
          pill={true}
          baseShade={true}
          variant="primary"
          className="bold"
          innerBorderColor="primary"
          innerBorderWidth={2}
          outerBorderColor="white"
          outerBorderWidth={2}
          size="sm"
          label={<b>12 users online</b>}
        ></Dropdown.Trigger>
        <Dropdown.Menu unselectable="on">
          <Dropdown.Item>
            <Card.Body space="8" padding="0">
              <PreventPropagation>
                <Switch
                  label="Display user's cursors"
                  labelClassName="small"
                ></Switch>
              </PreventPropagation>
            </Card.Body>
          </Dropdown.Item>
          <Dropdown.Separator />
          {['Isabelle Polonio', 'Justin Roland', 'Thomas Zata'].map(
            (name, index) => (
              <Dropdown.Item minWidth={340} key={index}>
                <Card.Body space="8" padding="0">
                  <div className="card-image ps-8 pe-4">
                    <Avatar
                      variant="circle"
                      key="avatars"
                      alt={name}
                      src={'https://i.pravatar.cc/300?img=' + (index + 1)}
                      size="sm"
                    />
                  </div>
                  <div className="w-75">
                    <Card.Text>{index == 0 ? <b>Me</b> : name}</Card.Text>
                    <Card.Text className="text-black-50">
                      <i>Manager</i>
                    </Card.Text>
                  </div>
                </Card.Body>
              </Dropdown.Item>
            ),
          )}
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
