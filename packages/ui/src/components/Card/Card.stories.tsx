import { Meta, StoryObj } from '@storybook/react';

import Card from './Card';
import { useState } from 'react';

const meta: Meta<typeof Card> = {
  title: 'Components/Card/Base',
  component: Card,
  args: {
    isSelectable: true,
    isSelected: false,
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Base: Story = {
  render: (args) => {
    return (
      <Card>
        <Card.Body>
          <Card.Title>Title</Card.Title>
        </Card.Body>
      </Card>
    );
  },
};

export const IsSelectable: Story = {
  render: (args) => {
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
  render: (args) => {
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
