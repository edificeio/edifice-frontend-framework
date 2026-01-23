import { ShareRightActionDisplayName } from '@edifice.io/client';
import { Meta, StoryObj } from '@storybook/react';
import { useRef } from 'react';
import ShareResources, {
  ShareOptions,
  ShareResourcesRef,
} from './ShareResources';

// Mock data for props
const mockShareOptions: ShareOptions = {
  resourceId: 'resource-1',
  resourceRights: [],
  resourceCreatorId: 'user-1',
};

const meta: Meta<typeof ShareResources> = {
  title: 'Modules/ShareResources',
  component: ShareResources,
  globals: {
    app: 'actualites',
  },
  args: {
    shareOptions: mockShareOptions,
    onSuccess: () => alert('Shared!'),
    onChange: (rights, isDirty) => {
      console.log('Rights changed:', rights, 'Is dirty:', isDirty);
    },
    onSubmit: () => {
      console.log('Is submitting');
    },
  },
};

export default meta;

type Story = StoryObj<typeof ShareResources>;

export const Default: Story = {
  render: (args) => {
    const ref = useRef<ShareResourcesRef>(null);
    return <ShareResources {...args} ref={ref} />;
  },
};

export const OverrideUrlsAndCreatorName: Story = {
  args: {
    shareOptions: {
      ...mockShareOptions,
      resourceCreatorDisplayName: 'User 1',
      shareUrls: {
        getResourceRights: '/actualites/api/v1/infos/resource-1/shares',
        saveResourceRights: '/actualites/api/v1/infos/resource-1/shares',
        getShareMapping: '/actualites/api/v1/rights/sharing',
      },
      filteredActions: ['read', 'comment'] as ShareRightActionDisplayName[],
    },
  },
  render: (args) => {
    const ref = useRef<ShareResourcesRef>(null);
    return <ShareResources {...args} ref={ref} />;
  },
};

export const FilterActions: Story = {
  args: {
    shareOptions: {
      ...mockShareOptions,
      filteredActions: ['read', 'comment'] as ShareRightActionDisplayName[],
    },
  },
  render: (args) => {
    const ref = useRef<ShareResourcesRef>(null);
    return <ShareResources {...args} ref={ref} />;
  },
};

export const DefaultActions: Story = {
  args: {
    shareOptions: {
      ...mockShareOptions,
      defaultActions: [
        {
          id: 'read',
          displayName: 'read',
        },
      ],
    },
  },
  render: (args) => {
    const ref = useRef<ShareResourcesRef>(null);
    return <ShareResources {...args} ref={ref} />;
  },
};
