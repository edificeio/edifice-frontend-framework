import { Meta, StoryObj } from '@storybook/react-vite';

import UploadCard from './UploadCard';

/**
 * Inlined rather than hotlinked: these stories feed the visual regression
 * suite, and a remote image would make the snapshots depend on the network.
 */
const PREVIEW =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="120"><rect width="160" height="120" fill="%23f4a259"/><circle cx="120" cy="34" r="18" fill="%23fff8e7"/></svg>';

const meta: Meta<typeof UploadCard> = {
  title: 'Components/Card/Upload Card',
  component: UploadCard,
  args: {
    status: 'idle',
    isSelectable: false,
    isClickable: false,
    item: {
      name: "File's name",
      src: PREVIEW,
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
  parameters: {
    docs: {
      description: {
        story:
          'The idle state is the only one without an action bar. It shows the common placeholder, not the file preview.',
      },
    },
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
  parameters: {
    docs: {
      description: {
        story:
          'Success is the only state showing the uploaded file itself, along with its type and weight.',
      },
    },
  },
};

export const IsWarning: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
  args: {
    status: 'warning',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Warning carries no message of its own: it looks like the idle state, plus the action bar.',
      },
    },
  },
};

export const IsError: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
  args: {
    status: 'error',
  },
  parameters: {
    docs: {
      description: {
        story:
          'The error thumbnail is currently broken: its src concatenates the imported placeholder URL with a second path.',
      },
    },
  },
};

export const EditableImage: Story = {
  render: (args) => {
    return <UploadCard {...args} />;
  },
  args: {
    status: 'success',
    item: {
      name: 'sunset.png',
      src: PREVIEW,
      info: { type: 'image/png', weight: '2Mo' },
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'An uploaded image also offers an edit action, which opens the image editor. Only file types starting with "image" get it.',
      },
    },
  },
};
