import { Meta, StoryObj } from '@storybook/react-vite';

import LinkerCard, { ILinkedResourceWithDate } from './LinkerCard';

/** Inlined so the story never depends on the network. */
const THUMBNAIL =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="%235b8def"/></svg>';

/**
 * Each story builds its own resource: `meta.args` is shared between stories, so
 * assigning to `args.doc` from a render function leaks into all the others.
 */
const resource = (
  partial: Partial<ILinkedResourceWithDate> = {},
): ILinkedResourceWithDate => ({
  id: '1',
  assetId: '1',
  name: 'resource title here',
  application: '',
  creatorId: 'john',
  creatorName: 'John Doe',
  modifiedAt: '2000-01-01T01:00:00.000Z',
  // Pinned, otherwise the card shows a relative date that drifts every day.
  fromDate: '2 days ago',
  thumbnail: null as unknown as string,
  description: null as unknown as string,
  createdAt: null as unknown as string,
  modifierId: null as unknown as string,
  modifierName: null as unknown as string,
  rights: [] as string[],
  trashed: false,
  updatedAt: null as unknown as string,
  path: '',
  ...partial,
});

const meta: Meta<typeof LinkerCard> = {
  title: 'Components/Card/Linker Card',
  component: LinkerCard,
  args: {
    isSelectable: false,
    isClickable: true,
    isSelected: false,
    doc: resource(),
  },
  decorators: [(Story) => <div style={{ width: '24rem' }}>{Story()}</div>],
};

export default meta;
type Story = StoryObj<typeof LinkerCard>;

export const Base: Story = {
  render: (args) => {
    return <LinkerCard {...args} />;
  },
  parameters: {
    docs: {
      description: {
        story:
          'Without a thumbnail, the card falls back to the icon of the application owning the resource.',
      },
    },
  },
};

export const TimelineGenerator: Story = {
  render: (args) => {
    return <LinkerCard {...args} />;
  },
  args: {
    doc: resource({ application: 'timelinegenerator' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A timelinegenerator card',
      },
    },
  },
};

export const Blog: Story = {
  render: (args) => {
    return <LinkerCard {...args} />;
  },
  args: {
    doc: resource({ application: 'blog' }),
  },
  parameters: {
    docs: {
      description: {
        story: 'A blog card',
      },
    },
  },
};

export const WithThumbnail: Story = {
  render: (args) => {
    return <LinkerCard {...args} />;
  },
  args: {
    doc: resource({ application: 'blog', thumbnail: THUMBNAIL }),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A resource carrying a thumbnail: the image replaces the application icon.',
      },
    },
  },
};

export const Selected: Story = {
  render: (args) => {
    return <LinkerCard {...args} />;
  },
  args: {
    isSelectable: true,
    isSelected: true,
    doc: resource({ application: 'blog' }),
  },
};
