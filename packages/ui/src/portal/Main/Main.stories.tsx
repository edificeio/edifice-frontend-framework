import { Meta, StoryObj } from '@storybook/react';
import Main, { MainProps } from './Main';
import React from 'react';

const meta: Meta<typeof Main> = {
  title: 'Layout/Main',
  component: Main,
  args: {
    children: 'This this the main content of the application.',
  },
};

export default meta;

type Story = StoryObj<typeof Main>;

const Template = (args: MainProps) => <Main {...args}></Main>;

export const Base: Story = {
  render: Template,
};
