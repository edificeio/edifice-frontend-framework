import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import { IconPaperclip, IconUsers } from '../../modules/icons/components';
import AppIcon from '../AppIcon/AppIcon';
import Card, { CardProps } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  args: {
    isSelectable: true,
    isSelected: false,
  },
  parameters: {
    docs: {
      description: {
        component:
          'The Card component is a compound component that can be used to display content in a consistent way. It gives you `Card.Header`, `Card.Body`, `Card.Title`, `Card.Text`, `Card.Image`, `Card.User`, `Card.Footer` to create your own component. It can be made selectable or clickable. You can customize its appearance using className props and nest other components inside it.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Base: Story = {
  render: (args: CardProps) => {
    return (
      <Card {...args}>
        <Card.Body>
          <Card.Title>Title</Card.Title>
        </Card.Body>
      </Card>
    );
  },
};

export const IsSelectable: Story = {
  render: (args: CardProps) => {
    const [selected, setSelected] = useState(false);
    const handleOnClick = () => {
      setSelected((prev) => !prev);
    };
    const handleOnSelect = () => {
      setSelected((prev) => !prev);
    };
    return (
      <Card
        isSelectable={args.isSelectable}
        isSelected={selected || args.isSelected}
        onClick={handleOnClick}
        onSelect={handleOnSelect}
      >
        <Card.Header />
        <Card.Body>
          <Card.Title>Title</Card.Title>
        </Card.Body>
      </Card>
    );
  },
};

export const SelectedState: Story = {
  render: (args: CardProps) => {
    return (
      <Card isSelected={args.isSelected}>
        <Card.Header />
        <Card.Body>
          <Card.Title>Title</Card.Title>
        </Card.Body>
      </Card>
    );
  },
  args: {
    isSelected: true,
  },
};

export const ExampleFileCard: Story = {
  render: (args: CardProps) => {
    return (
      <div style={{ width: '16rem' }}>
        <Card
          className="card-file"
          isClickable={args.isClickable}
          isSelectable={args.isSelectable}
          isSelected={args.isSelected}
          onClick={() => console.log('click')}
        >
          <Card.Body space="8">
            <div
              className="file position-relative rounded bg-gray-300"
              style={{
                aspectRatio: '16/10',
              }}
            >
              <div className="position-absolute top-50 start-50 translate-middle bg-gray-300">
                {<IconPaperclip />}
              </div>
            </div>
            <div className="mt-4">
              <Card.Text>My document</Card.Text>
              <Card.Text className="text-black-50">Owner</Card.Text>
            </div>
          </Card.Body>
        </Card>
      </div>
    );
  },
  args: {
    isClickable: true,
    isSelectable: false,
    isSelected: false,
  },

  parameters: {
    docs: {
      description: {
        story: 'We built our FileCard component with the `Card` component.',
      },
    },
  },
};

export const ExampleLinkerCard: Story = {
  render: (args: CardProps) => {
    return (
      <Card
        className="card-linker shadow-none"
        isClickable={args.isClickable}
        isSelectable={args.isSelectable}
        isSelected={args.isSelected}
        onClick={() => console.log('click')}
      >
        <Card.Body space="8">
          <div className="card-image ps-8 pe-4">
            <AppIcon app="blog" iconFit="ratio" size="48" variant="rounded" />
          </div>

          <div className="w-75">
            <Card.Text>My link resource</Card.Text>
            <Card.Text className="text-black-50">Owner</Card.Text>
          </div>

          <div className="d-none d-md-block text-black-50 ps-4 pe-8">
            <Card.Text>2024-01-01</Card.Text>
          </div>

          <div className="ps-4 pe-8">
            <IconUsers width="20" height="20" />
          </div>
        </Card.Body>
      </Card>
    );
  },
  args: {
    isClickable: true,
    isSelectable: false,
    isSelected: false,
  },

  parameters: {
    docs: {
      description: {
        story: 'We built our LinkerCard component with the `Card` component.',
      },
    },
  },
};
