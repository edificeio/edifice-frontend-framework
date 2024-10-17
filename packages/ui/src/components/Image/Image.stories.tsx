import { Meta, StoryObj } from '@storybook/react';

import Image, { ImageProps } from './Image';
import React from 'react';

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
const meta: Meta<typeof Image> = {
  title: 'Components/Image',
  component: Image,
  parameters: {
    docs: {
      description: {
        component: 'Image Component',
      },
    },
  },
  args: {
    src: 'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
    alt: 'beautiful landscape',
  },
};

export default meta;
type Story = StoryObj<typeof Image>;

export const Base: Story = {};

export const Ratio: Story = {
  render: (args: ImageProps) => {
    return (
      <div className="d-flex align-items-center">
        <div style={{ width: '60%' }}>
          <Image {...args} ratio="1" />
        </div>
        <div style={{ width: '60%' }}>
          <Image {...args} ratio="4" />
        </div>
        <div style={{ width: '60%' }}>
          <Image {...args} ratio="16" />
        </div>
        <div style={{ width: '60%' }}>
          <Image {...args} ratio="21" />
        </div>
      </div>
    );
  },
};
