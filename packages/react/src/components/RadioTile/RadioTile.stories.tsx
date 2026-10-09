import { ChangeEvent, useState } from 'react';

import { Meta, StoryObj } from '@storybook/react-vite';

import { Flex } from '../Flex';
import RadioTile from './RadioTile';

const meta: Meta<typeof RadioTile> = {
  title: 'Forms/RadioTile',
  component: RadioTile,
  args: {
    label: 'Défaut',
    name: 'radio-tile',
    value: 'default',
    disabled: false,
    hideLabel: false,
    orientation: 'horizontal',
  },
  argTypes: {
    orientation: {
      control: 'inline-radio',
      options: ['horizontal', 'vertical'],
    },
    image: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'RadioTile is a radio input presented as a selectable tile, displaying a label, an image or both. Tiles sharing the same `name` form a radio group. Its style can be overridden per instance through `className` or `style` (e.g. to preview a font).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof RadioTile>;

const landscape = 'https://picsum.photos/id/1015/180/100';
const square = 'https://picsum.photos/id/1016/96/96';
const flag = 'https://flagcdn.com/w80/fr.png';

export const Base: Story = {};

export const States: Story = {
  render: () => (
    <Flex gap="16" wrap="wrap">
      <RadioTile name="states" value="default" label="Défaut" />
      <RadioTile name="states" value="checked" label="Défaut" defaultChecked />
      <RadioTile name="states" value="disabled" label="Défaut" disabled />
    </Flex>
  ),
};

export const Layouts: Story = {
  render: () => (
    <Flex direction="column" gap="16">
      <Flex gap="16" wrap="wrap">
        <RadioTile name="text" value="a" label="Défaut" defaultChecked />
        <RadioTile name="text" value="b" label="Défaut" />
        <RadioTile name="text" value="c" label="Défaut" disabled />
      </Flex>
      <Flex gap="16" wrap="wrap">
        <RadioTile
          name="horizontal"
          value="a"
          label="Matières"
          image={square}
          defaultChecked
        />
        <RadioTile
          name="horizontal"
          value="b"
          label="Matières"
          image={square}
        />
        <RadioTile
          name="horizontal"
          value="c"
          label="Matières"
          image={square}
          disabled
        />
      </Flex>
      <Flex gap="16" wrap="wrap">
        <RadioTile
          name="vertical"
          value="a"
          label="Français"
          image={flag}
          orientation="vertical"
          defaultChecked
        />
        <RadioTile
          name="vertical"
          value="b"
          label="Français"
          image={flag}
          orientation="vertical"
        />
        <RadioTile
          name="vertical"
          value="c"
          label="Français"
          image={flag}
          orientation="vertical"
          disabled
        />
      </Flex>
      <Flex gap="16" wrap="wrap">
        <RadioTile
          name="image"
          value="a"
          label="Paysage"
          image={landscape}
          hideLabel
          defaultChecked
        />
        <RadioTile
          name="image"
          value="b"
          label="Paysage"
          image={landscape}
          hideLabel
        />
        <RadioTile
          name="image"
          value="c"
          label="Paysage"
          image={landscape}
          hideLabel
          disabled
        />
      </Flex>
    </Flex>
  ),
};

export const ControlledGroup: Story = {
  render: () => {
    const [selectedValue, setSelectedValue] = useState('fr');

    const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
      setSelectedValue(event.target.value);

    const options = [
      { value: 'fr', label: 'Français', countryCode: 'fr' },
      { value: 'en', label: 'English', countryCode: 'gb' },
      { value: 'es', label: 'Español', countryCode: 'es' },
    ];

    return (
      <Flex direction="column" gap="16">
        <Flex gap="16">
          {options.map((option) => (
            <RadioTile
              key={option.value}
              name="language"
              value={option.value}
              label={option.label}
              image={`https://flagcdn.com/w80/${option.countryCode}.png`}
              orientation="vertical"
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
          ))}
        </Flex>
        <div>Option sélectionnée : {selectedValue}</div>
      </Flex>
    );
  },
};

export const CustomFont: Story = {
  render: () => (
    <Flex gap="16" wrap="wrap">
      {['Arimo', 'Comic Sans MS', 'Georgia', 'Courier New'].map((font) => (
        <RadioTile
          key={font}
          name="font"
          value={font}
          label={font}
          defaultChecked={font === 'Arimo'}
          style={{ fontFamily: font }}
        />
      ))}
    </Flex>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'The font family is inherited, so it can be changed per instance with `style` or a custom `className`.',
      },
    },
  },
};
