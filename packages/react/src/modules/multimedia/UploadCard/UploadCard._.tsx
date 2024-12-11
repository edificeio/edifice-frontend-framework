import { Meta, StoryObj } from '@storybook/react';

import UploadCard from './UploadCard';

const meta: Meta<typeof UploadCard> = {
  title: 'Components/Card/Upload Card',
  component: UploadCard,
  args: {
    status: 'idle',
    isSelectable: false,
    isClickable: false,
    item: {
      name: "File's name",
      src: 'https://media.istockphoto.com/id/1322277517/fr/photo/herbe-sauvage-dans-les-montagnes-au-coucher-du-soleil.jpg?s=612x612&w=0&k=20&c=tQ19uZQLlIFy8J6QWMyOL6lPt3pdSHBSDFHoXr1K_g0=',
      info: { type: 'Extension File', weight: '200Mo' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof UploadCard>;

export const Base: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
};

export const IsLoading: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
  args: {
    status: 'loading',
  },
};

export const IsSuccess: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
  args: {
    status: 'success',
  },
};

export const IsError: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
  args: {
    status: 'error',
  },
};
