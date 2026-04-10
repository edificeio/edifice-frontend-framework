import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: {
    docs: {
      description: {
        component:
          'Navigation component for paginated results. Automatically handles ellipsis for large page counts.',
      },
    },
  },
  argTypes: {
    current: { control: { type: 'number', min: 1 } },
    total: { control: { type: 'number', min: 1 } },
    pageSize: { control: { type: 'number', min: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    current: 1,
    total: 100,
    pageSize: 10,
  },
  render: (args) => {
    const [page, setPage] = useState(args.current);
    return <Pagination {...args} current={page} onChange={setPage} />;
  },
};

export const MiddlePage: Story = {
  args: {
    current: 5,
    total: 200,
    pageSize: 10,
  },
  render: (args) => {
    const [page, setPage] = useState(args.current);
    return <Pagination {...args} current={page} onChange={setPage} />;
  },
};

export const LastPage: Story = {
  args: {
    current: 20,
    total: 200,
    pageSize: 10,
  },
  render: (args) => {
    const [page, setPage] = useState(args.current);
    return <Pagination {...args} current={page} onChange={setPage} />;
  },
};

export const FewPages: Story = {
  args: {
    current: 1,
    total: 35,
    pageSize: 10,
  },
  render: (args) => {
    const [page, setPage] = useState(args.current);
    return <Pagination {...args} current={page} onChange={setPage} />;
  },
};
