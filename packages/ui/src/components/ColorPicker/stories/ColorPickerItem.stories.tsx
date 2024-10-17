import { Meta, StoryObj } from '@storybook/react';

import { DefaultPalette } from '../ColorPalette';
import { useState } from 'react';
import ColorPickerItem, { ColorPickerItemProps } from '../ColorPickerItem';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof ColorPickerItem> = {
  title: 'Components/ColorPickerItem',
  component: ColorPickerItem,
  parameters: {
    docs: {
      description: {
        component: 'The ColorPickerItem is used to render a color',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ColorPickerItem>;

export const Base: Story = {
  parameters: {
    docs: {
      description: {
        component: 'Red is a beautiful color !',
      },
    },
  },
  args: {
    model: { value: 'red', description: 'Red as a keyword' },
  },
};

export const Reset: Story = {
  parameters: {
    docs: {
      description: {
        component: 'Transparent better be a reset color !',
      },
    },
  },
  args: {
    model: {
      value: 'transparent',
      description: 'Transparent',
      hue: 'light',
      isReset: true,
    },
  },
};

export const Dark: Story = {
  parameters: {
    docs: {
      description: {
        component: 'This color is dark, and selected.',
      },
    },
  },
  args: {
    model: { value: '#000', description: 'Black' },
    selected: true,
  },
};

export const Light: Story = {
  parameters: {
    docs: {
      description: {
        component: 'This color is light, and selected.',
      },
    },
  },
  args: {
    model: { value: '#fff', description: 'White', hue: 'light' },
    selected: true,
  },
};

export const ClassName: Story = {
  parameters: {
    docs: {
      description: {
        component: 'This color is rendered without a border.',
      },
    },
  },
  args: {
    model: {
      value: 'transparent',
      description: 'Transparent color',
      hue: 'light',
    },
    selected: true,
    className: 'border-0',
  },
};
