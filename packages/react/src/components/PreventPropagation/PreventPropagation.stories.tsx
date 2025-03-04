import { Meta, StoryObj } from '@storybook/react';
import PreventPropagation from './PreventPropagation';
import { Button } from '../Button';
import { Switch } from '../Switch';
import { Card } from '../Card';
import { Dropdown } from '../Dropdown';

const meta = {
  title: 'Utils/PreventPropagation',
  component: PreventPropagation,
  parameters: {
    docs: {
      description: {
        component:
          'PreventPropagation is a utility component that prevents click event propagation to parent elements.',
      },
    },
  },
} satisfies Meta<typeof PreventPropagation>;

export default meta;
type Story = StoryObj<typeof PreventPropagation>;

export const Base: Story = {
  render: () => {
    return (
      <div
        className="p-16 bg-light"
        onClick={() => console.log('Parent clicked!')}
      >
        <p className="mb-8">
          Click the button - event won't propagate to parent
        </p>
        <PreventPropagation>
          <Button onClick={() => console.log('Button clicked!')}>
            Click me
          </Button>
        </PreventPropagation>
      </div>
    );
  },
};

export const WithSwitch: Story = {
  render: () => {
    return (
      <div
        className="p-16 bg-light"
        onClick={() => console.log('Parent clicked!')}
      >
        <PreventPropagation>
          <Switch
            label="Toggle Switch"
            onChange={() => console.log('Switch toggled!')}
          />
        </PreventPropagation>
      </div>
    );
  },
};

export const WithCard: Story = {
  render: () => {
    return (
      <div
        className="p-16 bg-light"
        onClick={() => console.log('Parent clicked!')}
      >
        <PreventPropagation>
          <Card>
            <Card.Body>
              <h5>Card Title</h5>
              <p>Card content with prevented click propagation</p>
              <Button onClick={() => console.log('Card button clicked!')}>
                Card Button
              </Button>
            </Card.Body>
          </Card>
        </PreventPropagation>
      </div>
    );
  },
};

export const NestedExample: Story = {
  render: () => {
    return (
      <div
        className="p-16 bg-light"
        onClick={() => console.log('Outer parent clicked!')}
      >
        <div
          className="p-16 bg-white"
          onClick={() => console.log('Inner parent clicked!')}
        >
          <PreventPropagation>
            <Button onClick={() => console.log('Button clicked!')}>
              Click won't propagate
            </Button>
          </PreventPropagation>
        </div>
      </div>
    );
  },
};

export const WithinDropdown = {
  render: () => {
    return (
      <Dropdown>
        <Dropdown.Trigger>Options</Dropdown.Trigger>
        <Dropdown.Menu>
          <Dropdown.Item>
            <PreventPropagation>
              <Switch
                label="Display user's cursors"
                labelClassName="small"
                onChange={(e) =>
                  console.log('Switch changed:', e.target.checked)
                }
              />
            </PreventPropagation>
          </Dropdown.Item>
          <Dropdown.Separator />
          <Dropdown.Item>Another option</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Example of a Switch within a Dropdown.Item using PreventPropagation to handle click events correctly.',
      },
    },
  },
};
