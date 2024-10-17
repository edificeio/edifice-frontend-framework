import { Meta, StoryObj } from '@storybook/react';

import Widget from './Widget';

const meta: Meta<typeof Widget> = {
  title: 'Widgets/Widget Box',
  component: Widget,
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof Widget>;

export const Base: Story = {
  render: (args) => (
    <Widget>
      <Widget.Header>Header</Widget.Header>
      <Widget.Body>Content</Widget.Body>
      <Widget.Footer>Footer</Widget.Footer>
    </Widget>
  ),
};
